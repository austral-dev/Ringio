<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="store.isTransactionModalOpen" class="modal-backdrop">
        <div class="modal" ref="modalRef">
          <!-- Paso: búsqueda -->
          <template v-if="store.transactionFlow.step === 'search'">
            <!-- Header -->
            <div class="modal-header">
              <span class="modal-title">Seleccionar activo</span>
              <button class="btn-close" @click="store.closeTransactionModal()">
                <X :size="18" />
              </button>
            </div>

            <!-- Recientes -->
            <div v-if="recentAssets.length" class="recent-assets">
              <button
                v-for="asset in recentAssets"
                :key="asset.ticker"
                class="chip"
                @click="store.selectAsset(asset)"
              >
                {{ asset.ticker }}
              </button>
            </div>

            <!-- Búsqueda -->
            <div class="search-wrapper">
              <Search :size="16" class="search-icon" />
              <input
                ref="inputRef"
                v-model="store.searchQuery"
                class="search-input"
                type="text"
                placeholder="Buscar acción, ETF o cripto..."
                @input="onInput"
              />
            </div>

            <!-- Resultados -->
            <div class="results">
              <div v-if="store.isSearching" class="state-message">
                <Loader2 :size="18" class="spinner" />
                Buscando...
              </div>
              <div v-else-if="store.searchError" class="state-message error">
                {{ store.searchError }}
              </div>
              <div
                v-else-if="store.searchQuery && !store.searchResults.length"
                class="state-message"
              >
                Sin resultados para "{{ store.searchQuery }}"
              </div>
              <button
                v-for="asset in store.searchResults"
                :key="asset.ticker"
                class="result-item"
                @click="store.selectAsset(asset)"
              >
                <div class="result-info">
                  <span class="result-name">{{ asset.name }}</span>
                  <span class="result-ticker">{{ asset.ticker }}</span>
                </div>
                <div class="result-meta">
                  <span class="result-type">{{ formatType(asset.type) }}</span>
                  <ChevronRight :size="16" class="result-chevron" />
                </div>
              </button>
            </div>
          </template>

          <!-- Paso: formulario -->
          <template v-else-if="store.transactionFlow.step === 'form'">
            <div class="modal-header">
              <button
                class="btn-back"
                @click="store.transactionFlow.step = 'search'"
              >
                <ChevronLeft :size="18" />
              </button>
              <button class="btn-close" @click="store.closeTransactionModal()">
                <X :size="18" />
              </button>
            </div>
            <TransactionForm :asset="store.transactionFlow.selectedAsset" />
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue";
import { X, Search, ChevronRight, ChevronLeft, Loader2 } from "lucide-vue-next";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useDebounceFn, onClickOutside } from "@vueuse/core";
import TransactionForm from "@/components/transaction/TransactionForm.vue";

const store = usePortfolioStore();
const inputRef = ref(null);
const modalRef = ref(null);

onClickOutside(modalRef, () => store.closeTransactionModal());

const recentAssets = ref([
  { ticker: "SPY", name: "SPDR S&P 500 ETF", type: "ETF" },
  { ticker: "QQQ", name: "Invesco QQQ Trust", type: "ETF" },
  { ticker: "DIA", name: "SPDR Dow Jones ETF", type: "ETF" },
  { ticker: "BTC", name: "Bitcoin", type: "CRYPTOCURRENCY" },
  { ticker: "GLD", name: "SPDR Gold Shares", type: "ETF" },
  { ticker: "NVDA", name: "NVIDIA Corporation", type: "EQUITY" },
]);

const debouncedSearch = useDebounceFn((val) => {
  store.search(val);
}, 350);

function onInput(e) {
  debouncedSearch(e.target.value);
}

watch(
  () => store.isTransactionModalOpen,
  (isOpen) => {
    if (isOpen) {
      setTimeout(() => inputRef.value?.focus(), 50);
    }
  },
);

function formatType(type) {
  const map = {
    EQUITY: "Acción",
    ETF: "ETF",
    CRYPTOCURRENCY: "Cripto",
    MUTUALFUND: "Fondo",
    INDEX: "Índice",
  };
  return map[type] ?? type;
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 560px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Header ── */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
}

.modal-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
}

.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--muted-foreground);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    color 0.15s,
    background 0.15s;
}

.btn-close:hover {
  color: var(--foreground);
  background: var(--secondary);
}

.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--muted-foreground);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    color 0.15s,
    background 0.15s;
}

.btn-back:hover {
  color: var(--foreground);
  background: var(--secondary);
}

/* ── Recientes ── */
.recent-assets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 20px 16px;
}

.chip {
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--secondary);
  color: var(--foreground);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.chip:hover {
  background: var(--muted);
  border-color: var(--primary);
}

/* ── Búsqueda ── */
.search-wrapper {
  position: relative;
  margin: 0 20px 8px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--foreground);
  font-size: 14px;
  font-family: var(--font);
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.search-input:focus {
  border-color: var(--primary);
}

.search-input::placeholder {
  color: var(--muted-foreground);
}

/* ── Resultados ── */
.results {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px 12px;
}

.state-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px;
  color: var(--muted-foreground);
  font-size: 14px;
  justify-content: center;
}

.state-message.error {
  color: var(--destructive);
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 8px;
  border: none;
  background: transparent;
  border-bottom: 1px solid var(--border);
  color: var(--foreground);
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
  font-family: var(--font);
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background: var(--secondary);
  border-radius: var(--radius-md);
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.result-name {
  font-size: 14px;
  font-weight: 500;
}

.result-ticker {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted-foreground);
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-type {
  font-size: 12px;
  color: var(--muted-foreground);
}

.result-chevron {
  color: var(--muted-foreground);
}

/* ── Spinner ── */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 0.8s linear infinite;
}

/* ── Transición del modal ── */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(12px);
  opacity: 0;
}
</style>
