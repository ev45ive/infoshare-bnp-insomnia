import { Store, loadSeed } from "./store.ts";
import type { Customer } from "./schemas/customer.ts";
import type { User } from "./schemas/user.ts";
import type { Account } from "./schemas/account.ts";
import type { Transaction } from "./schemas/transaction.ts";
import type { Branch } from "./schemas/branch.ts";
import type { ExchangeRate } from "./schemas/exchange-rate.ts";
import type { Product } from "./schemas/product.ts";

export const db = {
  customers: new Store<Customer>(loadSeed<Customer>("customers-data.json")),
  users: new Store<User>(loadSeed<User>("users-data.json")),
  accounts: new Store<Account>(loadSeed<Account>("accounts-data.json")),
  transactions: new Store<Transaction>(
    loadSeed<Transaction>("transactions-data.json"),
  ),
  branches: new Store<Branch>(loadSeed<Branch>("branches-data.json")),
  exchangeRates: new Store<ExchangeRate>(
    loadSeed<ExchangeRate>("exchange-rates-data.json"),
  ),
  products: new Store<Product>(loadSeed<Product>("products-data.json")),
};

/** Przywróć wszystkie store'y do stanu z seedów (demo). */
export function resetDb(): void {
  db.customers.reset(loadSeed<Customer>("customers-data.json"));
  db.users.reset(loadSeed<User>("users-data.json"));
  db.accounts.reset(loadSeed<Account>("accounts-data.json"));
  db.transactions.reset(loadSeed<Transaction>("transactions-data.json"));
}
