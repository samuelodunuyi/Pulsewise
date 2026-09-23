<script setup>
import { icon } from '@/lib/icons'
import { formatRelativeDay } from '@/lib/utils'

// items: [{ title, description, date (ISO), icon, color }]
defineProps({ items: { type: Array, required: true } })
</script>

<template>
  <ol class="relative">
    <li v-for="(item, i) in items" :key="item.title" class="relative flex gap-4 pb-6 last:pb-0">
      <span
        v-if="i < items.length - 1"
        class="absolute left-[15px] top-9 h-[calc(100%-2.25rem)] w-px bg-border"
        aria-hidden="true"
      />
      <span
        class="relative grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-card"
        :style="{ backgroundColor: `hsl(var(--${item.color}) / 0.14)`, color: `hsl(var(--${item.color}))` }"
      >
        <component :is="icon(item.icon)" class="size-4" />
      </span>
      <div class="min-w-0 pt-1">
        <div class="flex flex-wrap items-baseline gap-x-2">
          <p class="text-sm font-medium">{{ item.title }}</p>
          <time class="text-xs text-muted-foreground">{{ formatRelativeDay(item.date) }}</time>
        </div>
        <p class="mt-1 text-sm text-muted-foreground">{{ item.description }}</p>
      </div>
    </li>
  </ol>
</template>
