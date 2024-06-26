import Phaser from "phaser";
import MouseWheelScrollerPlugin from "phaser3-rex-plugins/plugins/mousewheelscroller-plugin";

class ScrollHandler {
  width: number;
  height: number;
  scene: globalThis.Phaser.Scene;

  constructor(scene: Phaser.Scene, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.scene = scene;
    /* width, height는 언젠가 카메라 모듈 만들어서 글로 뺄것 */
  }

  preload() {}

  create() {
    // 카메라 영역 설정 왜 반대로 넣어야 하는지 모르겠음
    this.scene.cameras.main.setBounds(0, 0, this.height, this.width, false);
    // 초기 카메라 위치
    this.scene.cameras.main.setZoom(1);
    this.scene.cameras.main.centerOn(0, 0);
    // 마우스 휠 이벤트 추가
    this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        const cam = this.scene.cameras.main;
        const oldZoom = cam.zoom;
        const pointerWorldX = cam.scrollX + pointer.x / oldZoom;
        const pointerWorldY = cam.scrollY + pointer.y / oldZoom;
        // 줌 레벨 변경
        const newZoom = Phaser.Math.Clamp(oldZoom - deltaY-deltaX * 0.001, 1, 2); // 줌 레벨을 0.5에서 2 사이로 제한
        if (newZoom === oldZoom) {
            return; // 줌 레벨이 변경되지 않았으면 종료
        }
        const smoothZoom = Phaser.Math.Linear(oldZoom, newZoom, 0.1); // 부드럽게 줌 변경
        // 줌이 변경된 후의 새로운 카메라 위치 계산
        const newScrollX = pointerWorldX + pointer.x / smoothZoom;
        const newScrollY = pointerWorldY + pointer.y / smoothZoom;
        cam.setZoom(smoothZoom);
        cam.centerOn(pointerWorldX, pointerWorldY);
    });
  }

  update() {}
}
export default ScrollHandler;
