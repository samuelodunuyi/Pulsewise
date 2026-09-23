<script setup>
import { computed } from 'vue'
import { TrendingDown, TrendingUp } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps({
  value: { type: Number, required: true }, // percent change
  invert: Boolean // true when a decrease is good news (e.g. wait time)
})

const good = computed(() => (props.value >= 0) !== props.invert)
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums',
        good ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
      )
    "
  >
    <TrendingUp v-if="value >= 0" class="size-3" />
    <TrendingDown v-else class="size-3" />
    {{ Math.abs(value).toFixed(1) }}%
  </span>
</template>
