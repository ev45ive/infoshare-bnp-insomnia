import { z } from "zod/v4";

export const BranchSchema = z.object({
  id: z.uuid(),
  name: z.string().meta({ example: "InsoBank Warszawa Centrum" }),
  city: z.string().meta({ example: "Warszawa" }),
  address: z.string(),
  phone: z.string(),
}).meta({ id: "Branch" });

export type Branch = z.infer<typeof BranchSchema>;
