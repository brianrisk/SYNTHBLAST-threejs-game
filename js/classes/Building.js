import * as THREE from "../../lib/three.module.js";

class Building {

    constructor(x, y, height, scene) {
        let geometry = new THREE.BoxGeometry(1, 1, height);
        let material = new THREE.MeshBasicMaterial( { color: 0x000000} );
        // let wireframeMaterial = new THREE.LineBasicMaterial( { color: 0x000000} );
        let cube = new THREE.Mesh(geometry, material);
        // let wireFrame = new THREE.Mesh(geometry, wireframeMaterial)
        // cube.add(wireFrame);
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = height / 2;
        this.object = cube;
        this.height = height;
        this.desiredZ = cube.position.z;
        this.scene = scene;
        this.active = true;
        scene.add(cube);
    }

    hit() {
        this.height -= 1;
        this.desiredZ -= 1;
        if (this.height <= 0.001) {
            this.active = false;
        }
    }

    update() {
        // this.object.visible = this.isActive();
        // this.object.rotateZ(1 * 2 * Math.PI / 180)
        // this.object.rotateX(this.rotationSpeed * 2 * Math.PI / 180)
        if (this.object.position.z > this.desiredZ) {
            this.object.position.z -= 0.1;
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
