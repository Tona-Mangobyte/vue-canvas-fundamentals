// Define the type for a cell
import { CycleBehavior } from "@/cycle";

interface Cell {
  left: number;
  top: number;
  width: number;
  height: number;
}

// Define the type for a collision margin
interface CollisionMargin {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX?: number;
  centerY?: number;
}

// Define the type for a behavior
/*interface Behavior {
  execute(
    sprite: Sprite,
    time: number,
    fps: number,
    context: CanvasRenderingContext2D,
    lastAnimationFrameTime: number
  ): void;
}*/

export class SpriteSheetArtist {
  cells?: Cell[];
  spritesheet?: HTMLImageElement;
  cellIndex: number;

  constructor(spritesheet?: HTMLImageElement, cells?: Cell[]) {
    this.spritesheet = spritesheet;
    this.cells = cells;
    this.cellIndex = 0;
  }

  advance(): void {
    if (this.cellIndex == this.cells?.length ?? 0 - 1) {
      this.cellIndex = 0;
    } else {
      this.cellIndex++;
    }
  }

  draw(sprite: Sprite, context: CanvasRenderingContext2D): void {
    const cell = this.cells?.[this.cellIndex];

    if (this.spritesheet) {
      context.drawImage(
        this.spritesheet,
        cell?.left ?? 0,
        cell?.top ?? 0,
        cell?.width ?? 0,
        cell?.height ?? 0,
        sprite.left ?? 0,
        sprite.top ?? 0,
        cell?.width ?? 0,
        cell?.height ?? 0
      );
    }
  }
}
export class SimpleSpriteSheetArtist extends SpriteSheetArtist {
  obj: any;
  constructor(obj: any, spritesheet?: HTMLImageElement, cells?: Cell[]) {
    super(spritesheet, cells);
    this.obj = obj;
  }
  draw(sprite: any, context: any): void {
    context.save();
    const top = this.obj.calculatePlatformTop(sprite.track);
    context.lineWidth = this.obj.PLATFORM_STROKE_WIDTH;
    context.strokeStyle = this.obj.PLATFORM_STROKE_STYLE;
    context.fillStyle = sprite.fillStyle;

    context.strokeRect(sprite.left, top, sprite.width, sprite.height);
    context.fillRect(sprite.left, top, sprite.width, sprite.height);

    context.restore();
  }
}

export class Sprite {
  artist: SpriteSheetArtist;
  type: string;
  // behaviors: Behavior[];
  behaviors: CycleBehavior[];

  offset: number;
  left: number;
  top: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  opacity: number;
  visible: boolean;
  drawCollisionRectangle: boolean;
  value: number;

  collisionMargin: CollisionMargin;

  constructor(
    type: string,
    artist: SpriteSheetArtist,
    behaviors?: CycleBehavior[]
  ) {
    this.artist = artist;
    this.type = type || "";
    this.behaviors = behaviors || [];

    this.offset = 0;
    this.left = 0;
    this.top = 0;
    this.width = 10;
    this.height = 10;
    this.velocityX = 0;
    this.velocityY = 0;
    this.opacity = 1.0;
    this.visible = true;
    this.drawCollisionRectangle = false;
    this.value = 0;

    this.collisionMargin = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
  }

  draw(context: CanvasRenderingContext2D): void {
    let r;

    context.save();

    context.globalAlpha = this.opacity;

    if (this.artist && this.visible) {
      this.artist.draw(this, context);
    }

    if (this.drawCollisionRectangle) {
      r = this.calculateCollisionRectangle();

      context.save();
      context.beginPath();
      context.strokeStyle = "white";
      context.lineWidth = 2.0;
      context.rect(
        r.left + this.offset,
        r.top,
        r.right - r.left,
        r.bottom - r.top
      );
      context.stroke();
      context.restore();
    }

    context.restore();
  }

  update(
    time: number,
    fps: number,
    context: CanvasRenderingContext2D,
    lastAnimationFrameTime: number
  ): void {
    for (let i = 0; i < this.behaviors.length; ++i) {
      if (this.behaviors[i] === undefined) {
        // Modified while looping?
        return;
      }

      this.behaviors[i].execute(
        this,
        time,
        fps,
        context,
        lastAnimationFrameTime
      );
    }
  }

  calculateCollisionRectangle(): CollisionMargin {
    return {
      left: this.left - this.offset + this.collisionMargin.left,
      right: this.left - this.offset + this.width - this.collisionMargin.right,
      top: this.top + this.collisionMargin.top,
      bottom:
        this.top +
        this.collisionMargin.top +
        this.height -
        this.collisionMargin.bottom,

      centerX: this.left + this.width / 2,
      centerY: this.top + this.height / 2,
    };
  }
}
