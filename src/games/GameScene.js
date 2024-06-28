import Phaser from "phaser";
import Player from "./character/Player.ts";
import Scroll from "./scroll/scrollEventHandler.ts";

class GameScene extends Phaser.Scene {
  constructor() {
    super();

    this.Map_Height = window.innerHeight;
    this.Map_Width = window.innerWidth;
    this.Tile_Height = 16;
    this.Tile_Width = 16;

    this.Player = new Player(this, 64, 64);
    this.scoll = new Scroll(this, 1024, 2048);
  }

  preload() {
    this.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');

    this.Player.Preload("player", "./reddude.png", "./meta/move.json");
    this.load.tilemapTiledJSON("map", "./map/first_map.json");
    this.load.atlas("background", "./gfx/inner.png", "./meta/Inner.json"); // Load your tileset image and JSON
    this.load.image("obstacle", "./gfx/7.png");

    // 맵인데 이것도 나중에 바꿀거
    // this.load.image(
    //   "map",
    //   "https://labs.phaser.io/assets/tests/camera/earthbound-scarab.png"
    // );
  }

  create() {
    // Create a static group for the tiles

    // Add tiles from the tileset
    // const tiles = this.physics.add.staticGroup();
    // for (let i = 0; i < this.Map_Width; i += this.Tile_Width) {
    //   for (let j = 0; j < this.Map_Height; j += this.Tile_Height) {
    //     tiles.create(i, j, "background", "frame_1_0");
    //   }
    // }

    const map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16,
    });
    const tileset = map.addTilesetImage("map");
    const layer = map.createLayer(0, tileset, 0, 0);

    this.player = this.Player.Create(64, 64);
    this.scoll.create(this, 1024, 2048);

    // layer.setCollisionByProperty({ collides: true });
    // this.physics.add.collider(this.player, layer);

    // 장애물 생성
    this.obstacles = this.physics.add.group({
      key: "obstacle",
      // repeat: 5,
      setScale: { x: 0.1, y: 0.1 },
      setXY: { x: 400, y: 300, stepX: 1 },
    });

    // this.obstacles.setCollideWorldBounds(true);

    // 장애물과 플레이어의 충돌 설정
    this.physics.add.collider(
      this.player,
      this.obstacles,
      this.handleCollision,
      null,
      this
    );

    this.input.keyboard.on("keydown", (event) => {
      if (event.key === "r") {
        this.scene.restart();
      }
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.Player.Move(this.cursors);
  }

  handleCollision(player, obstacle) {
    // 충돌 시 실행할 코드
    console.log("플레이어와 장애물이 충돌했습니다!");
  }
}

export default GameScene;
