import {create} from 'zustand';

interface State {
  activeTab: any;
  setActiveTab: (activeTab: any) => void;
}

export const useStore = create<State>()((set) => ({
  activeTab: 1,
  setActiveTab: (activeTab: any) => set({activeTab}),
}));
