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
      </div>
    </section>

    <section class="form-side" aria-labelledby="login-title">
      <form class="login-card" @submit.prevent="isRegistering ? handleRegister() : handleLogin()">
        <div class="mobile-brand">
          <div class="brand-mark small"><span>R</span></div>
            <span>Ringio</span>
        </div>
        <span class="eyebrow">{{ isRegistering ? 'Crear cuenta' : 'Acceso seguro' }}</span>
        <h2 id="login-title">{{ isRegistering ? 'Registrate gratis' : 'Bienvenido de nuevo' }}</h2>
        <p class="form-copy">{{ isRegistering ? 'Creá tu cuenta para empezar a gestionar tus inversiones.' : 'Usá tus credenciales para entrar al panel de inversiones.' }}</p>

        <label v-if="isRegistering" class="field-group" for="register-name">
          Nombre
          <div class="input-shell">
            <User :size="17" />
            <input id="register-name" v-model="registerName" type="text" placeholder="Tu nombre" required />
          </div>
        </label>

        <label class="field-group" for="email">
          Email
          <div class="input-shell">
            <Mail :size="17" />
            <input 
              v-if="isRegistering"
              id="email" 
              v-model="registerEmail" 
              type="email" 
              autocomplete="email" 
              placeholder="ejemplo@correo.com" 
              required 
            />
            <input 
              v-else
              id="email" 
              v-model="email" 
              type="email" 
              autocomplete="email" 
              placeholder="ejemplo@correo.com" 
              required 
            />
          </div>
        </label>

        <label class="field-group" style="margin-bottom: 24px;" for="password">
          Contraseña
          <div class="input-shell">
            <LockKeyhole :size="17" />
            <input 
              v-if="isRegistering"
              id="password" 
              v-model="registerPassword" 
              :type="showPassword ? 'text' : 'password'" 
              autocomplete="current-password" 
              placeholder="••••••••" 
              required 
            />
            <input 
              v-else
              id="password" 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              autocomplete="current-password" 
              placeholder="••••••••" 
              required 
            />
            <button class="icon-button" type="button" @click="showPassword = !showPassword">
              <EyeOff v-if="showPassword" :size="17" />
              <Eye v-else :size="17" />
            </button>
          </div>
        </label>

        <div v-if="!isRegistering" class="form-options">
          <label class="remember">
            <input v-model="remember" type="checkbox" />
            Recordarme
          </label>
          <a href="#" @click.prevent="$el.querySelector('#forgot-password-modal').showModal()">Olvidé mi contraseña</a>
        </div>

        <AppLoader v-if="loading" />
        <button v-else class="login-button" type="submit">
          {{ isRegistering ? 'Crear cuenta' : 'Entrar al Dashboard' }}
          <ArrowRight :size="17" />
        </button>

        <p class="signup-copy">
          {{ isRegistering ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?' }}
          <a href="#" @click.prevent="isRegistering = !isRegistering">
            {{ isRegistering ? 'Iniciá sesión' : 'Crear cuenta gratis' }}
          </a>
        </p>
      </form>
      <dialog id="forgot-password-modal" class="custom-alert">
        <div class="alert-content">
          <div class="brand-mark small"><span>R</span></div>
            <h3>¿Te olvidaste la clave?</h3>
            <p class="form-copy">
              Lamentamos que olvidaras tu contraseña. <br /> ¡Para poder ingresar te sugerimos que te la acuerdes! 
            </p>
            <button type="button" class="login-button close-alert-btn" @click="$el.querySelector('#forgot-password-modal').close()">
              Entendido, haré memoria
            </button>
          </div>
      </dialog>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, User } from 'lucide-vue-next'
import { loginAI } from '@/lib/aiAuth.js'
import { loginWithCredentials } from '@/composables/useAuth.js'
import AppLoader from '@/components/AppLoader.vue'
import { registerAI } from '@/lib/aiAuth.js'
import { supabase } from '@/lib/supabase.js'

  const isRegistering = ref(false)
  const registerName = ref('')
  const registerEmail = ref('')
  const registerPassword = ref('')

  const handleRegister = async () => {
    loading.value = true
    try {
      await registerAI(registerEmail.value, registerPassword.value)
      await supabase.from('Usuario').insert({
        nombre: registerName.value,
        email: registerEmail.value,
        password: registerPassword.value,
        plan: 'Free'
      })
      await loginWithCredentials(registerEmail.value, registerPassword.value)
      emit('login')
    } catch (err) {
      console.error('Error en el registro:', err)
    } finally {
      loading.value = false
    }
  }

const emit = defineEmits(['login'])

const email = ref('matias@ringio.app')
const password = ref('ringio-demo')
const remember = ref(true)
const showPassword = ref(false)
const loading = ref(false)
const bars = [42, 56, 44, 72, 63, 86, 76, 94]

const handleLogin = async () => {
  loading.value = true
  try {
    await loginAI(email.value, password.value)
    await loginWithCredentials(email.value, password.value)
  } catch (err) {
    console.error('Error en el login:', err)
  } finally {
    loading.value = false
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
  background: var(--card);
  box-shadow: 0 28px 90px color-mix(in srgb, var(--foreground) 14%, transparent);
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
  background: color-mix(in srgb, var(--muted) 72%, transparent);
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
  background: color-mix(in srgb, var(--muted) 70%, transparent);
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
  background: color-mix(in srgb, var(--card) 74%, transparent);
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

/*-------------------------------------------------------------------------------------*/ 
/*---- Estilos para el Alert Personalizado --------------------------------------------*/
.custom-alert {
  background: #11131e; /* El fondo oscuro de tu app */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  color: #ffffff;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.custom-alert::backdrop {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px); /* Efecto de desenfoque al fondo */
}

.alert-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.alert-content h3 {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
}

.close-alert-btn {
  margin-top: 8px;
  width: 100%;
  padding: 12px;
  cursor: pointer;
}
</style>
