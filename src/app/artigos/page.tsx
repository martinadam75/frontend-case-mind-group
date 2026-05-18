"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard, { Artigo } from "@/components/ArticleCard";

export default function Artigos() {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros e visualização
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("Todos");

  useEffect(() => {
    async function carregarArtigos() {
      try {
        const response = await fetch("http://localhost:3333/api/articles");
        if (response.ok) {
          const data = await response.json();
          setArtigos(data);
        }
      } catch (error) {
        console.error("Erro ao buscar artigos:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarArtigos();
  }, []);

  const artigosFiltrados = articlesFilterLogic(artigos, searchQuery, selectedTag);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E13] text-[#F9FAFB] font-sans">
      <Header />

      <main className="max-w-[1240px] mx-auto w-full py-[60px] px-4 flex flex-col gap-10 flex-grow">
        
        <div>
          <h1 className="text-[36px] font-medium text-white leading-none">Todos os Artigos</h1>
          <p className="text-sm text-[#9DA6AF] mt-2">Explore nossa coleção completa de artigos técnicos</p>
        </div>

        {/* Barra de Controles: Pesquisa, Filtro e Alternador de Layout */}
        <section className="flex flex-col md:flex-row justify-between items-center gap-4 w-full h-auto md:h-40px">
          <div className="flex items-center border border-[#272C35] bg-[#0B0E13] w-full md:w-[450px] h-[40px] px-3">
            <span className="text-[#9DA6AF] mr-2">🔍</span>
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-[#F9FAFB] outline-none w-full placeholder-[#9DA6AF]"
            />
          </div>

          <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center border border-[#272C35] bg-[#0B0E13] w-[262px] h-[40px] px-3 relative">
              <span className="text-[#9DA6AF] mr-2">
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.5 0.5H0.5L8.5 9.96V16.5L12.5 18.5V9.96L20.5 0.5Z" stroke="#9DA6AF" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="bg-transparent text-sm text-white outline-none w-full appearance-none cursor-pointer pr-6"
              >
                <option value="Todos" className="bg-[#14181F]">Todas as Categorias</option>
                <option value="Desenvolvimento web" className="bg-[#14181F]">Desenvolvimento web</option>
                <option value="DevOps" className="bg-[#14181F]">DevOps</option>
                <option value="IA" className="bg-[#14181F]">Inteligência Artificial</option>
                <option value="Mobile" className="bg-[#14181F]">Mobile</option>
                <option value="Segurança" className="bg-[#14181F]">Segurança</option>
              </select>
              <span className="absolute right-3 pointer-events-none text-[#9DA6AF] text-xs">▼</span>
            </div>

            <div className="flex gap-1 h-[40px] shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-10 h-10 flex items-center justify-center transition-colors ${
                  viewMode === "grid" ? "bg-[#F5993D] text-[#0B0E13]" : "bg-[#14181F] text-white border border-[#272C35]"
                }`}
                title="Visualização em Grade"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`w-10 h-10 flex items-center justify-center transition-colors ${
                  viewMode === "list" ? "bg-[#F5993D] text-[#0B0E13]" : "bg-[#14181F] text-white border border-[#272C35]"
                }`}
                title="Visualização em Lista"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {loading ? (
          <p className="text-[#9DA6AF] text-center py-20">Carregando acervo técnico...</p>
        ) : artigosFiltrados.length === 0 ? (
          <p className="text-[#9DA6AF] text-center py-20">Nenhum resultado encontrado para a sua busca ou filtro.</p>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center" 
            : "flex flex-col gap-4 w-full"
          }>
            {artigosFiltrados.map((artigo, index) => (
              <ArticleCard 
                key={artigo.id} 
                artigo={artigo} 
                index={index} 
                viewMode={viewMode} 
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function articlesFilterLogic(artigos: Artigo[], query: string, tag: string) {
  return artigos.filter((artigo) => {
    const termo = query.toLowerCase();
    const bateBusca = 
      artigo.titulo.toLowerCase().includes(termo) || 
      artigo.conteudo.toLowerCase().includes(termo) ||
      (artigo.resumo && artigo.resumo.toLowerCase().includes(termo));
    
    const bateTag = tag === "Todos" || artigo.categoria === tag; 
    return bateBusca && bateTag;
  });
}