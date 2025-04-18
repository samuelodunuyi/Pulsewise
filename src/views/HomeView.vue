<template>
  <div class="flex">
    <div class="fixed">
      <SideBar
        :class="{ 'navbar-open': sideBar.state, 'navbar-closed': !sideBar.state }"
        class="navbar h-screen"
      />
    </div>
    <div
      class="w-screen h-full overflow-y-auto header-bar"
      :class="{ 'header-collapse': sideBar.state, 'header-expand': !sideBar.state }"
    >
      <HeaderBar />
      <div class="bg-slate-200">
        <ContentView />
      </div>
    </div>
  </div>
</template>

<script setup>
import SideBar from '../components/SideBar.vue'
import HeaderBar from '../components/HeaderBar.vue'
import ContentView from '../views/ContentView.vue'
import { sideBar } from '../showModal'
</script>

<style scoped>
.navbar {
  transition: width 0.3s ease-in-out;
}

.navbar-open {
  width: 250px; /* Adjust the width to your desired value */
}

.navbar-closed {
  width: 0;
  padding: 0; /* Reset padding for closed state */
}

.header-bar {
  transition: margin-left 0.3s ease-in-out;
}
.header-collapse {
  margin-left: 250px;
}

.header-expand {
  margin-left: 0;
}
</style>
