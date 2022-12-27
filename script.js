import { primes } from "/primes.js";
//picking a prime
var correctPrime = String(primes[Math.floor(Math.random() * primes.length)]);
//all the other variable setup, mostly self-explanatory
var guessesLeft = 6;
var digitsLeft = 5;
var guesses = [];
var resultsToCopy = "Random Primel X/6\n";
var guess = "";
var darkmode = 0;
//list of background colors based on theme, 'light' is a bit misleading since it's just 'non high contrast'
var bgColorsLight = ["rgb(140, 140, 140)", "rgb(89, 172, 83)", "rgb(217, 172, 38)"];
var bgColorsHC = ["rgb(140, 140, 140)", "rgb(245, 119, 56)", "rgb(82, 158, 229)"];
var emojiColorsLight = ["⬜", "🟩", "🟨"]; //Emoji boxes to copy and paste in regular mode...
var emojiColorsHC = ["⬜", "🟧", "🟦"]; //And in high contrast mode.
var bgColors = bgColorsLight;
var emojiColors = emojiColorsLight;
var stats = [] //edited by cookies

function loadTiles() { //Adds all the tiles to the game div, assigning position (grid rows + columns) + id so it can be later edited
  let tiles = document.getElementsByClassName("game")[0];
  for (let i = 0; i < guessesLeft; i++) {
    for (let n = 1; n < 6; n++) {
      let tile = document.createElement("div");
      tile.className = "tile";
      tile.id = `${6 - i}${6 - n}`;
      tile.style.gridRow = `${i + 1}/${i + 2}`;
      tile.style.gridColumn = `${n}/${n + 1}`;
      tiles.appendChild(tile);
    }
  }
}

function configStats() { //runs when page opens and once games are finished, basically gets data of how many guesses are used in games from cookie, slaps it into the stats page and results page.
  let statsInt = stats.map((x) => parseInt(x));
  let numPlayed = statsInt.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  document.getElementById("numPlayed").textContent = String(numPlayed);
  let percentWon;
  let avgGuesses;
  if (numPlayed != 0) {
    percentWon = String(Math.round(100 * (1 - statsInt[6] / numPlayed))) + "%";
    avgGuesses = String(Math.round((statsInt[0] * 1 + statsInt[1] * 2 + statsInt[2] * 3 + statsInt[3] * 4 + statsInt[4] * 5 + statsInt[5] * 6 + statsInt[6] * 7) / numPlayed * 100) / 100); //might change value of lost games for balancing, for now it's just assumed to be 7 turns.
  } else {
    percentWon = "0%";
    avgGuesses = "0";
    numPlayed = 1; //This won't go back into the cookie value. It lets all the percentages for distribution of turns be 0 instead of NaN since there's no divide by zero error, but doesn't affect anything else.
  }
  document.getElementById("percentWon").textContent = percentWon;
  document.getElementById("avgGuesses").textContent = avgGuesses;
  for (let i = 0; i < 2; i++) {
    for (let n = 1; n < 8; n++) {
      document.getElementsByClassName(`num${n}`)[i * 2].textContent = String(statsInt[n - 1]);
      if (statsInt[n - 1] / Math.max(...statsInt) == 0) {
        document.getElementsByClassName(`num${n}`)[i * 2].style.width = null;
      } else {
        document.getElementsByClassName(`num${n}`)[i * 2].style.width = `${statsInt[n - 1] / Math.max(...statsInt) * 100}%`;
      }
      document.getElementsByClassName(`num${n}`)[i * 2 + 1].textContent = `${Math.round(statsInt[n - 1] / numPlayed * 100)}%`;
    }
  }
}
var darkMode = document.getElementById('darkMode'); //check for dark mode being toggled
darkMode.addEventListener('change', function(event) {
  darkToggle(event.target);
});

function darkToggle(e) { //turn dark mode on and off, and then do a billion manual changes to formatting because the class wasn't enough
  if (e.checked) {
    darkmode = 1;
    bakeCookie("display=", `1${getCookie("display=")[1]}`);
    let slider = document.getElementsByClassName("slider")[0];
    slider.style.backgroundColor = bgColors[1];
    document.body.classList.add("darkMode");
    //changes buttons
    let buttons = document.querySelectorAll(".buttons");
    buttons.forEach(button => {
      button.style.backgroundColor = 'hsl(240, 2%, 12%)';
      button.classList.add("fa-inverse");
    });
    let modals = document.querySelectorAll(".modals");
    modals.forEach(modal => {
      modal.style.backgroundColor = 'hsl(240, 2%, 0%,.4)';
    })
    let modalContent = document.querySelectorAll(".modalContent");
    modalContent.forEach(content => {
      content.style.backgroundColor = 'hsl(240, 2%, 15%)';
    })
    let links = document.querySelectorAll(".link");
    links.forEach(link => {
      link.style.color = 'hsl(214, 71%, 60%)';
    })
    let keys = document.querySelectorAll(".numbers");
    keys.forEach(key => {
      key.style.backgroundColor = 'hsl(136, 0%, 40%)';
      key.style.color = 'white';
    })
    let keyButtons = document.querySelectorAll(".txtButtons");
    keyButtons.forEach(keyButton => {
      keyButton.style.backgroundColor = 'hsl(136, 0%, 40%)';
      keyButton.style.color = 'white';
    })
    let tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
      if (tile.classList.contains("filledTile") == false) {
        tile.style.borderColor = "hsl(136, 0%, 40%)";
      }
    })
    let snackbars = document.querySelectorAll(".snackbar");
    snackbars.forEach(snackbar => {
      snackbar.style.boxShadow = "2px 3px 2px hsl(136, 0%, 20%)";
    })
    let longButtons = document.querySelectorAll(".longButton");
    longButtons.forEach(longButton => {
      longButton.style.backgroundColor = 'hsl(136, 0%, 40%)';
    })

  } else {
    darkmode = 0;
    bakeCookie("display=", `0${getCookie("display=")[1]}`);
    let slider = document.getElementsByClassName("slider")[0];
    slider.style.backgroundColor = bgColors[0];
    document.body.classList.remove("darkMode");
    let buttons = document.querySelectorAll(".buttons");
    buttons.forEach(button => {
      button.style.backgroundColor = null;
      button.classList.remove("fa-inverse");
    });
    let modals = document.querySelectorAll(".modals");
    modals.forEach(modal => {
      modal.style.backgroundColor = null;
    })
    let modalContent = document.querySelectorAll(".modalContent");
    modalContent.forEach(content => {
      content.style.backgroundColor = null;
    })
    let links = document.querySelectorAll(".link");
    links.forEach(link => {
      link.style.color = null;
    })
    let keys = document.querySelectorAll(".numbers");
    keys.forEach(key => {
      key.style.backgroundColor = null;
      key.style.color = null;
    })
    let keyButtons = document.querySelectorAll(".txtButtons");
    keyButtons.forEach(keyButton => {
      keyButton.style.backgroundColor = null;
      keyButton.style.color = null;
    })
    let tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
      if (tile.classList.contains("filledTile") == false) {
        tile.style.borderColor = null;
      }
    })
    let snackbars = document.querySelectorAll(".snackbar");
    snackbars.forEach(snackbar => {
      snackbar.style.boxShadow = null;
    })
    let longButtons = document.querySelectorAll(".longButton");
    longButtons.forEach(longButton => {
      longButton.style.backgroundColor = null;
    })
  }
}

var highContrast = document.getElementById('highContrast'); //check for high contrast (hc) being toggled
highContrast.addEventListener('change', function(event) {
  HCToggle(event.target);
})

function HCToggle(e) { //turn hc on and off, with changes to green + yellow colors
  if (e.checked) {
    bgColors = bgColorsHC;
    emojiColors = emojiColorsHC;
    bakeCookie("display=", `${getCookie("display=")[0]}1`);
    for (let i = 1; i < 3; i++) {
      resultsToCopy = resultsToCopy.replaceAll(emojiColorsLight[i], emojiColorsHC[i]);
    }
    let tiles = document.querySelectorAll(".filledTile");
    tiles.forEach(tile => {
      let index = bgColorsLight.indexOf(tile.style.backgroundColor);
      tile.style.backgroundColor = bgColors[index];
      tile.style.borderColor = bgColors[index];
    });
    let numbers = document.querySelectorAll(".numbers");
    numbers.forEach(number => {
      let index = bgColorsLight.indexOf(number.style.backgroundColor);
      number.style.backgroundColor = bgColors[index];
      number.style.borderColor = bgColors[index];
    });
    let slider = document.getElementsByClassName("slider")[0];
    if (document.getElementById("darkMode").checked) {
      slider.style.backgroundColor = bgColors[1];
    }
    document.getElementsByClassName("slider")[1].style.backgroundColor = bgColors[1];
  } else {
    bgColors = bgColorsLight;
    emojiColors = emojiColorsLight;
    bakeCookie("display=", `${getCookie("display=")[0]}0`);
    for (let i = 1; i < 3; i++) {
      resultsToCopy = resultsToCopy.replaceAll(emojiColorsHC[i], emojiColorsLight[i]);
    }
    let tiles = document.querySelectorAll(".filledTile");
    tiles.forEach(tile => {
      let index = bgColorsHC.indexOf(tile.style.backgroundColor);
      tile.style.backgroundColor = bgColors[index];
      tile.style.borderColor = bgColors[index];
    });
    let numbers = document.querySelectorAll(".numbers");
    numbers.forEach(number => {
      let index = bgColorsHC.indexOf(number.style.backgroundColor);
      number.style.backgroundColor = bgColors[index];
      number.style.borderColor = bgColors[index];
    });
    document.getElementsByClassName("slider")[0].style.backgroundColor = null;
    document.getElementsByClassName("slider")[1].style.backgroundColor = null;
  }
}

document.addEventListener("keydown", function(event) { //detect when press a key
  checkKey(event.key);
});

document.addEventListener("click", function(event) { //detect when click an on-screen key
  checkButton(event.target);
})

function checkButton(buttonPressed) { //parses the on-screen key and sends that data off to checkKey. or, if it's the ctrl c button, copies results.
  if (buttonPressed.classList.contains("numbers") == true) {
    checkKey(String(buttonPressed.textContent));
  } else if (buttonPressed.textContent == "Delete") {
    checkKey("Backspace");
  } else if (buttonPressed.textContent == "Enter") {
    checkKey("Enter");
  } else if (buttonPressed.id == "copyClipboard") {
    navigator.clipboard.writeText(resultsToCopy.slice(0, -1)); //needs to slice bc adds a \n after every turn
    showSnackbar(4);
  }
}

function checkKey(num) {
  if (guessesLeft <= 0) { //if the game is over, it doesn't do anything and removes this functionality
    document.removeEventListener("keydown", function(event) {
      checkKey(event);
    });
    return
  }
  if (num == "Backspace" && digitsLeft != 5) { //backspace
    delDig();
  } else if (num == "Enter" && digitsLeft != 0) { //enter but not all 5 digits are entered
    showSnackbar(0);
    return
  } else if (num == "Enter" && digitsLeft == 0) {
    if (primes.includes(guess) == false) { //enter but guess is not prime
      showSnackbar(1);
    } else if (guesses.includes(guess) == true) { //enter but guess was previously guessed
      showSnackbar(2);
    } else {
      checkNum(); //enter
    }

  } else if (isNaN(num) === false) { //enters digit
    typeDig(num);

  } else { //shouldn't get here
    return
  }
}

function typeDig(num) { //types in a digit
  if (digitsLeft == 0) { //if no spots left, skip
    return
  }
  let tile = document.getElementById(`${guessesLeft}${digitsLeft}`);
  tile.textContent = num;
  if (darkmode == 0) { //color changes when number entered, lightness changes depending on light/dark mode
    tile.style.borderColor = bgColors[0];
  } else {
    tile.style.borderColor = "hsl(136, 0%, 70%)";
  }
  tile.classList.add("filledTile");
  digitsLeft -= 1;
  guess += String(num);
}

function delDig() { //deletes a digit
  let tile = document.getElementById(`${guessesLeft}${digitsLeft + 1}`);
  tile.textContent = "";
  tile.classList.remove("filledTile");
  if (darkmode == 0) {
    tile.style.borderColor = "hsl(136, 0%, 70%)";
  } else {
    tile.style.borderColor = "hsl(136, 0%, 40%)";
  }
  guess = guess.slice(0, -1);
  digitsLeft++;
}

function checkNum() { //check number function
  let tempResults = "";
  for (let i = 5; i > 0; i--) { //change color of each digit
    let tile = document.getElementById(`${guessesLeft}${i}`);
    let tileColor = "";
    if (correctPrime.includes(tile.textContent) == false) { //gray
      tileColor = bgColors[0];
      tempResults += "0";
    } else if (correctPrime[5 - i] == tile.textContent) { //green
      tileColor = bgColors[1];
      tempResults += "1";
    } else { //yellow or gray, depending on the case (grey??)
      let guessDigAppear = 0;
      let primeDigAppear = 0;
      for (let n = 0; n < 5; n++) {
        if (correctPrime[n] == guess[n]) {
        } else if (guess[n] == tile.textContent && n < 5 - i) {
          guessDigAppear++;
        } else if (correctPrime[n] == tile.textContent) {
          primeDigAppear++;
        }
      }
      if (primeDigAppear <= guessDigAppear) {
        tileColor = bgColors[0];
        tempResults += "0";
      } else {
        tileColor = bgColors[2];
        tempResults += "2";
      }
    }
    //set color + border color
    tile.style.backgroundColor = tileColor;
    tile.style.borderColor = tileColor;
    tile.style.color = "white";
    //colors the on-screen number keys
    for (let n = 0; n < 10; n++) {
      let key = document.getElementsByClassName("numbers")[n];
      if (key.textContent == tile.textContent && key.style.backgroundColor != bgColors[1]) {
        key.style.backgroundColor = tileColor;
        key.style.borderColor = tileColor;
        key.style.color = "white";
        break;
      }
    }
  }
  addResults(tempResults); //generates the boxes for that turn seeen on results screen
  if (guess == correctPrime) { //if it's the right number, end the game
    displayResults(1);
  } else if (guessesLeft != 1) { //if it's not the right number but you have turns left, reset
    guessesLeft -= 1;
    digitsLeft = 5;
  } else { //if you lose, end the game
    guessesLeft = 0;
    let snackbar = document.getElementsByClassName("snackbar")[3];
    snackbar.textContent = correctPrime;
    showSnackbar(3);
    displayResults(0), 3000;
  }
  guesses.push(guess);
  guess = "";
}

function addResults(colorDig) { //adds to the results boxes
  let box = document.getElementsByClassName("resultsPreview")[0];
  let row = document.createElement("div");
  row.className = "resultsRows";
  for (let i = 0; i < 5; i++) { //makes five tiles in a new row on results page, colors it in correctly, then adds the corresponding emoji to the string that can eventually be copy and pasted.
    let tile = document.createElement("div");
    tile.className = "tile filledTile";
    tile.style.gridRow = "1/2";
    tile.style.gridColumn = `${i + 1}/${i + 2}`;
    tile.style.backgroundColor = bgColors[parseInt(colorDig[i])];
    tile.style.borderColor = bgColors[parseInt(colorDig[i])];
    resultsToCopy += emojiColors[parseInt(colorDig[i])];
    row.appendChild(tile);
  }
  box.appendChild(row);
  resultsToCopy += '\n'; //line break!
}

function showSnackbar(index) { //show snackbar for three seconds (it'll have faded out completely by then)
  let snackbar = document.getElementsByClassName("snackbar")[index];
  snackbar.classList.add("show");
  setTimeout(function() { snackbar.classList.remove("show"); }, 3000);
}

function displayResults(wl) {
  let delay = 0;
  if (wl == 0) { //sets text to either 'you won' or 'you lost'. almost forgot to do this
    document.getElementById("wl").textContent = "You lost.";
    delay = 3000;
  } else {
    document.getElementById("wl").textContent = "You won!";
    resultsToCopy = resultsToCopy.replace("X", String(7 - parseInt(guessesLeft))); //for ctrl c string, add the turns used out of 6. if you won.
  }
  stats[6 - parseInt(guessesLeft)] = String(parseInt(stats[6 - parseInt(guessesLeft)]) + 1); //changes stats, makes it a string, edits a cookie.
  let statistics = stats.join('.');
  bakeCookie("stats=", statistics);
  configStats();
  setTimeout(() => { document.getElementById("results").style.display = "block" }, delay); //delay is 3s if you lost because the snackbar displaying the correct number is visible for 3s.
}

//COOKIE OM NOM
function bakeCookie(name, value) { //name written with = at the end, makes/edits a cookie and resets its expiration time to 30 days.
  document.cookie = name + value + ";" + "max-age=" + 30 * 24 * 60 * 60 + "; path=/";
}

function getCookie(name) { //name written with = at the end, retrieves a cookie
  let cookieList = decodeURIComponent(document.cookie).split(';');
  for (let i = 0; i < cookieList.length; i++) {
    let c = cookieList[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}

function pageOpenCookies() { //gets display settings when opening the page, creates cookie with default no hc or dark if doesn't exist, changes themes. then retreives stats or creates it if it doesn't exist.
  let display = getCookie("display=");
  if (display == "") {
    bakeCookie("display=", "00");
    display = getCookie("display=");
  } else {
    bakeCookie("display=", display); //so it doesn't just revert after 30 days of not changing theme, just 30 days of not opening the tab.
  }
  if (display[0] == "1") { //calls the toggle darkmode function so things can chnage as needed.
    document.getElementById("darkMode").checked = true;
    darkToggle(document.getElementById("darkMode"));
  } else {
    document.getElementById("darkMode").checked = false;
    darkToggle(document.getElementById("darkMode"));
  }
  if (display[1] == "1") { //same but for hc
    document.getElementById("highContrast").checked = true;
    HCToggle(document.getElementById("highContrast"));
  } else {
    document.getElementById("highContrast").checked = false;
    HCToggle(document.getElementById("highContrast"));
  }
  let statistics = getCookie("stats=");
  if (statistics == "") {
    bakeCookie("stats=", "0.0.0.0.0.0.0"); //formatted in guess numbers, so needing 1.2.3.4.5.6.X guesses per game.
    statistics = getCookie("stats=");
  }
  stats = statistics.split('.'); //puts those numbers into a list so it actually makes sense and can be used for configStats.
}
document.getElementById("hr").style.borderTop = "hsl(240, 2%, 12%)"; //make the line really faint so that it fails any and all color contrast tests because I decided I liked it and couldn't get it to change in CSS.
//loadtiles and eat cookies
loadTiles();
pageOpenCookies();
configStats();