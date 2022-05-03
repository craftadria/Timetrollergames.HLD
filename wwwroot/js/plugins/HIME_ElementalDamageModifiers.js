/*:
-------------------------------------------------------------------------
@title Elemental Damage Modifier
@author Hime --> HimeWorks (http://himeworks.com)
@date Dec 2, 2015
@filename HIME_AttackElements.js
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
@plugindesc Allows you to specify attack elements for your skills or equips.
Supports multiple elemental damage.
@help 
-------------------------------------------------------------------------------
== Description ==

This elemental system changes the way elemental damage modifiers are set up
and calculated.

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Contact me for commercial use

== Change Log ==


== Usage ==

  -- Attack Element Type --
  
There are two ways that a skill's elemental attack can be set up.

1. Skill-based elements
2. User-based elements

For skill-based elements, you would tell the game which elements it should use.
For example, by default, you can say the skill inflicts "Fire" damage. The game
would assume this skill will always inflict fire damage.

The game also supports user-based elements. This means that the element that
the skill will use is based on the user's own attack elements.

In this elemental system, if you want to use user-based elements, set the
element type to Normal. If you set it to anything else, it will either use
the designated element, or it will use the attack elements that you specify
in the note box.

  -- Elemental Attack --

To assign elemental attack rates, note-tag actors, classes, items, skills,
equips, enemies, or states with

  <elemental attack: ELEMENT_TYPE PERCENTAGE% />
  
Where the ELEMENT_TYPE can be either the ID of the element, or the name of
the element. For example if your fire element was ID 2 in your types tab, you
can either write 2, or fire.

The PERCENTAGE is a number that indicates how "effective" the element is, which
determines how it will modify the final damage. For example if you wanted the
attack to have 200% fire damage, then the damage will be multiplied by 200%
worth of fire damage.

You can have multiple attack elements by adding multiple note-tags. If you have
multiple attack elements of the same type, the total effectiveness is the sum
of all of the note-tags.

For example, if you have a Fire Blade weapon with 20% fire attack, and you
use a skill that has 50% fire attack, your total fire effectiveness is 70%.

  -- Elemental Resist --

To assign elemental resistances, note-tag actors, classes, equips, enemies,
or states with

  <elemental resist: ELEMENT_TYPE PERCENTAGE% />
  
You can have multiple elemental resistances. The total resistance is equal to
the sum of all resistances for that element. For example, if your actor
has 50% fire resistance, and is wearing armor that provides an additional
10% fire resistance, your total resistance to fire elemental attacks is 60%.

  -- Damage Calculation --
 
All of the elemental effectiveness will be calculated to give a final rate,
which will be applied to the action's damage.

As an example, let's say you had a Fire Slash skill tagged with

  <elemental attack: Fire 50% />
  <elemental attack: Physical 50% />
  
And let's say you attacked an enemy that was tagged with

  <elemental resist: Fire 100% />
  
This means that the enemy has no resistance to physical damage.
  
The final elemental effectiveness is equal to

  Fire Effectiveness + Physical Effectiveness
  
Which is equal to

  (50% - 100%) + (50% - 0%)
= -50% + 50%

Now what happens when there are negative numbers? We assume that it is rounded
to 0.

This would give you a final rate of 50%, which means you would deal half damage
to the enemy, which is what you would expect if you had an attack that was 
half-fire and half-physical, but the enemy was immune against fire damage.

-------------------------------------------------------------------------------
 */ 
var Imported = Imported || {} ;
var TH = TH || {};
Imported.AttackElements = 1;
TH.AttackElements = TH.AttackElements || {};

function Data_AttackElement() {
  this.initialize.apply(this, arguments);
}

function Data_ResistElement() {
  this.initialize.apply(this, arguments);
}

(function ($) {

  Data_AttackElement.prototype.initialize = function(id, rate) {
    this._id = id
    this._rate = rate;
  };
  
  Object.defineProperty(Data_AttackElement.prototype, 'id', {
    get: function() {
        return this._id;
    },
    configurable: true
  });
  
  Object.defineProperty(Data_AttackElement.prototype, 'rate', {
    get: function() {
        return this._rate;
    },
    configurable: true
  });
  
  /***************************************************************************/
  
  Data_ResistElement.prototype.initialize = function(id, rate) {
    this._id = id
    this._rate = rate;
  };
  
  Object.defineProperty(Data_ResistElement.prototype, 'id', {
    get: function() {
        return this._id;
    },
    configurable: true
  });
  
  Object.defineProperty(Data_ResistElement.prototype, 'rate', {
    get: function() {
        return this._rate;
    },
    configurable: true
  });
  
  /***************************************************************************/

  $.AttackRegex = /<elemental[-_ ]attack:\s*(\w+?)\s+(-?\d+)%\s*\/>/img
  $.ResistRegex = /<elemental[-_ ]resist:\s*(\w+?)\s+(-?\d+)%\s*\/>/img
  
  $.getElementTypeId = function(id) {
    if (!$.elementMap) {
      $.elementMap = {}
      var elements = $dataSystem.elements;
      for (var i = 1, len = elements.length; i < len; i++) {
        var name = elements[i].toUpperCase();
        $.elementMap[name] = i;      
      }
    }   
    
    if (isNaN(Math.floor(id))) {      
      id = $.elementMap[id.toUpperCase()];
    }    
    return id;
  };
  
  $.loadNotetagAttackElements = function(obj) {
    obj.attackElements = []      
    var res;
    while (res = $.AttackRegex.exec(obj.note)) {
      var id = $.getElementTypeId(res[1]);
      var amount = Math.floor(res[2]) / 100;
      
      var data = new Data_AttackElement(id, amount);
      obj.attackElements.push(data);
    }
  };
  
  $.loadNotetagResistElements = function(obj) {
    obj.resistElements = []      
    var res;
    while (res = $.ResistRegex.exec(obj.note)) {
      var id = $.getElementTypeId(res[1]);
      var amount = Math.floor(res[2]) / 100;      
      var data = new Data_ResistElement(id, amount);
      obj.resistElements.push(data);
    }
  };
  
  $.attackElements = function(obj) {
    if (obj.attackElements === undefined) {
      $.loadNotetagAttackElements(obj);
    }
    return obj.attackElements;
  };
  
  $.resistElements = function(obj) {
    if (obj.resistElements === undefined) {
      $.loadNotetagResistElements(obj);
    }
    return obj.resistElements;
  };
  
  /***************************************************************************/
  
  Game_Battler.prototype.elementResistObjects = function() {
    var states = this.states();
    var objs = []
    for (var i = 0, len = states.length; i < states; i++) {
      objs.concat($.resistElements(states[i]));
    }
    return objs;
  };
  
  Game_Battler.prototype.elementAttackObjects = function() {
    var states = this.states();
    var objs = []
    for (var i = 0, len = states.length; i < states; i++) {
      objs.concat($.attackElements(states[i]));
    }
    return objs;
  };
  
  Game_Battler.prototype.elementResist = function(elementId) {
    var data = this.elementResistObjects();
    var rate = 0;
    for (var i = 0, len = data.length; i < len; i++) {      
      if (data[i].id === elementId) {        
        rate += data[i].rate;
      }
    }
    return rate;
  };
  
  Game_Battler.prototype.attackElementRates = function() {
    var data = this.elementAttackObjects();
    var rates = {};
    for (var i = 0, len = data.length; i < len; i++) {
      rates[data[i].id] = rates[data[i].id] || 0;
      rates[data[i].id] += data[i].rate
    }
    return rates;
  };
  
  /***************************************************************************/
  
  Game_Actor.prototype.elementResistObjects = function() {
    var objs = Game_Battler.prototype.elementResistObjects.call(this)
    objs = objs.concat($.resistElements(this.actor()), $.resistElements(this.currentClass()));
    var equips = this.equips();
    for (var i = 0, len = equips.length; i < len; i++) {
      if (equips[i]) {
        objs = objs.concat($.resistElements(equips[i]));
      }
    }
    return objs;
  };
  
  Game_Actor.prototype.elementAttackObjects = function() {
    var objs = Game_Battler.prototype.elementAttackObjects.call(this)
    objs = objs.concat($.attackElements(this.actor()), $.attackElements(this.currentClass()));
    var equips = this.equips();
    for (var i = 0, len = equips.length; i < len; i++) {
      if (equips[i]) {
        objs = objs.concat($.attackElements(equips[i]));
      }
    }
    return objs;
  };
  
  /***************************************************************************/
  
  Game_Enemy.prototype.elementResistObjects = function() {
    var objs = Game_Battler.prototype.elementResistObjects.call(this);
    objs = objs.concat($.resistElements(this.enemy()));
    return objs;
  };
  
  Game_Enemy.prototype.elementAttackObjects = function() {
    var objs = Game_Battler.prototype.elementAttackObjects.call(this);
    objs = objs.concat($.attackElements(this.enemy()));
    return objs;
  };
  
  /***************************************************************************/

  var TH_GameAction_calcElementRate = Game_Action.prototype.calcElementRate;
  Game_Action.prototype.calcElementRate = function(target) {
    if (this.item().damage.elementId < 0) {
      return this.calculateNormalWeightedElementRate(target);
    }
    else if ($.attackElements(this.item())) {
      return this.calculateItemWeightedElementRate(target);
    }
    else {
      return TH_GameAction_calcElementRate.call(this, target);
    }
  };
  
  /* Collects all attack elements
   *
   */
  Game_Action.prototype.calculateNormalWeightedElementRate = function(target) {
    // var attackRates = this.subject().attackElementRates();
    return 1;
  };
  
  /* New way to calculate elemental damage */
  Game_Action.prototype.calculateItemWeightedElementRate = function(target) {
    var elements = $.attackElements(this.item());
    var rate = 0;
    console.log(elements);
    if (elements.length > 0) {
      for (var i = 0, len = elements.length; i < len; i++) {
        var data = elements[i];      
        rate += this.getElementalEffectiveness(data, target);
      }
    }
    else {
      rate = 1;
    }
    return rate;    
  };
    
  Game_Action.prototype.minElementalEffectiveness = function() {
    return 0
  };
  
  Game_Action.prototype.getElementalEffectiveness = function(data, target) {
    var attack = data.rate
    var resist = target.elementResist(data.id);
    return Math.max(attack - resist, this.minElementalEffectiveness());
  };
  
})(TH.AttackElements);