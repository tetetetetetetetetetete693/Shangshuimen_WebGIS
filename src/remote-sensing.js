import { readCsv } from './utils/csv.js';
import { remoteAsset } from './data-paths.js';

const sources = [
  { csv: '表1_绿度分级面积对比.csv', image: '图3_绿度分级两期对比.png', caption: '两期 EXG 绿度分级空间分布' },
  { csv: '表2_绿度变化类型统计.csv', image: '图6_变化类型分级图.png', caption: '2022—2025 年 EXG 变化类型分布' },
  { csv: '表3_土地利用分类面积.csv', image: '图8_土地利用分类两期.png', caption: '两期土地利用分类空间分布' }
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
function number(row, key) {
  const raw = row[key]?.trim();
  if (raw == null || raw === '') return null;
  const value = Number(raw);
  if (!Number.isFinite(value)) throw new Error(`字段“${key}”含非数值：${raw}`);
  return value;
}
function columns(rows, category) {
  if (!rows.length) throw new Error('CSV 没有数据行');
  const headers = Object.keys(rows[0]);
  if (!headers.includes(category)) throw new Error(`缺少字段“${category}”`);
  const areas = headers.filter(key => /^20\d{2}面积_ha$/.test(key)).sort();
  if (areas.length !== 2) throw new Error('未找到两期面积_ha 字段');
  return areas;
}
function image(figure, source) {
  figure.innerHTML = `<img loading="lazy" alt="${escapeHtml(source.caption)}" src="${remoteAsset(source.image)}"><figcaption>${escapeHtml(source.caption)} · 专题图来源：${escapeHtml(source.image)}</figcaption>`;
  figure.querySelector('img').addEventListener('error', () => {
    figure.innerHTML = `<p class="load-error">专题图加载失败：${escapeHtml(source.image)}</p>`;
  }, { once: true });
}
function pairChart(rows, category, title) {
  const areas = columns(rows, category);
  const data = rows.filter(row => !/^合计|^运动场\(另行统计\)/.test(row[category]?.trim() || ''));
  const max = Math.max(1, ...data.flatMap(row => areas.map(key => number(row, key) ?? 0)));
  const labels = areas.map(key => key.slice(0, 4));
  const items = data.map(row => {
    const bars = areas.map((key, index) => {
      const value = number(row, key);
      const width = value == null ? 0 : value / max * 100;
      return `<div class="bar-line"><span class="bar-year">${labels[index]}</span><span class="bar-track"><span class="bar-fill year-${index}" style="width:${width}%"></span></span><strong title="${escapeHtml(row[key] ?? '')} ha">${value == null ? '—' : value.toFixed(4)} ha</strong></div>`;
    }).join('');
    return `<div class="chart-row"><div class="chart-label">${escapeHtml(row[category])}</div>${bars}</div>`;
  }).join('');
  return `<h2>${title}</h2><div class="chart-meta">面积 · ha <span class="legend"><i class="year-0"></i>${labels[0]}年 <i class="year-1"></i>${labels[1]}年</span></div><div class="bar-chart">${items}</div>`;
}
function changeChart(rows, years) {
  if (!rows.length) throw new Error('CSV 没有数据行');
  const headers = Object.keys(rows[0]);
  if (!headers.includes('变化类型') || !headers.includes('面积_ha')) throw new Error('缺少变化类型或面积_ha 字段');
  const data = rows.filter(row => row['变化类型']?.trim() !== '合计');
  const max = Math.max(1, ...data.map(row => number(row, '面积_ha') ?? 0));
  const items = data.map(row => {
    const label = row['变化类型'];
    const value = number(row, '面积_ha');
    const type = label.includes('退化') ? 'decline' : label.includes('改善') ? 'improve' : 'stable';
    return `<div class="chart-row"><div class="chart-label">${escapeHtml(label)}</div><div class="bar-line"><span class="bar-track"><span class="bar-fill ${type}" style="width:${value == null ? 0 : value / max * 100}%"></span></span><strong title="${escapeHtml(row['面积_ha'] ?? '')} ha">${value == null ? '—' : value.toFixed(4)} ha</strong></div></div>`;
  }).join('');
  return `<h2>EXG 绿度变化类型</h2><div class="chart-meta">${years[0]}→${years[1]} · 变化面积 ha <span class="legend"><i class="decline"></i>退化 <i class="stable"></i>稳定 <i class="improve"></i>改善</span></div><div class="bar-chart">${items}</div>`;
}

export async function renderRemote(root) {
  root.innerHTML = '<p class="loading-state" role="status">正在读取遥感 CSV 与专题图…</p>';
  const results = await Promise.allSettled(sources.map(source => readCsv(remoteAsset(source.csv))));
  if (!root.isConnected) return;
  const gradeRows = results[0].status === 'fulfilled' ? results[0].value : null;
  const landRows = results[2].status === 'fulfilled' ? results[2].value : null;
  const yearKeys = gradeRows ? Object.keys(gradeRows[0] || {}).filter(key => /^20\d{2}面积_ha$/.test(key)).sort() : landRows ? Object.keys(landRows[0] || {}).filter(key => /^20\d{2}面积_ha$/.test(key)).sort() : [];
  const years = yearKeys.length === 2 ? yearKeys.map(key => key.slice(0, 4)) : ['2022', '2025'];
  root.innerHTML = '<p class="panel-note">两期为 2022 年 7 月、2025 年 9 月；绿度采用可见光 EXG（2G−R−B），不是 NDVI。影像季节、阴影及辐射差异可能造成伪变化。</p>';
  results.forEach((result, index) => {
    const section = document.createElement('section');
    section.className = 'analysis-section';
    const source = sources[index];
    try {
      if (result.status === 'rejected') throw result.reason;
      section.innerHTML = index === 0 ? pairChart(result.value, '绿度等级', 'EXG 绿度分级面积') : index === 1 ? changeChart(result.value, years) : pairChart(result.value, '地类', '土地利用分类面积');
      const figure = document.createElement('figure');
      figure.className = 'thematic-figure';
      image(figure, source);
      section.append(figure);
      section.insertAdjacentHTML('beforeend', `<p class="source-note">统计来源：${escapeHtml(source.csv)}</p>`);
    } catch (error) {
      section.innerHTML = `<h2>${escapeHtml(source.csv)}</h2><p class="load-error" role="alert">CSV 读取或解析失败：${escapeHtml(error.message)}</p>`;
    }
    root.append(section);
  });
}
