import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import GameScene from "./GameScene";

const GameApp = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Phaser.Game 인스턴스가 여러 번 생성되지 않도록 확인
    if (!window.game) {
      const config = {
        type: Phaser.CANVAS,
        width: 1280,
        height: 960,
        scene: GameScene,
        backgroundColor: "#2d2d2d",
        parent: "gameMain",
        canvas: canvasRef.current,
        pixelArt: true,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0, x: 0 },
            debug: true,
            fps: 60,
          },
        },
      };
      window.game = new Phaser.Game(config);
    }

    // 컴포넌트 언마운트 시 Phaser 게임 정리
    return () => {
      if (window.game) {
        // window.game.destroy(true);
        // window.game = null;
      }
    };
  }, []);
  return <canvas ref={canvasRef} style={{ zIndex: 1 }}></canvas>;
};
export default GameApp;
