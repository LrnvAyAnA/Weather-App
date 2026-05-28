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
import { useEffect, useMemo, useRef, useState } from "react";
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
  timezone: number;
  selectedDay: string | null;
};

export const ForecastChart = ({
  data,
  isCelsius,
  showCurrentPoint,
  selectedDay,
  timezone,
}: ForecastChartProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isAutoScrolling = useRef(false);
  const [containerWidth, setContainerWidth] = useState(800);
  const pointWidth = containerWidth / 8;
  const chartWidth = data.length * pointWidth;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setContainerWidth(width);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
  }, [selectedDay, data, pointWidth]);

  const labelsPlugin = useMemo(
    () => ({
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
    }),
    [isCelsius],
  );

  if (!data?.length) return null;

  const temps = data.map((item) => Math.round(item.main.temp));
  const times = data.map((item) => item.dt_txt.slice(11, 16));

  const firstTime = data[0].dt * 1000;
  const lastTime = data[data.length - 1].dt * 1000;

  const now = Date.now();
  const nowInCity = now + timezone * 1000;
  const isNowInRange = nowInCity >= firstTime && nowInCity <= lastTime;
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

  const pointColors = temps.map((_, i) =>
    currentIndex !== null && i === currentIndex ? "#ffcc00" : "#999",
  );

  const pointRadius = temps.map((_, i) =>
    currentIndex !== null && i === currentIndex ? 6 : 3,
  );

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
    <>
      <div className="chart-date">
        {selectedDay && new Date(selectedDay).toLocaleDateString()}
      </div>

      <div className="chart-wrapper" ref={scrollRef}>
        <div className="chart-inner" style={{ width: chartWidth }}>
          <Line
            key={isCelsius ? "c" : "f"}
            plugins={[labelsPlugin]}
            options={options}
            data={chartData}
          />
        </div>
      </div>
    </>
  );
};
