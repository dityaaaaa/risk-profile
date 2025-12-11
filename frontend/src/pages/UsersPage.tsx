import React, { useState, useEffect } from 'react';
import { User, UserCreate } from '../types/user';
import { usersApi } from '../api/users';
import { UserTable } from '../components/users/UserTable';
import { UserDialog } from '../components/users/UserDialog';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/useToast';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getAllUsers();
      setUsers(data);
    } catch (error: any) {
      showError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setEditingUser(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: UserCreate) => {
    setSubmitting(true);
    try {
      if (editingUser) {
        await usersApi.updateUser(editingUser.id, data);
        showSuccess('User updated successfully');
      } else {
        await usersApi.createUser(data);
        showSuccess('User created successfully');
      }
      await fetchUsers();
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Operation failed';
      showError(message);
      throw error; // Re-throw to prevent dialog from closing
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await usersApi.deleteUser(userId);
      showSuccess('User deleted successfully');
      await fetchUsers();
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to delete user';
      showError(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={handleCreate}>Create New User</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </CardContent>
      </Card>

      <UserDialog
        open={dialogOpen}
        user={editingUser}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </div>
  );
};
