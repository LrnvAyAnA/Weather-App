import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type ForecastItem = {
  dt_txt: string;
  main: {
    temp: number;
  };
};

type ForecastData = {
  list: ForecastItem[];
};

type ForecastChartProps = {
  data: ForecastData | null;
};


export const ForecastChart = ({ data }: ForecastChartProps) => {
  if (!data || !data.list) return null;

  const list = data.list.slice(0, 8);
  const temps = list.map(item => Math.round(item.main.temp));
  const times = list.map(item => item.dt_txt.slice(11, 16));

  const tempsMin = Math.min(...temps);
const tempsMax = Math.max(...temps);

  const chartData = {
    labels: times,
    datasets: [
      {
        label: "Temp",
        data: temps,
        borderColor: "rgba(121, 121, 121, 0.6)",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        pointRadius: 4,
        pointBackgroundColor: "rgba(180, 180, 180, 0.8)",
        pointHoverRadius: 8,
        tension: 0.1,
      },
    ],
  };
  const options = {
    layout: {
    padding: {
      top: 100,    
      bottom: 140,
      left:20,
      right:20
    },
  },
    plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      mode: 'nearest' as const,
      intersect: true,
      callbacks: {
        label: (context: any) => `${context.parsed.y} °C`,
      },
    },
  },
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
        offset: true,
        border: { display: false },
      },
      y: {
        grid: {display: false},
        ticks: {
          display: false,
        },
        border: { display: false },
        min: tempsMin - 5,
        max: tempsMax + 5,
      },
    },
  
};

  return <Line options={options} data={chartData}/>
};


// export const ForecastChart = ({ data }: ForecastChartProps) => {
//   if (!data || !data.list) return null;

//   const list = data.list.slice(0, 8);
//   const temps = list.map(item => Math.round(item.main.temp));
//   const times = list.map(item => item.dt_txt.slice(11, 16));

//   const nowHour = new Date().getHours();
//   const tempsMin = Math.min(...temps);
//   const tempsMax = Math.max(...temps);

//   const chartData = {
//     labels: times,
//     datasets: [
//       {
//         label: "Temperature (°C)",
//         data: temps,
//         borderColor: "rgba(121, 121, 121, 0.6)",
//         backgroundColor: "rgba(255, 255, 255, 0.6)",
//         pointRadius: times.map(time => parseInt(time.slice(0,2)) === nowHour ? 7 : 4),
//         pointBackgroundColor: times.map(time => parseInt(time.slice(0,2)) === nowHour ? "yellow" : "gray"),
//         tension: 0.4,
//       },
//     ],
//   };

//   const options = {
//     layout: {
//     padding: {
//       top: 100,    
//       bottom: 140,
//       left:20,
//       right:20
//     },
//   },
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         enabled: true,
//         mode: 'nearest' as const,
//         intersect: true,
//         callbacks: {
//           label: function(context: any) {
//             return `${context.parsed.y} °C`;
//           },
//         },
//       },
//     },
//     scales: {
//       x: { grid: { display: false }, border: { display: false } },
//       y: {
//         grid: { display: false },
//         ticks: { display: false },
//         border: { display: false },
//         min: tempsMin - 5,
//         max: tempsMax + 5,
//       },
//     },
//   };

//   return <Line data={chartData} options={options} />;
// };