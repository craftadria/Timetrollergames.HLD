/* globals DataManager, PluginManager, Game_Interpreter, Window_Message, Game_System, $gameSystem */

/*:
@plugindesc |v1.0| This plugin enables the creation of a code language for your game.
@author xDGameStudios Engine

@param ---General---

@param Active
@desc Sets the state by default.
DEFAULT: FALSE      YES: true   NO: false
@default false

@param Name
@desc Applies the language code to the name window.
DEFAULT: FALSE      YES: true   NO: false
@default false

@param Text Color
@desc Sets the codified text color.
DEFAULT: 2
@default 2

@param ---Numbers---
@default

@param Number 1
@desc The mapping applied for the number in the window message.
@default

@param Number 2
@desc The mapping applied for the number in the window message.
@default

@param Number 3
@desc The mapping applied for the number in the window message.
@default

@param Number 4
@desc The mapping applied for the number in the window message.
@default

@param Number 5
@desc The mapping applied for the number in the window message.
@default

@param Number 6
@desc The mapping applied for the number in the window message.
@default

@param Number 7
@desc The mapping applied for the number in the window message.
@default

@param Number 8
@desc The mapping applied for the number in the window message.
@default

@param Number 9
@desc The mapping applied for the number in the window message.
@default

@param Number 0
@desc The mapping applied for the number in the window message.
@default

@param ---Letters---
@default

@param Letter "A"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "B"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "C"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "D"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "E"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "F"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "G"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "H"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "I"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "J"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "K"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "L"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "M"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "N"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "O"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "P"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "Q"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "R"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "S"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "T"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "U"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "V"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "W"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "X"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "Y"
@desc The mapping applied for the letter in the window message.
@default

@param Letter "Z"
@desc The mapping applied for the letter in the window message.
@default

@help
========================================================================
Help
========================================================================

This plugin will implement a coded language similar to the one found in
FFX with Al Bhed. You can edit the alpha and numeric mappings, as well
as configure the color of the encrypted text.

The plugin works the in the following way, you write the message text
as you would normaly do but before the Show Text Window you can use:

"CodeLanguage enable" (PLUGIN COMMAND)

this will make it so the next window will be using the encryption.
Don't forget to turn it off in the end using:

"CodeLanguage disable (PLUGIN COMMAND)

========================================================================
Required Plugins
========================================================================

(none)

========================================================================
Note Tag Data
========================================================================

(none)

========================================================================
Plugin Commands
========================================================================

CodeLanguage Learn X (learns the letter -the letter is no longer coded).

CodeLanguage Forget X (forgets the letter - letter will be coded).

CodeLanguage Enable (turns coding ON - use before window message)

CodeLanguage Disable (turns coding OFF - use at the end of coded dialog).

========================================================================
Script Calls
========================================================================

(none)

========================================================================
Extra Data
========================================================================

(none)

========================================================================
Updates History
========================================================================

1.0: Initial Release

========================================================================
*/

var Imported = Imported || {};
Imported.XDE_CodeLanguage = true;

var XDE = XDE || {};
XDE.CodeLanguage = XDE.CodeLanguage || {};

(function($) {
    
    "use strict";
        
    $.Alias = $.Alias || {};
    $.Params = $.Params || {};
    
    //=============================================================================
    // Parameter Variables
    //=============================================================================
    
    var parameters = PluginManager.parameters('XDE_CodeLanguage');
    
    $.Params.Enabled = String(parameters['Enabled Codification']) === 'true';
    $.Params.Color = Number(parameters['Text Color'] || 2);
    
    $.Params.Dictionary = {
        1: parameters['Number 1'], 2: parameters['Number 2'],
        3: parameters['Number 3'], 4: parameters['Number 4'],
        5: parameters['Number 5'], 6: parameters['Number 6'],
        7: parameters['Number 7'], 8: parameters['Number 8'],
        9: parameters['Number 9'], 0: parameters['Number 0'],
        
        a: parameters['Letter "A"'].toLowerCase(),
        b: parameters['Letter "B"'].toLowerCase(),
        c: parameters['Letter "C"'].toLowerCase(),
        d: parameters['Letter "D"'].toLowerCase(),
        e: parameters['Letter "E"'].toLowerCase(),
        f: parameters['Letter "F"'].toLowerCase(),
        g: parameters['Letter "G"'].toLowerCase(),
        h: parameters['Letter "H"'].toLowerCase(),
        i: parameters['Letter "I"'].toLowerCase(),
        j: parameters['Letter "J"'].toLowerCase(),
        k: parameters['Letter "K"'].toLowerCase(),
        l: parameters['Letter "L"'].toLowerCase(),
        m: parameters['Letter "M"'].toLowerCase(),
        n: parameters['Letter "N"'].toLowerCase(),
        o: parameters['Letter "O"'].toLowerCase(),
        p: parameters['Letter "P"'].toLowerCase(),
        q: parameters['Letter "Q"'].toLowerCase(),
        r: parameters['Letter "R"'].toLowerCase(),
        s: parameters['Letter "S"'].toLowerCase(),
        t: parameters['Letter "T"'].toLowerCase(),
        u: parameters['Letter "U"'].toLowerCase(),
        v: parameters['Letter "V"'].toLowerCase(),
        w: parameters['Letter "W"'].toLowerCase(),
        x: parameters['Letter "X"'].toLowerCase(),
        y: parameters['Letter "Y"'].toLowerCase(),
        z: parameters['Letter "Z"'].toLowerCase()
    };
    
    parameters = undefined;
    
    //=============================================================================
    // Game_Interpreter
    //=============================================================================

    $.Alias._game_interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        $.Alias._game_interpreter_pluginCommand.call(this, command, args);
        if (command === 'CodeLanguage') {
            var action = args.shift().toLowerCase();
            var value, index;
            switch(action) {
                case 'learn':
                    value = args.shift().toLowerCase();
                    $gameSystem.codeLanguageLearn(value);
                    break;
                case 'forget':
                    value = args.shift().toLowerCase();
                    $gameSystem.codeLanguageForget(value);
                    break;
                case 'enable':
                    $.Params.Enabled = true;
                    break;
                case 'disable':
                    $.Params.Enabled = false;
                    break;
            }
        }
    };
    
    //=============================================================================
    // Game_System
    //=============================================================================
    
    $.Alias._game_system_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        $.Alias._game_system_initialize.call(this);
        this._dictionary = this._dictionary || []; 
    };
    
    Game_System.prototype.codeLanguageLearn = function(value) {
        var index = this._dictionary.indexOf(value);
        if (index === -1) {
            this._dictionary.push(value);
        }
    };
    
    Game_System.prototype.codeLanguageForget = function(value) {
        var index = this._dictionary.indexOf(value);
        if (index > -1) {
            this._dictionary.splice(index, 1);
        }
    };
    
    //=============================================================================
    // Window_Message
    //=============================================================================
    
    Window_Message.prototype.processNormalCharacter = function(textState) {
        var c = textState.text[textState.index++];
        var color = this.contents.textColor;
        if ($.Params.Enabled) {
            var id = c.toLowerCase();
            if ($gameSystem._dictionary.indexOf(id) === -1 && $.Params.Dictionary[id] && $.Params.Dictionary[id] !== "") {
                c = (id === c) ? $.Params.Dictionary[c] : $.Params.Dictionary[id].toUpperCase();
            } else {
                this.changeTextColor(this.textColor($.Params.Color));
            }
        }
        
        var w = this.textWidth(c);
        this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
        textState.x += w;

        this.contents.textColor = color;
    };
    
})(XDE.CodeLanguage);