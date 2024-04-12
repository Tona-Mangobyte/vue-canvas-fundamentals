import { Sprite } from "@/sprites";

export class CycleBehavior {
  duration: number;
  pause: number;
  lastAdvance: number;
  visible: boolean;

  constructor(duration?: number, pause?: number) {
    this.duration = duration || 0; //  milliseconds
    this.pause = pause || 0;
    this.lastAdvance = 0;
    this.visible = true;
  }

  execute(
    sprite: Sprite,
    now: number,
    fps: number,
    context: CanvasRenderingContext2D,
    lastAnimationFrameTime: number
  ): void {
    if (this.lastAdvance === 0) {
      this.lastAdvance = now;
    }

    if (this.pause && sprite.artist.cellIndex === 0) {
      if (now - this.lastAdvance > this.pause) {
        sprite.artist.advance();
        this.lastAdvance = now;
      }
    } else if (now - this.lastAdvance > this.duration) {
      sprite.artist.advance();
      this.lastAdvance = now;
    }
  }
}
export class PaceBehavior extends CycleBehavior {
  obj: any;
  constructor(obj: any, duration?: number, pace?: number) {
    super(duration, pace);
    this.obj = obj;
  }

  execute(
    sprite: any,
    now: number,
    fps: number,
    context: CanvasRenderingContext2D,
    lastAnimationFrameTime: number
  ): void {
    const sRight = sprite.left + sprite.width,
      pRight = sprite.platform.left + sprite.platform.width,
      pixelsToMove = (sprite.velocityX * (now - lastAnimationFrameTime)) / 1000;

    if (sprite.direction === undefined) {
      sprite.direction = this.obj.RIGHT;
    }

    if (sprite.velocityX === 0) {
      if (sprite.type === "snail") {
        sprite.velocityX = this.obj.SNAIL_PACE_VELOCITY;
      } else {
        sprite.velocityX = this.obj.BUTTON_PACE_VELOCITY;
      }
    }

    if (sRight > pRight && sprite.direction === this.obj.RIGHT) {
      sprite.direction = this.obj.LEFT;
    } else if (
      sprite.left < sprite.platform.left &&
      sprite.direction === this.obj.LEFT
    ) {
      sprite.direction = this.obj.RIGHT;
    }

    if (sprite.direction === this.obj.RIGHT) {
      sprite.left += pixelsToMove;
    } else {
      sprite.left -= pixelsToMove;
    }
  }
}
export class RunBehavior extends CycleBehavior {
  obj: any;
  lastAdvanceTime = 0;
  constructor(obj: any, duration?: number, pace?: number) {
    super(duration, pace);
    this.obj = obj;
  }

  execute(
    sprite: any,
    now: number,
    fps: number,
    context: CanvasRenderingContext2D,
    lastAnimationFrameTime: number
  ): void {
    if (sprite.runAnimationRate === 0) {
      return;
    }

    if (this.lastAdvanceTime === 0) {
      // skip first time
      this.lastAdvanceTime = now;
    } else if (now - this.lastAdvanceTime > 1000 / sprite.runAnimationRate) {
      sprite.artist.advance();
      this.lastAdvanceTime = now;
    }
  }
}
export class SnailShootBehavior extends CycleBehavior {
  obj: any;
  constructor(obj: any, duration?: number, pace?: number) {
    super(duration, pace);
    this.obj = obj;
  }

  execute(
    sprite: any,
    now: number,
    fps: number,
    context: CanvasRenderingContext2D,
    lastAnimationFrameTime: number
  ): void {
    const bomb = sprite.bomb;

    if (!this.obj.isSpriteInView(sprite)) {
      return;
    }

    if (!bomb.visible && sprite.artist.cellIndex === 2) {
      bomb.left = sprite.left;
      bomb.visible = true;
    }
  }
}
