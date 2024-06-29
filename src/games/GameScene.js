import Phaser from "phaser";
import Player from "./character/Player.ts";
import Scroll from "./scroll/scrollEventHandler.ts";
import io from "socket.io-client";
import OPlayer from "./character/OPlayer.ts";

class GameScene extends Phaser.Scene {
  constructor() {
    super();

    this.uid = null;

    this.Map_Height = 800;
    this.Map_Width = 600;
    this.Tile_Height = 16;
    this.Tile_Width = 16;

    this.Player = new Player(this, 64, 64);
    this.scoll = new Scroll(this, this.Map_Width, this.Map_Height, this.Player);

    this.socket = io("ws://localhost:3001");
    this.OPlayer = {};

    this.socket.on("connect", function (data) {
      console.log(data);
    });

    this.socket.on("message", (data) => {
      // console.log(data);
      switch (data.type) {
        case "message":
          console.log(data.message);
          break;

        case "join":
          // 다른 유저들의 새로운 사람 처리
          console.log("New player connected: " + data.uid);

          // this.OPlayer = data.users;
          // console.log(data.users);
          // for (let i = 0; i < this.OPlayer.length; i++) {
          //   const userJson = this.OPlayer[i];
          //   console.log("New player connected: " + userJson.username);
          //   const newPlayer = new OPlayer(this, userJson.username, 64, 64);
          //   newPlayer.Create(userJson.x, userJson.y);
          // }
          this.OPlayer[data.uid] = new OPlayer(this, data.username, 64, 64);
          this.OPlayer[data.uid].Create(data.x, data.y);
          break;

        case "move":
          // 유저 움직임 처리
          console.log(this.uid);
          console.log(data);
          // const user_name = sessionStorage.getItem("username");
          // for (let i = 0; i < data.users.length; i++) {
          //   const user = data.users[i];
          //   if (user.uid !== this.uid) {
          //     for (let j = 0; j < this.OPlayer.length; j++) {
          //       if (this.OPlayer[j] === user.uid) {
          //         this.OPlayer[j].moveTo(user.x, user.y);
          //         break;
          //       }
          //     }
          //   }
          // }
          for (let i = 0; i < data.users.length; i++) {
            const user = data.users[i];
            if (user.uid !== this.uid && this.OPlayer[user.uid]) {
              this.OPlayer[user.uid].moveTo(user.x, user.y);
            }
          }
          break;

        case "leave":
          // 해당 유저 삭제 코드
          console.log("Player disconnected: " + data.uid);
          if (this.OPlayer[data.uid]) {
            this.OPlayer[data.uid].destroy(); // Assuming OPlayer has a destroy method
            delete this.OPlayer[data.uid];
          }
          break;

        case "syncUser":
          this.uid = data.uid;
          // User 렌더링 해줘야됨
          // this.OPlayer = data.users;
          // console.log(data.users);
          // for (let i = 0; i < this.OPlayer.length; i++) {
          //   const userJson = this.OPlayer[i];
          //   console.log("New player connected: " + userJson.username);
          //   const newPlayer = new OPlayer(this, userJson.username, 64, 64);
          //   newPlayer.Create(userJson.x, userJson.y);
          // }
          for (let i = 0; i < data.users.length; i++) {
            const userJson = data.users[i];
            if (!this.OPlayer[userJson.uid]) {
              console.log("New player connected:", userJson.username);
              this.OPlayer[userJson.uid] = new OPlayer(
                this,
                userJson.username,
                64,
                64
              );
              this.OPlayer[userJson.uid].Create(userJson.x, userJson.y);
            }
          }
          break;
      }
    });

    this.socket.on("disconnect", function () {
      console.log("Socket.IO disconnected.");
      this.socket.emit("leave", {
        username: sessionStorage.getItem("username"),
      });
      sessionStorage.removeItem("username");
    });

    // 웹 소켓 끊겼을 때 발생 이벤트
    this.socket.on("disconnecting", function () {
      console.log("Socket.IO disconnected.");
      this.socket.emit("leave", {
        username: sessionStorage.getItem("username"),
      });
      sessionStorage.removeItem("username");
    });

    this.socket.on("error", function (error) {
      console.log("Socket.IO Error: " + error);
    });
  }

  preload() {
    this.Player.Preload("player", "./reddude.png", "./meta/move.json");
    this.load.tilemapCSV("first_map", "./map/test/test.csv");
    this.load.image("tileset", "./gfx/Inner.png");

    this.load.image("obstacle", "./gfx/7.png");
  }

  create() {
    console.log("정보: ", this.socket, this.socket.connected);

    this.socket.emit("join", {
      username: sessionStorage.getItem("username"),
    });
    console.log("Join 실행");

    var map = this.make.tilemap({
      key: "first_map",
      tileWidth: 16,
      tileHeight: 16,
    });
    var tileset = map.addTilesetImage("tileset");
    var layer = map.createLayer(0, tileset, 0, 0);

    this.player = this.Player.Create(64, 64);
    this.cameras.main.startFollow(this.player); // 카메라가 플레이어를 따라다니도록 설정
    this.scoll.create(this, this.Map_Width, this.Map_Height);

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
    if (
      this.Player.oldPosition &&
      (this.player.x !== this.Player.oldPosition.x ||
        this.player.y !== this.Player.oldPosition.y)
    ) {
      const username = sessionStorage.getItem("username");

      const user = {
        uid: this.socket.id,
        username: username,
        x: this.player.x,
        y: this.player.y,
      };
      this.Player.oldPosition = { x: this.player.x, y: this.player.y };
      this.socket.emit("move", user);
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
