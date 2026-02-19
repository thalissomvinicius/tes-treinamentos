# T&S Treinamentos — Plataforma de EAD Premium 🎓

Uma plataforma de cursos online moderna, desenvolvida para oferecer uma experiência de aprendizado fluida, segura e esteticamente premium. Focada no setor de SST (Saúde e Segurança do Trabalho), o projeto combina tecnologia de ponta com um design focado no usuário.

Desenvolvido por **Vinicius Dev**.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando o que há de mais moderno no ecossistema Web:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + GoTrue)
- **Geração de Documentos:** [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/index.html) para certificados dinâmicos
- **Processamento de Conteúdo:** [MDX](https://mdxjs.com/) (Remark GFM) para lições ricas em markdown

---

## ✨ Funcionalidades Principais

### 🛡️ Certificação de Alta Segurança
O sistema de certificados foi projetado para ser à prova de fraudes:
- **Lock de Identidade:** O nome no certificado é vinculado obrigatoriamente aos dados oficiais do cadastro, impossibilitando a alteração manual no momento da emissão.
- **Validação Pública:** Página de verificação em tempo real via QR Code/Código único, permitindo que terceiros validem a autenticidade do documento diretamente em nossa plataforma.
- **Design Premium:** Layout refinado em paleta *Navy & Gold* com selos digitais de qualidade.

### 📊 Experiência de Aprendizado (UX/UI)
- **Dashboard Dinâmico:** Visualização de progresso circular e ilustrações em Flat Design animadas.
- **Conteúdo Rico:** Suporte completo para lições em Markdown com tabelas complexas, vídeos e imagens.
- **Avaliações Interativas:** Sistema de Quizzes com feedback visual instantâneo e anéis de pontuação dinâmicos.

### 📱 Comunicação Direta
- **Integração com WhatsApp:** Floating button pulsante em todas as páginas para suporte e vendas imediatas, otimizando a conversão.

---

## 🛠️ Como Iniciar o Projeto

### Pré-requisitos
- Node.js 20+
- Conta no Supabase (com as tabelas `purchases`, `progress` e `certificates` configuradas)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/thalissomvinicius/tes-treinamentos.git

# Entre na pasta
cd tes-treinamentos

# Instale as dependências
npm install

# Configure as variáveis de ambiente (.env.local)
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

### Execução

```bash
# Modo de desenvolvimento
npm run dev

# Build de produção
npm run build
```

---

## 👨‍💻 Desenvolvedor

Este projeto reflete meu compromisso com a excelência técnica e design de produto. Cada componente foi pensado para ser escalável, acessível e visualmente impactante.

**Vinicius Dev** | *Full Stack Developer*

---

> [!NOTE]
> Este projeto foi desenvolvido sob medida para a **T&S Treinamentos e Consultoria LTDA**.
