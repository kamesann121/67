const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();
let mixer;
let player;
let isJumping = false;
let jumpVelocity = 0;

const loader = new THREE.FBXLoader();
loader.load('models/character.fbx', function (object) {
  player = object;
  scene.add(player);

  mixer = new THREE.AnimationMixer(player);
  const action = mixer.clipAction(object.animations[0]);
  action.play();

  camera.position.set(player.position.x, player.position.y + 5, player.position.z - 10);
  camera.lookAt(player.position);
});

document.addEventListener('keydown', (event) => {
  if (!player) return;
  switch (event.key.toLowerCase()) {
    case 'e': // 前
      player.position.z -= 0.5;
      break;
    case 's': // 後ろ
      player.position.z += 0.5;
      break;
    case 'q': // 左
      player.position.x -= 0.5;
      break;
    case 'c': // 右
      player.position.x += 0.5;
      break;
    case ' ': // ジャンプ
      if (!isJumping) {
        isJumping = true;
        jumpVelocity = 0.2;
      }
      break;
  }
});

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(clock.getDelta());

  // ジャンプ処理
  if (isJumping) {
    player.position.y += jumpVelocity;
    jumpVelocity -= 0.01;
    if (player.position.y <= 0) {
      player.position.y = 0;
      isJumping = false;
    }
  }

  if (player) {
    camera.position.set(player.position.x, player.position.y + 5, player.position.z - 10);
    camera.lookAt(player.position);
  }

  renderer.render(scene, camera);
}
animate();
