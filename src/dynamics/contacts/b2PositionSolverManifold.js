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
 
goog.provide('Box2D.Dynamics.Contacts.b2PositionSolverManifold');

goog.require('Box2D.Common.Math.b2Vec2');
goog.require('Box2D.Common.b2Settings');
goog.require('Box2D.Collision.b2Manifold');

/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2PositionSolverManifold = function() {
    this.m_normal = new Box2D.Common.Math.b2Vec2(0, 0);
    this.m_separations = [];
    this.m_points = [];
    for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
        this.m_points[i] = new Box2D.Common.Math.b2Vec2(0, 0);
    }
};

Box2D.Dynamics.Contacts.b2PositionSolverManifold.prototype.Initialize = function(cc) {
    Box2D.Common.b2Settings.b2Assert(cc.pointCount > 0);
    var i = 0;
    var clipPointX = 0;
    var clipPointY = 0;
    var planePointX = 0;
    var planePointY = 0;
    switch (cc.type) {
    case Box2D.Collision.b2Manifold.e_circles:
        var tMat = cc.bodyA.m_xf.R;
        var tVec = cc.localPoint;
        var pointAX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        var pointAY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        tMat = cc.bodyB.m_xf.R;
        tVec = cc.points[0].localPoint;
        var pointBX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        var pointBY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        var dX = pointBX - pointAX;
        var dY = pointBY - pointAY;
        var d2 = dX * dX + dY * dY;
        if (d2 > Box2D.Common.b2Settings.MIN_VALUE_SQUARED) {
            var d = Math.sqrt(d2);
            this.m_normal.x = dX / d;
            this.m_normal.y = dY / d;
        } else {
            this.m_normal.x = 1.0;
            this.m_normal.y = 0.0;
        }
        this.m_points[0].x = 0.5 * (pointAX + pointBX);
        this.m_points[0].y = 0.5 * (pointAY + pointBY);
        this.m_separations[0] = dX * this.m_normal.x + dY * this.m_normal.y - cc.radius;
        break;
    case Box2D.Collision.b2Manifold.e_faceA:
        var tMat = cc.bodyA.m_xf.R;
        var tVec = cc.localPlaneNormal;
        this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        tMat = cc.bodyA.m_xf.R;
        tVec = cc.localPoint;
        planePointX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        planePointY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        tMat = cc.bodyB.m_xf.R;
        for (i = 0; i < cc.pointCount; i++) {
            tVec = cc.points[i].localPoint;
            clipPointX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            clipPointY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
            this.m_points[i].x = clipPointX;
            this.m_points[i].y = clipPointY;
        }
        break;
    case Box2D.Collision.b2Manifold.e_faceB:
        var tMat = cc.bodyB.m_xf.R;
        var tVec = cc.localPlaneNormal;
        this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        tMat = cc.bodyB.m_xf.R;
        tVec = cc.localPoint;
        planePointX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        planePointY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        tMat = cc.bodyA.m_xf.R;
        for (i = 0; i < cc.pointCount; i++) {
            tVec = cc.points[i].localPoint;
            clipPointX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            clipPointY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
            this.m_points[i].Set(clipPointX, clipPointY);
        }
        this.m_normal.x *= (-1);
        this.m_normal.y *= (-1);
        break;
    }
}

Box2D.Dynamics.Contacts.b2PositionSolverManifold.circlePointA = new Box2D.Common.Math.b2Vec2(0, 0);
Box2D.Dynamics.Contacts.b2PositionSolverManifold.circlePointB = new Box2D.Common.Math.b2Vec2(0, 0);
