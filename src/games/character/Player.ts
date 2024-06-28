import Phaser from "phaser";

interface iChara {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  obj: globalThis.Phaser.Scene;
  width: number;
  height: number;
  speed: number;

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
}

class Player implements iChara {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  obj: globalThis.Phaser.Scene;
  width: number;
  height: number;
  speed: number;

  /**
   * constructor of class Player
   * @param obj Game Object of Phaser
   * @param width of player Image width
   * @param height of player Image height
   */
  constructor(obj: globalThis.Phaser.Scene, width: number, height: number) {
    this.obj = obj;
    this.width = width;
    this.height = height;
    this.speed = 160;
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

    this.obj.anims.create(playerWorkDConfig);
    this.obj.anims.create(playerWorkLConfig);
    this.obj.anims.create(playerWorkRConfig);
    this.obj.anims.create(playerWorkUConfig);

    this.player = this.obj.physics.add.sprite(x, y, "player");
    this.player.body.setSize(this.width, this.height, true);
    this.player.setCollideWorldBounds(true);

    return this.player;
  }

  /**
   * Player's Move method along Keyboard Events.
   * @param cursor Keyboard Events
   */
  Move(cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
    const { left, right, up, down } = cursor;

    let velocityX = 0;
    let velocityY = 0;
    let animationKey: string | null = null;

    switch (true) {
      case left.isDown:
        this.player.x -= 16;
        velocityX = -this.speed;
        velocityY = 0;
        animationKey = "walk_left";
        break;
      case right.isDown:
        this.player.x += 16;
        velocityX = this.speed;
        velocityY = 0;
        animationKey = "walk_right";
        break;
      case up.isDown:
        this.player.y -= 16;
        velocityY = -this.speed;
        velocityX = 0;
        animationKey = "walk_up";
        break;
      case down.isDown:
        this.player.y += 16;
        velocityY = this.speed;
        velocityX = 0;
        animationKey = "walk_down";
        break;
    }

    // Set player velocity based on key inputs
    // this.player.setVelocityX(velocityX);
    // this.player.setVelocityY(velocityY);

    // Play animation if key is pressed, otherwise pause
    if (animationKey) {
      this.player.play(animationKey, true);
    } else {
      this.player.anims.pause();
    }
  }

  Effect() {}
}

export default Player;
