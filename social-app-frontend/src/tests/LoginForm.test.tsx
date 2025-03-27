// src/tests/LoginForm.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import LoginForm from '../components/auth/LoginForm';  // Update the path as necessary

test('renders login form correctly', () => {
  render(<LoginForm onSubmit={jest.fn()} />);

  // Ensure the form elements are rendered correctly using their placeholder text
  const emailInput = screen.getByPlaceholderText(/email/i);  // Placeholder text for the email input
  expect(emailInput).toBeInTheDocument();

  const passwordInput = screen.getByPlaceholderText(/password/i);  // Placeholder text for password input
  expect(passwordInput).toBeInTheDocument();

  const loginButton = screen.getByRole('button', { name: /login/i });  // Button role with "login" accessible name
  expect(loginButton).toBeInTheDocument();
});

test('calls onSubmit with correct data', async () => {
  const handleSubmit = jest.fn();
  render(<LoginForm onSubmit={handleSubmit} />);

  // Input values simulation
  const emailInput = screen.getByPlaceholderText(/email/i);
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

  const passwordInput = screen.getByPlaceholderText(/password/i);
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  const loginButton = screen.getByRole('button', { name: /login/i });

  // Wrap the click event and assertions in act() to handle the async state updates correctly
  await act(async () => {
    fireEvent.click(loginButton);
  });

  // Wait for the asynchronous action to complete
  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
