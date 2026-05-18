"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    setTimeout(() => {
      setIsLogged(!!token);
    }, 0);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center px-10 h-[90px] border-b border-[#272C35] bg-[#0B0E13] shrink-0 w-full z-50">
      <Link href="/" className="font-irish text-[48px] leading-none text-[#F9FAFB] hover:opacity-90 transition-opacity">
        {"<M/>"}
      </Link>
      
      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-white hover:text-[#07B6D5] transition-colors">Home</Link>
          <Link href="/" className="text-white hover:text-[#07B6D5] transition-colors">Artigos</Link>
          
          {isLogged ? (
            <>
              <Link href="/novo-artigo" className="text-[#07B6D5] hover:underline transition-colors">Nova Publicação</Link>
              <button 
                onClick={handleLogout} 
                className="text-red-400 hover:text-red-500 transition-colors font-medium ml-2"
              >
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="text-[#07B6D5] hover:underline transition-colors font-medium">
              Entrar
            </Link>
          )}
        </nav>
        
        <div className="h-5 border-l border-[#2B303B] mx-2"></div>
        
        <button aria-label="Toggle Theme" className="text-white hover:text-[#07B6D5] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}