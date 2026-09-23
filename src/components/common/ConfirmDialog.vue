<script setup>
import { computed } from 'vue'
import { TriangleAlert } from 'lucide-vue-next'
import Dialog from '@/components/ui/Dialog.vue'
import Button from '@/components/ui/Button.vue'
import { useConfirm } from '@/composables/useConfirm'

const { request, settle } = useConfirm()

const open = computed({
  get: () => request.open,
  set: (value) => !value && settle(false)
})
</script>

<template>
  <Dialog v-model:open="open" :title="request.title" :description="request.description">
    <template #icon><TriangleAlert class="size-4 text-destructive" /></template>
    <p class="text-sm text-muted-foreground">This can't be undone.</p>
    <template #footer>
      <Button variant="outline" @click="settle(false)">Cancel</Button>
      <Button variant="destructive" @click="settle(true)">{{ request.confirmLabel }}</Button>
    </template>
  </Dialog>
</template>
