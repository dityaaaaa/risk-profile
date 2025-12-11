import React, { useState, useEffect } from 'react';
import { User, UserRole, UserCreate } from '../../types/user';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserCreate) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, loading }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setFullName(user.full_name || '');
      setRole(user.role);
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!user && !password) {
      newErrors.password = 'Password is required for new users';
    } else if (password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data: UserCreate = {
      email,
      full_name: fullName || undefined,
      password: password || 'unchanged', // Backend will handle this
      role,
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          aria-label="Full Name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password {user && '(leave empty to keep unchanged)'}
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={user ? 'Leave empty to keep current' : 'Enter password'}
          aria-label="Password"
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          aria-label="Role"
        >
          <option value={UserRole.USER}>User</option>
          <option value={UserRole.ERM}>ERM</option>
          <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
        </Select>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};
