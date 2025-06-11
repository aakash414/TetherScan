"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, BarChart2, BriefcaseIcon, FolderGit2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserAccountNav } from '@/components/user-account-nav';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

const routes = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Job Board', path: '/jobs', icon: BriefcaseIcon },
  { name: 'Projects', path: '/projects', icon: FolderGit2 },
];

export function Navbar() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!user) {
    return null; // Don't render navbar if user is not authenticated
  }

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-in-out',
      isScrolled ? 'pt-4' : 'pt-8'
    )}>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 50, damping: 15, delay: 0.2 }}
        className={cn(
          'transition-all duration-300 ease-in-out w-full max-w-2xl',
          isScrolled ? 'rounded-full shadow-lg border border-[#ede7de]/80 bg-[#ede7de]/60 backdrop-blur-lg' : 'bg-transparent'
        )}
      >
        <div className="flex items-center justify-between h-16 px-8">
          <nav className="flex-1 flex items-center justify-center gap-2">
            <AnimatePresence>
              {routes.map((route, i) => (
                <motion.div
                  key={route.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <Link href={route.path} passHref>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-[#006D77] dark:text-[#83C5BE] hover:bg-[#006c772d] rounded-full"
                    >
                      <route.icon className="h-5 w-5" />
                      {route.name}
                    </Button>
                  </Link>
                </motion.div>
              ))}
              <UserAccountNav user={user} />
            </AnimatePresence>
          </nav>
          {/* <div className="flex-1 flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" className="text-[#006D77] dark:text-[#83C5BE] rounded-full hover:bg-[#006c772d]">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#006D77] dark:text-[#83C5BE] rounded-full hover:bg-[#006c772d]">
              <Settings className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div> */}
        </div>
      </motion.div>
    </header>
  );
}

