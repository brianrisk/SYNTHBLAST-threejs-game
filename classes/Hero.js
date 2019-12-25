import * as THREE from "./../lib/three.module.js";

class Hero {

    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.turnSpeed = 0;
        this.speed = 0;
        this.maxSpeed = 0.15;
        this.moveInc = null;
        this.maxRotationSpeed = 2 * Math.PI / 180;
        this.bottomZ = 0.5;
        this.rotationAxis = new THREE.Vector3(0, 0, 1);
        this.isFirstPerson = true;
        this.reset();
    }

    reset() {
        this.camera.position.z = 10;
        this.camera.position.x = -10;
        this.camera.position.y = 0;
        this.camera.rotation.x = 90 * Math.PI / 180;
        this.camera.rotation.y = -90 * Math.PI / 180;
        this.isActive = true;
        this.hitPoints = 10;
        this.direction = new THREE.Vector3(1,0,0);
    }

    update() {

    }

    move() {
        // moving
        if (this.isActive) {
            this.moveInc = this.direction.clone();
            this.moveInc.multiplyScalar(this.maxSpeed);
            this.camera.getWorldDirection(this.direction);
            this.camera.position.add(this.direction.multiplyScalar(this.speed));
            this.camera.rotation.y += this.turnSpeed;
        }
        if (this.isFirstPerson && this.camera.position.z > this.bottomZ) {
            let down = new THREE.Vector3(0, 0, -1 * this.maxSpeed);
            this.camera.position.add(down);
        }
    }

    unMove() {
        this.camera.position.add(this.direction.negate());
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