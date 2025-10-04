import React, { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js'
import { saveDataset } from '../utils/storage'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

type RunResult = { t: number; temp: number }[]

function simulateHeatingCooling(
  startTemp: number,
  power: number,
  durationMin: number,
  ambient: number,
  phase: 'heat'|'cool'
): RunResult {
  // Simple physics-inspired model (not exact): T_{n+1} = T_n + k*(P - loss*(T-ambient))
  // For "cool", set P=0 and just decay toward ambient.
  const dt = 1 // minute steps
  const k = 0.6 / 60 // responsiveness
  const loss = 0.15
  const maxBoil = 100
  const res: RunResult = []
  let T = startTemp
  for (let t = 0; t <= durationMin; t += dt) {
    res.push({ t, temp: T })
    const P = phase === 'heat' ? power : 0
    let dT = k * (P - loss * (T - ambient)) * 60
    T = T + dT
    // Clip at 100°C plateau during heating to mimic phase change
    if (phase === 'heat' && T > maxBoil) T = maxBoil
    // Move slowly near ambient during cooling
    if (phase === 'cool' && T < ambient) T = ambient
  }
  return res
}

export function Experiment() {
  const [startTemp, setStartTemp] = useState(20)
  const [power, setPower] = useState(60)
  const [duration, setDuration] = useState(20)
  const [ambient, setAmbient] = useState(20)
  const [phase, setPhase] = useState<'heat'|'cool'>('heat')
  const [label, setLabel] = useState('Run 1')

  const data = useMemo(() => simulateHeatingCooling(startTemp, power, duration, ambient, phase), [startTemp, power, duration, ambient, phase])

  const chartData = useMemo(() => ({
    labels: data.map(d => `${d.t}分`),
    datasets: [{
      label: `${label}（${phase === 'heat' ? '加熱' : '冷却'}）`,
      data: data.map(d => d.temp),
      borderWidth: 2,
      pointRadius: 2
    }]
  }), [data, label, phase])

  const chartOpts = { responsive: true, plugins: { legend: { display: true } }, scales: { y: { title: { display: true, text: '温度(°C)' }}, x: { title: { display: true, text: '時間(分)'}} } }

  function handleSave() {
    saveDataset({ label, phase, startTemp, power, duration, ambient, data })
    alert('この実験データを保存しました（ブラウザのローカル保存）。')
  }

  return (
    <div>
      <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: 12}}>
        <div>
          <label>ラベル</label>
          <input value={label} onChange={e => setLabel(e.target.value)} />
        </div>
        <div>
          <label>段階</label>
          <select value={phase} onChange={e => setPhase(e.target.value as any)}>
            <option value="heat">加熱</option>
            <option value="cool">冷却</option>
          </select>
        </div>
        <div>
          <label>開始温度 (°C)</label>
          <input type="number" value={startTemp} onChange={e => setStartTemp(parseFloat(e.target.value))} />
        </div>
        <div>
          <label>加熱パワー (0-100)</label>
          <input type="range" min={0} max={100} value={power} onChange={e => setPower(parseInt(e.target.value))} />
          <div className="small muted">現在: {power}</div>
        </div>
        <div>
          <label>実験時間 (分)</label>
          <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value))} />
        </div>
        <div>
          <label>周囲温度 (°C)</label>
          <input type="number" value={ambient} onChange={e => setAmbient(parseFloat(e.target.value))} />
        </div>
      </div>

      <div className="card" style={{marginTop: 12}}>
        <Line data={chartData} options={chartOpts as any} />
      </div>

      <div className="row" style={{marginTop: 12}}>
        <button onClick={handleSave}>データを保存</button>
        <a className="muted" href="https://github.com/reactchartjs/react-chartjs-2" target="_blank" rel="noreferrer">グラフライブラリ情報</a>
      </div>
    </div>
  )
}
