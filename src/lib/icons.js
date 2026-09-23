import {
  Activity,
  BedDouble,
  CalendarDays,
  Check,
  HeartPulse,
  Pill,
  Stethoscope,
  Timer,
  UserPlus,
  Users,
  Wallet
} from 'lucide-vue-next'

// Lets JSON data reference icons by name.
const registry = {
  activity: Activity,
  bed: BedDouble,
  calendar: CalendarDays,
  check: Check,
  heartPulse: HeartPulse,
  pill: Pill,
  stethoscope: Stethoscope,
  timer: Timer,
  userPlus: UserPlus,
  users: Users,
  wallet: Wallet
}

export const icon = (name) => registry[name] ?? Activity
