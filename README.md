# Curriculo Match Mestre

MEGA PROMPT — CVRadar ATS
Missão e restrições
Crie uma aplicação web 100% funcional chamada CVRadar ATS, em português brasileiro, para comparar um currículo colado em texto com a descrição de uma vaga e gerar uma versão reorganizada, clara e amigável a sistemas ATS.

Prioridade absoluta: entregar o fluxo completo e testável em uma única geração. Não entregue somente um protótipo visual. Todas as ações exibidas devem funcionar. Não faça perguntas: use as especificações abaixo. Evite complexidade desnecessária.

Escopo obrigatório: colar vaga, colar currículo, analisar compatibilidade, exibir palavras-chave presentes e ausentes, gerar versão ATS-friendly editável, exportar para PDF e copiar ou baixar o texto.

Regra ética inegociável: NUNCA criar cargos, empresas, datas, escolaridade, cursos, certificações, ferramentas, resultados, responsabilidades ou habilidades que não constem do currículo original. Nunca inserir automaticamente no currículo final palavras-chave ausentes. As ausentes aparecem APENAS como oportunidades de revisão e devem ser adicionadas manualmente pelo usuário, se forem verdadeiras. Não prometa aprovação em ATS, entrevista ou contratação.
Identidade visual
- Nome: CVRadar ATS.
- Slogan: "Seu currículo com mais clareza para cada oportunidade."
- Aparência: SaaS moderno, limpo, acessível e profissional, com visual premium e sem excesso de elementos.
- Stack: React, TypeScript, Tailwind CSS, shadcn/ui e lucide-react, aproveitando a estrutura padrão gerada pelo Lovable.
- Paleta: azul-marinho #0F172A (texto/cabeçalhos), azul #2563EB (principal), turquesa #14B8A6 (sucesso), fundo #F8FAFC, branco #FFFFFF, âmbar #F59E0B (atenção).
- Tipografia: Inter ou equivalente sem serifa; cartões com bordas suaves e sombras discretas; bom espaçamento; responsivo, mobile-first.
- Use componentes reais do shadcn/ui: Button, Card, Badge, Tabs, Textarea, Progress, Alert, Tooltip e Separator quando úteis.
- Acessibilidade: labels visíveis, contraste adequado, foco de teclado, aria-live em mensagens de resultado, texto legível e estados de carregamento apenas quando houver trabalho.
- Não precisa de imagens geradas, vídeos, dashboard, gráficos complexos, animações pesadas ou landing page separada.
Estrutura de tela única
1. Cabeçalho com marca CVRadar ATS e selo "Gratuito · Sem cadastro".
2. Hero compacto: título "Descubra como seu currículo conversa com a vaga", subtítulo explicando a estimativa por palavras-chave, e aviso de honestidade: "Otimizamos a apresentação das suas experiências. Não inventamos qualificações."
3. Área principal, em duas colunas no desktop e uma coluna no celular:
   - Campo A: "Descrição da vaga" (textarea grande; contador de caracteres; placeholder objetivo).
   - Campo B: "Seu currículo" (textarea grande; contador de caracteres; placeholder objetivo).
   - Seletor simples "Tipo de vaga": Geral | Tecnologia. A seleção influencia apenas o vocabulário para extração e não a veracidade das informações.
   - Botões funcionais: "Analisar currículo" (ação principal), "Testar com exemplo" (insere dados fictícios completos e coerentes), "Limpar dados" (limpa formulário e resultado, com confirmação simples se houver conteúdo).
4. Depois da análise, apresentar seção "Resultado da análise":
   - Indicador numérico de 0 a 100 rotulado "Compatibilidade estimada", acompanhado da descrição "Métrica interna baseada em termos identificados; não é pontuação oficial de um ATS".
   - Quantidade de termos relevantes identificados na vaga, encontrados no currículo e ausentes.
   - Duas listas bem distintas de chips: "Palavras-chave encontradas" (turquesa) e "Palavras-chave ausentes" (âmbar).
   - 3 a 5 recomendações úteis e não genéricas, derivadas do resultado. Exemplo: se "Excel" estiver ausente, sugerir "Se você realmente utiliza Excel, descreva a experiência de forma verificável" e jamais adicionar a palavra ao currículo.
   - Se não for possível encontrar termos confiáveis, mostrar mensagem honesta e não inventar score.
5. Seção "Currículo ATS-friendly":
   - Editor de texto preenchido com versão organizada do currículo, permitindo alterações manuais.
   - Botões reais "Copiar currículo", "Baixar .txt" e "Exportar PDF".
   - Antes do export, incluir aviso discreto: "Revise todas as informações antes de enviar."
6. Rodapé simples: "CVRadar ATS · Projeto educacional · As análises são estimativas, não garantias de aprovação."
Comportamento obrigatório da análise
Implemente uma análise determinística no navegador, em funções TypeScript separadas, sem fingir uso de IA e sem chamadas externas. É preferível uma análise heurística honesta que funciona a uma suposta IA não conectada.
Extração de palavras-chave
- Normalizar para comparação: caixa baixa, acentos, espaços, pontuação adequada; manter expressão legível na interface.
- Identificar termos relevantes da vaga com dicionário curado de competências (gerais e, especialmente, tecnologia), incluindo expressões compostas e siglas, como: atendimento ao cliente, gestão de projetos, comunicação, liderança, Excel, Power BI, SQL, Python, JavaScript, TypeScript, React, Git, GitHub, Linux, Windows Server, Active Directory, Microsoft 365, redes, TCP/IP, DNS, firewall, SIEM, SOC, análise de logs, resposta a incidentes, Nmap, ITIL, Azure e AWS.
- Complementar com extração conservadora de termos relevantes da descrição, excluindo stopwords em português, termos genéricos de recrutamento, artigos, verbos vagos e frases vazias. Não mostrar uma lista dominada por palavras sem valor profissional.
- Detectar termos compostos como unidades. Não considerar "Java" correspondência de "JavaScript", nem correspondência por substring acidental. Deduplicar variações ortográficas óbvias. Limitar apresentação a cerca de 15 palavras-chave realmente relevantes.
- Um termo só é "encontrado" se houver evidência textual no currículo original. Caso contrário, fica em "ausentes".
- Quando possível, dar maior peso a termos técnicos e requisitos explícitos. Não assumir que todas as palavras da vaga são obrigatórias.
Pontuação transparente
- Calcular score usando soma dos pesos dos termos encontrados dividida pela soma dos pesos de termos relevantes extraídos da vaga, multiplicada por 100, arredondada; limitar ao intervalo 0–100.
- Mostrar texto simples "X de Y competências/termos identificados" e deixar claro que é somente aproximação.
- Se nenhum termo relevante for extraído, não exibir 100% nem inventar valores: apresentar "Análise inconclusiva: descrição insuficiente".
- O score deve realmente mudar quando vaga ou currículo mudarem e uma nova análise for iniciada, sem valores fixos para demonstração.
Geração segura da versão ajustada
- Extrair seções existentes do texto com heurísticas de cabeçalhos comuns em português: nome e contato; resumo/objetivo; competências; experiência profissional; formação; cursos/certificações; projetos; idiomas; outras informações.
- Reordenar seções identificadas para layout ATS de uma coluna: contato, resumo já existente, competências comprovadas, experiência, formação, certificações, projetos e demais seções.
- Padronizar apenas nomes de títulos, espaçamento e marcadores. Preservar o texto original de cada experiência e seus fatos. Não criar novos bullets com alegações não presentes.
- Uma seção "Competências identificadas no currículo" pode reunir termos da vaga efetivamente presentes no currículo, com transparência. Nunca incluir termos faltantes nessa seção.
- Se os cabeçalhos originais não forem reconhecidos de forma confiável, manter o texto original inteiro, preservar a ordem e apenas aplicar formatação mínima; nunca perder trechos silenciosamente.
- O resultado é editável antes de baixar. Se o usuário editar manualmente, exportar exatamente a versão editada.
- Evitar tabelas, ícones, imagens, colunas múltiplas, barras de habilidades e elementos decorativos no currículo exportado.
Exportação de verdade
- Copiar: Clipboard API com feedback de sucesso/erro.
- TXT: gerar um Blob text/plain UTF-8 com nome curriculo-cvradar-ats.txt e fazer download.
- PDF: implementar versão de impressão estilizada com @media print, contendo SOMENTE o currículo final editado, texto selecionável, tamanho A4, margens adequadas, títulos simples e sem a interface do app. Botão deve executar window.print() para permitir "Salvar como PDF" no navegador. Rotular em apoio: "Na janela de impressão, selecione Salvar como PDF". Não tirar screenshot do currículo nem gerar PDF como imagem, pois isso atrapalha leitura por ATS.
- Botões de exportação ficam desabilitados até existir currículo gerado.
Dados de demonstração
Ao clicar "Testar com exemplo", preencher ambos os campos com textos FICTÍCIOS em português brasileiro, com quantidade suficiente para análise real:

Vaga fictícia: Analista de Segurança da Informação Júnior. Requisitos: monitoramento de alertas de segurança, análise de logs, fundamentos de redes TCP/IP, Linux, Windows, SIEM, resposta a incidentes, documentação técnica e comunicação. Diferenciais: Python, Azure e Nmap.

Currículo fictício: Marina Costa, contato fictício example.com, "Analista de suporte de TI com experiência em atendimento a usuários, análise de logs do Windows, documentação de chamados, configuração básica de redes TCP/IP e suporte ao ambiente Windows. Formação em Sistemas de Informação. Projeto acadêmico de monitoramento de eventos com Linux. Conhecimentos de Python em projetos de estudo." Não atribuir a ela SOC, SIEM, resposta a incidentes, Nmap ou Azure que não foram informados.

Exemplo deve gerar termos encontrados E ausentes, e permitir testar o botão de análise e as exportações. Marcar claramente "Exemplo fictício".
Estados de UX e segurança de dados
- Exigir descrição da vaga e currículo não vazios e com extensão mínima razoável; usar validações com mensagens acessíveis sem quebrar a tela.
- Não persistir currículo em banco de dados, localStorage, cookies ou analytics. Manter dados apenas em memória enquanto a página estiver aberta.
- Não implementar login, banco, Supabase, Lovable Cloud backend, Edge Functions, APIs externas, chaves de IA, autenticação, integrações pagas ou histórico nesta primeira versão.
- Não enviar texto do currículo ou descrição da vaga a servidores de terceiros. O processamento deve ocorrer no cliente.
- Garantir que o botão "Limpar dados" remova as informações da sessão atual da interface.
- Mensagens curtas, reais e honestas; nada de métricas artificiais, usuários fictícios ou depoimentos falsos.
- SEO básico com <title>CVRadar ATS | Analise seu currículo para vagas</title>, meta description e idioma pt-BR.
Entrega técnica e critérios de aceite
- Criar estrutura organizada, por exemplo: src/components para formulário e resultado, src/lib/ats para extração e pontuação, src/lib/resume para reorganização e src/data para exemplo fictício. Ajustar à arquitetura gerada pelo Lovable.
- Usar tipagem TypeScript clara e tratar casos extremos (texto vazio, ausência de palavras-chave, acentos, duplicatas, currículos longos, responsividade).
- Verificar internamente o fluxo: carregar exemplo → analisar → mostrar encontrados/ausentes → abrir currículo final editável → copiar → baixar TXT → exportar com impressão A4. Corrigir erros de compilação identificados antes de encerrar.
- O aplicativo final deve ser utilizável com os dados inseridos pelo usuário, não apenas o exemplo.
- Não gerar páginas ou funcionalidades fora desse escopo. Não gastar processamento com imagens geradas.
ENTREGUE A APLICAÇÃO FUNCIONAL COMPLETA NO BUILD INICIAL. Não explique somente o plano. Se tiver de priorizar, garanta primeiro o fluxo completo do desafio e depois os detalhes visuais.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://curriculo-match-mestre.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/72a1ba2e-0af3-416e-8c1d-17e36038e9af).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
