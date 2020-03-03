import * as THREE from "../../lib/three/build/three.module.js";

class Hero {

    constructor(x, y) {
        this.originalX = x;
        this.originalY = y;

        // positioning
        this.turnSpeed = 0;
        this.speed = 0;
        this.maxSpeed = 0.15;
        this.perspectiveSpeed = 0.15 * 1.5;
        this.moveInc = null;
        this.maxRotationSpeed = 2 * Math.PI / 180;
        this.perspectiveRotationSpeed = Math.PI / 180 * 1.5;
        this.bottomZ = 0.5;
        this.topZ = 15;
        this.rotationAxis = new THREE.Vector3(0, 0, 1);
        this.headTiltDelta = 0;
        this.perspectiveHeight = this.bottomZ;
        this.perspectiveDirection = -1;

        // attributes
        this.gun = null;
        this.maxHitPoints = 10;
        this.maxShields = 5;

        // initial state
        this.score = 10000;
        this.hitPoints = this.maxHitPoints;
        this.shields = 0;
        this.isFirstPerson = true;

        // setting up
        this.createObject();
    }

    createObject(x, y) {
        // ship
        let shinyMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF
        });
        let geometry = new THREE.ConeGeometry(.5, 1, 4);
        let cone = new THREE.Mesh(geometry, shinyMaterial);

        // shield
        let dotMaterial = new THREE.PointsMaterial({
            color: 0x333366,
            opacity: 0.1,
            size: 0.05,
        });
        let sphereGeometry = new THREE.SphereGeometry(1.5, 50);
        let sphereDots = new THREE.Points(sphereGeometry, dotMaterial);
        this.shield = sphereDots;

        let object = new THREE.Group();
        object.add(cone);
        object.add(sphereDots);
        this.object = object;
    }

    reset(scene, camera) {
        // rendering
        this.scene = scene;
        this.camera = camera;
        this.isFirstPerson = true;
        this.isShooting = false;
        this.camera.position.z = this.bottomZ;
        this.camera.position.x = this.originalX;
        this.camera.position.y = this.originalY;
        this.object.position.x = this.originalX;
        this.object.position.y = this.originalY;
        this.object.rotation.y = -90 * Math.PI / 180;
        this.object.rotateOnWorldAxis(this.rotationAxis, -90 * Math.PI / 180);
        this.camera.rotation.z = 0;
        this.camera.rotation.x = 90 * Math.PI / 180;
        this.camera.rotation.y = -90 * Math.PI / 180;
        // tilt up just a bit to make buildings look more imposing
        this.camera.rotateOnAxis(new THREE.Vector3(-1, 0, 0), -0.1);
        this.direction = new THREE.Vector3(1, 0, 0);

        // setting perspective
        this.headTiltDelta = 0;
        this.perspectiveHeight = this.bottomZ;
        this.perspectiveDirection = -1;
        scene.add(this.object);
    }

    update(fpsAdjustment) {
        if (this.isShooting && this.score > 0) {
            this.gun.fire(true, fpsAdjustment);
        }
        this.move(fpsAdjustment);

        if (this.shields <= 0) {
            this.shield.visible = false;
        } else {
            this.shield.rotation.x += Math.PI / 180 * fpsAdjustment;
            this.shield.rotation.y += Math.PI / 180 * fpsAdjustment;
        }
    }

    hit(impact) {
        this.shields -= impact;
        let damage = 0;
        if (this.shields < 0) {
            damage = Math.abs(this.shields);
            this.hitPoints += this.shields;
            this.shields = 0;

        }
        return damage;
    }

    getHitPoints() {
        return Math.max(0, this.hitPoints);
    }

    hasShield() {
        return this.shields > 0;
    }

    addShield() {
        if (this.shields !== this.maxShields) {
            this.shields++;
            this.shield.visible = true;
        }
    }

    changePerspective() {
        this.perspectiveDirection *= -1;
        this.setPerspective(!this.isFirstPerson);
    }

    setPerspective(isFirstPerson) {
        // if (isFirstPerson !== this.isFirstPerson) {
            this.isFirstPerson = isFirstPerson;
            if (this.isFirstPerson) {
                this.headTiltDelta = this.headTiltDelta + Math.PI / 2;
                this.perspectiveHeight = this.bottomZ;
                this.perspectiveDirection = -1;
            }
            // overhead
            else {
                this.headTiltDelta = this.headTiltDelta - Math.PI / 2;
                this.perspectiveHeight = this.topZ;
                this.perspectiveDirection = 1;
            }
        // }
    }

    push(vector) {
        this.camera.position.add(vector);
        this.object.position.add(vector);
    }

    move(fpsAdjustment) {
        // moving
        this.moveInc = this.direction.clone();
        this.moveInc.multiplyScalar(this.speed * fpsAdjustment);
        this.camera.position.add(this.moveInc);
        this.object.position.add(this.moveInc);
        this.direction.applyAxisAngle(this.rotationAxis, this.turnSpeed * fpsAdjustment);
        this.camera.rotateOnWorldAxis(this.rotationAxis, this.turnSpeed * fpsAdjustment);
        this.object.rotateOnWorldAxis(this.rotationAxis, this.turnSpeed * fpsAdjustment);

        // switching perspective height
        let heightDiff = Math.abs(this.camera.position.z - this.perspectiveHeight);
        if (heightDiff < this.maxSpeed * .9) {
            // this.camera.position.z = this.perspectiveHeight;
        } else {
            if (this.camera.position.z < this.perspectiveHeight) {
                let up = new THREE.Vector3(0, 0, this.perspectiveSpeed * fpsAdjustment);
                this.camera.position.add(up);
            } else {
                let down = new THREE.Vector3(0, 0, -1 * this.perspectiveSpeed * fpsAdjustment);
                this.camera.position.add(down);
            }
        }

        // switching perspective rotation
        let absDelta = Math.abs(this.headTiltDelta);
        if (absDelta > 0) {
            if (absDelta <= this.perspectiveRotationSpeed) {
                let rotationAmount = this.perspectiveDirection *  this.headTiltDelta;
                this.camera.rotateOnAxis(new THREE.Vector3(-1, 0, 0), rotationAmount);
                this.headTiltDelta = 0;
            } else {
                let rotationAmount = this.perspectiveDirection * this.perspectiveRotationSpeed * fpsAdjustment;
                this.camera.rotateOnAxis(new THREE.Vector3(-1, 0, 0), rotationAmount);
                this.headTiltDelta += rotationAmount;
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
        return this.getFuturePositionWithDistance(this.speed * 10);
    }

    getFuturePositionWithDistance(distance) {
        let future = this.camera.position.clone();
        let futureInc = this.direction.clone();
        futureInc.multiplyScalar(distance);
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

    isAlive() {
        return this.hitPoints > 0;
    }

}

export default Hero;