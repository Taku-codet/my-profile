import { useState, useEffect } from 'react'
import HexChart from './HexChart.jsx'
import WeekStrip from './WeekStrip.jsx'

// localStorage に保存するときの引き出しの名前。固定の文字列にする。
const STORAGE_KEY = 'hexme-react-v1'

// 項目の定義。id は保存した記録が指す先になるので、一度決めたら変えない。
const DEFAULT_STATS = [
  { id: 'str', label: 'つよさ', hint: '筋トレ・スポーツ、面接やスピーチなど本番の経験' },
  { id: 'int', label: 'かしこさ', hint: '読書・学問の勉強（ライトノベルも可）' },
  { id: 'tec', label: 'ぎじゅつ', hint: '趣味で頭を使う。プログラミング・ドローン・語学・ゲーム上達' },
  { id: 'dex', label: 'きようさ', hint: '家事技術の向上' },
  { id: 'hap', label: '幸福度', hint: '恋愛や家族とのコミュニケーション' },
  { id: 'rest', label: '休息値', hint: 'さぼりが目立った日・体調不良で寝込んだ日' },
]

// 日付を "YYYY-MM-DD" にする。日付を使う所は必ずこの関数を通す。
// toISOString() は UTC になり日本時間と最大9時間ずれるので使わない。
function pad(n) {
  return String(n).padStart(2, '0')
}

function toDateStr(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// 日付を days 日ずらした新しい Date を返す。元の date は変えない。
function shiftDate(date, days) {
  const shifted = new Date(date)
  shifted.setDate(shifted.getDate() + days)
  return shifted
}

const WEEKDAY_NAMES = ['日', '月', '火', '水', '木', '金', '土']

// 7日間の帯で使う、項目ごとの色。Tailwind はソース中の文字列をそのまま探すので、
// `bg-${color}-500` のような組み立て方をせず、完全なクラス名で書く。
const COLOR_BY_ID = {
  str: 'bg-orange-500',
  int: 'bg-blue-500',
  tec: 'bg-teal-500',
  dex: 'bg-purple-500',
  hap: 'bg-pink-500',
  rest: 'bg-slate-500',
}

// localStorage から読み込む。何も無い／壊れているときは初期値を返す。
function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved && Array.isArray(saved.history)) {
      const hasStats = Array.isArray(saved.stats) && saved.stats.length === 6
      return { stats: hasStats ? saved.stats : DEFAULT_STATS, history: saved.history }
    }
  } catch {
    // JSON.parse は壊れた文字列だと例外を投げる。そのときは初期値で始める。
  }
  return { stats: DEFAULT_STATS, history: [] }
}

function App() {
  // useState に関数を渡すと、初回の1回だけ実行してその戻り値を初期値にする。
  // ここで読み込んでおくことで、保存の useEffect が空の配列で上書きする隙が無くなる。
  const [stats] = useState(() => loadSaved().stats)
  const [history, setHistory] = useState(() => loadSaved().history)

  // history か stats が変わるたびに、まとめて保存する。
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stats, history }))
    } catch {
      // プライベートブラウズや容量オーバーだと setItem は例外を投げる。
      // 落とさずに続けるが、黙って失敗しないようコンソールには残す。
      console.warn('保存できませんでした（プライベートブラウズか、容量オーバーの可能性）')
    }
  }, [stats, history])

  // 項目の現在値は state に持たず、history を数えて出す。
  function countOf(id) {
    return history.filter((h) => h.id === id).length
  }

  const todayStr = toDateStr(new Date())
  // 今日の記録。まだ無ければ undefined。
  const todayRecord = history.find((h) => h.date === todayStr)
  const isLockedToday = Boolean(todayRecord)

  // 記録を1件追加する。元の配列は変えず、新しい配列を作って渡す。
  function addRecord(id) {
    if (isLockedToday) return
    setHistory([...history, { date: todayStr, id }])
  }

  // 今日の記録を取り消す。今日の日付以外を残した、新しい配列を作る。
  function undoToday() {
    setHistory(history.filter((h) => h.date !== todayStr))
  }

  // その日に記録があるか
  function hasRecord(dateStr) {
    return history.some((h) => h.date === dateStr)
  }

  // 連続記録日数。今日まだ記録していなければ昨日を起点にして、途切れるまで遡る。
  function countStreak() {
    let cursor = new Date()
    if (!hasRecord(toDateStr(cursor))) cursor = shiftDate(cursor, -1)
    let count = 0
    while (hasRecord(toDateStr(cursor))) {
      count++
      cursor = shiftDate(cursor, -1)
    }
    return count
  }

  const streak = countStreak()

  // 直近7日ぶん（6日前 → 今日）の表示用データを組み立てる。
  // これは state ではなく、この場で作って捨てるただの配列なので push してよい。
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = shiftDate(new Date(), -i)
    const dateStr = toDateStr(date)
    const record = history.find((h) => h.date === dateStr)
    const stat = record ? stats.find((s) => s.id === record.id) : undefined
    days.push({
      date: dateStr,
      weekday: WEEKDAY_NAMES[date.getDay()],
      label: stat ? stat.label.slice(0, 2) : '',
      colorClass: record ? COLOR_BY_ID[record.id] : '',
      isToday: i === 0,
    })
  }

  // チャートに渡すのは、id とラベルと値の6件だけ。id は key に使うためで、描画には使わない。
  const chartData = stats.map((stat) => ({
    id: stat.id,
    label: stat.label,
    value: countOf(stat.id),
  }))

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900">
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <header className="flex items-end justify-between">
          <h1 className="text-xl font-extrabold tracking-wide">
            Hex<span className="text-orange-600">Me</span>
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span
              className={`rounded-full border px-2.5 py-1 ${
                streak >= 3
                  ? 'border-orange-300 bg-orange-50 text-orange-600'
                  : 'border-slate-300 bg-white'
              }`}
            >
              🔥 継続 <b className="text-sm">{streak}</b> 日
            </span>
            <span>
              合計 <b className="text-sm text-slate-900">{history.length}</b>
            </span>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-300 bg-white p-3">
          <HexChart data={chartData} />
        </section>

        <WeekStrip days={days} />

        {isLockedToday && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-orange-300 bg-orange-50 px-3 py-2 text-xs">
            <span className="text-slate-600">
              今日は <b className="text-slate-900">{stats.find((s) => s.id === todayRecord.id).label}</b>{' '}
              を記録しました
            </span>
            <button
              type="button"
              onClick={undoToday}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1 font-bold text-slate-600 transition hover:border-orange-500 hover:text-orange-600"
            >
              取り消す
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat) => {
            const isPicked = isLockedToday && todayRecord.id === stat.id
            return (
              <button
                key={stat.id}
                type="button"
                disabled={isLockedToday}
                onClick={() => addRecord(stat.id)}
                className={`flex flex-col gap-1.5 rounded-xl border p-3 text-left transition ${
                  isPicked
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-300 bg-white hover:border-orange-500'
                } ${isLockedToday && !isPicked ? 'opacity-50' : ''}`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-bold">{stat.label}</span>
                  <span className="text-lg font-bold text-orange-600">{countOf(stat.id)}</span>
                </span>
                <span className="text-[10px] leading-snug text-slate-500">{stat.hint}</span>
                <span
                  className={`self-start rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isPicked ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-600'
                  }`}
                >
                  {isPicked ? '今日の記録' : '＋1 する'}
                </span>
              </button>
            )
          })}
        </div>

        <p className="text-center text-xs text-slate-400">
          記録はこの端末（ブラウザ）にだけ保存されます。
          <br />
          1日1回・もっとも当てはまる項目をひとつ選んで＋1。
        </p>
      </div>
    </div>
  )
}

export default App
