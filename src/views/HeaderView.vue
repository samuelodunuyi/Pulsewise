<template>
  <div class="flex justify-end py-3 flex-row w-full text-center text-white">
    <div
      v-if="path == '/signup'"
      class="w-[150px] mx-6 py-2 rounded-full bg-cyan-800 hover:bg-cyan-950"
    >
      <router-link to="/"><div>Login</div></router-link>
    </div>
    <div v-if="path == '/'" class="w-[150px] mx-6 py-2 rounded-full bg-cyan-800 hover:bg-cyan-950">
      <router-link to="/signup"><div class="">Signup</div></router-link>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const path = route.path
</script>
