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

// "initialize.js"...

let InitLoaded = false;

let VisualsLoaded = false;
let AudioCacheLoaded = false;

let Browser = "null";

let AppHasFocus = true;

let WebsiteRunOnServer = false;

let AppStart = new Date().getTime();
let NextSecond = AppStart+1000;

let Framerate = 45;

let Level0Video;
let Level5Video;
let Level10Video;
let Level15Video;
let Level20Video;
let Level25Video;
let Level30Video;

//--------------------------------------------------------------------------------------------------------------
function InitSettings()
{
    if ( navigator.userAgent.toLowerCase().indexOf('android') > -1 )
        Browser = "Google Android";
    else if ( navigator.userAgent.toLowerCase().indexOf('iphone') > -1
        || navigator.userAgent.toLowerCase().indexOf('ipad') > -1
        || navigator.userAgent.toLowerCase().indexOf('ipod') > -1 )
        Browser = "Apple iOS";
    else if ( navigator.userAgent.toLowerCase().indexOf('mobile') > -1 )
        Browser = "Mobile Unknown";
    else if ( navigator.userAgent.toLowerCase().indexOf('viera') > -1 )
        Browser = "Viera Smart T.V.";
    else if ( navigator.userAgent.toLowerCase().indexOf('edge') > -1 )
        Browser = "MS Edge";
    else if ( navigator.userAgent.toLowerCase().indexOf('opera') > -1
        || navigator.userAgent.toLowerCase().indexOf('opr') > -1 )
        Browser = "Opera";
    else if ( navigator.userAgent.toLowerCase().indexOf('chrome') > -1 )
        Browser = "Chrome";
    else if ( navigator.userAgent.toLowerCase().indexOf('firefox') > -1 )
        Browser = "Firefox";
    else if ( navigator.userAgent.toLowerCase().indexOf('ie') > -1
        || navigator.userAgent.toLowerCase().indexOf('trident') > -1 )
        Browser = "MS IE";
    else if ( navigator.userAgent.toLowerCase().indexOf('safari') > -1 )
        Browser = "Safari";
    else
        Browser = "UNKNOWN Browser";

    SoundType = "null";
    let audioTest = document.createElement('audio');
    if ( audioTest.canPlayType('audio/mpeg;') )  SoundType = "mp3";
    else  if ( audioTest.canPlayType('audio/ogg;') )  SoundType = "ogg";
    
    let canvas = document.createElement('canvas');
    let canvasFallingLetters = document.createElement('canvas');

    canvas.id = "ScreenCanvas";
    canvas.width = 800;
    canvas.height = 480;
    canvas.style.zIndex = "0";
    canvas.style.position = "absolute";
    canvas.style.border = "0px solid";

   if ( Browser === "Google Android" || Browser === "Apple iOS" || Browser === "Mobile Unknown" )
   {     
        canvas.style.top = "0%";
        canvas.style.left = "0%";
   }
   else
   {
        canvas.style.top = "50%";
        canvas.style.left = "50%";
    }
    document.body.appendChild(canvas);
    document.body.appendChild(canvasFallingLetters);

    ctxCanvas = document.getElementById("ScreenCanvas");
    ctx = ctxCanvas.getContext("2d");

    screenWidth = 800;
    screenHeight = 480;
	
    WebsiteRunOnServer = !!(window.location.protocol === 'http:' || window.location.protocol === 'https:');

    USBGamepadsSupported = navigator.getGamepads || !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
}

//--------------------------------------------------------------------------------------------------------------
function AppLostFocus()
{
    if (AppHasFocus === false)  return;
    AppHasFocus = false; 

    if (ScreenToDisplay > 1 && SoundType !== "null" && MusicVolume > 0)  MusicArray[CurrentlyPlayingMusicTrack].pause();
}

//--------------------------------------------------------------------------------------------------------------
function AppGainedFocus()
{
    if (AppHasFocus === true)  return;
    AppHasFocus = true; 

    if (ScreenToDisplay > 1 && SoundType !== "null" && MusicVolume > 0)  MusicArray[CurrentlyPlayingMusicTrack].play();
}

//--------------------------------------------------------------------------------------------------------------
function HandleVisibilityChange()
{
    if (document.hidden)
    {
	AppLostFocus();
    }
    else
    {
	AppGainedFocus();
    }
}

//--------------------------------------------------------------------------------------------------------------
function Init()
{
    if (InitLoaded === true)  return;
    InitLoaded = true;
    
    let test_canvas = document.createElement("canvas");
    let canvascheck=!!(test_canvas.getContext);
    if (canvascheck === false)  alert("This browser does not support HTML5, get Mozilla Firefox or Google Chrome!");
    
    GamepadUP = GamepadAxisOne;
    GamepadRIGHT = GamepadAxisZero;
    GamepadDOWN = GamepadAxisOne;
    GamepadLEFT = GamepadAxisZero;
    GamepadBUTTONONE = GamepadButtonZero;
    GamepadBUTTONTWO = GamepadButtonOne;
    
    InitializeHighScores();
    
    InitSettings();
    LoadOptions();
    LoadImages();

    let canvas = document.getElementById("ScreenCanvas");

    canvas.addEventListener("mousemove", function(event)
    {
        let rect = canvas.getBoundingClientRect();
        MouseX = Math.floor(event.clientX - rect.left);
        MouseY = Math.floor(event.clientY - rect.top);

        if (BrowserWidth !== 800)  MouseX = (  Math.floor( MouseX * (800/BrowserWidth) )  );

        if (BrowserHeight !== 480)  MouseY = (  Math.floor( MouseY * (480/BrowserHeight) )  );
    });

    window.addEventListener('resize', BrowserResize, false);
    BrowserResize();

    window.addEventListener("keydown", function(e) {
        // space and arrow keys
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    canvas.addEventListener("click", CheckForMouseButtonClick, false);
    canvas.addEventListener("mousedown", CheckForMouseButtonDown);
    canvas.addEventListener("mouseup", CheckForMouseButtonUp);
    
    document.addEventListener("keypress", CheckForKeyPress, true);
    document.addEventListener("keydown", CheckForKeyDown, true);
    document.addEventListener("keyup", CheckForKeyRelease, true);
    
    document.addEventListener("visibilitychange", HandleVisibilityChange, false);

    document.body.style.backgroundColor = "Black";
    
    for (let index = 0; index < 8; index++)
    {
        JoystickDirection[index] = CENTER;
        JoystickButtonOne[index] = false;
        JoystickButtonTwo[index] = false;
    }

    draw();
}

//--------------------------------------------------------------------------------------------------------------
function RequestAnimFrame(func, fps)
{
	window.setTimeout(func, 1000 / fps);
}

//--------------------------------------------------------------------------------------------------------------
function draw()
{
    GameLoop();
    RequestAnimFrame(draw, Framerate);
}
