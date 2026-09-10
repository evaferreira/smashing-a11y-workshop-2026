import type { ReactNode } from 'react';
import styled from 'styled-components';

export interface LabelProps {
  children: ReactNode;
}

const StyledLabel = styled.span`
  display: inline-block;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  background: ${({ theme }) => theme.colors.primary};
  /* Deliberate error: primaryText is the key meant for text on a primary background. */
  color: ${({ theme }) => theme.colors.primaryText};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export function Label({ children }: LabelProps) {
  return <StyledLabel>{children}</StyledLabel>;
}
