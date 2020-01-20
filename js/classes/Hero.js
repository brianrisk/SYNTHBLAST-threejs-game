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
        this.gun = null;
        this.isShooting = false;
        this.maxHitPoints = 10;
        this.maxShields = 5;
        this.shields = 0;
        this.isActive = false;

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

        object.position.x = this.originalX;
        object.position.y = this.originalY;
        object.position.z = 0.66;
        object.rotation.y = -90 * Math.PI / 180;
        object.rotateOnWorldAxis(this.rotationAxis, -90 * Math.PI / 180);

        this.object = object;
        this.scene.add(object);
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
        this.hitPoints = this.maxHitPoints;
        this.direction = new THREE.Vector3(1, 0, 0);
    }

    update(fpsAdjustment) {
        if (this.isShooting) {
            this.gun.fire(true, fpsAdjustment);
        }
        this.move(fpsAdjustment);
        this.shield.rotation.x += Math.PI / 180 * fpsAdjustment;
        this.shield.rotation.y += Math.PI / 180 * fpsAdjustment;
        // this.shield.rotation.z += Math.PI / 180 *
        if (this.shields <= 0) {
            this.shield.visible = false;
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

    hasShield () {
        return this.shields > 0;
    }

    addShield() {
        if (this.shields !== this.maxShields) {
            this.shields ++;
            this.shield.visible = true;
        }
    }

    changePerspective() {
        this.setPerspective(!this.isFirstPerson);
    }

    setPerspective(isFirstPerson) {
        this.isFirstPerson = isFirstPerson;
        if (this.isFirstPerson) {
            this.headTiltDelta += this.headTiltDelta + Math.PI / 2;
            this.perspectiveHeight = this.bottomZ;
        }
        // overhead
        else {
            this.headTiltDelta += this.headTiltDelta - Math.PI / 2;
            this.perspectiveHeight = this.topZ;
        }
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
                let up = new THREE.Vector3(0, 0, this.maxSpeed * fpsAdjustment);
                this.camera.position.add(up);
            } else {
                let down = new THREE.Vector3(0, 0, -1 * this.maxSpeed * fpsAdjustment);
                this.camera.position.add(down);
                rotationMultiplier = -1;
            }
            // switching perspective rotation
            if (absDelta <= this.perspectiveRotationSpeed) {
                this.camera.rotateOnAxis(new THREE.Vector3(-1, 0, 0), rotationMultiplier * absDelta);
                this.headTiltDelta = 0;
            } else {
                this.camera.rotateOnAxis(new THREE.Vector3(-1, 0, 0), rotationMultiplier * this.perspectiveRotationSpeed);
                this.headTiltDelta += rotationMultiplier * this.perspectiveRotationSpeed * fpsAdjustment;
            }
        }
    }

    unMove() {
        this.camera.position.add(this.moveInc.negate());
        this.object.position.add(this.moveInc);
    }

    turnLeft() {
        this.isActive = true;
        this.turnSpeed = this.maxRotationSpeed;
    }

    turnRight() {
        this.isActive = true;
        this.turnSpeed = -1.0 * this.maxRotationSpeed;
    }

    stopTurning() {
        this.turnSpeed = 0;
    }

    forward() {
        this.isActive = true;
        this.speed = this.maxSpeed;
    }

    reverse() {
        this.isActive = true;
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
        this.isActive = true;
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