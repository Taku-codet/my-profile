// 直近7日間の記録を横一列で見せる帯。
// days は7件。1件ごとに { date, weekday, label, colorClass, isToday } を受け取るだけ。

function WeekStrip({ days }) {
  return (
    <section className="rounded-2xl border border-slate-300 bg-white p-3">
      <p className="mb-2 text-[11px] font-bold tracking-widest text-slate-400">この7日間</p>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => (
          <div key={day.date} className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-slate-400">{day.weekday}</span>
            <div
              className={`flex aspect-square w-full items-center justify-center rounded-lg text-[9px] leading-none font-bold ${
                day.label ? `text-white ${day.colorClass}` : 'bg-slate-100 text-slate-300'
              } ${day.isToday ? 'ring-2 ring-orange-500' : ''}`}
            >
              {day.label || '・'}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default WeekStrip
