import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { PlatformArtist, Sprite, SpriteSheetArtist } from '@/classable/sprites'
import { RunBehavior } from '@/classable/actions'

@Component
export class SnailBait extends Vue {
    LEFT = 1
    RIGHT = 2

    PAUSED_CHECK_INTERVAL = 200

    PLATFORM_HEIGHT = 8
    PLATFORM_STROKE_WIDTH = 2
    PLATFORM_STROKE_STYLE = 'rgb(0,0,0)'

    // Track baselines...................................................

    TRACK_1_BASELINE = 323
    TRACK_2_BASELINE = 223
    TRACK_3_BASELINE = 123

    // Animations........................................................

    RUN_ANIMATION_RATE = 30 // fps

    // Runner values.....................................................

    INITIAL_RUNNER_LEFT = 10
    INITIAL_RUNNER_TRACK = 1

    // Platform scrolling offset (and therefore speed) is
    // PLATFORM_VELOCITY_MULTIPLIER * backgroundOffset: The
    // platforms move PLATFORM_VELOCITY_MULTIPLIER times as
    // fast as the background.

    PLATFORM_VELOCITY_MULTIPLIER = 4.35;

    STARTING_BACKGROUND_VELOCITY = 0;

    STARTING_PLATFORM_OFFSET = 0
    STARTING_BACKGROUND_OFFSET = 0

    // Time..............................................................

    lastAnimationFrameTime = 0
    lastFpsUpdateTime = 0
    fps = 60

    // Paused............................................................

    paused = false

    // Translation offsets...............................................

    backgroundOffset = this.STARTING_BACKGROUND_OFFSET

    // Images............................................................
    spritesheet = new Image()

    // Sprite sheet cells................................................

    BACKGROUND_WIDTH = 1102
    BACKGROUND_HEIGHT = 400

    RUNNER_CELLS_WIDTH = 50 // pixels
    RUNNER_CELLS_HEIGHT = 54

    // Platforms.........................................................

    platformData = [
      // Screen 1.......................................................
      {
        left: 10,
        width: 780,
        height: this.PLATFORM_HEIGHT,
        fillStyle: 'rgb(150,190,255)',
        opacity: 1.0,
        track: 1,
        pulsate: false
      },

      {
        left: 10,
        width: 780,
        height: this.PLATFORM_HEIGHT,
        fillStyle: 'rgb(150,190,255)',
        opacity: 1.0,
        track: 2,
        pulsate: false
      },

      {
        left: 10,
        width: 780,
        height: this.PLATFORM_HEIGHT,
        fillStyle: 'rgb(250,0,0)',
        opacity: 1.0,
        track: 3,
        pulsate: false
      }
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
      { left: 0, top: 385, width: 35, height: this.RUNNER_CELLS_HEIGHT }
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
      { left: 425, top: 305, width: 35, height: this.RUNNER_CELLS_HEIGHT }
    ];

    // Sprite artists...................................................

    runnerArtist = new SpriteSheetArtist(this.spritesheet, this.runnerCellsRight);

    // Sprite behaviors..................................................
    runBehavior = new RunBehavior(this);

    // Sprites...........................................................
    platforms: any = [];
    sprites: any = []; // For convenience, contains all of the sprites

    animationId: number | null = null
    canvas: any = null
    context: any = null

    initializeImages () {
      this.spritesheet.src = require('../assets/spritesheet.png')
      this.spritesheet.onload = () => this.startGame()
    }

    startGame () {
      console.log('execute startGame')
      this.animationId = window.requestAnimationFrame(this.animate)
    }

    turnRight () {
      // In step with background
      // this.bgVelocity = this.BACKGROUND_VELOCITY
      // this.runnerArtist.cells = this.runnerCellsRight
    }

    animate (now: number) {
      if (this.paused) {
        setTimeout(
          () => (this.animationId = window.requestAnimationFrame(this.animate)),
          this.PAUSED_CHECK_INTERVAL
        )
      } else {
        this.fps = this.calculateFps(now)
        this.draw(now)
        this.lastAnimationFrameTime = now
        this.animationId = window.requestAnimationFrame(this.animate)
      }
    }

    calculateFps (now: number) {
      const fps = 1000 / (now - this.lastAnimationFrameTime)

      if (now - this.lastFpsUpdateTime > 1000) {
        this.lastFpsUpdateTime = now
      }
      return fps
    }

    draw (now: number) {
      this.setOffsets()
      this.drawBackground()

      this.updateSprites(now)
      this.drawSprites()
    }

    setOffsets () {
      this.setSpriteOffsets()
    }

    setSpriteOffsets () {
      let sprite: Sprite
      for (let i = 0; i < this.sprites.length; ++i) {
        sprite = this.sprites[i]
        if (sprite.type === 'runner') {
          sprite.offset -= 1 // Move to the left
          if (sprite.offset <= -780) {
            sprite.track += 1 // Move to next track
            if (sprite.track > 3) {
              sprite.track = 1 // Back to track 1
            }
            sprite.offset = 0 // Reset offset
            sprite.top = this.calculatePlatformTop(sprite.track) - this.RUNNER_CELLS_HEIGHT
            this.drawSprite(sprite) // Draw the sprite at the new location
          }
        }
      }
    }

    drawBackground () {
      const BACKGROUND_TOP_IN_SPRITESHEET = 590

      this.context.translate(-this.backgroundOffset, 0)

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
      )

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
      )

      this.context.translate(this.backgroundOffset, 0)
    }

    updateSprites (now: number) {
      let sprite: Sprite
      for (let i = 0; i < this.sprites.length; ++i) {
        sprite = this.sprites[i]
        if (sprite.visible && this.isSpriteInView(sprite)) {
          sprite.update(now, this.fps, this.context, this.lastAnimationFrameTime)
        }
      }
    }

    drawSprites () {
      for (let i = 0; i < this.sprites.length; ++i) {
        this.drawSprite(this.sprites[i])
      }
    }

    drawSprite (sprite: Sprite) {
      if (sprite.visible && this.isSpriteInView(sprite)) {
        this.context.translate(-sprite.offset, 0)
        sprite.draw(this.context)
        this.context.translate(sprite.offset, 0)
      }
    }

    // ------------------------- SPRITE CREATION ---------------------------
    createSprites () {
      this.createPlatformSprites()
      this.createRunnerSprite()
      this.addSpritesToSpriteArray()
      this.initializeSprites()
    }

    createPlatformSprites () {
      let sprite: any, pd: any // Sprite, Platform data

      for (let i = 0; i < this.platformData.length; ++i) {
        pd = this.platformData[i]

        sprite = new Sprite('platform', new PlatformArtist(this))

        sprite.left = pd.left
        sprite.width = pd.width
        sprite.height = pd.height
        sprite.fillStyle = pd.fillStyle
        sprite.opacity = pd.opacity
        sprite.track = pd.track
        sprite.button = pd.button
        sprite.pulsate = pd.pulsate

        sprite.top = this.calculatePlatformTop(pd.track)

        this.platforms.push(sprite)
      }
    }

    runner: Sprite | null = null;
    createRunnerSprite () {
      this.runner = new Sprite(
        'runner', // type
        this.runnerArtist, // artist
        [this.runBehavior]
      ) // behaviors

      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE

      this.runner.width = this.RUNNER_CELLS_WIDTH
      this.runner.height = this.RUNNER_CELLS_HEIGHT
      this.runner.left = this.INITIAL_RUNNER_LEFT
      this.runner.track = this.INITIAL_RUNNER_TRACK
      this.runner.top =
            this.calculatePlatformTop(this.runner.track) - this.RUNNER_CELLS_HEIGHT
    }

    addSpritesToSpriteArray () {
      this.sprites.push(this.runner)

      for (let i = 0; i < this.platforms.length; ++i) {
        this.sprites.push(this.platforms[i])
      }
    }

    initializeSprites () {
      for (let i = 0; i < this.sprites.length; ++i) {
        this.sprites[i].offset = 0
        this.sprites[i].visible = true
      }
    }

    calculatePlatformTop (track: number) {
      let top = 0

      if (track === 1) {
        top = this.TRACK_1_BASELINE
      } else if (track === 2) {
        top = this.TRACK_2_BASELINE
      } else if (track === 3) {
        top = this.TRACK_3_BASELINE
      }

      return top
    }

    // --------------------------- UTILITIES --------------------------------

    isSpriteInGameCanvas (sprite: Sprite) {
      return (
        sprite.left + sprite.width > sprite.offset &&
            sprite.left < sprite.offset + this.canvas.width
      )
    }

    isSpriteInView (sprite:Sprite) {
      return this.isSpriteInGameCanvas(sprite)
    }
}
