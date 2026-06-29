import { z } from "zod/v4";

export const Role = z.enum(["admin", "manager", "user"]);

export const UserSchema = z.object({
  id: z.uuid(),
  username: z.string().min(3).meta({ example: "anna" }),
  password: z.string().min(4).meta({ example: "secret123" }),
  role: Role.default("user"),
  customerId: z.uuid().optional(),
  email: z.string().email().meta({ example: "anna@example.com" }),
});

export const LoginSchema = z.object({
  username: z.string().min(3).meta({ example: "anna" }),
  password: z.string().min(4).meta({ example: "secret123" }),
});

export type User = z.infer<typeof UserSchema>;
