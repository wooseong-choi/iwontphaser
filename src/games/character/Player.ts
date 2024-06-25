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

  constructor(obj: globalThis.Phaser.Scene, width: number, height: number) {
    this.obj = obj;
    this.width = width;
    this.height = height;
    this.speed = 160;
  }

  Preload(
    key: string,
    url?: string,
    xhrSettings?: Phaser.Types.Loader.XHRSettingsObject
  ) {
    this.obj.load.atlas(key, url, xhrSettings);
  }

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
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(this.width, this.height, true);

    return this.player;
  }

  Move(cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
    const { left, right, up, down } = cursor;

    if (left.isDown) {
      this.player.setVelocityX(-this.speed);
      this.player.setVelocityY(0);
      this.player.play("walk_left", true);
    } else if (right.isDown) {
      this.player.setVelocityX(this.speed);
      this.player.setVelocityY(0);
      this.player.play("walk_right", true);
    } else if (up.isDown) {
      this.player.setVelocityY(-this.speed);
      this.player.setVelocityX(0);
      this.player.play("walk_up", true);
    } else if (down.isDown) {
      this.player.setVelocityY(this.speed);
      this.player.setVelocityX(0);
      this.player.play("walk_down", true);
    } else {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
      this.player.anims.pause();
    }
  }

  Effect() {}
}

export default Player;
