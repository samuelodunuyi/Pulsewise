<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown, ArrowUp, ChevronsUpDown, ChevronLeft, ChevronRight, Search, SearchX } from 'lucide-vue-next'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { cn } from '@/lib/utils'

/**
 * Generic table used everywhere we list records.
 * columns: [{ key, label, sortable?, sortValue?(row), class?, align? }]
 * Custom cells: <template #cell-<key>="{ row, value }">
 */
const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  rowKey: { type: String, default: 'id' },
  searchKeys: { type: Array, default: () => [] },
  searchPlaceholder: { type: String, default: 'Search…' },
  initialSearch: { type: String, default: '' },
  pageSize: { type: Number, default: 0 },
  emptyText: { type: String, default: 'No records found' },
  flush: Boolean, // edge-to-edge inside a Card
  rowTo: Function // row → route; makes whole rows clickable
})

const router = useRouter()

function onRowClick(event, row) {
  if (!props.rowTo || event.target.closest('a, button, input, select')) return
  router.push(props.rowTo(row))
}

const query = ref(props.initialSearch)
const sortKey = ref(null)
const sortDir = ref('asc')
const page = ref(1)

watch(() => props.initialSearch, (value) => (query.value = value))

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.rows
  return props.rows.filter((row) => props.searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(q)))
})

const sorted = computed(() => {
  const column = props.columns.find((c) => c.key === sortKey.value)
  if (!column) return filtered.value
  const value = column.sortValue ?? ((row) => row[column.key])
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...filtered.value].sort((a, b) => {
    const [x, y] = [value(a), value(b)]
    return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y))) * dir
  })
})

const pageCount = computed(() => (props.pageSize ? Math.max(1, Math.ceil(sorted.value.length / props.pageSize)) : 1))
const visible = computed(() =>
  props.pageSize ? sorted.value.slice((page.value - 1) * props.pageSize, page.value * props.pageSize) : sorted.value
)
const range = computed(() => {
  const start = sorted.value.length ? (page.value - 1) * props.pageSize + 1 : 0
  return `${start}–${Math.min(page.value * props.pageSize, sorted.value.length)}`
})

watch([query, () => props.rows.length], () => (page.value = 1))

function toggleSort(column) {
  if (!column.sortable) return
  if (sortKey.value !== column.key) {
    sortKey.value = column.key
    sortDir.value = 'asc'
  } else if (sortDir.value === 'asc') {
    sortDir.value = 'desc'
  } else {
    sortKey.value = null
  }
}

const ariaSort = (column) =>
  sortKey.value === column.key ? (sortDir.value === 'asc' ? 'ascending' : 'descending') : undefined

const alignClass = (column) => (column.align === 'right' ? 'text-right' : '')
const edge = computed(() => (props.flush ? 'first:pl-5 last:pr-5' : ''))
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-if="searchKeys.length || $slots.toolbar" :class="cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', flush && 'px-5')">
      <div v-if="searchKeys.length" class="relative w-full sm:max-w-xs">
        <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="query" type="search" :placeholder="searchPlaceholder" class="pl-9" aria-label="Search table" />
      </div>
      <slot name="toolbar" />
    </div>

    <div :class="cn('overflow-x-auto', !flush && 'rounded-lg border')">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-y bg-muted/50 text-left">
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :aria-sort="ariaSort(column)"
              :class="cn('h-10 whitespace-nowrap px-3 text-xs font-medium text-muted-foreground', edge, alignClass(column), column.class)"
            >
              <button
                v-if="column.sortable"
                type="button"
                class="-mx-1 inline-flex items-center gap-1 rounded px-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                @click="toggleSort(column)"
              >
                {{ column.label }}
                <ArrowUp v-if="sortKey === column.key && sortDir === 'asc'" class="size-3.5" />
                <ArrowDown v-else-if="sortKey === column.key" class="size-3.5" />
                <ChevronsUpDown v-else class="size-3.5 opacity-50" />
              </button>
              <span v-else>{{ column.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="row in visible"
            :key="row[rowKey]"
            :class="cn('transition-colors hover:bg-muted/40', rowTo && 'cursor-pointer')"
            @click="onRowClick($event, row)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="cn('h-14 whitespace-nowrap px-3', edge, alignClass(column), column.class)"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
          <tr v-if="!visible.length">
            <td :colspan="columns.length" class="py-12 text-center">
              <SearchX class="mx-auto mb-2 size-6 text-muted-foreground/60" />
              <p class="text-sm text-muted-foreground">{{ emptyText }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="pageSize && sorted.length > pageSize"
      :class="cn('flex items-center justify-between gap-4 text-sm text-muted-foreground', flush && 'px-5')"
    >
      <p class="tabular-nums">Showing {{ range }} of {{ sorted.length }}</p>
      <div class="flex items-center gap-1">
        <Button variant="outline" size="icon-sm" :disabled="page === 1" aria-label="Previous page" @click="page--">
          <ChevronLeft />
        </Button>
        <span class="px-2 tabular-nums">{{ page }} / {{ pageCount }}</span>
        <Button variant="outline" size="icon-sm" :disabled="page === pageCount" aria-label="Next page" @click="page++">
          <ChevronRight />
        </Button>
      </div>
    </div>
  </div>
</template>
