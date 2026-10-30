# Configuração do envio do briefing com EmailJS

O formulário envia os dados pelo SDK do EmailJS diretamente do navegador. Não é necessário domínio próprio nem uma função de servidor. A mensagem de destino deve ser definida no template do EmailJS como o endereço informado em `src/data/profile.ts`; o e-mail do visitante é usado como endereço de resposta.

## Configuração da conta EmailJS

1. No painel do EmailJS, conecte o serviço de e-mail que receberá as mensagens.
2. Crie um template e configure o destinatário fixo como seu e-mail de contato. Não use um campo preenchido pelo visitante como destinatário.
3. Configure assunto e corpo com estes parâmetros:
   - `{{from_name}}` — nome ou empresa
   - `{{reply_to}}` — e-mail para resposta
   - `{{service_type}}` — escopo selecionado
   - `{{project_details}}` — detalhes do projeto
4. Em **Account → Security**, limite as origens permitidas ao endereço publicado do site (por exemplo, o domínio `seu-projeto.vercel.app`). Adicione `http://localhost:5174` somente se precisar testar localmente.
5. Copie o **Public Key**, o **Service ID** e o **Template ID** do painel.

## Variáveis de ambiente

Defina estas variáveis no ambiente local (`.env.local`) e na Vercel, para os ambientes em que o formulário será utilizado:

```env
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
```

`.env.example` lista as variáveis sem valores secretos. As variáveis com prefixo `VITE_` são incluídas no código enviado ao navegador; a Public Key do EmailJS é pública por definição. Não coloque chaves privadas ou senhas nesses campos.

Depois de configurar as variáveis na Vercel, faça um novo deploy para que sejam incluídas na build. Para testar localmente, reinicie o servidor Vite após editar `.env.local`.

O SDK limita o envio do formulário a uma solicitação a cada 10 segundos por página. Se o EmailJS rejeitar o envio ou estiver sem configuração, o formulário apresenta uma mensagem de falha e não indica sucesso.
