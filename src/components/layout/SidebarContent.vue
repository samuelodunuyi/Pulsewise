<script setup>
import { RouterLink, useRoute } from 'vue-router'
import Avatar from '@/components/ui/Avatar.vue'
import BrandLogo from '@/components/common/BrandLogo.vue'
import { navigation } from '@/config/navigation'
import { useHospital } from '@/stores/hospital'
import { cn } from '@/lib/utils'

// Rendered by both the desktop sidebar and the mobile sheet.
defineProps({ collapsed: Boolean })

const route = useRoute()
const { currentUser } = useHospital()

const isActive = (to) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

<template>
  <div class="flex h-full flex-col bg-sidebar text-sidebar-foreground">
    <RouterLink
      to="/"
      :class="cn('flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-5', collapsed && 'justify-center px-0')"
    >
      <BrandLogo tone="sidebar" :show-name="!collapsed" />
    </RouterLink>

    <nav class="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Main">
      <div v-for="group in navigation" :key="group.label">
        <p v-if="!collapsed" class="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
          {{ group.label }}
        </p>
        <div v-else class="mx-auto mb-3 h-px w-6 bg-sidebar-border" />
        <ul class="space-y-0.5">
          <li v-for="item in group.items" :key="item.to">
            <RouterLink
              :to="item.to"
              :title="collapsed ? item.title : undefined"
              :aria-current="isActive(item.to) ? 'page' : undefined"
              :class="
                cn(
                  'group relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary',
                  isActive(item.to) && 'bg-sidebar-accent text-sidebar-accent-foreground',
                  collapsed && 'justify-center px-0'
                )
              "
            >
              <span
                v-if="isActive(item.to)"
                class="absolute -left-3 top-1.5 h-6 w-1 rounded-r-full bg-sidebar-primary"
                aria-hidden="true"
              />
              <component
                :is="item.icon"
                :class="
                  cn(
                    'size-[18px] shrink-0',
                    isActive(item.to) ? 'text-sidebar-primary' : 'text-sidebar-muted group-hover:text-sidebar-accent-foreground'
                  )
                "
              />
              <span v-if="!collapsed" class="truncate">{{ item.title }}</span>
              <span
                v-if="item.badge?.()"
                :class="
                  cn(
                    'grid h-5 min-w-5 place-items-center rounded-full bg-sidebar-primary px-1.5 text-[11px] font-semibold tabular-nums text-sidebar',
                    collapsed ? 'absolute right-1 top-0.5 h-4 min-w-4 px-1 text-[10px]' : 'ml-auto'
                  )
                "
              >
                {{ item.badge() }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <div :class="cn('flex items-center gap-3 border-t border-sidebar-border p-4', collapsed && 'justify-center px-0')">
      <Avatar :src="currentUser.avatar" :name="currentUser.name" size="sm" class="ring-2 ring-sidebar-accent" />
      <div v-if="!collapsed" class="min-w-0">
        <p class="truncate text-sm font-medium text-white">{{ currentUser.name }}</p>
        <p class="truncate text-xs text-sidebar-muted">{{ currentUser.role }}</p>
      </div>
    </div>
  </div>
</template>
