import Potion from "./Potion.js";

//grabs enemy data from array for combat
function Enemy(name, weapon) {
  this.name = name;
  this.weapon = weapon;
  this.potion = new Potion();

  this.health = Math.floor(Math.random() * 10 + 85);
  this.strength = Math.floor(Math.random() * 5 + 5);
  this.agility = Math.floor(Math.random() * 5 + 5);
}


//dictates enemy health when healed or damaged
Enemy.prototype.getHealth = function () {
  return `The ${this.name}'s health is now ${this.health}!`;
};


//checks that enemy is still alive
Enemy.prototype.isAlive = function () {
  if (this.health === 0) {
    return false;
  }
  return true;
};


//gets enemy attack
Enemy.prototype.getAttackValue = function () {
  const min = this.strength - 5;
  const max = this.strength + 5;

  return Math.floor(Math.random() * (max - min) + min);
};


//reduces enemy health after being attacked
Enemy.prototype.reduceHealth = function (health) {
  this.health -= health;

  if (this.health < 0) {
    this.health = 0;
  }
};


//grabs enemy descripton based on array
Enemy.prototype.getDescription = function () {
  return `A ${this.name} holding a ${this.weapon} has appeared!`;
};

export default Enemy;