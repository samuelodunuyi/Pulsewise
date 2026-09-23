import { reactive } from 'vue'

const request = reactive({ open: false, title: '', description: '', confirmLabel: 'Delete', resolve: null })

/** await confirm({ title, description, confirmLabel }) → true when the user confirms. */
export function confirm({ title, description = '', confirmLabel = 'Delete' }) {
  request.resolve?.(false)
  Object.assign(request, { open: true, title, description, confirmLabel })
  return new Promise((resolve) => (request.resolve = resolve))
}

export function settle(answer) {
  request.resolve?.(answer)
  request.resolve = null
  request.open = false
}

export function useConfirm() {
  return { request, confirm, settle }
}
