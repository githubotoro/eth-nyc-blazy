import React, {useEffect, useState} from 'react';
import {useStore} from '../store';
import {usePrivy} from '@privy-io/react-auth';
import {useWallets} from '@privy-io/react-auth';
import {ethers} from 'ethers';

import {Idea} from './Idea';

export const Create = () => {
  const {wallets} = useWallets();
  const {activeTab, sessionKey, setSessionKey} = useStore();
  const {authenticated, ready} = usePrivy();

  const [ideaList, setIdeaList] = useState([]);

  useEffect(() => {
    const getIdeaList = async () => {
      try {
        if (authenticated) {
          const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
          const privyAddress = embeddedWallet.address;

          const res = await fetch('/api/userIdeas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address: privyAddress,
            }),
          });
          const data = await res.json();

          setIdeaList(data.ideaList);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getIdeaList();
  });

  console.log(ideaList);

  return (
    <React.Fragment>
      {activeTab == 2 ? (
        <div className="flex h-fit w-full flex-col items-center space-y-3">
          {ideaList !== [] ? (
            ideaList.map((idea, ideaIndex) => {
              return <Idea key={ideaIndex} idea={idea} />;
            })
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};
