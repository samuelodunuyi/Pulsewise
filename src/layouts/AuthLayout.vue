<script setup>
import { RouterLink } from 'vue-router'
import BrandLogo from '@/components/common/BrandLogo.vue'

defineProps({
  title: { type: String, required: true },
  description: String
})

const highlights = [
  { value: '4.9k', label: 'Appointments / month' },
  { value: '124', label: 'Doctors on staff' },
  { value: '18 min', label: 'Average wait time' }
]
</script>

<template>
  <div class="grid min-h-screen lg:grid-cols-2">
    <aside class="relative hidden overflow-hidden bg-sidebar p-10 text-white lg:flex lg:flex-col">
      <div
        class="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-sidebar-primary/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -bottom-40 -left-20 size-[26rem] rounded-full bg-chart-2/20 blur-3xl"
        aria-hidden="true"
      />
      <RouterLink to="/" class="relative self-start">
        <BrandLogo tone="sidebar" />
      </RouterLink>

      <div class="relative mt-auto max-w-md">
        <p class="text-3xl font-semibold leading-tight tracking-tight">
          Run your hospital from one calm, clear dashboard.
        </p>
        <p class="mt-4 text-sidebar-foreground">
          Appointments, patients, staff and reporting — all in one place, on any device.
        </p>
        <dl class="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
          <div v-for="h in highlights" :key="h.label">
            <dt class="text-xs text-sidebar-muted">{{ h.label }}</dt>
            <dd class="mt-1 text-xl font-semibold tabular-nums">{{ h.value }}</dd>
          </div>
        </dl>
      </div>
    </aside>

    <main class="flex items-center justify-center px-4 py-12 sm:px-8">
      <div class="w-full max-w-sm">
        <RouterLink to="/" class="mb-8 inline-flex lg:hidden">
          <BrandLogo />
        </RouterLink>
        <h1 class="text-2xl font-semibold tracking-tight">{{ title }}</h1>
        <p v-if="description" class="mt-1.5 text-sm text-muted-foreground">{{ description }}</p>
        <div class="mt-8">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>
