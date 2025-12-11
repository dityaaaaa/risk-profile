import React, { useState } from 'react';
import { User } from '../../types/user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  loading: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, loading }) => {
  const { user: currentUser } = useAuth();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setDeletingId(userId);
      try {
        await onDelete(userId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const canDelete = (user: User): boolean => {
    return currentUser?.id !== user.id;
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.full_name || '-'}</TableCell>
            <TableCell>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                {user.role}
              </span>
            </TableCell>
            <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(user)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(user.id)}
                  disabled={!canDelete(user) || deletingId === user.id}
                  title={!canDelete(user) ? 'Cannot delete yourself' : ''}
                >
                  {deletingId === user.id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
