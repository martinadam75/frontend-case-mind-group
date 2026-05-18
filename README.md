# TechBlog Portal - Frontend

Este é o portal web do TechBlog, uma interface moderna, responsiva e pixel-perfect construída com Next.js (App Router) e Tailwind CSS, desenhada para se alinhar estritamente com o Design System definido no Figma.

## Tecnologias Aplicadas

* **Next.js 14 (App Router):** Renderização eficiente, otimização de rotas híbridas e SEO.
* **Tailwind CSS:** Estilização baseada em utilitários e variáveis de design fluidas.
* **TypeScript:** Tipagem estrita de componentes e interfaces compartilhadas com a API.

## Pré-requisitos

* Node.js (v18 ou superior)
* A API do Backend deve estar rodando em http://localhost:3333 (Acesse o repo [aqui](https://github.com/martinadam75/backend-case-mind-group]))

## Configuração e Execução

1. **Instalar as dependências:**
   ```bash
   npm install

2. **Configuração de Ativos Estáticos (Avatares):** 
Certifique-se de que as imagens base dos usuários do dump (John e Marie) se encontram na pasta public na raiz do projeto para a correta renderização local:

    ```bash
    public/
    ├── john-doe.png
    └── marie-smith.png

3. **Iniciar o ambiente de desenvolvimento:**

    ```bash
    npm run dev

O portal estará acessível em http://localhost:3000

## Detalhes de Arquitetura e UI

* **Componentização Inteligente (ArticleCard):** O projeto utiliza um cartão de artigo altamente modularizado que suporta três modos de visualização dinâmicos via propriedades: "grid", "list", ou "compact". Isso unifica os efeitos visuais e interações de hover em toda a plataforma, do Dashboard à página Home.

* **Rotas Dinâmicas Híbridas (/editar-artigo/[id]):** O formulário de criação atua de forma inteligente. Lê o parâmetro dinâmico da rota: se for a palavra-chave "novo", abre um formulário limpo (POST); se for um ID numérico (ex: 1), carrega os dados reais da API e transforma-se num formulário de edição (PUT).

* **Estado Fluido de Autenticação:** A UI adapta-se instantaneamente quando o usuário está logado (ocultando áreas de Call To Action para registro e liberando interações de edição e comentários).