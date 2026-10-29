# Configuração do envio do briefing

O formulário envia os dados para `/api/briefing`, que usa o Resend no servidor. A mensagem é enviada para o endereço definido em `src/data/profile.ts`; o e-mail informado no formulário fica configurado como endereço de resposta.

Para ativar o envio:

1. Hospede o projeto na Vercel, que executa a função em `api/briefing.ts`.
2. Crie uma chave de API no Resend e verifique um domínio de envio na conta.
3. Configure `RESEND_API_KEY` e `BRIEFING_FROM_EMAIL` nas variáveis de ambiente do projeto na Vercel. Use como `BRIEFING_FROM_EMAIL` um remetente permitido pelo domínio verificado, por exemplo `Portfólio <contato@seudominio.com>`.
4. Faça um novo deploy após salvar as variáveis.

Para desenvolvimento local com a Vercel CLI, copie `.env.example` para `.env.local`, preencha as variáveis e execute `vercel dev`. Não coloque a chave do Resend em arquivos enviados ao repositório nem em variáveis `VITE_*`.

Sem essas variáveis e sem uma hospedagem que execute a função, o formulário não consegue enviar e-mail; ele exibirá uma mensagem de falha em vez de abrir um aplicativo de e-mail.
