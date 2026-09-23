import { markRaw } from 'vue'
import {
  BedDouble,
  Building2,
  CalendarCheck,
  CalendarClock,
  CreditCard,
  FileText,
  LayoutDashboard,
  Megaphone,
  Stethoscope,
  UserCog,
  Users
} from 'lucide-vue-next'
import { pendingCount } from '@/stores/hospital'

const item = (title, to, icon, extra = {}) => ({ title, to, icon: markRaw(icon), ...extra })

export const navigation = [
  {
    label: 'Overview',
    items: [
      item('Dashboard', '/', LayoutDashboard, { page: 'dashboard' }),
      item('Appointments', '/appointments', CalendarCheck, { page: 'appointments', badge: () => pendingCount.value }),
      item('Patients', '/patients', Users, { page: 'patients' }),
      item('Doctors', '/doctors', Stethoscope, { page: 'doctors' }),
      item('Reports', '/reports', FileText, { page: 'reports' })
    ]
  },
  {
    label: 'Management',
    items: [
      item('Departments', '/departments', Building2, { page: 'departments' }),
      item('Schedules', '/schedules', CalendarClock, { page: 'schedules' }),
      item('Payments', '/payments', CreditCard, { page: 'payments' }),
      item('Bed manager', '/beds', BedDouble, { page: 'beds' }),
      item('Human resources', '/staff', UserCog, { description: 'Manage nurses, pharmacists and support staff.' }),
      item('Notices', '/notices', Megaphone, { description: 'Publish announcements to hospital staff.' })
    ]
  }
]

export const navItems = navigation.flatMap((group) => group.items)
