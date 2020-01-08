import * as THREE from "../../lib/three/build/three.module.js";
import * as Utils from "../Utils.js";

class Comet {

    constructor(scene, z) {
        this.scene = scene;
        this.z = z;
        let geometry = new THREE.BoxGeometry(.15, .15, .15);
        let material = new THREE.MeshBasicMaterial({color: 0xffffff});
        let object = new THREE.Mesh(geometry, material);
        this.object = object;
        scene.add(object);
        this.reset();
    }

    reset() {
        this.object.position.x = Utils.randomInt(200) - 100;
        this.object.position.y = Utils.randomInt(200) - 100;
        this.object.position.z = this.z;
        this.vector = new THREE.Vector3(Math.random(), Math.random(), 0);
        this.vector.normalize();
        this.vector.multiplyScalar(0.5);
    }

    update(fpsAdjustment) {
        let inc = this.vector.clone();
        inc.multiplyScalar(fpsAdjustment);
        if (Math.abs(this.object.position.x) > 200 || Math.abs(this.object.position.y) > 200) this.reset();
        this.object.position.add(inc);
    }

}


export default Comet;