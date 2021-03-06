const height = 8; //number of guesses
const width = 5; //number of characters
const keys = ['US', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Hint', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Back', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Spec', 'Enter'];
const langs = ['en', 'es', 'de', 'fr', 'nl', 'it', 'pt', 'ca'];
const levels = ['A', 'B', 'C'];
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV','DEC'];
const unicode = ['\u0030\ufe0f\u20e3', '\u0031\ufe0f\u20e3', '\u0032\ufe0f\u20e3', '\u0033\ufe0f\u20e3', '\u0034\ufe0f\u20e3','\u0035\ufe0f\u20e3']
const scores = [5, 14, 23, 32, 41, 50, 104, 113, 122, 131, 140, 203, 212, 221, 230, 302, 311, 320, 401, 500];
const images = ['[img]https://i.imgur.com/0c2lKKh.png[/img]', '[img]https://i.imgur.com/paF8Sh6.png[/img]', '[img]https://i.imgur.com/2O1Qm19.png[/img]', '[img]https://i.imgur.com/4ucdC3a.png[/img]',
				'[img]https://i.imgur.com/Sa9AIcc.png[/img]', '[img]https://i.imgur.com/kPBI1Kz.png[/img]', '[img]https://i.imgur.com/tWgHHT8.png[/img]', '[img]https://i.imgur.com/7k3mS1g.png[/img]',
				'[img]https://i.imgur.com/5h03xRO.png[/img]', '[img]https://i.imgur.com/7ujEqX2.png[/img]', '[img]https://i.imgur.com/9UQxBFD.png[/img]', '[img]https://i.imgur.com/jXOkIAB.png[/img]',
				'[img]https://i.imgur.com/AADAyBn.png[/img]', '[img]https://i.imgur.com/kD5xP7n.png[/img]', '[img]https://i.imgur.com/iTag8dr.png[/img]', '[img]https://i.imgur.com/CxYALRI.png[/img]',
				'[img]https://i.imgur.com/FvHAHhZ.png[/img]', '[img]https://i.imgur.com/7Npvl37.png[/img]', '[img]https://i.imgur.com/I2CbsCa.png[/img]', '[img]https://i.imgur.com/uZLvzs7.png[/img]'];

let row = 0; //current guess (attempt #)
let col = 0; //current letter for that attempt
let gameOver = false;
let gameRunning; //For timed
let gameStart; //For timed
let gamesWon; //For speedrun
let hintsUsed = 0;
let lang;  // en=English, es=Spanish, fr=French, de=German, nl=Dutch, it=Italian, ca=Catalan, pt=Portuguese
let level; // A=Standard, B=Standard+, C=Advanced
let mode = 'A'; // A=Daily, B=Timed, C=Speedrun, D=Custom
let exclude; //Letters greyed out in Standard
let word; //Secret word
let words; //List of possible secret words
let wordlist; //List of allowed guesses
let stopwatch;
let guesses = ['', '', '', '', '', '', '', '', '', ''];

window.onload = function () {
	initialize();
};

function initialize() {

    // Create game board
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width+3; c++) {
            let tile = document.createElement('span');
            tile.id = r.toString() + '-' + c.toString();
            tile.classList.add('tile');
            tile.innerText = '';
			if (c < width) {
				tile.addEventListener('click', () => clickBoard(r,c));
			}
            document.getElementById('divboard').appendChild(tile);
        }
	}

	// Create virtual keyboard
	keys.forEach(key => {
		const buttonElement = document.createElement('button');
		buttonElement.setAttribute('id', key);
		buttonElement.addEventListener('click', () => handleClick(key));
		divkeyboard.append(buttonElement);

		if (key == 'Spec') {
			lllll(); //configureSpecialKey
		} else if (key == 'US') {
			buttonElement.textContent = '_';
		} else {
			buttonElement.textContent = key;
		}
	});

	// Keys that start invalidated every new or restored game
	l1lll('Enter'); //Invalidate
	l1lll('Back'); //Invalidate

	//localStorage.clear();

	//Retrieve language and level from previous session or URL parameter
	lang = up('lang'); // read from URL
	if (lang == null) {
		lang = localStorage.getItem('word500lang');
		if (lang == null) {
			lang = 'en';
		}
		level = localStorage.getItem('word500level');
		if (level == null) {
			level = 'A';
		}
	} else {
		//lang has been defined in URL parameters
		level = 'C';
		gwl(); //generateWordlist
		word = pu(up('word')); //read custom word from URL
	}
	rg(); //ResetGame
	cle(level); //changeLevel
	cla(lang); //changeLanguage
	clm(mode); // changeMode
	l1ll1(); //Togglekeys

	if (mode !== 'D') {
		let d = new Date();
		let today = d.getUTCDate() + '-' + (parseInt(d.getUTCMonth()) + 1).toString() + '-' + d.getFullYear();
		let lastDate = localStorage.getItem('word500date');
		if (lastDate == null) {
			// NEW PLAYER
			localStorage.setItem('word500date', today);
			ll1l1(today); //GetWords
			word = llll1(localStorage.getItem(lang + level + 'word')); //Decrypt
		} else if (today == lastDate) {
			// SAME DAY
			rtr(); //restoreSession
		} else {
			//NEW DAY
			ll1ll(); //ClearCache
			ll1l1(today); //GetWords
			localStorage.setItem('word500date', today);
			word = llll1(localStorage.getItem(lang + level + 'word')); //Decrypt
		}
	}

	// Create button listeners
	document.getElementById('flagen').addEventListener('click', () => flag_Click('en'));
	document.getElementById('flages').addEventListener('click', () => flag_Click('es'));
	document.getElementById('flagde').addEventListener('click', () => flag_Click('de'));
	document.getElementById('flagfr').addEventListener('click', () => flag_Click('fr'));
	document.getElementById('flagpt').addEventListener('click', () => flag_Click('pt'));
	document.getElementById('flagit').addEventListener('click', () => flag_Click('it'));
	document.getElementById('flagnl').addEventListener('click', () => flag_Click('nl'));
	document.getElementById('flagca').addEventListener('click', () => flag_Click('ca'));
	document.getElementById('levelA').addEventListener('click', () => level_Click('A'));
	document.getElementById('levelB').addEventListener('click', () => level_Click('B'));
	document.getElementById('levelC').addEventListener('click', () => level_Click('C'));
	document.getElementById('modeA').addEventListener('click', () => mode_Click('A'));
	document.getElementById('modeB').addEventListener('click', () => mode_Click('B'));
	document.getElementById('modeC').addEventListener('click', () => mode_Click('C'));
	document.getElementById('btnstats').addEventListener('click', () => stats_Click());
	document.getElementById('closestatspage').addEventListener('click', () => stats_Close());
	document.getElementById('btnconstruct').addEventListener('click', () => link_Click());
	document.getElementById('closelinkpage').addEventListener('click', () => link_Close());

	// Listen for Enter/Backspace on physical keyboard
	document.addEventListener('keyup', (e) => {
		if (gameOver) return;

		if (e.code == 'Backspace') {
			deleteLetter();
		}
		else if (e.code == 'Enter') {
			ll11l(); //ProcessEnter
		}
	});

		// Listen for letters on physical keyboard
		document.addEventListener('keypress', (e) => {
		if (gameOver) return;

        //Uppercase A-Z
		if (65 <= e.keyCode && e.keyCode <= 90) {
			//send this letter
			lll11(String.fromCharCode(e.keyCode)); //AddLetter
		}

		//Lowercase a-z
		if (97 <= e.keyCode && e.keyCode <= 122) {
			//Convert to uppercase
			lll11(String.fromCharCode(e.keyCode - 32)); //AddLetter
		}

		//ñÑ
		if (e.keyCode == 209 || e.keyCode == 241) {
			//Send Ñ
			lll11(String.fromCharCode(209)); //AddLetter
		}

		//çÇ
		if (e.keyCode == 199 || e.keyCode == 231) {
			//Send Ç
			lll11(String.fromCharCode(199)); //AddLetter
			}
			if (e.keyCode == 95 || e.keyCode == 45) {
				//Send underscore
				lll11(String.fromCharCode(95)); //AddLetter
			}
	});
}

function pu(uwl){ //ProcessURL word
	if (uwl.length == 10) {
		let pos = uwl.charCodeAt(0) % 5;
		word = llll1(uwl.substring(pos + 1,pos + 6)); //Decrypt llll1
		if (ll111(word)) { // Valid word
			// Valid word grabbed from URL
			mode = 'D';
			console.log('Start custom game');
			return (word);
		}
		console.log('Unable to process custom word');
	}
	console.log('Initiate standard mode');
	// No valid word grabbed from URL
	mode = 'A';
	lang = localStorage.getItem('word500lang');
	if (lang == null) {
		lang = 'en';
	}
	level = localStorage.getItem('word500level');
	if (level == null) {
		level = 'A';
	}
	gwl(); //generateWordlist
	return('NONE');
}

const gwl = () => { //generateWordlist
	//Concatenate lettersoups
	if (lang == 'en') {
		exclude = en0;
		if (level == 'A') {
			words = en1;
		} else if (level == 'B') {
			words = en1.concat(en2);
		} else {
			words = en1.concat(en2, en3);
		}
		wordlist = en1.concat(en2, en3, en4);
	}
	if (lang == 'es') {
		exclude = es0;
		if (level == 'A') {
			words = es1;
		} else if (level == 'B') {
			words = es1.concat(es2);
		} else {
			words = es1.concat(es2, es3);
		}
		wordlist = es1.concat(es2, es3, es4);
	}
	if (lang == 'nl') {
		exclude = nl0;
		if (level == 'A') {
			words = nl1;
		} else if (level == 'B') {
			words = nl1.concat(nl2);
		} else {
			words = nl1.concat(nl2, nl3);
		}
		wordlist = nl1.concat(nl2, nl3, nl4);
	}
	if (lang == 'ca') {
		exclude = ca0;
		if (level == 'A') {
			words = ca1;
		} else if (level == 'B') {
			words = ca1.concat(ca2);
		} else {
			words = ca1.concat(ca2, ca3);
		}
		wordlist = ca1.concat(ca2, ca3, ca4);
	}
	if (lang == 'de') {
		exclude = de0;
		if (level == 'A') {
			words = de1;
		} else if (level == 'B') {
			words = de1.concat(de2);
		} else {
			words = de1.concat(de2, de3);
		}
		wordlist = de1.concat(de2, de3, de4);
	}
	if (lang == 'fr') {
		exclude = fr0;
		if (level == 'A') {
			words = fr1;
		} else if (level == 'B') {
			words = fr1.concat(fr2);
		} else {
			words = fr1.concat(fr2, fr3);
		}
		wordlist = fr1.concat(fr2, fr3, fr4);
	}
	if (lang == 'pt') {
		exclude = pt0;
		if (level == 'A') {
			words = pt1;
		} else if (level == 'B') {
			words = pt1.concat(pt2);
		} else {
			words = pt1.concat(pt2, pt3);
		}
		wordlist = pt1.concat(pt2, pt3, pt4);
	}
	if (lang == 'it') {
		exclude = it0;
		if (level == 'A') {
			words = it1;
		} else if (level == 'B') {
			words = it1.concat(it2);
		} else {
			words = it1.concat(it2, it3);
		}
		wordlist = it1.concat(it2, it3, it4);
	}
}

const lllll = () => { //ConfigureSpecialKey
	const specialKey = document.getElementById('Spec');
	if (lang == 'en' || lang == 'nl' || lang == 'de' || lang == 'it') {
		//hide special character
		specialKey.classList.add('hiddenKey');
		//align bottom row of keys
		document.getElementById('Back').classList.remove('specialKey');
	}
	if (lang == 'ca' || lang == 'fr' || lang == 'pt') {
		//Letter Ç
		if (specialKey.classList.contains('hiddenKey')) {
			specialKey.classList.remove('hiddenKey');
		}
		specialKey.textContent = String.fromCharCode(199);
		document.getElementById('Back').classList.add('specialKey');
	}
	if (lang == 'es') {
		//Letter Ñ
		if (specialKey.classList.contains('hiddenKey')) {
			specialKey.classList.remove('hiddenKey');
		}
		specialKey.textContent = String.fromCharCode(209);
		document.getElementById('Back').classList.add('specialKey');
	}
}

const l1ll1 = () => { //Grey out excluded letters
	if (level == 'A') {
		exclude.forEach(char => {
			l1lll(char); //Invalidate
		});
	} else {
		exclude.forEach(char => {
			l1l1l(char); //Validate
		});
	}
}

const rtr = () => { //restoreSession
	word = llll1(localStorage.getItem(lang + level + 'word')); //Decrypt
	hintsUsed = parseInt(localStorage.getItem(lang + level + 'hints'));
	if (localStorage.getItem(lang + level + 'gameover') == 'Yes') {
		gameOver = true;
	}
	for (let i = 0; i < height; i++) {
		guesses[i] = localStorage.getItem(lang + level + 'guess' + i.toString());
		if (guesses[i] == null) {
			row = i;
			//If there are no guesses, Hint button is not available
			if (row == 0) {
				l1lll('Hint'); //Invalidate
			} else {
				l1l1l('Hint'); //Validate
			}
			break;
		} else {
			//Repopulate guesses into the board
			wwd(guesses[i], i); //Write Word
			wru(l1l11(guesses[i], word), i); //writeResult, Calculate
			invalidateLetters(i);
		}
	}
}

const ll1ll = () => { //ClearCache
	levels.forEach(lvl => {
		langs.forEach(lng => {
			localStorage.removeItem(lng + lvl + 'hints');
			localStorage.removeItem(lng + lvl + 'gameover');
			localStorage.removeItem(lng + lvl + 'word');
			for (let i = 0; i < height; i++) {
				localStorage.removeItem(lng + lvl + 'guess' + i.toString());
			}
			});
	});
}

const rg = () => { //ResetGame
	//Reset game board
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width + 3; j++) {
			let currTile = document.getElementById(i.toString() + '-' + j.toString());
			currTile.innerText = '';
			if (j < width) {
				//Remove styles from left side of game board
				currTile.classList.remove('flip');
				currTile.classList.remove('red');
				currTile.classList.remove('yellow');
				currTile.classList.remove('green');
			}
		}
	}
	//Reset virtual keyboard
	keys.forEach(key => {
		if (key == 'Enter' || key == 'Hint' || key == 'Back') {
			l1lll(key); //Invalidate
		} else {
			l1l1l(key); //Validate
		}
	});

	//Remove potential striked out letters from current row
	for (let i = 0; i < width; i++) {
		if (row < 8) {
			let square = document.getElementById(row.toString() + '-' + i.toString());
			square.classList.remove('invalidWord');
			square.classList.add('validWord');
		}
	}

	//Rest of the variables.
	row = 0;
	col = 0;
	gameOver = false;
	hintsUsed = 0;
	guesses = ['', '', '', '', '', '', '', '', '', ''];
}

const ll1l1 = (dDate) => { //GetWords from list
	let index = weekDates.findIndex(val => val == dDate);
	if (index == -1) {
		alert('Houston, we have a problem! No new words have been uploaded from the server. Try again later.');
	} else {
		let newWords = weekWords[index];
		let i = 0;
		langs.forEach(lng => {
			levels.forEach(lvl => {
				localStorage.setItem(lng + lvl + 'hints', '0');
				localStorage.setItem(lng + lvl + 'gameover', 'No');
				localStorage.setItem(lng + lvl + 'word', newWords[i]);
				i += 1;
			});
		});
	}
}

const clickBoard = (r,c) => {
	if (r < row && !gameOver) {
		let styles = document.getElementById(r.toString() + '-' + c.toString()).classList;
		if (styles.contains('yellow')) {
			styles.remove('yellow');
			styles.add('green');
		} else if (styles.contains('red')) {
			styles.remove('red');
			styles.add('yellow');
		} else	if (styles.contains('green')) {
			styles.remove('green');
		} else {
			styles.add('red');
		}
	}
}

const handleClick = (letter) => {
	//Move focus to ENTER button
	document.getElementById('Enter').focus();

	if (!gameOver) {
		if (letter == 'Back') {
			deleteLetter();
			return;
		}
		if (letter == 'Hint') {
			if (row > 0 && (mode == 'A' || mode == 'D')) {
				if (hintsUsed == 0) {
					let answer = confirm('This will generate a random word, that fits your previous guesses.\r\nThe game will count as a loss and your streak resets to 0!\r\nDo you want to proceed, oh lazy one?');
					if (!answer) {
						return;
					};
				}
				guesses[row] = lll1l(); //GenerateHint
				wwd(guesses[row], row); //WriteWord
				col = 5;
				hintsUsed += 1;
				localStorage.setItem(lang + level + 'hints', hintsUsed.toString());
				ll11l(); //ProcessEnter
			}
			return;
		}
		if (letter == 'Enter') {
			ll11l(); //ProcessEnter
			return;
		}
		if (letter == 'Spec') {
			lll11(document.getElementById('Spec').textContent); //AddLetter
			return;
		}
		if (letter == 'US') {
			lll11('_'); //AddLetter
			return;
		}
		lll11(letter); //AddLetter
	}
}

const lll11 = (letter) => { //AddLetter
	// Start the clock if this is the first character of a timed game
	if (!gameRunning && (mode == 'B' || mode == 'C')) {
		gameRunning = true;
		gameStart = new Date();
		stopwatch = setInterval(ti, 1000);
	}
	if (col < width) {
        let tile = document.getElementById(row.toString() + '-' + col.toString());
        if (tile.innerText == '') {
            tile.innerText = letter;
            col += 1;
			if (col==1) {
				l1l1l('Back'); //Validate
			}
			if (col==width) {
				//We have a complete word!
				let guess = rw(row);
				if (guess.includes('_')) {
					return;
				}
				if (!ll111(guess)) { //ValidWord
					//Red Strikout letters of invalid word
			       for (let i = 0; i < width; i++) {
				      let tile = document.getElementById(row.toString() + '-' + i.toString());
				      tile.classList.remove('validWord');
                      tile.classList.add('invalidWord');
			       }
				} else {
					l1l1l('Enter'); //Validate
				}
			}
        }
    }
}

const flag_Click = (country) => {
	if (lang == country) {
		return;
	}
	cla(country); //changeLanguage
	gwl(); //generateWordlist
	rg(); // Reset Game
	l1ll1(); //Togglekeys
	rtr(); //restoreSession
	stats_Close();
}

const cla = (country) => { //changeLanguage
	lang = country;
	document.getElementById('btnFlag').src = 'images/' + lang + '.png';
	document.getElementById('helplink').href = 'help' + lang + '.html';
	localStorage.setItem('word500lang', lang);
	lllll(); //ConfigureSpecialKey

	//Update dropdown menu and virtual keyboard
	if (lang == 'en') {
		exclude = en0;
		let levela = '';
		exclude.forEach(char => {
			levela = levela + char;
		});
		document.getElementById('levelAtext').innerText = '- No repeat letters\n- No ' + levela;
		document.getElementById('levelBtext').innerText = '- No repeat letters';
		document.getElementById('levelCtext').innerText = '- Anything goes!';
	}
	if (lang == 'es') {
		exclude = es0;
		let levela = '';
		exclude.forEach(char => {
			levela = levela + char;
		});
		document.getElementById('levelAtext').innerText = '- Sin letras repetidas\n- Sin ' + levela;
		document.getElementById('levelBtext').innerText = '- Sin letras repetidas';
		document.getElementById('levelCtext').innerText = '- Todo es posible!';
	}
	if (lang == 'nl') {
		exclude = nl0;
		let levela = '';
		exclude.forEach(char => {
			levela = levela + char;
		});
		document.getElementById('levelAtext').innerText = '- Zonder dubbele letters\n- Zonder ' + levela;
		document.getElementById('levelBtext').innerText = '- Zonder dubbele letters';
		document.getElementById('levelCtext').innerText = '- Alles kan!';
	}
	if (lang == 'ca') {
		exclude = ca0;
		let levela = '';
		exclude.forEach(char => {
			levela = levela + char;
		});
		document.getElementById('levelAtext').innerText = '- Sense lletres repetides\n- Sense ' + levela;
		document.getElementById('levelBtext').innerText = '- Sense lletres repetides';
		document.getElementById('levelCtext').innerText = '- Tot es possible!';
	}
	if (lang == 'de') {
		exclude = de0;
		let levela = '';
		exclude.forEach(char => {
			levela = levela + char;
		});
		document.getElementById('levelAtext').innerText = '- 5 verschiedene Buchstaben\n- Ohne ' + levela;
		document.getElementById('levelBtext').innerText = '- 5 verschiedene Buchstaben';
		document.getElementById('levelCtext').innerText = '- Alles ist möglich!';
	}

		if (lang == 'fr') {
			exclude = fr0;
			let levela = '';
			exclude.forEach(char => {
				levela = levela + char;
			});
			document.getElementById('levelAtext').innerText = '- Pas de lettres répétitives\n- Pas de ' + levela;
			document.getElementById('levelBtext').innerText = '- Pas de lettres répétitives';
			document.getElementById('levelCtext').innerText = '- Tout est possible!';
		}
		if (lang == 'pt') {
			exclude = pt0;
			let levela = '';
			exclude.forEach(char => {
				levela = levela + char;
			});
			document.getElementById('levelAtext').innerText = '- Sem repetir letras\n- Sem ' + levela;
			document.getElementById('levelBtext').innerText = '- Sem repetir letras';
			document.getElementById('levelCtext').innerText = '- Tudo é possível!';
		}
	if (lang == 'it') {
		exclude = it0;
			let levela = '';
			exclude.forEach(char => {
				levela = levela + char;
			});
			document.getElementById('levelAtext').innerText = '- Senza lettere ripetute\n- Senza ' + levela;
			document.getElementById('levelBtext').innerText = '- Senza lettere ripetute';
			document.getElementById('levelCtext').innerText = '- Tutto è possibile!';
	}
}

const level_Click = (char) => {
	if (level == char) {
		// Do nothing if level does not change
		return;
	}
	gwl(); //generateWordlist
	cle(char); //changeLevel
	rg(); //ResetGame
	l1ll1(); //Togglekeys
	rtr(); //restoreSession
	stats_Close();
}

const cle = (char) => { //changeLevel
	document.getElementById('btnLevel').src = 'images/' + char + '.png';
	level = char;
	localStorage.setItem('word500level', level);
}

const mode_Click = (char) => {
	if (mode == char) {
		// Do nothing if mode does not change
		return;
	}
	clm(char); //changeMode
	rg(); //ResetGame
	clearInterval(stopwatch);
	l1ll1(); //Togglekeys
	if (mode == 'A') {
		rtr(); //restoreSession
		document.getElementById('title').innerText = 'Word500'
	};
	if (mode == 'B') {
		startTimed();
	};
	if (mode == 'C') {
		startSpeedrun();
	};
}

const startTimed = () => {
	let pr = localStorage.getItem(lang + level + 'timed');
	if (pr == null) {
		alert('Play a timed practice game\nYou have 5 minutes\nAnimations are turned off\nDo not refresh your browser!');
	}
	document.getElementById('title').innerText = '00:00';
	word = llll1(words[Math.ceil(words.length * Math.random())]);
	console.log(word); //TEMP
	gameRunning=false;
}

const startSpeedrun = () => {
	let pr = localStorage.getItem(lang + level + 'speedrun');
	if (pr == null) {
		alert('Play 10 games ASAP\nAnimations are turned off\nDo not refresh your browser\nBeware of fried brains!');
	}
	document.getElementById('title').innerText = '00:00 (0/10)';
	word = llll1(words[Math.ceil(words.length * Math.random())]);
	console.log(word); //TEMP
	gamesWon = 0;
	gameRunning=false;
}

const clm = (char) => { //changeMode
	document.getElementById('btnMode').src = 'images/mode' + char + '.png';
	mode = char;
}

const l1lll = (letter) => { //Invalidate
	if (letter == 'Ñ' || letter == 'Ç') {
		letter = 'Spec';
	}
	const key = document.getElementById(letter);
	key.classList.remove('unusedKey');
	key.classList.add('usedKey');
}

function ll111(sGuess) { //ValidWord
	return wordlist.includes(l11ll(sGuess)); //Encrypt
}

const l1l1l = (letter) => { //Validate
	if (letter == 'Ñ' || letter == 'Ç') {
		letter = 'Spec';
	}
	let key = document.getElementById(letter);
	key.classList.remove('usedKey');
	key.classList.add('unusedKey');
}

const wwd = (newWord, rowNumber) => { //WriteWord
	for (let i = 0; i < width; i++) {
		let tile = document.getElementById(rowNumber.toString() + '-' + i.toString());
		tile.innerText = newWord[i];
	}
}

const wru = (result, rowNumber) => { //writeResult
	if (result > 100) {
		result = result.toString();
	} else if (result > 10) {
		result = '0' + result.toString();
	} else {
		result='005'
	}
	if (mode == 'A' || mode == 'D') {
	for (let k = width; k < width+3; k++) {
		let tile = document.getElementById(rowNumber.toString() + '-' + k.toString());
		setTimeout(() => {
			tile.classList.add('flip');
		}, 500*(k-width));
		setTimeout(() => {
			tile.innerText = result[k-width];
		}, 500*(k-width)+250);
		setTimeout(() => {
			tile.classList.remove('flip');
		}, 500*(k-width)+500);
	}		
	} else {
		for (let k = width; k < width+3; k++) {
		document.getElementById(rowNumber.toString() + '-' + k.toString()).innerText = result[k-width];
		}	
	}
}

function rw(iRow) { //Read word from indicated row
    let sWord = '';
    for (let i = 0; i < width; i++) {
        sWord = sWord + document.getElementById(iRow.toString() + '-' + i.toString()).innerText;
    };
	return sWord;
}

const invalidateLetters = (round) => {
	for (let i = 0; i < width; i++) {
		let currTile = document.getElementById(round.toString() + '-' + i.toString());
		l1lll(currTile.innerText); //Invalidate
	}
}

const deleteLetter = () => {
	if (0 < col && col <= width) {
		col -= 1;
	}
	if (col == width - 1) {
		l1lll('Enter'); //Invalidate
	};
	if (col == 0) {
		l1lll('Back'); //Invalidate
	}
	let currTile = document.getElementById(row.toString() + '-' + col.toString());
	currTile.innerText = '';
	for (let i = 0; i < width; i++) {
		let square = document.getElementById(row.toString() + '-' + i.toString());
		square.classList.remove('invalidWord');
		square.classList.add('validWord');
	}
}

const ll11l = () => { //ProcessEnter
	if (col < 5) return;
	//Read the current word
	let guess = rw(row);
	if (!ll111(guess)) { //ValidWord
		return;
	}
	//Word is valid!!
	let result = (l1l11(word, guess)); //Calculate
	
	//First timed guess shenanigans
	while (mode == 'B' && row == 0 && ((result < 10) || (result > 205) || (result == 41))){
		word = llll1(words[Math.ceil(words.length * Math.random())]);
		result = (l1l11(word, guess)); //Calculate
	}
	
	invalidateLetters(row);
	guesses[row] = guess;
	if (mode == 'A') {
		localStorage.setItem(lang + level + 'guess' + row.toString(), guess);
	}
	l1lll('Back'); //Invalidate
	l1lll('Enter'); //Invalidate
	wru(result, row); //writeResult
	
	if (result == 5) {
		//Color current row ==> red
		for (let i = 0; i < width; i++) {
			let b = row;
			setTimeout(() => {
				document.getElementById(b.toString() + '-' + i.toString()).classList.add('red');
			}, 1500);
		}
		// Also color these letters red in rest of the board.
		for (let i = 0; i < width; i++) {
			for (let j = 0; j < row; j++) {
				console.log(guesses[row] + ' ' + document.getElementById(j.toString() + '-' + i.toString()).innerText);
				if (guesses[row].includes(document.getElementById(j.toString() + '-' + i.toString()).innerText)) {
					setTimeout(() => {
						document.getElementById(j.toString() + '-' + i.toString()).classList.remove('yellow');
						document.getElementById(j.toString() + '-' + i.toString()).classList.remove('green');
						document.getElementById(j.toString() + '-' + i.toString()).classList.add('red');			
					}, 1500);
				}
			}	
		}
	}

	if (result == 500) {
		if (mode == 'A') {
			gameOver = true;
			localStorage.setItem(lang + level + 'gameover', 'Yes');
		}
		if (mode == 'D') {
			gameOver = true;
		}
		//Update statistics
		if (hintsUsed > 0 && mode == 'A'){
			//LOSS
			localStorage.setItem(lang + level + 'currentstreak', '0');
			let losses = localStorage.getItem(lang + level + 'lost');
			if (losses == null) {
				localStorage.setItem(lang + level + 'lost', '1');
			} else {
				localStorage.setItem(lang + level + 'lost', (1 + parseInt(losses)).toString());
			}
		} else if (mode == 'A') {
			//WIN
			let wins=localStorage.getItem(lang + level + 'wins');
			if (wins == null) {
				localStorage.setItem(lang + level + 'wins', '1');
				localStorage.setItem(lang + level + 'currentstreak', '1');
				localStorage.setItem(lang + level + 'maxstreak', '1');
				localStorage.setItem(lang + level + (1 + row).toString(), '1');
			} else {
				let currentstreak = localStorage.getItem(lang + level + 'currentstreak');
				let maxstreak = localStorage.getItem(lang + level + 'maxstreak');
				let turnwins = localStorage.getItem(lang + level + (1 + row).toString());
				localStorage.setItem(lang + level + 'wins', (1 + parseInt(wins)).toString());
				localStorage.setItem(lang + level + 'currentstreak', (1 + parseInt(currentstreak)).toString());
				if (currentstreak == maxstreak) {
					localStorage.setItem(lang + level + 'maxstreak', (1 + parseInt(maxstreak)).toString());
				};
				if (turnwins == null) {
					localStorage.setItem(lang + level + (1 + row).toString(), '1');
				} else {
					localStorage.setItem(lang + level + (1 + row).toString(), (1 + parseInt(turnwins)).toString());
				}				
			}
		} else if(mode == 'B') {
			// FINISH TIMED GAME
			let d = new Date();
			let iresult = d - gameStart;
			clearInterval(stopwatch);
			document.getElementById('title').innerText = writetime(iresult, true);
			gameOver = true;
			gameRunning=false;
			let oldResult = localStorage.getItem(lang + level + 'timed');
			if (oldResult == null) {
				localStorage.setItem(lang + level + 'timed',iresult.toString());
			} if (iresult < oldResult) {
				alert('New personal best!');
				localStorage.setItem(lang + level + 'timed',iresult.toString());
			}
			return;
		} else if(mode == 'C') {
			gamesWon +=1;
			if (gamesWon == 10) {
				//FINISH SPEEDRUN GAME
				let d = new Date();
				let iresult = d - gameStart;
				clearInterval(stopwatch);
				document.getElementById('title').innerText = writetime(iresult, true);
				gameOver = true;
				let oldResult = localStorage.getItem(lang + level + 'speedrun');
				if (oldResult == null) {
					localStorage.setItem(lang + level + 'speedrun',iresult.toString());
				} if (iresult < oldResult) {
					alert('New personal best!');
					localStorage.setItem(lang + level + 'speedrun',iresult.toString());
				}
			} else {
				document.getElementById('title').innerText = (document.getElementById('title').innerText).substring(0,7) + gamesWon.toString() + '/10)';
				rg(); //ResetGame;
				word = llll1(words[Math.ceil(words.length * Math.random())]);
				console.log(word);	//TEMP	
			}
			return;
		}
		//More stuff, for normal games only
		setTimeout(() => {
			if (hintsUsed > 0) {
				if (hintsUsed == row) {
					sm('Mashing that Hints button is fun!');
				} else if (hintsUsed == 1) {
					sm('Solved, pity you used that one hint');
				}
				else {
					sm('Solved, next time, try without hints');
				}
			} else {
				switch (row) {
					case 0:
						sm('Are you Chuck Norris?'); break;
					case 1:
						sm('You lucky skunk!'); break;
					case 2:
						sm('Amazing!'); break;
					case 3:
						sm('Excellent!'); break;
					case 4:
						sm('Splendid!'); break;
					case 5:
						sm('Very good!'); break;
					case 6:
						sm('You did it!'); break;
					case 7:
						sm('Nice! That was close!'); break;
				}
			}
			row += 1; //start new row
			if (row == 1) {
				l1l1l('Hint'); //Validate
			};
		}, 1500);
		setTimeout(() => {
			ab(); //AnimateBoard
		}, 4000);
	} else {
		// The word was not correct
		row += 1; //start new row
		if (row == 1  && mode == 'A'){
			l1l1l('Hint'); //Validate
		}
	}
	col = 0; //start at 0 for new row
	
	if (!gameOver && row == height && mode == 'A') {
		gameOver = true;
		localStorage.setItem(lang + level + 'gameover', 'Yes');
		//Update stats
		localStorage.setItem(lang + level + 'currentstreak', '0');
		let losses = localStorage.getItem(lang + level + 'lost');
		if (losses == null) {
			localStorage.setItem(lang + level + 'lost', '1');
		} else {
			localStorage.setItem(lang + level + 'lost', (1 + parseInt(losses)).toString());
		}
		sm('Game over! The word was ' + word);
		ab();
	} else if (!gameOver && row == height && mode == 'C') {
		rg(); //ResetGame;
		word = llll1(words[Math.ceil(words.length * Math.random())]);
		console.log(word);	//TEMP		
	} else if (!gameOver && row == height && mode == 'B') {
		gameOver = true;
		clearInterval(stopwatch);
		sm('Game over! The word was ' + word);
		ab();
	} else if (!gameOver && row == height && mode == 'D') {
		gameOver = true;
		sm('Game over! The word was ' + word);
		ab();
	}
}

function l1l11(word1, word2) { //Calculate
	let result = width;
	for (let i = 0; i < width; i++) {
		if (word1[i] == word2[i]) {
			result += 99;
			word1 = word1.substring(0, i) + '$' + word1.substring(i + 1, width);
			word2 = word2.substring(0, i) + '%' + word2.substring(i + 1, width);
		}
	}
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < width; j++) {
			if (word1[i] == word2[j]) {
				result += 9;
				word1 = word1.substring(0, i) + '$' + word1.substring(i + 1, width);
				word2 = word2.substring(0, j) + '%' + word2.substring(j + 1, width);
			}
		}
	}
	return result;
}

function llll1(input) { //decrypt
	let z = '';
	let j;
	for (let i = 0; i < 5; i++) {
		j = input.charCodeAt(i);
		if ( j > 100) {
			z = String.fromCharCode(408 - j) + z;
		} else {
			z = String.fromCharCode(90 - (95 -j - i) % 26) + z;
		}
	}
	return z;
}

function lll1l() { //generateHint
	//Verify if currently an invalid word is written
	if (col == width) {
		let g = rw(row);
		if (!g.includes('_')) {
			if (!ll111(g)) { //ValidWord
				for (let i = 0; i < width; i++) {
				let tile = document.getElementById(row.toString() + '-' + i.toString());
				tile.classList.remove('invalidWord');
				tile.classList.add('validWord');
				}
			}			
		}
	}
	let hf = true;
	for (let i = 0; i < words.length; i++) {
		hf = true;
		for (let j = 0; j < row; j++) {
			if (l1l11(guesses[j], llll1(words[i])) !== l1l11(guesses[j], word)) { //Decrypt Calculate
				hf = false;
			}
		}
		if (hf) {
			if (word !== llll1(words[i])) { //Decrypt
				return llll1(words[i]); //Decrypt
			}
		}
	}
	return (word);
}

const sm = (message) => {
	const title = document.getElementById('title');
	title.innerText = message;
	setTimeout(() => title.innerText = 'Word500', 4000);
};

const ab = () => { //AnimateBoard
	// Flip tiles
	for (let i = 0; i < row ; i++) {
		for (let j = 0; j < width; j++) {
			setTimeout(() => {
				document.getElementById(i.toString() + '-' + j.toString()).classList.add('flip');
			}, 200*j+1000*i);
        }
	}
	setTimeout(() => {
		stats_Click()
	}, 1000 * row + 500);

	// Color tiles
	for (let i = 0; i < row; i++) {
		let word1 = guesses[i];
		let word2 = word;
		//Color green letters
		for (let j = 0; j < width; j++) {
			if (word1[j] == word2[j]) {
				setTimeout(() => {
					document.getElementById(i.toString() + '-' + j.toString()).classList.remove('yellow');
					document.getElementById(i.toString() + '-' + j.toString()).classList.remove('red');
					document.getElementById(i.toString() + '-' + j.toString()).classList.add('green');
				}, 200 * j + 1000 * i + 250);
				word1 = word1.substring(0, j) + '$' + word1.substring(j + 1, width);
				word2 = word2.substring(0, j) + '%' + word2.substring(j + 1, width);
			}
		}
		//Color yellow letters
		for (let j = 0; j < width; j++) {
			for (let k = 0; k < width; k++) {
				if (word1[j] == word2[k]) {
					setTimeout(() => {
						document.getElementById(i.toString() + '-' + j.toString()).classList.remove('red');
						document.getElementById(i.toString() + '-' + j.toString()).classList.remove('green');
						document.getElementById(i.toString() + '-' + j.toString()).classList.add('yellow');
					}, 200 * j + 1000 * i +250);
					word1 = word1.substring(0, j) + '$' + word1.substring(j + 1, width);
					word2 = word2.substring(0, k) + '%' + word2.substring(k + 1, width);
				}
            }
        }
		//Color red letters
		for (let l = 0; l < width; l++) {
			if (word1[l] !== '$') {
				setTimeout(() => {
					document.getElementById(i.toString() + '-' + l.toString()).classList.remove('yellow');
					document.getElementById(i.toString() + '-' + l.toString()).classList.remove('green');
					document.getElementById(i.toString() + '-' + l.toString()).classList.add('red');
				}, 200 * l + 1000 * i +250);
            }
        }
	}
}

const stats_Close = () => {
	document.getElementById('statspage').style.display = 'none';
}

const link_Click = () => {
	let letter = document.getElementById('0-4').innerText;
	if (letter == '') {
		document.getElementById('customwordlabel').innerText = 'No valid word has been written';
	} else {
		let word0 = rw(0);
		if (ll111(word0) && !word0.includes('_')) {
			//Valid custom word
			document.getElementById('customwordlabel').innerText = 'The custom secret word is ' + word0 + '\n\nCopy the below URL and send to your friend(s)!';
			document.getElementById('customword').innerText = 'https://word500.github.io?lang=' + c2u(word0); //Convert to URL
		} else {
			//Invalid custom word
			document.getElementById('customwordlabel').innerText = 'No valid word has been written';
		}
	}
	document.getElementById('createlink').style.display = 'block';
	document.getElementById("customword").select();
}

const link_Close = () => {
	document.getElementById('createlink').style.display = 'none';
}

const c2u = (cw) => { //Convert to URL
	let dec = llll1(cw);
	let enc = l11ll(cw);
	let pos = dec.charCodeAt(0) % 5;
	let u = dec.substring(0,pos+1) + enc + dec.substring(pos+1);
	return(lang+'&word='+u)
}

function showstats() {
	let won = 0;
	let lost = 0;
	let mstreak = 0;
	let cstreak = 0;
	let number = [0,0,0,0,0,0,0,0,0];
	let wstatus;
	let winpercentage = 0;
	let timed = 'N/A'
	let speedrun = 'N/A'

	//Retrieve stuff from localStorage
	let level = localStorage.getItem('word500level');
	if (level == null) {
		level = 'A';
	}

	let lang = localStorage.getItem('word500lang');
	if (lang == null) {
		lang = 'en';
	}
	
	let local = localStorage.getItem(lang + level + 'wins');
	if (local !== null) {
		won = parseInt(local);
	}
	
	local = localStorage.getItem(lang + level + 'lost');
	if (local !== null) {
		lost = parseInt(local);
	}

	local = localStorage.getItem(lang + level + 'currentstreak');
	if (local !== null) {
		cstreak = parseInt(local);
	}

	local = localStorage.getItem(lang + level + 'maxstreak');
	if (local !== null) {
		mstreak = parseInt(local);
	};

	local = localStorage.getItem(lang + level + 'timed');
	if (local !== null) {
		timed = writetime(parseInt(local),true);
	};

	local = localStorage.getItem(lang + level + 'speedrun');
	if (local !== null) {
		speedrun = writetime(parseInt(local),true);
	};
	
	let played = won + lost;
	if (played==0) {
		wstatus = "Word500 virgin";
	} else if (played < 10) {
		wstatus = "Word500 starter";
	} else if (played < 25) {
		wstatus = "Word500 adept";
	} else if (played < 50) {
		wstatus = "Word500 veteran";
	} else if (played < 100) {
		wstatus = "Word500 expert";
	} else if (played < 1000) {
		wstatus = "Word500 superstar";
	} else {
		wstatus = "Word500 bot or hacker (or both)";
	}
	
	if (played > 0) {
		winpercentage= (Math.round(1000*won/played)/10).toString() + '%';
	}

	for (let i = 1; i < 9; i++) {
		let local = localStorage.getItem(lang + level + i.toString());
		if (local == null) {
			number[i] = 0;
		} else {
			number[i] = parseInt(local);
		}
	}
	
	for (let i = 1; i < 9; i++) {
		document.getElementById('bartext' + i.toString()).innerText= number[i].toString();
		document.getElementById('barfill' + i.toString()).style.width = Math.round(100*number[i]/won).toString() + '%';
	}
	document.getElementById('flag').src= 'images/' + lang + '.png';
	document.getElementById('level').src= 'images/' + level + '.png';
	document.getElementById('played').innerText = 'Games played: ' + played.toString();
	document.getElementById('status').innerText = 'Status: ' + wstatus;
	document.getElementById('win').innerText = 'Win percentage: ' + winpercentage;
	document.getElementById('streak').innerText = 'Current streak: ' + cstreak.toString();
	document.getElementById('max').innerText = 'Max streak: ' + mstreak.toString();
	document.getElementById('timed').innerText = 'Timed PR: ' + timed;
	document.getElementById('speedrun').innerText = 'Speedrun PR: ' + speedrun;
}

function l11ll(input) { //Encrypt
	let n = '';
	let j;
	for (let i = 0; i < 5; i++) {
		j = input.charCodeAt(i);
		if ( j > 100) {
			n = String.fromCharCode(408 - j) + n;
		} else {
			n = String.fromCharCode(65 + ((j + i -64) % 26)) + n;
		}
	}
	return n;
}

setInterval(cd, 1000);

function cd() { //countDown
	let d = new Date();
	let hour = d.getUTCHours();
	let min = d.getUTCMinutes();
	let sec = d.getUTCSeconds();
	let timeLeft;
	sec = (60 - sec) % 60;
	min = (60 - min - Math.ceil(sec / 60)) % 60;
	hour = 24 - hour - Math.ceil((sec + min) / 120);
	if (hour < 10) {
		timeLeft = '0' + hour.toString();
	} else {
		timeLeft = hour.toString();
	}
	if (min < 10) {
		timeLeft = timeLeft + ':0' + min.toString();
	} else {
		timeLeft = timeLeft + ':' + min.toString();
	}
	if (sec < 10) {
		timeLeft = timeLeft +':0' + sec.toString();
	} else {
		timeLeft = timeLeft +':' + sec.toString();
	}
	if (gameOver) {
		document.getElementById('timer').innerText = 'Next Word500 in ' + timeLeft;
	} else {
		document.getElementById('timer').innerText = '';
	}
}

function ti() { //Timer
	let d = new Date();
	let running = d - gameStart;
	let min = Math.floor(running/60000);
	if (mode == 'B' && min == 5){
		gameOver=true;
		document.getElementById('title').innerText = 'Time is up! The word was ' + word;
		clearInterval(stopwatch);
	} else if (mode == 'B') {
		document.getElementById('title').innerText = writetime(running,false)
	} else {
		document.getElementById('title').innerText = writetime(running,false) + ' (' + gamesWon.toString() + '/10)'
	}
}

function writetime(itime,ms){
		let sTimer;
		let min = Math.floor(itime/60000);
		if (min < 10) {
			sTimer = '0' + min.toString();
		} else {
			sTimer = min.toString();
		}
		let sec = Math.floor(itime/1000) % 60;
		if (sec < 10) {
			sTimer = sTimer + ':0' + sec.toString();
		} else {
			sTimer = sTimer + ':' + sec.toString();
		}
		if (ms) {
			let millis = itime % 1000;
			if (millis > 99) {
				sTimer = sTimer + '.' + millis.toString();
			} else if (millis > 9) {
				sTimer = sTimer + '.0' + millis.toString();
			} else {
				sTimer = sTimer + '.00' + millis.toString();
			}
		}
		return sTimer;
}

function cc(m) { //Copy to Clipboard
	let lines = '';
	let result;
	word = llll1(localStorage.getItem(lang + level + 'word')); //Decrypt
	hintsUsed = parseInt(localStorage.getItem(lang + level + 'hints'));

	for (let i = 0; i < height; i++) {
		guesses[i] = localStorage.getItem(lang + level + 'guess' + i.toString());
		if (guesses[i] == null) {
			row = i;
			break;
		} else {
			if (m == 'I') {
				let j = l1l11(guesses[i], word);
				let index = scores.findIndex(val => val == j);
				lines = lines + images[index] + '\n';
			}
			if (m == 'P') {
				let j = l1l11(guesses[i], word);
				if (j < 10) {
					lines = lines + '[00' + j.toString() + ']\n';
				} else {
					if (j < 100) {
						lines = lines + '[0' + j.toString() + ']\n';
					} else {
						lines = lines + '[' + j.toString() + ']\n';
					}
				}
            }
			if (m == 'E') {
				let j = l1l11(guesses[i], word);
				lines = lines + unicode[Math.floor(j/100)];
				lines = lines + unicode[Math.floor((j % 100)/10)];
				lines = lines + unicode[j % 10] + ' \n';
			}
		}
	}

	if (row == 0) {
		row = 8;
	}

	lines = lines + '\nhttps://www.word500.com';

	let cb = 'Word500, ';

	if (level == 'A') {
		cb = cb + 'Standard, '
	} else {
		if (level == 'B') {
			cb = cb + 'Standard+, '
		} else {
			cb = cb + 'Advanced, '
		}
	}

	if (hintsUsed > 0) {
		result = 'LOSS';
	} else if (row < 8) {
		result = row.toString() + '/8';
	} else if (l1l11(guesses[7], word) == 500) {
		result = '8/8'
	} else {
		result = 'LOSS';
	}

	let d = new Date();
	cb = cb + d.getUTCDate() + '-' + months[d.getUTCMonth()] + '-' + d.getFullYear() + '\n';

	if (hintsUsed == 0) {
		cb = cb + 'No hints used, score = ' + result + '\n';
	} else {
		cb = cb + hintsUsed.toString() + ' hints used, score = LOSS\n';
	}
	navigator.clipboard.writeText(cb + lines);
	sm('Results copied!');
}

var up = function (name, w) { // read URL Parameters
    w = w || window;
    var rx = new RegExp('[\&|\?]' + name + '=([^\&\#]+)'),
        val = w.location.search.match(rx);
    return !val ? '' : val[1];
}