<script setup>
import Avatar from '@/components/ui/Avatar.vue'

defineProps({
  name: { type: String, required: true },
  subtitle: String,
  src: String,
  size: { type: String, default: 'md' }
})
</script>

<template>
  <div class="flex min-w-0 items-center gap-3">
    <Avatar :src="src" :name="name" :size="size" />
    <div class="min-w-0">
      <p class="truncate text-sm font-medium text-foreground">{{ name }}</p>
      <p v-if="subtitle" class="truncate text-xs text-muted-foreground">{{ subtitle }}</p>
    </div>
  </div>
</template>
