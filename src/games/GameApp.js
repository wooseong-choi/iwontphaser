import { useEffect } from "react";
import Phaser from "phaser";
import GameScene from "./GameScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 608,
  scene: GameScene,
  backgroundColor: "#2d2d2d",
  parent: "phaser-example",
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
  }, []);
  return <></>;
};
export default GameApp;
