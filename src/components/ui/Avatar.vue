<script setup>
import { AvatarRoot, AvatarImage, AvatarFallback } from 'radix-vue'
import { cn, initials } from '@/lib/utils'

const props = defineProps({
  src: String,
  name: { type: String, default: '' },
  size: { type: String, default: 'md' },
  class: { type: [String, Array, Object], default: '' }
})

const sizes = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-9 text-xs',
  lg: 'size-12 text-sm',
  xl: 'size-20 text-xl'
}
</script>

<template>
  <AvatarRoot
    :class="cn('relative inline-flex shrink-0 overflow-hidden rounded-full bg-muted', sizes[size], props.class)"
  >
    <AvatarImage v-if="src" :src="src" :alt="name" class="size-full object-cover" />
    <AvatarFallback
      class="flex size-full items-center justify-center bg-primary/10 font-semibold text-primary"
      :delay-ms="src ? 400 : 0"
    >
      {{ initials(name) }}
    </AvatarFallback>
  </AvatarRoot>
</template>
