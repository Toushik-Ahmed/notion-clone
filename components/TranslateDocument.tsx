'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BotIcon, LanguagesIcon } from 'lucide-react';
import { FormEvent, useState, useTransition } from 'react';
import Markdown from 'react-markdown';
import { toast } from 'sonner';
import * as Y from 'yjs';
import { Button } from './ui/button';
import { DialogHeader } from './ui/dialog';

type Language = 'english' | 'spanish' | 'french' | 'arabic' | 'japanese';

const languages: Language[] = [
  'english',
  'spanish',

  'french',
  'arabic',
  'japanese',
];

function TranslateDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const handleQuestion = async (e: FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const documentData = doc.get('document-store').toJSON();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentData,
            targetLang: language,
          }),
        }
      );
      if (res.ok) {
        const { translation } = await res.json();
        setSummary(translation);

        toast.success('Document translated successfully!');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <LanguagesIcon />
          Translate
        </DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate the document</DialogTitle>
          <DialogDescription>
            Select a language and AI will translate the document for you!
          </DialogDescription>
          <hr className="mt-5" />
          {question && <p className="mt-5 text-gray-500">{question}</p>}
        </DialogHeader>
        {summary && (
          <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
            <div>
              <BotIcon className="w-10 flex-shrink-0" />
              <p className="font-bold">
                GPT {isPending ? 'Thinking...' : 'Says'}
              </p>
            </div>
            <div>{isPending ? 'Thinking' : <Markdown>{summary}</Markdown>}</div>
          </div>
        )}
        <form className="flex gap-2" onSubmit={handleQuestion}>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" disabled={!language || isPending}>
            {isPending ? 'Translating...' : 'Translate'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TranslateDocument;
