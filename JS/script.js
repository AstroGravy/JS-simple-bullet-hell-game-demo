
let player = document.getElementById("player");
x = window.innerWidth / 2 - 15; 
y = window.innerHeight / 2 - 15;
let speed = 4;
const size = 50;

const keys = {}; // track pressed keys in a dictionary format
const projectiles = [];
// key presses
document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Create projectiles
function createProjectile(xChose, negative) {
    let proj = document.createElement("div");
    proj.classList.add("projectile"); // add the class
    document.body.appendChild(proj); // put it in the body html

    proj.direction = "";

    let startx = 0, starty = 0;
    if (xChose && negative) {
        startx = window.innerWidth + 30;
        proj.direction = "l";
    }
    else if (xChose && (!negative)) {
        startx = -30;
        proj.direction = "r";
    }
    else if ((!xChose) && negative) {
        starty = window.innerHeight + 30;
        proj.direction = "u";
    }
    else if ((!xChose) && (!negative)) {
        starty = -30;
        proj.direction = "d";
    }

    // start randomly at chosen edge
    if (xChose) {
        proj.y = Math.random() * (window.innerWidth - 30);
        proj.x = startx;
    }
    else if (!xChose) {
        proj.x = Math.random() * (window.innerWidth - 30);
        proj.y = starty;
    }
    proj.speed = 3 + Math.random() * 3; // random fall speed
    proj.style.left = proj.x + "px";
    proj.style.top = proj.y + "px";
    projectiles.push(proj);
}
// Check collision between player and projectile
function isColliding(a, b) {
    return !(
    a.x + a.width < b.x ||
    a.x > b.x + b.width ||
    a.y + a.height < b.y ||
    a.y > b.y + b.height
    );
}

function gameLoop() { // this is the game loop! where we check everything
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size;

    // Prevent going out of bounds
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;

    // check keys
    if (keys["arrowup"] || keys["w"]) y -= speed;
    if (keys["arrowdown"] || keys["s"]) y += speed;
    if (keys["arrowleft"] || keys["a"]) x -= speed;
    if (keys["arrowright"] || keys["d"]) x += speed;

    player.style.left = x + "px";
    player.style.top = y + "px";

    // Move projectiles
    projectiles.forEach((p, i) => { // i is index
        if (p.direction === "l") {
            p.x -= p.speed;
        }
        else if (p.direction === "r") {
            p.x += p.speed;
        }
        else if (p.direction === "u") {
            p.y -= p.speed;
        }
        else if (p.direction === "d") {
            p.y += p.speed;
        }
        p.style.top = p.y + "px";
        p.style.left = p.x + "px";

        // Remove if off-screen
        
        if (p.y > window.innerHeight + 30 || p.y < -30 || p.x > window.innerWidth + 30 || p.x < -30) {
            p.remove();
            projectiles.splice(i, 1); // splice is remove
        }
        

        // Collision detection
        const rect1 = { x, y, width: size, height: size };
        const rect2 = { x: p.x, y: p.y, width: 30, height: 30 };

        if (isColliding(rect1, rect2)) {
            player.style.backgroundColor = "red";
            setTimeout(() => player.style.backgroundColor = "cyan", 200);
            // reset player position
            x = window.innerWidth / 2 - 15; 
            y = window.innerHeight / 2 - 15;
            console.log("You died!");
        }
    });

    requestAnimationFrame(gameLoop);
}
// Spawn projectiles every second or 1000ms
//setInterval(createProjectile(true, true), 500); these dont work for some reason
//setInterval(createProjectile(true, false), 500);
setInterval(function() { createProjectile(true, true); }, 500);
setInterval(function() { createProjectile(true, false); }, 500);
setInterval(function() { createProjectile(false, true); }, 500);
setInterval(function() { createProjectile(false, false); }, 500);


gameLoop(); // start the loop