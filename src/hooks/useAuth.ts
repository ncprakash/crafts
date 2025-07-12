import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const requireAuth = (callback?: () => void) => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
      return false;
    }
    if (callback) callback();
    return true;
  };

  return {
    session,
    status,
    login,
    logout,
    requireAuth,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  };
}; 