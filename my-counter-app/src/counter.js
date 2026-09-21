const STORAGE_KEY = 'counter-value'

export function setupCounter() {
  // ★変更点1：起動時に localStorage から前回の値を復元（無ければ 0）
  let count = Number(localStorage.getItem(STORAGE_KEY)) || 0

  const display = document.querySelector('#count')
  const incrementBtn = document.querySelector('#increment')
  const decrementBtn = document.querySelector('#decrement')
  const resetBtn = document.querySelector('#reset')

  const render = () => {
    display.textContent = count
    // ★変更点2：マイナスなら negative クラスを付ける（CSSで赤くなる）
display.classList.toggle('text-red-400', count < 0)
    // ★変更点3：今の値を保存する
    localStorage.setItem(STORAGE_KEY, count)
  }

  incrementBtn.addEventListener('click', () => {
    count += 1
    render()
  })

  decrementBtn.addEventListener('click', () => {
    count -= 1
    render()
  })

  resetBtn.addEventListener('click', () => {
    count = 0
    render()
  })

  render()
}