<template>
  <div class="w-screen h-screen">
    <div
      class="flex flex-col items-center w-full h-full min-h-[600px] text-xl font-medium text-slate-700 bg-cover overflow-auto"
      style="background-image: url('http://medboard.b-cdn.net/medboard/signup.gif')"
    >
      <HeaderView />
      <div
        class="flex flex-col justify-center items-center h-[70%] w-full text-xl font-medium text-slate-700"
      >
        <div class="w-[30%] font-bold text-[40px] my-5">
          <h3 class="text-center">Account Login</h3>
        </div>
        <form
          class="flex items-center justify-center bg-slate-500/40 rounded-lg min-w-[300px] px-8 py-4 w-[30%]"
          method="post"
        >
          <div class="flex flex-col w-full">
            <div class="flex flex-col w-full">
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
                  v-model="login.email"
                />
              </div>
              <div class="flex flex-col w-full">
                <div class="my-3 mx-4">
                  <div class="pb-3"><label for="password">Password</label><br /></div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    class="pl-4 py-2 rounded-lg outline-none shadow focus:outline-cyan-700 focus:outline-4 w-full"
                    required
                    autocomplete="on"
                    v-model="login.password"
                  />
                </div>
              </div>
              <div class="w-full text-center justify-center py-2 px-4 flex text-white">
                <button
                  type="submit"
                  class="w-[95%] py-2 rounded-full bg-cyan-700 hover:bg-cyan-900"
                  @click.prevent="loginUser"
                >
                  Login
                </button>
              </div>
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

const base = axios.create({
  baseURL: 'https://medboard.onrender.com/api/v1' // replace on production env
})
const login = reactive({})

const loginUser = () => {
  base
    .post('/login', login)
    .then((result) => {
      if (result.accesstkn) {
        router.push('/home')
      } else {
        router.push('/')
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>

<style scoped>
input {
  width: 100%;
}
</style>
