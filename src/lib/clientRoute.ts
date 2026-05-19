import { sectors } from '../data/sectors';

export type MapPoint = {
  x: number;
  y: number;
};

export type ShoppingItem = {
  id: string;
  name: string;
  sectorId: string;
  sectorTitle: string;
  aisle: string;
  category: string;
  brand: string;
  point: MapPoint;
};

export type CuratedList = {
  id: string;
  title: string;
  description: string;
  match: (item: ShoppingItem) => boolean;
};

export type RouteStep = {
  step: number;
  itemName: string;
  sectorTitle: string;
  aisle: string;
  distance: number;
  point: MapPoint;
};

export type OptimizedShoppingRoute = {
  totalDistance: number;
  steps: RouteStep[];
  polylinePoints: MapPoint[];
};

const entrancePoint: MapPoint = { x: 8, y: 92 };

const sectorPoints: Record<string, MapPoint> = {
  hortifruti: { x: 16, y: 18 },
  acougue: { x: 34, y: 20 },
  mercearia: { x: 56, y: 30 },
  limpeza: { x: 74, y: 36 },
  higiene: { x: 60, y: 60 },
  laticinios: { x: 24, y: 60 },
};

const checkoutPoint: MapPoint = { x: 8, y: 85 };

function distance(a: MapPoint, b: MapPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export const shoppingItems: ShoppingItem[] = sectors.flatMap((sector) => {
  const sectorPoint = sectorPoints[sector.id] ?? { x: 50, y: 50 };
  const sectorCategories: Record<string, string> = {
    hortifruti: 'Frescos',
    acougue: 'Proteinas',
    mercearia: 'Despensa',
    limpeza: 'Limpeza',
    higiene: 'Cuidados pessoais',
    laticinios: 'Refrigerados',
  };

  const sectorBrands: Record<string, string[]> = {
    hortifruti: ['NaturalVale', 'CampoBom', 'VerdeVida'],
    acougue: ['SaborSul', 'PrimeCorte', 'BoiNobre'],
    mercearia: ['CasaNova', 'PuroGrao', 'BomDia'],
    limpeza: ['LimpaMax', 'BrilhoLar', 'EcoFresh'],
    higiene: ['VitaCare', 'PeleLeve', 'OralPrime'],
    laticinios: ['LeiteBom', 'SerraFresca', 'LacTop'],
  };

  const category = sectorCategories[sector.id] ?? 'Geral';
  const brands = sectorBrands[sector.id] ?? ['Marca da Casa'];

  return sector.checklist.map((item) => ({
    id: `${sector.id}-${item.toLowerCase().replace(/\s+/g, '-')}`,
    name: item,
    sectorId: sector.id,
    sectorTitle: sector.title,
    aisle: sector.aisle,
    category,
    brand: brands[item.length % brands.length],
    point: sectorPoint,
  }));
});

export const curatedLists: CuratedList[] = [
  {
    id: 'semanal-familia',
    title: 'Semana em familia',
    description: 'Cesta base para 5-7 dias com itens essenciais.',
    match: (item) =>
      ['Frescos', 'Refrigerados', 'Despensa'].includes(item.category) ||
      ['arroz', 'feijao', 'leite'].some((keyword) =>
        item.name.toLowerCase().includes(keyword)
      ),
  },
  {
    id: 'reposicao-express',
    title: 'Reposicao express',
    description: 'Itens de giro rapido para compra curta.',
    match: (item) =>
      ['Limpeza', 'Cuidados pessoais', 'Refrigerados'].includes(item.category),
  },
  {
    id: 'fit-proteico',
    title: 'Fit proteico',
    description: 'Selecao focada em proteina e frescos.',
    match: (item) => ['Proteinas', 'Frescos'].includes(item.category),
  },
];

export function optimizeShoppingRoute(selectedItemIds: string[]): OptimizedShoppingRoute {
  const selectedItems = shoppingItems.filter((item) => selectedItemIds.includes(item.id));

  if (selectedItems.length === 0) {
    return {
      totalDistance: 0,
      steps: [],
      polylinePoints: [entrancePoint],
    };
  }

  const pending = [...selectedItems];
  const ordered: ShoppingItem[] = [];
  let cursor = entrancePoint;

  while (pending.length > 0) {
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    pending.forEach((item, index) => {
      const d = distance(cursor, item.point);
      if (d < closestDistance) {
        closestDistance = d;
        closestIndex = index;
      }
    });

    const next = pending.splice(closestIndex, 1)[0];
    ordered.push(next);
    cursor = next.point;
  }

  const steps: RouteStep[] = [];
  let totalDistance = 0;
  let previous = entrancePoint;

  ordered.forEach((item, index) => {
    const segmentDistance = distance(previous, item.point);
    totalDistance += segmentDistance;
    steps.push({
      step: index + 1,
      itemName: item.name,
      sectorTitle: item.sectorTitle,
      aisle: item.aisle,
      distance: Number(segmentDistance.toFixed(1)),
      point: item.point,
    });
    previous = item.point;
  });

  // Add mandatory checkout step at the end
  const checkoutDistance = distance(previous, checkoutPoint);
  totalDistance += checkoutDistance;
  steps.push({
    step: steps.length + 1,
    itemName: 'Caixa',
    sectorTitle: 'Finalização',
    aisle: 'Checkout',
    distance: Number(checkoutDistance.toFixed(1)),
    point: checkoutPoint,
  });

  return {
    totalDistance: Number(totalDistance.toFixed(1)),
    steps,
    polylinePoints: [entrancePoint, ...ordered.map((item) => item.point), checkoutPoint],
  };
}

export function getEntrancePoint() {
  return entrancePoint;
}
