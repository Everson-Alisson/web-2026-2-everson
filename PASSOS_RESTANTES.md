# Campus Fácil — passos restantes para concluir a atividade

## 1. Atualizar o GitHub

1. Extraia o arquivo `Campus_Facil_GitHub_Atualizado.zip` no computador.
2. No repositório conectado ao Amplify, substitua a pasta `dist` completa pela pasta `dist` do pacote.
3. Adicione ou substitua na raiz do repositório:
   - `amplify.yml`;
   - `README.md`;
   - `AWS_SETUP_RAPIDO.md`;
   - `PASSOS_RESTANTES.md`.
4. Não envie `lambda-campus-facil.zip`, a chave Gemini, senhas ou tokens ao GitHub.
5. Use a mensagem de commit:

```text
feat: integra autenticação Cognito e chat WebSocket com Gemini
```

## 2. Aguardar o AWS Amplify

1. Abra **AWS Amplify → campus-facil → main**.
2. Aguarde todas as etapas ficarem verdes e o deploy mostrar **Succeeded**.
3. Abra o site pelo domínio personalizado.
4. Para o print final, prefira `https://everson.dunga.web.ufersa.dev.br`. Se apenas o endereço com `www` estiver funcionando, confira em **Amplify → Domain management** se o domínio sem `www` está associado à branch `main`.

## 3. Testar autenticação e WebSocket

1. Abra o site em uma janela anônima para evitar uma sessão antiga.
2. Pressione `F12` e abra **Network**.
3. Entre com o usuário criado no Cognito e a senha permanente atual.
4. A aplicação deve abrir diretamente o **Assistente IA**.
5. Em **Network**, selecione o filtro **WS**.
6. A conexão deve aparecer como `api.everson.dunga.web.ufersa.dev.br` e permanecer aberta.
7. Clique na conexão e confirme em **Headers**:
   - Request URL começando com `wss://api.everson.dunga.web.ufersa.dev.br`;
   - Status Code `101 Switching Protocols`.
8. Não divulgue o valor do parâmetro `token` do endereço. Oculte-o no print, mantendo visíveis o domínio e o status 101.

## 4. Enviar a pergunta

1. No chat, envie uma pergunta simples, por exemplo:

```text
Quais serviços o Campus Fácil oferece aos estudantes?
```

2. Na conexão WebSocket do DevTools, abra **Messages**.
3. Confirme que existe um frame enviado contendo `action`, `mensagem` e a pergunta.
4. Aguarde a resposta do Gemini aparecer na interface.

## 5. Conferir a Lambda

1. Abra **Lambda → campus-facil-chat → Monitor → View CloudWatch logs**.
2. Entre no log stream mais recente.
3. Procure pelas linhas:
   - `CONEXAO_AUTENTICADA_COGNITO`;
   - `MENSAGEM_PROCESSADA_NA_LAMBDA`;
   - `RESPOSTA_GERADA_PELO_GEMINI`.

Se ocorrer erro, confira a tabela de diagnóstico no final deste documento.

## 6. Tirar os três prints

### Print 1 — conexão WebSocket

Mostre ao mesmo tempo:

- navegador no domínio do projeto;
- DevTools em **Network → WS → Headers**;
- `wss://api.everson.dunga.web.ufersa.dev.br`;
- status `101 Switching Protocols`.

### Print 2 — processamento pela Lambda

Mostre o CloudWatch com a linha `MENSAGEM_PROCESSADA_NA_LAMBDA`, incluindo a pergunta enviada. Evite mostrar chaves, senhas ou tokens.

### Print 3 — resposta no frontend

Mostre ao mesmo tempo:

- a pergunta;
- a resposta recebida do Gemini;
- a barra de endereço com `everson.dunga.web.ufersa.dev.br`.

## Diagnóstico rápido

| Sintoma | O que verificar |
|---|---|
| Login informa credenciais incorretas | E-mail do usuário Cognito e senha permanente atual |
| Login mostra `Auth flow not enabled` | App Client com `ALLOW_USER_PASSWORD_AUTH` |
| WebSocket não aparece ou fecha com `1006` | `dist/config.js`, rota `$connect`, deploy do stage `prod` e logs da Lambda |
| Resposta HTTP 401 no `$connect` | User Pool ID, App Client ID, validade do Access Token e relógio do computador |
| WebSocket conecta, mas não responde | Rota `$default`, `CALLBACK_ENDPOINT` nativo e permissão `execute-api:ManageConnections` da `LabRole` |
| Lambda mostra `GoneException` | Recarregue a página, reconecte e envie novamente |
| Gemini retorna 400/403 | Chave Gemini na variável `GEMINI_API_KEY` e acesso da chave à API |
| Gemini retorna 404 de modelo | Confirme `GEMINI_MODEL=gemini-2.5-flash` |

## Configurações finais esperadas

| Item | Valor |
|---|---|
| Região | `us-east-1` |
| User Pool | `us-east-1_RH844UVsg` |
| App Client | `198tvjqtv9j6g59mo6debb7fnn` |
| API WebSocket | `0mr93rwc3b` |
| Stage | `prod` |
| Frontend WebSocket | `wss://api.everson.dunga.web.ufersa.dev.br` |
| Callback da Lambda | `https://0mr93rwc3b.execute-api.us-east-1.amazonaws.com/prod` |
