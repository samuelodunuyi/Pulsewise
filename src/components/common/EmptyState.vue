<script setup>
defineProps({
  icon: { type: [Object, Function], required: true },
  title: { type: String, required: true },
  description: String
})
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-16 text-center">
    <div class="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
      <component :is="icon" class="size-6" />
    </div>
    <h2 class="mt-4 font-semibold">{{ title }}</h2>
    <p v-if="description" class="mt-1 max-w-sm text-sm text-muted-foreground">{{ description }}</p>
    <div v-if="$slots.default" class="mt-6 flex flex-wrap justify-center gap-2">
      <slot />
    </div>
  </div>
</template>
