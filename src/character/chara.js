import Phaser from 'phaser';
import MouseWheelScrollerPlugin from 'phaser3-rex-plugins/plugins/mousewheelscroller-plugin';
class Character extends Phaser.Scene{
    constructor ()
    {
        super();
    }
      
    preload ()
    {
        this.load.atlas('player', './reddude.png', './move.json');
        this.load.atlas('background', './gfx/Overworld.png', './world.json'); // Load your tileset image and JSON

        this.load.image('map', 'https://labs.phaser.io/assets/tests/camera/earthbound-scarab.png');

        this.load.image('obstacle', './gfx/7.png');

    }
  
    create ()
    {   
      
        // main camera
        this.cameras.main.setBounds(0, 0, 1024, 2048);
        
        // 마우스 휠 이벤트 추가
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const cam = this.cameras.main;  
            const pointerWorldX = cam.scrollX + pointer.x / cam.zoom;
            const pointerWorldY = cam.scrollY + pointer.y / cam.zoom;

            // 줌 레벨 변경
            const newZoom = Phaser.Math.Clamp(cam.zoom - deltaY * 0.001, 0.5, 2); // 줌 레벨을 0.5에서 2 사이로 제한
            const smoothZoom = Phaser.Math.Linear(cam.zoom, newZoom, 0.1); // 부드럽게 줌 변경

            cam.setZoom(smoothZoom);
            cam.centerOn(pointerWorldX, pointerWorldY);
        });
        
        this.add.image(0, 0, 'map').setOrigin(0);

        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(0, 0);

        this.text = this.add.text(304, 230).setText('Click to move').setScrollFactor(0);
        this.text.setShadow(1, 1, '#000000', 2);


        // this.add.image(400, 300, 'background').setScale(2); // Adjust the scale to fit your canvas size
        // Create a static group for the tiles
        // const tiles = this.physics.add.staticGroup();
  
        // Add tiles from the tileset
        // for (let i = 0; i < 3000; i+=16) {
        //   for (let j = 0; j < 2400; j+=16) {
        //     tiles.create(i, j, 'background', 'tile_0');
        //   }
        // }
        // tiles.create(100, 100, 'background', 'tile_0');
        // tiles.create(120, 100, 'background', 'tile_1');
        // Add more tiles as needed...
  
        const playerWorkDConfig = {
          key: 'walk_down',
          frames: this.anims.generateFrameNames('player', {
            start: 0,
            end: 3,
            prefix: 'frame_0_',
          }),
          frameRate: 10,
          repeat: -1
        };
        const playerWorkLConfig = {
          key: 'walk_left',
          frames: this.anims.generateFrameNames('player', {
            start: 0,
            end: 3,
            prefix: 'frame_1_',
          }),
          frameRate: 10,
          repeat: -1
        };
        const playerWorkRConfig = {
          key: 'walk_right',
          frames: this.anims.generateFrameNames('player', {
            start: 0,
            end: 3,
            prefix: 'frame_2_',
          }),
          frameRate: 10,
          repeat: -1
        };
        const playerWorkUConfig = {
          key: 'walk_up',
          frames: this.anims.generateFrameNames('player', {
            start: 0,
            end: 3,
            prefix: 'frame_3_',
          }),
          frameRate: 10,
          repeat: -1
        };
  
        
        
        
        
        this.anims.create(playerWorkDConfig);
        this.anims.create(playerWorkLConfig);
        this.anims.create(playerWorkRConfig);
        this.anims.create(playerWorkUConfig);
        
        this.player = this.physics.add.sprite(64 , 64, 'player').play('walk_down');
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(64,64,true);
        
        // 장애물 생성
        this.obstacles = this.physics.add.group({
          key: 'obstacle',
          // repeat: 5,
          setScale : {x:0.1, y:0.1 },
          setXY: { x: 400, y: 300, stepX: 1 },
        });

        // this.obstacles.setCollideWorldBounds(true);

        // 장애물과 플레이어의 충돌 설정
        this.physics.add.collider(this.player, this.obstacles, this.handleCollision, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
    }
  
    update ()
    {
      const { left, right, up, down } = this.cursors;
  
      if (left.isDown) {
        this.player.setVelocityX(-160);
        this.player.setVelocityY(0);
        if (this.player.anims.currentAnim.key !== 'walk_left') {
          this.player.play('walk_left');
        }
      } else if (right.isDown) {
        this.player.setVelocityX(160);
        this.player.setVelocityY(0);
        if (this.player.anims.currentAnim.key !== 'walk_right') {
          this.player.play('walk_right');
        }
      } else if (up.isDown) {
        this.player.setVelocityY(-160);
        this.player.setVelocityX(0);
        if (this.player.anims.currentAnim.key !== 'walk_up') {
          this.player.play('walk_up');
        }
      } else if (down.isDown) {
        this.player.setVelocityY(160);
        this.player.setVelocityX(0);
        if (this.player.anims.currentAnim.key !== 'walk_down') {
          this.player.play('walk_down');
        }
      } else {
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        this.player.anims.pause();
      }
      

      // click to move 
      const cam = this.cameras.main;
      this.text.setText(['Click to move', 'x: ' + cam.scrollX, 'y: ' + cam.scrollY ]);

    }

    handleCollision(player, obstacle) {
      // 충돌 시 실행할 코드
      // obstacle.x= 400; 
      // obstacle.y= 300; 
      console.log('플레이어와 장애물이 충돌했습니다!');
    }

  }

export default Character;