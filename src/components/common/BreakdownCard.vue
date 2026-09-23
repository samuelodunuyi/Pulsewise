<script setup>
import { computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { formatCompact, formatNumber, formatMoney } from '@/lib/utils'

// Doughnut + legend showing how a total splits into parts. items: [{ label, value, color }]
const props = defineProps({
  title: { type: String, required: true },
  description: String,
  items: { type: Array, required: true },
  totalLabel: { type: String, default: 'Total' },
  currency: Boolean
})

const total = computed(() => props.items.reduce((sum, i) => sum + i.value, 0))
const datasets = computed(() => [
  { label: props.title, data: props.items.map((i) => i.value), colors: props.items.map((i) => i.color) }
])
const share = (value) => (total.value ? ((value / total.value) * 100).toFixed(1) : '0.0')
const format = (value) => (props.currency ? formatMoney(value) : formatNumber(value))
const compact = (value) => (props.currency ? `$${formatCompact(value)}` : formatCompact(value))
</script>

<template>
  <Card :title="title" :description="description">
    <div class="flex flex-col items-center gap-6 sm:flex-row lg:flex-col 2xl:flex-row">
      <div class="relative size-44 shrink-0">
        <BaseChart
          type="doughnut"
          :labels="items.map((i) => i.label)"
          :datasets="datasets"
          :label="`${title} breakdown`"
          class="size-full"
        />
        <div class="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p class="text-xl font-semibold tabular-nums">{{ compact(total) }}</p>
            <p class="text-xs text-muted-foreground">{{ totalLabel }}</p>
          </div>
        </div>
      </div>
      <ul class="w-full space-y-3">
        <li v-for="item in items" :key="item.label" class="flex items-center gap-3 text-sm">
          <span class="size-2.5 shrink-0 rounded-full" :style="{ backgroundColor: `hsl(var(--${item.color}))` }" />
          <span class="flex-1 text-muted-foreground">{{ item.label }}</span>
          <span class="font-medium tabular-nums">{{ format(item.value) }}</span>
          <span class="w-12 text-right text-xs tabular-nums text-muted-foreground">{{ share(item.value) }}%</span>
        </li>
      </ul>
    </div>
  </Card>
</template>
