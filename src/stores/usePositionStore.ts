import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PositionData } from '../constants/types/positionData';

interface PositionStore {
  positionData: PositionData | null;
  setPositionData: (data: PositionData) => void;
  clearPositionData: () => void;
}

export const usePositionStore = create<PositionStore>()(
  persist(
    (set) => ({
      positionData: null,
      setPositionData: (data) => set({ positionData: data }),
      clearPositionData: () => set({ positionData: null }),
    }),
    {
      name: 'position-storage', // Unique key for sessionStorage
      storage: createJSONStorage(() => sessionStorage), // or localStorage
      // Optional: Whitelist/blacklist specific fields
      // partialize: (state) => ({ positionData: state.positionData }),
    }
  )
);