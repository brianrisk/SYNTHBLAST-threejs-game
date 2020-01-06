import * as THREE from "../../../lib/three/build/three.module.js";

class Pad {
    constructor(x, y, scene, color) {
        let geometry = new THREE.ConeGeometry(.6, 1, 6);
        // rotate
        let material = new THREE.LineBasicMaterial(
            {
                color: color,
                opacity: 1,
                fog: true
            });
        // let wireframeMaterial = new THREE.LineBasicMaterial( { color: 0x000000} );
        let object = new THREE.Mesh(geometry, material);
        object.position.x = x;
        object.position.y = y;
        object.position.z = -0.49;
        object.rotation.x += Math.PI * -.5;
        // cube.rotation.y += Math.PI;
        this.object = object;
        this.scene = scene;
        this.isUsed = false;
        scene.add(object);
    }

    update(fpsAdjustment) {
        // this.object.rotation.z += Math.PI / 90 * fpsAdjustment;
        if (this.isUsed && this.object.visible) {
            if (this.object.scale.x > 0.1) {
                this.object.scale.x = this.object.scale.x / (1.07 * fpsAdjustment);
                this.object.scale.z = this.object.scale.z / (1.07 * fpsAdjustment);
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

export default Pad;