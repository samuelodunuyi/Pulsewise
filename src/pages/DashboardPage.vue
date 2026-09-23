<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, CalendarPlus, Star } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import UserChip from '@/components/common/UserChip.vue'
import Timeline from '@/components/common/Timeline.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import PatientVolumeCard from '@/components/dashboard/PatientVolumeCard.vue'
import BreakdownCard from '@/components/common/BreakdownCard.vue'
import StaffCard from '@/components/dashboard/StaffCard.vue'
import ScheduleCard from '@/components/dashboard/ScheduleCard.vue'
import EngagementCard from '@/components/dashboard/EngagementCard.vue'
import AppointmentsTable from '@/components/appointments/AppointmentsTable.vue'
import PatientsTable from '@/components/patients/PatientsTable.vue'
import ReportList from '@/components/reports/ReportList.vue'
import TeamButton from '@/components/doctors/TeamButton.vue'
import analytics from '@/data/analytics.json'
import { useHospital } from '@/stores/hospital'
import { useFormDialog } from '@/composables/useFormDialog'
import { icon } from '@/lib/icons'
import { addDays, formatValue, today, toISODate } from '@/lib/utils'

const hospital = useHospital()
const { openForm } = useFormDialog()

const firstName = hospital.currentUser.name.split(' ').at(-1)
const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
const dateLabel = today().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

const upcoming = computed(() =>
  hospital.appointments
    .filter((a) => a.date >= toISODate(today()) && a.status !== 'cancelled')
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, 5)
)
const newestPatients = computed(() => [...hospital.patients].sort((a, b) => b.registered.localeCompare(a.registered)).slice(0, 5))

const admissions = [
  { label: 'OPD', data: analytics.admissions.opd, color: 'chart-2' },
  { label: 'ICU', data: analytics.admissions.icu, color: 'chart-4' }
]

const timeline = analytics.timeline.map(({ dayOffset, ...t }) => ({ ...t, date: toISODate(addDays(today(), dayOffset)) }))
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="`${greeting}, Dr. ${firstName}`" :description="`${dateLabel} · Here's what's happening at the hospital today.`">
      <Button variant="outline" as-child><RouterLink to="/reports">View reports</RouterLink></Button>
      <Button @click="openForm('appointment')"><CalendarPlus /> New appointment</Button>
    </PageHeader>

    <!-- KPIs -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        v-for="kpi in analytics.kpis"
        :key="kpi.id"
        :label="kpi.label"
        :value="formatValue(kpi.value, kpi.format)"
        :icon="icon(kpi.icon)"
        :color="kpi.color"
        :delta="kpi.delta"
        :invert="kpi.invert"
        :series="kpi.series"
      />
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <PatientVolumeCard :volume="analytics.patientVolume" class="lg:col-span-2" />
      <BreakdownCard title="Birth & mortality" description="Year to date, all departments" :items="analytics.outcomes" total-label="Total cases" />
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <Card title="Admissions" description="Outpatient vs. intensive care, this year" class="lg:col-span-2">
        <BaseChart
          type="bar"
          :labels="analytics.admissions.labels"
          :datasets="admissions"
          legend
          label="Monthly OPD and ICU admissions"
          class="h-72"
        />
      </Card>
      <StaffCard :counts="analytics.staff" :doctors="hospital.doctors" />
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <Card title="Upcoming appointments" content-class="px-0 pb-2" class="lg:col-span-2">
        <template #action>
          <Button variant="ghost" size="sm" as-child>
            <RouterLink to="/appointments">View all <ArrowRight /></RouterLink>
          </Button>
        </template>
        <AppointmentsTable :rows="upcoming" compact flush />
      </Card>
      <ScheduleCard :appointments="hospital.appointments" />
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <Card title="New patients" content-class="px-0 pb-2" class="lg:col-span-2">
        <template #action>
          <Button variant="ghost" size="sm" as-child>
            <RouterLink to="/patients">View all <ArrowRight /></RouterLink>
          </Button>
        </template>
        <PatientsTable :rows="newestPatients" compact flush />
      </Card>

      <Card title="Doctors" description="Build your care team">
        <ul class="-my-3 divide-y">
          <li v-for="doctor in hospital.doctors" :key="doctor.id" class="flex items-center gap-3 py-3">
            <UserChip :name="doctor.name" :subtitle="doctor.specialty" :src="doctor.avatar" class="flex-1" />
            <span class="hidden items-center gap-1 text-xs font-medium tabular-nums text-muted-foreground sm:flex">
              <Star class="size-3.5 fill-chart-3 text-chart-3" />{{ doctor.rating }}
            </span>
            <TeamButton :doctor="doctor" icon-only />
          </li>
        </ul>
      </Card>
    </div>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <EngagementCard :engagement="analytics.engagement" :doctors="hospital.doctors" />
      <Card title="Patient timeline" description="Jennifer Ade · Cardiology">
        <Timeline :items="timeline" />
      </Card>
      <Card title="Latest reports" class="md:col-span-2 xl:col-span-1">
        <template #action>
          <Button variant="ghost" size="sm" as-child>
            <RouterLink to="/reports">View all <ArrowRight /></RouterLink>
          </Button>
        </template>
        <ReportList :reports="hospital.reports.slice(0, 5)" />
      </Card>
    </div>
  </div>
</template>
