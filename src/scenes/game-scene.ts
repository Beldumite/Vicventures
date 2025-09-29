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
  private map!: Phaser.Tilemaps.Tilemap;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private wallLayer!: Phaser.Tilemaps.TilemapLayer;
  private isAttacking!: boolean;
  private lastDirection!: string;
  constructor() {
    super({ key: SCENE_KEYS.GAME_SCENE });
  }

  public preload(): void {
    this.load.image('plant', 'tiles/TX Plant.png')
    this.load.image('props', 'tiles/TX Props.png');
    this.load.image('shadow', 'tiles/TX Shadow Plant.png');
    this.load.image('struct', 'tiles/TX Struct.png');
    this.load.image('grass', 'tiles/TX Tileset Grass.png');
    this.load.image('stone', 'tiles/TX Tileset Stone Ground.png');
    this.load.image('wall', 'tiles/TX Tileset Wall.png');

    this.load.tilemapTiledJSON('room1', 'map/room1.json')
    this.load.spritesheet('victini', 'characters/Walk-Anim.png', {
      frameWidth: 24,
      frameHeight: 48,
    });
    this.load.spritesheet('attacking', 'characters/Attack-Anim.png', {
      frameWidth: 72,
      frameHeight: 88
    })
  }


  public create(): void {

    this.map = this.make.tilemap({key: 'room1'})

    //adding tileset to map, the first var must be the same name u use in tiled
    const grassTiles = this.map.addTilesetImage('TX Tileset Grass', 'grass');
    const stoneTiles = this.map.addTilesetImage('TX Tileset Stone Ground', 'stone')
    const plantTiles = this.map.addTilesetImage('TX Plant', 'plant');
    const propsTiles = this.map.addTilesetImage('TX Props', 'props');
    const wallTiles = this.map.addTilesetImage('TX Tileset Wall', 'wall');

    //create layer with all tilesets
    this.groundLayer = this.map.createLayer('Tile Layer 2', [grassTiles, stoneTiles, plantTiles, propsTiles], 0, 0) 
    this.wallLayer = this.map.createLayer('Tile Layer 3', [wallTiles, propsTiles], 0,0)
    this.wallLayer.setCollisionByExclusion([-1]);

    this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'victini');
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.wallLayer);
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    
    // Make camera follow the player
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    // Optional: Add some smoothing to camera movement
    this.cameras.main.setLerp(0.1, 0.1);

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
      // Attack animations (adjust frame numbers as needed)
      this.anims.create({
        key: 'attack-down',
        frames: this.anims.generateFrameNumbers('attacking', { start: 0, end: 9 }),
        frameRate: 12,
        repeat: 0,
      });
      this.anims.create({
        key: 'attack-right',
        frames: this.anims.generateFrameNumbers('attacking', { start: 21, end: 29 }),
        frameRate: 12,
        repeat: 0,
      });
      this.anims.create({
        key: 'attack-up',
        frames: this.anims.generateFrameNumbers('attacking', { start: 41, end: 49 }),
        frameRate: 12,
        repeat: 0,
      });
      this.anims.create({
        key: 'attack-left',
        frames: this.anims.generateFrameNumbers('attacking', { start: 61, end: 69 }),
        frameRate: 12,
        repeat: 0,
      });

      this.isAttacking = false;
      this.lastDirection = 'down'; // Track last facing direction
      
      // Improved attack handler
      this.input.keyboard.on('keydown-SPACE', () => {
          if (this.isAttacking) return; // Prevent attack spam
          
          this.isAttacking = true;
          const attackAnim = `attack-${this.lastDirection}`;
          this.player.anims.play(attackAnim, true);
          this.player.setVelocity(0);
          
          // Reset attacking flag when animation completes
          this.player.once('animationcomplete', () => {
              this.isAttacking = false;
          });
      });
}

public update(): void {
    const speed = 150;
    
    // Don't process movement if attacking
    if (this.isAttacking) {
        this.player.setVelocity(0);
        return;
    }
    
    this.player.setVelocity(0);

    if (this.keys.W.isDown) {
        this.player.setVelocityY(-speed);
        this.player.anims.play('walk-up', true);
        this.lastDirection = 'up';
    } else if (this.keys.S.isDown) {
        this.player.setVelocityY(speed);
        this.player.anims.play('walk-down', true);
        this.lastDirection = 'down';
    } else if (this.keys.A.isDown) {
        this.player.setVelocityX(-speed);
        this.player.anims.play('walk-left', true);
        this.lastDirection = 'left';
    } else if (this.keys.D.isDown) {
        this.player.setVelocityX(speed);
        this.player.anims.play('walk-right', true);
        this.lastDirection = 'right';
    } else {
        this.player.anims.stop();
    }
}
}