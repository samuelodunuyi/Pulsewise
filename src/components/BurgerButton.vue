<template>
  <div>
    <button @click="toggle">
      <span class="material-symbols-outlined my-auto mr-auto text-[35px]"> menu </span>
    </button>
  </div>
</template>

<script setup>
function toggle() {
  sideBar.state = !sideBar.state
}

import { sideBar } from '../showModal'
</script>

<style lang="scss" scoped></style>
