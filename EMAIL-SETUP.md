# Configuração do envio do briefing com EmailJS

O formulário envia os dados pelo SDK do EmailJS diretamente do navegador. Não é necessário domínio próprio nem uma função de servidor. A mensagem de destino deve ser definida no template do EmailJS como o endereço informado em `src/data/profile.ts`; o e-mail do visitante é usado como endereço de resposta.

## Configuração da conta EmailJS

1. No painel do EmailJS, conecte o serviço de e-mail que enviará as mensagens.
2. Crie o template **Briefing** e configure o destinatário fixo como seu e-mail de contato. Não use um campo preenchido pelo visitante como destinatário.
3. Configure assunto e corpo do template **Briefing** com estes parâmetros:
   - `{{from_name}}` — nome ou empresa
   - `{{reply_to}}` — e-mail para resposta
   - `{{service_type}}` — escopo selecionado
   - `{{project_details}}` — detalhes do projeto
4. Crie um segundo template, **Confirmação**, e configure o campo **To Email** como `{{to_email}}`. Use `{{from_name}}` e `{{service_type}}` para personalizar a confirmação. Configure o **Reply To** como `{{reply_to}}` para que a resposta do visitante vá para o seu contato.
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
