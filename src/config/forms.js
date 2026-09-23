import { markRaw } from 'vue'
import {
  BedDouble,
  Building2,
  CalendarClock,
  CalendarPlus,
  FileText,
  Pill,
  Receipt,
  UserPlus
} from 'lucide-vue-next'
import {
  useHospital,
  find,
  insert,
  update,
  remove,
  lookup,
  bedOf,
  addReport,
  assignBed,
  deletePatient,
  deleteDepartment,
  invoiceNumber
} from '@/stores/hospital'
import { addDays, formatDate, formatMoney, formatTime, toISODate, today, todayISO } from '@/lib/utils'

const h = useHospital()

// ---- Option sources (functions so they always reflect current data) --------

const option = (value, label) => ({ value, label })
const patients = () => h.patients.map((p) => option(p.id, p.name))
const departments = () => h.departments.map((d) => option(d.id, d.name))
const allDoctors = () => h.doctors.map((d) => option(d.id, d.name))
const doctorsIn = (values) =>
  h.doctors.filter((d) => !values?.departmentId || d.departmentId === values.departmentId).map((d) => option(d.id, d.name))
const unbedded = () => h.patients.filter((p) => !bedOf(p.id)).map((p) => option(p.id, p.name))
const statusOptions = (...keys) => keys.map((k) => option(k, k[0].toUpperCase() + k.slice(1).replace('-', ' ')))

const pick = (values, keys) => Object.fromEntries(keys.map((k) => [k, values[k]]))
const inTwoWeeks = () => toISODate(addDays(today(), 14))

/**
 * Every create/edit form in the app is described here and rendered by one <FormDialog>.
 *
 * Field: { name, label, type?, placeholder?, required?, options?, span?, default?, min? }
 * Form:  { title, editTitle?, description?, icon, submitLabel?, sections,
 *          load?(ctx) → record, submit(values, ctx) → result, validate?(values),
 *          remove?(ctx) → result, confirmRemove?(ctx) → { title, description } }
 * Result: { title, description?, to? } on success or { error } on failure.
 */
export const forms = {
  patient: {
    title: 'New patient',
    editTitle: 'Edit patient',
    description: 'Personal and clinical details.',
    icon: markRaw(UserPlus),
    submitLabel: 'Add patient',
    sections: [
      {
        title: 'Personal',
        fields: [
          { name: 'name', label: 'Full name', placeholder: 'e.g. Jane Cooper', required: true },
          { name: 'dob', label: 'Date of birth', type: 'date', required: true },
          { name: 'gender', label: 'Sex', type: 'radio', options: ['Female', 'Male'], default: 'Female' },
          { name: 'bloodType', label: 'Blood type', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
          { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 555 000 1234' },
          { name: 'email', label: 'Email', type: 'email', placeholder: 'jane@mail.com' },
          { name: 'address', label: 'Address', span: 2 }
        ]
      },
      {
        title: 'Clinical',
        fields: [
          { name: 'departmentId', label: 'Department', type: 'select', options: departments, required: true },
          { name: 'condition', label: 'Condition', placeholder: 'e.g. Hypertension', required: true },
          { name: 'allergies', label: 'Allergies', placeholder: 'None known', span: 2 },
          { name: 'notes', label: 'Notes', type: 'textarea', span: 2 }
        ]
      }
    ],
    load: ({ id }) => find('patients', id),
    submit(values, { id }) {
      if (id) {
        update('patients', id, values)
        return { title: 'Patient updated', description: values.name }
      }
      const patient = insert('patients', { ...values, status: 'outpatient', registered: todayISO(), avatar: null })
      return { title: 'Patient added', description: patient.name, to: `/patients/${patient.id}` }
    },
    confirmRemove: ({ id }) => ({
      title: `Delete ${find('patients', id)?.name}?`,
      description: 'Their appointments, invoices and prescriptions will be deleted too.'
    }),
    remove({ id }) {
      const { name } = find('patients', id)
      deletePatient(id)
      return { title: 'Patient deleted', description: name, to: '/patients' }
    }
  },

  appointment: {
    title: 'New appointment',
    editTitle: 'Edit appointment',
    description: 'Book a patient in with a doctor.',
    icon: markRaw(CalendarPlus),
    submitLabel: 'Book appointment',
    sections: [
      {
        title: 'Appointment',
        fields: [
          { name: 'patientId', label: 'Patient', type: 'select', options: patients, required: true, span: 2 },
          { name: 'departmentId', label: 'Department', type: 'select', options: departments, required: true },
          { name: 'doctorId', label: 'Doctor', type: 'select', options: doctorsIn, required: true },
          { name: 'date', label: 'Date', type: 'date', required: true, default: todayISO },
          { name: 'time', label: 'Time', type: 'time', required: true, default: '09:00' },
          { name: 'status', label: 'Status', type: 'select', options: statusOptions('pending', 'confirmed', 'completed', 'cancelled'), default: 'pending', span: 2 },
          { name: 'reason', label: 'Reason for visit', type: 'textarea', span: 2, placeholder: 'Symptoms, referral notes…' }
        ]
      }
    ],
    load({ id }) {
      const appointment = find('appointments', id)
      return { ...appointment, departmentId: lookup.doctor(appointment.doctorId)?.departmentId }
    },
    validate: (v) =>
      v.doctorId && v.departmentId && lookup.doctor(v.doctorId)?.departmentId !== v.departmentId
        ? { doctorId: 'This doctor is not in the selected department' }
        : {},
    submit(values, { id }) {
      const data = pick(values, ['patientId', 'doctorId', 'date', 'time', 'status', 'reason'])
      const summary = `${lookup.patient(data.patientId).name} · ${formatDate(data.date)}, ${formatTime(data.time)}`
      if (id) {
        update('appointments', id, data)
        return { title: 'Appointment updated', description: summary }
      }
      insert('appointments', data)
      return { title: 'Appointment booked', description: summary }
    },
    confirmRemove: () => ({ title: 'Delete this appointment?' }),
    remove({ id }) {
      remove('appointments', id)
      return { title: 'Appointment deleted' }
    }
  },

  prescription: {
    title: 'Write prescription',
    editTitle: 'Edit prescription',
    description: 'Issue medication for a patient.',
    icon: markRaw(Pill),
    submitLabel: 'Save prescription',
    sections: [
      {
        title: 'Prescription',
        fields: [
          { name: 'patientId', label: 'Patient', type: 'select', options: patients, required: true },
          { name: 'doctorId', label: 'Prescribing doctor', type: 'select', options: allDoctors, required: true },
          { name: 'medication', label: 'Medication', placeholder: 'e.g. Amoxicillin 500 mg', required: true },
          { name: 'dosage', label: 'Dosage', placeholder: '1 tablet, 3× daily', required: true },
          { name: 'durationDays', label: 'Duration (days)', type: 'number', min: 1, default: 7 },
          { name: 'notes', label: 'Notes', type: 'textarea', span: 2, placeholder: 'Take with food…' }
        ]
      }
    ],
    load: ({ id }) => find('prescriptions', id),
    submit(values, { id }) {
      const data = { ...values, durationDays: Number(values.durationDays) || null }
      if (id) {
        update('prescriptions', id, data)
        return { title: 'Prescription updated', description: data.medication }
      }
      insert('prescriptions', { ...data, date: todayISO() })
      return { title: 'Prescription saved', description: `${data.medication} for ${lookup.patient(data.patientId).name}` }
    },
    confirmRemove: ({ id }) => ({ title: `Delete ${find('prescriptions', id)?.medication}?` }),
    remove({ id }) {
      remove('prescriptions', id)
      return { title: 'Prescription deleted' }
    }
  },

  invoice: {
    title: 'New invoice',
    editTitle: 'Edit invoice',
    description: 'Bill a patient for care or services.',
    icon: markRaw(Receipt),
    submitLabel: 'Create invoice',
    sections: [
      {
        title: 'Invoice',
        fields: [
          { name: 'patientId', label: 'Patient', type: 'select', options: patients, required: true, span: 2 },
          { name: 'description', label: 'Description', placeholder: 'e.g. Consultation and blood tests', required: true, span: 2 },
          { name: 'amount', label: 'Amount (USD)', type: 'number', min: 1, required: true },
          { name: 'due', label: 'Due date', type: 'date', required: true, default: inTwoWeeks },
          { name: 'method', label: 'Payment method', type: 'select', options: ['Card', 'Cash', 'Insurance', 'Bank transfer'], default: 'Card' },
          { name: 'status', label: 'Status', type: 'select', options: statusOptions('unpaid', 'paid', 'refunded'), default: 'unpaid' }
        ]
      }
    ],
    load: ({ id }) => find('invoices', id),
    submit(values, { id }) {
      const data = { ...values, amount: Number(values.amount) }
      if (id) {
        update('invoices', id, data)
        return { title: 'Invoice updated', description: invoiceNumber(find('invoices', id)) }
      }
      const invoice = insert('invoices', { ...data, issued: todayISO() })
      return { title: 'Invoice created', description: `${invoiceNumber(invoice)} · ${formatMoney(invoice.amount)}` }
    },
    confirmRemove: ({ id }) => ({ title: `Delete ${invoiceNumber(find('invoices', id))}?` }),
    remove({ id }) {
      remove('invoices', id)
      return { title: 'Invoice deleted' }
    }
  },

  report: {
    title: 'Generate report',
    description: 'Compile a report from hospital records.',
    icon: markRaw(FileText),
    submitLabel: 'Generate',
    sections: [
      {
        title: 'Report',
        fields: [
          { name: 'title', label: 'Report title', placeholder: 'e.g. October admissions', required: true, span: 2 },
          {
            name: 'type',
            label: 'Report type',
            type: 'select',
            required: true,
            options: ['Patient report', 'Department report', 'Financial report', 'Operations report']
          },
          { name: 'departmentId', label: 'Department', type: 'select', options: departments, placeholder: 'All departments' },
          { name: 'from', label: 'From', type: 'date', required: true },
          { name: 'to', label: 'To', type: 'date', required: true, default: todayISO }
        ]
      }
    ],
    validate: (v) => (v.from && v.to && v.from > v.to ? { to: 'Must be on or after the start date' } : {}),
    submit(values) {
      addReport(values)
      return { title: 'Report queued', description: `“${values.title}” will be ready in a moment.` }
    }
  },

  department: {
    title: 'New department',
    editTitle: 'Edit department',
    icon: markRaw(Building2),
    submitLabel: 'Add department',
    sections: [
      {
        title: 'Department',
        fields: [
          { name: 'name', label: 'Name', required: true },
          { name: 'headDoctorId', label: 'Head of department', type: 'select', options: allDoctors, placeholder: 'Not assigned' },
          { name: 'location', label: 'Location', placeholder: 'e.g. Floor 2, West wing' },
          { name: 'phone', label: 'Phone / extension', placeholder: 'ext. 2100' },
          {
            name: 'color',
            label: 'Colour',
            type: 'select',
            default: 'chart-1',
            options: [option('chart-1', 'Teal'), option('chart-2', 'Blue'), option('chart-3', 'Amber'), option('chart-4', 'Rose'), option('chart-5', 'Violet')]
          },
          { name: 'description', label: 'Description', type: 'textarea', span: 2 }
        ]
      }
    ],
    load: ({ id }) => find('departments', id),
    submit(values, { id }) {
      if (id) {
        update('departments', id, values)
        return { title: 'Department updated', description: values.name }
      }
      insert('departments', values)
      return { title: 'Department added', description: values.name }
    },
    confirmRemove: ({ id }) => ({ title: `Delete ${find('departments', id)?.name}?` }),
    remove({ id }) {
      const { name } = find('departments', id)
      const error = deleteDepartment(id)
      return error ? { error } : { title: 'Department deleted', description: name }
    }
  },

  shift: {
    title: 'New shift',
    editTitle: 'Edit shift',
    description: 'Add a doctor to the rota.',
    icon: markRaw(CalendarClock),
    submitLabel: 'Add shift',
    sections: [
      {
        title: 'Shift',
        fields: [
          { name: 'doctorId', label: 'Doctor', type: 'select', options: allDoctors, required: true, span: 2 },
          { name: 'date', label: 'Date', type: 'date', required: true, default: todayISO },
          {
            name: 'type',
            label: 'Type',
            type: 'select',
            required: true,
            default: 'clinic',
            options: [option('clinic', 'Clinic'), option('surgery', 'Surgery'), option('on-call', 'On call')]
          },
          { name: 'start', label: 'Starts', type: 'time', required: true, default: '08:00' },
          { name: 'end', label: 'Ends', type: 'time', required: true, default: '16:00' },
          { name: 'location', label: 'Location', placeholder: 'e.g. Theatre 1', span: 2 }
        ]
      }
    ],
    load: ({ id }) => find('shifts', id),
    validate: (v) => (v.start && v.end && v.end <= v.start ? { end: 'Must be after the start time' } : {}),
    submit(values, { id }) {
      const summary = `${lookup.doctor(values.doctorId).name} · ${formatDate(values.date, { weekday: 'short', month: 'short', day: 'numeric' })}`
      if (id) {
        update('shifts', id, values)
        return { title: 'Shift updated', description: summary }
      }
      insert('shifts', values)
      return { title: 'Shift added', description: summary }
    },
    confirmRemove: () => ({ title: 'Delete this shift?' }),
    remove({ id }) {
      remove('shifts', id)
      return { title: 'Shift deleted' }
    }
  },

  bed: {
    title: 'New bed',
    editTitle: 'Edit bed',
    icon: markRaw(BedDouble),
    submitLabel: 'Add bed',
    sections: [
      {
        title: 'Bed',
        fields: [
          { name: 'label', label: 'Bed label', placeholder: 'e.g. C-107', required: true },
          { name: 'departmentId', label: 'Ward', type: 'select', options: departments, required: true },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            default: 'available',
            options: statusOptions('available', 'cleaning', 'maintenance'),
            visible: (v) => v.status !== 'occupied',
            span: 2
          }
        ]
      }
    ],
    load: ({ id }) => find('beds', id),
    submit(values, { id }) {
      if (id) {
        update('beds', id, values)
        return { title: 'Bed updated', description: values.label }
      }
      insert('beds', { ...values, patientId: null })
      return { title: 'Bed added', description: values.label }
    },
    confirmRemove: ({ id }) => ({ title: `Remove bed ${find('beds', id)?.label}?` }),
    remove({ id }) {
      const bed = find('beds', id)
      if (bed.patientId) return { error: 'Discharge the patient before removing this bed.' }
      remove('beds', id)
      return { title: 'Bed removed', description: bed.label }
    }
  },

  assignBed: {
    title: ({ id }) => `Assign bed ${find('beds', id)?.label}`,
    description: 'Admits the patient to this ward.',
    icon: markRaw(BedDouble),
    submitLabel: 'Assign bed',
    sections: [
      {
        title: 'Patient',
        fields: [{ name: 'patientId', label: 'Patient', type: 'select', options: unbedded, required: true, span: 2 }]
      }
    ],
    submit(values, { id }) {
      const bed = assignBed(id, values.patientId)
      return { title: 'Patient admitted', description: `${lookup.patient(values.patientId).name} → ${bed.label}` }
    }
  }
}

// The patient-side counterpart of assignBed: pick a free bed for a known patient.
forms.admitPatient = {
  title: ({ patientId }) => `Admit ${find('patients', patientId)?.name}`,
  description: 'Choose a free bed. The patient moves to that ward.',
  icon: markRaw(BedDouble),
  submitLabel: 'Admit patient',
  sections: [
    {
      title: 'Bed',
      fields: [
        {
          name: 'bedId',
          label: 'Bed',
          type: 'select',
          required: true,
          span: 2,
          options: () =>
            h.beds
              .filter((b) => b.status === 'available')
              .map((b) => option(b.id, `${b.label} · ${lookup.department(b.departmentId)?.name}`))
        }
      ]
    }
  ],
  submit(values, { patientId }) {
    const bed = assignBed(values.bedId, patientId)
    return { title: 'Patient admitted', description: `${lookup.patient(patientId).name} → ${bed.label}` }
  }
}

// What the header's "Create" menu offers.
export const quickActions = ['appointment', 'patient', 'prescription', 'invoice', 'report'].map((key) => ({
  key,
  label: forms[key].title,
  icon: forms[key].icon
}))
