import Phaser from "phaser";

interface iObj {
  object: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  scene: globalThis.Phaser.Scene;
  width: number;
  height: number;

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
  Collider(): void;
}

// class Object implements iObj {
//   object: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
//   scene: Phaser.Scene;
//   width: number;
//   height: number;

//   constructor() {}
// }
