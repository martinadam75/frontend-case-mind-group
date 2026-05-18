"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const router = useRouter();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    // Validação local rápida antes de estressar a API
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3333/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        setSucesso("Conta criada com sucesso! Redirecionando...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setErro(data.message || "Erro ao criar conta.");
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E13] text-[#F9FAFB] font-sans">
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
            <form onSubmit={handleCadastro} className="flex flex-col gap-4">
              
              {/* Campo Nome Completo */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-white">Nome Completo</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="h-[44px] px-3 bg-[#14181F] border border-[#2B303B] text-[14px] text-[#9DA6AF] outline-none focus:border-[#07B6D5] w-full transition-colors"
                  required
                />
              </div>

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
                <label className="text-[12px] font-medium text-white">Senha</label>
                <input
                  type="password"
                  placeholder="*********"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="h-[44px] px-3 bg-[#14181F] border border-[#2B303B] text-[14px] text-[#9DA6AF] outline-none focus:border-[#07B6D5] w-full transition-colors"
                  required
                />
              </div>

              {/* Campo Confirmar Senha */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-white">Confirmar senha</label>
                <input
                  type="password"
                  placeholder="*********"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="h-[44px] px-3 bg-[#14181F] border border-[#2B303B] text-[14px] text-[#9DA6AF] outline-none focus:border-[#07B6D5] w-full transition-colors"
                  required
                />
              </div>

              {/* Feedbacks Visuais */}
              {erro && <p className="text-red-500 text-xs text-center font-medium">{erro}</p>}
              {sucesso && <p className="text-emerald-400 text-xs text-center font-medium">{sucesso}</p>}

              {/* Botão Criar Conta */}
              <button
                type="submit"
                className="h-[32px] w-full bg-[#07B6D5] text-[#0B0E13] text-[14px] font-medium flex justify-center items-center gap-2 hover:bg-opacity-90 transition-all mt-2"
              >
                {/* Ícone de Usuários/Cadastro */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Criar conta
              </button>
            </form>

            <div className="w-full border-t border-[#2B303B] my-2"></div>

            <div className="text-center text-[12px]">
              <span className="text-[#9DA6AF] font-light">Já tem uma conta? </span>
              <Link href="/login" className="text-white font-medium hover:underline">Fazer login</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}