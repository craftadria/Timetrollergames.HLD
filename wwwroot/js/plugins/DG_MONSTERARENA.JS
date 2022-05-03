/*:
 * @plugindesc This will let you create a Monster Arena in MV.
 *
 * @author DriftwoodGaming
 *
 * @param Enemy 1
 * @desc This is the first monster that can be captured. Default = 0
 * @default 0
 *
 *
 *
 * @help This will let you create a Monster Arena in MV. The parameters will
 * store the enemy index of the enemies you want to be captured.
 *
 */
var DG_MonsterArena = PluginManager.parameters('DG_MonsterArena');
var DG_MonsterArena_Enemy_1 = Number(DG_MonsterArena['Enemy 1'] || 0);


 //plugin commands
var DG_MonsterArena_PluginCommands = Game_Interpreter.prototype.pluginCommand;

 Game_Interpreter.prototype.pluginCommand = function(command, args)
{
  DG_MonsterArena_PluginCommands.call(this, command, args);
  if(command == 'drift')
    {
      $gameMessage.add(String(args[0]));
    }
  if(command == 'ArenaEnemy 6')
  {
    if ($dataEnemies[6].meta.ArenaEnemy)
    {

    }
  }
}

//Notetags


//notes
var params = PluginManager.parameters('DG_MonsterArena');
var x_axis_value = Number(params['XAxis'] || 90);
var isRunning = Boolean(params['Running'] || true);
var charName = String(params['CharactersName'] || "Harold");
//args dont contains number unless they are Number(args[0]);
