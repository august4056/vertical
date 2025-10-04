import React, { useEffect, useState } from 'react'
import { loadDatasets, exportCSV, clearAll } from '../utils/storage'

type Dataset = ReturnType<typeof loadDatasets>[number]

export function ResearchNote() {
  const [title, setTitle] = useState('水の状態変化の研究')
  const [purpose, setPurpose] = useState('水を加熱・冷却したときの温度変化を調べる。')
  const [hypothesis, setHypothesis] = useState('加熱中は温度が上昇し、沸騰中は100°C付近で一定になる。')
  const [consideration, setConsideration] = useState('結果から、加熱時の温度上昇と沸騰時の一定温度が確認できた。冷却では周囲温度に近づく。')
  const [datasets, setDatasets] = useState<Dataset[]>([])

  const refresh = () => setDatasets(loadDatasets())
  useEffect(() => { refresh() }, [])

  function handleExport() {
    const csv = exportCSV({ title, purpose, hypothesis, consideration, datasets })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g,'_')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: 12}}>
        <div>
          <label>研究タイトル</label>
          <input value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label>目的</label>
          <input value={purpose} onChange={e => setPurpose(e.target.value)} />
        </div>
        <div style={{gridColumn: '1 / -1'}}>
          <label>仮説</label>
          <textarea rows={3} value={hypothesis} onChange={e => setHypothesis(e.target.value)} />
        </div>
        <div style={{gridColumn: '1 / -1'}}>
          <label>考察</label>
          <textarea rows={4} value={consideration} onChange={e => setConsideration(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{marginTop: 12}}>
        <div className="row" style={{justifyContent:'space-between'}}>
          <div>
            <div className="kpi">{datasets.length}</div>
            <div className="muted small">保存済みデータセット</div>
          </div>
          <div className="row">
            <button className="ghost" onClick={refresh}>更新</button>
            <button onClick={handleExport}>CSV出力</button>
            <button className="ghost" onClick={() => { if(confirm('すべての保存データを削除します。よろしいですか？')) { clearAll(); refresh(); }}}>全削除</button>
          </div>
        </div>
        <ul style={{marginTop:12, paddingLeft:18}}>
          {datasets.map((d, i) => (
            <li key={i} style={{marginBottom:8}}>
              <strong>{d.label}</strong>（{d.phase === 'heat' ? '加熱' : '冷却'}） — 開始{d.startTemp}°C / パワー{d.power} / {d.duration}分 / 周囲{d.ambient}°C
            </li>
          ))}
        </ul>
        <p className="muted small">※ データはブラウザに保存されています（学校PCを変えると消えます）。</p>
      </div>
    </div>
  )
}
