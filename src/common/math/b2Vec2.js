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
 
goog.provide('Box2D.Common.Math.b2Vec2');

/**
 * @param {number} x
 * @param {number} y
 * @constructor
 */
Box2D.Common.Math.b2Vec2 = function(x, y) {
    this.x = x;
    this.y = y;
};

Box2D.Common.Math.b2Vec2.prototype.SetZero = function() {
    this.x = 0.0;
    this.y = 0.0;
};

/**
 * @param {number} x
 * @param {number} y
 */
Box2D.Common.Math.b2Vec2.prototype.Set = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} v
 */
Box2D.Common.Math.b2Vec2.prototype.SetV = function(v) {
    this.x = v.x;
    this.y = v.y;
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Vec2.prototype.GetNegative = function() {
    return new Box2D.Common.Math.b2Vec2((-this.x), (-this.y));
};

Box2D.Common.Math.b2Vec2.prototype.NegativeSelf = function() {
    this.x = (-this.x);
    this.y = (-this.y);
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Vec2.prototype.Copy = function() {
    return new Box2D.Common.Math.b2Vec2(this.x, this.y);
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} v
 */
Box2D.Common.Math.b2Vec2.prototype.Add = function(v) {
    this.x += v.x;
    this.y += v.y;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} v
 */
Box2D.Common.Math.b2Vec2.prototype.Subtract = function(v) {
    this.x -= v.x;
    this.y -= v.y;
};

/**
 * @param {number} a
 */
Box2D.Common.Math.b2Vec2.prototype.Multiply = function(a) {
    this.x *= a;
    this.y *= a;
};

/**
 * @param {Box2D.Common.Math.b2Mat22} A
 */
Box2D.Common.Math.b2Vec2.prototype.MulM = function(A) {
    var tX = this.x;
    this.x = A.col1.x * tX + A.col2.x * this.y;
    this.y = A.col1.y * tX + A.col2.y * this.y;
};

/**
 * @param {Box2D.Common.Math.b2Mat22} A
 */
Box2D.Common.Math.b2Vec2.prototype.MulTM = function(A) {
    var tX = this.x * A.col1.x + this.y * A.col1.y;
    this.y = this.x * A.col2.x + this.y * A.col2.y;
    this.x = tX;
};

/**
 * @param {number} s
 */
Box2D.Common.Math.b2Vec2.prototype.CrossVF = function(s) {
    var tX = this.x;
    this.x = s * this.y;
    this.y = (-s * tX);
};

/**
 * @param {number} s
 */
Box2D.Common.Math.b2Vec2.prototype.CrossFV = function(s) {
    var tX = this.x;
    this.x = (-s * this.y);
    this.y = s * tX;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} b
 */
Box2D.Common.Math.b2Vec2.prototype.MinV = function(b) {
    this.x = Math.min(this.x, b.x);
    this.y = Math.min(this.y, b.y);
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} b
 */
Box2D.Common.Math.b2Vec2.prototype.MaxV = function(b) {
    this.x = Math.max(this.x, b.x);
    this.y = Math.max(this.y, b.y);
};

Box2D.Common.Math.b2Vec2.prototype.Abs = function() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
};

/**
 * @return {number}
 */
Box2D.Common.Math.b2Vec2.prototype.Length = function() {
    return Math.sqrt(this.LengthSquared());
};

/**
 * @return {number}
 */
Box2D.Common.Math.b2Vec2.prototype.LengthSquared = function() {
    return (this.x * this.x + this.y * this.y);
};

/**
 * @return {number}
 */
Box2D.Common.Math.b2Vec2.prototype.Normalize = function() {
    var length = this.Length();
    if (length < Number.MIN_VALUE) {
        return 0.0;
    }
    var invLength = 1.0 / length;
    this.x *= invLength;
    this.y *= invLength;
    return length;
};

/**
 * @return {boolean}
 */
Box2D.Common.Math.b2Vec2.prototype.IsValid = function () {
  return isFinite(this.x) && isFinite(this.y);
};