const SystemUI = {};

const defaultOptions = {
	size: {},
	pos: {}
}

SystemUI.Component = class {
	constructor(app, options) {
		Object.assign(this, defaultOptions, options);
		this.app = app;
		this.attrs = options.attrs || {};
		this.style = options.style || {};
		this.dom = null; // html elements
		this.isAppended = false;
		this.size.max = this.size.max || {};
		this.size.min = this.size.min || {};
	}
	show() {
		document.$body.$appendChild(this.dom);
		this.isAppended = true;
	}
	remove() {
		this.dom.$remove();
		this.isAppended = false;
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
				this.dom.$style.$top = (this.pos.x || 0) + "px";
				this.dom.$style.$left = (this.pos.y || 0) + "px";
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
	center(left=0.5, top=0.5, transform=[-0.5,-0.5]) {
		this.dom.$style.$top = typeof top === "string" ? top : (100*top) + "%";
		this.dom.$style.$left = typeof left === "string" ? left : (100*left) + "%";
		transform[0] = typeof transform[0] !== "string" ? transform[0] = 100 * transform[0] + "%" : transform[0]
		transform[1] = typeof transform[1] !== "string" ? transform[1] = 100 * transform[1] + "%" : transform[1]
		this.dom.$style.$transform = `translate(${transform[0]}, ${transform[1]})`;
	}
}
SystemUI.TextInput = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement(this.isTextArea ? "textarea" : "input");
		this.autoSet(true, true);
		this.create();
		this.dom.$style.$position = "absolute";
	}
	create() {
		if (this.isAppended) return;
		if (!this.isTextArea) this.dom.$type = this.type || "text";
		super.create();
	}
}
SystemUI.Button = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("button");
		this.autoSet(true, true);
		this.create();
		this.value = this.value || "$VALUE"
		this.dom.$style.$position = "absolute";
		this.dom.$append(this.value);
	}
	create() {
		if (this.isAppended) return;
		this.dom.$type = this.type || "button";
		super.create();
	}
}
SystemUI.SelectOptions = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("select");
		this.autoSet(true, true);
		this.create();
		this.dom.$style.$position = "absolute";
		this.show();
		this.options_list = this.options_list.map(x => new SystemUI.option(this.app, this.dom, x)) || [];
	}
	create() {
		if (this.isAppended) return;
		super.create();
	}
}
SystemUI.Option = class extends SystemUI.Component {
	constructor(app, so_dom, options) {
		super(app, options);
		this.so_dom = so_dom;
		this.dom = document.$createElement("option");
		this.create();
		this.value = this.value || "";
		this.dom.$append(this.value);
		this.so_dom.$append(this.dom);
	}
	create() {
		if (this.isAppended) return;
		this.dom.$value = this.value;
		super.create();
		this.isAppended = true;
	}
	show() {}
}
SystemUI.Checkbox = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("input");
		this.autoSet(true, true);
		this.create();
		this.dom.$style.$position = "absolute";
	}
	create() {
		if (this.isAppended) return;
		this.dom.$type = "checkbox";
		super.create();
	}
}
SystemUI.Radio = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("input");
		this.autoSet(true, true);
		this.create();
		this.dom.$style.$position = "absolute";
		this.label = new SystemUI.Label(this.app, {forID: this.dom.$id, value: this.value});
	}
	create() {
		if (this.isAppended) return;
		this.dom.$type = "radio";
		super.create();
	}
	show() {
		super.show();
		this.label.show();
	}
}
SystemUI.Label = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("label");
		this.autoSet(false, true);
		this.create();
		this.dom.$style.$position = "absolute";
		if (!this.attrs["for"] && this.forID) {
			this.dom.$setAttribute("for", this.forID)
		}
		this.dom.$append(this.value || "Value");
	}
	create() {
		if (this.isAppended) return;
		super.create();
	}
}
SystemUI.TextField = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("span");
		this.autoSet(false, true);
		this.dom.$style.$position = "absolute";
		this.create();
		this.dom.$append(this.value || "$TEXT");
	}
	create() {
		if (this.isAppended) return;
		super.create();
	}
}
SystemUI.Popup = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("div");
		this.dom.$style.$position = "absolute";
		this.autoSet(true, true);
		this.headerTitle = this.headerTitle || "Popup";
		this.content = this.content || "$CONTENT_HERE";
		this.create(this.allowClose);
		if (this.centered === undefined || this.centered) {
			this.center();
		}
		// this.loadButtons();
	}
	create(allowClose) {
		if (this.isAppended) return;
		super.create();
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
		this.textContent = new SystemUI.TextField(this.app, {attrs: {"$class": "text"}, style: {"$word-wrap": "break-word", "$position": "relative", "$width": this.dom.$style.$width, "$height": this.dom.$style.$height}, useClassPositions: true, value: this.content});
		this.dom.$insertBefore(this.textContent.dom, this.dom.$firstChild);
		if (allowClose) {
			this.closeButton = new SystemUI.Button(this.app, {attrs: {"$class": "close"}, useClassPositions: true, useClassSize: true, value: "X"});
			this.dom.$appendChild(this.closeButton.dom);
			this.closeButton.dom.$onclick = event => {
				this.remove();
			};
		}
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
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("div");
		this.dom.$style.$position = "absolute";
		this.autoSet(true, true);
		this.headerTitle = this.headerTitle || "Window";
		this.create(this.allowClose);
		if (this.centered === undefined || this.centered) {
			this.center();
		}
	}
	create(allowClose) {
		if (this.isAppended) return;
		super.create();
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
			this.closeButton = new SystemUI.Button(this.app, {attrs: {"$class": "close"}, useClassPositions: true, useClassSize: true, value: "X"});
			this.dom.$appendChild(this.closeButton.dom);
			this.closeButton.dom.$onclick = event => {
				this.remove();
			};
		}
	}
}
module.exports = SystemUI;