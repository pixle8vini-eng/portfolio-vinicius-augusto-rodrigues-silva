# 📓 Notas do Laboratório: Engenharia Reversa StackEdit

## Objetivo
Analisar as camadas de abstração do StackEdit e simplificar a lógica para um MVP funcional usando apenas tecnologias nativas.

## Descobertas Técnicas
1. **Sync Buffer:** A renderização síncrona não precisa de um Virtual DOM se o escopo for limitado a um único documento. O uso da propriedade `innerHTML` em conjunto com a biblioteca `marked` provou ser mais eficiente energeticamente para o dispositivo do usuário.
2. **State Persistence:** O uso de objetos serializados no `localStorage` elimina a latência de rede, tornando a experiência instantânea.
3. **Estilização Modular:** O Tailwind CSS v4 permitiu manter a interface visualmente idêntica ao original (que usa React) sem a necessidade de processadores complexos ou runtime de CSS-in-JS.

## Desafios Superados
- **Seleção de Texto:** Manter o cursor no lugar certo após inserções de toolbar via script Vanilla.
- **Gerenciamento de Cache:** Implementação de um sistema de fallback para arquivos deletados acidentalmente.

## Próximos Passos (MVP -> Full Product)
- Implementar suporte a KaTeX para fórmulas matemáticas.
- Adicionar sincronização via WebDAV ou Google Drive.
