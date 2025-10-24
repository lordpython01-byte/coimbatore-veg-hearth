import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.rpc('verify_admin_password', {
      admin_email: email,
      admin_password: password,
    });

    if (error) {
      throw new Error('Authentication failed');
    }

    if (!data || data.length === 0) {
      throw new Error('Invalid credentials');
    }

    const adminUser = data[0];

    await supabase.rpc('update_admin_last_login', {
      admin_id: adminUser.id,
    });

    const userInfo: AdminUser = {
      id: adminUser.id,
      email: adminUser.email,
      full_name: adminUser.full_name,
      is_active: adminUser.is_active,
    };

    setUser(userInfo);
    localStorage.setItem('admin_user', JSON.stringify(userInfo));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
