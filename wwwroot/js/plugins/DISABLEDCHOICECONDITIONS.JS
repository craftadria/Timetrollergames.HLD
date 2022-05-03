/*:
-------------------------------------------------------------------------
@title Disabled Choice Conditions
@author Hime
@date Oct 31, 2015
-------------------------------------------------------------------------
@plugindesc Allows you to disable individual choices in a set of options
based on custom conditions
@help 
-------------------------------------------------------------------------
== Description ==

RPG Maker does not come with a way to disable individual choices from
a list of choices. For example, if the player shouldn't be allowed to
select a particular option, but you still want to show it, there's
basically no way to do it.

This plugin provides an easy way for you to disable each choice based
on your own custom conditions using tools that you are already
familiar with!

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Contact me for commercial use
 
== Usage == 

There are three ways to disable a choice.

1. Using a conditional branch

Start by creating a comment and writing

  <disable choice: choiceNumber>
  
Where the choiceNumber is a number between 1 and the number of
choices that you have. For example, you could specify the
second choice with this comment:

  <disable choice: 2>
  
Then immediately after the comment, create a conditional branch.
If this condition is true, then the choice specified will be
disabled.

2. Using a script call

   disable_choice( choiceNumber, formula )
   
Where the choiceNumber is the number of the choice that
you wish to disable, and the formula is a valid Javascript formula.

For example, to disable choice 3 if switch 4 is OFF, you can say

   disable_choice(3, "$gameSwitches.value(4) === false")
   
3. Use a plugin command

Start by creating a comment and writing

  disable_choice choiceNumber
  
Where the choiceNumber is a number between 1 and the number of
choices that you have. For example, you could specify the
fourth choice with this comment:

  disable_choice 4
  
Then immediately after the comment, create a conditional branch.
If this condition is true, then the choice specified will be
disabled.
   
-- When there are multiple sets of choices --

Disable conditions apply to the immediate set of choices, on the same
indentation level.

As a rule of thumb, you should declare all disable conditions
immediately before your choices. To avoid breaking up messages
and choices, you can place the disable conditions before any
messages as well.

-------------------------------------------------------------------------
 */ 
var Imported = {} 
var TH = TH || {};
Imported.DisabledChoiceConditions = 1;
TH.DisabledChoiceConditions = TH.DisabledChoiceConditions || {};

(function ($) {

  $.Regex = /<disable[-_ ]choice:\s*(\d+)\s*>/i

  /* store all indices that are disabled */
  var TH_DisableChoiceConditions_GameMessage_Clear = Game_Message.prototype.clear;
  Game_Message.prototype.clear = function() {
    TH_DisableChoiceConditions_GameMessage_Clear.call(this);
    this._DisabledChoiceConditions = {};
  };
  
  /* Returns whether the specified choice is disabled */
  Game_Message.prototype.isChoiceDisabled = function(choiceNum) {
    return this._DisabledChoiceConditions[choiceNum];
  }
  
  Game_Message.prototype.disableChoice = function(choiceNum, bool) {
    this._DisabledChoiceConditions[choiceNum] = bool;
  }

  /* After setting up choices, go and disable any that should be disabled */
  var TH_DisableChoiceConditions_WindowChoiceList_MakeCommandList = Window_ChoiceList.prototype.makeCommandList;
  Window_ChoiceList.prototype.makeCommandList = function() {
    console.log($gameMessage._DisabledChoiceConditions);
    TH_DisableChoiceConditions_WindowChoiceList_MakeCommandList.call(this);
    for (var i = 0; i < this._list.length; i++) {
      if ($gameMessage.isChoiceDisabled(i)) {
        this._list[i].enabled = false;
      }
    }
  };
  
  /* Gray out disabled choices */
  var TH_DisableChoiceConditions_WindowChoiceList_DrawItem = Window_ChoiceList.prototype.drawItem
  Window_ChoiceList.prototype.drawItem = function(index) {
    this.changePaintOpacity(this.isCommandEnabled(index));
    TH_DisableChoiceConditions_WindowChoiceList_DrawItem.call(this, index);
  };  
  
  /* Use a comment/conditional pair */
  var TH_DisabledChoiceConditions_GameInterpreterCommand108 = Game_Interpreter.prototype.command108;
  Game_Interpreter.prototype.command108 = function() {
    TH_DisabledChoiceConditions_GameInterpreterCommand108.call(this);    
    var nextCmd = this._list[this._index+1];
    if (nextCmd.code === 111) {
      var res = $.Regex.exec(this._comments[0]);
      if (res) {
        var choiceNum = Math.floor(res[1] - 1);
        nextCmd.disableChoice = choiceNum;
      }
    }
    return true;
  };
  
  /* Use a plugin command and conditional pair*/
  var TH_DisabledChoiceConditions_GameInterpreterPluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    TH_DisabledChoiceConditions_GameInterpreterPluginCommand.call(this, command, args);    
    var nextCmd = this._list[this._index+1];
    if (command.toLowerCase() === "disable_choice" && nextCmd.code === 111) {    
      var choiceNum = Math.floor(args[0] - 1);
      nextCmd.disableChoice = choiceNum;
    }
    return true;
  };
  
  var TH_DisabledChoiceConditions_GameInterpreterCommand111 = Game_Interpreter.prototype.command111;
  Game_Interpreter.prototype.command111 = function() {
    var choiceNum = this._list[this._index].disableChoice;
    TH_DisabledChoiceConditions_GameInterpreterCommand111.call(this);
    $gameMessage.disableChoice(choiceNum, this._branch[this._indent])
    return true;
  };
  
  /* disable choice script call */
  disable_choice = function(choiceNum, formula) {
    var num = Math.floor(choiceNum) - 1;    
    $gameMessage.disableChoice(num, eval(formula))
  };
})(TH.DisabledChoiceConditions);