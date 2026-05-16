import { Router } from "express";
import * as z from "zod";

// Mock sectors data - should be replaced with database query when Sector model is added to Prisma schema
const sectors = [
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

export const sectorRouter = Router();

const operationsBodySchema = z.object({
  mode: z.enum(["picking", "restock"]),
  selectedItemNames: z.array(z.string().trim().min(1)).max(60),
});

type StockStatus = "ok" | "low" | "critical";

const itemStockLevel: Record<string, { status: StockStatus; available: number; threshold: number }> = {
  banana: { status: "ok", available: 24, threshold: 8 },
  tomate: { status: "low", available: 6, threshold: 8 },
  alface: { status: "critical", available: 2, threshold: 6 },
  cebola: { status: "ok", available: 18, threshold: 10 },
  batata: { status: "ok", available: 31, threshold: 12 },
  frango: { status: "low", available: 5, threshold: 7 },
  "carne moída": { status: "ok", available: 9, threshold: 5 },
  peixe: { status: "critical", available: 1, threshold: 4 },
  linguiça: { status: "ok", available: 14, threshold: 6 },
  arroz: { status: "ok", available: 36, threshold: 10 },
  feijão: { status: "low", available: 7, threshold: 8 },
  macarrão: { status: "ok", available: 19, threshold: 10 },
  azeite: { status: "ok", available: 11, threshold: 4 },
  "molho de tomate": { status: "low", available: 6, threshold: 7 },
  leite: { status: "ok", available: 26, threshold: 10 },
  iogurte: { status: "ok", available: 17, threshold: 8 },
  queijo: { status: "low", available: 4, threshold: 6 },
  manteiga: { status: "ok", available: 13, threshold: 6 },
  detergente: { status: "ok", available: 23, threshold: 9 },
  "sabão em pó": { status: "low", available: 5, threshold: 8 },
  desinfetante: { status: "critical", available: 2, threshold: 6 },
  esponja: { status: "ok", available: 30, threshold: 10 },
  shampoo: { status: "ok", available: 12, threshold: 5 },
  sabonete: { status: "ok", available: 20, threshold: 8 },
  "pasta de dente": { status: "low", available: 6, threshold: 7 },
  "papel higiênico": { status: "ok", available: 22, threshold: 12 },
};

sectorRouter.get("/", async (_request, response) => {
  try {
    // TODO: Replace with Prisma query when Sector model is added
    // const sectors = await prisma.sector.findMany();
    response.json(sectors);
  } catch (error) {
    response.status(500).json({ message: "Failed to fetch sectors" });
  }
});

sectorRouter.post("/operations", (request, response) => {
  const { mode, selectedItemNames } = operationsBodySchema.parse(request.body);

  const selectedItems = selectedItemNames
    .map((itemName) => {
      const normalizedItem = itemName.toLowerCase();
      const sector = sectors.find((entry) =>
        entry.checklist.some((checkItem) => checkItem.toLowerCase() === normalizedItem)
      );

      if (!sector) {
        return null;
      }

      const stock = itemStockLevel[normalizedItem] ?? {
        status: "ok" as const,
        available: 12,
        threshold: 5,
      };

      return {
        itemName,
        sectorId: sector.id,
        sectorTitle: sector.title,
        aisle: sector.aisle,
        stock,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const pickingOrder = [...selectedItems].sort((a, b) => {
    if (a.aisle === b.aisle) {
      return a.itemName.localeCompare(b.itemName);
    }

    return a.aisle.localeCompare(b.aisle);
  });

  const restockQueueMap = new Map<string, { sector: string; aisle: string; itemCount: number; criticalCount: number; lowCount: number }>();

  selectedItems.forEach((item) => {
    const current = restockQueueMap.get(item.sectorId) ?? {
      sector: item.sectorTitle,
      aisle: item.aisle,
      itemCount: 0,
      criticalCount: 0,
      lowCount: 0,
    };

    current.itemCount += 1;
    if (item.stock.status === "critical") current.criticalCount += 1;
    if (item.stock.status === "low") current.lowCount += 1;

    restockQueueMap.set(item.sectorId, current);
  });

  const restockQueue = [...restockQueueMap.values()].sort((a, b) => {
    if (a.criticalCount !== b.criticalCount) return b.criticalCount - a.criticalCount;
    if (a.lowCount !== b.lowCount) return b.lowCount - a.lowCount;
    return b.itemCount - a.itemCount;
  });

  response.json({
    mode,
    totalItems: selectedItems.length,
    pickingOrder,
    restockQueue,
  });
});
