"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard, { Artigo } from "@/components/ArticleCard";

export default function Home() {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  useEffect(() => {
    // Verifica se o usuário está logado logo ao carregar a página
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLogged(!!token);
    async function carregarArtigos() {
      try {
        const response = await fetch("http://localhost:3333/api/articles");
        if (response.ok) {
          const data = await response.json();
          setArtigos(data);
        }
      } catch (error) {
        console.error("Erro ao conectar com a API de artigos:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarArtigos();
  }, []);

  // Separa os artigos dinamicamente: os 4 primeiros vão para Destaque, o restante vai para Recentes
  const artigosDestaque = artigos.slice(0, 4);
  const artigosRecentes = artigos.slice(4);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E13] text-[#F9FAFB] font-sans">
      <Header />

      {/* Seção HERO */}
      <section className="h-[600px] flex flex-col justify-center items-center border-b border-[#2B303B] text-center px-4 shrink-0">
        <div className="max-w-[550px] flex flex-col gap-9 items-center">
          <h1 className="text-[36px] font-bold leading-[44px] text-white">
            Explore o Futuro da <span className="text-[#07B6D5]">Tecnologia</span>
          </h1>
          <p className="text-[24px] font-bold text-[#9DA6AF] leading-tight">
            Artigos sobre IA, desenvolvimento, DevOps e as últimas tendências tecnológicas
          </p>
          <div className="flex flex-col gap-4 w-full max-w-[450px]">
            <a href="/artigos" className="h-[44px] bg-[#07B6D5] text-[#0B0E13] text-sm font-medium flex justify-center items-center transition-all hover:bg-opacity-90">
              Explorar Artigos
            </a>
            <button className="h-[44px] border border-[#2B303B] bg-[#0B0E13] text-white text-sm font-medium flex justify-center items-center transition-all hover:bg-[#14181F]">
              Começar a Escrever
            </button>
          </div>
        </div>
      </section>

      {/* Seção Central de Conteúdo */}
<main id="destaques" className="max-w-[1240px] mx-auto w-full py-[60px] px-4 flex flex-col gap-[100px]">

  {/* Bloco 1: Artigos em Destaque */}
  <section className="flex flex-col gap-9">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-[36px] font-medium text-white leading-none">Artigos em Destaque</h2>
        <p className="text-xl font-light text-[#9DA6AF] mt-4">Os melhores conteúdos selecionados para você</p>
      </div>
      <Link href="/artigos" className="text-[#07B6D5] text-sm font-medium flex items-center gap-1 hover:underline">
        Ver todos
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </Link>
    </div>

    {loading ? (
      <p className="text-[#9DA6AF] text-center py-10">Carregando artigos...</p>
    ) : artigosDestaque.length === 0 ? (
      <p className="text-[#9DA6AF] text-center py-10">Nenhum artigo publicado ainda. Logue na plataforma para criar o primeiro!</p>
    ) : (
      /* Grid de Artigos em Destaque Consumindo o Componente Novo */
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
        {artigosDestaque.map((artigo, index) => (
          <ArticleCard 
            key={artigo.id} 
            artigo={artigo} 
            index={index} 
            viewMode="grid" 
          />
        ))}
      </div>
    )}
  </section>

  {/* Bloco 2: Artigos Recentes (Cards Compactos sem imagem usando o modo Lista) */}
  {artigosRecentes.length > 0 && (
    <section className="flex flex-col gap-9">
      <div>
        <h2 className="text-[36px] font-medium text-white leading-none">Artigos Recentes</h2>
        <p className="text-xl font-light text-[#9DA6AF] mt-4">Conteúdo recente da comunidade</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
        {artigosRecentes.map((artigo, index) => (
          <ArticleCard 
            key={artigo.id} 
            artigo={artigo} 
            index={index} 
            viewMode="compact" 
          />
        ))}
      </div>
    </section>
  )}
</main>

      {/* Bloco Seção: Newsletter Semanal */}
      <section className="w-full bg-[#14181F] border-y border-[#2B303B] py-10 flex flex-col items-center gap-4 text-center shrink-0">
        <div className="w-[54px] h-[54px] bg-[#0B0E13] border border-[#2B303B] flex items-center justify-center text-xl">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 6H6C4.34315 6 3 7.34315 3 9V27C3 28.6569 4.34315 30 6 30H30C31.6569 30 33 28.6569 33 27V9C33 7.34315 31.6569 6 30 6Z" stroke="#F9FAFB" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M33 10.5L19.545 19.05C19.0819 19.3401 18.5465 19.494 18 19.494C17.4535 19.494 16.9181 19.3401 16.455 19.05L3 10.5" stroke="#F9FAFB" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

        </div>
        <h2 className="text-[32px] font-semibold text-white leading-none">Newsletter Semanal</h2>
        <p className="text-[16px] text-white max-w-[522px] px-4">
          Receba os melhores artigos de tecnologia diretamente no seu e-mail. Sem spam, apenas conteúdo de qualidade.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-[377px] w-full px-4 mt-2">
          <input
            type="email"
            placeholder="Seu e-mail profissional"
            className="h-[44px] px-3 bg-[#0B0E13] border border-[#2B303B] text-[14px] text-[#9DA6AF] outline-none focus:border-[#07B6D5] flex-grow transition-colors"
          />
          <button type="submit" className="h-[44px] px-4 bg-[#07B6D5] text-[#0B0E13] font-medium text-sm hover:bg-opacity-90 transition-all">
            Inscrever
          </button>
        </form>
      </section>

      {/* Bloco Seção: Compartilhe Seu Conhecimento (CTA) */}
      <section className="w-full bg-[#0B0E13] py-12 flex flex-col items-center text-center shrink-0">
        <div className="max-w-[772px] px-4 flex flex-col items-center gap-4">
          <h2 className="text-[24px] font-bold text-white">Compartilhe Seu Conhecimento</h2>
          <p className="text-[14px] text-[#9DA6AF] max-w-[544px]">
            Junte-se à nossa comunidade de escritores e compartilhe suas experiências e conhecimentos em tecnologia.
          </p>
          <Link href={isLogged === false ? "/login" : "/editar-artigo/novo"} className="h-[44px] w-[167px] bg-[#07B6D5] text-[#0B0E13] font-medium text-sm flex justify-center items-center hover:bg-opacity-90 transition-all mt-2">
            {isLogged === false ? "Criar Conta Gratuita" : "Publicar Artigo"}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}