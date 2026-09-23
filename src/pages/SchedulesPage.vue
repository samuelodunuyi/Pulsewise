<script setup>
import { ref, computed, watch } from 'vue'
import { CalendarClock, ChevronLeft, ChevronRight, Clock, Plus, Scissors } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Select from '@/components/ui/Select.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import UserChip from '@/components/common/UserChip.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import { useHospital, lookup } from '@/stores/hospital'
import { useFormDialog } from '@/composables/useFormDialog'
import { shiftTypes } from '@/config/status'
import { addDays, cn, formatDate, formatTime, formatTimeShort, startOfWeek, today, todayISO, toISODate } from '@/lib/utils'

const hospital = useHospital()
const { openForm } = useFormDialog()

const weekStart = ref(startOfWeek(today()))
const departmentId = ref('')

const days = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart.value, i)
    return { iso: toISODate(date), weekday: date.toLocaleDateString('en-US', { weekday: 'short' }), day: date.getDate() }
  })
)
const rangeLabel = computed(() => {
  const [first, last] = [days.value[0].iso, days.value[6].iso]
  return `${formatDate(first, { month: 'short', day: 'numeric' })} – ${formatDate(last, { month: 'short', day: 'numeric', year: 'numeric' })}`
})

const doctors = computed(() => hospital.doctors.filter((d) => !departmentId.value || d.departmentId === departmentId.value))

const weekShifts = computed(() => {
  const ids = new Set(doctors.value.map((d) => d.id))
  const [from, to] = [days.value[0].iso, days.value[6].iso]
  return hospital.shifts.filter((s) => ids.has(s.doctorId) && s.date >= from && s.date <= to)
})

// "doctorId|date" → shifts, sorted by start time
const cells = computed(() => {
  const map = {}
  for (const shift of weekShifts.value) (map[`${shift.doctorId}|${shift.date}`] ??= []).push(shift)
  Object.values(map).forEach((list) => list.sort((a, b) => a.start.localeCompare(b.start)))
  return map
})

const hours = (s) => {
  const [sh, sm] = s.start.split(':').map(Number)
  const [eh, em] = s.end.split(':').map(Number)
  return (eh * 60 + em - sh * 60 - sm) / 60
}

const stats = computed(() => [
  { label: 'Shifts this week', value: String(weekShifts.value.length), icon: CalendarClock, color: 'chart-1' },
  { label: 'Scheduled hours', value: `${weekShifts.value.reduce((sum, s) => sum + hours(s), 0)} h`, icon: Clock, color: 'chart-2' },
  { label: 'Surgery sessions', value: String(weekShifts.value.filter((s) => s.type === 'surgery').length), icon: Scissors, color: 'chart-4' }
])

const departmentOptions = computed(() => [
  { value: '', label: 'All departments' },
  ...hospital.departments.map((d) => ({ value: d.id, label: d.name }))
])

const shiftStyle = (shift) => {
  const color = shiftTypes[shift.type]?.color ?? 'chart-1'
  return { backgroundColor: `hsl(var(--${color}) / 0.1)`, borderColor: `hsl(var(--${color}))` }
}

// ---- Mobile agenda: one day at a time -------------------------------------
const selectedDay = ref(todayISO())
// Moving weeks selects today if it's in view, otherwise that week's Monday.
watch(days, (list) => {
  if (!list.some((d) => d.iso === selectedDay.value)) {
    selectedDay.value = list.find((d) => d.iso === todayISO())?.iso ?? list[0].iso
  }
})
const shiftsOn = (iso) => weekShifts.value.filter((s) => s.date === iso)
const dayShifts = computed(() =>
  shiftsOn(selectedDay.value)
    .map((s) => ({ ...s, doctor: lookup.doctor(s.doctorId) }))
    .sort((a, b) => a.start.localeCompare(b.start))
)
const selectedLabel = computed(() => formatDate(selectedDay.value, { weekday: 'long', month: 'long', day: 'numeric' }))
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Schedules" description="Weekly rota for clinics, surgery and on-call cover.">
      <Button @click="openForm('shift')"><Plus /> Add shift</Button>
    </PageHeader>

    <div class="grid gap-4 sm:grid-cols-3">
      <StatCard v-for="s in stats" :key="s.label" v-bind="s" />
    </div>

    <Card content-class="px-0 pb-0">
      <template #header>
        <div class="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon-sm" aria-label="Previous week" @click="weekStart = addDays(weekStart, -7)"><ChevronLeft /></Button>
          <Button variant="outline" size="sm" @click="weekStart = startOfWeek(today())">This week</Button>
          <Button variant="outline" size="icon-sm" aria-label="Next week" @click="weekStart = addDays(weekStart, 7)"><ChevronRight /></Button>
          <h2 class="ml-1 font-semibold">{{ rangeLabel }}</h2>
        </div>
      </template>
      <template #action>
        <div class="hidden items-center gap-3 text-xs text-muted-foreground md:flex">
          <span v-for="(t, key) in shiftTypes" :key="key" class="flex items-center gap-1.5">
            <span class="size-2 rounded-full" :style="{ backgroundColor: `hsl(var(--${t.color}))` }" />{{ t.label }}
          </span>
        </div>
        <Select v-model="departmentId" :options="departmentOptions" aria-label="Filter by department" class="w-44" />
      </template>

      <!-- Phones: pick a day, then see that day's shifts as a list -->
      <div class="border-t md:hidden">
        <div class="grid grid-cols-7 gap-1 px-3 py-3" role="tablist" aria-label="Day of week">
          <button
            v-for="d in days"
            :key="d.iso"
            type="button"
            role="tab"
            :aria-selected="d.iso === selectedDay"
            :class="
              cn(
                'flex flex-col items-center gap-0.5 rounded-lg py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                d.iso === selectedDay ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                d.iso === todayISO() && d.iso !== selectedDay && 'text-primary'
              )
            "
            @click="selectedDay = d.iso"
          >
            <span :class="d.iso === selectedDay ? 'opacity-90' : 'text-muted-foreground'">{{ d.weekday.slice(0, 2) }}</span>
            <span class="text-sm font-semibold tabular-nums">{{ d.day }}</span>
            <span
              :class="cn('size-1 rounded-full', shiftsOn(d.iso).length ? (d.iso === selectedDay ? 'bg-primary-foreground' : 'bg-primary') : 'bg-transparent')"
            />
          </button>
        </div>

        <div class="flex items-center justify-between border-t bg-muted/40 px-4 py-2.5">
          <p class="text-sm font-medium">{{ selectedLabel }}</p>
          <span class="text-xs text-muted-foreground">{{ dayShifts.length }} shifts</span>
        </div>

        <ul v-if="dayShifts.length" class="divide-y">
          <li v-for="shift in dayShifts" :key="shift.id">
            <button
              type="button"
              class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40 focus-visible:bg-muted/60 focus-visible:outline-none"
              @click="openForm('shift', { id: shift.id })"
            >
              <span class="h-10 w-1 shrink-0 rounded-full" :style="{ backgroundColor: shiftStyle(shift).borderColor }" />
              <div class="w-20 shrink-0">
                <p class="text-sm font-medium tabular-nums">{{ formatTimeShort(shift.start) }}</p>
                <p class="text-xs text-muted-foreground tabular-nums">to {{ formatTimeShort(shift.end) }}</p>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium">{{ shift.doctor?.name }}</p>
                <p class="truncate text-xs text-muted-foreground">
                  {{ shiftTypes[shift.type]?.label }}<template v-if="shift.location"> · {{ shift.location }}</template>
                </p>
              </div>
            </button>
          </li>
        </ul>
        <p v-else class="px-4 py-10 text-center text-sm text-muted-foreground">No shifts on this day</p>

        <div class="border-t p-3">
          <Button variant="outline" class="w-full" @click="openForm('shift', { initial: { date: selectedDay } })">
            <Plus /> Add shift on {{ formatDate(selectedDay, { weekday: 'short', month: 'short', day: 'numeric' }) }}
          </Button>
        </div>
      </div>

      <!-- Tablet and up: full weekly grid -->
      <div class="hidden overflow-x-auto border-t md:block">
        <table class="w-full min-w-[960px] table-fixed text-sm">
          <thead>
            <tr class="border-b bg-muted/40">
              <th scope="col" class="sticky left-0 z-10 w-56 bg-muted/40 px-5 py-2.5 text-left text-xs font-medium text-muted-foreground backdrop-blur">Doctor</th>
              <th
                v-for="d in days"
                :key="d.iso"
                scope="col"
                :class="cn('px-2 py-2.5 text-center text-xs font-medium', d.iso === todayISO() ? 'text-primary' : 'text-muted-foreground')"
              >
                {{ d.weekday }}
                <span :class="cn('ml-1 inline-grid size-6 place-items-center rounded-full tabular-nums', d.iso === todayISO() && 'bg-primary text-primary-foreground')">{{ d.day }}</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="doctor in doctors" :key="doctor.id">
              <th scope="row" class="sticky left-0 z-10 bg-card px-5 py-3 text-left font-normal">
                <UserChip :name="doctor.name" :subtitle="lookup.department(doctor.departmentId)?.name" :src="doctor.avatar" size="sm" />
              </th>
              <td v-for="d in days" :key="d.iso" :class="cn('group h-20 p-1.5 align-top', d.iso === todayISO() && 'bg-primary/[0.03]')">
                <div class="flex h-full flex-col gap-1">
                  <button
                    v-for="shift in cells[`${doctor.id}|${d.iso}`]"
                    :key="shift.id"
                    type="button"
                    class="w-full rounded-md border-l-[3px] px-2 py-1.5 text-left transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    :style="shiftStyle(shift)"
                    :aria-label="`${doctor.name}, ${shiftTypes[shift.type]?.label} ${formatTime(shift.start)} to ${formatTime(shift.end)}. Edit`"
                    @click="openForm('shift', { id: shift.id })"
                  >
                    <p class="text-xs font-medium tabular-nums">{{ formatTimeShort(shift.start) }}–{{ formatTimeShort(shift.end) }}</p>
                    <p class="truncate text-[11px] text-muted-foreground">{{ shift.location || shiftTypes[shift.type]?.label }}</p>
                  </button>
                  <button
                    type="button"
                    class="flex min-h-7 flex-1 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted focus-visible:opacity-100 group-hover:opacity-100"
                    :aria-label="`Add shift for ${doctor.name} on ${d.weekday} ${d.day}`"
                    @click="openForm('shift', { initial: { doctorId: doctor.id, date: d.iso } })"
                  >
                    <Plus class="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>
