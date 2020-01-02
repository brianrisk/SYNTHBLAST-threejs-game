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
        scene.add(cube);
    }

    update(fpsAdjustment) {
        // this.object.rotation.z += Math.PI / 90 * fpsAdjustment;
    }
}

export default Flipper;