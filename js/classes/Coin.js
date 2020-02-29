import * as THREE from "../../lib/three/build/three.module.js";

class Coin {
    constructor(x, y, scene) {
        this.scene = scene;
        this.value = 20;

        let sizeFactor = 1;

        let size = 0.25 * sizeFactor;
        let bottomSize = 0.25 * sizeFactor;
        let bottomHeight = bottomSize * .6;

        // let cubeGeometry = new THREE.BoxBufferGeometry(size / 2, size, size);
        let cubeGeometry = new THREE.ConeGeometry(.6 * size, size, 4);
        let cubeMaterial = new THREE.MeshLambertMaterial(
            {
                color: 0xFFFFFF,
                emissive: 0x550055
            });
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        //cube.rotation.x = Math.PI / 4;
        cube.rotation.x = Math.PI / 2;
        // cube.position.x = x;
        // cube.position.y = y;
        cube.position.z = 0.25 * sizeFactor;


        let bottomGeometry = new THREE.ConeGeometry(.6 * size, bottomHeight, 4);
        let bottomMaterial = new THREE.MeshLambertMaterial(
            {
                color: 0x00FFFF,
                emissive: 0x330033
            });
        let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
        bottom.rotation.x = Math.PI / 2 * 3;
        bottom.position.z = .03;



        let group = new THREE.Group();
        group.add( cube );
        group.add( bottom );
        group.position.x = x;
        group.position.y = y;
        group.position.z = bottomSize;

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