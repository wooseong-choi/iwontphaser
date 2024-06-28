import Phaser from "phaser";
import Player from "./character/Player.ts";
import Scroll from "./scroll/scrollEventHandler.ts";
import io from "socket.io-client";

class GameScene extends Phaser.Scene {
  constructor() {
    super();
    this.Map_Height = 800;
    this.Map_Width = 600;
    this.Tile_Height = 16;
    this.Tile_Width = 16;

    this.Player = new Player(this, 64, 64);
    this.scoll = new Scroll(this, this.Map_Width, this.Map_Height);
    this.socket = io('ws://192.168.0.96:3001');

    this.socket.on("connect", function () {
      console.log("Socket.IO connected.");
    });

    this.socket.on("message", (data) => {
      // console.log('Received: ' + data);
      if (data.type === "move") {
        for (let i = 0; i < data.users.length; i++) {
          this.Player.moveToBlock(data.users[i].x, data.users[i].y);
        }
      }
    });

    this.socket.on("disconnect", function () {
      console.log("Socket.IO disconnected.");
    });

    this.socket.on("error", function (error) {
      console.log("Socket.IO Error: " + error);
    });
  }

  preload() {
    this.Player.Preload("player", "./reddude.png", "./meta/move.json");
    this.load.tilemapCSV("first_map", "./map/test/test.csv");
    this.load.image("tileset", "./gfx/Inner.png");
    // this.load.tilemapCSV("first_map", "./map/first_map.csv");
    // this.load.image("tileset", "./gfx/Inner.png");
    // this.load.atlas("background", "./gfx/inner.png", "./meta/Inner.json"); // Load your tileset image and JSON
    this.load.image("obstacle", "./gfx/7.png");
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

    var map = this.make.tilemap({
      key: "first_map",
      tileWidth: 16,
      tileHeight: 16,
    });
    var tileset = map.addTilesetImage("tileset");
    var layer = map.createLayer(0, tileset,0 ,0);


    this.player = this.Player.Create(64, 64);
    this.scoll.create(this, 1024, 2048);

    layer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, layer);
    

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
      this.Player,
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
    this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
  }

  update() {
    this.Player.Move(this.cursors);
    if(this.Player.oldPosition && (this.player.x !== this.Player.oldPosition.x || this.player.y !== this.Player.oldPosition.y) ){
      const username = sessionStorage.getItem("username");
      // console.log(this.Player.oldPosition);
      // console.log(this.player.x, this.player.y);
      this.Player.oldPosition = { x: this.player.x, y: this.player.y };
      const user ={ username: username, x: this.player.x, y: this.player.y };
      this.socket.emit('move', user);
    }
    // 'Q' 키가 눌렸을 때 실행할 코드
    if (Phaser.Input.Keyboard.JustDown(this.qKey)) {
      console.log("'Q' 키가 눌렸습니다!");
      // 여기에 원하는 코드를 추가하세요.
      this.Player.moveTo(400, 300);
      // this.Player.moveToBlock(400, 300);
    }
  }

  handleCollision(player, obstacle) {
    // 충돌 시 실행할 코드
    console.log("플레이어와 장애물이 충돌했습니다!");
  }
}

export default GameScene;
