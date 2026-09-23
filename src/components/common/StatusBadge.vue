<script setup>
import { computed } from 'vue'
import Badge from '@/components/ui/Badge.vue'
import { statuses } from '@/config/status'

const props = defineProps({ status: { type: String, required: true } })
const meta = computed(() => statuses[props.status] ?? { label: props.status, variant: 'secondary' })
</script>

<template>
  <Badge :variant="meta.variant" dot>{{ meta.label }}</Badge>
</template>
