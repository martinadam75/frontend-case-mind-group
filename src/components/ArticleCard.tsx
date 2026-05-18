"use client";

import Link from "next/link";
import { formatarData } from "@/utils/formatDate";

export interface Artigo {
  id: number;
  titulo: string;
  conteudo: string;
  resumo: string | null;     
  categoria: string | null; 
  tags: string | null;     
  imagem_banner: string | null;
  autor_nome: string;
  autor_foto: string | null;
  data_publicacao: string;
}

interface ArticleCardProps {
  artigo: Artigo;
  viewMode?: "grid" | "list" | "compact";
}

export default function ArticleCard({ artigo, viewMode = "grid" }: ArticleCardProps) {
  
  // ==========================================
  // MODO COMPACTO (Para "Artigos Recentes" na Home)
  // ==========================================
  if (viewMode === "compact") {
    return (
      <Link href={`/artigos/${artigo.id}`} className="block group w-full">
        <article className={`bg-[#14181F] border border-[#272C35] p-6 transition-all duration-200 cursor-pointer group-hover:border-[#07B6D5] flex flex-col justify-between w-full max-w-[400px] h-[236px] mx-auto md:mx-0`}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center text-xs">
              <span className="bg-[#272C35] px-2 py-1 text-white font-medium">
                {artigo.categoria || "Geral"}
              </span>
            </div>
            <h3 className="text-[20px] font-bold leading-tight line-clamp-2 text-white transition-colors duration-200 group-hover:text-[#07B6D5]">
              {artigo.titulo}
            </h3>
            <p className="text-[14px] text-white opacity-80 leading-relaxed line-clamp-3">
              {artigo.resumo || artigo.conteudo}
            </p>
          </div>

          <div className="flex justify-between items-center text-sm pt-4 mt-auto">
            <span className="text-[#9DA6AF] truncate max-w-[120px]">{artigo.autor_nome}</span>
            <span className="flex items-center gap-1 text-xs text-[#9DA6AF]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              {formatarData(artigo.data_publicacao)}
            </span>
          </div>
        </article>
      </Link>
    );
  }

  // ==========================================
  // MODO GRID E LIST (Padrão)
  // ==========================================
  return (
    <Link href={`/artigos/${artigo.id}`} className="block group w-full">
      <article
        className={`bg-[#14181F] border border-[#272C35] p-6 transition-all duration-200 cursor-pointer group-hover:border-[#07B6D5] ${
          viewMode === "grid" 
            ? "flex flex-col gap-4 max-w-[400px] h-[496px] mx-auto md:mx-0" 
            : "flex flex-col md:flex-row gap-6 w-full h-auto md:h-[236px]"
        }`}
      >
        {/* Imagem do Banner */}
        <div className={`${
          viewMode === "grid" ? "w-full h-[228px]" : "w-full md:w-[352px] h-[188px] md:h-full"
        } bg-[#272C35] overflow-hidden shrink-0 flex items-center justify-center`}>
          {artigo.imagem_banner ? (
            <img 
              src={artigo.imagem_banner} 
              alt={artigo.titulo} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
          ) : (
            <span className="font-irish text-2xl text-[#9DA6AF]">Lorem ipsum</span>
          )}
        </div>

        {/* Conteúdo de Texto e Informações */}
        <div className="flex flex-col justify-between flex-grow gap-2 min-w-0">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="bg-[#272C35] px-2 py-1 text-white font-medium">
                {artigo.categoria || "Geral"}
              </span>
              {viewMode === "list" && (
                <span className="text-[#9DA6AF]">{formatarData(artigo.data_publicacao)}</span>
              )}
            </div>
            <h3 className="text-[20px] font-bold leading-tight line-clamp-2 text-white transition-colors duration-200 group-hover:text-[#07B6D5]">
              {artigo.titulo}
            </h3>
            <p className="text-[14px] text-white opacity-80 leading-relaxed line-clamp-3">
              {artigo.resumo || artigo.conteudo}
            </p>
          </div>

          {/* Metadados de Rodapé */}
          <div className="flex justify-between items-center text-sm border-t border-[#272C35] pt-2 mt-auto">
            <span className="text-[#9DA6AF] truncate max-w-[120px]">{artigo.autor_nome}</span>
            <div className="flex gap-3 text-xs text-[#9DA6AF] shrink-0">
              {viewMode === "grid" && (
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  {formatarData(artigo.data_publicacao)}
                </span>
              )}
              <span className="flex items-center gap-1">⏱️ 6min</span>
              <span className="flex items-center gap-1">👁️ 122</span>
              <span className="flex items-center gap-1">❤️ 1</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}