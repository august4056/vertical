type Saved = {
  label: string
  phase: 'heat'|'cool'
  startTemp: number
  power: number
  duration: number
  ambient: number
  data: { t:number; temp:number }[]
}

const KEY = 'researcher_lab_mvp.datasets.v1'

export function loadDatasets(): Saved[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveDataset(d: Saved) {
  const all = loadDatasets()
  all.push(d)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function clearAll() {
  localStorage.removeItem(KEY)
}

export function exportCSV(payload: {
  title: string
  purpose: string
  hypothesis: string
  consideration: string
  datasets: Saved[]
}) {
  const lines: string[] = []
  lines.push('title,purpose,hypothesis,consideration')
  const esc = (s:string) => '"' + (s||'').replaceAll('"','""') + '"'
  lines.push([esc(payload.title), esc(payload.purpose), esc(payload.hypothesis), esc(payload.consideration)].join(','))
  lines.push('')
  lines.push('label,phase,start_temp,power,duration,ambient,time_min,temp_c')
  payload.datasets.forEach(ds => {
    ds.data.forEach(pt => {
      lines.push([
        esc(ds.label), ds.phase, ds.startTemp, ds.power, ds.duration, ds.ambient, pt.t, pt.temp.toFixed(2)
      ].join(','))
    })
  })
  return lines.join('\n')
}
