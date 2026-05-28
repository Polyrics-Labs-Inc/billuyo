<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import BottomNav from './BottomNav.vue'

const route = useRoute()

const hideNav = ['onboarding']
const showNav = computed(() => !hideNav.includes(String(route.name || '')))
</script>

<template>
  <div class="flex flex-col min-h-screen max-w-lg mx-auto w-full">
    <main class="flex-1 px-4 pb-24">
      <RouterView />
    </main>
    <BottomNav v-if="showNav" />
  </div>
</template>
