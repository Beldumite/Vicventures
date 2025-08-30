import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload() {
        this.load.image('plant', "assets/tiles/TX Plant.png")
        this.load.image('props', 'assets/tiles/TX Props.png');
        this.load.image('shadow', 'assets/tiles/TX Shadow Plant.png');
        this.load.image('struct', 'assets/tiles/TX Struct.png');
        this.load.image('grass', 'assets/tiles/TX Tileset Grass.png');
        this.load.image('stone', 'assets/tiles/TX Tileset Stone Ground.png');
        this.load.image('wall', 'assets/tiles/TX Tileset Wall.png');

        this.load.tilemapTiledJSON('room1', 'assets/map/room1.json')

        this.load.spritesheet('victini', 'assets/characters/Walk-Anim.png', {
            frameWidth: 24,
            frameHeight: 48
        });

        }


    create ()
    {
        this.map = this.make.tilemap({key: 'room1'})

        //adding tileset to map, the first var must be the same name u use in tiled
        const grassTiles = this.map.addTilesetImage('TX Tileset Grass', 'grass')
        const stoneTiles = this.map.addTilesetImage('TX Tileset Stone Ground', 'stone')
        const plantTiles = this.map.addTilesetImage('TX Plant', 'plant');
        const propsTiles = this.map.addTilesetImage('TX Props', 'props');
        const wallTiles = this.map.addTilesetImage('TX Tileset Wall', 'wall');

        //create layer with all tilesets
        this.groundLayer = this.map.createLayer('Tile Layer 1', grassTiles, 0, 0) 
        this.wallLayer = this.map.createLayer('Tile Layer 2', wallTiles, 0,0)

        //create platerSprite
        this.player = this.physics.add.sprite(300, 200, 'victini', 0)

        this.createPlayerAnimation()
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(20, 20);
        
        this.cursors = this.input.keyboard.createCursorKeys()
        this.wasd = this.input.keyboard.addKeys('W,A,S,D') 

        this.playerSpeed = 100

    }  

    createPlayerAnimation() {
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('victini', {start: 0, end: 3}),
            frameRate: 8,
            repeat: -1
        })

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('victini', { start: 16, end: 19 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('victini', { start: 24, end: 26 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('victini', { start: 8, end: 11 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'idle-down',
            frames: [{ key: 'victini', frame: 1 }],
            frameRate: 1
        });
    }

    update() {
        // Handle player movement
        let moving = false;
        
        // Reset velocity
        this.player.setVelocity(0);
        
        // Check for input and move player
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.play('walk-left', true);
            moving = true;
        }
        else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.play('walk-right', true);
            moving = true;
        }
        
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
            this.player.play('walk-up', true);
            moving = true;
        }
        else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.player.setVelocityY(this.playerSpeed);
            this.player.play('walk-down', true);
            moving = true;
        }
        
        // If not moving, play idle animation
        if (!moving) {
            this.player.play('idle-down', true);
        }
    }
}
