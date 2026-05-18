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
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Proteger a rota: se não houver token, joga o intruso para a tela de login
    if (!token) {
      router.push("/login");
      return;
    }

    // Decodifica o Token JWT nativamente para pegar o e-mail/id do usuário logado
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
      
      // Como o backend salva o email no token, extraímos o nome do email para o "Bem-vindo"
      const nomeExibicao = payload.email ? payload.email.split("@")[0] : "User";
      setUsuarioNome(nomeExibicao.charAt(0).toUpperCase() + nomeExibicao.slice(1));

      // Carrega os artigos do banco e filtra apenas os deste usuário
      fetch("http://localhost:3333/api/articles")
        .then((res) => res.json())
        .then((data) => {
          // Filtra os artigos criados pelo id do usuário decodificado no token
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

  // Função para deletar um artigo direto na API
  const handleDeletarArtigo = async (id: number) => {
    const confirmar = confirm("Tem certeza absoluta de que deseja excluir este artigo?");
    if (!confirmar) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3333/api/articles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove do estado local na hora para dar o efeito visual instantâneo
        setMeusArtigos(meusArtigos.filter((artigo) => artigo.id !== id));
        alert("Artigo removido com sucesso! 🚀");
      } else {
        alert("Erro ao tentar deletar o artigo.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E13] text-[#F9FAFB] font-sans">
      <Header />

      <main className="max-w-[1240px] mx-auto w-full py-10 px-4 flex flex-col gap-10 flex-grow">
        
        {/* Bloco Superior: Boas-vindas e Botões de Ação */}
        <section className="flex justify-between items-center w-full border-b border-[#2B303B] pb-6">
          <div>
            <h1 className="text-[36px] font-medium text-white tracking-tight">Dashboard</h1>
            <p className="text-lg font-light text-[#9DA6AF] mt-1">Bem-vindo de volta, {usuarioNome}!</p>
          </div>
          <div className="flex gap-2">
            <button className="h-[35px] px-4 bg-[#14181F] border border-[#2B303B] text-[#F9FAFB] text-sm font-medium flex items-center gap-2 hover:bg-[#202631] transition-colors">
              ⚙️ Configurações
            </button>
            <Link href="/novo-artigo" className="h-[35px] px-4 bg-[#07B6D5] text-[#0B0E13] text-sm font-medium flex items-center gap-2 hover:bg-opacity-90 transition-all">
              ➕ Novo Artigo
            </Link>
          </div>
        </section>

        {/* Grade de Big Numbers (Métricas do Figma) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* Total de Artigos (Dinâmico) */}
          <div className="p-4 bg-[#14181F] border border-[#2B303B] h-[108px] flex flex-col justify-between">
            <div className="flex justify-between items-center text-sm text-[#9DA6AF] font-light">
              <span>Total de Artigos</span>
              <span>📄</span>
            </div>
            <span className="text-[32px] font-light text-white leading-none">{meusArtigos.length}</span>
          </div>

          {/* Engajamento (Fictício) */}
          <div className="p-4 bg-[#14181F] border border-[#2B303B] h-[108px] flex flex-col justify-between">
            <div className="flex justify-between items-center text-sm text-[#9DA6AF] font-light">
              <span>Engajamento</span>
              <span>💬</span>
            </div>
            <span className="text-[32px] font-light text-white leading-none">4</span>
          </div>

          {/* Curtidas (Fictício) */}
          <div className="p-4 bg-[#14181F] border border-[#2B303B] h-[108px] flex flex-col justify-between">
            <div className="flex justify-between items-center text-sm text-[#9DA6AF] font-light">
              <span>Curtidas</span>
              <span>❤️</span>
            </div>
            <span className="text-[32px] font-light text-white leading-none">20</span>
          </div>

          {/* Tempo Médio (Fictício) */}
          <div className="p-4 bg-[#14181F] border border-[#2B303B] h-[108px] flex flex-col justify-between">
            <div className="flex justify-between items-center text-sm text-[#9DA6AF] font-light">
              <span>Tempo médio de leitura</span>
              <span>📈</span>
            </div>
            <span className="text-[32px] font-light text-white leading-none">8 <span className="text-lg">min</span></span>
          </div>
        </section>

        {/* Layout de Duas Colunas (Principais) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start w-full">
          
          {/* Coluna da Esquerda: Meus Artigos (Ocupa 2 colunas no desktop) */}
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
                  <div key={artigo.id} className="p-6 border-b border-[#2B303B] flex gap-6 items-start justify-between last:border-none">
                    <div className="flex gap-6 items-start">
                      {/* Imagem do Artigo */}
                      <div className="w-[124px] h-[80px] bg-[#272C35] shrink-0 overflow-hidden flex items-center justify-center">
                        {artigo.imagem_banner ? (
                          <img src={artigo.imagem_banner} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-[#9DA6AF] font-irish">Lorem Ipsum</span>
                        )}
                      </div>
                      {/* Títulos e Metadados com nossa função global */}
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-semibold text-white line-clamp-1">{artigo.titulo}</h3>
                        <p className="text-sm text-white opacity-70 line-clamp-1">{artigo.conteudo}</p>
                        <div className="flex items-center gap-3 text-xs text-[#9DA6AF] mt-2">
                          <span>{formatarData(artigo.data_publicacao)}</span>
                          <span className="w-1 h-1 bg-[#9DA6AF] rounded-full"></span>
                          <span>💬 2</span>
                          <span className="w-1 h-1 bg-[#9DA6AF] rounded-full"></span>
                          <span>❤️ 1</span>
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação de Gerenciamento */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link 
                        href={`/editar-artigo/${artigo.id}`}
                        className="h-[35px] w-[96px] bg-[#14181F] border border-[#2B303B] text-[#F9FAFB] text-xs font-normal flex justify-center items-center gap-1 hover:bg-[#202631]"
                      >
                        📝 Editar
                      </Link>
                      <button
                        onClick={() => handleDeletarArtigo(artigo.id)}
                        className="h-[35px] w-[96px] bg-[#14181F] border border-[#2B303B] text-[#EF4343] text-xs font-normal flex justify-center items-center gap-1 hover:bg-red-950/20"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Coluna da Direita: Atividades Recentes (Fictício conforme o Figma) */}
          <section className="border border-[#2B303B] bg-[#0B0E13] flex flex-col">
            <div className="p-4 border-b border-[#2B303B]">
              <h2 className="text-xl font-normal text-white">Atividade Recente</h2>
            </div>
            <div className="flex flex-col">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4 border-b border-[#2B303B] flex gap-3 items-center last:border-none">
                  {/* Avatar redondo cinza simulando o rosto da foto */}
                  <div className="w-[50px] h-[50px] rounded-full bg-[#272C35] shrink-0 flex items-center justify-center text-sm">
                    👩‍💻
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-[#F9FAFB] leading-tight">
                      <span className="font-semibold">Marie Smith</span> comentou em <span className="text-[#07B6D5] cursor-pointer hover:underline">O Futuro da Inteligência Artificial em 2025</span>
                    </p>
                    <span className="text-xs text-[#9DA6AF]">💬 5 min atrás</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}