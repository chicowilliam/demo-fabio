export type Sector = {
  id: string;
  title: string;
  aisle: string;
  tip: string;
  checklist: string[];
  averageTime: string;
};

export const sectors: Sector[] = [
  {
    id: 'hortifruti',
    title: 'Hortifruti',
    aisle: 'Setor A1',
    tip: 'Comece por frutas e verduras da semana para montar base saudável.',
    checklist: ['Banana', 'Tomate', 'Alface', 'Cebola', 'Batata'],
    averageTime: '8 min'
  },
  {
    id: 'acougue',
    title: 'Acougue',
    aisle: 'Setor B2',
    tip: 'Defina porções da semana para evitar desperdício.',
    checklist: ['Frango', 'Carne moída', 'Peixe', 'Linguiça'],
    averageTime: '6 min'
  },
  {
    id: 'mercearia',
    title: 'Mercearia',
    aisle: 'Setor C3',
    tip: 'Pegue itens secos em lote para economizar em promoções.',
    checklist: ['Arroz', 'Feijão', 'Macarrão', 'Azeite', 'Molho de tomate'],
    averageTime: '10 min'
  },
  {
    id: 'laticinios',
    title: 'Laticinios e Frios',
    aisle: 'Setor D1',
    tip: 'Deixe resfriados para o fim da rota e preserve temperatura.',
    checklist: ['Leite', 'Iogurte', 'Queijo', 'Manteiga'],
    averageTime: '5 min'
  },
  {
    id: 'limpeza',
    title: 'Limpeza',
    aisle: 'Setor E4',
    tip: 'Compre refis e embalagens economicas para reduzir custo mensal.',
    checklist: ['Detergente', 'Sabão em pó', 'Desinfetante', 'Esponja'],
    averageTime: '7 min'
  },
  {
    id: 'higiene',
    title: 'Higiene Pessoal',
    aisle: 'Setor F2',
    tip: 'Conferir estoque antes de ir evita compras duplicadas.',
    checklist: ['Shampoo', 'Sabonete', 'Pasta de dente', 'Papel higiênico'],
    averageTime: '6 min'
  }
];