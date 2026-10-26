import { renderRemote } from './remote-sensing.js';
import { renderDiagnosis } from './spatial-diagnosis.js';
import { renderArchive } from './history-archive.js';

const modules = {
  explore: { kicker: '3D EXPLORATION', title: '三维探索', body: `<p>通过现有三维实景模型探索遗址空间形态与细部信息。使用下方预设视角，或在场景中旋转、缩放和平移。</p><p id="intro-text">上水门遗址位于登州府城南部画河入城处，是府城水门遗存。三维实景模型呈现了现存门洞、河道入口及周边环境，可从全景、俯瞰、正面和侧面观察建筑结构与空间关系。拖动场景可调整观察方向，使用滚轮或下方按钮放大细部，也可切换全屏浏览。这里展示的是遗址现状的数字记录，适合用于直观了解水门与周围场地的联系。</p>` },
  remote: { kicker: 'REMOTE SENSING', title: '遥感感知', body: '<div class="module-content" data-content="remote"></div>' },
  diagnosis: { kicker: 'SPATIAL DIAGNOSIS', title: '空间诊断', body: '<div class="module-content" data-content="diagnosis"></div>' },
  archive: { kicker: 'HISTORICAL ARCHIVE', title: '历史档案', body: '<div class="module-content" data-content="archive"></div>' }
};

export function createPanel() {
  const panel = document.querySelector('#info-panel');
  const content = document.querySelector('#panel-content');
  const toggle = document.querySelector('#panel-toggle');
  const expand = document.querySelector('#panel-expand');
  expand.addEventListener('click', () => {
    const wide = panel.classList.toggle('wide');
    expand.setAttribute('aria-pressed', String(wide));
    expand.textContent = wide ? '恢复宽度' : '扩展面板';
  });
  let current = 'explore';

  function setOpen(open) {
    panel.classList.toggle('collapsed', !open);
    toggle.classList.toggle('collapsed', !open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '收起信息面板' : '展开信息面板');
    toggle.title = open ? '收起信息面板' : '展开信息面板';
    toggle.textContent = open ? '›' : '‹';
    panel.setAttribute('aria-hidden', String(!open));
    panel.inert = !open;
  }

  function selectModule(key) {
    if (!modules[key]) return;
    current = key;
    const { kicker, title, body } = modules[key];
    content.innerHTML = `<div class="panel-kicker">${kicker}</div><h1>${title}</h1><div class="panel-rule"></div>${body}`;
    panel.classList.remove('wide');
    expand.setAttribute('aria-pressed', 'false');
    expand.textContent = '扩展面板';
    panel.scrollTop = 0;
    document.querySelectorAll('[data-module]').forEach(button => {
      const active = button.dataset.module === key;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    setOpen(true);
    if (key === 'remote') void renderRemote(content.querySelector('[data-content="remote"]'));
    if (key === 'diagnosis') void renderDiagnosis(content.querySelector('[data-content="diagnosis"]'));
    if (key === 'archive') renderArchive(content.querySelector('[data-content="archive"]'));
  }

  document.querySelectorAll('[data-module]').forEach(button => button.addEventListener('click', () => selectModule(button.dataset.module)));
  toggle.addEventListener('click', () => setOpen(panel.classList.contains('collapsed')));
  selectModule(current);
}
