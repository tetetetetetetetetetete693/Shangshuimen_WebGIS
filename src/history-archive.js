const sources = {
  1: { title: '烟台文旅云数字博物馆：登州府城墙遗址', url: 'https://www.ytta.cn/digimuseum/relics/1342431306297901056/relics' },
  2: { title: '蓬莱历史文化名城保护规划基础资料汇编', url: 'https://www.penglai.gov.cn/module/download/downfile.jsp?classid=0&filename=d1b8ddd83b59464abe04f3be7e4dabb5.pdf' },
  3: { title: '大众日报：画河改造与群众生活', url: 'http://sd.dzwww.com/sdnews/202502/t20250216_15525306.htm' },
  4: { title: '蓬莱区政府：环境综合整治用地规划许可批前公示', url: 'https://www.penglai.gov.cn/art/2024/5/16/art_13426_2967865.html' },
  5: { title: '国家文物局：武霖上水门环境综合整治项目批复', url: 'http://www.ncha.gov.cn/art/2024/5/8/art_2237_46704.html' },
  6: { title: '蓬莱区政府：上水门遗址修缮报道', url: 'https://www.penglai.gov.cn/col/col13638/art/2026/art_3f5f327928a4495a85062b7e6e6303f7.html' },
  7: { title: '山东省人民政府：环境综合整治项目批复', url: 'http://www.shandong.gov.cn/art/2025/2/12/art_100619_45725.html' },
  8: { title: '烟台日报：风光尽在画中苏', url: 'https://www.shm.com.cn/szb/ytwb/paper/pc/content/202503/02/content_220310.html' }
};

const timeline = [
  { date: '1376年', title: '明代登州府城扩建', text: '明洪武九年，登州升府并扩建府城。上水门所在的府城水系与城防体系，与明代登州府城建设密切相关，是研究古代城市水利、交通和防御设施的重要遗存。', refs: [2] },
  { date: '明清时期', title: '上水门水利与城防功能延续', text: '上水门作为登州府城水系与城防设施的重要组成部分，其三孔拱券式建筑结构反映了古代城市排水、交通及城防空间的结合。相关设施在明清府城发展过程中具有重要的历史研究价值。', refs: [] },
  { date: '近现代', title: '上水门历史功能转变', text: '随着传统城防体系衰退和城市空间不断演变，上水门逐渐失去原有的城防及水利设施功能，其建筑遗存成为研究登州府城历史格局与城市变迁的重要实物资料。', refs: [] },
  { date: '2011年', title: '登州府城墙遗址获市级文物保护身份', text: '登州府城墙遗址列入烟台市第四批市级文物保护单位，为上水门相关历史遗存的保护提供制度基础。', refs: [] },
  { date: '2022年', title: '登州府城墙遗址列入省级文物保护单位', text: '登州府城墙遗址列入山东省第六批省级文物保护单位，相关城防遗存的文物保护与管理进一步加强。', refs: [] },
  { date: '2024年5月', title: '上水门环境整治方案进入审批', text: '武霖上水门环境综合整治项目进入用地规划许可批前公示阶段。国家文物局原则同意在保护范围内实施相关项目，并要求深化研究、完善文物影响评估等工作。', refs: [4, 5] },
  { date: '2025年2月', title: '环境综合整治项目获得省级批复', text: '山东省人民政府批复同意在登州府城墙遗址保护范围内实施环境综合整治项目，要求依据修改完善后的方案实施并加强监管。', refs: [7] },
  { date: '2026年7月', title: '上水门遗址保护性修缮', text: '蓬莱区政府公开报道遗址修缮遵循“循旧如旧、最小干预”原则，采用传统工艺、材料和技法，强调历史风貌与遗址真实性保护。', refs: [6] }
];

const cards = [
  { group: '古城格局', title: '画河入城的水门', text: '上水门位于登州府城南部画河入城处，是府城三座水门之一。资料记载府城另有东、南、西、北四座城门。', refs: [1, 2] },
  { group: '建筑特征', title: '三孔拱券与分水结构', text: '资料记载遗址有三孔拱券门洞；单洞东西宽约 4.6 米、南北进深约 10.75 米、高约 6.5 米。门洞前的分水石用于分流、减缓水流冲击。这些尺寸来自文献整理，尚未以本站模型独立测量复核。', refs: [2] },
  { group: '建筑价值', title: '水利与城防相结合', text: '水门闸槽与河道入口体现控水、防洪和城防功能。保留的砖石、夯土和拱券结构，为研究明代府城水门建筑提供实物线索。', refs: [1, 2] },
  { group: '遗址保护', title: '保护等级与修缮', text: '上水门所在的登州府城墙遗址现为省级文物保护单位。现有资料将保护性修缮描述为“循旧如旧、最小干预”；具体构件修缮记录仍待补充。', refs: [6] },
  { group: '环境变化', title: '从河道整治到公园开放', text: '整理资料记录了画河曾面临污水、垃圾与行洪不畅等问题；后续实施河道治理和上水门周边环境整治，形成可供公众游览的遗址公园。', refs: [3, 8] },
  { group: '数字化保护', title: '现有数字记录', text: '本站以已有三维实景模型呈现遗址现状，并展示 2022、2025 两期遥感分析成果。模型可供观察空间形态，不作为明代原貌复原或法定测绘依据。', refs: [] }
];

const pictures = [
  { file: '图5_治理前后对比.png', title: '治理前后对照', alt: '上水门遗址治理前后两幅照片对照' },
  { file: '治理后.jpg', title: '治理后遗址公园视角', alt: '治理后上水门三孔门洞及周边绿地' }
];

const safe = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
function citations(ids) {
  return ids.map(id => {
    const source = sources[id];
    return `<a href="${safe(source.url)}" target="_blank" rel="noopener noreferrer" aria-label="来源 ${id}：${safe(source.title)}">[${id}]</a>`;
  }).join(' ');
}
function historyImage(file) {
  return `${import.meta.env.BASE_URL}history-images/${encodeURIComponent(file)}`;
}

export function renderArchive(root) {
  const timeItems = timeline.map((item, index) => `<li class="history-event"><time>${safe(item.date)}</time><div><h3>${safe(item.title)}</h3><p id="timeline-description-${index}" class="history-event-description">${safe(item.text)} ${citations(item.refs)}</p><button class="history-event-toggle" type="button" aria-expanded="false" aria-controls="timeline-description-${index}">展开说明</button></div></li>`).join('');
  const groups = [
    { id: 'city', title: '历史沿革与古城格局', names: ['古城格局'] },
    { id: 'building', title: '建筑特征与文化价值', names: ['建筑特征', '建筑价值'] },
    { id: 'conservation', title: '遗址保护与环境变化', names: ['遗址保护', '环境变化'] },
    { id: 'renewal', title: '遗址公园与数字记录', names: ['数字化保护'] }
  ];
  const sections = groups.map(group => `<section id="history-${group.id}" class="history-section"><h2>${group.title}</h2><div class="history-cards">${cards.filter(card => group.names.includes(card.group)).map(card => `<article class="history-card"><span>${safe(card.group)}</span><h3>${safe(card.title)}</h3><p>${safe(card.text)} ${citations(card.refs)}</p></article>`).join('')}</div></section>`).join('');
  const sourceList = Object.entries(sources).map(([id, source]) => `<li><a href="${safe(source.url)}" target="_blank" rel="noopener noreferrer">[${id}] ${safe(source.title)}</a></li>`).join('');

  root.innerHTML = `
    <nav class="history-jumps" aria-label="历史档案章节"><a href="#history-city">古城</a><a href="#history-building">建筑</a><a href="#history-conservation">保护</a><a href="#history-renewal">更新</a><a href="#history-sources">参考资料</a></nav>
    <section class="history-section"><h2>遗址与保护时间轴</h2><ol class="history-timeline">${timeItems}</ol></section>
    ${sections}
    <section class="history-section"><h2>影像档案</h2>
      <div class="history-gallery"><div class="gallery-stage"><a id="history-image-link" target="_blank" rel="noopener noreferrer" aria-label="查看原图"><img id="history-image" alt=""></a><p id="history-image-error" class="load-error" role="alert" hidden></p></div>
      <div class="gallery-toolbar"><button type="button" data-gallery="prev" aria-label="上一张">‹</button><span id="history-image-count"></span><button type="button" data-gallery="next" aria-label="下一张">›</button></div>
      <h3 id="history-image-title"></h3></div>
    </section>
    <section id="history-sources" class="history-section history-sources"><h2>参考资料</h2><ol>${sourceList}</ol></section>`;

  root.querySelectorAll('.history-event-toggle').forEach(button => button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? '收起说明' : '展开说明';
    root.querySelector(`#${button.getAttribute('aria-controls')}`).classList.toggle('expanded', expanded);
  }));

  let index = 0;
  const img = root.querySelector('#history-image');
  const link = root.querySelector('#history-image-link');
  const error = root.querySelector('#history-image-error');
  function showPicture() {
    const picture = pictures[index];
    const url = historyImage(picture.file);
    error.hidden = true;
    img.hidden = false;
    img.alt = picture.alt;
    img.src = url;
    link.href = url;
    root.querySelector('#history-image-count').textContent = `${index + 1} / ${pictures.length}`;
    root.querySelector('#history-image-title').textContent = picture.title;
  }
  img.addEventListener('error', () => {
    img.hidden = true;
    error.hidden = false;
    error.textContent = `图片加载失败：${pictures[index].file}`;
  });
  root.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click', () => {
    index = (index + (button.dataset.gallery === 'next' ? 1 : -1) + pictures.length) % pictures.length;
    showPicture();
  }));
  showPicture();
}
