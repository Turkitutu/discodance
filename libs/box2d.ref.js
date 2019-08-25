const Box2D = box2d;
Box2D.b2DrawFlags = Box2D.$b2DrawFlags;
Box2D.b2DrawFlags["0"] = Box2D.b2DrawFlags["$0"];
Box2D.b2DrawFlags["1"] = Box2D.b2DrawFlags["$1"];
Box2D.b2DrawFlags["2"] = Box2D.b2DrawFlags["$2"];
Box2D.b2DrawFlags["4"] = Box2D.b2DrawFlags["$4"];
Box2D.b2DrawFlags["8"] = Box2D.b2DrawFlags["$8"];
Box2D.b2DrawFlags["16"] = Box2D.b2DrawFlags["$16"];
Box2D.b2DrawFlags["32"] = Box2D.b2DrawFlags["$32"];
Box2D.b2DrawFlags["63"] = Box2D.b2DrawFlags["$63"];
Box2D.b2DrawFlags["64"] = Box2D.b2DrawFlags["$64"];
Box2D.b2DrawFlags.e_shapeBit = Box2D.b2DrawFlags.$e_shapeBit;
Box2D.b2BodyType = Box2D.$b2BodyType;
Box2D.b2BodyType["0"] = Box2D.b2BodyType["$0"];
Box2D.b2BodyType["1"] = Box2D.b2BodyType["$1"];
Box2D.b2BodyType["2"] = Box2D.b2BodyType["$2"];
Box2D.b2BodyType["-1"] = Box2D.b2BodyType["$-1"];
Box2D.b2BodyType.b2_staticBody = Box2D.b2BodyType.$b2_staticBody;
Box2D.b2BodyType.b2_dynamicBody = Box2D.b2BodyType.$b2_dynamicBody;
Box2D.b2Body = Box2D.$b2Body;
Box2D.b2Body.prototype.CreateFixture = Box2D.b2Body.prototype.$CreateFixture;
Box2D.b2Body.prototype.GetPosition = Box2D.b2Body.prototype.$GetPosition;
Box2D.b2Body.prototype.SetPosition = Box2D.b2Body.prototype.$SetPosition;
Box2D.b2Body.prototype.GetAngle = Box2D.b2Body.prototype.$GetAngle;
Box2D.b2Body.prototype.SetLinearVelocity = Box2D.b2Body.prototype.$SetLinearVelocity;
Box2D.b2Body.prototype.GetLinearVelocity = Box2D.b2Body.prototype.$GetLinearVelocity;
Box2D.b2Body.prototype.ApplyLinearImpulse = Box2D.b2Body.prototype.$ApplyLinearImpulse;
Box2D.b2Body.prototype.ApplyLinearImpulseToCenter = Box2D.b2Body.prototype.$ApplyLinearImpulseToCenter;
Box2D.b2Body.prototype.SetLinearDamping = Box2D.b2Body.prototype.$SetLinearDamping;
Box2D.b2Body.prototype.IsAwake = Box2D.b2Body.prototype.$IsAwake;
Box2D.b2BodyDef = Box2D.$b2BodyDef;
Box2D.b2Contact = Box2D.$b2Contact;
Box2D.b2Contact.prototype.GetFixtureA = Box2D.b2Contact.prototype.$GetFixtureA;
Box2D.b2Contact.prototype.GetFixtureB = Box2D.b2Contact.prototype.$GetFixtureB;
Box2D.b2ContactListener = Box2D.$b2ContactListener;
Box2D.b2ContactListener.prototype.BeginContact = Box2D.b2ContactListener.prototype.$BeginContact;
Box2D.b2ContactListener.prototype.EndContact = Box2D.b2ContactListener.prototype.$EndContact;
Box2D.b2Draw = Box2D.$b2Draw;
Box2D.b2Draw.prototype.SetFlags = Box2D.b2Draw.prototype.$SetFlags;
Box2D.b2Fixture = Box2D.$b2Fixture;
Box2D.b2Fixture.prototype.IsSensor = Box2D.b2Fixture.prototype.$IsSensor;
Box2D.b2Fixture.prototype.GetBody = Box2D.b2Fixture.prototype.$GetBody;
Box2D.b2FixtureDef = Box2D.$b2FixtureDef;
Box2D.b2PolygonShape = Box2D.$b2PolygonShape;
Box2D.b2PolygonShape.prototype.Copy = Box2D.b2PolygonShape.prototype.$Copy;
Box2D.b2PolygonShape.prototype.Set = Box2D.b2PolygonShape.prototype.$Set;
Box2D.b2PolygonShape.prototype.SetAsBox = Box2D.b2PolygonShape.prototype.$SetAsBox;
Box2D.b2Rot = Box2D.$b2Rot;
Box2D.b2Rot.prototype.Copy = Box2D.b2Rot.prototype.$Copy;
Box2D.b2Rot.prototype.GetAngle = Box2D.b2Rot.prototype.$GetAngle;
Box2D.b2Vec2 = Box2D.$b2Vec2;
Object.defineProperty(Box2D.b2Vec2.prototype, "x", Object.getOwnPropertyDescriptor(Box2D.b2Vec2.prototype, "x"));
Object.defineProperty(Box2D.b2Vec2.prototype, "y", Object.getOwnPropertyDescriptor(Box2D.b2Vec2.prototype, "y"));
Box2D.b2Vec2.prototype.Set = Box2D.b2Vec2.prototype.$Set;
Box2D.b2Vec2.prototype.Copy = Box2D.b2Vec2.prototype.$Copy;
Box2D.b2World = Box2D.$b2World;
Box2D.b2World.prototype.SetContactListener = Box2D.b2World.prototype.$SetContactListener;
Box2D.b2World.prototype.SetDebugDraw = Box2D.b2World.prototype.$SetDebugDraw;
Box2D.b2World.prototype.CreateBody = Box2D.b2World.prototype.$CreateBody;
Box2D.b2World.prototype.DestroyBody = Box2D.b2World.prototype.$DestroyBody;
Box2D.b2World.prototype.Step = Box2D.b2World.prototype.$Step;
Box2D.b2World.prototype.DrawDebugData = Box2D.b2World.prototype.$DrawDebugData;
Box2D.b2_pi = Box2D.$b2_pi;
Box2D.b2_pi_over_180 = Box2D.$b2_pi_over_180;
module.exports = Box2D;