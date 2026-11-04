import * as THREE from "three";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

async function loadObj(objPath, materials, compressed) {
  const loader = new OBJLoader().setMaterials(materials);
  if (!compressed) return loader.loadAsync(objPath);
  if (typeof DecompressionStream === "undefined") {
    throw new Error("This browser cannot decompress the compressed OBJ preview.");
  }

  const response = await fetch(objPath);
  if (!response.ok || !response.body) {
    throw new Error(`Could not fetch compressed OBJ (${response.status}).`);
  }

  const decompressed = response.body.pipeThrough(new DecompressionStream("gzip"));
  const objText = await new Response(decompressed).text();
  return loader.parse(objText);
}

export async function createObjViewer(container, objPath, mtlPath, options = {}) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x171b20);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
  camera.position.set(4, 2.4, 5);

  let renderer;
  let controls;
  let resizeObserver;
  let handleKeyboard;
  let disposed = false;

  function dispose() {
    if (disposed) return;
    disposed = true;
    if (renderer) renderer.setAnimationLoop(null);
    if (resizeObserver) resizeObserver.disconnect();
    if (controls) controls.dispose();
    if (renderer && handleKeyboard) renderer.domElement.removeEventListener("keydown", handleKeyboard);
    scene.traverse(object => {
      if (object.geometry) object.geometry.dispose();
      if (!object.material) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach(material => {
        Object.values(material).forEach(value => {
          if (value && value.isTexture) value.dispose();
        });
        material.dispose();
      });
    });
    if (renderer) {
      renderer.dispose();
      renderer.domElement.remove();
    }
  }

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.tabIndex = 0;
    renderer.domElement.setAttribute("aria-label", "3D car preview. Use the arrow keys to rotate and plus or minus to zoom.");
    container.append(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.5;
    controls.maxDistance = 12;
    controls.target.set(0, 0, 0);

    handleKeyboard = event => {
      const step = Math.PI / 24;
      if (event.key === "ArrowLeft") controls.rotateLeft(step);
      else if (event.key === "ArrowRight") controls.rotateLeft(-step);
      else if (event.key === "ArrowUp") controls.rotateUp(step);
      else if (event.key === "ArrowDown") controls.rotateUp(-step);
      else if (event.key === "+" || event.key === "=") controls.dollyIn(1.1);
      else if (event.key === "-") controls.dollyOut(1.1);
      else return;
      controls.update();
      event.preventDefault();
    };

    renderer.domElement.addEventListener("keydown", handleKeyboard);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x333943, 2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xb9c9e8, 1.2);
    fillLight.position.set(-5, 2, -4);
    scene.add(fillLight);

    function resize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const materials = await new MTLLoader().loadAsync(mtlPath);
    materials.preload();
    const model = await loadObj(objPath, materials, options.compressedObj === true);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(largestDimension) || largestDimension <= 0) {
      throw new Error("The OBJ file does not contain a renderable model.");
    }

    model.scale.setScalar(3 / largestDimension);
    model.updateMatrixWorld(true);
    bounds.setFromObject(model);
    model.position.sub(bounds.getCenter(new THREE.Vector3()));
    scene.add(model);

    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    return { dispose };
  } catch (error) {
    dispose();
    throw error;
  }
}
