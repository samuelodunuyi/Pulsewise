<script setup>
import { FilePlus2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ReportList from '@/components/reports/ReportList.vue'
import { useHospital } from '@/stores/hospital'
import { useFormDialog } from '@/composables/useFormDialog'

const hospital = useHospital()
const { openForm } = useFormDialog()
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Reports" description="Generated clinical, financial and operational reports.">
      <Button @click="openForm('report')"><FilePlus2 /> Generate report</Button>
    </PageHeader>
    <Card>
      <ReportList :reports="hospital.reports" />
    </Card>
  </div>
</template>
