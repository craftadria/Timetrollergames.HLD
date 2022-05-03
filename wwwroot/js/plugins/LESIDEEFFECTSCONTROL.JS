/*
#=============================================================================
# Side Effects Control
# LeSideEffectsControl.js
# By Lecode
# Version 1.0
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# - Credit required
# - Keep this header
# - Free for commercial use
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
#=============================================================================
*/
var Imported = Imported || {};
Imported.Lecode_SideEffectsControl = true;
/*:
 * @plugindesc Coming soon
 * @author Lecode
 * @version 1.0
 *
 * @help
 * Adds complex effects to battlers and skills
 *
*/
//#=============================================================================
(function() {

var leSEvars = {};

function evalCodes(func,obj,str) {
	if( obj == null) return;
	var kind = obj;
	if(obj instanceof Game_Actor) { obj = obj.actor(); }
	if(obj instanceof Game_Enemy) { obj = obj.enemy(); }
	tieKeyFunctions(func);
	var note = obj.note;
	eval("var reg = \/<leffect:[ ]?"+str+"[ ]?>[ ,\\n]?((.|\\n)*?)[ ,\\n]?<\\/leffect>\/ig");
	var results;
	var output = [];
	while (results = reg.exec(note) ){
		if(!(results == null)) {
			var code = results[1];
			var subReg = /req[ ]?:[ ]?(.+)/ig;
			var resultsCd;
			var valid = true;
			while(resultsCd = subReg.exec(code)) {
				if(!(resultsCd == null)) {
					var condition = resultsCd[1];
					if(!eval(condition)) {
						valid = false;
						break;
					}
				}
			}
			code = code.replace(/req[ ]?:(.+)/ig,"");
			if(valid)
				eval.call(func,code);
		}
	}
	//-
	if(kind instanceof Game_Actor) {
		kind.skills().forEach(function(skill){
			evalCodes(func,skill,str);
		});
	}
	//-
	if(kind instanceof Game_Battler){
		kind.states().forEach(function(state){
			evalCodes(func,state,str);
		});
	}
}


/*=============================================
-----------		BATTLERS EFFECTS	-----------
===============================================*/

//- When Battle Start/End
function WhenBattleTimeOnMe(info,occ,time) {
	info.a = info.subject;
	WhenBattleTime(info,occ,"",time);
}

function WhenBattleTimeOn(info,occ,targetType,time) {
	info.a = info.battler;
	WhenBattleTime(info,occ,targetType+" ",time);
}

//- When Turn Start/End
function WhenTurnTimeOnMe(info,occ,time) {
	info.a = info.subject;
	WhenTurnTime(info,occ,"",time);
}

function WhenTurnTimeOn(info,occ,targetType,time) {
	info.a = info.battler;
	WhenTurnTime(info,occ,targetType+" ",time);
}

//- When Action Start/End
function WhenActionTimeOnMe(info,occ,time) {
	info.a = info.subject;
	WhenActionTime(info,occ,"",time);
}

function WhenActionTimeOn(info,occ,targetType,time) {
	info.a = info.battler;
	WhenActionTime(info,occ,targetType+" ",time);
}

//- When Attack/Skill/Item/Guard Invoked
function WhenObjectInvokedByMe(info,occ,objType) {
	info.a = info.subject;
	info.b = info.target;
	info.result = info.b.result();
	WhenSomethingInvoked(info,occ,objType,"");
}

function WhenObjectInvokedOnMe(info,occ,objType) {
	info.a = info.target;
	info.b = info.subject;
	info.result = info.a.result();
	WhenSomethingInvoked(info,occ,objType," on me");
}

function WhenObjectInvokedBy(info,occ,targetType,objType) {
	info.a = info.battler;
	info.b = info.target;
	info.result = info.b.result();
	WhenSomethingInvoked(info,occ,objType," by "+targetType);
}

function WhenObjectInvokedOn(info,occ,targetType,objType) {
	info.a = info.battler;
	info.b = info.target;
	if(targetType === "ally") 
		info.result = info.ally.result();
	else
		info.result = info.enemy.result();
	WhenSomethingInvoked(info,occ,objType," on "+targetType);
}

//- When Attack/Skill/Item/Guard Dmg dealt
function WhenDmgAppliedByMe(info,occ,objType) {
	info.a = info.subject;
	info.b = info.target;
	info.result = info.b.result();
	return WhenDmgDealt(info,occ,objType," applied");
}

function WhenDmgReceived(info,occ,objType) {
	info.a = info.target;
	info.b = info.subject;
	info.result = info.a.result();
	return WhenDmgDealt(info,occ,objType," received");
}

function WhenDmgAppliedBy(info,occ,targetType,objType) {
	info.a = info.battler;
	info.b = info.target;
	info.result = info.b.result();
	return WhenDmgDealt(info,occ,objType," applied by "+targetType);
}

function WhenDmgReceivedOn(info,occ,targetType,objType) {
	info.a = info.battler;
	info.b = info.target;
	if(targetType === "ally") 
		info.result = info.ally.result();
	else
		info.result = info.enemy.result();
	return WhenDmgDealt(info,occ,objType," received on "+targetType);
}

//- When Attack/Skill/Item/Guard Effects applied
function WhenEffectsAppliedByMe(info,occ,objType) {
	info.a = info.subject;
	info.b = info.target;
	info.result = info.b.result();
	WhenEffectsApplied(info,occ,objType," applied");
}

function WhenEffectsAppliedOnMe(info,occ,objType) {
	info.a = info.target;
	info.b = info.subject;
	info.result = info.a.result();
	WhenEffectsApplied(info,occ,objType," received");
}

function WhenEffectsAppliedBy(info,occ,targetType,objType) {
	info.a = info.battler;
	info.b = info.target;
	info.result = info.b.result();
	WhenEffectsApplied(info,occ,objType," applied by "+targetType);
}

function WhenEffectsAppliedOn(info,occ,targetType,objType) {
	info.a = info.battler;
	info.b = info.target;
	if(targetType === "ally") 
		info.result = info.ally.result();
	else
		info.result = info.enemy.result();
	WhenEffectsApplied(info,occ,objType," received on "+targetType);
}

//-

function WhenBattleTime(info,occ,extra,time) {
	this.a = info.a;
	this.ally = info.ally;
	this.enemy = info.enemy;
	evalCodes(this,a,occ + " " + extra + "battle " + time);
}

function WhenTurnTime(info,occ,extra,time) {
	this.a = info.a;
	this.ally = info.ally;
	this.enemy = info.enemy;
	evalCodes(this,a,occ + " " + extra + "turn " + time);
}

function WhenActionTime(info,occ,extra,time) {
	this.a = info.a;
	this.ally = info.ally;
	this.enemy = info.enemy;
	this.action = info.action;
	this.obj = this.action.item();
	if(this.action.isSkill()) {
		this.skill = info.action.item();
		this.skillID = info.action.item().id;
	}
	if(this.action.isItem()) {
		this.item = info.action.item();
		this.itemID = info.action.item().id;
	}
	evalCodes(this,a,occ + " " + extra + "action " + time);
}

function WhenSomethingInvoked(info,occ,objType,extra,isAny) {
	this.a = info.a;
	this.b = info.b;
	this.ally = info.ally;
	this.enemy = info.enemy;
	this.action = info.action;
	this.result = info.result;
	this.obj = this.action.item();
	if(objType === "skill") {
		this.skill = info.action.item();
		this.skillID = info.action.item().id;
	}
	if(objType === "item") {
		this.item = info.action.item();
		this.itemID = info.action.item().id;
	}
	evalCodes(this,a,occ + " " + objType + " invoked" + extra);
	if(!isAny) WhenSomethingInvoked(info,occ,"any obj",extra,true);
}

function WhenDmgDealt(info,occ,objType,extra,isAny) {
	this.a = info.a;
	this.b = info.b;
	this.ally = info.ally;
	this.enemy = info.enemy;
	this.action = info.action;
	this.result = info.result;
	this.value = info.value;
	this.toHp = info.action.isHpEffect();
	this.toMp = info.action.isMpEffect();
	this.isDrain = info.action.isDrain();
	this.obj = this.action.item();
	if(objType === "skill") {
		this.skill = info.action.item();
		this.skillID = info.action.item().id;
	}
	if(objType === "item") {
		this.item = info.action.item();
		this.itemID = info.action.item().id;
	}
	evalCodes(this,a,occ + " " + objType + " dmg" + extra);
	info.value = this.value;
	if(!isAny)
		this.value = WhenDmgDealt(info,occ,"any",extra,true);
	return Math.floor(this.value);
}

function WhenEffectsApplied(info,occ,objType,extra,isAny) {
	this.a = info.a;
	this.b = info.b;
	this.ally = info.ally;
	this.enemy = info.enemy;
	this.action = info.action;
	this.effect = info.effect;
	this.code = effect.code;
	if(objType === "skill") {
		this.skill = info.action.item();
		this.skillID = info.action.item().id;
	}
	if(objType === "item") {
		this.item = info.action.item();
		this.itemID = info.action.item().id;
	}
	evalCodes(this,a,occ + " " + objType + " effects" + extra);
	if(!isAny) WhenEffectsApplied(info,occ,"any",extra,true);
}


/*=============================================
-----------		KEY FUNCTIONS	---------------
===============================================*/

function tieKeyFunctions(obj) {
	obj.hpDmgWpopup = hpDmgWpopup;
	obj.mpDmgWpopup = mpDmgWpopup;
	obj.anim = anim;
	obj.castSkill = castSkill;
	obj.castAtk = castAtk;
	obj.silentCastSkill = silentCastSkill;
	obj.silentCastSAtk = silentCastAtk;
	obj.logW = logW;
	obj.logNewText = logNewText;
	obj.setVar = setVar;
	obj.changeVar = changeVar;
	obj.getVar = getVar;
	obj.chance = chance;
	obj.getActor = getActor;
	obj.getRandomActor = getRandomActor;
	obj.getEnemy = getEnemy;
	obj.getRandomEnemy = getRandomEnemy;
	obj.getAllies = getAllies;
	obj.getEnemies = getEnemies;
	obj.getWeakestAlly = getWeakestAlly;
	obj.getWeakestEnemy = getWeakestEnemy;
	obj.getStrongestAlly = getStrongestAlly;
	obj.getStrongestEnemy = getStrongestEnemy;
}

function hpDmgWpopup(battler,value) {
    var result = new Game_ActionResult();
    value = Math.floor(value);
    result.used = true;
    result.hpAffected = true;
    result.hpDamage = value;
    battler._damagePopup.push(result);
    battler.setHp(battler.hp - value);
};

function mpDmgWpopup(battler,value) {
    var result = new Game_ActionResult();
    value = Math.floor(value);
    result.used = true;
    result.mpAffected = true;
    result.mpDamage = value;
    battler._damagePopup.push(result);
    battler.setMp(battler.mp - value);
};

function anim(targets,animId,mirror) {
	if(!(targets instanceof Array)) {
		targets = [targets];
	}
	BattleManager._logWindow.showNormalAnimation(targets, animId, mirror || false);
}

function castSkill(battler,target,id) {
	var info = {};
	var actions = battler._actions;
	battler.forceAction(id,target.index());
	var action = battler.currentAction();
	info.battler = battler;
	info.action = action;
	BattleManager.leStackForceAction(info);
	battler._actions = actions;
	var bmSubject = BattleManager._subject;
	var actionState = battler._actionState;
	battler._leSEafterActions = [actions,bmSubject,actionState];
}

function castAtk(battler,target) {
	var info = {};
	var actions = battler._actions;
	battler.forceAction(1,target.index());
	battler.currentAction().setAttack();
	var action = battler.currentAction();
	info.battler = battler;
	info.action = action;
	BattleManager.leStackForceAction(info);
	battler._actions = actions;
	var bmSubject = BattleManager._subject;
	var actionState = battler._actionState;
	//if(!battler._leSEafterActions)
	battler._leSEafterActions = [actions,bmSubject,actionState];
}

function silentCastSkill(battler,target,id,dmgPopup) {
	var actions = battler._actions;
	battler.forceAction(id,target.index());
	var action = battler.currentAction();
	action.apply(target);
	if(dmgPopup)
		target.startDamagePopup();
	battler._actions = actions;
}

function silentCastAtk(battler,target,dmgPopup) {
	var actions = battler._actions;
	battler.forceAction(1,target.index());
	battler.currentAction().setAttack();
	var action = battler.currentAction();
	action.apply(target);
	if(dmgPopup)
		target.startDamagePopup();
	battler._actions = actions;
}

function logW() {
	return BattleManager._logWindow;
}

function logNewText(str,icon) {
	if(!logW()) return;
	if(icon)
		logW()._actionIcon = icon;
	logW().push('addText','<SIMPLE>' + str);
}

function setVar(id,val,obj) {
	if(obj) {
		obj._le_SE_vArs = obj._le_SE_vArs || {};
		obj._le_SE_vArs[id] = val;
	} else
		leSEvars[id] = val;
}

function getVar(id,obj) {
	if(obj) {
		obj._le_SE_vArs = obj._le_SE_vArs || {};
		return obj._le_SE_vArs[id];
	} else
		return leSEvars[id];
}

function changeVar(id,val,obj) {
	if(obj) {
		obj._le_SE_vArs = obj._le_SE_vArs || {};
		obj._le_SE_vArs[id] += val;
	} else
		leSEvars[id] += val;
}

function chance(nbr) {
	return Math.random() <= nbr*0.01;
}

function searchBattlerInPt(pt,type,arg) {
	for(var i = 0; i < pt.length; i++) {
		var battler = pt[i];
		if(eval("battler."+type+" == arg")) {
			return battler;
		}
	}
}

function getActor(arg) {
	if(typeof(arg) === "string") {
		return searchBattlerInPt($gameParty.battleMembers(),"name",arg);
	} else if(typeof(arg) === "number") {
		return searchBattlerInPt($gameParty.battleMembers(),"index()",arg);
	}
}

function getRandomActor() {
	var pt = $gameParty.battleMembers();
	return LeUtilities.getRandomValueInArray(pt);
}

function getEnemy(arg) {
	if(typeof(arg) === "string") {
		return searchBattlerInPt($gameTroop.members(),"name",arg);
	} else if(typeof(arg) === "number") {
		return searchBattlerInPt($gameTroop.members(),"index()",arg);
	}
}

function getRandomEnemy() {
	var pt = $gameTroop.members();
	return LeUtilities.getRandomValueInArray(pt);
}

function getAllies(battler) {
	var pt = [];
	var unit = battler.friendsUnit().members();
	for(var i = 0; i < unit.length; i++) {
		var ally = unit[i];
		if(!(ally === battler)) pt.push(ally);
	}
	return pt;
}

function getEnemies(battler) {
	return battler.opponentsUnit().members();
}

function getWeakestBattler(param,pt) {
	return pt.sort(function(a,b){
		return (a[param] > b[param]) ? 1 : ( (a[param] < b[param]) ? -1 : 0 );
	});
}

function getWeakestAlly(param,battler) {
	return getWeakestBattler(param,battler.friendsUnit().members())[0];
}

function getWeakestEnemy(param,battler) {
	return getWeakestEnemy(param,battler.opponentsUnit().members())[0];
}

function getStrongestAlly(param,battler) {
	return getWeakestBattler(param,battler.friendsUnit().members()).last;
}

function getStrongestEnemy(param,battler) {
	return getWeakestEnemy(param,battler.opponentsUnit().members()).last;
}

/*=============================================
-----------	 EFFECTS CALLING	---------------
===============================================*/

//- When Battle Start
var oldGB_onBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function() {
    var info = {
    	subject: this
    }
    processWhenOnBattleTime(info,"before","start");
	oldGB_onBattleStart.call(this);
    processWhenOnBattleTime(info,"after","start");
};

//- When Turn Start
var oldBM_processTurn = BattleManager.processTurn;
BattleManager.processTurn = function() {
    var info = {
    	subject: this._subject
    }
    if (info.subject.currentAction()) {
		processWhenProcessTurn(info,"before","start");
    	oldBM_processTurn.call(this);
		processWhenProcessTurn(info,"after","start");
	} else {
    	oldBM_processTurn.call(this);
	}
};

//- When Action Start
var oldGA_startAction = BattleManager.startAction;
BattleManager.startAction = function() {
    var info = {
    	subject: this._subject,
    	action: this._subject.currentAction()
    }
	processWhenTimeAction(info,"before","start");
	oldGA_startAction.call(this);
	processWhenTimeAction(info,"after","start");
};

//- When Battle End
var oldGB_onBattleEnd = Game_Battler.prototype.onBattleEnd;
Game_Battler.prototype.onBattleEnd = function() {
    var info = {
    	subject: this
    }
    processWhenOnBattleTime(info,"before","end");
	oldGB_onBattleEnd.call(this);
    processWhenOnBattleTime(info,"after","end");
};

//- When Turn End
var oldGB_onTurnEnd = Game_Battler.prototype.onTurnEnd;
Game_Battler.prototype.onTurnEnd = function() {
    var info = {
    	subject: this
    }
	processWhenProcessTurn(info,"before","end");
    oldGB_onTurnEnd.call(this);
	processWhenProcessTurn(info,"after","end");
};

//- When Action End
var oldBM_endAction = BattleManager.endAction;
BattleManager.endAction = function() {
    var info = {
    	subject: this._subject,
    	action: this._action
    }
	processWhenTimeAction(info,"before","end");
    oldBM_endAction.call(this);
	processWhenTimeAction(info,"after","end");
};

//- When Attack/Guard/Item/Skill Invoked
var oldBM_invokeNormalAction = BattleManager.invokeNormalAction;
BattleManager.invokeNormalAction = function(subject, target) {
    var info = {
    	subject: subject,
    	target: target,
    	action: this._action
    }
    var action = info.action;
	if(action.isSkill()) {
		if(action.isAttack()) {
			processWhenInvokeNormalAction(info,"attack","before");
			oldBM_invokeNormalAction.call(this,subject,target);
			processWhenInvokeNormalAction(info,"attack","after");
		} else if (action.isGuard()) {
			processWhenInvokeNormalAction(info,"guard","before");
			oldBM_invokeNormalAction.call(this,subject,target);
			processWhenInvokeNormalAction(info,"guard","after");
		} else {
			processWhenInvokeNormalAction(info,"skill","before");
			oldBM_invokeNormalAction.call(this,subject,target);
			processWhenInvokeNormalAction(info,"skill","after");
		}
	} else if (action.isItem()) {
			processWhenInvokeNormalAction(info,"item","before");
		oldBM_invokeNormalAction.call(this,subject,target);
			processWhenInvokeNormalAction(info,"item","after");
	} else {
		oldBM_invokeNormalAction.call(this,subject,target);
	}
};

//- When Attack/Skill/Item Dmg Dealt
var oldGA_executeDamage = Game_Action.prototype.executeDamage;
Game_Action.prototype.executeDamage = function(target, value) {
    var info = {
    	subject: this.subject(),
    	target: target,
    	value: value,
    	action: this,
    	result: target.result()
    }
    if(this.isSkill()) {
    	if(this.isAttack()) {
    		value = processWhenExecuteDamage(info,"attack","before");
    		oldGA_executeDamage.call(this,target,value);
    		value = processWhenExecuteDamage(info,"attack","after");
    	} else {
    		value = processWhenExecuteDamage(info,"skill","before");
    		oldGA_executeDamage.call(this,target,value);
    		value = processWhenExecuteDamage(info,"skill","after");
    	}
    } else if(this.isItem()) {
    		value = processWhenExecuteDamage(info,"item","before");
    	oldGA_executeDamage.call(this,target,value);
    		value = processWhenExecuteDamage(info,"item","after");
    } else {
    	oldGA_executeDamage.call(this,target,value);
    }
};

//- When Attack/Skill/Item Effects Applied
var oldGA_applyItemEffect = Game_Action.prototype.applyItemEffect;
Game_Action.prototype.applyItemEffect = function(target, effect) {
    var info = {
    	subject: this.subject(),
    	target: target,
    	action: this,
    	effect: effect
    }
	if(this.isSkill()) {
		if(this.isAttack()) {
			processWhenApplyItemEffect(info,"attack","before");
			oldGA_applyItemEffect.call(this,target,effect);
			processWhenApplyItemEffect(info,"attack","after");
		} else {
			processWhenApplyItemEffect(info,"skill","before");
			oldGA_applyItemEffect.call(this,target,effect);
			processWhenApplyItemEffect(info,"skill","after");
		}
	} else if(this.isItem()) {
			processWhenApplyItemEffect(info,"item","before");
		oldGA_applyItemEffect.call(this,target,effect);
			processWhenApplyItemEffect(info,"item","before");
	} else {
		oldGA_applyItemEffect.call(this,target,effect);
	}
};


/*=============================================
--------------  PROCESS CALLING	---------------
===============================================*/

function processWhenOnBattleTime(info,occ,time) {
	WhenBattleTimeOnMe(info,occ,time);
	processAllyBattleTime(info,occ,time);
	processEnemyBattleTime(info,occ,time);
}

function processWhenProcessTurn(info,occ,time) {
	WhenTurnTimeOnMe(info,occ,time);
	processAllyTurnTime(info,occ,time);
	processEnemyTurnTime(info,occ,time);
}

function processWhenTimeAction(info,occ,time) {
	WhenActionTimeOnMe(info,occ,time);
	processAllyActionTime(info,occ,time);
	processEnemyActionTime(info,occ,time);
}

function processWhenInvokeNormalAction(info,objType,occ) {
	WhenObjectInvokedByMe(info,occ,objType);
	WhenObjectInvokedOnMe(info,occ,objType);
	processInvokedByAlly(info,occ,objType);
	processInvokedOnAlly(info,occ,objType);
	processInvokedByEnemy(info,occ,objType);
	processInvokedOnEnemy(info,occ,objType);
}

function processWhenExecuteDamage(info,objType,occ) {
	var val = WhenDmgAppliedByMe(info,occ,objType);
	val = WhenDmgReceived(info,occ,objType);
	val = processDmgAppliedByAlly(info,occ,objType);
	val = processDmgReceivedOnAlly(info,occ,objType);
	val = processDmgAppliedByEnemy(info,occ,objType);
	val = processDmgReceivedOnEnemy(info,occ,objType);
	return val;
}

function processWhenApplyItemEffect(info,objType,occ) {
	WhenEffectsAppliedByMe(info,occ,objType);
	WhenEffectsAppliedOnMe(info,occ,objType);
	processEffectsByAlly(info,occ,objType);
	processEffectsOnAlly(info,occ,objType);
	processEffectsByEnemy(info,occ,objType);
	processEffectsOnEnemy(info,occ,objType);
}

//-

function processAllyBattleTime(info,occ,time) {
	var pt = getAllies(info.subject);
	info.ally = info.subject;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		WhenBattleTimeOn(info,occ,"ally",time);
	}
}

function processEnemyBattleTime(info,occ,time) {
	var pt = getEnemies(info.subject);
	info.enemy = info.subject;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		WhenBattleTimeOn(info,occ,"enemy",time);
	}
}

function processAllyTurnTime(info,occ,time) {
	var pt = getAllies(info.subject);
	info.ally = info.subject;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		WhenTurnTimeOn(info,occ,"ally",time);
	}
}

function processEnemyTurnTime(info,occ,time) {
	var pt = getEnemies(info.subject);
	info.enemy = info.subject;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		WhenTurnTimeOn(info,occ,"enemy",time);
	}
}

function processAllyActionTime(info,occ,time) {
	var pt = getAllies(info.subject);
	info.ally = info.subject;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		WhenActionTimeOn(info,occ,"ally",time);
	}
}

function processEnemyActionTime(info,occ,time) {
	var pt = getEnemies(info.subject);
	info.enemy = info.subject;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		WhenActionTimeOn(info,occ,"enemy",time);
	}
}

function processInvokedByAlly(info,occ,type) {
	var pt = getAllies(info.subject);
	info.ally = info.subject;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		WhenObjectInvokedBy(info,occ,"ally",type);
	}
}

function processInvokedOnAlly(info,occ,type) {
	var oldTarget = info.target;
	var pt = getAllies(info.target);
	info.ally = info.target;
	info.target = info.subject;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		WhenObjectInvokedOn(info,occ,"ally",type);
	}
	info.target = oldTarget;
}

function processInvokedByEnemy(info,occ,type) {
	var pt = getEnemies(info.subject);
	info.enemy = info.subject;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		WhenObjectInvokedBy(info,occ,"enemy",type);
	}
}

function processInvokedOnEnemy(info,occ,type) {
	var oldTarget = info.target;
	var pt = getEnemies(info.target);
	info.enemy = info.target;
	info.target = info.subject;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		WhenObjectInvokedOn(info,occ,"enemy",type);
	}
	info.target = oldTarget;
}

function processDmgAppliedByAlly(info,occ,type) {
	var pt = getAllies(info.subject);
	info.ally = info.subject;
	var val = info.value;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		val = WhenDmgAppliedBy(info,occ,"ally",type);
	}
	return val;
}

function processDmgReceivedOnAlly(info,occ,type) {
	var oldTarget = info.target;
	var pt = getAllies(info.target);
	info.ally = info.target;
	info.target = info.subject;
	var val = info.value;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		val = WhenDmgReceivedOn(info,occ,"ally",type);
	}
	info.target = oldTarget;
	return val;
}

function processDmgAppliedByEnemy(info,occ,type) {
	var pt = getEnemies(info.subject);
	info.enemy = info.subject;
	var val = info.value;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		val = WhenDmgAppliedBy(info,occ,"enemy",type);
	}
	return val;
}

function processDmgReceivedOnEnemy(info,occ,type) {
	var oldTarget = info.target;
	var pt = getEnemies(info.target);
	info.enemy = info.target;
	info.target = info.subject;
	var val = info.value;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		val = WhenDmgReceivedOn(info,occ,"enemy",type);
	}
	info.target = oldTarget;
	return val;
}

function processEffectsByAlly(info,occ,type) {
	var pt = getAllies(info.subject);
	info.ally = info.subject;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		WhenEffectsAppliedBy(info,occ,"ally",type);
	}
}

function processEffectsOnAlly(info,occ,type) {
	var oldTarget = info.target;
	var pt = getAllies(info.target);
	info.ally = info.target;
	info.target = info.subject;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		WhenEffectsAppliedOn(info,occ,"ally",type);
	}
	info.target = oldTarget;
}

function processEffectsByEnemy(info,occ,type) {
	var pt = getEnemies(info.subject);
	info.enemy = info.subject;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		WhenEffectsAppliedBy(info,occ,"enemy",type);
	}
}

function processEffectsOnEnemy(info,occ,type) {
	var oldTarget = info.target;
	var pt = getEnemies(info.target);
	info.enemy = info.target;
	info.target = info.subject;
	for(var i = 0; i < pt.length; i++) {
		info.battler = pt[i];
		WhenEffectsAppliedOn(info,occ,"enemy",type);
	}
	info.target = oldTarget;
}


/*=============================================
----------------  RTP MODIFS	---------------
===============================================*/

var oldBM_iniMembers = BattleManager.initMembers;
BattleManager.initMembers = function() {
	oldBM_iniMembers.call(this);
	this._forcedActionStack = [];
};

BattleManager.leStackForceAction = function(info) {
    this._forcedActionStack.push(info);
};

var oldBM_update = BattleManager.update;
BattleManager.update = function() {
	this.leCheckForceActionStack();
	oldBM_update.call(this);
};

BattleManager.leCheckForceActionStack = function() {
	if(this._actionForcedBattler == null) {
		var info = this._forcedActionStack.shift();
		if( info ) {
			var battler = info.battler;
			var action = info.action;
			battler.clearActions();
    		battler._actions.push(action);
			this.forceAction(battler);
		}
	}
};

var oldBM_endAction2 = BattleManager.endAction;
BattleManager.endAction = function() {
    oldBM_endAction2.call(this);
    var subject = this._subject;
    if (subject && subject._leSEafterActions && this._actionForcedBattler != subject){
    	var info = subject._leSEafterActions;
        subject._actions = info[0];
        this._subject = info[1];
        subject.setActionState(info[2]);
        subject._leSEafterActions = null;
    	$gameParty.requestMotionRefresh();
    }
};


})();