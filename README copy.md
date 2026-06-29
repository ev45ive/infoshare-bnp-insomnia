# InsoBank — Demo API

Serwer demo dla warsztatu Insomnia. CRUD `customers` + `health`, store w pamięci (seed z `data/*.json`).

## Start

```bash
npm install
npm run dev        # tsx watch, http://localhost:3000
```

Sprawdzenie: `GET http://localhost:3000/health` → `200`.
Dokumentacja: `http://localhost:3000/docs` (JSON: `/docs/json`, YAML: `/docs/yaml`).

## Kolekcja Insomnia

1. Insomnia → **Import** → `insomnia/collection.json`.
2. Środowisko `Base Environment` ma `base_url=http://localhost:3000`.
3. Uruchom folder **Customers** sekwencyjnie: POST tworzy klienta → zapisuje `new_customer_id` → GET/PUT/PATCH/DELETE → 404.

### CLI (inso 13+)

```bash
inso run test "Etap 1 — smoke" -w insomnia/collection.json --ci
```

DoD Etapu 1: health 200, CRUD customers, filtr/sort/paginacja, 404 po usunięciu.
