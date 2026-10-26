import { Viewer, Cesium3DTileset, Cartesian3, Color, EllipsoidTerrainProvider, Math as CesiumMath, ScreenSpaceEventType, Transforms, Matrix4 } from 'cesium';
export function createScene(status) {
const viewer = new Viewer('map', {
  imageryProvider: false, baseLayerPicker: false, terrainProvider: new EllipsoidTerrainProvider(),
  animation: false, timeline: false, geocoder: false, homeButton: false,
  sceneModePicker: false, navigationHelpButton: false, infoBox: false,
  selectionIndicator: false, fullscreenButton: false, shouldAnimate: true
});
viewer.resolutionScale = 1.5;
viewer.scene.globe.show = false;
viewer.scene.backgroundColor = Color.fromCssColorString('#F7F8F6');
viewer.scene.skyBox.show = false;
viewer.scene.skyAtmosphere.show = false;
viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
// The default globe controls have no useful pivot when the globe is hidden.
// Keep a stable camera pivot at the model's bounding-sphere center instead.
viewer.scene.screenSpaceCameraController.enableInputs = false;

let tileset;
let orbit;
let dragMode = null;
let lastPosition;
let orbitFrame = 0;
const controller = viewer.screenSpaceEventHandler;

function renderOrbit() {
  if (!orbit) return;
  const frame = Transforms.eastNorthUpToFixedFrame(orbit.center);
  const horizontal = orbit.range * Math.cos(orbit.pitch);
  const localPosition = new Cartesian3(
    horizontal * Math.sin(orbit.heading),
    -horizontal * Math.cos(orbit.heading),
    -orbit.range * Math.sin(orbit.pitch)
  );
  const destination = Matrix4.multiplyByPoint(frame, localPosition, new Cartesian3());
  const direction = Cartesian3.normalize(Cartesian3.subtract(orbit.center, destination, new Cartesian3()), new Cartesian3());
  const localUp = Math.abs(orbit.pitch) > CesiumMath.toRadians(80)
    ? new Cartesian3(0, 1, 0) : new Cartesian3(0, 0, 1);
  const worldUp = Matrix4.multiplyByPointAsVector(frame, localUp, new Cartesian3());
  const right = Cartesian3.normalize(Cartesian3.cross(direction, worldUp, new Cartesian3()), new Cartesian3());
  const up = Cartesian3.normalize(Cartesian3.cross(right, direction, new Cartesian3()), new Cartesian3());
  viewer.camera.setView({ destination, orientation: { direction, up } });
}

function animateOrbit() {
  orbitFrame = 0;
  if (!orbit) return;
  const remaining = orbit.targetHeading - orbit.heading;
  if (Math.abs(remaining) < 0.0002) {
    orbit.heading = orbit.targetHeading;
  } else {
    orbit.heading += remaining * 0.24;
    orbitFrame = requestAnimationFrame(animateOrbit);
  }
  renderOrbit();
}

function queueOrbit() {
  if (!orbitFrame) orbitFrame = requestAnimationFrame(animateOrbit);
}

function zoom(factor) {
  if (!orbit) return;
  const radius = Math.max(tileset.boundingSphere.radius, 25);
  orbit.range = CesiumMath.clamp(orbit.range * factor, radius * 0.25, radius * 30);
  renderOrbit();
}

controller.setInputAction(event => {
  if (!orbit) return;
  viewer.camera.cancelFlight();
  dragMode = 'orbit';
  lastPosition = Cartesian3.clone(new Cartesian3(event.position.x, event.position.y, 0));
}, ScreenSpaceEventType.LEFT_DOWN);
controller.setInputAction(event => {
  if (!orbit) return;
  viewer.camera.cancelFlight();
  dragMode = 'pan';
  lastPosition = Cartesian3.clone(new Cartesian3(event.position.x, event.position.y, 0));
}, ScreenSpaceEventType.RIGHT_DOWN);
controller.setInputAction(event => {
  if (!dragMode || !orbit) return;
  const dx = event.endPosition.x - lastPosition.x;
  const dy = event.endPosition.y - lastPosition.y;
  lastPosition.x = event.endPosition.x;
  lastPosition.y = event.endPosition.y;
  if (dragMode === 'orbit') {
    // Horizontal-plane orbit: vertical pointer motion never changes elevation.
    orbit.targetHeading -= dx * 0.008;
    queueOrbit();
  } else {
    const scale = orbit.range * 0.0015;
    const right = Cartesian3.multiplyByScalar(viewer.camera.right, -dx * scale, new Cartesian3());
    const up = Cartesian3.multiplyByScalar(viewer.camera.up, dy * scale, new Cartesian3());
    Cartesian3.add(orbit.center, right, orbit.center);
    Cartesian3.add(orbit.center, up, orbit.center);
  }
  if (dragMode === 'pan') renderOrbit();
}, ScreenSpaceEventType.MOUSE_MOVE);
controller.setInputAction(() => { dragMode = null; }, ScreenSpaceEventType.LEFT_UP);
controller.setInputAction(() => { dragMode = null; }, ScreenSpaceEventType.RIGHT_UP);
controller.setInputAction(delta => zoom(delta > 0 ? 0.88 : 1.14), ScreenSpaceEventType.WHEEL);

function flyTo(preset = 'overview') {
  if (!tileset) return;
  const radius = Math.max(tileset.boundingSphere.radius, 25);
  const views = {
    overview: [-35, -28, 2.8], top: [0, -89, 2.5],
    front: [0, -12, 2.5], side: [90, -12, 2.5]
  };
  const [heading, pitch, scale] = views[preset];
  if (orbitFrame) cancelAnimationFrame(orbitFrame);
  orbitFrame = 0;
  orbit = {
    center: Cartesian3.clone(tileset.boundingSphere.center),
    heading: CesiumMath.toRadians(heading),
    targetHeading: CesiumMath.toRadians(heading),
    pitch: CesiumMath.toRadians(pitch),
    range: radius * scale
  };
  renderOrbit();
  document.querySelectorAll('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === preset));
}

async function loadTiles() {
try {
  tileset = await Cesium3DTileset.fromUrl(import.meta.env.BASE_URL + 'tiles/tileset.json', { maximumScreenSpaceError: 8 });
  viewer.scene.primitives.add(tileset);
  flyTo();
  status.textContent = '模型已加载';
  setTimeout(() => status.classList.add('hidden'), 2500);
  console.info('Tileset center (WGS84/ECEF):', tileset.boundingSphere.center, 'radius:', tileset.boundingSphere.radius);
} catch (error) {
  console.error('3D Tiles 加载失败:', error);
  status.textContent = `模型加载失败：${error.message}`;
  status.classList.add('error');
}


}
void loadTiles();
return { flyTo, zoom };
}



