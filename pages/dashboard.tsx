// We trust all links we're sending to, so keep referrers for tracking
/* eslint-disable react/jsx-no-target-blank */

import axios from 'axios';
import {useRouter} from 'next/router';
import React, {useState, useEffect, useContext} from 'react';
import {usePrivy, useWallets, WalletWithMetadata} from '@privy-io/react-auth';
import Head from 'next/head';
import Loading from '../components/loading';
import AuthLinker from '../components/auth-linker';
import {clearDatadogUser} from '../lib/datadog';
import {DismissableInfo, DismissableError, DismissableSuccess} from '../components/toast';
import {formatWallet} from '../lib/utils';
import {Header} from '../components/header';
import CanvasContainer from '../components/canvas-container';
import CanvasSidebar from '../components/canvas-sidebar';
import CanvasCard from '../components/canvas-card';
import CanvasSidebarHeader from '../components/canvas-sidebar-header';
import {
  ArrowLeftOnRectangleIcon,
  ArrowUpOnSquareIcon,
  ArrowsUpDownIcon,
  CommandLineIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  PencilIcon,
  PlusIcon,
  UserCircleIcon,
  WalletIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import Canvas from '../components/canvas';
import CanvasRow from '../components/canvas-row';
import CanvasCardHeader from '../components/canvas-card-header';
import PrivyConfigContext, {
  defaultDashboardConfig,
  defaultIndexConfig,
  PRIVY_STORAGE_KEY,
} from '../lib/hooks/usePrivyConfig';
import Image from 'next/image';
import PrivyBlobIcon from '../components/icons/outline/privy-blob';
import GitHubIcon from '../components/icons/social/github';
import AppleIcon from '../components/icons/social/apple';

import {Tabs, Swipe, Create} from '../components/dashboard';
import {useStore} from '@/components/store';

export default function DashboardPage() {
  const router = useRouter();
  const [signLoading, setSignLoading] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);
  const [signError, setSignError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeWallet, setActiveWallet] = useState<WalletWithMetadata | null>(null);

  const {privyAddress, setPrivyAddress} = useStore();

  const {setConfig} = useContext(PrivyConfigContext);

  // set initial config, first checking for stored config, then falling back to default
  useEffect(() => {
    const storedConfigRaw = window.localStorage.getItem(PRIVY_STORAGE_KEY);
    const storedConfig = storedConfigRaw ? JSON.parse(storedConfigRaw) : null;
    setConfig?.({
      ...defaultDashboardConfig,
      appearance: storedConfig?.appearance
        ? storedConfig.appearance
        : defaultIndexConfig.appearance,
      embeddedWallets: {
        ...defaultIndexConfig.embeddedWallets,
        requireUserPasswordOnCreate:
          storedConfig?.embeddedWallets?.requireUserPasswordOnCreate ??
          defaultIndexConfig.embeddedWallets!.requireUserPasswordOnCreate,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    ready,
    authenticated,
    user,
    logout,
    linkEmail,
    linkWallet,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    linkGoogle,
    unlinkGoogle,
    linkTwitter,
    unlinkTwitter,
    linkDiscord,
    unlinkDiscord,
    linkGithub,
    unlinkGithub,
    linkApple,
    unlinkApple,
    getAccessToken,
    createWallet,
    exportWallet,
    unlinkWallet,
    setWalletPassword,
    setActiveWallet: sdkSetActiveWallet,
  } = usePrivy();

  const {wallets: connectedWallets} = useWallets();

  useEffect(() => {
    if (ready && !authenticated) {
      clearDatadogUser();
      router.push('/');
    }
  }, [ready, authenticated, router]);

  const linkedAccounts = user?.linkedAccounts || [];
  const wallets = linkedAccounts.filter((a) => a.type === 'wallet') as WalletWithMetadata[];
  const hasSetPassword = wallets.some(
    (w) => w.walletClientType === 'privy' && w.recoveryMethod === 'user-passcode',
  );

  const linkedAndConnectedWallets = wallets
    .filter((w) => connectedWallets.some((cw) => cw.address === w.address))
    .sort((a, b) => b.verifiedAt.toLocaleString().localeCompare(a.verifiedAt.toLocaleString()));

  useEffect(() => {
    // if no active wallet is set, set it to the first one if available
    if (!activeWallet && linkedAndConnectedWallets.length > 0) {
      setActiveWallet(linkedAndConnectedWallets[0]!);
    }
    // if an active wallet was removed from wallets, clear it out
    if (!linkedAndConnectedWallets.some((w) => w.address === activeWallet?.address)) {
      setActiveWallet(linkedAndConnectedWallets.length > 0 ? linkedAndConnectedWallets[0]! : null);
    }
  }, [activeWallet, linkedAndConnectedWallets]);

  const embeddedWallet = wallets.filter((wallet) => wallet.walletClient === 'privy')?.[0];

  // useEffect(() => {
  //   setPrivyAddress(embeddedWallet?.address);
  // }, [activeWallet]);

  const numAccounts = linkedAccounts.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const emailAddress = user?.email?.address;
  const phoneNumber = user?.phone?.number;

  const googleSubject = user?.google?.subject;
  const googleName = user?.google?.name;

  const twitterSubject = user?.twitter?.subject;
  const twitterUsername = user?.twitter?.username;

  const discordSubject = user?.discord?.subject;
  const discordUsername = user?.discord?.username;

  const githubSubject = user?.github?.subject;
  const githubUsername = user?.github?.username;

  const appleSubject = user?.apple?.subject;
  const appleEmail = user?.apple?.email;

  if (!ready || !authenticated || !user) {
    return <Loading />;
  }

  async function deleteUser() {
    const authToken = await getAccessToken();
    try {
      await axios.delete('/api/users/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
    logout();
  }

  // Remove unknown walletClients.
  // `user` has to be `any` type because by default walletClient is required.
  const removeUnknownWalletClients = (user: any) => {
    user.linkedAccounts.forEach(function (linkedAccount: any, index: number) {
      if (linkedAccount.type === 'wallet' && linkedAccount.walletClient === 'unknown') {
        delete user.linkedAccounts[index].walletClient;
      }
    });
    if (user.wallet?.walletClient === 'unknown') {
      delete user.wallet.walletClient;
    }
    return user;
  };

  return (
    <>
      <Head>
        <title>Blazy -- Making web3 ideas pass 'The Mom Test'</title>
      </Head>

      <div className="flex h-full flex-col px-6 pb-6">
        <Header />
        <div className="text-md my-3 flex h-fit w-full flex-col space-y-3 pb-5 drop-shadow-sm">
          <Tabs />
          <div className="no-scrollbar flex h-full max-h-[78vh] w-full flex-col space-y-3 overflow-y-scroll rounded-2xl bg-isGrayLightEmphasis6 p-3">
            <Swipe />
            <Create />
          </div>
        </div>
      </div>
    </>
  );
}
