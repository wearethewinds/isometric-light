const AssetManager = {

    obj: [],

    addObj: (obj) => {
        AssetManager.obj.push(obj);
    },

    getObj: (x, y, filter) => {
        const list = AssetManager.obj.filter(obj => {
            return obj.collide(x, y);
        });

        if (!filter) {
            return list;
        }
        return list.filter(filter);
    }
};

class Ground {
    constructor(x, y, color) {
        this.x           = x;
        this.y           = y;
        this.color       = color || 'rgba(0,0,0,1)';
        this.passable    = true;
        this.breaksLight = false;
        this.isDirty     = true;
    }

    render(ctx) {
        if (!this.isDirty) {
            return;
        }
        this.isDirty = false;
        const newX   = (this.x - this.y) * (TILE_LENGTH / 2) + xOffset;
        const newY   = (this.x + this.y) * (TILE_HEIGHT / 2) + yOffset;

        const transformedX = newX;
        const transformedY = newY;

        ctx.fillStyle = '#000000';
        ctx.lineWidth = 0;

        ctx.moveTo(transformedX, transformedY);
        ctx.lineTo(transformedX + (.5 * TILE_LENGTH), transformedY + (.5 * TILE_HEIGHT));
        ctx.lineTo(transformedX, transformedY + TILE_HEIGHT);
        ctx.lineTo(transformedX - (.5 * TILE_LENGTH), transformedY + (.5 * TILE_HEIGHT));
        ctx.lineTo(transformedX, transformedY);
    }

    collide(x, y) {
        return x >= this.x && x < this.x + TILE_LENGTH && y >= this.y && y < this.y + TILE_HEIGHT;
    }
}

class Tower {
    constructor(x, y, width, length, height, color, tickFn) {
        this.x           = x;
        this.y           = y;
        this.width       = width || 70;
        this.length      = length || 35;
        this.height      = height || Math.floor(Math.random() * 40);
        this.color       = color || 'rgba(0,0,0,1)';
        this.passable    = false;
        this.breaksLight = true;
        this.isDirty     = true;
        this.tick = tickFn || null;
    }

    render(ctx) {
        if (!this.isDirty) {
            return;
        }
        this.isDirty = false;
        const newX   = this.x * (TILE_LENGTH / 2);
        const newY   = this.y * TILE_HEIGHT;

        const transformedX = newX - newY + xOffset;
        const transformedY = ((newX + newY) / 2) + yOffset;

        ctx.fillStyle = this.color;
        let bY        = transformedY + .5 * this.length;
        let bX        = transformedX - .5 * this.width;

        while (bY <= transformedY + this.length || bX <= transformedX) {
            let yOffset = 2 * (bY - (transformedY + .5 * this.length));
            for (let bHeight = this.height + yOffset; bHeight >= 0; --bHeight) {
                ctx.fillRect(bX, bY - bHeight, 1, 1);

            }

            bY += .5;
            bX += 1;
        }

        bY = transformedY + this.length;
        bX = transformedX;

        while (bY >= transformedY + .5 * this.length || bX <= transformedX + .5 * this.width) {
            let yOffset = 2 * (bY - (transformedY + .5 * this.length));
            for (let bHeight = this.height + yOffset; bHeight >= 0; --bHeight) {
                ctx.fillRect(bX, bY - bHeight, 1, 1);

            }

            bY -= .5;
            bX += 1;
        }

    }

    collide(x, y) {
        return (x >= this.x && x < this.x + (this.width / TILE_LENGTH) && y >= this.y && y < this.y + (this.length / TILE_HEIGHT));
    }
}


const screenWidth  = 640;
const screenHeight = 480;

const xOffset = 300;
const yOffset = 100;

AssetManager.addObj(new Tower(2, 2, 30, 15, null, null, (self, time) => {
    if (!self.velocity) {
        self.velocity = 1;
    }


    const designatedX = self.x + (self.velocity * time);

    const hitPoints = [
        [designatedX, self.y],
        [designatedX + (self.width / TILE_LENGTH), self.y],
        [designatedX, self.y + (self.length / TILE_HEIGHT)],
        [designatedX + (self.width / TILE_LENGTH), self.y + (self.length / TILE_HEIGHT)],
    ];

    for (let i = hitPoints.length - 1; i >= 0; --i) {
        if (hitPoints[i][0] <= 0 || hitPoints[i][0] >= MAP_LENGTH) {
            self.velocity *= -1;

            return;
        }

        const objs = AssetManager.getObj(hitPoints[i][0], hitPoints[i][1], (obj) => {
            return obj !== self && !obj.passable;
        });

        if (objs.length > 0) {
            self.velocity *= -1;

            return;
        }
    }

    self.x = designatedX;
}));

AssetManager.addObj(new Tower(2.7, 2, 20, 10, null, null,  (self, time) => {
    if (!self.velocity) {
        self.velocity = 1;
    }


    const designatedY = self.y + (self.velocity * time);

    const hitPoints = [
        [self.x, designatedY],
        [self.x + (self.width / TILE_LENGTH), designatedY + (self.length / TILE_HEIGHT)],
        [self.x, designatedY, self.y + (self.length / TILE_HEIGHT)],
        [self.x + (self.width / TILE_LENGTH), designatedY + (self.length / TILE_HEIGHT)],
    ];

    for (let i = hitPoints.length - 1; i >= 0; --i) {
        if (hitPoints[i][1] <= 0 || hitPoints[i][1] >= MAP_HEIGHT) {
            self.velocity *= -1;

            return;
        }

        const objs = AssetManager.getObj(hitPoints[i][0], hitPoints[i][1], (obj) => {
            return obj !== self && !obj.passable;
        });

        if (objs.length > 0) {
            self.velocity *= -1;

            return;
        }
    }

    self.y = designatedY;
}));
AssetManager.addObj(new Tower(3.3, 2, 30, 15, null, null,  (self, time) => {
    if (!self.velocity) {
        self.velocity = .5;
    }


    const designatedX = self.x + (self.velocity * time);

    const hitPoints = [
        [designatedX, self.y],
        [designatedX + (self.width / TILE_LENGTH), self.y],
        [designatedX, self.y + (self.length / TILE_HEIGHT)],
        [designatedX + (self.width / TILE_LENGTH), self.y + (self.length / TILE_HEIGHT)],
    ];

    for (let i = hitPoints.length - 1; i >= 0; --i) {
        if (hitPoints[i][0] <= 0 || hitPoints[i][0] >= MAP_LENGTH) {
            self.velocity *= -1;

            return;
        }

        const objs = AssetManager.getObj(hitPoints[i][0], hitPoints[i][1], (obj) => {
            return obj !== self && !obj.passable;
        });

        if (objs.length > 0) {
            self.velocity *= -1;

            return;
        }
    }

    self.x = designatedX;
}));
AssetManager.addObj(new Tower(3, 3, 20, 10, null, null,  (self, time) => {
    if (!self.velocity) {
        self.velocity = 2;
    }


    const designatedX = self.x + (self.velocity * time);

    const hitPoints = [
        [designatedX, self.y],
        [designatedX + (self.width / TILE_LENGTH), self.y],
        [designatedX, self.y + (self.length / TILE_HEIGHT)],
        [designatedX + (self.width / TILE_LENGTH), self.y + (self.length / TILE_HEIGHT)],
    ];

    for (let i = hitPoints.length - 1; i >= 0; --i) {
        if (hitPoints[i][0] <= 0 || hitPoints[i][0] >= MAP_LENGTH) {
            self.velocity *= -1;

            return;
        }

        const objs = AssetManager.getObj(hitPoints[i][0], hitPoints[i][1], (obj) => {
            return obj !== self && !obj.passable;
        });

        if (objs.length > 0) {
            self.velocity *= -1;

            return;
        }
    }

    self.x = designatedX;
}));
AssetManager.addObj(new Tower(0, 5, 70, 35, 35));
AssetManager.addObj(new Tower(1, 5, 70, 35, 35));

const MAP_LENGTH = 7;
const MAP_HEIGHT = 7;

for (let x = 0; x < MAP_LENGTH; ++x) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        AssetManager.addObj(new Ground(x, y));
    }
}

const keyMap = {};

const keyCodes = {
    W: 87,
    A: 65,
    S: 83,
    D: 68
};

const TILE_LENGTH = 70;
const TILE_HEIGHT = 35;

const PLAYER_WIDTH  = 30;
const PLAYER_HEIGHT = 15;

const canvas  = document.getElementById('iso');
canvas.width  = screenWidth;
canvas.height = screenHeight;

const toRadians = (deg) => {
    return deg / 180 * Math.PI;
};

const toDegree = (rad) => {
    return rad * 180 / Math.PI;
};

const getProjectedAngle = (playerAngle) => {
    const projectedAngle = toDegree(Math.atan(Math.tan(toRadians(playerAngle - 45)) / 2));

    if (playerAngle > 135 && playerAngle < 315) {
        return toDegree(toRadians(projectedAngle) + Math.PI);
    }

    return projectedAngle;
};


let playerPositionX = 2;
let playerPositionY = 4;
let playerSpeed     = 5;
let playerAngle     = 270;
let projectedAngle  = getProjectedAngle(playerAngle);

const ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';

const setPlayer = (x, y) => {
    const hitPoints = [
        [x, y],
        [x + (PLAYER_WIDTH / TILE_LENGTH), y],
        [x, y + (PLAYER_HEIGHT / TILE_HEIGHT)],
        [x + (PLAYER_WIDTH / TILE_LENGTH), y + (PLAYER_HEIGHT / TILE_HEIGHT)]
    ];

    const designatedXPosition = Math.min(Math.max(0, x), MAP_LENGTH - (PLAYER_WIDTH / TILE_LENGTH));
    const designatedYPosition = Math.min(Math.max(0, y), MAP_HEIGHT - (PLAYER_HEIGHT / TILE_HEIGHT));

    for (let i = hitPoints.length - 1; i >= 0; --i) {
        const designatedXPosition = Math.min(Math.max(0, hitPoints[i][0]), MAP_LENGTH - (PLAYER_WIDTH / TILE_LENGTH));
        const designatedYPosition = Math.min(Math.max(0, hitPoints[i][1]), MAP_HEIGHT - (PLAYER_HEIGHT / TILE_HEIGHT));

        const objs = AssetManager.getObj(designatedXPosition, designatedYPosition);

        for (let i = 0; i < objs.length; ++i) {
            if (!objs[i].passable) {
                return;
            }
        }
    }

    [
        [playerPositionX, playerPositionY],
        [playerPositionX + (PLAYER_WIDTH / TILE_LENGTH), playerPositionY],
        [playerPositionX, playerPositionY + (PLAYER_HEIGHT / TILE_HEIGHT)],
        [playerPositionX + (PLAYER_WIDTH / TILE_LENGTH), playerPositionY + (PLAYER_HEIGHT / TILE_HEIGHT)]
    ].forEach(pos => {
        AssetManager.getObj(pos[0], pos[1]).forEach(obj => {
            obj.isDirty = true;
        });
    });


    playerPositionX = designatedXPosition;
    playerPositionY = designatedYPosition;

};

let now1 = Date.now();
let now2 = Date.now();

window.addEventListener('keydown', (e) => {
    keyMap[e.keyCode] = true;
}, false);

window.addEventListener('keyup', (e) => {
    keyMap[e.keyCode] = false;
}, false);

const isKeyPressed = (keyCode) => {
    return !!keyMap[keyCode];
};

const draw = function () {

    now2              = Date.now();
    const elapsedTime = (now2 - now1) / 1000;
    now1              = now2;

    if (isKeyPressed(keyCodes.A)) {
        playerAngle = (playerAngle + (50 * elapsedTime)) % 360;

        projectedAngle = getProjectedAngle(playerAngle);
    }

    if (isKeyPressed(keyCodes.S)) {
        const x = playerPositionX + ((playerSpeed * elapsedTime) * Math.cos((playerAngle / 180) * Math.PI));
        const y = playerPositionY - ((playerSpeed * elapsedTime) * Math.sin((playerAngle / 180) * Math.PI));
        setPlayer(x, y);
    }

    if (isKeyPressed(keyCodes.D)) {
        const newAngleDifference = (50 * elapsedTime);

        playerAngle    = (360 - ((360 - (playerAngle - newAngleDifference)) % 360));
        projectedAngle = getProjectedAngle(playerAngle);
    }

    if (isKeyPressed(keyCodes.W)) {
        const x = playerPositionX - ((playerSpeed * elapsedTime) * Math.cos((playerAngle / 180) * Math.PI));
        const y = playerPositionY + ((playerSpeed * elapsedTime) * Math.sin((playerAngle / 180) * Math.PI));
        setPlayer(x, y);
    }

    ctx.beginPath();

    AssetManager.obj.filter(obj => obj instanceof Ground).forEach(obj => {
        obj.tick && obj.tick(obj, elapsedTime);
        obj.render(ctx);
    });

    ctx.fill();

    ctx.fillStyle = '#781123';
    ctx.beginPath();

    const newX         = playerPositionX * (TILE_LENGTH / 2);
    const newY         = playerPositionY * TILE_HEIGHT;
    const transformedX = newX - newY + xOffset;
    const transformedY = ((newX + newY) / 2) + yOffset;

    /*ctx.moveTo(transformedX, transformedY);
    ctx.lineTo(transformedX + (.5 * PLAYER_WIDTH), transformedY + (.5 * PLAYER_HEIGHT));
    ctx.lineTo(transformedX, transformedY + PLAYER_HEIGHT);
    ctx.lineTo(transformedX - (.5 * PLAYER_WIDTH), transformedY + (.5 * PLAYER_HEIGHT));
    ctx.lineTo(transformedX, transformedY);*/

    ctx.fill();


    const LIGHT_DISTANCE = 150;
    const LIGHT_ANGLE    = 90;
    for (let lAngle = projectedAngle - (.5 * LIGHT_ANGLE); lAngle <= projectedAngle + (.5 * LIGHT_ANGLE); lAngle = lAngle + .5) {
        let rayStart = 0;

        const rays       = [];

        for (let lDistance = 1; lDistance <= LIGHT_DISTANCE; lDistance += 1) {

            const screenX = transformedX - (lDistance * Math.cos(lAngle / 180 * Math.PI));
            const screenY = transformedY + (.5 * PLAYER_HEIGHT) + (lDistance * Math.sin(lAngle / 180 * Math.PI));

            const mapPosX = ((screenX - xOffset) / TILE_LENGTH) + ((screenY - yOffset) / TILE_HEIGHT);
            const mapPosY = ((screenY - yOffset) / TILE_HEIGHT) - ((screenX - xOffset) / TILE_LENGTH);

            if (mapPosX < 0 || mapPosY < 0 || mapPosX > MAP_LENGTH || mapPosY > MAP_HEIGHT) {
                rays.push([rayStart, lDistance]);
                break;
            }

            const list = AssetManager.getObj(mapPosX, mapPosY);

            list.forEach(obj => {
                obj.isDirty = true;
            });

            const lightStopList = list.filter(obj => {
                return obj.breaksLight;
            });

            if (lightStopList.length > 0) {
                if (lDistance > rayStart) {
                    rays.push([rayStart, lDistance]);
                }

                lightStopList.forEach(obj => {
                        ctx.fillStyle = 'rgba(135, 135, 0, .4)';
                        ctx.fillRect(screenX, screenY - obj.height, 1, obj.height);
                });

                break;
            }


            if (lDistance === LIGHT_DISTANCE && rayStart < lDistance) {
                rays.push([rayStart, lDistance]);
            }
        }

        ctx.beginPath();

        rays.forEach(ray => {
            const gradBeginningX = transformedX;
            const gradBeginningY = transformedY;
            const beginningX     = transformedX - (ray[0] * Math.cos(lAngle / 180 * Math.PI));
            const beginningY     = transformedY + (.5 * PLAYER_HEIGHT) + (ray[0] * Math.sin(lAngle / 180 * Math.PI));
            const gradDestX      = transformedX - (LIGHT_DISTANCE * Math.cos(lAngle / 180 * Math.PI));
            const gradDestY      = transformedY + (.5 * PLAYER_HEIGHT) + (LIGHT_DISTANCE * Math.sin(lAngle / 180 * Math.PI));
            const destX          = transformedX - (ray[1] * Math.cos(lAngle / 180 * Math.PI));
            const destY          = transformedY + (.5 * PLAYER_HEIGHT) + (ray[1] * Math.sin(lAngle / 180 * Math.PI));

            const gradient = ctx.createLinearGradient(gradBeginningX, gradBeginningY, gradDestX, gradDestY);

            gradient.addColorStop(0, 'rgba(135, 135, 0, 1');
            gradient.addColorStop(1, 'rgba(135, 135, 0, 0');
            ctx.strokeStyle = gradient;

            ctx.moveTo(beginningX, beginningY);
            ctx.lineTo(destX, destY);
        });
        ctx.stroke();
    }

    AssetManager.obj.filter(obj => !(obj instanceof Ground)).forEach(obj => {
        obj.tick && obj.tick(obj, elapsedTime);
        obj.render(ctx);
    });


    requestAnimationFrame(draw);
};

requestAnimationFrame(draw);
