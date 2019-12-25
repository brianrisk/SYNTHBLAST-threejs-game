import * as THREE from "./../lib/three.module.js";
import Bullet from "./Bullet.js";

class Gun {

    constructor(scene, bullets, camera, pew) {
        this.lastFired = 0;
        this.scene = scene;
        this.bullets = bullets;
        this.camera = camera;
        this.pew = pew;
    }

    fire(soundOn) {
        let currentTime = (new Date()).getTime();
        if (currentTime - this.lastFired < 100) return;
        let fired = false;
        if (this.bullets.length < 50) {
            let direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            let geometry = new THREE.BoxGeometry(.1, .1, .1);
            let material = new THREE.MeshBasicMaterial({color: 0xffffff});
            let bulletMesh = new THREE.Mesh(geometry, material);
            bulletMesh.position.x = this.camera.position.x;
            bulletMesh.position.y = this.camera.position.y;
            bulletMesh.position.z = this.camera.position.z - .2;
            this.scene.add(bulletMesh);
            let bullet = new Bullet(bulletMesh, direction);
            this.bullets.push(bullet);
            fired = true;
        }
        // see if we can find a dead bullet we can re-use
        else {
            for (let i = 0; i < this.bullets.length; i++) {
                if (!this.bullets[i].isActive()) {
                    let direction = new THREE.Vector3();
                    this.camera.getWorldDirection(direction);
                    this.bullets[i].reset(direction, this.camera.position.clone());
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