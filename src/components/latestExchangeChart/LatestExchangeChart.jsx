import React, { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrencyPairRate } from "../../redux/slice/currency/getLatestSevenCurrencySlice";
import { FaSpinner } from "react-icons/fa";

const from = "USD";
const to = "INR";

const LatestExchangeChart = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(
    (state) => state.getLatestSevenCurrencyRate
  );

  const [chartData, setChartData] = useState({ dates: [], values: [] });

  // Simulate a 7-day trend with minor random fluctuation
  const simulate7DayTrend = useMemo(() => {
    if (!data?.conversion_rates?.[to]) return { dates: [], values: [] };

    const rate = data.conversion_rates[to];
    const today = new Date();
    const trend = [];
    const dates = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);

      const fluctuation = rate * (Math.random() * 0.01 - 0.005);
      trend.push(parseFloat((rate + fluctuation).toFixed(4)));
    }

    return { dates, values: trend };
  }, [data]);

  useEffect(() => {
    dispatch(fetchCurrencyPairRate(from));
  }, [dispatch]);

  useEffect(() => {
    setChartData(simulate7DayTrend);
  }, [simulate7DayTrend]);

  const options = {
    title: {
      text: `${from} to ${to} - Simulated 7 Day Trend`,
      textStyle: { color: "#ffffff", fontSize: 18, fontWeight: 600 },
      left: "center",
      top: "2%",
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#2a2e3f",
      borderColor: "#00FFAA",
      textStyle: { color: "#ffffff" },
    },
    grid: { left: "5%", right: "5%", bottom: "10%", containLabel: true },
    xAxis: {
      type: "category",
      data: chartData.dates,
      axisLine: { lineStyle: { color: "#888" } },
      axisLabel: { color: "#ccc" },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#888" } },
      axisLabel: { color: "#ccc" },
      splitLine: { lineStyle: { color: "#333", type: "dashed" } },
    },
    series: [
      {
        name: `${from} to ${to}`,
        type: "line",
        data: chartData.values,
        smooth: true,
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "#00FFAA66" },
              { offset: 1, color: "#00FFAA00" },
            ],
          },
        },
        lineStyle: { color: "#00FFAA", width: 3 },
        itemStyle: { color: "#00FFAA" },
        symbol: "circle",
        symbolSize: 6,
      },
    ],
    backgroundColor: "transparent",
  };

  return (
    <section className="bg-[#1E1E2F] rounded-2xl shadow-xl p-6 mt-8 w-full text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold tracking-wide">
          📈 Latest Exchange Rate Chart
        </h3>
        <span className="text-sm text-gray-400">
          Pair: <strong className="text-green-400">{from} → {to}</strong>
        </span>
      </div>

      <div className="h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaSpinner className="animate-spin text-4xl text-green-400 mb-2" />
            <p className="text-sm">Loading chart...</p>
          </div>
        ) : (
          <ReactECharts option={options} style={{ height: "100%" }} />
        )}
      </div>
    </section>
  );
};

export default LatestExchangeChart;
