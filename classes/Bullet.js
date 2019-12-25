class Bullet {
    constructor(object, direction) {
        this.object = object;
        this.resetWithDirection(direction);
        this.active = true;
    }

    update() {
        this.object.position.add(this.velocity);
        let currentTime = (new Date()).getTime();
        if (currentTime - this.firedTime > 1000) {
            this.deactivate();
        }
    }

    deactivate() {
        this.active = false;
        this.object.visible = false;
    }

    activate() {
        this.active = true;
        this.object.visible = true;
    }

    hit() {
        this.deactivate();
    }

    getX() {
        return this.object.position.x;
    }

    getY() {
        return this.object.position.y;
    }

    isActive() {
        return this.active;
    }

    reset(direction, position) {
        this.resetWithDirection(direction);
        this.object.position.x = position.x;
        this.object.position.y = position.y;
        this.object.position.z = .2;
    }

    resetWithDirection(direction) {
        this.activate();
        this.velocity = direction.multiplyScalar(.4);
        this.firedTime = (new Date()).getTime();
    }
}

export default Bullet;