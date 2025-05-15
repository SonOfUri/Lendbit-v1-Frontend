import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MarketData } from '../constants/types/marketData';

interface MarketStore {
  marketData: MarketData | null;
  setmarketData: (data: MarketData) => void;
  clearmarketData: () => void;
}

export const usemarketStore = create<MarketStore>()(
  persist(
    (set) => ({
      marketData: null,
      setmarketData: (data) => set({ marketData: data }),
      clearmarketData: () => set({ marketData: null }),
    }),
    {
      name: 'market-storage', // Unique key for sessionStorage
      storage: createJSONStorage(() => sessionStorage), // or localStorage
      // Optional: Whitelist/blacklist specific fields
      // partialize: (state) => ({ marketData: state.marketData }),
    }
  )
);