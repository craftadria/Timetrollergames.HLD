/*:
-------------------------------------------------------------------------
@title HMS: Popup Messages
@author Hime --> HimeWorks (http://himeworks.com)
@version 1.0
@date Dec 15, 2015
@filename HIME_HMSPopupMessages.js
@url 

If you enjoy my work, consider supporting me on Patreon!

* https://www.patreon.com/himeworks

If you have any questions or concerns, you can contact me at any of
the following sites:

* Main Website: http://himeworks.com
* Facebook: https://www.facebook.com/himeworkscom/
* Twitter: https://twitter.com/HimeWorks
* Youtube: https://www.youtube.com/c/HimeWorks
* Tumblr: http://himeworks.tumblr.com/

-------------------------------------------------------------------------------
@plugindesc Allows you to draw message windows near a sprite that is currently
speaking.
@help 
-------------------------------------------------------------------------------
== Description ==

Ever wanted to have message pop up where your characters are standing?
This plugin allows you to do just that!

This plugin uses "Character anchors", which is just a fancy way of saying
the message windows follow characters. Characters can be the player,
a follower, or an event. Vehicles are not supported.

When a message window is anchored to a character, it will automatically
do two things

1. Resize based on the size of the input
2. Re-position itself based on the character's position

It is up to you to figure out how to best format the input so that it
will be displayed in a good way. When the windows are being resized,
word-wrapping functionality is highly NOT recommended since the size of
the window will change depending on the text you write into the message.

The message window will follow characters in real-time based on their
pixel coordinates, even if your game uses tile-based grid movement.

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Contact me for commercial use

== Change Log ==

1.0 - Dec 15, 2015
 - initial release

== Usage ==

To anchor the message window to a character, use the plugin command

  set_message_anchor to chara ID
  
Where the ID can be one of the following

  -1 for the player
  -2 or lower, for each follower in the party
   0 for the current event
   1 or higher, for a specific event on the map

For example, if you want the message window to follow the player, you can
write 

  set_message_anchor to chara -1
  
Messages will remain anchored to the character until it has been removed.
You must manually remove anchors yourself using the plugin command

  clear_message_anchor

-------------------------------------------------------------------------------
 */ 
var Imported = Imported || {} ;
var TH = TH || {};
Imported.TH_HMSPopupMessages = 1;
TH.HMSPopupMessages = TH.HMSPopupMessages || {};

(function ($) {
  
  /* We use something called an "anchor" to determine where the
   * message should be drawn. The anchor could be a character like
   * a the player or an event. Use an invisible event to anchor
   * the message to the map.
   */
  var TH_GameMessage_initialize = Game_Message.prototype.initialize;
  Game_Message.prototype.initialize = function() {
    TH_GameMessage_initialize.call(this);
    this.clearCharaAnchor();
  };
  
  Game_Message.prototype.setCharaAnchor = function(chara) {
    this._charaAnchor = chara;
  };
  
  Game_Message.prototype.charaAnchor = function(chara) {
    return this._charaAnchor;
  };
  
  Game_Message.prototype.clearCharaAnchor = function(chara) {
    this._charaAnchor = null;
  };
  
  /***************************************************************************/
  
  /* Draw it outside of the visible area. However, make sure it's
   * really outside in case the height of the window changes.
   */
  Window_Message.prototype.textWidthEx = function(text) {
    return res = this.drawTextEx(text, 0, this.contents.height << 1);
  };
  
  var TH_WindowMessage_initialize = Window_Message.prototype.initialize;
  Window_Message.prototype.initialize = function() {
    TH_WindowMessage_initialize.call(this);
    this._charaAnchor = null;
  };
  
  var TH_WindowMessage_startMessage = Window_Message.prototype.startMessage;
  Window_Message.prototype.startMessage = function() {        
    this.refreshCharaAnchor();        
    TH_WindowMessage_startMessage.call(this);
    this.refreshWindowSize();
    this.resetFontSettings();
  };
  
  Window_Message.prototype.maxTextWidth = function(lines) {
    var maxWidth = 0;
    for (var i = 0; i < lines.length; i++) {
      var lineWidth = this.textWidthEx(lines[i]);
      if (maxWidth < lineWidth) {
        maxWidth = lineWidth;
      }
    }
    if ($gameMessage.faceName() !== '') {
      maxWidth += 168
    }
    
    return maxWidth + this.padding * 2;
  }
  
  Window_Message.prototype.maxTextHeight = function(lines) {
    var minHeight = $gameMessage.faceName() !== '' ? 168 : this.fittingHeight(lines.length);
    return Math.max(this.calcTextHeight(this._textState, true), minHeight) + this.padding;
  };
  
  Window_Message.prototype.refreshWindowSize = function() {
    if (this._charaAnchor !== null) {
      var lines = this._textState.text.split("\n")
      this.width = this.maxTextWidth(lines)
      this.height = this.maxTextHeight(lines);
    }
    else {
      this.width = this.windowWidth();
      this.height = this.windowHeight();
    }
  };  
  
  Window_Message.prototype.refreshCharaAnchor = function() {
    this._charaAnchor = $gameMessage.charaAnchor();     
    this.updateAnchorPosition();
  };
  
  var TH_WindowMessage_update = Window_Message.prototype.update
  Window_Message.prototype.update = function() {
    TH_WindowMessage_update.call(this)
    this.updateAnchorPosition(); 
  };
  
  Window_Message.prototype.updateAnchorPosition = function() {    
    if (this._charaAnchor !== null) {
      var tw = $gameMap.tileWidth();
      var th = $gameMap.tileHeight();
      var x = this._charaAnchor._realX * tw - $gameMap.displayX() * tw;
      var y = this._charaAnchor._realY * th - $gameMap.displayY() * th;
      this.x = Math.min(Graphics.width - this.width, Math.max(0, x - (this.width - (this.padding * 2)) / 2))
      this.y = y - this.height
    }
    else {
      this.x = 0;
      this.updatePlacement();
    }
  };
  
  /***************************************************************************/
  
  Game_Interpreter.prototype.THGetMapCharacter = function(id) {  
    if (id === -1) {
      return $gamePlayer;
    }
    else if (id < -1) {
      return $gamePlayer.followers()[-id-1]
    }
    else if (id === 0) {
      return $gameMap.event(this._eventId)
    }
    else {
      return $gameMap.event(id)
    }
  };
  
  var TH_GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    var cmd = command.toLowerCase();
    if (cmd === "set_message_anchor") {
      var id = Math.floor(args[2])
      var chara = this.THGetMapCharacter(id);
      $gameMessage.setCharaAnchor(chara)
    }
    else if (cmd === "clear_message_anchor") {
      $gameMessage.clearCharaAnchor();
    }
    else {
      TH_GameInterpreter_pluginCommand.call(this, command, args);
    }
  };
})(TH.HMSPopupMessages)