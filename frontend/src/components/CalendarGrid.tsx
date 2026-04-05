"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";

interface CalendarGridProps {
  availableDates: string[];
  selectedDate: string;
}

export default function CalendarGrid({ availableDates, selectedDate }: CalendarGridProps) {
  // 表示中の月（初期値は選択中の日付、または今日）
  const [viewMonth, setViewMonth] = useState(new Date(selectedDate || new Date()));

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  // 月の最初の日と最後の日
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // カレンダーのグリッド用データ（前月の埋め、当月の日、翌月の埋め）
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0: 日曜日

  // 日付の配列生成 (YYYY-MM-DD 形式)
  const generateDateStr = (d: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  // グリッドを42マス(6週間分)にするための配列
  const calendarDays = [];
  
  // 前月分を埋める
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // 当月分
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }
  
  // 翌月分を埋める (行末まで)
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 0; i < remainingCells; i++) {
    calendarDays.push(null);
  }

  return (
    <div className="bg-white/5 border border-white/10 p-1 rounded-3xl backdrop-blur-xl w-full max-w-[320px] shadow-2xl">
      {/* Header */}
      <div className="relative flex items-center justify-center mb-1 py-1 px-1">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <span className="text-zinc-500 text-sm font-mono">{year}</span>
          <span className="text-blue-500 font-black">{month + 1}月</span>
        </h3>
        <div className="absolute right-1 flex gap-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Week Headers */}
      <div className="grid grid-cols-7 gap-1 mb-0.5">
        {weekDays.map((day, idx) => (
          <div
            key={day}
            className={`text-[9px] font-bold text-center py-0.5 uppercase tracking-tight
              ${idx === 0 ? "text-rose-500/80" : idx === 6 ? "text-blue-400/80" : "text-zinc-600"}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid Body */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-5" />;
          }

          const dateStr = generateDateStr(day);
          const hasReport = availableDates.includes(dateStr);
          const isSelected = selectedDate === dateStr;
          const isSunday = idx % 7 === 0;
          const isSaturday = idx % 7 === 6;

          return (
            <Link
              key={dateStr}
              href={`/?date=${dateStr}`}
              className={`h-5 flex flex-col items-center justify-center rounded-lg border relative transition-all group active:scale-90
                ${isSelected 
                  ? "bg-blue-600 border-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.4)] z-10" 
                  : hasReport 
                    ? "bg-white/5 border-white/5 hover:border-blue-500/50 hover:bg-white/10" 
                    : "border-transparent opacity-10 pointer-events-none"
                }`}
            >
              <span className={`text-[10px] font-mono font-bold
                ${isSelected 
                  ? "text-white" 
                  : isSunday 
                    ? "text-rose-400" 
                    : isSaturday 
                      ? "text-blue-300" 
                      : "text-zinc-400"
                }`}
              >
                {day}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
