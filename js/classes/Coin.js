import * as THREE from "../../lib/three/build/three.module.js";

class Coin {
    constructor(x, y, scene) {
        this.scene = scene;
        let size = 0.3;
        let geometry = new THREE.BoxBufferGeometry(size, size, size);
        let material = new THREE.MeshBasicMaterial(
            {
                color: 0xEEEEFF
            });
        let cube = new THREE.Mesh(geometry, material);
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = 0.5;
        scene.add(cube);
        this.object = cube;
        this.isTaken = false;
        this.isAlive = true;
    }

    getX() {
        return this.object.position.x;
    }

    getY() {
        return this.object.position.y;
    }

    getZ() {
        return this.object.position.z;
    }

    update() {
        if (this.isAlive && this.isTaken) {
            this.object.visible = false;
            this.isAlive = false;
        } else {
            this.object.rotation.x += Math.PI / 45;
            this.object.rotation.y += Math.PI / 45;
            this.object.rotation.z += Math.PI / 45;
        }
    }
}

export default Coin;