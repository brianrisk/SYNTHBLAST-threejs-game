import * as THREE from "../../lib/three/build/three.module.js";

class Building {

    constructor(x, y, height, scene, damageable) {
        let geometry = new THREE.BoxBufferGeometry(1, 1, height);
        let material = new THREE.MeshPhongMaterial(
            {
                color: 0x000000,
                opacity: 1.0
            });
        if (!damageable) {
            material = new THREE.MeshBasicMaterial( { color: 0xDDDDDD} );
        }
        // let wireframeMaterial = new THREE.LineBasicMaterial( { color: 0x000000} );
        let cube = new THREE.Mesh(geometry, material);
        // let wireFrame = new THREE.Mesh(geometry, wireframeMaterial)
        // cube.add(wireFrame);
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = height / 2;
        this.object = cube;
        this.height = height;
        this.hitPoints = height;
        if (!damageable) this.hitPoints = 100;
        this.desiredZ = cube.position.z;
        this.scene = scene;
        this.active = true;
        this.damageable = damageable;
        scene.add(cube);
    }

    hit(impact) {
        if (this.damageable) {
            this.height -= impact;
            this.hitPoints -= impact;
            this.desiredZ -= impact;
            if (this.height <= 0.001) {
                this.active = false;
            }
        }
    }

    getHitPoints() {
        return Math.max(0, this.hitPoints);
    }

    update(fpsAdjustment) {
        // this.object.visible = this.isActive();
        // this.object.rotateZ(1 * 2 * Math.PI / 180)
        // this.object.rotateX(this.rotationSpeed * 2 * Math.PI / 180)
        if (this.object.position.z > this.desiredZ) {
            this.object.position.z -= 0.1 * fpsAdjustment;
        }
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
}

export default Building;
