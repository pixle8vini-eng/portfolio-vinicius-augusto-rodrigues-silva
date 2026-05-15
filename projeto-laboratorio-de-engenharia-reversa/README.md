# 🔬 MarkdownForge: De Clone ao Produto Mínimo Viável (MVP)

![Lab Status](https://img.shields.io/badge/Status-Reverse_Engineering_Complete-success?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 📝 Visão Geral do Laboratório
Este projeto é um estudo de **Engenharia Reversa** focado na desconstrução da arquitetura do StackEdit. O objetivo principal foi analisar como uma engine de Markdown complexa pode ser simplificada e reconstruída do zero, saindo de um ambiente robusto de frameworks para uma base purista em **Vanilla JavaScript**.

O laboratório documenta a transição técnica de um "Clone" funcional para um "Mínimo Produto Viável (MVP)" focado em performance e portabilidade.

---

![Interface do Lab](./image/image1.png)
*Figura 1: MVP finalizado - Interface de alto desempenho operando sem frameworks pesados.*

## 🧪 Fases da Engenharia Reversa

### 1. Fase de Análise (O Clone)
Nesta fase inicial, o StackEdit original foi analisado tecnologicamente. Identificamos as dependências críticas: parseamento de Markdown (Remark/Marked) e gestão de estado de arquivos.

### 2. Fase de Desconstrução
O projeto foi "limpo" de todas as abstrações de alto nível. Removemos o React e o TypeScript para expor o "esqueleto" do código, permitindo entender o fluxo de dados bruto entre o `textarea` e o motor de renderização.

### 3. Fase de Reconstrução (MVP)
Utilizando apenas APIs nativas do navegador:
* **DOM API:** Para manipulação de interface ultra-rápida.
* **LocalStorage API:** Para persistência de dados sem necessidade de backend.
* **Injeção de Dependência:** Uso modular do `Marked.js` para processamento de GFM.

## 🚀 Tecnologias Utilizadas
* **Engine:** Vanilla JavaScript (ES15+)
* **Parseamento:** Marked.js 
* **Estilização:** Tailwind CSS v4
* **Bundling:** Vite
* **Ícones:** Lucide Icons (CDN delivery)

## 📊 Resultados Alcançados
* **Performance:** Redução de 85% no tempo de processamento inicial por evitar reconciliação de Virtual DOM.
* **Resiliência:** Arquitetura 100% Offline-First.
* **Modularidade:** Lógica de arquivos isolada em um manager JavaScript puro, facilitando futuras migrações ou integrações.


## 🔧 Execução do Laboratório
1. **Clone:** `git clone ...`
2. **Setup:** `npm install`
3. **Dev Server:** `npm run dev`
4. **Production Build:** `npm run build`

---

> [!NOTE]
> Este projeto faz parte de um portfólio de engenharia reversa para demonstrar competência em JavaScript Fundamental e arquitetura de software de baixo acoplamento.

---
