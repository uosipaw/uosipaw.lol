(function () {
  const WALL_THICKNESS = 80;
  // The helper needs to be the size of the container
  const MATTER_CONTAINER = document.querySelector("#container");
  const MATTER_HELPER = document.querySelector("#helper");

  let Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  World = Matter.World,
  Composite = Matter.Composite;

  let engine = Engine.create();
  let render = Render.create({
    element: MATTER_HELPER,
    engine: engine,
    background: "black",
    options: {
      width: MATTER_CONTAINER.offsetWidth,
      height: MATTER_CONTAINER.offsetHeight } });



  let domBodies = document.querySelectorAll(".menu__item");
  let matterBodies = {};
  let runner;
  let leftWall, rightWall, ground;

  init();

  function init() {
    createBounds();
    // Add all the bounds to the world
    Composite.add(engine.world, [leftWall, rightWall, ground]);
    // run the renderer
    Render.run(render);
    // create runner
    runner = Runner.create();
    // run the engine
    Runner.run(runner, engine);
    // Add visual duplicates of the html elements to the helper canvas
    creatMatterBodies();
    World.add(engine.world, Object.values(matterBodies));
    window.requestAnimationFrame(updateElementPositions);
    window.addEventListener("resize", () => handleResize());
  }

  function createBounds() {
    ground = Bodies.rectangle(
    MATTER_CONTAINER.offsetWidth / 2,
    MATTER_CONTAINER.offsetHeight + WALL_THICKNESS / 2,
    6000,
    WALL_THICKNESS,
    { isStatic: true });


    leftWall = Bodies.rectangle(
    0 - WALL_THICKNESS / 2,
    MATTER_CONTAINER.offsetHeight / 2,
    WALL_THICKNESS,
    MATTER_CONTAINER.offsetHeight * 5,
    { isStatic: true });


    rightWall = Bodies.rectangle(
    MATTER_CONTAINER.offsetWidth + WALL_THICKNESS / 2,
    MATTER_CONTAINER.offsetHeight / 2,
    WALL_THICKNESS,
    MATTER_CONTAINER.offsetHeight * 5,
    { isStatic: true });

  }

  function creatMatterBodies() {
    domBodies.forEach(function (domBody, index) {
      let matterBody = Bodies.rectangle(
      MATTER_CONTAINER.offsetWidth / 2,
      -MATTER_CONTAINER.offsetHeight,
      domBody.offsetWidth,
      domBody.offsetHeight,
      {
        chamfer: {
          radius: domBody.offsetHeight / 2 },

        restitution: 0.925,
        density: Math.random() * 15,
        angle: Math.random() * 10,
        friction: Math.random() * 50,
        frictionAir: Math.random() / 150 });


      domBody.id = matterBody.id;
      matterBodies[matterBody.id] = matterBody;
    });
  }

  function updateElementPositions() {
    domBodies.forEach((domBody, index) => {
      let matterBody = matterBodies[domBody.id];

      if (matterBody) {
        domBody.style.transform =
        "translate( " + (
        -domBody.offsetWidth + matterBody.position.x + domBody.offsetWidth / 2) +
        "px, " + (
        -domBody.offsetHeight +
        matterBody.position.y +
        domBody.offsetHeight / 2) +
        "px )";
        domBody.style.transform += "rotate( " + matterBody.angle + "rad )";
      }
    });

    window.requestAnimationFrame(updateElementPositions);
  }

  function handleResize() {
    render.canvas.width = MATTER_CONTAINER.offsetWidth;
    render.canvas.height = MATTER_CONTAINER.offsetHeight;

    Matter.Render.setPixelRatio(render, window.devicePixelRatio);

    Matter.Body.setPosition(
    ground,
    Matter.Vector.create(
    MATTER_CONTAINER.offsetWidth / 2,
    MATTER_CONTAINER.offsetHeight + WALL_THICKNESS / 2));



    Matter.Body.setPosition(
    leftWall,
    Matter.Vector.create(
    0 - WALL_THICKNESS / 2,
    MATTER_CONTAINER.offsetHeight / 2));



    Matter.Body.setPosition(
    rightWall,
    Matter.Vector.create(
    MATTER_CONTAINER.offsetWidth + WALL_THICKNESS / 2,
    MATTER_CONTAINER.offsetHeight / 2));


  }
})();