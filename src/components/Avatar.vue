<template>
  <div content="avatar-container">
    <div :id="id" class="container" >

    </div>

    <el-row :gutter="0" class="controller">
      <el-col :span="12"><el-button  type="primary" @click="play"> 시작 </el-button></el-col>
      <el-col :span="12"><el-button  type="danger" @click="stop"> 종료 </el-button></el-col>
    </el-row>

  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'

const props = defineProps( {
  name: {
    type: String,
    required: true,
  },
  soure: {
    type: String,
    required: true,
    default: '../assets/Walking.fbx',
  },
  width: {
    type: Number,
    default: 200,
  },
  height: {
    type: Number,
    default: 200,
  }
})


const id = ref(props.name)
// const path = props.soure;

import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// import path from props.soure


let camera, scene, renderer, stats;

const clock = new THREE.Clock();

let mixer;
let action;
let actions = [];
let idx = 0;

onMounted(async () => {
  await init();
  animate();
})

idx = 0;

function play() {
  idx += 1;

  if (actions.length === idx) {
    idx = 0;
  }

  console.log(idx)

  action = mixer.clipAction( actions[idx] );
  action.play();
}

function stop() {
  action.stop();
}
async function init() {

  let path = props.soure
  let actions_walk_path = await import('../assets/Walking_walk.fbx')

  const container = document.getElementById( id.value );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.set( 100, 100, 200 );

  scene = new THREE.Scene();
  // scene.background = null;
  // scene.background = new THREE.Color( 0xa0a0a0, 0xa0a0a0, 0xa0a0a0, 0.1 );
  // scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 6 );
  hemiLight.position.set( 0, 200, 0 );
  scene.add( hemiLight );

  // 그림자
  const dirLight = new THREE.DirectionalLight( 0xffffff, 5 );
  dirLight.position.set( 0, 200, 100 );
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 180;
  dirLight.shadow.camera.bottom = - 100;
  dirLight.shadow.camera.left = - 120;
  dirLight.shadow.camera.right = 120;
  scene.add( dirLight );

  // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

  // ground
  const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true } ) );

  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  mesh.opacity = 0.1;

  scene.add( mesh );

  // const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
  // grid.material.opacity = 0.2;
  // grid.material.transparent = true;
  // scene.add( grid );

  // model
  const loader = new FBXLoader();
  const actionsLoader = new FBXLoader();

  loader.load( path , function ( object ) {

    mixer = new THREE.AnimationMixer( object );
    actions.push((object.animations[ 0 ]));

    action = mixer.clipAction( object.animations[ 0 ] );

    action.play();
    // action.stop();

    object.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;

      }
    });
    scene.add( object );
  });

  actionsLoader.load( actions_walk_path.default , function ( object ) {
    actions.push((object.animations[ 0 ]));
  });

  const { width, height } = props;

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  // renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setSize( width, height );
  renderer.shadowMap.enabled = true;
  // renderer.setClearColor( 0x000000, 0 ); // the default
  // renderer.setClearAlpha( 0.1 );
  container.appendChild( renderer.domElement );

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set( 0, 100, 0 );
  controls.update();

  window.addEventListener( 'resize', onWindowResize );

  // stats
  stats = new Stats();
  container.appendChild( stats.dom );

}

function onWindowResize() {
  const { width, height } = props;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( width, height );
}

//

function animate() {

  requestAnimationFrame( animate );

  const delta = clock.getDelta();

  if ( mixer ) mixer.update( delta );
  renderer.render( scene, camera );

  stats.update();

}

</script>

<style scoped>

.avatar-container {
  position: relative;
}

.container {
  z-index: 9999;
}

.controller {
  z-index: 99991;
}
.el-row {
  //margin-bottom: 20px;
}

.grid-content {
  border-radius: 4px;
}

.controller{
  position: relative;
  z-index: 999993;
  //margin-left: -10px;
  //margin-right: -10px;
}

.el-button {
  margin-right: 10px;
}
</style>
