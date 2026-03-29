"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/contexts/AuthContext";
import { signInWithGoogle, signOutUser } from "@/lib/firebase/auth";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by not rendering anything that depends on client state until mounted
  if (!mounted) {
    return (
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
        <div className="navbar-start">
          <Link href={user ? "/app" : "/"} className="btn btn-ghost normal-case text-xl text-primary gap-3">
            <Image src="/logo.png" alt="Platfrmr Logo" width={64} height={64} className="object-contain" />
            Platfrmr
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
        </div>
        <div className="navbar-end">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="navbar-start">
        {!user && (
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link href="/" className="hover:text-primary hover:bg-primary/10 active:bg-primary/20">Home</Link></li>
              <li><Link href="/#features" className="hover:text-primary hover:bg-primary/10 active:bg-primary/20">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary hover:bg-primary/10 active:bg-primary/20">Pricing</Link></li>
            </ul>
          </div>
        )}
        <Link href={user ? "/app" : "/"} className="btn btn-ghost normal-case text-xl text-primary gap-3">
          <Image src="/logo.png" alt="Platfrmr Logo" width={44} height={44} className="object-contain" />
          Platfrmr
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        {!user && (
          <ul className="menu menu-horizontal px-1 gap-2">
            <li><Link href="/" className="hover:text-primary hover:bg-primary/10 active:bg-primary/20 font-medium">Home</Link></li>
            <li><Link href="/#features" className="hover:text-primary hover:bg-primary/10 active:bg-primary/20 font-medium">Features</Link></li>
            <li><Link href="/#pricing" className="hover:text-primary hover:bg-primary/10 active:bg-primary/20 font-medium">Pricing</Link></li>
          </ul>
        )}
      </div>
      <div className="navbar-end">
        {loading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="avatar" />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title px-4 py-2 flex flex-col items-start gap-0">
                <span className="opacity-50 text-xs text-left w-full">Logged in as</span>
                <span className="font-medium truncate w-full text-left">{user.email}</span>
              </li>
              <li><div className="divider my-0"></div></li>
              <li><Link href="/settings">Settings</Link></li>
              <li><Link href="/upgrade">Upgrade</Link></li>
              <li><button onClick={signOutUser} className="text-error">Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link href="/signin"  className="btn btn-primary">Sign In</Link>
        )}
      </div>
    </div>
  );
}
