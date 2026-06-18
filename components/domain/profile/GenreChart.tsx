"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GenreStat } from "@/type/movie";
import { COLORS } from "@/constants/genre";

interface GenreChartProps {
  data: GenreStat[];
}

export default function GenreChart({ data }: GenreChartProps) {
  if (!data || data.length === 0) {
    return (
      <section className="bg-[#141414] border border-neutral-800 rounded-xl p-6 shadow-sm mb-8 text-center py-12 mt-8">
        <h2 className="text-xl font-bold mb-1 text-white">취향 분석</h2>
        <p className="text-sm text-neutral-400 mt-4">
          아직 즐겨찾기한 영화가 없습니다.
        </p>
      </section>
    );
  }

  // 💡 1. 데이터에 COLORS 배열의 색상을 'fill' 프로퍼티로 주입합니다.
  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <section className="bg-[#181818] border border-neutral-800 rounded-xl p-6 shadow-2xl mb-8 mt-8">
      <h2 className="text-xl font-bold mb-1 text-white">
        🎬 나의 장르 취향 분석
      </h2>
      <p className="text-sm text-neutral-400 mb-6">
        내가 가장 많이 찜한 선호 장르 통계입니다.
      </p>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData} // 💡 2. 색상이 주입된 새 데이터를 전달
            layout="vertical"
            margin={{ top: 0, right: 30, left: -10, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={95}
              className="text-xs font-bold fill-neutral-300"
            />
            <Tooltip
              cursor={{ fill: "#ffffff", opacity: 0.05 }}
              contentStyle={{
                background: "#222222",
                borderColor: "#333333",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#ffffff" }} 
            />
            <Bar 
              dataKey="count" 
              radius={[0, 4, 4, 0]} 
              barSize={18} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}