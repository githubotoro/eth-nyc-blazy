import clsx from 'clsx';
import {useStore} from '../store';

export const Tabs = () => {
  const {activeTab, setActiveTab} = useStore();

  const BASE_BUTTON =
    'bg rounded-lg py-1 px-3 font-bold hover:bg-isBlueLight hover:text-isWhite drop-shadow-sm';
  const ACTIVE = 'bg-isBlueLight text-isWhite';
  const PASSIVE = 'bg-isLabelLightSecondary text-isWhite/90';
  const ANIMATE = 'transition-all duration-200 ease-in-out';

  return (
    <div className="flex h-fit w-full flex-row place-content-center items-center text-center">
      <div className="w-full max-w-sm space-x-3">
        <button
          onClick={() => {
            setActiveTab(1);
          }}
          className={clsx(BASE_BUTTON, ANIMATE, activeTab == 1 ? ACTIVE : PASSIVE)}
        >
          Swipe
        </button>
        <button
          onClick={() => {
            setActiveTab(2);
          }}
          className={clsx(BASE_BUTTON, ANIMATE, activeTab == 2 ? ACTIVE : PASSIVE)}
        >
          Create
        </button>
      </div>
    </div>
  );
};
