<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: [String, Array, Object], default: '' }
})
const model = defineModel({ type: [String, Number], default: '' })
</script>

<template>
  <input
    v-model="model"
    :class="
      cn(
        'flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20',
        props.class
      )
    "
  />
</template>
