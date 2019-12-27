import * as THREE from "./../lib/three.module.js";
import Bullet from "./Bullet.js";

class Gun {

    constructor(scene, bullets, hero, pew) {
        this.lastFired = 0;
        this.scene = scene;
        this.bullets = bullets;
        this.hero = hero;
        this.pew = pew;
    }

    fire(soundOn) {
        let currentTime = (new Date()).getTime();
        if (currentTime - this.lastFired < 100) return;
        let fired = false;
        let heroPosition = this.hero.getPosition();
        let bulletPosition = new THREE.Vector3(heroPosition.x, heroPosition.y,  0.2);
        let direction = this.hero.direction.clone();
        if (this.bullets.length < 50) {
            let bulletSize = 0.15;
            let bullet = new Bullet(
                bulletSize,
                bulletPosition,
                20,
                direction,
                this.scene);
            this.bullets.push(bullet);
            fired = true;
        }
        // see if we can find a dead bullet we can re-use
        else {
            for (let i = 0; i < this.bullets.length; i++) {
                if (!this.bullets[i].isActive()) {
                    this.bullets[i].reset(direction, bulletPosition);
                    fired = true;
                    break;
                }
            }
        }
        if (fired) {
            this.lastFired = currentTime;
            if (soundOn) {
                this.pew.currentTime = 0;
                this.pew.play();
            }
        }
    }

}

export default Gun;