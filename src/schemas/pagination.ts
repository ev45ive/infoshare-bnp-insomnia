import { z } from "zod/v4";

/**
 * Generyczny schemat query params dla kolekcji.
 * Generuje parameters w OAS dla _page, _limit, _sort, _order.
 */
export const PaginationQuerySchema = z.object({
  _page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1)
    .meta({ description: "Numer strony (od 1)", example: 1 }),
  _limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10)
    .meta({ description: "Liczba wyników na stronę (max 100)", example: 10 }),
  _sort: z.string().optional().meta({ description: "Pole sortowania", example: "lastName" }),
  _order: z
    .enum(["asc", "desc"])
    .optional()
    .meta({ description: "Kierunek sortowania", example: "asc" }),
});

/**
 * Fabryka koperty paginacji — items odwołuje się przez $ref
 * do schematu przekazanego jako argument.
 *
 * @example
 *   response: { 200: paginationEnvelope(CustomerSchema) }
 */
export const paginationEnvelope = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema).meta({ description: "Lista zasobów" }),
    total: z.number().int().nonnegative().meta({ description: "Łączna liczba rekordów" }),
    page: z.number().int().positive().meta({ description: "Bieżąca strona" }),
    limit: z.number().int().positive().meta({ description: "Rozmiar strony" }),
    pages: z.number().int().nonnegative().meta({ description: "Łączna liczba stron" }),
  });
