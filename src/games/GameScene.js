import Phaser from "phaser";
import Player from "./character/Player.ts";
import Scroll from "./scroll/scrollEventHandler.ts";
import io from "socket.io-client";
import OPlayer from "./character/OPlayer.ts";

const CHARACTER_WIDTH = 32;
const CHARACTER_HEIGHT = 32;

class GameScene extends Phaser.Scene {
  constructor() {
    super();
    this.uid = null;

    this.Player = new Player(this, CHARACTER_WIDTH, CHARACTER_HEIGHT);
    this.scoll = new Scroll(this, this.Map_Width, this.Map_Height, this.Player);

    this.socket = io("ws://192.168.0.96:3001", {
      extraHeaders: {
        Authorization: "Bearer " + sessionStorage.getItem("user"),
      }
    });
    this.OPlayer = {};
    this.temp_OPlayer = {};

    this.x = 32;
    this.y = 32;

    this.socket.on("connect", function (data) {
      console.log(data);
    });

    this.socket.on("message", (data) => {
      // console.log(data);

      switch (data.type) {
        // 채팅 메시지 처리
        case "message":
          console.log(data.message);
          break;

        // 다른 유저들의 새로운 사람 처리
        case "join":
          console.log("New player connected: " + data);

          if (this.OPlayer[data.uid] !== undefined) {
            if (this.OPlayer[data.uid].clientid !== data.clientid) {
              this.OPlayer[data.uid].Destroy();
              this.OPlayer[data.uid] = new OPlayer(
                this,
                data.username,
                CHARACTER_WIDTH,
                CHARACTER_HEIGHT,
                data.clientid
              );
              this.OPlayer[data.uid].Create(data.x, data.y);
            } else {
              this.OPlayer[data.uid].clientid = data.clientid;
              this.OPlayer[data.uid].x = data.x;
              this.OPlayer[data.uid].y = data.y;
            }
          } else {
            this.OPlayer[data.uid] = new OPlayer(
              this,
              data.username,
              CHARACTER_WIDTH,
              CHARACTER_HEIGHT,
              data.clientid
            );
            this.OPlayer[data.uid].Create(data.x, data.y);
          }

          // const newPlayer = new OPlayer(this, data.username, 32, 32);
          // newPlayer.Create(32, 32);
          // this.OPlayer.push({  uid: data.uid, username: data.username, x: 32, y: 32  });
          //           const users = data.users;
          //           console.log(data.users);
          //           for (let i = 0; i < users.length; i++) {
          //             const userJson = users[i];
          //             console.log("New player connected: " + userJson.username);
          //             if(userJson.clientid === this.socket.id || userJson.uid === this.uid){
          //               if(this.uid === undefined){
          //                 this.uid = userJson.uid;
          //               }
          //               continue;
          //             }

          //             const newPlayer = new OPlayer(this, userJson.username, 32, 32, userJson.uid);
          //             newPlayer.Create(userJson.x, userJson.y);
          //             this.OPlayer.push(newPlayer);
          //           }

          break;

        // 유저 움직임 처리
        case "move":
          console.log(data);
          const user = data.user;

          // if (this.OPlayer[user.uid]) {
          //   const otherPlayer = this.OPlayer[user.uid];
          //   otherPlayer.moveTo(user.x, user.y, user.direction).then(() => {
          //     otherPlayer.setMoving(false);
          //     console.log(`Player ${user.uid} has arrived at the destination.`);
          //   });
          // }

          // 움직인 유저 정보만 받아와서 갱신해주기
          if (this.OPlayer[user.uid]) {
            const otherPlayer = this.OPlayer[user.uid];
            if (otherPlayer.x !== user.x || otherPlayer.y !== user.y) {
              otherPlayer.moveTo(user.x, user.y, user.direction);
              otherPlayer.setMoving(true);
            } else {
              otherPlayer.setMoving(false);
            }
          }
          break;

        // 해당 유저 삭제
        case "leave":
          console.log("Player disconnected: " + data.uid);
          if (this.OPlayer[data.uid]) {
            this.OPlayer[data.uid].Destroy();
            delete this.OPlayer[data.uid];
          }
          if (this.OPlayer[data.uid]) {
            this.OPlayer[data.uid].Destroy();
            delete this.OPlayer[data.uid];
          }
          break;

        // 유저 동기화
        case "syncUser":
          this.uid = data.uid;
          for (let i = 0; i < data.users.length; i++) {
            const userJson = data.users[i];
            if (!this.OPlayer[userJson.uid]) {
              this.OPlayer[userJson.uid] = new OPlayer(
                this,
                userJson.username,
                CHARACTER_WIDTH,
                CHARACTER_HEIGHT
              );
              this.temp_OPlayer[userJson.uid] = userJson;
            } else {
              // 자기 자신인 경우
              this.x = userJson.x;
              this.y = userJson.y;
              this.player.x = userJson.x;
              this.player.y = userJson.y;
            }
          }
          break;

        // 기타 이벤트 처리
        default:
          console.log("Error!: No msg event on Socket.");
          break;
      }
    });

    // 웹 소켓 끊겼을 때 발생 이벤트
    this.socket.on("disconnecting", function () {
      console.log("Socket.IO disconnected.");
      this.socket.emit("leave", {
        username: sessionStorage.getItem("username"),
      });
      sessionStorage.removeItem("username");
    });

    this.socket.on("disconnect", function () {
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

  /**
   * 게임 시작 전에 필요한 리소스를 미리 로드합니다.
   */
  preload() {
    this.Player.Preload("player", "./reddude.png", "./meta/move.json");
    this.load.tilemapTiledJSON("map", "./map/map.json");
    this.load.image("Classroom_A2", "./gfx/Classroom_A2.png");
    this.load.image("Classroom_B", "./gfx/Classroom_B.png");
    this.load.image("classroom_asset1", "./gfx/classroom_asset1.png");
    this.load.image("Inner", "./gfx/Inner.png");
  }

  /**
   * 게임이 시작될 때 실행되는 함수입니다.
   * 게임에 필요한 객체들을 생성하고 초기화합니다.
   */
  create() {
    // 서버에 입장 메시지 전송
    this.socket.emit("join", {
      username: sessionStorage.getItem("username"),
    });

    // 맵 생성
    var map = this.make.tilemap({ key: "map" });
    var tilesClassroomA2 = map.addTilesetImage("Classroom_A2", "Classroom_A2");
    var tilesClassroomB = map.addTilesetImage("Classroom_B", "Classroom_B");
    var tilesclassroom_asset1 = map.addTilesetImage(
      "classroom_asset1",
      "classroom_asset1"
    );
    var Inner = map.addTilesetImage("Inner", "Inner");

    // 레이어 생성
    var metaLayer = map.createLayer(
      "Meta",
      [tilesClassroomA2, tilesClassroomB, tilesclassroom_asset1, Inner],
      0,
      0
    );
    var tileLayer1 = map.createLayer(
      "Tile Layer 1",
      [tilesClassroomA2, tilesClassroomB, tilesclassroom_asset1, Inner],
      0,
      0
    );
    var areaLayer1 = map.createLayer(
      "Area Layer 1",
      [tilesClassroomA2, tilesClassroomB, tilesclassroom_asset1, Inner],
      0,
      0
    );
    var objectLayer1 = map.createLayer(
      "Object Layer 1",
      [tilesClassroomA2, tilesClassroomB, tilesclassroom_asset1, Inner],
      0,
      0
    );

    // 플레이어 생성
    this.player = this.Player.Create(this.x, this.y);
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5); // 카메라가 플레이어를 따라다니도록 설정
    this.scoll.create(this, this.Map_Width, this.Map_Height);

    // 충돌 레이어, 플레이어와 충돌 설정
    metaLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, metaLayer);

    // 다른 플레이어들 생성
    for (let key in this.temp_OPlayer) {
      const user = this.temp_OPlayer[key];
      this.OPlayer[key].Create(user.x, user.y);
    }
    // 메모리 해제
    // delete this.temp_OPlayer;

    // 장애물 생성
    // this.obstacles = this.physics.add.group({
    //   key: "obstacle",
    //   // repeat: 5,
    //   setScale: { x: 0.1, y: 0.1 },
    //   setXY: { x: 400, y: 300, stepX: 1 },
    // });

    // this.obstacles.setCollideWorldBounds(true);

    // 장애물과 플레이어의 충돌 설정
    this.physics.add.collider(
      this.Player,
      this.obstacles,
      this.handleCollision,
      null,
      this
    );

    // 재시작 키 설정
    this.input.keyboard.on("keydown", (event) => {
      if (event.key === "r") {
        this.scene.restart();
      }
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      const cam = this.cameras.main;
      const oldZoom = cam.zoom;

      // 플레이어 위치를 기준으로 계산
      const playerX = this.player.x;
      const playerY = this.player.y;

      // 줌 레벨 변경
      const newZoom = Phaser.Math.Clamp(oldZoom - deltaY * 0.001, 1, 2);
      if (newZoom === oldZoom) {
        return;
      }

      // 카메라 팔로우 일시 중지
      cam.stopFollow();

      // 줌 적용
      cam.setZoom(newZoom);

      // 플레이어 중심으로 카메라 이동
      cam.centerOn(playerX, playerY);

      // 일정 시간 후 카메라 팔로우 재개
      this.time.delayedCall(500, () => {
        cam.startFollow(this.player, true, 0.05, 0.05);
      });
    });
  }

  /**
   * 게임이 실행되는 동안 계속 호출되는 함수입니다.
   * 게임의 주된 로직이 여기에 들어갑니다.
   * 이 함수는 1초에 60번 호출됩니다.
   * @param {number} time 현재 시간
   * @param {number} delta 이전 프레임에서 현재 프레임까지의 시간 간격
   */
  update(time, delta) {
    // 플레이어 이동
    this.Player.Move(this.cursors);

    if (!this.lastPositionUpdateTime) {
      this.lastPositionUpdateTime = time;
    }

    // if (time > this.lastPositionUpdateTime + 500) {
    //   const username = sessionStorage.getItem("username");

    //   const user = {
    //     uid: this.socket.id,
    //     username: username,
    //     x: this.player.x,
    //     y: this.player.y,
    //     direction: this.Player.direction,
    //   };
    //   this.Player.oldPosition = { x: this.player.x, y: this.player.y };
    //   this.socket.emit("move", user);

    //   this.lastPositionUpdateTime = time;
    // }

    // 플레이어가 이동했을 때만 서버에 위치 전송
    if (
      this.Player.oldPosition &&
      (this.player.x !== this.Player.oldPosition.x ||
        this.player.y !== this.Player.oldPosition.y)
    ) {
      const username = sessionStorage.getItem("username");

      const user = {
        uid: username,
        clientid: this.socket.id,
        username: username,
        x: this.player.x,
        y: this.player.y,
        direction: this.Player.direction,
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

    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      console.log("Space key is pressed!");
      window.dispatchEvent(
        new CustomEvent("start-video", {
          detail: {
            uid: this.uid,
            unsername: this.username,
          },
        })
      );
    }
  }

  handleCollision(player, obstacle) {
    // 충돌 시 실행할 코드
    console.log("플레이어와 장애물이 충돌했습니다!");
  }
}

export default GameScene;
