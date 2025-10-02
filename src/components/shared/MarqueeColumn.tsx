import React from 'react';

interface MarqueeColumnProps {
  isLeft?: boolean;
  className?: string;
  children: React.ReactNode;
}

const MarqueeColumn: React.FC<MarqueeColumnProps> = React.memo(({ isLeft = true, className = '', children }) => {
  return (
    <div
      className="relative h-full"
      style={{
        overflowY: 'hidden',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)',
        maskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)'
      }}
    >
      <div className={`flex flex-col gap-6 py-6 px-5 ${isLeft ? 'animate-scroll-up' : 'animate-scroll-down'} ${className}`} style={{ overflowX: 'visible' }}>
        {children}
      </div>
    </div>
  );
});

MarqueeColumn.displayName = 'MarqueeColumn';

export default MarqueeColumn;

