import React, {useEffect, useState} from 'react';
import {useStore} from '../store';
import {usePrivy} from '@privy-io/react-auth';
import {useWallets} from '@privy-io/react-auth';
import {BigNumber, ethers} from 'ethers';

import {Idea} from './Idea';

export const Swipe = () => {
  const {wallets} = useWallets();
  const {activeTab, sessionKey, setSessionKey, contract, privyAddress, setPrivyAddress} =
    useStore();
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [swipeList, setSwipeList] = useState([]);
  const [idea, setIdea] = useState('');

  const {authenticated, ready} = usePrivy();

  useEffect(() => {
    const getPrivyAddress = () => {
      let embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
      let newPrivyAddress = embeddedWallet?.address;

      if (newPrivyAddress !== undefined && newPrivyAddress !== privyAddress) {
        setPrivyAddress(newPrivyAddress);
      }
    };

    getPrivyAddress();
  }, [activeTab, authenticated, ready]);

  useEffect(() => {
    const getSwipeList = async () => {
      try {
        if (ready == true && authenticated == true && privyAddress !== '') {
          let total_ideas = await contract.total_ideas();
          total_ideas = total_ideas.toNumber();

          let ids = [];
          for (let i = 0; i < total_ideas; i++) {
            ids.push(i);
          }

          let ideasToVote = [];

          let responses = await Promise.all(
            ids.map(async (id) => {
              const res = await contract.getVote(id, privyAddress);
              if (res === 0) {
                ideasToVote.push(id);
              }
            }),
          );

          let ideaSwipeList = [];

          responses = await Promise.all(
            ideasToVote.map(async (id) => {
              let res1 = await contract.getIdea(id);
              let res2 = await contract.getIterations(id);

              let res = {
                id: id,
                ...res1,
                ...res2,
              };

              ideaSwipeList.push(res);
            }),
          );

          if (ideaSwipeList.length !== 0) {
            setIdea(ideaSwipeList[ideaSwipeList.length - 1]);
          }

          ideaSwipeList.pop();

          setSwipeList(ideaSwipeList);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getSwipeList();
  }, [privyAddress]);

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

  const doVote = async ({vote}) => {
    try {
      const ideaObject = getIdeaObject(idea);

      const res = await fetch('/api/doVote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: ideaObject.id,
          vote: vote,
          userAddress: privyAddress,
        }),
      });

      let ideaSwipeList = swipeList;

      if (ideaSwipeList.length !== 0) {
        setIdea(ideaSwipeList[ideaSwipeList.length - 1]);
      } else {
        setIdea('');
      }

      ideaSwipeList.pop();

      setSwipeList(ideaSwipeList);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      {activeTab == 1 ? (
        <div className="flex h-fit w-full flex-col place-content-center items-center space-y-1">
          {idea !== '' ? (
            <React.Fragment>
              <Idea idea={getIdeaObject(idea)} />

              <div className="flex w-full max-w-md flex-row justify-around space-x-1 rounded-xl text-xl font-bold uppercase">
                <button
                  onClick={() => {
                    doVote({vote: 1});
                  }}
                  className="w-1/2 rounded-md bg-isRedLight py-1 uppercase transition-all duration-200 ease-in-out hover:bg-isWhite hover:text-isRedLight"
                >
                  Hmm
                </button>
                <button
                  onClick={() => {
                    doVote({vote: 2});
                  }}
                  className="w-1/2 rounded-md bg-isGreenLight py-1 uppercase text-isSystemDarkTertiary transition-all duration-200 ease-in-out hover:bg-isWhite hover:text-isGreenLight"
                >
                  Gas
                </button>
              </div>
            </React.Fragment>
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
