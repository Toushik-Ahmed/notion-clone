import RoomProvider from '@/components/RoomProvider';
import { auth } from '@clerk/nextjs/server';

async function DocLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  auth.protect();

  // Explicitly ensure params is awaited, if necessary (this can depend on your setup)
  const { id } = await params;

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}

export default DocLayout;
