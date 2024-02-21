import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
let animations = [];

// let actions_walk_path = await import('../assets/Walking_In_Place.fbx')
// let actions_stand_path = await import('../assets/Standing.fbx')

const actionsLoader = new FBXLoader();

export const Get = () => {
  return animations;
}

export const CurrentAnimation = (name) => {
  const animation = animations.filter(t => t.name === name);

  // console.log(animation, animations[0].animation)

  if (animation.length > 0) {
    return animation[0].animation
  } else {
    return animations[0].animation
  }
}
export const Play = (mixer, camera,  name) => {

  mixer.stopAllAction()
  const action = mixer.clipAction( CurrentAnimation(name) );
  // action.loop = THREE.LoopOnce

  // camera.position.set( 0, 100, 320 );

  if (action.camera) {
    const { position } = action.camera
    if (position) {
      const { x, y ,z } = position
      camera.position.set( x || -100,  y || 100,  z || 320 );
    }
  } else {
  }

  return action;

}

export const Stop = (mixer, name) => {

  // const action = mixer.clipAction( animation );
  // action.stop()

}

export const Load = async () => {

  let actions_walk_path = await import('../assets/Walking_In_Place.fbx')
  let actions_stand_path = await import('../assets/Standing.fbx')
  let actions_crouched_walking_path = await import('../assets/Crouched Walking.fbx')
  let actions_turn_to_running_path = await import('../assets/Turn To Running.fbx')
  let actions_defeat_path = await import('../assets/Defeat.fbx')
  let actions_standing_clap_path = await import('../assets/Standing Clap.fbx')
  let actions_rally_path = await import('../assets/Rallying.fbx')
  let actions_listining_to_music_path = await import('../assets/Listening To Music.fbx')
  let actions_jumping_path = await import('../assets/Jumping.fbx')


  actionsLoader.load( actions_walk_path.default , function ( object ) {

    const animation = {
      name : '걷기', animation: object.animations[ 0 ]
    }

    animations.push(animation);
  });

  actionsLoader.load( actions_turn_to_running_path.default , function ( object ) {
    const animation = {
      name : '뒤돌아 나가', animation: object.animations[ 0 ],
      camera: {
        position: {
          x: -100, y: 100, z:320
        }
      }
    }
    animations.push(animation);
  });

  actionsLoader.load( actions_jumping_path.default , function ( object ) {
    const animation = {
      name : '점프', animation: object.animations[ 0 ]
    }
    animations.push(animation);
  });

  actionsLoader.load( actions_crouched_walking_path.default , function ( object ) {
    const animation = {
      name : '낮은자세 들어와', animation: object.animations[ 0 ]
    }
    animations.push(animation);
  });

  actionsLoader.load( actions_defeat_path.default , function ( object ) {
    const animation = {
      name : '지루해', animation: object.animations[ 0 ]
    }
    animations.push(animation);
  });

  actionsLoader.load( actions_standing_clap_path.default , function ( object ) {
    const animation = {
      name : '박수쳐1', animation: object.animations[ 0 ]
    }
    animations.push(animation);
  });
  actionsLoader.load( actions_rally_path.default , function ( object ) {
    const animation = {
      name : '박수쳐2', animation: object.animations[ 0 ]
    }
    animations.push(animation);
  });

  actionsLoader.load( actions_listining_to_music_path.default , function ( object ) {
    const animation = {
      name : '음악듣기', animation: object.animations[ 0 ]
    }
    animations.push(animation);
  });

}
