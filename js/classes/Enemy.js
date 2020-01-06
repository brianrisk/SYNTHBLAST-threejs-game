import * as THREE from "../../lib/three/build/three.module.js";
import * as Utils from "../Utils.js";
import Particle from "./Particle.js";

class Enemy {

    constructor(x, y, scene, hitPoints) {
        let material = new THREE.MeshPhongMaterial({
            color: 0x00FFFF
        });
        let geometry = new THREE.ConeGeometry(.5, 1, 4);
        let cone = new THREE.Mesh(geometry, material);
        cone.position.x = x;
        cone.position.y = y;
        cone.position.z = 0.66;
        this.object = cone;
        this.scene = scene;
        this.alive = true;
        this.hitPoints = hitPoints;
        scene.add(cone);

        this.maxSpeed = 0.05 + Math.random() * .05;
        this.rotationAxis = new THREE.Vector3(0, 0, 1);
        let rotationAngle = 45 * Math.PI / 180;
        this.direction = new THREE.Vector3(0, 1, 0);
        this.direction.applyAxisAngle(this.rotationAxis, rotationAngle);
        this.object.rotateOnAxis(this.rotationAxis, rotationAngle);
        this.moveInc = this.direction.clone();
        this.moveInc.multiplyScalar(this.maxSpeed);
        this.newWander();
        this.particles = [];

        // this.object.rotation.x = -90 * Math.PI / 180;
        // this.object.rotation.y = -90 * Math.PI / 180;


    }

    hit(impact, fpsAdjustment) {
        this.hitPoints -= impact;
        if (this.hitPoints <= 0) {
            for (let i = 0; i < 100; i++) {
                this.particles.push(new Particle(
                    this.object.position.x,
                    this.object.position.y,
                    this.object.position.z,
                    this.scene,
                    fpsAdjustment
                ));
            }
            this.alive = false;
            this.object.visible = false;
            this.deathTime = (new Date()).getTime();
        }
    }

    getHitPoints() {
        return Math.max(0, this.hitPoints);
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

    newWander() {
        this.wanderAngle = Math.random() * Math.PI;
    }


    update(hero, fpsAdjustment) {
        if (this.alive) {
            if (hero.isAlive() && hero.isActive) {
                let pointA = hero.getFuturePosition();
                let pointB = this.object.position;
                let pointC = pointB.clone();
                pointC.add(this.direction);
                let angle = Utils.find_angle(pointA, pointB, pointC);
                if (angle > Math.PI / 18) {
                    let angleToRotate = angle / 25 * fpsAdjustment;
                    this.direction.applyAxisAngle(this.rotationAxis, angleToRotate);
                    this.object.rotateOnAxis(this.rotationAxis, angleToRotate);
                    this.moveInc = this.direction.clone();
                    this.moveInc.multiplyScalar(this.maxSpeed);
                }
            } else {
                let angle = this.wanderAngle;
                if (angle > Math.PI / 18) {
                    let angleToRotate = angle / 100 * fpsAdjustment;
                    this.wanderAngle -= angleToRotate;
                    this.direction.applyAxisAngle(this.rotationAxis, angleToRotate);
                    this.object.rotateOnAxis(this.rotationAxis, angleToRotate);
                    this.moveInc = this.direction.clone();
                    this.moveInc.multiplyScalar(this.maxSpeed * fpsAdjustment);
                }
            }
            this.move();
        } else {
            let currentTime = (new Date()).getTime();
            if (currentTime - this.deathTime < 200) {
                this.particles.forEach(particle => {
                    particle.update();
                });
            } else {
                this.particles.forEach(particle => {
                    particle.remove();

                });
                this.particles = [];
            }

        }

    }

    move() {
        this.object.position.add(this.moveInc);
    }

    unMove() {
        this.object.position.add(this.moveInc.negate());
        this.newWander();
        // this.moveInc.negate();
    }

    isAlive() {
        return this.alive;
    }


}

export default Enemy;
