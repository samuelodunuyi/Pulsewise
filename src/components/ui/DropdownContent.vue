<script setup>
import { DropdownMenuPortal, DropdownMenuContent } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  align: { type: String, default: 'end' },
  class: { type: [String, Array, Object], default: '' }
})
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      :align="align"
      :side-offset="8"
      :collision-padding="12"
      :class="
        cn(
          'z-50 min-w-[12rem] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2',
          props.class
        )
      "
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
