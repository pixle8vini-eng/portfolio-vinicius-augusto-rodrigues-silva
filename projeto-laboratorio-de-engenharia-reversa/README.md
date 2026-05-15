# 📝 MarkdownForge: Reverse Engineering StackEdit Engine

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 📝 Descrição do Projeto
O **MarkdownForge** é um laboratório de engenharia reversa focado na desconstrução e reconstrução da engine principal do **StackEdit**. O objetivo deste projeto foi isolar as funcionalidades core de edição e renderização síncrona, migrando de uma arquitetura baseada em frameworks (React) para uma implementação purista em **Vanilla JavaScript**.

Esta reconstrução foca na análise de persistência local (`localStorage`), manipulação direta do DOM para renderização de Markdown via engine de parseamento (Marked), e implementação de um sistema de arquivos puramente client-side que opera de forma resiliente em ambientes offline.

---

![Interface do MarkdownForge](<img width="1585" height="828" alt="Captura de tela 2026-05-15 012831" src="https://github.com/user-attachments/assets/4593af55-06fc-470b-8849-b672d2a98c9e" />)
*Figura 1: Interface reconstruída focada em split-view e manipulação de fluxos de dados Markdown.*

## 🚀 Tecnologias Utilizadas
* **Core Engine:** Vanilla JavaScript (ES15+)
* **Parseamento:** Marked.js (Engine de processamento GFM)
* **Estilização:** Tailwind CSS v4 (Arquitetura de Design Atoms)
* **Bundling:** Vite (Pipeline de asset modular)
* **Ícones:** Lucide Icons (Renderização Dinâmica)
* **Persistência:** Browser Local Storage API

## 📊 Resultados e Funcionalidades
A engenharia reversa permitiu a criação de um sistema modularizado e desacoplado:
* **Engine de Split-View Síncrona:** Implementação de um observador de eventos no `textarea` que dispara o ciclo de renderização e atualização do DOM em tempo real.
* **Sistema de Arquivos Modular:** Gestão de estados internos via arrays de objetos serializados, permitindo operações de CRUD (Create, Read, Update, Delete) sem dependência de banco de dados externo.
* **Otimização de Performance:** Redução drástica do bundle size ao eliminar frameworks, mantendo a responsividade da interface através de manipulações granulares do DOM.
* **Persistência Offline:** Estratégia de salvamento automático que garante a integridade dos dados através de interceptadores de entrada (oninput).

![Estrutura de Dados e Explorer](./image/image1.png)
*Figura 2: Análise da gestão de estado e estrutura de arquivos no Explorer dinâmico.*

## 🔧 Como Executar
1. Clone o repositório.
2. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
3. Instale as dependências de desenvolvimento:
   ```bash
   npm install

