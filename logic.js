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

// "logic.js"...

let index;
let indexTwo;

let ScoringDisplayNeedsUpdate = false;

let OriginalMode               = 0;
let TimeAttack30Mode           = 1;
let TimeAttack60Mode           = 2;
let TimeAttack120Mode          = 3;
let TwentyLineChallengeMode    = 4;
let CrisisMode                 = 5;
let FirefoxStoryMode           = 6;
let GameMode = OriginalMode;

let NewGameGarbageHeight = 0;

let CPUPlayerEnabled = 2;

let DisplayDropShadow = 1;
let None          = 0;
let Fall          = 1;
let Rotate        = 2;
let DropAndDrag   = 3;
let PressingUPAction = Rotate;

let Crisis7BGMPlayed;
let CrisisWon;

let GameWasJustPlayed = false;

let PieceData = new Array(8);
for (index = 0; index < 8; index++)
	PieceData[index] = new Array(5);
for (index = 0; index < 8; index++)
	for (indexTwo = 0; indexTwo < 5; indexTwo++)
		PieceData[index][indexTwo] = new Array(17);

let MaxRotationArray = new Array(8);

let NumberOfPlayers = 5;

let GameOver = -1;
let NewPieceDropping = 0;
let PieceFalling = 1;
let FlashingCompletedLines = 2;
let ClearingCompletedLines = 3;
let ClearingPlayfield = 4;
let PlayerStatus = new Array(NumberOfPlayers);

let Player = 0;

let PlayfieldStartX = new Array(NumberOfPlayers);
let PlayfieldEndX = new Array(NumberOfPlayers);

let Playfield = new Array(NumberOfPlayers);
for (index = 0; index < NumberOfPlayers; index++)
	Playfield[index] = new Array(15);
for (index = 0; index < NumberOfPlayers; index++)
	for (indexTwo = 0; indexTwo < 15; indexTwo++)
		Playfield[index][indexTwo] = new Array(26);

let PlayfieldBackup = new Array(NumberOfPlayers);
for (index = 0; index < NumberOfPlayers; index++)
	PlayfieldBackup[index] = new Array(15);
for (index = 0; index < NumberOfPlayers; index++)
	for (indexTwo = 0; indexTwo < 15; indexTwo++)
		PlayfieldBackup[index][indexTwo] = new Array(26);

	
let Piece = new Array(NumberOfPlayers);
let PieceDropStartHeight = new Array(8);

let PieceHistory = new Array(NumberOfPlayers);
for (index = 0; index < NumberOfPlayers; index++)
	PieceHistory[index] = new Array(4);

let PieceMovementDelay = new Array(NumberOfPlayers);
let PieceRotation = new Array(NumberOfPlayers);
let PiecePlayfieldX = new Array(NumberOfPlayers);
let PiecePlayfieldY = new Array(NumberOfPlayers);
let NextPiece = new Array(NumberOfPlayers);

let PlayersPlayfieldScreenX = new Array(NumberOfPlayers);
let PlayersPlayfieldScreenY = new Array(NumberOfPlayers);
let PieceDropTimer = new Array(NumberOfPlayers);
let TimeToDropPiece = new Array(NumberOfPlayers);
let PieceRotated1 = new Array(NumberOfPlayers);
let PieceRotated2 = new Array(NumberOfPlayers);

let MoveOneBlockCavernHoles = new Array(NumberOfPlayers);
for (index = 0; index < NumberOfPlayers; index++)
	MoveOneBlockCavernHoles[index] = new Array(15);
for (index = 0; index < NumberOfPlayers; index++)
	for (indexTwo = 0; indexTwo < 15; indexTwo++)
		MoveOneBlockCavernHoles[index][indexTwo] = new Array(5);

let MoveCompletedLines = new Array(NumberOfPlayers);
for (index = 0; index < NumberOfPlayers; index++)
	MoveCompletedLines[index] = new Array(15);
for (index = 0; index < NumberOfPlayers; index++)
	for (indexTwo = 0; indexTwo < 15; indexTwo++)
		MoveCompletedLines[index][indexTwo] = new Array(5);

let MovePieceHeight = new Array(NumberOfPlayers);
for (index = 0; index < NumberOfPlayers; index++)
	MovePieceHeight[index] = new Array(15);
for (index = 0; index < NumberOfPlayers; index++)
	for (indexTwo = 0; indexTwo < 15; indexTwo++)
		MovePieceHeight[index][indexTwo] = new Array(5);

let MovePlayfieldBoxEdges = new Array(NumberOfPlayers);
for (index = 0; index < NumberOfPlayers; index++)
	MovePlayfieldBoxEdges[index] = new Array(15);
for (index = 0; index < NumberOfPlayers; index++)
	for (indexTwo = 0; indexTwo < 15; indexTwo++)
		MovePlayfieldBoxEdges[index][indexTwo] = new Array(5);

let MoveTrappedHoles = new Array(NumberOfPlayers);
for (index = 0; index < NumberOfPlayers; index++)
	MoveTrappedHoles[index] = new Array(15);
for (index = 0; index < NumberOfPlayers; index++)
	for (indexTwo = 0; indexTwo < 15; indexTwo++)
		MoveTrappedHoles[index][indexTwo] = new Array(5);
	
let BestMoveX = new Array(NumberOfPlayers);
let BestRotation = new Array(NumberOfPlayers);
let MovedToBestMove = new Array(NumberOfPlayers);
let BestMoveCalculated = new Array(NumberOfPlayers);

let UPActionTaken = new Array(NumberOfPlayers);
let SpaceBarActionTaken = new Array(NumberOfPlayers);
let RotateDirection = new Array(NumberOfPlayers);

let FlashCompletedLinesTimer = new Array(NumberOfPlayers);
let ClearCompletedLinesTimer = new Array(NumberOfPlayers);

let AttackLines = new Array(NumberOfPlayers);
for (index = 0; index < NumberOfPlayers; index++)
	AttackLines[index] = new Array(10);
for (index = 0; index < NumberOfPlayers; index++)
	for (indexTwo = 0; indexTwo < 10; indexTwo++)
		AttackLines[index][indexTwo] = new Array(12);

let TwentyLineCounter = new Array(NumberOfPlayers);

let CPUFrame = new Array(NumberOfPlayers);

let Score = new Array(NumberOfPlayers);
let DropBonus  = new Array(NumberOfPlayers);
let Level  = new Array(NumberOfPlayers);
let Lines  = new Array(NumberOfPlayers);

let PsychoBackgroundRotationOne;
let PsychoBackgroundRotationTwo;
	
let CrisisModeOnePlayerLeftPlayfieldCleared;

let TotalCPUPlayerLines = 0;
let NumberOfCPUGames = 0;
let TotalOneLines = 0;
let TotalTwoLines = 0;
let TotalThreeLines = 0;
let TotalFourLines = 0;

let GameDisplayChanged;

let PlayersCanJoin;

let TimeAttackTimer;

let ThinkRussianTimer;

let CrisisModeTimer;

let BlockAttackTransparency = new Array(NumberOfPlayers);

let PAUSEgame;

let Keyboard        = 0;
let Mouse           = 1;
let JoystickOne     = 2;
let JoystickTwo     = 3;
let JoystickThree   = 4;
let JoystickFour    = 5;
let JoystickFive    = 6;
let Any             = 7;
let CPU             = 8;
let PlayerInput = new Array(NumberOfPlayers);

let CollisionNotTrue = 0;
let CollisionWithPlayfield = 1;

let Current = 0;
let Next = 1;
let DropShadow = 2;

let DelayAutoShift = 2;

let GameOverDisplayTimer = -1;

let FirefoxStoryModeStarted = false;

let PieceMouseScreenX;
let PieceMouseScreenY;
let MouseMovePlayfieldX;
let MouseMovePlayfieldY;

let MousePlaying = false;

//-------------------------------------------------------------------------------------------------
function SetupTetrisCore()
{
	for (let piece = 0; piece < 8; piece++)
		for (let rotation = 0; rotation < 5; rotation++)
			for (let box = 0; box < 17; box++)
				PieceData [piece] [rotation] [box] = 0;

	//RED "S Piece"...
	PieceData [1] [1] [10] = 1; // 01 02 03 04
	PieceData [1] [1] [11] = 1; // 05 06 07 08
	PieceData [1] [1] [13] = 1; // 09 [] [] 12
	PieceData [1] [1] [14] = 1; // [] [] 15 16

	PieceData [1] [2] [ 5] = 1;
	PieceData [1] [2] [ 9] = 1;
	PieceData [1] [2] [10] = 1;
	PieceData [1] [2] [14] = 1;

	PieceData [1] [3] [10] = 1;
	PieceData [1] [3] [11] = 1;
	PieceData [1] [3] [13] = 1;
	PieceData [1] [3] [14] = 1;

	PieceData [1] [4] [ 5] = 1;
	PieceData [1] [4] [ 9] = 1;
	PieceData [1] [4] [10] = 1;
	PieceData [1] [4] [14] = 1;

	//ORANGE "Z Piece"...
	PieceData [2] [1] [ 9] = 1;
	PieceData [2] [1] [10] = 1;
	PieceData [2] [1] [14] = 1;
	PieceData [2] [1] [15] = 1;

	PieceData [2] [2] [ 6] = 1;
	PieceData [2] [2] [ 9] = 1;
	PieceData [2] [2] [10] = 1;
	PieceData [2] [2] [13] = 1;

	PieceData [2] [3] [ 9] = 1;
	PieceData [2] [3] [10] = 1;
	PieceData [2] [3] [14] = 1;
	PieceData [2] [3] [15] = 1;

	PieceData [2] [4] [ 6] = 1;
	PieceData [2] [4] [ 9] = 1;
	PieceData [2] [4] [10] = 1;
	PieceData [2] [4] [13] = 1;

	//AQUA "T Piece"...
	PieceData [3] [1] [ 9] = 1;
	PieceData [3] [1] [10] = 1;
	PieceData [3] [1] [11] = 1;
	PieceData [3] [1] [14] = 1;

	PieceData [3] [2] [ 6] = 1;
	PieceData [3] [2] [ 9] = 1;
	PieceData [3] [2] [10] = 1;
	PieceData [3] [2] [14] = 1;

	PieceData [3] [3] [ 6] = 1;
	PieceData [3] [3] [ 9] = 1;
	PieceData [3] [3] [10] = 1;
	PieceData [3] [3] [11] = 1;

	PieceData [3] [4] [ 6] = 1;
	PieceData [3] [4] [10] = 1;
	PieceData [3] [4] [11] = 1;
	PieceData [3] [4] [14] = 1;

	//YELLOW "L Piece"...
	PieceData [4] [1] [ 9] = 1;
	PieceData [4] [1] [10] = 1;
	PieceData [4] [1] [11] = 1;
	PieceData [4] [1] [13] = 1;

	PieceData [4] [2] [ 5] = 1;
	PieceData [4] [2] [ 6] = 1;
	PieceData [4] [2] [10] = 1;
	PieceData [4] [2] [14] = 1;

	PieceData [4] [3] [ 7] = 1;
	PieceData [4] [3] [ 9] = 1;
	PieceData [4] [3] [10] = 1;
	PieceData [4] [3] [11] = 1;

	PieceData [4] [4] [ 6] = 1;
	PieceData [4] [4] [10] = 1;
	PieceData [4] [4] [14] = 1;
	PieceData [4] [4] [15] = 1;

	//GREEN "Backwards L Piece"...
	PieceData [5] [1] [ 9] = 1;
	PieceData [5] [1] [10] = 1;
	PieceData [5] [1] [11] = 1;
	PieceData [5] [1] [15] = 1;

	PieceData [5] [2] [ 6] = 1;
	PieceData [5] [2] [10] = 1;
	PieceData [5] [2] [13] = 1;
	PieceData [5] [2] [14] = 1;

	PieceData [5] [3] [ 5] = 1;
	PieceData [5] [3] [ 9] = 1;
	PieceData [5] [3] [10] = 1;
	PieceData [5] [3] [11] = 1;

	PieceData [5] [4] [ 6] = 1;
	PieceData [5] [4] [ 7] = 1;
	PieceData [5] [4] [10] = 1;
	PieceData [5] [4] [14] = 1;

	//BLUE "Box Piece"...
	PieceData [6] [1] [10] = 1;
	PieceData [6] [1] [11] = 1;
	PieceData [6] [1] [14] = 1;
	PieceData [6] [1] [15] = 1;

	PieceData [6] [2] [10] = 1;
	PieceData [6] [2] [11] = 1;
	PieceData [6] [2] [14] = 1;
	PieceData [6] [2] [15] = 1;

	PieceData [6] [3] [10] = 1;
	PieceData [6] [3] [11] = 1;
	PieceData [6] [3] [14] = 1;
	PieceData [6] [3] [15] = 1;

	PieceData [6] [4] [10] = 1;
	PieceData [6] [4] [11] = 1;
	PieceData [6] [4] [14] = 1;
	PieceData [6] [4] [15] = 1;

	//PURPLE "Line Piece"...
	PieceData [7] [1] [ 9] = 1;
	PieceData [7] [1] [10] = 1;
	PieceData [7] [1] [11] = 1;
	PieceData [7] [1] [12] = 1;

	PieceData [7] [2] [ 2] = 1;
	PieceData [7] [2] [ 6] = 1;
	PieceData [7] [2] [10] = 1;
	PieceData [7] [2] [14] = 1;

	PieceData [7] [3] [ 9] = 1;
	PieceData [7] [3] [10] = 1;
	PieceData [7] [3] [11] = 1;
	PieceData [7] [3] [12] = 1;

	PieceData [7] [4] [ 2] = 1;
	PieceData [7] [4] [ 6] = 1;
	PieceData [7] [4] [10] = 1;
	PieceData [7] [4] [14] = 1;
//-----------------------------------------------
	MaxRotationArray[0] = 0;
	MaxRotationArray[1] = 2;
	MaxRotationArray[2] = 2;
	MaxRotationArray[3] = 4;
	MaxRotationArray[4] = 4;
	MaxRotationArray[5] = 4;
	MaxRotationArray[6] = 1;
	MaxRotationArray[7] = 2;

	PieceDropStartHeight[0] = 0;
	PieceDropStartHeight[1] = 4;
	PieceDropStartHeight[2] = 4;
	PieceDropStartHeight[3] = 4;
	PieceDropStartHeight[4] = 4;
	PieceDropStartHeight[5] = 4;
	PieceDropStartHeight[6] = 3;
	PieceDropStartHeight[7] = 5;
}

//-------------------------------------------------------------------------------------------------
function ClearPlayfieldsWithCollisionDetection()
{
let x;
let y;

	for (let player = 0; player < NumberOfPlayers; player++)
	{
		for (y = 0; y < 26; y++)
			for (x = 0; x < 15; x++)
				Playfield[player][x][y] = 255; // Collision detection value

		for (y = 2; y < 5; y++)
			for (x = 5; x < 9; x++)
				Playfield[player][x][y] = 0;

		for (y = 5; y < 24; y++)
			for (x = 2; x < 12; x++)
				Playfield[player][x][y] = 0;
	}
}

//-------------------------------------------------------------------------------------------------
function GetRandomPiece()
{
	console.log(Player);
	
	let random = PieceHistory[Player][0];

	for (let index = 0; index < 3; index++)
	{
		PieceHistory[Player][index] = PieceHistory[Player][index+1];
	}

	let numberOfTries = 0;
	while ( (PieceHistory[Player][3] === PieceHistory[Player][0]
	      || PieceHistory[Player][3] === PieceHistory[Player][1]
	      || PieceHistory[Player][3] === PieceHistory[Player][2])
		  && (numberOfTries < 3) )
	{
		PieceHistory[Player][3] = Math.floor( (Math.random() * 7)+1 );
		numberOfTries++;
	}

	return(random);
}

//-------------------------------------------------------------------------------------------------
function PieceCollision()
{
let x, y;
let box = 1;
let returnValue = CollisionNotTrue;

    for (y = 0; y < 4; y++)
        for (x = 0; x < 4; x++)
        {
            if ( (Playfield[Player][ PiecePlayfieldX[Player] + x ][ PiecePlayfieldY[Player] + y ] > 1)
                &&(PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [box] > 0) )
                    returnValue = CollisionWithPlayfield;

            box++;
        }

    return(returnValue);
}

//-------------------------------------------------------------------------------------------------
function PieceCollisionDown()
{
let x, y;
let box = 1;
let returnValue = CollisionNotTrue;

    for (y = 1; y < 5; y++)
        for (x = 0; x < 4; x++)
        {
            if ( (Playfield[Player][ PiecePlayfieldX[Player] + x ][ PiecePlayfieldY[Player] + y ] > 1)
                &&(PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [box] > 0) )
                    returnValue = CollisionWithPlayfield;

            box++;
        }

    return(returnValue);
}

//-------------------------------------------------------------------------------------------------
function AddPieceToPlayfieldMemory(TempOrCurrentOrNextOrDropShadow)
{
	if ( (DisplayDropShadow === false)&&(TempOrCurrentOrNextOrDropShadow === DropShadow) )
		return;

        if (PlayerInput[Player] === Mouse && TempOrCurrentOrNextOrDropShadow === DropShadow)  return;

	let TEMP_Piece = Piece[Player];
	let TEMP_PieceRotation = PieceRotation[Player];
	let TEMP_PiecePlayfieldX = PiecePlayfieldX[Player];
	let TEMP_PiecePlayfieldY = PiecePlayfieldY[Player];

	let value = Piece[Player]+10;

	if (TempOrCurrentOrNextOrDropShadow === Next)
	{
		Piece[Player] = NextPiece[Player];
		value = NextPiece[Player]+10;
		PieceRotation[Player] = 1;

                PiecePlayfieldX[Player] = 5;

		PiecePlayfieldY[Player] = 0;
	}
	else if (TempOrCurrentOrNextOrDropShadow === DropShadow)
	{
		for (let y = PiecePlayfieldY[Player]; y < 23; y++)
		{
			PiecePlayfieldY[Player] = y;
			if (PieceCollision() !== CollisionNotTrue)
			{
				if (y - TEMP_PiecePlayfieldY > 4)
				{
					value = 1;
					PiecePlayfieldY[Player] = y-1;
					y = 100;
				}
				else
				{
					Piece[Player] = TEMP_Piece;
					PieceRotation[Player] = TEMP_PieceRotation;
					PiecePlayfieldX[Player] = TEMP_PiecePlayfieldX;
					PiecePlayfieldY[Player] = TEMP_PiecePlayfieldY;
					return;
				}
			}
		}
	}

	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 1] === 1)
	Playfield[Player][ PiecePlayfieldX[Player] ][ PiecePlayfieldY[Player] ] = value;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 2] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+1 ][ PiecePlayfieldY[Player] ] = value;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 3] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+2 ][ PiecePlayfieldY[Player] ] = value;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 4] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+3 ][ PiecePlayfieldY[Player] ] = value;

	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 5] === 1)
	Playfield[Player][ PiecePlayfieldX[Player] ][ PiecePlayfieldY[Player]+1 ] = value;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 6] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+1 ][ PiecePlayfieldY[Player]+1 ] = value;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 7] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+2 ][ PiecePlayfieldY[Player]+1 ] = value;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 8] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+3 ][ PiecePlayfieldY[Player]+1 ] = value;

	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 9] === 1)
	Playfield[Player][ PiecePlayfieldX[Player] ][ PiecePlayfieldY[Player]+2 ] = value;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [10] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+1 ][ PiecePlayfieldY[Player]+2 ] = value;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [11] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+2 ][ PiecePlayfieldY[Player]+2 ] = value;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [12] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+3 ][ PiecePlayfieldY[Player]+2 ] = value;

	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [13] === 1)
	Playfield[Player][ PiecePlayfieldX[Player] ][ PiecePlayfieldY[Player]+3 ] = value;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [14] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+1 ][ PiecePlayfieldY[Player]+3 ] = value;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [15] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+2 ][ PiecePlayfieldY[Player]+3 ] = value;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [16] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+3 ][ PiecePlayfieldY[Player]+3 ] = value;

	Piece[Player] = TEMP_Piece;
	PieceRotation[Player] = TEMP_PieceRotation;
	PiecePlayfieldX[Player] = TEMP_PiecePlayfieldX;
	PiecePlayfieldY[Player] = TEMP_PiecePlayfieldY;
}

//-------------------------------------------------------------------------------------------------
function DeletePieceFromPlayfieldMemory(CurrentOrDropShadow)
{
	if ( (DisplayDropShadow === false)&&(CurrentOrDropShadow === DropShadow) )
		return;

	if (PlayerStatus[Player] === FlashingCompletedLines || PlayerStatus[Player] === ClearingCompletedLines)
		return;

	let TEMP_Piece = Piece[Player];
	let TEMP_PieceRotation = PieceRotation[Player];
	let TEMP_PiecePlayfieldX = PiecePlayfieldX[Player];
	let TEMP_PiecePlayfieldY = PiecePlayfieldY[Player];

	if (CurrentOrDropShadow === DropShadow)
	{
		for (let y = PiecePlayfieldY[Player]; y < 23; y++)
		{
			PiecePlayfieldY[Player] = y;
			if (PieceCollision() !== CollisionNotTrue)
			{
				if (y - TEMP_PiecePlayfieldY > 4)
				{
					PiecePlayfieldY[Player] = y-1;
					y = 100;
				}
				else
				{
					Piece[Player] = TEMP_Piece;
					PieceRotation[Player] = TEMP_PieceRotation;
					PiecePlayfieldX[Player] = TEMP_PiecePlayfieldX;
					PiecePlayfieldY[Player] = TEMP_PiecePlayfieldY;
					return;
				}
			}
		}
	}

	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 1] === 1)
	Playfield[Player][ PiecePlayfieldX[Player] ][ PiecePlayfieldY[Player] ] = 0;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 2] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+1 ][ PiecePlayfieldY[Player] ] = 0;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 3] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+2 ][ PiecePlayfieldY[Player] ] = 0;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 4] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+3 ][ PiecePlayfieldY[Player] ] = 0;

	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 5] === 1)
	Playfield[Player][ PiecePlayfieldX[Player] ][ PiecePlayfieldY[Player]+1 ] = 0;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 6] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+1 ][ PiecePlayfieldY[Player]+1 ] = 0;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 7] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+2 ][ PiecePlayfieldY[Player]+1 ] = 0;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 8] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+3 ][ PiecePlayfieldY[Player]+1 ] = 0;

	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 9] === 1)
	Playfield[Player][ PiecePlayfieldX[Player] ][ PiecePlayfieldY[Player]+2 ] = 0;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [10] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+1 ][ PiecePlayfieldY[Player]+2 ] = 0;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [11] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+2 ][ PiecePlayfieldY[Player]+2 ] = 0;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [12] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+3 ][ PiecePlayfieldY[Player]+2 ] = 0;

	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [13] === 1)
	Playfield[Player][ PiecePlayfieldX[Player] ][ PiecePlayfieldY[Player]+3 ] = 0;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [14] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+1 ][ PiecePlayfieldY[Player]+3 ] = 0;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [15] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+2 ][ PiecePlayfieldY[Player]+3 ] = 0;
	if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [16] === 1)
	Playfield[Player][ PiecePlayfieldX[Player]+3 ][ PiecePlayfieldY[Player]+3 ] = 0;

	Piece[Player] = TEMP_Piece;
	PieceRotation[Player] = TEMP_PieceRotation;
	PiecePlayfieldX[Player] = TEMP_PiecePlayfieldX;
	PiecePlayfieldY[Player] = TEMP_PiecePlayfieldY;
}

//-------------------------------------------------------------------------------------------------
function SetupNewPiece()
{
	Piece[Player] = NextPiece[Player];
	PieceMovementDelay[Player] = 0;
	PieceRotation[Player] = 1;

        PiecePlayfieldX[Player] = 5;

	PiecePlayfieldY[Player] = 0;

	NextPiece[Player] = GetRandomPiece();

	PlayerStatus[Player] = NewPieceDropping;

	PieceDropTimer[Player] = 0;

	PieceRotated1[Player] = false;
	PieceRotated2[Player] = false;

	FlashCompletedLinesTimer[Player] = 0;
	ClearCompletedLinesTimer[Player] = 0;

	DropBonus[Player] = 0;

	for (let x = 0; x < 12; x++)
	{
		for (let rotation = 1; rotation < 5; rotation++)
		{
		    MoveOneBlockCavernHoles[Player][x][rotation] = 0;

		    MoveCompletedLines[Player][x][rotation] = 0;

		    MovePieceHeight[Player][x][rotation] = 0;
		
		    MovePlayfieldBoxEdges[Player][x][rotation] = 0;

		    MoveTrappedHoles[Player][x][rotation] = 0;		    
		}
	}

	BestMoveX[Player] = -1;
	BestRotation[Player] = -1;
	BestMoveCalculated[Player] = false;
	MovedToBestMove[Player] = false;

	ScoringDisplayNeedsUpdate = true;
	
	GameDisplayChanged = true;
}

//-------------------------------------------------------------------------------------------------
function CheckForCompletedLines()
{
let numberOfCompletedLines = 0;

	AddPieceToPlayfieldMemory(Current);

	for (let y = 5; y < 24; y++)
	{
		let boxTotal = 0;

		for (let x = 2; x < 12; x++)
		{
			if ( (Playfield[Player][x][y] > 9)&&(Playfield[Player][x][y] < 20) )
				boxTotal++;
		}

		if (boxTotal === 10)  numberOfCompletedLines++;
	}

	if (numberOfCompletedLines > 0)
	{
		if (numberOfCompletedLines === 1)
		{
			Score[Player] += (40 * (Level[Player]+1) );
			TotalOneLines++;
		}
		else if (numberOfCompletedLines === 2)
		{
			Score[Player] += (100 * (Level[Player]+1) );
			TotalTwoLines++;
		}
		else if (numberOfCompletedLines === 3)
		{
			Score[Player] += (300 * (Level[Player]+1) );
			TotalThreeLines++;
		}
		else if (numberOfCompletedLines === 4)
		{
			Score[Player] += (1200 * (Level[Player]+1) );
			TotalFourLines++;
			PlaySoundEffect(7);
		}

		PlayerStatus[Player] = FlashingCompletedLines;
		FlashCompletedLinesTimer[Player] = 1;
	}
	else  SetupNewPiece();
}

//-------------------------------------------------------------------------------------------------
function FirstPieceHasFallenCheck()
{
    if (Player !== 2)  return;
    
    if (PlayersCanJoin === true)
    {
        if (PlayerStatus[0] === GameOver && CPUPlayerEnabled > 0)
        {
            PlayerInput[0] = CPU;
            PlayerStatus[0] = NewPieceDropping;
        }

        if (PlayerStatus[1] === GameOver && CPUPlayerEnabled > 0)
        {
            PlayerInput[1] = CPU;
            PlayerStatus[1] = NewPieceDropping;
        }

        if (PlayerStatus[3] === GameOver && CPUPlayerEnabled > 0)
        {
            PlayerInput[3] = CPU;
            PlayerStatus[3] = NewPieceDropping;
        }

        if (PlayerStatus[4] === GameOver && CPUPlayerEnabled > 0)
        {
            PlayerInput[4] = CPU;
            PlayerStatus[4] = NewPieceDropping;
        }

        PlayersCanJoin = false;
    }
}

//-------------------------------------------------------------------------------------------------
function MovePieceDown(Force)
{       
        if (Force === false)
	{
		if (PlayerInput[Player] === CPU)
		{
			if (CPUPlayerEnabled === 1)
			{
				CPUFrame[Player]++;
				if (CPUFrame[Player] < 3)
				{
					return;
				}
				else  CPUFrame[Player] = 0;
			}
			else if (CPUPlayerEnabled === 2)
			{
				CPUFrame[Player]++;
				if (CPUFrame[Player] < 2)
				{
					return;
				}
				else  CPUFrame[Player] = 0;
			}
		}
	}

	DeletePieceFromPlayfieldMemory(Current);

	PiecePlayfieldY[Player]++;

	if (PieceCollision() === CollisionWithPlayfield)
	{
                FirstPieceHasFallenCheck();
            
		PiecePlayfieldY[Player]--;

		if (PlayerInput[Player] !== CPU)  PlaySoundEffect(3);
		
		Score[Player] += DropBonus[Player];

		DropBonus[Player] = 0;
		PieceDropTimer[Player] = 0;

		if (PlayerStatus[Player] === NewPieceDropping)
		{
			PlayerStatus[Player] = GameOver;
			PlaySoundEffect(11);
		}
		else  CheckForCompletedLines();
	}
	else
	{
		GameDisplayChanged = true;
	}
}

//-------------------------------------------------------------------------------------------------
function MovePieceDownFast()
{
	while (PieceCollision() === CollisionNotTrue)
	{
		PiecePlayfieldY[Player]++;
		DropBonus[Player]++;
	}

	if (PieceCollision() === CollisionWithPlayfield)
	{
                FirstPieceHasFallenCheck();
            
		PiecePlayfieldY[Player]--;

		if (PlayerInput[Player] !== CPU)  PlaySoundEffect(3);
		
		Score[Player] += DropBonus[Player];

		DropBonus[Player] = 0;
		PieceDropTimer[Player] = 0;

		if (PlayerStatus[Player] === NewPieceDropping)
		{
			PlayerStatus[Player] = GameOver;
			PlaySoundEffect(11);
		}
		else  CheckForCompletedLines();
	}
	else
	{
		GameDisplayChanged = true;
	}
}

//-------------------------------------------------------------------------------------------------
function MovePieceDownFastDropAndDrag()
{
    if (PieceCollisionDown() === true)
    {

    }
    else
    {
        while (PieceCollision() === CollisionNotTrue)
        {
                PiecePlayfieldY[Player]++;
                DropBonus[Player]++;
        }

        PiecePlayfieldY[Player]--;

        PieceDropTimer[Player] = 0;

        GameDisplayChanged = true;
    }
}

//-------------------------------------------------------------------------------------------------
function RotatePieceCounterClockwise()
{
	if (PieceRotation[Player] > 1)  PieceRotation[Player]--;
	else PieceRotation[Player] = 4;

	if (PieceCollision() === CollisionNotTrue)
	{
		if (PlayerInput[Player] !== CPU)  PlaySoundEffect(5);

		GameDisplayChanged = true;

		return true;
	}
	else
	{
		if (PieceRotation[Player] < 4)  PieceRotation[Player]++;
		else  PieceRotation[Player] = 1;

		if (RotateDirection[Player] === 0)  RotateDirection[Player] = 1;
		else  RotateDirection[Player] = 0;
	}

	return false;
}

//-------------------------------------------------------------------------------------------------
function RotatePieceClockwise()
{
	if (PieceRotation[Player] < 4)  PieceRotation[Player]++;
	else  PieceRotation[Player] = 1;

	if (PieceCollision() === CollisionNotTrue)
	{
		if (PlayerInput[Player] !== CPU)  PlaySoundEffect(5);

		GameDisplayChanged = true;

		return true;
	}
	else
	{
		if (PieceRotation[Player] > 1)  PieceRotation[Player]--;
		else  PieceRotation[Player] = 4;

		if (RotateDirection[Player] === 0)  RotateDirection[Player] = 1;
		else  RotateDirection[Player] = 0;
	}

	return false;
}

//-------------------------------------------------------------------------------------------------
function MovePieceLeft()
{
    if (DelayAutoShift === 0)
    {
		if (PieceMovementDelay[Player] > -15)  PieceMovementDelay[Player]--;
		if ( (PieceMovementDelay[Player] === -1)
		||(PieceMovementDelay[Player] === -5)
		||(PieceMovementDelay[Player] === -9)
		||(PieceMovementDelay[Player] < -14) )
		{
			PiecePlayfieldX[Player]--;

			if (PieceCollision() === CollisionNotTrue)
			{
				GameDisplayChanged = true;

				if (PlayerInput[Player] !== CPU)  PlaySoundEffect(2);
			}
			else
			{
				PiecePlayfieldX[Player]++;
			}
		}
	}
    else if (DelayAutoShift === 1)
    {
        if (PieceMovementDelay[Player] > -16)  PieceMovementDelay[Player]--;
        if ( (PieceMovementDelay[Player] === -1)
           ||(PieceMovementDelay[Player] < -15) )
        {
            PiecePlayfieldX[Player]--;

            if (PieceCollision() === CollisionNotTrue)
            {
                GameDisplayChanged = true;

                if (PlayerInput[Player] !== CPU)  PlaySoundEffect(2);
            }
            else
            {
                PiecePlayfieldX[Player]++;
            }
        }
    }
    else if (DelayAutoShift === 2)
    {
        if (PieceMovementDelay[Player] > -6)  PieceMovementDelay[Player]--;
        if ( (PieceMovementDelay[Player] === -1)
           ||(PieceMovementDelay[Player] < -5) )
        {
            PiecePlayfieldX[Player]--;

            if (PieceCollision() === CollisionNotTrue)
            {
                GameDisplayChanged = true;

                if (PlayerInput[Player] !== CPU)  PlaySoundEffect(2);
            }
            else
            {
                PiecePlayfieldX[Player]++;
            }
        }
    }
}

//-------------------------------------------------------------------------------------------------
function MovePieceRight()
{
    if (DelayAutoShift === 0)
    {
		if (PieceMovementDelay[Player] < 15)  PieceMovementDelay[Player]++;
		if ( (PieceMovementDelay[Player] === 1)
		||(PieceMovementDelay[Player] === 5)
		||(PieceMovementDelay[Player] === 9)
		||(PieceMovementDelay[Player] > 14) )
		{
			PiecePlayfieldX[Player]++;

			if (PieceCollision() === CollisionNotTrue)
			{
				GameDisplayChanged = true;
				
				if (PlayerInput[Player] !== CPU)  PlaySoundEffect(2);
			}
			else
			{
				PiecePlayfieldX[Player]--;
			}
		}
	}
    else if (DelayAutoShift === 1)
    {
        if (PieceMovementDelay[Player] < 16)  PieceMovementDelay[Player]++;
        if ( (PieceMovementDelay[Player] === 1)
           ||(PieceMovementDelay[Player] > 15) )
        {
            PiecePlayfieldX[Player]++;

            if (PieceCollision() === CollisionNotTrue)
            {
                GameDisplayChanged = true;

                if (PlayerInput[Player] !== CPU)  PlaySoundEffect(2);
            }
            else
            {
                PiecePlayfieldX[Player]--;
            }
        }
    }
    else if (DelayAutoShift === 2)
    {
        if (PieceMovementDelay[Player] < 6)  PieceMovementDelay[Player]++;
        if ( (PieceMovementDelay[Player] === 1)
           ||(PieceMovementDelay[Player] > 5) )
        {
            PiecePlayfieldX[Player]++;

            if (PieceCollision() === CollisionNotTrue)
            {
                GameDisplayChanged = true;

                if (PlayerInput[Player] !== CPU)  PlaySoundEffect(2);
            }
            else
            {
                PiecePlayfieldX[Player]--;
            }
        }
    }
}

//-------------------------------------------------------------------------------------------------
function SetupForNewGame()
{
let player;
let indexTwo;
let indexThree;
let x;
let y;

	PsychoBackgroundRotationOne = 0;
	PsychoBackgroundRotationTwo = 0;

	PlayersCanJoin = GameMode !== FirefoxStoryMode;
        
	GameWasJustPlayed = true;

	if (GameMode === CrisisMode)
	{
		PlaySoundEffect(9);
		MusicArray[CurrentlyPlayingMusicTrack].pause();
		ThinkRussianTimer = 380;
	}
	else  ThinkRussianTimer = 0;

	ClearPlayfieldsWithCollisionDetection();

	PlayersPlayfieldScreenX[0] = 80;
	PlayersPlayfieldScreenY[0] = 230;

	PlayersPlayfieldScreenX[1] = 240;
	PlayersPlayfieldScreenY[1] = 230;

	PlayersPlayfieldScreenX[2] = 400;
	PlayersPlayfieldScreenY[2] = 230;

	PlayersPlayfieldScreenX[3] = 560;
	PlayersPlayfieldScreenY[3] = 230;

	PlayersPlayfieldScreenX[4] = 560+160;
	PlayersPlayfieldScreenY[4] = 230;

	PiecePlayfieldX[0] = 5;
	PiecePlayfieldY[0] = 0;

	PiecePlayfieldX[1] = 5;
	PiecePlayfieldY[1] = 0;

	PiecePlayfieldX[2] = 5;
	PiecePlayfieldY[2] = 0;

	PiecePlayfieldX[3] = 5;
	PiecePlayfieldY[3] = 0;

	PiecePlayfieldX[4] = 5;
	PiecePlayfieldY[4] = 0;

	PlayfieldStartX[0] = 2;
	PlayfieldEndX[0] = 12;

	PlayfieldStartX[1] = 2;
	PlayfieldEndX[1] = 12;

	PlayfieldStartX[2] = 2;
	PlayfieldEndX[2] = 12;

	PlayfieldStartX[3] = 2;
	PlayfieldEndX[3] = 12;

	PlayfieldStartX[4] = 2;
	PlayfieldEndX[4] = 12;
	
	for (player = 0; player < NumberOfPlayers; player++)
	{
        Player = player;

        for (indexTwo = 0; indexTwo < 4; indexTwo++)
        {
            PieceHistory[player][indexTwo] = Math.floor( (Math.random() * 7)+1 );
        }

        for (indexTwo = 0; indexTwo < 4; indexTwo++)
        {
            for (indexThree = 0; indexThree < 4; indexThree++)
            {
                if (indexThree !== indexTwo)
                {
                    while (PieceHistory[player][indexTwo] === PieceHistory[player][indexThree])
                        PieceHistory[player][indexTwo] = Math.floor( (Math.random() * 7)+1 );
                }
            }
        }

        Piece[player] = GetRandomPiece();
		PieceMovementDelay[player] = 0;
		PieceRotation[player] = 1;

		Player = player;

		NextPiece[player] = GetRandomPiece();

		PlayerStatus[player] = NewPieceDropping;

		PieceRotated1[player] = false;
		PieceRotated2[player] = false;

		FlashCompletedLinesTimer[player] = 0;
		ClearCompletedLinesTimer[player] = 0;

        if (FirefoxStoryModeStarted === false)
        {
            Score[player] = 0;

            DropBonus[player] = 0;
            Level[player] = 0;

            Lines[player] = 0;

            PieceDropTimer[player] = 0;
            TimeToDropPiece[player] = 47;
        }
                
		for (y = 0; y < 12; y++)
			for (x = 0; x < 10; x++)
				AttackLines[player][x][y] = 0;

		if (GameMode === TwentyLineChallengeMode)  TwentyLineCounter[player] = 20;

		for (x = 0; x < 12; x++)
		{
			for (let rotation = 1; rotation < 5; rotation++)
			{
			    MoveOneBlockCavernHoles[Player][x][rotation] = 0;

			    MoveCompletedLines[Player][x][rotation] = 0;

			    MovePieceHeight[Player][x][rotation] = 0;
			
			    MovePlayfieldBoxEdges[Player][x][rotation] = 0;

			    MoveTrappedHoles[Player][x][rotation] = 0;		    
			}
		}

		BestMoveX[player] = -1;
		BestRotation[player] = -1;
		BestMoveCalculated[player] = false;
		MovedToBestMove[player] = false;

		CPUFrame[player] = 0;

		BlockAttackTransparency[player] = 0;
		
		UPActionTaken[player] = false;
		SpaceBarActionTaken[player] = false;
		RotateDirection[player] = 0;
	}

    if (GameMode !== FirefoxStoryMode)
    {
        PlayerInput[2] = FirstHumanPlayerInput;

        PlayerInput[0] = CPU;
        PlayerStatus[0] = GameOver;

        PlayerInput[1] = CPU;
        PlayerStatus[1] = GameOver;

        PlayerInput[3] = CPU;
        PlayerStatus[3] = GameOver;

        PlayerInput[4] = CPU;
        PlayerStatus[4] = GameOver;
    }
    else if (GameMode === FirefoxStoryMode)
    {
        PlayerInput[0] = FirstHumanPlayerInput;
        PlayerStatus[0] = NewPieceDropping;

        TwentyLineCounter[0] = 50;

        PlayerInput[1] = CPU;
        PlayerStatus[1] = GameOver;

        PlayerInput[2] = CPU;
        PlayerStatus[2] = GameOver;

        PlayerInput[3] = CPU;
        PlayerStatus[3] = GameOver;

        PlayerInput[4] = CPU;
        PlayerStatus[4] = NewPieceDropping;
    }

    if (DEBUG === true && GameMode === FirefoxStoryMode)
    {
        PlayerStatus[4] = GameOver;

        if (FirefoxStoryModeStarted === false)
        {
            Level[0] = 24;
            Lines[0] = 249;
        }
    }

	if (DEBUG === true && GameMode === OriginalMode)
	{
		Score[0] = 3652096;
		Level[0] = 256;
		Lines[0] = 2569;
		Score[1] = 3663807;
		Level[1] = 248;
		Lines[1] = 2486;
		Score[2] = 3647097;
		Level[2] = 267;
		Lines[2] = 2672;
		Score[3] = 3539964;
		Level[3] = 253;
		Lines[3] = 2537;
		Score[4] = 3361057;
		Level[4] = 262;
		Lines[4] = 2627;
	}
	
	Player = 0;

	PAUSEgame = false;
	
        GameOverDisplayTimer = -1;      
        
	if (GameMode === TimeAttack30Mode)  TimeAttackTimer = 6000;
	else if (GameMode === TimeAttack60Mode)  TimeAttackTimer = 12000;
	else if (GameMode === TimeAttack120Mode)  TimeAttackTimer = 24000;
	else  TimeAttackTimer = 0;

	CrisisModeTimer = 0;
	Crisis7BGMPlayed = false;

	CrisisWon = false;
	CrisisModeOnePlayerLeftPlayfieldCleared = false;

	GameDisplayChanged = true;

	if (NewGameGarbageHeight > 0)
	{
		for (player = 0; player < NumberOfPlayers; player++)
		{
			for (y = 23; y > 23-NewGameGarbageHeight; y--)
			{
				let boxTotal = 0;
				for (x = 2; x < 12; x++)
				{
					let box = Math.floor( Math.random() * 8 );
					if (box > 0)  boxTotal++;

					if (boxTotal < 10)
					{
						if (box !== 0)  Playfield[player][x][y] = box+10;
						else  Playfield[player][x][y] = 0;
					}
					else  Playfield[player][x][y] = 0;
				}
			}
		}
	}
        
        MousePlaying = false;
}

//-------------------------------------------------------------------------------------------------
function SetupForNewGameAITest()
{
let player;
let indexTwo;
let indexThree;
let x;
let y;
	
	Framerate = 60;

	GameMode = OriginalMode;

	PsychoBackgroundRotationOne = 0;
	PsychoBackgroundRotationTwo = 0;

	PlayersCanJoin = GameMode !== FirefoxStoryMode;
    
	PlayersCanJoin = false;
    
	GameWasJustPlayed = true;

	if (GameMode === CrisisMode)
	{
		PlaySoundEffect(9);
		MusicArray[CurrentlyPlayingMusicTrack].pause();
		ThinkRussianTimer = 380;
	}
	else  ThinkRussianTimer = 0;

	ClearPlayfieldsWithCollisionDetection();

	PlayersPlayfieldScreenX[0] = 80;
	PlayersPlayfieldScreenY[0] = 230;

	PlayersPlayfieldScreenX[1] = 240;
	PlayersPlayfieldScreenY[1] = 230;

	PlayersPlayfieldScreenX[2] = 400;
	PlayersPlayfieldScreenY[2] = 230;

	PlayersPlayfieldScreenX[3] = 560;
	PlayersPlayfieldScreenY[3] = 230;

	PlayersPlayfieldScreenX[4] = 560+160;
	PlayersPlayfieldScreenY[4] = 230;

	PiecePlayfieldX[0] = 5;
	PiecePlayfieldY[0] = 0;

	PiecePlayfieldX[1] = 5;
	PiecePlayfieldY[1] = 0;

	PiecePlayfieldX[2] = 5;
	PiecePlayfieldY[2] = 0;

	PiecePlayfieldX[3] = 5;
	PiecePlayfieldY[3] = 0;

	PiecePlayfieldX[4] = 5;
	PiecePlayfieldY[4] = 0;

	PlayfieldStartX[0] = 2;
	PlayfieldEndX[0] = 12;

	PlayfieldStartX[1] = 2;
	PlayfieldEndX[1] = 12;

	PlayfieldStartX[2] = 2;
	PlayfieldEndX[2] = 12;

	PlayfieldStartX[3] = 2;
	PlayfieldEndX[3] = 12;

	PlayfieldStartX[4] = 2;
	PlayfieldEndX[4] = 12;
	
	for (player = 0; player < NumberOfPlayers; player++)
	{
        Player = player;

        for (indexTwo = 0; indexTwo < 4; indexTwo++)
        {
            PieceHistory[player][indexTwo] = Math.floor( (Math.random() * 7)+1 );
        }

        for (indexTwo = 0; indexTwo < 4; indexTwo++)
        {
            for (indexThree = 0; indexThree < 4; indexThree++)
            {
                if (indexThree !== indexTwo)
                {
                    while (PieceHistory[player][indexTwo] === PieceHistory[player][indexThree])
                        PieceHistory[player][indexTwo] = Math.floor( (Math.random() * 7)+1 );
                }
            }
        }

        Piece[player] = GetRandomPiece();
		PieceMovementDelay[player] = 0;
		PieceRotation[player] = 1;

		Player = player;

		NextPiece[player] = GetRandomPiece();

		PlayerStatus[player] = NewPieceDropping;

		PieceRotated1[player] = false;
		PieceRotated2[player] = false;

		FlashCompletedLinesTimer[player] = 0;
		ClearCompletedLinesTimer[player] = 0;

        if (FirefoxStoryModeStarted === false)
        {
            Score[player] = 0;

            DropBonus[player] = 0;
            Level[player] = 0;

            Lines[player] = 0;

            PieceDropTimer[player] = 0;
            TimeToDropPiece[player] = 47;
        }
                
		for (y = 0; y < 12; y++)
			for (x = 0; x < 10; x++)
				AttackLines[player][x][y] = 0;

		if (GameMode === TwentyLineChallengeMode)  TwentyLineCounter[player] = 20;

		for (x = 0; x < 12; x++)
		{
			for (let rotation = 1; rotation < 5; rotation++)
			{
			    MoveOneBlockCavernHoles[Player][x][rotation] = 0;

			    MoveCompletedLines[Player][x][rotation] = 0;

			    MovePieceHeight[Player][x][rotation] = 0;
			
			    MovePlayfieldBoxEdges[Player][x][rotation] = 0;

			    MoveTrappedHoles[Player][x][rotation] = 0;		    
			}
		}

		BestMoveX[player] = -1;
		BestRotation[player] = -1;
		BestMoveCalculated[player] = false;
		MovedToBestMove[player] = false;

		CPUFrame[player] = 0;

		BlockAttackTransparency[player] = 0;
		
		UPActionTaken[player] = false;
		SpaceBarActionTaken[player] = false;
		RotateDirection[player] = 0;
	}

    if (GameMode !== FirefoxStoryMode)
    {
        PlayerInput[2] = FirstHumanPlayerInput;

        PlayerInput[0] = CPU;
        PlayerStatus[0] = GameOver;

        PlayerInput[1] = CPU;
        PlayerStatus[1] = GameOver;

        PlayerInput[3] = CPU;
        PlayerStatus[3] = GameOver;

        PlayerInput[4] = CPU;
        PlayerStatus[4] = GameOver;
    }
    else if (GameMode === FirefoxStoryMode)
    {
        PlayerInput[0] = FirstHumanPlayerInput;
        PlayerStatus[0] = NewPieceDropping;

        TwentyLineCounter[0] = 50;

        PlayerInput[1] = CPU;
        PlayerStatus[1] = GameOver;

        PlayerInput[2] = CPU;
        PlayerStatus[2] = GameOver;

        PlayerInput[3] = CPU;
        PlayerStatus[3] = GameOver;

        PlayerInput[4] = CPU;
        PlayerStatus[4] = NewPieceDropping;
    }

    if (DEBUG === true && GameMode === FirefoxStoryMode)
    {
        PlayerStatus[4] = GameOver;

        if (FirefoxStoryModeStarted === false)
        {
            Level[0] = 24;
            Lines[0] = 249;
        }
    }

	if (DEBUG === true && GameMode === OriginalMode)
	{
		Score[0] = 3652096;
		Level[0] = 256;
		Lines[0] = 2569;
		Score[1] = 3663807;
		Level[1] = 248;
		Lines[1] = 2486;
		Score[2] = 3647097;
		Level[2] = 267;
		Lines[2] = 2672;
		Score[3] = 3539964;
		Level[3] = 253;
		Lines[3] = 2537;
		Score[4] = 3361057;
		Level[4] = 262;
		Lines[4] = 2627;
	}
	
	Player = 0;

	PAUSEgame = false;
	
        GameOverDisplayTimer = -1;      
        
	if (GameMode === TimeAttack30Mode)  TimeAttackTimer = 6000;
	else if (GameMode === TimeAttack60Mode)  TimeAttackTimer = 12000;
	else if (GameMode === TimeAttack120Mode)  TimeAttackTimer = 24000;
	else  TimeAttackTimer = 0;

	CrisisModeTimer = 0;
	Crisis7BGMPlayed = false;

	CrisisWon = false;
	CrisisModeOnePlayerLeftPlayfieldCleared = false;

	GameDisplayChanged = true;

	if (NewGameGarbageHeight > 0)
	{
		for (player = 0; player < NumberOfPlayers; player++)
		{
			for (y = 23; y > 23-NewGameGarbageHeight; y--)
			{
				let boxTotal = 0;
				for (x = 2; x < 12; x++)
				{
					let box = Math.floor( Math.random() * 8 );
					if (box > 0)  boxTotal++;

					if (boxTotal < 10)
					{
						if (box !== 0)  Playfield[player][x][y] = box+10;
						else  Playfield[player][x][y] = 0;
					}
					else  Playfield[player][x][y] = 0;
				}
			}
		}
	}
        
    MousePlaying = false;
	
	PlayerInput[0] = CPU;
	PlayerStatus[0] = NewPieceDropping;
	
	PlayerInput[1] = CPU;
	PlayerStatus[1] = NewPieceDropping;
	
	PlayerInput[2] = CPU;
	PlayerStatus[2] = NewPieceDropping;
	
	PlayerInput[3] = CPU;
	PlayerStatus[3] = NewPieceDropping;
	
	PlayerInput[4] = CPU;
	PlayerStatus[4] = NewPieceDropping;
	
	CPUPlayerEnabled = 2;
	
    TotalCPUPlayerLines = 0;
    NumberOfCPUGames = 5;
    TotalOneLines = 0;
    TotalTwoLines = 0;
    TotalThreeLines = 0;
    TotalFourLines = 0;
}

//-------------------------------------------------------------------------------------------------
function AITestSetupComputerPlayer(player)
{
let x;
let y;

	for (y = 0; y < 26; y++)
		for (x = 0; x < 15; x++)
			Playfield[player][x][y] = 255; // Collision detection value

	for (y = 2; y < 5; y++)
		for (x = 5; x < 9; x++)
			Playfield[player][x][y] = 0;

	for (y = 5; y < 24; y++)
		for (x = 2; x < 12; x++)
			Playfield[player][x][y] = 0;

	PlayerInput[player] = CPU;
	PlayerStatus[player] = NewPieceDropping;

	PiecePlayfieldX[player] = 5;
	PiecePlayfieldY[player] = 0;

	Score[player] = 0;

	DropBonus[player] = 0;
	Level[player] = 0;

	Lines[player] = 0;

	PieceDropTimer[player] = 0;
	TimeToDropPiece[player] = 47;
	
	NumberOfCPUGames++;
}

//-------------------------------------------------------------------------------------------------
function FlashCompletedLines()
{
let numberOfCompletedLines = 0;
let y;
let x;
let boxTotal;
let xTwo;
let attackX;

	if (FlashCompletedLinesTimer[Player] < 21)  FlashCompletedLinesTimer[Player]++;

	for (y = 5; y < 24; y++)
	{
		boxTotal = 0;

		for (x = 2; x < 12; x++)
		{
			if ( (Playfield[Player][x][y] > 9)&&(Playfield[Player][x][y] < 30) )
				boxTotal++;
		}

		if (boxTotal === 10)
		{
			numberOfCompletedLines++;

			if (FlashCompletedLinesTimer[Player] % 2 === 0)
			{
				for (xTwo = 2; xTwo < 12; xTwo++)
					Playfield[Player][xTwo][y] = Playfield[Player][xTwo][y] + 10;
			}
			else
			{
				for (xTwo = 2; xTwo < 12; xTwo++)
					Playfield[Player][xTwo][y] = Playfield[Player][xTwo][y] - 10;
			}
		}
	}

	if (FlashCompletedLinesTimer[Player] === 21)
	{
		TotalCPUPlayerLines+=numberOfCompletedLines;

		PlayerStatus[Player] = ClearingCompletedLines;

		if (CrisisModeOnePlayerLeftPlayfieldCleared === false)
		{
			for (y = 5; y < 24; y++)
			{
				boxTotal = 0;

				for (x = 2; x < 12; x++)
				{
					if ( (Playfield[Player][x][y] > 9)&&(Playfield[Player][x][y] < 30) )
					boxTotal++;
				}

                let requiredNumberOfLinesForAttack = 1;
                if (GameMode === FirefoxStoryMode)
                {
                    if (Level[0] < 10)  requiredNumberOfLinesForAttack = 2;
                    else if (Level[0] < 25)  requiredNumberOfLinesForAttack = 1;
                    else  requiredNumberOfLinesForAttack = 0;
                }
							
				if (boxTotal === 10 && numberOfCompletedLines > requiredNumberOfLinesForAttack)
				{
					for (let attackY = 1; attackY < 12; attackY++)
						for (attackX = 0; attackX < 10; attackX++)
							AttackLines[Player][attackX][attackY-1] = AttackLines[Player][attackX][attackY];

					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 1] === 1)
					Playfield[Player][ PiecePlayfieldX[Player] ][ PiecePlayfieldY[Player] ] = 0;
					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 2] === 1)
					Playfield[Player][ PiecePlayfieldX[Player]+1 ][ PiecePlayfieldY[Player] ] = 0;
					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 3] === 1)
					Playfield[Player][ PiecePlayfieldX[Player]+2 ][ PiecePlayfieldY[Player] ] = 0;
					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 4] === 1)
					Playfield[Player][ PiecePlayfieldX[Player]+3 ][ PiecePlayfieldY[Player] ] = 0;

					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 5] === 1)
					Playfield[Player][ PiecePlayfieldX[Player] ][ PiecePlayfieldY[Player]+1 ] = 0;
					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 6] === 1)
					Playfield[Player][ PiecePlayfieldX[Player]+1 ][ PiecePlayfieldY[Player]+1 ] = 0;
					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 7] === 1)
					Playfield[Player][ PiecePlayfieldX[Player]+2 ][ PiecePlayfieldY[Player]+1 ] = 0;
					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 8] === 1)
					Playfield[Player][ PiecePlayfieldX[Player]+3 ][ PiecePlayfieldY[Player]+1 ] = 0;

					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [ 9] === 1)
					Playfield[Player][ PiecePlayfieldX[Player] ][ PiecePlayfieldY[Player]+2 ] = 0;
					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [10] === 1)
					Playfield[Player][ PiecePlayfieldX[Player]+1 ][ PiecePlayfieldY[Player]+2 ] = 0;
					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [11] === 1)
					Playfield[Player][ PiecePlayfieldX[Player]+2 ][ PiecePlayfieldY[Player]+2 ] = 0;
					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [12] === 1)
					Playfield[Player][ PiecePlayfieldX[Player]+3 ][ PiecePlayfieldY[Player]+2 ] = 0;

					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [13] === 1)
					Playfield[Player][ PiecePlayfieldX[Player] ][ PiecePlayfieldY[Player]+3 ] = 0;
					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [14] === 1)
					Playfield[Player][ PiecePlayfieldX[Player]+1 ][ PiecePlayfieldY[Player]+3 ] = 0;
					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [15] === 1)
					Playfield[Player][ PiecePlayfieldX[Player]+2 ][ PiecePlayfieldY[Player]+3 ] = 0;
					if (PieceData [ Piece[Player] ] [ PieceRotation[Player] ] [16] === 1)
					Playfield[Player][ PiecePlayfieldX[Player]+3 ][ PiecePlayfieldY[Player]+3 ] = 0;

					attackX = 0;
					for (let xThree = 2; xThree < 12; xThree++)
					{
						AttackLines[Player][attackX][11] = Playfield[Player][xThree][y];
						attackX++;
					}
				}
                                
				AddPieceToPlayfieldMemory(Current);
			}
		}
	}

	GameDisplayChanged = true;
}

//-------------------------------------------------------------------------------------------------
function ClearCompletedLines()
{
let thereWasACompletedLine = false;
let xTwo;

	for (let y = 5; y < 24; y++)
	{
		let boxTotal = 0;

		for (let x = 2; x < 12; x++)
		{
			if ( (Playfield[Player][x][y] > 9)&&(Playfield[Player][x][y] < 20) )
				boxTotal++;
		}

		if (boxTotal === 10)
		{
			thereWasACompletedLine = true;

			if (ClearCompletedLinesTimer[Player] < 40)  ClearCompletedLinesTimer[Player]++;

			if (ClearCompletedLinesTimer[Player] % 10 === 0)
			{
				for (let yTwo = y; yTwo > 5; yTwo--)
					for (xTwo = 2; xTwo < 12; xTwo++)
						Playfield[Player][xTwo][yTwo] = Playfield[Player][xTwo][yTwo-1];

				for (xTwo = 2; xTwo < 12; xTwo++)
					Playfield[Player][xTwo][5] = 0;

				Lines[Player]++;

				if (DEBUG === 1 && GameMode === CrisisMode)  Lines[Player] = (Level[Player]+1) * 10;

				if (TwentyLineCounter[Player] > 0)  TwentyLineCounter[Player]--;

				if (Lines[Player] % 10 === 0)
				{
					if (GameMode === CrisisMode)
					{
						let playersAlive = 0;
						if (PlayerStatus[0] !== GameOver)  playersAlive++;
						if (PlayerStatus[1] !== GameOver)  playersAlive++;
						if (PlayerStatus[2] !== GameOver)  playersAlive++;
						if (PlayerStatus[3] !== GameOver)  playersAlive++;
						if (PlayerStatus[4] !== GameOver)  playersAlive++;

						if (Level[Player] < 9 && playersAlive === 1)
						{
							Level[Player]++;

							if (Level[Player] === 7 && Crisis7BGMPlayed === false)
							{
								PlaySoundEffect(12);
								PlayMusic(4);
								Crisis7BGMPlayed = true;
							}

							TimeToDropPiece[Player]-=5;
							PlaySoundEffect(8);
						}
						else if (Level[Player] > 8)
						{
							PlayerStatus[0] = GameOver;
							PlayerStatus[1] = GameOver;
							PlayerStatus[2] = GameOver;
							PlayerStatus[3] = GameOver;
							PlayerStatus[4] = GameOver;

							Level[Player]++;

							CrisisWon = true;
						}
					}
					else
					{
						if (Level[Player] < 10000)
						{
							Level[Player]++;
							if (TimeToDropPiece[Player] > 3)  TimeToDropPiece[Player]-=2;
							PlaySoundEffect(8);
                                                        
                            if (GameMode === FirefoxStoryMode && Player === 0)
                            {
                                if (Level[0] === 5 || Level[0] === 10 || Level[0] === 15 || Level[0] === 20
                                 || Level[0] === 25 || Level[0] === 30)  ScreenFadeStatus = 1;

                            }
						}
					}
				}

				PlaySoundEffect(6);
				GameDisplayChanged = true;
			}
		}
	}

	if (thereWasACompletedLine === false)
	{
		SetupNewPiece();
		PlayerStatus[Player] = NewPieceDropping;
	}
}

//-------------------------------------------------------------------------------------------------
function AddAnAttackLineToEnemiesPlayfield()
{
let TEMP_Player = Player;
let x;
let y;

	for (Player = 0; Player < NumberOfPlayers; Player++)
	{
		if (Player !== TEMP_Player && PlayerStatus[Player] !== GameOver)
		{
			if (PlayerStatus[Player] !== FlashingCompletedLines && PlayerStatus[Player] !== ClearingCompletedLines)
			{
				for (x = 2; x < 12; x++)
				{
					if (Playfield[Player][x][5] > 10 && Playfield[Player][x][5] < 20)
					{
						PlayerStatus[Player] = GameOver;
						return;
					}
				}

				if (PieceCollisionDown() === true)  MovePieceDown(true);

				if (PlayerStatus[Player] !== FlashingCompletedLines
				   && PlayerStatus[Player] !== ClearingCompletedLines)
				{
					PlaySoundEffect(10);

					for (y = 5; y < 23; y++)
					{
						for (x = 2; x < 12; x++)
						{
							Playfield[Player][x][y] = Playfield[Player][x][y+1];
						}
					}

					for (x = 2; x < 12; x++)
						Playfield[Player][x][23] = 0;

					let attackX = 0;
					for (x = 2; x < 12; x++)
					{
						Playfield[Player][x][23] = AttackLines[TEMP_Player][attackX][11];
						attackX++;
					}
				}
			}
			else
			{
				PlaySoundEffect(14);
				BlockAttackTransparency[Player] = 1;
			}
		}
	}

	for (y = 11; y > 0; y--)
		for (x = 0; x < 10; x++)
			AttackLines[TEMP_Player][x][y] = AttackLines[TEMP_Player][x][y-1];

	GameDisplayChanged = true;
	Player = TEMP_Player;
}

//-------------------------------------------------------------------------------------------------
function AddAnIncompleteLineToPlayfieldCrisisMode()
{
let x;
let y;

	if (PlayerStatus[Player] === FlashingCompletedLines || PlayerStatus[Player] === ClearingCompletedLines)
	{
		return false;
	}

	PlaySoundEffect(10);

	for (x = 2; x < 12; x++)
	{
		if (Playfield[Player][x][5] > 10 && Playfield[Player][x][5] < 20)
		{
			PlayerStatus[Player] = GameOver;
			return true;
		}
	}

	if (PieceCollisionDown() === true)  MovePieceDown(true);

	if (PlayerStatus[Player] === FlashingCompletedLines || PlayerStatus[Player] === ClearingCompletedLines)
	{
		return false;
	}

	for (y = 5; y < 23; y++)
		for (x = 2; x < 12; x++)
			Playfield[Player][x][y] = Playfield[Player][x][y+1];

	for (x = 2; x < 12; x++)
		Playfield[Player][x][23] = 0;

	let boxTotal = 0;
	for (x = 2; x < 12; x++)
	{
		let box = Math.floor( Math.random() * 8 );
		if (box > 0)  boxTotal++;

		if (boxTotal < 10)
		{
			if (box !== 0)  Playfield[Player][x][23] = box+10;
			else  Playfield[Player][x][23] = 0;
		}
		else  Playfield[Player][x][23] = 0;
	}

	GameDisplayChanged = true;
	return true;
}

//-------------------------------------------------------------------------------------------------
function CrisisModeClearPlayfield()
{
let returnValue = false;
let y;
let x;

	for (y = 23; y > 5; y--)
	{
		for (x = 2; x < 12; x++)
		{
			Playfield[Player][x][y] = Playfield[Player][x][y-1];
		}
	}

	for (x = 2; x < 12; x++)
		Playfield[Player][x][5] = 0;

	for (y = 5; y < 24; y++)
	{
		for (x = 2; x < 12; x++)
		{
			if (Playfield[Player][x][y] !== 0)  returnValue = true;
		}
	}

	if (returnValue === true)  GameDisplayChanged = true;

	return(returnValue);
}

//-------------------------------------------------------------------------------------------------
function RunTetriGameEngine()
{
let boxScreenX;
let boxScreenY;
let y;
let x;

	if (ThinkRussianTimer > 0)  ThinkRussianTimer--;
	if (ThinkRussianTimer === 1)
	{
		MusicArray[CurrentlyPlayingMusicTrack].play();
		ThinkRussianTimer = 0;
	}

	if (PAUSEgame === false)
	{
		ScoringDisplayNeedsUpdate = false;
	    	    
		for (Player = 0; Player < NumberOfPlayers; Player++)
		{
			if (PlayerStatus[Player] !== GameOver)
			{
				if (DEBUG === false)  PieceDropTimer[Player]++;

				if (PlayerInput[Player] !== CPU && JoystickDirection[ PlayerInput[Player] ] === DOWN)
				{
					PieceDropTimer[Player] = 1+TimeToDropPiece[Player];
				}
				else  DropBonus[Player] = 0;

				if (PlayerStatus[Player] === NewPieceDropping)
				{
					UPActionTaken[Player] = true;
					DropBonus[Player] = 0;

					if (PiecePlayfieldY[Player] < PieceDropStartHeight[ Piece[Player] ])  MovePieceDown(true);
					else
					{
						AddPieceToPlayfieldMemory(Next);
						PlayerStatus[Player] = PieceFalling;
					}

					GameDisplayChanged = true;
				}
				else if (PlayerStatus[Player] === PieceFalling)
				{
					if (GameMode === TwentyLineChallengeMode && TwentyLineCounter[Player] === 0)
					{
						PlayerStatus[Player] = GameOver;
					}

					if (PieceDropTimer[Player] > TimeToDropPiece[Player])
					{
						MovePieceDown(false);
					}

					if (PlayerInput[Player] === CPU)
					{
                                            ComputeComputerPlayerMove();
					}
					else if (PlayerInput[Player] !== Mouse && PlayerInput[Player] > -1 && PlayerInput[Player] < 7)
					{
						if (PressingUPAction === Rotate)
						{
							if (JoystickDirection[ PlayerInput[Player] ] === UP)
							{
								if (RotateDirection[Player] === 0)
								{
									if (UPActionTaken[Player] === false)  RotatePieceCounterClockwise();
									UPActionTaken[Player] = true;
								}
								else if (RotateDirection[Player] === 1)
								{
									if (UPActionTaken[Player] === false)  RotatePieceClockwise();
									UPActionTaken[Player] = true;
								}
							}
							else  UPActionTaken[Player] = false;
						}
						else if (PressingUPAction === Fall)
						{
							if (JoystickDirection[ PlayerInput[Player] ] === UP)
							{
								if (UPActionTaken[Player] === false)
								{
									MovePieceDownFast();
								}

								UPActionTaken[Player] = true;
							}
							else  UPActionTaken[Player] = false;
						}
						else if (PressingUPAction === DropAndDrag)
						{
							if (JoystickDirection[ PlayerInput[Player] ] === UP)
							{
								if (UPActionTaken[Player] === false)
								{
									MovePieceDownFastDropAndDrag();
								}

								UPActionTaken[Player] = true;
							}
							else  UPActionTaken[Player] = false;
						}
						
                        if (KeyboardSpaceBarFunction === 1 && KeyboardCharacterPressed === "_")
                        {
                            if (SpaceBarActionTaken[Player] === false)
                            {
                                MovePieceDownFast();
                            }
                            SpaceBarActionTaken[Player] = true;
                        }

                        if (KeyboardSpaceBarFunction === 1 && KeyboardCharacterPressed !== "_")
                            SpaceBarActionTaken[Player] = false;
                        
						if (PieceDropTimer[Player] > TimeToDropPiece[Player])
						{
							if (JoystickDirection[ PlayerInput[Player] ] !== DOWN)
							{
								DropBonus[Player] = 0;
							}
							else  DropBonus[Player]++;
						}
	
						if (JoystickButtonOne[ PlayerInput[Player] ] === true)
						{
							if (PieceRotated1[Player] === false)
							{
								RotatePieceCounterClockwise();
								PieceRotated1[Player] = true;
							}
						}
						else  PieceRotated1[Player] = false;

						if (JoystickButtonTwo[ PlayerInput[Player] ] === true)
						{
							if (PieceRotated2[Player] === false)
							{
								RotatePieceClockwise();
								PieceRotated2[Player] = true;
							}
						}
						else  PieceRotated2[Player] = false;

						if (JoystickDirection[ PlayerInput[Player] ] === LEFT)  MovePieceLeft();
						else if (JoystickDirection[ PlayerInput[Player] ] === RIGHT)  MovePieceRight();
						else  PieceMovementDelay[Player] = 0;
					}
					else if (PlayerInput[Player] === Mouse)
					{      
                        boxScreenX = PlayersPlayfieldScreenX[Player]-59;
                        boxScreenY = PlayersPlayfieldScreenY[Player]-212;
                        for (y = 0; y < 26; y++)
                        {
                            for (x = 2; x < 12; x++)
                            {
                                if (x === PiecePlayfieldX[Player] && y === PiecePlayfieldY[Player])
                                {
                                    PieceMouseScreenX = boxScreenX;
                                    PieceMouseScreenY = boxScreenY;
                                }

                                boxScreenX+=13;
                            }

                            boxScreenX = PlayersPlayfieldScreenX[Player]-59;
                            boxScreenY+=18;
                        }

                        boxScreenX = PlayersPlayfieldScreenX[Player]-59;
                        boxScreenY = PlayersPlayfieldScreenY[Player]-212;
                        for (y = 0; y < 26; y++)
                        {
                            for (x = 1; x < 12; x++)
                            {
                                if ( MouseX > boxScreenX && MouseX < (boxScreenX+13)
                                && MouseY > boxScreenY && MouseY < (boxScreenY+18) )
                                {
									MouseMovePlayfieldX = x;
									MouseMovePlayfieldY = y;
                                }

                                boxScreenX+=13;
                            }

                            boxScreenX = PlayersPlayfieldScreenX[Player]-59;
                            boxScreenY+=18;
                        }

                        if (MouseButtonDown === true)
                        {
                            if ( (MouseMovePlayfieldY < PiecePlayfieldY[Player])
                            || (PiecePlayfieldX[Player] === MouseMovePlayfieldX && PiecePlayfieldY[Player] === MouseMovePlayfieldY) )
                            {
                                if (RotateDirection[Player] === 0)
                                {
                                    if (UPActionTaken[Player] === false)  RotatePieceCounterClockwise();
                                    UPActionTaken[Player] = true;
                                }
                                else if (RotateDirection[Player] === 1)
                                {
                                    if (UPActionTaken[Player] === false)  RotatePieceClockwise();
                                    UPActionTaken[Player] = true;
                                }
                            }
                            else if (PiecePlayfieldX[Player] === MouseMovePlayfieldX && MouseMovePlayfieldY > PiecePlayfieldY[Player])
                            {
                                MovePieceDown();
                                UPActionTaken[Player] = true;
                            }
                            else if (MouseMovePlayfieldX < PiecePlayfieldX[Player])
                            {
                                MovePieceLeft();
                                UPActionTaken[Player] = true;
                            }
                            else if (MouseMovePlayfieldX > PiecePlayfieldX[Player])
                            {
                                MovePieceRight();
                                UPActionTaken[Player] = true;
                            }
                        }
                        else  UPActionTaken[Player] = false;
                    }

					if ( (GameMode === CrisisMode || GameMode === FirefoxStoryMode) && DEBUG === false)
					{
						for (x = 0; x < 10; x++)
						{
							if (AttackLines[Player][x][11] > 0)
							{
								x = 100;
								AddAnAttackLineToEnemiesPlayfield();
							}
						}

                        let numberOfPlayersAlive = 5;
                        for (let player = 0; player < 5; player++)
                        {
                            if (PlayerStatus[player] === GameOver)  numberOfPlayersAlive--;
                        }

                        if (  numberOfPlayersAlive === 1 && ( (GameMode === CrisisMode && PlayersCanJoin === false) || GameMode === FirefoxStoryMode )  )
						{
							if (CrisisModeOnePlayerLeftPlayfieldCleared === false && PlayerStatus[Player] === PieceFalling)
							{
								DeletePieceFromPlayfieldMemory(DropShadow);
                                AddPieceToPlayfieldMemory(Current);

								PlayerStatus[Player] = ClearingPlayfield;
							}

							if (CrisisModeTimer < 300)  CrisisModeTimer++;
							else
							{
								if (AddAnIncompleteLineToPlayfieldCrisisMode() === true)  CrisisModeTimer = 0;
							}
						}
					}
				}
				else if (PlayerStatus[Player] === FlashingCompletedLines)  FlashCompletedLines();
				else if (PlayerStatus[Player] === ClearingCompletedLines)  ClearCompletedLines();
				else if (PlayerStatus[Player] === ClearingPlayfield)
				{
					if ( CrisisModeClearPlayfield() === false )
					{
						PlayerStatus[Player] = NewPieceDropping;
						CrisisModeOnePlayerLeftPlayfieldCleared = true;
					}
				}
				
				if (PieceDropTimer[Player] > TimeToDropPiece[Player])  PieceDropTimer[Player] = 0;

				if (GameMode === TimeAttack30Mode || GameMode === TimeAttack60Mode || GameMode === TimeAttack120Mode)
				{
					TimeAttackTimer--;

					if (TimeAttackTimer === 0)
					{
						PlayerStatus[0] = GameOver;
						PlayerStatus[1] = GameOver;
						PlayerStatus[2] = GameOver;
						PlayerStatus[3] = GameOver;
						PlayerStatus[4] = GameOver;
					}
				}
			}

			if (GameMode === CrisisMode)
			{
				let playersAlive = 0;
				if (PlayerStatus[0] !== GameOver)  playersAlive++;
				if (PlayerStatus[1] !== GameOver)  playersAlive++;
				if (PlayerStatus[2] !== GameOver)  playersAlive++;
				if (PlayerStatus[3] !== GameOver)  playersAlive++;
				if (PlayerStatus[4] !== GameOver)  playersAlive++;

				if (playersAlive > 1)  Score[Player] = 0;
			}

			if (BlockAttackTransparency[Player] > 0)  BlockAttackTransparency[Player] = (BlockAttackTransparency[Player] - .05);
		}
	}
}

//-------------------------------------------------------------------------------------------------
function ComputeComputerPlayerMove()
{
let tempCPUPlayerEnabled = CPUPlayerEnabled;
let posY;
let posX;

    if (PlayerStatus[Player] !== PieceFalling)  return;

    if (GameMode === FirefoxStoryMode)
    {
        if (Level[0] < 10)  CPUPlayerEnabled = 1;
        else if (Level[0] < 20)  CPUPlayerEnabled = 2;
        else if (Level[0] < 30)  CPUPlayerEnabled = 3;
    }

    if (BestMoveCalculated[Player] === false)
    {
        DeletePieceFromPlayfieldMemory(Current);

        for (let indexX = (PlayfieldStartX[Player]-2); indexX < (PlayfieldEndX[Player]-1); indexX+=1)
        {
            for (let indexRot = 1; indexRot < 5; indexRot+=1)
            {
                MoveOneBlockCavernHoles[Player][indexX][indexRot] = 0;
                MoveCompletedLines[Player][indexX][indexRot] = 0;
                MovePieceHeight[Player][indexX][indexRot] = 0;
                MovePlayfieldBoxEdges[Player][indexX][indexRot] = 999999999;
                MoveTrappedHoles[Player][indexX][indexRot] = 0;
            }
        }
      
        for (let pieceTestX = (PlayfieldStartX[Player]-2); pieceTestX < (PlayfieldEndX[Player]-1); pieceTestX+=1)
        {
            for (let rotationTest = 1; rotationTest <= MaxRotationArray[ Piece[Player] ]; rotationTest+=1)
            {
                let TEMP_PieceRotation;
                TEMP_PieceRotation = PieceRotation[Player];
                let TEMP_PiecePlayfieldX;
                TEMP_PiecePlayfieldX = PiecePlayfieldX[Player];
                let TEMP_PiecePlayfieldY;
                TEMP_PiecePlayfieldY = PiecePlayfieldY[Player];

                PiecePlayfieldX[Player] = pieceTestX;
                PieceRotation[Player] = rotationTest;

                MovePieceHeight[Player][pieceTestX][rotationTest] = 0;
                if (PieceCollision() === CollisionNotTrue)
                {
                    for (posY = PiecePlayfieldY[Player]; posY < 23; posY+=1)
                    {
                        PiecePlayfieldY[Player]  = posY;
                        if (PieceCollision() !== CollisionNotTrue)
                        {
                            PiecePlayfieldY[Player] = posY-1;
                            MovePieceHeight[Player][pieceTestX][rotationTest] = PiecePlayfieldY[Player];
                            posY = 100;
                        }
                    }

                    AddPieceToPlayfieldMemory(Current);

                    MoveTrappedHoles[Player][pieceTestX][rotationTest] = 0;
                    for (posX = PlayfieldStartX[Player]; posX < PlayfieldEndX[Player]; posX+=1)
                    {
                        let numberOfEmpties;
                        numberOfEmpties = 0;
                        for (posY = 23; posY > 4; posY-=1)
                        {
                            if (Playfield[Player][posX][posY] === 0)
                            {
                                numberOfEmpties+=1;
                            }
                            else if (Playfield[Player][posX][posY] > 10 && Playfield[Player][posX][posY] < 20)
                            {
                                MoveTrappedHoles[Player][pieceTestX][rotationTest]+=numberOfEmpties;
                                numberOfEmpties = 0;
                            }
                        }
                    }

                    MoveCompletedLines[Player][pieceTestX][rotationTest] = 0;
                    MovePlayfieldBoxEdges[Player][pieceTestX][rotationTest] = 0;
                    for (posY = 5; posY < 25; posY+=1)
                    {
                        let boxTotal;
                        boxTotal = 0;
                        for ( posX = (PlayfieldStartX[Player]-1); posX < PlayfieldEndX[Player]; posX+=1 )
                        {
                            if ( (Playfield[Player][posX][posY] > 10 && Playfield[Player][posX][posY] < 20)
                                || Playfield[Player][posX][posY] === 255 )
                            {
                                if (Playfield[Player][posX][posY] !== 255)  boxTotal+=1;

                                if (Playfield[Player][posX][(posY-1)] === 0)
                                    MovePlayfieldBoxEdges[Player][pieceTestX][rotationTest]+=1;

                                if (Playfield[Player][posX][(posY+1)] === 0)
                                    MovePlayfieldBoxEdges[Player][pieceTestX][rotationTest]+=1;

                                if (Playfield[Player][(posX-1)][posY] === 0)
                                    MovePlayfieldBoxEdges[Player][pieceTestX][rotationTest]+=1;

                                if (Playfield[Player][(posX+1)][posY] === 0)
                                    MovePlayfieldBoxEdges[Player][pieceTestX][rotationTest]+=1;
                            }
                        }

                        if (boxTotal === 10)  MoveCompletedLines[Player][pieceTestX][rotationTest]+=1;
                    }

                    MoveOneBlockCavernHoles[Player][pieceTestX][rotationTest] = 0;
                    for (posY = 5; posY < 24; posY+=1)
                    {
                        for (posX = PlayfieldStartX[Player]; posX < PlayfieldEndX[Player]; posX+=1)
                        {
                            if (Playfield[Player][posX][posY] === 0
                            && Playfield[Player][(posX-1)][posY] !== 0 && Playfield[Player][(posX+1)][posY] !== 0)
                                MoveOneBlockCavernHoles[Player][pieceTestX][rotationTest]+=1;
                        }
                    }

                    DeletePieceFromPlayfieldMemory(Current);
                }
                else
                {
                    MoveTrappedHoles[Player][pieceTestX][rotationTest] = 99999;
                }

                PieceRotation[Player] = TEMP_PieceRotation;
                PiecePlayfieldX[Player] = TEMP_PiecePlayfieldX;
                PiecePlayfieldY[Player] = TEMP_PiecePlayfieldY;
            }
        }

        BestMoveX[Player] = -1;
        BestRotation[Player] = -1;
        let bestValue;
        bestValue = 999999;
        for (posX = (PlayfieldStartX[Player]-1); posX < (PlayfieldEndX[Player]-1); posX+=1)
        {
            for (let rot = 1; rot <= MaxRotationArray[ Piece[Player] ]; rot+=1)
            {
                MovePieceHeight[Player][posX][rot]+=MoveCompletedLines[Player][posX][rot];

                let testValue;

                //--["Gift Of Sight" Tetris(R) A.I. Algorithm ~32,000+]---------------------------------------
                testValue = ( (3*MoveTrappedHoles[Player][posX][rot])
                            +(1*MoveOneBlockCavernHoles[Player][posX][rot])
                            +(1*MovePlayfieldBoxEdges[Player][posX][rot])
                            -(1*MovePieceHeight[Player][posX][rot]) );
                //---------------------------------------["Gift Of Sight" Tetris(R) A.I. Algorithm ~32,000+]--

                if (MoveCompletedLines[Player][posX][rot] > 1)
                    testValue = ( 0 - (MoveCompletedLines[Player][posX][rot]*100) );

                if (testValue <= bestValue)
                {
                    bestValue = testValue;
                    BestMoveX[Player] = posX;
                    BestRotation[Player] = rot;
                }
            }
        }

        BestMoveCalculated[Player] = true;
    }

    if (MovedToBestMove[Player] === false && BestMoveX[Player] !== -1 && BestRotation[Player] !== -1)
    {
        if (PieceRotation[Player] < BestRotation[Player])  RotatePieceClockwise();
        else if (PieceRotation[Player] > BestRotation[Player])  RotatePieceCounterClockwise();

        if (BestMoveX[Player] < PiecePlayfieldX[Player])
            MovePieceLeft();
        else if (BestMoveX[Player] > PiecePlayfieldX[Player])
            MovePieceRight();
        else if (PieceRotation[Player] === BestRotation[Player])
        {
            if (CPUPlayerEnabled !== 4)  MovePieceDown(true);
            MovedToBestMove[Player] = true;
        }
    }
    else
    {
        if (CPUPlayerEnabled !== 4)  MovePieceDown(false);
        else  MovePieceDownFast();
    }
    
    CPUPlayerEnabled = tempCPUPlayerEnabled;
}
