<script setup>
import { cn } from '@/lib/utils'

defineProps({
  options: { type: Array, required: true },
  label: { type: String, default: 'Options' }
})
const model = defineModel({ type: String, required: true })

const normalize = (opt) => (typeof opt === 'object' ? opt : { value: opt, label: opt })
</script>

<template>
  <div role="radiogroup" :aria-label="label" class="inline-flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
    <button
      v-for="opt in options.map(normalize)"
      :key="opt.value"
      type="button"
      role="radio"
      :aria-checked="model === opt.value"
      :class="
        cn(
          'inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          model === opt.value
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )
      "
      @click="model = opt.value"
    >
      {{ opt.label }}
      <span v-if="opt.count != null" class="tabular-nums text-muted-foreground">{{ opt.count }}</span>
    </button>
  </div>
</template>
