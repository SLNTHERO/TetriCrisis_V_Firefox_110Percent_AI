/*
  TetriCrisis V "Firefox" 110% A.I. - Puzzle game
  Copyright (C) 2020 - 16BitSoft Inc.

  This program is free software; you can redistribute it and/or
  modify it under the terms of the GNU General Public License
  as published by the Free Software Foundation; either version 2
  of the License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

  Email the author at: www.16BitSoft.com
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
    var expires;

    if (days)
    {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toUTCString();
    }
    else  expires = "";

    document.cookie = name+"="+value+expires+"; path=/";
}

//--------------------------------------------------------------------------------------------------------------
function ReadCookie(name)
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++)
    {
	var c = ca[i];
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
var temp = null;
var tempTwo = null;
var tempThree = null;

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

        for (var gameModeTwo = 0; gameModeTwo < 7; gameModeTwo++)
        {
            for (var rankTwo = 0; rankTwo < 10; rankTwo++)
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

            for (var gameMode = 0; gameMode < 7; gameMode++)
        {
            for (var rank = 0; rank < 10; rank++)
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

        for (var gameMode = 0; gameMode < 7; gameMode++)
        {
            for (var rank = 0; rank < 10; rank++)
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
        
        for (var gameModeTwo = 0; gameModeTwo < 7; gameModeTwo++)
	    {
            for (var rankTwo = 0; rankTwo < 10; rankTwo++)
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
    for (var gameMode = 0; gameMode < 7; gameMode++)
    {
	HighScoresName[gameMode][0] = "JeZ+Lee";
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

	HighScoresScore[gameMode][0] = 10000;
	HighScoresScore[gameMode][1] = 9000;
	HighScoresScore[gameMode][2] = 8000;
	HighScoresScore[gameMode][3] = 7000;
	HighScoresScore[gameMode][4] = 6000;
	HighScoresScore[gameMode][5] = 5000;
	HighScoresScore[gameMode][6] = 4000;
	HighScoresScore[gameMode][7] = 3000;
	HighScoresScore[gameMode][8] = 2000;
	HighScoresScore[gameMode][9] = 1000;
    }
    
    HighScoresLevel[6][0] = "31";
    HighScoresLevel[6][1] = "31";
    HighScoresLevel[6][2] = "30";
    HighScoresLevel[6][3] = "25";
    HighScoresLevel[6][4] = "25";
    HighScoresLevel[6][5] = "20";
    HighScoresLevel[6][6] = "15";
    HighScoresLevel[6][7] = "10";
    HighScoresLevel[6][8] = "5";
    HighScoresLevel[6][9] = "1";
}

//--------------------------------------------------------------------------------------------------------------
function CheckForNewHighScores()
{
var human = new Array(5);
    
    for (var index = 0; index < 5; index++)
    {
        human[index] = PlayerInput[index] !== CPU;
    }

    NewHighScoreRank = 999;

    if (GameMode === FirefoxStoryMode) PlayerWithHighestScore = 0;
    else
    {
        PlayerWithHighestScore = 0;
        for (var indexTwo = 0; indexTwo < 5; indexTwo++)
        {
            if (human[indexTwo] === true && Score[indexTwo] >= Score[PlayerWithHighestScore])  PlayerWithHighestScore = indexTwo;
        }
        
    }

    for (var rankTwo = 9; rankTwo > -1; rankTwo--)
    {
	    if ( Score[PlayerWithHighestScore] >= parseInt(HighScoresScore[GameMode][rankTwo]) )  NewHighScoreRank = rankTwo;
    }

    if (NewHighScoreRank < 999)
    {
        for (var rankThree = 8; rankThree > NewHighScoreRank-1; rankThree--)
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
