let Token = require("../game_engine/Token.js");
let ContainerObject = require('../game_engine/ContainerObject.js');
let GameObject = require('../game_engine/GameObject.js');

class Game extends Token {
	constructor(props) {
		super({});

		/*
			Game variables go here
		 */
		this.name = "Game";

        ACTIVE_SCENE = this.scene = new THREE.Scene();
        ACTIVE_CAMERA = this.camera = new THREE.PerspectiveCamera( 70, Settings.THREE.applicationSettings.width / Settings.THREE.applicationSettings.height, 0.01, 10 );

        ACTIVE_CAMERA.position.z = 1;

		this.physics = {
			scale: 1,
			dtElapsed: 0,
			stepAmount: 1, // amount of iterations to do per frame
			stepInterval: 1 / 60
		};

		Object.assign(this, props);
	}

	endStep(delta) {
		"use strict";
		super.endStep(delta);

		if(this.scene) {
            //this.scene.endStep(delta);

            // for (let i = 0; i < this.scene.children.length; i++) {
            //     if(this.scene.children[i].endStep)
            //         this.scene.children[i].endStep(delta);
            // }
        }

        this.testGO.rotation.x += 0.01;
        this.testGO.rotation.y += 0.01;

        //this.physicsStep(delta);
	};

	onDestroy() {
		"use strict";
		super.onDestroy();
	};

	onRemove(){
        "use strict";
		application.stage.removeChild(this.scene);
		flowController.game = null;
	}

	onAdd() {
		"use strict";
		super.onAdd();
		let self = this;

        this.light = new THREE.PointLight( 0xEEEEEE, 1, 100 );
        this.light.position.set( 2, 2, 2 );

		let geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        let material = new THREE.MeshLambertMaterial( {
            map: t_red
        } );

        this.testGO = new GameObject({
			geometry: geometry,
			material: material,
		});

        this.scene.add( this.light );
        this.scene.add( this.testGO );

		//application.stage.addChild(this.scene);
	};

	CheckCollision(obj1, obj2) {
		if (!obj1.checkCollisions || !obj2.checkCollisions) return false;

		let obj1_truePos = {
			x1: obj1.toGlobal(this.scene).x - (obj1.width * obj1.anchor.x),
			x2: obj1.toGlobal(this.scene).x - (obj1.width * obj1.anchor.x) + obj1.width,
			y1: obj1.toGlobal(this.scene).y - (obj1.height * obj1.anchor.y),
			y2: obj1.toGlobal(this.scene).y - (obj1.height * obj1.anchor.y) + obj1.height
		};

		let obj2_truePos = {
			x1: obj2.toGlobal(this.scene).x - (obj2.width * obj2.anchor.x),
			x2: obj2.toGlobal(this.scene).x - (obj2.width * obj2.anchor.x) + obj2.width,
			y1: obj2.toGlobal(this.scene).y - (obj2.height * obj2.anchor.y),
			y2: obj2.toGlobal(this.scene).y - (obj2.height * obj2.anchor.y) + obj2.height
		};

		return (obj1_truePos.x1 < obj2_truePos.x2 &&
			obj1_truePos.x2 > obj2_truePos.x1 &&
			obj1_truePos.y1 < obj2_truePos.y2 &&
			obj1_truePos.y2 > obj2_truePos.y1);
	}

	HandleCollision(obj1, obj2) {
		obj1.collisions.push(obj2);
		obj2.collisions.push(obj1);

		obj1.onCollide(obj2);
		obj2.onCollide(obj1);
	}

	physicsStep(dt) {
		this.physics.dtElapsed += dt;

		if (this.physics.dtElapsed >= this.physics.stepInterval) {
			this.physics.dtElapsed = 0;
			// for (let i = 0; i < this.physics.stepAmount; i++) {
			// 	for (let o = 0; o < this.scene.children.length; o++) {
			// 		this.scene.children[o].collisions = [];
            //
             //        // coll = this.CheckCollision(this.player_right, this.scene.children[o]);
             //        // if(coll){
             //        //     this.HandleCollision(this.player_right, this.scene.children[o]);
             //        // }
            //
			// 		if(this.scene.children[o].physicsStep)
			// 			this.scene.children[o].physicsStep(dt);
            //
			// 	}
			// }
		}
	}

	// Quits the game
	quit() {
		"use strict";
		this.destroy();
	}
}

module.exports = Game;