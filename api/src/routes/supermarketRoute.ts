import { Router } from "express";
import * as z from "zod";

import { prisma } from "../utils/prisma.js";

export const supermarketRouter = Router();

const querySchema = z.object({
  city: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

supermarketRouter.get("/", async (request, response, next) => {
  try {
    const query = querySchema.parse(request.query);

    const supermarkets = await prisma.supermarket.findMany({
      where: {
        city: query.city,
        ...(query.search
          ? {
              OR: [
                { name: { contains: query.search, mode: "insensitive" } },
                { address: { contains: query.search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [{ rating: "desc" }, { reviews: "desc" }],
      take: query.limit,
    });

    response.json(supermarkets);
  } catch (error) {
    next(error);
  }
});
