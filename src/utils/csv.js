// Handles UTF-8 BOM, quoted commas, escaped quotes and quoted line breaks.
export function parseCsv(text) {
  const input = text.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (quoted) {
      if (char === '"' && input[i + 1] === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"' && field === '') quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[i + 1] === '\n') i += 1;
      row.push(field);
      if (row.some(value => value !== '')) rows.push(row);
      row = []; field = '';
    } else field += char;
  }
  if (quoted) throw new Error('CSV 引号未闭合');
  row.push(field);
  if (row.some(value => value !== '')) rows.push(row);
  const [headers = [], ...data] = rows;
  if (headers.length === 0) return [];
  return data.map((cells, index) => {
    if (cells.length !== headers.length) throw new Error(`CSV 第 ${index + 2} 行列数不一致`);
    return Object.fromEntries(headers.map((header, column) => [header, cells[column]]));
  });
}

export async function readCsv(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return parseCsv(await response.text());
}
