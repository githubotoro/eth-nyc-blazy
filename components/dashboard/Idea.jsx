import Image from 'next/image';
import React, {useState} from 'react';

export const Idea = ({idea}) => {
  const getImage = (index) => {
    if (index === 0) {
      return <Image src="/assets/spectreseek.webp" fill className="absolute object-cover" />;
    } else if (index === 1) {
      return <Image src="/assets/alterok.webp" fill className="absolute object-cover" />;
    } else if (index === 2) {
      return <Image src="/assets/erevald.webp" fill className="absolute object-cover" />;
    } else {
      return <Image src="/assets/gaudmire.webp" fill className="absolute object-cover" />;
    }
  };

  return (
    <React.Fragment>
      <div className="aspect-square w-full max-w-md overflow-hidden rounded-xl  drop-shadow-sm">
        <div className="absolute w-full truncate text-ellipsis py-1 px-3 text-center font-mono font-bold uppercase text-isWhite backdrop-blur-md">
          {idea.title}
        </div>

        <div className="absolute bottom-0 left-0 w-fit overflow-hidden rounded-lg rounded-l-none py-1 px-3 font-mono font-extrabold text-isWhite backdrop-blur-md">
          {idea.hmms} 🤔
        </div>

        <div className="absolute bottom-0 right-0 w-fit overflow-hidden rounded-lg rounded-r-none py-1 px-3 font-mono font-extrabold text-isWhite backdrop-blur-md">
          {idea.gases} 🔥
        </div>

        <div className="absolute flex h-full w-full flex-col place-content-center items-center overflow-hidden p-6 text-center text-xl text-isWhite md:p-12">
          <div className="overflow-hidden rounded-lg p-1 font-semibold lowercase backdrop-blur-md">
            {idea.one_liner}
          </div>
        </div>

        <div className="absolute -z-10 h-full w-full">
          <div className="relative h-full w-full">{getImage(idea.id % 4)}</div>
        </div>
      </div>
    </React.Fragment>
  );
};
