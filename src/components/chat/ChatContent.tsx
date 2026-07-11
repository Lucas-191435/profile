import ChatMessage from "./ChatMessage";

const mensagens = [
  { id: 1, createdAt: "2026-07-11T09:00:00Z", sender: { id: "u1", name: "João" }, text: "Bom dia, pessoal!" },
  { id: 2, createdAt: "2026-07-11T09:00:15Z", sender: { id: "u2", name: "Maria" }, text: "Bom dia! Tudo bem?" },
  { id: 3, createdAt: "2026-07-11T09:00:40Z", sender: { id: "u3", name: "Carlos" }, text: "Alguém já revisou o PR?" },
  { id: 4, createdAt: "2026-07-11T09:01:05Z", sender: { id: "u4", name: "Ana" }, text: "Estou olhando agora." },
  { id: 5, createdAt: "2026-07-11T09:01:30Z", sender: { id: "u1", name: "João" }, text: "Corrigi alguns testes." },
  { id: 6, createdAt: "2026-07-11T09:01:55Z", sender: { id: "u5", name: "Pedro" }, text: "Bom trabalho!" },
  { id: 7, createdAt: "2026-07-11T09:02:20Z", sender: { id: "u2", name: "Maria" }, text: "O deploy ficou para hoje?" },
  { id: 8, createdAt: "2026-07-11T09:02:50Z", sender: { id: "u3", name: "Carlos" }, text: "Sim, às 16h." },
  { id: 9, createdAt: "2026-07-11T09:03:15Z", sender: { id: "u6", name: "Fernanda" }, text: "Vou atualizar a documentação." },
  { id: 10, createdAt: "2026-07-11T09:03:40Z", sender: { id: "u4", name: "Ana" }, text: "Perfeito." },

  { id: 11, createdAt: "2026-07-11T09:04:05Z", sender: { id: "u1", name: "João" }, text: "Já subi as alterações." },
  { id: 12, createdAt: "2026-07-11T09:04:30Z", sender: { id: "u2", name: "Maria" }, text: "Recebi aqui." },
  { id: 13, createdAt: "2026-07-11T09:04:55Z", sender: { id: "u5", name: "Pedro" }, text: "Vou validar no ambiente de homologação." },
  { id: 14, createdAt: "2026-07-11T09:05:20Z", sender: { id: "u3", name: "Carlos" }, text: "Beleza." },
  { id: 15, createdAt: "2026-07-11T09:05:45Z", sender: { id: "u6", name: "Fernanda" }, text: "Achei um detalhe na tela de login." },
  { id: 16, createdAt: "2026-07-11T09:06:10Z", sender: { id: "u1", name: "João" }, text: "Pode abrir uma issue?" },
  { id: 17, createdAt: "2026-07-11T09:06:35Z", sender: { id: "u6", name: "Fernanda" }, text: "Claro." },
  { id: 18, createdAt: "2026-07-11T09:07:00Z", sender: { id: "u2", name: "Maria" }, text: "Acabei de criar." },
  { id: 19, createdAt: "2026-07-11T09:07:25Z", sender: { id: "u4", name: "Ana" }, text: "Vou assumir essa tarefa." },
  { id: 20, createdAt: "2026-07-11T09:07:50Z", sender: { id: "u5", name: "Pedro" }, text: "Obrigado!" },

  { id: 21, createdAt: "2026-07-11T09:08:15Z", sender: { id: "u3", name: "Carlos" }, text: "O CI passou em todos os testes." },
  { id: 22, createdAt: "2026-07-11T09:08:40Z", sender: { id: "u1", name: "João" }, text: "Excelente." },
  { id: 23, createdAt: "2026-07-11T09:09:05Z", sender: { id: "u6", name: "Fernanda" }, text: "Também validei no celular." },
  { id: 24, createdAt: "2026-07-11T09:09:30Z", sender: { id: "u2", name: "Maria" }, text: "Funcionou no iPhone?" },
  { id: 25, createdAt: "2026-07-11T09:09:55Z", sender: { id: "u6", name: "Fernanda" }, text: "Sim, sem problemas." },
  { id: 26, createdAt: "2026-07-11T09:10:20Z", sender: { id: "u4", name: "Ana" }, text: "Android também." },
  { id: 27, createdAt: "2026-07-11T09:10:45Z", sender: { id: "u5", name: "Pedro" }, text: "Ótimo!" },
  { id: 28, createdAt: "2026-07-11T09:11:10Z", sender: { id: "u3", name: "Carlos" }, text: "Podemos liberar então." },
  { id: 29, createdAt: "2026-07-11T09:11:35Z", sender: { id: "u1", name: "João" }, text: "Vou fazer o merge." },
  { id: 30, createdAt: "2026-07-11T09:12:00Z", sender: { id: "u2", name: "Maria" }, text: "Aprovado." },

  { id: 31, createdAt: "2026-07-11T09:12:25Z", sender: { id: "u4", name: "Ana" }, text: "Deploy iniciado." },
  { id: 32, createdAt: "2026-07-11T09:12:50Z", sender: { id: "u5", name: "Pedro" }, text: "Monitorando os logs." },
  { id: 33, createdAt: "2026-07-11T09:13:15Z", sender: { id: "u3", name: "Carlos" }, text: "Tudo verde até agora." },
  { id: 34, createdAt: "2026-07-11T09:13:40Z", sender: { id: "u6", name: "Fernanda" }, text: "Sem erros no Sentry." },
  { id: 35, createdAt: "2026-07-11T09:14:05Z", sender: { id: "u1", name: "João" }, text: "Perfeito!" },
  { id: 36, createdAt: "2026-07-11T09:14:30Z", sender: { id: "u2", name: "Maria" }, text: "Parabéns, equipe! 🎉" },
  { id: 37, createdAt: "2026-07-11T09:14:55Z", sender: { id: "u5", name: "Pedro" }, text: "Excelente trabalho de todos." },
  { id: 38, createdAt: "2026-07-11T09:15:20Z", sender: { id: "u4", name: "Ana" }, text: "Vou fechar as tarefas." },
  { id: 39, createdAt: "2026-07-11T09:15:45Z", sender: { id: "u3", name: "Carlos" }, text: "Até a próxima sprint!" },
  { id: 40, createdAt: "2026-07-11T09:16:10Z", sender: { id: "u6", name: "Fernanda" }, text: "Bom descanso, pessoal!" },
];

const ChatContent = () => {
   

    console.log("mensagens", mensagens)


    return (
        <div className="border-2 w-full h-full max-h-[80%] rounded-lg col-1 overflow-y-auto scrollbar-premium">
           { mensagens.map((mensagem) => (
              <ChatMessage
                  key={mensagem.id}
                  message={mensagem.text}
                  sender={mensagem.sender.id === "user_1" ? "user" : "bot"}
                  timestamp={mensagem.createdAt}
                  userIdLoggedIn="user_1"
              />
           ))}
        </div>
    )
}
export default ChatContent;