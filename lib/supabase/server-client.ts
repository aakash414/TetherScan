import { type CookieOptions, createServerClient as _createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import type { Database } from '@/lib/database.types';

type SupabaseClient = ReturnType<typeof _createServerClient<Database>>;

export function createSupabaseServerClient(cookieStore: ReadonlyRequestCookies | Promise<ReadonlyRequestCookies>): SupabaseClient | Promise<SupabaseClient> {
  // Handle case where cookies() returns a Promise
  if (cookieStore instanceof Promise) {
    return cookieStore.then(store => createSupabaseServerClient(store) as SupabaseClient);
  }
  if (!cookieStore) {
    console.error('CRITICAL: cookieStore is undefined in createSupabaseServerClient');
    throw new Error('cookieStore is undefined in createSupabaseServerClient. This should not happen.');
  }
  return _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Server-side components and API routes should not typically set cookies directly
          // This is more for auth actions or middleware. If needed, ensure cookieStore.set is available.
          // For read-only operations, this might not be strictly necessary.
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // Log error if cookie setting is attempted in a read-only context
            console.info('Info: cookieStore.set called in a context where it might not be available or allowed.', name, error);
          }
        },
        remove(name: string, options: CookieOptions) {
          // Similar to set, ensure cookieStore.delete is available if needed.
          try {
            cookieStore.delete({ name, ...options });
          } catch (error) {
            console.info('Info: cookieStore.delete called in a context where it might not be available or allowed.', name, error);
          }
        },
      },
    }
  );
}
