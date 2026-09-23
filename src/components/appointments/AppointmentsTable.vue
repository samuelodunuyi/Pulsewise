<script setup>
import { computed } from 'vue'
import { CheckCircle2, CircleCheckBig, Pencil, Trash2, XCircle } from 'lucide-vue-next'
import DataTable from '@/components/common/DataTable.vue'
import PatientLink from '@/components/common/PatientLink.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import RowActions from '@/components/common/RowActions.vue'
import { lookup, setAppointmentStatus } from '@/stores/hospital'
import { useFormDialog } from '@/composables/useFormDialog'
import { toast } from '@/composables/useToast'
import { formatRelativeDay, formatTime } from '@/lib/utils'

// Used by the dashboard (compact), the Appointments page and patient records.
const props = defineProps({
  rows: { type: Array, required: true },
  compact: Boolean,
  flush: Boolean,
  hidePatient: Boolean
})

const { openForm, deleteRecord } = useFormDialog()

// Resolve IDs once so search and sort work on names.
const enriched = computed(() =>
  props.rows.map((a) => {
    const patient = lookup.patient(a.patientId)
    const doctor = lookup.doctor(a.doctorId)
    return {
      ...a,
      patient,
      doctor,
      patientName: patient?.name ?? '',
      doctorName: doctor?.name ?? '',
      departmentName: lookup.department(doctor?.departmentId)?.name ?? ''
    }
  })
)

const columns = computed(() => [
  ...(props.hidePatient ? [] : [{ key: 'patientName', label: 'Patient', sortable: !props.compact }]),
  { key: 'doctorName', label: 'Doctor', sortable: !props.compact, class: props.hidePatient ? '' : 'hidden md:table-cell' },
  { key: 'date', label: 'When', sortable: !props.compact, sortValue: (r) => `${r.date} ${r.time}` },
  ...(props.compact ? [] : [{ key: 'reason', label: 'Reason', class: 'hidden xl:table-cell' }]),
  { key: 'status', label: 'Status', sortable: !props.compact, class: 'hidden sm:table-cell' },
  { key: 'actions', label: '', align: 'right', class: 'w-12' }
])

function setStatus(row, status) {
  setAppointmentStatus(row.id, status)
  toast({
    title: `Appointment ${status}`,
    description: `${row.patientName} · ${formatRelativeDay(row.date)} at ${formatTime(row.time)}`,
    variant: status === 'cancelled' ? 'destructive' : 'success'
  })
}

const actions = (row) => [
  { label: 'Confirm', icon: CheckCircle2, disabled: row.status === 'confirmed', onSelect: () => setStatus(row, 'confirmed') },
  { label: 'Mark completed', icon: CircleCheckBig, disabled: row.status === 'completed', onSelect: () => setStatus(row, 'completed') },
  { label: 'Edit', icon: Pencil, onSelect: () => openForm('appointment', { id: row.id }) },
  'separator',
  { label: 'Cancel', icon: XCircle, destructive: true, disabled: row.status === 'cancelled', onSelect: () => setStatus(row, 'cancelled') },
  { label: 'Delete', icon: Trash2, destructive: true, onSelect: () => deleteRecord('appointment', { id: row.id }) }
]
</script>

<template>
  <DataTable
    :columns="columns"
    :rows="enriched"
    :flush="flush"
    :page-size="compact ? 0 : 8"
    :search-keys="compact ? [] : ['patientName', 'doctorName', 'departmentName', 'reason']"
    search-placeholder="Search patient, doctor or department"
    empty-text="No appointments"
  >
    <template #toolbar><slot name="toolbar" /></template>

    <template #cell-patientName="{ row }">
      <PatientLink :patient="row.patient" :subtitle="row.departmentName" />
    </template>
    <template #cell-doctorName="{ row }">
      <p>{{ row.doctorName }}</p>
      <p v-if="hidePatient" class="text-xs text-muted-foreground">{{ row.departmentName }}</p>
    </template>
    <template #cell-date="{ row }">
      <p class="font-medium">{{ formatRelativeDay(row.date) }}</p>
      <p class="text-xs text-muted-foreground">{{ formatTime(row.time) }}</p>
    </template>
    <template #cell-reason="{ value }">
      <span class="block max-w-[16rem] truncate text-muted-foreground">{{ value || '—' }}</span>
    </template>
    <template #cell-status="{ value }">
      <StatusBadge :status="value" />
    </template>
    <template #cell-actions="{ row }">
      <RowActions :items="actions(row)" :label="`Actions for ${row.patientName}'s appointment`" />
    </template>
  </DataTable>
</template>
