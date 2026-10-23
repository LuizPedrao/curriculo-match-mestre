# CVRadar ATS — Currículo Match Mestre

**Seu currículo com mais clareza para cada oportunidade.**

Aplicação web que compara um currículo com a descrição de uma vaga, identifica competências relevantes e organiza uma versão mais simples de ler por sistemas de recrutamento (ATS), **sem inventar experiências ou qualificações**.

**[Acessar aplicação](https://curriculo-match-mestre.lovable.app)** · **[Repositório GitHub](https://github.com/LuizPedrao/curriculo-match-mestre)** · **[Mega prompt utilizado](docs/mega-prompt.md)**

> **Projeto educacional desenvolvido para um desafio da [DIO](https://www.dio.me/), com apoio do [Lovable](https://lovable.dev/).** A análise representa uma estimativa baseada em palavras-chave; não é um resultado oficial de um ATS nem garante aprovação em processos seletivos.

---

## 🎯 Problema e objetivo

Mesmo quando um candidato possui experiências relevantes, o currículo pode não destacar os termos utilizados na descrição de uma vaga. Isso dificulta a leitura e a comparação do perfil, tanto por ferramentas automatizadas quanto por recrutadores.

O **CVRadar ATS** ajuda a identificar essas diferenças e a apresentar o histórico profissional com mais clareza. A aplicação foi pensada para ser **gratuita, sem cadastro, responsiva e utilizável diretamente no navegador**.

## ✨ Funcionalidades

| Recurso | O que faz |
| --- | --- |
| Comparação com a vaga | Recebe a descrição da oportunidade e o currículo em texto. |
| Compatibilidade estimada | Calcula uma pontuação de 0 a 100 a partir dos termos relevantes identificados. |
| Palavras-chave | Separa competências **encontradas** e **ausentes** no currículo. |
| Recomendações | Sugere pontos de revisão sem incluir automaticamente habilidades não comprovadas. |
| Currículo ATS-friendly | Reorganiza seções reconhecidas em um formato textual simples e editável. |
| Exportação | Permite copiar o currículo, baixar um arquivo **.txt** ou usar a impressão do navegador para **salvar em PDF**. |
| Exemplo fictício | Carrega uma vaga e um currículo demonstrativos para testar o fluxo. |
| Perfil da vaga | Oferece seleção **Geral** ou **Tecnologia** para orientar a extração de termos. |

## 🔎 Como a análise funciona

1. **Entrada:** o usuário cola o texto da vaga e do currículo.
2. **Preparação:** o sistema normaliza os textos para comparação, considerando diferenças de maiúsculas/minúsculas, acentos e pontuação.
3. **Identificação:** um dicionário de competências e uma extração conservadora procuram termos relevantes na descrição da vaga, inclusive expressões técnicas.
4. **Comparação:** cada termo é classificado como **encontrado** ou **ausente** com base no conteúdo do currículo original.
5. **Pontuação:** a aplicação calcula uma média ponderada dos termos encontrados, atribuindo pesos diferentes a requisitos técnicos e diferenciais.
6. **Revisão:** recomendações orientam o usuário a evidenciar experiências reais. A aplicação reorganiza seções reconhecidas sem criar fatos novos.
7. **Exportação:** o texto resultante pode ser editado, copiado, baixado em TXT ou impresso como PDF.

A fórmula usada para a estimativa é:

```text
Compatibilidade = 100 × (soma dos pesos encontrados / soma dos pesos analisados)
```

Os termos são limitados a uma seleção relevante (até aproximadamente 15). Se não houver termos suficientes para uma análise confiável, a aplicação indica que o resultado é **inconclusivo**, em vez de inventar uma nota.

**Importante:** a pontuação mede correspondência textual dentro deste projeto. Ela não avalia todo o contexto profissional do candidato nem reproduz a classificação de plataformas ATS comerciais.

## 🛡️ Princípio de honestidade

O CVRadar ATS **não deve inventar** empresas, cargos, períodos, cursos, certificações, atividades ou competências.

- Termos ausentes são apresentados como **oportunidades de revisão**, não adicionados automaticamente ao currículo.
- A versão ajustada preserva as informações fornecidas pelo usuário, com reorganização de seções e formatação simples.
- O usuário pode revisar e editar o texto antes de exportar.
- A análise é feita com lógica determinística no navegador, **sem chamar um modelo de IA para avaliar o currículo**.

O uso de IA generativa ocorreu no **processo de construção do projeto com o Lovable**, não como promessa de inteligência artificial externa na análise final.

## 🧰 Tecnologias

| Tecnologia | Aplicação no projeto |
| --- | --- |
| **Lovable** | Geração inicial e evolução da aplicação a partir do prompt. |
| **React + TypeScript** | Interface, componentes e regras tipadas. |
| **TanStack Start / Router** | Estrutura de rotas da aplicação gerada. |
| **Tailwind CSS** | Estilização responsiva. |
| **shadcn/ui + Lucide React** | Componentes visuais e ícones. |
| **Vite** | Desenvolvimento e build. |
| **Vitest** | Testes automatizados. |
| **Git + GitHub** | Versionamento e documentação da entrega. |

### Estrutura principal

```text
.
├── docs/
│   └── mega-prompt.md               # Prompt original da geração no Lovable
├── public/                           # Arquivos públicos
├── src/
│   ├── components/cvradar/
│   │   ├── AnalysisResult.tsx        # Pontuação, termos e recomendações
│   │   ├── ResumeEditor.tsx          # Edição e exportações
│   │   └── PrintableResume.tsx       # Currículo preparado para impressão
│   ├── data/example.ts              # Vaga e currículo fictícios
│   ├── lib/
│   │   ├── ats/                      # Dicionário, normalização e análise
│   │   └── resume/reorganize.ts      # Organização do currículo
│   └── routes/index.tsx             # Tela principal
├── package.json
└── README.md
```

## 🚀 Executar localmente

Pré-requisito: **Node.js** instalado.

```bash
git clone https://github.com/LuizPedrao/curriculo-match-mestre.git
cd curriculo-match-mestre
npm install
npm run dev
```

Abra o endereço local informado no terminal. Para compilar e testar:

```bash
npm run build
npm run test
npm run lint
```

Os scripts acima estão definidos em `package.json`. O projeto também contém testes da análise de palavras-chave e da rota principal, incluindo situações como a distinção entre **Java** e **JavaScript**, ausência de termos e preservação de competências realmente presentes.

## 🧪 Demonstração e validação

**Acesse:** https://curriculo-match-mestre.lovable.app

Para reproduzir o fluxo principal:

1. Clique em **Testar com exemplo**.
2. Confira a vaga fictícia de **Analista de Segurança da Informação Júnior** e o currículo demonstrativo.
3. Clique em **Analisar currículo**.
4. Observe a pontuação estimada e os grupos de palavras-chave presentes e ausentes.
5. Revise o currículo reorganizado no editor.
6. Experimente **Copiar currículo**, **Baixar .txt** e **Exportar PDF**. Para PDF, escolha **Salvar como PDF** na janela de impressão.

O exemplo é fictício e foi incluído para permitir a reprodução do funcionamento sem expor dados pessoais.

> **Evidências visuais:** capturas reais do formulário preenchido, do resultado da análise e da exportação poderão ser adicionadas ao repositório após a validação manual da aplicação publicada. Não foram incluídas imagens ilustrativas no lugar de testes reais.

## 🧠 Engenharia de prompt e evolução

O desafio propôs a criação da aplicação do zero no Lovable a partir de um **mega prompt em Markdown**. O documento completo utilizado na primeira geração foi preservado em:

**➡️ [docs/mega-prompt.md](docs/mega-prompt.md)**

### Decisões definidas no prompt inicial

- Priorizar o **MVP completo**: comparação, recomendações, edição e exportação.
- Adotar **React, TypeScript, Tailwind CSS e shadcn/ui**, com visual limpo e responsivo.
- Utilizar uma **análise local e transparente**, sem dependência de API paga, login ou banco de dados.
- Dar atenção a competências da área de **tecnologia e segurança da informação**, sem restringir o uso a esse setor.
- Impedir a inclusão automática de conhecimentos inexistentes no histórico original.

### Da especificação à implementação

A implementação gerada utiliza a estrutura **TanStack Start/Router**, funções específicas para normalização e análise, um módulo de reorganização do currículo e componentes separados para resultados e exportação. A saída em PDF é oferecida pela **impressão do navegador**, permitindo salvar um documento com texto selecionável.

**Refinamentos posteriores:** não há, nesta documentação, registro confirmado de mudanças solicitadas depois da geração inicial. Novos ajustes devem ser anotados aqui com **o que foi alterado, por que foi necessário e qual foi o resultado**, mantendo o histórico da evolução verificável.

## 🔐 Privacidade e limitações

- O conteúdo analisado é processado **no navegador**, sem login ou persistência em banco de dados nesta versão.
- A aplicação trabalha com **texto colado**; não oferece upload de currículos em DOCX/PDF no MVP.
- A análise é baseada em **termos e regras heurísticas**, portanto pode não identificar sinônimos, equivalências ou competências implícitas.
- **Exportar PDF** abre a impressão do navegador; o usuário deve escolher **Salvar como PDF**.
- A ferramenta ajuda a revisar o currículo, mas **não garante contratação nem aprovação em ATS**.

## 🗺️ Possíveis evoluções

- Importação e exportação em DOCX.
- Histórico de análises, com consentimento do usuário.
- Expansão do vocabulário para outras áreas profissionais.
- Melhor detecção de equivalências e sinônimos.
- Inclusão de capturas reais de testes no repositório.

---

### 👨‍💻 Autor

**[Luiz Pedrão](https://github.com/LuizPedrao)**

Desenvolvido como projeto prático de portfólio e entrega educacional da **DIO**.

**[Ver aplicação publicada](https://curriculo-match-mestre.lovable.app)** · **[Ver o código no GitHub](https://github.com/LuizPedrao/curriculo-match-mestre)**
