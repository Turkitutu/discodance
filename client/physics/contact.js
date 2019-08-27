const { states } = require('../utils/enums.js');

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
                bodyA.bottom++;
                if (bodyA.bottom == 1) {
                    if (bodyA.state == states.slide || bodyA.state == states.slideForward) {
                        bodyA.onSlideLeave();
                    }
                    bodyA.onLanding();
                }
                if (fixtureB.isColor) {
                    const color = fixtureB.colorCode;
                    if (color) {
                        if (fixtureA.left) {
                            bodyA.left[color] = true;
                        } else {
                            bodyA.right[color] = true;
                        }
                        this.checkColor(bodyA);
                    }
                }
            } else {
                if (!(bodyA.state == states.slide || bodyA.state == states.slideForward) && !bodyA.bottom) {
                    bodyA.nextDirection = fixtureA.leftWall ? 1 : -1;
                    bodyA.onSlide();
                }
            }
        }
    }
    checkLeave(fixtureA, bodyA, fixtureB) {
        if (fixtureA.IsSensor() && bodyA.isPlayer) {
            if (fixtureA.bottom) {
                bodyA.bottom--;
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
            } else if (bodyA.state == states.slide || bodyA.state == states.slideForward) {
                bodyA.onSlideLeave();
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
        if (bodyA) {
            const fixtureB = contact.GetFixtureB(),
                  bodyB = fixtureB.GetBody().physicObject;
            if (bodyB) {
                this.checkLeave(fixtureA, bodyA, fixtureB);
                this.checkLeave(fixtureB, bodyB, fixtureA);
            }
        }
    }
}

module.exports = ContactListener;