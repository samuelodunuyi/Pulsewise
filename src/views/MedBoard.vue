<template>
  <div class="px-4 py-8 max-h-[60%] font-Lato">
    <!-- First Row -->
    <!-- Doctors -->
    <div class="flex flex-row pl-1 pr-2">
      <div class="basis-1/4 max-w-[25%] px-3">
        <router-link to="">
          <div class="flex card relative rounded-lg">
            <div class="text-white font-Lato font-bold text-base pl-4 py-3">
              <h6 class="pb-4">DOCTORS</h6>
              <p class="text-2xl">4567</p>
            </div>
            <div
              class="bg-dashboard-primary rounded-l-[80px] rounded-r-lg absolute right-0 flex items-center h-full w-[30%]"
            >
              <font-awesome-icon
                icon="stethoscope"
                size="2xl"
                style="color: #ffffff"
                class="mx-auto"
              />
            </div>
          </div>
        </router-link>
      </div>
      <!-- Nurses -->
      <div class="basis-1/4 max-w-[25%] px-3">
        <router-link to="">
          <div class="flex card relative rounded-lg">
            <div class="text-white font-Lato font-bold text-base pl-4 py-3">
              <h6 class="pb-4">NURSES</h6>
              <p class="text-2xl">4567</p>
            </div>
            <div
              class="bg-dashboard-primary rounded-l-[80px] rounded-r-lg absolute right-0 flex items-center h-full w-[30%]"
            >
              <font-awesome-icon
                icon="user-plus"
                size="2xl"
                style="color: #ffffff"
                class="mx-auto"
              />
            </div>
          </div>
        </router-link>
      </div>
      <!-- Patients -->
      <div class="basis-1/4 max-w-[25%] px-3">
        <router-link to="">
          <div class="flex card relative rounded-lg">
            <div class="text-white font-Lato font-bold text-base pl-4 py-3">
              <h6 class="pb-4">PATIENTS</h6>
              <p class="text-2xl">4567</p>
            </div>
            <div
              class="bg-dashboard-primary rounded-l-[80px] rounded-r-lg absolute right-0 flex items-center h-full w-[30%]"
            >
              <font-awesome-icon
                icon="wheelchair"
                size="2xl"
                style="color: #ffffff"
                class="mx-auto"
              />
            </div>
          </div>
        </router-link>
      </div>
      <!-- Pharmacists -->
      <div class="basis-1/4 max-w-[25%] px-3">
        <router-link to="">
          <div class="flex card relative rounded-lg">
            <div class="text-white font-Lato font-bold text-base pl-4 py-3">
              <h6 class="pb-4">PHARMACISTS</h6>
              <p class="text-2xl">4567</p>
            </div>
            <div
              class="bg-dashboard-primary rounded-l-[80px] rounded-r-lg absolute right-0 flex items-center h-full w-[30%]"
            >
              <font-awesome-icon
                icon="briefcase-medical"
                size="2xl"
                style="color: #ffffff"
                class="mx-auto"
              />
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <!-- Second Row / First-->
    <div class="flex flex-row px-4 py-4 pb-2 max-h-full">
      <div class="max-w-[33.333%] basis-1/3 py-2">
        <div class="flex flex-col h-[80%]">
          <div class="mb-6 bg-white max-h-full">
            <div class="text-lg font-bold pl-5">
              <h6 class="py-5">APPOINTMENTS</h6>
              <p class="text-3xl pb-2">4,973</p>
            </div>
            <div>
              <Chart
                type="line"
                :data="chartAppointment"
                :options="chartOptions"
                class="h-[3.3rem]"
              />
            </div>
          </div>
          <div class="mb-6 bg-white max-h-full">
            <div class="text-lg font-bold pl-5">
              <h6 class="py-5">NEW PATIENTS</h6>
              <p class="text-3xl pb-2">650</p>
            </div>
            <div>
              <Chart type="line" :data="chartPatient" :options="chartOptions" class="h-[3.3rem]" />
            </div>
          </div>
          <div class="bg-white rounded-md">
            <div class="text-lg font-bold pl-5">
              <h6 class="py-5">HOSPITAL EARNING</h6>
              <p class="text-3xl pb-2">3,473</p>
            </div>
            <div>
              <Chart type="line" :data="chartEarning" :options="chartOptions" class="h-[3.3rem]" />
            </div>
          </div>
        </div>
      </div>
      <!-- Second Row / Second -->
      <div class="basis-1/3 max-w-[33.333%] py-2 px-3 flex rounded-md">
        <div class="bg-slate-300 flex justify-center w-full rounded-md">
          <Calendar v-model="date" inline showWeek class="w-full" />
        </div>
      </div>
      <!-- Second Row / Third -->
      <div class="basis-1/3 max-w-[33.333%] bg-white my-2 w-full rounded-md">
        <div class="flex flex-col items-center justify-center">
          <div class="relative flex h-[180px] w-auto">
            <img
              src="https://slidesigma.nyc/templatemonster/angular/medboard/assets/img/portfolio/gallery-4-760x260.jpg"
              alt="doctors"
            />
            <div class="absolute top-0 left-0 w-full h-full bg-dashboard-primary/[0.5]"></div>
          </div>
          <div class="flex justify-center max-w-[50%] h-auto">
            <img
              src="https://slidesigma.nyc/templatemonster/angular/medboard/assets/img/dashboard/doctor-1.jpg"
              alt="doctor"
              class="rounded-full ring-4 ring-sky-500 mt-[-20%] h-auto max-w-[33%] z-50"
            />
          </div>
        </div>
        <div class="pt-[30px] flex flex-col items-center">
          <h2 class="text-2xl text-black font-semibold">Anny Farisha</h2>
          <p class="font-normal pt-2 text-base text-black">Doctor</p>
          <p class="pt-5 font-light px-4 text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in arcu turpis. Nunc
          </p>
        </div>
        <div class="flex justify-center pt-4 h-[50px]">
          <Button label="Assign" style="background-color: #009efb">
            <span class="material-symbols-outlined pr-2"> person_add </span>
            <p>Assign</p>
          </Button>
        </div>
        <div class="w-[95%] mx-auto">
          <Divider />
        </div>
        <div class="flex flex-row items-center pb-4">
          <div class="text-center mx-auto">
            <h6 class="font-bold text-2xl">5790</h6>
            <p class="font-normal text-sm">Operations</p>
          </div>
          <div class="h-[60px] pt-1">
            <Divider layout="vertical" />
          </div>
          <div class="mx-auto text-center">
            <h6 class="font-bold text-2xl">4.5</h6>
            <p class="font-normal text-sm">Medical Rating</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Third Row / First -->
    <div class="flex">
      <div class="basis-1/2 max-w-[50%] h-[305px] px-2 pl-4 py-2 rounded-md">
        <div class="bg-white py-2 px-4 rounded-md h-full">
          <div class="pt-2">
            <h3 class="text-black font-bold text-lg">HOSPITAL BIRTH & DEATH ANALYTICS</h3>
          </div>
          <Divider />
          <div class="mb-4">
            <div class="flex flex-row mb-4">
              <!-- Birth Row -->
              <div class="max-w-[33.333%] basis-1/3 px-4 pb-6">
                <div
                  class="w-[30%] h-[30%] rounded-lg flex items-center justify-center bg-dashboard-primary mb-3"
                >
                  <span class="material-symbols-outlined text-white"> airline_seat_flat </span>
                </div>

                <div class="pb-2">
                  <h6 class="pb-2 text-left">Births</h6>
                  <p class="text-dashboard-primary font-bold text-lg">53.07%</p>
                  <p class="text-dashboard-primary">201,434</p>
                </div>
              </div>
              <!-- Death Row -->
              <div class="max-w-[33.333%] basis-1/3 px-4 pb-6">
                <div
                  class="w-[30%] h-[30%] rounded-lg flex items-center justify-center bg-dashboard-primary mb-3 ml-4"
                >
                  <span class="material-symbols-outlined text-white">
                    airline_seat_individual_suite
                  </span>
                </div>

                <div class="px-4">
                  <h6 class="pb-2 text-left">Deaths</h6>
                  <p class="text-red-700 font-bold text-lg">29.05%</p>
                  <p class="text-red-700">134,693</p>
                </div>
              </div>
              <!-- Accidents Row -->
              <div class="max-w-[33.333%] basis-1/3 px-4 pb-6">
                <div
                  class="w-[30%] h-[30%] rounded-lg flex items-center justify-center bg-dashboard-primary mb-3 ml-4"
                >
                  <span class="material-symbols-outlined text-white"> accessible </span>
                </div>

                <div class="max-w-[33.333%] basis-1/3 px-4">
                  <h6 class="pb-2 text-left">Accidents</h6>
                  <p class="text-orange-600 font-bold text-lg">18.43%</p>
                  <p class="text-orange-600">81,525</p>
                </div>
              </div>
            </div>

            <div class="flex flex-row">
              <!-- Birth Analytics -->
              <div class="w-[53.07%]">
                <ProgressBar
                  :value="100"
                  :showValue="false"
                  :pt="{
                    value: { style: { background: '#007bff' } },
                    root: { style: { 'border-width': '0', 'border-radius': '0' } }
                  }"
                />
              </div>

              <!-- Death Analytics -->
              <div class="w-[29.05%]">
                <ProgressBar
                  :value="100"
                  :showValue="false"
                  :pt="{
                    value: { style: { background: 'red' } },
                    root: { style: { 'border-width': '0', 'border-radius': '0' } }
                  }"
                />
              </div>

              <!-- Accidents Analytics -->
              <div class="w-[18.43%]">
                <ProgressBar
                  :value="100"
                  :showValue="false"
                  :pt="{
                    value: { style: { background: 'orange' } },
                    root: { style: { 'border-width': '0', 'border-radius': '0' } }
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Third Row / Second -->
      <div class="basis-1/2 max-w-[50%] min-h-[200px] px-2 pr-4 py-2 rounded-md">
        <div class="py-2 px-4 pt-5 bg-white rounded-md">
          <div class="flex justify-between items-center">
            <div class="text-black font-bold text-lg">
              <h6>HOSPITAL STAFF</h6>
            </div>
          </div>
          <Divider />
        </div>
        <div class="bg-white rounded-md min-h-[193px]">
          <Carousel
            :value="doctor"
            :numVisible="4"
            :numScroll="1"
            circular
            :autoplayInterval="3500"
            :pt="{
              indicator: { style: { 'margin-bottom': '0', 'padding-bottom': '4px' } },
              indicators: { style: { 'margin-bottom': '0px', 'padding-bottom': '4px' } }
            }"
          >
            <template #item="slotProps">
              <div>
                <router-link to="">
                  <div>
                    <img
                      :src="slotProps.data.image"
                      :alt="slotProps.data.name"
                      class="w-[47%] mx-auto rounded-full"
                    />
                    <div>
                      <h5 class="text-center my-2 text-xl font-medium">
                        {{ slotProps.data.name }}
                      </h5>
                      <p class="text-center font-thin text-[14px]">
                        {{ slotProps.data.role }}
                      </p>
                    </div>
                  </div>
                </router-link>
              </div>
            </template>
          </Carousel>
        </div>
      </div>
    </div>
    <div class="flex flex-row px-2 py-2">
      <div class="basis-1/2 max-w-[50%] px-2">
        <div class="bg-white py-4 px-4 rounded-md">
          <div class="text-lg text-black font-bold">
            <h6>PATIENT TOTAL</h6>
          </div>
          <Divider />
          <div>
            <Chart
              type="line"
              :data="chartPatientTotal"
              :options="chartPatientOptions"
              class="h-[400px]"
              style="font-weight: 800"
            />
          </div>
        </div>
      </div>
      <div class="basis-1/2 max-w-[50%] px-2">
        <div class="bg-white py-4 px-4 rounded-md">
          <div class="text-lg text-black font-bold">
            <h6>PATIENT IN</h6>
          </div>
          <Divider />
          <div>
            <Chart
              type="bar"
              :data="chartPatientIn"
              :options="chartPatientInOptions"
              class="h-[400px]"
              style="font-weight: 800"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row px-4 py-4">
      <div class="basis-3/5 max-w-[60%] pr-6 min-h-[540px]">
        <div class="bg-white py-4 px-4 rounded-md h-full">
          <div class="text-lg text-black font-bold">
            <h6>UPCOMING APPOINTMENTS</h6>
          </div>
          <Divider />
          <div>
            <DataTable removableSort table-style="min-width: 50rem" :value="appointments">
              <Column
                header="Patient"
                :pt="{
                  headerCell: {
                    style: {
                      'background-color': '#009efb',
                      color: 'white',
                      'padding-top': '5px',
                      'padding-bottom': '5px'
                    }
                  }
                }"
              >
                <template #body="{ data }">
                  <div class="flex items-center">
                    <img
                      :src="data.image"
                      :alt="data.patientName"
                      class="rounded-full h-auto w-10"
                    />
                    <span class="pl-4">{{ data.patientName }}</span>
                  </div>
                </template>
              </Column>
              <Column
                field="doctorName"
                header="Doctor"
                :pt="{
                  headerCell: {
                    style: {
                      'background-color': '#009efb',
                      color: 'white',
                      'padding-top': '5px',
                      'padding-bottom': '5px'
                    }
                  }
                }"
              ></Column>
              <Column
                field="date"
                header="Date"
                sortable
                :pt="{
                  headerCell: {
                    style: {
                      'background-color': '#009efb',
                      color: 'white',
                      'padding-top': '5px',
                      'padding-bottom': '5px'
                    }
                  }
                }"
              ></Column>
              <Column
                field="timing"
                header="Timing"
                sortable
                :pt="{
                  headerCell: {
                    style: {
                      'background-color': '#009efb',
                      color: 'white',
                      'padding-top': '5px',
                      'padding-bottom': '5px'
                    }
                  }
                }"
              ></Column>
              <Column
                field="contact"
                header="Contact"
                :pt="{
                  headerCell: {
                    style: {
                      'background-color': '#009efb',
                      color: 'white',
                      'padding-top': '5px',
                      'padding-bottom': '5px'
                    }
                  }
                }"
              ></Column>
              <Column
                header="Status"
                field="status"
                sortable
                :pt="{
                  headerCell: {
                    style: {
                      'background-color': '#009efb',
                      color: 'white',
                      'padding-top': '5px',
                      'padding-bottom': '5px'
                    }
                  }
                }"
              >
                <template #body="{ data }">
                  <div>
                    <ToggleButton :checked="data.status" :id="data.id" :key="data.id" />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
      <div class="basis-2/5 max-w-[40%] min-h-[540px]">
        <div class="bg-white py-4 px-4 rounded-md h-full">
          <div class="text-lg text-black font-bold">
            <h6>DOCTORS LIST</h6>
          </div>
          <Divider />
          <div :key="doctor.id" v-for="doctor in doctorList">
            <div class="flex flex-row justify-between items-center">
              <div class="flex flex-row">
                <img :src="doctor.image" class="rounded-full h-auto w-12" />
                <div class="text-left pl-6">
                  <h6 class="text-lg">{{ doctor.name }}</h6>
                  <p class="text-xs">{{ doctor.qualifications }}</p>
                </div>
              </div>
              <div @click="doctor.added = !doctor.added">
                <Button :severity="doctor.added ? 'success' : 'info'" aria-label="Search">
                  <font-awesome-icon
                    :icon="doctor.added ? 'check' : 'user-plus'"
                    style="color: #ffffff"
                    class="mx-auto"
                  />
                </Button>
              </div>
            </div>
            <Divider />
          </div>
        </div>
      </div>
    </div>
    <div class="flex px-4 py-2">
      <div class="basis-1/2 max-w-[50%] mr-6">
        <div class="bg-white py-4 px-4 rounded-md">
          <div class="text-lg text-black font-bold">
            <h6>DOCTOR ENGAGEMENTS</h6>
          </div>
          <Divider />
          <div class="text-sm">
            <p>Jan 25, 2021 to Feb 02, 2021</p>
            <p>Jan 18, 2021 to Feb 24, 2021 (Prev)</p>
          </div>
          <div class="pt-4">
            <Dropdown
              v-model="selectedDoctor"
              :options="doctorList"
              option-label="name"
              placeholder="Doctor's name here"
              :pt="{
                root: { style: { border: 'none' } },
                input: { style: { 'padding-left': '0px' } }
              }"
            />
          </div>
          <div>
            <div class="flex flex-row justify-between items-end">
              <div class="flex flex-col pr-[50px]">
                <h5 class="w-[100px] mb-2">Weekday Engagement</h5>
                <p class="text-xs text-slate-700">45.07%</p>
                <p class="text-xs text-green-600">+28.44%</p>
                <p class="text-xs text-slate-700">VS 66.68% (Prev)</p>
              </div>
              <div class="w-full min-w-[100px]">
                <Chart
                  type="line"
                  :data="chartAppointment"
                  :options="chartOptions"
                  class="h-[4rem]"
                />
              </div>
            </div>
          </div>
          <Divider />
          <div>
            <div class="flex flex-row justify-between items-end">
              <div class="flex flex-col pr-[50px]">
                <h5 class="w-[100px] mb-2">Weekend Engagement</h5>
                <p class="text-xs text-slate-700">45.07%</p>
                <p class="text-xs text-green-600">+28.44%</p>
                <p class="text-xs text-slate-700">VS 66.68% (Prev)</p>
              </div>
              <div class="w-full min-w-[100px]">
                <Chart
                  type="line"
                  :data="chartAppointment"
                  :options="chartOptions"
                  class="h-[4rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="basis-1/2 max-w-[50%]">
        <div class="bg-white py-4 px-4 rounded-md">
          <div class="text-lg text-black font-bold">
            <h6>PATIENT TIMELINE</h6>
          </div>
          <Divider />
          <div>
            <div class="justify-between flex pb-6">
              <div class="">
                <Button rounded class="w-[30px] h-[40px] justify-center" severity="secondary">
                  <font-awesome-icon
                    icon="wheelchair"
                    style="color: #ffffff"
                    class="mx-auto"
                    size="xl"
                  />
                </Button>
                <Divider layout="vertical" />
              </div>
              <div class="flex flex-col px-6">
                <h6>Patient Admission</h6>
                <p class="flex text-xs font-light items-center">
                  <span class="material-symbols-outlined text-base"> event </span>1 January, 2021
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque diam
                  non nisi semper, ula in sodales vehicula....
                </p>
              </div>
            </div>
            <div class="justify-between flex pb-6">
              <div class="">
                <Button rounded class="w-[30px] h-[40px] justify-center" severity="info">
                  <font-awesome-icon icon="user-doctor" style="color: #ffffff" size="xl" />
                </Button>
                <Divider layout="vertical" />
              </div>
              <div class="flex flex-col px-6">
                <h6>Treatment Starts</h6>
                <p class="flex text-xs font-light items-center">
                  <span class="material-symbols-outlined text-base"> event </span>1 January, 2021
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque diam
                  non nisi semper, ula in sodales vehicula....
                </p>
              </div>
            </div>
            <div class="justify-between flex pb-4">
              <div class="">
                <Button rounded class="w-[30px] h-[40px] justify-center" severity="success">
                  <font-awesome-icon
                    icon="check"
                    style="color: #ffffff"
                    class="mx-auto"
                    size="xl"
                  />
                </Button>
              </div>
              <div class="flex flex-col px-6">
                <h6>Patient Discharge</h6>
                <p class="flex text-xs font-light items-center">
                  <span class="material-symbols-outlined text-base"> event </span>1 January, 2021
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque diam
                  non nisi semper, ula in sodales vehicula....
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row px-4 py-4 h-full">
      <div class="basis-3/5 max-w-[60%] pr-6">
        <div class="bg-white py-4 px-4 rounded-md">
          <div class="text-lg text-black font-bold">
            <h6>NEW PATIENTS</h6>
          </div>
          <Divider />
          <div>
            <DataTable removableSort table-style="min-width: 50rem" :value="newPatientData">
              <Column
                header="Patient"
                :pt="{
                  headerCell: {
                    style: {
                      'background-color': '#009efb',
                      color: 'white',
                      'padding-top': '5px',
                      'padding-bottom': '5px'
                    }
                  }
                }"
              >
                <template #body="{ data }">
                  <div class="flex items-center">
                    <img
                      :src="data.image"
                      :alt="data.patientName"
                      class="rounded-full h-auto w-10"
                    />
                    <span class="pl-4">{{ data.name }}</span>
                  </div>
                </template>
              </Column>
              <Column
                field="email"
                header="Email"
                :pt="{
                  headerCell: {
                    style: {
                      'background-color': '#009efb',
                      color: 'white',
                      'padding-top': '5px',
                      'padding-bottom': '5px'
                    }
                  }
                }"
              >
              </Column>
              <Column
                field="contact"
                header="Contact"
                :pt="{
                  headerCell: {
                    style: {
                      'background-color': '#009efb',
                      color: 'white',
                      'padding-top': '4px',
                      'padding-bottom': '4px'
                    }
                  }
                }"
              >
              </Column>
              <Column
                field="disease"
                header="Disease"
                :pt="{
                  headerCell: {
                    style: {
                      'background-color': '#009efb',
                      color: 'white',
                      'padding-top': '5px',
                      'padding-bottom': '5px'
                    }
                  }
                }"
              >
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
      <div class="basis-2/5 max-w-[40%] min-h-[500px]">
        <div class="bg-white py-4 px-4 rounded-md h-full">
          <div class="text-lg text-black font-bold">
            <h6>LATEST REPORTS</h6>
          </div>
          <Divider />
          <div :key="report.id" v-for="report in reports">
            <div class="flex flex-row justify-between items-center">
              <div class="flex flex-row">
                <div class="text-left pl-6">
                  <h6 class="text-lg">{{ report.title }}</h6>
                  <router-link to="">
                    <p class="text-xs">View Report</p>
                  </router-link>
                </div>
              </div>
              <div>
                <Button
                  :severity="report.state ? 'success' : 'danger'"
                  :label="report.state ? 'Download' : 'On hold'"
                  class="max-h-8 w-[120px]"
                />
              </div>
            </div>
            <Divider style="margin-top: 18px; margin-bottom: 18px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { setAppointment, setPatient, setEarning } from '../data/chartData'
import doctors from '../data/doctors.json'
import { setPatientTotalChart } from '../data/patientChartData'
import { setPatientInChart } from '../data/patientInChartData'
import upcomingAppointData from '../data/upcomingAppointData.json'
import ToggleButton from '../components/ToggleButton.vue'
import doctorsList from '../data/doctorsList.json'
import newPatient from '../data/newPatient.json'
import latestReports from '../data/latestReports.json'

onMounted(() => {
  chartAppointment.value = setAppointment()
  chartPatient.value = setPatient()
  chartEarning.value = setEarning()
  chartOptions.value = setChartOptions()
  chartPatientTotal.value = setPatientTotalChart()
  chartPatientOptions.value = setChartPatientOptions()
  chartPatientIn.value = setPatientInChart()
  chartPatientInOptions.value = setChartPatientInOptions()
  appointments.value = upcomingAppointData
})

const selectedDoctor = ref()
const reports = ref(latestReports)
const newPatientData = ref(newPatient)
const doctorList = ref(doctorsList)
const doctor = ref(doctors)
const date = ref(Date())
const chartAppointment = ref()
const chartPatient = ref()
const chartEarning = ref()
const chartOptions = ref()
const chartPatientTotal = ref()
const chartPatientOptions = ref()
const chartPatientInOptions = ref()
const chartPatientIn = ref()
const appointments = ref()

// Patient Total

const setChartPatientOptions = () => {
  return {
    maintainAspectRatio: false,
    aspectRatio: 0.7,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: true,
        ticks: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        display: true,
        grid: {
          display: false
        },
        beginAtZero: true,
        ticks: {
          stepSize: 200,
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  }
}

// PATIENT IN BAR CHART

const setChartPatientInOptions = () => {
  return {
    maintainAspectRatio: false,
    aspectRatio: 0.7,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        ticks: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        display: true,
        beginAtZero: true,
        ticks: {
          stepSize: 500,
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  }
}

// Appointments - New Patients - Hospital Earning Chart
const setChartOptions = () => {
  return {
    maintainAspectRatio: false,
    aspectRatio: 0.7,
    pointRadius: 0,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  }
}
</script>

<style>
.card {
  background-image: linear-gradient(90deg, rgba(0, 158, 251, 0.8), #fff);
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 20;
}

.p-datatable .p-sortable-column .p-sortable-column-icon {
  color: #e1eaf3 !important;
}
</style>
