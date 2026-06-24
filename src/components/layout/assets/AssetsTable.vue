<template>
    <div class="table-wrapper">
        <table class="assets-table">
            <thead>
                <tr>
                    <th>NOMBRE</th>
                    <th>PRECIO</th>
                    <th>24H</th>
                    <th>CANTIDAD</th>
                    <th>MONTO ACTUAL</th>
                    <th>PPC</th>
                    <th>+/-</th>
                    <th>%</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="activo in activos" :key="activo.id">
                    <td class="col-nombre">
                        <div class="asset-avatar">
                            {{ activo.ticker }}
                        </div>
                        <div class="asset-info">
                            <span class="asset-nombre">{{ activo.nombre }}</span>
                            <div class="asset-tags">
                                <span class="tag" :class="activo.tipo === 'Crypto' ? 'tag-crypto' : 'tag-accion'">
                                    {{ activo.tipo }}
                                </span>
                                <span class="asset-categoria">{{ activo.categoria }}</span>
                            </div>
                        </div>
                    </td>
                    <td>${{ formatNum(activo.precio) }}</td>
                    <td :class="activo.variacion24h >= 0 ? 'positive' : 'negative'">
                        {{ activo.variacion24h >= 0 ? '+' : '' }}{{ activo.variacion24h.toFixed(2) }}%
                    </td>
                    <td class="col-cantidad">
                        {{ activo.cantidad }}
                        <span class="ticker-label">{{ activo.ticker }}</span>
                    </td>
                    <td>${{ formatNum(activo.montoActual) }}</td>
                    <td class="col-muted">${{ formatNum(activo.ppc) }}</td>
                    <td :class="activo.gananciaPerdida >= 0 ? 'positive' : 'negative'">
                        {{ activo.gananciaPerdida >= 0 ? '+' : '' }}${{ formatNum(activo.gananciaPerdida) }}
                    </td>
                    <td :class="activo.porcentaje >= 0 ? 'positive' : 'negative'">
                        {{ activo.porcentaje >= 0 ? '+' : '' }}{{ activo.porcentaje.toFixed(2) }}%
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
    defineProps({
        activos: {
            type: Array,
            default: () => []
        }
})

const formatNum = (num) =>
    num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
</script>

<style scoped>
.table-wrapper {
    overflow-x: auto;
}

.assets-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    font-family: 'JetBrains Mono', monospace;
}

thead th {
    text-align: left;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--muted-foreground);
    padding: 0 1rem 0.75rem 0;
    border-bottom: 1px solid var(--border);
    font-family: 'Plus Jakarta Sans', sans-serif;
}

tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.15s ease;
}

tbody tr:last-child {
    border-bottom: none;
}

tbody tr:hover {
    background: var(--secondary);
}

tbody td {
    padding: 1rem 1rem 1rem 0;
    color: var(--foreground);
    white-space: nowrap;
}

.col-nombre {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 12rem;
}

.asset-avatar {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: var(--secondary);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    font-weight: 700;
    color: var(--muted-foreground);
    flex-shrink: 0;
    font-family: 'JetBrains Mono', monospace;
}

.asset-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.asset-nombre {
    font-weight: 500;
    color: var(--foreground);
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.asset-tags {
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

.tag {
    font-size: 0.625rem;
    font-weight: 600;
    padding: 0.125rem 0.375rem;
    border-radius: var(--radius-sm);
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.tag-crypto {
    background: rgba(155, 122, 255, 0.15);
    color: var(--accent);
}

.tag-accion {
    background: rgba(62, 207, 142, 0.12);
    color: var(--primary);
}

.asset-categoria {
    font-size: 0.75rem;
    color: var(--muted-foreground);
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.col-cantidad {
    color: var(--muted-foreground);
}

.ticker-label {
    font-size: 0.75rem;
    color: var(--muted-foreground);
    margin-left: 0.25rem;
}

.col-muted {
    color: var(--muted-foreground);
}

.positive {
    color: var(--primary);
}

.negative {
    color: var(--destructive);
}
</style>