<script setup>
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuSeparator } from 'radix-vue'
import { MoreHorizontal } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import DropdownContent from '@/components/ui/DropdownContent.vue'
import DropdownItem from '@/components/ui/DropdownItem.vue'

/**
 * The "…" menu used on every table row and card.
 * items: [{ label, icon, onSelect, destructive?, disabled?, hidden? } | 'separator']
 */
defineProps({
  items: { type: Array, required: true },
  label: { type: String, default: 'Actions' }
})
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon-sm" :aria-label="label">
        <MoreHorizontal />
      </Button>
    </DropdownMenuTrigger>
    <DropdownContent class="min-w-[11rem]">
      <template v-for="(item, i) in items" :key="i">
        <DropdownMenuSeparator v-if="item === 'separator'" class="-mx-1 my-1 h-px bg-border" />
        <DropdownItem
          v-else-if="!item.hidden"
          :destructive="item.destructive"
          :disabled="item.disabled"
          @select="item.onSelect"
        >
          <component :is="item.icon" v-if="item.icon" /> {{ item.label }}
        </DropdownItem>
      </template>
    </DropdownContent>
  </DropdownMenuRoot>
</template>
