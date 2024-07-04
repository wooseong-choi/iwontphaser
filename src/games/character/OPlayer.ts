import Phaser from "phaser";

interface iChara {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  obj: globalThis.Phaser.Scene;
  width: number;
  height: number;
  speed: number;
  name: string;
  oldPosition: { x: number; y: number };
  direction: string;
  uid: number;
  onMove: boolean;

  Preload(
    key: string,
    url?: string,
    xhrSettings?: Phaser.Types.Loader.XHRSettingsObject
  ): void;

  Create(
    x: number,
    y: number
  ): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  Move(cursor: Phaser.Types.Input.Keyboard.CursorKeys): void;
  Effect(): void;
  Destroy(): void;
}

class OPlayer implements iChara {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  obj: globalThis.Phaser.Scene;
  width: number;
  height: number;
  speed: number;
  name: string;
  oldPosition: { x: number; y: number };
  direction: string;
  uid: number;
  onMove: boolean;
  targetX: number;
  targetY: number;
  client_id: string;
  /**
   * constructor of class Player
   * @param obj Game Object of Phaser
   * @param width of player Image width
   * @param height of player Image height
   */
  constructor(
    obj: globalThis.Phaser.Scene,
    name: string,
    width: number,
    height: number,
    uid: number,
    client_id: string
  ) {
    this.obj = obj;
    this.width = width;
    this.height = height;
    this.speed = 160;
    this.name = name;
    this.direction = "down";
    this.uid = uid;
    this.onMove = false;
    this.client_id = client_id;
  }

  /**
   * Preload
   * @param key object name to register on Phaser Game Object
   * @param url img source(url or file path)
   * @param xhrSettings meta data of img(frames...) or null
   */
  Preload(
    key: string,
    url?: string,
    xhrSettings?: Phaser.Types.Loader.XHRSettingsObject
  ) {
    this.obj.load.atlas(key, url, xhrSettings);
  }

  /**
   * Creating Imgs, Anims, Colliders. it returns Object of player.
   * @param x x position of player
   * @param y y positioin of player
   * @returns object of player
   */
  Create(
    x: number,
    y: number
  ): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    this.player = this.obj.physics.add.sprite(x, y, "player");
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(this.width, this.height, true);
    this.oldPosition = { x: x, y: y };

    return this.player;
  }

  /**
   * @deprecated Use moveTo instead
   * @param cursor Keyboard Events
   */
  Move(cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
    // deprecated method
  }

  setMoving(isMoving: boolean) {
    this.onMove = isMoving;
    if (!isMoving) {
      this.player.anims.pause();
    } else {
      this.player.anims.resume();
    }
  }

  /**
   * Move the player to a specific coordinate.
   * @param x The x-coordinate to move to.
   * @param y The y-coordinate to move to.
   */
  async moveTo(x: number, y: number, direction: string) {
    // Calculate the distance to the target
    const dx = x - this.player.x;
    const dy = y - this.player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.direction = direction;

    // Calculate the duration for the tween based on the distance to the target
    const duration = (distance / this.speed) * 1000; // speed is in pixels per second, so multiply by 1000 to get duration in milliseconds

    // Create a tween that updates the player's position
    return new Promise<void>((resolve) => {
      this.obj.tweens.add({
        targets: this.player,
        x: x,
        y: y,
        duration: duration,
        ease: "Linear",
        onComplete: () => {
          this.onMove = false;
          this.player.anims.pause();
          resolve();
        },
      });

      if (this.onMove) {
        this.player.anims.play(`${direction}`, true);
      }
    });
  }

  // 플레이어의 위치를 블록 단위로 움직이게 하는 메서드
  moveToBlock(x: number, y: number) {
    // 블록 크기 정의
    const BLOCK_SIZE = 32;
    // 블록 단위로 반올림
    const targetX = Math.round(x / BLOCK_SIZE) * BLOCK_SIZE;
    const targetY = Math.round(y / BLOCK_SIZE) * BLOCK_SIZE;

    // 플레이어의 위치를 블록 단위로 업데이트
    this.player.x = targetX;
    this.player.y = targetY;
  }

  Effect() {}

  Destroy() {
    this.player.destroy();
  }
}

export default OPlayer;
