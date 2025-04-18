<template>
  <div>
    <Dialog
      v-model:visible="showModal.report"
      modal
      header="Generate report"
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
        <form @submit="onSubmit" class="box-border">
          <div class="flex justify-between flex-row">
            <div class="flex flex-col mr-2 min-w-[100px] w-[300px]">
              <label for="name" class="mb-2 mt-2 text-black">Patient Name</label>
              <InputText id="name" type="text" placeholder="Enter name" class="h-10" />
            </div>
            <div class="flex flex-col mr-2 min-w-[100px] w-[300px]">
              <label for="bday" class="mb-2 mt-2 text-black">Date of Birth</label>
              <Calendar
                id="bday"
                v-model="value"
                show-icon
                :class="{ 'p-invalid': errorMessage }"
                class="h-10"
                placeholder="dd / mm / yyyy"
              />
            </div>
            <div class="flex flex-col mr-2 min-w-[100px] w-[300px]">
              <label for="address" class="mb-2 mt-2 text-black">Address</label>
              <InputText id="address" type="text" placeholder="Enter Address" class="h-10" />
            </div>
          </div>
          <div class="flex flex-row justify-between">
            <div class="flex flex-col mr-2 min-w-[100px] w-[300px]">
              <label class="mb-2 mt-8 text-black" for="number">Phone no.</label>
              <InputText id="number" type="phone" placeholder="Enter Phone no." class="h-10" />
            </div>
            <div class="flex flex-col mr-2 min-w-[100px] w-[300px]">
              <label class="mb-2 mt-8 text-black" for="report">Report Type</label>
              <InputText id="report" type="text" placeholder="Diseases Report" class="h-10" />
            </div>
            <div class="flex flex-col mr-2 min-w-[100px] w-[300px]">
              <label class="mb-2 mt-8 text-black" for="report-period"> Report Period </label>
              <InputText id="report-period" type="text" placeholder="Report Period" class="h-10" />
            </div>
          </div>
          <div class="flex flex-row">
            <div class="flex flex-col mb-[50px] mr-[380px] min-w-[100px] w-[292px]">
              <label class="mb-2 mt-8 text-black" for="appointment">Appointment With</label>
              <InputText
                id="appointment"
                type="text"
                placeholder="Enter Doctor's Name"
                class="h-10"
              />
            </div>
          </div>
          <div class="flex">
            <div class="mr-3 text-sm font-Lato font-light">
              <Button label="Generate Report" severity="warning" style="font-size: 14px" />
            </div>
            <div class="">
              <Button label="Generate & Print" severity="info" style="font-size: 14px" />
            </div>
          </div>
        </form>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { useField, useForm } from 'vee-validate'
import { showModal } from '../showModal'

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
    console.log('submitted')
    resetForm()
  }
})
</script>
