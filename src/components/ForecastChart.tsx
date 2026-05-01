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
import { useEffect, useRef, useState } from "react";
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
  showCurrentPoint: boolean;
  timezone:number;
  selectedDay: string | null;
  onSelectedDayChange: (day: string) => void;
};

export const ForecastChart = ({
  data,
  isCelsius,
  showCurrentPoint,
  selectedDay,
  timezone
}: ForecastChartProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isAutoScrolling = useRef(false);

  useEffect(() => {
    if (!selectedDay || !scrollRef.current) return;

    const index = data.findIndex((item) => item.dt_txt.startsWith(selectedDay));

    if (index >= 0) {
      isAutoScrolling.current = true;

      scrollRef.current.scrollTo({
        left: index * pointWidth,
        behavior: "smooth",
      });
      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 400);
    }
  }, [selectedDay, data]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 0.8;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  if (!data?.length) return null;

  const temps = data.map((item) => Math.round(item.main.temp));
  const times = data.map((item) => item.dt_txt.slice(11, 16));

const activeLabelPlugin = {
  id: "activeLabelPlugin",
  afterDraw(chart: any) {
    const { ctx, scales: { x } } = chart;



    ctx.save();

    ctx.font = "12px sans-serif";


    ctx.fillStyle = "rgba(68, 68, 68, 0.25)";
    ctx.beginPath();

    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "center";

    ctx.restore();
  }
};

const nowUtc = Date.now();

const firstTime = data[0].dt * 1000;
const lastTime = data[data.length - 1].dt * 1000;

const isNowInRange =
  nowUtc >= firstTime && nowUtc <= lastTime;

const now = Date.now();
const nowInCity = nowUtc + timezone * 1000;

console.log("nowInCity:",nowInCity)
console.log("firstTime:",firstTime)
console.log("lastTime:",lastTime)
console.log("isNowInRange:",isNowInRange)

const currentIndex = isNowInRange
  ? data.reduce((closestIndex, item, index) => {
      const itemTime = item.dt * 1000;
      const closestTime = data[closestIndex].dt * 1000;

      return Math.abs(itemTime - nowInCity) <
        Math.abs(closestTime - nowInCity)
        ? index
        : closestIndex;
    }, 0)
  : null;


// const now = Date.now();
// const cityTimezone = timezone;
// const nowInCity = now + cityTimezone * 1000;
// const currentIndex = data.reduce((closestIndex, item, index) => {
//   const itemTime = item.dt * 1000;

//   const closestTime =
//     data[closestIndex].dt * 1000;
// console.log("nowInCity:",nowInCity)
// console.log("itemTime:",itemTime)
// console.log("closestTime:",closestTime)
//   return Math.abs(itemTime - nowInCity) <
//     Math.abs(closestTime - nowInCity)
//     ? index
//     : closestIndex;
// }, 0);


const pointColors = temps.map((_, i) =>
  currentIndex !== null && i === currentIndex ? "#ffcc00" : "#999"
);

const pointRadius = temps.map((_, i) =>
  currentIndex !== null && i === currentIndex ? 6 : 3
);

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
                pointRadius: pointRadius,
        pointBackgroundColor: pointColors,
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
      showCurrentPoint,
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

  const pointWidth = (scrollRef.current?.clientWidth ?? 0) / 8;
  const chartWidth = data.length * pointWidth;
  return (
    <>
      <div className="chart-date">
        {selectedDay && new Date(selectedDay).toLocaleDateString()}
      </div>

      <div className="chart-wrapper" ref={scrollRef}>
        <div className="chart-inner" style={{ width: chartWidth }}>
          <Line
            key={isCelsius ? "c" : "f"}
            plugins={[labelsPlugin, activeLabelPlugin]}
            options={options}
            data={chartData}
          />
        </div>
      </div>
    </>
  );
};
