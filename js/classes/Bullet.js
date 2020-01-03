import * as THREE from "../../lib/three/build/three.module.js";

class Bullet {
    constructor(bulletSize, bulletPosition, hitPoints, direction, scene, fpsAdjustment) {
        this.scene = scene;
        this.maxHitPoints = hitPoints;
        let geometry = new THREE.BoxGeometry(bulletSize, bulletSize, bulletSize);
        let material = new THREE.MeshBasicMaterial({color: 0xffffff});
        let bulletMesh = new THREE.Mesh(geometry, material);
        bulletMesh.position.x = bulletPosition.x;
        bulletMesh.position.y = bulletPosition.y;
        bulletMesh.position.z = bulletPosition.z;
        this.object = bulletMesh;
        this.scene.add(bulletMesh);
        this.resetWithDirection(direction, fpsAdjustment);
    }

    update() {
        this.object.position.add(this.velocity);
        let currentTime = (new Date()).getTime();
        if (currentTime - this.firedTime > 1000) {
            this.deactivate();
        }
    }

    deactivate() {
        this.active = false;
        this.object.visible = false;
    }

    activate() {
        this.active = true;
        this.object.visible = true;
    }

    hit(impact) {
        this.hitPoints -= impact;
        if (this.hitPoints <= 0) {
            this.deactivate();
        }
    }

    getHitPoints() {
        return Math.max(0, this.hitPoints);
    }

    getX() {
        return this.object.position.x;
    }

    getY() {
        return this.object.position.y;
    }

    isActive() {
        return this.active;
    }

    reset(direction, position, fpsAdjustment) {
        this.resetWithDirection(direction, fpsAdjustment);
        this.object.position.x = position.x;
        this.object.position.y = position.y;
    }

    resetWithDirection(direction, fpsAdjustment) {
        this.activate();
        this.velocity = direction.multiplyScalar(.4 * fpsAdjustment);
        this.firedTime = (new Date()).getTime();
        this.hitPoints = this.maxHitPoints;
    }
}

export default Bullet;