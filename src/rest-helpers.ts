import type { FastifyReply, FastifyRequest } from "fastify";
import lodash from "lodash";
import { v4 as uuidv4 } from "uuid";

const { merge } = lodash;

export interface RestOptions<T> {
  /** Path param that maps to the Map key (default: 'id'). */
  idParam?: string;
  /** Translate path-param name → entity field when they differ. */
  paramFieldMap?: Record<string, keyof T>;
}

export interface GetAllResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const RESERVED = new Set(["_page", "_limit", "_sort", "_order"]);

/** path params except idParam → filters on the collection. */
function nestedFilters<T>(
  params: Record<string, unknown>,
  opts: RestOptions<T>,
): Record<string, unknown> {
  const { idParam = "id", paramFieldMap = {} } = opts;
  const filters: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (key === idParam) continue;
    const field = (paramFieldMap[key] ?? key) as string;
    filters[field] = value;
  }
  return filters;
}

export async function handleGetAll<T extends { id: string }>(
  req: FastifyRequest,
  _reply: FastifyReply,
  collection: Map<string, T>,
  options: RestOptions<T> = {},
): Promise<GetAllResult<T>> {
  const query = (req.query ?? {}) as Record<string, string>;
  const params = (req.params ?? {}) as Record<string, unknown>;

  const page = Math.max(1, Number(query._page) || 1);
  const limit = Math.max(1, Number(query._limit) || 10);
  const sort = query._sort;
  const order = query._order === "desc" ? "desc" : "asc";

  const filters: Record<string, unknown> = { ...nestedFilters(params, options) };
  for (const [key, value] of Object.entries(query)) {
    if (!RESERVED.has(key)) filters[key] = value;
  }

  let rows = [...collection.values()];
  rows = rows.filter((row) =>
    Object.entries(filters).every(
      ([k, v]) => String((row as Record<string, unknown>)[k]) === String(v),
    ),
  );

  if (sort) {
    rows.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sort];
      const bv = (b as Record<string, unknown>)[sort];
      const cmp = av! < bv! ? -1 : av! > bv! ? 1 : 0;
      return order === "desc" ? -cmp : cmp;
    });
  }

  const total = rows.length;
  const start = (page - 1) * limit;
  return {
    data: rows.slice(start, start + limit),
    total,
    page,
    limit,
    pages: Math.ceil(total / limit) || 1,
  };
}

export async function handleGetOne<T extends { id: string }>(
  req: FastifyRequest,
  reply: FastifyReply,
  collection: Map<string, T>,
  options: RestOptions<T> = {},
): Promise<T> {
  const { idParam = "id" } = options;
  const id = (req.params as Record<string, string>)[idParam];
  const item = collection.get(id);
  if (!item) throw reply.notFound(`Resource '${id}' not found`);
  return item;
}

export async function handleCreate<T extends { id: string }>(
  req: FastifyRequest,
  _reply: FastifyReply,
  collection: Map<string, T>,
  _options: RestOptions<T> = {},
): Promise<T> {
  const id = uuidv4();
  const body = (req.body ?? {}) as Partial<T>;
  const item = { createdAt: new Date().toISOString(), ...body, id } as T;
  collection.set(id, item);
  return item;
}

export async function handleReplace<T extends { id: string }>(
  req: FastifyRequest,
  reply: FastifyReply,
  collection: Map<string, T>,
  options: RestOptions<T> = {},
): Promise<T> {
  const { idParam = "id" } = options;
  const id = (req.params as Record<string, string>)[idParam];
  if (!collection.has(id)) throw reply.notFound(`Resource '${id}' not found`);
  const item = { ...(req.body as Partial<T>), id } as T;
  collection.set(id, item);
  return item;
}

export async function handleUpdate<T extends { id: string }>(
  req: FastifyRequest,
  reply: FastifyReply,
  collection: Map<string, T>,
  options: RestOptions<T> = {},
): Promise<T> {
  const { idParam = "id" } = options;
  const id = (req.params as Record<string, string>)[idParam];
  const existing = collection.get(id);
  if (!existing) throw reply.notFound(`Resource '${id}' not found`);
  const item = merge({}, existing, req.body, { id });
  collection.set(id, item);
  return item;
}

export async function handleDelete<T extends { id: string }>(
  req: FastifyRequest,
  reply: FastifyReply,
  collection: Map<string, T>,
  options: RestOptions<T> = {},
): Promise<{ id: string }> {
  const { idParam = "id" } = options;
  const id = (req.params as Record<string, string>)[idParam];
  if (!collection.has(id)) throw reply.notFound(`Resource '${id}' not found`);
  collection.delete(id);
  return { id };
}

export function toEnvelope<T>(result: GetAllResult<T>): GetAllResult<T> {
  return result;
}

export function setPaginationHeaders<T>(
  reply: FastifyReply,
  result: GetAllResult<T>,
): void {
  reply.header("X-Total-Count", result.total);
  reply.header("X-Page", result.page);
  reply.header("X-Limit", result.limit);
  reply.header("X-Pages", result.pages);
}
