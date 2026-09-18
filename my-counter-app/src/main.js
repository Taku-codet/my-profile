import './style.css'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <main class="bg-slate-800 text-slate-100 px-12 py-10 rounded-3xl text-center shadow-2xl">
    <h1 class="text-2xl font-semibold mb-4">カウンター</h1>
    <p id="count" class="text-7xl font-extrabold mb-6 tabular-nums">0</p>
    <div class="flex gap-3 justify-center">
      <button id="decrement" type="button"
        class="text-xl font-bold text-white px-5 py-3 rounded-xl bg-red-500 hover:opacity-85 active:scale-95 transition">−</button>
      <button id="reset" type="button"
        class="text-xl font-bold text-white px-5 py-3 rounded-xl bg-slate-500 hover:opacity-85 active:scale-95 transition">リセット</button>
      <button id="increment" type="button"
        class="text-xl font-bold text-white px-5 py-3 rounded-xl bg-green-500 hover:opacity-85 active:scale-95 transition">＋</button>
    </div>
  </main>
`

setupCounter()