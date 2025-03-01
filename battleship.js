let view = {
  displayMessage: function (msg) {
    let messageArea = document.querySelector('#messageArea');
    if (messageArea !== null) {
      messageArea.innerText = msg;
    } else {
      console.error('no messageArea', messageArea)
    }
  },
  displayHit: function (location) {
    let hit = document.getElementById(location);
    if (hit !== null) {
      hit.setAttribute('class', 'hit');
    } else {
      console.error('no hit', hit)
    }
  },
  displayMiss: function (location) {
    let miss = document.getElementById(location);
    if (miss !== null) {
      miss.setAttribute('class', 'miss');
    } else {
      console.error('no miss', miss)
    }
  },
}

let model = {
  boardSize: 7, // размер игрового поля
  numShips: 3, // количесво кораблей в игре
  shipLength: 3, // длина корабля в клетках
  shipsSunk: 0, // количество потоплиных кораблей
  ships: [
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
  ],
  generateShipLocations: function () {
    let locations;
    for (let i = 0; i < this.numShips; i++) {
      do {locations = this.generateShip()} while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  generateShip: function () {
    let direction = Math.floor(Math.random() * 2);
    let row, col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    let newShipLocations = [];
    for (let i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },
  collision: function (locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },
  fire: function(guess) { // Метод проверки попаданий
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      let index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = 'hit';
        view.displayHit(guess);
        view.displayMessage("Попадание 🧨");
        if (this.isSunk(ship)) {
          view.displayMessage('🚢 Корабль потоплен 💧');
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("Промах 🏳");
    return false;
  },
  isSunk: function(ship) { // Метод проверки потоплен корабль или нет
    for (let i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== 'hit') {
        return false;
      }
    }
    return true;
  },
}

function parseGuess(guess) {
  let alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Не верно, пожалуйста, введите букву и цифру на доске.");
  } else {
    let firstChar = guess.charAt(0); // Извлекаем первый символ строки
    let row = alphabet.indexOf(firstChar);
    let column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert('К сожалению, этого нет на доске.');
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      alert('Упс, это исключено!');
    } else {
      return row + column;
    }
  }

  return null;
}

var controller = {
  guesses: 0,
  processGuess: function(guess) {
    let location = parseGuess(guess);
    if (location) {
      this.guesses++;
      let hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage('Ты потопил все мои линкоры за ' + this.guesses + ' выстрелов.')
      }
    }
  },
}

function init () {
  let fireButton = document.getElementById('fireButton');
  fireButton.onclick = handleFireButton;
  let guessInput = document.getElementById('guessInput');
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}

function handleFireButton () {
  let guessInput = document.getElementById('guessInput');
  let guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = '';
}

function handleKeyPress (e) {
  let fireButton = document.getElementById('fireButton');
  if (e.keyCode === 13) {
    fireButton.click();
    return false;

  }
}

window.onload = init;