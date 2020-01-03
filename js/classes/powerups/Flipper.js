import * as THREE from "../../../lib/three/build/three.module.js";

class Flipper {
    constructor(x, y, scene) {
        let height = 0.0;
        let geometry = new THREE.ConeGeometry(.6, 1, 6);
        // rotate
        let material = new THREE.LineBasicMaterial(
            {
                color: 0xFFFF88,
                opacity: 1,
                fog: true
            });
        // let wireframeMaterial = new THREE.LineBasicMaterial( { color: 0x000000} );
        let cube = new THREE.Mesh(geometry, material);
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = -0.49;
        cube.rotation.x += Math.PI * -.5;
        // cube.rotation.y += Math.PI;
        this.object = cube;
        this.scene = scene;
        this.isUsed = false;
        scene.add(cube);
    }

    update(fpsAdjustment) {
        // this.object.rotation.z += Math.PI / 90 * fpsAdjustment;
        if (this.isUsed && this.object.visible) {
            if (this.object.scale.x > 0.1) {
                this.object.scale.x = this.object.scale.x / (1.05 * fpsAdjustment);
                this.object.scale.z = this.object.scale.z / (1.05 * fpsAdjustment);
            } else {
                this.object.visible = false;
            }
        }
    }

    hit() {
        this.isUsed = true;
    }

    getX() {
        return this.object.position.x;
    }

    getY() {
        return this.object.position.y;
    }
}

export default Flipper;