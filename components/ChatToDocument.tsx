'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BotIcon, MessageCircleCode } from 'lucide-react';
import { FormEvent, useState, useTransition } from 'react';
import Markdown from 'react-markdown';
import { toast } from 'sonner';
import * as Y from 'yjs';
import { Button } from './ui/button';
import { Input } from './ui/input';

function ChatToDocument({ doc }: { doc: Y.Doc }) {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');

  const askQuestion = async (e: FormEvent) => {
    e.preventDefault();
    setQuestion(input);
    startTransition(async () => {
      const documentData = doc.get('document-store').toJSON();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: input,
            documentData,
          }),
        }
      );
      if (res.ok) {
        const { response } = await res.json();
        setSummary(response);
        toast.success('Question asked!');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <MessageCircleCode className="mr-2" />
          Chat to document
        </DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat to a document!</DialogTitle>
          <DialogDescription>
            Ask a question to chat to the document with AI.
          </DialogDescription>
          <hr className="mt-5" />
          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
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

        <form className="flex gap-2" onSubmit={askQuestion}>
          <Input
            type="text"
            placeholder="i.e What is the meaning of life?"
            className="w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" disabled={!input || isPending}>
            {isPending ? 'Asking...' : 'Ask'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChatToDocument;
