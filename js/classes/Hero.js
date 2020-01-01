import * as THREE from "../../lib/three/build/three.module.js";

class Hero {

    constructor(scene, camera, x, y) {
        // rendering
        this.scene = scene;
        this.camera = camera;

        // positioning
        this.turnSpeed = 0;
        this.speed = 0;
        this.maxSpeed = 0.15;
        this.moveInc = null;
        this.maxRotationSpeed = 2 * Math.PI / 180;
        this.perspectiveRotationSpeed = Math.PI / 180;
        this.bottomZ = 0.5;
        this.topZ = 15;
        this.rotationAxis = new THREE.Vector3(0, 0, 1);
        this.headTiltDelta = 0;
        this.perspectiveHeight = 0;
        this.originalX = x;
        this.originalY = y;

        // attributes
        this.hitPoints = 10;
        this.gun = null;
        this.isShooting = false;

        // setting up
        this.createObject();
        this.setPerspective(true);
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
        cone.rotation.y = -90 * Math.PI / 180;
        cone.rotateOnWorldAxis(this.rotationAxis, -90 * Math.PI / 180);
        this.object = cone;
        this.scene.add(cone);
    }

    reset() {
        this.camera.position.z = this.bottomZ;
        this.camera.position.x = this.originalX;
        this.camera.position.y = this.originalY;
        this.object.position.x = this.originalX;
        this.object.position.y = this.originalY;
        this.object.rotation.y = -90 * Math.PI / 180;
        this.object.rotateOnWorldAxis(this.rotationAxis, -90 * Math.PI / 180);
        if (this.isFirstPerson) {
            this.camera.rotation.z = 0;
            this.camera.rotation.x = 90 * Math.PI / 180;
            this.camera.rotation.y = -90 * Math.PI / 180;
            // tilt up just a bit to make buildings look more imposing
            this.camera.rotateOnAxis(new THREE.Vector3(-1, 0, 0), -0.1);
        } else {
            this.camera.rotation.z = -90 * Math.PI / 180;
        }
        this.isActive = true;
        this.hitPoints = 10;
        this.direction = new THREE.Vector3(1, 0, 0);
    }

    update() {
        if (this.isShooting) {
            this.gun.fire(true);
        }
        this.move();
    }

    changePerspective() {
        this.setPerspective(!this.isFirstPerson);
    }

    setPerspective(isFirstPerson) {
        this.isFirstPerson = isFirstPerson;
        if (this.isFirstPerson) {
            this.headTiltDelta += this.headTiltDelta + Math.PI / 2;
            this.perspectiveHeight = this.bottomZ;
            this.object.visible = false;
        }
        // overhead
        else {
            this.headTiltDelta += this.headTiltDelta - Math.PI / 2;
            this.perspectiveHeight = this.topZ;
            this.object.visible = true;
        }
    }

    move() {
        // moving
        if (this.isActive) {
            this.moveInc = this.direction.clone();
            this.moveInc.multiplyScalar(this.speed);
            this.camera.position.add(this.moveInc);
            this.object.position.add(this.moveInc);
            this.direction.applyAxisAngle(this.rotationAxis, this.turnSpeed);
            this.camera.rotateOnWorldAxis(this.rotationAxis, this.turnSpeed);
            this.object.rotateOnWorldAxis(this.rotationAxis, this.turnSpeed);
        }
        // drop down to ground level
        // if (this.isFirstPerson) {
        let heightDiff = Math.abs(this.camera.position.z - this.perspectiveHeight);
        if (heightDiff < this.maxSpeed * .9) {
            this.camera.position.z = this.perspectiveHeight;
            this.headTiltDelta = 0;
            if (heightDiff > 0.00001) {
                this.camera.rotateOnAxis(new THREE.Vector3(-1, 0, 0), this.headTiltDelta);
            }
        } else {
            let absDelta = Math.abs(this.headTiltDelta);
            let rotationMultiplier = 1;
            // switching perspective height
            if (this.camera.position.z < this.perspectiveHeight) {
                let up = new THREE.Vector3(0, 0, this.maxSpeed);
                this.camera.position.add(up);
            } else {
                let down = new THREE.Vector3(0, 0, -1 * this.maxSpeed);
                this.camera.position.add(down);
                rotationMultiplier = -1;
            }
            // switching perspective rotation
            if (absDelta <= this.perspectiveRotationSpeed) {
                this.camera.rotateOnAxis(new THREE.Vector3(-1, 0, 0), rotationMultiplier * absDelta);
                this.headTiltDelta = 0;
            } else {
                this.camera.rotateOnAxis(new THREE.Vector3(-1, 0, 0), rotationMultiplier * this.perspectiveRotationSpeed);
                this.headTiltDelta += rotationMultiplier * this.perspectiveRotationSpeed;
            }
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

    getFuturePosition() {
        let future = this.camera.position.clone();

        let futureInc = this.direction.clone();

        futureInc.multiplyScalar(this.speed * 10);
        future.add(futureInc);
        return future;
    }

    setGun(gun) {
        this.gun = gun;
    }

    startShooting() {
        this.isShooting = true;
    }

    stopShooting() {
        this.isShooting = false;
    }

}

export default Hero;