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
import { convertTemp } from "../utils/convertTemp";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type ForecastItem = {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
  };
};

type ForecastData = {
  city: any;
  list: ForecastItem[];
};

type ForecastChartProps = {
  data: ForecastData | null;
  isCelsius: boolean;
};


export const ForecastChart = ({ data, isCelsius }: ForecastChartProps) => {


  if (!data || !data.list) return null;

  const list = data.list.slice(0, 8);
  const temps = list.map(item => Math.round(item.main.temp));
  const times = list.map(item => item.dt_txt.slice(11, 16));

const activeLabelPlugin = {
  id: "activeLabelPlugin",
  afterDraw(chart: any) {
    const { ctx, scales: { x } } = chart;

    const label = x.getLabelForValue(currentIndex);
    const xPos = x.getPixelForTick(currentIndex);

    const yPos = chart.height-150;

    ctx.save();

    ctx.font = "12px sans-serif";
    const text = label;
    const textWidth = ctx.measureText(text).width;

    const paddingX = 8;
    const paddingY = 4;

    ctx.fillStyle = "rgba(68, 68, 68, 0.25)";
    ctx.beginPath();
    ctx.roundRect(
      xPos - textWidth / 2 - paddingX,
      yPos - 10,
      textWidth + paddingX * 2,
      20,
      6
    );
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "center";
    ctx.fillText(text, xPos, yPos + 5);

    ctx.restore();
  }
};
const labelsPlugin = {
  id: "labelsPlugin",
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart;

    chart.data.datasets.forEach((dataset: any, i: number) => {
      const meta = chart.getDatasetMeta(i);

      meta.data.forEach((point: any, index: number) => {
        const value = dataset.data[index];

        ctx.save();
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.textAlign = "center";

        
        ctx.fillText(
          `${value}°`,
          point.x,
          point.y - 20
        );

        ctx.restore();
      });
    });
  },
};

const now = Date.now();
const cityTimezone = data.city.timezone;
const nowInCity = now + cityTimezone * 1000;
const currentIndex = list.reduce((closestIndex, item, index) => {
  const itemTime = item.dt * 1000;

  const closestTime =
    list[closestIndex].dt * 1000;

  return Math.abs(itemTime - nowInCity) <
    Math.abs(closestTime - nowInCity)
    ? index
    : closestIndex;
}, 0);
const pointColors = temps.map((_, i) =>
  i === currentIndex ? "#ffcc00" : "#999"
);

const pointRadius = temps.map((_, i) =>
  i === currentIndex ? 6 : 3
);

  const chartData = {
    labels: times,
    datasets: [
      {
        label: "Temp",
        data: temps.map(t => convertTemp(t, isCelsius)),
        borderColor: "rgba(255, 255, 255, 0.35)",
        pointRadius: pointRadius,
        pointBackgroundColor: pointColors,
        pointHoverRadius: 8,
        tension: 0.4,
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
  legend: {
    display: false,
  },
  tooltip: {
  enabled: false,
},
},
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
  callback: function(value: any, index: number) {
    if (index === currentIndex) return "";
    return times[index];
  },
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
      },
    },
  
};

  return <Line plugins={[labelsPlugin, activeLabelPlugin]} options={options} data={chartData}/>
};