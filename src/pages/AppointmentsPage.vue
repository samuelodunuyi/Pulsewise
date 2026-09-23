<script setup>
import { ref, computed } from 'vue'
import { CalendarCheck, CalendarClock, CalendarPlus, CalendarX2, CircleCheckBig } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import AppointmentsTable from '@/components/appointments/AppointmentsTable.vue'
import { useHospital } from '@/stores/hospital'
import { useFormDialog } from '@/composables/useFormDialog'

const hospital = useHospital()
const { openForm } = useFormDialog()

const count = (status) => hospital.appointments.filter((a) => a.status === status).length

const summary = computed(() => [
  { label: 'Confirmed', value: count('confirmed'), icon: CalendarCheck, color: 'chart-1' },
  { label: 'Pending', value: count('pending'), icon: CalendarClock, color: 'chart-3' },
  { label: 'Completed', value: count('completed'), icon: CircleCheckBig, color: 'chart-2' },
  { label: 'Cancelled', value: count('cancelled'), icon: CalendarX2, color: 'chart-4' }
])

const status = ref('all')
const filters = computed(() => [
  { value: 'all', label: 'All', count: hospital.appointments.length },
  ...summary.value.map((s) => ({ value: s.label.toLowerCase(), label: s.label, count: s.value }))
])

const rows = computed(() =>
  status.value === 'all' ? hospital.appointments : hospital.appointments.filter((a) => a.status === status.value)
)
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Appointments" description="Review, confirm and manage patient bookings.">
      <Button @click="openForm('appointment')"><CalendarPlus /> New appointment</Button>
    </PageHeader>

    <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard v-for="s in summary" :key="s.label" :label="s.label" :value="String(s.value)" :icon="s.icon" :color="s.color" />
    </div>

    <Card content-class="px-0">
      <AppointmentsTable :rows="rows" flush>
        <template #toolbar>
          <div class="overflow-x-auto">
            <SegmentedControl v-model="status" :options="filters" label="Filter by status" />
          </div>
        </template>
      </AppointmentsTable>
    </Card>
  </div>
</template>
