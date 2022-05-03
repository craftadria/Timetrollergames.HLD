/*:
-------------------------------------------------------------------------
@title More Enemy Drops
@author Hime
@date Nov 6, 2015
-------------------------------------------------------------------------
@plugindesc Allows you to add more drops to an enemy and use percentage
probabilities for drop chance.
@help 
-------------------------------------------------------------------------
== Description ==

RPG Maker MV allows you to create up to three item drops for an enemy.
When the battle is over, the player may receive up to any of these
3 items.

When you specify drops, you use something called a "denominator"
probability, which is basically you specifying the chances of the item
dropping as a fraction of 1.

For example, if an item had a 1 /2 chance to drop, then it has a 50%
chance to drop. If an item had a 1 / 3 chance to drop, then it has a
33.33% chance to drop.

Unfortunately, with this system, you could never have any
probabilities in between.

This plugin addresses two issues:

1. You can specify more drops
2. You can specify probability using percentages

This should give you more flexibility when designing your enemies.
Give this plugin a try!

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Contact me for commercial use

== Change Log ==

Nov 6, 2015 -  initial release

== Usage ==

-- Understanding Item Codes --

Before we begin, you must first understand a concept that I call
"Item Codes". The item code is a way for you to quickly specify
what kind of item you want, and the ID of the item.

If you already understand item codes you can just skip this part.

This is how an ItemCode looks like:

  a11
  w23
  i42
  
The first letter represents the item kind.

  a - armor
  w - weapon
  i - item
  
The number after is the database ID. So if you write

  w23
  
That means the enemy will drop weapon 23.

-- Managing additional drops --

To specify additional drops for enemies, use the following note tag:

  <enemy drop: ItemCode DropChance>
  
Where the ItemCode is as described in the previous section.
 
The DropChance is a percentage (out of 100) that determines whether
you get the drop or not. This is a number, followed by a %.

For example, if you want the enemy to drop armor 23 with a probability
of 75%, you would write

  <enemy drop: a23 75%>

-------------------------------------------------------------------------
 */ 
var Imported = Imported || {} ;
var TH = TH || {};
Imported.MoreEnemyDrops = 1;
TH.MoreEnemyDrops = TH.MoreEnemyDrops || {};

(function ($) {

  $.Regex = /<enemy[-_ ]drop:\s+(\w+)(\d+)\s+(\d+)\%>/img
  
  $.getKind = function(letter) {
    if (letter === "i") {
      return 1;
    }
    else if (letter === "w") {
      return 2;
    }
    else if (letter === "a") {
      return 3;
    }
  };

  $.parseMoreDropItems = function(enemy) {
    enemy.extraDropItems = [];
    var res;
    var drop;
    while (res = $.Regex.exec(enemy.note)) {      
      drop = {};
      drop.kind = $.getKind(res[1].toLowerCase());
      drop.dataId = Math.floor(res[2]);
      drop.denominator = Math.floor(res[3]);
      enemy.extraDropItems.push(drop)
    }
  };
  
  var TH_MoreEnemyDrops_GameEnemy_makeDropItems = Game_Enemy.prototype.makeDropItems;
  Game_Enemy.prototype.makeDropItems = function() {
    $.parseMoreDropItems(this.enemy());
    var items = TH_MoreEnemyDrops_GameEnemy_makeDropItems.call(this);
    items = items.concat(this.makeExtraDropItems(this.enemy()));
    return items
  };
  
  /* Determine whether any extra items are dropped. These items
   * use percentage based probabilities.
   */
  Game_Enemy.prototype.makeExtraDropItems = function(enemy) {
    if (enemy.extraDropItems === undefined) {
      $.parseMoreDropItems(enemy);
    }
    var res = [];
    for (var i = 0; i < enemy.extraDropItems.length; i++) {    
      var di = enemy.extraDropItems[i];
      
      if (Math.random() * 100 < this.dropRate(di)) {
        res.push(this.itemObject(di.kind, di.dataId));
      }
    }
    return res;
  };
  
  /* Treat denominator as a percentage. Apply double drop as well */
  Game_Enemy.prototype.dropRate = function(dropItem) {
    return dropItem.denominator * this.dropItemRate()
  };
})(TH.MoreEnemyDrops);