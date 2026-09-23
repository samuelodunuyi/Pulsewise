<script setup>
// Label/value pairs for record details. items: [{ label, value, class? }]
defineProps({ items: { type: Array, required: true } })
</script>

<template>
  <dl class="divide-y">
    <div v-for="item in items" :key="item.label" class="grid grid-cols-3 gap-3 py-2.5 text-sm first:pt-0 last:pb-0">
      <dt class="text-muted-foreground">{{ item.label }}</dt>
      <dd :class="['col-span-2 break-words', item.class]">{{ item.value || '—' }}</dd>
    </div>
  </dl>
</template>
