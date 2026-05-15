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
  point: MapPoint;
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

function distance(a: MapPoint, b: MapPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export const shoppingItems: ShoppingItem[] = sectors.flatMap((sector) => {
  const sectorPoint = sectorPoints[sector.id] ?? { x: 50, y: 50 };
  return sector.checklist.map((item) => ({
    id: `${sector.id}-${item.toLowerCase().replace(/\s+/g, '-')}`,
    name: item,
    sectorId: sector.id,
    sectorTitle: sector.title,
    aisle: sector.aisle,
    point: sectorPoint,
  }));
});

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

  return {
    totalDistance: Number(totalDistance.toFixed(1)),
    steps,
    polylinePoints: [entrancePoint, ...ordered.map((item) => item.point)],
  };
}

export function getEntrancePoint() {
  return entrancePoint;
}
