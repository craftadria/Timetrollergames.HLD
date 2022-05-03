/*:
* @plugindesc Allows a state to evolve to another state upon the state's removal.
* @author Soulpour777
*
* @help

SOUL_MV State Evolve.js
Author: Soulpour777

This plugin does not have any plugin commands.

Note Tags:

In the state's note box, add this note tag:

<stateEvolve: x>

where x is the state the state given the tag to will evolve.

For example, if you placed:

<stateEvolve: 1>

on the Poison state, it means that when Poison wears off,
your character will be inflicted with State #1, which is
death state.

*/
(function(){
    var SOUL_MV = SOUL_MV || {};
    SOUL_MV.StateDecay = {};

    SOUL_MV.StateDecay._gameBattler_removeState = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function(stateId) {
        SOUL_MV.StateDecay._gameBattler_removeState.call(this, stateId);
        this.evolveStatePastRemoval(stateId);
    };

    Game_Battler.prototype.evolveStatePastRemoval = function(stateId){
        // this evolves the old state to a new one.
        var newstate = $dataStates[stateId].note.match(/<\s*stateEvolve\s*:\s*(\d+)\s*>/im);
        if (newstate){
            var newStateId = Number(newstate[1]);
            this.addState(newStateId);
        }
    };    
})();