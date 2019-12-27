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
        this.topZ = 15;
        this.rotationAxis = new THREE.Vector3(0, 0, 1);
        this.headTiltDelta = 0;
        this.perspectiveHeight = 0;
        this.isFirstPerson = false;
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
        cone.rotation.y = -90 * Math.PI / 180;
        cone.rotateOnWorldAxis(this.rotationAxis, -90 * Math.PI / 180);
        this.object = cone;
        this.scene.add(cone);
    }

    reset() {
        this.camera.position.z = this.topZ;
        this.camera.position.x = this.originalX;
        this.camera.position.y = this.originalY;
        this.object.position.x = this.originalX;
        this.object.position.y = this.originalY;
        this.object.rotation.y = -90 * Math.PI / 180;
        this.object.rotateOnWorldAxis(this.rotationAxis, -90 * Math.PI / 180);
        if (this.isFirstPerson) {
            this.camera.rotation.z = 0;
            this.camera.rotation.x = 90 * Math.PI / 180 ;
            this.camera.rotation.y = -90 * Math.PI / 180;
            this.camera.rotateOnAxis(new THREE.Vector3(-1,0,0), -0.1);
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
            this.camera.rotateOnWorldAxis(this.rotationAxis, this.turnSpeed);
            this.object.rotateOnWorldAxis(this.rotationAxis, this.turnSpeed);
        }
        // drop down to ground level
        if (this.isFirstPerson) {
            this.object.visible = false;
            if (this.camera.position.z > this.bottomZ) {
                let down = new THREE.Vector3(0, 0, -1 * this.maxSpeed);
                this.camera.position.add(down);
                if (this.camera.position.z < this.bottomZ) {
                    this.camera.position.add(new THREE.Vector3(0, 0, this.camera.position.z - this.bottomZ ));
                }
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

}

export default Hero;