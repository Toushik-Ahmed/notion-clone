import RoomProvider from '@/components/RoomProvider';
import { auth } from '@clerk/nextjs/server';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>; // Adjusted to reflect a Promise
};

async function DocLayout({ children, params }: LayoutProps) {
  await auth.protect();

  // Await params if it's a Promise
  const { id } = await params;

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}

export default DocLayout;
