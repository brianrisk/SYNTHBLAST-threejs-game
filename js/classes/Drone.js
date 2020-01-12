import * as THREE from "../../lib/three/build/three.module.js";
import * as Utils from "../Utils.js";
import Particle from "./Particle.js";

class Drone {

    constructor(x, y, scene) {
        let self = this;
        this.scene = scene;
        this.alive = true;
        this.hitPoints = 2;
        this.loaded = false;

        let loader = new THREE.ObjectLoader();
        loader.load(
            // resource URL
            "js/models/Drone.json",

            // onLoad callback
            // Here the loaded data is assumed to be an object
            function ( obj ) {
                // Add the loaded object to the scene
                console.log("loaded");
                self.object = obj;
                self.loaded = true;
                self.finishConstruction(x,y);
            },

            // onProgress callback
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },

            // onError callback
            function ( err ) {
                console.error("error loading");
                console.error( err );
            }
        );

    }

    finishConstruction(x, y) {
        this.object.position.x = x;
        this.object.position.y = y;
        this.object.position.z = 1.5;
        this.object.rotation.x = 90 * Math.PI / 180;
        // this.object.rotation.y = -90 * Math.PI / 180;

        this.maxSpeed = 0.05;
        this.rotationAxis = new THREE.Vector3(0, 0, 1);
        let rotationAngle = 45 * Math.PI / 180;
        this.direction = new THREE.Vector3(0, 1, 0);
        // this.direction.applyAxisAngle(this.rotationAxis, rotationAngle);
        // this.object.rotateOnAxis(this.rotationAxis, rotationAngle);
        this.moveInc = this.direction.clone();
        this.moveInc.multiplyScalar(this.maxSpeed);
        this.newWander();
        this.particles = [];
        this.scene.add(this.object)
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


    update(hero, enemies, fpsAdjustment) {
        // go to enemy closest to hero
        // if no enemy close to hero, go to hero
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
            }

            else {
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
        if (this.loaded) {
            this.object.position.add(this.moveInc);
        }
    }

    unMove() {
        this.object.position.add(this.moveInc.negate());
        this.newWander();
        this.moveInc.negate();
    }

    isAlive() {
        return this.alive;
    }
    
}

export default Drone;