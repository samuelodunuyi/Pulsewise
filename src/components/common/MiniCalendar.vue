<script setup>
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { cn, parseDate, toISODate, today } from '@/lib/utils'

const props = defineProps({
  markers: { type: Array, default: () => [] } // ISO dates that have events
})
const selected = defineModel({ type: String, required: true })

const view = ref(parseDate(selected.value))
view.value.setDate(1)

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const todayISO = toISODate(today())
const marked = computed(() => new Set(props.markers))

const monthLabel = computed(() => view.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))

const days = computed(() => {
  const year = view.value.getFullYear()
  const month = view.value.getMonth()
  const start = new Date(year, month, 1 - new Date(year, month, 1).getDay())
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    const iso = toISODate(date)
    return {
      iso,
      day: date.getDate(),
      inMonth: date.getMonth() === month,
      label: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    }
  })
})

function shift(months) {
  view.value = new Date(view.value.getFullYear(), view.value.getMonth() + months, 1)
}
</script>

<template>
  <div>
    <div class="mb-3 flex items-center justify-between">
      <p class="text-sm font-semibold">{{ monthLabel }}</p>
      <div class="flex gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Previous month" @click="shift(-1)"><ChevronLeft /></Button>
        <Button variant="ghost" size="icon-sm" aria-label="Next month" @click="shift(1)"><ChevronRight /></Button>
      </div>
    </div>
    <div class="grid grid-cols-7 gap-y-1 text-center">
      <span v-for="w in weekdays" :key="w" class="pb-1 text-[11px] font-medium text-muted-foreground">{{ w }}</span>
      <button
        v-for="d in days"
        :key="d.iso"
        type="button"
        :aria-label="d.label"
        :aria-pressed="d.iso === selected"
        :class="
          cn(
            'relative mx-auto grid size-9 place-items-center rounded-lg text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            !d.inMonth && 'text-muted-foreground/40',
            d.iso === selected
              ? 'bg-primary font-semibold text-primary-foreground'
              : 'hover:bg-muted',
            d.iso === todayISO && d.iso !== selected && 'font-semibold text-primary ring-1 ring-inset ring-primary/40'
          )
        "
        @click="selected = d.iso"
      >
        {{ d.day }}
        <span
          v-if="marked.has(d.iso)"
          :class="cn('absolute bottom-1 size-1 rounded-full', d.iso === selected ? 'bg-primary-foreground' : 'bg-primary')"
        />
      </button>
    </div>
  </div>
</template>
