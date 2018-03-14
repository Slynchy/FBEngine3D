
global._ATLAVER = '1.0.0';

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
String.prototype.generateUID = function() {
	let hash = 0, i, chr;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
		chr   = this.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return Math.floor(hash * Math.random());
  };

global.renderScale = (x)=>{
	return (x*Settings.PIXI.applicationSettings.renderScale);
};

/*
	SETTINGS INITIALIZATION
*/

global.FBINSTANT_INFO = {
    contextId: null,
    contextType: null,
    playerInfo: {
        displayName: null,
        id: null,
    }
};

const Settings = require("./code/Settings/Settings.js");
global.Settings = Settings;

/*
	GAMESPARKS INITIALIZATION
*/

const Leaderboards = require("./code/game_engine/gamesparks/FBLeaderboards.js");
global.Leaderboards = Leaderboards;

/*
	AD API INITIALIZATION
*/

const AdAPI = require("./code/game_engine/Adverts.js");
global.AdAPI = AdAPI;

/*
	SAVE DATA INITIALIZATION
*/

const SaveData = require("./code/game_engine/SaveData.js");
global.SaveData = SaveData;


/*
	PIXI INITIALIZATION
*/

const THREE = require("three");
global.THREE = THREE;

/*
	AUDIO INIT
*/

const AudioAPI = require("./code/game_engine/Audio.js");
global.AudioAPI = AudioAPI;


/*
	ANALYTICS INITIALIZATION
*/

const Analytics = require("./code/game_engine/Analytics.js");
global.Analytics = Analytics;

/*
	EASING INITIALIZATION
 */

const Easing = require('./code/game_engine/Easing.js');
global.Easing = Easing;

/*
	APPLICATION INITIALIZATION
*/

function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}
global.lerp = lerp;

global.tokens = [];

// const application = new PIXI.Application(Settings.PIXI.applicationSettings);
// global.application = application;
// application.renderer.backgroundColor = Settings.PIXI.applicationSettings.backgroundColor;
// document.body.appendChild(application.view);
// SetRendererProperties(application.renderer.view);
// PIXI.settings.SCALE_MODE = Settings.PIXI.applicationSettings.scaleMode;
// //application.ticker.scale = 0.001;
// application.ticker.minFPS = 60;
// application.ticker.add(MainLoop);
const application = {
	renderer: new THREE.WebGLRenderer( { antialias: Settings.THREE.applicationSettings.antialias } )
};
global.application = application;
document.body.appendChild( application.renderer.domElement );

global.ACTIVE_CAMERA = null;
global.ACTIVE_SCENE = null;

window.addEventListener('resize', function(){
	onResize();
});

const flowController = require("./code/game_logic/flowController.js");
global.flowController = flowController;


/*
	FUNCTIONS INITIALIZATION
*/

function SetRendererProperties(rendererView){
	"use strict";
	//rendererView.style = Object.assign(rendererView.style, Settings.PIXI.styleSettings);
}

function resizeCanvasToDisplaySize(force) {
    const canvas = application.renderer.domElement;
    // look up the size the canvas is being displayed
    const width = Settings.THREE.applicationSettings.width;
    const height = Settings.THREE.applicationSettings.height;

    // adjust displayBuffer size to match
    if (force || canvas.width !== width || canvas.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        application.renderer.setSize(width, height, false);

        if(ACTIVE_CAMERA){
            ACTIVE_CAMERA.aspect = width / height;
            ACTIVE_CAMERA.updateProjectionMatrix();
		}

        // update any render target sizes here
    }
}

function onResize(renderer) {
    resizeCanvasToDisplaySize(true);
}

function AddToken(token){
	tokens.push(token);
	if(token.onAdd) token.onAdd();
	return tokens[tokens.length-1];
}

function RemoveToken(token){
	for(let i = 0; i < tokens.length; i++){
		if(tokens[i].uid === token.uid){
			tokens[i]._queuedForDestruction = true;
			if(tokens[i].onRemove)
				tokens[i].onRemove();
			return;
		}
	}
}
global.AddToken = AddToken;
global.RemoveToken = RemoveToken;

/*
	MAIN CODE INITIALIZATION
*/

/*
    This gives us more accurate delta time... possibly
    Set to false or null to disable
 */
let deltaExperimental = Date.now();

function MainLoop (delta) {
	"use strict";

	let deltaTime = 16;

	if(deltaExperimental){
		deltaTime = (Date.now() - deltaExperimental);
		deltaExperimental = Date.now();
	}

    resizeCanvasToDisplaySize(true);

	if(flowController.currentAction)
		flowController.currentAction();

	for(let i = 0; i < tokens.length; i++){
		if(!tokens[i]._queuedForDestruction && tokens[i].startStep){
			tokens[i].startStep(deltaTime);
		}
	}
	for(let i = 0; i < tokens.length; i++){
		if(!tokens[i]._queuedForDestruction && tokens[i].endStep){
			tokens[i].endStep(deltaTime);
		}
	}
	for(let i = (tokens.length-1); i >= 0; i--){
		if(tokens[i]._queuedForDestruction){
			tokens[i] = null;
			tokens.splice(i,1);
		}
	}

	if(ACTIVE_SCENE && ACTIVE_CAMERA)
		application.renderer.render( ACTIVE_SCENE, ACTIVE_CAMERA );
}

resizeCanvasToDisplaySize(true);
application.renderer.animate(MainLoop);