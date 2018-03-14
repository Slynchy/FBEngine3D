let game = require("../game_logic/game.js");


const RENDERSCALE = 1;

let renderScale = (x)=>{
	return (x*RENDERSCALE);
};

let Settings = function() {
	this.init();
};

Settings.prototype.init = function(){

    this.DEBUG = {
        suppressLoadingLogs: false,
    };

	this.SaveData = {
	    defaultSaveData:{
	        highScore: 0,
			currency: 0
        }
    };

    /**
	 * @deprecated
     */
	this.GameSparks = {
        key: '',
        secret: '',
        logger: console.log,
        debug: false,
		offlineMode: true,
    };

	this.THREE = {};

	this.THREE.applicationSettings = {
	// REQUIRED
		width: 790,
		height: 1280,
		backgroundColor: 0xb20000,
		scaleMode: 1, // 0 == linear, 1 == nearest

		antialias: true,
		renderScale: RENDERSCALE
	};
	this.THREE.applicationSettings.width *= this.THREE.applicationSettings.renderScale;
	this.THREE.applicationSettings.height *= this.THREE.applicationSettings.renderScale;

	this.THREE.styleSettings = {
		width: window.innerWidth,
		height: window.innerHeight,
		// position: 'fixed',
		// //maxWidth: '100%',
		// //maxHeight: '100%',
		// left: '50%',
		// top: '50%',
		// transform: 'translate3d( -50%, -50%, 0 )',
		//SCALE_MODE: PIXI.SCALE_MODES.NEAREST,
	};

	this.GameSettings = {

	};

	this.Analytics = {
	    enabled: false,
        mode: 'FBINSTANT', // options: FBINSTANT or GOOGLE
		tid: '',
		debug: false,
		url: 'https://www.google-analytics.com/collect?' // deprecated
	};

	this.resources = {
        images: [],
        textures: {
            t_red: 'red.png'
    	},
		objects: [],
		materials: []
	};

	this.Leaderboards = {
		leaderboard_names: ['Global'],
        offlineMode: true
	};

	this.audioSettings = {
		globalVolume: 1.0,
		sfxVolume: 1.0, // unusued
		musicVolume: 1.0, // unused
	};

	this.flowSettings = {
		gameToken: game
	};

    this.adverts = {
        placementId: '1947497265503945_1963872853866386',
        enabled: false
    }

};

module.exports = (new Settings());