function randomNumber() {
    return Math.floor(Math.random() * 9 + 1);
  }
  
  module.exports = randomNumber;

  const Potion = require('../lib/Potion.js');