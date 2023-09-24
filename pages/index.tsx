import {useRouter} from 'next/router';
import Head from 'next/head';
import {usePrivy} from '@privy-io/react-auth';
import Loading from '../components/loading';
import {Header} from '../components/header';
import CanvasSidebarAuthConfig from '../components/canvas-sidebar-auth-config';
import PrivyBlobIcon from '../components/icons/outline/privy-blob';
import {
  ArrowDownOnSquareIcon,
  ArrowRightIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import CanvasCardHeader from '../components/canvas-card-header';
import CanvasCard from '../components/canvas-card';
import CanvasContainer from '../components/canvas-container';
import Canvas from '../components/canvas';
import CanvasRow from '../components/canvas-row';
import {useContext, useEffect, useState} from 'react';
import PrivyConfigContext, {
  defaultDashboardConfig,
  defaultIndexConfig,
  PRIVY_STORAGE_KEY,
} from '../lib/hooks/usePrivyConfig';
import useMediaQuery from '../lib/hooks/useMediaQuery';
import Image from 'next/image';

const mobileQuery = '(max-width: 768px)';

export default function LoginPage() {
  const router = useRouter();
  const {login, ready, authenticated} = usePrivy();
  const {config, setConfig} = useContext(PrivyConfigContext);
  const [copied, setCopied] = useState(false);
  const storedConfigRaw =
    typeof window === 'undefined' ? null : window.localStorage.getItem(PRIVY_STORAGE_KEY);
  const storedConfig = storedConfigRaw ? JSON.parse(storedConfigRaw) : null;
  const [readyToSetTheme, setReadyToSetTheme] = useState(false);

  const isMobile = useMediaQuery(mobileQuery);
  useEffect(() => {
    if (!ready || authenticated) {
      return;
    }
    setConfig?.({
      ...config,
      appearance: storedConfig?.appearance
        ? storedConfig.appearance
        : defaultIndexConfig.appearance,

      // @ts-expect-error internal api
      _render: isMobile ? defaultDashboardConfig._render : defaultIndexConfig._render,
      embeddedWallets: {
        ...defaultIndexConfig.embeddedWallets,
        requireUserPasswordOnCreate:
          storedConfig?.embeddedWallets?.requireUserPasswordOnCreate ??
          defaultIndexConfig.embeddedWallets!.requireUserPasswordOnCreate,
      },
    });
    // ensure that the modal is open on desktop
    if (!isMobile) {
      login();
    }
    setReadyToSetTheme(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, ready, authenticated]);

  useEffect(() => {
    if (!ready || authenticated) {
      return;
    }
    const isMobileOnLoad = window.matchMedia(mobileQuery).matches;

    // there is an issue with applying the dashboard config (render as modal)
    // _after_ loading the dashboard page, where the changing from in-line to modal
    // rendering will re-trigger the oauth process (since that's an effect on the oauth
    // status screen.) This will apply the config change if coming back from an oauth redirect,
    // before that issue arises.
    const currentUrl = new URL(window.location.href);
    const oauthProvider = currentUrl.searchParams.get('privy_oauth_provider');
    setConfig?.({
      ...(oauthProvider ? defaultDashboardConfig : defaultIndexConfig),
      // @ts-expect-error internal api
      _render: isMobileOnLoad ? defaultDashboardConfig._render : defaultIndexConfig._render,
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

    if (!isMobileOnLoad) {
      login();
    }
    setReadyToSetTheme(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, authenticated]);

  if (!ready) {
    return <Loading />;
  } else if (ready && authenticated) {
    router.push('/dashboard');
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Blazy | Hmm/Gas</title>
      </Head>
      <div className="flex h-full max-w-screen-2xl flex-col bg-privy-color-background px-6 pb-6">
        <Header />
        <button
          onClick={() => {
            login();
          }}
          className="button button-primary fixed bottom-4 right-4 left-4 z-[1] items-center gap-x-2 rounded-[13px] px-3 py-3 text-[14px] text-white md:hidden md:py-0"
        >
          Login
        </button>

        <CanvasContainer>
          {/* start: canvas-panel */}
          <Canvas className="h-fit place-content-center items-center">
            {/* start: modal-column */}
            <div id="render-privy" className="z-[2] mx-auto pt-8 md:mx-0 md:h-full md:pt-0 " />

            <div className="flex flex-col items-center">
              <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-2xl drop-shadow-sm">
                <Image src="/banner.png" fill />
              </div>

              <div className="flex w-full flex-col items-center pb-3">
                <div className="w-full max-w-lg py-5 px-3 text-center text-2xl">
                  The <b>idea</b>&nbsp;to on-board the <i>next 10 billion</i>&nbsp;users to web3 --
                  <u>doesn't have to be complex</u>.
                </div>
                <div className="w-full max-w-lg rounded-xl bg-isBlueDark py-2 px-3 text-center font-mono text-2xl font-bold italic text-isWhite drop-shadow-sm">
                  "As long as my mom knows get it, <br />
                  we are good."
                </div>
              </div>
            </div>
            {/* end: modal-column */}
          </Canvas>
          {/* end: canvas-panel */}
        </CanvasContainer>
      </div>
    </>
  );
}
