import React from "react";
import { FaUser } from "react-icons/fa6";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignInButton } from "@/components/signin-button";
import { SignOutButton } from "@/components/signout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function UserAccountNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user profile data if user exists
  const { data: profile } = user
    ? await supabase
        .from('users')
        .select('name, profile_image')
        .eq('id', user.id)
        .single()
    : { data: null };

  if (!user) {
    return <SignInButton />;
  }

  const userInitial = profile?.name 
    ? profile.name.charAt(0).toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="w-max space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-1">
          <Avatar>
            <AvatarImage 
              src={profile?.profile_image || user.user_metadata?.avatar_url} 
              alt={profile?.name || user.email || "User"} 
            />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {profile?.name && (
                <p className="font-medium">{profile.name}</p>
              )}
              {user.email && (
                <p className="text-muted-foreground w-[200px] truncate text-sm">
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
