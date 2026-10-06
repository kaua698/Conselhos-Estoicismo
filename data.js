/* =========================================================
   Conselho do Dia — conteúdo
   ---------------------------------------------------------
   type:          "quote"  → citação atribuída a um autor
                  "modern" → interpretação moderna (sem autor)
   sourceStatus:  "verified"   → passagem localizada na obra
                  "paraphrase" → ideia do autor, não frase literal
                  "uncertain"  → atribuição tradicional, sem passagem localizada
   reference:     só preencher quando confirmada. Nunca inventar.
   Traduções e paráfrases em português são próprias do projeto.
   ========================================================= */

// Dia 0 da sequência diária. A partir desta data, cada dia mostra a próxima reflexão.
const LANCAMENTO = "2026-10-06";

const TEMAS = [
  { id: "ansiedade", nome: "Ansiedade e medo", desc: "Quando a mente corre na frente dos fatos." },
  { id: "raiva", nome: "Raiva", desc: "O espaço entre o que aconteceu e a sua resposta." },
  { id: "disciplina", nome: "Disciplina", desc: "Fazer o pequeno, todos os dias." },
  { id: "relacionamentos", nome: "Relacionamentos", desc: "Conviver sem entregar sua paz." },
  { id: "opiniao", nome: "Opinião dos outros", desc: "Comparação, crítica e reconhecimento." },
  { id: "decisoes", nome: "Decisões", desc: "Escolher pelo que é certo, não pelo que é fácil." },
  { id: "dinheiro", nome: "Dinheiro e desejo", desc: "Ter o suficiente e saber quando é suficiente." },
  { id: "fracasso", nome: "Fracasso", desc: "O obstáculo como parte do caminho." },
  { id: "tempo", nome: "Tempo e impermanência", desc: "A vida é curta para ser adiada." },
  { id: "controle", nome: "Controle", desc: "O que depende de você, e o que não depende." }
];

const SENTIMENTOS = [
  { id: "preocupado", label: "Estou preocupado", tema: "ansiedade" },
  { id: "raiva", label: "Estou com raiva", tema: "raiva" },
  { id: "procrastinando", label: "Estou procrastinando", tema: "disciplina", primeiro: "adiando" },
  { id: "triste", label: "Estou triste", tema: "tempo", primeiro: "nao-resolver-tudo", ajuda: true },
  { id: "decisao", label: "Tenho uma decisão difícil", tema: "decisoes" },
  { id: "dinheiro", label: "Estou preocupado com dinheiro", tema: "dinheiro" },
  { id: "alguem", label: "Estou com problemas com alguém", tema: "relacionamentos" },
  { id: "comparando", label: "Estou me comparando", tema: "opiniao", primeiro: "comparacao" },
  { id: "fracasso", label: "Algo deu errado", tema: "fracasso" },
  { id: "disciplina", label: "Estou sem disciplina", tema: "disciplina", primeiro: "seja-uma" },
  { id: "perspectiva", label: "Só quero perspectiva", tema: "controle", primeiro: "julgamentos" }
];

const REFLEXOES = [
  {
    id: "imaginacao", type: "quote", sourceStatus: "verified",
    title: "Sofremos mais na imaginação",
    text: "Há mais coisas que nos assustam do que coisas que nos esmagam. Sofremos mais na imaginação do que na realidade.",
    author: "Sêneca", work: "Cartas a Lucílio", reference: "13.4", theme: "ansiedade",
    explanation: "Sêneca escreve a um amigo que muitas preocupações são antecipações: sofremos por algo que talvez nem aconteça. O convite é separar o que está acontecendo do que você está imaginando.",
    question: "Qual preocupação de hoje existe, por enquanto, só na sua cabeça?",
    action: "Escreva essa preocupação em uma frase. Ao lado, anote só o que de fato já aconteceu. Compare as duas.",
    minutes: 2
  },
  {
    id: "seja-uma", type: "quote", sourceStatus: "verified",
    title: "Chega de discutir. Seja.",
    text: "Chega de discutir como deve ser uma pessoa boa. Seja uma.",
    author: "Marco Aurélio", work: "Meditações", reference: "10.16", theme: "disciplina",
    explanation: "É fácil passar tempo lendo, planejando e debatendo sobre virtude. Marco Aurélio corta o caminho: a prova está no que você faz.",
    question: "Em que área você está planejando demais e agindo de menos?",
    action: "Escolha uma atitude boa e pequena e faça ainda hoje, sem anunciar.",
    minutes: 2
  },
  {
    id: "poder-que-voce-entrega", type: "modern", sourceStatus: null,
    title: "O poder que você entrega",
    text: "Você não controla a opinião que outra pessoa tem sobre você. Controla quanto poder entrega a ela.",
    author: null, work: null, reference: null, theme: "opiniao",
    explanation: "Inspirado na dicotomia do controle de Epicteto: a opinião alheia está fora do seu alcance; a sua reação a ela, não.",
    question: "Por que a opinião dessa pessoa está pesando tanto hoje?",
    action: "Antes de responder a uma crítica, espere dez segundos.",
    minutes: 2
  },
  {
    id: "certo-verdade", type: "quote", sourceStatus: "verified",
    title: "Se não é certo, não faça",
    text: "Se não é certo, não faças. Se não é verdade, não digas.",
    author: "Marco Aurélio", work: "Meditações", reference: "12.17", theme: "decisoes",
    explanation: "Marco Aurélio reduz a decisão a duas perguntas: isso é certo? Isso é verdade? Nem sempre é fácil, mas quase sempre é simples.",
    question: "Que decisão você está complicando mais do que ela é?",
    action: "Antes da próxima decisão de hoje, faça as duas perguntas para si mesmo.",
    minutes: 1
  },
  {
    id: "vinganca", type: "quote", sourceStatus: "verified",
    title: "Não se tornar igual a quem te fez mal",
    text: "A melhor forma de se vingar é não se tornar igual a quem te fez mal.",
    author: "Marco Aurélio", work: "Meditações", reference: "6.6", theme: "raiva",
    explanation: "A raiva pede resposta na mesma moeda. Marco Aurélio sugere o contrário: a vitória é não deixar que o outro defina quem você é.",
    question: "Quem tem conseguido mudar o seu comportamento ultimamente?",
    action: "Antes de responder a uma provocação hoje, espere dez segundos e respire duas vezes.",
    minutes: 1
  },
  {
    id: "quem-deseja-mais", type: "quote", sourceStatus: "paraphrase",
    title: "Quem sempre deseja mais",
    text: "Pobre não é quem tem pouco, mas quem sempre deseja mais.",
    author: "Sêneca", work: "Cartas a Lucílio", reference: "2", theme: "dinheiro",
    explanation: "Para Sêneca, a sensação de falta vem menos do que temos e mais do quanto queremos. Desejo sem limite nunca se satisfaz.",
    question: "O que você já tem e esqueceu de valorizar?",
    action: "Liste três coisas que você já tem e que vai usar hoje.",
    minutes: 2
  },
  {
    id: "obstaculo", type: "quote", sourceStatus: "verified",
    title: "O obstáculo vira caminho",
    text: "O que impede a ação faz a ação avançar. O que está no caminho se torna o caminho.",
    author: "Marco Aurélio", work: "Meditações", reference: "5.20", theme: "fracasso",
    explanation: "Para Marco Aurélio, um obstáculo não interrompe a prática: ele é a prática. Paciência, criatividade e coragem só aparecem quando algo atrapalha.",
    question: "O que o problema de hoje está te obrigando a aprender?",
    action: "Escreva um obstáculo atual e uma qualidade que ele te dá a chance de treinar.",
    minutes: 3
  },
  {
    id: "enquanto-adiamos", type: "quote", sourceStatus: "paraphrase",
    title: "Enquanto adiamos",
    text: "Enquanto adiamos, a vida passa.",
    author: "Sêneca", work: "Cartas a Lucílio", reference: "1", theme: "tempo",
    explanation: "Sêneca abre suas cartas falando do tempo: é o único bem realmente nosso, e o deixamos escapar aos poucos.",
    question: "Para quando você está deixando algo que importa?",
    action: "Marque um horário real, nesta semana, para essa coisa.",
    minutes: 2
  },
  {
    id: "julgamentos", type: "quote", sourceStatus: "verified",
    title: "Não são as coisas",
    text: "O que perturba as pessoas não são as coisas, mas os julgamentos que fazem sobre elas.",
    author: "Epicteto", work: "Manual", reference: "5", theme: "controle",
    explanation: "Epicteto separa o fato da interpretação. O atraso é um fato; “isso é um desastre” é um julgamento — e julgamentos podem ser revistos.",
    question: "Qual julgamento seu sobre hoje é mais pesado que o próprio fato?",
    action: "Reescreva um problema de hoje sem nenhum adjetivo.",
    minutes: 2
  },
  {
    id: "bondade", type: "quote", sourceStatus: "verified",
    title: "Onde houver um ser humano",
    text: "Onde houver um ser humano, há lugar para a bondade.",
    author: "Sêneca", work: "Sobre a vida feliz", reference: null, theme: "relacionamentos",
    explanation: "Sêneca lembra que a bondade não depende de a pessoa merecer ou de ser próxima. Cada encontro é uma oportunidade.",
    question: "Com quem você tem sido menos gentil do que gostaria?",
    action: "Pense em uma coisa que essa pessoa talvez esteja enfrentando antes de falar com ela.",
    minutes: 2
  },
  {
    id: "nem-toda-preocupacao", type: "modern", sourceStatus: null,
    title: "Nem toda preocupação",
    text: "Nem toda preocupação merece sua atenção.",
    author: null, work: null, reference: null, theme: "ansiedade",
    explanation: "Algumas preocupações pedem ação; outras só pedem que você as reconheça e siga. Separar umas das outras já alivia.",
    question: "Das suas preocupações de hoje, qual delas pede uma ação concreta?",
    action: "Escreva suas preocupações e marque ao lado de cada uma: depende de mim ou não?",
    minutes: 3
  },
  {
    id: "adiando", type: "quote", sourceStatus: "verified",
    title: "O prazo que você não usou",
    text: "Lembra-te de há quanto tempo vens adiando isto, e de quantas vezes recebeste um prazo e não o usaste.",
    author: "Marco Aurélio", work: "Meditações", reference: "2.4", theme: "disciplina",
    explanation: "Marco Aurélio escrevia para si mesmo. Aqui ele se cobra sem drama: o tempo é limitado e já foi adiado vezes demais.",
    question: "O que você vem adiando há mais tempo do que gostaria de admitir?",
    action: "Faça só os primeiros cinco minutos dessa tarefa. Agora.",
    minutes: 5
  },
  {
    id: "opiniao-sobre-si", type: "quote", sourceStatus: "verified",
    title: "A opinião que vale menos",
    text: "Muitas vezes me perguntei como cada um ama a si mesmo mais do que a todos os outros e, ainda assim, dá menos valor à própria opinião sobre si do que à opinião dos outros.",
    author: "Marco Aurélio", work: "Meditações", reference: "12.4", theme: "opiniao",
    explanation: "Até um imperador de Roma se pegava preocupado com o que pensavam dele. A observação vale para qualquer pessoa.",
    question: "De quem é a opinião que mais pesa sobre como você se vê?",
    action: "Escreva uma qualidade sua que você reconhece, mesmo que ninguém tenha comentado.",
    minutes: 2
  },
  {
    id: "nenhum-vento", type: "quote", sourceStatus: "verified",
    title: "Nenhum vento é favorável",
    text: "Quem não sabe a que porto se dirige não tem vento favorável.",
    author: "Sêneca", work: "Cartas a Lucílio", reference: "71.3", theme: "decisoes",
    explanation: "Decidir fica difícil quando não sabemos o que queremos. Antes da escolha, vem a direção.",
    question: "O que você realmente quer com a decisão que está tomando?",
    action: "Escreva em uma frase aonde você quer chegar antes de escolher.",
    minutes: 2
  },
  {
    id: "antes-de-reagir", type: "modern", sourceStatus: null,
    title: "Antes de reagir",
    text: "Antes de reagir, descubra o que está sob seu controle.",
    author: null, work: null, reference: null, theme: "raiva",
    explanation: "A raiva costuma mirar no que não depende de nós. Perguntar o que está ao seu alcance devolve a direção.",
    question: "O que, na situação que te irritou, depende de você?",
    action: "Na próxima irritação, pergunte em silêncio: isso depende de mim?",
    minutes: 1
  },
  {
    id: "natureza-opiniao", type: "quote", sourceStatus: "verified",
    title: "Natureza e opinião",
    text: "Se viveres de acordo com a natureza, nunca serás pobre; se viveres de acordo com a opinião, nunca serás rico.",
    author: "Sêneca, citando Epicuro", work: "Cartas a Lucílio", reference: "16.7", theme: "dinheiro",
    explanation: "Necessidades reais têm limite. Desejos alimentados pela comparação, não.",
    question: "Que gasto recente veio mais da opinião dos outros do que da sua necessidade?",
    action: "Revise um gasto recorrente e pergunte se ele ainda serve a você.",
    minutes: 5
  },
  {
    id: "dificuldades", type: "quote", sourceStatus: "uncertain",
    title: "Como o trabalho fortalece o corpo",
    text: "As dificuldades fortalecem a mente, como o trabalho fortalece o corpo.",
    author: "Sêneca", work: null, reference: null, theme: "fracasso",
    explanation: "A ideia é bem estoica: o desconforto bem enfrentado é treino, não castigo.",
    question: "Que dificuldade recente te deixou mais capaz?",
    action: "Faça hoje uma coisa levemente desconfortável de propósito.",
    minutes: 3
  },
  {
    id: "nao-resolver-tudo", type: "modern", sourceStatus: null,
    title: "Atravessar o dia",
    text: "Você não precisa resolver tudo hoje. Às vezes, a tarefa do dia é só atravessar o dia.",
    author: null, work: null, reference: null, theme: "tempo",
    explanation: "A pressa de resolver tudo de uma vez costuma paralisar. Um passo de cada vez também é um caminho.",
    question: "Qual é a menor coisa que tornaria o dia de hoje um pouco melhor?",
    action: "Escolha uma coisa pequena e gentil para fazer por você nas próximas horas.",
    minutes: 2, help: true
  },
  {
    id: "cor-dos-pensamentos", type: "quote", sourceStatus: "verified",
    title: "A cor dos pensamentos",
    text: "A alma se tinge da cor dos seus pensamentos.",
    author: "Marco Aurélio", work: "Meditações", reference: "5.16", theme: "controle",
    explanation: "Aquilo em que você pensa com frequência vira o tom da sua mente. Por isso vale escolher com cuidado onde a atenção mora.",
    question: "Que pensamento tem ocupado mais espaço em você esta semana?",
    action: "Observe três vezes hoje em que você está pensando. Só observe, sem julgar.",
    minutes: 2
  },
  {
    id: "expectativa", type: "modern", sourceStatus: null,
    title: "O que você espera do outro",
    text: "Você não controla o que o outro faz. Controla o que espera e como responde.",
    author: null, work: null, reference: null, theme: "relacionamentos",
    explanation: "Marco Aurélio começava o dia lembrando que encontraria pessoas difíceis — não para se irritar, mas para não ser pego de surpresa.",
    question: "Que expectativa sua sobre alguém tem gerado frustração?",
    action: "Antes de uma conversa difícil, decida como você quer agir, não como o outro deve agir.",
    minutes: 2
  },
  {
    id: "preparacao", type: "modern", sourceStatus: null,
    title: "Resultado e preparação",
    text: "Você não controla o resultado. Controla sua preparação.",
    author: null, work: null, reference: null, theme: "ansiedade",
    explanation: "Os estoicos usavam a imagem do arqueiro: ele escolhe o arco, mira e solta. Se o vento muda, o acerto já não depende dele.",
    question: "O que está ao seu alcance preparar para aquilo que te preocupa?",
    action: "Faça hoje uma única coisa de preparação e solte o resto.",
    minutes: 3
  },
  {
    id: "senhor-de-si", type: "quote", sourceStatus: "uncertain",
    title: "Senhor de si",
    text: "Ninguém é livre se não for senhor de si mesmo.",
    author: "Epicteto", work: null, reference: null, theme: "disciplina",
    explanation: "Para os estoicos, liberdade não é fazer tudo o que se quer, mas não ser arrastado por cada impulso.",
    question: "Que impulso tem decidido por você?",
    action: "Escolha um impulso de hoje e espere cinco minutos antes de obedecer.",
    minutes: 5
  },
  {
    id: "comparacao", type: "modern", sourceStatus: null,
    title: "A régua dos outros",
    text: "Comparar-se é medir a própria vida com a régua de outra pessoa.",
    author: null, work: null, reference: null, theme: "opiniao",
    explanation: "Os estoicos mediam a vida pelo próprio caráter, não pelo que os outros têm ou mostram.",
    question: "Com quem você tem se comparado, e o que isso diz sobre o que você quer?",
    action: "Antes de abrir uma rede social, pergunte: o que eu vim procurar aqui?",
    minutes: 1
  },
  {
    id: "quem-voce-quer-ser", type: "modern", sourceStatus: null,
    title: "Quem você quer ser",
    text: "Diante de duas opções, pergunte qual delas a pessoa que você quer ser escolheria.",
    author: null, work: null, reference: null, theme: "decisoes",
    explanation: "Os estoicos avaliavam escolhas pelo caráter que elas constroem, não só pelo resultado.",
    question: "Qual opção você escolheria se ninguém estivesse olhando?",
    action: "Escreva as opções e, ao lado de cada uma, o tipo de pessoa que ela faz de você.",
    minutes: 3
  },
  {
    id: "mais-que-o-motivo", type: "modern", sourceStatus: null,
    title: "Mais que o motivo",
    text: "A raiva quase sempre dura mais do que o motivo dela.",
    author: null, work: null, reference: null, theme: "raiva",
    explanation: "Sêneca dedicou um livro inteiro ao tema, Sobre a ira, e recomendava conter a raiva logo no começo, antes que ela ganhe força.",
    question: "Quanto tempo a última irritação ficou com você depois que o motivo passou?",
    action: "Quando a raiva vier, adie a resposta para depois de uma caminhada curta.",
    minutes: 5
  },
  {
    id: "suficiente", type: "modern", sourceStatus: null,
    title: "Quanto é suficiente",
    text: "Saber quanto é suficiente é uma forma de riqueza.",
    author: null, work: null, reference: null, theme: "dinheiro",
    explanation: "Inspirado em Sêneca: sem um limite para o desejo, nenhum valor parece bastar.",
    question: "Para você, hoje, o que seria “suficiente”?",
    action: "Antes de uma compra não planejada, espere 24 horas.",
    minutes: 1
  },
  {
    id: "erro-informacao", type: "modern", sourceStatus: null,
    title: "Erro é informação",
    text: "Errar depois de se preparar não é falha de caráter. É informação.",
    author: null, work: null, reference: null, theme: "fracasso",
    explanation: "Para os estoicos, o que importa é a qualidade da escolha, não o resultado que depende de fatores externos.",
    question: "O que o último erro te ensinou que um acerto não ensinaria?",
    action: "Escreva, em uma frase, uma lição de um erro recente.",
    minutes: 2
  },
  {
    id: "viver-tarde", type: "quote", sourceStatus: "uncertain",
    title: "Começar a viver tarde",
    text: "Nada é tão lamentável quanto quem começa a viver quando a vida já está acabando.",
    author: "Sêneca", work: null, reference: null, theme: "tempo",
    explanation: "Adiar a vida para “quando tudo se resolver” é uma forma de não vivê-la.",
    question: "O que você está esperando para começar?",
    action: "Faça hoje uma versão pequena de algo que você deixou para “um dia”.",
    minutes: 3
  },
  {
    id: "conduzido-arrastado", type: "quote", sourceStatus: "verified",
    title: "Conduzido ou arrastado",
    text: "O destino conduz quem aceita e arrasta quem resiste.",
    author: "Sêneca, citando Cleantes", work: "Cartas a Lucílio", reference: "107.11", theme: "controle",
    explanation: "Algumas coisas vão acontecer de qualquer jeito. A escolha está em como você caminha com elas: resistindo a tudo ou agindo bem dentro do que é possível.",
    question: "Contra o que você está resistindo que já não pode ser mudado?",
    action: "Escreva uma coisa que você vai aceitar hoje e uma que você vai agir para mudar.",
    minutes: 3
  },
  {
    id: "duas-orelhas", type: "quote", sourceStatus: "uncertain",
    title: "Duas orelhas, uma boca",
    text: "Temos duas orelhas e uma boca para ouvirmos mais e falarmos menos.",
    author: "Zenão de Cítio", work: null, reference: null, theme: "relacionamentos",
    explanation: "Zenão fundou o estoicismo. A frase chegou até nós por relatos posteriores, mas a lição é simples: ouvir bem vem antes de responder bem.",
    question: "Em que conversa recente você falou mais do que ouviu?",
    action: "Na próxima conversa, faça uma pergunta a mais antes de dar sua opinião.",
    minutes: 2
  },
  {
    id: "sobre-sua-mente", type: "quote", sourceStatus: "uncertain",
    title: "Sobre sua mente",
    text: "Você tem poder sobre sua mente, não sobre os acontecimentos.",
    author: "Marco Aurélio", work: null, reference: null, theme: "controle",
    explanation: "A frase resume a ideia central do estoicismo: os acontecimentos não dependem de você; a forma como você os recebe, sim.",
    question: "Que acontecimento de hoje você está tentando controlar?",
    action: "Divida uma folha em duas colunas — depende de mim / não depende — e distribua o que te preocupa.",
    minutes: 3
  }
];

const SITUACOES = [
  {
    texto: "Seu chefe criticou seu trabalho na frente da equipe.",
    opcoes: [
      { texto: "O que meu chefe pensa do meu trabalho", controle: false },
      { texto: "Como eu respondo agora", controle: true },
      { texto: "O que eu faço com o que foi dito", controle: true },
      { texto: "Se a equipe vai comentar depois", controle: false }
    ],
    perspectiva: "A opinião do seu chefe não é sua. A sua resposta é.",
    raciocinio: "Para Epicteto, algumas coisas dependem de nós — julgamentos, escolhas, ações — e outras não. Gastar energia com o que não depende de você só aumenta o incômodo. O que sobra é responder bem e aproveitar o que a crítica tiver de útil.",
    acao: "Anote uma parte da crítica que é útil, mesmo que tenha sido dita do jeito errado."
  },
  {
    texto: "Você ficou preso no trânsito e vai chegar atrasado.",
    opcoes: [
      { texto: "O trânsito", controle: false },
      { texto: "Avisar quem está esperando", controle: true },
      { texto: "Como eu uso esse tempo parado", controle: true },
      { texto: "O humor de quem me espera", controle: false }
    ],
    perspectiva: "O atraso já aconteceu. O que você faz com ele, ainda não.",
    raciocinio: "Irritar-se com o trânsito não move nenhum carro. Avisar e usar bem o tempo parado são as únicas partes que estão nas suas mãos.",
    acao: "Mande a mensagem avisando e use o tempo para algo pequeno: ouvir algo, respirar, planejar o resto do dia."
  },
  {
    texto: "Você estudou bastante e mesmo assim foi mal numa prova.",
    opcoes: [
      { texto: "A nota que já saiu", controle: false },
      { texto: "Como eu estudo para a próxima", controle: true },
      { texto: "O que eu concluo sobre mim por causa disso", controle: true },
      { texto: "O nível de dificuldade da prova", controle: false }
    ],
    perspectiva: "Você controlou a preparação. O resultado tinha outros fatores.",
    raciocinio: "Os estoicos usavam a imagem do arqueiro: ele cuida da mira e do disparo, mas não do vento. Julgar-se só pelo resultado é cobrar de si o que não estava ao seu alcance.",
    acao: "Liste duas coisas que você mudaria na forma de estudar e uma que você fez bem."
  },
  {
    texto: "Um amigo não responde sua mensagem há dois dias.",
    opcoes: [
      { texto: "O motivo de ele não ter respondido", controle: false },
      { texto: "A história que eu estou contando a mim mesmo", controle: true },
      { texto: "Se eu mando outra mensagem ou espero", controle: true },
      { texto: "O que ele sente por mim", controle: false }
    ],
    perspectiva: "O silêncio é um fato. O significado que você deu a ele é um julgamento.",
    raciocinio: "Epicteto lembra que não são as coisas que nos perturbam, mas o que pensamos delas. Você não sabe o motivo — e pode escolher não preencher a lacuna com o pior.",
    acao: "Escreva três motivos possíveis e neutros para o silêncio. Depois decida, com calma, se vale mandar outra mensagem."
  },
  {
    texto: "Alguém fez um comentário maldoso sobre você nas redes.",
    opcoes: [
      { texto: "O que a pessoa escreveu", controle: false },
      { texto: "Se eu respondo ou não", controle: true },
      { texto: "Quanto tempo eu passo relendo", controle: true },
      { texto: "O que os outros vão achar", controle: false }
    ],
    perspectiva: "Você não controla o comentário. Controla quanto poder entrega a ele.",
    raciocinio: "Marco Aurélio escreveu que a melhor vingança é não se tornar igual a quem fez o mal. Responder no mesmo tom é deixar o outro escolher o seu comportamento.",
    acao: "Feche o aplicativo por uma hora antes de decidir se vale responder."
  }
];
