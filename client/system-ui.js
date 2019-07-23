class SystemUI {
	constructor() {
	}
}

SystemUI.Component = class {
	constructor(app, size, pos, settings) {
		this.app = app || null;
		this.size = size || {w: 0, h: 0};
		this.pos = pos || {x: 0, y: 0};
		this.settings = settings || {};
		this.style = this.settings.style || {position: "absolute"};
		this.attrs = this.settings.attrs || {};
		this.dom = null;
		this.isAppend = !1;
	}
	show() {
		document.body.appendChild(this.dom);
		this.isAppend = !0;
	}
	delete() {
		this.dom.remove();
		this.isAppend = !1;
	}
	addClass(className, dom) {
		dom = dom || this.dom;
		if (dom.getAttribute("class") === null) {
			dom.setAttribute("class", className);
			return;
		}
		let list = dom.getAttribute("class").split(" ");
		list.push(className);
		dom.setAttribute("class", list.join(" "));
	}
	removeClass(className, dom) {
		dom = dom || this.dom;
		if (dom.getAttribute("class") === null) return;
		let list = dom.getAttribute("class").split(" ");
		if (className in list) {
			let i = list.indexOf(className);
			delete list[i];
		}
		dom.setAttribute("class", list.join(" "));
	}
}
SystemUI.TextInput = class extends SystemUI.Component {
	constructor(app, size, pos, settings) {
		super(app, size, pos, settings);
		this.dom = document.createElement(this.isTextArea ? "textarea" : "input");
		if ((this.settings.useClassesSize !== undefined && !this.settings.useClassesSize) || !this.settings.useClassesSize) {
			this.dom.style.width = "string" === typeof this.size.w ? this.size.w : this.size.w + "px";
			this.dom.style.height = "string" === typeof this.size.h ? this.size.h : this.size.h + "px";
		}
		if ((this.settings.useClassesPositions !== undefined && !this.settings.useClassesPositions) || !this.settings.useClassesPositions) {
			this.dom.style.top = this.pos.x + "px";
			this.dom.style.left = this.pos.y + "px";
		}
		this.create();
		this.dom.style.position = "absolute";
		this.isTextArea = this.settings.textarea || false;
		this.dom.id = this.settings.id ? "ui_ti_" + this.settings.id : "ui_ti_" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 8);
	}
	create() {
		if (this.isAppend)
			return;
		if (!this.isTextArea) 
			this.dom.type = this.settings.type in ["text", "password"] || "text";
		for (let key in this.style) {
			if (!(key in ["top", "bottom", "left", "right"]))
				this.dom.style[key] = this.style[key];
		}
		for (let attr in this.attrs) {
			this.dom.setAttribute(attr, this.attrs[attr]);
		}
	}
}
SystemUI.Button = class extends SystemUI.Component {
	constructor(app, size, pos, settings) {
		super(app, size, pos, settings);
		this.dom = document.createElement("button");
		if ((this.settings.useClassesSize !== undefined && !this.settings.useClassesSize) || !this.settings.useClassesSize) {
			this.dom.style.width = "string" === typeof this.size.w ? this.size.w : this.size.w + "px";
			this.dom.style.height = "string" === typeof this.size.h ? this.size.h : this.size.h + "px";
		}
		if ((this.settings.useClassesPositions !== undefined && !this.settings.useClassesPositions) || !this.settings.useClassesPositions) {
			this.dom.style.top = this.pos.x + "px";
			this.dom.style.left = this.pos.y + "px";
		}
		this.create();
		this.dom.style.position = "absolute";
		this.dom.id = this.settings.id ? "ui_b_" + this.settings.id : "ui_b_" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 8);
	}
	create() {
		if (this.isAppend)
			return;
		this.dom.type = this.settings.type in ["submit", "button"] || "button";
		for (let key in this.style) {
			if (!key in ["top", "bottom", "left", "right"]) 
				this.dom.style[key] = this.style[key];
		}
		for (let attr in this.attrs) 
			this.dom.setAttribute(attr, this.attrs[attr]);
	}
}
SystemUI.Option = class extends SystemUI.Component {
	constructor(app, size, pos, soID, settings) {
		super(app, size, pos, settings);
		if (document.getElementById(soID) === null) {
			throw new Error("Select input id is not found.");
		}
		this.so_dom = document.getElementById(soID);
		this.create();
		this.dom.id = this.settings.id ? "ui_o_" + this.settings.id : "ui_o_" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 8);
		this.isAppend = !1;
		this.dom.append(this.settings.value || "");
		this.so_dom.append(this.dom);
	}
	create() {
		if (this.isAppend)
			return;
		this.dom = document.createElement("option");
		this.dom.value = this.settings.value || "";
		for (let key in this.style) {
			if (!key in ["top", "bottom", "left", "right"]) 
				this.dom.style[key] = this.style[key];
		}
		for (let attr in this.attrs) 
			this.dom.setAttribute(attr, this.attrs[attr]);
		this.isAppend = !0;
	}
	show() {
		return;
	}
}
SystemUI.SelectOptions = class extends SystemUI.Component {
	constructor(app, size, pos, settings) {
		super(app, size, pos, settings);
		this.dom = document.createElement("select");
		if ((this.settings.useClassesSize !== undefined && !this.settings.useClassesSize) || !this.settings.useClassesSize) {
			this.dom.style.width = "string" === typeof this.size.w ? this.size.w : this.size.w + "px";
			this.dom.style.height = "string" === typeof this.size.h ? this.size.h : this.size.h + "px";
		}
		if ((this.settings.useClassesPositions !== undefined && !this.settings.useClassesPositions) || !this.settings.useClassesPositions) {
			this.dom.style.top = this.pos.x + "px";
			this.dom.style.left = this.pos.y + "px";
		}
		this.create();
		this.dom.style.position = "absolute";
		this.dom.id = this.settings.id ? "ui_so_" + this.settings.id : "ui_so_" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 8);
		this.options = this.settings.options || [new SystemUI.Option(app, size, pos, this.dom.id, {value: "Value"})]
	}
	create() {
		if (this.isAppend)
			return;
		for (let key in this.style) {
			if (!key in ["top", "bottom", "left", "right"]) 
				this.dom.style[key] = this.style[key];
		}
		for (let attr in this.attrs) 
			this.dom.setAttribute(attr, this.attrs[attr]);
	}
}
SystemUI.Label = class extends SystemUI.Component {
	constructor(app, size, pos, settings) {
		super(app, size, pos, settings);
		this.dom = document.createElement("label");
		if ((this.settings.useClassesSize !== undefined && !this.settings.useClassesSize) || !this.settings.useClassesSize) {
			this.dom.style.width = "string" === typeof this.size.w ? this.size.w : this.size.w + "px";
			this.dom.style.height = "string" === typeof this.size.h ? this.size.h : this.size.h + "px";
		}
		if ((this.settings.useClassesPositions !== undefined && !this.settings.useClassesPositions) || !this.settings.useClassesPositions) {
			this.dom.style.top = this.pos.x + "px";
			this.dom.style.left = this.pos.y + "px";
		}
		this.create();
		this.forID = this.settings.forID || undefined;
		this.dom.style.position = "absolute";
		this.dom.id = this.settings.id ? "ui_b_" + this.settings.id : "ui_b_" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 8);
		if (this.attrs["for"] === undefined || this.forID !== undefined) 
			this.dom.setAttribute("for", this.forID);
		this.dom.append(this.settings.value || "Value");
	}
	create() {
		if (this.isAppend)
			return;
		for (let key in this.style) {
			if (!key in ["top", "bottom", "left", "right"]) 
				this.dom.style[key] = this.style[key];
		}
		for (let attr in this.attrs) 
			this.dom.setAttribute(attr, this.attrs[attr]);
	}
}
SystemUI.Checkbox = class extends SystemUI.Component {
	constructor(app, size, pos, settings) {
		super(app, size, pos, settings);
		this.dom = document.createElement("input");
		this.dom.style.top = this.pos.x + "px";
		this.dom.style.left = this.pos.y + "px";
		this.create();
		this.dom.style.position = "absolute";
		this.dom.id = this.settings.id ? "ui_cb_" + this.settings.id : "ui_cb_" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 8);
	}
	create() {
		if (this.isAppend)
			return;
		this.dom.type = "checkbox";
		for (let key in this.style) {
			if (!key in ["top", "bottom", "left", "right"]) 
				this.dom.style[key] = this.style[key];
		}
		for (let attr in this.attrs) 
			this.dom.setAttribute(attr, this.attrs[attr]);
	}
}
SystemUI.Radio = class extends SystemUI.Component {
	constructor(app, size, pos, settings) {
		super(app, size, pos, settings);
		this.dom = document.createElement("input");
		this.dom.style.top = this.pos.x + "px";
		this.dom.style.left = this.pos.y + "px";
		this.create();
		this.dom.style.position = "absolute";
		this.dom.id = this.settings.id ? "ui_ra_" + this.settings.id : "ui_ra_" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 8);
	}
	create() {
		if (this.isAppend)
			return;
		this.dom.type = "radio";
		for (let key in this.style) {
			if (!key in ["top", "bottom", "left", "right"]) 
				this.dom.style[key] = this.style[key];
		}
		for (let attr in this.attrs) 
			this.dom.setAttribute(attr, this.attrs[attr]);
	}
}
SystemUI.TextField = class extends SystemUI.Component {
	constructor(app, size, pos, settings) {
		super(app, size, pos, settings);
		this.dom = document.createElement("span");
		if ((this.settings.useClassesSize !== undefined && !this.settings.useClassesSize) || !this.settings.useClassesSize) {
			this.dom.style.width = "string" === typeof this.size.w ? this.size.w : this.size.w + "px";
			this.dom.style.height = "string" === typeof this.size.h ? this.size.h : this.size.h + "px";
		}
		if ((this.settings.useClassesPositions !== undefined && !this.settings.useClassesPositions) || !this.settings.useClassesPositions) {
			this.dom.style.top = this.pos.x + "px";
			this.dom.style.left = this.pos.y + "px";
		}
		this.create();
		this.dom.style.position = "absolute";
		this.dom.id = this.settings.id ? "ui_tf_" + this.settings.id : "ui_tf_" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 8);
		this.dom.append(this.settings.value || "$TEXT");
	}
	create() {
		if (this.isAppend)
			return;
		for (let key in this.style) {
			if (!(key in ["top", "bottom", "left", "right"]))
				this.dom.style[key] = this.style[key];
		}
		for (let attr in this.attrs) {
			this.dom.setAttribute(attr, this.attrs[attr]);
		}
	}
}
SystemUI.Window = class extends SystemUI.Component {
	constructor(app, size, pos, settings) {
		super(app, size, pos, settings);
		this.dom = document.createElement("div");
		this.dom.style.position = "absolute";
		this.dom.style.minWidth = "string" === typeof size.w ? size.w : size.w + "px";
		this.dom.style.minHeight = "string" === typeof size.h ? size.h : size.h + "px";
		if (!this.settings.maxSize) {
			let pH = "string" === typeof size.h ? size.h.replace(/[0-9-.-]/g, "") : "";
			let pW = "string" === typeof size.w ? size.w.replace(/[0-9-.-]/g, "") : "";
			let mH = "string" === typeof size.h ? (size.h.replace(/[^0-9-.-]/g, "")) * 2 + pH : size.h * 2 + "px";
			let mW = "string" === typeof size.w ? (size.w.replace(/[^0-9-.-]/g, "")) * 2 + pW : size.w * 2 + "px";
			if (this.settings.allowAutoMaxWidth || true) this.dom.style.maxWidth = mW;
			if (this.settings.allowAutoMaxHeight || false) this.dom.style.maxHeight = mH;
		} else {
			if (this.settings.maxSize.w && this.settings.maxSize.h) {
				this.dom.style.maxWidth = "string" === typeof this.settings.maxSize.w ? this.settings.maxSize.w : this.settings.maxSize.w + "px";
				this.dom.style.maxHeight = "string" === typeof this.settings.maxSize.h ? this.settings.maxSize.h : this.settings.maxSize.h + "px";
			}
		}
		this.settings.headerTitle = this.settings.headerTitle || "Popup";
		this.settings.content = this.settings.content || "$CONTENT_HERE";
		this.create(this.settings.allowClose || false);
		this.isAppend = !1;
		this.dom.id = this.settings.id ? "ui_w_" + this.settings.id : "ui_w_" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 8);
		this.centered = this.settings.centered || true;
		this.centered && this.center();
		if (!this.centered) {
			this.dom.style.left = pos.x + "px";
			this.dom.style.top = pos.y + "px";
		}
		this.isAppend = !1;
	}
	center(left, top, transform) {
		if (!left && (left=0.5), !top && (top=0.5), (!transform || ((transform && !Array.isArray(transform)) || transform && Array.isArray(transform) || transform.length == 2), transform=[-0.5, -0.5])) {
			this.dom.style.top = typeof top === "string" ? top : (100*top) + "%";
			this.dom.style.left = typeof left === "string" ? left : (100*left) + "%";
			for (let i=0; i < transform.length; i++) {
				if (typeof transform[i] !== "string") {
					transform[i] = 100 * transform[i] + "%";
				}
			}
			this.dom.style.transform = "translate(X, Y)".replace("X", transform[0]).replace("Y", transform[1]);
		}
	}
	create(allowClose) {
		if (this.isAppend) 
			return;
		for (let key in this.style) {
			if (!key in ["top", "bottom", "left", "right"]) 
				this.dom.style[key] = this.style[key];
		}
		for (let attr in this.attrs) 
			this.dom.setAttribute(attr, this.attrs[attr]);
		this.addClass("uiContainer");
		this.addClass("bg");
		this.addClass("uiWindow");
		if (this.settings.headerTitle) {
			var titleField = document.createElement("span");
			titleField.style.whiteSpace = "nowrap";
			titleField.style.position = "absolute";
			this.addClass("head", titleField);
			this.dom.insertBefore(titleField, this.dom.firstChild);
			titleField.textContent = this.settings.headerTitle;
		}
		this.textContent = new SystemUI.TextField(app, undefined, undefined, {attrs: {"class": "text"}, useClassesPositions: true, useClassesSize: true, value: this.settings.content});
		this.dom.insertBefore(this.textContent.dom, this.dom.firstChild);
		if (allowClose) {
			this.closeButton = new SystemUI.Button(app, undefined, undefined, {attrs: {"class": "close"}, useClassesPositions: true, useClassesSize: true});
			this.closeButton.dom.append("X");
			this.dom.appendChild(this.closeButton.dom);
			this.closeButton.dom.onclick = function(event) {
				this.delete();
			};
		}
	}
}