import { reactive, computed, watch } from 'vue'
import departmentsData from '@/data/departments.json'
import doctorsData from '@/data/doctors.json'
import patientsData from '@/data/patients.json'
import appointmentsData from '@/data/appointments.json'
import bedsData from '@/data/beds.json'
import shiftTemplates from '@/data/shifts.json'
import invoicesData from '@/data/invoices.json'
import prescriptionsData from '@/data/prescriptions.json'
import reportsData from '@/data/reports.json'
import notificationsData from '@/data/notifications.json'
import { addDays, startOfWeek, today, todayISO, toISODate } from '@/lib/utils'
import { APP_DOMAIN } from '@/config/brand'

const STORAGE_KEY = 'pulsewise-data-v1'

// ---- Seeding ---------------------------------------------------------------
// Seed JSON stores day offsets so a fresh demo always looks current.

function seed() {
  const day = (offset) => toISODate(addDays(today(), offset))
  const monday = startOfWeek(today())

  // Expand weekly shift templates across last week → two weeks ahead.
  const shifts = []
  for (let week = -1; week <= 2; week++) {
    for (const { weekday, ...shift } of shiftTemplates) {
      shifts.push({ ...shift, id: shifts.length + 1, date: toISODate(addDays(monday, week * 7 + weekday - 1)) })
    }
  }

  return {
    currentUser: {
      name: 'Dr. Samuel Deo',
      role: 'Chief of Surgery',
      email: `samuel.deo@${APP_DOMAIN}`,
      avatar: 'https://i.pravatar.cc/160?img=33'
    },
    departments: departmentsData.map((d) => ({ ...d })),
    doctors: doctorsData.map((d) => ({ ...d })),
    patients: patientsData.map(({ registeredOffset, ...p }) => ({ ...p, registered: day(registeredOffset) })),
    appointments: appointmentsData.map(({ dayOffset, ...a }) => ({ ...a, date: day(dayOffset) })),
    beds: bedsData.map((b) => ({ ...b })),
    shifts,
    invoices: invoicesData.map(({ issuedOffset, dueOffset, ...i }) => ({ ...i, issued: day(issuedOffset), due: day(dueOffset) })),
    prescriptions: prescriptionsData.map(({ dayOffset, ...p }) => ({ ...p, date: day(dayOffset) })),
    reports: reportsData.map(({ dayOffset, ...r }) => ({ ...r, date: day(dayOffset) })),
    notifications: notificationsData.map((n) => ({ ...n }))
  }
}

// ---- Persistence -----------------------------------------------------------
// Every change is saved to localStorage, so edits survive reloads.

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved) return null
    // A report can't finish "generating" after a reload.
    saved.reports?.forEach((r) => r.status === 'processing' && (r.status = 'ready'))
    return { ...seed(), ...saved }
  } catch {
    return null
  }
}

const state = reactive(load() ?? seed())

let saveTimer
watch(
  state,
  () => {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch {
        /* storage full or blocked — changes stay in memory for this session */
      }
    }, 200)
  },
  { deep: true }
)

export function resetDemoData() {
  Object.assign(state, seed())
}

export function useHospital() {
  return state
}

// ---- Generic collection helpers ------------------------------------------

export const find = (collection, id) => state[collection].find((row) => row.id === id)

const nextId = (collection) => state[collection].reduce((max, row) => Math.max(max, row.id), 0) + 1

export function insert(collection, record) {
  state[collection].unshift({ ...record, id: nextId(collection) })
  return state[collection][0]
}

export function update(collection, id, patch) {
  const row = find(collection, id)
  if (row) Object.assign(row, patch)
  return row
}

export function remove(collection, id) {
  const index = state[collection].findIndex((row) => row.id === id)
  if (index >= 0) state[collection].splice(index, 1)
}

// ---- Lookups & derived values ----------------------------------------------

export const lookup = {
  patient: (id) => find('patients', id),
  doctor: (id) => find('doctors', id),
  department: (id) => find('departments', id)
}

export const bedOf = (patientId) => state.beds.find((b) => b.patientId === patientId)

/** Unpaid invoices past their due date read as "overdue". */
export const invoiceStatus = (invoice) =>
  invoice.status === 'unpaid' && invoice.due < todayISO() ? 'overdue' : invoice.status

export const invoiceNumber = (invoice) => `INV-${String(invoice.id).padStart(4, '0')}`

export const unreadCount = computed(() => state.notifications.filter((n) => !n.read).length)
export const pendingCount = computed(() => state.appointments.filter((a) => a.status === 'pending').length)

// ---- Domain actions (keep related records consistent) ----------------------

export function deletePatient(id) {
  const bed = bedOf(id)
  if (bed) Object.assign(bed, { status: 'cleaning', patientId: null })
  for (const collection of ['appointments', 'invoices', 'prescriptions']) {
    state[collection] = state[collection].filter((row) => row.patientId !== id)
  }
  remove('patients', id)
}

export function assignBed(bedId, patientId) {
  const previous = bedOf(patientId)
  if (previous) Object.assign(previous, { status: 'cleaning', patientId: null })
  const bed = update('beds', bedId, { status: 'occupied', patientId })
  update('patients', patientId, { status: 'admitted', departmentId: bed.departmentId })
  return bed
}

export function dischargeFromBed(bedId) {
  const bed = find('beds', bedId)
  if (bed?.patientId) update('patients', bed.patientId, { status: 'discharged' })
  return update('beds', bedId, { status: 'cleaning', patientId: null })
}

/** Returns an error message instead of deleting when the department is still in use. */
export function deleteDepartment(id) {
  const doctors = state.doctors.filter((d) => d.departmentId === id).length
  const beds = state.beds.filter((b) => b.departmentId === id).length
  if (doctors || beds) {
    return `Move its ${[doctors && `${doctors} doctor(s)`, beds && `${beds} bed(s)`].filter(Boolean).join(' and ')} to another department first.`
  }
  remove('departments', id)
  return null
}

export function setAppointmentStatus(id, status) {
  update('appointments', id, { status })
}

export function toggleTeam(id) {
  const doctor = find('doctors', id)
  if (doctor) doctor.onTeam = !doctor.onTeam
  return doctor
}

export function addReport(values) {
  const report = insert('reports', {
    title: values.title,
    type: values.type,
    author: state.currentUser.name,
    date: todayISO(),
    size: '—',
    status: 'processing'
  })
  // Simulate the report being generated server-side.
  setTimeout(() => {
    report.status = 'ready'
    report.size = `${(Math.random() * 3 + 0.4).toFixed(1)} MB`
  }, 2500)
}

export function markAllRead() {
  state.notifications.forEach((n) => (n.read = true))
}
