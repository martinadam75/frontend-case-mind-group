"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatarData } from "@/utils/formatDate";

interface Artigo {
  id: number;
  titulo: string;
  conteudo: string;
  imagem_banner: string | null;
  autor_id: number;
  autor_name: string;
  data_publicacao: string;
}

export default function Dashboard() {
  const [meusArtigos, setMeusArtigos] = useState<Artigo[]>([]);
  const [usuarioNome, setUsuarioNome] = useState("Escritor");
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar a exibição do Modal de exclusão
  const [artigoParaExcluir, setArtigoParaExcluir] = useState<number | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      
      const nomeExibicao = payload.email ? payload.email.split("@")[0] : "User";
      setUsuarioNome(nomeExibicao.charAt(0).toUpperCase() + nomeExibicao.slice(1));

      fetch("http://localhost:3333/api/articles")
        .then((res) => res.json())
        .then((data) => {
          const filtrados = data.filter((art: any) => art.autor_id === payload.id);
          setMeusArtigos(filtrados);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));

    } catch (error) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  // Abre o modal e guarda qual ID será excluído
  const solicitarExclusao = (id: number) => {
    setArtigoParaExcluir(id);
  };

  // Fecha o modal
  const cancelarExclusao = () => {
    setArtigoParaExcluir(null);
  };

  // Executa a exclusão na API
  const confirmarExclusao = async () => {
    if (!artigoParaExcluir) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3333/api/articles/${artigoParaExcluir}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMeusArtigos(meusArtigos.filter((artigo) => artigo.id !== artigoParaExcluir));
      } else {
        alert("Erro ao tentar deletar o artigo.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    } finally {
      // Fecha o modal independentemente do sucesso ou erro
      setArtigoParaExcluir(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E13] text-[#F9FAFB] font-sans relative">
      <Header />

      <main className="max-w-[1240px] mx-auto w-full py-10 px-4 flex flex-col gap-10 flex-grow">
        
        {/* Bloco Superior: Boas-vindas e Botões de Ação */}
        <section className="flex justify-between items-center w-full border-b border-[#2B303B] pb-6">
          <div>
            <h1 className="text-[36px] font-medium text-white tracking-tight">Dashboard</h1>
            <p className="text-lg font-light text-[#9DA6AF] mt-1">Bem-vindo de volta, {usuarioNome}!</p>
          </div>
          <div className="flex gap-2">
            <Link href="/editar-perfil" className="h-[35px] px-4 bg-[#14181F] border border-[#2B303B] text-[#F9FAFB] text-sm font-medium flex items-center gap-2 hover:bg-[#202631] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Configurações
            </Link>
            <Link href="/editar-artigo/novo" className="h-[35px] px-4 bg-[#07B6D5] text-[#0B0E13] text-sm font-medium flex items-center gap-2 hover:bg-opacity-90 transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Novo Artigo
            </Link>
          </div>
        </section>

        {/* Grade de Big Numbers */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <div className="p-4 bg-[#14181F] border border-[#2B303B] h-[108px] flex flex-col justify-between">
            <div className="flex justify-between items-center text-sm text-[#9DA6AF] font-light">
              <span>Total de Artigos</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <span className="text-[32px] font-light text-white leading-none">{meusArtigos.length}</span>
          </div>

          <div className="p-4 bg-[#14181F] border border-[#2B303B] h-[108px] flex flex-col justify-between">
            <div className="flex justify-between items-center text-sm text-[#9DA6AF] font-light">
              <span>Engajamento</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <span className="text-[32px] font-light text-white leading-none">4</span>
          </div>

          <div className="p-4 bg-[#14181F] border border-[#2B303B] h-[108px] flex flex-col justify-between">
            <div className="flex justify-between items-center text-sm text-[#9DA6AF] font-light">
              <span>Curtidas</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </div>
            <span className="text-[32px] font-light text-white leading-none">20</span>
          </div>

          <div className="p-4 bg-[#14181F] border border-[#2B303B] h-[108px] flex flex-col justify-between">
            <div className="flex justify-between items-center text-sm text-[#9DA6AF] font-light">
              <span>Tempo médio de leitura</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            </div>
            <span className="text-[32px] font-light text-white leading-none">8 <span className="text-lg">min</span></span>
          </div>
        </section>

        {/* Layout de Duas Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start w-full">
          
          {/* Coluna da Esquerda: Meus Artigos */}
          <section className="lg:col-span-2 border border-[#2B303B] bg-[#0B0E13] flex flex-col">
            <div className="p-4 border-b border-[#2B303B]">
              <h2 className="text-xl font-normal text-white">Meus Artigos</h2>
            </div>

            {loading ? (
              <p className="p-6 text-[#9DA6AF] text-center">Buscando suas publicações...</p>
            ) : meusArtigos.length === 0 ? (
              <p className="p-6 text-[#9DA6AF] text-center">Você ainda não publicou nenhum artigo. Clique em "Novo Artigo" para estrear!</p>
            ) : (
              <div className="flex flex-col">
                {meusArtigos.map((artigo) => (
                  <div key={artigo.id} className="p-6 border-b border-[#2B303B] flex flex-col md:flex-row gap-6 items-start justify-between last:border-none">
                    <div className="flex flex-col md:flex-row gap-6 items-start w-full">
                      {/* Imagem do Artigo */}
                      <div className="w-[124px] h-[80px] bg-[#272C35] shrink-0 overflow-hidden flex items-center justify-center">
                        {artigo.imagem_banner ? (
                          <img src={artigo.imagem_banner} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-[#9DA6AF] font-irish">Lorem Ipsum</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 flex-grow">
                        <h3 className="text-base font-semibold text-white line-clamp-1">{artigo.titulo}</h3>
                        <p className="text-sm text-white opacity-70 line-clamp-1">{artigo.conteudo}</p>
                        <div className="flex items-center gap-3 text-xs text-[#9DA6AF] mt-2">
                          <span>{formatarData(artigo.data_publicacao)}</span>
                          <span className="w-1 h-1 bg-[#9DA6AF] rounded-full"></span>
                          <span className="flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            2
                          </span>
                          <span className="w-1 h-1 bg-[#9DA6AF] rounded-full"></span>
                          <span className="flex items-center gap-1">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            1
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                      <Link 
                        href={`/editar-artigo/${artigo.id}`}
                        className="h-[35px] w-full md:w-[96px] bg-[#14181F] border border-[#2B303B] text-[#F9FAFB] text-xs font-normal flex justify-center items-center gap-1 hover:bg-[#202631]"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Editar
                      </Link>
                      <button
                        onClick={() => solicitarExclusao(artigo.id)}
                        className="h-[35px] w-full md:w-[96px] bg-[#14181F] border border-[#2B303B] text-[#EF4343] text-xs font-normal flex justify-center items-center gap-1 hover:bg-red-950/20"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Coluna da Direita: Atividades Recentes */}
          <section className="border border-[#2B303B] bg-[#0B0E13] flex flex-col">
            <div className="p-4 border-b border-[#2B303B]">
              <h2 className="text-xl font-normal text-white">Atividade Recente</h2>
            </div>
            <div className="flex flex-col">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4 border-b border-[#2B303B] flex gap-3 items-center last:border-none">
                  <div className="w-[50px] h-[50px] rounded-full bg-[#272C35] shrink-0 flex items-center justify-center text-sm">
                    👩‍💻
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-[#F9FAFB] leading-tight">
                      <span className="font-semibold">Marie Smith</span> comentou em <span className="text-white cursor-pointer hover:underline">O Futuro da Inteligência Artificial em 2025</span>
                    </p>
                    <span className="text-xs text-[#9DA6AF] flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      5 min atrás
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />

      {/* Modal de Exclusão (Overlay + Janela) */}
      {artigoParaExcluir !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0E13]/80 backdrop-blur-sm px-4">
          <div className="bg-[#0B0E13] border border-[#2B303B] w-full max-w-[558px] p-6 flex flex-col gap-4 shadow-2xl">
            <h2 className="text-[24px] font-medium text-white leading-none">Excluir Artigo</h2>
            <p className="text-[16px] font-light text-[#9DA6AF]">
              Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex justify-end gap-3 w-full mt-2">
              <button 
                onClick={cancelarExclusao}
                className="h-[40px] px-6 bg-[#14181F] border border-[#2B303B] text-[#F9FAFB] text-sm font-normal hover:bg-[#202631] transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarExclusao}
                className="h-[40px] px-6 bg-red-500/10 border border-[#EF4343] text-[#EF4343] text-sm font-medium hover:bg-red-500/20 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}