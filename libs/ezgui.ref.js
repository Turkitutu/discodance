const Ezgui = EZGUI;
Ezgui.utils = Ezgui.$utils;
Ezgui.Theme = Ezgui.$Theme;
Ezgui.Theme.prototype.preload = Ezgui.Theme.prototype.$preload;
Ezgui.Theme.load = Ezgui.Theme.$load;
Ezgui.themes = Ezgui.$themes;
Ezgui.components = Ezgui.$components;
Ezgui.GUISprite = Ezgui.$GUISprite;
Object.defineProperty(Ezgui.GUISprite.prototype, "text", Object.getOwnPropertyDescriptor(Ezgui.GUISprite.prototype, "text"));
Ezgui.GUISprite.prototype.rebuild = Ezgui.GUISprite.prototype.$rebuild;
Ezgui.GUISprite.prototype.draw = Ezgui.GUISprite.prototype.$draw;
Ezgui.Component = Ezgui.$Component;
Ezgui.Component.Input = Ezgui.Component.$Input;
Object.defineProperty(Ezgui.Component.Input.prototype, "text", Object.getOwnPropertyDescriptor(Ezgui.Component.Input.prototype, "text"));
Ezgui.Component.Input.prototype.draw = Ezgui.Component.Input.prototype.$draw;
Ezgui.Component.Window = Ezgui.Component.$Window;
Ezgui.Component.Window.prototype.draw = Ezgui.Component.Window.prototype.$draw;
Ezgui.Component.Button = Ezgui.Component.$Button;
Ezgui.Component.Radio = Ezgui.Component.$Radio;
Object.defineProperty(Ezgui.Component.Radio.prototype, "checked", Object.getOwnPropertyDescriptor(Ezgui.Component.Radio.prototype, "checked"));
Ezgui.Component.Radio.prototype.draw = Ezgui.Component.Radio.prototype.$draw;
Ezgui.Component.List = Ezgui.Component.$List;
Ezgui.Component.List.prototype.removeChild = Ezgui.Component.List.prototype.$removeChild;
module.exports = Ezgui;