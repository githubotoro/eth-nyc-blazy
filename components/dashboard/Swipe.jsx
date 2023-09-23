import React, {useEffect, useState} from 'react';
import {useStore} from '../store';
import {usePrivy} from '@privy-io/react-auth';
import {useWallets} from '@privy-io/react-auth';
import {ethers} from 'ethers';

export const Swipe = () => {
  const {wallets} = useWallets();
  const {activeTab, sessionKey, setSessionKey} = useStore();
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [swipeList, setSwipeList] = useState([]);

  console.log(swipeList);

  const {authenticated, ready} = usePrivy();

  useEffect(() => {
    const getIdeas = async () => {
      try {
        const res = await fetch('/api/totalIdeas');
        const data = await res.json();
        setTotalIdeas(data.total_ideas);
      } catch (err) {
        console.log(err);
      }
    };

    const getSessionKey = async () => {
      try {
        const wallet = ethers.Wallet.createRandom();
        setSessionKey(wallet.privateKey);
      } catch (err) {
        console.log(err);
      }
    };

    getIdeas();
    getSessionKey();
  }, []);

  useEffect(() => {
    const getSwipeList = async () => {
      try {
        if (authenticated) {
          const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
          const privyAddress = embeddedWallet.address;

          const res = await fetch('/api/blazyUsers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address: privyAddress,
            }),
          });
          const data = await res.json();

          const alreadySwiped = new Set(data.swipeList);
          let newSwipeList = [];

          for (let i = 0; i < totalIdeas; i++) {
            if (!alreadySwiped.has(i)) {
              newSwipeList.push(i);
            }
          }

          setSwipeList(newSwipeList);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getSwipeList();
  }, [ready]);

  return (
    <React.Fragment>
      {activeTab == 1 ? (
        <div className="flex w-full flex-col place-content-center items-center">
          <div className="aspect-square w-full max-w-lg overflow-hidden rounded-xl bg-isWhite drop-shadow-sm">
            <div className="h-1/6 w-full bg-isRedDark"></div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};
