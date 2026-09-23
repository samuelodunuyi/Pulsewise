import { ref, watch } from 'vue'

const STORAGE_KEY = 'pulsewise-sidebar-collapsed'

function readCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

const collapsed = ref(readCollapsed())
const mobileOpen = ref(false)

watch(collapsed, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
  } catch {
    /* ignore */
  }
})

export function useSidebar() {
  return {
    collapsed,
    mobileOpen,
    toggleCollapsed: () => (collapsed.value = !collapsed.value),
    openMobile: () => (mobileOpen.value = true)
  }
}
