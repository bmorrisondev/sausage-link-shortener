import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

interface Props {
  _id: Id<'links'>;
  slug: string;
  destination: string;
  description?: string;
}

export function EditLinkModal({ _id, slug, destination, description }: Props) {
  const [editDestination, setEditDestination] = useState(destination);
  const [editDescription, setEditDescription] = useState(
    description || ''
  );
  const updateLinkMutation = useMutation(api.links.updateLink);

  const handleUpdateLink = (linkId: Id<'links'>) => {
    updateLinkMutation({
      linkId,
      destination: editDestination,
      description: editDescription,
    });
  };

  return (
    <Dialog
      onOpenChange={() => {
        setEditDestination(destination);
        setEditDescription(description || '');
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className='bg-white' size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {slug}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="destination" className="text-sm font-medium">
              Destination URL
            </label>
            <Input
              id="destination"
              defaultValue={destination}
              onChange={(e) => setEditDestination(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              defaultValue={description || ''}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>
        </form>

        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose asChild>
            <Button onClick={() => handleUpdateLink(_id)}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
