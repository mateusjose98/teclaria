import { TipoLicao, type Licao } from '../../types';

export const advancedLessons: Licao[] = [
  {
    id: 'advanced-1',
    nivel: 6,
    etapa: 1,
    titulo: 'Um parágrafo, muitas ideias',
    descricao: 'Digite as cinco linhas. Em cada símbolo ↵, pressione Enter para continuar.',
    tipo: TipoLicao.PARAGRAFOS,
    exercicios: [
      [
        'Naquela manhã, Clara decidiu conhecer a biblioteca do bairro.',
        'Levou um caderno azul, uma caneta e a vontade de aprender algo novo.',
        'Entre as estantes, encontrou um livro sobre viagens e abriu a primeira página.',
        'Cada história apresentava lugares, costumes e perguntas que nunca havia imaginado.',
        'Ao voltar para casa, escreveu suas descobertas para compartilhar com os amigos.',
      ].join('\n'),
    ],
    recompensaXp: 220,
  },
  {
    id: 'advanced-2',
    nivel: 6,
    etapa: 2,
    titulo: 'Detalhes que fazem diferença',
    descricao: 'Seis linhas com números, acentos e pontuação. Priorize a precisão.',
    tipo: TipoLicao.PARAGRAFOS,
    exercicios: [
      [
        'Às 8:30, a equipe se reuniu para organizar a feira de ciências da escola.',
        'O primeiro grupo preparou 12 cartazes; o segundo, uma apresentação sobre água.',
        'Durante os testes, alguém perguntou: "Como podemos reduzir o desperdício?"',
        'Surgiram várias sugestões, desde consertar torneiras até reaproveitar a chuva.',
        'Com um orçamento de R$ 250,00, todos precisaram escolher materiais com cuidado.',
        'No fim do encontro, o plano estava pronto e cada participante sabia o que fazer.',
      ].join('\n'),
    ],
    recompensaXp: 250,
  },
  {
    id: 'advanced-3',
    nivel: 6,
    etapa: 3,
    titulo: 'Uma história completa',
    descricao: 'Complete sete linhas mantendo seu ritmo. Você pode pausar quando precisar.',
    tipo: TipoLicao.PARAGRAFOS,
    exercicios: [
      [
        'Depois de semanas de preparação, chegou o dia de inaugurar a horta comunitária.',
        'Os moradores trouxeram sementes, ferramentas e pequenas placas com os nomes das plantas.',
        'Enquanto os adultos organizavam os canteiros, as crianças regavam a terra com atenção.',
        'Uma vizinha explicou: "O crescimento exige cuidado, paciência e um pouco de sol."',
        'A frase lembrou a Pedro que aprender a digitar também era um exercício de constância.',
        'Ele ainda cometia erros, mas já conseguia escrever mensagens inteiras com mais confiança.',
        'Naquela tarde, registrou a experiência em seu diário e terminou com um sorriso: valeu a pena!',
      ].join('\n'),
    ],
    recompensaXp: 300,
  },
];
