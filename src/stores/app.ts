import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppSettings, Language } from '@/types'

const STORAGE_KEY = 'billuyo:settings'

export const useAppStore = defineStore('app', () => {
  const settings = ref<AppSettings>(loadSettings())

  function loadSettings(): AppSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return { language: 'en', defaultCurrency: 'USD', onboarded: false }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
  }

  function setLanguage(lang: Language) {
    settings.value.language = lang
    persist()
  }

  function setDefaultCurrency(currency: string) {
    settings.value.defaultCurrency = currency
    persist()
  }

  function setOnboarded() {
    settings.value.onboarded = true
    persist()
  }

  function resetSettings(data?: Partial<AppSettings>) {
    settings.value = {
      language: 'en',
      defaultCurrency: 'USD',
      onboarded: false,
      ...data,
    }
    persist()
  }

  const locale = computed<string>(() => settings.value.language === 'es' ? 'es' : 'en')

  return {
    settings,
    locale,
    setLanguage,
    setDefaultCurrency,
    setOnboarded,
    resetSettings,
  }
})
