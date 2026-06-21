<template>
    <div class="chat-section">
        <span class="section-label">Asistente IA</span>

        <div class="chat-messages" ref="messagesEl">
            <div
                v-for="(msg, i) in messages"
                :key="i"
                class="chat-bubble"
                :class="msg.role"
            >
                {{ msg.text }}
            </div>

            <div v-if="loading" class="chat-bubble assistant loading">
                <span class="dot" /><span class="dot" /><span class="dot" />
            </div>
        </div>

        <form class="chat-input-row" @submit.prevent="handleSend">
            <input
                v-model="input"
                type="text"
                placeholder="Escribí tu mensaje..."
                :disabled="loading"
            />
            <button type="submit" :disabled="loading || !input.trim()" aria-label="Enviar">
                <SendHorizontal :size="16" />
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { sendMessage } from '@/lib/aiAuth.js'

const input = ref('')
const messages = ref([
    {
        role: 'assistant',
        text: "¡Hola! 👋 Te doy la bienvenida. Estoy acá para ayudarte a analizar inversiones y armar tus estrategias de mercado a mediano y largo plazo.\n\n¿En qué te puedo ayudar?\n• 📊 Análisis de activos: Evalúo acciones y las principales criptomonedas con fundamentos sólidos.\n• 📈 Datos en tiempo real: Reviso precios actuales, variaciones en 24 horas y capitalización de mercado.\n• 🛠️ Estrategia completa: Sumo análisis técnico, fundamental y gestión de riesgos según tus plazos.\n• 💡 Orientación: Te ayudo a entender la volatilidad y cómo diversificar tu cartera.\n\n⚠️ Un detalle importante: Solo respondo consultas sobre finanzas y mercados. Mi rol es guiarte y explicarte cómo funciona este mundo; no doy asesoramiento financiero certificado.\n\n¿Qué mercado querés que empiece a mirar hoy?"
    }
])
const loading = ref(false)
const messagesEl = ref(null)

const scrollToBottom = async () => {
    await nextTick()
    if (messagesEl.value) {
        messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    }
}

const handleSend = async () => {
    const text = input.value.trim()
    if (!text) return

    messages.value.push({ role: 'user', text })
    input.value = ''
    loading.value = true
    scrollToBottom()

    try {
        const response = await sendMessage(text)
        messages.value.push({ role: 'assistant', text: response })
    } catch (err) {
        console.error('Error en el chat:', err)
        messages.value.push({ role: 'assistant', text: 'No pude responder, intentá de nuevo.' })
    } finally {
        loading.value = false
        scrollToBottom()
    }
}
</script>

<style scoped>
.chat-section {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    margin-top: 20px;
    gap: 8px;
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 14px;
}

.section-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.8px;
}

.chat-messages {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 4px;
}

.chat-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 1;
    color: var(--muted-foreground);
    text-align: center;
    font-size: 12px;
}

.empty-icon {
    width: 22px;
    height: 22px;
    color: var(--accent);
}

.chat-bubble {
    max-width: 90%;
    padding: 9px 11px;
    border-radius: var(--radius-md);
    font-size: 13.5px;
    line-height: 1.5;
    word-break: break-word;
}

.chat-bubble.user {
    align-self: flex-end;
    background: rgba(62, 207, 142, 0.18);
    color: var(--foreground);
    border: 1px solid rgba(62, 207, 142, 0.35);
}

.chat-bubble.assistant {
    align-self: flex-start;
    background: var(--secondary);
    color: var(--foreground);
}

.chat-bubble.loading {
    display: flex;
    gap: 4px;
    align-items: center;
}

.dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--muted-foreground);
    animation: pulse 1s infinite ease-in-out;
}

.dot:nth-child(2) { animation-delay: 0.15s; }
.dot:nth-child(3) { animation-delay: 0.3s; }

@keyframes pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.85); }
    50% { opacity: 1; transform: scale(1); }
}

.chat-input-row {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 4px 4px 4px 10px;
    background: var(--secondary);
}

.chat-input-row input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: var(--foreground);
    font-size: 13.5px;
}

.chat-input-row input::placeholder {
    color: var(--muted-foreground);
}

.chat-input-row button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: var(--radius-sm);
    background: var(--primary);
    color: var(--primary-foreground);
    cursor: pointer;
    flex-shrink: 0;
    transition: opacity 0.15s ease;
}

.chat-input-row button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
</style>