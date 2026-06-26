import { render, screen } from '@testing-library/react';
import { App } from './App';

it('renders avalon admin shell', () => {
  render(<App />);
  expect(screen.getByText('Avalon Admin')).toBeInTheDocument();
});
