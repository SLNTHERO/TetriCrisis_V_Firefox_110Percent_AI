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

// "input.js"...

let DelayAllUserInput = 0;

let MouseX = 0;
let MouseY = 0;
let MouseButtonClicked = false;
let MouseButtonDown = false;

let KeyboardCharacterPressed = " ";

let CENTER = 0;
let UP     = 1;
let RIGHT  = 2;
let DOWN   = 3;
let LEFT   = 4;
let JoystickDirection = new Array(8);
let JoystickButtonOne = new Array(8);
let JoystickButtonTwo = new Array(8);

let KeyboardSpaceBarFunction = 1;

let USBGamepadsSupported = false;
let Gamepads = new Array(10);

let FirstHumanPlayerInput;

let GamepadConfigPadIndex = -1;
let GamepadConfigGetInput = 0;

let GamepadAxisZero = 0;
let GamepadAxisOne = 1;

let GamepadButtonZero = 10;
let GamepadButtonOne = 11;

let GamepadUP;
let GamepadRIGHT;
let GamepadDOWN;
let GamepadLEFT;
let GamepadBUTTONONE;
let GamepadBUTTONTWO;

//--------------------------------------------------------------------------------------------------------------
function CheckForMouseButtonClick()
{
    if (DelayAllUserInput === 0)  MouseButtonClicked = true;
}

//--------------------------------------------------------------------------------------------------------------
function CheckForMouseButtonDown()
{
    MouseButtonDown = true;
}

//--------------------------------------------------------------------------------------------------------------
function CheckForMouseButtonUp()
{
    MouseButtonDown = false;
}

//--------------------------------------------------------------------------------------------------------------
function CheckForKeyPress(evt)
{
    if (DelayAllUserInput === 0)
    {
        if (String.fromCharCode(evt.keyCode) !== " ")  KeyboardCharacterPressed =  String.fromCharCode(evt.which || evt.keyCode);
	
        switch (evt.keyCode)
        {
            case 8:
            KeyboardCharacterPressed = "=";
            break;

            case 13:
            KeyboardCharacterPressed = "/";
            break;

            case 27:
            KeyboardCharacterPressed = "~";
            break;

            default:
            break;
        }
    }
}

//--------------------------------------------------------------------------------------------------------------
function CheckForKeyDown(evt)
{
    if (DelayAllUserInput === 0)
    {
	if (evt.keyCode === 8)  KeyboardCharacterPressed = "=";
	else if (evt.keyCode === 13)  KeyboardCharacterPressed = "/";
	else if (evt.keyCode === 27)  KeyboardCharacterPressed = "~";
	else if (evt.keyCode === 32)  KeyboardCharacterPressed = "_";
	
        if (evt.keyCode === 38)  JoystickDirection[Keyboard] = UP;
        else if (evt.keyCode === 39)  JoystickDirection[Keyboard] = RIGHT;
        else if (evt.keyCode === 40)  JoystickDirection[Keyboard] = DOWN;
        else if (evt.keyCode === 37)  JoystickDirection[Keyboard] = LEFT;

	if (evt.keyCode === 90)  JoystickButtonOne[Keyboard] = true;
	else if (evt.keyCode === 88)  JoystickButtonTwo[Keyboard] = true;
    }
}

//--------------------------------------------------------------------------------------------------------------
function CheckForKeyRelease(evt)
{
    if (evt.keyCode === 38)       JoystickDirection[Keyboard] = CENTER;
    else if (evt.keyCode === 39)  JoystickDirection[Keyboard] = CENTER;
    else if (evt.keyCode === 40)  JoystickDirection[Keyboard] = CENTER;
    else if (evt.keyCode === 37)  JoystickDirection[Keyboard] = CENTER;

    if (evt.keyCode === 90)  JoystickButtonOne[Keyboard] = false;
    else if (evt.keyCode === 88)  JoystickButtonTwo[Keyboard] = false;
}

//--------------------------------------------------------------------------------------------------------------
function CheckForGamepadInput()
{
let axis = new Array(6);
let button = new Array(21);
let axisIndex;
let buttonIndex;

    if (GamepadConfigPadIndex !== -1)  return;

    if (DelayAllUserInput > 0)  return;
    
    for (axisIndex = 0; axisIndex < 6; axisIndex++)  axis[axisIndex] = 0;
    for (buttonIndex = 0; buttonIndex < 21; buttonIndex++)  button[buttonIndex] = 0;

    for (axisIndex = 0; axisIndex < 6; axisIndex++)
    {
        if (Gamepads[0])
        {
            if (Gamepads[0].axes[axisIndex])
            {
                axis[axisIndex] = Gamepads[0].axes[axisIndex];
            }
        }
    }

    for (buttonIndex = 0; buttonIndex < 21; buttonIndex++)
    {
        if (Gamepads[0])
        {               
            if (Gamepads[0].buttons[buttonIndex])
            {
                button[buttonIndex] = Gamepads[0].buttons[buttonIndex].pressed;
            }
        }
    }

    JoystickDirection[2] = CENTER;
    for (axisIndex = 0; axisIndex < 6; axisIndex++)
    {
        if (GamepadUP === axisIndex)
        {
            if (axis[axisIndex] < -.5)  JoystickDirection[2] = UP;
        }

        if (GamepadDOWN === axisIndex)
        {
            if (axis[axisIndex] > .5)  JoystickDirection[2] = DOWN;
        }

        if (GamepadLEFT === axisIndex)
        {
            if (axis[axisIndex] < -.5)  JoystickDirection[2] = LEFT;
        }
        
        if (GamepadRIGHT === axisIndex)
        {
            if (axis[axisIndex] > .5)  JoystickDirection[2] = RIGHT;
        }
    }

    for (buttonIndex = 0; buttonIndex < 21; buttonIndex++)
    {
        if ( GamepadUP === (10+buttonIndex) )
        {
            if (button[buttonIndex] > .5)  JoystickDirection[2] = UP;
        }

        if ( GamepadDOWN === (10+buttonIndex) )
        {
            if (button[buttonIndex] > .5)  JoystickDirection[2] = DOWN;
        }

        if ( GamepadLEFT === (10+buttonIndex) )
        {
            if (button[buttonIndex] > .5)  JoystickDirection[2] = LEFT;
        }

        if ( GamepadRIGHT === (10+buttonIndex) )
        {
            if (button[buttonIndex] > .5)  JoystickDirection[2] = RIGHT;
        }
    }

    JoystickButtonOne[2] = false;
    JoystickButtonTwo[2] = false;
    for (buttonIndex = 0; buttonIndex < 21; buttonIndex++)
    {
        if ( GamepadBUTTONONE === (10+buttonIndex) )
        {
            if (button[buttonIndex] > .5)  JoystickButtonOne[2] = true;
        }
        if ( GamepadBUTTONTWO === (10+buttonIndex) )
        {
            if (button[buttonIndex] > .5)  JoystickButtonTwo[2] = true;
        }
    }
}

//--------------------------------------------------------------------------------------------------------------
function QueryGamepadsForInput()
{
let axisIndex;
let buttonIndex;

    if (DelayAllUserInput > 0)  return(-1);

    for (axisIndex = 0; axisIndex < 6; axisIndex++)
    {
        if (Gamepads[0])
        {
            if (Gamepads[0].axes[axisIndex])
            {
                if (Gamepads[0].axes[axisIndex] < -.5 || Gamepads[0].axes[axisIndex] > .5)
                    return(GamepadAxisZero+axisIndex);
            }
        }
    }

    for (buttonIndex = 0; buttonIndex < 21; buttonIndex++)
    {
        if (Gamepads[0])
        {               
            if (Gamepads[0].buttons[buttonIndex])
            {
                if (Gamepads[0].buttons[buttonIndex].pressed === true)
                    return(GamepadButtonZero+buttonIndex);
            }
        }
    }
    
    return(-1);
}
