# Configuração do envio do briefing com EmailJS

O formulário envia os dados pelo SDK do EmailJS diretamente do navegador. Não é necessário domínio próprio nem uma função de servidor. A mensagem de destino deve ser definida no template do EmailJS como o endereço informado em `src/data/profile.ts`; o e-mail do visitante é usado como endereço de resposta.

## Configuração da conta EmailJS

1. No painel do EmailJS, conecte o serviço de e-mail que enviará as mensagens.
2. Crie o template **Briefing** e configure o destinatário fixo como seu e-mail de contato. Não use um campo preenchido pelo visitante como destinatário.
3. Configure o assunto e o corpo do template **Briefing** usando os parâmetros abaixo. Se desejar, configure o campo **Reply To** como `{{email}}`:
   - `{{name}}` — nome ou empresa do solicitante
   - `{{email}}` — e-mail do solicitante
   - `{{subject}}` — escopo selecionado no formulário
   - `{{message}}` — descrição do projeto
4. No template **Confirmação**, configure o campo **To Email** como `{{email}}` para enviar a confirmação ao solicitante. Use `{{name}}`, `{{subject}}` e `{{message}}` no conteúdo conforme desejar.
5. Em **Account → Security**, limite as origens permitidas ao endereço publicado do site (por exemplo, o domínio `seu-projeto.vercel.app`). Adicione `http://localhost:5174` somente se precisar testar localmente.
6. Copie o **Public Key**, o **Service ID**, o ID do template **Briefing** e o ID do template **Confirmação**.

## Variáveis de ambiente

Defina estas variáveis no ambiente local (`.env.local`) e na Vercel, para os ambientes em que o formulário será utilizado:

```env
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID=
```

`.env.example` lista as variáveis sem valores secretos. As variáveis com prefixo `VITE_` são incluídas no código enviado ao navegador; a Public Key do EmailJS é pública por definição. Não coloque chaves privadas ou senhas nesses campos.

Depois de configurar as variáveis na Vercel, faça um novo deploy para que sejam incluídas na build. Para testar localmente, reinicie o servidor Vite após editar `.env.local`.

O formulário envia primeiro o briefing para você e, se esse envio for aceito, envia a confirmação ao visitante. Há um intervalo entre os dois envios para respeitar o limite de frequência do EmailJS; o formulário também limita novos envios de briefing a uma solicitação a cada 10 segundos por página. Se o briefing for enviado, mas a confirmação falhar, o visitante verá uma mensagem específica informando que o briefing foi recebido.
