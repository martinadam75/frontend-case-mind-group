"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
        localStorage.setItem("token", data.token);
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
      {/* Header Reutilizável */}
      <Header />

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

      {/* Footer Reutilizável */}
      <Footer />
    </div>
  );
}