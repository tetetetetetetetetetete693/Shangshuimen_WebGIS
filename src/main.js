import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';
import { createScene } from './scene.js';
import { createPanel } from './panel.js';

document.querySelector('#app').innerHTML = `
  <div id="map" aria-label="上水门遗址三维场景"></div>
  <header class="site-header"><div class="brand"><span class="brand-mark">上</span><div><strong>上水门遗址</strong><small>三维 WebGIS 展示平台</small></div></div><div class="header-right"><span class="live"><i></i>本地三维实景</span><button id="fullscreen" type="button" title="全屏浏览">⛶ <span>全屏</span></button></div></header>
  <nav class="module-nav" aria-label="功能模块"><button type="button" data-module="explore" class="active" aria-current="page">三维探索</button><button type="button" data-module="remote">遥感感知</button><button type="button" data-module="diagnosis">空间诊断</button><button type="button" data-module="archive">历史档案</button></nav>
  <div class="scene-controls"><nav class="views" aria-label="预设视角"><span>视角切换</span><button type="button" data-view="overview" class="active">全景</button><button type="button" data-view="top">俯瞰</button><button type="button" data-view="front">正面</button><button type="button" data-view="side">侧面</button></nav><div class="tools"><button type="button" id="zoom-in" title="放大">＋</button><button type="button" id="zoom-out" title="缩小">−</button><button type="button" id="reset" title="复位">⌖</button></div></div>
  <button id="panel-toggle" class="panel-toggle" type="button" aria-controls="info-panel" aria-expanded="true" title="收起信息面板">›</button><aside id="info-panel" class="info-panel" aria-label="模块信息"><div class="panel-toolbar"><span>分析工作区</span><button id="panel-expand" type="button" aria-pressed="false">扩展面板</button></div><div id="panel-content"></div></aside>
  <footer><span>上水门遗址 · 三维数字化展示</span><span>鼠标左键旋转 · 滚轮缩放 · 右键平移</span></footer><div id="status" role="status">正在加载三维模型…</div>`;

// Module changes never replace #map or construct another Viewer.
const scene = createScene(document.querySelector('#status'));
createPanel();
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => scene.flyTo(button.dataset.view)));
document.querySelector('#reset').addEventListener('click', () => scene.flyTo());
document.querySelector('#zoom-in').addEventListener('click', () => scene.zoom(0.8));
document.querySelector('#zoom-out').addEventListener('click', () => scene.zoom(1.25));
document.querySelector('#fullscreen').addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
