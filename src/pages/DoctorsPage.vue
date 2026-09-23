<script setup>
import { ref, computed } from 'vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import DoctorCard from '@/components/doctors/DoctorCard.vue'
import { useHospital } from '@/stores/hospital'

const hospital = useHospital()

const view = ref('all')
const filters = computed(() => [
  { value: 'all', label: 'All', count: hospital.doctors.length },
  { value: 'team', label: 'My team', count: hospital.doctors.filter((d) => d.onTeam).length },
  { value: 'available', label: 'Available', count: hospital.doctors.filter((d) => d.available).length }
])
const doctors = computed(() =>
  hospital.doctors.filter((d) => view.value === 'all' || (view.value === 'team' ? d.onTeam : d.available))
)
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Doctors" description="Specialists on staff and your assigned care team.">
      <SegmentedControl v-model="view" :options="filters" label="Filter doctors" />
    </PageHeader>

    <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <DoctorCard v-for="doctor in doctors" :key="doctor.id" :doctor="doctor" />
    </div>
  </div>
</template>
