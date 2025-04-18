const appointment = [10, 59, 20, 81, 26, 85, 40, 90, 25, 75, 5, 82]
const patients = [30, 79, 40, 71, 16, 65, 20, 63, 25, 85, 15, 32]
const earnings = [10, 59, 20, 81, 66, 25, 70, 20, 85, 35, 65, 12]

const setAppointment = () => {
  return {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    datasets: [
      {
        data: appointment,
        fill: true
      }
    ]
  }
}

const setPatient = () => {
  return {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    datasets: [
      {
        data: patients,
        fill: true
      }
    ]
  }
}

const setEarning = () => {
  return {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    datasets: [
      {
        data: earnings,
        fill: true
      }
    ]
  }
}

export { setAppointment, setPatient, setEarning }
