import { useEffect, useRef } from "react";
import Phaser from "phaser";
import GameScene from "./GameScene";


const config = {
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  scene: GameScene,
  backgroundColor: "#2d2d2d",
  parent: "canvas-parent",
  // canvas : canvasRef.current,
  pixelArt: true,
  physics: {
    default: "arcade",
    matter: {
      gravity: {
        x: 0,
        y: 100,
      },
      enableSleeping: true,
    },
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: true,
    },
  },
};
const GameApp = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    // Phaser.Game 인스턴스가 여러 번 생성되지 않도록 확인
    if (!window.game) {
      window.game = new Phaser.Game(config);
    }
    console.log('마운트');
    // 컴포넌트 언마운트 시 Phaser 게임 정리
    return () => {
      console.log('언마운트');
      if (window.game) {
        window.game.destroy(true);
        window.game = null;
      }
    };
  }, []);
  return (
      <div id="GameApp" className="flex">
        <div id="canvas-parent" className="flex main">
          <canvas ref={canvasRef}></canvas>
          <div></div>  
        </div>
        <div className="flex bottom"></div>        
      </div>
  );
};
export default GameApp;
