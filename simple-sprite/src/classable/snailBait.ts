import { SpriteSheetArtist, Sprite } from "@/classable/sprites";
import {
  CycleBehavior,
  PaceBehavior,
  RunBehavior,
  SnailShootBehavior,
} from "@/classable/actions";
import { SimpleSpriteSheetArtist } from "@/sprites";
import Vue from "vue";

export class SnailBait extends Vue {
  animationId: number | null = null;
  // canvas: HTMLCanvasElement | null = null;
  canvas: any = null;
  context: any = null;

  LEFT = 1;
  RIGHT = 2;

  BACKGROUND_VELOCITY = 42;
  SNAIL_BOMB_VELOCITY = 550;

  PAUSED_CHECK_INTERVAL = 200;

  PLATFORM_HEIGHT = 8;
  PLATFORM_STROKE_WIDTH = 2;
  PLATFORM_STROKE_STYLE = "rgb(0,0,0)";

  STARTING_RUNNER_LEFT = 50;
  STARTING_RUNNER_TRACK = 1;

  // Track baselines...................................................

  TRACK_1_BASELINE = 323;
  TRACK_2_BASELINE = 223;
  TRACK_3_BASELINE = 123;

  // Animations........................................................

  RUN_ANIMATION_RATE = 30; // fps

  RUBY_SPARKLE_DURATION = 200; // milliseconds
  RUBY_SPARKLE_INTERVAL = 500; // milliseconds

  SAPPHIRE_SPARKLE_DURATION = 100; // milliseconds
  SAPPHIRE_SPARKLE_INTERVAL = 300; // milliseconds

  // Runner values.....................................................

  INITIAL_RUNNER_LEFT = 50;
  INITIAL_RUNNER_TRACK = 1;

  // Platform scrolling offset (and therefore speed) is
  // PLATFORM_VELOCITY_MULTIPLIER * backgroundOffset: The
  // platforms move PLATFORM_VELOCITY_MULTIPLIER times as
  // fast as the background.

  PLATFORM_VELOCITY_MULTIPLIER = 4.35;

  STARTING_BACKGROUND_VELOCITY = 0;

  STARTING_PLATFORM_OFFSET = 0;
  STARTING_BACKGROUND_OFFSET = 0;

  // Time..............................................................

  lastAnimationFrameTime = 0;
  lastFpsUpdateTime = 0;
  fps = 60;

  // Window has focus..................................................

  windowHasFocus = true;

  // Paused............................................................

  paused = false;

  // Translation offsets...............................................

  backgroundOffset = this.STARTING_BACKGROUND_OFFSET;
  spriteOffset = this.STARTING_PLATFORM_OFFSET;

  // Velocities........................................................

  bgVelocity = this.STARTING_BACKGROUND_VELOCITY;
  platformVelocity = 0;

  BUTTON_PACE_VELOCITY = 80;
  SNAIL_PACE_VELOCITY = 50;

  // Images............................................................

  spritesheet = new Image();

  // Sprite sheet cells................................................

  BACKGROUND_WIDTH = 1102;
  BACKGROUND_HEIGHT = 400;

  RUNNER_CELLS_WIDTH = 50; // pixels
  RUNNER_CELLS_HEIGHT = 54;

  BAT_CELLS_HEIGHT = 34; // No constant for bat cell width, which varies

  BEE_CELLS_HEIGHT = 50;
  BEE_CELLS_WIDTH = 50;

  BUTTON_CELLS_HEIGHT = 20;
  BUTTON_CELLS_WIDTH = 31;

  COIN_CELLS_HEIGHT = 30;
  COIN_CELLS_WIDTH = 30;

  EXPLOSION_CELLS_HEIGHT = 62;

  RUBY_CELLS_HEIGHT = 30;
  RUBY_CELLS_WIDTH = 35;

  SAPPHIRE_CELLS_HEIGHT = 30;
  SAPPHIRE_CELLS_WIDTH = 35;

  SNAIL_BOMB_CELLS_HEIGHT = 20;
  SNAIL_BOMB_CELLS_WIDTH = 20;

  SNAIL_CELLS_HEIGHT = 34;
  SNAIL_CELLS_WIDTH = 64;

  batCells = [
    { left: 3, top: 0, width: 36, height: this.BAT_CELLS_HEIGHT },
    { left: 41, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
    { left: 93, top: 0, width: 36, height: this.BAT_CELLS_HEIGHT },
    { left: 132, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
  ];

  batRedEyeCells = [
    { left: 185, top: 0, width: 36, height: this.BAT_CELLS_HEIGHT },
    { left: 222, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
    { left: 273, top: 0, width: 36, height: this.BAT_CELLS_HEIGHT },
    { left: 313, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
  ];

  beeCells = [
    {
      left: 5,
      top: 234,
      width: this.BEE_CELLS_WIDTH,
      height: this.BEE_CELLS_HEIGHT,
    },

    {
      left: 75,
      top: 234,
      width: this.BEE_CELLS_WIDTH,
      height: this.BEE_CELLS_HEIGHT,
    },

    {
      left: 145,
      top: 234,
      width: this.BEE_CELLS_WIDTH,
      height: this.BEE_CELLS_HEIGHT,
    },
  ];

  blueCoinCells = [
    {
      left: 5,
      top: 540,
      width: this.COIN_CELLS_WIDTH,
      height: this.COIN_CELLS_HEIGHT,
    },
    {
      left: 5 + this.COIN_CELLS_WIDTH,
      top: 540,
      width: this.COIN_CELLS_WIDTH,
      height: this.COIN_CELLS_HEIGHT,
    },
  ];

  explosionCells = [
    { left: 3, top: 48, width: 52, height: this.EXPLOSION_CELLS_HEIGHT },
    { left: 63, top: 48, width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
    { left: 146, top: 48, width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
    { left: 233, top: 48, width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
    { left: 308, top: 48, width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
    { left: 392, top: 48, width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
    { left: 473, top: 48, width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
  ];

  blueButtonCells = [
    {
      left: 10,
      top: 192,
      width: this.BUTTON_CELLS_WIDTH,
      height: this.BUTTON_CELLS_HEIGHT,
    },

    {
      left: 53,
      top: 192,
      width: this.BUTTON_CELLS_WIDTH,
      height: this.BUTTON_CELLS_HEIGHT,
    },
  ];

  goldCoinCells = [
    {
      left: 65,
      top: 540,
      width: this.COIN_CELLS_WIDTH,
      height: this.COIN_CELLS_HEIGHT,
    },
    {
      left: 96,
      top: 540,
      width: this.COIN_CELLS_WIDTH,
      height: this.COIN_CELLS_HEIGHT,
    },
    {
      left: 128,
      top: 540,
      width: this.COIN_CELLS_WIDTH,
      height: this.COIN_CELLS_HEIGHT,
    },
  ];

  goldButtonCells = [
    {
      left: 90,
      top: 190,
      width: this.BUTTON_CELLS_WIDTH,
      height: this.BUTTON_CELLS_HEIGHT,
    },

    {
      left: 132,
      top: 190,
      width: this.BUTTON_CELLS_WIDTH,
      height: this.BUTTON_CELLS_HEIGHT,
    },
  ];

  rubyCells = [
    {
      left: 185,
      top: 138,
      width: this.SAPPHIRE_CELLS_WIDTH,
      height: this.SAPPHIRE_CELLS_HEIGHT,
    },

    {
      left: 220,
      top: 138,
      width: this.SAPPHIRE_CELLS_WIDTH,
      height: this.SAPPHIRE_CELLS_HEIGHT,
    },

    {
      left: 258,
      top: 138,
      width: this.SAPPHIRE_CELLS_WIDTH,
      height: this.SAPPHIRE_CELLS_HEIGHT,
    },

    {
      left: 294,
      top: 138,
      width: this.SAPPHIRE_CELLS_WIDTH,
      height: this.SAPPHIRE_CELLS_HEIGHT,
    },

    {
      left: 331,
      top: 138,
      width: this.SAPPHIRE_CELLS_WIDTH,
      height: this.SAPPHIRE_CELLS_HEIGHT,
    },
  ];

  runnerCellsRight = [
    { left: 414, top: 385, width: 47, height: this.RUNNER_CELLS_HEIGHT },
    { left: 362, top: 385, width: 44, height: this.RUNNER_CELLS_HEIGHT },
    { left: 314, top: 385, width: 39, height: this.RUNNER_CELLS_HEIGHT },
    { left: 265, top: 385, width: 46, height: this.RUNNER_CELLS_HEIGHT },
    { left: 205, top: 385, width: 49, height: this.RUNNER_CELLS_HEIGHT },
    { left: 150, top: 385, width: 46, height: this.RUNNER_CELLS_HEIGHT },
    { left: 96, top: 385, width: 46, height: this.RUNNER_CELLS_HEIGHT },
    { left: 45, top: 385, width: 35, height: this.RUNNER_CELLS_HEIGHT },
    { left: 0, top: 385, width: 35, height: this.RUNNER_CELLS_HEIGHT },
  ];

  runnerCellsLeft = [
    { left: 0, top: 305, width: 47, height: this.RUNNER_CELLS_HEIGHT },
    { left: 55, top: 305, width: 44, height: this.RUNNER_CELLS_HEIGHT },
    { left: 107, top: 305, width: 39, height: this.RUNNER_CELLS_HEIGHT },
    { left: 152, top: 305, width: 46, height: this.RUNNER_CELLS_HEIGHT },
    { left: 208, top: 305, width: 49, height: this.RUNNER_CELLS_HEIGHT },
    { left: 265, top: 305, width: 46, height: this.RUNNER_CELLS_HEIGHT },
    { left: 320, top: 305, width: 42, height: this.RUNNER_CELLS_HEIGHT },
    { left: 380, top: 305, width: 35, height: this.RUNNER_CELLS_HEIGHT },
    { left: 425, top: 305, width: 35, height: this.RUNNER_CELLS_HEIGHT },
  ];

  sapphireCells = [
    {
      left: 3,
      top: 138,
      width: this.RUBY_CELLS_WIDTH,
      height: this.RUBY_CELLS_HEIGHT,
    },
    {
      left: 39,
      top: 138,
      width: this.RUBY_CELLS_WIDTH,
      height: this.RUBY_CELLS_HEIGHT,
    },
    {
      left: 76,
      top: 138,
      width: this.RUBY_CELLS_WIDTH,
      height: this.RUBY_CELLS_HEIGHT,
    },
    {
      left: 112,
      top: 138,
      width: this.RUBY_CELLS_WIDTH,
      height: this.RUBY_CELLS_HEIGHT,
    },

    {
      left: 148,
      top: 138,
      width: this.RUBY_CELLS_WIDTH,
      height: this.RUBY_CELLS_HEIGHT,
    },
  ];

  snailBombCells = [{ left: 2, top: 512, width: 30, height: 20 }];

  snailCells = [
    {
      left: 142,
      top: 466,
      width: this.SNAIL_CELLS_WIDTH,
      height: this.SNAIL_CELLS_HEIGHT,
    },

    {
      left: 75,
      top: 466,
      width: this.SNAIL_CELLS_WIDTH,
      height: this.SNAIL_CELLS_HEIGHT,
    },

    {
      left: 2,
      top: 466,
      width: this.SNAIL_CELLS_WIDTH,
      height: this.SNAIL_CELLS_HEIGHT,
    },
  ];

  // Sprite data.......................................................

  batData = [
    { left: 70, top: this.TRACK_2_BASELINE - this.BAT_CELLS_HEIGHT },
    { left: 610, top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT },
    { left: 1150, top: this.TRACK_2_BASELINE - 3 * this.BAT_CELLS_HEIGHT },
    { left: 1720, top: this.TRACK_2_BASELINE - 2 * this.BAT_CELLS_HEIGHT },
    { left: 1960, top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT },
    { left: 2200, top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT },
    { left: 2350, top: this.TRACK_3_BASELINE - 2 * this.BAT_CELLS_HEIGHT },
  ];

  beeData = [
    { left: 350, top: this.TRACK_2_BASELINE - this.BEE_CELLS_HEIGHT },
    { left: 550, top: this.TRACK_1_BASELINE - this.BEE_CELLS_HEIGHT },
    { left: 750, top: this.TRACK_1_BASELINE - 1.5 * this.BEE_CELLS_HEIGHT },
    { left: 944, top: this.TRACK_2_BASELINE - 1.25 * this.BEE_CELLS_HEIGHT },
    { left: 1500, top: 225 },
    { left: 1600, top: 115 },
    { left: 2225, top: 125 },
    { left: 2295, top: 275 },
    { left: 2450, top: 275 },
  ];

  buttonData = [{ platformIndex: 7 }, { platformIndex: 12 }];

  coinData = [
    { left: 280, top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT },
    { left: 469, top: this.TRACK_3_BASELINE - this.COIN_CELLS_HEIGHT },
    { left: 620, top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT },
    { left: 833, top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT },
    { left: 1050, top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT },
    { left: 1450, top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT },
    { left: 1670, top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT },
    { left: 1870, top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT },
    { left: 1930, top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT },
    { left: 2200, top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT },
    { left: 2320, top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT },
    { left: 2360, top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT },
  ];

  // Platforms.........................................................

  platformData = [
    // Screen 1.......................................................
    {
      left: 10,
      width: 230,
      height: this.PLATFORM_HEIGHT,
      fillStyle: "rgb(150,190,255)",
      opacity: 1.0,
      track: 1,
      pulsate: false,
    },

    {
      left: 250,
      width: 100,
      height: this.PLATFORM_HEIGHT,
      fillStyle: "rgb(150,190,255)",
      opacity: 1.0,
      track: 2,
      pulsate: false,
    },

    {
      left: 400,
      width: 125,
      height: this.PLATFORM_HEIGHT,
      fillStyle: "rgb(250,0,0)",
      opacity: 1.0,
      track: 3,
      pulsate: false,
    },

    {
      left: 633,
      width: 100,
      height: this.PLATFORM_HEIGHT,
      fillStyle: "rgb(80,140,230)",
      opacity: 1.0,
      track: 1,
      pulsate: false,
    },

    // Screen 2.......................................................

    {
      left: 810,
      width: 100,
      height: this.PLATFORM_HEIGHT,
      fillStyle: "rgb(200,200,0)",
      opacity: 1.0,
      track: 2,
      pulsate: false,
    },

    {
      left: 1025,
      width: 100,
      height: this.PLATFORM_HEIGHT,
      fillStyle: "rgb(80,140,230)",
      opacity: 1.0,
      track: 2,
      pulsate: false,
    },

    {
      left: 1200,
      width: 125,
      height: this.PLATFORM_HEIGHT,
      fillStyle: "aqua",
      opacity: 1.0,
      track: 3,
      pulsate: false,
    },

    {
      left: 1400,
      width: 180,
      height: this.PLATFORM_HEIGHT,
      fillStyle: "rgb(80,140,230)",
      opacity: 1.0,
      track: 1,
      pulsate: false,
    },

    // Screen 3.......................................................

    {
      left: 1625,
      width: 100,
      height: this.PLATFORM_HEIGHT,
      fillStyle: "rgb(200,200,0)",
      opacity: 1.0,
      track: 2,
      pulsate: false,
    },

    {
      left: 1800,
      width: 250,
      height: this.PLATFORM_HEIGHT,
      fillStyle: "rgb(80,140,230)",
      opacity: 1.0,
      track: 1,
      pulsate: false,
    },

    {
      left: 2000,
      width: 100,
      height: this.PLATFORM_HEIGHT,
      fillStyle: "rgb(200,200,80)",
      opacity: 1.0,
      track: 2,
      pulsate: false,
    },

    {
      left: 2100,
      width: 100,
      height: this.PLATFORM_HEIGHT,
      fillStyle: "aqua",
      opacity: 1.0,
      track: 3,
    },

    // Screen 4.......................................................

    {
      left: 2269,
      width: 200,
      height: this.PLATFORM_HEIGHT,
      fillStyle: "gold",
      opacity: 1.0,
      track: 1,
    },

    {
      left: 2500,
      width: 200,
      height: this.PLATFORM_HEIGHT,
      fillStyle: "#2b950a",
      opacity: 1.0,
      track: 2,
      snail: true,
    },
  ];

  rubyData = [
    { left: 150, top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },
    { left: 880, top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT },
    { left: 1100, top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT },
    { left: 1475, top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },
    { left: 2400, top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },
  ];

  sapphireData = [
    { left: 680, top: this.TRACK_1_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },
    { left: 1700, top: this.TRACK_2_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },
    {
      left: 2056,
      top: this.TRACK_2_BASELINE - (3 * this.SAPPHIRE_CELLS_HEIGHT) / 2,
    },
  ];

  smokingHoleData = [
    { left: 248, top: this.TRACK_2_BASELINE - 22 },
    { left: 688, top: this.TRACK_3_BASELINE + 5 },
    { left: 1352, top: this.TRACK_2_BASELINE - 18 },
  ];

  snailData = [{ platformIndex: 3 }];

  // Sprite artists...................................................

  runnerArtist = new SpriteSheetArtist(this.spritesheet, this.runnerCellsRight);

  // Sprite behaviors..................................................
  runBehavior = new RunBehavior(this);
  paceBehavior = new PaceBehavior(this);

  // Snail shoot behavior....................................................
  snailShootBehavior = new SnailShootBehavior(this);

  // Sprites...........................................................

  bats: Sprite[] = [];
  bees: Sprite[] = [];
  buttons: Sprite[] = [];
  coins: Sprite[] = [];
  platforms: any = [];
  rubies: Sprite[] = [];
  sapphires: Sprite[] = [];
  smokingHoles: Sprite[] = [];
  snails: Sprite[] = [];

  sprites: any = []; // For convenience, contains all of the sprites
  // from the preceding arrays

  created() {
    console.log("SnailBait created");
    console.log(this.canvas);
  }
  mounted() {
    console.log("SnailBait mounted");
    this.canvas = document.getElementById("canvas2") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.initializeImages();
    this.createSprites();
    setTimeout(() => this.turnRight(), 1000);
    console.log(this.canvas);
  }

  initializeImages() {
    this.spritesheet.src = require("../assets/spritesheet.png");
    this.spritesheet.onload = () => this.startGame();
  }

  startGame() {
    console.log("execute startGame");
    this.animationId = window.requestAnimationFrame(this.animate);
  }

  calculatePlatformTop(track: number) {
    let top = 0;

    if (track === 1) {
      top = this.TRACK_1_BASELINE;
    } else if (track === 2) {
      top = this.TRACK_2_BASELINE;
    } else if (track === 3) {
      top = this.TRACK_3_BASELINE;
    }

    return top;
  }
  turnRight() {
    this.bgVelocity = this.BACKGROUND_VELOCITY;
    this.runnerArtist.cells = this.runnerCellsRight;
  }
  turnLeft() {
    this.bgVelocity = -this.BACKGROUND_VELOCITY;
    this.runnerArtist.cells = this.runnerCellsLeft;
  }

  animate(now: number) {
    console.log("execute animate" + this.paused);
    if (this.paused) {
      setTimeout(
        () => (this.animationId = window.requestAnimationFrame(this.animate)),
        this.PAUSED_CHECK_INTERVAL
      );
    } else {
      this.fps = this.calculateFps(now);
      this.draw(now);
      this.lastAnimationFrameTime = now;
      this.animationId = window.requestAnimationFrame(this.animate);
    }
  }

  draw(now: number) {
    this.setPlatformVelocity();
    this.setOffsets();

    this.drawBackground();

    this.updateSprites(now);
    this.drawSprites();
  }
  calculateFps(now: number) {
    const fps = 1000 / (now - this.lastAnimationFrameTime);

    if (now - this.lastFpsUpdateTime > 1000) {
      this.lastFpsUpdateTime = now;
    }
    return fps;
  }
  setPlatformVelocity() {
    this.platformVelocity = this.bgVelocity * this.PLATFORM_VELOCITY_MULTIPLIER;
  }
  setOffsets() {
    this.setBackgroundOffset();
    this.setSpriteOffsets();
  }
  setBackgroundOffset() {
    const offset = this.backgroundOffset + this.bgVelocity / this.fps;

    if (offset > 0 && offset < this.BACKGROUND_WIDTH) {
      this.backgroundOffset = offset;
    } else {
      this.backgroundOffset = 0;
    }
  }
  setSpriteOffsets() {
    let i, sprite: Sprite;

    this.spriteOffset += this.platformVelocity / this.fps; // In step with platforms

    for (i = 0; i < this.sprites.length; ++i) {
      sprite = this.sprites[i];

      if ("runner" !== sprite.type && "smoking hole" !== sprite.type) {
        sprite.offset = this.spriteOffset;
      } else if ("smoking hole" === sprite.type) {
        sprite.offset = this.backgroundOffset; // In step with background
      }
    }
  }
  drawBackground() {
    const BACKGROUND_TOP_IN_SPRITESHEET = 590;

    this.context.translate(-this.backgroundOffset, 0);

    // Initially onscreen:
    this.context.drawImage(
      this.spritesheet,
      0,
      BACKGROUND_TOP_IN_SPRITESHEET,
      this.BACKGROUND_WIDTH,
      this.BACKGROUND_HEIGHT,
      0,
      0,
      this.BACKGROUND_WIDTH,
      this.BACKGROUND_HEIGHT
    );

    // Initially offscreen:
    this.context.drawImage(
      this.spritesheet,
      0,
      BACKGROUND_TOP_IN_SPRITESHEET,
      this.BACKGROUND_WIDTH,
      this.BACKGROUND_HEIGHT,
      this.BACKGROUND_WIDTH,
      0,
      this.BACKGROUND_WIDTH,
      this.BACKGROUND_HEIGHT
    );

    this.context.translate(this.backgroundOffset, 0);
  }
  updateSprites(now: number) {
    let sprite: Sprite;

    for (let i = 0; i < this.sprites.length; ++i) {
      sprite = this.sprites[i];

      if (sprite.visible && this.isSpriteInView(sprite)) {
        sprite.update(now, this.fps, this.context, this.lastAnimationFrameTime);
      }
    }
  }
  drawSprites() {
    for (let i = 0; i < this.sprites.length; ++i) {
      this.drawSprite(this.sprites[i]);
    }
  }
  drawSprite(sprite: Sprite) {
    if (sprite.visible && this.isSpriteInView(sprite)) {
      this.context.translate(-sprite.offset, 0);
      sprite.draw(this.context);
      this.context.translate(sprite.offset, 0);
    }
  }

  // ------------------------- SPRITE CREATION ---------------------------
  createSprites() {
    this.createPlatformSprites();
    this.createRunnerSprite();
    this.createBatSprites();
    this.createBeeSprites();
    this.createButtonSprites();
    this.createCoinSprites();
    this.createRubySprites();
    this.createSapphireSprites();
    // this.createSnailSprites();
    this.addSpritesToSpriteArray();
    this.initializeSprites();
  }
  createBatSprites() {
    let bat: Sprite;
    const BAT_VALUE = -50;

    for (let i = 0; i < this.batData.length; ++i) {
      bat = new Sprite(
        "bat",
        new SpriteSheetArtist(this.spritesheet, this.batCells)
      );

      // bat cell width varies; batCells[1] is widest

      bat.width = this.batCells[1].width;
      bat.height = this.BAT_CELLS_HEIGHT;
      bat.value = BAT_VALUE;

      this.bats.push(bat);
    }
  }
  createBeeSprites() {
    let bee, beeArtist;
    const BEE_VALUE = -50;

    for (let i = 0; i < this.beeData.length; ++i) {
      bee = new Sprite(
        "bee",
        new SpriteSheetArtist(this.spritesheet, this.beeCells)
      );

      bee.width = this.BEE_CELLS_WIDTH;
      bee.height = this.BEE_CELLS_HEIGHT;
      bee.value = BEE_VALUE;

      this.bees.push(bee);
    }
  }
  createButtonSprites() {
    let button;

    for (let i = 0; i < this.buttonData.length; ++i) {
      if (i !== this.buttonData.length - 1) {
        // not the last button
        button = new Sprite(
          "button",
          new SpriteSheetArtist(this.spritesheet, this.goldButtonCells),
          [this.paceBehavior]
        );
      } else {
        button = new Sprite(
          "button",
          new SpriteSheetArtist(this.spritesheet, this.blueButtonCells),
          [this.paceBehavior]
        );
      }

      button.width = this.BUTTON_CELLS_WIDTH;
      button.height = this.BUTTON_CELLS_HEIGHT;

      this.buttons.push(button);
    }
  }
  createCoinSprites() {
    let coin, artist;
    const blueCoinArtist = new SpriteSheetArtist(
      this.spritesheet,
      this.blueCoinCells
    );
    const goldCoinArtist = new SpriteSheetArtist(
      this.spritesheet,
      this.goldCoinCells
    );

    for (let i = 0; i < this.coinData.length; ++i) {
      if (i % 2 === 0) {
        coin = new Sprite("coin", goldCoinArtist);
      } else {
        coin = new Sprite("coin", blueCoinArtist);
      }

      coin.width = this.COIN_CELLS_WIDTH;
      coin.height = this.COIN_CELLS_HEIGHT;
      coin.value = 50;

      this.coins.push(coin);
    }
  }
  runner: any;
  createRunnerSprite() {
    this.runner = new Sprite(
      "runner", // type
      this.runnerArtist, // artist
      [this.runBehavior]
    ); // behaviors

    this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;

    this.runner.width = this.RUNNER_CELLS_WIDTH;
    this.runner.height = this.RUNNER_CELLS_HEIGHT;
    this.runner.left = this.INITIAL_RUNNER_LEFT;
    this.runner.track = this.INITIAL_RUNNER_TRACK;
    this.runner.top =
      this.calculatePlatformTop(this.runner.track) - this.RUNNER_CELLS_HEIGHT;
  }
  createRubySprites() {
    let ruby;
    const rubyArtist = new SpriteSheetArtist(this.spritesheet, this.rubyCells);

    for (let i = 0; i < this.rubyData.length; ++i) {
      ruby = new Sprite("ruby", rubyArtist, [
        new CycleBehavior(
          this.RUBY_SPARKLE_DURATION,
          this.RUBY_SPARKLE_INTERVAL
        ),
      ]);

      ruby.width = this.RUBY_CELLS_WIDTH;
      ruby.height = this.RUBY_CELLS_HEIGHT;
      ruby.value = 200;

      this.rubies.push(ruby);
    }
  }
  createSapphireSprites() {
    let sapphire;
    const sapphireArtist = new SpriteSheetArtist(
      this.spritesheet,
      this.sapphireCells
    );

    for (let i = 0; i < this.sapphireData.length; ++i) {
      sapphire = new Sprite("sapphire", sapphireArtist, [
        new CycleBehavior(
          this.SAPPHIRE_SPARKLE_DURATION,
          this.SAPPHIRE_SPARKLE_INTERVAL
        ),
      ]);

      sapphire.width = this.SAPPHIRE_CELLS_WIDTH;
      sapphire.height = this.SAPPHIRE_CELLS_HEIGHT;
      sapphire.value = 100;

      this.sapphires.push(sapphire);
    }
  }
  createSnailSprites() {
    let snail;
    const snailArtist = new SpriteSheetArtist(
      this.spritesheet,
      this.snailCells
    );

    for (let i = 0; i < this.snailData.length; ++i) {
      snail = new Sprite("snail", snailArtist, [
        this.paceBehavior,
        this.snailShootBehavior,
        new CycleBehavior(300, 1500),
      ]);

      snail.width = this.SNAIL_CELLS_WIDTH;
      snail.height = this.SNAIL_CELLS_HEIGHT;

      this.snails.push(snail);
    }
  }
  addSpritesToSpriteArray() {
    this.sprites.push(this.runner);

    for (let i = 0; i < this.platforms.length; ++i) {
      this.sprites.push(this.platforms[i]);
    }

    for (let i = 0; i < this.bats.length; ++i) {
      this.sprites.push(this.bats[i]);
    }

    for (let i = 0; i < this.bees.length; ++i) {
      this.sprites.push(this.bees[i]);
    }

    for (let i = 0; i < this.buttons.length; ++i) {
      this.sprites.push(this.buttons[i]);
    }

    for (let i = 0; i < this.coins.length; ++i) {
      this.sprites.push(this.coins[i]);
    }

    for (let i = 0; i < this.rubies.length; ++i) {
      this.sprites.push(this.rubies[i]);
    }

    for (let i = 0; i < this.sapphires.length; ++i) {
      this.sprites.push(this.sapphires[i]);
    }

    for (let i = 0; i < this.smokingHoles.length; ++i) {
      this.sprites.push(this.smokingHoles[i]);
    }

    for (let i = 0; i < this.snails.length; ++i) {
      this.sprites.push(this.snails[i]);
    }
  }
  createPlatformSprites() {
    let sprite: any, pd: any; // Sprite, Platform data

    for (let i = 0; i < this.platformData.length; ++i) {
      pd = this.platformData[i];

      sprite = new Sprite("platform", new SimpleSpriteSheetArtist(this));

      sprite.left = pd.left;
      sprite.width = pd.width;
      sprite.height = pd.height;
      sprite.fillStyle = pd.fillStyle;
      sprite.opacity = pd.opacity;
      sprite.track = pd.track;
      sprite.button = pd.button;
      sprite.pulsate = pd.pulsate;

      sprite.top = this.calculatePlatformTop(pd.track);

      this.platforms.push(sprite);
    }
  }
  positionSprites(sprites: any, spriteData: any) {
    let sprite;

    for (let i = 0; i < sprites.length; ++i) {
      sprite = sprites[i];

      if (spriteData[i].platformIndex) {
        this.putSpriteOnPlatform(
          sprite,
          this.platforms[spriteData[i].platformIndex]
        );
      } else {
        sprite.top = spriteData[i].top;
        sprite.left = spriteData[i].left;
      }
    }
  }
  initializeSprites() {
    for (let i = 0; i < this.sprites.length; ++i) {
      this.sprites[i].offset = 0;
      this.sprites[i].visible = true;
    }

    this.positionSprites(this.bats, this.batData);
    this.positionSprites(this.bees, this.beeData);
    this.positionSprites(this.buttons, this.buttonData);
    this.positionSprites(this.coins, this.coinData);
    this.positionSprites(this.rubies, this.rubyData);
    this.positionSprites(this.sapphires, this.sapphireData);
    this.positionSprites(this.snails, this.snailData);

    // this.armSnails();
  }

  // --------------------------- UTILITIES --------------------------------

  isSpriteInGameCanvas(sprite: Sprite) {
    return (
      sprite.left + sprite.width > sprite.offset &&
      sprite.left < sprite.offset + this.canvas.width
    );
  }
  isSpriteInView(sprite: Sprite) {
    return this.isSpriteInGameCanvas(sprite);
  }
  putSpriteOnPlatform(sprite: any, platformSprite: any) {
    sprite.top = platformSprite.top - sprite.height;
    sprite.left = platformSprite.left;
    sprite.platform = platformSprite;
  }
}
