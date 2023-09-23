import React, {useEffect, useState} from 'react';
import {useStore} from '../store';
import {usePrivy} from '@privy-io/react-auth';
import {useWallets} from '@privy-io/react-auth';
import {ethers} from 'ethers';
import clsx from 'clsx';

import {Idea} from './Idea';

export const Create = () => {
  const {wallets} = useWallets();
  const {activeTab, sessionKey, setSessionKey} = useStore();
  const {authenticated, ready} = usePrivy();

  const [ideaList, setIdeaList] = useState([]);

  const [title, setTitle] = useState('');
  const [one_liner, setOne_liner] = useState('');

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

  const submitIdea = async () => {
    try {
      if (authenticated) {
        const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
        const privyAddress = embeddedWallet.address;

        const res = await fetch('/api/addIdea', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: privyAddress,
            title: title,
            one_liner: one_liner,
          }),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      {activeTab == 2 ? (
        <div className="flex h-fit w-full flex-col items-center space-y-3">
          <div className="flex w-full max-w-md flex-col space-y-1">
            <input
              placeholder="your banga web3 title goes here"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              type="text"
              id="title"
              value={title}
              className="appearance-none rounded-lg border-none bg-isWhite/90 text-isLabelLightSecondary drop-shadow-sm focus:bg-isWhite focus:text-isBlack"
            />
            <textarea
              placeholder="a one-liner for your idea that makes sense to my mom"
              onChange={(e) => {
                setOne_liner(e.target.value);
              }}
              rows="2"
              id="title"
              value={one_liner}
              className="appearance-none rounded-lg border-none bg-isWhite/90 text-isLabelLightSecondary drop-shadow-sm focus:bg-isWhite focus:text-isBlack"
            />
            <button
              disabled={one_liner === '' || title == '' ? true : false}
              onClick={submitIdea}
              className={clsx(
                'appearance-none rounded-lg border-none py-1 font-bold uppercase text-isWhite drop-shadow-sm ',
                one_liner === '' || title == ''
                  ? 'disabled cursor-disabled bg-isRedLight hover:bg-isRedLightEmphasis'
                  : 'bg-isGreenLight hover:bg-isGreenLightEmphasis',
              )}
            >
              submit
            </button>
          </div>
          {ideaList !== [] ? (
            ideaList.map((idea, ideaIndex) => {
              return <Idea key={ideaIndex} idea={idea} ideaIndex={ideaIndex} isEditable={true} />;
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
