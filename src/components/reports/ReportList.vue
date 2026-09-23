<script setup>
import { Download, FileText, Loader2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { toast } from '@/composables/useToast'
import { formatRelativeDay } from '@/lib/utils'

defineProps({ reports: { type: Array, required: true } })

const download = (report) =>
  toast({ title: 'Download started', description: `${report.title} · ${report.size}`, variant: 'success' })
</script>

<template>
  <ul class="-my-3 divide-y">
    <li v-for="report in reports" :key="report.id" class="flex items-center gap-3 py-3">
      <div class="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
        <FileText class="size-4" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium">{{ report.title }}</p>
        <p class="truncate text-xs text-muted-foreground">
          {{ report.type }} · {{ formatRelativeDay(report.date) }}<template v-if="report.status === 'ready'"> · {{ report.size }}</template>
        </p>
      </div>
      <Button
        v-if="report.status === 'ready'"
        variant="ghost"
        size="icon-sm"
        :aria-label="`Download ${report.title}`"
        @click="download(report)"
      >
        <Download />
      </Button>
      <span v-else-if="report.status === 'processing'" class="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 class="size-3.5 animate-spin" /> Generating
      </span>
      <StatusBadge v-else :status="report.status" />
    </li>
  </ul>
</template>
