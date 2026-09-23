<script setup>
import { computed } from 'vue'
import { CheckCircle2, Pencil, RotateCcw, Trash2, Undo2 } from 'lucide-vue-next'
import DataTable from '@/components/common/DataTable.vue'
import PatientLink from '@/components/common/PatientLink.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import RowActions from '@/components/common/RowActions.vue'
import { lookup, update, invoiceStatus, invoiceNumber } from '@/stores/hospital'
import { useFormDialog } from '@/composables/useFormDialog'
import { toast } from '@/composables/useToast'
import { formatDate, formatMoney } from '@/lib/utils'

// Used by the Payments page and patient records.
const props = defineProps({
  rows: { type: Array, required: true },
  flush: Boolean,
  hidePatient: Boolean,
  searchable: Boolean
})

const { openForm, deleteRecord } = useFormDialog()

const enriched = computed(() =>
  props.rows.map((i) => {
    const patient = lookup.patient(i.patientId)
    return { ...i, patient, patientName: patient?.name ?? '', number: invoiceNumber(i), state: invoiceStatus(i) }
  })
)

const columns = computed(() => [
  { key: 'number', label: 'Invoice', sortable: true },
  ...(props.hidePatient ? [] : [{ key: 'patientName', label: 'Patient', sortable: true, class: 'hidden sm:table-cell' }]),
  { key: 'description', label: 'Description', class: props.hidePatient ? '' : 'hidden lg:table-cell' },
  { key: 'due', label: 'Due', sortable: true, class: 'hidden md:table-cell' },
  { key: 'amount', label: 'Amount', sortable: true, align: 'right' },
  { key: 'state', label: 'Status', sortable: true, class: 'hidden sm:table-cell' },
  { key: 'actions', label: '', align: 'right', class: 'w-12' }
])

function setStatus(row, status) {
  update('invoices', row.id, { status })
  toast({ title: `${row.number} marked ${status}`, description: formatMoney(row.amount), variant: 'success' })
}

const actions = (row) => [
  { label: 'Mark as paid', icon: CheckCircle2, hidden: row.status === 'paid', onSelect: () => setStatus(row, 'paid') },
  { label: 'Mark as unpaid', icon: RotateCcw, hidden: row.status === 'unpaid', onSelect: () => setStatus(row, 'unpaid') },
  { label: 'Refund', icon: Undo2, hidden: row.status !== 'paid', onSelect: () => setStatus(row, 'refunded') },
  { label: 'Edit', icon: Pencil, onSelect: () => openForm('invoice', { id: row.id }) },
  'separator',
  { label: 'Delete', icon: Trash2, destructive: true, onSelect: () => deleteRecord('invoice', { id: row.id }) }
]
</script>

<template>
  <DataTable
    :columns="columns"
    :rows="enriched"
    :flush="flush"
    :page-size="searchable ? 8 : 0"
    :search-keys="searchable ? ['number', 'patientName', 'description'] : []"
    search-placeholder="Search invoices"
    empty-text="No invoices"
  >
    <template #toolbar><slot name="toolbar" /></template>

    <template #cell-number="{ row }">
      <p class="font-mono text-xs font-medium">{{ row.number }}</p>
      <p :class="['text-xs text-muted-foreground', !hidePatient && 'hidden sm:block']">
        Issued {{ formatDate(row.issued, { month: 'short', day: 'numeric' }) }}
      </p>
      <!-- Phones: the patient column is hidden, so show the name here. -->
      <p v-if="!hidePatient" class="max-w-[10rem] truncate text-sm sm:hidden">{{ row.patientName }}</p>
    </template>
    <template #cell-patientName="{ row }"><PatientLink :patient="row.patient" /></template>
    <template #cell-description="{ value }">
      <span class="block max-w-[18rem] truncate text-muted-foreground">{{ value }}</span>
    </template>
    <template #cell-due="{ value }"><span class="text-muted-foreground">{{ formatDate(value) }}</span></template>
    <template #cell-amount="{ row }">
      <p class="font-medium tabular-nums">{{ formatMoney(row.amount) }}</p>
      <StatusBadge :status="row.state" class="mt-1 sm:hidden" />
    </template>
    <template #cell-state="{ value }"><StatusBadge :status="value" /></template>
    <template #cell-actions="{ row }">
      <RowActions :items="actions(row)" :label="`Actions for ${row.number}`" />
    </template>
  </DataTable>
</template>
