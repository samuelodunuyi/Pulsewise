<template>
  <div
    class="w-full p-2 mb-0 bg-dashboard-primary border-x-[20px] border-s-dashboard-primary border-r-dashboard-primary flex flex-wrap items-center relative justify-between header-shadow"
  >
    <div class="flex justify-between items-center h-[70px] text-white">
      <BurgerButton />
    </div>
    <div>
      <ul class="flex flex-wrap items-center text-white h-full list-none">
        <!-- Appointment Button -->
        <li class="p-3" @click="appointment">
          <router-link to="">
            <span class="material-symbols-outlined align-sub px-1 text-[28px]">
              calendar_month
            </span>
            Make an appointment
          </router-link>
        </li>
        <!-- Prescription Button -->
        <li class="p-3" @click="prescribe">
          <router-link to="">
            <span class="material-symbols-outlined align-sub px-1 text-[28px]"> edit </span>
            Write a prescribtion
          </router-link>
        </li>
        <!-- Report Button -->
        <li class="p-3" @click="report">
          <router-link class="" to="">
            <span class="material-symbols-outlined align-sub px-1 text-[28px]"> note_alt </span>
            Generate Report
          </router-link>
        </li>
        <!-- Notification Button -->
        <li class="p-3" @click="notify">
          <router-link to="" class="relative">
            <span class="material-symbols-outlined align-middle text-[28px]"> notifications </span>
            <span class="notification-badge" />
          </router-link>
          <Menu
            ref="notification"
            :popup="true"
            id="overlay_menu"
            :pt="{ root: { style: { width: '300px' } } }"
          >
            <template #start>
              <ul>
                <li>
                  <div
                    class="flex items-center float-left justify-center text-center h-[40px] ml-2"
                  >
                    <span class="pr-2 text-slate-400 font-medium">Notifications</span>
                    <Chip
                      :pt="{
                        root: { style: { background: '#009efb' } }
                      }"
                    >
                      <div
                        class="text-white h-4 w-5 flex justify-center items-center text-xs font-bold"
                      >
                        <span class="border-circle">4</span>
                        <span class="pl-1">New</span>
                      </div>
                    </Chip>
                  </div>
                </li>
                <Divider :pt="{ root: { style: { 'margin-top': '0', 'margin-bottom': '0px' } } }" />
                <div class="py-2 hover:bg-slate-200" :key="note.id" v-for="note in isNotification">
                  <router-link to="" class="">
                    <li>
                      <div class="flex flex-col w-full px-2">
                        <span>{{ note.label }}</span>
                        <span class="text-xs text-slate-400 flex items-center">
                          <span class="material-symbols-outlined text-sm pr-1"> schedule </span>
                          {{ note.time }} mins ago</span
                        >
                      </div>
                    </li>
                  </router-link>
                </div>
                <Divider :pt="{ root: { style: { 'margin-top': '0', 'margin-bottom': '0px' } } }" />
                <div
                  class="pt-1 hover:text-dashboard-primary transition ease-in-out text-black duration-300"
                >
                  <router-link to="" class="">
                    <li>
                      <div class="flex mx-auto justify-center">
                        <span>View all Notifications</span>
                      </div>
                    </li>
                  </router-link>
                </div>
              </ul>
            </template>
          </Menu>
        </li>
        <!-- PROFILE MENU -->
        <li class="p-3" @click="show">
          <router-link to="">
            <img
              src="https://slidesigma.nyc/templatemonster/angular/medboard/assets/img/dashboard/doctor-3.jpg"
              class="rounded-full w-[40px] float-right"
            />
          </router-link>
          <Menu
            :model="profileMenu"
            ref="menu"
            id="overlay_menu"
            :popup="true"
            class="overlay_menu"
          >
            <template #start>
              <span class="w-full mx-auto text-center p-2 text-slate-500 font-Lato my-2 flex"
                >Welcome Dr.Samuel Deo</span
              >
            </template>
          </Menu>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import { ref } from 'vue'
import BurgerButton from './BurgerButton.vue'
import profileDropdown from '../data/profileDropdown.json'
import { showModal } from '../showModal'
import notificationData from '../data/notificationData.json'

const profileMenu = ref(profileDropdown)
const menu = ref()
const notification = ref()
const isNotification = ref(notificationData)

const show = (event) => {
  menu.value.toggle(event)
}

const notify = (event) => {
  notification.value.toggle(event)
}

const appointment = () => {
  showModal.appointment = !showModal.appointment
}

const prescribe = () => {
  showModal.prescribe = !showModal.prescribe
}

const report = () => {
  showModal.report = !showModal.report
}
</script>

<style scoped>
.header-shadow {
  box-shadow: -5px 0px 18px #0579bdd5;
}

.notification-badge {
  content: '';
  position: absolute;
  top: 2px;
  right: 1px;
  width: 10px;
  height: 10px;
  border: 1px solid white;
  border-radius: 50%;
  background-color: red;
  color: red;
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style>
