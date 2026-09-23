import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

export function dismiss(id) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

/** toast({ title, description, variant: 'default' | 'success' | 'destructive' }) */
export function toast({ title, description, variant = 'default', duration = 4000 }) {
  const id = ++nextId
  toasts.value = [...toasts.value, { id, title, description, variant }].slice(-4)
  setTimeout(() => dismiss(id), duration)
}

export function useToast() {
  return { toasts, toast, dismiss }
}
