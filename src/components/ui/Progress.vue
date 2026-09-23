<script setup>
defineProps({
  value: { type: Number, required: true }, // 0–100
  color: { type: String, default: 'primary' }, // any color token
  label: { type: String, default: 'Progress' }
})
</script>

<template>
  <div
    role="progressbar"
    :aria-label="label"
    :aria-valuenow="Math.round(value)"
    aria-valuemin="0"
    aria-valuemax="100"
    class="h-1.5 w-full overflow-hidden rounded-full bg-muted"
  >
    <div
      class="h-full rounded-full transition-[width] duration-500"
      :style="{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: `hsl(var(--${color}))` }"
    />
  </div>
</template>
