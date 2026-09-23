<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { CalendarPlus, UserPlus } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PatientsTable from '@/components/patients/PatientsTable.vue'
import { useHospital } from '@/stores/hospital'
import { useFormDialog } from '@/composables/useFormDialog'

const route = useRoute()
const hospital = useHospital()
const { openForm } = useFormDialog()

const status = ref('all')
const filters = computed(() =>
  ['all', 'admitted', 'outpatient', 'discharged'].map((value) => ({
    value,
    label: value[0].toUpperCase() + value.slice(1),
    count: value === 'all' ? hospital.patients.length : hospital.patients.filter((p) => p.status === value).length
  }))
)
const rows = computed(() =>
  status.value === 'all' ? hospital.patients : hospital.patients.filter((p) => p.status === status.value)
)
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Patients" :description="`${hospital.patients.length} patients registered across all wards.`">
      <Button variant="outline" @click="openForm('appointment')"><CalendarPlus /> Book appointment</Button>
      <Button @click="openForm('patient')"><UserPlus /> Add patient</Button>
    </PageHeader>

    <Card content-class="px-0">
      <PatientsTable :rows="rows" :initial-search="String(route.query.q ?? '')" flush>
        <template #toolbar>
          <div class="overflow-x-auto">
            <SegmentedControl v-model="status" :options="filters" label="Filter by status" />
          </div>
        </template>
      </PatientsTable>
    </Card>
  </div>
</template>
