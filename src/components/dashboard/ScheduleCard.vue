<script setup>
import { ref, computed } from 'vue'
import { CalendarX2 } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import MiniCalendar from '@/components/common/MiniCalendar.vue'
import PatientLink from '@/components/common/PatientLink.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { lookup } from '@/stores/hospital'
import { formatRelativeDay, formatTime, toISODate, today } from '@/lib/utils'

const props = defineProps({ appointments: { type: Array, required: true } })

const selected = ref(toISODate(today()))
const markers = computed(() => props.appointments.filter((a) => a.status !== 'cancelled').map((a) => a.date))
const dayAppointments = computed(() =>
  props.appointments.filter((a) => a.date === selected.value).sort((a, b) => a.time.localeCompare(b.time))
)
</script>

<template>
  <Card title="Schedule">
    <MiniCalendar v-model="selected" :markers="markers" />

    <div class="mt-5 border-t pt-4">
      <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {{ formatRelativeDay(selected) }} · {{ dayAppointments.length }} appointments
      </p>
      <ul v-if="dayAppointments.length" class="space-y-3">
        <li v-for="a in dayAppointments" :key="a.id" class="flex items-center gap-3">
          <span class="w-16 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">{{ formatTime(a.time) }}</span>
          <PatientLink :patient="lookup.patient(a.patientId)" :subtitle="lookup.doctor(a.doctorId)?.name" class="min-w-0 flex-1" />
          <StatusBadge :status="a.status" />
        </li>
      </ul>
      <div v-else class="flex flex-col items-center py-4 text-center text-sm text-muted-foreground">
        <CalendarX2 class="mb-2 size-5 opacity-60" />
        Nothing booked for this day
      </div>
    </div>
  </Card>
</template>
