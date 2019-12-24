import * as THREE from "./../lib/three.module.js";
import * as Utils from "./../js/Utils.js";
import Particle from "./Particle.js";

class Enemy {

    constructor(x, y, scene, explosionSound) {
        let shinyMaterial = new THREE.MeshPhongMaterial({
            color: 0x3333DD,
            specular: 0x33DDDD,
            shininess: 50,
        });
        let geometry = new THREE.ConeGeometry(.5, 1, 4);
        let cone = new THREE.Mesh(geometry, shinyMaterial);

        cone.position.x = x;
        cone.position.y = y;
        cone.position.z = 0.66;
        this.object = cone;
        this.scene = scene;
        this.explosionSound = explosionSound;
        this.alive = true;
        this.hitPoints = 1;
        scene.add(cone);

        this.rotationAxis = new THREE.Vector3(0, 0, 1);
        let rotationAngle = 45 * Math.PI / 180;
        this.direction = new THREE.Vector3(0, 1, 0);
        this.direction.applyAxisAngle(this.rotationAxis, rotationAngle);
        this.object.rotateOnAxis(this.rotationAxis, rotationAngle);
        this.moveInc = this.direction.clone();
        this.moveInc.multiplyScalar(0.05);
        this.particles = [];

        // this.object.rotation.x = -90 * Math.PI / 180;
        // this.object.rotation.y = -90 * Math.PI / 180;


    }

    hit() {
        for (let i = 0; i < 20; i++) {
            this.particles.push(new Particle(
                this.object.position.x,
                this.object.position.y,
                this.object.position.z,
                this.scene
            ));
        }
        this.alive = false;
        this.object.visible = false;
        this.explosionSound.currentTime = 0;
        this.explosionSound.play();
        this.hitTime = (new Date()).getTime();
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


    update(hero) {
        if (this.alive) {
            let pointA = hero.getPosition();
            let pointB = this.object.position;
            let pointC = pointB.clone();
            pointC.add(this.direction)
            let angle = Utils.find_angle(pointA, pointB, pointC);
            if (angle > Math.PI / 18) {
                let angleToRotate = angle / 10;
                this.direction.applyAxisAngle(this.rotationAxis, angleToRotate);
                this.object.rotateOnAxis(this.rotationAxis, angleToRotate);
                this.moveInc = this.direction.clone();
                this.moveInc.multiplyScalar(0.05);
            }
            this.move();
        } else {
            let currentTime = (new Date()).getTime();
            if (currentTime - this.hitTime < 200) {
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

    explode() {

    }

    move() {
        this.object.position.add(this.moveInc);
    }

    unMove() {
        this.object.position.add(this.moveInc.negate());
    }

    isAlive() {
        return this.alive;
    }


}

export default Enemy;
