import { createServer } from 'node:http';
import { readFileSync, existsSync, createReadStream } from 'node:fs';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

const BUDGET = Number(process.env.A11Y_BUDGET ?? 1);

const ROOT = 'storybook-static';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2',
  '.ico': 'image/x-icon', '.map': 'application/json' };

if (!existsSync(join(ROOT, 'index.json'))) {
  console.error(`No ${ROOT}/index.json — run "npm run build-storybook" first.`);
  process.exit(1);
}

const server = createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  const file = join(ROOT, p === '/' ? '/index.html' : p);
  if (!file.startsWith(ROOT) || !existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const ids = Object.values(JSON.parse(readFileSync(join(ROOT, 'index.json'), 'utf8')).entries)
  .filter((e) => e.type === 'story')
  .map((e) => e.id);

const browser = await chromium.launch();
const page = await browser.newPage();

// One page load is enough: the story store resolves parameters for any story id.
await page.goto(`${base}/iframe.html?id=${ids[0]}&viewMode=story`, { waitUntil: 'networkidle' });
const todos = await page.evaluate(async (storyIds) => {
  const preview = window.__STORYBOOK_PREVIEW__;
  await preview.storeInitializationPromise;
  const out = [];
  for (const id of storyIds) {
    const story = await preview.storyStore.loadStory({ storyId: id });
    if (story?.parameters?.a11y?.test === 'todo') out.push(id);
  }
  return out;
}, ids);

// Check whether each todo is still suppressing something, or is now stale.
const axeSource = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const status = [];
for (const id of todos) {
  await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#storybook-root > *').catch(() => {});
  await page.evaluate(axeSource);
  const { violations } = await page.evaluate(() =>
    window.axe.run('#storybook-root', {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    }),
  );
  status.push({ id, rules: violations.map((v) => v.id) });
}

await browser.close();
server.close();

for (const { id, rules } of status) {
  console.log(rules.length ? `  todo  ${id}  (${rules.join(', ')})` : `  STALE ${id}  (no violations — remove the todo)`);
}
console.log(`\n${todos.length} a11y todo(s) across ${ids.length} stories — budget ${BUDGET}`);

if (todos.length > BUDGET) {
  console.error(`\nOver budget by ${todos.length - BUDGET}. Fix a violation or raise A11Y_BUDGET deliberately.`);
  process.exit(1);
}
console.log('Within budget.');
