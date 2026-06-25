````markdown
# Ringio 📈

Ringio es una aplicación web para gestionar y visualizar portafolios de inversión en un solo lugar.
Permite registrar transacciones de compra, venta y rendimientos sobre acciones, ETFs y criptomonedas,
con precios actualizados en tiempo real.

## ¿Qué problema resuelve?

Un inversor con posiciones en distintos tipos de activos necesita consultar múltiples plataformas para
tener una foto completa de su patrimonio.
Ringio centraliza esa información, permitiendo registrar operaciones históricas y ver en tiempo real
cómo evoluciona el valor de cada portafolio.

## ¿A quiénes está dirigido?

A inversores individuales con conocimiento intermedio de los mercados financieros, que ya operan en brokers
o exchanges y quieren una herramienta propia para hacer seguimiento de sus inversiones.

---

## Tecnologías

### Frontend

- **Vue 3** — Composition API y componentes de archivo único (.vue)
- **Vite** — Bundler con Hot Module Replacement
- **Pinia** — Gestión de estado global
- **Lucide Vue Next** — Íconos
- **@vueuse/core** — Utilidades de composición (debounce, onClickOutside, etc.)

### Visualización de datos

- **Chart.js** + **vue-chartjs** — Gráficos de evolución histórica y distribución de activos

### APIs de precios en tiempo real

- **Yahoo Finance API** — Precios de acciones y ETFs, búsqueda de activos por nombre o ticker
- **CoinGecko API** — Precios y variación 24h de criptomonedas

> Las APIs se consumen a través de un proxy configurado en Vite para evitar problemas de CORS.

### Base de datos

- **Supabase** — PostgreSQL como servicio para almacenar portafolios, activos y transacciones

---

## Estructura del proyecto

- `src/assets/`
- `src/components/`
  - `auth/`
  - `layout/` — header, sidebar, charts, assets
  - `transaction/` — AssetSearchModal.vue, TransactionForm.vue
  - `portfolio/`
- `src/composables/`
- `src/lib/`
- `src/services/` — priceService.js
- `src/stores/` — portfolioStore.js

---

## Servicios compartidos

### `priceService.js`

Funciones disponibles para usar en cualquier componente:

```js
import {
  fetchStockPrice,
  fetchCryptoPrice,
  searchAsset,
} from "@/services/priceService";

// Precio de una acción o ETF
const data = await fetchStockPrice("AAPL");
// → { ticker, name, price, currency, change24h, change24hPct }

// Precio de una cripto
const data = await fetchCryptoPrice("bitcoin");
// → { ticker, name, price, currency, change24h, change24hPct }

// Búsqueda de activos
const results = await searchAsset("apple");
// → [{ ticker, name, type, exchange }]
```
````

### `portfolioStore.js`

Store de Pinia con el estado global de la aplicación:

```js
import { usePortfolioStore } from "@/stores/portfolioStore";

const store = usePortfolioStore();

store.portfolios; // lista de portafolios
store.activePortfolio; // portafolio activo
store.setActivePortfolio(id);

store.openTransactionModal();
store.closeTransactionModal();
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

---

## Instalación

```bash
npm install
npm run dev
```
