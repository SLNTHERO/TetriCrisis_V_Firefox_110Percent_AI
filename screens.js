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

// "screens.js"...

let DEBUG = false;
let ScreenIsDirty = true;

let ctxCanvas;
let ctx;

let screenWidth;
let screenHeight;

let canvas;

let ScreenFadeAlpha = 1;
let ScreenFadeStatus = 0;
let ScreenToDisplay = 0;
let NextScreenToDisplay = 1;

let frameCount = 0;
let FPS = 0;

let NowLoadingTextBlink = 0;
let LoadTimer = 0;

let ArrowButtonAnimation = 0;

let CursorIsArrow = true;

let SixteenBitSoftScreenTimer;

let NewHighScoreCharButtonScreenX = new Array(67);
let NewHighScoreCharButtonScreenY = new Array(67);
let NewHighScoreCharButtonScale = new Array(67);
let NewHighScoreCharButtonGreenHue = new Array(67);

let FirefoxOneScreenX;
let FirefoxOneScreenY;
let FirefoxOneScale;
let FirefoxTwoScreenX;
let FirefoxTwoScreenY;
let FirefoxTwoScale;
let StaffFirefoxSceneTimer;

let LogoFlashScreenX;

let RemoveStoryVideo = false;
let video;

let characters = ["?", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"
                , "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
                , "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"
                , "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
                , "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", " "];

let HighScoreUseKeyboard            = 0;
let HighScoreUseMouse               = 1;
let HighScoreUseKeyboardAndMouse    = 2;
let HighScoreNameInputDevice        = HighScoreUseKeyboardAndMouse;
let HighScoreJoyCharIndex;

let NewGroundsLogoTimer;

let LogoAlphaTransition;

let TestScale;
let TestScaleDir;
let TestRotation;

let ControlScheme;

let DelayToLoadAudio = 1;

//--------------------------------------------------------------------------------------------------------------
function ApplyScreenFade()
{
    if (ScreenFadeStatus === -1)  return;

    if (ScreenFadeStatus === 0)
    {
        ScreenFadeAlpha-=.33;

        ScreenIsDirty = true;

        if (ScreenFadeAlpha < 0)
        {
            ScreenFadeStatus = -1;
            ScreenFadeAlpha = 0;

            if (ScreenToDisplay === 3)  SaveOptions();
        }
    }
    else if (ScreenFadeStatus === 1)
    {
        ScreenFadeAlpha+=.33;

        if (ScreenFadeAlpha > 1)  ScreenIsDirty = true;

        if (ScreenFadeAlpha > 1)
        {
            ScreenFadeStatus = 0;
            ScreenFadeAlpha = 1;
            ScreenToDisplay = NextScreenToDisplay;
            NumberOfOnscreenButtons = 0;
            NumberOfOnscreenArrowSets = 0;
            NumberOfOnscreenIcons = 0;
            
            ClearTextCache();
        }
    }

    DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, ScreenFadeAlpha, 255, 255, 255)
}

//--------------------------------------------------------------------------------------------------------------
function GameLoop()
{
let index;

    frameCount++;

    let CurrentTime = new Date().getTime();
    if (CurrentTime > NextSecond)
    {
        FPS = frameCount;
        frameCount = 0;
        NextSecond = CurrentTime+1000;
    }
  
    for (index = 0; index < 5; index++)  Gamepads[index] = null;
    if (USBGamepadsSupported)
    {
        Gamepads = navigator.getGamepads();
        CheckForGamepadInput();
    }

    if (DEBUG === true)  ScreenIsDirty = true;

    if (ScreenToDisplay === 0)  DisplayLoadingNowScreen();
    else if (ScreenToDisplay === 2)  DisplaySixteenBitSoftScreen();
    else if (ScreenToDisplay === 3)  DisplayTitleScreen();
    else if (ScreenToDisplay === 4)  DisplayOptionsScreen();
    else if (ScreenToDisplay === 5)  DisplayHowToPlayScreen();
    else if (ScreenToDisplay === 6)  DisplayHighScoresScreen();
    else if (ScreenToDisplay === 7)  DisplayAboutScreen();
    else if (ScreenToDisplay === 8)  DisplayPlayingGameScreen();
    else if (ScreenToDisplay === 9)  DisplayPlayingStoryGameScreen();
    else if (ScreenToDisplay === 10)  DisplayNewHighScoreNameInputScreen();
    else if (ScreenToDisplay === 11)  DisplayStoryVideo();
	else if (ScreenToDisplay === 12)  DisplayAITestScreen();

    DrawAllGUIButtonImages();
    DrawAllIcons();
	
    if (DEBUG === true && PAUSEgame === false && ScreenToDisplay !== 9)
    {
        let screenY = 395;
        let screenYoffset = 15;
        for (index = 0; index < 1; index++)
        {
            if (Gamepads[index])  DrawTextOntoCanvas(10, "["+index+"]- "+Gamepads[index].id+"", 4, screenY, "left", 255, 255, 255, 0, 0, 0, 1);
            screenY-=screenYoffset;
        }

        let xOffset = 0;
        DrawTextOntoCanvas(10, "mVol: "+MusicVolume+" sVol: "+SoundVolume+" Music OK:", 4, 410, "left", 255, 255, 255, 0, 0, 0, 1);
        for (let musicIndex = 0; musicIndex < NumberOfMusics; musicIndex++)
        {
            if (MusicIsCompletelyLoaded[musicIndex] === true)  DrawTextOntoCanvas(10, ""+musicIndex+"", 4+150+xOffset, 410, "left", 255, 255, 255, 0, 0, 0, 1);
            xOffset+=15;
        }

        if (HTML5LocalStorageSupported === false)
            DrawTextOntoCanvas(10, "HTML5 Local Storage = N.A.", 4, 425, "left", 255, 255, 255, 0, 0, 0, 1);
        else
            DrawTextOntoCanvas(10, "HTML5 Local Storage = Available", 4, 425, "left", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(10, ""+navigator.userAgent+"", 4, 440, "left", 255, 255, 255, 0, 0, 0, 1);

        let numberOfGamepads = 0;
        for (index = 0; index < 5; index++)
        {
            if (USBGamepadsSupported)
            {
                if (Gamepads[index] && Gamepads[index].index != null)  numberOfGamepads++;
            }
        }
            
        DrawTextOntoCanvas(10, "["+Math.floor(BrowserWidth)+","+Math.floor(BrowserHeight)+"]-Audio["+SoundType+"] Gamepad#: "+numberOfGamepads+" /Dir:"+JoystickDirection[Any]+" But1:"+JoystickButtonOne[Any]+" But2:"+JoystickButtonTwo[Any]+"", 4, 455, "left", 255, 255, 255, 0, 0, 0, 1);
    
        DrawTextOntoCanvas(10, "FPS="+FPS+" ["+MouseX+","+MouseY+"]-"+Browser+"", 4, 470, "left", 255, 255, 255, 0, 0, 0, 1);
    }

    ScreenIsDirty = false;

    if (CursorIsArrow === true)  document.body.style.cursor = "default";
    else if (CursorIsArrow === false)  document.body.style.cursor = "pointer";
    
    ApplyScreenFade();

    if (DelayAllUserInput > 0)
    {
        DelayAllUserInput--;
        
        for (index = 0; index < 8; index++)
        {
            JoystickDirection[index] = CENTER;
            JoystickButtonOne[index] = false;
            JoystickButtonTwo[index] = false;
        }
    }
    else
    {
        JoystickDirection[Any] = CENTER;
        JoystickButtonOne[Any] = false;
        JoystickButtonTwo[Any] = false;
        for (index = 7; index > -1; index--)
        {
            if (JoystickDirection[index] !== CENTER)  JoystickDirection[Any] = JoystickDirection[index];
            if (JoystickButtonOne[index] !== false)  JoystickButtonOne[Any] = JoystickButtonOne[index];
            if (JoystickButtonTwo[index] !== false)  JoystickButtonTwo[Any] = JoystickButtonTwo[index];
        }
    }

    if (KeyboardCharacterPressed === "~" && ScreenToDisplay !== 11)
    {
        for (index = 0; index < 5; index++)
        {
            PlayerStatus[index] = GameOver;
        }
        
	NextScreenToDisplay = 3;
	ScreenFadeStatus = 1;
    }
    
    if (KeyboardCharacterPressed === "D" && ScreenToDisplay === 2)
    {
        DEBUG = !DEBUG;
        PlaySoundEffect(0);
        DelayAllUserInput = 50;
        ScreenIsDirty = true;
    }

    KeyboardCharacterPressed = "";
    MouseButtonClicked = false;
}

//--------------------------------------------------------------------------------------------------------------
function DisplayLoadingNowScreen()
{
let allResourcesLoaded = false;
let percent;
let index;

    if (VisualsLoaded === false)
    {
        allResourcesLoaded = true;
        LoadTimer = 0;

        if (OriginalButtonSprite.complete === false)  allResourcesLoaded = false;
        else  LoadTimer++;
        
        if (GUIArrowsSprites[0].complete === false)  allResourcesLoaded = false;
        else  LoadTimer++;

        if (GUIArrowsSprites[1].complete === false)  allResourcesLoaded = false;
        else  LoadTimer++;

        if (GUISelectorLineSprite.complete === false)  allResourcesLoaded = false;
        else  LoadTimer++;

        if (PreloadedTextsBG.complete === false)  allResourcesLoaded = false;

        for (index = 0; index < NumberOfSprites; index++)
	    {
            if (ImageSprites[index].src !== '')
            {
                if (ImageSprites[index].complete === false)  allResourcesLoaded = false;
                else  LoadTimer++;
            }
	    }
		
        if (allResourcesLoaded === true)
        {
            VisualsLoaded = true;

            LoadSound();
        }
    }
    else if (AudioCacheLoaded === false)
    {
	    allResourcesLoaded = false;
		
        LoadTimer = NumberOfLoadedImages;
        for (index = 0; index < NumberOfMusics; index++)
        {
            if (MusicIsCompletelyLoaded[index] === true)  LoadTimer++;
            if (SoundType === "null")  LoadTimer = NumberOfLoadedImages+NumberOfMusics;
        }

        if (  LoadTimer > (NumberOfLoadedImages+NumberOfMusics-1)  )  allResourcesLoaded = true;

        if (allResourcesLoaded === true && ScreenFadeStatus === -1)
        {
            AudioCacheLoaded = true;
        }
    }
    else if (DelayToLoadAudio === 0)
    {
		DelayToLoadAudio = -1;
		
        LoadTimer = 0;

        NextScreenToDisplay = 2;

        ScreenFadeStatus = 1;
    }
	else if (DelayToLoadAudio > 0)
	{
		if (MouseButtonClicked === true)
		{
			DelayToLoadAudio = 0;
			
			PlaySoundEffect(0);
			PlayMusic(0);
		}
	}

    NowLoadingTextBlink = 0;

//    if (ScreenIsDirty === true)
    {
        ctx.clearRect(0, 0, screenWidth, screenHeight);
 
        percent = ( LoadTimer / (NumberOfLoadedImages+NumberOfMusics) ) * 100;
        percent = Math.floor(percent);
        if ( LoadTimer === (NumberOfLoadedImages+NumberOfMusics) )  percent = 100;
        
		if (percent < 100)
		{
			DrawTextOntoCanvas(25, "Loading now...Please wait!", 400+NowLoadingTextBlink, 240-20, "center", 255, 255, 255, 100, 100, 100, 1);
		}
		else
		{
	        DrawTextOntoCanvas(25, "Click on screen with your mouse!", 400, 240-20, "center", 255, 255, 255, 100, 100, 100, 1);
		}
		
        if (AudioCacheLoaded === false)  DrawTextOntoCanvas(25, ""+percent+"%", 400, 240+20, "center", 255, 255, 255, 100, 100, 100, 1);
        else
		{
			DrawTextOntoCanvas(25, "100%", 400, 240+20, "center", 255, 255, 255, 100, 100, 100, 1);
		}
    
        if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
        {
            CreateGUIButtonsWithText();
            PreloadAllStaffTexts();
        }
    }
}

//--------------------------------------------------------------------------------------------------------------
function Display1stRunAudioOption()
{
    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        
    }
    
    if (SoundType === "null")
    {
        ScreenFadeStatus = 1;
        NextScreenToDisplay = 2;
    }
    
    if ( MouseX > ( (400-130)-(16*7) ) && MouseX < ( (400-130)+(16*7) ) && MouseY > ( 300-(16*7) ) && MouseY < ( 300+(16*7) ) )
    {
	CursorIsArrow = false;
		
	if (MouseButtonClicked === true)
	{
	    ScreenFadeStatus = 1;
	    
	    MusicVolume = 0;
	    SoundVolume = 0;
	    
	    SaveOptions();
	}
    }
    else if ( MouseX > ( (400+130)-(16*7) ) && MouseX < ( (400+130)+(16*7) ) && MouseY > ( 300-(16*7) ) && MouseY < ( 300+ (16*7) ) )
    {
	CursorIsArrow = false;

	if (MouseButtonClicked === true)
	{
	    ScreenFadeStatus = 1;
	    
	    MusicVolume = 1;
	    SoundVolume = .5;
	    
	    SaveOptions();
	}
    }
    else  CursorIsArrow = true;

    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(0, 320, 240, 1, 1, 0, 1, 255, 255, 255);

        DrawTextOntoCanvas(25, "1st Time Run", 400, 50, "center", 255, 255, 255, 100, 100, 100, 1);
        DrawTextOntoCanvas(25, "Choose Audio Preference:", 400, 130, "center", 255, 255, 255, 100, 100, 100, 1);

        DrawSpriteOntoCanvas(5, 400-130, 300, 7, 7, 0, 1, 255, 255, 255);
        DrawTextOntoCanvas(25, "AUDIO OFF", 400-130, 460, "center", 255, 255, 255, 100, 100, 100, 1);
        DrawSpriteOntoCanvas(6, 400+130, 300, 7, 7, 0, 1, 255, 255, 255);
        DrawTextOntoCanvas(25, "AUDIO ON", 400+130, 460, "center", 255, 255, 255, 100, 100, 100, 1);
    }

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
	CursorIsArrow = true;
        
        NextScreenToDisplay = 2;
    }
}

//--------------------------------------------------------------------------------------------------------------
function DisplaySixteenBitSoftScreen()
{
    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        NewGroundsLogoTimer = 0;

	    SixteenBitSoftScreenTimer = 350;

        LogoAlphaTransition = 0;
        
        PAUSEgame = false;

        TestScale = 1;
        TestScaleDir = 0;
        TestRotation = 0;
    }

    if (JoystickButtonOne[Any] === true || MouseButtonClicked === true || KeyboardCharacterPressed === "_" || KeyboardCharacterPressed === "/")
    {
        NextScreenToDisplay = 3;
        ScreenFadeStatus = 1;
        DelayAllUserInput = 20;
    }

    if (KeyboardCharacterPressed === "T")
    {
        NextScreenToDisplay = 12;
        ScreenFadeStatus = 1;
    }

    if (SixteenBitSoftScreenTimer > 0)
    {
        if (LogoAlphaTransition > 0)  LogoAlphaTransition -=.1;
        else  LogoAlphaTransition = 0;
        
        SixteenBitSoftScreenTimer--;
    }
    else
    {
        NextScreenToDisplay = 3;
        ScreenFadeStatus = 1;
    }

//    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, 1, 255, 255, 255);

		DrawSpriteOntoCanvas(10, 400, 240, TestScale, TestScale, TestRotation, 1, 255, 255, 255);

		DrawTextOntoCanvas(20, "Team 16BitSoft", 400, 475, "center", 0, 255, 0, 0, 100, 0, 1);

        DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, LogoAlphaTransition, 255, 255, 255);
    }

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        GamepadConfigPadIndex = -1;
        GamepadConfigGetInput = 0;

        SetupTetrisCore();

		CursorIsArrow = true;
    }
}

//--------------------------------------------------------------------------------------------------------------
function DisplayTitleScreen()
{
    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        let startScreenY = 195+28;
        let screenYOffset = 42;

        CreateGUIButton(0, 400, startScreenY);
        CreateGUIButton( 1, 400, startScreenY+(screenYOffset) );
        CreateGUIButton( 2, 400, startScreenY+(2*screenYOffset) );
        CreateGUIButton( 3, 400, startScreenY+(3*screenYOffset) );
        CreateGUIButton( 4, 400, startScreenY+(4*screenYOffset) );
        CreateGUIButton( 5, 400, startScreenY+(5*screenYOffset) );

        CreateIcon(15, 64, 415);

        LogoFlashScreenX = -50;
        
        FirefoxStoryModeStarted = false;
	}

    CursorIsArrow = MouseOnGUI() !== true;
    
    if (ThisButtonWasPressed(0) === true)
    {
        if (GameMode !== FirefoxStoryMode)
        {
            NextScreenToDisplay = 8;
        }
        else
        {
            Level[0] = 0;
            NextScreenToDisplay = 11;
        }
        
        ScreenFadeStatus = 1;
    }     
    else if (ThisButtonWasPressed(1) === true)
    {
        NextScreenToDisplay = 4;
        ScreenFadeStatus = 1;
    }     
    else if (ThisButtonWasPressed(2) === true)
    {
        NextScreenToDisplay = 5;
        ScreenFadeStatus = 1;
    }     
    else if (ThisButtonWasPressed(3) === true)
    {
        NextScreenToDisplay = 6;
        ScreenFadeStatus = 1;
    }     
    else if (ThisButtonWasPressed(4) === true)
    {
        NextScreenToDisplay = 7;
        ScreenFadeStatus = 1;
    }     
    else if (ThisButtonWasPressed(5) === true)
    {
        NextScreenToDisplay = -1;
        ScreenFadeStatus = 1;
    }  

    ProcessAllIcons();

    //if (IconSelectedByPlayer === 0)  window.open('http://opentetris.com/files/TC5/TC5-Retail1.zip','_self');

    if (LogoFlashScreenX < 950)  { LogoFlashScreenX+=15; ScreenIsDirty = true; }

    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(20, 400, 240, 1, 1, 0, 1, 255, 255, 255);

        DrawSpriteOntoCanvas(30, 400, 90, 1, 1, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(32, LogoFlashScreenX, 90, 1, 1, 0, .75, 255, 255, 255);
        DrawSpriteOntoCanvas(31, 400, 89, 1, 1, 0, 1, 255, 255, 255);

        DrawTextOntoCanvas(25, "''"+HighScoresName[GameMode][0]+"'' Scored: "+HighScoresScore[GameMode][0]+"", 400, 197, "center", 255, 255, 0, 0, 0, 0, 1);

        DrawSpriteOntoCanvas(9, 800-40, 410, 1, 1, 0, 1, 255, 255, 255);
        DrawTextOntoCanvas(15, "Retail 2 110% v5.0", 800-5, 475, "right", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "\u00A92021, By Team 16BitSoft", 400, 475, "center", 255, 255, 255, 0, 0, 0, 1);
    }
    
    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        CursorIsArrow = true;

        DestroyAllButtons();

        if (NextScreenToDisplay === -1)  window.open('https://fallenangelsoftware.com','_self');
    }
}

//--------------------------------------------------------------------------------------------------------------
function DisplayOptionsScreen()
{
    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        CreateGUIArrowSet(0, 400, 85);
        CreateGUIArrowSet(1, 400, 125);

        CreateGUIArrowSet(2, 400, 180);
        CreateGUIArrowSet(3, 400, 220);
        CreateGUIArrowSet(4, 400, 260);
        CreateGUIArrowSet(5, 400, 315);
        CreateGUIArrowSet(6, 400, 355);

		CreateGUIButton(6, 400, 455);
        
        GamepadConfigPadIndex = -1;
        GamepadConfigGetInput = 0;
    }

    CursorIsArrow = MouseOnGUI() !== true;

    if (GamepadConfigPadIndex === -1)
    {
        if (ThisArrowSetArrowWasPressed(0) === true)
        {
            if (MusicVolume > 0)  MusicVolume-=.25;
            else  MusicVolume = 1;

            MusicArray[CurrentlyPlayingMusicTrack].volume = MusicVolume;
            if (MusicVolume > 0)  MusicArray[CurrentlyPlayingMusicTrack].play();
            else if (MusicVolume === 0)  MusicArray[CurrentlyPlayingMusicTrack].pause();
        }
        else if (ThisArrowSetArrowWasPressed(.5) === true)
        {
            if (MusicVolume < 1)  MusicVolume+=.25;
            else  MusicVolume = 0;

            MusicArray[CurrentlyPlayingMusicTrack].volume = MusicVolume;
            if (MusicVolume > 0)  MusicArray[CurrentlyPlayingMusicTrack].play();
            else if (MusicVolume === 0)  MusicArray[CurrentlyPlayingMusicTrack].pause();
        }
        else if (ThisArrowSetArrowWasPressed(1) === true)
        {
            if (SoundVolume > 0)  SoundVolume-=.25;
            else  SoundVolume = 1;

            PlaySoundEffect(0);
        }
        else if (ThisArrowSetArrowWasPressed(1.5) === true)
        {
            if (SoundVolume < 1)  SoundVolume+=.25;
            else  SoundVolume = 0;

            PlaySoundEffect(0);
        }
        else if (ThisArrowSetArrowWasPressed(2) === true)
        {
            if (GameMode > 0)  GameMode--;
            else  GameMode = 6;
        }
        else if (ThisArrowSetArrowWasPressed(2.5) === true)
        {
            if (GameMode < 6)  GameMode++;
            else  GameMode = 0;
        }
         else if (ThisArrowSetArrowWasPressed(3) === true)
        {
            if (GameMode !== FirefoxStoryMode)
            {
                if (CPUPlayerEnabled > 0)  CPUPlayerEnabled--;
                else  CPUPlayerEnabled = 4;
            }
        }
        else if (ThisArrowSetArrowWasPressed(3.5) === true)
        {
            if (GameMode !== FirefoxStoryMode)
            {
                if (CPUPlayerEnabled < 4)  CPUPlayerEnabled++;
                else  CPUPlayerEnabled = 0;
            }
        }
        else if (ThisArrowSetArrowWasPressed(4) === true)
        {
            if (DisplayDropShadow > 0)  DisplayDropShadow--;
            else  DisplayDropShadow = 1;
        }
        else if (ThisArrowSetArrowWasPressed(4.5) === true)
        {
            if (DisplayDropShadow < 1)  DisplayDropShadow++;
            else  DisplayDropShadow = 0;
        }
        else if (ThisArrowSetArrowWasPressed(5) === true)
        {
            if (PressingUPAction > 0)  PressingUPAction--;
            else  PressingUPAction = 3;
        }
        else if (ThisArrowSetArrowWasPressed(5.5) === true)
        {
            if (PressingUPAction < 3)  PressingUPAction++;
            else  PressingUPAction = 0;
        }
        else if (ThisArrowSetArrowWasPressed(6) === true)
        {
            if (KeyboardSpaceBarFunction > 0)  KeyboardSpaceBarFunction--;
            else  KeyboardSpaceBarFunction = 1;
        }
        else if (ThisArrowSetArrowWasPressed(6.5) === true)
        {
            if (KeyboardSpaceBarFunction < 1)  KeyboardSpaceBarFunction++;
            else  KeyboardSpaceBarFunction = 0;
        }

        if (ThisButtonWasPressed(0) === true)
        {
            NextScreenToDisplay = 3;
            ScreenFadeStatus = 1;
        }     
    }

    if (KeyboardCharacterPressed === "c")
    {
        if (GamepadConfigPadIndex === -1)
        {
            if (Gamepads[0])
            {
                GamepadConfigPadIndex = 0;
                
                GamepadConfigGetInput = 0;
            }
            else  GamepadConfigPadIndex = -1;
        }
        else
        {
            for (let gamepadIndex = 0; gamepadIndex < 1; gamepadIndex++)
            {
                GamepadUP = GamepadAxisOne;
                GamepadRIGHT = GamepadAxisZero;
                GamepadDOWN = GamepadAxisOne;
                GamepadLEFT = GamepadAxisZero;
                GamepadBUTTONONE = GamepadButtonZero;
                GamepadBUTTONTWO = GamepadButtonOne;
            }
            
            GamepadConfigPadIndex = -1;
        }

        PlaySoundEffect(0);
        DelayAllUserInput = 20;
        ScreenIsDirty = true;
    }

    if (GamepadConfigPadIndex > -1)
    {    
        let gamepadInput = QueryGamepadsForInput();
        if ( gamepadInput !== -1)
        {
            if (GamepadConfigGetInput === 0)
            {
                GamepadUP = gamepadInput;
                GamepadConfigGetInput++;

                DelayAllUserInput = 20;
            }
            else if (GamepadConfigGetInput === 1)
            {
                GamepadRIGHT = gamepadInput;
                GamepadConfigGetInput++;

                DelayAllUserInput = 20;
            }
            else if (GamepadConfigGetInput === 2)
            {
                GamepadDOWN = gamepadInput;
                GamepadConfigGetInput++;

                DelayAllUserInput = 20;
            }
            else if (GamepadConfigGetInput === 3)
            {
                GamepadLEFT = gamepadInput;
                GamepadConfigGetInput++;

                DelayAllUserInput = 20;
            }
            else if (GamepadConfigGetInput === 4)
            {
                GamepadBUTTONONE = gamepadInput;
                GamepadConfigGetInput++;
 
                DelayAllUserInput = 20;
           }
            else if (GamepadConfigGetInput === 5)
            {
                GamepadBUTTONTWO = gamepadInput;
                
                GamepadConfigGetInput = 0;
                GamepadConfigPadIndex = -1;

                DelayAllUserInput = 20;
            }
        }
    }

//    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(20, 400, 240, 1, 1, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, .5, 255, 255, 255);

        if (FirstRunCheckAudio === false)  DrawTextOntoCanvas(25, "O P T I O N S:", 400, 26, "center", 255, 255, 0, 0, 0, 0, 1);
        else  DrawTextOntoCanvas(25, "O P T I O N S:", 400, 26, "center", 255, 255, 0, 0, 0, 0, 1);
        DrawTextOntoCanvas(25, "________________________________________________", 400, 30, "center", 255, 255, 0, 0, 0, 0, 1);

	    DrawAllGUIArrowSetImages();

        DrawTextOntoCanvas(20, "Music Volume:", 65, 85-15, "left", 255, 255, 255, 0, 0, 0, 1);
        if (MusicVolume === 0)  DrawTextOntoCanvas(20, "OFF", 800-65, 85-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (MusicVolume === .25)  DrawTextOntoCanvas(20, "25%", 800-65, 85-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (MusicVolume === .5)  DrawTextOntoCanvas(20, "50%", 800-65, 85-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (MusicVolume === .75)  DrawTextOntoCanvas(20, "75%", 800-65, 85-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (MusicVolume === 1)  DrawTextOntoCanvas(20, "100%", 800-65, 85-15, "right", 255, 255, 255, 0, 0, 0, 1);
	 
        DrawTextOntoCanvas(20, "Sound Effects Volume:", 65, 125-15, "left", 255, 255, 255, 0, 0, 0, 1);
        if (SoundVolume === 0)  DrawTextOntoCanvas(20, "OFF", 800-65, 125-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (SoundVolume === .25)  DrawTextOntoCanvas(20, "25%", 800-65, 125-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (SoundVolume === .5)  DrawTextOntoCanvas(20, "50%", 800-65, 125-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (SoundVolume === .75)  DrawTextOntoCanvas(20, "75%", 800-65, 125-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (SoundVolume === 1)  DrawTextOntoCanvas(20, "100%", 800-65, 125-15, "right", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(25, "________________________________________________", 400, 127, "center", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "Game Mode:", 65, 180-15, "left", 255, 255, 255, 0, 0, 0, 1);
        if (GameMode === 0)  DrawTextOntoCanvas(20, "Original Mode", 800-65, 180-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 1)  DrawTextOntoCanvas(20, "Time Attack 30 Mode", 800-65, 180-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 2)  DrawTextOntoCanvas(20, "Time Attack 60 Mode", 800-65, 180-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 3)  DrawTextOntoCanvas(20, "Time Attack 120 Mode", 800-65, 180-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 4)  DrawTextOntoCanvas(20, "Twenty Line Challenge Mode", 800-65, 180-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 5)  DrawTextOntoCanvas(20, "''Crisis+Mode''", 800-65, 180-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 6)  DrawTextOntoCanvas(20, "''Firefox'' Story Mode", 800-65, 180-15, "right", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "C.P.U. Players:", 65, 220-15, "left", 255, 255, 255, 0, 0, 0, 1);
        if (GameMode !== FirefoxStoryMode)
        {
            if (CPUPlayerEnabled === 0)  DrawTextOntoCanvas(20, "OFF", 800-65, 220-15, "right", 255, 255, 255, 0, 0, 0, 1);
            else if (CPUPlayerEnabled === 1)  DrawTextOntoCanvas(20, "Slow Speed", 800-65, 220-15, "right", 255, 255, 255, 0, 0, 0, 1);
            else if (CPUPlayerEnabled === 2)  DrawTextOntoCanvas(20, "Medium Speed", 800-65, 220-15, "right", 255, 255, 255, 0, 0, 0, 1);
            else if (CPUPlayerEnabled === 3)  DrawTextOntoCanvas(20, "Fast Speed", 800-65, 220-15, "right", 255, 255, 255, 0, 0, 0, 1);
            else if (CPUPlayerEnabled === 4)  DrawTextOntoCanvas(20, "Very Fast Speed", 800-65, 220-15, "right", 255, 255, 255, 0, 0, 0, 1);
        }
        else  DrawTextOntoCanvas(20, "Not Available (Change Game Mode)", 800-65, 220-15, "right", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "Display Drop Shadow:", 65, 260-15, "left", 255, 255, 255, 0, 0, 0, 1);
        if (DisplayDropShadow === 0)  DrawTextOntoCanvas(20, "OFF", 800-65, 260-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (DisplayDropShadow === 1)  DrawTextOntoCanvas(20, "ON", 800-65, 260-15, "right", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(25, "________________________________________________", 400, 262, "center", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "Pressing [UP] Action:", 65, 315-15, "left", 255, 255, 255, 0, 0, 0, 1);
        if (PressingUPAction === 0)  DrawTextOntoCanvas(20, "OFF", 800-65, 315-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (PressingUPAction === 1)  DrawTextOntoCanvas(20, "Quick Drop", 800-65, 315-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (PressingUPAction === 2)  DrawTextOntoCanvas(20, "Smart Rotate", 800-65, 315-15, "right", 255, 255, 255, 0, 0, 0, 1);
		else if (PressingUPAction === 3)  DrawTextOntoCanvas(20, "Drop & Drag", 800-65, 315-15, "right", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "[SpaceBar] Key Assignment:", 65, 355-15, "left", 255, 255, 255, 0, 0, 0, 1);
        if (KeyboardSpaceBarFunction === 0)  DrawTextOntoCanvas(20, "Pause Game", 800-65, 355-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (KeyboardSpaceBarFunction === 1)  DrawTextOntoCanvas(20, "Quick Drop / Pause = [P]", 800-65, 355-15, "right", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(25, "________________________________________________", 400, 357, "center", 255, 255, 255, 0, 0, 0, 1);

        if (Gamepads[0])
            DrawTextOntoCanvas(25, "U.S.B. Gamepad Detected - Press [c] To Configure!", 400, 390, "center", 255, 255, 255, 0, 0, 0, 1);
        else
            DrawTextOntoCanvas(25, "Press A Button On Connected U.S.B. Gamepad To Use!", 400, 390, "center", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(15, "(Mozilla\u00AE Firefox Or Google\u00AE Chrome Only)", 400, 415, "center", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(25, "________________________________________________", 400, 424, "center", 255, 255, 0, 0, 0, 0, 1);

        if (GamepadConfigPadIndex !== -1)
        {
            DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, .95, 255, 255, 255);

            DrawTextOntoCanvas(20, "''"+Gamepads[0].id+"''", 400, 80, "center", 255, 255, 255, 0, 0, 0, 1);

            if (GamepadConfigGetInput === 0)  DrawTextOntoCanvas(55, "Press [UP] Now!", 400, 250, "center", 255, 255, 255, 0, 0, 0, 1);
            else if (GamepadConfigGetInput === 1)  DrawTextOntoCanvas(55, "Press [RIGHT] Now!", 400, 250, "center", 255, 255, 255, 0, 0, 0, 1);
            else if (GamepadConfigGetInput === 2)  DrawTextOntoCanvas(55, "Press [DOWN] Now!", 400, 250, "center", 255, 255, 255, 0, 0, 0, 1);
            else if (GamepadConfigGetInput === 3)  DrawTextOntoCanvas(55, "Press [LEFT] Now!", 400, 250, "center", 255, 255, 255, 0, 0, 0, 1);
            else if (GamepadConfigGetInput === 4)  DrawTextOntoCanvas(55, "Press [BUTTON1] Now!", 400, 250, "center", 255, 255, 255, 0, 0, 0, 1);
            else if (GamepadConfigGetInput === 5)  DrawTextOntoCanvas(55, "Press [BUTTON2] Now!", 400, 250, "center", 255, 255, 255, 0, 0, 0, 1);
        
            DrawTextOntoCanvas(25, "Press [c] To Cancel And Use Default Mappings", 400, 435, "center", 255, 255, 255, 0, 0, 0, 1);
        }
    }
    
    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
	CursorIsArrow = true;
	
        GamepadConfigPadIndex = -1;
        GamepadConfigGetInput = 0;

        FirstRunCheckAudio = false;
        
        DestroyAllGUIArrowSets();
        DestroyAllButtons();
    }
}    

//--------------------------------------------------------------------------------------------------------------
function DisplayHowToPlayScreen()
{
    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        CreateGUIButton(6, 400, 455);
        
        CreateGUIArrowSet(0, 400, 79);
        
        ControlScheme = -1;        
        if (PressingUPAction !== Fall)
        {
            if (KeyboardSpaceBarFunction === 0 && PressingUPAction === Rotate)  ControlScheme = 1;
            else if (KeyboardSpaceBarFunction === 1 && PressingUPAction === Rotate) ControlScheme = 0;
        }
        else if (KeyboardSpaceBarFunction === 0)  ControlScheme = 2;
    }
    
    CursorIsArrow = MouseOnGUI() !== true;
        
    if (ThisArrowSetArrowWasPressed(0) === true)
    {
        if (ControlScheme > 0)  ControlScheme--;
        else  ControlScheme = 2;
        
        if (ControlScheme === 0)
        {
            KeyboardSpaceBarFunction = 1;
            PressingUPAction = Rotate;            
        }
        else if (ControlScheme === 1)
        {
            KeyboardSpaceBarFunction = 0;
            PressingUPAction = Rotate;            
        }
        else if (ControlScheme === 2)
        {
            KeyboardSpaceBarFunction = 0;
            PressingUPAction = Fall;            
        }
    }
    else if (ThisArrowSetArrowWasPressed(.5) === true)
    {
        if (ControlScheme < 2)  ControlScheme++;
        else  ControlScheme = 0;
        
        if (ControlScheme === 0)
        {
            KeyboardSpaceBarFunction = 1;
            PressingUPAction = Rotate;            
        }
        else if (ControlScheme === 1)
        {
            KeyboardSpaceBarFunction = 0;
            PressingUPAction = Rotate;            
        }
        else if (ControlScheme === 2)
        {
            KeyboardSpaceBarFunction = 0;
            PressingUPAction = Fall;            
        }
    }

    if (ThisButtonWasPressed(0) === true)
    {
        NextScreenToDisplay = 3;
        ScreenFadeStatus = 1;
    }     

    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(20, 400, 240, 1, 1, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, .5, 255, 255, 255);

        DrawTextOntoCanvas(25, "H O W   T O   P L A Y:", 400, 26, "center", 255, 255, 0, 0, 0, 0, 1);
        DrawTextOntoCanvas(25, "________________________________________________", 400, 30, "center", 255, 255, 0, 0, 0, 0, 1);

        DrawAllGUIArrowSetImages();

        if (ControlScheme === -1)  DrawTextOntoCanvas(20, "Custom Control", 400, 79-15, "center", 255, 255, 255, 0, 0, 0, 1);
        else if (ControlScheme === 0)  DrawTextOntoCanvas(20, "Original P.C. Control", 400, 79-15, "center", 255, 255, 255, 0, 0, 0, 1);
        else if (ControlScheme === 1)  DrawTextOntoCanvas(20, "New Control", 400, 79-15, "center", 255, 255, 255, 0, 0, 0, 1);
        else if (ControlScheme === 2)  DrawTextOntoCanvas(20, "JeZxLee's Preferred Control", 400, 79-15, "center", 255, 255, 255, 0, 0, 0, 1);

        let offsetY = 20;

        DrawSpriteOntoCanvas(29, 400, 220+offsetY, 1, 1, 0, 1, 255, 255, 255);

        DrawTextOntoCanvas(15, "Quit!", 53, 145+offsetY-20, "center", 255, 0, 0, 0, 0, 0, 1);
        DrawSpriteOntoCanvas(28, 53, 145+offsetY, 1, 1, 0, .5, 255, 255, 255);

        if (PressingUPAction === None)  DrawTextOntoCanvas(15, "OFF", 585, 286+offsetY-20, "center", 0, 255, 0, 0, 0, 0, 1);
        else if (PressingUPAction === Fall)  DrawTextOntoCanvas(15, "Quick Drop", 585, 286+offsetY-20, "center", 0, 255, 0, 0, 0, 0, 1);
        else if (PressingUPAction === Rotate)  DrawTextOntoCanvas(15, "Smart Rotate", 585, 286+offsetY-20, "center", 0, 255, 0, 0, 0, 0, 1);
        else if (PressingUPAction === DropAndDrag)  DrawTextOntoCanvas(15, "Drop & Drag", 585, 286+offsetY-20, "center", 0, 255, 0, 0, 0, 0, 1);
        DrawSpriteOntoCanvas(26, 585, 286+offsetY, 1, 1, 0, .5, 255, 255, 255);
        DrawSpriteOntoCanvas(26, 585, 286+offsetY+33, 1, 1, 0, .5, 255, 255, 255);
        DrawSpriteOntoCanvas(26, 585-32, 286+offsetY+33, 1, 1, 0, .5, 255, 255, 255);
        DrawSpriteOntoCanvas(26, 585+32, 286+offsetY+33, 1, 1, 0, .5, 255, 255, 255);

        DrawTextOntoCanvas(15, "Rotate", 124+16, 286+offsetY-20, "center", 0, 255, 0, 0, 0, 0, 1);
        DrawSpriteOntoCanvas(26, 124, 286+offsetY, 1, 1, 0, .5, 255, 255, 255);
        DrawSpriteOntoCanvas(26, 124+33, 286+offsetY, 1, 1, 0, .5, 255, 255, 255);

        if (KeyboardSpaceBarFunction === 1)
        {
            DrawTextOntoCanvas(25, "Quick Drop", 260, 333+offsetY, "center", 255, 255, 0, 0, 0, 0, 1);

            DrawTextOntoCanvas(15, "Pause", 395, 222+offsetY-20, "center", 255, 255, 0, 0, 0, 0, 1);
            DrawSpriteOntoCanvas(27, 395, 222+offsetY, 1, 1, 0, .5, 255, 255, 255);
        }
        else if (KeyboardSpaceBarFunction === 0)
        {
            DrawTextOntoCanvas(25, "P A U S E", 260, 333+offsetY, "center", 255, 255, 0, 0, 0, 0, 1);
        }

        DrawTextOntoCanvas(25, "________________________________________________", 400, 424, "center", 255, 255, 0, 0, 0, 0, 1);
    }

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        CursorIsArrow = true;

        DestroyAllGUIArrowSets();
        DestroyAllButtons();
    }
}

//--------------------------------------------------------------------------------------------------------------
function DisplayHighScoresScreen()
{
    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        CreateGUIArrowSet(0, 400, 85);

        CreateGUIButton(6, 400, 455);
    }
    
    CursorIsArrow = MouseOnGUI() !== true;
        
    if (ThisArrowSetArrowWasPressed(0) === true)
    {
        if (GameMode > 0)  GameMode--;
        else  GameMode = 6;
    }
    else if (ThisArrowSetArrowWasPressed(.5) === true)
    {
        if (GameMode < 6)  GameMode++;
        else  GameMode = 0;
    }

    if (KeyboardCharacterPressed === "C")
    {
        InitializeHighScores();
        DelayAllUserInput = 20;
        PlaySoundEffect(7);
        ScreenIsDirty = true;
    }
    
    if (ThisButtonWasPressed(0) === true)
    {
        NextScreenToDisplay = 3;
        ScreenFadeStatus = 1;
    }     
        
    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(20, 400, 240, 1, 1, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, .5, 255, 255, 255);

        DrawTextOntoCanvas(25, "H I G H   S C O R E S:", 400, 26, "center", 255, 255, 0, 0, 0, 0, 1);
        DrawTextOntoCanvas(25, "________________________________________________", 400, 30, "center", 255, 255, 0, 0, 0, 0, 1);

        DrawAllGUIArrowSetImages();

        if (GameMode === 0)  DrawTextOntoCanvas(20, "Original Mode", 400, 85-15, "center", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 1)  DrawTextOntoCanvas(20, "Time Attack 30 Mode", 400, 85-15, "center", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 2)  DrawTextOntoCanvas(20, "Time Attack 60 Mode", 400, 85-15, "center", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 3)  DrawTextOntoCanvas(20, "Time Attack 120 Mode", 400, 85-15, "center", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 4)  DrawTextOntoCanvas(20, "Twenty Line Challenge Mode", 400, 85-15, "center", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 5)  DrawTextOntoCanvas(20, "''Crisis+Mode''", 400, 85-15, "center", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 6)  DrawTextOntoCanvas(20, "''Firefox'' Story Mode", 400, 85-15, "center", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "NAME:", 36, 106, "left", 255, 255, 255, 0, 0, 0, 1);
        DrawTextOntoCanvas(20, "LEVEL:", 500, 106, "left", 255, 255, 255, 0, 0, 0, 1);
        DrawTextOntoCanvas(20, "SCORE:", 630, 106, "left", 255, 255, 255, 0, 0, 0, 1);

        let greenBlue = 255;
        let y = 130;
        for (let index = 1; index < 11; index++)
        {
            let indexAdjusted = index - 1;

            if ( Score[0] === parseInt(HighScoresScore[GameMode][indexAdjusted]) && Level[0] === parseInt(HighScoresLevel[GameMode][indexAdjusted]) )
            {
                greenBlue = 0;
            }
            else if ( Score[1] === parseInt(HighScoresScore[GameMode][indexAdjusted]) && Level[1] === parseInt(HighScoresLevel[GameMode][indexAdjusted]) )
            {
                greenBlue = 0;
            }
            else if ( Score[2] === parseInt(HighScoresScore[GameMode][indexAdjusted]) && Level[2] === parseInt(HighScoresLevel[GameMode][indexAdjusted]) )
            {
                greenBlue = 0;
            }
            else if ( Score[3] === parseInt(HighScoresScore[GameMode][indexAdjusted]) && Level[3] === parseInt(HighScoresLevel[GameMode][indexAdjusted]) )
            {
                greenBlue = 0;
            }
            else if ( Score[4] === parseInt(HighScoresScore[GameMode][indexAdjusted]) && Level[4] === parseInt(HighScoresLevel[GameMode][indexAdjusted]) )
            {
                greenBlue = 0;
            }
            else
            {
                greenBlue = 255;
            }

            DrawTextOntoCanvas(20, ""+index+".", 6, y, "left", 255, 255, 255, 0, 0, 0, 1);

            DrawTextOntoCanvas(20, HighScoresName[GameMode][indexAdjusted], 36, y, "left", 255, greenBlue, greenBlue, 0, 0, 0, 1);

            if (GameMode === CrisisMode && HighScoresLevel[GameMode][indexAdjusted] === 10)
        	    DrawTextOntoCanvas(20, "Won!", 500, y, "left", 255, greenBlue, greenBlue, 0, 0, 0, 1);
            else if (GameMode === FirefoxStoryMode && HighScoresLevel[GameMode][indexAdjusted] === 31)
                DrawTextOntoCanvas(20, "Won!", 500, y, "left", 255, greenBlue, greenBlue, 0, 0, 0, 1);
            else
        	    DrawTextOntoCanvas(20, ""+HighScoresLevel[GameMode][indexAdjusted]+"", 500, y, "left", 255, greenBlue, greenBlue, 0, 0, 0, 1);

            DrawTextOntoCanvas(20, ""+HighScoresScore[GameMode][indexAdjusted]+"", 630, y, "left", 255, greenBlue, greenBlue, 0, 0, 0, 1);

            y+=32;
        }

        DrawTextOntoCanvas(25, "________________________________________________", 400, 424, "center", 255, 255, 0, 0, 0, 0, 1);
    }

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        CursorIsArrow = true;

        DestroyAllGUIArrowSets();
        DestroyAllButtons();
    }
}

//--------------------------------------------------------------------------------------------------------------
function SetupStaffTextsScreenY()
{
let screenY = 450;

    for (let index = 0; index < (NumberOfPreloadedStaffTexts+1); index++)
    {
        PreloadStaffTextsAlpha[index] = 1;
        
        if (PreloadedStaffTextsBlue[index] === 0)
        {
            screenY+=(70+40);
            PreloadedStaffTextsScreenY[index] = screenY;
        }
        else if (PreloadedStaffTextsBlue[index] === 255)
        {
            screenY+=30;
            PreloadedStaffTextsScreenY[index] = screenY;
        }

        PreloadedStaffTextsScreenY[NumberOfPreloadedStaffTexts]+=240;
    }
}

//--------------------------------------------------------------------------------------------------------------
function DisplayAboutScreen()
{
let index;

    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
		SetupStaffTextsScreenY();
        
        FirefoxOneScreenX = 850;
        FirefoxOneScreenY = 770;
        FirefoxOneScale = 1;
        FirefoxTwoScreenX = 850+275;
        FirefoxTwoScreenY = 770+125;
        FirefoxTwoScale = 1;
        StaffFirefoxSceneTimer = 0;
    }

    if (StaffFirefoxSceneTimer === 0)
    {
        if (FirefoxOneScreenX > 330)
        {
            FirefoxOneScreenX-=15;
            FirefoxOneScreenY-=15; 
            FirefoxOneScale-=.02;

            FirefoxTwoScreenX-=15;
            FirefoxTwoScreenY-=15; 
            FirefoxTwoScale-=.005;
        }
        else  StaffFirefoxSceneTimer = 1;

    }
    else if (StaffFirefoxSceneTimer === 1)
    {
        for (index = 0; index < (NumberOfPreloadedStaffTexts+1); index++)
        {
            PreloadedStaffTextsScreenY[index]-=1.25;
        }
        
        if (PreloadedStaffTextsScreenY[NumberOfPreloadedStaffTexts] < -30 || JoystickButtonOne[Any] === true || MouseButtonClicked === true || KeyboardCharacterPressed === "_" || KeyboardCharacterPressed === "/")
        {
            for (index = 0; index < (NumberOfPreloadedStaffTexts+1); index++)
            {
                PreloadStaffTextsAlpha[index]-=0.01;
            }   
        }
    }
    else if (StaffFirefoxSceneTimer === 2)
    {
        if (FirefoxOneScale > .011)
        {
            FirefoxOneScreenX-=6;
            FirefoxOneScreenY-=6; 
            FirefoxOneScale-=.011;
        }
        else  FirefoxOneScale = 0;
        
        if (FirefoxTwoScale > .013)
        {
            FirefoxTwoScreenX-=7;
            FirefoxTwoScreenY-=5; 
            FirefoxTwoScale-=.013;
        }
        else
        {
            FirefoxTwoScale = 0;
            
            StaffFirefoxSceneTimer = 3;
            
            NextScreenToDisplay = 3;
            ScreenFadeStatus = 1;
        }
    }

    if (PreloadStaffTextsAlpha[0] < 1)
    {
        for (index = 0; index < (NumberOfPreloadedStaffTexts+1); index++)
        {
            PreloadStaffTextsAlpha[index]-=0.01;
        }
    }

    if (PreloadStaffTextsAlpha[0] < 0.05)  StaffFirefoxSceneTimer = 2;

//    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(20, 400, 240, 1, 1, 0, 1, 255, 255, 255);
    
        DrawSpriteOntoCanvas(40, FirefoxOneScreenX, FirefoxOneScreenY, FirefoxOneScale, FirefoxOneScale, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(40, FirefoxTwoScreenX, FirefoxTwoScreenY, FirefoxTwoScale, FirefoxTwoScale, 0, 1, 255, 255, 255);
        
        if (StaffFirefoxSceneTimer === 1)
        {
            DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, .5, 255, 255, 255);

            DrawPreloadedStaffTextOntoCanvas(0, 570, PreloadedStaffTextsScreenY[0]+50+40);
            for (index = 1; index < (NumberOfPreloadedStaffTexts+1); index++)  DrawPreloadedStaffTextOntoCanvas(index, 400, PreloadedStaffTextsScreenY[index]);
        }
    }

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        if (CrisisWon === true)
        {
            if (NewHighScoreRank < 10)  NextScreenToDisplay = 10;
            else  NextScreenToDisplay = 6;
        }

        CrisisWon = false;

	    CursorIsArrow = true;
    }
}

//--------------------------------------------------------------------------------------------------------------
function DisplayPlayingGameScreen()
{
let player;
let boxScreenX;
let boxScreenY;
let y;
let x;

    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        if (GameMode === CrisisMode)  PlayMusic(2);
        else  PlayMusic(1);
        
	    SetupForNewGame();
    }
    
    if (PAUSEgame === false && GameOverDisplayTimer === -1)  RunTetriGameEngine();
      
    if (KeyboardCharacterPressed === "_" && PlayerStatus[2] !== GameOver && KeyboardSpaceBarFunction === 0)
    {
        if (PAUSEgame === false)
        {
            PAUSEgame = true;
            MusicArray[CurrentlyPlayingMusicTrack].pause();
        }
        else
        {
            PAUSEgame = false;
            MusicArray[CurrentlyPlayingMusicTrack].play();
        }

        PlaySoundEffect(0);
    }
    else if (KeyboardCharacterPressed === "p" && PlayerStatus[2] !== GameOver && KeyboardSpaceBarFunction === 1)
    {
        if (PAUSEgame === false)
        {
            PAUSEgame = true;
            MusicArray[CurrentlyPlayingMusicTrack].pause();
        }
        else
        {
            PAUSEgame = false;
            MusicArray[CurrentlyPlayingMusicTrack].play();
        }

        PlaySoundEffect(0);
    }

    for (Player = 0; Player < NumberOfPlayers; Player++)
    {
        if (PlayerStatus[Player] !== FlashingCompletedLines && PlayerStatus[Player] !== ClearingCompletedLines)
        {
            DeletePieceFromPlayfieldMemory(Current);
            AddPieceToPlayfieldMemory(DropShadow);
            AddPieceToPlayfieldMemory(Current);
        }
    }

    ScreenIsDirty = true;
    if (ScreenIsDirty === true)
    {
        GameDisplayChanged = false;
        
        DrawSpriteOntoCanvas(20, 400, 240, 1, 1, 0, 1, 255, 255, 255);

        DrawSpriteOntoCanvas(50 , PlayersPlayfieldScreenX[0], PlayersPlayfieldScreenY[0], 1, 1, 0, 1, 100, 255, 255);
        DrawSpriteOntoCanvas(49 , PlayersPlayfieldScreenX[0], PlayersPlayfieldScreenY[0], 1, 1, 0, .75, 255, 255, 255);
        DrawSpriteOntoCanvas(50 , PlayersPlayfieldScreenX[1], PlayersPlayfieldScreenY[1], 1, 1, 0, 1, 100, 100, 255);
        DrawSpriteOntoCanvas(49 , PlayersPlayfieldScreenX[1], PlayersPlayfieldScreenY[1], 1, 1, 0, .75, 255, 255, 255);
        DrawSpriteOntoCanvas(50 , PlayersPlayfieldScreenX[2], PlayersPlayfieldScreenY[2], 1, 1, 0, 1, 255, 100, 255);
        DrawSpriteOntoCanvas(49 , PlayersPlayfieldScreenX[2], PlayersPlayfieldScreenY[2], 1, 1, 0, .75, 255, 255, 255);
        DrawSpriteOntoCanvas(50 , PlayersPlayfieldScreenX[3], PlayersPlayfieldScreenY[3], 1, 1, 0, 1, 255, 255, 100);
        DrawSpriteOntoCanvas(49 , PlayersPlayfieldScreenX[3], PlayersPlayfieldScreenY[3], 1, 1, 0, .75, 255, 255, 255);
        DrawSpriteOntoCanvas(50 , PlayersPlayfieldScreenX[4], PlayersPlayfieldScreenY[4], 1, 1, 0, 1, 100, 255, 100);
        DrawSpriteOntoCanvas(49 , PlayersPlayfieldScreenX[4], PlayersPlayfieldScreenY[4], 1, 1, 0, .75, 255, 255, 255);

        for (player = 0; player < NumberOfPlayers; player++)
        {
            DrawTextOntoCanvas(20, ""+Score[player]+"", PlayersPlayfieldScreenX[player], 25, "center", 255, 255, 255, 0, 0, 0, 0);
            DrawTextOntoCanvas(12, ""+Lines[player]+"", PlayersPlayfieldScreenX[player]-59, 75, "center", 255, 255, 255, 0, 0, 0, 0);
            DrawTextOntoCanvas(12, ""+Level[player]+"", PlayersPlayfieldScreenX[player]+59, 75, "center", 255, 255, 255, 0, 0, 0, 0);

            if (PlayerInput[player] === Keyboard)
                DrawTextOntoCanvas(20, "Keyboard", PlayersPlayfieldScreenX[player], 475, "center", 255, 255, 255, 0, 0, 0, 0);
            else if (PlayerInput[player] === Mouse)
                DrawTextOntoCanvas(20, "Mouse", PlayersPlayfieldScreenX[player], 475, "center", 255, 255, 255, 0, 0, 0, 0);
            else if (PlayerInput[player] === CPU)
                DrawTextOntoCanvas(20, "C.P.U.", PlayersPlayfieldScreenX[player], 475, "center", 255, 255, 255, 0, 0, 0, 0);
            else
                DrawTextOntoCanvas(20, "Gamepad", PlayersPlayfieldScreenX[player], 475, "center", 255, 255, 255, 0, 0, 0, 0);
            
            boxScreenX = PlayersPlayfieldScreenX[player]-59;
            boxScreenY = PlayersPlayfieldScreenY[player]-212;
            for (y = 0; y < 26; y++)
            {
                for (x = 2; x < 12; x++)
                {
                    if (Playfield[player][x][y] === 1)
                    {
                            DrawSpriteOntoCanvas(61, boxScreenX, boxScreenY, 1, 1, 0, .5, 255, 255, 255);
                    }
                    else if (Playfield[player][x][y] > 10 && Playfield[player][x][y] < 20)
                    {
                            DrawSpriteOntoCanvas(51+Playfield[player][x][y], boxScreenX, boxScreenY, 1, 1, 0, 1, 255, 255, 255);
                    }
                    else if (Playfield[player][x][y] > 20 && Playfield[player][x][y] < 30)
                    {
                            DrawSpriteOntoCanvas(61, boxScreenX, boxScreenY, 1, 1, 0, 1, 255, 255, 255);
                    }

                    boxScreenX+=13;
                }

                boxScreenX = PlayersPlayfieldScreenX[player]-59;
                boxScreenY+=18;
            }
            
            if (PlayerInput[player] === Mouse && PlayerStatus[player] === PieceFalling)
            {
                boxScreenX = PlayersPlayfieldScreenX[player]-59;
                boxScreenY = PlayersPlayfieldScreenY[player]-212;
                for (y = 0; y < 26; y++)
                {
                    for (x = 2; x < 12; x++)
                    {
                        let offsetX = 0;
                        let offsetY = 0;
                        for (let boxIndex = 1; boxIndex < 17; boxIndex++)
                        {
                            if ( PieceData [ Piece[player] ] [ PieceRotation[player] ] [boxIndex] === 1
                            && MouseMovePlayfieldX+offsetX === x && MouseMovePlayfieldY+offsetY === y )
                                if (MouseMovePlayfieldY >= PiecePlayfieldY[player])
                                    DrawSpriteOntoCanvas(61, boxScreenX, boxScreenY, 1, 1, 0, .5, 255, 255, 255);
                    
                            offsetX++;
                            if (offsetX > 3)
                            {
                                offsetX = 0;
                                offsetY++;
                            }
                        }

                        boxScreenX+=13;
                    }

                    boxScreenX = PlayersPlayfieldScreenX[player]-59;
                    boxScreenY+=18;
                }
            
                if ( (MouseMovePlayfieldY < PiecePlayfieldY[player]) || (PiecePlayfieldX[player] === MouseMovePlayfieldX && PiecePlayfieldY[player] === MouseMovePlayfieldY) )
                    DrawTextOntoCanvas(12, "Rotate", PieceMouseScreenX+13, PieceMouseScreenY-18, "center", 255, 255, 255, 0, 0, 0, 0);
                else
                    DrawTextOntoCanvas(12, "Move", PieceMouseScreenX+13, PieceMouseScreenY-18, "center", 255, 255, 255, 0, 0, 0, 0);
            }
        }

        if (GameMode === CrisisMode && Level[2] > 6)
        {
            for (player = 0; player < NumberOfPlayers; player++)
            {
                DrawSpriteOntoCanvas(80 , PlayersPlayfieldScreenX[player], PlayersPlayfieldScreenY[player], 1, 1, 0, .75, 255, 255, 255);
            }
        }

        for (player = 0; player < NumberOfPlayers; player++)
        {
            if (BlockAttackTransparency[player] > 0)  
                DrawSpriteOntoCanvas(70 , PlayersPlayfieldScreenX[player], PlayersPlayfieldScreenY[player], 1, 1, 0, BlockAttackTransparency[player], 255, 255, 255);
            
            if (GameMode === TimeAttack30Mode || GameMode === TimeAttack60Mode || GameMode === TimeAttack120Mode)
            {
                let taTimer = (TimeAttackTimer / 200);
                taTimer = Math.floor(taTimer);
                DrawTextOntoCanvas(12, ""+taTimer+"", PlayersPlayfieldScreenX[player], 454, "center", 255, 255, 255, 0, 0, 0, 1);
            }
            else if (GameMode === TwentyLineChallengeMode)
            {
                DrawTextOntoCanvas(12, ""+TwentyLineCounter[player]+"", PlayersPlayfieldScreenX[player], 454, "center", 255, 255, 255, 0, 0, 0, 1);
            }
        }

        let numberOfGamepads = 0;
        let gamepadUsed = new Array(5);
        for (let index = 0; index < 5; index++)
        {
            if (Gamepads[index])  numberOfGamepads++;
            
            gamepadUsed[index] = false;
        }
        if (PlayerInput[2] !== Keyboard)
        {
            numberOfGamepads--;
            gamepadUsed[ PlayerInput[2]-2 ] = true;
        }

        if (PlayerInput[0] !== CPU && PlayerInput[0] !== Mouse)
        {
            numberOfGamepads--;
            gamepadUsed[ PlayerInput[0]-2 ] = true;
        }
        if (PlayerInput[1] !== CPU && PlayerInput[1] !== Mouse)
        {
            numberOfGamepads--;
            gamepadUsed[ PlayerInput[1]-2 ] = true;
        }
        if (PlayerInput[3] !== CPU && PlayerInput[3] !== Mouse)
        {
            numberOfGamepads--;
            gamepadUsed[ PlayerInput[3]-2 ] = true;
        }
        if (PlayerInput[4] !== CPU && PlayerInput[4] !== Mouse)
        {
            numberOfGamepads--;
            gamepadUsed[ PlayerInput[4]-2 ] = true;
        }

        let mouseInputAvailable = true;

        for (player = 0; player < 5; player++)
        {
            if (PlayerStatus[player] === GameOver)
            {
                DrawSpriteOntoCanvas(49 , PlayersPlayfieldScreenX[player], PlayersPlayfieldScreenY[player], 1, 1, 0, .75, 255, 255, 255);

                if (PlayersCanJoin === true)
                {
                    if (numberOfGamepads > 0)
                    {
                        DrawTextOntoCanvas(25, "Gamepad", PlayersPlayfieldScreenX[player], 260-15, "center", 255, 255, 255, 0, 0, 0, 0);
                        DrawTextOntoCanvas(25, "Join In!", PlayersPlayfieldScreenX[player], 260+15, "center", 255, 255, 255, 0, 0, 0, 0);

                        for (let gamepadIndex = 0; gamepadIndex < 5; gamepadIndex++)
                        {
                            if (Gamepads[gamepadIndex] && JoystickButtonOne[gamepadIndex+2] === true && gamepadUsed[gamepadIndex] === false)
                            {
                                PlayerInput[player] = gamepadIndex+2;
                                PlayerStatus[player] = NewPieceDropping;
                                
                                gamepadIndex = 999;
                            }
                        }

                        numberOfGamepads--;
                    }
                    else if (mouseInputAvailable === true && MousePlaying === false)
                    {
                        DrawTextOntoCanvas(25, "Mouse", PlayersPlayfieldScreenX[player], 260-15, "center", 255, 255, 255, 0, 0, 0, 0);
                        DrawTextOntoCanvas(25, "Join In!", PlayersPlayfieldScreenX[player], 260+15, "center", 255, 255, 255, 0, 0, 0, 0);

                        mouseInputAvailable = false;
                        
                        if (  MouseY > ( (PlayersPlayfieldScreenY[player])-230 ) && MouseY < ( (PlayersPlayfieldScreenY[player])+230 )
                        && MouseX > ( (PlayersPlayfieldScreenX[player])-80 ) && MouseX < ( (PlayersPlayfieldScreenX[player])+80 )  )
                        {
                            if (MouseButtonClicked === true && MousePlaying === false)
                            {
                                PlayerInput[player] = Mouse;
                                PlayerStatus[player] = NewPieceDropping;

                                MousePlaying = true;
                            }
                        }
                    }
                }
                else  DrawTextOntoCanvas(25, "Game Over!", PlayersPlayfieldScreenX[player], 260, "center", 255, 255, 255, 0, 0, 0, 0);
            }
        }
            
        let humanStillPlaying = false;
        if (PlayerInput[0] !== CPU && PlayerStatus[0] !== GameOver)  humanStillPlaying = true;
        if (PlayerInput[1] !== CPU && PlayerStatus[1] !== GameOver)  humanStillPlaying = true;
        if (PlayerInput[2] !== CPU && PlayerStatus[2] !== GameOver)  humanStillPlaying = true;
        if (PlayerInput[3] !== CPU && PlayerStatus[3] !== GameOver)  humanStillPlaying = true;
        if (PlayerInput[4] !== CPU && PlayerStatus[4] !== GameOver)  humanStillPlaying = true;
        if (humanStillPlaying === false && CPUPlayerEnabled > 0)
        {
            DrawTextOntoCanvas(25, "Continue Watching Or Press [Esc] Key On Keyboard To Exit!", PlayersPlayfieldScreenX[2], 290, "center", 200, 200, 200, 0, 0, 0, 0);
            DrawTextOntoCanvas(25, "Continue Watching Or Press [Esc] Key On Keyboard To Exit!", PlayersPlayfieldScreenX[2], 296, "center", 150, 150, 150, 0, 0, 0, 0);
            DrawTextOntoCanvas(25, "Continue Watching Or Press [Esc] Key On Keyboard To Exit!", PlayersPlayfieldScreenX[2], 293, "center", 255, 255, 255, 0, 0, 0, 0);
        }
     
        if (PAUSEgame === true && DEBUG === false && KeyboardSpaceBarFunction === 0)
        {
            DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, .75, 255, 255, 255);
            
            DrawTextOntoCanvas(55, "P A U S E D", PlayersPlayfieldScreenX[2], 270, "center", 255, 255, 255, 0, 0, 0, 0);
            DrawTextOntoCanvas(25, "Press [SpaceBar] On Keyboard To Continue!", PlayersPlayfieldScreenX[2], 300, "center", 255, 255, 255, 0, 0, 0, 0);
        }
        else if (PAUSEgame === true && DEBUG === false && KeyboardSpaceBarFunction === 1)
        {
            DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, .75, 255, 255, 255);
            
            DrawTextOntoCanvas(55, "P A U S E D", PlayersPlayfieldScreenX[2], 270, "center", 255, 255, 255, 0, 0, 0, 0);
            DrawTextOntoCanvas(25, "Press [P] On Keyboard To Continue!", PlayersPlayfieldScreenX[2], 300, "center", 255, 255, 255, 0, 0, 0, 0);
        }
    }
    for (Player = 0; Player < NumberOfPlayers; Player++)
    {
        if (PlayerStatus[Player] !== FlashingCompletedLines && PlayerStatus[Player] !== ClearingCompletedLines)
        {
            DeletePieceFromPlayfieldMemory(Current);
            DeletePieceFromPlayfieldMemory(DropShadow);
        }
    }

    let allPlayersAreDead = true;
    for (player = 0; player < NumberOfPlayers; player++)
    {
        if (PlayerStatus[player] !== GameOver)  allPlayersAreDead = false;
    }
  
    if (allPlayersAreDead === true && GameOverDisplayTimer === -1)
    {
        GameOverDisplayTimer = 100;
    }
    else if (GameOverDisplayTimer > 1)
    {
        GameOverDisplayTimer--;
    }
    else if (GameOverDisplayTimer === 1)
    {
        ScreenFadeStatus = 1;
        GameOverDisplayTimer = 0;
    }
    
    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        ThinkRussianTimer = 0;
        
        PlayMusic(0);
        
        CheckForNewHighScores();
        
        if (CrisisWon === true)  { PlayMusic(5); NextScreenToDisplay = 7; }
        else if (NewHighScoreRank < 10)  NextScreenToDisplay = 10;
        else  NextScreenToDisplay = 6;        
    }
}

//--------------------------------------------------------------------------------------------------------------
function DisplayPlayingStoryGameScreen()
{
let player;

    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        SetupForNewGame();
        FirefoxStoryModeStarted = true;

        if (Level[0] < 25)  PlayMusic(3);
        else  PlayMusic(6);
    }
    
    if (PAUSEgame === false && GameOverDisplayTimer === -1)  RunTetriGameEngine();
      
    if (KeyboardCharacterPressed === "_" && PlayerStatus[0] !== GameOver && KeyboardSpaceBarFunction === 0)
    {
        if (PAUSEgame === false)
        {
            PAUSEgame = true;
            MusicArray[CurrentlyPlayingMusicTrack].pause();
        }
        else
        {
            PAUSEgame = false;
            MusicArray[CurrentlyPlayingMusicTrack].play();
        }

        PlaySoundEffect(0);
    }
    else if (KeyboardCharacterPressed === "p" && PlayerStatus[0] !== GameOver && KeyboardSpaceBarFunction === 1)
    {
        if (PAUSEgame === false)
        {
            PAUSEgame = true;
            MusicArray[CurrentlyPlayingMusicTrack].pause();
        }
        else
        {
            PAUSEgame = false;
            MusicArray[CurrentlyPlayingMusicTrack].play();
        }

        PlaySoundEffect(0);
    }

    for (Player = 0; Player < NumberOfPlayers; Player++)
    {
        if (PlayerStatus[Player] !== FlashingCompletedLines && PlayerStatus[Player] !== ClearingCompletedLines)
        {
            DeletePieceFromPlayfieldMemory(Current);
            AddPieceToPlayfieldMemory(DropShadow);
            AddPieceToPlayfieldMemory(Current);
        }
    }

    ScreenIsDirty = true;
    if (ScreenIsDirty === true)
    {
        GameDisplayChanged = false;
        
        DrawSpriteOntoCanvas(20, 400, 240, 1, 1, 0, 1, 255, 255, 255);

        DrawSpriteOntoCanvas(50 , PlayersPlayfieldScreenX[0], PlayersPlayfieldScreenY[0], 1, 1, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(49 , PlayersPlayfieldScreenX[0], PlayersPlayfieldScreenY[0], 1, 1, 0, .75, 255, 255, 255);

        DrawSpriteOntoCanvas(50 , PlayersPlayfieldScreenX[4], PlayersPlayfieldScreenY[4], 1, 1, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(49 , PlayersPlayfieldScreenX[4], PlayersPlayfieldScreenY[4], 1, 1, 0, .75, 255, 255, 255);

        DrawSpriteOntoCanvas(90 , PlayersPlayfieldScreenX[0]+180, 405, 1, 1, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(91 , PlayersPlayfieldScreenX[4]-180, 405, 1, 1, 0, 1, 255, 255, 255);

        for (player = 0; player < NumberOfPlayers; player+=4)
        {
            DrawTextOntoCanvas(20, ""+Score[player]+"", PlayersPlayfieldScreenX[player], 25, "center", 255, 255, 255, 0, 0, 0, 0);
            DrawTextOntoCanvas(12, ""+Lines[player]+"", PlayersPlayfieldScreenX[player]-59, 75, "center", 255, 255, 255, 0, 0, 0, 0);
            DrawTextOntoCanvas(12, ""+Level[player]+"", PlayersPlayfieldScreenX[player]+59, 75, "center", 255, 255, 255, 0, 0, 0, 0);

            if (PlayerInput[player] === Keyboard)
                DrawTextOntoCanvas(20, "Keyboard", PlayersPlayfieldScreenX[player], 475, "center", 255, 255, 255, 0, 0, 0, 0);
            else if (PlayerInput[player] === CPU)
                DrawTextOntoCanvas(20, "C.P.U.", PlayersPlayfieldScreenX[player], 475, "center", 255, 255, 255, 0, 0, 0, 0);
            else
                DrawTextOntoCanvas(20, "Gamepad", PlayersPlayfieldScreenX[player], 475, "center", 255, 255, 255, 0, 0, 0, 0);
            
            let boxScreenX = PlayersPlayfieldScreenX[player]-59;
            let boxScreenY = PlayersPlayfieldScreenY[player]-212;
            for (let y = 0; y < 26; y++)
            {
                for (let x = 2; x < 12; x++)
                {
                    if (Playfield[player][x][y] === 1)
                    {
                            DrawSpriteOntoCanvas(61, boxScreenX, boxScreenY, 1, 1, 0, .5, 255, 255, 255);
                    }
                    else if (Playfield[player][x][y] > 10 && Playfield[player][x][y] < 20)
                    {
                            DrawSpriteOntoCanvas(51+Playfield[player][x][y], boxScreenX, boxScreenY, 1, 1, 0, 1, 255, 255, 255);
                    }
                    else if (Playfield[player][x][y] > 20 && Playfield[player][x][y] < 30)
                    {
                            DrawSpriteOntoCanvas(61, boxScreenX, boxScreenY, 1, 1, 0, 1, 255, 255, 255);
                    }

                    boxScreenX+=13;
                }

                boxScreenX = PlayersPlayfieldScreenX[player]-59;
                boxScreenY+=18;
            }
        }

        for (player = 0; player < NumberOfPlayers; player+=4)
        {
            if (BlockAttackTransparency[player] > 0)  
                DrawSpriteOntoCanvas(70 , PlayersPlayfieldScreenX[player], PlayersPlayfieldScreenY[player], 1, 1, 0, BlockAttackTransparency[player], 255, 255, 255);
            
            if (GameMode === TimeAttack30Mode || GameMode === TimeAttack60Mode || GameMode === TimeAttack120Mode)
            {
                let taTimer = (TimeAttackTimer / 200);
                taTimer = Math.floor(taTimer);
                DrawTextOntoCanvas(12, ""+taTimer+"", PlayersPlayfieldScreenX[player], 454, "center", 255, 255, 255, 0, 0, 0, 1);
            }
            else if (GameMode === TwentyLineChallengeMode)
            {
                DrawTextOntoCanvas(12, ""+TwentyLineCounter[player]+"", PlayersPlayfieldScreenX[player], 454, "center", 255, 255, 255, 0, 0, 0, 1);
            }
        }

        for (player = 0; player < NumberOfPlayers; player+=4)
        {
            if (PlayerStatus[player] === GameOver)
            {
                
                DrawSpriteOntoCanvas(49 , PlayersPlayfieldScreenX[player], PlayersPlayfieldScreenY[player], 1, 1, 0, .75, 255, 255, 255);
                
                DrawTextOntoCanvas(25, "Game Over!", PlayersPlayfieldScreenX[player], 260, "center", 255, 255, 255, 0, 0, 0, 0);
            }
        }
        
        DrawTextOntoCanvas(12, ""+TwentyLineCounter[0]+"", PlayersPlayfieldScreenX[0], 454, "center", 255, 255, 255, 0, 0, 0, 1);
        
        if (PlayerStatus[0] === GameOver)
            if (GameOverDisplayTimer === -1)
                GameOverDisplayTimer = 100;
                 
        if (PAUSEgame === true && DEBUG === false && KeyboardSpaceBarFunction === 0)
        {
            DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, .75, 255, 255, 255);
            
            DrawTextOntoCanvas(55, "P A U S E D", PlayersPlayfieldScreenX[2], 270, "center", 255, 255, 255, 0, 0, 0, 0);
            DrawTextOntoCanvas(25, "Press [SpaceBar] On Keyboard To Continue!", PlayersPlayfieldScreenX[2], 300, "center", 255, 255, 255, 0, 0, 0, 0);
        }
        else if (PAUSEgame === true && DEBUG === false && KeyboardSpaceBarFunction === 1)
        {
            DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, .75, 255, 255, 255);
            
            DrawTextOntoCanvas(55, "P A U S E D", PlayersPlayfieldScreenX[2], 270, "center", 255, 255, 255, 0, 0, 0, 0);
            DrawTextOntoCanvas(25, "Press [P] On Keyboard To Continue!", PlayersPlayfieldScreenX[2], 300, "center", 255, 255, 255, 0, 0, 0, 0);
        }
    }
    for (Player = 0; Player < NumberOfPlayers; Player+=4)
    {
        if (PlayerStatus[Player] !== FlashingCompletedLines && PlayerStatus[Player] !== ClearingCompletedLines)
        {
            DeletePieceFromPlayfieldMemory(Current);
            DeletePieceFromPlayfieldMemory(DropShadow);
        }
    }

    let allPlayersAreDead = true;
    for (player = 0; player < NumberOfPlayers; player++)
    {
        if (PlayerStatus[player] !== GameOver)  allPlayersAreDead = false;
    }
  
    if (allPlayersAreDead === true && GameOverDisplayTimer === -1)
    {
        GameOverDisplayTimer = 100;
    }
    else if (GameOverDisplayTimer > 1)
    {
        GameOverDisplayTimer--;
    }
    else if (GameOverDisplayTimer === 1)
    {
        ScreenFadeStatus = 1;
        GameOverDisplayTimer = 0;
    }
       
    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        if (PlayerStatus[0] !== GameOver)
        {
            if (Level[0] === 5 || Level[0] === 10 || Level[0] === 15 || Level[0] === 20 || Level[0] === 25 || Level[0] === 30)
                NextScreenToDisplay = 11;
            
            if (Level[0] === 30)
            {
                PlayerStatus[0] = GameOver;
                PlayerStatus[4] = GameOver;
                
                Level[0] = 31;
                
                CrisisWon = true;
            }
        }
        else
        {
            Score[2] = Score[0];
            Level[2] = Level[0];
            Lines[2] = Lines[0];

            CheckForNewHighScores();
            if (NewHighScoreRank < 10)  NextScreenToDisplay = 10;
            else  NextScreenToDisplay = 6;        

            PlayMusic(0);
        }
    }
}

//--------------------------------------------------------------------------------------------------------------
function DisplayNewHighScoreNameInputScreen()
{
let screenX;
let index;

    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        CreateGUIButton(5, 400, 455);

        NewHighScoreNameIndex = 0;
        NewHighScoreTempName = "";
        
        NewHighScoreCharX = 1;
        NewHighScoreCharY = 0;

        HighScoreJoyCharIndex = 1;

        let screenXfix = 80;

	screenX = 80+screenXfix;
	for (index = 1; index < 14; index++) // A-M
	{
	    NewHighScoreCharButtonScreenX[index] = screenX;
	    NewHighScoreCharButtonScreenY[index] = 200;
	    
	    screenX+=40;
	}

	screenX = 80+screenXfix;
	for (index = 14; index < 27; index++) // N-Z
	{
	    NewHighScoreCharButtonScreenX[index] = screenX;
	    NewHighScoreCharButtonScreenY[index] = 240;
	    
	    screenX+=40;
	}

	screenX = 80+screenXfix;
	for (index = 27; index < 40; index++) // a-m
	{
	    NewHighScoreCharButtonScreenX[index] = screenX;
	    NewHighScoreCharButtonScreenY[index] = 280;
	    
	    screenX+=40;
	}

	screenX = 80+screenXfix;
	for (index = 40; index < 53; index++) // n-z
	{
	    NewHighScoreCharButtonScreenX[index] = screenX;
	    NewHighScoreCharButtonScreenY[index] = 320;
	    
	    screenX+=40;
	}

	screenX = 80+screenXfix;
	for (index = 53; index < 66; index++) // 0-9
	{
	    NewHighScoreCharButtonScreenX[index] = screenX;
	    NewHighScoreCharButtonScreenY[index] = 360;
	    
	    screenX+=40;
	}

	NewHighScoreCharButtonScreenX[index] = 400;
	NewHighScoreCharButtonScreenY[index] = 400;

	for (index = 0; index < 67; index++)
        {
            NewHighScoreCharButtonScale[index] = 1;
            NewHighScoreCharButtonGreenHue[index] = 255;
        }

        if (GameMode === FirefoxStoryMode)  HighScoreNameInputDevice = HighScoreUseKeyboardAndMouse;
        else
        {
            if (PlayerInput[PlayerWithHighestScore] === Keyboard)  HighScoreNameInputDevice = HighScoreUseKeyboard;
            else if (PlayerInput[PlayerWithHighestScore] === Mouse)  HighScoreNameInputDevice = HighScoreUseMouse;
            else
            {
                HighScoreNameInputDevice = -1;

                NewHighScoreCharButtonGreenHue[HighScoreJoyCharIndex] = 150;
            }
        }
    }

    CursorIsArrow = MouseOnGUI() !== true;

    if (PlayerInput[PlayerWithHighestScore] !== Keyboard && PlayerInput[PlayerWithHighestScore] !== Mouse)
    {
        if (JoystickDirection[ PlayerInput[PlayerWithHighestScore] ] === UP)
        {
            NewHighScoreCharButtonGreenHue[HighScoreJoyCharIndex] = 255;
            
            if (NewHighScoreCharY > 0) NewHighScoreCharY--;
            else  NewHighScoreCharY = 5;
                        
            PlaySoundEffect(1);
            
            DelayAllUserInput = 10;
            
            ScreenIsDirty = true;
        }
        else if (JoystickDirection[ PlayerInput[PlayerWithHighestScore] ] === DOWN)
        {
            NewHighScoreCharButtonGreenHue[HighScoreJoyCharIndex] = 255;
            
            if (NewHighScoreCharY < 5) NewHighScoreCharY++;
            else  NewHighScoreCharY = 0;
            
            PlaySoundEffect(1);
            
            DelayAllUserInput = 10;
            
            ScreenIsDirty = true;
        }
        else if (JoystickDirection[ PlayerInput[PlayerWithHighestScore] ] === LEFT)
        {
            NewHighScoreCharButtonGreenHue[HighScoreJoyCharIndex] = 255;
            
            if (NewHighScoreCharX > 1) NewHighScoreCharX--;
            else  NewHighScoreCharX = 13;
            
            PlaySoundEffect(1);
            
            DelayAllUserInput = 10;
            
            ScreenIsDirty = true;
        }
        else if (JoystickDirection[ PlayerInput[PlayerWithHighestScore] ] === RIGHT)
        {
            NewHighScoreCharButtonGreenHue[HighScoreJoyCharIndex] = 255;
            
            if (NewHighScoreCharX < 13) NewHighScoreCharX++;
            else  NewHighScoreCharX = 1;
            
            PlaySoundEffect(1);
            
            DelayAllUserInput = 10;
            
            ScreenIsDirty = true;
        }

        HighScoreJoyCharIndex = ( NewHighScoreCharX + (13 * NewHighScoreCharY) );
        
        if (NewHighScoreCharY === 5)  HighScoreJoyCharIndex = 66;
            
        NewHighScoreCharButtonGreenHue[HighScoreJoyCharIndex] = 150;
        
        
        if (JoystickButtonOne[ PlayerInput[PlayerWithHighestScore] ] === true)
        {
            NewHighScoreCharButtonScale[HighScoreJoyCharIndex] = 0.75;
                        
            PlaySoundEffect(1);
            
            DelayAllUserInput = 10;
            
            ScreenIsDirty = true;
        }
    }

    if (HighScoreNameInputDevice > HighScoreUseKeyboard)
    {
        for (index = 1; index < 67; index++)
        {
            if ( MouseY > (NewHighScoreCharButtonScreenY[index]-15)
            && MouseY < (NewHighScoreCharButtonScreenY[index]+15)
            && MouseX > (NewHighScoreCharButtonScreenX[index]-19)
            && MouseX < (NewHighScoreCharButtonScreenX[index]+19) )
            {
                CursorIsArrow = false;

                if (MouseButtonClicked === true)
                {
                    NewHighScoreCharButtonScale[index] = 0.75;

                    PlaySoundEffect(0);
                    ScreenIsDirty = true;
                }
            }
        }
    }

    for (index = 0; index < 67; index++)
    {
        if (NewHighScoreCharButtonScale[index] < 0.95)  NewHighScoreCharButtonScale[index]+=0.05;
        else if (NewHighScoreCharButtonScale[index] < 1)
        {
            if (index === 66)  ScreenFadeStatus = 1;
            else if (index === 65)
            {
            NewHighScoreTempName = NewHighScoreTempName.substring(0, NewHighScoreTempName.length - 1);
            if (NewHighScoreNameIndex > 0)  NewHighScoreNameIndex--;
            }

            if (index > 0 && index < 65 && NewHighScoreNameIndex < 13)
            {
                if (index > 0 && index < 27)  NewHighScoreTempName += String.fromCharCode(65+index-1);
                else if (index > 26 && index < 53)  NewHighScoreTempName += String.fromCharCode(97+index-26-1);
                else if (index > 52 && index < 63)  NewHighScoreTempName += String.fromCharCode(48+index-52-1);
                else if (index === 63)  NewHighScoreTempName += "+";
                else if (index === 64)  NewHighScoreTempName += " ";

                if (NewHighScoreNameIndex < 13)  NewHighScoreNameIndex++;
            }

            NewHighScoreCharButtonScale[index] = 1;

            ScreenIsDirty = true;
        }
    }

    if (HighScoreNameInputDevice === HighScoreUseKeyboard || HighScoreNameInputDevice === HighScoreUseKeyboardAndMouse)
    {
        if (KeyboardCharacterPressed !== "")
        {
            if (KeyboardCharacterPressed === "/")  ScreenFadeStatus = 1;
            else if (KeyboardCharacterPressed === "_")
            {
                NewHighScoreCharButtonScale[64] = 0.75;
            }
            else if (KeyboardCharacterPressed === "=")
            {
                NewHighScoreCharButtonScale[65] = 0.75;
            }

            for (index = 1; index < 66; index++)
            {
                if (KeyboardCharacterPressed === characters[index])  NewHighScoreCharButtonScale[index] = 0.75;
            }

            PlaySoundEffect(0);
            ScreenIsDirty = true;
        }
    }

    if (ThisButtonWasPressed(0) === true)
    {
        ScreenFadeStatus = 1;
    }     

    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(20, 400, 240, 1, 1, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, .5, 255, 255, 255);

        DrawTextOntoCanvas(25, "N E W   H I G H   S C O R E   N A M E   I N P U T:", 400, 26, "center", 255, 255, 0, 0, 0, 0, 1);
        DrawTextOntoCanvas(25, "________________________________________________", 400, 30, "center", 255, 255, 0, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "You achieved a new high score!", 400, 60, "center", 255, 255, 255, 0, 0, 0, 1);
        
        if (HighScoreNameInputDevice === HighScoreUseKeyboardAndMouse)
            DrawTextOntoCanvas(20, "Please enter your name using the mouse or keyboard:", 400, 85, "center", 255, 255, 255, 0, 0, 0, 1);
        else if (HighScoreNameInputDevice === HighScoreUseKeyboard)
            DrawTextOntoCanvas(20, "Please enter your name using the keyboard:", 400, 85, "center", 255, 255, 255, 0, 0, 0, 1);
        else if (HighScoreNameInputDevice === HighScoreUseMouse)
            DrawTextOntoCanvas(20, "Please enter your name using the mouse:", 400, 85, "center", 255, 255, 255, 0, 0, 0, 1);
        else
            DrawTextOntoCanvas(20, "Please enter your name using the gamepad:", 400, 85, "center", 255, 255, 255, 0, 0, 0, 1);

        if (NewHighScoreTempName[0] !== "")  DrawTextOntoCanvas(55, ""+NewHighScoreTempName+"", 400, 148, "center", 255, 255, 255, 0, 0, 0, 1);

        for (index = 1; index < 67; index++)
        {
            DrawSpriteOntoCanvas(100+index, NewHighScoreCharButtonScreenX[index], NewHighScoreCharButtonScreenY[index], NewHighScoreCharButtonScale[index], NewHighScoreCharButtonScale[index], 0, 1, 255, NewHighScoreCharButtonGreenHue[index], 255);
        }

        DrawTextOntoCanvas(25, "________________________________________________", 400, 424, "center", 255, 255, 0, 0, 0, 0, 1);
    }

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        if (NewHighScoreTempName === "")  NewHighScoreTempName = " ";

        HighScoresName[GameMode][NewHighScoreRank] = NewHighScoreTempName;

        DestroyAllButtons();

        CursorIsArrow = true;

        NextScreenToDisplay = 6;
    }
}

//--------------------------------------------------------------------------------------------------------------
function DisplayStoryVideo()
{
    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {        
        if (Level[0] === 0)
        {
            Level0Video = document.createElement("video");
            Level0Video.src = "data/videos/0.mp4";
        }
        else if (Level[0] === 5)
        {
            Level5Video = document.createElement("video");
            Level5Video.src = "data/videos/5.mp4";
        }
        else if (Level[0] === 10)
        {
            Level10Video = document.createElement("video");
            Level10Video.src = "data/videos/10.mp4";
        }
        else if (Level[0] === 15)
        {
            Level15Video = document.createElement("video");
            Level15Video.src = "data/videos/15.mp4";
        }
        else if (Level[0] === 20)
        {
            Level20Video = document.createElement("video");
            Level20Video.src = "data/videos/20.mp4";
        }
        else if (Level[0] === 25)
        {
            Level25Video = document.createElement("video");
            Level25Video.src = "data/videos/25.mp4";
        }
        else if (Level[0] === 31)
        {
            Level30Video = document.createElement("video");
            Level30Video.src = "data/videos/30.mp4";
        }
        
        if (Level[0] === 0) video = Level0Video;
        else if (Level[0] === 5)  video = Level5Video;
        else if (Level[0] === 10)  video = Level10Video;
        else if (Level[0] === 15)  video = Level15Video;
        else if (Level[0] === 20)  video = Level20Video;
        else if (Level[0] === 25)  video = Level25Video;
        else if (Level[0] === 31)  video = Level30Video;
        
        video.style.zIndex = "9999";
        video.style.position = "absolute";
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.left = "0px";
        video.style.top = "0px";

        document.body.appendChild(video);
        MusicArray[CurrentlyPlayingMusicTrack].pause();
        video.load();
        if (MusicVolume > 0 || SoundVolume > 0)  video.volume = 1;
        else  video.volume = 0.005;
        video.play();

        video.addEventListener("ended", function(){
            NextScreenToDisplay = 9;
            ScreenFadeStatus = 1;
            RemoveStoryVideo = true;
        });
        
        video.addEventListener("click", function(){
           video.pause();
           NextScreenToDisplay = 9;
           ScreenFadeStatus = 1;
           RemoveStoryVideo = true;
        });
    }

    if (JoystickButtonOne[Any] === true || MouseButtonClicked === true || KeyboardCharacterPressed === "_" || KeyboardCharacterPressed === "/")
    {
        video.pause();
        NextScreenToDisplay = 9;
        ScreenFadeStatus = 1;
        RemoveStoryVideo = true;
    }

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        if (Level[0] === 31)
        {
            PlayMusic(0);

            CheckForNewHighScores();

            if (CrisisWon === true)
            {
                PlayMusic(7);

                NextScreenToDisplay = 7;
            }
            else if (NewHighScoreRank < 10)  NextScreenToDisplay = 10;
            else  NextScreenToDisplay = 6;        
        }
    }
    
    if(RemoveStoryVideo === true){
    video.style.zIndex = "-9999";
    video.currentTime  = 0;
    RemoveStoryVideo = false;
    }
}

//--------------------------------------------------------------------------------------------------------------
function DisplayAITestScreen()
{
    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        if (GameMode === CrisisMode)  PlayMusic(2);
        else  PlayMusic(1);

        MusicVolume = 0.0;
        MusicArray[CurrentlyPlayingMusicTrack].volume = MusicVolume;
        SoundVolume = 0.0;

	    SetupForNewGameAITest();
    }
    
    if (PAUSEgame === false && GameOverDisplayTimer === -1)  RunTetriGameEngine();
      
    if (KeyboardCharacterPressed === "_" && PlayerStatus[2] !== GameOver && KeyboardSpaceBarFunction === 0)
    {
        if (PAUSEgame === false)
        {
            PAUSEgame = true;
            MusicArray[CurrentlyPlayingMusicTrack].pause();
        }
        else
        {
            PAUSEgame = false;
            MusicArray[CurrentlyPlayingMusicTrack].play();
        }

        PlaySoundEffect(0);
    }
    else if (KeyboardCharacterPressed === "p" && PlayerStatus[2] !== GameOver && KeyboardSpaceBarFunction === 1)
    {
        if (PAUSEgame === false)
        {
            PAUSEgame = true;
            MusicArray[CurrentlyPlayingMusicTrack].pause();
        }
        else
        {
            PAUSEgame = false;
            MusicArray[CurrentlyPlayingMusicTrack].play();
        }

        PlaySoundEffect(0);
    }

    for (Player = 0; Player < NumberOfPlayers; Player++)
    {
        if (PlayerStatus[Player] !== FlashingCompletedLines && PlayerStatus[Player] !== ClearingCompletedLines)
        {
            DeletePieceFromPlayfieldMemory(Current);
            AddPieceToPlayfieldMemory(DropShadow);
            AddPieceToPlayfieldMemory(Current);
        }
    }

    ScreenIsDirty = true;
    if (ScreenIsDirty === true)
    {
		ctx.clearRect(0, 0, screenWidth, screenHeight);

		GameDisplayChanged = false;
        
        DrawSpriteOntoCanvas(20, 400, 240, 1, 1, 0, 1, 255, 255, 255);

        DrawSpriteOntoCanvas(50 , PlayersPlayfieldScreenX[0], PlayersPlayfieldScreenY[0], 1, 1, 0, 1, 100, 255, 255);
        DrawSpriteOntoCanvas(49 , PlayersPlayfieldScreenX[0], PlayersPlayfieldScreenY[0], 1, 1, 0, .75, 255, 255, 255);
        DrawSpriteOntoCanvas(50 , PlayersPlayfieldScreenX[1], PlayersPlayfieldScreenY[1], 1, 1, 0, 1, 100, 100, 255);
        DrawSpriteOntoCanvas(49 , PlayersPlayfieldScreenX[1], PlayersPlayfieldScreenY[1], 1, 1, 0, .75, 255, 255, 255);
        DrawSpriteOntoCanvas(50 , PlayersPlayfieldScreenX[2], PlayersPlayfieldScreenY[2], 1, 1, 0, 1, 255, 100, 255);
        DrawSpriteOntoCanvas(49 , PlayersPlayfieldScreenX[2], PlayersPlayfieldScreenY[2], 1, 1, 0, .75, 255, 255, 255);
        DrawSpriteOntoCanvas(50 , PlayersPlayfieldScreenX[3], PlayersPlayfieldScreenY[3], 1, 1, 0, 1, 255, 255, 100);
        DrawSpriteOntoCanvas(49 , PlayersPlayfieldScreenX[3], PlayersPlayfieldScreenY[3], 1, 1, 0, .75, 255, 255, 255);
        DrawSpriteOntoCanvas(50 , PlayersPlayfieldScreenX[4], PlayersPlayfieldScreenY[4], 1, 1, 0, 1, 100, 255, 100);
        DrawSpriteOntoCanvas(49 , PlayersPlayfieldScreenX[4], PlayersPlayfieldScreenY[4], 1, 1, 0, .75, 255, 255, 255);

        for (player = 0; player < NumberOfPlayers; player++)
        {
            DrawTextOntoCanvas(20, ""+Score[player]+"", PlayersPlayfieldScreenX[player], 25, "center", 255, 255, 255, 0, 0, 0, 0);
            DrawTextOntoCanvas(12, ""+Lines[player]+"", PlayersPlayfieldScreenX[player]-59, 75, "center", 255, 255, 255, 0, 0, 0, 0);
            DrawTextOntoCanvas(12, ""+Level[player]+"", PlayersPlayfieldScreenX[player]+59, 75, "center", 255, 255, 255, 0, 0, 0, 0);

            if (PlayerInput[player] === Keyboard)
                DrawTextOntoCanvas(20, "Keyboard", PlayersPlayfieldScreenX[player], 475, "center", 255, 255, 255, 0, 0, 0, 0);
            else if (PlayerInput[player] === Mouse)
                DrawTextOntoCanvas(20, "Mouse", PlayersPlayfieldScreenX[player], 475, "center", 255, 255, 255, 0, 0, 0, 0);
            else if (PlayerInput[player] === CPU)
                DrawTextOntoCanvas(20, "C.P.U.", PlayersPlayfieldScreenX[player], 475, "center", 255, 255, 255, 0, 0, 0, 0);
            else
                DrawTextOntoCanvas(20, "Gamepad", PlayersPlayfieldScreenX[player], 475, "center", 255, 255, 255, 0, 0, 0, 0);
            
            boxScreenX = PlayersPlayfieldScreenX[player]-59;
            boxScreenY = PlayersPlayfieldScreenY[player]-212;
            for (y = 0; y < 26; y++)
            {
                for (x = 2; x < 12; x++)
                {
                    if (Playfield[player][x][y] === 1)
                    {
                            DrawSpriteOntoCanvas(61, boxScreenX, boxScreenY, 1, 1, 0, .5, 255, 255, 255);
                    }
                    else if (Playfield[player][x][y] > 10 && Playfield[player][x][y] < 20)
                    {
                            DrawSpriteOntoCanvas(51+Playfield[player][x][y], boxScreenX, boxScreenY, 1, 1, 0, 1, 255, 255, 255);
                    }
                    else if (Playfield[player][x][y] > 20 && Playfield[player][x][y] < 30)
                    {
                            DrawSpriteOntoCanvas(61, boxScreenX, boxScreenY, 1, 1, 0, 1, 255, 255, 255);
                    }

                    boxScreenX+=13;
                }

                boxScreenX = PlayersPlayfieldScreenX[player]-59;
                boxScreenY+=18;
            }
            
            if (PlayerInput[player] === Mouse && PlayerStatus[player] === PieceFalling)
            {
                boxScreenX = PlayersPlayfieldScreenX[player]-59;
                boxScreenY = PlayersPlayfieldScreenY[player]-212;
                for (y = 0; y < 26; y++)
                {
                    for (x = 2; x < 12; x++)
                    {
                        let offsetX = 0;
                        let offsetY = 0;
                        for (let boxIndex = 1; boxIndex < 17; boxIndex++)
                        {
                            if ( PieceData [ Piece[player] ] [ PieceRotation[player] ] [boxIndex] === 1
                            && MouseMovePlayfieldX+offsetX === x && MouseMovePlayfieldY+offsetY === y )
                                if (MouseMovePlayfieldY >= PiecePlayfieldY[player])
                                    DrawSpriteOntoCanvas(61, boxScreenX, boxScreenY, 1, 1, 0, .5, 255, 255, 255);
                    
                            offsetX++;
                            if (offsetX > 3)
                            {
                                offsetX = 0;
                                offsetY++;
                            }
                        }

                        boxScreenX+=13;
                    }

                    boxScreenX = PlayersPlayfieldScreenX[player]-59;
                    boxScreenY+=18;
                }
            
                if ( (MouseMovePlayfieldY < PiecePlayfieldY[player]) || (PiecePlayfieldX[player] === MouseMovePlayfieldX && PiecePlayfieldY[player] === MouseMovePlayfieldY) )
                    DrawTextOntoCanvas(12, "Rotate", PieceMouseScreenX+13, PieceMouseScreenY-18, "center", 255, 255, 255, 0, 0, 0, 0);
                else
                    DrawTextOntoCanvas(12, "Move", PieceMouseScreenX+13, PieceMouseScreenY-18, "center", 255, 255, 255, 0, 0, 0, 0);
            }
        }

        if (GameMode === CrisisMode && Level[2] > 6)
        {
            for (player = 0; player < NumberOfPlayers; player++)
            {
                DrawSpriteOntoCanvas(80 , PlayersPlayfieldScreenX[player], PlayersPlayfieldScreenY[player], 1, 1, 0, .75, 255, 255, 255);
            }
        }

        for (player = 0; player < NumberOfPlayers; player++)
        {
            if (BlockAttackTransparency[player] > 0)  
                DrawSpriteOntoCanvas(70 , PlayersPlayfieldScreenX[player], PlayersPlayfieldScreenY[player], 1, 1, 0, BlockAttackTransparency[player], 255, 255, 255);
            
            if (GameMode === TimeAttack30Mode || GameMode === TimeAttack60Mode || GameMode === TimeAttack120Mode)
            {
                let taTimer = (TimeAttackTimer / 200);
                taTimer = Math.floor(taTimer);
                DrawTextOntoCanvas(12, ""+taTimer+"", PlayersPlayfieldScreenX[player], 454, "center", 255, 255, 255, 0, 0, 0, 1);
            }
            else if (GameMode === TwentyLineChallengeMode)
            {
                DrawTextOntoCanvas(12, ""+TwentyLineCounter[player]+"", PlayersPlayfieldScreenX[player], 454, "center", 255, 255, 255, 0, 0, 0, 1);
            }
        }

        let numberOfGamepads = 0;
        let gamepadUsed = new Array(5);
        for (let index = 0; index < 5; index++)
        {
            if (Gamepads[index])  numberOfGamepads++;
            
            gamepadUsed[index] = false;
        }
        if (PlayerInput[2] !== Keyboard)
        {
            numberOfGamepads--;
            gamepadUsed[ PlayerInput[2]-2 ] = true;
        }

        if (PlayerInput[0] !== CPU && PlayerInput[0] !== Mouse)
        {
            numberOfGamepads--;
            gamepadUsed[ PlayerInput[0]-2 ] = true;
        }
        if (PlayerInput[1] !== CPU && PlayerInput[1] !== Mouse)
        {
            numberOfGamepads--;
            gamepadUsed[ PlayerInput[1]-2 ] = true;
        }
        if (PlayerInput[3] !== CPU && PlayerInput[3] !== Mouse)
        {
            numberOfGamepads--;
            gamepadUsed[ PlayerInput[3]-2 ] = true;
        }
        if (PlayerInput[4] !== CPU && PlayerInput[4] !== Mouse)
        {
            numberOfGamepads--;
            gamepadUsed[ PlayerInput[4]-2 ] = true;
        }

        let mouseInputAvailable = true;

        for (player = 0; player < 5; player++) {
            if (PlayerStatus[player] === GameOver) {
                DrawSpriteOntoCanvas(49, PlayersPlayfieldScreenX[player], PlayersPlayfieldScreenY[player], 1, 1, 0, .75, 255, 255, 255);

                if (PlayersCanJoin === true) {
                    if (numberOfGamepads > 0) {
                        DrawTextOntoCanvas(25, "Gamepad", PlayersPlayfieldScreenX[player], 260 - 15, "center", 255, 255, 255, 0, 0, 0, 0);
                        DrawTextOntoCanvas(25, "Join In!", PlayersPlayfieldScreenX[player], 260 + 15, "center", 255, 255, 255, 0, 0, 0, 0);

                        for (let gamepadIndex = 0; gamepadIndex < 5; gamepadIndex++) {
                            if (Gamepads[gamepadIndex] && JoystickButtonOne[gamepadIndex + 2] === true && gamepadUsed[gamepadIndex] === false) {
                                PlayerInput[player] = gamepadIndex + 2;
                                PlayerStatus[player] = NewPieceDropping;

                                gamepadIndex = 999;
                            }
                        }

                        numberOfGamepads--;
                    } else if (mouseInputAvailable === true && MousePlaying === false) {
                        DrawTextOntoCanvas(25, "Mouse", PlayersPlayfieldScreenX[player], 260 - 15, "center", 255, 255, 255, 0, 0, 0, 0);
                        DrawTextOntoCanvas(25, "Join In!", PlayersPlayfieldScreenX[player], 260 + 15, "center", 255, 255, 255, 0, 0, 0, 0);

                        mouseInputAvailable = false;

                        if (MouseY > ((PlayersPlayfieldScreenY[player]) - 230) && MouseY < ((PlayersPlayfieldScreenY[player]) + 230)
                            && MouseX > ((PlayersPlayfieldScreenX[player]) - 80) && MouseX < ((PlayersPlayfieldScreenX[player]) + 80)) {
                            if (MouseButtonClicked === true && MousePlaying === false) {
                                PlayerInput[player] = Mouse;
                                PlayerStatus[player] = NewPieceDropping;

                                MousePlaying = true;
                            }
                        }
                    }
                } else DrawTextOntoCanvas(25, "Game Over!", PlayersPlayfieldScreenX[player], 260, "center", 255, 255, 255, 0, 0, 0, 0);
            }
        }

        if (PAUSEgame === true && DEBUG === false && KeyboardSpaceBarFunction === 0)
        {
            DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, .75, 255, 255, 255);
            
            DrawTextOntoCanvas(55, "P A U S E D", PlayersPlayfieldScreenX[2], 270, "center", 255, 255, 255, 0, 0, 0, 0);
            DrawTextOntoCanvas(25, "Press [SpaceBar] On Keyboard To Continue!", PlayersPlayfieldScreenX[2], 300, "center", 255, 255, 255, 0, 0, 0, 0);
        }
        else if (PAUSEgame === true && DEBUG === false && KeyboardSpaceBarFunction === 1)
        {
            DrawSpriteOntoCanvas(0, 400, 240, 1, 1, 0, .75, 255, 255, 255);
            
            DrawTextOntoCanvas(55, "P A U S E D", PlayersPlayfieldScreenX[2], 270, "center", 255, 255, 255, 0, 0, 0, 0);
            DrawTextOntoCanvas(25, "Press [P] On Keyboard To Continue!", PlayersPlayfieldScreenX[2], 300, "center", 255, 255, 255, 0, 0, 0, 0);
        }
    }
 
	for (Player = 0; Player < NumberOfPlayers; Player++)
    {
        if (PlayerStatus[Player] !== FlashingCompletedLines && PlayerStatus[Player] !== ClearingCompletedLines)
        {
            DeletePieceFromPlayfieldMemory(Current);
            DeletePieceFromPlayfieldMemory(DropShadow);
        }
    }

    let allPlayersAreDead = true;
    for (player = 0; player < NumberOfPlayers; player++)
    {
        if (PlayerStatus[player] !== GameOver)  allPlayersAreDead = false;
    }
  
    if (allPlayersAreDead === true && GameOverDisplayTimer === -1)
    {
        GameOverDisplayTimer = 100;
    }
    else if (GameOverDisplayTimer > 1)
    {
        GameOverDisplayTimer--;
    }
    else if (GameOverDisplayTimer === 1)
    {
        ScreenFadeStatus = 1;
        GameOverDisplayTimer = 0;
    }

    for (let playerTemp = 0; playerTemp < NumberOfPlayers; playerTemp++)
    {
        if (PlayerStatus[playerTemp] === GameOver)  AITestSetupComputerPlayer(playerTemp);
    }

	let totalLines = (TotalOneLines+TotalTwoLines+TotalThreeLines+TotalFourLines)
	
	DrawTextOntoCanvas(30, "Total Games:"+NumberOfCPUGames+"", 400, 150, "center", 255, 255, 255, 0, 0, 0, 0);
	DrawTextOntoCanvas(30, "Total Lines:"+totalLines/*TotalCPUPlayerLines*/+"", 400, 150+30, "center", 255, 255, 255, 0, 0, 0, 0);
	DrawTextOntoCanvas(30, "Total Singles:"+TotalOneLines+"", 400, 150+(30*2), "center", 255, 255, 255, 0, 0, 0, 0);
	DrawTextOntoCanvas(30, "Total Doubles:"+TotalTwoLines+"", 400, 150+(30*3), "center", 255, 255, 255, 0, 0, 0, 0);
	DrawTextOntoCanvas(30, "Total Triples:"+TotalThreeLines+"", 400, 150+(30*4), "center", 255, 255, 255, 0, 0, 0, 0);
	DrawTextOntoCanvas(30, "Total Quadruples:"+TotalFourLines+"", 400, 150+(30*5), "center", 255, 255, 255, 0, 0, 0, 0);
	DrawTextOntoCanvas(45, "Average Lines:"+Math.floor(totalLines/NumberOfCPUGames)+"", 400, 150+(30*6)+50, "center", 255, 255, 255, 0, 0, 0, 0);

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        ThinkRussianTimer = 0;
        
        PlayMusic(0);

        if (CrisisWon === true)  { PlayMusic(5); NextScreenToDisplay = 7; }
        else if (NewHighScoreRank < 10)  NextScreenToDisplay = 10;
        else  NextScreenToDisplay = 6;

        CheckForNewHighScores();
    }
}
