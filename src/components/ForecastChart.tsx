import "../styles/WeatherCard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ForecastItem } from "../types/weather";
import { Line } from "react-chartjs-2";
import { convertTemp } from "../utils/convertTemp";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

type ForecastChartProps = {
  data: ForecastItem[];
  isCelsius: boolean;
  timezone: number;
  showCurrentPoint: boolean;
  // selectedDay: string | null;
};

export const ForecastChart = ({
  data,
  isCelsius,
  timezone,
  showCurrentPoint
}: ForecastChartProps) => {
 if (!data.length) return null;
  const now = Date.now();
  const nowInCity = now + timezone * 1000;

  const firstTime = data[0]?.dt * 1000;
  const step = 3 * 60 * 60 * 1000;

  const currentPosition = (nowInCity - firstTime) / step;

  const temps = data.map((item) => Math.round(item.main.temp));
  const times = data.map((item) => item.dt_txt.slice(11, 16));

  const activeLabelPlugin = {
    id: "activeLabelPlugin",
    afterDraw(chart: any) {
       if (!showCurrentPoint) return;
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);

      const leftIndex = Math.floor(currentPosition);
      const rightIndex = Math.ceil(currentPosition);
      const fraction = currentPosition % 1;

      const leftPoint = meta.data[leftIndex];
      const rightPoint = meta.data[rightIndex];

      if (!leftPoint || !rightPoint) return;

      const xPos = leftPoint.x + (rightPoint.x - leftPoint.x) * fraction;
      const yPos = leftPoint.y + (rightPoint.y - leftPoint.y) * fraction;

      ctx.save();

      ctx.beginPath();
      ctx.arc(xPos, yPos, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#ffcc00";
      ctx.fill();

      ctx.restore();
    },
  };
  const labelsPlugin = {
    id: "labelsPlugin",
    afterDatasetsDraw(chart: any) {
      const { ctx } = chart;

      chart.data.datasets.forEach((dataset: any, i: number) => {
        const meta = chart.getDatasetMeta(i);

        meta.data.forEach((point: any, index: number) => {
          ctx.save();
          ctx.font = "16px sans-serif";
          ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
          ctx.textAlign = "center";

          ctx.fillText(
            `${Math.round(convertTemp(dataset.data[index], isCelsius))}°`,
            point.x,
            point.y - 15,
          );

          ctx.restore();
        });
      });
    },
  };

  const chartData = {
    labels: times,
    datasets: [
      {
        label: "Temp",
        data: temps,
        borderColor: "rgba(255, 255, 255, 0.35)",
        pointHoverRadius: 8,
        tension: 0.3,
      },
    ],
  };
  const options = {
    layout: {
      padding: {
        top: 30,
        bottom: 40,
        left: -10,
        right: -10,
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
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        //         ticks: {
        //   callback: function(value: any, index: number) {
        //     if (index === currentIndex) return "";
        //     return times[index];
        //   },
        // },
        offset: true,
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: {
          display: false,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <div className="chart-inner">
        <Line
          key={isCelsius ? "c" : "f"}
          plugins={[labelsPlugin, activeLabelPlugin]}
          options={options}
          data={chartData}
        />
      </div>
    </div>
  );
  {
    /* <Line plugins={[labelsPlugin, activeLabelPlugin]} options={options} data={chartData}/> */
  }
};
