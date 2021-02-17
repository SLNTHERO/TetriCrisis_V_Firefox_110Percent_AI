/*
Copyright 2021 Team 16BitSoft

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// "data.js"...

let Version = 5.08;

let HTML5LocalStorageSupported = true;

let NewHighScoreRank = 999;
let PlayerWithHighestScore = 2;
let NewHighScoreNameIndex = 0;
let NewHighScoreTempName = new Array(20);

let HighScoresName = new Array(7);
    HighScoresName[0] = new Array(10);
    HighScoresName[1] = new Array(10);
    HighScoresName[2] = new Array(10);
    HighScoresName[3] = new Array(10);
    HighScoresName[4] = new Array(10);
    HighScoresName[5] = new Array(10);
    HighScoresName[6] = new Array(10);

let HighScoresLevel = new Array(7);
    HighScoresLevel[0] = new Array(10);
    HighScoresLevel[1] = new Array(10);
    HighScoresLevel[2] = new Array(10);
    HighScoresLevel[3] = new Array(10);
    HighScoresLevel[4] = new Array(10);
    HighScoresLevel[5] = new Array(10);
    HighScoresLevel[6] = new Array(10);

let HighScoresScore = new Array(7);
    HighScoresScore[0] = new Array(10);
    HighScoresScore[1] = new Array(10);
    HighScoresScore[2] = new Array(10);
    HighScoresScore[3] = new Array(10);
    HighScoresScore[4] = new Array(10);
    HighScoresScore[5] = new Array(10);
    HighScoresScore[6] = new Array(10);

let NewHighScoreCharX;
let NewHighScoreCharY;

//--------------------------------------------------------------------------------------------------------------
function CreateCookie(name,value,days)
{
    let expires;

    if (days)
    {
        let date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toUTCString();
    }
    else  expires = "";

    document.cookie = name+"="+value+expires+"; path=/";
}

//--------------------------------------------------------------------------------------------------------------
function ReadCookie(name)
{
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++)
    {
	let c = ca[i];
	while (c.charAt(0)===' ') c = c.substring(1,c.length);
	if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
}

//--------------------------------------------------------------------------------------------------------------
function CheckHTML5LocalStorage()
{
    try
    {
	    return 'localStorage' in window && window['localStorage'] !== null;
    }
    catch (e)
    {
	    return false;
    }
}

//--------------------------------------------------------------------------------------------------------------
function LoadOptions()
{
let temp = null;
let tempTwo = null;
let tempThree = null;

    if ( CheckHTML5LocalStorage() === false )  HTML5LocalStorageSupported = false;

    if ( (Browser === "MS IE" && WebsiteRunOnServer === false) || HTML5LocalStorageSupported === false )
    {
        temp = ReadCookie('TC5-Beta1-MusicVolume');
        if (!temp)  FirstRunCheckAudio = true;
        else  MusicVolume = parseFloat(temp);

        temp = ReadCookie('TC5-Beta1-SoundVolume');
        if (!temp)  FirstRunCheckAudio = true;
        else  SoundVolume = parseFloat(temp);

        temp = ReadCookie('TC5-Beta1-GameMode');
        if (temp)  GameMode = parseInt(temp);

        temp = ReadCookie('TC5-Beta1-CPUPlayerEnabled');
        if (temp)  CPUPlayerEnabled = parseInt(temp);

        temp = ReadCookie('TC5-Beta1-DisplayDropShadow');
        if (temp)  DisplayDropShadow = parseInt(temp);

        temp = ReadCookie('TC5-Beta1-PressingUPAction');
        if (temp)  PressingUPAction = parseInt(temp);

        temp = ReadCookie('TC5-Beta1-KeyboardSpaceBarFunction');
        if (temp)  KeyboardSpaceBarFunction = parseInt(temp);

        for (let gameModeTwo = 0; gameModeTwo < 7; gameModeTwo++)
        {
            for (let rankTwo = 0; rankTwo < 10; rankTwo++)
            {
            temp = ReadCookie('TC5-Beta1-HighScoresName'+gameModeTwo+''+rankTwo+'');
            if (temp)  HighScoresName[gameModeTwo][rankTwo] = temp;

            tempTwo = ReadCookie('TC5-Beta1-HighScoresLevel'+gameModeTwo+''+rankTwo+'');
            if (tempTwo)  HighScoresLevel[gameModeTwo][rankTwo] = parseInt(tempTwo);

            tempThree = ReadCookie('TC5-Beta1-HighScoresScore'+gameModeTwo+''+rankTwo+'');
            if (tempThree)  HighScoresScore[gameModeTwo][rankTwo] = parseInt(tempThree);
            }
        }

        temp = ReadCookie('TC5-Beta1-GamepadUP');
        if (temp)  GamepadUP = parseInt(temp);

        temp = ReadCookie('TC5-Beta1-GamepadRIGHT');
        if (temp)  GamepadRIGHT = parseInt(temp);

        temp = ReadCookie('TC5-Beta1-GamepadDOWN');
        if (temp)  GamepadDOWN = parseInt(temp);

        temp = ReadCookie('TC5-Beta1-GamepadLEFT');
        if (temp)  GamepadLEFT = parseInt(temp);

        temp = ReadCookie('TC5-Beta1-GamepadBUTTONONE');
        if (temp)  GamepadBUTTONONE = parseInt(temp);

        temp = ReadCookie('TC5-Beta1-GamepadBUTTONTWO');
        if (temp)  GamepadBUTTONTWO = parseInt(temp);

        temp = ReadCookie('TC5-Beta1-Version');
        if (temp)  Version = parseInt(temp);
    }
    else if (HTML5LocalStorageSupported === true)
    {
        temp = localStorage.getItem('TC5-Beta1-MusicVolume');
        if (!temp)  FirstRunCheckAudio = true;
        else  MusicVolume = parseFloat(temp);

        temp = localStorage.getItem('TC5-Beta1-SoundVolume');
        if (!temp)  FirstRunCheckAudio = true;
        else  SoundVolume = parseFloat(temp);

        temp = localStorage.getItem('TC5-Beta1-GameMode');
        if (temp)  GameMode = parseInt(temp);

        temp = localStorage.getItem('TC5-Beta1-CPUPlayerEnabled');
        if (temp)  CPUPlayerEnabled = parseInt(temp);

        temp = localStorage.getItem('TC5-Beta1-DisplayDropShadow');
        if (temp)  DisplayDropShadow = parseInt(temp);

        temp = localStorage.getItem('TC5-Beta1-PressingUPAction');
        if (temp)  PressingUPAction = parseInt(temp);

        temp = localStorage.getItem('TC5-Beta1-KeyboardSpaceBarFunction');
        if (temp)  KeyboardSpaceBarFunction = parseInt(temp);

            for (let gameMode = 0; gameMode < 7; gameMode++)
        {
            for (let rank = 0; rank < 10; rank++)
            {
            temp = localStorage.getItem('TC5-Beta1-HighScoresName'+gameMode+''+rank+'');
            if (temp)  HighScoresName[gameMode][rank] = temp;

            tempTwo = localStorage.getItem('TC5-Beta1-HighScoresLevel'+gameMode+''+rank+'');
            if (tempTwo)  HighScoresLevel[gameMode][rank] = parseInt(tempTwo);

            tempThree = localStorage.getItem('TC5-Beta1-HighScoresScore'+gameMode+''+rank+'');
            if (tempThree)  HighScoresScore[gameMode][rank] = parseInt(tempThree);
            }
        }

        temp = localStorage.getItem('TC5-Beta1-GamepadUP');
        if (temp)  GamepadUP = parseInt(temp);

        temp = localStorage.getItem('TC5-Beta1-GamepadRIGHT');
        if (temp)  GamepadRIGHT = parseInt(temp);

        temp = localStorage.getItem('TC5-Beta1-GamepadDOWN');
        if (temp)  GamepadDOWN = parseInt(temp);

        temp = localStorage.getItem('TC5-Beta1-GamepadLEFT');
        if (temp)  GamepadLEFT = parseInt(temp);

        temp = localStorage.getItem('TC5-Beta1-GamepadBUTTONONE');
        if (temp)  GamepadBUTTONONE = parseInt(temp);

        temp = localStorage.getItem('TC5-Beta1-GamepadBUTTONTWO');
        if (temp)  GamepadBUTTONTWO = parseInt(temp);
        
        temp = localStorage.getItem('TC5-Beta1-Version');
        if (temp)  Version = parseInt(temp);
    }
}

//--------------------------------------------------------------------------------------------------------------
function SaveOptions()
{
    if ( (Browser === "MS IE" && WebsiteRunOnServer === false) || HTML5LocalStorageSupported === false )
    {
        CreateCookie('TC5-Beta1-MusicVolume', MusicVolume, 9999);

        CreateCookie('TC5-Beta1-SoundVolume', SoundVolume, 9999);

        CreateCookie('TC5-Beta1-GameMode', GameMode, 9999);

        CreateCookie('TC5-Beta1-CPUPlayerEnabled', CPUPlayerEnabled, 9999);

        CreateCookie('TC5-Beta1-DisplayDropShadow', DisplayDropShadow, 9999);

        CreateCookie('TC5-Beta1-PressingUPAction', PressingUPAction, 9999);

        CreateCookie('TC5-Beta1-KeyboardSpaceBarFunction', KeyboardSpaceBarFunction, 9999);

        for (let gameMode = 0; gameMode < 7; gameMode++)
        {
            for (let rank = 0; rank < 10; rank++)
            {
            CreateCookie('TC5-Beta1-HighScoresName'+gameMode+''+rank+'', HighScoresName[gameMode][rank], 9999);

            CreateCookie('TC5-Beta1-HighScoresLevel'+gameMode+''+rank+'', HighScoresLevel[gameMode][rank], 9999);

            CreateCookie('TC5-Beta1-HighScoresScore'+gameMode+''+rank+'', HighScoresScore[gameMode][rank], 9999);
            }
        }

        CreateCookie('TC5-Beta1-GamepadUP', GamepadUP, 9999);

        CreateCookie('TC5-Beta1-GamepadRIGHT', GamepadRIGHT, 9999);

        CreateCookie('TC5-Beta1-GamepadDOWN', GamepadDOWN, 9999);

        CreateCookie('TC5-Beta1-GamepadLEFT', GamepadLEFT, 9999);

        CreateCookie('TC5-Beta1-GamepadBUTTONONE', GamepadBUTTONONE, 9999);

        CreateCookie('TC5-Beta1-GamepadBUTTONTWO', GamepadBUTTONTWO, 9999);

        CreateCookie('TC5-Beta1-Version', Version, 9999);
    }
    else if (HTML5LocalStorageSupported === true)
    {
        localStorage.setItem('TC5-Beta1-MusicVolume', MusicVolume);

        localStorage.setItem('TC5-Beta1-SoundVolume', SoundVolume);

        localStorage.setItem('TC5-Beta1-GameMode', GameMode);

        localStorage.setItem('TC5-Beta1-CPUPlayerEnabled', CPUPlayerEnabled);

        localStorage.setItem('TC5-Beta1-DisplayDropShadow', DisplayDropShadow);

        localStorage.setItem('TC5-Beta1-PressingUPAction', PressingUPAction);

        localStorage.setItem('TC5-Beta1-KeyboardSpaceBarFunction', KeyboardSpaceBarFunction);
        
        for (let gameModeTwo = 0; gameModeTwo < 7; gameModeTwo++)
	    {
            for (let rankTwo = 0; rankTwo < 10; rankTwo++)
            {
                localStorage.setItem('TC5-Beta1-HighScoresName'+gameModeTwo+''+rankTwo+'', HighScoresName[gameModeTwo][rankTwo]);

                localStorage.setItem('TC5-Beta1-HighScoresLevel'+gameModeTwo+''+rankTwo+'', HighScoresLevel[gameModeTwo][rankTwo]);

                localStorage.setItem('TC5-Beta1-HighScoresScore'+gameModeTwo+''+rankTwo+'', HighScoresScore[gameModeTwo][rankTwo]);
            }
        }

        localStorage.setItem('TC5-Beta1-GamepadUP', GamepadUP);

        localStorage.setItem('TC5-Beta1-GamepadRIGHT', GamepadRIGHT);

        localStorage.setItem('TC5-Beta1-GamepadDOWN', GamepadDOWN);

        localStorage.setItem('TC5-Beta1-GamepadLEFT', GamepadLEFT);

        localStorage.setItem('TC5-Beta1-GamepadBUTTONONE', GamepadBUTTONONE);

        localStorage.setItem('TC5-Beta1-GamepadBUTTONTWO', GamepadBUTTONTWO);

        localStorage.setItem('TC5-Beta1-Version', Version);
    }
}

//--------------------------------------------------------------------------------------------------------------
function InitializeHighScores()
{
    for (let gameMode = 0; gameMode < 7; gameMode++)
    {
	HighScoresName[gameMode][0] = "JeZxLee";
	HighScoresName[gameMode][1] = "Doatheman";
	HighScoresName[gameMode][2] = "mattmatteh";
	HighScoresName[gameMode][3] = "You!";
	HighScoresName[gameMode][4] = "You!";
	HighScoresName[gameMode][5] = "You!";
	HighScoresName[gameMode][6] = "You!";
	HighScoresName[gameMode][7] = "You!";
	HighScoresName[gameMode][8] = "You!";
	HighScoresName[gameMode][9] = "You!";

	HighScoresLevel[gameMode][0] = 10;
	HighScoresLevel[gameMode][1] = 9;
	HighScoresLevel[gameMode][2] = 8;
	HighScoresLevel[gameMode][3] = 7;
	HighScoresLevel[gameMode][4] = 6;
	HighScoresLevel[gameMode][5] = 5;
	HighScoresLevel[gameMode][6] = 4;
	HighScoresLevel[gameMode][7] = 3;
	HighScoresLevel[gameMode][8] = 2;
	HighScoresLevel[gameMode][9] = 1;

	HighScoresScore[gameMode][0] = 5000;
	HighScoresScore[gameMode][1] = 4500;
	HighScoresScore[gameMode][2] = 4000;
	HighScoresScore[gameMode][3] = 3500;
	HighScoresScore[gameMode][4] = 3000;
	HighScoresScore[gameMode][5] = 2500;
	HighScoresScore[gameMode][6] = 2000;
	HighScoresScore[gameMode][7] = 1500;
	HighScoresScore[gameMode][8] = 1000;
	HighScoresScore[gameMode][9] = 500;
    }
    
    HighScoresLevel[6][0] = 31;
    HighScoresLevel[6][1] = 31;
    HighScoresLevel[6][2] = 30;
    HighScoresLevel[6][3] = 25;
    HighScoresLevel[6][4] = 25;
    HighScoresLevel[6][5] = 20;
    HighScoresLevel[6][6] = 15;
    HighScoresLevel[6][7] = 10;
    HighScoresLevel[6][8] = 5;
    HighScoresLevel[6][9] = 1;
}

//--------------------------------------------------------------------------------------------------------------
function CheckForNewHighScores()
{
let human = new Array(5);
    
    for (let index = 0; index < 5; index++)
    {
        human[index] = PlayerInput[index] !== CPU;
    }

    NewHighScoreRank = 999;

    if (GameMode === FirefoxStoryMode) PlayerWithHighestScore = 0;
    else
    {
        PlayerWithHighestScore = 0;
        for (let indexTwo = 0; indexTwo < 5; indexTwo++)
        {
            if (human[indexTwo] === true && Score[indexTwo] >= Score[PlayerWithHighestScore])  PlayerWithHighestScore = indexTwo;
        }
        
    }

    for (let rankTwo = 9; rankTwo > -1; rankTwo--)
    {
	    if ( Score[PlayerWithHighestScore] >= parseInt(HighScoresScore[GameMode][rankTwo]) )  NewHighScoreRank = rankTwo;
    }

    if (NewHighScoreRank < 999)
    {
        for (let rankThree = 8; rankThree > NewHighScoreRank-1; rankThree--)
        {
                HighScoresName[GameMode][rankThree+1] = HighScoresName[GameMode][rankThree];
                HighScoresLevel[GameMode][rankThree+1] = HighScoresLevel[GameMode][rankThree];
                HighScoresScore[GameMode][rankThree+1] = HighScoresScore[GameMode][rankThree];
        }

        HighScoresName[GameMode][NewHighScoreRank] = " ";

        HighScoresLevel[GameMode][NewHighScoreRank] = ""+Level[PlayerWithHighestScore]+"";

        HighScoresScore[GameMode][NewHighScoreRank] = ""+Score[PlayerWithHighestScore]+"";
    }   
}	
