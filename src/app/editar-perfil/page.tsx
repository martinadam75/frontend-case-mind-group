"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatarData } from "@/utils/formatDate";

export default function Configuracoes() {
  const router = useRouter();
  
  // Estados dinâmicos dos campos baseados no banco
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [dataMembro, setDataMembro] = useState("");

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Busca os dados reais do perfil persistidos no banco de dados
    async function carregarPerfil() {
      try {
        const response = await fetch("http://localhost:3333/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNome(data.nome || "");
          setEmail(data.email || "");
          setFotoUrl(data.foto_url || "");
          setBio(data.bio || "");
          setDataMembro(data.created_at || new Date().toISOString());
        } else {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (error) {
        setErro("Erro de conexão ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, [router]);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3333/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          foto_url: fotoUrl,
          bio,
        }),
      });

      if (response.ok) {
        alert("Perfil atualizado com sucesso no banco de dados! 🚀");
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setErro(data.message || "Erro ao salvar alterações.");
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0E13] text-[#F9FAFB]">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-[#9DA6AF]">Carregando configurações de perfil...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E13] text-[#F9FAFB] font-sans">
      <Header />

      <main className="flex flex-col items-center py-12 px-4 flex-grow w-full">
        <div className="w-full max-w-[640px] flex flex-col gap-10">
          
          {/* Voltar e Logout */}
          <div className="w-full border-b border-[#2B303B] pb-6 flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-4 text-white hover:text-[#07B6D5] transition-colors font-medium w-fit">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Voltar ao Dashboard
            </Link>
            
            <button onClick={handleLogout} className="text-red-400 hover:text-red-500 text-sm font-medium transition-colors">
              Sair da conta
            </button>
          </div>

          {/* Títulos */}
          <div>
            <h1 className="text-[36px] font-medium text-white leading-none">Configurações do Perfil</h1>
            <p className="text-sm text-[#9DA6AF] mt-2 font-light">Gerencie suas informações pessoais</p>
          </div>

          {/* Container Principal */}
          <div className="w-full border border-[#2B303B] bg-[#0B0E13] p-9 flex flex-col items-center gap-10">
            
            {erro && <p className="text-red-500 text-sm font-medium w-full text-center">{erro}</p>}

            {/* Bloco de Imagem */}
            <div className="flex flex-col items-center gap-3 w-full max-w-[568px]">
              <div className="w-[130px] h-[130px] bg-[#272C35] overflow-hidden flex items-center justify-center shrink-0 border border-[#2B303B]">
                {fotoUrl ? (
                  <img src={fotoUrl} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full mt-2">
                <label className="text-[14px] text-white font-medium">Foto de Perfil</label>
                <input
                  type="text"
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="h-[44px] px-3 bg-[#14181F] border border-[#2B303B] text-[14px] text-white outline-none focus:border-[#07B6D5] w-full transition-colors"
                />
                <span className="text-[12px] text-[#9DA6AF] font-light">Adicione uma URL de imagem ou deixe em branco</span>
              </div>
            </div>

            {/* Formulário Restante */}
            <form onSubmit={handleSalvar} className="w-full max-w-[568px] flex flex-col gap-4">
              
              {/* Nome Completo */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[12px] text-white mb-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  Nome Completo
                </div>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="h-[44px] px-3 bg-[#14181F] border border-[#2B303B] text-[14px] text-white outline-none focus:border-[#07B6D5] w-full transition-colors"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[12px] text-white mb-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  Email
                </div>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="h-[44px] px-3 bg-[#14181F] border border-[#2B303B] text-[14px] text-[#9DA6AF] outline-none w-full cursor-not-allowed opacity-60"
                />
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-[12px] text-white font-medium">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                  placeholder="Conte um pouco sobre sua experiência técnica..."
                  className="h-[114px] p-3 bg-[#14181F] border border-[#2B303B] text-[14px] text-white outline-none focus:border-[#07B6D5] w-full transition-colors resize-none leading-relaxed"
                />
                <span className="text-[10px] text-[#9DA6AF] font-light mt-1">{bio.length}/500 caracteres</span>
              </div>

              {/* Informações da conta */}
              <div className="flex flex-col gap-6 w-full border-t border-[#2B303B] pt-6 mt-4">
                <h3 className="text-[14px] font-medium text-white">Informações da conta</h3>
                <div className="flex gap-[100px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] text-[#9DA6AF]">Tipo de conta</span>
                    <span className="text-[14px] text-white font-medium">Admin</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] text-[#9DA6AF]">Membros desde</span>
                    <span className="text-[14px] text-white font-medium">{formatarData(dataMembro)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={salvando}
                  className="h-[36px] w-full bg-[#07B6D5] text-[#0B0E13] text-[14px] font-medium flex justify-center items-center hover:bg-opacity-90 transition-all mt-4 disabled:opacity-50"
                >
                  {salvando ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>

            </form>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}