import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from './Label';

const meta = {
  title: 'Broken/Label',
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Beta' },
  parameters: { a11y: { test: 'todo' } },
};
