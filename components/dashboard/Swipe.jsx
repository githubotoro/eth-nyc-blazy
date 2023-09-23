import React from 'react';
import {useStore} from '../store';

export const Swipe = () => {
  const {activeTab} = useStore();

  return (
    <React.Fragment>
      {activeTab == 1 ? (
        <div className="flex w-full flex-col place-content-center items-center">
          <div className="aspect-square w-full max-w-lg rounded-xl bg-isWhite drop-shadow-sm"></div>
        </div>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};
