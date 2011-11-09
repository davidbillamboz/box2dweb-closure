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
 
goog.provide('Box2D.Collision.b2Manifold');

goog.require('Box2D.Common.b2Settings');
goog.require('Box2D.Common.Math.b2Vec2');
goog.require('Box2D.Collision.b2ManifoldPoint');

/**
 * @constructor
 */
Box2D.Collision.b2Manifold = function() {
    this.m_pointCount = 0;
    this.m_type = 0;
    this.m_points = [];
    for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
        this.m_points[i] = new Box2D.Collision.b2ManifoldPoint();
    }
    this.m_localPlaneNormal = Box2D.Common.Math.b2Vec2.Get(0, 0);
    this.m_localPoint = Box2D.Common.Math.b2Vec2.Get(0, 0);
};

Box2D.Collision.b2Manifold.prototype.Reset = function() {
    for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
        this.m_points[i].Reset();
    }
    this.m_localPlaneNormal.SetZero();
    this.m_localPoint.SetZero();
    this.m_type = 0;
    this.m_pointCount = 0;
};

Box2D.Collision.b2Manifold.prototype.Set = function(m) {
    this.m_pointCount = m.m_pointCount;
    for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
        this.m_points[i].Set(m.m_points[i]);
    }
    this.m_localPlaneNormal.SetV(m.m_localPlaneNormal);
    this.m_localPoint.SetV(m.m_localPoint);
    this.m_type = m.m_type;
};

Box2D.Collision.b2Manifold.prototype.Copy = function() {
    var copy = new Box2D.Collision.b2Manifold();
    copy.Set(this);
    return copy;
};

Box2D.Collision.b2Manifold.e_circles = 0x0001;
Box2D.Collision.b2Manifold.e_faceA = 0x0002;
Box2D.Collision.b2Manifold.e_faceB = 0x0004;
