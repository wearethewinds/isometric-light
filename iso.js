const screenWidth  = 640;
const screenHeight = 480;

const xOffset = 300;
const yOffset = 100;

let map = 'XXXXX';
map += 'XXXXX';
map += 'XXXXX';
map += 'XXXXX';
map += 'XXXXX';

const keyMap = {};

const keyCodes = {
    W: 87,
    A: 65,
    S: 83,
    D: 68
};

const MAP_LENGTH = 5;
const MAP_HEIGHT = 5;

const TILE_LENGTH = 70;
const TILE_HEIGHT = 35;

const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 15;

const canvas  = document.getElementById('iso');
canvas.width  = screenWidth;
canvas.height = screenHeight;


let playerPositionX = 0;
let playerPositionY = 0;
let playerSpeed = 5;

const ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';

const getMapItem = (x, y) => {
    if (x >= MAP_LENGTH || y >= MAP_HEIGHT) {
        return null;
    }

    return map[x + (y * MAP_LENGTH)];
};

const setPlayer = (x, y) => {
    playerPositionX = Math.min(Math.max(0, x), MAP_LENGTH - (PLAYER_WIDTH / TILE_LENGTH));
    playerPositionY = Math.min(Math.max(0, y), MAP_HEIGHT - (PLAYER_HEIGHT / TILE_HEIGHT));
}

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

const isActiveTile = (playerX, playerY, tileX, tileY) => {
    return (playerX >= tileX && playerX < tileX + 1 && playerY >= tileY && playerY < tileY + 1);
}

const draw = function () {

    now2              = Date.now();
    const elapsedTime = (now2 - now1) / 1000;
    now1              = now2;

    if (isKeyPressed(keyCodes.D)) {
        setPlayer(playerPositionX + (playerSpeed * elapsedTime), playerPositionY);
    }

    if (isKeyPressed(keyCodes.S)) {
        setPlayer(playerPositionX, playerPositionY + (playerSpeed * elapsedTime));
    }

    if (isKeyPressed(keyCodes.A)) {
        setPlayer(playerPositionX - (playerSpeed * elapsedTime), playerPositionY);
    }

    if (isKeyPressed(keyCodes.W)) {
        setPlayer(playerPositionX, playerPositionY - (playerSpeed * elapsedTime));
    }

    ctx.clearRect(0, 0, 1920, 1080);

    for (let y = 0; y < MAP_HEIGHT; ++y) {
        for (let x = 0; x < MAP_LENGTH; ++x) {
            if (getMapItem(x, y) === 'X') {

                const newX = x * (TILE_LENGTH / 2);
                const newY = y * TILE_HEIGHT;

                const transformedX = newX - newY + xOffset;
                const transformedY = ((newX + newY) / 2) + yOffset;

                const isActive = isActiveTile(playerPositionX, playerPositionY, x, y);
                
                ctx.strokeStyle = isActive ? '#AA5633' : '#000000';
                ctx.lineWidth = isActive ? 5 : 1;

                ctx.beginPath();
                ctx.moveTo(transformedX, transformedY);
                ctx.lineTo(transformedX + (.5 * TILE_LENGTH), transformedY + (.5 * TILE_HEIGHT));
                ctx.lineTo(transformedX, transformedY + TILE_HEIGHT);
                ctx.lineTo(transformedX - (.5 * TILE_LENGTH), transformedY + (.5 * TILE_HEIGHT));
                ctx.lineTo(transformedX, transformedY);
ctx.stroke();

//ctx.fillText(`(${transformedX}, ${transformedY})`, transformedX, transformedY)
            }
        }  
    }

    ctx.strokeStyle = '#781123';
    ctx.beginPath();

    const newX = playerPositionX * (TILE_LENGTH / 2);
    const newY = playerPositionY * TILE_HEIGHT;
    const transformedX = newX - newY + xOffset;
    const transformedY = ((newX + newY) / 2) + yOffset;

    ctx.lineWidth = 5;
    ctx.moveTo(transformedX, transformedY);
    ctx.lineTo(transformedX + (.5 * PLAYER_WIDTH), transformedY + (.5 * PLAYER_HEIGHT));
    ctx.lineTo(transformedX, transformedY + PLAYER_HEIGHT);
    ctx.lineTo(transformedX - (.5 * PLAYER_WIDTH), transformedY + (.5 * PLAYER_HEIGHT));
    ctx.lineTo(transformedX, transformedY);

    ctx.stroke();
    

    requestAnimationFrame(draw);
};

requestAnimationFrame(draw);
