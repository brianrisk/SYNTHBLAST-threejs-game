import * as THREE from "../../../lib/three/build/three.module.js";

class Shield {
    constructor(x, y, scene) {
        let dotMaterial = new THREE.PointsMaterial({
            color: 0x333366,
            // color: 0xFFFFFF,
            // opacity: 0.1,
            size: 0.05,
            // fog: false
        });
        let sphereGeometry = new THREE.SphereGeometry(0.3, 25);
        let object = new THREE.Points(sphereGeometry, dotMaterial);
        object.position.x = x;
        object.position.y = y;
        object.position.z = .5;
        this.object = object;
        this.scene = scene;
        this.isUsed = false;
        scene.add(object);
    }

    update(fpsAdjustment) {
        // this.object.rotation.z += Math.PI / 90 * fpsAdjustment;
        if (!this.isUsed) {
            this.object.rotation.x += Math.PI / 180 * fpsAdjustment;
            this.object.rotation.y += Math.PI / 180 * fpsAdjustment;
        }
    }

    hit() {
        this.isUsed = true;
        this.object.visible = false;
    }

    getX() {
        return this.object.position.x;
    }

    getY() {
        return this.object.position.y;
    }
}

export default Shield;