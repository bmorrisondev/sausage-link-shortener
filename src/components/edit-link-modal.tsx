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
  link: {
    _id: Id<'links'>;
    slug: string;
    destination: string;
    description?: string;
  };
}

export function EditLinkModal({ link }: Props) {
  const [editDestination, setEditDestination] = useState(link.destination);
  const [editDescription, setEditDescription] = useState(
    link.description || ''
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
        setEditDestination(link.destination);
        setEditDescription(link.description || '');
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {link.slug}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="destination" className="text-sm font-medium">
              Destination URL
            </label>
            <Input
              id="destination"
              defaultValue={link.destination}
              onChange={(e) => setEditDestination(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              defaultValue={link.description || ''}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>
        </form>

        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose asChild>
            <Button onClick={() => handleUpdateLink(link._id)}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
