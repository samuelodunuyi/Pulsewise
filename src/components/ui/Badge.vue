<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const props = defineProps({
  variant: { type: String, default: 'default' },
  dot: Boolean,
  class: { type: [String, Array, Object], default: '' }
})

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary ring-primary/20',
        secondary: 'bg-muted text-muted-foreground ring-border',
        success: 'bg-success/10 text-success ring-success/20',
        warning: 'bg-warning/10 text-warning ring-warning/25',
        destructive: 'bg-destructive/10 text-destructive ring-destructive/20',
        outline: 'text-foreground ring-border'
      }
    }
  }
)
</script>

<template>
  <span :class="cn(badgeVariants({ variant }), props.class)">
    <span v-if="dot" class="size-1.5 rounded-full bg-current" aria-hidden="true" />
    <slot />
  </span>
</template>
