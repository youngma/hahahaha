<template>
  <div content="avatar-container">
<!--    <el-select-->
<!--      v-model="currentAction"-->
<!--      class="m-2"-->
<!--      size="large"-->
<!--      style="width: 240px"-->
<!--    >-->
<!--      <el-option-->
<!--        v-for="item in actions"-->
<!--        :key="item.name"-->
<!--        :label="item.name"-->
<!--        :value="item.name"-->
<!--      />-->
<!--    </el-select>-->

    <div :id="id" class="container">

    </div>

<!--    <el-row :gutter="0" class="controller">-->
<!--      <el-col :span="12"><el-button  type="primary" @click="play"> 시작 </el-button></el-col>-->
<!--      <el-col :span="12"><el-button  type="danger" @click="stop"> 종료 </el-button></el-col>-->
<!--    </el-row>-->

  </div>
</template>

<script setup>
import {ref, defineProps, onMounted} from 'vue'

const props = defineProps( {
  name: {
    type: String,
    required: true,
  },
  soure: {
    type: String,
    required: true,
    default: '../assets/character.fbx',
  },
  soure2: {
    type: String,
    required: true,
    default: '../assets/character.fbx',
  },
  width: {
    type: Number,
    default: 1024,
  },
  height: {
    type: Number,
    default: 1024,
  }
})


const id = ref(props.name)

import * as THREE from 'three';
import * as Animations from '../utils/ActionsUtils.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

import { GUI } from 'dat.gui'
import TWEEN from '@tweenjs/tween.js'

const { width, height } = props;

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light1 = new THREE.SpotLight(0xffffff, 100)
light1.position.set(2.5, 5, 2.5)
light1.angle = Math.PI / 8
light1.penumbra = 0.5
light1.castShadow = true
light1.shadow.mapSize.width = width
light1.shadow.mapSize.height = height
light1.shadow.camera.near = 0.5
light1.shadow.camera.far = 20
scene.add(light1)

const light2 = new THREE.SpotLight(0xffffff, 100)
light2.position.set(-2.5, 5, 2.5)
light2.angle = Math.PI / 8
light2.penumbra = 0.5
light2.castShadow = true
light2.shadow.mapSize.width = width
light2.shadow.mapSize.height = height
light2.shadow.camera.near = 0.5
light2.shadow.camera.far = 20
scene.add(light2)

// const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 6 );
// hemiLight.position.set( 0, 200, 0 );
// scene.add( hemiLight );


onMounted(async () => {
  await init();
  animate();
})

let mixer, controls
let modelReady = false
let modelMesh
const animationActions = []
let activeAction
let lastAction
const fbxLoader = new FBXLoader()

const sceneMeshes = []

const renderer = new THREE.WebGLRenderer()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000)
camera.position.set(0.8, 1.4, 1.0)
// camera.position.set( -100, 100, 320 );


let path = props.soure
let path2 = props.soure2

async function init() {
  const container = document.getElementById( id.value );

  renderer.setSize(window.innerWidth, window.innerHeight)
  // renderer.toneMapping = THREE.ACESFilmicToneMapping
  // renderer.toneMappingExposure = 0.8
  // renderer.shadowMap.enabled = true

  container.appendChild( renderer.domElement );

  controls = new OrbitControls(camera, renderer.domElement)
  controls.screenSpacePanning = true
  controls.target.set(0, 1.1, 0)

  const planeGeometry = new THREE.PlaneGeometry(25, 25)
  const texture = new THREE.TextureLoader().load('https://sbedit.net/img/grid.png')

  const plane = new THREE.Mesh(
    planeGeometry,
    new THREE.MeshPhongMaterial({ map: texture })
  )

  plane.rotateX(-Math.PI / 2)
  plane.receiveShadow = true
  scene.add(plane)
  sceneMeshes.push(plane)

  fbxLoader.load(
    path,
    (object) => {

      mixer = new THREE.AnimationMixer( object );
      mixer.existingAction(object.animations[ 0 ])
      const animationAction = mixer.clipAction(object.animations[0])

      animationActions.push(animationAction)
      activeAction = animationActions[0]
      activeAction.play();

      object.scale.multiplyScalar(0.01);

      scene.add(object)
      modelMesh = object

      object.traverse( function ( child ) {
        if ( child.isMesh ) {

          child.receiveShadow = true
          child.castShadow = true
          child.frustumCulled = false
          child.geometry.computeVertexNormals()

          if (child.material) {
            //(<THREE.Mesh>child).material = material
            const mat = child.material
            mat.transparent = false
            mat.side = THREE.FrontSide
          }
        }
      });

      fbxLoader.load(
        path2,
        (object) => {

          const animationAction = mixer.clipAction(object.animations[0])
          animationActions.push(animationAction)
          // animationsFolder.add(animationAction, 'default1')

        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
          console.log(111)
          console.log(error)
        }
      )

    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
      console.log(222)
      console.log(error)
    }
  )

  renderer.domElement.addEventListener('dblclick', onDoubleClick, false)

}


window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  render()
}

const raycaster = new THREE.Raycaster()
const targetQuaternion = new THREE.Quaternion()
const mouse = new THREE.Vector2()

function onDoubleClick(event) {
  mouse.set(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
  )
  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(sceneMeshes, false)

  console.log(intersects)
  if (intersects.length > 0) {
    const p = intersects[0].point

    const distance = modelMesh.position.distanceTo(p)

    const rotationMatrix = new THREE.Matrix4()
    rotationMatrix.lookAt(p, modelMesh.position, modelMesh.up)
    targetQuaternion.setFromRotationMatrix(rotationMatrix)

    setAction(animationActions[1])

    TWEEN.removeAll()
    new TWEEN.Tween(modelMesh.position)
      .to(
        {
          x: p.x,
          y: p.y,
          z: p.z,
        },
        (1000 / 2.2) * distance
      ) //walks 2 meters a second * the distance
      .onUpdate(() => {
        controls.target.set(
          modelMesh.position.x,
          modelMesh.position.y + 1,
          modelMesh.position.z
        )
        light1.target = modelMesh
        light2.target = modelMesh
      })
      .start()
      .onComplete(() => {
        setAction(animationActions[1])
        activeAction.clampWhenFinished = true
        activeAction.loop = THREE.LoopOnce
      })
  }
}

// container.appendChild(stats.dom)

const animations = {
  default: function () {
    setAction(animationActions[0])
  },
  samba: function () {
    setAction(animationActions[1])
  },
  bellydance: function () {
    setAction(animationActions[2])
  },
  goofyrunning: function () {
    setAction(animationActions[3])
  },
}

const setAction = (toAction) => {
  if (toAction !== activeAction) {
    lastAction = activeAction
    activeAction = toAction
    //lastAction.stop()
    lastAction.fadeOut(0.2)
    activeAction.reset()
    activeAction.fadeIn(0.2)
    activeAction.play()
  }
}

const gui = new GUI()
const animationsFolder = gui.addFolder('Animations')
// animationsFolder.open()

const clock = new THREE.Clock()
let delta = 0

function animate() {
  requestAnimationFrame(animate)

  // controls.update()

  if (modelReady) {
    delta = clock.getDelta()
    mixer.update(delta)

    if (!modelMesh.quaternion.equals(targetQuaternion)) {
      modelMesh.quaternion.rotateTowards(targetQuaternion, delta * 10)
    }
  }

  TWEEN.update()

  render()
}

function render() {
  renderer.render(scene, camera)
}

// animate();


</script>

<style scoped>

.avatar-container {
  position: relative;
}

.container {
  z-index: 9999;
  margin-top: 10px;
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

  margin-top: 10px;
  //margin-left: -10px;
  //margin-right: -10px;
}

.el-button {
  margin-right: 10px;
}
</style>
