const Matterjs = Matter;
Matterjs.version = Matterjs.$version;
Matterjs.Body = Matterjs.$Body;
Matterjs.Body.set = Matterjs.Body.$set;
Matterjs.Body.translate = Matterjs.Body.$translate;
Matterjs.Body.scale = Matterjs.Body.$scale;
Matterjs.Body.update = Matterjs.Body.$update;
Matterjs.World = Matterjs.$World;
Matterjs.World.add = Matterjs.World.$add;
Matterjs.World.remove = Matterjs.World.$remove;
Matterjs.World.clear = Matterjs.World.$clear;
Matterjs.Contact = Matterjs.$Contact;
Matterjs.Contact.id = Matterjs.Contact.$id;
Matterjs.Engine = Matterjs.$Engine;
Matterjs.Engine.update = Matterjs.Engine.$update;
Matterjs.Engine.clear = Matterjs.Engine.$clear;
Matterjs.Engine.run = Matterjs.Engine.$run;
module.exports = Matterjs;