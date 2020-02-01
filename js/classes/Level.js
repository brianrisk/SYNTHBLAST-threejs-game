import * as THREE from "../../lib/three/build/three.module.js";
import * as Utils from "../../js/Utils.js";

// Three.js classes
import {EffectComposer} from '../../lib/three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from '../../lib/three/examples/jsm/postprocessing/RenderPass.js';
import {GlitchPass} from '../../js/CustomGlitchPass.js';

// my classes
import Hero from "../../js/classes/Hero.js";
import Building from "../../js/classes/Building.js";
import Gun from "../../js/classes/Gun.js";
import Enemy from "../../js/classes/Enemy.js";
// not importing so doesn't have to load
// import Drone from "../../js/classes/Drone.js";
import Comet from "./Comet.js";
import Coin from "../../js/classes/Coin.js";
import Game from "./Game.js";
import Pad from "./powerups/Pad.js";
import Shield from "./powerups/Shield.js";

class Level {
    constructor(game, rendererThree, sounds) {
        this.game = game;
        this.rendererThree = rendererThree;
        this.sounds = sounds;
        let arenaSize = 16 + 4 * (game.levelNumber - 1); // 20, 24, 28, etc.
        let scene = null;
        let camera = null;
        let composer = null;
        let glitchPass = null;
        let hero = null;
        let bullets = [];
        let buildings = [];
        let enemies = [];
        let drones = [];
        let pointPads = [];
        let flipPads = [];
        let shields = [];
        let comets = [];
        let gun = null;
        let padsRemaining = 0;
        let fogColors = [
            0xFF00FF,
            0x00FFFF,
            0xFF0000,
            0xFF0088,
            0x8800FF,
            0x0000FF,
            0x333333,
        ];

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(65, game.width / game.height, 0.1, 50);
        rendererThree.setSize(game.width, game.height);
        scene.background = new THREE.Color(0x000000);
        // scene.background = new THREE.Color(0xefd1b5);
        let fogColor = fogColors[(game.levelNumber - 1) % fogColors.length];
        scene.fog = new THREE.FogExp2(fogColor, 0.05);
        scene.color = 0x00DD00;



        composer = new EffectComposer(rendererThree);

        hero = new Hero(scene, camera, -75, 0);
        this.isZombie = (game.levelNumber % 7) === 0;
        // add buildings
        let halfArena = arenaSize / 2;

        // single point pad
        if (this.isZombie) {
            let padX = Utils.randomInt(arenaSize - 2) + 1;
            let padY = Utils.randomInt(arenaSize - 2) + 1 - halfArena;
            while (Math.abs(padY - halfArena) < 2) {
                padY = Utils.randomInt(arenaSize - 2) + 1 - halfArena;
            }
            let pointPad = new Pad(padX, padY, scene, 0xFFFF88);
            pointPads.push(pointPad);
            padsRemaining += 1;
            // surround pad with tall buildings
            buildings.push(new Building(padX - 1, padY, 15, scene, true));
            buildings.push(new Building(padX + 1, padY, 15, scene, true));
            buildings.push(new Building(padX, padY - 1, 15, scene, true));
            buildings.push(new Building(padX, padY + 1, 15, scene, true));
        }

        for (let gridX = 0; gridX < arenaSize; gridX++) {
            for (let gridY = 0; gridY < arenaSize; gridY++) {
                if (this.isZombie) {
                    if (Utils.randomInt(16) === 0) {
                        let enemy = new Enemy(gridX, gridY - halfArena, scene, 1, game.levelNumber);
                        enemies.push(enemy);
                    } else if (Utils.randomInt(640) === 0) {
                        let flipPad = new Pad(gridX, gridY - halfArena, scene, 0x88FF88);
                        flipPads.push(flipPad);
                    } else if (Utils.randomInt(100) === 0) {
                        let shield = new Shield(gridX, gridY - halfArena, scene);
                        shields.push(shield);
                    }
                } else {
                    if (gridY === halfArena) continue;
                    // if (gridY % 3 === 0 || gridX % 3 === 0) continue;
                    // if (!(gridY % 4 === 0 || gridY % 4 === 1 || gridX % 4 === 0 || gridX % 4 === 1)) {
                    if (Utils.randomInt(30) === 0) {
                        // box height increases with level
                        let boxHeight = Utils.randomInt(game.levelNumber) + 1;
                        let building = new Building(gridX, gridY - halfArena, boxHeight, scene, true);
                        buildings.push(building);
                    } else if (game.levelNumber > 1 && Utils.randomInt(64) === 0) {
                        let enemy = new Enemy(gridX, gridY - halfArena, scene, 1, game.levelNumber);
                        enemies.push(enemy);
                    } else if (Utils.randomInt(160) === 0) {
                        let pointPad = new Pad(gridX, gridY - halfArena, scene, 0xFFFF88);
                        pointPads.push(pointPad);
                        padsRemaining += 1;
                    } else if (game.levelNumber > 2 && Utils.randomInt(640) === 0) {
                        let flipPad = new Pad(gridX, gridY - halfArena, scene, 0x88FF88);
                        flipPads.push(flipPad);
                    } else if (Utils.randomInt(100) === 0) {
                        let shield = new Shield(gridX, gridY - halfArena, scene);
                        shields.push(shield);
                    }
                }
            }
        }

        // ensure there is at least one point pad
        if (padsRemaining === 0) {
            let pointPad = new Pad(arenaSize - 1, 0, scene, 0xFFFF88);
            pointPads.push(pointPad);
            padsRemaining += 1;
        }

        // drones
        // for (let i = 0; i < 1; i++) {
        //     let drone = new Drone( halfArena, 0, scene);
        //     drones.push(drone);
        // }

        // add fence around the buildings
        for (let gridX = -1; gridX <= arenaSize; gridX++) {
            for (let gridY = -1; gridY <= arenaSize; gridY++) {
                // leaving a gap
                if (gridY === halfArena && gridX === -1) continue;
                // only filling in edges
                if (gridX === -1 || gridY === -1 || gridX === arenaSize || gridY === arenaSize) {
                    let boxHeight = 0.25;
                    // if (gridY % 2 === 0 || gridX % 2 === 0) boxHeight = 2;
                    if (gridX !== arenaSize && (gridY === halfArena - 1 || gridY === halfArena + 1)) boxHeight = 20;
                    let building = new Building(gridX, gridY - arenaSize / 2, boxHeight, scene, false);
                    buildings.push(building);
                }
            }
        }

        // add random mountains
        for (let i = 0; i < 600; i++) {
            // put the mountains outside the zone
            // let coneX =  -1 * Utils.randomInt(70) - coneRadius;
            // let coneY = Utils.randomInt(100) - 50;
            let coneX = Utils.randomInt(200) - 100;
            let coneY = Utils.randomInt(200) - 100;
            let coneRadius = Utils.randomInt(10) + 2;
            let coneHeight = coneRadius * 1.5;
            if (
                // clearing a path
                (Math.abs(coneY) > 5) &&
                // nothing in the arena
                !(
                    (coneX > -1 - coneRadius && coneX < arenaSize + coneRadius) &&
                    (coneY > -1 - coneRadius || coneY < arenaSize + coneRadius)
                )
            ) {


                let geometry = new THREE.ConeGeometry(coneRadius, coneHeight, 4);
                let material = new THREE.LineBasicMaterial(
                    {
                        color: 0x000000,
                        opacity: 1,
                        fog: true
                    });
                let object = new THREE.Mesh(geometry, material);
                object.position.x = coneX;
                object.position.y = coneY;
                object.position.z = 0;
                object.rotation.x += Math.PI * .5;
                scene.add(object);
            }
        }

        // add comets
        for (let i = 0; i < 200; i++) {
            comets.push(new Comet(scene, Utils.randomInt(5) + 5));
        }

        gun = new Gun(scene, bullets, hero, this.sounds.pew);
        hero.setGun(gun);

        // floor
        let floorTexture = new THREE.TextureLoader().load('assets/img/floor-tile.png');
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(1000, 1000);
        let floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.FrontSide});
        let floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
        let plane = new THREE.Mesh(floorGeometry, floorMaterial);
        plane.position.z = 0;
        scene.add(plane);


        const cubeTextureLoader = new THREE.CubeTextureLoader();
        const skybox = cubeTextureLoader.load([
            'assets/img/night.gif',
            'assets/img/sunset.gif',
            'assets/img/night.gif',
            'assets/img/night.gif',
            'assets/img/night.gif',
            'assets/img/night.gif',
        ]);

        // skybox
        scene.background = skybox;

        // light
        let dirLight;
        dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(-2, 5, 3).normalize();
        scene.add(dirLight);

        // post processing
        let renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        glitchPass = new GlitchPass();
        composer.addPass(glitchPass);

        // adding objects
        this.scene = scene;
        this.camera = camera;
        this.composer = composer;
        this.glitchPass = glitchPass;
        this.hero = hero;
        this.bullets = bullets;
        this.buildings = buildings;
        this.enemies = enemies;
        this.drones = drones;
        this.pointPads = pointPads;
        this.flipPads = flipPads;
        this.shields = shields;
        this.coins = [];
        this.comets = comets;
        this.gun = gun;
        this.padsRemaining = padsRemaining;
        this.padsTotal = padsRemaining;
        this.hasStarted = false;
        this.inPlay = false;

        // "synth blast" title
        this.addTitleImage();
    }

    //https://codepen.io/duhaime/pen/jaYdLg
    addTitleImage() {
        let loader = new THREE.TextureLoader();
        let material = new THREE.MeshLambertMaterial({
            map: loader.load('assets/img/synthblast.png'),
            fog: false
        });
        // preserve ratio
        let geometry = new THREE.PlaneGeometry(5 * 358 / 32, 5);
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(-30, 0, 15);
        mesh.rotation.y = -Math.PI / 2;
        mesh.rotation.x = Math.PI / 2;
        this.scene.add(mesh);
    }

    render(fpsAdjustment) {
        // render a holding pattern before user input
        // while position x < 10 is outside of square and game began
        if (!this.inPlay && this.hasStarted) {
            let pushDirection = new THREE.Vector3(1, 0, 0);
            pushDirection.multiplyScalar(fpsAdjustment * 0.75);
            this.hero.push(pushDirection);
            if (this.hero.getX() >= 10) {
                this.inPlay = true;
            }
        }

        // update our objects
        this.bullets.forEach(bullet => bullet.update());
        this.buildings.forEach(building => building.update(fpsAdjustment));
        this.enemies.forEach(enemy => enemy.update(this.hero, fpsAdjustment));
        this.drones.forEach(drone => drone.update(this.hero, this.enemies, fpsAdjustment));
        this.pointPads.forEach(pad => pad.update(fpsAdjustment));
        this.flipPads.forEach(pad => pad.update(fpsAdjustment));
        this.shields.forEach(shield => shield.update(fpsAdjustment));
        this.coins.forEach(coin => coin.update(fpsAdjustment));
        this.comets.forEach(comet => comet.update(fpsAdjustment));
        this.hero.update(fpsAdjustment);

        // bullets hitting things
        this.bullets.forEach(bullet => {
            if (bullet.isActive()) {
                this.buildings.forEach(building => {
                    if (
                        building.isActive()
                        && Math.abs(building.getX() - bullet.getX()) < 0.5
                        && Math.abs(building.getY() - bullet.getY()) < 0.5
                    ) {
                        let buildingHitPoints = building.getHitPoints();
                        building.hit(bullet.getHitPoints());
                        bullet.hit(buildingHitPoints);
                        // this.sounds.impact.currentTime = 0;
                        // this.sounds.impact.play();

                    }
                });
                this.enemies.forEach(enemy => {

                    if (
                        enemy.isAlive()
                        && Math.abs(enemy.getX() - bullet.getX()) < 0.5
                        && Math.abs(enemy.getY() - bullet.getY()) < 0.5
                    ) {
                        let pointA = enemy.getPosition();
                        let pointB = this.hero.getPosition();
                        let pointC = pointB.clone();
                        pointC.add(this.hero.direction);
                        let angle = Utils.find_angle(pointA, pointB, pointC);
                        let heroIsFacingEnemy = (Math.abs(angle) < Math.PI / 8);
                        if (heroIsFacingEnemy) {
                            let enemyHitPoints = enemy.getHitPoints();
                            enemy.hit(bullet.getHitPoints(), fpsAdjustment);
                            bullet.hit(enemyHitPoints);
                            if (!enemy.isAlive()) {
                                this.sounds.explosion.currentTime = 0;
                                this.sounds.explosion.play();
                                this.coins.push(new Coin(enemy.getX(), enemy.getY(), this.scene))
                            } else {
                                this.sounds.impact.currentTime = 0;
                                this.sounds.impact.play();
                            }
                        }
                    }
                });

            }
        });

        // can't go through buildings
        this.buildings.forEach(building => {
            if (building.isActive()) {
                if (
                    Math.abs(building.getX() - this.hero.getX()) < 0.6
                    && Math.abs(building.getY() - this.hero.getY()) < 0.6
                ) {
                    // getting them out of the building
                    this.hero.unMove();
                }
                this.enemies.forEach(
                    enemy => {
                        if (
                            enemy.isAlive()
                            && Math.abs(enemy.getX() - building.getX()) < 0.6
                            && Math.abs(enemy.getY() - building.getY()) < 0.6
                        ) {
                            enemy.unMove();
                        }
                    });
            }
        });

        if (this.hero.isAlive() && this.inPlay) {
            let heroR = 0.4;
            if (this.hero.hasShield()) heroR = 1.5;
            this.enemies.forEach(
                enemy => {
                    if (
                        enemy.isAlive()
                        && Math.abs(enemy.getX() - this.hero.getX()) < heroR
                        && Math.abs(enemy.getY() - this.hero.getY()) < heroR
                    ) {

                        let heroHitPoints = this.hero.getHitPoints();
                        let damage = this.hero.hit(enemy.getHitPoints());
                        enemy.hit(heroHitPoints, fpsAdjustment);
                        // hero.reset();
                        if (damage > 0) {
                            this.glitchPass.trigger();
                        }
                        if (enemy.isAlive()) {
                            this.sounds.hit.currentTime = 0;
                            this.sounds.hit.play();
                        } else {
                            this.sounds.explosion.currentTime = 0;
                            this.sounds.explosion.play();
                        }
                    }
                });

            this.pointPads.forEach(pad => {
                if (
                    !pad.isUsed
                    && Math.abs(pad.getX() - this.hero.getX()) < 0.7
                    && Math.abs(pad.getY() - this.hero.getY()) < 0.7
                ) {
                    pad.hit();
                    this.padsRemaining -= 1;
                    this.sounds.point.currentTime = 0;
                    this.sounds.point.play();
                }
            });

            this.flipPads.forEach(flipPad => {
                if (
                    !flipPad.isUsed
                    && Math.abs(flipPad.getX() - this.hero.getX()) < 0.7
                    && Math.abs(flipPad.getY() - this.hero.getY()) < 0.7
                ) {
                    flipPad.hit();
                    this.hero.changePerspective();
                    this.sounds.flip.currentTime = 0;
                    this.sounds.flip.play();
                }
            });

            this.shields.forEach(shield => {
                // magnet
                if (
                    !shield.isUsed
                    && Math.abs(shield.getX() - this.hero.getX()) < 5
                    && Math.abs(shield.getY() - this.hero.getY()) < 5
                ) {
                    shield.moveTo(this.hero.getPosition(), fpsAdjustment);
                }
                // take
                if (
                    !shield.isUsed
                    && Math.abs(shield.getX() - this.hero.getX()) < 0.7
                    && Math.abs(shield.getY() - this.hero.getY()) < 0.7
                ) {
                    shield.hit();
                    this.hero.addShield();
                    this.sounds.shield.currentTime = 0;
                    this.sounds.shield.play();
                }

            });

            this.coins.forEach(coin => {
                // magnet
                if (
                    !coin.isTaken
                    && Math.abs(coin.getX() - this.hero.getX()) < 1
                    && Math.abs(coin.getY() - this.hero.getY()) < 1
                ) {
                    coin.moveTo(this.hero.getPosition(), fpsAdjustment);
                }

                // take coin
                if (
                    !coin.isTaken
                    && Math.abs(coin.getX() - this.hero.getX()) < 0.4
                    && Math.abs(coin.getY() - this.hero.getY()) < 0.4
                ) {
                    coin.isTaken = true;
                    this.game.score++;
                    this.sounds.energy.currentTime = 0;
                    this.sounds.energy.play();
                }
            });
        }

        this.composer.render();
    }

    hasWon() {
        return this.padsRemaining === 0;
    }

}

export default Level;