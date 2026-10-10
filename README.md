# Campus Fácil — aplicação responsiva

Projeto acadêmico desenvolvido com HTML, CSS e JavaScript puro para as atividades de Desenvolvimento Web.

## Estrutura atual

A interface está concentrada em uma única página responsiva: `dist/index.html`.

As áreas Início, Explorar, Detalhes, Favoritos e Administração são abertas sem recarregar a aplicação. Os arquivos HTML antigos continuam no projeto apenas para redirecionar links já existentes para a seção correspondente da página principal.

## Recursos do protótipo

- Navegação em página única por menu e rotas com `#`;
- Pesquisa e filtros de locais;
- Exibição dinâmica de detalhes;
- Favoritos salvos no navegador;
- Validação dos formulários;
- Painel administrativo demonstrativo;
- Login tradicional demonstrativo;
- Login federado com Google Identity Services;
- Layout adaptado para computador, tablet e celular.

## Arquivos publicados

O conteúdo publicado pelo site está na pasta `dist`:

- `index.html`: estrutura da aplicação;
- `styles.css`: estilos e regras responsivas;
- `script.js`: navegação e interações;
- `favicon.svg`: ícone do site.

O arquivo `amplify.yml`, na raiz do repositório, configura o AWS Amplify para publicar a pasta `dist`.

## Teste da autenticação Google

1. Publique o repositório pelo AWS Amplify.
2. Abra `https://www.everson.dunga.web.ufersa.dev.br/`.
3. Abra as Ferramentas do desenvolvedor (`F12`) e selecione a aba **Console**.
4. Clique em **Entrar** e use **Continuar com Google** com uma conta cadastrada como usuário de teste no Google Auth Platform.
5. Após a autenticação, procure no Console por `GOOGLE_ID_TOKEN_JWT:`.

O token é exibido apenas para a atividade. O Client Secret não é utilizado nem deve ser incluído no projeto. Em uma aplicação real, o ID token precisa ser enviado ao backend e validado criptograficamente antes de criar uma sessão.
