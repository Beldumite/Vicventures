// import * as Phaser from 'phaser';
// import { SCENE_KEYS } from './scene-keys';
// import { ASSET_KEYS } from '../common/assets';

// export class GameScene extends Phaser.Scene {
//   constructor() {
//     super({
//       key: SCENE_KEYS.GAME_SCENE,
//     });
//   }

//   public create(): void {
//     this.add
//       .text(this.scale.width / 2, this.scale.height / 2, 'Game Scene', { fontFamily: ASSET_KEYS.FONT_PRESS_START_2P })
//       .setOrigin(0.5);
//   }
// }


import * as Phaser from 'phaser';
import { SCENE_KEYS } from './scene-keys';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private keys!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key; };

  constructor() {
    super({ key: SCENE_KEYS.GAME_SCENE });
  }

  public preload(): void {
    this.load.spritesheet('victini', 'characters/Walk-Anim.png', {
      frameWidth: 24,
      frameHeight: 48,
    });
  }

  public create(): void {
    this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'victini');
    this.player.setCollideWorldBounds(true);

    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
    }) as any;

    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('victini', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('victini', { start: 24, end: 26 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('victini', { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('victini', { start: 16, end: 19 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  public update(): void {
    const speed = 150;
    this.player.setVelocity(0);

    if (this.keys.W.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play('walk-up', true);
    } else if (this.keys.S.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play('walk-down', true);
    } else if (this.keys.A.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play('walk-left', true);
    } else if (this.keys.D.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play('walk-right', true);
    } else {
      this.player.anims.stop();
    }
  }
}
