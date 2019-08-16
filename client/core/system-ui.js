const SystemUI = {};
const components = new Set();

SystemUI.components = components;

const defaultOptions = {
	size: {},
	position: {}
}

class customTransform extends PIXI.TransformStatic {
	constructor(component) {
		super();
		this.component = component;
	}
	$onChange() {
		super.onChange();
		this.component.update();
	}
}

SystemUI.Component = class extends PIXI.DisplayObject {
	constructor(options) {
		super();
		components.$add(this);
		Object.assign(this, defaultOptions, options);
		this.attrs = options.attrs || {};
		this.style = options.style || {};
		this.dom = null; // html elements
		this.$visible = false;
		this.size.max = this.size.max || {};
		this.size.min = this.size.min || {};
		this.$transform = new customTransform(this);

		SystemUI.app.$stage.addChild(this);
	}
	show() {
		document.$body.$appendChild(this.dom);
		this.$visible = true;
		this.update();
	}
	hide() {
		this.dom.$remove();
		this.$visible = false;
		if (this.removeOnHide) {
			delete this.dom;
			this.$destory(true);
			components.$delete(this);
		}
	}
	addClass(className, dom) {
		dom = dom || this.dom;
		const classList = dom.$getAttribute('class');
		dom.$setAttribute('class', classList ? classList + ' ' + className : className);
	}
	removeClass(className, dom) {
		dom = dom || this.dom;
		dom.$setAttribute('class', (dom.$getAttribute('class') || '').replace(' '+className, ''));
	}
	autoSet(size, pos) {
		if (size) {
			if (!this.useClassesSize) {
				if (this.size.w) this.dom.$style.$width = "string" === typeof this.size.w ? this.size.w : this.size.w + "px";
				if (this.size.h) this.dom.$style.$height = "string" === typeof this.size.h ? this.size.h : this.size.h + "px";
				if (this.size.min.w) this.dom.$style.$minWidth = "string" === typeof this.size.min.w ? this.size.min.w : this.size.min.w + "px";
				if (this.size.min.h) this.dom.$style.$minHeight = "string" === typeof this.size.min.h ? this.size.min.h : this.size.min.h + "px";
				if (this.size.max.w) this.dom.$style.$maxWidth = "string" === typeof this.size.max.w ? this.size.max.w : this.size.max.w + "px";
				if (this.size.max.h) this.dom.$style.$maxHeight = "string" === typeof this.size.max.h ? this.size.max.h : this.size.max.h + "px";
			}
		}
		if (pos) {
			if (!this.useClassPositions) {
				this.$position.set(this.position.x||0, this.position.y||0);
			}
		}
	}
	create() {
		for (const [key, value] of Object.entries(this.style)) {
			this.dom.$style[key] = value;
		}
		for (const [attr, value] of Object.entries(this.attrs)) {
			this.dom.$setAttribute(attr, value);
		}
	}
	update() {
		if (!this.$visible) return;
		const app = SystemUI.app,
			  element = this.dom,
			  scale = app.$stage.$scale.$x,
	          style = element.$style;
	    style.$transform=style.$msTransform=style.$MozTransform=style.$OTransform=style.$WebkitTransform
	    =(this.useClassPositions ? '' : `translate(${this.$position.$x*window.$innerWidth/app.width-element.$offsetWidth/2}px, ${this.$position.$y*window.$innerHeight/app.height-element.$offsetHeight/2}px)`) + (this.useClassesSize ? '' : `scale(${this.$scale.$x*scale}, ${this.$scale.$y*scale})`);
	}
	/*
	center(left=0.5, top=0.5, transform=[-0.5,-0.5]) {
		this.dom.$style.$top = typeof top === "string" ? top : (100*top) + "%";
		this.dom.$style.$left = typeof left === "string" ? left : (100*left) + "%";
		transform[0] = typeof transform[0] !== "string" ? transform[0] = 100 * transform[0] + "%" : transform[0]
		transform[1] = typeof transform[1] !== "string" ? transform[1] = 100 * transform[1] + "%" : transform[1]
		this.dom.$style.$transform = `translate(${transform[0]}, ${transform[1]})`;
	}*/
}
SystemUI.TextInput = class extends SystemUI.Component {
	constructor(options) {
		super(options);
		this.dom = document.$createElement(this.isTextArea ? "textarea" : "input");
		this.dom.$style.$position = "absolute";
		this.autoSet(true, true);
		this.create();
	}
	create() {
		if (this.$visible) return;
		if (!this.isTextArea) this.dom.$type = this.type || "text";
		super.create();
	}
}
SystemUI.Button = class extends SystemUI.Component {
	constructor(options) {
		super(options);
		this.dom = document.$createElement("button");
		this.dom.$style.$position = "absolute";
		this.autoSet(true, true);
		this.create();
		this.value = this.value || "$VALUE"
		this.dom.$append(this.value);
	}
	create() {
		if (this.$visible) return;
		this.dom.$type = this.type || "button";
		super.create();
	}
}
SystemUI.SelectOptions = class extends SystemUI.Component {
	constructor(options) {
		super(options);
		this.dom = document.$createElement("select");
		this.dom.$style.$position = "absolute";
		this.autoSet(true, true);
		this.create();
		this.show();
		this.options_list = this.options_list.map(x => new SystemUI.option(this.dom, x)) || [];
	}
	create() {
		if (this.$visible) return;
		super.create();
	}
}
SystemUI.Option = class extends SystemUI.Component {
	constructor(so_dom, options) {
		super(options);
		this.so_dom = so_dom;
		this.dom = document.$createElement("option");
		this.create();
		this.value = this.value || "";
		this.dom.$append(this.value);
		this.so_dom.$append(this.dom);
	}
	create() {
		if (this.$visible) return;
		this.dom.$value = this.value;
		super.create();
		this.$visible = true;
	}
	show() {}
}
SystemUI.Checkbox = class extends SystemUI.Component {
	constructor(options) {
		super(options);
		this.dom = document.$createElement("input");
		this.dom.$style.$position = "absolute";
		this.autoSet(true, true);
		this.create();
	}
	create() {
		if (this.$visible) return;
		this.dom.$type = "checkbox";
		super.create();
	}
}
SystemUI.Radio = class extends SystemUI.Component {
	constructor(options) {
		super(options);
		this.dom = document.$createElement("input");
		this.dom.$style.$position = "absolute";
		this.autoSet(true, true);
		this.create();
		this.label = new SystemUI.Label({forID: this.dom.$id, value: this.value});
	}
	create() {
		if (this.$visible) return;
		this.dom.$type = "radio";
		super.create();
	}
	show() {
		super.show();
		this.label.show();
	}
}
SystemUI.Label = class extends SystemUI.Component {
	constructor(options) {
		super(options);
		this.dom = document.$createElement("label");
		this.dom.$style.$position = "absolute";
		this.autoSet(false, true);
		this.create();
		if (!this.attrs["for"] && this.forID) {
			this.dom.$setAttribute("for", this.forID)
		}
		this.dom.$append(this.value || "Value");
	}
	create() {
		if (this.$visible) return;
		super.create();
	}
}
SystemUI.TextField = class extends SystemUI.Component {
	constructor(options) {
		super(options);
		this.dom = document.$createElement("span");
		this.dom.$style.$position = "absolute";
		this.autoSet(false, true);
		this.create();
		this.dom.$append(this.value || "$TEXT");
	}
	create() {
		if (this.$visible) return;
		super.create();
	}
}
SystemUI.Popup = class extends SystemUI.Component {
	constructor(options) {
		super(options);
		this.dom = document.$createElement("div");
		this.dom.$style.$position = "absolute";
		this.autoSet(true, true);
		this.headerTitle = this.headerTitle || "Popup";
		this.content = this.content || "$CONTENT_HERE";
		this.create(this.allowClose);
		/*if (this.centered === undefined || this.centered) {
			this.center();
		}*/
		// this.loadButtons();
	}
	create(allowClose) {
		if (this.$visible) return;
		this.addClass("uiContainer");
		this.addClass("bg");
		this.addClass("uiWindow");
		if (this.headerTitle) {
			var titleField = document.$createElement("span");
			titleField.$style.$whiteSpace = "nowrap";
			titleField.$style.$position = "absolute";
			this.addClass("head", titleField);
			this.dom.$insertBefore(titleField, this.dom.$firstChild);
			titleField.$textContent = this.headerTitle;
		}
		this.textContent = new SystemUI.TextField({attrs: {"$class": "text"}, style: {"$word-wrap": "break-word", "$position": "relative", "$width": this.dom.$style.$width, "$height": this.dom.$style.$height}, useClassPositions: true, value: this.content});
		this.dom.$insertBefore(this.textContent.dom, this.dom.$firstChild);
		if (allowClose) {
			this.closeButton = new SystemUI.Button({attrs: {"$class": "close"}, useClassPositions: true, useClassSize: true, value: "X"});
			this.dom.$appendChild(this.closeButton.dom);
			this.closeButton.dom.$onclick = event => {
				this.hide();
			};
		}
		super.create();		
	}
	// loadButtons() {
		// if (this.buttons && this.buttons.length > 0) {
		// 	for (let i=0; i < this.buttons.length; i++) {
		// 		if (this.buttons[i] instanceof SystemUI.Button)
		// 			this.dom.$appendChild(this.buttons[i].dom);
		// 		else
		// 			throw new Error("Invalid button type.");
		// 	}
		// }
	// }
}
SystemUI.Panel = class extends SystemUI.Component {
	constructor(options) {
		super(options);
		this.dom = document.$createElement("div");
		this.dom.$style.$position = "absolute";
		this.autoSet(true, true);
		this.headerTitle = this.headerTitle || "Window";
		this.create(this.allowClose);
		/*if (this.centered === undefined || this.centered) {
			this.center();
		}*/
	}
	create(allowClose) {
		if (this.$visible) return;
		this.addClass("uiContainer");
		this.addClass("bg");
		this.addClass("uiWindow");
		if (this.headerTitle) {
			var titleField = document.$createElement("span");
			titleField.$style.$whiteSpace = "nowrap";
			titleField.$style.$position = "absolute";
			this.addClass("head", titleField);
			this.dom.$insertBefore(titleField, this.dom.$firstChild);
			titleField.$textContent = this.headerTitle;
		}
		if (allowClose) {
			this.closeButton = new SystemUI.Button({attrs: {"$class": "close"}, useClassPositions: true, useClassSize: true, value: "X"});
			this.dom.$appendChild(this.closeButton.dom);
			this.closeButton.dom.$onclick = event => {
				this.hide();
			};
		}
		super.create();
	}
}
module.exports = SystemUI;