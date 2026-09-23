<script setup>
import { ref, computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import Delta from '@/components/common/Delta.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { formatNumber } from '@/lib/utils'

const props = defineProps({ volume: { type: Object, required: true } })

const range = ref('12m')
const ranges = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '12m', label: '12M' }
]

const series = computed(() => props.volume[range.value])
const sum = (arr) => arr.reduce((a, b) => a + b, 0)
const total = computed(() => sum(series.value.current))
const change = computed(() => ((total.value - sum(series.value.previous)) / sum(series.value.previous)) * 100)

const datasets = computed(() => [
  { label: 'This period', data: series.value.current, color: 'chart-1', fill: true },
  { label: 'Previous period', data: series.value.previous, dashed: true }
])
</script>

<template>
  <Card>
    <template #header>
      <div>
        <h2 class="text-sm font-medium text-muted-foreground">Patient volume</h2>
        <div class="mt-1 flex items-center gap-2">
          <p class="text-2xl font-semibold tracking-tight tabular-nums">{{ formatNumber(total) }}</p>
          <Delta :value="change" />
        </div>
      </div>
    </template>
    <template #action>
      <SegmentedControl v-model="range" :options="ranges" label="Time range" />
    </template>

    <div class="mb-2 flex items-center gap-4 text-xs text-muted-foreground">
      <span class="flex items-center gap-1.5"><span class="h-0.5 w-3 rounded bg-chart-1" />This period</span>
      <span class="flex items-center gap-1.5"><span class="h-0 w-3 border-t border-dashed border-muted-foreground" />Previous period</span>
    </div>
    <BaseChart
      :labels="series.labels"
      :datasets="datasets"
      label="Patient volume compared with previous period"
      class="h-64 sm:h-72"
    />
  </Card>
</template>
