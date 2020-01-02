import * as THREE from "../../lib/three/build/three.module.js";
import * as Utils from "../Utils.js";

class Particle {

    constructor(x, y, z, scene, fpsAdjustment) {
        let size = Math.random() * 0.4;
        size = Math.max(size, 0.05);
        // let geometry = new THREE.BoxGeometry(size, size, size);
        this.geometry = new THREE.ConeGeometry(size / 1.5, size, 3);
        this.material = new THREE.MeshBasicMaterial( { color: 0x00FFFF} );
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
        this.mesh.rotateX(Math.random());
        this.mesh.rotateY(Math.random());
        this.mesh.rotateZ(Math.random());
        this.velocity = Utils.randomVector();
        this.velocity.multiplyScalar(0.5 * fpsAdjustment);
        this.scene = scene;
        scene.add(this.mesh);
    }

    remove() {
        this.scene.remove(this.mesh);
        this.geometry.dispose();
        this.material.dispose();
    }

    update() {
        // this.object.visible = this.isActive();
        this.mesh.position.add(this.velocity);
    }


}

export default Particle;
