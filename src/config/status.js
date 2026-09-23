// One place that maps every domain status to a label + Badge variant.
export const statuses = {
  // appointments
  confirmed: { label: 'Confirmed', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  completed: { label: 'Completed', variant: 'secondary' },
  // patients
  admitted: { label: 'Admitted', variant: 'default' },
  outpatient: { label: 'Outpatient', variant: 'secondary' },
  discharged: { label: 'Discharged', variant: 'success' },
  // reports
  ready: { label: 'Ready', variant: 'success' },
  processing: { label: 'Processing', variant: 'warning' },
  'on-hold': { label: 'On hold', variant: 'destructive' },
  // invoices
  paid: { label: 'Paid', variant: 'success' },
  unpaid: { label: 'Unpaid', variant: 'warning' },
  overdue: { label: 'Overdue', variant: 'destructive' },
  refunded: { label: 'Refunded', variant: 'secondary' },
  // beds
  available: { label: 'Available', variant: 'success' },
  occupied: { label: 'Occupied', variant: 'default' },
  cleaning: { label: 'Cleaning', variant: 'warning' },
  maintenance: { label: 'Maintenance', variant: 'destructive' }
}

// Shift types share colors with the chart palette.
export const shiftTypes = {
  clinic: { label: 'Clinic', color: 'chart-1' },
  surgery: { label: 'Surgery', color: 'chart-4' },
  'on-call': { label: 'On call', color: 'chart-3' }
}
