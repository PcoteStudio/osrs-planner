<script setup lang="ts">
</script>

<template>
  <header>
    <div class="logo">
      <img alt="Vue logo" src="@/assets/logo.svg" width="125" height="125" />
    </div>

    <nav>
      <RouterLink to="/">
        <font-awesome-icon icon="fa-solid fa-house" />
        <span>{{ $t('home.title' )}}</span>
      </RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
header {
  background: blue;
}
</style>