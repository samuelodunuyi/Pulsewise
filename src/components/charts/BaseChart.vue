<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  Chart,
  buildDataset,
  cartesianOptions,
  doughnutOptions,
  sparklineOptions,
  merge
} from '@/lib/chart'
import { useTheme } from '@/composables/useTheme'

/**
 * The only Chart.js wrapper in the app. Callers pass theme-agnostic data
 * (datasets reference color tokens like "chart-1"); colors are resolved here
 * and re-resolved whenever the theme changes.
 */
const props = defineProps({
  type: { type: String, default: 'line' },
  labels: { type: Array, default: () => [] },
  datasets: { type: Array, required: true },
  variant: { type: String, default: 'default' }, // 'default' | 'sparkline'
  legend: Boolean,
  stacked: Boolean,
  options: { type: Object, default: () => ({}) },
  label: { type: String, default: 'Chart' }
})

const canvas = ref(null)
const { isDark } = useTheme()
let chart = null

function config() {
  const sparkline = props.variant === 'sparkline'
  const base =
    props.type === 'doughnut'
      ? doughnutOptions()
      : sparkline
        ? sparklineOptions()
        : cartesianOptions({ legend: props.legend, stacked: props.stacked })

  const datasets = props.datasets.map((d) => buildDataset(props.type, d, { sparkline }))
  // Stacked bars read as one column: round only the top of the top segment.
  if (props.stacked && props.type === 'bar') {
    datasets.forEach((d, i) => (d.borderRadius = i === datasets.length - 1 ? { topLeft: 6, topRight: 6 } : 0))
  }

  return {
    data: {
      labels: props.labels.length ? props.labels : props.datasets[0]?.data.map((_, i) => i),
      datasets
    },
    options: merge(base, props.options)
  }
}

function render() {
  if (!canvas.value) return
  const { data, options } = config()
  if (chart && chart.config.type === props.type) {
    chart.data = data
    chart.options = options
    chart.update()
  } else {
    chart?.destroy()
    chart = new Chart(canvas.value, { type: props.type, data, options })
  }
}

onMounted(() => {
  render()
  // Legend and tick widths are measured with the web font; re-measure once it has loaded,
  // otherwise legend items that don't fit the fallback font's widths get dropped.
  document.fonts?.ready.then(() => chart?.update('none'))
})
watch(() => [props.type, props.labels, props.datasets, props.options, isDark.value], render, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <div class="relative min-w-0">
    <canvas ref="canvas" role="img" :aria-label="label" />
  </div>
</template>
