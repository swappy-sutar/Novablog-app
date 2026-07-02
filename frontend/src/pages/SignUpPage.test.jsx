import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import toast from 'react-hot-toast';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock AuthBackground
vi.mock('../components/auth/AuthBackground', () => ({
  default: () => <div data-testid="auth-bg" />,
}));

// Mock the API module
const mockRegister = vi.fn();
vi.mock('../lib/api', () => ({
  authAPI: {
    register: (...args) => mockRegister(...args),
  },
  getErrorMessage: (error, fallback) => {
    const msg = error?.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    return msg || error?.message || fallback || 'Something went wrong';
  },
}));

import SignUpPage from './SignUpPage';

const renderSignUp = () => {
  return render(
    <MemoryRouter>
      <SignUpPage />
    </MemoryRouter>,
  );
};

describe('SignUpPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render all form fields', () => {
    renderSignUp();

    expect(screen.getByPlaceholderText('Alex')).toBeInTheDocument();         // firstname
    expect(screen.getByPlaceholderText('Rivera')).toBeInTheDocument();       // lastname
    expect(screen.getByPlaceholderText('arivera_dev')).toBeInTheDocument(); // username
    expect(screen.getByPlaceholderText('alex@nova.dev')).toBeInTheDocument(); // email
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();     // password
  });

  it('should render terms checkbox', () => {
    renderSignUp();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('should render "Create Account" button', () => {
    renderSignUp();

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should show error toast when terms not agreed', () => {
    renderSignUp();

    // Fill required fields but don't check terms
    fireEvent.change(screen.getByPlaceholderText('Alex'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('arivera_dev'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByPlaceholderText('alex@nova.dev'), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(toast.error).toHaveBeenCalledWith('Please agree to the Terms of Service.');
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('should submit form with correct payload and navigate to /signin', async () => {
    mockRegister.mockResolvedValue({ success: true });

    renderSignUp();

    fireEvent.change(screen.getByPlaceholderText('Alex'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Rivera'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('arivera_dev'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByPlaceholderText('alex@nova.dev'), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: 'john@test.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });

  it('should show error toast on registration failure', async () => {
    mockRegister.mockRejectedValue({
      response: { data: { message: 'Email already exists' } },
    });

    renderSignUp();

    fireEvent.change(screen.getByPlaceholderText('Alex'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('arivera_dev'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByPlaceholderText('alex@nova.dev'), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('should link to sign-in page', () => {
    renderSignUp();

    const link = screen.getByText(/log in/i);
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/signin');
  });
});
