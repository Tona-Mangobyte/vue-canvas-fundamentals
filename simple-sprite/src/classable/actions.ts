import { ISprite } from "@/classable/sprites";
import { SnailBait } from "@/classable/snailBait";

export interface IActionBehavior {
  execute(
    sprite: ISprite,
    now: number,
    fps: number,
    context: CanvasRenderingContext2D,
    lastAnimationFrameTime: number
  ): void;
}

export class CycleBehavior implements IActionBehavior {
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
    sprite: ISprite,
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
  snailBait: SnailBait;
  constructor(snailBait: SnailBait, duration?: number, pace?: number) {
    super(duration, pace);
    this.snailBait = snailBait;
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
      sprite.direction = this.snailBait.RIGHT;
    }

    if (sprite.velocityX === 0) {
      if (sprite.type === "snail") {
        sprite.velocityX = this.snailBait.SNAIL_PACE_VELOCITY;
      } else {
        sprite.velocityX = this.snailBait.BUTTON_PACE_VELOCITY;
      }
    }

    if (sRight > pRight && sprite.direction === this.snailBait.RIGHT) {
      sprite.direction = this.snailBait.LEFT;
    } else if (
      sprite.left < sprite.platform.left &&
      sprite.direction === this.snailBait.LEFT
    ) {
      sprite.direction = this.snailBait.RIGHT;
    }

    if (sprite.direction === this.snailBait.RIGHT) {
      sprite.left += pixelsToMove;
    } else {
      sprite.left -= pixelsToMove;
    }
  }
}
export class RunBehavior extends CycleBehavior {
  snailBait: SnailBait;
  lastAdvanceTime = 0;
  constructor(snailBait: SnailBait, duration?: number, pace?: number) {
    super(duration, pace);
    this.snailBait = snailBait;
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
  snailBait: SnailBait;
  constructor(snailBait: SnailBait, duration?: number, pace?: number) {
    super(duration, pace);
    this.snailBait = snailBait;
  }

  execute(
    sprite: any,
    now: number,
    fps: number,
    context: CanvasRenderingContext2D,
    lastAnimationFrameTime: number
  ): void {
    const bomb = sprite.bomb;

    if (!this.snailBait.isSpriteInView(sprite)) {
      return;
    }

    if (!bomb.visible && sprite.artist.cellIndex === 2) {
      bomb.left = sprite.left;
      bomb.visible = true;
    }
  }
}
