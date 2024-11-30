'use client';
import { createNewDocument } from '@/actions/action';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from './ui/button';

function NewDocumnetButton() {
  const [isPending, setTransition] = useTransition();
  const router = useRouter();

  const handleCreate = () => {
    setTransition(async () => {
      const { docId } = await createNewDocument();
      router.push(`/doc/${docId}`);
    });
  };

  return (
    <Button onClick={handleCreate} disabled={isPending}>
      {isPending ? `Creating...` : `New Documnet`}
    </Button>
  );
}

export default NewDocumnetButton;
