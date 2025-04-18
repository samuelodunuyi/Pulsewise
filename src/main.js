/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'primeicons/primeicons.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
  faStethoscope,
  faBriefcaseMedical,
  faUserPlus,
  faWheelchair,
  faChevronLeft,
  faChevronRight,
  faCheck,
  faUserDoctor
} from '@fortawesome/free-solid-svg-icons'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-indigo/theme.css'

import Dropdown from 'primevue/dropdown';
import Menu from 'primevue/menu'
import Chip from 'primevue/chip'
import Divider from 'primevue/divider'
import Dialog from 'primevue/dialog'
import Calendar from 'primevue/calendar'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Chart from 'primevue/chart'
import ProgressBar from 'primevue/progressbar'
import Carousel from 'primevue/carousel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

library.add(
  faStethoscope,
  faBriefcaseMedical,
  faUserPlus,
  faWheelchair,
  faChevronLeft,
  faChevronRight,
  faCheck,
  faUserDoctor
)

const app = createApp(App)

app.use(PrimeVue)
app.use(router)

app.component('Dropdown', Dropdown)
app.component('Column', Column)
app.component('DataTable', DataTable)
app.component('font-awesome-icon', FontAwesomeIcon).mount('#app')
app.component('Menu', Menu)
app.component('Chip', Chip)
app.component('Divider', Divider)
app.component('Dialog', Dialog)
app.component('Calendar', Calendar)
app.component('InputText', InputText)
app.component('Button', Button)
app.component('Checkbox', Checkbox)
app.component('Chart', Chart)
app.component('ProgressBar', ProgressBar)
app.component('Carousel', Carousel)
