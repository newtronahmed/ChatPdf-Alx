import { render } from '@testing-library/react';
import Page from './page'; // replace with the actual path to your component
import { SignUp } from '@clerk/nextjs';

jest.mock('@clerk/nextjs', () => ({
  SignUp: () => <div>SignUp Component</div>,
}));

describe('Page component', () => {
  it('renders SignUp component', () => {
    const { getByText } = render(<Page />);
    expect(getByText('SignUp Component'));
  });
});