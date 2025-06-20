import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AnalyticsData } from '../constants/types/analyticsData';

interface AnalyticsStore {
  analyticsData: AnalyticsData | null;
  setAnalyticsData: (data: AnalyticsData) => void;
  clearAnalyticsData: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set) => ({
        analyticsData: null,
        setAnalyticsData: (data) => set({ analyticsData: data }),
        clearAnalyticsData: () => set({ analyticsData: null }),
    }),
    {
      name: 'analytics-storage', // Unique key for sessionStorage
      storage: createJSONStorage(() => sessionStorage), // or localStorage
      // Optional: Whitelist/blacklist specific fields
      // partialize: (state) => ({ positionData: state.positionData }),
    }
  )
);