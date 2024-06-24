import { useEffect } from 'react';
import './App.css';
import Phaser from 'phaser';
import { standardPixelShader } from '@babylonjs/core/Shaders/standard.fragment';

class Example extends Phaser.Scene{
  constructor ()
  {
      super();
  }

  preload ()
  {
      this.load.atlas('walker', 'https://labs.phaser.io/assets/animations/walker.png', 'https://labs.phaser.io/assets/animations/walker.json');
      this.load.image('sky', 'https://labs.phaser.io/assets/skies/ms3-sky.png');
      this.load.image('trees', 'https://labs.phaser.io/assets/skies/ms3-trees.png');
  }

  create ()
  {
      const bg = this.bg = this.add.tileSprite(0, 38, 800, 296, 'sky').setOrigin(0, 0);
      const tress = this.trees = this.add.tileSprite(0, 280, 800, 320, 'trees').setOrigin(0, 0);

      const animConfig = {
          key: 'walk',
          frames: 'walker',
          frameRate: 60,
          repeat: -1
      };

      this.anims.create(animConfig);

      const sprite = this.add.sprite(400, 484, 'walker', 'frame_0000');
      sprite.active = false;

        
      this.input.enabled = true;

      this.input.keyboard.on('keydown-' + 'LEFT', function (event) { /* ... */
          sprite.flipX = false;
          if(!sprite.anims.isPlaying){
            sprite.play('walk');
          }
          bg.tilePositionX -= 2;
          tress.tilePositionX -= 6;
          sprite.active = true;
      });
      this.input.keyboard.on('keydown-' + 'RIGHT', function (event) { /* ... */
          // sprite.active = false;
          sprite.flipX = true;
          // sprite.flipY = true;
          if(!sprite.anims.isPlaying){
            sprite.play('walk');
          }
          bg.tilePositionX += 2;
          tress.tilePositionX += 6;
          sprite.active = true;
      });
      this.input.keyboard.on('keyup-' + 'RIGHT', function (event) { /* ... */
          sprite.anims.pause();
      });
      this.input.keyboard.on('keyup-' + 'LEFT', function (event) { /* ... */  
          sprite.anims.pause();
      });
    


  }

  update ()
  {
    

  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: Example,
  backgroundColor: '#2d2d2d',
  parent: 'phaser-example',
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 200 }
      }
  }
};

const App = () => {
  useEffect(() => {
    // Phaser.Game 인스턴스가 여러 번 생성되지 않도록 확인
    if (!window.game) {
      window.game = new Phaser.Game(config);
    }

    // 컴포넌트 언마운트 시 Phaser 게임 정리
    return () => {
      if (window.game) {
        window.game.destroy(true);
        window.game = null;
      }
    };

  },[]);
  return (<></>);
};
export default App;