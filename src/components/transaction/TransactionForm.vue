<template>
  <div class="transaction-form">
    <!-- Header -->
    <div class="form-header">
      <span class="form-title">
        Agregar transacción de <strong>{{ asset.ticker }}</strong>
      </span>
      <select v-model="tipo" class="tipo-select">
        <option value="compra">Compra</option>
        <option value="venta">Venta</option>
        <option value="rendimiento">Rendimiento</option>
      </select>
    </div>

    <!-- Campos -->
    <div class="form-fields">
      <div class="field-group">
        <div class="field">
          <label class="field-label">Cantidad</label>
          <input
            v-model.number="cantidad"
            type="number"
            min="0"
            step="any"
            class="field-input"
            placeholder="0"
          />
        </div>
        <div v-if="tipo !== 'rendimiento'" class="field">
          <label class="field-label">Precio</label>
          <input
            v-model.number="precioManual"
            type="number"
            min="0"
            step="any"
            class="field-input"
            :placeholder="asset.price ? String(asset.price) : '—'"
          />
        </div>
      </div>

      <div class="field date-field">
        <input v-model="fecha" type="date" class="field-input" />
      </div>
    </div>

    <!-- Total -->
    <div class="total-box">
      <span class="total-label">Total invertido</span>
      <span class="total-value">{{ formatCurrency(totalInvertido) }}</span>
    </div>

    <!-- Botón -->
    <button
      class="btn-submit"
      :disabled="!canSubmit || isSubmitting"
      @click="submitTransaccion"
    >
      <Loader2 v-if="isSubmitting" :size="16" class="spinner" />
      {{ isSubmitting ? "Guardando..." : "Agregar transacción" }}
    </button>

    <p v-if="submitError" class="submit-error">{{ submitError }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Loader2 } from "lucide-vue-next";
import { supabase } from "@/lib/supabase";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { fetchAssets } from "@/composables/useAssets.js";

const props = defineProps({
  asset: {
    type: Object,
    required: true,
    // { ticker, name, type, price, currency }
  },
});

const emit = defineEmits(["success"]);

const store = usePortfolioStore();

// ─── Estado del formulario ────────────────────────
const tipo = ref("compra");
const cantidad = ref(null);
const precioManual = ref(props.asset.price ?? null);
const fecha = ref(new Date().toISOString().split("T")[0]); // hoy por defecto
const isSubmitting = ref(false);
const submitError = ref(null);

// ─── Precio efectivo ──────────────────────────────
// Para compra/venta: precio manual o el de la API. Para rendimiento: precio de la API (solo para mostrar el total)
const precioEfectivo = computed(() => {
  return precioManual.value ?? props.asset.price ?? 0;
});

// ─── Total invertido ──────────────────────────────
const totalInvertido = computed(() => {
  if (!cantidad.value) return 0;
  return cantidad.value * precioEfectivo.value;
});

// ─── Validación ───────────────────────────────────
const canSubmit = computed(() => {
  return cantidad.value > 0 && fecha.value;
});

// ─── Submit ───────────────────────────────────────
async function submitTransaccion() {
  if (!canSubmit.value) return;

  isSubmitting.value = true;
  submitError.value = null;

  try {
    // 1. Buscar o crear el activo en Supabase
    const activoId = await resolveActivoId();

    // 2. Insertar la transacción
    const { error } = await supabase.from("Transaccion").insert({
      activo_id: activoId,
      portfolio_id: store.activePortfolio.id,
      tipo: tipo.value,
      cantidad: cantidad.value,
      precio: tipo.value === "rendimiento" ? null : precioEfectivo.value,
      fecha: fecha.value,
    });

    if (error) throw error;

    // Refrescar la tabla de activos con los datos nuevos
    await fetchAssets(store.activePortfolioId);

    emit("success");
    store.closeTransactionModal();
  } catch (err) {
    submitError.value = err.message;
  } finally {
    isSubmitting.value = false;
  }
}

// ─── Resolver activo_id ───────────────────────────
async function resolveActivoId() {
  // Buscar por ticker
  const { data, error } = await supabase
    .from("Activo")
    .select("id")
    .eq("ticker", props.asset.ticker)
    .single();

  if (data) return data.id;

  // Si no existe, lo creamos
  const { data: nuevo, error: insertError } = await supabase
    .from("Activo")
    .insert({
      ticker: props.asset.ticker,
      nombre: props.asset.name,
      tipo: props.asset.type,
      categoria:
        props.asset.type === "CRYPTOCURRENCY" ? "Digital Asset" : "Equity",
      valor: props.asset.price ?? 0,
    })
    .select("id")
    .single();

  if (insertError) throw insertError;
  return nuevo.id;
}

// ─── Helpers ──────────────────────────────────────
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
</script>

<style scoped>
.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

/* ── Header ── */
.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.form-title {
  font-size: 15px;
  color: var(--foreground);
}

.tipo-select {
  padding: 8px 12px;
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--foreground);
  font-family: var(--font);
  font-size: 14px;
  cursor: pointer;
  outline: none;
}

.tipo-select:focus {
  border-color: var(--primary);
}

/* ── Campos ── */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date-field {
  width: fit-content;
}

.field-label {
  font-size: 12px;
  color: var(--muted-foreground);
}

.field-input {
  padding: 10px 12px;
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--foreground);
  font-family: var(--font);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
}

.field-input:focus {
  border-color: var(--primary);
}

.field-input::placeholder {
  color: var(--muted-foreground);
}

/* ── Total ── */
.total-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.total-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.total-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
  font-family: "JetBrains Mono", monospace;
}

/* ── Botón ── */
.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font);
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.88;
}

.btn-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.submit-error {
  font-size: 13px;
  color: var(--destructive);
  text-align: center;
  margin: 0;
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

.field-input[type="number"]::-webkit-outer-spin-button,
.field-input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.field-input[type="number"] {
  appearance: textfield;
}
</style>
