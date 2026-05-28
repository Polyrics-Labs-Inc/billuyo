<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  ListChecks,
} from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const navItems = [
  { label: 'nav.dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'nav.transactions', icon: ArrowLeftRight, path: '/transactions' },
  { label: 'nav.accounts', icon: Wallet, path: '/accounts' },
  { label: 'nav.tracking', icon: Target, path: '/tracking' },
  { label: 'nav.obligations', icon: ListChecks, path: '/obligations' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 bg-clay-surface/95 backdrop-blur-lg border-t border-clay-border/30 shadow-clay-nav pb-safe">
    <div class="flex items-center justify-around max-w-lg mx-auto px-2 py-1">
      <button
        v-for="item in navItems"
        :key="item.path"
        class="clay-nav-link"
        :class="{ 'clay-nav-link-active': isActive(item.path) }"
        @click="router.push(item.path)"
      >
        <component :is="item.icon" class="w-5 h-5" :stroke-width="isActive(item.path) ? 2.5 : 1.5" />
        <span class="text-[10px] font-medium">{{ t(item.label) }}</span>
      </button>
    </div>
  </nav>
</template>
