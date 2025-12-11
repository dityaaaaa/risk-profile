import React from 'react';
import { User, UserCreate } from '../../types/user';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { UserForm } from './UserForm';

interface UserDialogProps {
  open: boolean;
  user?: User;
  onClose: () => void;
  onSubmit: (data: UserCreate) => Promise<void>;
  loading: boolean;
}

export const UserDialog: React.FC<UserDialogProps> = ({
  open,
  user,
  onClose,
  onSubmit,
  loading,
}) => {
  const handleSubmit = async (data: UserCreate) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Create New User'}</DialogTitle>
        </DialogHeader>
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};
