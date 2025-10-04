import React from 'react'
import { Experiment } from './components/Experiment'
import { ResearchNote } from './components/ResearchNote'

export default function App() {
  return (
    <div className="grid">
      <div className="card">
        <h2>🧪 実験シミュレーション（水の加熱・冷却）</h2>
        <p className="muted">仮説を立てて条件を設定し、実験を実行。結果をグラフで確認します。</p>
        <Experiment />
      </div>
      <div className="card">
        <h2>📓 研究ノート</h2>
        <p className="muted">目的・仮説・考察を記録。データと一緒に保存できます。</p>
        <ResearchNote />
      </div>
    </div>
  )
}
