class SystemUI {
}
SystemUI.Component = class {
	constructor(app, options) {
		this.app = app;
		this.options = options;
		if (!app || typeof app in ["string", "number", "boolean"])
			throw new Error("Unknown app type, besure it is for pixi.js");
		this.attrs = this.options.attrs || {};
		this.style =this.options.style || {};
		this.dom = null; // html elements
		this.isAppend = false;
		this.size = options.size || {};
		this.size.max = this.size.max || {};
		this.size.min = this.size.min || {};
		this.pos = options.pos || {};
	}
	show() {
		document.$body.$appendChild(this.dom);
		this.isAppend = true;
	}
	remove() {
		this.dom.$remove();
		this.isAppend = false;
	}
	addClass(className, dom) {
		dom = dom || this.dom;
		if (dom.$getAttribute("class") === null)
			return dom.$setAttribute("class", className);
		let list = dom.$getAttribute("class").split(" ");
		list.push(className);
		return dom.$setAttribute("class", list.join(" "));
	}
	removeClass() {
		dom = dom || this.dom;
		if (dom.getAttribute("class") === null) return;
		let list = dom.getAttribute("class").split(" ");
		if (className in list) delete list[list.indexOf(className)];
		return dom.setAttribute("class", list.join(" "));
	}
	autoSet(t) {
		if (!this.dom)
			throw new Error("DOM Elements aren't exists.");
		if (t.size) {
			if (this.size !== undefined) {
				if ((this.options.useClassSize !== undefined && !this.options.useClassSize) || !this.options.useClassesSize) {
					if (this.size.w !== undefined) this.dom.$style.$width = "string" === typeof this.size.w ? this.size.w : this.size.w + "px";
					if (this.size.h !== undefined) this.dom.$style.$height = "string" === typeof this.size.h ? this.size.h : this.size.h + "px";
					if (this.size.min.w !== undefined) this.dom.$style.$minWidth = "string" === typeof this.size.min.w ? this.size.min.w : this.size.min.w + "px";
					if (this.size.min.h !== undefined) this.dom.$style.$minHeight = "string" === typeof this.size.min.h ? this.size.min.h : this.size.min.h + "px";
					if (this.size.max.w !== undefined) this.dom.$style.$maxWidth = "string" === typeof this.size.max.w ? this.size.max.w : this.size.max.w + "px";
					if (this.size.max.h !== undefined) this.dom.$style.$maxHeight = "string" === typeof this.size.max.h ? this.size.max.h : this.size.max.h + "px";
				}
			}
		}
		if (t.pos) {
			if (this.pos !== undefined) {
				if ((this.options.useClassPositions !== undefined && !this.options.useClassPositions) || !this.options.useClassPositions) {
					this.dom.$style.top = (this.pos.x !== undefined ? this.pos.x : 0) + "px";
					this.dom.$style.left = (this.pos.y !== undefined ? this.pos.y : 0) + "px";
				}
			}
		}
	}
}
SystemUI.TextInput = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.isTextArea = this.options.isTextArea !== undefined ? this.options.isTextArea : false;
		this.dom = document.$createElement(this.isTextArea ? "textarea" : "input");
		this.autoSet({
			size: true,
			pos: true
		});
		this.create();
		this.dom.$style.$position = "absolute";
		this.dom.$id = this.options.id ? "ui_ti_" + this.options.id : "ui_ti_" + Math.$random().$toString(36).$replace(/[^a-z]+/g, "").$substr(0, 8);
	}
	create() {
		if (this.isAppend) return;
		if (!this.isTextArea) this.dom.$type = this.options.type in ["text", "password"] || "text";
		for (let key in this.style) {
			if (!(key in ["top", "bottom", "left", "right"]) && this.pos == undefined)
				this.dom.$style[key] = this.style[key];
		}
		for (let attr in this.attrs) this.dom.$setAttribute(attr, this.attrs[attr]);
	}
}
SystemUI.Button = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("button");
		this.autoSet({
			size: true,
			pos: true
		});
		this.create();
		this.value = this.options.value || "$VALUE"
		this.dom.$style.$position = "absolute";
		this.dom.$id = this.options.id ? "ui_b_" + this.options.id : "ui_b_" + Math.$random().$toString(36).$replace(/[^a-z]+/g, "").$substr(0, 8);
		this.dom.$append(this.value);
	}
	create() {
		if (this.isAppend) return;
		this.dom.$type = this.options.type in ["submit", "button"] || "button";
		for (let key in this.style) {
			if (!(key in ["top", "bottom", "left", "right"]) && this.pos == undefined)
				this.dom.$style[key] = this.style[key];
		}
		for (let attr in this.attrs) {
			this.dom.$setAttribute(attr, this.attrs[attr]);
		}
	}
}
SystemUI.SelectOptions = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("select");
		this.autoSet({
			size: true,
			pos: true
		});
		this.create();
		this.dom.$style.$position = "absolute";
		this.dom.$id = this.options.id ? "ui_so_" + this.options.id : "ui_so_" + Math.$random().$toString(36).$replace(/[^a-z]+/g, "").$substr(0, 8);
		this.show();
		this.list_options = this.options.list_options || [new SystemUI.Option(this.app, this.dom.$id, {value: "Value"})];
	}
	create() {
		if (this.isAppend) return;
		for (let key in this.style) {
			if (!(key in ["top", "bottom", "left", "right"]) && this.pos == undefined)
				this.dom.$style[key] = this.style[key];
		}
		for (let attr in this.attrs) this.dom.$setAttribute(attr, this.attrs[attr]);
	}
}
SystemUI.Option = class extends SystemUI.Component {
	constructor(app, soID, options) {
		super(app, options);
		if (document.$getElementById(soID) === null) throw new Error("Select input id is not found.");
		this.so_dom = document.$getElementById(soID);
		this.dom = document.$createElement("option");
		this.create();
		this.dom.$id = this.options.id ? "ui_o_" + this.options.id : "ui_o_" + Math.$random().$toString(36).$replace(/[^a-z]+/g, "").$substr(0, 8);
		this.dom.$append(this.options.value || "");
		this.so_dom.$append(this.dom);
	}
	create() {
		if (this.isAppend) return;
		this.dom.$value = this.options.value || "";
		for (let key in this.style) {
			if (!key in ["top", "bottom", "left", "right"])
				this.dom.$style[key] = this.style[key];
		}
		for (let attr in this.attrs) this.dom.$setAttribute(attr, this.attrs[attr]);
		this.isAppend = !0;
	}
	show() {
		return;
	}
}
SystemUI.Checkbox = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("input");
		this.autoSet({
			size: true,
			pos: true
		});
		this.create();
		this.dom.$style.$position = "absolute";
		this.dom.$id = this.options.id ? "ui_cb_" + this.options.id : "ui_cb_" + Math.$random().$toString(36).$replace(/[^a-z]+/g, "").$substr(0, 8);
	}
	create() {
		if (this.isAppend) return;
		this.dom.$type = "checkbox";
		for (let key in this.style) {
			if (!key in ["top", "bottom", "left", "right"])
				this.dom.$style[key] = this.style[key];
		}
		for (let attr in this.attrs) this.dom.$setAttribute(attr, this.attrs[attr]);
	}
}
SystemUI.Radio = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("input");
		this.autoSet({
			size: true,
			pos: true
		});
		this.create();
		this.dom.$style.$position = "absolute";
		this.dom.$id = this.options.id ? "ui_ra_" + this.options.id : "ui_ra_" + Math.$random().$toString(36).$replace(/[^a-z]+/g, "").$substr(0, 8);
		this.label = new SystemUI.Label(this.app, {forID: this.dom.$id, value: this.options.value});
	}
	create() {
		if (this.isAppend) return;
		this.dom.$type = "radio";
		for (let key in this.style) {
			if (!key in ["top", "bottom", "left", "right"])
				this.dom.$style[key] = this.style[key];
		}
		for (let attr in this.attrs) this.dom.$setAttribute(attr, this.attrs[attr]);
	}
	show() {
		document.$body.$appendChild(this.dom);
		this.isAppend = true;
		this.label.show();
	}
}
SystemUI.Label = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("label");
		this.autoSet({
			pos: true
		});
		this.create();
		this.forID = this.options.forID || undefined;
		this.dom.$style.$position = "absolute";
		this.dom.$id = this.options.id ? "ui_b_" + this.options.id : "ui_b_" + Math.$random().$toString(36).$replace(/[^a-z]+/g, "").$substr(0, 8);
		if (this.attrs["for"] === undefined || this.forID !== undefined) this.dom.$setAttribute("for", this.forID);
		this.dom.$append(this.options.value || "Value");
	}
	create() {
		if (this.isAppend) return;
		for (let key in this.style) {
			if (!key in ["top", "bottom", "left", "right"])
				this.dom.$style[key] = this.style[key];
		}
		for (let attr in this.attrs) this.dom.$setAttribute(attr, this.attrs[attr]);
	}
}
SystemUI.TextField = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("span");
		this.autoSet({
			pos: true
		});
		this.dom.$style.$position = "absolute";
		this.create();
		this.dom.$id = this.options.id ? "ui_tf_" + this.options.id : "ui_tf_" + Math.$random().$toString(36).$replace(/[^a-z]+/g, "").$substr(0, 8);
		this.dom.$append(this.options.value || "$TEXT");
	}
	create() {
		if (this.isAppend) return;
		for (let key in this.style) {
			if (!(key in ["top", "bottom", "left", "right"]) && this.pos == undefined)
				this.dom.$style[key] = this.style[key];
		}
		for (let attr in this.attrs) this.dom.$setAttribute(attr, this.attrs[attr]);
	}
}
SystemUI.Popup = class extends SystemUI.Component {
	constructor(app, options) {
		super(app, options);
		this.dom = document.$createElement("div");
		this.dom.$style.$position = "absolute";
		this.autoSet({
			size: true,
			pos: true
		});
		this.options.headerTitle = this.options.headerTitle || "Popup";
		this.options.content = this.options.content || "$CONTENT_HERE";
		this.create(this.options.allowClose !== undefined ? this.options.allowClose : false);
		this.dom.$id = this.options.id ? "ui_w_" + this.options.id : "ui_w_" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 8);
		this.centered = this.options.centered !== undefined ? this.options.centered : true;
		this.centered && this.center();
		this.buttons = this.options.buttons || undefined;
		// this.loadButtons();
	}
	center(left, top, transform) {
		if (!left && (left=0.5), !top && (top=0.5), (!transform || ((transform && !Array.isArray(transform)) || transform && Array.isArray(transform) || transform.length == 2), transform=[-0.5, -0.5])) {
			this.dom.$style.$top = typeof top === "string" ? top : (100*top) + "%";
			this.dom.$style.$left = typeof left === "string" ? left : (100*left) + "%";
			for (let i=0; i < transform.length; i++) {
				if (typeof transform[i] !== "string") {
					transform[i] = 100 * transform[i] + "%";
				}
			}
			this.dom.$style.$transform = "translate(X, Y)".$replace("X", transform[0]).$replace("Y", transform[1]);
		}
	}
	create(allowClose) {
		if (this.isAppend) return;
		for (let key in this.style) {
			if (!(key in ["top", "bottom", "left", "right"]) && this.pos == undefined)
				this.dom.$style[key] = this.style[key];
		}
		for (let attr in this.attrs)
			this.dom.$setAttribute(attr, this.attrs[attr]);
		this.addClass("uiContainer");
		this.addClass("bg");
		this.addClass("uiWindow");
		if (this.options.headerTitle) {
			var titleField = document.$createElement("span");
			titleField.$style.$whiteSpace = "nowrap";
			titleField.$style.$position = "absolute";
			this.addClass("head", titleField);
			this.dom.$insertBefore(titleField, this.dom.$firstChild);
			titleField.textContent = this.options.headerTitle;
		}
		this.textContent = new SystemUI.TextField(this.app, {attrs: {"class": "text"}, style: {"word-wrap": "break-word", "position": "relative", "width": this.dom.$style.$width, "height": this.dom.$style.$height}, useClassPositions: true, value: this.options.content});
		this.dom.$insertBefore(this.textContent.dom, this.dom.$firstChild);
		if (allowClose) {
			this.closeButton = new SystemUI.Button(this.app, {attrs: {"class": "close"}, useClassPositions: true, useClassSize: true, value: "X"});
			this.dom.$appendChild(this.closeButton.dom);
			this.closeButton.dom.$onclick = (event)  => {
				this.remove();
			};
		}
	}
	// loadButtons() {
		// if (this.buttons && this.buttons.length > 0) {
		// 	for (let i=0; i < this.buttons.length; i++) {
		// 		if (this.buttons[i] instanceof SystemUI.Button)
		// 			this.$dom.appendChild(this.buttons[i].dom);
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
		this.autoSet({
			size: true,
			pos: true
		});
		this.options.headerTitle = this.options.headerTitle || "Window";
		this.create(this.options.allowClose !== undefined ? this.options.allowClose : false);
		this.dom.$id = this.options.id ? "ui_p_" + this.options.id : "ui_p_" + Math.$random().$toString(36).$replace(/[^a-z]+/g, "").$substr(0, 8);
		this.centered = this.options.centered !== undefined ? this.options.centered : true;
		this.centered && this.center();
	}
	center(left, top, transform) {
		if (!left && (left=0.5), !top && (top=0.5), (!transform || ((transform && !Array.isArray(transform)) || transform && Array.isArray(transform) || transform.length == 2), transform=[-0.5, -0.5])) {
			this.dom.$style.$top = typeof top === "string" ? top : (100*top) + "%";
			this.dom.$style.$left = typeof left === "string" ? left : (100*left) + "%";
			for (let i=0; i < transform.length; i++) {
				if (typeof transform[i] !== "string") {
					transform[i] = 100 * transform[i] + "%";
				}
			}
			this.dom.$style.$transform = "translate(X, Y)".$replace("X", transform[0]).$replace("Y", transform[1]);
		}
	}
	create(allowClose) {
		if (this.isAppend) return;
		for (let key in this.style) {
			if (!(key in ["top", "bottom", "left", "right"]) && this.pos == undefined)
				tthhis.domm.style[key];
		}
		for (let attr in this.attrs)
			this.dom.$setAttribute(attr, this.attrs[key]);
		this.addClass("uiContainer");
		this.addClass("bg");
		this.addClass("uiWindow");
		if (this.options.headerTitle) {
			var titleField = document.$createElement("span");
			titleField.$style.$whiteSpace = "nowrap";
			titleField.$style.$position = "absolute";
			this.addClass("head", titleField);
			this.dom.$insertBefore(titleField, this.dom.$firstChild);
			titleField.textContent = this.options.headerTitle;
		}
		if (allowClose) {
			this.closeButton = new SystemUI.Button(this.app, {$attrs: {"class": "close"}, $useClassPositions: true, $useClassSize: true, $value: "X"});
			this.dom.$appendChild(this.closeButton.dom);
			this.closeButton.dom.$onclick = (event)  => {
				this.remove();
			};
		}
	}
}
module.exports = SystemUI;