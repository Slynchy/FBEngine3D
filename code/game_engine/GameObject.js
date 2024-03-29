let THREE = require("three");

class GameObject extends THREE.Mesh {
	constructor(props){
		"use strict";
		super();

		this.parentScene = null;

		this.uid = parseInt(Math.random().toString().slice(2));

		this._vX = 0;
		this._vY = 0;

		this.tag = "GameObject";

		this._isVisible = false;

		this.checkCollisions = true;

		this.collisions = [];

		this._isFrozen = false;

        this._addChild = this.addChild;
        this.addChild = (obj)=>{
            if(obj.onAdd) obj.onAdd(this);
            this._addChild(obj);
        };

        this._removeChild = this.removeChild;
        this.removeChild = (obj)=>{
            if(obj.onRemove) obj.onRemove();
            this._removeChild(obj);
        };

		if(props)
			Object.assign(this, props);
	}

	static smartScale(x,y){
		"use strict";
		if(this.width === 0 || this.height === 0) {
			console.error('divide by zero!');
			return;
		}

		if(x) {
            this.scale.x = x / this.width;
            if(!y){
                this.scale.y = this.scale.x;
			}
        }
        if(y) {
            this.scale.y = y / this.height;
            if(!x){
                this.scale.x = this.scale.y;
            }
        }
	}

	get isFrozen(){
		return this._isFrozen;
	}

	get vX() {
		return this._vX;
	}

	set vX(val) {
		this._vX = val;
	}

	get vY() {
		return this._vY;
	}

	set vY(val) {
		this._vY = val;
	}

    freeze(){
        this._isFrozen = true;
    }

    unfreeze(){
        this._isFrozen = false;
    }

	set x(val) {
		this.position.x = val;
	}

	set y(val) {
		this.position.y = val;
	}

	get x() {
		return this.position.x;
	}

	get y() {
		"use strict";
		return this.position.y;
	}

    set z(val) {
        this.zOrder = val;
    }

    get z() {
        return this.zOrder;
    }

	hide(){
		"use strict";
		this.alpha = 0;
		this._isVisible = false;
	}

	show(){
		"use strict";
		this.alpha = 1;
		this._isVisible = this.isVisible;
	}

	updateTexture(texture){
		let storedXscale = this.scale.x;
		let storedYscale = this.scale.y;
		this.texture = texture;
		this.scale.x = storedXscale;
		this.scale.y = storedYscale;
	}

	get isVisible(){
		"use strict";
		let result = true;

		// if(this.parentScene){
		// 	if(
		// 		this.x < this.parentScene.position.x + Settings.PIXI.applicationSettings.width &&
		// 		this.x + this.texture.width > this.parentScene.position.x &&
		// 		this.y < this.parentScene.position.y + Settings.PIXI.applicationSettings.height &&
		// 		this.y + this.texture.height > this.parentScene.position.y
		// 	){
		// 		result = true;
		// 	}
		// 	else result = false;
		// } else if(this.alpha > 0){
		// 	result = true;
		// }

		if(this.alpha <= 0){
			result = false;
		}

		this._isVisible = result;
		return result;
	}

	onAdd(scene){
		"use strict";
		this.parentScene = scene;
	}

	onDestroy(){/* To be overridden*/}
    onRemove(){/* To be overridden*/}

	destroy(){
		if(this.onDestroy)
			this.onDestroy();
		if(this.parentScene)
			this.parentScene.removeChild(this);
	}

	endStep(){
        if(this.isFrozen) return;
	}

	onCollide(){

	}

	physicsStep(){

	}
}

module.exports = GameObject;