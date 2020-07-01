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

// "interface.js"...

let NumberOfOnscreenButtons = 0;
let OriginalButtonSprite;
let ButtonsWithTextCanvases = [];
let ctxButtonsWithTextCanvases = [];

let GUIArrowsSprites = [];
let GUIButton = [];
let GUIButtonScreenX = [];
let GUIButtonScreenY = [];

let NumberOfOnscreenArrowSets = 0;
let GUISelectorLineSprite;
let ArrowSetSelectedByKeyboard = -1;
let ArrowSetArrowSelected = -1;
let GUIArrowSets = [];
let ArrowSetThatWasSelected = -1;
let ArrowSetSelectedAnimationTimer = -1;
let GUIArrowSetScreenX = [];
let GUIArrowSetScreenY = [];

let ButtonThatWasSelected = -1;
let ButtonSelectedAnimationTimer = -1;
let ButtonSelectedByKeyboard = 0;

let ButtonsWithCharsCanvases = [];
let ctxButtonsWithCharsCanvases = [];

//--------------------------------------------------------------------------------------------------------------
function CreateGUIArrowSet(index, x, y)
{
    GUIArrowSets[NumberOfOnscreenArrowSets] = index;

    GUIArrowSetScreenX[NumberOfOnscreenArrowSets] = x;
    GUIArrowSetScreenY[NumberOfOnscreenArrowSets] = y;

    NumberOfOnscreenArrowSets++;

    ArrowSetThatWasSelected = 0;
    ArrowSetArrowSelected = -1;
    ArrowSetSelectedAnimationTimer = -1;
    ArrowSetSelectedByKeyboard = 0;
}

//--------------------------------------------------------------------------------------------------------------
function DrawAllGUIArrowSetImages()
{
    var scaleOne = 1;
    var scaleTwo = 1;

    ctx.save();

    for (var index = 0; index < NumberOfOnscreenArrowSets; index++)
    {
        scaleOne = 1;
        scaleTwo = 1;

        var computedCenterX = GUISelectorLineSprite.width / 2 +.5;
        var computedCenterY = GUISelectorLineSprite.height / 2 + .5;

        var computedCenterXtwo = GUIArrowsSprites[0].width / 2 + .5;
        var computedCenterYtwo = GUIArrowsSprites[0].height / 2 + .5;

        var x = GUIArrowSetScreenX[index];
        var y = GUIArrowSetScreenY[index];

        y-=21;

        if (index === ArrowSetThatWasSelected && ArrowSetSelectedAnimationTimer > 5)
        {
            if (ArrowSetArrowSelected === ArrowSetThatWasSelected)  scaleOne = 0.8;
            else  scaleOne = 1;

            if (ArrowSetArrowSelected === ArrowSetThatWasSelected+0.5)  scaleTwo = 0.8;
            else  scaleTwo = 1;
        }

        ctx.globalAlpha = 0.75;

        if (index === ArrowSetThatWasSelected)
        {
            ctx.drawImage(  GUISelectorLineSprite, (x - ((computedCenterX)) ), (y - ((computedCenterY)) )
            , (GUISelectorLineSprite.width), (GUISelectorLineSprite.height)  );
        }

        ctx.globalAlpha = 1;

        if (ArrowButtonAnimation < 10 || scaleOne !== 1 || scaleTwo !== 1)
        {
            ctx.drawImage(  GUIArrowsSprites[0], ((x - (computedCenterXtwo * scaleOne)) - 375), ((y - (computedCenterYtwo * scaleOne)))
            , (GUIArrowsSprites[0].width * scaleOne), (GUIArrowsSprites[0].height * scaleOne)  );

            ctx.drawImage(  GUIArrowsSprites[1], ((x - (computedCenterXtwo * scaleTwo)) + 375), ((y - (computedCenterYtwo * scaleTwo)))
            , (GUIArrowsSprites[0].width * scaleTwo), (GUIArrowsSprites[0].height * scaleTwo)  );
        }
    }

    ctx.globalAlpha = 1;
    ctx.restore();
}

//--------------------------------------------------------------------------------------------------------------
function ThisArrowSetArrowWasPressed(index)
{
var returnValue = false;
   
    if (DelayAllUserInput === 0)
    {
	if (JoystickDirection[Any] === UP)
	{
	    if (ArrowSetThatWasSelected > 0)  ArrowSetThatWasSelected--;
	    else  ArrowSetThatWasSelected = (NumberOfOnscreenArrowSets-1);

	    ScreenIsDirty = true;

	    PlaySoundEffect(0);
	    DelayAllUserInput = 10;
	}
	else if (JoystickDirection[Any] === DOWN)
	{
	    if ( ArrowSetThatWasSelected < (NumberOfOnscreenArrowSets-1) )  ArrowSetThatWasSelected++;
	    else  ArrowSetThatWasSelected = 0;

	    ScreenIsDirty = true;

	    PlaySoundEffect(0);
	    DelayAllUserInput = 10;
	}

	if (JoystickDirection[Any] === LEFT && ArrowSetSelectedAnimationTimer === -1)
	{
	    ArrowSetArrowSelected = ArrowSetThatWasSelected;
	    ArrowSetSelectedAnimationTimer = 10;

	    ScreenIsDirty = true;

	    PlaySoundEffect(0);
	    DelayAllUserInput = 10;
	}
	else if (JoystickDirection[Any] === RIGHT && ArrowSetSelectedAnimationTimer === -1)
	{
	    ArrowSetArrowSelected = ArrowSetThatWasSelected+.5;
	    ArrowSetSelectedAnimationTimer = 10;

	    ScreenIsDirty = true;

	    PlaySoundEffect(0);
	    DelayAllUserInput = 10;
	}

	var x = GUIArrowSetScreenX[index];
	var y = GUIArrowSetScreenY[index];

	var arrowOneCenterX = (x - 375);
	var arrowOneCenterY = (y-23);
	var arrowTwoCenterX = (x + 375);
	var arrowTwoCenterY = (y-23);

	if (MouseButtonClicked === true && ArrowSetSelectedAnimationTimer === -1)
	{
	    if ( MouseX > (arrowOneCenterX - (46/2)) && MouseX < (arrowOneCenterX + (46/2))
	    && MouseY > (arrowOneCenterY - (38/2)) && MouseY < (arrowOneCenterY + (38/2)) )
	    {
		ArrowSetThatWasSelected = Math.floor(index);
		ArrowSetArrowSelected = ArrowSetThatWasSelected;
		ArrowSetSelectedAnimationTimer = 10;

		PlaySoundEffect(0);

		ScreenIsDirty = true;
		DelayAllUserInput = 10;
	    }
	    else if ( MouseX > (arrowTwoCenterX - (46/2)) && MouseX < (arrowTwoCenterX + (46/2))
	    && MouseY > (arrowTwoCenterY - (38/2)) && MouseY < (arrowTwoCenterY + (38/2)) )
	    {
		ArrowSetThatWasSelected = Math.floor(index);
		ArrowSetArrowSelected = ArrowSetThatWasSelected+.5;
		ArrowSetSelectedAnimationTimer = 10;

		PlaySoundEffect(0);

		ScreenIsDirty = true;
		DelayAllUserInput = 10;
	    }
	}
    }
	
    if (ArrowSetSelectedAnimationTimer > 0 && index === ArrowSetArrowSelected)  ArrowSetSelectedAnimationTimer--;
    else if (ArrowSetSelectedAnimationTimer === 0 && index === ArrowSetArrowSelected)
    {
        ArrowSetSelectedAnimationTimer = -1;
        returnValue = true;
        ScreenIsDirty = true;
    }

    return(returnValue);
}

//--------------------------------------------------------------------------------------------------------------
function DestroyAllGUIArrowSets()
{
    for (var index = 0; index < NumberOfOnscreenArrowSets; index++)
    {
	GUIArrowSets[index] = -1;

	GUIArrowSetScreenX[index] = -9999;
	GUIArrowSetScreenY[index] = -9999;
    }
	
    NumberOfOnscreenArrowSets = 0;

    ArrowSetThatWasSelected = 0;
    ArrowSetArrowSelected = -1;
    ArrowSetSelectedAnimationTimer = -1;
    ArrowSetSelectedByKeyboard = 0;
}

//--------------------------------------------------------------------------------------------------------------
function CreateGUIButtonsWithText()
{
var text;

    for (var index = 0; index < 7; index++)
    {
        ButtonsWithTextCanvases[index] = document.createElement("canvas");
        ButtonsWithTextCanvases[index].width = "251";
        ButtonsWithTextCanvases[index].height = "40";
        ctxButtonsWithTextCanvases[index] = ButtonsWithTextCanvases[index].getContext('2d');
    }

    for (var indexTwo = 0; indexTwo < 7; indexTwo++)
    {
        if (indexTwo === 0)  text = "START!";
        else if (indexTwo === 1)  text = "Options";
        else if (indexTwo === 2)  text = "How To Play";
        else if (indexTwo === 3)  text = "High Scores";
        else if (indexTwo === 4)  text = "About";
        else if (indexTwo === 5)  text = "Exit";
        else if (indexTwo === 6)  text = "Back";

        ctxButtonsWithTextCanvases[indexTwo].clearRect(0, 0, 251, 40);

        ctxButtonsWithTextCanvases[indexTwo].drawImage(OriginalButtonSprite, 0, 0, 251, 40);

        ctxButtonsWithTextCanvases[indexTwo].font = "25px HighlandGothicFLF";
        ctxButtonsWithTextCanvases[indexTwo].textAlign = "center";

        ctxButtonsWithTextCanvases[indexTwo].fillStyle = "rgba(200, 200, 200, 1)";
        for (var yOffSet = -1; yOffSet < 2; yOffSet+=2)
        {
            for (var xOffSet = -1; xOffSet < 2; xOffSet+=2)
            {
                ctxButtonsWithTextCanvases[indexTwo].fillText(text, 125+xOffSet, 29+yOffSet);
            }
        }

        ctxButtonsWithTextCanvases[indexTwo].fillStyle = "rgba(0, 0, 0, 1)";
        ctxButtonsWithTextCanvases[indexTwo].fillText(text, 125, 29);
    }

    for (var indexThree = 0; indexThree < 67; indexThree++)
    {
        ButtonsWithCharsCanvases[indexThree] = document.createElement("canvas");
        ButtonsWithCharsCanvases[indexThree].width = "39";
        ButtonsWithCharsCanvases[indexThree].height = "30";
        ctxButtonsWithCharsCanvases[indexThree] = ButtonsWithCharsCanvases[indexThree].getContext('2d');
        
        ImageSprites[indexThree+100] = document.createElement("canvas");
        ImageSprites[indexThree+100].width = "39";
        ImageSprites[indexThree+100].height = "30";
    }

    for (var indexFour = 1; indexFour < 67; indexFour++)
    {
        if      (indexFour ===  1)  text = "A";
        else if (indexFour ===  2)  text = "B";
        else if (indexFour ===  3)  text = "C";
        else if (indexFour ===  4)  text = "D";
        else if (indexFour ===  5)  text = "E";
        else if (indexFour ===  6)  text = "F";
        else if (indexFour ===  7)  text = "G";
        else if (indexFour ===  8)  text = "H";
        else if (indexFour ===  9)  text = "I";
        else if (indexFour === 10)  text = "J";
        else if (indexFour === 11)  text = "K";
        else if (indexFour === 12)  text = "L";
        else if (indexFour === 13)  text = "M";
        else if (indexFour === 14)  text = "N";
        else if (indexFour === 15)  text = "O";
        else if (indexFour === 16)  text = "P";
        else if (indexFour === 17)  text = "Q";
        else if (indexFour === 18)  text = "R";
        else if (indexFour === 19)  text = "S";
        else if (indexFour === 20)  text = "T";
        else if (indexFour === 21)  text = "U";
        else if (indexFour === 22)  text = "V";
        else if (indexFour === 23)  text = "W";
        else if (indexFour === 24)  text = "X";
        else if (indexFour === 25)  text = "Y";
        else if (indexFour === 26)  text = "Z";
        else if (indexFour === 27)  text = "a";
        else if (indexFour === 28)  text = "b";
        else if (indexFour === 29)  text = "c";
        else if (indexFour === 30)  text = "d";
        else if (indexFour === 31)  text = "e";
        else if (indexFour === 32)  text = "f";
        else if (indexFour === 33)  text = "g";
        else if (indexFour === 34)  text = "h";
        else if (indexFour === 35)  text = "i";
        else if (indexFour === 36)  text = "j";
        else if (indexFour === 37)  text = "k";
        else if (indexFour === 38)  text = "l";
        else if (indexFour === 39)  text = "m";
        else if (indexFour === 40)  text = "n";
        else if (indexFour === 41)  text = "o";
        else if (indexFour === 42)  text = "p";
        else if (indexFour === 43)  text = "q";
        else if (indexFour === 44)  text = "r";
        else if (indexFour === 45)  text = "s";
        else if (indexFour === 46)  text = "t";
        else if (indexFour === 47)  text = "u";
        else if (indexFour === 48)  text = "v";
        else if (indexFour === 49)  text = "w";
        else if (indexFour === 50)  text = "x";
        else if (indexFour === 51)  text = "y";
        else if (indexFour === 52)  text = "z";
        else if (indexFour === 53)  text = "0";
        else if (indexFour === 54)  text = "1";
        else if (indexFour === 55)  text = "2";
        else if (indexFour === 56)  text = "3";
        else if (indexFour === 57)  text = "4";
        else if (indexFour === 58)  text = "5";
        else if (indexFour === 59)  text = "6";
        else if (indexFour === 60)  text = "7";
        else if (indexFour === 61)  text = "8";
        else if (indexFour === 62)  text = "9";
        else if (indexFour === 63)  text = "+";
        else if (indexFour === 64)  text = "_";
        else if (indexFour === 65)  text = "<";
        else if (indexFour === 66)  text = "End";

        ctxButtonsWithCharsCanvases[indexFour].clearRect(0, 0, 251, 40);

        ctxButtonsWithCharsCanvases[indexFour].drawImage(ImageSprites[99], 0, 0, 39, 30);

        if (indexFour < 66)  ctxButtonsWithCharsCanvases[indexFour].font = "20px HighlandGothicFLF";
	    else  ctxButtonsWithCharsCanvases[indexFour].font = "13px HighlandGothicFLF";
	
        ctxButtonsWithCharsCanvases[indexFour].textAlign = "center";

        ctxButtonsWithCharsCanvases[indexFour].fillStyle = "rgba(200, 200, 200, 1)";
        for (var yOffSetTwo = -1; yOffSetTwo < 2; yOffSetTwo+=2)
        {
            for (var xOffSetTwo = -1; xOffSetTwo < 2; xOffSetTwo+=2)
            {
                ctxButtonsWithCharsCanvases[indexFour].fillText(text, 19+xOffSetTwo, 15+7+yOffSetTwo);
            }
        }

        ctxButtonsWithCharsCanvases[indexFour].fillStyle = "rgba(0, 0, 0, 1)";
        ctxButtonsWithCharsCanvases[indexFour].fillText(text, 19, 15+7);
    }   
}

//--------------------------------------------------------------------------------------------------------------
function CreateGUIButton(index, x, y)
{
    GUIButton[NumberOfOnscreenButtons] = index;

    GUIButtonScreenX[NumberOfOnscreenButtons] = x;
    GUIButtonScreenY[NumberOfOnscreenButtons] = y;

    NumberOfOnscreenButtons++;

    ButtonThatWasSelected = -1;
    ButtonSelectedAnimationTimer = -1;
    ButtonSelectedByKeyboard = 0;
}

//--------------------------------------------------------------------------------------------------------------
function DrawAllGUIButtonImages()
{
    var scale = 1;

    for (var index = 0; index < NumberOfOnscreenButtons; index++)
    {
        var computedCenterX = OriginalButtonSprite.width / 2;
        var computedCenterY = OriginalButtonSprite.height / 2;

        var x = GUIButtonScreenX[index];
        var y = GUIButtonScreenY[index];

        if (index === ButtonThatWasSelected && ButtonSelectedAnimationTimer > 5)
        {
            scale = 0.9;
        }
        else  scale = 1;

        ctx.drawImage(  ButtonsWithTextCanvases[GUIButton[index]], (x - ((computedCenterX) * scale) ), (y - ((computedCenterY) * scale) )
        , (OriginalButtonSprite.width * scale), (OriginalButtonSprite.height * scale)  );

	if (index === ButtonSelectedByKeyboard && ScreenToDisplay === 3)
        {
            ctx.drawImage(GUIArrowsSprites[0], x + 128, y - 20, GUIArrowsSprites[0].width, GUIArrowsSprites[0].height);
            ctx.drawImage(GUIArrowsSprites[1], x - 175, y - 20, GUIArrowsSprites[1].width, GUIArrowsSprites[1].height);
        }
    }
}

//--------------------------------------------------------------------------------------------------------------
function ThisButtonWasPressed(index)
{
    if (DelayAllUserInput === 0)
    {
	if (JoystickDirection[Any] === UP)
	{
	    if (ButtonSelectedByKeyboard < 1)  ButtonSelectedByKeyboard = (NumberOfOnscreenButtons-1);
	    else  ButtonSelectedByKeyboard--;

	    ScreenIsDirty = true;

	    PlaySoundEffect(0);
	    DelayAllUserInput = 10;
	}
	else if (JoystickDirection[Any] === DOWN)
	{
	    if ( ButtonSelectedByKeyboard > (NumberOfOnscreenButtons - 2) )  ButtonSelectedByKeyboard = 0;
	    else  ButtonSelectedByKeyboard++;

	    ScreenIsDirty = true;

	    PlaySoundEffect(0);
	    DelayAllUserInput = 10;
	}

	var returnValue = false;

	if ( (JoystickButtonOne[Any] === true || KeyboardCharacterPressed === "_" || KeyboardCharacterPressed === "/") && ScreenToDisplay != 10)
	{
	    ButtonThatWasSelected = ButtonSelectedByKeyboard;
	    ButtonSelectedAnimationTimer = 10;

	    ScreenIsDirty = true;
            
            if (JoystickButtonOne[2] === true)  FirstHumanPlayerInput = JoystickOne;
            else if (JoystickButtonOne[3] === true)  FirstHumanPlayerInput = JoystickTwo;
            else if (JoystickButtonOne[4] === true)  FirstHumanPlayerInput = JoystickThree;
            else if (JoystickButtonOne[5] === true)  FirstHumanPlayerInput = JoystickFour;
            else if (JoystickButtonOne[6] === true)  FirstHumanPlayerInput = JoystickFive;
            else  FirstHumanPlayerInput = Keyboard;

	    PlaySoundEffect(0);
	    DelayAllUserInput = 10;
	}

	if (MouseButtonClicked === true && ButtonSelectedAnimationTimer === -1)
	{
	    if ( MouseX > (GUIButtonScreenX[index] - 125) && MouseX < (GUIButtonScreenX[index] + 125)
	    && MouseY > (GUIButtonScreenY[index] - 20) &&  MouseY < (GUIButtonScreenY[index] + 20) )
	    {
		ButtonThatWasSelected = index;
		ButtonSelectedAnimationTimer = 10;
		ButtonSelectedByKeyboard = index;

		ScreenIsDirty = true;

                FirstHumanPlayerInput = Keyboard;

		PlaySoundEffect(0);
		DelayAllUserInput = 10;
	    }
	}
    }

    if (ButtonSelectedAnimationTimer > 0 && index === ButtonThatWasSelected)  ButtonSelectedAnimationTimer--;
    else if (ButtonSelectedAnimationTimer === 0 && index === ButtonThatWasSelected)
    {
        ButtonSelectedAnimationTimer = -1;
        ScreenIsDirty = true;
        returnValue = true;
    }

    return(returnValue);
}
//--------------------------------------------------------------------------------------------------------------
function DestroyAllButtons()
{
    for (var index = 0; index < NumberOfOnscreenButtons; index++)
    {
	GUIButton[index] = -1;

	GUIButtonScreenX[index] = -9999;
	GUIButtonScreenY[index] = -9999;
    }
	
    NumberOfOnscreenButtons = 0;

    ButtonThatWasSelected = -1;
    ButtonSelectedAnimationTimer = -1;
    ButtonSelectedByKeyboard = 0;
}

//--------------------------------------------------------------------------------------------------------------
function MouseOnGUI()
{
    for (var index = 0; index < NumberOfOnscreenArrowSets; index++)
    {
	var x = GUIArrowSetScreenX[index];
	var y = GUIArrowSetScreenY[index];

	var arrowOneCenterX = (x - 375);
	var arrowOneCenterY = (y-23);
	var arrowTwoCenterX = (x + 375);
	var arrowTwoCenterY = (y-23);

	if ( MouseX > (arrowOneCenterX - (46/2)) && MouseX < (arrowOneCenterX + (46/2))
	&& MouseY > (arrowOneCenterY - (38/2)) && MouseY < (arrowOneCenterY + (38/2)) )
	{
	    return(true);
	}
	else if ( MouseX > (arrowTwoCenterX - (46/2)) && MouseX < (arrowTwoCenterX + (46/2))
	&& MouseY > (arrowTwoCenterY - (38/2)) && MouseY < (arrowTwoCenterY + (38/2)) )
	{
	    return(true);
	}
    }

    for (var indexTwo = 0; indexTwo < NumberOfOnscreenButtons; indexTwo++)
    {
	if ( MouseX > (GUIButtonScreenX[indexTwo] - 125) && MouseX < (GUIButtonScreenX[indexTwo] + 125)
	&& MouseY > (GUIButtonScreenY[indexTwo] - 20) &&  MouseY < (GUIButtonScreenY[indexTwo] + 20) )
	{
	    return(true);
	}
    }
	
    return(false);
}
