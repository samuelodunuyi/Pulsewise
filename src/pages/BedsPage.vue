<script setup>
import { ref, computed } from 'vue'
import { BedDouble, BedSingle, CheckCircle2, Plus, Wrench } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Progress from '@/components/ui/Progress.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import BedTile from '@/components/beds/BedTile.vue'
import { useHospital } from '@/stores/hospital'
import { useFormDialog } from '@/composables/useFormDialog'

const hospital = useHospital()
const { openForm } = useFormDialog()

const count = (...states) => hospital.beds.filter((b) => states.includes(b.status)).length
const occupancy = computed(() => (hospital.beds.length ? Math.round((count('occupied') / hospital.beds.length) * 100) : 0))

const stats = computed(() => [
  { label: 'Total beds', value: String(hospital.beds.length), icon: BedDouble, color: 'chart-2' },
  { label: `Occupied · ${occupancy.value}%`, value: String(count('occupied')), icon: BedSingle, color: 'chart-1' },
  { label: 'Available', value: String(count('available')), icon: CheckCircle2, color: 'chart-5' },
  { label: 'Cleaning / maintenance', value: String(count('cleaning', 'maintenance')), icon: Wrench, color: 'chart-3' }
])

const ward = ref('all')
const wardOptions = computed(() => [
  { value: 'all', label: 'All wards' },
  ...hospital.departments.map((d) => ({ value: String(d.id), label: d.name }))
])

const wards = computed(() =>
  hospital.departments
    .filter((d) => ward.value === 'all' || String(d.id) === ward.value)
    .map((d) => {
      const beds = hospital.beds.filter((b) => b.departmentId === d.id).sort((a, b) => a.label.localeCompare(b.label))
      const occupied = beds.filter((b) => b.status === 'occupied').length
      return { ...d, beds, occupied }
    })
    .filter((d) => d.beds.length || ward.value !== 'all')
)
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Bed manager" description="Live bed availability across every ward.">
      <Button @click="openForm('bed', ward === 'all' ? {} : { initial: { departmentId: Number(ward) } })"><Plus /> Add bed</Button>
    </PageHeader>

    <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard v-for="s in stats" :key="s.label" v-bind="s" />
    </div>

    <div class="overflow-x-auto">
      <SegmentedControl v-model="ward" :options="wardOptions" label="Filter by ward" />
    </div>

    <Card v-for="w in wards" :key="w.id" :title="w.name" :description="`${w.occupied} of ${w.beds.length} beds occupied`">
      <template #action>
        <div class="w-32"><Progress :value="w.beds.length ? (w.occupied / w.beds.length) * 100 : 0" :color="w.color" :label="`${w.name} occupancy`" /></div>
      </template>
      <div v-if="w.beds.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        <BedTile v-for="bed in w.beds" :key="bed.id" :bed="bed" />
      </div>
      <p v-else class="py-6 text-center text-sm text-muted-foreground">No beds in this ward yet.</p>
    </Card>
  </div>
</template>
