// 六角形のレーダーチャート。
// data は { id, label, value } を6件受け取るだけ。history も localStorage も知らない。
// id は key に使うためだけのもので、描画には使わない。

const CX = 180 // 中心の x（左右のラベルが収まるよう、横幅 360 の中央に置く）
const CY = 150 // 中心の y
const R = 98 // 外周までの半径

// 値が0でも六角形が中心の一点に潰れないように確保する、最小の半径の割合
const MIN_RATIO = 0.14

// i番目の頂点の角度。真上（-90度）から時計回りに60度ずつ。
function angleOf(i) {
  return ((-90 + i * 60) * Math.PI) / 180
}

// i番目の頂点の座標を、半径 r で求める
function pointOf(i, r) {
  const angle = angleOf(i)
  return [CX + Math.cos(angle) * r, CY + Math.sin(angle) * r]
}

// 6つの半径の配列を、polygon の points 属性用の "x,y x,y ..." に変換する
function toPoints(radiusList) {
  return radiusList
    .map((r, i) => {
      const [x, y] = pointOf(i, r)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

function HexChart({ data }) {
  // いちばん大きい値を基準にする。全部0のときに0で割らないよう、最低でも1にする。
  const max = Math.max(...data.map((d) => d.value), 1)

  // 各項目の半径。MIN_RATIO を下駄にして、残りを値の比率で配る。
  const valueRadius = data.map((d) => R * (MIN_RATIO + (1 - MIN_RATIO) * (d.value / max)))

  return (
    <svg viewBox="0 0 360 300" className="w-full" aria-label="ステータス六角形">
      {/* 目盛りの六角形（3重） */}
      {[0.34, 0.67, 1].map((ratio) => (
        <polygon
          key={ratio}
          points={toPoints(Array(6).fill(R * ratio))}
          className="fill-none stroke-slate-300"
          strokeWidth="1"
        />
      ))}

      {/* 中心から各頂点へ伸びる軸線 */}
      {data.map((d, i) => {
        const [x, y] = pointOf(i, R)
        return (
          <line
            key={d.id}
            x1={CX}
            y1={CY}
            x2={x.toFixed(1)}
            y2={y.toFixed(1)}
            className="stroke-slate-200"
            strokeWidth="1"
          />
        )
      })}

      {/* 実際の値を結んだ六角形 */}
      <polygon
        points={toPoints(valueRadius)}
        className="fill-orange-500/15 stroke-orange-600"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* 各頂点の点 */}
      {valueRadius.map((r, i) => {
        const [x, y] = pointOf(i, r)
        return (
          <circle
            key={data[i].id}
            cx={x.toFixed(1)}
            cy={y.toFixed(1)}
            r="3.2"
            className="fill-white stroke-orange-600"
            strokeWidth="2"
          />
        )
      })}

      {/* 項目名と値のラベル。外周より 30 だけ外側に置く。 */}
      {data.map((d, i) => {
        const [x, y] = pointOf(i, R + 30)
        // 真上・真下は中央寄せ、右半分は左寄せ、左半分は右寄せ
        const anchor = Math.abs(x - CX) < 6 ? 'middle' : x > CX ? 'start' : 'end'
        // 真上（i=0）と真下（i=3）だけ、文字が線に重ならないよう縦にずらす
        const offsetY = i === 0 ? -2 : i === 3 ? 14 : 4
        return (
          <text
            key={d.id}
            x={x.toFixed(1)}
            y={(y + offsetY).toFixed(1)}
            textAnchor={anchor}
            className="fill-slate-700 text-[11px] font-bold"
          >
            {d.label} <tspan className="fill-orange-600">{d.value}</tspan>
          </text>
        )
      })}
    </svg>
  )
}

export default HexChart
