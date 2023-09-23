import Image from 'next/image';
import React from 'react';

export const Idea = ({idea}) => {
  return (
    <React.Fragment>
      <div className="aspect-square w-full max-w-md overflow-hidden rounded-xl  drop-shadow-sm">
        <div className="absolute w-full truncate text-ellipsis py-1 px-3 text-center font-mono font-bold uppercase text-isWhite backdrop-blur-md">
          {idea.title}
        </div>

        <div className="absolute flex h-full w-full flex-col place-content-center items-center p-6 text-center text-xl text-isWhite md:p-12">
          <div className="rounded-md p-1 font-semibold lowercase backdrop-blur-md">
            {idea.one_liner}
          </div>
        </div>

        <div className="absolute -z-10 h-full w-full">
          <div className="relative h-full w-full">
            <Image src="/assets/spectreseek.webp" fill className="absolute object-cover" />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
