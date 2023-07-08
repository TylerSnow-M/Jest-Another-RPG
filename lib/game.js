import inquirer from "inquirer";
import Enemy from "./Enemy.js";
import Player from "./Player.js";

//initializes game
async function initializeGame() {
  const game = new Game();
  await game.promptForName();
  game.initializeGame();
  await game.startNewBattle();
  return game;
}

//dictates whos turn it is
function Game() {
  this.roundNumber = 0;
  this.isPlayerTurn = false;
  this.enemies = [];
  this.currentEnemy = null;
  this.player = null;
}

//creates enemies upon game start in order
Game.prototype.initializeGame = function () {
  this.enemies.push(new Enemy("goblin", "sword"));
  this.enemies.push(new Enemy("orc", "baseball bat"));
  this.enemies.push(new Enemy("skeleton", "axe"));
  this.currentEnemy = this.enemies[0];
};

//prompts player for their name
Game.prototype.promptForName = async function () {
  const { name } = await inquirer.prompt({
    type: "text",
    name: "name",
    message: "What is your name?",
  });

  this.player = new Player(name);
};

//begins battle with enemy, show player stats and who they are fighting
Game.prototype.startNewBattle = async function () {
  if (this.player.agility > this.currentEnemy.agility) {
    this.isPlayerTurn = true;
  } else {
    this.isPlayerTurn = false;
  }

  console.log("Your stats are as follows:");
  console.table(this.player.getStats());
  console.log(this.currentEnemy.getDescription());
  await this.battle();
};

//gets player input for action on their turn
Game.prototype.battle = async function () {
  if (this.isPlayerTurn) {
    const { action } = await inquirer.prompt({
      type: "list",
      message: "What would you like to do?",
      name: "action",
      choices: ["Attack", "Use potion"],
    });

    if (action === "Use potion") {
      if (!this.player.getInventory()) {
        console.log("You don't have any potions!");
        this.continueBattle(); // Call continueBattle to proceed to the next turn
        return;
      }

      inquirer
        .prompt({
          type: "list",
          message: "Which potion would you like to use?",
          name: "action",
          choices: this.player
            .getInventory()
            .map((item, index) => `${index + 1}: ${item.name}`),
        })
        .then(({ action }) => {
          const potionDetails = action.split(": ");

          this.player.usePotion(potionDetails[0] - 1);
          console.log(`You used a ${potionDetails[1]} potion.`);

          this.checkEndOfBattle(); // Call checkEndOfBattle after the player's turn
        });
    } else {
      const damage = this.player.getAttackValue();
      this.currentEnemy.reduceHealth(damage);

      console.log(`You attacked the ${this.currentEnemy.name}`);
      console.log(this.currentEnemy.getHealth());

      this.checkEndOfBattle(); // Call checkEndOfBattle after the player's turn
    }
  } else {
    const damage = this.currentEnemy.getAttackValue();
    this.player.reduceHealth(damage);

    console.log(`You were attacked by the ${this.currentEnemy.name}`);
    console.log(this.player.getHealth());

    this.checkEndOfBattle(); // Call checkEndOfBattle after the enemy's turn
  }
};


//checks if either the player or enemy has been killed
Game.prototype.checkEndOfBattle = function () {
  if (this.player.isAlive() && this.currentEnemy.isAlive()) {
    this.isPlayerTurn = !this.isPlayerTurn;
    this.battle();
  } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
    console.log(`You've defeated the ${this.currentEnemy.name}`);

    this.player.addPotion(this.currentEnemy.potion);
    console.log(
      `${this.player.name} found a ${this.currentEnemy.potion.name} potion`
    );

    this.roundNumber++;

    if (this.roundNumber < this.enemies.length) {
      this.currentEnemy = this.enemies[this.roundNumber];
      this.startNewBattle();
    } else {
      console.log("You win!");
    }
  } else {
    console.log("You've been defeated!");
  }
};

export default initializeGame;