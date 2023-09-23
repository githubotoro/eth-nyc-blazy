import {create} from 'zustand';

interface State {
  activeTab: any;
  setActiveTab: (activeTab: any) => void;
  sessionKey: any;
  setSessionKey: (sessionKey: any) => void;
}

export const useStore = create<State>()((set) => ({
  activeTab: 2,
  setActiveTab: (activeTab: any) => set({activeTab}),
  sessionKey: '',
  setSessionKey: (sessionKey: any) => set({sessionKey}),
}));
