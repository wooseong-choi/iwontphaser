import Phaser from "phaser";

interface iChara {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  obj: globalThis.Phaser.Scene;
  width: number;
  height: number;
  speed: number;
  name: string;
  oldPosition: { x: number; y: number };

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
    height: number
  ) {
    this.obj = obj;
    this.width = width;
    this.height = height;
    this.speed = 160;
    this.name = name;
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
    const playerWorkDConfig = {
      key: "walk_down",
      frames: this.obj.anims.generateFrameNames("player", {
        start: 0,
        end: 3,
        prefix: "frame_0_",
      }),
      frameRate: 10,
      repeat: -1,
    };
    const playerWorkLConfig = {
      key: "walk_left",
      frames: this.obj.anims.generateFrameNames("player", {
        start: 0,
        end: 3,
        prefix: "frame_1_",
      }),
      frameRate: 10,
      repeat: -1,
    };
    const playerWorkRConfig = {
      key: "walk_right",
      frames: this.obj.anims.generateFrameNames("player", {
        start: 0,
        end: 3,
        prefix: "frame_2_",
      }),
      frameRate: 10,
      repeat: -1,
    };
    const playerWorkUConfig = {
      key: "walk_up",
      frames: this.obj.anims.generateFrameNames("player", {
        start: 0,
        end: 3,
        prefix: "frame_3_",
      }),
      frameRate: 10,
      repeat: -1,
    };

    // this.obj.anims.create(playerWorkDConfig);
    // this.obj.anims.create(playerWorkLConfig);
    // this.obj.anims.create(playerWorkRConfig);
    // this.obj.anims.create(playerWorkUConfig);

    this.player = this.obj.physics.add.sprite(x, y, "player");
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(this.width, this.height, true);
    this.oldPosition = { x: x, y: y };

    return this.player;
  }

  /**
   * Player's Move method along Keyboard Events.
   * @param cursor Keyboard Events
   */
  Move(cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
    const { left, right, up, down } = cursor;

    this.oldPosition = { x: this.player.x, y: this.player.y };

    let velocityX = 0;
    let velocityY = 0;
    let animationKey: string | null = null;

    switch (true) {
      case left.isDown:
        velocityX = -this.speed;
        velocityY = 0;
        animationKey = "walk_left";
        break;
      case right.isDown:
        velocityX = this.speed;
        velocityY = 0;
        animationKey = "walk_right";
        break;
      case up.isDown:
        velocityY = -this.speed;
        velocityX = 0;
        animationKey = "walk_up";
        break;
      case down.isDown:
        velocityY = this.speed;
        velocityX = 0;
        animationKey = "walk_down";
        break;
    }

    // Set player velocity based on key inputs
    this.player.setVelocityX(velocityX);
    this.player.setVelocityY(velocityY);

    // Play animation if key is pressed, otherwise pause
    if (animationKey) {
      this.player.play(animationKey, true);
    } else {
      this.player.anims.pause();
    }
  }

  /**
   * Move the player to a specific coordinate.
   * @param x The x-coordinate to move to.
   * @param y The y-coordinate to move to.
   */
  async moveTo(x: number, y: number) {
    // Calculate the distance to the target
    console.log(x, y);
    const dx = x - this.player.x;
    const dy = y - this.player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate the duration for the tween based on the distance to the target
    const duration = (distance / this.speed) * 1000; // speed is in pixels per second, so multiply by 1000 to get duration in milliseconds

    // Create a tween that updates the player's position
    this.obj.tweens.add({
      targets: this.player,
      x: x,
      y: y,
      duration: duration,
      ease: "Linear",
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
