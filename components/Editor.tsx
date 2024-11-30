'use client';

import stringToColor from '@/lib/stringToColor';
import { BlockNoteEditor } from '@blocknote/core';
import '@blocknote/core/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/shadcn/style.css';
import { useSelf } from '@liveblocks/react';
import { useRoom } from '@liveblocks/react/suspense';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import TranslateDocument from './TranslateDocument';
import { Button } from './ui/button';
import ChatToDocument from './ChatToDocument';

type EditorProps = {
  doc: Y.Doc;
  provider: any;
  darkMode: boolean;
};

// BlockNote Component
function BlockNote({ doc, provider, darkMode }: EditorProps) {
  const userInfo = useSelf((me) => me.info);

  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment('document-store'), // Centralized access
      user: {
        name: userInfo?.name!,
        color: stringToColor(userInfo?.name || ''),
      },
    },
  });

  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView
        className="min-h-screen"
        editor={editor}
        theme={darkMode ? 'dark' : 'light'}
      />
    </div>
  );
}

// Main Editor Component
function Editor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);

    // Centralized Yjs fragment initialization
    yDoc.getXmlFragment('document-store');

    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc.destroy();
      yProvider.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  const buttonStyle = `hover:text-white ${
    darkMode
      ? 'text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700'
      : 'text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700'
  }`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 justify-end mb-10">
        {/* Translation AI */}
        <TranslateDocument doc={doc} />


         <ChatToDocument doc={doc} />

        {/* Dark Mode Toggle */}
        <Button className={buttonStyle} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
      {/* BlockNote Editor */}
      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  );
}

export default Editor;
