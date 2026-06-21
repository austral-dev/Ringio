<template>
  <main class="login-screen">
    <section class="brand-side" aria-label="Presentación Ringio">
      <div class="brand-orb brand-orb-one" />
      <div class="brand-orb brand-orb-two" />

      <div class="brand-card">
        <div class="brand-mark" aria-hidden="true">
          <span>R</span>
        </div>
        <span class="eyebrow">Ringio Portfolio</span>
        <h1>Tu patrimonio, claro y en tiempo real.</h1>
        <p>
          Ingresá para visualizar activos, rendimiento, alertas y oportunidades del portafolio desde un dashboard simple.
        </p>

        <div class="mini-chart" aria-hidden="true">
          <span v-for="bar in bars" :key="bar.height" :style="{ height: `${bar.height}%` }" />
        </div>

        <div class="trust-row">
          <div>
            <strong>$127k</strong>
            <span>Valor total</span>
          </div>
          <div>
            <strong>+28.7%</strong>
            <span>Histórico</span>
          </div>
          <div>
            <strong>6</strong>
            <span>Activos</span>
          </div>
        </div>
      </div>
    </section>

    <section class="form-side" aria-labelledby="login-title">
      <form class="login-card" @submit.prevent="handleLogin">
        <div class="mobile-brand">
          <div class="brand-mark small"><span>R</span></div>
          <span>Ringio</span>
        </div>

        <span class="eyebrow">Acceso seguro</span>
        <h2 id="login-title">Bienvenido de nuevo</h2>
        <p class="form-copy">Usá tus credenciales para entrar al panel de inversiones.</p>

        <label class="field-group" for="email">
          Email
          <div class="input-shell">
            <Mail :size="17" />
            <input id="email" v-model="email" type="email" autocomplete="email" placeholder="matias@ringio.app" required />
          </div>
        </label>

        <label class="field-group" for="password">
          Contraseña
          <div class="input-shell">
            <LockKeyhole :size="17" />
            <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="••••••••" required />
            <button class="icon-button" type="button" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" @click="showPassword = !showPassword">
              <EyeOff v-if="showPassword" :size="17" />
              <Eye v-else :size="17" />
            </button>
          </div>
        </label>

        <div class="form-options">
          <label class="remember">
            <input v-model="remember" type="checkbox" />
            Recordarme
          </label>
          <a href="#">Olvidé mi contraseña</a>
        </div>

        <button class="login-button" type="submit">
          Entrar al dashboard
          <ArrowRight :size="17" />
        </button>

        <p class="signup-copy">¿No tenés cuenta? <a href="#">Crear cuenta gratis</a></p>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-vue-next'
import { loginAI } from '@/lib/aiAuth.js'

const emit = defineEmits(['login'])

const email = ref('matias@ringio.app')
const password = ref('ringio-demo')
const remember = ref(true)
const showPassword = ref(false)
const bars = [42, 56, 44, 72, 63, 86, 76, 94]

const handleLogin = async () => {
  try {
    const token = await loginAI(email.value, password.value)
    console.log('Token recibido!')
  } catch (err) {
    console.error('No se pudo conectar con la API de IA:', err)
  }
  emit('login')
}
</script>

<style scoped>
.login-screen {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(420px, 0.92fr);
  background:
    radial-gradient(circle at 12% 18%, rgba(62, 207, 142, 0.16), transparent 26%),
    radial-gradient(circle at 86% 82%, rgba(155, 122, 255, 0.14), transparent 30%),
    var(--background);
  color: var(--foreground);
}

.brand-side,
.form-side {
  position: relative;
  display: grid;
  place-items: center;
  padding: 42px;
  overflow: hidden;
}

.brand-card,
.login-card {
  position: relative;
  width: min(100%, 520px);
  border: 1px solid var(--border);
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.025));
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(16px);
}

.brand-card {
  padding: 42px;
}

.brand-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(6px);
  opacity: 0.55;
}

.brand-orb-one {
  width: 220px;
  height: 220px;
  top: 12%;
  right: 16%;
  background: rgba(62, 207, 142, 0.18);
}

.brand-orb-two {
  width: 300px;
  height: 300px;
  left: 8%;
  bottom: 8%;
  background: rgba(155, 122, 255, 0.16);
}

.brand-mark {
  width: 62px;
  height: 62px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: rgba(62, 207, 142, 0.12);
  border: 1px solid rgba(62, 207, 142, 0.35);
  color: var(--primary);
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 24px;
}

.brand-mark.small {
  width: 38px;
  height: 38px;
  border-radius: 13px;
  font-size: 18px;
  margin: 0;
}

.mobile-brand {
  display: none;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}

.eyebrow {
  color: var(--primary);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.brand-card h1,
.login-card h2 {
  margin: 10px 0 12px;
  line-height: 1.05;
}

.brand-card h1 {
  font-size: clamp(38px, 6vw, 64px);
  letter-spacing: -0.05em;
}

.brand-card p,
.form-copy,
.signup-copy {
  color: var(--muted-foreground);
  line-height: 1.7;
}

.mini-chart {
  height: 150px;
  display: flex;
  align-items: end;
  gap: 12px;
  margin: 36px 0;
  padding: 18px;
  border-radius: 22px;
  background: rgba(9, 9, 15, 0.48);
  border: 1px solid var(--border);
}

.mini-chart span {
  flex: 1;
  border-radius: 999px 999px 8px 8px;
  background: linear-gradient(180deg, var(--primary), rgba(62, 207, 142, 0.16));
  min-height: 28px;
}

.trust-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.trust-row div {
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
}

.trust-row strong,
.trust-row span {
  display: block;
}

.trust-row span {
  color: var(--muted-foreground);
  font-size: 12px;
  margin-top: 3px;
}

.form-side {
  background: rgba(11, 11, 22, 0.52);
  border-left: 1px solid var(--border);
}

.login-card {
  padding: 36px;
}

.login-card h2 {
  font-size: 34px;
  letter-spacing: -0.03em;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
  color: var(--foreground);
  font-size: 14px;
}

.input-shell {
  height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  color: var(--muted-foreground);
  background: var(--input, rgba(255, 255, 255, 0.05));
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input-shell:focus-within {
  border-color: rgba(62, 207, 142, 0.55);
  box-shadow: 0 0 0 4px rgba(62, 207, 142, 0.08);
}

.input-shell input {
  flex: 1;
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--foreground);
  font-family: var(--font);
}

.icon-button {
  border: 0;
  background: transparent;
  color: var(--muted-foreground);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 18px 0 24px;
  font-size: 13px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted-foreground);
}

.remember input {
  accent-color: var(--primary);
}

.form-options a,
.signup-copy a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 700;
}

.login-button {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: var(--radius-lg);
  background: var(--primary);
  color: var(--primary-foreground);
  cursor: pointer;
  font-family: var(--font);
  font-weight: 800;
  box-shadow: 0 18px 34px rgba(62, 207, 142, 0.18);
}

.signup-copy {
  margin: 22px 0 0;
  text-align: center;
  font-size: 13px;
}

@media (max-width: 920px) {
  .login-screen {
    grid-template-columns: 1fr;
  }

  .brand-side {
    display: none;
  }

  .form-side {
    min-height: 100vh;
    border-left: 0;
  }

  .mobile-brand {
    display: flex;
    margin-bottom: 28px;
  }
}

@media (max-width: 540px) {
  .form-side {
    padding: 18px;
  }

  .login-card {
    padding: 26px;
    border-radius: 24px;
  }

  .form-options {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
