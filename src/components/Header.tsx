"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MindLogo } from "./Icons";

export default function Header() {
  const [isLogged, setIsLogged] = useState<boolean | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({ nome: "", email: "", foto_url: "" });
  
  const [avatarImgError, setAvatarImgError] = useState(false);
  const [dropdownImgError, setDropdownImgError] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    if (token) {
      setIsLogged(true);
      fetch("http://localhost:3333/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.nome) {
            setUserData({ nome: data.nome, email: data.email, foto_url: data.foto_url || "" });
            setAvatarImgError(false);
            setDropdownImgError(false);
          }
        })
        .catch(() => console.error("Erro ao carregar dados do header"));
    } else {
      setIsLogged(false);
    }
  }, [pathname]);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    setIsDropdownOpen(false);
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center px-10 h-[90px] border-b border-[#272C35] bg-[#0B0E13] shrink-0 w-full relative z-50">
      {/* Logo */}
      <Link href="/" className="font-irish text-[48px] leading-none text-[#F9FAFB] hover:opacity-90 transition-opacity">
        <MindLogo />
      </Link>
      
      {/* Navegação e Ações da Direita */}
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6 text-[16px] font-medium">
          <Link href="/" className="text-white hover:text-[#07B6D5] transition-colors">Home</Link>
          <Link href="/artigos" className="text-white hover:text-[#07B6D5] transition-colors">Artigos</Link>
        </nav>
        
        <div className="h-6 border-l border-[#2B303B]"></div>
        
        {/* Botão Tema */}
        <button aria-label="Toggle Theme" className="text-white hover:text-[#07B6D5] transition-colors flex items-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        {/* Estado Autenticado */}
        {isLogged !== null && (
          <div className="flex items-center">
            {isLogged ? (
              /* Botão do Avatar */
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="w-[32px] h-[34px] bg-[#FFFFFF] overflow-hidden transition-all flex items-center justify-center shrink-0 relative"
              >
                {userData.foto_url && !avatarImgError ? (
                  <img 
                    src={userData.foto_url} 
                    alt="" 
                    onError={() => setAvatarImgError(true)}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-md select-none text-[#0B0E13] font-bold">👨‍💻</span>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-white hover:text-[#07B6D5] transition-colors font-medium text-sm">
                  Entrar
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* USER DROPDOWN - Alinhado 100% com o CSS do Figma
        Injetado diretamente na raiz do Header para respeitar o right e top absoluto
      */}
      {isLogged && isDropdownOpen && (
        <div 
          ref={dropdownRef}
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0px',
            position: 'absolute',
            width: '203.26px',
            height: '198px',
            right: '39.74px',
            top: '70px',
            background: '#0B0E13',
            border: '1px solid #2B303B',
            flex: 'none',
            order: 3,
            flexGrow: 0,
            zIndex: 99, // Aumentado para garantir sobreposição total
          }}
        >
          {/* Cabeçalho do Dropdown: Foto + Detalhes do Usuário */}
          <div className="flex items-center gap-3 p-3 w-full border-b border-[#2B303B] overflow-hidden select-none">
            <div className="w-[32px] h-[34px] shrink-0 bg-[#FFFFFF] overflow-hidden flex items-center justify-center">
              {userData.foto_url && !dropdownImgError ? (
                <img 
                  src={userData.foto_url} 
                  alt="" 
                  onError={() => setDropdownImgError(true)}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-sm select-none text-[#0B0E13] font-bold">👨‍💻</span>
              )}
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-[16px] text-white font-medium truncate leading-tight w-full">
                {userData.nome || "John Doe"}
              </span>
              <span className="text-[14px] text-[#9DA6AF] truncate font-light mt-0.5 w-full">
                {userData.email || "johndoe@email.com"}
              </span>
            </div>
          </div>

          {/* Links e Ações */}
          <div className="flex flex-col w-full flex-grow justify-between py-1 bg-[#0B0E13]">
            <Link 
              href="/dashboard" 
              onClick={() => setIsDropdownOpen(false)} 
              className="flex items-center gap-3 w-full px-4 py-2.5 text-[14px] text-white hover:bg-[#14181F] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9DA6AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Dashboard
            </Link>

            <Link 
              href="/configuracoes" 
              onClick={() => setIsDropdownOpen(false)} 
              className="flex items-center gap-3 w-full px-4 py-2.5 text-[14px] text-white border-b border-[#2B303B] pb-3 hover:bg-[#14181F] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9DA6AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Configurações
            </Link>

            <button 
              onClick={handleLogout} 
              className="flex items-center gap-3 w-full px-4 py-2 text-[14px] text-white hover:bg-red-500/10 hover:text-red-400 transition-colors text-left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9DA6AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  );
}