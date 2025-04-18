const patientTotal = [200, 1200, 980, 1260, 1550, 1440, 2790, 3200, 3600]

export const setPatientTotalChart = () => {
  return {
    labels: [
      'Jan-11',
      'Jan-12',
      'Jan-13',
      'Jan-14',
      'Jan-15',
      'Jan-16',
      'Jan-17',
      'Jan-18',
      'Jan-19'
    ],
    datasets: [
      {
        data: patientTotal,
        fill: true,
        borderColor: 'rgba(0, 113, 179, 0.64)',
        tension: 0.5,
        backgroundColor: 'rgba(0, 145, 230, 0.55)'
      }
    ]
  }
}
