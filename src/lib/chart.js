import {
  Chart,
  LineController,
  BarController,
  DoughnutController,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  LineController,
  BarController,
  DoughnutController,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend
)

Chart.defaults.font.family = "Inter, ui-sans-serif, system-ui, sans-serif"

/** Resolve a design token (e.g. "chart-1") into a Chart.js-ready color string. */
export function token(name, alpha = 1) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
  return alpha === 1 ? `hsl(${value})` : `hsl(${value} / ${alpha})`
}

/** Vertical gradient fill for area charts; scriptable so it follows the chart's size. */
export const areaGradient = (color, top = 0.28, bottom = 0) => (ctx) => {
  const { chartArea, ctx: canvas } = ctx.chart
  if (!chartArea) return token(color, top / 2)
  const gradient = canvas.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
  gradient.addColorStop(0, token(color, top))
  gradient.addColorStop(1, token(color, bottom))
  return gradient
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

export function merge(target, source = {}) {
  const out = { ...target }
  for (const [key, value] of Object.entries(source)) {
    out[key] = isObject(value) && isObject(target[key]) ? merge(target[key], value) : value
  }
  return out
}

function tooltip() {
  return {
    backgroundColor: token('popover'),
    titleColor: token('foreground'),
    bodyColor: token('muted-foreground'),
    borderColor: token('border'),
    borderWidth: 1,
    padding: 10,
    cornerRadius: 8,
    boxPadding: 4,
    usePointStyle: true,
    titleFont: { weight: '600' }
  }
}

function legend(display) {
  return {
    display,
    position: 'top',
    align: 'end',
    labels: {
      color: token('muted-foreground'),
      usePointStyle: true,
      pointStyle: 'circle',
      boxWidth: 6,
      boxHeight: 6,
      padding: 16,
      font: { size: 12 }
    }
  }
}

export function cartesianOptions({ legend: showLegend = false, stacked = false } = {}) {
  const ticks = { color: token('muted-foreground'), font: { size: 11 }, padding: 8 }
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: legend(showLegend), tooltip: tooltip() },
    scales: {
      x: { stacked, grid: { display: false }, border: { display: false }, ticks },
      y: {
        stacked,
        beginAtZero: true,
        grid: { color: token('border'), drawTicks: false },
        border: { display: false },
        ticks: { ...ticks, maxTicksLimit: 5, callback: (v) => Intl.NumberFormat('en-US', { notation: 'compact' }).format(v) }
      }
    }
  }
}

export function sparklineOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 700 },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false, grace: '10%' } },
    elements: { point: { radius: 0 } }
  }
}

export function doughnutOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '74%',
    plugins: { legend: { display: false }, tooltip: tooltip() }
  }
}

/**
 * Turn a theme-agnostic dataset spec into Chart.js datasets.
 * Spec: { label, data, color: 'chart-1', fill?, dashed?, colors?: [...] }
 */
export function buildDataset(type, spec, { sparkline = false } = {}) {
  const { color = 'chart-1', fill = false, dashed = false, colors, ...spread } = spec
  // Copy data: Chart.js patches the arrays it receives, which must not be our reactive state.
  const rest = { ...spread, data: [...spread.data] }

  if (type === 'doughnut') {
    return {
      ...rest,
      backgroundColor: colors.map((c) => token(c)),
      hoverBackgroundColor: colors.map((c) => token(c, 0.85)),
      borderColor: token('card'),
      borderWidth: 3,
      borderRadius: 4,
      spacing: 1
    }
  }

  if (type === 'bar') {
    return {
      ...rest,
      backgroundColor: token(color),
      hoverBackgroundColor: token(color, 0.8),
      borderRadius: 6,
      borderSkipped: false,
      maxBarThickness: 16,
      categoryPercentage: 0.6,
      barPercentage: 0.85
    }
  }

  return {
    ...rest,
    borderColor: dashed ? token('muted-foreground', 0.5) : token(color),
    backgroundColor: fill ? areaGradient(color, sparkline ? 0.22 : 0.28) : token(color),
    fill,
    tension: 0.4,
    borderWidth: sparkline ? 1.75 : 2,
    borderDash: dashed ? [5, 5] : undefined,
    pointRadius: 0,
    pointHoverRadius: sparkline ? 0 : 4,
    pointHoverBorderWidth: 2,
    pointHoverBackgroundColor: token('card'),
    pointHoverBorderColor: token(color)
  }
}

export { Chart }
