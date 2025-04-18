const patientICU = [200, 1200, 980, 1260, 1550, 1440, 2790, 3200, 3600]
const patientOPD = [500, 700, 980, 1060, 1150, 1240, 2390, 3000, 3300]

export const setPatientInChart = () => {
  return {
    labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'ICU',
        data: patientICU,
        fill: true,
        borderColor: '#009efb',
        tension: 0.5,
        backgroundColor: '#009efb'
      },
      {
        label: 'OPD',
        data: patientOPD,
        fill: true,
        borderColor: '#006699',
        tension: 0.5,
        backgroundColor: '#006699'
      }
    ]
  }
}
