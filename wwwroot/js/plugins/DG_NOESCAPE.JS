//=============================================================================
// Driftwood Gaming Plugins - No Escaping Random Battles
// DG_NoEscape.js
//=============================================================================
/*:
* @plugindesc v0.80 Adds the ability to toggle escape functionallity to
* random battles.
* @author Driftwood Gaming Plugins
*
* @help
* ============================================================================
* Plugin Commands:
* No Escape   This will disable the ability to escape from random encounters.
* Can Escape  This will enable the ability to escape from random encounters.
*/
//=============================================================================

 var driftwoodPluginCommands = Game_Interpreter.prototype.pluginCommand;
 Game_Interpreter.prototype.pluginCommand = function(command, args)
{
  driftwoodPluginCommands.call(this, command, args);
  if(command === 'No Escape')
    {
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
    }
    driftwoodPluginCommands.call(this, command, args);
    if(command === 'Can Escape')
      {
        Game_Player.prototype.executeEncounter = function() {
            if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
                this.makeEncounterCount();
                var troopId = this.makeEncounterTroopId();
                if ($dataTroops[troopId]) {
                    BattleManager.setup(troopId, true, false);
                    BattleManager.onEncounter();
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };
      }
}
