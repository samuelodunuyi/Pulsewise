<script setup>
import { Star } from 'lucide-vue-next'
import Avatar from '@/components/ui/Avatar.vue'
import Badge from '@/components/ui/Badge.vue'
import TeamButton from './TeamButton.vue'
import { formatCompact } from '@/lib/utils'

defineProps({ doctor: { type: Object, required: true } })
</script>

<template>
  <article class="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
    <div class="h-20 bg-gradient-to-br from-primary/80 via-primary/50 to-chart-2/40" />
    <div class="-mt-10 flex flex-1 flex-col px-5 pb-5">
      <div class="flex items-end justify-between">
        <Avatar :src="doctor.avatar" :name="doctor.name" size="xl" class="ring-4 ring-card" />
        <Badge :variant="doctor.available ? 'success' : 'secondary'" dot>
          {{ doctor.available ? 'Available' : 'In surgery' }}
        </Badge>
      </div>
      <h3 class="mt-3 font-semibold">{{ doctor.name }}</h3>
      <p class="text-sm text-muted-foreground">{{ doctor.specialty }} · {{ doctor.qualifications }}</p>
      <p class="mt-3 line-clamp-2 flex-1 text-sm text-muted-foreground">{{ doctor.bio }}</p>

      <dl class="mt-4 grid grid-cols-3 divide-x rounded-lg border bg-muted/40 py-2.5 text-center">
        <div>
          <dt class="text-[11px] text-muted-foreground">Operations</dt>
          <dd class="font-semibold tabular-nums">{{ formatCompact(doctor.operations) }}</dd>
        </div>
        <div>
          <dt class="text-[11px] text-muted-foreground">Patients</dt>
          <dd class="font-semibold tabular-nums">{{ formatCompact(doctor.patients) }}</dd>
        </div>
        <div>
          <dt class="text-[11px] text-muted-foreground">Rating</dt>
          <dd class="flex items-center justify-center gap-1 font-semibold tabular-nums">
            <Star class="size-3.5 fill-chart-3 text-chart-3" />{{ doctor.rating }}
          </dd>
        </div>
      </dl>
      <TeamButton :doctor="doctor" class="mt-4 w-full" />
    </div>
  </article>
</template>
