'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { db } from '@/firebase';
import { useUser } from '@clerk/nextjs';
import {
  collectionGroup,
  DocumentData,
  query,
  where,
} from 'firebase/firestore';
import { MenuIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import NewDocumnetButton from './NewDocumnetButton';
import SidebarOPtions from './SidebarOPtions';

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: 'owner' | 'editor';
  roomId: string;
  userId: string;
}

function SideBar() {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({ owner: [], editor: [] });
  const [data, loading, error] = useCollection(
    user &&
      query(
        collectionGroup(db, 'rooms'),
        where('userId', '==', user.emailAddresses[0].toString())
      )
  );

  useEffect(() => {
    if (!data) return;
    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, doc) => {
        const room = doc.data() as RoomDocument;
        if (room.role === 'owner') {
          acc.owner.push({ id: doc.id, ...room });
        } else {
          acc.editor.push({ id: doc.id, ...room });
        }
        return acc;
      },
      { owner: [], editor: [] }
    );
    setGroupedData(grouped);
  }, [data]);

  const menuOptions = (
    <>
      <NewDocumnetButton />
      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        {/* my documents */}
        {groupedData.owner.length === 0 ? (
          <h2>No documents found</h2>
        ) : (
          <>
            <h2>My Documents</h2>
            {groupedData.owner.map((doc) => (
              <SidebarOPtions
                key={doc.id}
                href={`/doc/${doc.id}`}
                id={doc.id}
              />
            ))}
          </>
        )}

        {/* shared with me */}
        {groupedData.editor.length > 0 && (
          <>
            <h2>Shared with me</h2>
            {groupedData.editor.map((doc) => (
              <SidebarOPtions
                key={doc.id}
                href={`/doc/${doc.id}`}
                id={doc.id}
              />
            ))}
          </>
        )}

        {/* lists of documents */}
      </div>
    </>
  );

  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:opacity-30 rounded-lg " size={40} />
          </SheetTrigger>
          <SheetContent side={'left'}>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>
                {/* options */}
                {menuOptions}
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:inline">{menuOptions}</div>
    </div>
  );
}
export default SideBar;
