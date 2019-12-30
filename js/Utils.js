import * as THREE from "./../lib/three.module.js";


/*
 * Calculates the angle ABC (in radians)
 *
 * A first point, ex: {x: 0, y: 0}
 * C second point
 * B center point
 */
export function find_angle(A, B, C) {
    var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
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