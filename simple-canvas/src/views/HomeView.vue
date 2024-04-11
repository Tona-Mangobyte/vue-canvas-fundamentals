<template>
  <div class="home">
    <canvas id="canvas" width='800' height='400'>
      Your browser does not support HTML5 canvas.
    </canvas>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import '../snailbait.css'
import Vue from 'vue'

@Component
export default class HomeView extends Vue {
  animationId: number | null = null
  canvas: HTMLCanvasElement | null = null
  context: any = null
  background = new Image()
  runnerImage = new Image()

  // Time..............................................................

  lastAnimationFrameTime = 0
  lastFpsUpdateTime = 0
  fps = 60

  // Constants............................................................
  LEFT = 1
  RIGHT = 2

  BACKGROUND_VELOCITY = 42

  PLATFORM_HEIGHT = 8
  PLATFORM_STROKE_WIDTH = 2
  PLATFORM_STROKE_STYLE = 'rgb(0,0,0)' // black

  STARTING_RUNNER_LEFT = 50
  STARTING_RUNNER_TRACK = 1

  // Track baselines...................................................

  TRACK_1_BASELINE = 323
  TRACK_2_BASELINE = 223
  TRACK_3_BASELINE = 123

  STARTING_BACKGROUND_VELOCITY = 0

  STARTING_BACKGROUND_OFFSET = 0

  // Runner track......................................................

  runnerTrack = this.STARTING_RUNNER_TRACK

  // Translation offsets...............................................

  backgroundOffset = this.STARTING_BACKGROUND_OFFSET

  // Velocities........................................................

  bgVelocity = this.STARTING_BACKGROUND_VELOCITY

  // Platforms.........................................................

  platformData = [ // One screen for now
    // Screen 1.......................................................
    {
      left: 10,
      width: 230,
      height: this.PLATFORM_HEIGHT,
      fillStyle: 'rgb(250,250,0)',
      opacity: 0.5,
      track: 1,
      pulsate: false
    },

    {
      left: 250,
      width: 100,
      height: this.PLATFORM_HEIGHT,
      fillStyle: 'rgb(150,190,255)',
      opacity: 1.0,
      track: 2,
      pulsate: false
    },

    {
      left: 400,
      width: 125,
      height: this.PLATFORM_HEIGHT,
      fillStyle: 'rgb(250,0,0)',
      opacity: 1.0,
      track: 3,
      pulsate: false
    },

    {
      left: 633,
      width: 100,
      height: this.PLATFORM_HEIGHT,
      fillStyle: 'rgb(250,250,0)',
      opacity: 1.0,
      track: 1,
      pulsate: false
    }
  ];

  mounted () {
    this.init()
    setTimeout(() => this.turnRight(), 1000)
  }

  beforeDestroy () {
    if (this.animationId !== null) {
      window.cancelAnimationFrame(this.animationId)
      console.log('animation has been canceled')
    }
  }

  init () {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.initializeImages()
  }

  initializeImages () {
    this.background.src = require('../assets/background.png')
    this.runnerImage.src = require('../assets/runner.png')

    this.background.onload = () => this.startGame()
  }

  draw () {
    this.setOffsets()
    this.drawBackground()
    this.drawPlatforms()
    this.drawRunner()
  }

  startGame () {
    console.log('execute startGame')
    this.animationId = window.requestAnimationFrame(this.animate)
  }

  animate (now: number) {
    this.fps = this.calculateFps(now)
    this.draw()
    this.animationId = window.requestAnimationFrame(this.animate)
  }

  setOffsets () {
    this.setBackgroundOffset()
  }

  setBackgroundOffset () {
    const offset = this.backgroundOffset + this.bgVelocity / this.fps

    if (offset > 0 && offset < this.background.width) {
      this.backgroundOffset = offset
    } else {
      this.backgroundOffset = 0
    }
    console.log('backgroundOffset:', this.backgroundOffset)
  }

  drawBackground () {
    this.context?.translate(-this.backgroundOffset, 0)

    // Initially onscreen:
    this.context?.drawImage(this.background, 0, 0)

    // Initially offscreen:
    this.context?.drawImage(this.background, this.background.width, 0)

    this.context?.translate(this.backgroundOffset, 0)
  }

  drawPlatforms () {
    let data,
      platformTop,
      index

    this.context?.save()

    for (index = 0; index < this.platformData.length; ++index) {
      data = this.platformData[index]
      platformTop = this.calculatePlatformTop(data.track)

      this.context.lineWidth = this.PLATFORM_STROKE_WIDTH
      this.context.strokeStyle = this.PLATFORM_STROKE_STYLE
      this.context.fillStyle = data.fillStyle
      this.context.globalAlpha = data.opacity

      this.context?.strokeRect(data.left, platformTop, data.width, data.height)
      this.context?.fillRect(data.left, platformTop, data.width, data.height)
    }

    this.context?.restore()
  }

  drawRunner () {
    this.context?.drawImage(this.runnerImage,
      this.STARTING_RUNNER_LEFT,
      this.calculatePlatformTop(this.STARTING_RUNNER_TRACK) - this.runnerImage.height)
  }

  calculateFps (now: number) {
    const fps = 1000 / (now - this.lastAnimationFrameTime)
    this.lastAnimationFrameTime = now

    if (now - this.lastFpsUpdateTime > 1000) {
      this.lastFpsUpdateTime = now
      // this.fpsElement.innerHTML = fps.toFixed(0) + ' fps'
    }
    return fps
  }

  calculatePlatformTop (track: number) {
    let top = 0

    if (track === 1) {
      top = this.TRACK_1_BASELINE // 323
    } else if (track === 2) {
      top = this.TRACK_2_BASELINE // 223
    } else if (track === 3) { top = this.TRACK_3_BASELINE } // 123

    return top
  }

  turnLeft () {
    this.bgVelocity = -this.BACKGROUND_VELOCITY
  }

  turnRight () {
    this.bgVelocity = this.BACKGROUND_VELOCITY
  }
}
</script>
