<template>
  <div class="about">
    <h1>This is an about page</h1>
    <canvas id="canvas2" width="800" height="400">
      Your browser does not support HTML5 canvas.
    </canvas>
  </div>
</template>
<script lang="ts">
//import { Component, Mixins } from "vue-property-decorator";
import Component, { mixins } from "vue-class-component";
import { SnailBait } from "@/classable/snailBait";
import { SimpleMixin } from "@/classable/simpleMixin";
// import "../snailbait.css";

@Component
export default class AboutView extends mixins(SnailBait, SimpleMixin) {
  created() {
    console.log("AboutView created");
    console.log(this.paused);
    console.log(this.simple);
  }
  mounted() {
    /*this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");*/
    // const snailBait = new SnailBait(this.context, this.canvas);
    /*this.snailBait.context = this.context;
    this.snailBait.canvas = this.canvas;
    this.snailBait.initializeImages();
    this.snailBait.createSprites();*/
    // this.initializeImages();
    // this.createSprites();
    // setTimeout(() => this.turnRight(), 1000);
    // console.log(document.getElementById("canvas2"));
    console.log(this.paused);
    console.log(this.simple);
  }
}
</script>
