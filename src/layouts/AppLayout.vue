<script setup>
import { watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Sheet from '@/components/ui/Sheet.vue'
import SidebarContent from '@/components/layout/SidebarContent.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import FormDialog from '@/components/forms/FormDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useSidebar } from '@/composables/useSidebar'
import { cn } from '@/lib/utils'

const { collapsed, mobileOpen } = useSidebar()
const route = useRoute()

watch(() => route.fullPath, () => (mobileOpen.value = false))
</script>

<template>
  <div class="min-h-screen">
    <aside
      :class="
        cn(
          'fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-300 ease-in-out lg:block',
          collapsed ? 'w-[72px]' : 'w-64'
        )
      "
    >
      <SidebarContent :collapsed="collapsed" />
    </aside>

    <Sheet v-model:open="mobileOpen" title="Navigation">
      <SidebarContent />
    </Sheet>

    <div :class="cn('min-w-0 transition-[padding] duration-300 ease-in-out', collapsed ? 'lg:pl-[72px]' : 'lg:pl-64')">
      <AppHeader />
      <main class="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <RouterView />
      </main>
    </div>

    <FormDialog />
    <ConfirmDialog />
  </div>
</template>
