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
    this.socket = io('ws://localhost:3001');

    this.socket.on('connect', function() {
      console.log('Socket.IO connected.');
    });  

    this.socket.on('message', (data)=> {
      // console.log('Received: ' + data);
      if(data.type === "move"){
        for(let i = 0; i < data.users.length; i++){
          this.Player.moveToBlock(data.users[i].x, data.users[i].y);
        }
      }
    }); 

    this.socket.on('disconnect', function() {
      console.log('Socket.IO disconnected.');
    });
  
    this.socket.on('error', function(error) {
      console.log('Socket.IO Error: ' + error);
    });
  }

  preload() {
    this.Player.Preload("player", "./reddude.png", "./meta/move.json");
    this.load.atlas("background", "./gfx/Overworld.png", "./world.json"); // Load your tileset image and JSON
    this.load.image("obstacle", "./gfx/7.png");

    // 맵인데 이것도 나중에 바꿀거
    this.load.image(
      "map",
      "https://labs.phaser.io/assets/tests/camera/earthbound-scarab.png"
    );
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

    // this.add.image(0, 0, 'map').setOrigin(0);

    this.player = this.Player.Create(64, 64);
    this.scoll.create(this, 1024, 2048);

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
    this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

  }

  update() {
    this.Player.Move(this.cursors);
    if(this.Player.oldPosition && (this.Player.x !== this.Player.oldPosition.x || this.Player.y !== this.Player.oldPosition.y) ){
      this.socket.emit('move', { x: this.Player.x, y: this.Player.y });
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
    // obstacle.x= 400;
    // obstacle.y= 300;
    console.log("플레이어와 장애물이 충돌했습니다!");
  }
}

export default GameScene;
