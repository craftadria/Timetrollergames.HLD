// SOUL_Photosphere360.js
// Author: Soul - soulxregalia.wordpress.com
// Credits: Bjørn Sandvik - Photosphere for ThreeJS tutorial

/*:
* @plugindesc Creates a 360 Degrees Photosphere effect.
* @author Soul - soulxregalia.wordpress.com
*
* @param DIRECTORY
* 
* @param Image Directory URL
* @desc The default url / directory for all images used for Photospheres.
Default: img/pictures /
* @default img/pictures/
*
* @param SCENE DEFAULTS
* 
* @param Scene Left Button
* @desc The default left control button keymap you use.
Default: left
* @default left
* 
* @param Scene Right Button
* @desc The default right control button keymap you use.
Default: right
* @default right
* 
* @param Scene Up Button
* @desc The default up control button keymap you use.
Default: up
* @default up
* 
* @param Scene Down Button
* @desc The default down control button keymap you use.
Default: down
* @default down
*
* @param SPRITESET DEFAULTS
* 
* @param Spriteset Left Button
* @desc The default left control button keymap you use.
Default: left
* @default left
* 
* @param Spriteset Right Button
* @desc The default right control button keymap you use.
Default: right
* @default right
* 
* @param Spriteset Up Button
* @desc The default up control button keymap you use.
Default: up
* @default up
* 
* @param Spriteset Down Button
* @desc The default down control button keymap you use.
Default: down
* @default down
*
* @param CHANGABLE DEFAULTS
* 
* @param Orbit Speed
* @desc The default orbit speed when you use your keys. (changable via plugin command) Default: 0.01
* @default 0.01
* 
* @param Auto Orbit Speed
* @desc The default auto rotate orbit speed when you are not using your keys.
Default: 0.001
* @default 0.001
*

@help

RPG Maker MV 360 Photosphere Effect Plugin
By: Soul - soulxregalia.wordpress.com

Installation:
After placing this plugin on your js/plugins folder, you must
place the following js plugins under your js/plugins folder:

three.js
Detector.js

These two must be ABOVE the 360 Photosphere plugin.

If you do not have the plugin,
You can download the three.js in their official site:
https://threejs.org/


ADDITIONAL INFO:

What's the best photo to be uploaded and used for this scene?
> A panoramic photo or a photo in the power of twos. Don't upload small ones
because it would be pixelated. You can also use equirectangular photographs.
They will be seamless when they are wrapped around the sphere.

This does not support the ff yet:
 - 2 button combination
 - Mouse (Orbit Controls feels really weird with MV)
 - Tiling

USING YANFLY'S CUSTOM KEYBOARD FUNCTIONS?

If you're using yanfly's custom keyboard functions, remember to type the same
control name of the keymap in the Scene or Spriteset Control. For example, if
you want to use WASD in controlling the orbit of the sphere, you use whatever
you used with Yanfly's plugin. So if you want to use the WASD, use W A S D keys
in the controls.

Place all the images under your specified directory. If you are using a non existent folder,
create it.

PLUGIN COMMANDS:

If you want to display the photosphere via scene:

Soul : Photosphere : Scene : imageName: autoOrbit : width : height : Start

If you want to display the photosphere via spriteset:

Soul : Photosphere : Spriteset : Setup : imageName : autoOrbit : width : height : x : y

where imageName is the name of the image used. Make sure you add the file extension as well.
where autoOrbit if you want to make the orbiting automatic or not. true or false only.
where width is the screen width for the renderer panel
where height is the screen height for the renderer panel
where x is the x position of the photosphere on the screen
where y is the y position of the photosphere on the screen

example:
SCENE:
Soul : Photosphere : Scene : comfyroom.jpg : true : Start

SPRITESET:
Soul : Photosphere : Spriteset : Setup : comfyroom.jpg : true : 512 : 512

However, if you're placing it on the spriteset, it doesn't automatically gets itself
added. You have to add it. Use the plugin command

Soul : Photosphere : Spriteset : Show

to show the photosphere or use

Soul : Photosphere : Spriteset : Hide

to hide the photosphere.

So if you, say, want to display it via spriteset, the whole plugin command set would be:
Soul : Photosphere : Spriteset : Setup : comfyroom.jpg : true : 512 : 512
Soul : Photosphere : Spriteset : Show

If you want to change the orbit speed when you use your keys, use this plugin command:

Soul : Photosphere : OrbitSpeed : speedNumber

where speedNumber is the speed value you want for the manual orbit.

Example:

Soul : Photosphere : OrbitSpeed : 0.01

If you want to change the automatic orbit speed, use this plugin command:

Soul : Photosphere : AutoOrbitSpeed : speedNumber

where speedNumber is the speed value you want for the automatic orbit.

ARE YOU USING A PARALLAX MAPPING PLUGIN?

Make sure that this plugin is ABOVE any plugin that has to do with maps.

Credits to Bjørn Sandvik for ff: 
Photosphere for ThreeJS tutorial.
Photosphere Effect for native ThreeJS.

Credits to:
alteredq / http://alteredqualia.com/
mr.doob / http://mrdoob.com/

for Detector.js

You are free to:
Share, Adapt and Modify this plugin.

Free for Commercial and Non Commercial Use.

*/

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Imported = Imported || {};
Imported.Soul_RPGMakerPhotosphere = true;

var photosphere = PluginManager.parameters('SOUL_Photosphere360');

var Soul = Soul || {};
Soul.RM3DPhotosphere = Soul.RM3DPhotosphere || {};
Soul.RM3DPhotosphere.textureLoader = new THREE.TextureLoader();

function p360param(parameter) {
    if (parameter === 'Image Directory URL') {
        return String(photosphere['Image Directory URL']);
    }
    if (parameter === 'Scene Left Button') {
        return String(photosphere['Scene Left Button']);
    }
    if (parameter === 'Scene Right Button') {
        return String(photosphere['Scene Right Button']);
    }
    if (parameter === 'Scene Up Button') {
        return String(photosphere['Scene Up Button']);
    }
    if (parameter === 'Scene Down Button') {
        return String(photosphere['Scene Down Button']);
    }
    if (parameter === 'Spriteset Left Button') {
        return String(photosphere['Spriteset Left Button']);
    }
    if (parameter === 'Spriteset Right Button') {
        return String(photosphere['Spriteset Right Button']);
    }
    if (parameter === 'Spriteset Up Button') {
        return String(photosphere['Spriteset Up Button']);
    }
    if (parameter === 'Spriteset Down Button') {
        return String(photosphere['Spriteset Down Button']);
    }
    if (parameter === 'Orbit Speed') {
        return Number(photosphere['Orbit Speed']);
    }
    if (parameter === 'Auto Orbit Speed') {
        return Number(photosphere['Auto Orbit Speed']);
    }
}

Soul.RM3DPhotosphere.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
    Soul.RM3DPhotosphere.Game_System_initialize.call(this);
    this.photosphereWidth = Graphics.width;
    this.photosphereHeight = Graphics.height;
    this.photosphereAutoRotate = true;
    this.photosphereImage = '';
    this.photosphereOrbitSpeed = p360param('Orbit Speed');
    this.photosphereAutoOrbitSpeed = p360param('Auto Orbit Speed');
};

Soul.RM3DPhotosphere.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    // to be overridden by plugins
    Soul.RM3DPhotosphere.Game_Interpreter_pluginCommand.call(this, command, args);

    // Soul : Photosphere : Scene : imageName: autoOrbit : width : height : Start
    if (command === 'Soul' && args[1] === 'Photosphere' && args[3] === 'Scene' && args[13] === 'Start') {
        $gameSystem.photosphereImage = args[5];
        $gameSystem.photosphereAutoRotate = eval(args[7]);
        $gameSystem.photosphereWidth = eval(args[9]);
        $gameSystem.photosphereHeight = eval(args[11]);
        SceneManager.push(Scene_Photosphere);
    }

    // Soul : Photosphere : Spriteset : Setup : imageName : autoOrbit : width : height
    if (command === 'Soul' && args[1] === 'Photosphere' && args[3] === 'Spriteset' && args[5] === 'Setup') {
        var spritesetBase = SceneManager._scene._spriteset;
        var sprite = spritesetBase._sprite3d;
        $gameSystem.photosphereImage = args[7];
        $gameSystem.photosphereAutoRotate = eval(args[9]);
        $gameSystem.photosphereWidth = eval(args[11]);
        $gameSystem.photosphereHeight = eval(args[13]);
        sprite.x = eval(args[15]);
        sprite.y = eval(args[17]);
    }

    // Soul : Photosphere : Spriteset : Show
    if (command === 'Soul' && args[1] === 'Photosphere' && args[3] === 'Spriteset' && args[5] === 'Show') {
        var spritesetBase = SceneManager._scene._spriteset;
        var sprite = SceneManager._scene._spriteset._sprite3d;
        if (!spritesetBase.threejs.object) {
            spritesetBase.threejs.object = new THREE.SphereGeometry(100, 20, 20);
            spritesetBase.threejs.material = new THREE.MeshBasicMaterial();
            spritesetBase.threejs.material.map = Soul.RM3DPhotosphere.textureLoader.load(p360param('Image Directory URL') + $gameSystem.photosphereImage);
            spritesetBase.threejs.sphere = new THREE.Mesh(spritesetBase.threejs.object, spritesetBase.threejs.material);
            spritesetBase.threejs.sphere.scale.x = -1;
            spritesetBase.threejs.scene.add(spritesetBase.threejs.sphere);
        }
        SceneManager._scene._spriteset._baseSprite.addChild(sprite);
    }

    // Soul : Photosphere : Spriteset : Hide
    if (command === 'Soul' && args[1] === 'Photosphere' && args[3] === 'Spriteset' && args[5] === 'Hide') {
        var spritesetBase = SceneManager._scene._spriteset;
        var sprite = SceneManager._scene._spriteset._sprite3d;
        SceneManager._scene._spriteset._baseSprite.removeChild(sprite);
    }

    // Soul : Photosphere : OrbitSpeed : speedNumber
    if (command === 'Soul' && args[1] === 'Photosphere' && args[3] === 'OrbitSpeed') {
        $gameSystem.photosphereOrbitSpeed = eval(args[5]);
    }

    // Soul : Photosphere : AutoOrbitSpeed : speedNumber
    if (command === 'Soul' && args[1] === 'Photosphere' && args[3] === 'AutoOrbitSpeed') {
        $gameSystem.photosphereAutoOrbitSpeed = eval(args[5]);
    }
};

/*
* Scene Photosphere - If the developer decides to create a scene dedicated for the photosphere.
* Developed under ES6 style.
* Comm: This is for the developer to just set up something such as if they want an event where the player
* for example, looks at a scope and sees a 360 angle, then this is what should be called. - Soul
*
* You can use an emergency call of the scene using SceneManager.push(Scene_Photosphere);
*
*/

var Scene_Photosphere = function (_Scene_Base) {
    _inherits(Scene_Photosphere, _Scene_Base);

    function Scene_Photosphere() {
        _classCallCheck(this, Scene_Photosphere);

        return _possibleConstructorReturn(this, (Scene_Photosphere.__proto__ || Object.getPrototypeOf(Scene_Photosphere)).call(this));
    }

    _createClass(Scene_Photosphere, [{
        key: 'initialize',
        value: function initialize() {
            Scene_Base.prototype.initialize.call(this);
            this.autoRotate = $gameSystem.photosphereAutoRotate;
        }
    }, {
        key: 'start',
        value: function start() {
            Scene_Base.prototype.start.call(this);
            this.startFadeIn(this.slowFadeSpeed(), false);
        }
    }, {
        key: 'create',
        value: function create() {
            Scene_Base.prototype.create.call(this);
            this.createPhotosphereBase();
        }
    }, {
        key: 'createPhotosphereBase',
        value: function createPhotosphereBase() {

            this.threejs = {};
            this.threejs.scene = new THREE.Scene();
            this.threejs.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
            this.threejs.camera.position.x = 0.1;
            this.threejs.camera.position.y = 0;

            this.threejs.object = new THREE.SphereGeometry(100, 20, 20);
            this.threejs.material = new THREE.MeshBasicMaterial();
            Soul.RM3DPhotosphere.textureLoader = new THREE.TextureLoader();
            this.threejs.material.map = Soul.RM3DPhotosphere.textureLoader.load(p360param('Image Directory URL') + $gameSystem.photosphereImage);
            this.threejs.sphere = new THREE.Mesh(this.threejs.object, this.threejs.material);
            this.threejs.sphere.scale.x = -1;
            this.threejs.scene.add(this.threejs.sphere);
            this.threejs.renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
            this.threejs.renderer.setSize($gameSystem.photosphereWidth, $gameSystem.photosphereHeight);

            this._texture3d = PIXI.Texture.fromCanvas(this.threejs.renderer.domElement);
            this._sprite3d = new PIXI.Sprite(this._texture3d);
            this.addChild(this._sprite3d);
        }
    }, {
        key: 'update',
        value: function update() {
            Scene_Base.prototype.update.call(this);
            this.updatePhotosphereControls();
            this.threejs.renderer.render(this.threejs.scene, this.threejs.camera);
            this._texture3d.update();

            if (this.isActive() && !this.isBusy() && this.isTriggered()) {
                this.goToPastScene();
            }
        }
    }, {
        key: 'isTriggered',
        value: function isTriggered() {
            return Input.isTriggered('cancel') || TouchInput.isTriggered();
        }
    }, {
        key: 'goToPastScene',
        value: function goToPastScene() {
            SceneManager.push(Scene_Map);
            // $gameMap.autoplay();
        }
    }, {
        key: 'updatePhotosphereControls',
        value: function updatePhotosphereControls() {
            if (Input.isPressed(p360param('Scene Left Button'))) {
                this.threejs.sphere.rotation.y -= $gameSystem.photosphereOrbitSpeed;
            } else if (Input.isPressed(p360param('Scene Right Button'))) {
                this.threejs.sphere.rotation.y += $gameSystem.photosphereOrbitSpeed;
            } else if (Input.isPressed(p360param('Scene Up Button'))) {
                this.threejs.sphere.rotation.x -= $gameSystem.photosphereOrbitSpeed;
            } else if (Input.isPressed(p360param('Scene Down Button'))) {
                this.threejs.sphere.rotation.x += $gameSystem.photosphereOrbitSpeed;
            }

            if ($gameSystem.photosphereAutoRotate) {
                this.threejs.sphere.rotation.y += p360param('Auto Orbit Speed');
            }
        }
    }, {
        key: 'terminate',
        value: function terminate() {
            Scene_Base.prototype.terminate.call(this);
            // AudioManager.stopAll();
            // dump sprite3D
            this.removeChild(this._sprite3d);
        }
    }]);

    return Scene_Photosphere;
}(Scene_Base);

/*
* Photosphere as a Sprite from Spriteset: MAP
* Comm: This is for the developer to setup a 360 image inside the map, while making the characters still active.
* if you are using something like this, using a different input is advisable! - Soul
*/

Soul.RM3DPhotosphere.Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function () {
    Soul.RM3DPhotosphere.Spriteset_Map_createLowerLayer.call(this);
    this.createPhotosphereSprite();
};

Spriteset_Map.prototype.createPhotosphereSprite = function () {
    this.threejs = {};
    this.threejs.scene = new THREE.Scene();
    this.threejs.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.threejs.camera.position.x = 0.1;
    this.threejs.camera.position.y = 0;

    this.threejs.renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();

    this._texture3d = PIXI.Texture.fromCanvas(this.threejs.renderer.domElement);
    this._sprite3d = new PIXI.Sprite(this._texture3d);
};

Soul.RM3DPhotosphere.Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function () {
    Soul.RM3DPhotosphere.Spriteset_Map_update.call(this);
    this.updateControlsAndPhotosphereSprite();
    this.threejs.renderer.setSize($gameSystem.photosphereWidth, $gameSystem.photosphereHeight);
};

Spriteset_Map.prototype.updateControlsAndPhotosphereSprite = function () {
    if (this.threejs.sphere) {
        if (Input.isPressed(p360param('Spriteset Left Button'))) {
            this.threejs.sphere.rotation.y -= $gameSystem.photosphereOrbitSpeed;
        } else if (Input.isPressed(p360param('Spriteset Right Button'))) {
            this.threejs.sphere.rotation.y += $gameSystem.photosphereOrbitSpeed;
        } else if (Input.isPressed(p360param('Spriteset Up Button'))) {
            this.threejs.sphere.rotation.x -= $gameSystem.photosphereOrbitSpeed;
        } else if (Input.isPressed(p360param('Spriteset Down Button'))) {
            this.threejs.sphere.rotation.x += $gameSystem.photosphereOrbitSpeed;
        }

        if ($gameSystem.photosphereAutoRotate) {
            this.threejs.sphere.rotation.y += p360param('Auto Orbit Speed');
        }
    }
    this.threejs.renderer.render(this.threejs.scene, this.threejs.camera);
    this._texture3d.update();
};