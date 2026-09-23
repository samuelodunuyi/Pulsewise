<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: [String, Array, Object], default: '' }
})
const model = defineModel({ type: String, default: '' })
</script>

<template>
  <textarea
    v-model="model"
    rows="3"
    :class="
      cn(
        'flex min-h-[80px] w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 disabled:opacity-50 aria-[invalid=true]:border-destructive',
        props.class
      )
    "
  />
</template>
