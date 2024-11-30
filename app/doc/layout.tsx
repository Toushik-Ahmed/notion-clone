import LiveBlocksProvider from '@/components/LIveBlocksProvider';
import React from 'react';

function PageLayout({ children }: { children: React.ReactNode }) {
  return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
}

export default PageLayout;
