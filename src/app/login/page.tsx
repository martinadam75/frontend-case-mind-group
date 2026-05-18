"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await fetch("http://localhost:3333/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salva o token no localStorage para usarmos depois nas rotas restritas
        localStorage.setItem("token", data.token);
        // Redireciona para a Home ou Listagem de Artigos
        router.push("/"); 
      } else {
        setErro(data.message || "Erro ao fazer login");
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E13] text-[#F9FAFB] font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center px-10 h-[90px] border-b border-[#272C35] shrink-0">
        <div className="font-irish text-[48px] leading-none">{"<M/>"}</div>
        <div className="flex items-center gap-4">
          <nav className="flex gap-4 text-sm font-medium">
            <Link href="/" className="text-white hover:text-[#07B6D5] transition-colors">Home</Link>
            <Link href="/" className="text-white hover:text-[#07B6D5] transition-colors">Artigos</Link>
          </nav>
          <div className="h-5 border-l border-[#2B303B] mx-2"></div>
          <button aria-label="Toggle Theme">
            {/* Ícone de Lua */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center py-12">
        <div className="flex flex-col items-center gap-[24px] w-full max-w-[471px]">
          <div className="font-irish text-[48px] leading-none mb-2">{"<M/>"}</div>
          
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-[32px] font-bold text-white leading-tight">Entrar na Plataforma</h1>
            <p className="text-[18px] font-light text-[#9DA6AF]">Acesse sua conta para gerenciar seus artigos</p>
          </div>

          <div className="w-[343px] p-[24px] border border-[#2B303B] bg-[#14181F] mt-4 flex flex-col gap-4">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {/* Campo Email */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-white">Email</label>
                <input
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[44px] px-3 bg-[#14181F] border border-[#2B303B] text-[14px] text-[#9DA6AF] outline-none focus:border-[#07B6D5] w-full transition-colors"
                  required
                />
              </div>

              {/* Campo Senha */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-medium text-white">Senha</label>
                  <a href="#" className="text-[12px] font-light text-[#9DA6AF] hover:text-white">Esqueceu a senha?</a>
                </div>
                <input
                  type="password"
                  placeholder="*********"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="h-[44px] px-3 bg-[#14181F] border border-[#2B303B] text-[14px] text-[#9DA6AF] outline-none focus:border-[#07B6D5] w-full transition-colors"
                  required
                />
              </div>

              {/* Exibição de Erro */}
              {erro && <p className="text-red-500 text-xs text-center">{erro}</p>}

              {/* Botão Entrar */}
              <button
                type="submit"
                className="h-[32px] w-full bg-[#07B6D5] text-[#0B0E13] text-[14px] font-medium flex justify-center items-center gap-2 hover:bg-opacity-90 transition-all mt-2"
              >
                {/* Ícone de Entrar */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                </svg>
                Entrar
              </button>
            </form>

            <div className="w-full border-t border-[#2B303B] my-2"></div>

            <div className="text-center text-[12px]">
              <span className="text-[#9DA6AF] font-light">Não tem uma conta? </span>
              <Link href="/cadastro" className="text-white font-medium hover:underline">Criar conta</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#14181F] border-t border-[#272C35] px-10 py-[60px] flex flex-col gap-[36px] shrink-0 mt-auto">
        <div className="max-w-[1360px] mx-auto w-full flex justify-between items-start">
          <div className="flex flex-col gap-1 w-[308px]">
            <div className="font-irish text-[32px] leading-none mb-1">{"<M/>"}</div>
            <p className="text-[14px] text-[#9DA6AF]">Seu portal de tecnologia com artigos, tutoriais e novidades do mundo tech.</p>
          </div>

          <div className="flex gap-[100px]">
            <div className="flex flex-col gap-3">
              <h3 className="text-[16px] font-semibold text-white mb-1">Navegação</h3>
              <Link href="/" className="text-[16px] text-[#9DA6AF] hover:text-white">Home</Link>
              <Link href="/" className="text-[16px] text-[#9DA6AF] hover:text-white">Artigos</Link>
              <Link href="/" className="text-[16px] text-[#9DA6AF] hover:text-white">Dashboard</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="text-[12px] font-semibold text-white mb-1 uppercase tracking-wider">Redes Sociais</h3>
              <div className="flex gap-2 text-[#9DA6AF]">
                <a href="#" className="hover:text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="hover:text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
                <a href="#" className="hover:text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1360px] mx-auto border-t border-[#272C35]"></div>
        
        <div className="w-full text-center text-[12px] text-[#9DA6AF] font-light">
          © 2025 TechBlog. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}