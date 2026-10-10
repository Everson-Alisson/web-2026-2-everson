# Campus Fácil — Protótipo navegável

Projeto acadêmico desenvolvido com HTML, CSS e JavaScript puro para as atividades de Desenvolvimento Web.

## Como abrir

Abra `dist/index.html` no navegador. Essa página apresenta os links para as seis telas:

1. Página inicial
2. Resultados da pesquisa
3. Detalhes do local
4. Login
5. Perfil e favoritos
6. Painel administrativo

## Comportamentos implementados

- Navegação entre todas as páginas;
- Busca com validação e envio do termo pela URL;
- Pesquisa e filtros dinâmicos na página de resultados;
- Validação de e-mail e senha no formulário de login;
- Login federado com Google Identity Services;
- Exibição do ID token JWT no Console do navegador para demonstração acadêmica;
- Favoritar local usando `localStorage`;
- Formulário de sugestão de correção com validação;
- Remoção de favoritos com confirmação;
- Busca na tabela administrativa;
- Cadastro demonstrativo de local;
- Ativação e desativação demonstrativa de registros;
- Mensagens de sucesso, erro e informação.

O projeto foi preparado para apresentação em desktop, com largura mínima de 1180 px. As operações são demonstrativas e executadas no navegador, sem banco de dados ou backend.

## Teste da autenticação Google

1. Publique a pasta `dist` pelo AWS Amplify.
2. Abra `https://www.everson.dunga.web.ufersa.dev.br/login.html`.
3. Abra as Ferramentas do desenvolvedor (`F12`) e selecione a aba **Console**.
4. Clique em **Entrar com o Google** e use uma conta cadastrada como usuário de teste no Google Auth Platform.
5. Após a autenticação, procure no Console por `GOOGLE_ID_TOKEN_JWT:`.

O token é exibido apenas para a atividade. O Client Secret não é utilizado nem deve ser incluído no projeto. Em uma aplicação real, o ID token precisa ser enviado ao backend e validado criptograficamente antes de criar uma sessão.
