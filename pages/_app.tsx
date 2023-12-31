import '../styles/globals.css';
import type {AppProps} from 'next/app';
import Head from '../components/Head';
import {PrivyProvider} from '@privy-io/react-auth';
import PlausibleProvider from 'next-plausible';
import {initializeDatadog, setDatadogUser} from '../lib/datadog';
import {useCallback, useMemo, useState} from 'react';
import PrivyConfigContext, {
  defaultIndexConfig,
  PrivyConfigContextType,
  PRIVY_STORAGE_KEY,
  defaultDashboardConfig,
} from '../lib/hooks/usePrivyConfig';

function MyApp({Component, pageProps, router}: AppProps) {
  const [config, setConfig] = useState<PrivyConfigContextType['config']>(() => {
    // Pull out the appearance from local storage if it exists
    const storedConfigRaw =
      typeof window === 'undefined' ? null : window.localStorage.getItem(PRIVY_STORAGE_KEY);
    // const storedConfig = storedConfigRaw ? JSON.parse(storedConfigRaw) : null;
    // const defaultConfig = router?.route?.includes('dashboard')
    //   ? defaultDashboardConfig
    //   : defaultIndexConfig;
    // return {
    //   ...defaultConfig,
    //   appearance: storedConfig?.appearance
    //     ? storedConfig.appearance
    //     : defaultIndexConfig.appearance,
    // };
  });

  const setConfigWithAppearanceStorage = useCallback(
    (newConfig: PrivyConfigContextType['config']) => {
      window.localStorage.setItem(PRIVY_STORAGE_KEY, JSON.stringify(newConfig));
      return setConfig(newConfig);
    },
    [setConfig],
  );

  useMemo(initializeDatadog, []);

  return (
    <>
      <Head
        url="https://blazy.vercel.app"
        image=""
        title="Blazy | Adding gas to your web3 idea"
        description="Web3 don't need to be complex -- just a simple no-brainer that makes sense."
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="crossorigin" />
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <PlausibleProvider domain="demo.privy.io">
        <PrivyConfigContext.Provider
          value={{
            config,
            setConfig: setConfigWithAppearanceStorage,
            embeddedWallets: {
              noPromptOnSignature: true, // defaults to false
            },
          }}
        >
          <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
            // @ts-expect-error internal api
            apiUrl={process.env.NEXT_PUBLIC_PRIVY_AUTH_URL}
            onSuccess={setDatadogUser}
            config={config}
          >
            <Component {...pageProps} />
          </PrivyProvider>
        </PrivyConfigContext.Provider>
      </PlausibleProvider>
    </>
  );
}

export default MyApp;
