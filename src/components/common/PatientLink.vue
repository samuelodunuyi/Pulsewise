<script setup>
import { RouterLink } from 'vue-router'
import UserChip from './UserChip.vue'

// A patient's avatar + name that links to their record.
defineProps({
  patient: { type: Object, default: null },
  subtitle: String,
  size: { type: String, default: 'sm' }
})
</script>

<template>
  <RouterLink
    v-if="patient"
    :to="`/patients/${patient.id}`"
    class="-m-1 inline-flex max-w-full rounded-md p-1 hover:[&_p:first-child]:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <UserChip :name="patient.name" :src="patient.avatar" :subtitle="subtitle" :size="size" />
  </RouterLink>
  <span v-else class="text-sm text-muted-foreground">Deleted patient</span>
</template>
