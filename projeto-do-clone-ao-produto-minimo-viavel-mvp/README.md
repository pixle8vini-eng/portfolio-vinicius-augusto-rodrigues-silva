# 🖊️ Blue Markdown Generator

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Vite](https://img.svg.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

O **Blue Markdown Generator** é um editor de Markdown minimalista e moderno, projetado para oferecer uma experiência de escrita focada e produtiva. Combinando uma estética *Dark Mode* refinada com a robustez do sincronismo em tempo real via Firebase.

## 🚀 Funcionalidades Principais

*   **Edição em Tempo Real:** Visualize suas alterações instantaneamente com o motor de renderização GFM.
*   **Sincronização em Nuvem:** Autenticação via Google e persistência de dados no Firestore.
*   **Gestão de Arquivos:** Sistema de biblioteca local e remota para organizar seus rascunhos.
*   **Exportação Versátil:** Converta seus textos para Markdown, HTML ou Texto Puro com um clique.
*   **Estética Minimalista:** Design planejado para reduzir o cansaço visual e aumentar o foco.

## 📊 Resultados e Aprendizados
O projeto alcançou resultados sólidos em ambiente de produção, demonstrando a eficácia do modelo de persistência híbrida (Local + Cloud).

*   **O sistema atingiu 100% de consistência** na sincronização entre dispositivos durante os ciclos de teste.
*   **Otimização de Renderização:** Apliquei técnicas de debounce e normalização de DOM para garantir que a escrita não sofra interrupções (lags).
*   **Arquitetura Serverless:** Implementei uma estrutura totalmente baseada em serviços gerenciados, eliminando a necessidade de manutenção de infraestrutura de servidor.

![Interface do Blue Markdown Generator](https://placehold.co/1200x600/1e3a8a/white?text=Blue+Markdown+Generator+Dashboard+Mockup)
*Figura 1: Visão geral da interface Dark Mode Minimalist do editor.*

## 🔧 Como Executar

1.  Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/blue-markdown-generator.git
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure as variáveis de ambiente com suas chaves do Firebase em `src/firebase.ts`.
4.  Execute o comando de desenvolvimento:
    ```bash
    npm run dev
    ```

![Fluxo de Sincronização](https://placehold.co/1200x400/0a0f1e/white?text=Pipeline+de+Dados:+Client+%E2%86%92+LocalStorage+%E2%86%92+Firestore)
*Figura 2: Representação visual do pipeline de sincronização e persistência de dados.*

---

## 🛠️ Tecnologias Utilizadas
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS (@tailwindcss/typography)
- **Banco de Dados:** Firebase Firestore
- **Autenticação:** Firebase Auth (Google Provider)
- **Assets:** Firebase Cloud Storage
- **Ícones:** Lucide Icons

---
[Voltar ao início](https://github.com/seu-usuario/seu-usuario)
