<script setup>
import { computed } from 'vue'
import { MapPin, Pencil, Phone, Plus, Trash2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Progress from '@/components/ui/Progress.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import UserChip from '@/components/common/UserChip.vue'
import RowActions from '@/components/common/RowActions.vue'
import { useHospital, lookup } from '@/stores/hospital'
import { useFormDialog } from '@/composables/useFormDialog'
import { todayISO } from '@/lib/utils'

const hospital = useHospital()
const { openForm, deleteRecord } = useFormDialog()

const departments = computed(() =>
  hospital.departments.map((d) => {
    const doctorIds = new Set(hospital.doctors.filter((doc) => doc.departmentId === d.id).map((doc) => doc.id))
    const beds = hospital.beds.filter((b) => b.departmentId === d.id)
    const occupied = beds.filter((b) => b.status === 'occupied').length
    return {
      ...d,
      head: lookup.doctor(d.headDoctorId),
      stats: [
        { label: 'Doctors', value: doctorIds.size },
        { label: 'Patients', value: hospital.patients.filter((p) => p.departmentId === d.id).length },
        {
          label: 'Upcoming',
          value: hospital.appointments.filter((a) => doctorIds.has(a.doctorId) && a.date >= todayISO() && a.status !== 'cancelled').length
        }
      ],
      beds: beds.length,
      occupied,
      occupancy: beds.length ? (occupied / beds.length) * 100 : 0
    }
  })
)

const actions = (d) => [
  { label: 'Edit', icon: Pencil, onSelect: () => openForm('department', { id: d.id }) },
  { label: 'Delete', icon: Trash2, destructive: true, onSelect: () => deleteRecord('department', { id: d.id }) }
]
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Departments" :description="`${departments.length} departments and wards.`">
      <Button @click="openForm('department')"><Plus /> Add department</Button>
    </PageHeader>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="d in departments"
        :key="d.id"
        class="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
      >
        <div class="h-1" :style="{ backgroundColor: `hsl(var(--${d.color}))` }" />
        <div class="flex flex-1 flex-col p-5">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h2 class="font-semibold">{{ d.name }}</h2>
              <p class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span v-if="d.location" class="inline-flex items-center gap-1"><MapPin class="size-3.5" />{{ d.location }}</span>
                <span v-if="d.phone" class="inline-flex items-center gap-1"><Phone class="size-3.5" />{{ d.phone }}</span>
              </p>
            </div>
            <RowActions :items="actions(d)" :label="`Actions for ${d.name}`" />
          </div>
          <p v-if="d.description" class="mt-3 flex-1 text-sm text-muted-foreground">{{ d.description }}</p>

          <div class="mt-4 rounded-lg border bg-muted/30 p-3">
            <p class="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Head of department</p>
            <UserChip v-if="d.head" :name="d.head.name" :subtitle="d.head.specialty" :src="d.head.avatar" size="sm" />
            <p v-else class="text-sm text-muted-foreground">Not assigned</p>
          </div>

          <dl class="mt-4 grid grid-cols-3 text-center">
            <div v-for="s in d.stats" :key="s.label">
              <dt class="text-[11px] text-muted-foreground">{{ s.label }}</dt>
              <dd class="text-lg font-semibold tabular-nums">{{ s.value }}</dd>
            </div>
          </dl>

          <div class="mt-4">
            <div class="mb-1.5 flex justify-between text-xs">
              <span class="text-muted-foreground">Bed occupancy</span>
              <span class="font-medium tabular-nums">{{ d.occupied }} / {{ d.beds }}</span>
            </div>
            <Progress :value="d.occupancy" :color="d.color" :label="`${d.name} bed occupancy`" />
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
