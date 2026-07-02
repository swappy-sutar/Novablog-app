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
const mockLogin = vi.fn();
const mockVerify2FA = vi.fn();
vi.mock('../lib/api', () => ({
  authAPI: {
    login: (...args) => mockLogin(...args),
    verify2FALogin: (...args) => mockVerify2FA(...args),
  },
  getErrorMessage: (error, fallback) => {
    const msg = error?.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    return msg || error?.message || fallback || 'Something went wrong';
  },
}));

import SignInPage from './SignInPage';

const renderSignIn = () => {
  return render(
    <MemoryRouter>
      <SignInPage />
    </MemoryRouter>,
  );
};

describe('SignInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render email and password fields', () => {
    renderSignIn();
    expect(screen.getByPlaceholderText('alex@nova.dev')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('should render "Log In" button', () => {
    renderSignIn();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('should render sign up and forgot password links', () => {
    renderSignIn();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it('should submit form and store tokens in localStorage on success', async () => {
    mockLogin.mockResolvedValue({
      success: true,
      data: {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        user: { id: '1', firstname: 'John' },
      },
    });

    renderSignIn();

    fireEvent.change(screen.getByPlaceholderText('alex@nova.dev'), {
      target: { value: 'john@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'john@test.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(localStorage.getItem('accessToken')).toBe('test-access-token');
      expect(localStorage.getItem('refreshToken')).toBe('test-refresh-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify({ id: '1', firstname: 'John' }));
    });
  });

  it('should navigate to / on successful login', async () => {
    mockLogin.mockResolvedValue({
      success: true,
      data: {
        accessToken: 'token',
        refreshToken: 'refresh',
        user: { id: '1' },
      },
    });

    renderSignIn();

    fireEvent.change(screen.getByPlaceholderText('alex@nova.dev'), {
      target: { value: 'john@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'pass123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should show error toast on failed login', async () => {
    mockLogin.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    renderSignIn();

    fireEvent.change(screen.getByPlaceholderText('alex@nova.dev'), {
      target: { value: 'bad@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('should show 2FA input when isTwoFactorRequired is returned', async () => {
    mockLogin.mockResolvedValue({
      success: true,
      data: {
        isTwoFactorRequired: true,
        userId: 'user-2fa',
      },
    });

    renderSignIn();

    fireEvent.change(screen.getByPlaceholderText('alex@nova.dev'), {
      target: { value: 'user@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'pass123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Two-Factor Auth/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
    });
  });

  it('should complete 2FA login and navigate to /', async () => {
    // Step 1: Trigger 2FA prompt
    mockLogin.mockResolvedValue({
      success: true,
      data: { isTwoFactorRequired: true, userId: 'user-2fa' },
    });

    renderSignIn();

    fireEvent.change(screen.getByPlaceholderText('alex@nova.dev'), {
      target: { value: 'user@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'pass123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
    });

    // Step 2: Submit 2FA code
    mockVerify2FA.mockResolvedValue({
      success: true,
      data: {
        accessToken: '2fa-access-token',
        refreshToken: '2fa-refresh-token',
        user: { id: 'user-2fa' },
      },
    });

    fireEvent.change(screen.getByPlaceholderText('000000'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(mockVerify2FA).toHaveBeenCalledWith({
        userId: 'user-2fa',
        code: '123456',
      });
      expect(localStorage.getItem('accessToken')).toBe('2fa-access-token');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
