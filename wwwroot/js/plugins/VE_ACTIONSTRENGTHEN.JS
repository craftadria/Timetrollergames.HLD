/*
 * ==============================================================================
 * ** Victor Engine MV - Action Strengthen
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.11.28 > First release.
 *  v 1.01 - 2015.11.29 > Added flat addition and code for strengthen values.
 *  v 1.02 - 2015.11.30 > Fixed issues with plugins using meta tags.
 *  v 1.03 - 2015.12.07 > Fixed issues with weapon element strengthen.
 *  v 1.04 - 2015.12.21 > Compatibility with Basic Module 1.04.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Action Strengthen'] = '1.04';

var VictorEngine = VictorEngine || {};
VictorEngine.ActionStrengthen = VictorEngine.ActionStrengthen || {};

(function() {

	VictorEngine.ActionStrengthen.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		VictorEngine.ActionStrengthen.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Action Strengthen', 'VE - Basic Module', '1.04');
	};

	VictorEngine.ActionStrengthen.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function(name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = "The plugin " + name + " requires the plugin " + required + " v" + version + " or higher ";
			msg += "installed to work properly. Go to http://victorenginescripts.wordpress.com/ to download the plugin.";
			throw new Error(msg);
		} else {
			VictorEngine.ActionStrengthen.requiredPlugin.call(this, name, required, version)
		};
	};
	
})();

/*:
 *------------------------------------------------------------------------------ 
 * @plugindesc v1.04 - Increase the power of specific actions.
 * @author Victor Sant
 *
 * ------------------------------------------------------------------------------
 * @help 
 * ------------------------------------------------------------------------------
 * This plugin have effect only the damage or healing caused by the action.
 * It have no effect on actions that doesn't heal or deal damage.
 * ------------------------------------------------------------------------------
 * Actors, Classes, Enemies, Weapons, Armors and States Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <skill strengthen: x, y>
 *  <skill strengthen: x, y%>
 *  <skill strengthen: x, 'code'>
 *   Change the power of the skill ID x by y or a code value.
 *     x : ID of the skill
 *     y : value changed (can be negative and/or a % value)
 *
 *  <item strengthen: x, y>
 *  <item strengthen: x, y%>
 *  <item strengthen: x, 'code'>
 *   Change the power of the item ID x by y or a code value.
 *     x : ID of the item 
 *     y : value changed (can be negative and/or a % value)
 *
 *  <element strengthen: x, y>
 *  <element strengthen: x, y%>
 *  <element strengthen: x, 'code'>
 *   Change the power of actions with the element ID x by y or a code value.
 *     x : ID of the element
 *     y : value changed (can be negative and/or a % value)
 *
 *  <state strengthen: x, y>
 *  <state strengthen: x, y%>
 *  <state strengthen: x, 'code'>
 *   Change the power of actions that changes state ID x by y or a code value.
 *     x : ID of the state
 *     y : value changed (can be negative and/or a % value)
 *
 *  <stype strengthen: x, y>
 *  <stype strengthen: x, y%>
 *  <stype strengthen: x, 'code'>
 *   Change the power of the skills with Skill Type ID x by y or a code value.
 *     x : ID of the skill type
 *     y : value changed (can be negative and/or a % value)
 *
 *  <itype strengthen: x, y>
 *  <itype strengthen: x, y%>
 *  <itype strengthen: x, 'code'>
 *   Change the power of the items with Item Type ID x by y or a code value.
 *     x : ID of the item type
 *     y : value changed (can be negative and/or a % value)
 *
 * ------------------------------------------------------------------------------
 *
 *  When using the 'code' always insert the code inside quotations and don't use
 *  line breaks. The code uses the same values as the damage formula, so you can 
 *  use "a" for the user, "b" for the target, "v[x]" for variable.
 *
 * ------------------------------------------------------------------------------
 *
 * Example Notetags:
 *   <skill strengthen: 4, +200>
 *
 *   <item strengthen: 5, -25%>
 *
 *   <element strengthen: 6, 'a.atk * 10'>
 *
 *   <stype strengthen: 1, 'Math.max(a.atk - b.def, 0) * v[5]'>
 *
 * ------------------------------------------------------------------------------
 */

	
(function() {

	//=============================================================================
	// VictorEngine
	//=============================================================================
	
	VictorEngine.ActionStrengthen.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function(data, index) {
		VictorEngine.ActionStrengthen.loadNotetagsValues.call(this, data, index);
		var list = ['actor', 'class', 'enemy', 'weapon', 'armor', 'state'];
		if (this.objectSelection(index, list)) VictorEngine.ActionStrengthen.loadNotes(data);
	};
	
	VictorEngine.ActionStrengthen.loadNotes = function(data) {
		data.itemStrengthen  = data.itemStrengthen  || {};
		data.skillStrengthen = data.skillStrengthen || {};
		data.itypeStrengthen = data.itypeStrengthen || {};
		data.stypeStrengthen = data.stypeStrengthen || {};
		data.stateStrengthen = data.stateStrengthen || {};
		data.elmntStrengthen = data.elmntStrengthen || {};
		this.processNotes(data, "item");
		this.processNotes(data, "skill");
		this.processNotes(data, "itype");
		this.processNotes(data, "stype");
		this.processNotes(data, "state");
		this.processNotes(data, "element");
	};
	
	VictorEngine.ActionStrengthen.processNotes = function(data, type) {
		var value = "([+-]?\\d+\\%?|[\"'“‘].*[\"'”’])";
		var regex = new RegExp('<' + type + ' strengthen:[ ]*(\\d+),[ ]*'+ value + '>', 'gi');
		var match;
		while ((match = regex.exec(data.note)) !== null) {
			switch (type) {
			case 'item':
				this.processValues(match, data.itemStrengthen);
				break;
			case 'skill':
				this.processValues(match, data.skillStrengthen);
				break;
			case 'itype':
				this.processValues(match, data.itypeStrengthen);
				break;
			case 'stype':
				this.processValues(match, data.stypeStrengthen);
				break;
			case 'state':
				this.processValues(match, data.stateStrengthen);
				break;
			case 'element':
				this.processValues(match, data.elmntStrengthen);
				break;
			};
		};
	};
		
	VictorEngine.ActionStrengthen.processValues = function(match, data) {
		result = {};
		var value;
		var regex1 = new RegExp('^([+-]?\\d+)(\\%)?', 'gi');
		var regex2 = new RegExp("^[\"'“‘](.*)[\"'”’]", 'gi');
		while ((value = regex1.exec(match[2])) !== null) {
			if (value[2]) { result.rate = Number(value[1]) } else { result.flat = Number(value[1]) };
		};
		while ((value = regex2.exec(match[2])) !== null) { result.code = value[1] };
		data[match[1]] = result;
	};
	
	//=============================================================================
	// Game_Action
	//=============================================================================

	VictorEngine.ActionStrengthen.evalDamageFormula = Game_Action.prototype.evalDamageFormula;
	Game_Action.prototype.evalDamageFormula = function(target) {
		var result = VictorEngine.ActionStrengthen.evalDamageFormula.call(this, target);
		return this.actionStrengthenValue(result, this.isSkill(), this.item(), target);
	};
	
	VictorEngine.ActionStrengthen.itemEffectRecoverHp = Game_Action.prototype.itemEffectRecoverHp;
	Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
		var newEffect = this.itemEffectStrengthen(target, effect);
		VictorEngine.ActionStrengthen.itemEffectRecoverHp.call(this, target, newEffect);
	};
	
	VictorEngine.ActionStrengthen.itemEffectRecoverMp = Game_Action.prototype.itemEffectRecoverMp;
	Game_Action.prototype.itemEffectRecoverMp = function(target, effect) {
		var newEffect = this.itemEffectStrengthen(target, effect);
		VictorEngine.ActionStrengthen.itemEffectRecoverMp.call(this, target, newEffect);
	};
	
	VictorEngine.ActionStrengthen.itemEffectGainTp = Game_Action.prototype.itemEffectGainTp;
	Game_Action.prototype.itemEffectGainTp = function(target, effect) {
		var newEffect = this.itemEffectStrengthen(target, effect);
		VictorEngine.ActionStrengthen.itemEffectGainTp.call(this, target, newEffect);
	};
	
	Game_Action.prototype.actionStrengthenValue = function(result, isSkill, item, target) {
		var sign = result > 0;
		var value = this.getActionStrengthenValues(isSkill, item, target);
		result += this.getActionStrengthenCode(value, target);
		result += this.getActionStrengthenFlat(value);
		result *= this.getActionStrengthenRate(value);
		if (sign) { return Math.max(result, 0) }  else { return Math.min(result, 0) };
	};
	
	Game_Action.prototype.actionStrengthenValueRate = function(result, isSkill, item, target) {
		var value = this.getActionStrengthenValues(isSkill, item, target);
		return result * this.getActionStrengthenRate(value);
	};

	Game_Action.prototype.getActionStrengthenRate = function(value) {
		var result = value.reduce(function(r, data) { return r + (data.rate || 0) }, 0);
		return Math.max(1.0 + result / 100, 0);
	};   
	
	Game_Action.prototype.getActionStrengthenFlat = function(value) {
		return value.reduce(function(r, data) { return r + (data.flat || 0) }, 0);
	};
	
	Game_Action.prototype.getActionStrengthenCode = function(value, target) {
		var item = this.item();
        var a = this.subject();
        var b = target;
        var v = $gameVariables._data;
		return value.reduce(function(r, data) { 
			var result = 0;
			var code   = eval(data.code)
			if (code) result = (Number(code) || 0);
			return r + result;
		}, 0);
	};
	
	Game_Action.prototype.getActionStrengthenValues = function(isSkill, item, target) {
		var subject = this.subject();
		return VictorEngine.getAllObjects(subject).reduce(function(r, data) {
			var value = Game_Action.prototype.getActionStrengthenData.call(this, subject, data, isSkill, item);
			return r.concat(value);
		}, []);
	};
	
	Game_Action.prototype.getActionStrengthenData = function(subject, data, isSkill, item) {
		var value;
		var result = [];
		if (isSkill) {
			var itemValue = data.skillStrengthen[item.id] || {};
			var typeValue = data.stypeStrengthen[item.stypeId] || {};
		} else {
			var itemValue = data.itemStrengthen[item.id]  || {};
			var typeValue = data.itypeStrengthen[item.itypeId] || {};
		};
		var stateValue = VictorEngine.getAllStates(subject, item).reduce(function(r, stateId) {
			value = data.stateStrengthen[stateId] || {};
			return r.concat(value);
		}, []);
		var elmtnValue = VictorEngine.getAllElements(subject, item).reduce(function(r, elementId) {
			value = data.elmntStrengthen[elementId] || {};
			return r.concat(value);
		}, []);
		return result.concat(itemValue, typeValue, stateValue, elmtnValue);
	};

	Game_Action.prototype.itemEffectStrengthen = function(target, effect) {
		var newEffect = {};
		newEffect.code   = effect.code;
		newEffect.dataId = effect.dataId;
		newEffect.value1 = this.actionStrengthenValueRate(effect.value1, this.isSkill(), this.item(), target);
		newEffect.value2 = this.actionStrengthenValue(effect.value2, this.isSkill(), this.item(), target);
		return newEffect
	};
	
})(); 
