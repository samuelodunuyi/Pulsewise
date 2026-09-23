<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { CalendarPlus, Eye, Pencil, Trash2 } from 'lucide-vue-next'
import DataTable from '@/components/common/DataTable.vue'
import PatientLink from '@/components/common/PatientLink.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import RowActions from '@/components/common/RowActions.vue'
import { lookup, bedOf } from '@/stores/hospital'
import { useFormDialog } from '@/composables/useFormDialog'
import { ageFrom, formatRelativeDay } from '@/lib/utils'

// Used by the dashboard (compact) and the Patients page (full).
const props = defineProps({
  rows: { type: Array, required: true },
  compact: Boolean,
  flush: Boolean,
  initialSearch: { type: String, default: '' }
})

const router = useRouter()
const { openForm, deleteRecord } = useFormDialog()

const enriched = computed(() =>
  props.rows.map((p) => ({
    ...p,
    age: ageFrom(p.dob),
    departmentName: lookup.department(p.departmentId)?.name ?? '—',
    bed: bedOf(p.id)?.label ?? ''
  }))
)

const columns = computed(() => [
  { key: 'name', label: 'Patient', sortable: !props.compact },
  { key: 'condition', label: 'Condition', sortable: !props.compact, class: 'hidden sm:table-cell' },
  ...(props.compact ? [] : [{ key: 'age', label: 'Age', sortable: true, align: 'right', class: 'hidden lg:table-cell' }]),
  { key: 'departmentName', label: 'Department', sortable: !props.compact, class: 'hidden md:table-cell' },
  ...(props.compact ? [] : [{ key: 'bed', label: 'Bed', sortable: true, class: 'hidden xl:table-cell' }]),
  { key: 'registered', label: 'Registered', sortable: !props.compact, class: 'hidden lg:table-cell' },
  { key: 'status', label: 'Status', sortable: !props.compact },
  { key: 'actions', label: '', align: 'right', class: 'w-12' }
])

const actions = (row) => [
  { label: 'View record', icon: Eye, onSelect: () => router.push(`/patients/${row.id}`) },
  { label: 'Edit', icon: Pencil, onSelect: () => openForm('patient', { id: row.id }) },
  { label: 'Book appointment', icon: CalendarPlus, onSelect: () => openForm('appointment', { initial: { patientId: row.id, departmentId: row.departmentId } }) },
  'separator',
  { label: 'Delete', icon: Trash2, destructive: true, onSelect: () => deleteRecord('patient', { id: row.id }) }
]
</script>

<template>
  <DataTable
    :columns="columns"
    :rows="enriched"
    :flush="flush"
    :page-size="compact ? 0 : 8"
    :search-keys="compact ? [] : ['name', 'email', 'condition', 'departmentName', 'phone']"
    :initial-search="initialSearch"
    :row-to="(row) => `/patients/${row.id}`"
    search-placeholder="Search name, email, condition or department"
    empty-text="No patients match"
  >
    <template #toolbar><slot name="toolbar" /></template>

    <template #cell-name="{ row }">
      <PatientLink :patient="row" :subtitle="row.email" />
    </template>
    <template #cell-age="{ value }"><span class="tabular-nums">{{ value }}</span></template>
    <template #cell-departmentName="{ value }"><span class="text-muted-foreground">{{ value }}</span></template>
    <template #cell-bed="{ value }"><span class="font-mono text-xs">{{ value || '—' }}</span></template>
    <template #cell-registered="{ value }"><span class="text-muted-foreground">{{ formatRelativeDay(value) }}</span></template>
    <template #cell-status="{ value }"><StatusBadge :status="value" /></template>
    <template #cell-actions="{ row }">
      <RowActions :items="actions(row)" :label="`Actions for ${row.name}`" />
    </template>
  </DataTable>
</template>
