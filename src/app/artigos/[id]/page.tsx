"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatarData } from "@/utils/formatDate";

interface Artigo {
  id: number;
  titulo: string;
  conteudo: string;
  resumo: string | null;
  categoria: string | null;
  tags: string | null;
  imagem_banner: string | null;
  autor_nome: string;
  data_publicacao: string;
}

interface Comentario {
  id: number;
  content: string;
  autor_nome: string;
  created_at: string;
}

export default function DetalheArtigo() {
  const { id } = useParams();
  const [artigo, setArtigo] = useState<Artigo | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLogged(true);

    // Buscar Artigo
    fetch(`http://localhost:3333/api/articles`)
      .then((res) => res.json())
      .then((data: Artigo[]) => {
        const artigoEncontrado = data.find((a) => a.id === Number(id));
        setArtigo(artigoEncontrado || null);
      })
      .catch((err) => console.error("Erro ao buscar artigo:", err))
      .finally(() => setLoading(false));

    // Buscar Comentários
    fetchComentarios();
  }, [id]);

  const fetchComentarios = () => {
    fetch(`http://localhost:3333/api/articles/${id}/comments`)
      .then((res) => res.json())
      .then((data) => setComentarios(data))
      .catch((err) => console.error("Erro ao carregar comentários:", err));
  };

  const handleComentar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    setEnviando(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3333/api/articles/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: novoComentario }),
      });

      if (response.ok) {
        setNovoComentario("");
        fetchComentarios(); // Recarrega os comentários para aparecer na hora
      }
    } catch (error) {
      alert("Erro ao publicar comentário.");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0E13] text-[#F9FAFB]"><Header /><main className="flex-grow flex items-center justify-center"><p className="text-[#9DA6AF]">Carregando conteúdo...</p></main><Footer /></div>
    );
  }

  if (!artigo) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0E13] text-[#F9FAFB]"><Header /><main className="flex-grow flex flex-col items-center justify-center gap-4"><h1 className="text-2xl font-bold">Artigo não encontrado</h1><Link href="/artigos" className="text-[#07B6D5] hover:underline">Voltar para a lista</Link></main><Footer /></div>
    );
  }

  let listaTags: string[] = [];
  try { if (artigo.tags) listaTags = JSON.parse(artigo.tags); } catch (e) {}

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E13] text-[#F9FAFB] font-sans">
      <Header />

      <div className="w-full border-b border-[#2B303B] px-10 py-4 flex justify-center">
        <div className="w-full max-w-[1360px]">
          <Link href="/artigos" className="flex items-center gap-4 text-white hover:text-[#07B6D5] transition-colors font-medium w-fit">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Voltar aos Artigos
          </Link>
        </div>
      </div>

      <main className="flex flex-col items-center py-12 px-4 flex-grow w-full">
        <article className="w-full max-w-[720px] flex flex-col gap-10">
          
          {artigo.categoria && (
            <div className="bg-[#F5993D] text-[#0B0E13] px-3 py-1 text-sm font-medium w-fit">
              {artigo.categoria}
            </div>
          )}

          <header className="flex flex-col gap-4">
            <h1 className="text-[48px] md:text-[64px] font-normal leading-[1.1] text-white">
              {artigo.titulo}
            </h1>
            {artigo.resumo && (
              <p className="text-[20px] md:text-[24px] font-medium text-[#9DA6AF] leading-snug">
                {artigo.resumo}
              </p>
            )}
          </header>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-y border-[#2B303B] gap-6">
            <div className="flex items-center gap-4">
              <div className="w-[60px] h-[60px] bg-[#272C35] shrink-0 flex items-center justify-center text-xl overflow-hidden rounded-sm">
                👨‍💻
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-white">{artigo.autor_nome}</span>
                <div className="flex items-center gap-2 text-sm text-[#9DA6AF]">
                  <span>{formatarData(artigo.data_publicacao)}</span>
                  <span className="w-1 h-1 bg-[#9DA6AF] rounded-full"></span>
                  <span className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    6min
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-6 text-white">
                <button className="hover:text-[#07B6D5] transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
                <button className="hover:text-[#07B6D5] transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg></button>
                <button className="hover:text-[#07B6D5] transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></button>
              </div>
              <div className="flex gap-4 text-[14px] text-[#9DA6AF]">
                <span className="flex items-center gap-1">❤️ 1 curtida</span>
                <span className="flex items-center gap-1">👁️ 122 visualizações</span>
                <span className="flex items-center gap-1">💬 {comentarios.length} comentários</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[300px] md:h-[473px] bg-[#272C35] overflow-hidden flex items-center justify-center">
            {artigo.imagem_banner ? (
              <img src={artigo.imagem_banner} alt={artigo.titulo} className="w-full h-full object-cover" />
            ) : (
              <span className="font-irish text-4xl text-[#9DA6AF]">Lorem Ipsum</span>
            )}
          </div>

          <div className="text-white text-lg font-light leading-[1.8] whitespace-pre-wrap">
            {artigo.conteudo}
          </div>

          {listaTags.length > 0 && (
            <div className="flex flex-wrap gap-3 py-9 border-y border-[#2B303B] mt-4">
              {listaTags.map((tag, idx) => (
                <div key={idx} className="bg-[#14181F] text-[#F9FAFB] px-4 py-1 text-sm">{tag}</div>
              ))}
            </div>
          )}

          {/* Seção de Comentários Funcional */}
          <section className="flex flex-col gap-6 mt-6">
            <h3 className="text-white text-base font-normal">Comentário ({comentarios.length})</h3>

            {/* Alternância Dinâmica: Se estiver logado mostra o input, se não, pede login */}
            {isLogged ? (
               <form onSubmit={handleComentar} className="w-full flex flex-col gap-4 bg-[#14181F] border border-[#2B303B] p-6">
                <textarea 
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  placeholder="Ótimo artigo. Esperando pelo próximo!"
                  className="w-full h-[80px] bg-[#0B0E13] border border-[#2B303B] text-sm text-white outline-none p-4 resize-none focus:border-[#07B6D5]"
                  required
                />
                <button 
                  type="submit" 
                  disabled={enviando}
                  className="h-[36px] px-6 bg-[#07B6D5] text-[#0B0E13] font-medium text-sm flex items-center justify-center hover:bg-opacity-90 transition-all w-fit disabled:opacity-50"
                >
                  {enviando ? "Publicando..." : "Publicar Comentário"}
                </button>
               </form>
            ) : (
              <div className="w-full border border-[#2B303B] p-10 flex flex-col items-center justify-center gap-4">
                <p className="text-[#9DA6AF] text-sm text-center">Faça login para comentar</p>
                <Link href="/login" className="h-[36px] px-6 bg-[#07B6D5] text-[#0B0E13] font-medium text-sm flex items-center justify-center hover:bg-opacity-90 transition-all">
                  Fazer login
                </Link>
              </div>
            )}

            {/* Lista Real de Comentários do Banco */}
            {comentarios.length > 0 && (
              <div className="flex flex-col gap-6 mt-4 border border-[#2B303B] p-6">
                {comentarios.map((comentario) => (
                  <div key={comentario.id} className="flex flex-col gap-4 border-b border-[#2B303B] pb-6 last:border-none last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 items-center">
                        <div className="w-[50px] h-[50px] rounded-full bg-[#272C35] flex items-center justify-center text-xl shrink-0">👤</div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white">{comentario.autor_nome}</span>
                          <span className="text-xs text-[#9DA6AF]">{formatarData(comentario.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-white font-light">{comentario.content}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

        </article>
      </main>

      <Footer />
    </div>
  );
}