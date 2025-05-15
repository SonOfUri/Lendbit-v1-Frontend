import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DashboardData } from '../constants/types/dashboardData';

interface DashboardStore {
  dashboardData: DashboardData | null;
  setDashboardData: (data: DashboardData) => void;
  clearDashboardData: () => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      dashboardData: null,
      setDashboardData: (data) => set({ dashboardData: data }),
      clearDashboardData: () => set({ dashboardData: null }),
    }),
    {
      name: 'dashboard-storage', // Unique key for sessionStorage
      storage: createJSONStorage(() => sessionStorage), // or localStorage
      // Optional: Whitelist/blacklist specific fields
      // partialize: (state) => ({ dashboardData: state.dashboardData }),
    }
  )
);