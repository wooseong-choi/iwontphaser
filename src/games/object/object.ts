import Phaser from "phaser";

interface iObj {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  scene: globalThis.Phaser.Scene;
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
