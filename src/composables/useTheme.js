import { ref, computed } from 'vue'

const STORAGE_KEY = 'pulsewise-theme'
const theme = ref('light')

function read() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function apply(value) {
  // Toggle the class before updating the ref so watchers (e.g. charts) read the new tokens.
  document.documentElement.classList.toggle('dark', value === 'dark')
  theme.value = value
}

export function initTheme() {
  const stored = read()
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  apply(stored ?? (prefersDark ? 'dark' : 'light'))
}

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme() {
    const next = isDark.value ? 'light' : 'dark'
    apply(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
  }

  return { theme, isDark, toggleTheme }
}
