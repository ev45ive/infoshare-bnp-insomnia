import { z } from "zod/v4";

export const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  postalCode: z.string(),
  country: z.string().default("PL"),
}).meta({ id: "Address" });

export const CustomerSchema = z.object({
  id: z.uuid(),
  firstName: z.string().min(1).meta({ example: "Anna" }),
  lastName: z.string().min(1).meta({ example: "Kowalska" }),
  email: z.string().email().meta({ example: "anna.kowalska@example.com" }),
  pesel: z.string().meta({ example: "90010112345" }),
  status: z.enum(["active", "inactive"]).default("active"),
  address: AddressSchema.optional(),
  createdAt: z.string().datetime(),
}).meta({ id: "Customer" });

export const CreateCustomerSchema = CustomerSchema.omit({
  id: true,
  createdAt: true,
});


export type Customer = z.infer<typeof CustomerSchema>;
