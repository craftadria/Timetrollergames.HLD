//=============================================================================
// Driftwood Gaming Plugins - No Escaping Random Battles
// DG_NoEscape.js
//=============================================================================
/*:
* @plugindesc v0.80 Disables Escape functionallity for random battles.
* @author Driftwood Gaming Plugins
*/
Game_Player.prototype.executeEncounter = function() {
    if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
        this.makeEncounterCount();
        var troopId = this.makeEncounterTroopId();
        if ($dataTroops[troopId]) {
            BattleManager.setup(troopId, false, false);
            BattleManager.onEncounter();
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
