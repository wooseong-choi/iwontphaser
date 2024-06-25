import Phaser from "phaser";
import Player from "./character/Player.ts";

class GameScene extends Phaser.Scene {
  constructor() {
    super();

    this.Map_Height = 800;
    this.Map_Width = 608;
    this.Tile_Height = 16;
    this.Tile_Width = 16;

    this.Player = new Player(this, 64, 64);
  }

  preload() {
    this.Player.Preload("player", "./reddude.png", "./meta/move.json");
    this.load.atlas("background", "./gfx/Overworld.png", "./world.json"); // Load your tileset image and JSON
    this.load.image("obstacle", "./gfx/7.png");
  }

  create() {
    // Create a static group for the tiles
    const tiles = this.physics.add.staticGroup();

    // Add tiles from the tileset
    for (let i = 0; i < this.Map_Height; i += this.Tile_Height) {
      for (let j = 0; j < this.Map_Width; j += this.Tile_Width) {
        tiles.create(i, j, "background", "tile_0");
      }
    }

    this.player = this.Player.Create(64, 64);

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

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.Player.Move(this.cursors);
  }

  handleCollision(player, obstacle) {
    // 충돌 시 실행할 코드
    // obstacle.x= 400;
    // obstacle.y= 300;
    console.log("플레이어와 장애물이 충돌했습니다!");
  }
}

export default GameScene;
