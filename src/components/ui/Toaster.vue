<script setup>
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { cn } from '@/lib/utils'

const { toasts, dismiss } = useToast()

const icons = { success: CheckCircle2, destructive: AlertCircle, default: Info }
const tones = { success: 'text-success', destructive: 'text-destructive', default: 'text-primary' }
</script>

<template>
  <div
    aria-live="polite"
    class="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:bottom-2 sm:left-auto sm:right-2 sm:items-end"
  >
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0 sm:translate-x-4 sm:translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-for="t in toasts"
        :key="t.id"
        role="status"
        class="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg"
      >
        <component :is="icons[t.variant] ?? Info" :class="cn('mt-0.5 size-5 shrink-0', tones[t.variant] ?? tones.default)" />
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold">{{ t.title }}</p>
          <p v-if="t.description" class="mt-0.5 text-sm text-muted-foreground">{{ t.description }}</p>
        </div>
        <button
          class="rounded-md p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Dismiss"
          @click="dismiss(t.id)"
        >
          <X class="size-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
