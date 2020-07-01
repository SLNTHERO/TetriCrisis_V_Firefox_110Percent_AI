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

// "visuals.js'...

let NumberOfSprites = 200;
let ImageSprites = new Array(NumberOfSprites);
let NumberOfLoadedImages = 0;

let BrowserWidth = 800;
let BrowserHeight = 480;

let NumberOfPreloadedStaffTexts = -1;
let PreloadedTextsBG;
let PreloadedStaffTexts = new Array(100);
let PreloadedStaffTextsBlue = new Array(100);
let PreloadedStaffTextsScreenY = new Array(100);
let PreloadStaffTextsAlpha = new Array(100);

let TextCacheImageCanvas = new Array(100);
let TextCacheImageCanvasCTX = new Array(100);
let TextCacheText = new Array(100);
let TextCacheJustification = new Array(100);
let TextCacheScreenXOriginal = new Array(100);
let TextCacheScreenX = new Array(100);
let TextCacheScreenY = new Array(100);
let TextCacheIndex = 0;

//--------------------------------------------------------------------------------------------------------------
function BrowserResize()
{
var widthToHeight = 800 / 480;
var browserWidthTemp;
var browserHeightTemp;

    var canvas = document.getElementById('ScreenCanvas');

    if ( Browser === "Google Android" || Browser === "Apple iOS" || Browser === "Mobile Unknown" )
    {
        BrowserWidth = window.innerWidth;
        BrowserHeight = window.innerHeight;

        canvas.style.width = BrowserWidth + 'px';
        canvas.style.height = BrowserHeight + 'px';
    }
    else
    {
        BrowserWidth = window.innerWidth;
        BrowserHeight = window.innerHeight;
        
        var newWidthToHeight = BrowserWidth / BrowserHeight;
        browserWidthTemp = BrowserWidth;
        browserHeightTemp = BrowserHeight;
    
        if (newWidthToHeight > widthToHeight)
        {
            browserWidthTemp = browserHeightTemp * widthToHeight;
            canvas.style.height = browserHeightTemp + 'px';
            canvas.style.width = browserWidthTemp + 'px';
	}
        else
        {
            browserHeightTemp = browserWidthTemp / widthToHeight;
            canvas.style.width = browserWidthTemp + 'px';
            canvas.style.height = browserHeightTemp + 'px';
        }

        canvas.style.marginTop = (-browserHeightTemp / 2) + 'px';
        canvas.style.marginLeft = (-browserWidthTemp / 2) + 'px';
       
        BrowserWidth = browserWidthTemp;
        BrowserHeight = browserHeightTemp;
    }
}

//--------------------------------------------------------------------------------------------------------------
function LoadImages()
{
var index;

    for (index = 0; index < 100; index++)
    {
        TextCacheImageCanvas[index] = document.createElement("canvas");
        TextCacheImageCanvas[index].width = "800";
        TextCacheImageCanvas[index].height = "150";
        TextCacheImageCanvasCTX[index] = TextCacheImageCanvas[index].getContext('2d');
        TextCacheImageCanvasCTX[index].clearRect(0, 0, 800, 150);
    }

    ClearTextCache();
    
    OriginalButtonSprite = new Image();
    OriginalButtonSprite.src = "data/visuals/Button.png"; NumberOfLoadedImages++;

    GUIArrowsSprites[0] = new Image();
    GUIArrowsSprites[0].src = "data/visuals/Button-Selector-Left.png"; NumberOfLoadedImages++;
    GUIArrowsSprites[1] = new Image();
    GUIArrowsSprites[1].src = "data/visuals/Button-Selector-Right.png"; NumberOfLoadedImages++;

    GUISelectorLineSprite = new Image;
    GUISelectorLineSprite.src = "data/visuals/Selector-Line.png"; NumberOfLoadedImages++;

    PreloadedTextsBG = new Image();
    PreloadedTextsBG.src = "data/visuals/PreLoad-Text-Image.png"; NumberOfLoadedImages++;
  
    for (index = 0; index < NumberOfSprites; index++)  ImageSprites[index] = new Image();
	
    ImageSprites[0].src = "data/visuals/Screen-Fade-Black-Box.png"; NumberOfLoadedImages++;
    ImageSprites[1].src = "data/visuals/Red-BG.png"; NumberOfLoadedImages++;
    ImageSprites[2].src = "data/visuals/Green-BG.png"; NumberOfLoadedImages++;
    ImageSprites[3].src = "data/visuals/Blue-BG.png"; NumberOfLoadedImages++;

    ImageSprites[5].src = "data/visuals/Speaker-OFF.png"; NumberOfLoadedImages++;
    ImageSprites[6].src = "data/visuals/Speaker-ON.png"; NumberOfLoadedImages++;

    ImageSprites[9].src = "data/visuals/HTML5-Logo.png"; NumberOfLoadedImages++;
    
    ImageSprites[10].src = "data/visuals/16BitSoft-Logo.png"; NumberOfLoadedImages++;
    
    ImageSprites[11].src = "data/visuals/NewGrounds-Logo.png"; NumberOfLoadedImages++;
    
    ImageSprites[15].src = "data/visuals/Download-Source-Button.png"; NumberOfLoadedImages++;
    
    ImageSprites[20].src = "data/visuals/Title-BG.png"; NumberOfLoadedImages++;


    ImageSprites[26].src = "data/visuals/Keyboard-Key-Green.png"; NumberOfLoadedImages++;
    ImageSprites[27].src = "data/visuals/Keyboard-Key-Yellow.png"; NumberOfLoadedImages++;
    ImageSprites[28].src = "data/visuals/Keyboard-Key-Red.png"; NumberOfLoadedImages++;
    ImageSprites[29].src = "data/visuals/Keyboard-Controls.png"; NumberOfLoadedImages++;
    
    ImageSprites[30].src = "data/visuals/TC5-Logo.png"; NumberOfLoadedImages++;
    ImageSprites[31].src = "data/visuals/Logo-BG-Mask.png"; NumberOfLoadedImages++;
    ImageSprites[32].src = "data/visuals/Logo-Flash.png"; NumberOfLoadedImages++;

    ImageSprites[40].src = "data/visuals/Firefox-01.png"; NumberOfLoadedImages++;

    ImageSprites[49].src = "data/visuals/Playfield-BG.png"; NumberOfLoadedImages++;
    ImageSprites[50].src = "data/visuals/Playfield.png"; NumberOfLoadedImages++;
    ImageSprites[60].src = "data/visuals/Box-Black.png"; NumberOfLoadedImages++;
    ImageSprites[61].src = "data/visuals/Box-White.png"; NumberOfLoadedImages++;
    ImageSprites[62].src = "data/visuals/Box-Red.png"; NumberOfLoadedImages++;
    ImageSprites[63].src = "data/visuals/Box-Orange.png"; NumberOfLoadedImages++;
    ImageSprites[64].src = "data/visuals/Box-Cyan.png"; NumberOfLoadedImages++;
    ImageSprites[65].src = "data/visuals/Box-Yellow.png"; NumberOfLoadedImages++;
    ImageSprites[66].src = "data/visuals/Box-Green.png"; NumberOfLoadedImages++;
    ImageSprites[67].src = "data/visuals/Box-Blue.png"; NumberOfLoadedImages++;
    ImageSprites[68].src = "data/visuals/Box-Purple.png"; NumberOfLoadedImages++;
    ImageSprites[70].src = "data/visuals/PlayfieldBlockAttack.png"; NumberOfLoadedImages++;
    ImageSprites[80].src = "data/visuals/Crack.png"; NumberOfLoadedImages++;
    
    ImageSprites[90].src = "data/visuals/Flag-USA.png"; NumberOfLoadedImages++;
    ImageSprites[91].src = "data/visuals/Flag-USSR.png"; NumberOfLoadedImages++;
    
    ImageSprites[99].src = "data/visuals/Letter-Tile.png"; NumberOfLoadedImages++;
}

//--------------------------------------------------------------------------------------------------------------
function PreloadStaffText(size, text, x, y, justification, colorR, colorG, colorB, outlineColorR, outlineColorG, outlineColorB, outlineBold)
{
var ctxPreloadedStaffTexts = new Array(100);

    NumberOfPreloadedStaffTexts++;

    PreloadedStaffTexts[NumberOfPreloadedStaffTexts] = document.createElement("canvas");
    PreloadedStaffTexts[NumberOfPreloadedStaffTexts].width = "800";
    PreloadedStaffTexts[NumberOfPreloadedStaffTexts].height = "150";
    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts] = PreloadedStaffTexts[NumberOfPreloadedStaffTexts].getContext('2d');
    
    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].clearRect(0, 0, 800, 150);
    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].drawImage(PreloadedTextsBG, 0, 0, 800, 150);
    
    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].save();

    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].font = ""+size+"px HighlandGothicFLF";

    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].textAlign = justification;

    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillStyle = "rgba("+outlineColorR+", "+outlineColorG+", "+outlineColorB+", 1)";

    if (outlineBold === 0)
    {
        ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillText(text, x, y-1);
        ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillText(text, x+1, y);
        ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillText(text, x, y+1);
        ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillText(text, x-1, y);
    }
    else if (outlineBold === 1)
    {
        for (var yOffset = -2; yOffset < 3; yOffset++)
            for (var xOffset = -2; xOffset < 3; xOffset++)
                ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillText(text, x+xOffset, y+yOffset);
    }

    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillStyle = "rgba("+colorR+", "+colorG+", "+colorB+", 1)";
    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillText(text, x, y);

    PreloadedStaffTextsBlue[NumberOfPreloadedStaffTexts] = colorB;
    
    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].restore();
}

//--------------------------------------------------------------------------------------------------------------
function PreloadAllStaffTexts()
{
    PreloadStaffText(20, "TM", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "TetriCrisis V ''Firefox'' 110% A.I.", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "\u00A92017, By Team ''www.16BitSoft.com''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "www.16BitSoft.com", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Original Tetris Game Concept By:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "Alexey Pajitnov", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Original ''Firefox'' Motion Picture Produced & Directed By:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "Clint Eastwood", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "\u00A91982 By Warner Bros. Inc.", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Special Thank You To:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "www.NewGrounds.com", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "(For Internet Publishing)", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "HTML5/JS Video Playback Core By:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''Daotheman''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "''Mustang GT 5.0 SuperCharged'' HTML5/JS Game Engine By:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''JeZxLee''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "''Gift Of Sight'' Artificial Intelligence Tetris Core By:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''JeZxLee''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Lead Game Designer:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''JeZxLee''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Lead Game Programmer:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''JeZxLee''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Lead Game Tester:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''JeZxLee''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Lead Graphic Artist:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''JeZxLee''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Lead Music Composer/Remixer / Sound Effects Artist:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''D.J. Fading Twilight''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Support Game Designers/Programmers/Testers:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''Daotheman''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''mattmatteh''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Support Game Beta Testers:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''MrOzBarry''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''SnowHog''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''oshunluvr''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''hallergard''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''trintadosete''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''Diki''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''Aprime''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''raincomplex''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''CtlAltDel''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1); 
    PreloadStaffText(20, "''b10b''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''moo-_-''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''MtnDewManiac''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''WombatTurkey''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''marcgfx''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''spritelygames''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''seeker''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''JazzAceman''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''Gergely S.''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''Sylvain B.''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''Kvisle''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''rich''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''chg''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''GBeebe''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    
    PreloadStaffText(20, "''You!''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Game Built On A:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''JeZ+Lee'' Pro-Built Desktop Computer: ''JetFire''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "(Running Genuine Linux Mint 18.2 KDE 64Bit Linux)", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Game Optimized On A:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "Hyper-Custom Thin Client Desktop Computer", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "(Running Genuine Linux Mint 18.2 KDE 64Bit Linux)", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Game Tested On A:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''JeZ+Lee'' Pro-Built Desktop Computer: ''Optimus Prime''", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "(Running Genuine Microsoft\u00AE Windows\u00AE 10 Pro 64Bit)", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Software Credits:", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "WebStorm (Cross-Platform JavaScript I.D.E.)", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "NeoPaint 5 (Windows Graphic Editor)", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "GoldWave (Windows Audio Editor)", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "Kdenlive (Linux Video Editor)", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "Freemake (Windows Video Converter)", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "SketchUp Make 2015 (Windows 3D Modeler)", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "FileZilla (Cross-Platform F.T.P. Client)", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "www.YOUTUBE-MP3.org", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "TTF Patch (Windows TTF Font Patcher)", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "VMWare\u00AE Workstation 12 Player (Cross-Platform Virtual Machine)", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "Microsoft\u00AE Edge", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "Microsoft\u00AE Internet Explorer", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "Mozilla\u00AE Firefox", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "Google\u00AE Chrome", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "Opera Software\u00AE Opera", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "Apple\u00AE Safari", 400, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "''A 110% By Team www.16BitSoft.com!''", 400, 75, "center", 255, 255, 0, 0, 0, 0, 1);
}

//--------------------------------------------------------------------------------------------------------------
function DrawPreloadedStaffTextOntoCanvas(index, x, y)
{
    ctx.save();

    ctx.globalAlpha = PreloadStaffTextsAlpha[index];

    var computedCenterX = Math.floor(PreloadedStaffTexts[index].width / 2);
    var computedCenterY = Math.floor(PreloadedStaffTexts[index].height / 2);

	ctx.drawImage(  PreloadedStaffTexts[index], (x - computedCenterX), (y - computedCenterY)
	, PreloadedStaffTexts[index].width, PreloadedStaffTexts[index].height  );

    ctx.restore();
}

//-------------------------------------------------------------------------------------------------
function DegToRad(d)
{
    return d * 0.0174532925199432957;
}

//--------------------------------------------------------------------------------------------------------------
// "Retro Blast Tech"
function DrawSpriteOntoCanvas(index, x, y, scaleX, scaleY, rotationDegree, alpha, red, green, blue)
{
    if (scaleX === 0 || scaleY === 0)  return;
    
    var imageToDraw;
    var imageToDrawWidth = 0;
    var imageToDrawHeight = 0;
    
    if (index < 101 || index > 166)
    {
        imageToDraw = ImageSprites[index];
        imageToDrawWidth = ImageSprites[index].width;
        imageToDrawHeight = ImageSprites[index].height;
    }
    else
    {
        imageToDraw = document.createElement("canvas");
        imageToDraw.width = "39";
        imageToDraw.height = "30";
        imageToDrawWidth = 39;
        imageToDrawHeight = 30;
        imageToDraw = ButtonsWithCharsCanvases[index-100];
    }

    ctx.save();

    ctx.globalAlpha = alpha;

    if (red !== 255 || green !== 255 || blue !== 255)
    {
        var buff = document.createElement("canvas");
        buff.width  = imageToDrawWidth;
        buff.height = imageToDrawHeight;

        if (red !== 255)
        {
            var ctxR  = buff.getContext("2d");
            ctxR.drawImage(imageToDraw, 0, 0);

            ctxR.globalAlpha = (red / 255);
            ctxR.globalCompositeOperation = 'source-atop';
            ctxR.drawImage(ImageSprites[1], 0, 0);

            ctxR.globalAlpha = 1;

            imageToDraw = buff;
        }

        if (green !== 255)
        {
            var ctxG  = buff.getContext("2d");
            ctxG.drawImage(imageToDraw, 0, 0);

            ctxG.globalAlpha = (green / 255);
            ctxG.globalCompositeOperation = 'source-atop';
            ctxG.drawImage(ImageSprites[2], 0, 0);

            ctxG.globalAlpha = 1;

            imageToDraw = buff;
        }

        if (blue !== 255)
        {
            var ctxB  = buff.getContext("2d");
            ctxB.drawImage(imageToDraw, 0, 0);

            ctxB.globalAlpha = (blue / 255);
            ctxB.globalCompositeOperation = 'source-atop';
            ctxB.drawImage(ImageSprites[3], 0, 0);

            ctxB.globalAlpha = 1;

            imageToDraw = buff;
        }

        buff = null;
    }

    ctx.translate(x, y);

    if (rotationDegree !== 0)  ctx.rotate( DegToRad(rotationDegree) );
    
    if (scaleX !== 1 || scaleY !== 1)  ctx.scale(scaleX, scaleY);

    ctx.drawImage( imageToDraw, -(imageToDrawWidth / 2), -(imageToDrawHeight / 2) );

    ctx.globalAlpha = 1;
    ctx.restore();
}
//                                                                                            "Retro Blast Tech"

//--------------------------------------------------------------------------------------------------------------
function ClearTextCache()
{
    for (var index = 0; index < 100; index++)
    {
        TextCacheImageCanvasCTX[index].clearRect(0, 0, 800, 150);
        TextCacheText[index] = " ";
        TextCacheJustification[index] = " ";
        TextCacheScreenXOriginal[index] = -999;
        TextCacheScreenX[index] = -999;
        TextCacheScreenY[index] = -999;
        TextCacheIndex = 0;
    }
}

//--------------------------------------------------------------------------------------------------------------
function DrawTextOntoCanvas(size, text, x, y, justification, colorR, colorG, colorB, outlineColorR, outlineColorG, outlineColorB, outlineBold)
{
var computedCenterX;
var computedCenterY;

    for (var indexToCheck = 0; indexToCheck < 100; indexToCheck++)
    {
        if (  text === TextCacheText[indexToCheck]
        && y === TextCacheScreenY[indexToCheck] && x === TextCacheScreenXOriginal[indexToCheck] )
	{
            ctx.save();

            computedCenterX = Math.floor(TextCacheImageCanvas[indexToCheck].width / 2);
            computedCenterY = Math.floor(TextCacheImageCanvas[indexToCheck].height / 2);

            ctx.drawImage(  TextCacheImageCanvas[indexToCheck], (TextCacheScreenX[indexToCheck] - computedCenterX)
            , (TextCacheScreenY[indexToCheck] - computedCenterY)
            , TextCacheImageCanvas[indexToCheck].width, TextCacheImageCanvas[indexToCheck].height  );

            ctx.restore();

            return;
	}
    }

    if (TextCacheIndex < 99)  TextCacheIndex++;
    else  TextCacheIndex = 0;

    TextCacheImageCanvasCTX[TextCacheIndex].clearRect(0, 0, 800, 150);
    TextCacheImageCanvasCTX[TextCacheIndex].drawImage(PreloadedTextsBG, 0, 0, 800, 150);
    TextCacheText[TextCacheIndex] = text;
    TextCacheJustification[TextCacheIndex] = justification;
    TextCacheScreenXOriginal[TextCacheIndex] = x;
    TextCacheScreenX[TextCacheIndex] = 400;
    TextCacheScreenY[TextCacheIndex] = y;

    TextCacheImageCanvasCTX[TextCacheIndex].save();

    TextCacheImageCanvasCTX[TextCacheIndex].font = ""+size+"px HighlandGothicFLF";

    TextCacheImageCanvasCTX[TextCacheIndex].textAlign = justification;

    TextCacheImageCanvasCTX[TextCacheIndex].fillStyle = "rgba("+outlineColorR+", "+outlineColorG+", "+outlineColorB+", 1)";

    y = 75;

    if (outlineBold === 0)
    {
        TextCacheImageCanvasCTX[TextCacheIndex].fillText(text, x, y-1);
        TextCacheImageCanvasCTX[TextCacheIndex].fillText(text, x+1, y);
        TextCacheImageCanvasCTX[TextCacheIndex].fillText(text, x, y+1);
        TextCacheImageCanvasCTX[TextCacheIndex].fillText(text, x-1, y);
    }
    else if (outlineBold === 1)
    {
        for (var yOffset = -2; yOffset < 3; yOffset++)
            for (var xOffset = -2; xOffset < 3; xOffset++)
                TextCacheImageCanvasCTX[TextCacheIndex].fillText(text, x+xOffset, y+yOffset);
    }

    TextCacheImageCanvasCTX[TextCacheIndex].fillStyle = "rgba("+colorR+", "+colorG+", "+colorB+", 1)";
    TextCacheImageCanvasCTX[TextCacheIndex].fillText(text, x, y);

    TextCacheImageCanvasCTX[TextCacheIndex].restore();
	
    ctx.save();

    computedCenterX = Math.floor(TextCacheImageCanvas[TextCacheIndex].width / 2);
    computedCenterY = Math.floor(TextCacheImageCanvas[TextCacheIndex].height / 2);

    ctx.drawImage(  TextCacheImageCanvas[TextCacheIndex], (TextCacheScreenX[TextCacheIndex] - computedCenterX)
    , (TextCacheScreenY[TextCacheIndex] - computedCenterY)
    , TextCacheImageCanvas[TextCacheIndex].width, TextCacheImageCanvas[TextCacheIndex].height  );

    ctx.restore();
}
