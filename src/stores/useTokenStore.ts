import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TokenData } from '../constants/types/tokenData';

interface TokenStore {
  tokenData: TokenData[] | null;
  setTokenData: (data: TokenData[]) => void;
  clearTokenData: () => void;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set) => ({
      tokenData: null,
      setTokenData: (data) => set({ tokenData: data }),
      clearTokenData: () => set({ tokenData: null }),
    }),
    {
      name: 'token-storage', // Unique key for sessionStorage
      storage: createJSONStorage(() => sessionStorage), // or localStorage
      // Optional: Whitelist/blacklist specific fields
      // partialize: (state) => ({ tokenData: state.tokenData }),
    }
  )
);