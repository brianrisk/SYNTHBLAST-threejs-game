import * as THREE from "./../lib/three/build/three.module.js";


/*
 * Calculates the angle ABC (in radians)
 *
 * A first point, ex: {x: 0, y: 0}
 * C second point
 * B center point
 */
export function find_angle(A, B, C) {
    let AB = distance(A,B);
    let BC = distance(B,C);
    let AC = distance(A,C);
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
}

export function distance(A, B) {
    return Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
}

export function randomVector() {
    let x = Math.random();
    if (Math.random() < 0.5) x *= -1;
    let y = Math.random();
    if (Math.random() < 0.5) y *= -1;
    let z = Math.random();
    if (Math.random() < 0.5) z *= -1;
    return new THREE.Vector3(x,y,z);
}

export function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}