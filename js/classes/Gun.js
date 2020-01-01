import * as THREE from "../../lib/three/build/three.module.js";
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

        let heroPosition = this.hero.getPosition();
        let bulletPosition = new THREE.Vector3(heroPosition.x, heroPosition.y,  0.2);
        let direction = this.hero.direction.clone();
        let left = this.hero.direction.clone();
        left.applyAxisAngle(new THREE.Vector3(0,0,1), .1);
        let right = this.hero.direction.clone();
        right.applyAxisAngle(new THREE.Vector3(0,0,1), -.1);
        let fired = false;
        fired = this.shoot(bulletPosition, direction) || fired;
        fired = this.shoot(bulletPosition, left) || fired;
        fired = this.shoot(bulletPosition, right) || fired;
        if (fired) {
            this.lastFired = currentTime;
            if (soundOn) {
                this.pew.currentTime = 0;
                this.pew.play();
            }
        }
    }

    shoot(bulletPosition, direction) {
        let fired = false;
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
        return fired;
    }

}

export default Gun;