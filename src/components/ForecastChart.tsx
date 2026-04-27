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
  // timezone: number;
  // showCurrentPoint: boolean;
  selectedDay: string | null;
  onSelectedDayChange: (day: string) => void;
};

export const ForecastChart = ({
  data,
  isCelsius,
  // timezone,
  // showCurrentPoint,
  selectedDay,
  onSelectedDayChange,
}: ForecastChartProps) => {
  // const [activeIndex, setActiveIndex] = useState(0);
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
  // const nowInCity = Date.now() + timezone * 1000;
  // const firstTimeInCity = data[0]?.dt * 1000 + timezone * 1000;
  // const step = 3 * 60 * 60 * 1000;

  // const currentPosition = (nowInCity - firstTimeInCity) / step;

  const temps = data.map((item) => Math.round(item.main.temp));
  const times = data.map((item) => item.dt_txt.slice(11, 16));

  // const activeLabelPlugin = {
  //   id: "activeLabelPlugin",
  //   afterDraw(chart: any) {
  //     const show = chart.options.plugins.showCurrentPoint;

  //     if (!show) return;
  //     if (data.length < 2) return;

  //     const { ctx } = chart;

  //     const maxIndex = data.length - 1;

  //     const safePosition = Math.min(Math.max(currentPosition, 0), maxIndex);

  //     const leftIndex = Math.floor(safePosition);
  //     const rightIndex = Math.min(leftIndex + 1, maxIndex);

  //     const fraction = safePosition - leftIndex;
  //     const meta = chart.getDatasetMeta(0);

  //     const leftPoint = meta.data[leftIndex];
  //     const rightPoint = meta.data[rightIndex];

  //     if (!leftPoint || !rightPoint) return;

  //     const xPos = leftPoint.x + (rightPoint.x - leftPoint.x) * fraction;
  //     const yPos = leftPoint.y + (rightPoint.y - leftPoint.y) * fraction;
  //     console.log("plugin draw", showCurrentPoint);
  //     ctx.save();

  //     ctx.beginPath();
  //     ctx.arc(xPos, yPos, 6, 0, Math.PI * 2);
  //     ctx.fillStyle = "#ffcc00";
  //     ctx.fill();

  //     ctx.restore();
  //   },
  // };
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
      // showCurrentPoint,
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

  // const activeIndex = data.findIndex((item) =>
  //   item.dt_txt.startsWith(selectedDay ?? ""),
  // );
  const pointWidth = 150;
  const chartWidth = data.length * pointWidth;
  const handleScroll = () => {
    if (isAutoScrolling.current) return;

    const el = scrollRef.current;
    if (!el) return;

    const index = Math.round(el.scrollLeft / pointWidth);

    const day = data[index]?.dt_txt.slice(0, 10);

    if (day) {
      onSelectedDayChange(day);
    }
  };

  return (
    <>
      <div className="chart-date">
        {selectedDay && new Date(selectedDay).toLocaleDateString()}
      </div>

      <div className="chart-wrapper" ref={scrollRef} onScroll={handleScroll}>
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
  {
    /* <Line plugins={[labelsPlugin, activeLabelPlugin]} options={options} data={chartData}/> */
  }
};
