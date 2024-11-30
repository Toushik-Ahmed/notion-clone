'use client';
import React from 'react';

import { LiveblocksProvider } from '@liveblocks/react/suspense';
function LiveBlocksProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
    throw new Error('Missing Liveblocks API Key');
  }

  return (
    <LiveblocksProvider authEndpoint="/auth-endpoint" throttle={16}>
      {children}
    </LiveblocksProvider>
  );
}

export default LiveBlocksProvider;
