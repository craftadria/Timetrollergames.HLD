/* globals DataManager, TextManager, PluginManager, Game_Interpreter, Game_Message, Window_EventItem, Window_ItemCategory, Window_ItemList, $dataItems, $gameMessage */
/*:
@plugindesc |v1.1| This plugin enables the creation of custom item types.
@author xDGameStudios Engine


@param ---Scene Item---
@default

 @param Item Category Order
 @desc The order for command item menu appearance.
 I: items, A: armors, W: weapons, K: key items, 1-15: types
 @default i, a, w, k

@param ---Item Type 1---
@default

@param Type 1 Name
@desc Item type name
@default

@param Type 1 Items
@desc List of items
@default

@param ---Item Type 2---
@default

@param Type 2 Name
@desc Item type name
@default

@param Type 2 Items
@desc List of items
@default

@param ---Item Type 3---
@default

@param Type 3 Name
@desc Item type name
@default

@param Type 3 Items
@desc List of items
@default

@param ---Item Type 4---
@default

@param Type 4 Name
@desc Item type name
@default

@param Type 4 Items
@desc List of items
@default

@param ---Item Type 5---
@default

@param Type 5 Name
@desc Item type name
@default

@param Type 5 Items
@desc List of items
@default

@param ---Item Type 6---
@default

@param Type 6 Name
@desc Item type name
@default

@param Type 6 Items
@desc List of items
@default

@param ---Item Type 7---
@default

@param Type 7 Name
@desc Item type name
@default

@param Type 7 Items
@desc List of items
@default

@param ---Item Type 8---
@default

@param Type 8 Name
@desc Item type name
@default

@param Type 8 Items
@desc List of items
@default

@param ---Item Type 9---
@default

@param Type 9 Name
@desc Item type name
@default

@param Type 9 Items
@desc List of items
@default

@param ---Item Type 10---
@default

@param Type 10 Name
@desc Item type name
@default

@param Type 10 Items
@desc List of items
@default

@param ---Item Type 11---
@default

@param Type 11 Name
@desc Item type name
@default

@param Type 11 Items
@desc List of items
@default

@param ---Item Type 12---
@default

@param Type 12 Name
@desc Item type name
@default

@param Type 12 Items
@desc List of items
@default

@param ---Item Type 13---
@default

@param Type 13 Name
@desc Item type name
@default

@param Type 13 Items
@desc List of items
@default

@param ---Item Type 14---
@default

@param Type 14 Name
@desc Item type name
@default

@param Type 14 Items
@desc List of items
@default

@param ---Item Type 15---
@default

@param Type 15 Name
@desc Item type name
@default

@param Type 15 Items
@desc List of items
@default

@help
========================================================================
Help
========================================================================

This plugin creates item types similar to the ones present in weapons
and armor. There are up to 15 types of items you can configure. You can
give them a name (Food, Minerals, Ingridients, Potions...) and set up
the list of items that are included within that type. For creating the
list you can use two methods:

X, Y, Z  or  X to Y  or  X, Y to Z  

example:

23, 25, 26  or  20 to 40  or  23, 30 to 40

X, Y and Z: are the item ids in the database.

This filter by item type can be applied to the Item Select Window in the
using a plugin command before calling the window.

Since version 1.1 you can select which categories should appear in item
menu and even their order.

Just need to set the property Item Category Order to a list of comma
separated entries. 

for example: i, a, w, k

I: items, A: armors, W: weapons, K: key items, 1-15: types

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

Use this plugin command before calling the item select window.

ItemSelectCustomType x

x: is the item type filter to be used for item select window.



Use this plugin command before calling the shop window.

ShopSellCustomType x y z

x, y, z: is the item type categories to be sold.
 I: items, A: armors, W: weapons, K: key items, 1-15: subtypes

Note: do NOT use commas just white spaces!

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
1.1: From now on you can select which items to sell in shops :)

========================================================================
*/

var Imported = Imported || {};
Imported.XDE_ItemTypes = true;

var XDE = XDE || {};
XDE.ItemTypes = XDE.ItemTypes || {};

(function($) {
    
    "use strict";

    $.Alias = $.Alias || {};
    $.Params = $.Params || {};
    
    var pattern = /(\d+)[ ]TO[ ](\d+)/i;
    var parameters = PluginManager.parameters('XDE_ItemTypes');
    
    $.Params.ItemCategory = String(parameters['Item Category Order']).toLowerCase().split(',');
    $.Params.ShopCategory = $.Params.ItemCategory;
    
    $.Params.ItemTypeNames = [];
    $.Params.ItemTypeLists = [];
    
    for (var i = 1; i <= 15; i++) {
        $.Params.ItemTypeNames[i] = String(parameters['Type ' + i +' Name'] || '');
        $.Params.ItemTypeLists[i] = [];
        
        var itemLists = [];
        itemLists = String(parameters['Type ' + i +' Items'] || '').split(',');
        
        var len = itemLists.length;
        for (var j = 0; j < itemLists.length; j++) {
            if (itemLists[j].match(pattern)) {
                var begin = Number(RegExp.$1);
                var end = Number(RegExp.$2);
                
                for(var k = begin; k <= end; k++)
                    $.Params.ItemTypeLists[i].push(k);
            }
            else
                $.Params.ItemTypeLists[i].push(Number(itemLists[j] || 0));
        }
        
        $.Params.ItemTypeLists[i] = $.Params.ItemTypeLists[i].filter(function(element){
            return element !== 0;
        });
    }
    
    //=============================================================================
    // DataManager
    //=============================================================================
    
    $.Alias._dataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!$.Alias._dataManager_isDatabaseLoaded.call(this)) return false;
        DataManager.processItemTypes($dataItems);
        return true;
    };
    
    DataManager.processItemTypes = function() {
        for (var i = 1; i <= 15; i++) {
            var j, len, list;
            
            list = $.Params.ItemTypeLists[i];
            len = list.length;
            for (j = 0; j < len; j++) {
                $dataItems[list[j]].customItypeId = i;
            }
        }
    };

    //=============================================================================
    // Game_Interpreter
    //=============================================================================
    
    $.Alias._game_interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        $.Alias._game_interpreter_pluginCommand.call(this, command, args);
        if (command === 'ItemSelectCustomType')
            $gameMessage._itemChoiceCustomItypeId = Number(args[0]);
        if (command === 'ShopSellCustomType')
            $.Params.ShopCategory = args.join(',').toLowerCase().split(',');
    };
    
    //=============================================================================
    // Scene_Shop
    //=============================================================================

    $.Alias._scene_shop_terminate = Scene_Shop.prototype.terminate;
    Scene_Shop.prototype.terminate = function() {
        $.Alias._scene_shop_terminate.call(this);
        $.Params.ShopCategory = $.Params.ItemCategory;
    };
    
    //=============================================================================
    // Window_EventItem
    //=============================================================================
    
    $.Alias._window_eventItem_includes = Window_EventItem.prototype.includes;
    Window_EventItem.prototype.includes = function(item) {
        if (!$.Alias._window_eventItem_includes.call(this, item))
            return false;
        
        var customItypeId = $gameMessage.itemChoiceCustomItypeId();
        if (customItypeId > 0) {
            if (!item.customItypeId)
                return false;
            return item.customItypeId === customItypeId;
        }
        return true;
    };
    
    //=============================================================================
    // Game_Message
    //=============================================================================

    $.Alias._game_message_clear = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        $.Alias._game_message_clear.call(this);
        this._itemChoiceCustomItypeId = 0;
    };
    
    Game_Message.prototype.itemChoiceCustomItypeId = function() {
        return this._itemChoiceCustomItypeId;
    };
    
    //=============================================================================
    // Window_ItemCategory
    //=============================================================================

    Window_ItemCategory.prototype.makeCommandList = function() {  
        var isShop = SceneManager._scene instanceof Scene_Shop;
        var commandList = isShop ? $.Params.ShopCategory : $.Params.ItemCategory;

        var len = commandList.length;
        for (var i = 0; i < len; i++) {
            switch (commandList[i].trim()) {
                case 'i':
                    this.addCommand(TextManager.item, 'item');
                    break;
                case 'w':
                    this.addCommand(TextManager.weapon, 'weapon');
                    break;
                case 'a':
                    this.addCommand(TextManager.armor, 'armor');
                    break;
                case 'k':
                    this.addCommand(TextManager.keyItem, 'keyItem');
                    break;
                default:
                    var value = Number(commandList[i]);
                    if (!isNaN(value)) {
                        this.addCommand($.Params.ItemTypeNames[value], value.toString());
                    }
                    break;
            }
        }
    };

    //=============================================================================
    // Window_ItemList
    //=============================================================================

    $.Alias._window_itemList_includes = Window_ItemList.prototype.includes;
    Window_ItemList.prototype.includes = function(item) {            
        if (item === null) {
            return false;
        }
        var subtype = Number(this._category) || 0;
        if (subtype > 0) {
            if (!item.customItypeId) {
                return false;
            }
            return DataManager.isItem(item) && item.itypeId === 1 && item.customItypeId === subtype;
        } else {
            return $.Alias._window_itemList_includes.call(this, item);
        }
    };
    
})(XDE.ItemTypes);

