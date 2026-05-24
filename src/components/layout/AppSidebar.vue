<template>
  <aside class="sidebar">
    <div class="logo">
      <img src="/favicon.png" alt="Ringio" class="logo-img" />
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  min-width: 220px;
  background-color: #0a0a0a;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.logo-img {
  width: 180px;
  height: 180px;
}

.logo-name {
  font-size: 18px;
  font-weight: 500;
  color: #f0f0f8;
}
</style>