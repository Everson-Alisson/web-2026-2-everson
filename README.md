# Campus Fácil — aplicação responsiva

Projeto acadêmico desenvolvido com HTML, CSS e JavaScript puro para as atividades de Desenvolvimento Web.

## Estrutura atual

A interface está concentrada em uma única página responsiva: `dist/index.html`.

As áreas Início, Explorar, Detalhes, Assistente IA, Favoritos e Administração são abertas sem recarregar a aplicação. Os arquivos HTML antigos continuam no projeto apenas para redirecionar links já existentes para a seção correspondente da página principal.

Ao acessar o site sem uma sessão autenticada, a tela de login ocupa toda a página. O frontend autentica o usuário no Amazon Cognito e recebe tokens JWT. O menu e o conteúdo somente são liberados quando existe um Access Token válido na sessão da aba.

## Recursos do protótipo

- Navegação em página única por menu e rotas com `#`;
- Pesquisa e filtros de locais;
- Exibição dinâmica de detalhes;
- Favoritos salvos no navegador;
- Validação dos formulários;
- Painel administrativo demonstrativo;
- Login real no Amazon Cognito e geração de tokens JWT;
- Conexão WebSocket autenticada com o Amazon API Gateway;
- Processamento da mensagem por AWS Lambda;
- Integração da Lambda com a API do Google Gemini;
- Chat com resposta em tempo real pelo WebSocket;
- Controle de acesso às telas enquanto o usuário não estiver autenticado;
- Layout adaptado para computador, tablet e celular.

## Arquivos publicados

O conteúdo publicado pelo site está na pasta `dist`:

- `index.html`: estrutura da aplicação;
- `styles.css`: estilos e regras responsivas;
- `script.js`: navegação e interações;
- `config.js`: IDs públicos do Cognito e endereço WebSocket;
- `favicon.svg`: ícone do site.

O arquivo `amplify.yml`, na raiz do repositório, configura o AWS Amplify para publicar a pasta `dist`.

## Configuração AWS e entrega

O arquivo `AWS_SETUP_RAPIDO.md` registra a configuração do Cognito, Lambda, API Gateway WebSocket, Gemini, IAM e domínio personalizado. O arquivo `PASSOS_RESTANTES.md` contém somente o que ainda falta fazer no GitHub, Amplify, teste final e captura dos três prints.

O segredo da API Gemini deve existir somente nas variáveis de ambiente da Lambda. Nunca inclua essa chave em `dist/config.js` ou no GitHub.
