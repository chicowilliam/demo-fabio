export type Supermarket = {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  distance: number;
  rating: number;
  reviews: number;
  hours: string;
  hasDelivery: boolean;
  services: string[];
};

export const supermarkets: Supermarket[] = [
  {
    id: 'sm-001',
    name: 'SuperMercado Central',
    city: 'São Paulo',
    state: 'SP',
    address: 'Avenida Paulista, 1000',
    phone: '(11) 3456-7890',
    distance: 2.3,
    rating: 4.7,
    reviews: 324,
    hours: '06:00 - 23:00',
    hasDelivery: true,
    services: ['Cartório', 'Farmácia', 'Caixa eletrônico']
  },
  {
    id: 'sm-002',
    name: 'Mercado do Bairro',
    city: 'São Paulo',
    state: 'SP',
    address: 'Rua Augusta, 500',
    phone: '(11) 3456-1234',
    distance: 1.8,
    rating: 4.5,
    reviews: 189,
    hours: '07:00 - 22:00',
    hasDelivery: false,
    services: ['Farmácia', 'Açougue']
  },
  {
    id: 'sm-003',
    name: 'Compre Bem Supermercados',
    city: 'Rio de Janeiro',
    state: 'RJ',
    address: 'Avenida Atlântica, 2500',
    phone: '(21) 3333-4444',
    distance: 5.2,
    rating: 4.9,
    reviews: 512,
    hours: '06:00 - 00:00',
    hasDelivery: true,
    services: ['Cartório', 'Farmácia', 'Caixa eletrônico', 'Padaria']
  },
  {
    id: 'sm-004',
    name: 'Mini Mercado Zona Norte',
    city: 'São Paulo',
    state: 'SP',
    address: 'Rua José Silva, 345',
    phone: '(11) 3456-5555',
    distance: 3.1,
    rating: 4.3,
    reviews: 95,
    hours: '07:00 - 21:00',
    hasDelivery: true,
    services: ['Açougue']
  },
  {
    id: 'sm-005',
    name: 'Extra Supermercados',
    city: 'Belo Horizonte',
    state: 'MG',
    address: 'Pça. Diogo de Vasconcelos, 100',
    phone: '(31) 3222-3333',
    distance: 8.5,
    rating: 4.6,
    reviews: 278,
    hours: '06:00 - 23:00',
    hasDelivery: true,
    services: ['Cartório', 'Farmácia', 'Caixa eletrônico', 'Deli']
  },
  {
    id: 'sm-006',
    name: 'Pão de Açúcar Center',
    city: 'São Paulo',
    state: 'SP',
    address: 'Centro Comercial, 789',
    phone: '(11) 3456-9999',
    distance: 4.7,
    rating: 4.8,
    reviews: 401,
    hours: '06:00 - 23:00',
    hasDelivery: true,
    services: ['Farmácia', 'Caixa eletrônico', 'Padaria', 'Estacionamento']
  },
  {
    id: 'sm-007',
    name: 'Carrefour Express',
    city: 'Curitiba',
    state: 'PR',
    address: 'Shopping Plaza, Loja 201',
    phone: '(41) 3222-8888',
    distance: 6.3,
    rating: 4.4,
    reviews: 156,
    hours: '07:00 - 22:00',
    hasDelivery: false,
    services: ['Farmácia', 'Caixa eletrônico']
  },
  {
    id: 'sm-008',
    name: 'Mart Supermercados',
    city: 'São Paulo',
    state: 'SP',
    address: 'Av. Imigrantes, 2000',
    phone: '(11) 3456-1111',
    distance: 7.2,
    rating: 4.2,
    reviews: 87,
    hours: '08:00 - 20:00',
    hasDelivery: false,
    services: ['Açougue']
  }
];