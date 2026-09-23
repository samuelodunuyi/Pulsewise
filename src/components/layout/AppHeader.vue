<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from 'radix-vue'
import { Bell, LogOut, Menu, Moon, PanelLeft, Plus, RotateCcw, Search, Settings, Sun, User } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Avatar from '@/components/ui/Avatar.vue'
import DropdownContent from '@/components/ui/DropdownContent.vue'
import DropdownItem from '@/components/ui/DropdownItem.vue'
import { quickActions } from '@/config/forms'
import { useSidebar } from '@/composables/useSidebar'
import { useTheme } from '@/composables/useTheme'
import { useFormDialog } from '@/composables/useFormDialog'
import { confirm } from '@/composables/useConfirm'
import { toast } from '@/composables/useToast'
import { useHospital, unreadCount, markAllRead, resetDemoData } from '@/stores/hospital'
import { cn, timeAgo } from '@/lib/utils'

const route = useRoute()
const router = useRouter()
const { toggleCollapsed, openMobile } = useSidebar()
const { isDark, toggleTheme } = useTheme()
const { openForm } = useFormDialog()
const hospital = useHospital()

const search = ref('')
function submitSearch() {
  router.push({ path: '/patients', query: search.value ? { q: search.value } : {} })
  search.value = ''
}

const separator = '-mx-1 my-1 h-px bg-border'

async function resetData() {
  const ok = await confirm({
    title: 'Reset demo data?',
    description: 'All your changes are discarded and the original sample data is restored.',
    confirmLabel: 'Reset'
  })
  if (!ok) return
  resetDemoData()
  toast({ title: 'Demo data reset', variant: 'success' })
  router.push('/')
}
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md sm:gap-3 sm:px-6 lg:px-8"
  >
    <Button variant="ghost" size="icon" class="-ml-2 lg:hidden" aria-label="Open menu" @click="openMobile">
      <Menu />
    </Button>
    <Button variant="ghost" size="icon" class="-ml-2 hidden lg:inline-flex" aria-label="Toggle sidebar" @click="toggleCollapsed">
      <PanelLeft />
    </Button>
    <span class="hidden h-5 w-px bg-border lg:block" aria-hidden="true" />
    <p class="truncate text-sm font-medium">{{ route.meta.title }}</p>

    <div class="ml-auto flex items-center gap-1 sm:gap-2">
      <form role="search" class="relative hidden md:block" @submit.prevent="submitSearch">
        <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="search" type="search" placeholder="Search patients…" class="w-52 bg-muted/50 pl-9 shadow-none lg:w-64" aria-label="Search patients" />
      </form>

      <!-- Quick actions -->
      <DropdownMenuRoot>
        <DropdownMenuTrigger as-child>
          <Button class="max-sm:size-9 max-sm:px-0" aria-label="Create">
            <Plus /><span class="hidden sm:inline">Create</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownContent>
          <DropdownItem v-for="action in quickActions" :key="action.key" @select="openForm(action.key)">
            <component :is="action.icon" /> {{ action.label }}
          </DropdownItem>
        </DropdownContent>
      </DropdownMenuRoot>

      <Button variant="ghost" size="icon" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggleTheme">
        <Sun v-if="isDark" /><Moon v-else />
      </Button>

      <!-- Notifications -->
      <DropdownMenuRoot>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="relative" :aria-label="`Notifications (${unreadCount} unread)`">
            <Bell />
            <span
              v-if="unreadCount"
              class="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground ring-2 ring-background"
            >
              {{ unreadCount }}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownContent class="w-80 p-0">
          <div class="flex items-center justify-between px-4 py-3">
            <DropdownMenuLabel class="text-sm font-semibold">Notifications</DropdownMenuLabel>
            <button
              v-if="unreadCount"
              class="text-xs font-medium text-primary hover:underline"
              @click="markAllRead"
            >
              Mark all as read
            </button>
          </div>
          <DropdownMenuSeparator class="h-px bg-border" />
          <div class="max-h-80 overflow-y-auto p-1">
            <DropdownItem v-for="n in hospital.notifications" :key="n.id" class="items-start gap-3 px-3 py-2.5" @select="n.read = true">
              <span :class="cn('mt-1.5 size-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-primary')" />
              <span class="min-w-0">
                <span :class="cn('block text-sm', !n.read && 'font-medium')">{{ n.title }}</span>
                <span class="block text-xs text-muted-foreground">{{ timeAgo(n.minutesAgo) }}</span>
              </span>
            </DropdownItem>
          </div>
        </DropdownContent>
      </DropdownMenuRoot>

      <!-- Profile -->
      <DropdownMenuRoot>
        <DropdownMenuTrigger
          class="ml-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Account menu"
        >
          <Avatar :src="hospital.currentUser.avatar" :name="hospital.currentUser.name" size="sm" />
        </DropdownMenuTrigger>
        <DropdownContent class="w-56">
          <DropdownMenuLabel class="px-2 py-1.5">
            <p class="text-sm font-medium">{{ hospital.currentUser.name }}</p>
            <p class="truncate text-xs text-muted-foreground">{{ hospital.currentUser.email }}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator :class="separator" />
          <DropdownItem><User /> Profile</DropdownItem>
          <DropdownItem><Settings /> Settings</DropdownItem>
          <DropdownItem @select="resetData"><RotateCcw /> Reset demo data</DropdownItem>
          <DropdownMenuSeparator :class="separator" />
          <DropdownItem @select="router.push('/login')"><LogOut /> Sign out</DropdownItem>
        </DropdownContent>
      </DropdownMenuRoot>
    </div>
  </header>
</template>
