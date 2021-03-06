/*
 * Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
 *
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */
/*
 * Original Box2D created by Erin Catto
 * http://www.gphysics.com
 * http://box2d.org/
 * 
 * Box2D was converted to Flash by Boris the Brave, Matt Bush, and John Nesky as Box2DFlash
 * http://www.box2dflash.org/
 * 
 * Box2DFlash was converted from Flash to Javascript by Uli Hecht as box2Dweb
 * http://code.google.com/p/box2dweb/
 * 
 * box2Dweb was modified to utilize Google Closure, as well as other bug fixes, optimizations, and tweaks by Illandril
 * https://github.com/illandril/box2dweb-closure
 */
 
 document.write('<pre id="fps">?? FPS</pre>');
var lastTick = new Date();
var rollingFPS = 60;
var totalFrames = 0;
var lastMarkFrames = 0;
var lastMarkTick = lastTick;
var minFPS = 999;
var maxFPS = 0;
updateCalls.push(function() {
    var thisTick = new Date();
    var newFPS = 1 / (thisTick.getTime() - lastTick.getTime()) * 1000;
    lastTick = thisTick;
    totalFrames++;
    rollingFPS = rollingFPS * 0.9 + newFPS * 0.1;
    minFPS = Math.min(minFPS, rollingFPS);
    maxFPS = Math.max(maxFPS, rollingFPS);
    document.getElementById('fps').innerHTML = Math.round(rollingFPS) + " FPS\nMin: " + minFPS + "\nMax: " + maxFPS;
});

var resetMinMaxFPS = function() {
    minFPS = 999;
    maxFPS = 0;
};

var markFPS = function() {
    var newMarkTick = lastTick;
    var newMarkFrames = totalFrames;
    var seconds = (newMarkTick.getTime() - lastMarkTick.getTime()) / 1000;
    var frames = newMarkFrames - lastMarkFrames;
    console.error("FPS since last mark: " + (frames / seconds));
    lastMarkTick = newMarkTick;
    lastMarkFrames = newMarkFrames;
};