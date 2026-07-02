import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const renderWithRouter = (initialEntries = ['/protected']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div data-testid="protected-content">Secret Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<div data-testid="signin-page">Sign In</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render children when user is in localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ id: '1', firstname: 'John' }));

    renderWithRouter();

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  it('should redirect to /signin when no user in localStorage', () => {
    renderWithRouter();

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('signin-page')).toBeInTheDocument();
  });

  it('should redirect when user is "undefined" string', () => {
    localStorage.setItem('user', 'undefined');

    renderWithRouter();

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('signin-page')).toBeInTheDocument();
  });

  it('should react to auth-change event (logout triggers redirect)', () => {
    localStorage.setItem('user', JSON.stringify({ id: '1' }));

    renderWithRouter();
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();

    // Simulate logout
    act(() => {
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-change'));
    });

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('signin-page')).toBeInTheDocument();
  });

  it('should react to storage event (cross-tab sync)', () => {
    localStorage.setItem('user', JSON.stringify({ id: '1' }));

    renderWithRouter();
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();

    // Simulate cross-tab storage change
    act(() => {
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('storage'));
    });

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('signin-page')).toBeInTheDocument();
  });
});
