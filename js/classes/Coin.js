import * as THREE from "../../lib/three/build/three.module.js";

class Coin {
    constructor(x, y, scene) {
        this.scene = scene;
        let size = 0.3;
        let cubeGeometry = new THREE.BoxBufferGeometry(size, size, size);
        let cubeMaterial = new THREE.MeshPhongMaterial(
            {
                color: 0xBB9933
            });
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.rotation.x = Math.PI / 4;
        // cube.position.x = x;
        // cube.position.y = y;
        // cube.position.z = 0.5;

        let wireframeGeometry = new THREE.BoxBufferGeometry(size + .001, size + .001, size + .001);
        let wireframeMaterial = new THREE.MeshBasicMaterial(
            {
                color: 0xEEEEFF,
                wireframe: true
            });
        let wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        // wireframe.position.x = x;
        // wireframe.position.y = y;
        // wireframe.position.z = 0.5;

        // cube.add(wireframe);
        let group = new THREE.Group();
        group.add( cube );
        // group.add( wireframe );
        group.position.x = x;
        group.position.y = y;
        group.position.z = 0.5;

        scene.add(group);
        this.object = group;
        this.isTaken = false;
        this.isAlive = true;

        this.rotationAxis = new THREE.Vector3(0, 0, 1);

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

    getPosition() {
        return this.object.position;
    }

    moveTo(v, fpsAdjustment) {
        let delta = new THREE.Vector3(v.x - this.getX(), v.y - this.getY(), 0);
        delta.normalize();
        delta.multiplyScalar(.1 * fpsAdjustment);
        this.object.position.add(delta);
    }

    update() {
        if (this.isAlive && this.isTaken) {
            this.object.visible = false;
            this.isAlive = false;
        } else {
            this.object.rotateOnAxis(this.rotationAxis,  Math.PI / 60);
        }
    }
}

export default Coin;