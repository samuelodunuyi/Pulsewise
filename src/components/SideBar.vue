<template>
  <div class="justify-center bg-dashboard-primary overflow-auto text-white text-center sidebar">
    <div>
      <div class="flex font-Lato font-bold items-center justify-center">
        <router-link to="" class="h-[70%] w-[70%] cursor-pointer my-4">
          <img
            src="https://slidesigma.nyc/templatemonster/angular/medboard/assets/img/medboard-logo-216x62.png"
            class="mx-auto mb-3 pt-2 w-[70%] h-[70%]"
          />
        </router-link>
      </div>
      <div>
        <router-link to="" class="cursor-pointer">
          <img
            src="https://slidesigma.nyc/templatemonster/angular/medboard/assets/img/dashboard/doctor-3.jpg"
            class="rounded-full w-[30%] h-[30%] mx-auto mb-4 ring-4 ring-white"
          />
        </router-link>
      </div>
      <h5 class="font-bold text-lg my-2">Dr.Samuel</h5>
      <h6>Admin</h6>
    </div>
    <div>
      <Accordion :labels="label" />
    </div>
  </div>
</template>

<script setup>
import Accordion from './Accordion.vue'
import labels from '../data/label.json'
import { ref } from 'vue'

const label = ref(labels)
</script>

<style scoped>
.sidebar::-webkit-scrollbar {
  width: 14px;
}
.sidebar::-webkit-scrollbar-thumb {
  background-clip: content-box;
  border: 4px solid transparent;
  border-radius: 7px;
  box-shadow: inset 0 0 0 10px;
  display: none;
}

.sidebar:hover::-webkit-scrollbar-thumb {
  display: block;
}

.sidebar::-webkit-scrollbar-button {
  width: 0;
  height: 0;
  display: none;
}
.sidebar::-webkit-scrollbar-corner {
  background-color: white;
}
</style>
