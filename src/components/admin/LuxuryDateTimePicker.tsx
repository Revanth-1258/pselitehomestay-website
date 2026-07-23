'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface LuxuryDateTimePickerProps {
  label: string;
  value: string; // YYYY-MM-DDTHH:MM
  onChange: (val: string) => void;
}

export const LuxuryDateTimePicker: React.FC<LuxuryDateTimePickerProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default to current date/time if value is empty or invalid
  const parseInitialDate = () => {
    if (!value) return new Date();
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const [selectedDate, setSelectedDate] = useState<Date>(parseInitialDate());
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(parseInitialDate().getFullYear(), parseInitialDate().getMonth(), 1)
  );

  // Time extraction helpers
  const getHour12 = (date: Date) => {
    const hours = date.getHours();
    const h12 = hours % 12;
    return h12 === 0 ? 12 : h12;
  };
  
  const getAmPm = (date: Date) => {
    return date.getHours() >= 12 ? 'PM' : 'AM';
  };

  const [hours, setHours] = useState(getHour12(selectedDate));
  const [minutes, setMinutes] = useState(Math.round(selectedDate.getMinutes() / 5) * 5 % 60);
  const [amPm, setAmPm] = useState(getAmPm(selectedDate));

  // Sync internal states when prop value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d);
        setHours(getHour12(d));
        setMinutes(Math.round(d.getMinutes() / 5) * 5 % 60);
        setAmPm(getAmPm(d));
      }
    }
  }, [value]);

  // Click outside to close handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update parent state in YYYY-MM-DDTHH:MM local format
  const commitChange = (date: Date, h12: number, m: number, ap: string) => {
    let rawHours = h12;
    if (ap === 'PM' && h12 < 12) rawHours += 12;
    if (ap === 'AM' && h12 === 12) rawHours = 0;

    const newD = new Date(date.getFullYear(), date.getMonth(), date.getDate(), rawHours, m);
    
    const yyyy = newD.getFullYear();
    const mm = String(newD.getMonth() + 1).padStart(2, '0');
    const dd = String(newD.getDate()).padStart(2, '0');
    const hh = String(newD.getHours()).padStart(2, '0');
    const min = String(newD.getMinutes()).padStart(2, '0');
    
    onChange(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
  };

  // Month information
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar cells calculations
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDaysInMonth = new Date(year, month, 0).getDate();

  const daysGrid: { date: Date; isCurrentMonth: boolean }[] = [];

  // Buffer days from previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    daysGrid.push({
      date: new Date(year, month - 1, prevDaysInMonth - i),
      isCurrentMonth: false,
    });
  }

  // Active month days
  for (let i = 1; i <= daysInMonth; i++) {
    daysGrid.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // Buffer days from next month (complete grid to 42 cells)
  const remainingCells = 42 - daysGrid.length;
  for (let i = 1; i <= remainingCells; i++) {
    daysGrid.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    commitChange(date, hours, minutes, amPm);
  };

  const handleHourSelect = (h: number) => {
    setHours(h);
    commitChange(selectedDate, h, minutes, amPm);
  };

  const handleMinuteSelect = (m: number) => {
    setMinutes(m);
    commitChange(selectedDate, hours, m, amPm);
  };

  const handleAmPmSelect = (ap: string) => {
    setAmPm(ap);
    commitChange(selectedDate, hours, minutes, ap);
  };

  // Human readable format for main button
  const formatDisplay = () => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const dd = pad(selectedDate.getDate());
    const mm = pad(selectedDate.getMonth() + 1);
    const yyyy = selectedDate.getFullYear();
    const h = pad(hours);
    const m = pad(minutes);
    return `${dd}/${mm}/${yyyy} (${h}:${m} ${amPm})`;
  };

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      <label className="font-bold uppercase tracking-wider text-neutral-400 block text-[10px]">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-medium flex items-center justify-between text-left hover:border-[#D4AF37] focus:outline-none transition-all text-xs"
      >
        <span>{formatDisplay()}</span>
        <CalendarIcon className="w-4 h-4 text-[#D4AF37] shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-[#151515] border border-white/15 rounded-2xl shadow-2xl p-4 w-[310px] sm:w-[330px] text-white flex flex-col gap-3">
          {/* Calendar Month Selector Header */}
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="font-bold text-[11px] tracking-wider uppercase text-[#D4AF37]">
              {monthNames[month]} {year}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded bg-neutral-900 border border-white/5 hover:bg-neutral-800 text-[#D4AF37]"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded bg-neutral-900 border border-white/5 hover:bg-neutral-800 text-[#D4AF37]"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest gap-0.5">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-0.5 text-[11px]">
            {daysGrid.map((cell, idx) => {
              const isSelected =
                cell.date.getDate() === selectedDate.getDate() &&
                cell.date.getMonth() === selectedDate.getMonth() &&
                cell.date.getFullYear() === selectedDate.getFullYear();

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDaySelect(cell.date)}
                  className={`py-1 rounded-lg text-center font-semibold transition-all ${
                    !cell.isCurrentMonth
                      ? 'text-neutral-700 hover:bg-white/5 text-[10px]'
                      : isSelected
                      ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-black shadow-md scale-105'
                      : 'text-white hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]'
                  }`}
                >
                  {cell.date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Time Picker Panel */}
          <div className="border-t border-white/5 pt-3 flex items-center justify-between gap-1 text-[11px]">
            <div className="flex items-center gap-1 text-neutral-400 font-bold uppercase tracking-wider text-[9px]">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Time</span>
            </div>

            <div className="flex items-center gap-1">
              {/* Hours Selector */}
              <select
                value={hours}
                onChange={(e) => handleHourSelect(Number(e.target.value))}
                className="bg-black/60 border border-white/10 rounded-lg p-1 text-white font-bold focus:outline-none text-[11px]"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h} className="bg-neutral-900 text-white">
                    {String(h).padStart(2, '0')}
                  </option>
                ))}
              </select>

              <span className="text-neutral-500 font-bold">:</span>

              {/* Minutes Selector */}
              <select
                value={minutes}
                onChange={(e) => handleMinuteSelect(Number(e.target.value))}
                className="bg-black/60 border border-white/10 rounded-lg p-1 text-white font-bold focus:outline-none text-[11px]"
              >
                {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
                  <option key={m} value={m} className="bg-neutral-900 text-white">
                    {String(m).padStart(2, '0')}
                  </option>
                ))}
              </select>

              {/* AM / PM Selector */}
              <select
                value={amPm}
                onChange={(e) => handleAmPmSelect(e.target.value)}
                className="bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded-lg p-1 text-[#D4AF37] font-bold focus:outline-none text-[11px]"
              >
                <option value="AM" className="bg-neutral-900 text-white">AM</option>
                <option value="PM" className="bg-neutral-900 text-white">PM</option>
              </select>
            </div>
          </div>

          {/* Close / Apply */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-1 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider transition-all border border-white/5"
          >
            Apply Selection
          </button>
        </div>
      )}
    </div>
  );
};
