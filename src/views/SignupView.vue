<template>
  <div class="w-screen h-screen">
    <div
      class="flex flex-col items-center w-full h-full min-h-[600px] text-xl font-medium text-slate-700 bg-cover overflow-auto"
      style="background-image: url('http://medboard.b-cdn.net/medboard/signup.gif')"
    >
      <HeaderView />
      <div class="w-full h-full flex justify-center items-center flex-col mx-auto">
        <div class="w-[50%] font-bold text-[40px] my-5">
          <h3 class="text-center">Create an Account</h3>
        </div>

        <form
          class="flex items-center justify-center bg-slate-500/40 rounded-lg min-w-[300px] w-[40%] py-4"
          method="post"
        >
          <!--Form Wrapper  -->
          <div class="flex flex-col w-[90%]">
            <div class="flex flex-row w-full">
              <div class="my-3 mx-4 w-[50%]">
                <div class="pb-3"><label for="fname">First Name</label><br /></div>
                <input
                  type="text"
                  name="fname"
                  id="fname"
                  placeholder="First Name"
                  class="pl-4 py-2 rounded-lg outline-none shadow focus:outline-cyan-700 focus:outline-4"
                  required
                  autocomplete="on"
                  v-model="signup.firstName"
                />
              </div>
              <div class="my-3 mx-4 w-[50%]">
                <div class="pb-3"><label for="lname">Last Name</label><br /></div>
                <input
                  type="text"
                  name="lname"
                  id="lname"
                  placeholder="Last Name"
                  class="pl-4 py-2 rounded-lg outline-none shadow focus:outline-cyan-700 focus:outline-4"
                  required
                  autocomplete="on"
                  v-model="signup.lastName"
                />
              </div>
            </div>
            <div class="flex w-full flex-row">
              <div class="my-3 mx-4 w-full">
                <div class="pb-3 w-full">
                  <label for="account-type">Select Account Type</label>
                </div>
                <select
                  name="account-types"
                  id="account-type"
                  class="rounded-md w-full pl-4 py-2 text-center outline-none shadow focus:outline-cyan-700 focus:outline-4"
                  v-model="signup.accountType"
                  required
                >
                  <option value="patient" selected>Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="surgeon">Surgeon</option>
                  <option value="pharmacist">Pharmacist</option>
                </select>
              </div>
            </div>
            <div class="flex flex-row w-full">
              <div v-if="isPatient()" class="my-3 mx-4 w-full">
                <div class="pb-3"><label for="mln">Medical License Number</label><br /></div>
                <input
                  type="text"
                  name="mln"
                  id="mln"
                  placeholder="M.L.N"
                  class="pl-4 py-2 rounded-lg outline-none shadow focus:outline-cyan-700 focus:outline-4 w-full kit"
                  required
                  autocomplete="on"
                  maxlength="8"
                  pattern="^[0-9]{1,8}$"
                  v-model="signup.mln"
                />
              </div>
            </div>
            <div class="my-3 mx-4">
              <div class="pb-3"><label for="email">Email</label><br /></div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                class="pl-4 py-2 rounded-lg outline-none shadow focus:outline-cyan-700 focus:outline-4"
                required
                autocomplete="on"
                v-model="signup.email"
              />
            </div>
            <div class="flex flex-row w-full">
              <div class="my-3 mx-4 w-full">
                <div class="pb-3"><label for="password">Password</label><br /></div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  class="pl-4 py-2 rounded-lg outline-none shadow focus:outline-cyan-700 focus:outline-4 w-full"
                  required
                  autocomplete="on"
                  v-model="signup.password"
                />
              </div>
            </div>
            <div class="w-full text-center justify-center py-2 px-4 flex text-white">
              <button
                type="submit"
                class="w-[95%] py-2 rounded-full bg-cyan-700 hover:bg-cyan-900"
                @click.prevent="signupUser"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderView from './HeaderView.vue'
import { reactive } from 'vue'
import axios from 'axios'
import router from '../router'

const signup = reactive({})

const base = axios.create({
  baseURL: 'https://medboard.onrender.com/api/v1' // replace on production env
})

const signupUser = () => {
  base
    .post('/signup', signup)
    .then((result) => {
      console.log(result)
      router.push('/home')
    })
    .catch((err) => {
      console.log(err)
    })
}

const isPatient = () => {
  if (signup.accountType == 'patient' || signup.accountType == undefined) {
    return false
  }
  return true
}
</script>

<style scoped>
input {
  width: 100%;
}
</style>
