import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      _hasHydrated: false,

      setAuth: (user, token) => {
        // Ensure isAdmin is set correctly based on user role
        const isAdmin = user.role === 'ADMIN';

        set({
          user,
          token,
          isAuthenticated: true,
          isAdmin: isAdmin,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      updateUser: (userData) => {
        set((state) => {
          const updatedUser = state.user ? { ...state.user, ...userData } : null;
          // Recalculate isAdmin if role is updated
          const isAdmin = updatedUser?.role === 'ADMIN';

          return {
            user: updatedUser,
            isAdmin: isAdmin,
          };
        });
      },

      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: 'veilvogue-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
