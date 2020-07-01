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

// "audio.js"...

let SoundVolume = .5;
let MusicVolume = 1;

let SoundType;
let NumberOfSoundEffects = 15;
let SoundArray = new Array(NumberOfSoundEffects);
let NumberOfMusics = 8;
let MusicArray = new Array(NumberOfMusics);

let CurrentlyPlayingMusicTrack = 0;

let MusicIsCompletelyLoaded = new Array(NumberOfMusics);

let FirstRunCheckAudio = false;

//--------------------------------------------------------------------------------------------------------------
function MusicLoaded(index)
{
    MusicIsCompletelyLoaded[index] = true;
}

//--------------------------------------------------------------------------------------------------------------
function LoopMusicFixForFirefox()
{
    PlayMusic(CurrentlyPlayingMusicTrack);
}

//--------------------------------------------------------------------------------------------------------------
function LoadSound()
{
var index;

    for (index = 0; index < NumberOfMusics; index++)  MusicIsCompletelyLoaded[index] = false;
	
    if (SoundType === "ogg" || SoundType === "mp3")
    {
        for (index = 0; index < NumberOfSoundEffects; index++)
            SoundArray[index] = document.createElement("Audio");

        SoundArray[0].src = "./data/audio/MenuClick." + SoundType;
        SoundArray[1].src = "./data/audio/MenuMove." + SoundType;
        SoundArray[2].src = "./data/audio/MovePiece." + SoundType;
        SoundArray[3].src = "./data/audio/PieceCollision." + SoundType;
        SoundArray[4].src = "./data/audio/PieceDrop." + SoundType;
        SoundArray[5].src = "./data/audio/PieceRotate." + SoundType;
        SoundArray[6].src = "./data/audio/LineCleared." + SoundType;
        SoundArray[7].src = "./data/audio/TetriCleared." + SoundType;
        SoundArray[8].src = "./data/audio/LevelUp." + SoundType;
        SoundArray[9].src = "./data/audio/MustThinkInRussian." + SoundType;
        SoundArray[10].src = "./data/audio/IncomingLine." + SoundType;
        SoundArray[11].src = "./data/audio/GameOver." + SoundType;
        SoundArray[12].src = "./data/audio/Crack." + SoundType;
        SoundArray[13].src = "./data/audio/ShallWePlayAGame." + SoundType;
        SoundArray[14].src = "./data/audio/Sword." + SoundType;

        for (index = 0; index < NumberOfSoundEffects; index++)  { SoundArray[index].preLoad = "auto"; }

        for (index = 0; index < NumberOfMusics; index++)
        {
            MusicArray[index] = document.createElement("Audio");
            MusicArray[index].src = ("./data/audio/Track-0"+(index+1)+"-BGM." + SoundType);
            MusicArray[index].volume = MusicVolume;
            MusicArray[index].preload = "auto";
            MusicArray[index].addEventListener( "canplay", MusicLoaded.bind(window, index) );
        }
    }
}

//--------------------------------------------------------------------------------------------------------------
function PlaySoundEffect(index)
{
    if (ThinkRussianTimer > 0)  return;
    
    if (SoundType === "null")  return;
    if ( index > (NumberOfSoundEffects-1) )  return;
        
    if (SoundVolume === 0)  return;

    SoundArray[index].volume = SoundVolume;
    SoundArray[index].currentTime = 0;
    SoundArray[index].play();
}

//--------------------------------------------------------------------------------------------------------------
function PlayMusic(index)
{
    if (SoundType === "null")  return;
    if ( index > (NumberOfMusics-1) )  return;

    if (MusicVolume === 0)  return;

    MusicArray[CurrentlyPlayingMusicTrack].pause();

    CurrentlyPlayingMusicTrack = index;
    MusicArray[index].addEventListener("ended", LoopMusicFixForFirefox, false);

    MusicArray[index].currentTime = 0;
    
    MusicArray[index].volume = MusicVolume;

    MusicArray[index].play();
}
