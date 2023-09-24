import React, {useEffect, useState} from 'react';
import {useStore} from '../store';
import {usePrivy} from '@privy-io/react-auth';
import {useWallets} from '@privy-io/react-auth';
import {ethers} from 'ethers';
import clsx from 'clsx';

import {Idea} from './Idea';

export const Create = () => {
  const {wallets} = useWallets();
  const {activeTab, sessionKey, setSessionKey, contract, privyAddress, setPrivyAddress} =
    useStore();
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [swipeList, setSwipeList] = useState([]);
  const [idea, setIdea] = useState('');

  const {authenticated, ready} = usePrivy();

  const [ideaList, setIdeaList] = useState([]);

  const [title, setTitle] = useState('');
  const [one_liner, setOne_liner] = useState('');

  useEffect(() => {
    const getPrivyAddress = () => {
      let embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
      let newPrivyAddress = embeddedWallet?.address;

      if (newPrivyAddress !== undefined && newPrivyAddress !== privyAddress) {
        setPrivyAddress(newPrivyAddress);
      }
    };

    getPrivyAddress();
  }, [activeTab]);

  const getIdeaList = async () => {
    try {
      if (ready == true && authenticated == true && privyAddress !== '') {
        let ids = await contract.getIdeaList(privyAddress);

        let newIdeaList = [];

        responses = await Promise.all(
          ids.map(async (id) => {
            let res1 = await contract.getIdea(id);
            let res2 = await contract.getIterations(id);

            let res = {
              id: id,
              ...res1,
              ...res2,
            };

            newIdeaList.push(res);
          }),
        );

        setIdeaList(newIdeaList);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getTheIdeaList = async () => {
      try {
        if (ready == true && authenticated == true && privyAddress !== '') {
          let ids = await contract.getIdeaList(privyAddress);

          let newIdeaList = [];

          let responses = await Promise.all(
            ids.map(async (id) => {
              let res1 = await contract.getIdea(id);
              let res2 = await contract.getIterations(id);

              let res = {
                id: id,
                ...res1,
                ...res2,
              };

              newIdeaList.push(res);
            }),
          );

          setIdeaList(newIdeaList);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getTheIdeaList();
  }, [activeTab]);

  const makeIteration = async ({vote}) => {
    try {
      const res = await fetch('/api/makeIteration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 101,
          title: title,
          one_liner: one_liner,
          isNew: 1,
          userAddress: privyAddress,
        }),
      });

      getIdeaList();
    } catch (err) {
      console.log(err);
    }
  };

  const getIdeaObject = (thisIdea) => {
    // console.log(idea);

    let ideaObject = {
      id: thisIdea.id,
      title: thisIdea[0][0],
      one_liner: thisIdea[0][1],
      gases: thisIdea.gases.toNumber(),
      hmms: thisIdea.hmms.toNumber(),
    };

    // console.log(`idea object is`, ideaObject);

    return ideaObject;
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
              onClick={makeIteration}
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
            ideaList.toReversed().map((idea, ideaIndex) => {
              return <Idea key={getIdeaObject(idea).id} idea={getIdeaObject(idea)} />;
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
