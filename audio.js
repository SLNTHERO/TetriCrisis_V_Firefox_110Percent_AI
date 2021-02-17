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

// "audio.js"...

let SoundVolume = .5;
let MusicVolume = .5;

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
let index;

    for (index = 0; index < NumberOfMusics; index++)  MusicIsCompletelyLoaded[index] = false;
	
    if (SoundType === "ogg" || SoundType === "mp3")
    {
        for (index = 0; index < NumberOfSoundEffects; index++)
            SoundArray[index] = document.createElement("Audio");

        SoundArray[0].src = "./data/audio/effects/MenuClick." + SoundType;
        SoundArray[1].src = "./data/audio/effects/MenuMove." + SoundType;
        SoundArray[2].src = "./data/audio/effects/MovePiece." + SoundType;
        SoundArray[3].src = "./data/audio/effects/PieceCollision." + SoundType;
        SoundArray[4].src = "./data/audio/effects/PieceDrop." + SoundType;
        SoundArray[5].src = "./data/audio/effects/PieceRotate." + SoundType;
        SoundArray[6].src = "./data/audio/effects/LineCleared." + SoundType;
        SoundArray[7].src = "./data/audio/effects/TetriCleared." + SoundType;
        SoundArray[8].src = "./data/audio/effects/LevelUp." + SoundType;
        SoundArray[9].src = "./data/audio/effects/MustThinkInRussian." + SoundType;
        SoundArray[10].src = "./data/audio/effects/IncomingLine." + SoundType;
        SoundArray[11].src = "./data/audio/effects/GameOver." + SoundType;
        SoundArray[12].src = "./data/audio/effects/Crack." + SoundType;
        SoundArray[13].src = "./data/audio/effects/ShallWePlayAGame." + SoundType;
        SoundArray[14].src = "./data/audio/effects/Sword." + SoundType;

        for (index = 0; index < NumberOfSoundEffects; index++)  { SoundArray[index].preLoad = "auto"; }

        for (index = 0; index < NumberOfMusics; index++)
        {
            MusicArray[index] = document.createElement("Audio");
            MusicArray[index].src = ("./data/audio/music/Track-0"+(index+1)+"-BGM." + SoundType);
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
