<script setup>
import { RouterLink, useRoute } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const route = useRoute()
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="route.meta.title" :description="route.meta.description" />
    <EmptyState
      :icon="route.meta.icon"
      :title="`${route.meta.title} is coming soon`"
      description="This module isn't wired up in the demo yet. Explore the dashboard, appointments, patients, doctors and reports in the meantime."
    >
      <Button as-child><RouterLink to="/">Back to dashboard</RouterLink></Button>
    </EmptyState>
  </div>
</template>
