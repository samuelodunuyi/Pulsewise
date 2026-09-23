<script setup>
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

// Native <select> styled to match — keeps the OS picker on mobile.
defineOptions({ inheritAttrs: false })

const props = defineProps({
  options: { type: Array, default: () => [] },
  placeholder: String,
  class: { type: [String, Array, Object], default: '' }
})
const model = defineModel({ type: [String, Number], default: '' })

const normalize = (opt) => (typeof opt === 'object' ? opt : { value: opt, label: opt })
</script>

<template>
  <div :class="cn('relative', props.class)">
    <select
      v-model="model"
      v-bind="$attrs"
      :class="
        cn(
          'h-9 w-full appearance-none rounded-lg border border-input bg-card pl-3 pr-9 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 aria-[invalid=true]:border-destructive',
          model === '' && 'text-muted-foreground'
        )
      "
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options.map(normalize)" :key="opt.value" :value="opt.value" class="text-foreground">
        {{ opt.label }}
      </option>
    </select>
    <ChevronDown class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
  </div>
</template>
