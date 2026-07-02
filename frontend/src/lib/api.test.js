import { describe, it, expect, vi, beforeEach } from 'vitest';

// We test the utility functions and interceptor logic without making real HTTP calls.
// The api module creates an axios instance at import time, so we test the exports and helpers.

describe('API Client', () => {
  let getErrorMessage;

  beforeEach(async () => {
    // Clear localStorage before each test
    localStorage.clear();
    // Re-import to get fresh module
    const apiModule = await import('./api.js');
    getErrorMessage = apiModule.getErrorMessage;
  });

  describe('getErrorMessage', () => {
    it('should return message string from API error response', () => {
      const error = {
        response: { data: { message: 'Invalid credentials' } },
      };
      expect(getErrorMessage(error)).toBe('Invalid credentials');
    });

    it('should join array messages with comma', () => {
      const error = {
        response: { data: { message: ['Email is required', 'Password is required'] } },
      };
      expect(getErrorMessage(error)).toBe('Email is required, Password is required');
    });

    it('should return error.message when no response data', () => {
      const error = { message: 'Network Error' };
      expect(getErrorMessage(error)).toBe('Network Error');
    });

    it('should return fallback when no message available', () => {
      const error = {};
      expect(getErrorMessage(error)).toBe('Something went wrong');
    });

    it('should return custom fallback when provided', () => {
      const error = {};
      expect(getErrorMessage(error, 'Custom fallback')).toBe('Custom fallback');
    });
  });

  describe('authAPI.logout', () => {
    it('should clear all auth data from localStorage', async () => {
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('refreshToken', 'test-refresh');
      localStorage.setItem('user', '{"id":"1"}');

      const { authAPI } = await import('./api.js');
      authAPI.logout();

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should dispatch auth-change event', async () => {
      const handler = vi.fn();
      window.addEventListener('auth-change', handler);

      const { authAPI } = await import('./api.js');
      authAPI.logout();

      expect(handler).toHaveBeenCalled();
      window.removeEventListener('auth-change', handler);
    });
  });

  describe('Request interceptor', () => {
    it('should attach Bearer token from localStorage', async () => {
      localStorage.setItem('accessToken', 'my-test-token');

      const apiModule = await import('./api.js');
      const api = apiModule.default;

      // Access the request interceptor by creating a config
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };

      // The interceptor modifies config in place
      // We test by checking the interceptor chain
      const interceptors = api.interceptors.request.handlers;
      expect(interceptors.length).toBeGreaterThan(0);

      // Call the first interceptor's fulfilled handler
      const result = interceptors[0].fulfilled(config);
      expect(result.headers.Authorization).toBe('Bearer my-test-token');
    });

    it('should not attach Authorization header when no token', async () => {
      localStorage.removeItem('accessToken');

      const apiModule = await import('./api.js');
      const api = apiModule.default;

      const config = {
        headers: { 'Content-Type': 'application/json' },
      };

      const interceptors = api.interceptors.request.handlers;
      const result = interceptors[0].fulfilled(config);
      expect(result.headers.Authorization).toBeUndefined();
    });
  });
});
