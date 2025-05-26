"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type AuthContextType = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  
  useEffect(() => {
    let didSettle = false;
    let timeoutId: NodeJS.Timeout | number | undefined;

    async function getUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Supabase getUser error:', error);
        }
        console.log('Supabase getUser result:', user);
        setUser(user);
      } catch (err) {
        console.error('Error in getUser:', err);
      } finally {
        setLoading(false);
        didSettle = true;
      }
    }

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Supabase auth state change:', event, session);
        setUser(session?.user || null);
        setLoading(false);
        didSettle = true;
      }
    );

    // Timeout fallback: if nothing resolves in 5s, set loading to false
    timeoutId = setTimeout(() => {
      if (!didSettle) {
        setLoading(false);
        console.warn('AuthProvider: Timed out waiting for getUser or auth state change.');
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    }
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 