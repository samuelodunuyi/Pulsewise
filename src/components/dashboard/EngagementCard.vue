<script setup>
import { ref, computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import Select from '@/components/ui/Select.vue'
import Delta from '@/components/common/Delta.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const props = defineProps({
  engagement: { type: Object, required: true }, // { labels, rows: [{ label, value, previous, color, series }] }
  doctors: { type: Array, required: true }
})

const doctorId = ref(props.doctors[0]?.id)

// Mock per-doctor variation so switching doctors visibly changes the numbers.
const factor = computed(() => 0.82 + ((doctorId.value * 7) % 5) * 0.07)
const rows = computed(() =>
  props.engagement.rows.map((row) => {
    const value = +(row.value * factor.value).toFixed(1)
    return {
      ...row,
      value,
      delta: ((value - row.previous) / row.previous) * 100,
      series: row.series.map((v) => v * factor.value)
    }
  })
)
</script>

<template>
  <Card title="Doctor engagement" description="Share of booked slots attended, this week">
    <Select
      v-model.number="doctorId"
      :options="doctors.map((d) => ({ value: d.id, label: d.name }))"
      aria-label="Doctor"
      class="mb-5"
    />
    <div class="divide-y">
      <div v-for="row in rows" :key="row.label" class="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
        <div class="min-w-0 flex-1">
          <p class="text-sm text-muted-foreground">{{ row.label }}</p>
          <div class="mt-1 flex items-center gap-2">
            <p class="text-xl font-semibold tabular-nums">{{ row.value }}%</p>
            <Delta :value="row.delta" />
          </div>
          <p class="mt-0.5 text-xs text-muted-foreground">vs {{ row.previous }}% last week</p>
        </div>
        <BaseChart
          variant="sparkline"
          :labels="engagement.labels"
          :datasets="[{ data: row.series, color: row.color, fill: true }]"
          :label="`${row.label} trend`"
          class="h-14 w-28 shrink-0 sm:w-36"
        />
      </div>
    </div>
  </Card>
</template>
