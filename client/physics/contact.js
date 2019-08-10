function crossObject(obj1, obj2) {
    for (const key in obj1) {
        if (obj2[key]) return key;
    }
    return null;
}

class ContactListener extends box2d.b2ContactListener {
    constructor() {
        super();
    }
    checkColor(body) {
        const color = crossObject(body.left, body.right);
        if (body.color !== color) {
            body.color = color;
            if (color===null) {
                body.onColorLeave();
            } else {
                body.onColorTouch();
            }
        }
    }
    checkContact(fixtureA, bodyA, fixtureB) {
        if (fixtureA.IsSensor() && bodyA.isPlayer) {
            if (fixtureA.bottom) {
                bodyA.onLanding();
            } else if (fixtureB.isColor) {
                const color = fixtureB.colorCode;
                if (color) {
                    if (fixtureA.left) {
                        bodyA.left[color] = true;
                    } else if (fixtureA.right) {
                        bodyA.right[color] = true;
                    }
                    this.checkColor(bodyA);
                }
            }
        }
    }
    checkLeave(fixtureA, bodyA, fixtureB) {
        if (bodyA.isPlayer) {
            if (fixtureB.isColor) {
                const color = fixtureB.colorCode;
                if (color) {
                    if (fixtureA.left) {
                        delete bodyA.left[color];
                    } else if (fixtureA.right) {
                        delete bodyA.right[color];
                    }
                    this.checkColor(bodyA);
                }
            }
        }
    }
    $BeginContact(contact) {
        const fixtureA = contact.GetFixtureA(),
              bodyA = fixtureA.GetBody().physicObject;
        if (bodyA) {
            const fixtureB = contact.GetFixtureB(),
                  bodyB = fixtureB.GetBody().physicObject;
            if (bodyB) {
                this.checkContact(fixtureA, bodyA, fixtureB);
                this.checkContact(fixtureB, bodyB, fixtureA);
            }
        }
    }
    $EndContact(contact) {
        const fixtureA = contact.GetFixtureA(),
              bodyA = fixtureA.GetBody().physicObject;
        if (bodyA && fixtureA.IsSensor()) {
            const fixtureB = contact.GetFixtureB(),
                  bodyB = fixtureB.GetBody().physicObject;
            if (bodyB && fixtureB.IsSensor()) {
                this.checkLeave(fixtureA, bodyA, fixtureB);
                this.checkLeave(fixtureB, bodyB, fixtureA);
            }
        }
    }
}

module.exports = ContactListener;