const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();
let mixer;
let animations = {};
let currentAction;
let player;
let isJumping = false;
let jumpVelocity = 0;

const loader = new THREE.FBXLoader();

// モデル本体を読み込み
loader.load('models/character.fbx', (object) => {
  player = object;
  scene.add(player);
  mixer = new THREE.AnimationMixer(player);
  camera.position.set(0, 5, -10);
  camera.lookAt(player.position);
  loadAnimations();
});

// アニメーションを個別に読み込む
function loadAnimations() {
  const animFiles = ['idle', 'walk', 'backward', 'left', 'right', 'jump'];
  animFiles.forEach(name => {
    loader.load(`models/${name}.fbx`, (anim) => {
      animations[name] = mixer.clipAction(anim.animations[0]);
      if (name === 'idle') {
        playAnimation('idle');
      }
    });
  });
}

// アニメーション切り替え
function playAnimation(name) {
  if (currentAction === animations[name]) return;
  if (currentAction) currentAction.fadeOut(0.2);
  currentAction = animations[name];
  if (currentAction) {
    currentAction.reset().fadeIn(0.2).play();
  }
}

// キー操作
document.addEventListener('keydown', (event) => {
  if (!player) return;
  switch (event.key.toLowerCase()) {
    case 'e': // 前
      player.position.z -= 0.5;
      playAnimation('walk');
      break;
    case 's': // 後ろ
      player.position.z += 0.5;
      playAnimation('backward');
      break;
    case 'q': // 左
      player.position.x -= 0.5;
      playAnimation('left');
      break;
    case 'c': // 右
      player.position.x += 0.5;
      playAnimation('right');
      break;
    case ' ': // ジャンプ
      if (!isJumping) {
        isJumping = true;
        jumpVelocity = 0.2;
        playAnimation('jump');
      }
      break;
  }
});

document.addEventListener('keyup', () => {
  if (!isJumping) {
    playAnimation('idle');
  }
});

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  // ジャンプ処理
  if (isJumping) {
    player.position.y += jumpVelocity;
    jumpVelocity -= 0.01;
    if (player.position.y <= 0) {
      player.position.y = 0;
      isJumping = false;
      playAnimation('idle');
    }
  }

  if (player) {
    camera.position.set(player.position.x, player.position.y + 5, player.position.z - 10);
    camera.lookAt(player.position);
  }

  renderer.render(scene, camera);
}
animate();
