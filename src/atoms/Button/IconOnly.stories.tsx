import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

const meta = {
  title: 'Broken/Icon Button',
  component: Button,
  parameters: {
    a11y: {
      // always a comment, because that's why
      test: 'todo',
    }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const SearchIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5 14 14" />
  </svg>
);

// Deliberate error: the icon has no accessible name.
export const IconOnly: Story = {
  args: { children: SearchIcon },
};
