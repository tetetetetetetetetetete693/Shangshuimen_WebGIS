import { readCsv } from './utils/csv.js';
import { remoteAsset } from './data-paths.js';

const areaFile = '表5_土地利用转移矩阵_面积公顷.csv';
const pixelFile = '表4_土地利用转移矩阵_像元.csv';
const safe = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

function numeric(raw, label) {
  if (raw == null || raw.trim() === '') return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) throw new Error(`${label} 含无效数值：${raw}`);
  return value;
}
function inspect(rows, unit) {
  if (!rows.length) throw new Error('矩阵 CSV 没有数据行');
  const headers = Object.keys(rows[0]);
  const first = headers[0];
  if (!first.includes('2022') || !first.includes('2025') || !first.includes(unit) || headers.at(-1) !== '行合计') throw new Error('矩阵表头与预期结构不符');
  const targets = headers.slice(1, -1);
  const entries = rows.filter(row => row[first]?.trim() !== '列合计');
  const names = entries.map(row => row[first]?.trim());
  if (names.length !== targets.length || names.some((name, i) => name !== targets[i])) throw new Error('矩阵行列地类名称不一致');
  return { first, targets, entries };
}

export async function renderDiagnosis(root) {
  root.innerHTML = '<p class="loading-state" role="status">正在读取转移矩阵…</p>';
  const [areaResult, pixelResult] = await Promise.allSettled([readCsv(remoteAsset(areaFile)), readCsv(remoteAsset(pixelFile))]);
  if (!root.isConnected) return;
  if (areaResult.status === 'rejected') {
    root.innerHTML = `<p class="load-error" role="alert">面积矩阵读取失败：${safe(areaResult.reason.message)}</p>`;
    return;
  }
  try {
    const area = inspect(areaResult.value, '公顷');
    let pixels = null;
    let pixelError = '';
    if (pixelResult.status === 'fulfilled') {
      try {
        pixels = inspect(pixelResult.value, '像元');
        if (pixels.targets.join('|') !== area.targets.join('|') || pixels.entries.some((row, i) => row[pixels.first]?.trim() !== area.entries[i][area.first]?.trim())) throw new Error('像元矩阵的行列地类与面积矩阵不一致');
      } catch (error) { pixelError = error.message; }
    } else pixelError = pixelResult.reason.message;
    const values = area.entries.flatMap(row => area.targets.map(target => numeric(row[target], '面积矩阵')));
    const maximum = Math.max(1, ...values.filter(value => value != null));
    const header = area.targets.map(target => `<th scope="col" title="2025：${safe(target)}">${safe(target)}</th>`).join('');
    const body = area.entries.map((row, fromIndex) => {
      const from = row[area.first].trim();
      const cells = area.targets.map((target, toIndex) => {
        const value = numeric(row[target], '面积矩阵');
        const opacity = value == null ? 0 : value === 0 ? 0.08 : 0.14 + 0.78 * Math.sqrt(value / maximum);
        const label = value == null ? '—' : value.toFixed(2);
        return `<td><button type="button" class="matrix-cell" data-from="${fromIndex}" data-to="${toIndex}" style="--heat:${opacity.toFixed(3)}" aria-label="${safe(from)} 到 ${safe(target)}：${value == null ? '缺失' : value.toFixed(4) + ' 公顷'}" title="${safe(from)} → ${safe(target)}：${value == null ? '缺失' : value.toFixed(4) + ' ha'}">${label}</button></td>`;
      }).join('');
      return `<tr><th scope="row" title="2022：${safe(from)}">${safe(from)}</th>${cells}</tr>`;
    }).join('');
    root.innerHTML = `<p class="panel-note">2022 年 7 月（行）→ 2025 年 9 月（列） · 面积单位 ha。点击单元格查询原值。</p><div class="matrix-legend"><span>转移面积</span><span class="matrix-scale" aria-hidden="true"></span><span>0</span><span>${maximum.toFixed(4)} ha</span></div><div class="matrix-scroll"><table class="matrix-table"><caption>土地利用转移矩阵 · 2022 → 2025 · ha</caption><thead><tr><th scope="col">2022 ＼ 2025</th>${header}</tr></thead><tbody>${body}</tbody></table></div><div id="matrix-detail" class="matrix-detail" role="status">选择一个单元格查看原地类、目标地类、面积和像元数。</div>${pixelError ? `<p class="load-error" role="alert">像元辅助数据不可用：${safe(pixelError)}</p>` : ''}<p class="source-note">面积来源：${safe(areaFile)}<br>像元来源：${safe(pixelFile)}</p><p class="panel-note">同一地类（矩阵对角线）表示保持；不同地类表示转移。原始分类受阴影和季节差异影响，结果宜结合专题影像判读。</p>`;
    root.querySelector('.matrix-table').addEventListener('click', event => {
      const button = event.target.closest('.matrix-cell');
      if (!button) return;
      root.querySelector('.matrix-cell.selected')?.classList.remove('selected');
      button.classList.add('selected');
      const fromIndex = Number(button.dataset.from);
      const toIndex = Number(button.dataset.to);
      const from = area.entries[fromIndex][area.first].trim();
      const to = area.targets[toIndex];
      const areaRaw = area.entries[fromIndex][to];
      const areaValue = numeric(areaRaw, '面积矩阵');
      const pixelRaw = pixels?.entries[fromIndex]?.[to];
      const pixelValue = pixelRaw == null ? null : numeric(pixelRaw, '像元矩阵');
      root.querySelector('#matrix-detail').innerHTML = `<strong>${from === to ? '同类保持' : '地类转移'}</strong><dl><dt>原地类 · 2022</dt><dd>${safe(from)}</dd><dt>目标地类 · 2025</dt><dd>${safe(to)}</dd><dt>面积</dt><dd>${areaValue == null ? '无数据' : safe(areaRaw) + ' ha'}</dd><dt>像元数</dt><dd>${pixelValue == null ? '无数据' : safe(pixelRaw) + ' 像元'}</dd></dl>`;
    });
  } catch (error) {
    root.innerHTML = `<p class="load-error" role="alert">转移矩阵解析失败：${safe(error.message)}</p>`;
  }
}

