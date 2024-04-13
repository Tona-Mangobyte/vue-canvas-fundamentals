<template>
  <div class="home">
    <canvas id="canvas" width='800' height='400'>
      Your browser does not support HTML5 canvas.
    </canvas>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { SnailBait } from '@/classable/snailBait'

@Component
export default class HomeView extends Mixins(SnailBait) {
  mounted () {
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext('2d')
    this.initializeImages()
    this.createSprites()
    setTimeout(() => this.turnRight(), 1000)
    // setTimeout(() => this.turnLeft(), 1000)
  }
}
</script>
