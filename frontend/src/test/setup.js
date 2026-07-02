import '@testing-library/jest-dom';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: new Proxy(
      {},
      {
        get: (_target, prop) => {
          return React.forwardRef((props, ref) => {
            const {
              initial,
              animate,
              exit,
              transition,
              whileHover,
              whileTap,
              whileInView,
              variants,
              layout,
              layoutId,
              ...filteredProps
            } = props;
            return React.createElement(prop, { ...filteredProps, ref });
          });
        },
      },
    ),
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
    useInView: () => true,
  };
});

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
  Toaster: () => null,
}));

// Mock import.meta.env
if (!globalThis.import_meta_env) {
  globalThis.import_meta_env = {
    VITE_API_URL: 'http://localhost:3000/api/v1',
  };
}
