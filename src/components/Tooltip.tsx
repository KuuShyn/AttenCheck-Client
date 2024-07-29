import React from 'react';

type TooltipProps = {
  content: React.ReactNode;
  visible: boolean;
};

const Tooltip: React.FC<TooltipProps> = ({ content, visible }) => {
  return (
    <div
      className={`bg-gray-700 text-white text-xs rounded py-2 px-3 shadow-lg transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'} whitespace-nowrap`}
      style={{ top: '110%', left: '0', transform: 'translateY(6px)' }}
    >
      {content}
    </div>
  );
};

export default Tooltip;
