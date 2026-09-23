<script setup>
import { HeartPulse } from 'lucide-vue-next'
import { APP_NAME } from '@/config/brand'
import { cn } from '@/lib/utils'

defineProps({
  // 'sidebar' sits on the dark navy panels, 'default' on the page background.
  tone: { type: String, default: 'default' },
  showName: { type: Boolean, default: true }
})
</script>

<template>
  <span class="flex items-center gap-2.5">
    <span
      :class="
        cn(
          'grid size-8 shrink-0 place-items-center rounded-lg shadow-sm',
          tone === 'sidebar' ? 'bg-sidebar-primary text-sidebar' : 'bg-primary text-primary-foreground'
        )
      "
    >
      <HeartPulse class="size-[18px]" stroke-width="2.5" />
    </span>
    <span
      v-if="showName"
      :class="cn('text-[17px] font-semibold tracking-tight', tone === 'sidebar' ? 'text-white' : 'text-foreground')"
    >
      {{ APP_NAME }}
    </span>
  </span>
</template>
