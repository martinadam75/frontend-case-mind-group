"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FormularioArtigo() {
  const router = useRouter();
  const params = useParams();

  // Descobre se a rota atual é de criação ou edição
  const idArtigo = params?.id as string;
  const isEditing = idArtigo !== "novo";

  // Estados dos campos do formulário
  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [categoria, setCategoria] = useState("Desenvolvimento web");
  const [imagemBanner, setImagemBanner] = useState("");
  const [conteudo, setConteudo] = useState("");
  
  // Estados para o sistema de Tags
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["Typescript", "Backend", "IA"]);

  const [loading, setLoading] = useState(isEditing); // Começa em true se for carregar dados
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    // Bloqueia a rota para visitantes
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Se for edição, busca os dados reais do artigo para preencher a tela
    if (isEditing) {
      fetch(`http://localhost:3333/api/articles`)
        .then((res) => res.json())
        .then((data: any[]) => {
          const artigoEncontrado = data.find((a) => a.id === Number(idArtigo));
          if (artigoEncontrado) {
            setTitulo(artigoEncontrado.titulo);
            setResumo(artigoEncontrado.resumo || "");
            setCategoria(artigoEncontrado.categoria || "Desenvolvimento web");
            setImagemBanner(artigoEncontrado.imagem_banner || "");
            setConteudo(artigoEncontrado.conteudo || "");
            
            // Trata as tags vindas do banco (JSON string ou Array)
            if (artigoEncontrado.tags) {
              try {
                const parsedTags = typeof artigoEncontrado.tags === "string" 
                  ? JSON.parse(artigoEncontrado.tags) 
                  : artigoEncontrado.tags;
                if (Array.isArray(parsedTags)) setTags(parsedTags);
              } catch (e) {
                console.error("Erro ao fazer parse das tags:", e);
              }
            }
          } else {
            alert("Artigo não encontrado.");
            router.push("/dashboard");
          }
        })
        .catch((err) => {
          console.error("Erro ao carregar artigo:", err);
          setErro("Erro ao carregar dados do artigo.");
        })
        .finally(() => setLoading(false));
    }
  }, [router, isEditing, idArtigo]);

  // Função para adicionar uma nova tag
  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Função para remover uma tag clicando no "X"
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    const token = localStorage.getItem("token");

    // Define dinamicamente o método HTTP e a URL
    const url = isEditing 
      ? `http://localhost:3333/api/articles/${idArtigo}` 
      : "http://localhost:3333/api/articles";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          conteudo, 
          imagem_banner: imagemBanner,
          resumo,     
          categoria, 
          tags        
        }),
      });

      if (response.ok) {
        alert(isEditing ? "Artigo alterado com sucesso! 🎉" : "Artigo publicado com sucesso! 🎉");
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setErro(data.message || "Erro ao salvar artigo.");
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0E13] text-[#F9FAFB] font-sans">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-[#9DA6AF]">Carregando dados do acervo...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E13] text-[#F9FAFB] font-sans">
      <Header />

      <main className="flex flex-col items-center py-12 px-4 flex-grow w-full">
        
        {/* Cabeçalho da Página (Voltar + Título Dinâmico) */}
        <div className="w-full max-w-[640px] flex flex-col gap-10">
          
          <div className="w-full border-b border-[#2B303B] pb-6">
            <Link href="/dashboard" className="flex items-center gap-4 text-white hover:text-[#07B6D5] transition-colors font-medium w-fit">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Voltar ao Dashboard
            </Link>
          </div>

          <div>
            <h1 className="text-[36px] font-medium text-white leading-none">
              {isEditing ? "Editar Artigo" : "Criar Novo Artigo"}
            </h1>
            <p className="text-sm text-[#9DA6AF] mt-2 font-light">
              {isEditing ? "Altere as informações necessárias do seu conteúdo" : "Compartilhe seu conhecimento com a comunidade"}
            </p>
          </div>

          {/* Container do Formulário */}
          <form onSubmit={handleSalvar} className="w-full border border-[#2B303B] bg-[#0B0E13] p-9 flex flex-col gap-6">
            
            {erro && <p className="text-red-500 text-sm font-medium">{erro}</p>}

            {/* Título */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white">Título do Artigo *</label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="O Futuro da Inteligência Artificial em 2025"
                className="h-[44px] px-3 bg-[#14181F] border border-[#2B303B] text-sm text-white outline-none focus:border-[#07B6D5] transition-colors"
              />
            </div>

            {/* Resumo */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white">Resumo *</label>
              <textarea
                required
                maxLength={120}
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
                placeholder="Desenvolvedor Full Stack apaixonado por tecnologia e inovação."
                className="h-[114px] p-3 bg-[#14181F] border border-[#2B303B] text-sm text-white outline-none focus:border-[#07B6D5] transition-colors resize-none"
              />
              <span className="text-[10px] text-[#9DA6AF] mt-1">{resumo.length}/120 caracteres</span>
            </div>

            {/* Categoria */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white">Categoria *</label>
              <div className="relative">
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="h-[44px] w-full px-3 bg-[#14181F] border border-[#2B303B] text-sm text-white outline-none focus:border-[#07B6D5] transition-colors appearance-none cursor-pointer"
                >
                  <option value="Desenvolvimento web">Desenvolvimento web</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile">Mobile</option>
                  <option value="IA">Inteligência Artificial</option>
                </select>
                <span className="absolute right-3 top-3 pointer-events-none text-[#9DA6AF]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </div>
            </div>

            {/* Imagem de Capa */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white">Imagem de Capa *</label>
              <input
                type="text"
                required
                value={imagemBanner}
                onChange={(e) => setImagemBanner(e.target.value)}
                placeholder="https://url-da-sua-imagem.com/foto.png"
                className="h-[44px] px-3 bg-[#14181F] border border-[#2B303B] text-sm text-white outline-none focus:border-[#07B6D5] transition-colors"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white">Tags</label>
              <div className="flex gap-2 h-[44px]">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-grow px-3 bg-[#14181F] border border-[#2B303B] text-sm text-white outline-none focus:border-[#07B6D5] transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="h-[44px] px-4 border border-[#2B303B] bg-[#14181F] text-[#F9FAFB] text-xs font-medium hover:bg-[#202631] transition-colors"
                >
                  Adicionar
                </button>
              </div>
              
              {/* Pílulas (Chips) de Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-2 px-2 py-1 border border-[#2B303B] bg-[#0B0E13]">
                      <span className="text-[10px] text-white">{tag}</span>
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="text-[#9DA6AF] hover:text-red-400">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Conteúdo do Artigo */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white">Conteúdo do Artigo *</label>
              <textarea
                required
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                placeholder="Escreva seu artigo aqui... Aceita Markdown."
                className="h-[300px] p-4 bg-[#14181F] border border-[#2B303B] text-sm text-white font-light outline-none focus:border-[#07B6D5] transition-colors resize-y leading-relaxed"
              />
              <div className="flex items-center gap-2 mt-1 text-[10px] text-[#9DA6AF] font-light">
                <span>{conteudo.length}/8000 caracteres</span>
                <span className="w-1 h-1 bg-[#9DA6AF] rounded-full"></span>
                <span>{conteudo.split(/\s+/).filter((w) => w.length > 0).length} palavras</span>
                <span className="w-1 h-1 bg-[#9DA6AF] rounded-full"></span>
                <span>{Math.ceil(conteudo.split(/\s+/).length / 200)} minutos de leitura</span>
              </div>
            </div>

            {/* Botões de Ação Dinâmicos */}
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
              <button
                type="submit"
                disabled={salvando}
                className="h-[36px] flex-grow bg-[#07B6D5] text-[#0B0E13] text-sm font-medium flex justify-center items-center hover:bg-opacity-90 transition-all disabled:opacity-50 cursor-pointer"
              >
                {salvando ? "Salvando..." : isEditing ? "Salvar Alterações" : "Publicar Artigo"}
              </button>
              <Link
                href="/dashboard"
                className="h-[36px] sm:w-[107px] w-full border border-[#2B303B] bg-[#14181F] text-[#F9FAFB] text-sm font-normal flex justify-center items-center hover:bg-[#202631] transition-colors"
              >
                Cancelar
              </Link>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}