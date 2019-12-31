import * as THREE from "../../lib/three.module.js";
import * as Utils from "../Utils.js";

class Particle {

    constructor(x, y, z, scene) {
        let size = Math.random() * 0.4;
        size = Math.max(size, 0.05);
        // let geometry = new THREE.BoxGeometry(size, size, size);
        let geometry = new THREE.ConeGeometry(size / 2, size, 3);
        let material = new THREE.MeshBasicMaterial( { color: 0x00FFFF} );
        let cube = new THREE.Mesh(geometry, material);
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        cube.rotateX(Math.random());
        cube.rotateY(Math.random());
        cube.rotateZ(Math.random());
        this.object = cube;
        this.velocity = Utils.randomVector();
        this.velocity.multiplyScalar(0.5);
        this.scene = scene;
        scene.add(cube);
    }

    remove() {
        this.scene.remove(this.object);
    }

    update() {
        // this.object.visible = this.isActive();
        this.object.position.add(this.velocity);
    }


}

export default Particle;
