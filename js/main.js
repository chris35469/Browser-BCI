let openBCI = new OpenBCI();

$("button").click(e => {
  openBCI.start();
});

// http://craftyjs.com/
Crafty.init(600, 300);
Crafty.background("rgb(127,127,127)");

//Paddles
Crafty.e("Paddle, 2D, DOM, Color, Multiway")
  .color("rgb(255,0,0)")
  .attr({ x: 20, y: 100, w: 10, h: 100 })
  .multiway(200, { W: -90, S: 90 });
Crafty.e("Paddle, 2D, DOM, Color, Multiway")
  .color("rgb(0,255,0)")
  .attr({ x: 580, y: 100, w: 10, h: 100 })
  .multiway(200, { UP_ARROW: -90, DOWN_ARROW: 90 });

//Ball
Crafty.e("2D, DOM, Color, Collision")
  .color("rgb(0,0,255)")
  .attr({
    x: 300,
    y: 150,
    w: 10,
    h: 10,
    dX: Crafty.math.randomInt(2, 5),
    dY: Crafty.math.randomInt(2, 5)
  })
  .bind("EnterFrame", function() {
    //hit floor or roof
    if (this.y <= 0 || this.y >= 290) this.dY *= -1;

    // hit left or right boundary
    if (this.x > 600) {
      this.x = 300;
      Crafty("LeftPoints").each(function() {
        this.text(++this.points + " Points");
      });
    }
    if (this.x < 10) {
      this.x = 300;
      Crafty("RightPoints").each(function() {
        this.text(++this.points + " Points");
      });
    }

    this.x += this.dX;
    this.y += this.dY;
  })
  .onHit("Paddle", function() {
    // EEG
    var alpha = openBCI.getRelativeBandPower(0, "alpha");
    var randomVar = Crafty.math.randomInt(2, 6);
    console.log(alpha);

    if (alpha) {
      this.dX *= -1 * (alpha * randomVar);
    } else {
      this.dX *= -1;
    }
  });

//Score boards
Crafty.e("LeftPoints, DOM, 2D, Text")
  .attr({ x: 20, y: 20, w: 100, h: 20, points: 0 })
  .text("0 Points");
Crafty.e("RightPoints, DOM, 2D, Text")
  .attr({ x: 515, y: 20, w: 100, h: 20, points: 0 })
  .text("0 Points");

/*
function init() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 400;
  scene = new THREE.Scene();
  var texture = new THREE.TextureLoader().load("textures/crate.gif");
  var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
  var material = new THREE.MeshBasicMaterial({ map: texture });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  requestAnimationFrame(animate);
  var alpha = openBCI.getRelativeBandPower(0, "alpha");
  if (alpha > 0.2) {
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

init();
animate();*/
