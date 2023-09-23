import {create} from 'zustand';
import {ethers} from 'ethers';
import {Abi} from './Abi';

interface State {
  abi: any;
  provider: any;
  activeTab: any;
  setActiveTab: (activeTab: any) => void;
  sessionKey: any;
  setSessionKey: (sessionKey: any) => void;
  privyAddress: any;
  setPrivyAddress: (privyAddress: any) => void;
}

export const useStore = create<State>()((set) => ({
  abi: Abi.abi,
  contract: new ethers.Contract(
    '0xB396B86779dAacdd76Bd7121179dE8c1f9D13925',
    Abi.abi,
    new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ZKEVM_URL),
  ),
  provider: new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ZKEVM_URL),
  activeTab: 1,
  setActiveTab: (activeTab: any) => set({activeTab}),
  sessionKey: '',
  setSessionKey: (sessionKey: any) => set({sessionKey}),
  privyAddress: '',
  setPrivyAddress: (privyAddress: any) => set({privyAddress}),
}));
