<script setup>
import { ref, computed } from 'vue'
import { AlertCircle, CheckCircle2, Clock, Plus, Receipt } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BreakdownCard from '@/components/common/BreakdownCard.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import InvoicesTable from '@/components/payments/InvoicesTable.vue'
import analytics from '@/data/analytics.json'
import { useHospital, invoiceStatus } from '@/stores/hospital'
import { useFormDialog } from '@/composables/useFormDialog'
import { formatMoney } from '@/lib/utils'

const hospital = useHospital()
const { openForm } = useFormDialog()

const withState = computed(() => hospital.invoices.map((i) => ({ i, state: invoiceStatus(i) })))
const sum = (state) => withState.value.filter((x) => x.state === state).reduce((total, x) => total + x.i.amount, 0)
const count = (state) => withState.value.filter((x) => x.state === state).length

const stats = computed(() => [
  { label: 'Collected', value: formatMoney(sum('paid')), icon: CheckCircle2, color: 'chart-1' },
  { label: 'Outstanding', value: formatMoney(sum('unpaid')), icon: Clock, color: 'chart-3' },
  { label: 'Overdue', value: formatMoney(sum('overdue')), icon: AlertCircle, color: 'chart-4' },
  { label: 'Invoices', value: String(hospital.invoices.length), icon: Receipt, color: 'chart-2' }
])

const methodColors = { Card: 'chart-1', Insurance: 'chart-2', Cash: 'chart-3', 'Bank transfer': 'chart-5' }
const methods = computed(() =>
  Object.entries(methodColors)
    .map(([label, color]) => ({
      label,
      color,
      value: hospital.invoices.filter((i) => i.method === label && i.status === 'paid').reduce((s, i) => s + i.amount, 0)
    }))
    .filter((m) => m.value > 0)
)

const revenue = [
  { label: 'Collected', data: analytics.revenue.collected, color: 'chart-1' },
  { label: 'Outstanding', data: analytics.revenue.outstanding, color: 'chart-3' }
]

const status = ref('all')
const filters = computed(() => [
  { value: 'all', label: 'All', count: hospital.invoices.length },
  ...['unpaid', 'overdue', 'paid', 'refunded'].map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1), count: count(s) }))
])
const rows = computed(() =>
  status.value === 'all' ? hospital.invoices : withState.value.filter((x) => x.state === status.value).map((x) => x.i)
)
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Payments" description="Invoices, collections and outstanding balances.">
      <Button @click="openForm('invoice')"><Plus /> New invoice</Button>
    </PageHeader>

    <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard v-for="s in stats" :key="s.label" v-bind="s" />
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <Card title="Revenue" description="Collected vs. outstanding, last 6 months" class="lg:col-span-2">
        <BaseChart
          type="bar"
          :labels="analytics.revenue.labels"
          :datasets="revenue"
          legend
          stacked
          label="Monthly collected and outstanding revenue"
          class="h-72"
        />
      </Card>
      <BreakdownCard title="Payment methods" description="Paid invoices by method" :items="methods" total-label="Collected" currency />
    </div>

    <Card content-class="px-0">
      <InvoicesTable :rows="rows" flush searchable>
        <template #toolbar>
          <div class="overflow-x-auto">
            <SegmentedControl v-model="status" :options="filters" label="Filter by status" />
          </div>
        </template>
      </InvoicesTable>
    </Card>
  </div>
</template>
