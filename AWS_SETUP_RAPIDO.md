# Campus Fácil — configuração final Cognito + WebSocket + Lambda + Gemini

## Situação atual verificada em 30/10/2026

- Cognito criado e configurado em `us-east-1`;
- User Pool: `us-east-1_RH844UVsg`;
- App Client público: `198tvjqtv9j6g59mo6debb7fnn`;
- função Lambda `campus-facil-chat` configurada;
- WebSocket API `campus-facil-websocket` criada com as rotas `$connect`, `$default` e `$disconnect`;
- API ID: `0mr93rwc3b`;
- stage: `prod`;
- domínio WebSocket: `api.everson.dunga.web.ufersa.dev.br`;
- certificado ACM emitido;
- registro DNS criado e resolvendo corretamente;
- teste HTTPS retornou `HTTP/2 403`, resultado esperado para uma requisição comum enviada a um endpoint WebSocket.

Os passos de infraestrutura abaixo ficam documentados para conferência. Para concluir a atividade, siga diretamente o arquivo `PASSOS_RESTANTES.md`.

Use a região **us-east-1 (N. Virginia)** em todos os serviços.

## 1. Criar o usuário e o App Client no Amazon Cognito

1. Abra **Amazon Cognito → User pools → Create user pool**.
2. Nome: `campus-facil-users`.
3. Permita login por **e-mail**.
4. Crie um app client do tipo **Single-page application (SPA)** e **sem client secret**.
5. Nos fluxos de autenticação do app client, habilite:
   - `ALLOW_USER_PASSWORD_AUTH`;
   - `ALLOW_REFRESH_TOKEN_AUTH`.
6. Copie o **User pool ID** e o **App client ID**.
7. Edite `dist/config.js` e substitua os dois valores `COLE_AQUI...`.

Para criar rapidamente um usuário permanente, abra o **CloudShell** e execute, substituindo os dados:

```bash
aws cognito-idp admin-create-user \
  --region us-east-1 \
  --user-pool-id SEU_USER_POOL_ID \
  --username SEU_EMAIL \
  --user-attributes Name=email,Value=SEU_EMAIL Name=email_verified,Value=true \
  --message-action SUPPRESS

aws cognito-idp admin-set-user-password \
  --region us-east-1 \
  --user-pool-id SEU_USER_POOL_ID \
  --username SEU_EMAIL \
  --password 'Campus@2026Teste' \
  --permanent
```

Use uma senha própria no lugar do exemplo.

## 2. Obter a chave do Gemini

1. Abra o Google AI Studio e entre em **Get API key**.
2. Crie uma chave da API Gemini.
3. Guarde a chave para adicioná-la apenas nas variáveis da Lambda.
4. Não coloque essa chave no GitHub ou no frontend.

## 3. Criar a função Lambda

1. Abra **AWS Lambda → Create function → Author from scratch**.
2. Nome: `campus-facil-chat`.
3. Runtime: **Node.js 22.x** (Node.js 20.x também funciona).
4. Arquitetura: `x86_64`.
5. Depois de criar, envie o arquivo `lambda-campus-facil.zip` em **Code → Upload from → .zip file**.
6. Em **Runtime settings**, confirme o handler `index.handler`.
7. Em **Configuration → General configuration**, use:
   - Memory: `256 MB`;
   - Timeout: `29 seconds`.
8. Em **Configuration → Environment variables**, adicione:

| Variável | Valor |
|---|---|
| `USER_POOL_ID` | `us-east-1_RH844UVsg` |
| `CLIENT_ID` | `198tvjqtv9j6g59mo6debb7fnn` |
| `GEMINI_API_KEY` | Chave da API Gemini |
| `GEMINI_MODEL` | `gemini-2.5-flash` |
| `CALLBACK_ENDPOINT` | `https://0mr93rwc3b.execute-api.us-east-1.amazonaws.com/prod` |

O `CALLBACK_ENDPOINT` deve usar o endpoint nativo de gerenciamento de conexões. O frontend continua usando o domínio personalizado `wss://api.everson.dunga.web.ufersa.dev.br`.

## 4. Criar a API WebSocket

1. Abra **API Gateway → Create API → WebSocket API → Build**.
2. Nome: `campus-facil-websocket`.
3. Route selection expression: `$request.body.action`.
4. Crie as rotas:
   - `$connect`;
   - `$default`;
   - `$disconnect`.
5. Nas três rotas, escolha integração **Lambda** e selecione `campus-facil-chat`.
6. Crie o stage `prod` e habilite **Auto-deploy**.
7. Copie o **API ID**.

## 5. Permitir que a Lambda responda pelo WebSocket

Na conta AWS Academy, a Lambda foi criada usando a função de execução existente `LabRole`, pois o usuário do laboratório não possui permissão para criar uma nova role no IAM.

Teste primeiro a aplicação. Se o CloudWatch mostrar erro de permissão em `execute-api:ManageConnections`, será necessário confirmar com o professor se a `LabRole` disponibilizada pelo laboratório inclui essa ação. Em uma conta com permissão para editar IAM, a política necessária seria:

1. Na Lambda, entre em **Configuration → Permissions**.
2. Clique no nome da **Execution role**.
3. Em IAM, escolha **Add permissions → Create inline policy → JSON**.
4. Cole, substituindo `ACCOUNT_ID` e `API_ID`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "execute-api:ManageConnections",
      "Resource": "arn:aws:execute-api:us-east-1:ACCOUNT_ID:API_ID/prod/POST/@connections/*"
    }
  ]
}
```

5. Nome da política: `WebSocketManageConnections`.

## 6. Configurar o DNS exigido na atividade

1. No **AWS Certificate Manager (ACM)**, em `us-east-1`, solicite certificado público para:
   `api.everson.dunga.web.ufersa.dev.br`.
2. Valide o certificado por DNS.
3. No **API Gateway → Custom domain names**, crie:
   `api.everson.dunga.web.ufersa.dev.br`.
4. Tipo: **Regional**. Selecione o certificado validado.
5. Em **API mappings**, associe a API `campus-facil-websocket` ao stage `prod`, com caminho vazio.
6. No Route 53, crie um registro **A — Alias** chamado `api.everson.dunga` apontando para o domínio regional fornecido pelo API Gateway. Se a zona hospedada já for `everson.dunga.web.ufersa.dev.br`, o nome do registro será apenas `api`.

## 7. Publicar o frontend

1. Em **Amplify → Domain management**, confirme que a branch `main` também responde em `everson.dunga.web.ufersa.dev.br`. Se existir somente o endereço com `www`, adicione o domínio sem `www` para o print final exigido pelo professor.
2. Substitua no GitHub a pasta `dist` completa pela versão atualizada. Ela contém `index.html`, `styles.css`, `script.js`, `config.js`, `favicon.svg` e os redirecionamentos das páginas antigas.
3. Confirme que `amplify.yml` está na raiz do repositório, fora da pasta `dist`.
4. Faça o commit:

```text
feat: integra Cognito WebSocket Lambda e Gemini
```

5. Aguarde o deploy automático do AWS Amplify.

## 8. Prints para entrega

### Print 1 — conexão WebSocket

1. Entre no site usando o usuário do Cognito.
2. Pressione `F12` → **Network** → filtro **WS**.
3. Clique na conexão `api.everson.dunga.web.ufersa.dev.br`.
4. Em **Headers**, mostre `Request URL` e `Status Code: 101 Switching Protocols`.

### Print 2 — envio e processamento

1. Ainda na conexão WebSocket, abra **Messages**.
2. Envie uma pergunta pelo chat.
3. Mostre o frame enviado com `action: perguntar` e `mensagem`.
4. Para comprovar a Lambda, abra **Lambda → Monitor → View CloudWatch logs** e mostre a linha `MENSAGEM_PROCESSADA_NA_LAMBDA`.

### Print 3 — resposta no frontend

1. Aguarde a resposta aparecer no chat.
2. Faça o print mostrando a pergunta, a resposta e a barra de endereço com:
   `everson.dunga.web.ufersa.dev.br`.

## Diagnóstico rápido

- WebSocket fecha com `1006`: verifique User Pool ID, Client ID e as rotas `$connect`/`$default`.
- WebSocket conecta, mas não responde: confira a permissão `execute-api:ManageConnections` e `CALLBACK_ENDPOINT`.
- Lambda mostra erro `403 GoneException`: reconecte a página e envie novamente.
- Gemini retorna `400` ou `404`: confirme a chave e tente o modelo `gemini-2.5-flash`.
- Login retorna `Auth flow not enabled`: habilite `ALLOW_USER_PASSWORD_AUTH` no app client.
