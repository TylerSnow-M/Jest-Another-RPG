import Potion from "./Potion.js";

//generates the player with randomized stats within a limit
function Player(name = "") {
  this.name = name;

  this.health = Math.floor(Math.random() * 10 + 95);
  this.strength = Math.floor(Math.random() * 5 + 7);
  this.agility = Math.floor(Math.random() * 5 + 7);

  this.inventory = [new Potion("health"), new Potion()];
}

//shows player stats and inventory between fights
Player.prototype.getStats = function () {
  return {
    potions: this.inventory.length,
    health: this.health,
    strength: this.strength,
    agility: this.agility,
  };
};

Player.prototype.getInventory = function () {
  if (this.inventory.length) {
    return this.inventory;
  }
  return false;
};

//states player health after healing or taking damage
Player.prototype.getHealth = function () {
  return `${this.name}'s health is now ${this.health}!`;
};

//checks that player is still alive
Player.prototype.isAlive = function () {
  if (this.health === 0) {
    return false;
  }
  return true;
};

//reduces player health when attacked by enemy
Player.prototype.reduceHealth = function (health) {
  this.health -= health;

  if (this.health < 0) {
    this.health = 0;
  }
};

Player.prototype.getAttackValue = function () {
  const min = this.strength - 5;
  const max = this.strength + 5;

  return Math.floor(Math.random() * (max - min) + min);
};

Player.prototype.addPotion = function (potion) {
  this.inventory.push(potion);
};

//uses potion from inventory with set effects based off strength, agility or health
Player.prototype.usePotion = function (index) {
  const potion = this.getInventory().splice(index, 1)[0];

  switch (potion.name) {
    case "agility":
      this.agility += potion.value;
      break;
    case "health":
      this.health += potion.value;
      break;
    case "strength":
      this.strength += potion.value;
      break;
  }
};

export default Player;