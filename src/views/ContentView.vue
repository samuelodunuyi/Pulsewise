<template>
  <div>
    <MedBoard />
    <GenereateReport />
    <PrescriptionModal />
    <AppointmentModal />
  </div>
</template>

<script setup>
import AppointmentModal from '../components/AppointmentModal.vue'
import GenereateReport from '../components/GenereateReport.vue'
import PrescriptionModal from '../components/PrescriptionModal.vue'
import MedBoard from './MedBoard.vue'
</script>

<style lang="scss" scoped></style>
