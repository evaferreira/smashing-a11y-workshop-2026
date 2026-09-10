import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import type { Preview, ReactRenderer } from '@storybook/react-vite';
import styled, { ThemeProvider } from 'styled-components';

import { GlobalStyle, darkTheme, lightTheme } from '../src/tokens';

/**
 * Docs pages paint their own always-light container, so stories need to carry
 * their themed background with them or dark-theme text lands on white.
 */
const Surface = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.fontFamily};
`;

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'error',
    },
    // The theme toolbar owns the canvas background.
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <Surface>
        <Story />
      </Surface>
    ),
    withThemeFromJSXProvider<ReactRenderer>({
      themes: { light: lightTheme, dark: darkTheme },
      defaultTheme: 'light',
      Provider: ThemeProvider,
      GlobalStyles: GlobalStyle,
    }),
  ],
};

export default preview;
