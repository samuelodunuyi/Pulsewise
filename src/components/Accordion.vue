<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="flex flex-col whitespace-nowrap justify-between w-full"
    v-for="label in labels"
    :key="label.id"
  >
    <router-link
      to=""
      class="p-4 mt-3 hover:bg-blue-600 w-full flex no-underline text-white"
      @click.prevent="toggleSection(label.id)"
    >
      <span class="material-symbols-outlined text-base text-[18px] ml-2 mr-4">
        {{ label.icon }}
      </span>
      <p class="accordion-header">{{ label.title }}</p>
      <span class="down-Arrow ml-auto border-none" v-show="!label.open">&#9660;</span>
      <span class="up-Arrow ml-auto border-none" v-show="label.open">&#9650;</span>
    </router-link>
    <div
      class="bg-slate-100 text-[#4E4E4E] py-4 font-[14px] text-left pl-[55px] hover:text-dashboard-primary text-sm"
      v-for="content in label.label"
      :key="content.id"
      v-show="label.open"
    >
      <router-link v-if="label.open" to="">{{ content }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  labels: Object
})

const labels = ref(props.labels)

const toggleSection = (index) => {
  for (let i = 0; i < labels.value.length; i++) {
    if (i === index - 1) {
      labels.value[i].open = !labels.value[i].open
    } else {
      labels.value[i].open = false
    }
  }
}
</script>

<style>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 500,
    'GRAD' 0,
    'opsz' 48;
}
</style>
