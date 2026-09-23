<script setup>
import Card from '@/components/ui/Card.vue'
import Delta from '@/components/common/Delta.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: [Object, Function], required: true },
  color: { type: String, default: 'chart-1' },
  delta: Number,
  invert: Boolean,
  caption: { type: String, default: 'vs last month' },
  series: Array
})
</script>

<template>
  <Card content-class="p-4 sm:p-5">
    <!-- Phones: icon above the label, since 2-up cards are ~100px wide at 320px.
         Wider: icon beside the label. -->
    <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-2.5">
      <div
        class="grid size-8 shrink-0 place-items-center rounded-lg sm:size-9"
        :style="{ backgroundColor: `hsl(var(--${color}) / 0.12)`, color: `hsl(var(--${color}))` }"
      >
        <component :is="icon" class="size-4 sm:size-[18px]" />
      </div>
      <p class="min-w-0 max-w-full break-words text-sm font-medium leading-tight text-muted-foreground">{{ label }}</p>
    </div>
    <p class="mt-3 truncate text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">{{ value }}</p>
    <div v-if="delta != null || series" class="mt-4 flex items-end justify-between gap-3">
      <div v-if="delta != null" class="flex items-center gap-2 text-xs text-muted-foreground">
        <Delta :value="delta" :invert="invert" />
        <span>{{ caption }}</span>
      </div>
      <BaseChart
        v-if="series"
        variant="sparkline"
        :datasets="[{ data: series, color, fill: true }]"
        :label="`${label} trend`"
        class="h-10 w-24 shrink-0"
      />
    </div>
  </Card>
</template>
