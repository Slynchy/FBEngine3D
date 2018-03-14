let FlowController = function () {
	this.finishedLoading = false;
	this.game = null;

	this.currentAction = this.main;
};

FlowController.prototype.log = function (data) {
	return console.log("[flowController] " + data);
};

FlowController.prototype.main = function () {
	"use strict";
	// ENTRY POINT
	console.log('[flowController] main');
	let self = this;

	if (typeof(FBInstant) === 'undefined') {
		global.FBInstant = null;
	} else {
        global.FBINSTANT_INFO = null;
	}

	this.currentAction = this.startLoading;
};

FlowController.prototype.startLoading = function () {
    "use strict";
    console.log("[flowController] startLoading");

    let self = this;
    //let length = Object.keys(Settings.resources).length;
    //this.loadingProgress = 0;

    THREE.DefaultLoadingManager.onLoad = ( )=>{


        this.finishedLoading = true;
        this.loadingProgress = 100;

    };

    // load textures
    let texLoader = new THREE.TextureLoader();
    for(let k in Settings.resources.textures){

        let url = './assets/' + Settings.resources.textures[k];

        texLoader.load(
            // resource URL
            url,

            // onLoad callback
            function ( texture ) {
                // in this example we create the material when the texture is loaded
                global[ k ] = texture;
            },

            // onProgress callback currently not supported
            undefined,

            // onError callback
            function ( err ) {
                console.error( err );
            }
        );
    }

    this.currentAction = this.initializeAsync;
};

FlowController.prototype.initializeAsync = function() {
	"use strict";
	let self = this;

    if (FBInstant) {
        this.currentAction = this.waitForFBInstant;
        FBInstant.initializeAsync()
            .then(function () {
                console.log("[flowController] initializeAsync resolved");
                console.log("[flowController] Initializing ad api");
                AdAPI.initialize(function () {
                    console.log("[flowController] AdAPI initialized");
                    self.currentAction = self.initializeSaveData;
                });
            })
            .catch(err => {
                console.error(err);
            })
    } else {
        console.log("[flowController] FBInstant not detected; running offline... (no savedata)");
        this.currentAction = this.waitForLoading;
    }
};

FlowController.prototype.waitForFBInstant = function() {
    "use strict";
};

FlowController.prototype.initializeSaveData = function () {
	"use strict";
	console.log('[flowController] initializeSaveData');
	let self = this;
    this.currentAction = this.waitForSaveData;
	SaveData.initialize(
	    function () {
		    self.currentAction = self.waitForLoading;
	    },
        function () {
            self.currentAction = self.waitForLoading;
        }
	);
};

FlowController.prototype.waitForSaveData = function () {
	"use strict";
};

FlowController.prototype.waitForLoading = function () {
    "use strict";
    if (!Settings.DEBUG.suppressLoadingLogs)
        console.log("[flowController] waitForLoading");

    if (this.finishedLoading === true) {
        if (FBInstant) {
            FBInstant.setLoadingProgress(100);
        }
        this.currentAction = this.startGameAsync;
    } else {
        if (FBInstant) {
            FBInstant.setLoadingProgress(this.loadingProgress);
        }
    }
};

FlowController.prototype.startGameAsync = function () {
    "use strict";
    let self = this;
    console.log("[flowController] startGameAsync");

    if (FBInstant) {
        this.currentAction = this.waitForStartGameAsync;
        FBInstant.startGameAsync()
            .then(() => {
                self.currentAction = self.startLeaderboards;

                global.FBINSTANT_INFO = {
                    contextId: FBInstant.context.getID(),
                    contextType: FBInstant.context.getType(),
                    playerInfo: {
                        displayName: FBInstant.player.getName(),
                        id: FBInstant.player.getID(),
                    }
                };
            });
    } else {
        this.currentAction = self.startLeaderboards;
    }

};

FlowController.prototype.waitForStartGameAsync = function () {
	"use strict";
};

FlowController.prototype.startLeaderboards = function () {
	"use strict";
    let self = this;
	console.log("[flowController] startLeaderboards");
	self.currentAction = self.waitForLeaderboards;
	Leaderboards.init(() => {
		console.log("[flowController] Leaderboard initialized");
		self.currentAction = self.showSplashScreen;
	});
};

FlowController.prototype.waitForLeaderboards = function () {
	"use strict";
};

FlowController.prototype.showSplashScreen = function () {
	"use strict";
	console.log("[flowController] showSplashScreen");

	// TODO: splash screen

    this.showMainMenu();
};

FlowController.prototype.showMainMenu = function () {
	"use strict";
	console.log("[flowController] showMainMenu");

	let self = this;

	if(!Settings.flowSettings.mainMenuToken){
        this.currentAction = this.enterGame;
        return;
    }

    if(this.game)
    {
        RemoveToken(this.game);
        this.game = null;
    }

    if(!this.mainMenu)
    {
        this.mainMenu = AddToken(new Settings.flowSettings.mainMenuToken());
        this.mainMenu.onPlay = function () {
            // TODO: add onplay
            RemoveToken(self.mainMenu);
            self.mainMenu = null;
            self.currentAction = self.enterGame;
        };

        this.mainMenu.onSkins = function(){
            self.showSkinsMenu();
            self.mainMenu.bottomDialog.hide();
        }
    }
    else{
        this.mainMenu.bottomDialog.show();
    }
    this.currentAction = this.onMainMenu;
};

FlowController.prototype.onMainMenu = function () {
};

FlowController.prototype.showSkinsMenu = function () {
	"use strict";
	console.log("[flowController] showSkinsMenu");

	let self = this;

	if(!Settings.flowSettings.skinsMenuToken){
        return;
    }

    this.skinsMenu = AddToken(new Settings.flowSettings.skinsMenuToken());
    this.skinsMenu.onExit = function () {
        // TODO: add onplay
        RemoveToken(self.skinsMenu);
        self.skinsMenu = null;
        self.showMainMenu();
    };

    this.currentAction = this.onSkinsMenu;
};

FlowController.prototype.onSkinsMenu = function () {
};

FlowController.prototype.onLeaderboards = function () {
};

FlowController.prototype.showGameOver = function () {
    "use strict";
    console.log("[flowController] showGameOver");

    let self = this;

    RemoveToken(this.game);
    this.game = null;

    this.gameOver = AddToken(new Settings.flowSettings.gameOverToken({
        onExit: ()=>{
            RemoveToken(self.gameOver);
            self.gameOver = null;
            self.showMainMenu();
        },
        onRetry: ()=>{
            self.currentAction = self.inGame;
            RemoveToken(self.gameOver);
            self.gameOver = null;
            self.enterGame();
        },
    }));
    this.currentAction = this.onGameOver;
};

FlowController.prototype.onGameOver = function () {
};

FlowController.prototype.enterGame = function () {
	"use strict";
    console.log("[flowController] enterGame");
    this.game = AddToken(new Settings.flowSettings.gameToken());
    this.currentAction = this.inGame;
};

FlowController.prototype.inGame = function () {
	"use strict";
};

module.exports = new FlowController();