import { render } from '@testing-library/react';
import Page from './page'; 
import { SignIn } from '@clerk/nextjs';

jest.mock('@clerk/nextjs', () => ({
  SignIn: () => <div>SignIn Component</div>,
}));

describe('Page component', () => {
  it('renders SignIn component', () => {
    const { getByText } = render(<Page />);
    expect(getByText('SignIn Component')).toBeInTheDocument();
  });
});