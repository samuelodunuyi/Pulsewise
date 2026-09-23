<script setup>
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from 'radix-vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

defineProps({
  title: { type: String, required: true },
  description: String,
  contentClass: { type: [String, Array, Object], default: '' }
})
const open = defineModel('open', { type: Boolean, default: false })
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <!-- Content sits inside the overlay so it can centre and scroll on small screens. -->
      <DialogOverlay
        class="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      >
        <!-- Without a description, clear aria-describedby so radix doesn't point at a missing element (and warn). -->
        <DialogContent
          v-bind="description ? {} : { 'aria-describedby': '' }"
          :class="
            cn(
              'relative flex w-full max-w-lg flex-col overflow-hidden rounded-xl border bg-card shadow-2xl duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              contentClass
            )
          "
        >
          <div class="flex items-start gap-3 border-b px-6 py-4 pr-12">
            <div v-if="$slots.icon" class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <slot name="icon" />
            </div>
            <div class="space-y-1">
              <DialogTitle class="text-base font-semibold leading-tight">{{ title }}</DialogTitle>
              <DialogDescription v-if="description" class="text-sm text-muted-foreground">
                {{ description }}
              </DialogDescription>
            </div>
          </div>
          <div class="px-6 py-5">
            <slot />
          </div>
          <div
            v-if="$slots.footer"
            class="flex flex-col-reverse gap-2 border-t bg-muted/40 px-6 py-3.5 sm:flex-row sm:justify-end"
          >
            <slot name="footer" />
          </div>
          <DialogClose
            class="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X class="size-4" />
            <span class="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>
