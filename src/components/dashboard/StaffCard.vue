<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Avatar from '@/components/ui/Avatar.vue'
import { icon } from '@/lib/icons'
import { formatNumber } from '@/lib/utils'

const props = defineProps({
  counts: { type: Array, required: true }, // [{ label, value, icon, color }]
  doctors: { type: Array, required: true }
})

const onDuty = computed(() => props.doctors.filter((d) => d.available))
</script>

<template>
  <Card title="Hospital staff" description="Headcount across all departments">
    <div class="grid grid-cols-2 gap-3">
      <div v-for="item in counts" :key="item.label" class="rounded-lg border bg-muted/30 p-3">
        <div class="flex items-center gap-2 text-muted-foreground">
          <component :is="icon(item.icon)" class="size-4" :style="{ color: `hsl(var(--${item.color}))` }" />
          <span class="truncate text-xs font-medium">{{ item.label }}</span>
        </div>
        <p class="mt-1.5 text-xl font-semibold tabular-nums">{{ formatNumber(item.value) }}</p>
      </div>
    </div>

    <div class="mt-5 flex items-center justify-between gap-3">
      <div>
        <p class="text-sm font-medium">On duty now</p>
        <p class="text-xs text-muted-foreground">{{ onDuty.length }} doctors available</p>
      </div>
      <div class="flex -space-x-2">
        <Avatar
          v-for="doctor in onDuty"
          :key="doctor.id"
          :src="doctor.avatar"
          :name="doctor.name"
          size="sm"
          class="ring-2 ring-card"
        />
      </div>
    </div>

    <template #footer>
      <RouterLink to="/doctors" class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
        View all doctors <ArrowRight class="size-4" />
      </RouterLink>
    </template>
  </Card>
</template>
