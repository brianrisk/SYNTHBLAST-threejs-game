import * as THREE from "./../lib/three.module.js";

class Hero {

    constructor(scene, camera, x, y) {
        this.scene = scene;
        this.camera = camera;
        this.turnSpeed = 0;
        this.speed = 0;
        this.maxSpeed = 0.15;
        this.moveInc = null;
        this.maxRotationSpeed = 2 * Math.PI / 180;
        this.bottomZ = 0.5;
        this.topZ = 10;
        this.rotationAxis = new THREE.Vector3(0, 0, 1);
        this.isFirstPerson = true;
        this.originalX = x;
        this.originalY = y;
        this.createObject();
        this.reset();
    }

    createObject(x, y) {
        let shinyMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF
        });
        let geometry = new THREE.ConeGeometry(.5, 1, 4);
        let cone = new THREE.Mesh(geometry, shinyMaterial);
        cone.position.x = this.originalX;
        cone.position.y = this.originalY;
        cone.position.z = 0.66;
        cone.rotation.x = 90 * Math.PI / 180;
        cone.rotation.y = -90 * Math.PI / 180;
        this.object = cone;
        this.scene.add(cone);
    }

    reset() {
        this.camera.position.z = 10;
        this.camera.position.x = this.originalX;
        this.camera.position.y = this.originalY;
        this.object.position.x = this.originalX;
        this.object.position.y = this.originalY;
        if (this.isFirstPerson) {
            this.camera.rotation.x = 90 * Math.PI / 180;
            this.camera.rotation.y = -90 * Math.PI / 180;
        } else {
            this.camera.rotation.z = -90 * Math.PI / 180;
        }


        this.isActive = true;
        this.hitPoints = 10;
        this.direction = new THREE.Vector3(1, 0, 0);
    }

    update() {

    }

    move() {
        // moving
        if (this.isActive) {
            this.moveInc = this.direction.clone();
            this.moveInc.multiplyScalar(this.speed);
            this.camera.position.add(this.moveInc);
            this.object.position.add(this.moveInc);
            this.direction.applyAxisAngle(this.rotationAxis, this.turnSpeed);
            if (this.isFirstPerson) {
                this.camera.rotation.y += this.turnSpeed;
                this.object.rotation.y += this.turnSpeed;
            } else {
                this.camera.rotateOnAxis(this.rotationAxis, this.turnSpeed);
                this.object.rotateOnAxis(this.rotationAxis, this.turnSpeed);
            }
        }
        // drop down to ground level
        if (this.isFirstPerson && this.camera.position.z > this.bottomZ) {
            let down = new THREE.Vector3(0, 0, -1 * this.maxSpeed);
            this.camera.position.add(down);
        }
    }

    unMove() {
        this.camera.position.add(this.moveInc.negate());
        this.object.position.add(this.moveInc);
    }

    turnLeft() {
        this.turnSpeed = this.maxRotationSpeed;
    }

    turnRight() {
        this.turnSpeed = -1.0 * this.maxRotationSpeed;
    }

    stopTurning() {
        this.turnSpeed = 0;
    }

    forward() {
        this.speed = this.maxSpeed;
    }

    reverse() {
        this.speed = -1.0 * this.maxSpeed;
    }

    stop() {
        this.speed = 0.0;
    }

    getX() {
        return this.camera.position.x;
    }

    getY() {
        return this.camera.position.y;
    }

    getZ() {
        return this.camera.position.z;
    }

    getPosition() {
        return this.camera.position;
    }

}

export default Hero;