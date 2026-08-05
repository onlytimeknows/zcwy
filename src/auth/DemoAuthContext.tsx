import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type DemoRole = 'student' | 'enterprise';

interface DemoAuthContextValue {
  role: DemoRole | null;
  login: (role: DemoRole) => void;
  logout: () => void;
}

const STORAGE_KEY = 'zcwy-demo-auth-v1';
const DemoAuthContext = createContext<DemoAuthContextValue | null>(null);

function readStoredRole(): DemoRole | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedRole = window.sessionStorage.getItem(STORAGE_KEY);
    return storedRole === 'student' || storedRole === 'enterprise' ? storedRole : null;
  } catch {
    return null;
  }
}

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<DemoRole | null>(readStoredRole);

  const login = useCallback((nextRole: DemoRole) => {
    setRole(nextRole);

    try {
      window.sessionStorage.setItem(STORAGE_KEY, nextRole);
    } catch {
      // 浏览器禁用会话存储时仍保留当前页面内的演示登录状态。
    }
  }, []);

  const logout = useCallback(() => {
    setRole(null);

    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // 会话存储不可用时无需阻断退出操作。
    }
  }, []);

  const value = useMemo(() => ({ role, login, logout }), [role, login, logout]);

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>;
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);

  if (!context) {
    throw new Error('useDemoAuth 必须在 DemoAuthProvider 内使用');
  }

  return context;
}
