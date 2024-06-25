import { useEffect } from 'react';
import './App.css';
import Phaser from 'phaser';
import Character from './character/chara'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: Character,
  backgroundColor: '#2d2d2d',
  parent: 'phaser-example',
  pixelArt: true,
  physics: {
      default: 'arcade',
      matter:{
        gravity:{
          x:0,
          y:100
        },
        enableSleeping: true
      },
      arcade: {
          gravity: { y: 0, x:0 }
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