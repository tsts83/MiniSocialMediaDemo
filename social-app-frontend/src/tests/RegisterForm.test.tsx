import '@testing-library/jest-dom';
import { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterForm from '../components/auth/RegisterForm';  // Update the path as necessary

test('renders register form correctly', () => {
  // Mock onSubmit function and loading state
  const mockOnSubmit = jest.fn();
  
  render(
      <RegisterForm onSubmit={mockOnSubmit} loading={false} />
  );

  // Check if all form elements are rendered correctly
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
});

test('calls onSubmit with correct data', async () => {
  const mockOnSubmit = jest.fn();
  render(
      <RegisterForm onSubmit={mockOnSubmit} loading={false} />
  );

  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'testuser@example.com' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });

  const registerButton = screen.getByRole('button', { name: /register/i });

  // Wrap the click event and assertions in act() to handle async state updates correctly
  await act(async () => {
    fireEvent.click(registerButton);
  });

  expect(mockOnSubmit).toHaveBeenCalledWith({
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
  });
  expect(mockOnSubmit).toHaveBeenCalledTimes(1);
});
