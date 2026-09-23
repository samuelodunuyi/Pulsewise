<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  ArrowLeft,
  BedDouble,
  CalendarCheck,
  CalendarPlus,
  LogOut,
  Pencil,
  Pill,
  Plus,
  Receipt,
  Trash2,
  UserX,
  Wallet
} from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Avatar from '@/components/ui/Avatar.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import InfoList from '@/components/common/InfoList.vue'
import RowActions from '@/components/common/RowActions.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import AppointmentsTable from '@/components/appointments/AppointmentsTable.vue'
import InvoicesTable from '@/components/payments/InvoicesTable.vue'
import { useHospital, find, lookup, bedOf, invoiceStatus, dischargeFromBed } from '@/stores/hospital'
import { useFormDialog } from '@/composables/useFormDialog'
import { toast } from '@/composables/useToast'
import { ageFrom, cn, formatDate, formatMoney, formatRelativeDay, todayISO } from '@/lib/utils'

const route = useRoute()
const hospital = useHospital()
const { openForm, deleteRecord } = useFormDialog()

const patient = computed(() => find('patients', Number(route.params.id)))
const department = computed(() => lookup.department(patient.value?.departmentId))
const bed = computed(() => patient.value && bedOf(patient.value.id))

const mine = (collection) => hospital[collection].filter((row) => row.patientId === patient.value?.id)
const appointments = computed(() => mine('appointments').sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)))
const prescriptions = computed(() => mine('prescriptions').sort((a, b) => b.date.localeCompare(a.date)))
const invoices = computed(() => mine('invoices').sort((a, b) => b.issued.localeCompare(a.issued)))

const stats = computed(() => {
  const upcoming = appointments.value.filter((a) => a.date >= todayISO() && !['cancelled', 'completed'].includes(a.status))
  const balance = invoices.value.filter((i) => i.status === 'unpaid').reduce((sum, i) => sum + i.amount, 0)
  const overdue = invoices.value.some((i) => invoiceStatus(i) === 'overdue')
  const lastVisit = appointments.value.find((a) => a.status === 'completed')
  return [
    { label: 'Upcoming visits', value: String(upcoming.length), icon: CalendarCheck, color: 'chart-1' },
    { label: 'Prescriptions', value: String(prescriptions.value.length), icon: Pill, color: 'chart-5' },
    { label: overdue ? 'Balance (overdue)' : 'Balance due', value: formatMoney(balance), icon: Wallet, color: overdue ? 'chart-4' : 'chart-3' },
    { label: 'Last visit', value: lastVisit ? formatRelativeDay(lastVisit.date) : 'None yet', icon: CalendarPlus, color: 'chart-2' }
  ]
})

const contact = computed(() => [
  { label: 'Phone', value: patient.value.phone },
  { label: 'Email', value: patient.value.email },
  { label: 'Address', value: patient.value.address },
  { label: 'Born', value: formatDate(patient.value.dob) },
  { label: 'Registered', value: formatDate(patient.value.registered) }
])

const medical = computed(() => [
  { label: 'Condition', value: patient.value.condition },
  { label: 'Allergies', value: patient.value.allergies || 'None known', class: patient.value.allergies && 'font-medium text-destructive' },
  { label: 'Blood type', value: patient.value.bloodType },
  { label: 'Department', value: department.value?.name },
  { label: 'Bed', value: bed.value ? `${bed.value.label} (${department.value?.name})` : 'Not admitted' },
  { label: 'Notes', value: patient.value.notes }
])

const tab = ref('appointments')
const tabs = computed(() => [
  { value: 'appointments', label: 'Appointments', count: appointments.value.length },
  { value: 'prescriptions', label: 'Prescriptions', count: prescriptions.value.length },
  { value: 'invoices', label: 'Invoices', count: invoices.value.length }
])
const addFor = {
  appointments: { label: 'Book', form: 'appointment' },
  prescriptions: { label: 'Prescribe', form: 'prescription' },
  invoices: { label: 'Invoice', form: 'invoice' }
}
const addToTab = () =>
  openForm(addFor[tab.value].form, { initial: { patientId: patient.value.id, departmentId: patient.value.departmentId } })

function discharge() {
  dischargeFromBed(bed.value.id)
  toast({ title: 'Patient discharged', description: `${patient.value.name}'s bed is being cleaned.`, variant: 'success' })
}

const moreActions = computed(() => [
  { label: 'Write prescription', icon: Pill, onSelect: () => openForm('prescription', { initial: { patientId: patient.value.id } }) },
  { label: 'New invoice', icon: Receipt, onSelect: () => openForm('invoice', { initial: { patientId: patient.value.id } }) },
  bed.value
    ? { label: 'Discharge', icon: LogOut, onSelect: discharge }
    : { label: 'Admit to a bed', icon: BedDouble, onSelect: () => openForm('admitPatient', { patientId: patient.value.id }) },
  'separator',
  { label: 'Delete patient', icon: Trash2, destructive: true, onSelect: () => deleteRecord('patient', { id: patient.value.id }) }
])

const prescriptionActions = (p) => [
  { label: 'Edit', icon: Pencil, onSelect: () => openForm('prescription', { id: p.id }) },
  { label: 'Delete', icon: Trash2, destructive: true, onSelect: () => deleteRecord('prescription', { id: p.id }) }
]
</script>

<template>
  <div class="space-y-6">
    <Button variant="ghost" size="sm" class="-ml-3" as-child>
      <RouterLink to="/patients"><ArrowLeft /> All patients</RouterLink>
    </Button>

    <EmptyState v-if="!patient" :icon="UserX" title="Patient not found" description="This record may have been deleted.">
      <Button as-child><RouterLink to="/patients">Back to patients</RouterLink></Button>
    </EmptyState>

    <template v-else>
      <!-- Header -->
      <div class="flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center">
        <Avatar :src="patient.avatar" :name="patient.name" size="xl" class="ring-4 ring-primary/10" />
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-2xl font-semibold tracking-tight">{{ patient.name }}</h1>
            <StatusBadge :status="patient.status" />
            <Badge v-if="patient.bloodType" variant="outline">{{ patient.bloodType }}</Badge>
          </div>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ ageFrom(patient.dob) }} yrs · {{ patient.gender }} · {{ department?.name ?? 'No department' }}
            <template v-if="bed"> · Bed <span class="font-mono">{{ bed.label }}</span></template>
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <Button variant="outline" @click="openForm('patient', { id: patient.id })"><Pencil /> Edit</Button>
          <Button @click="openForm('appointment', { initial: { patientId: patient.id, departmentId: patient.departmentId } })">
            <CalendarPlus /> Book appointment
          </Button>
          <RowActions :items="moreActions" label="More patient actions" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard v-for="s in stats" :key="s.label" v-bind="s" />
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6">
          <Card title="Contact"><InfoList :items="contact" /></Card>
          <Card title="Medical"><InfoList :items="medical" /></Card>
        </div>

        <Card class="lg:col-span-2 lg:self-start" content-class="px-0 pb-2">
          <template #header>
            <div class="overflow-x-auto">
              <SegmentedControl v-model="tab" :options="tabs" label="Patient records" />
            </div>
          </template>
          <template #action>
            <Button size="sm" variant="soft" @click="addToTab"><Plus /> {{ addFor[tab].label }}</Button>
          </template>

          <AppointmentsTable v-if="tab === 'appointments'" :rows="appointments" hide-patient flush compact />
          <InvoicesTable v-else-if="tab === 'invoices'" :rows="invoices" hide-patient flush />
          <template v-else>
            <ul v-if="prescriptions.length" class="divide-y border-t">
              <li v-for="p in prescriptions" :key="p.id" class="flex items-start gap-3 px-5 py-3.5">
                <div class="grid size-9 shrink-0 place-items-center rounded-lg bg-chart-5/10 text-chart-5">
                  <Pill class="size-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium">{{ p.medication }}</p>
                  <p class="text-sm text-muted-foreground">
                    {{ p.dosage }}<template v-if="p.durationDays"> · {{ p.durationDays }} days</template>
                  </p>
                  <p class="mt-1 text-xs text-muted-foreground">
                    {{ lookup.doctor(p.doctorId)?.name }} · {{ formatRelativeDay(p.date) }}
                    <template v-if="p.notes"> · {{ p.notes }}</template>
                  </p>
                </div>
                <RowActions :items="prescriptionActions(p)" :label="`Actions for ${p.medication}`" />
              </li>
            </ul>
            <p v-else :class="cn('border-t py-12 text-center text-sm text-muted-foreground')">No prescriptions yet</p>
          </template>
        </Card>
      </div>
    </template>
  </div>
</template>
