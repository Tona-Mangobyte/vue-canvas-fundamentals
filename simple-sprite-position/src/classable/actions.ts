import { ISprite } from '@/classable/sprites'
import { SnailBait } from '@/classable/snailBait'

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

  constructor (duration?: number, pause?: number) {
    this.duration = duration || 0 //  milliseconds
    this.pause = pause || 0
    this.lastAdvance = 0
    this.visible = true
  }

  execute (
    sprite: ISprite,
    now: number,
    fps: number,
    context: CanvasRenderingContext2D,
    lastAnimationFrameTime: number
  ): void {
    if (this.lastAdvance === 0) {
      this.lastAdvance = now
    }

    if (this.pause && sprite.artist.cellIndex === 0) {
      if (now - this.lastAdvance > this.pause) {
        sprite.artist.advance()
        this.lastAdvance = now
      }
    } else if (now - this.lastAdvance > this.duration) {
      sprite.artist.advance()
      this.lastAdvance = now
    }
  }
}

export class RunBehavior extends CycleBehavior {
  snailBait: SnailBait;
  lastAdvanceTime = 0;
  constructor (snailBait: SnailBait, duration?: number, pace?: number) {
    super(duration, pace)
    this.snailBait = snailBait
  }

  execute (
    sprite: any,
    now: number,
    fps: number,
    context: CanvasRenderingContext2D,
    lastAnimationFrameTime: number
  ): void {
    if (sprite.runAnimationRate === 0) {
      return
    }

    if (this.lastAdvanceTime === 0) {
      // skip first time
      this.lastAdvanceTime = now
    } else if (now - this.lastAdvanceTime > 1000 / sprite.runAnimationRate) {
      sprite.artist.advance()
      this.lastAdvanceTime = now
    }
  }
}
