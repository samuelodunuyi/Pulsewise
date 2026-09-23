<script setup>
import { cn } from '@/lib/utils'

defineProps({
  title: String,
  description: String,
  contentClass: { type: [String, Array, Object], default: '' }
})
</script>

<template>
  <section class="flex min-w-0 flex-col rounded-xl border bg-card text-card-foreground shadow-sm">
    <header
      v-if="title || $slots.header || $slots.action"
      class="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 px-5 pt-5"
    >
      <slot name="header">
        <div class="min-w-0 space-y-1">
          <h2 class="font-semibold leading-tight tracking-tight">{{ title }}</h2>
          <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
        </div>
      </slot>
      <div v-if="$slots.action" class="flex shrink-0 items-center gap-2">
        <slot name="action" />
      </div>
    </header>
    <div :class="cn('flex-1 p-5', contentClass)">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="flex items-center border-t px-5 py-3">
      <slot name="footer" />
    </footer>
  </section>
</template>
