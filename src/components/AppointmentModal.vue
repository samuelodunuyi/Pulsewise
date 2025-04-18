<template>
  <div>
    <Dialog
      v-model:visible="showModal.appointment"
      modal
      header="Make an Appointment"
      :style="{ width: '50vw' }"
      :pt="{
        header: { style: { 'background-color': '#009efb', color: 'white' } },
        closeButtonIcon: { style: { color: 'black' } },
        content: { class: 'font-Lato', style: { 'padding-left': '40px' } },
        headerTitle: { class: 'font-Lato', style: { 'font-size': '24px' } }
      }"
    >
      <h6 class="font-extrabold text-black mt-6 font-Lato">PATIENT INFORMATION</h6>
      <Divider />
      <div>
        <form @submit="onSubmit" class="">
          <div class="flex justify-between flex-row">
            <div class="flex flex-col mr-2 min-w-[100px] w-[300px]">
              <label for="name" class="mb-2 mt-2 text-black">Patient Name</label>
              <InputText id="name" type="text" placeholder="Enter name" class="h-10" />
            </div>
            <div class="flex flex-col mr-2 min-w-[100px] w-[300px]">
              <label class="mb-2 mt-2 text-black">Date of Birth</label>
              <Calendar
                v-model="value"
                show-icon
                :class="{ 'p-invalid': errorMessage }"
                class="h-10"
                placeholder="dd / mm / yyyy"
              />
            </div>
            <div class="flex flex-col mr-2 min-w-[100px] w-[300px]">
              <label for="disease" class="mb-2 mt-2 text-black">Disease</label>
              <InputText id="disease" type="text" placeholder="Disease" class="h-10" />
            </div>
          </div>
          <div class="flex flex-row justify-between">
            <div class="flex flex-col mr-2 min-w-[100px] w-[300px]">
              <label class="mb-2 mt-8 text-black" for="address">Address</label>
              <InputText id="address" type="text" placeholder="Enter address" class="h-10" />
            </div>
            <div class="flex flex-col mr-2 min-w-[100px] w-[300px]">
              <label class="mb-2 mt-8 text-black" for="phone">Phone no.</label>
              <InputText id="phone" type="phone" placeholder="Acetaminophen" class="h-10" />
            </div>
            <div class="flex flex-col mr-2 min-w-[100px] w-[300px]">
              <label class="mb-2 mt-8 text-black" for="location"> Department Name</label>
              <InputText id="location" type="text" placeholder="Department" class="h-10" />
            </div>
          </div>
          <div class="flex flex-row justify-between">
            <div class="flex flex-col mb-[50px] mr-2 min-w-[100px] w-[300px]">
              <label class="mb-2 mt-8 text-black" for="appointment">Appointment With</label>
              <InputText
                id="appointment"
                type="text"
                placeholder="Enter Doctor's Name"
                class="h-10"
              />
            </div>
            <div class="flex flex-col mr-2 min-w-[100px] w-[300px] mb-[50px]">
              <label class="mb-2 mt-8 text-black">Appointment Date</label>
              <Calendar show-icon class="h-10" placeholder="dd / mm / yyyy" />
            </div>
            <div class="flex flex-col ml-1 mb-[50px] min-w-[200px] mr-2 w-[300px]">
              <label class="mb-2 mt-8 text-black">Sex</label>
              <div class="flex flex-row">
                <div @click="checked.female = false">
                  <Checkbox
                    value="male"
                    :binary="true"
                    class="mt-2"
                    inputId="male"
                    v-model="checked.male"
                  />
                  <label for="male" class="ml-3 mr-3 text-left">Male</label>
                </div>
                <div @click="checked.male = false">
                  <Checkbox
                    value="female"
                    :binary="true"
                    class="mt-2"
                    inputId="female"
                    v-model="checked.female"
                  />
                  <label for="female" class="ml-3">Female</label>
                </div>
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="mr-3 text-sm font-Lato font-light">
              <Button label="Reset" severity="warning" style="font-size: 14px" />
            </div>
            <div class="">
              <Button label="Add Appointment" severity="info" style="font-size: 14px" />
            </div>
          </div>
        </form>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { showModal } from '../showModal'

const checked = ref({ male: false, female: true })
const { handleSubmit, resetForm } = useForm()
const { value, errorMessage } = useField('date', validateField)

function validateField(date) {
  if (!date) {
    return 'Date is required'
  }
  return true
}

const onSubmit = handleSubmit((values) => {
  if (values.value) {
    resetForm()
  }
})
</script>
