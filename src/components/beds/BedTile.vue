<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { BedDouble, CheckCircle2, Eye, LogOut, Pencil, Sparkles, Trash2, UserPlus, Wrench } from 'lucide-vue-next'
import RowActions from '@/components/common/RowActions.vue'
import PatientLink from '@/components/common/PatientLink.vue'
import { lookup, update, dischargeFromBed } from '@/stores/hospital'
import { useFormDialog } from '@/composables/useFormDialog'
import { toast } from '@/composables/useToast'
import { statuses } from '@/config/status'
import { cn } from '@/lib/utils'

const props = defineProps({ bed: { type: Object, required: true } })

const router = useRouter()
const { openForm, deleteRecord } = useFormDialog()

const patient = computed(() => lookup.patient(props.bed.patientId))

const tones = {
  available: 'border-success/40 bg-success/5',
  occupied: 'border-primary/40 bg-primary/5',
  cleaning: 'border-warning/40 bg-warning/5',
  maintenance: 'border-destructive/30 bg-destructive/5'
}
const dots = { available: 'bg-success', occupied: 'bg-primary', cleaning: 'bg-warning', maintenance: 'bg-destructive' }

function setStatus(status) {
  update('beds', props.bed.id, { status })
  toast({ title: `${props.bed.label} → ${statuses[status].label}`, variant: 'success' })
}

function discharge() {
  const name = patient.value?.name
  dischargeFromBed(props.bed.id)
  toast({ title: 'Patient discharged', description: `${name} · ${props.bed.label} needs cleaning`, variant: 'success' })
}

const actions = computed(() => {
  const s = props.bed.status
  return [
    { label: 'Assign patient', icon: UserPlus, hidden: s !== 'available', onSelect: () => openForm('assignBed', { id: props.bed.id }) },
    { label: 'View patient', icon: Eye, hidden: s !== 'occupied', onSelect: () => router.push(`/patients/${props.bed.patientId}`) },
    { label: 'Discharge', icon: LogOut, hidden: s !== 'occupied', onSelect: discharge },
    { label: 'Mark available', icon: CheckCircle2, hidden: !['cleaning', 'maintenance'].includes(s), onSelect: () => setStatus('available') },
    { label: 'Needs cleaning', icon: Sparkles, hidden: s !== 'available', onSelect: () => setStatus('cleaning') },
    { label: 'Needs maintenance', icon: Wrench, hidden: s === 'occupied' || s === 'maintenance', onSelect: () => setStatus('maintenance') },
    { label: 'Edit', icon: Pencil, onSelect: () => openForm('bed', { id: props.bed.id }) },
    'separator',
    { label: 'Remove bed', icon: Trash2, destructive: true, disabled: s === 'occupied', onSelect: () => deleteRecord('bed', { id: props.bed.id }) }
  ]
})
</script>

<template>
  <div :class="cn('flex min-h-[7.5rem] flex-col rounded-lg border p-3 transition-colors', tones[bed.status])">
    <div class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-2">
        <BedDouble class="size-4 text-muted-foreground" />
        <span class="font-mono text-sm font-semibold">{{ bed.label }}</span>
      </div>
      <RowActions :items="actions" :label="`Actions for bed ${bed.label}`" class="-mr-1.5 -mt-1.5" />
    </div>
    <div class="mt-auto pt-3">
      <PatientLink v-if="patient" :patient="patient" size="xs" />
      <p v-else class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span :class="cn('size-1.5 rounded-full', dots[bed.status])" />
        {{ statuses[bed.status].label }}
      </p>
    </div>
  </div>
</template>
