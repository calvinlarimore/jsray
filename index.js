// Constants
const SCREEN_WIDTH  = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

console.log("Screen Width: " + SCREEN_WIDTH.toString());
console.log("Screen Height: " + SCREEN_HEIGHT.toString());

const canvas = document.createElement("canvas");
canvas.setAttribute("width", SCREEN_WIDTH);
canvas.setAttribute("height", SCREEN_HEIGHT);
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

const TICK = 30;

const CELL_SIZE = 64;
const PLAYER_SIZE = 10;

const FOV = toRadians(60);

const COLORS = {
	floor: "#696969",
	ceiling: "#FFFFFF",
	wall: "#013AA6",
	wallDark: "#012975",
	rays: "#FF0000",
}

const map = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,0,1,1,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,1,1,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1],
	[1,0,0,1,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const SPRINT_MULTIPLIER = 2.0;

const player = {
	x: CELL_SIZE * 1.5,
	y: CELL_SIZE * 1.5,
	angle: toRadians(90),
	speed: 3,
	turnspeed: 1
}

const input = {
	w: false,
	a: false,
	s: false,
	d: false,
	j: false,
	l: false,
	shift: false
}

function clearScreen() {
	ctx.fillStyle = COLORS.ceiling;
	ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT / 2);
	ctx.fillStyle = COLORS.floor;
	ctx.fillRect(0, SCREEN_HEIGHT / 2, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function movePlayer() {
	let oldX = player.x;
	let oldY = player.y;

	if (input.j) { player.angle -= player.turnspeed * 0.05; }
	if (input.l) { player.angle += player.turnspeed * 0.05; }

	if (input.w) {
		if (input.shift && !input.s) {
			player.x += Math.cos(player.angle) * (player.speed * SPRINT_MULTIPLIER);
			player.y += Math.sin(player.angle) * (player.speed * SPRINT_MULTIPLIER);
		} else {
			player.x += Math.cos(player.angle) * player.speed;
			player.y += Math.sin(player.angle) * player.speed;
		}
	}
	if (input.s) {
		player.x += Math.cos(player.angle) * -player.speed;
		player.y += Math.sin(player.angle) * -player.speed;
	}
	if (input.a) {
		player.x += Math.cos(player.angle - Math.PI / 2) * (player.speed * 0.5);
		player.y += Math.sin(player.angle - Math.PI / 2) * (player.speed * 0.5);
	}
	if (input.d) {
		player.x += Math.cos(player.angle + Math.PI / 2) * (player.speed * 0.5);
		player.y += Math.sin(player.angle + Math.PI / 2) * (player.speed * 0.5);
	}

	if (map[Math.floor(player.y / CELL_SIZE)][Math.floor(player.x / CELL_SIZE)] == 1) {
		player.x = oldX;
		player.y = oldY;
	}
}

function outOfMapBounds(x, y) { return x < 0 || x >= map[0].length || y < 0 || y >= map.length; }
function distance(x1, y1, x2, y2) { return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); }

function getVerticalCollision(angle) {
	const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2);

	const firstX = right
		? Math.floor(player.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE
		: Math.floor(player.x / CELL_SIZE) * CELL_SIZE;

	const firstY = player.y + (firstX - player.x) * Math.tan(angle);

	const xStep = right ? CELL_SIZE : -CELL_SIZE;
	const yStep = xStep * Math.tan(angle);

	let wall;
	let nextX = firstX;
	let nextY = firstY;
	while (!wall) {
		const cellX = right
			? Math.floor(nextX / CELL_SIZE)
			: Math.floor(nextX / CELL_SIZE) - 1;
		const cellY = Math.floor(nextY / CELL_SIZE);

		if (outOfMapBounds(cellX, cellY)) {
 			break;
		}
		wall = map[cellY][cellX];
		if (!wall) {
			nextX += xStep;
			nextY += yStep;
		}
	}

	return { angle, distance: distance(player.x, player.y, nextX, nextY), vertical: true };
}

function getHorizontalCollision(angle) {
	const up = Math.abs(Math.floor(angle / Math.PI) % 2);
	const firstY = up
		? Math.floor(player.y / CELL_SIZE) * CELL_SIZE
		: Math.floor(player.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE;
	const firstX = player.x + (firstY - player.y) / Math.tan(angle);

	const yStep = up ? -CELL_SIZE : CELL_SIZE;
	const xStep = yStep / Math.tan(angle);

	let wall;
	let nextX = firstX;
	let nextY = firstY;
	while (!wall) {
		const cellX = Math.floor(nextX / CELL_SIZE);
		const cellY = up
			? Math.floor(nextY / CELL_SIZE) - 1
			: Math.floor(nextY / CELL_SIZE);

		if (outOfMapBounds(cellX, cellY)) {
			break;
		}

		wall = map[cellY][cellX];
		if (!wall) {
			nextX += xStep;
			nextY += yStep;
		}
	}

	return { angle, distance: distance(player.x, player.y, nextX, nextY), vertical: false };
}

function castRay(angle) {
	const verticalCollision   = getVerticalCollision(angle);
	const horizontalCollision = getHorizontalCollision(angle);

	return horizontalCollision.distance >= verticalCollision.distance ? verticalCollision : horizontalCollision;
}

function getRays() {
	const initialAngle = player.angle - FOV / 2;
	const rayCount = SCREEN_WIDTH;
	const step = FOV / rayCount;

	return Array.from({ length: rayCount }, (_, i) => {
		const angle = initialAngle + i * step;
		const ray = castRay(angle);
		return ray;
	});
}

function fixFishEye(distance, angle, playerAngle) {
	const diff = angle - playerAngle;
	return distance * Math.cos(diff);
}

function renderScene(rays) {
	rays.forEach((ray, i) => {
		const distance = fixFishEye(ray.distance, ray.angle, player.angle);
		const wallHeight = ((CELL_SIZE * 5) / distance) * 277;

		ctx.fillStyle = ray.vertical ? COLORS.wallDark : COLORS.wall;
		ctx.fillRect(i, SCREEN_HEIGHT / 2 - wallHeight / 2, 1, wallHeight);
	})
}

function renderMinimap(posX = 0, posY = 0, scale = 1, rays) {
	const cellSize = scale * CELL_SIZE;
	map.forEach((row, y) => {
		row.forEach((cell, x) => {
			if (cell) { ctx.fillStyle = "#FFFFFF"; }
			else { ctx.fillStyle = "#000000"; }

			ctx.fillRect(
				posX + x * cellSize,
				posY + y * cellSize,
				cellSize, cellSize
			);
		})
	});

	ctx.strokeStyle = COLORS.rays;
	rays.forEach(ray => {
		ctx.beginPath();
		ctx.moveTo(
			posX + player.x * scale,
			posY + player.y * scale
		);
		ctx.lineTo(
			posX + (player.x + Math.cos(ray.angle) * ray.distance) * scale,
			posY + (player.y + Math.sin(ray.angle) * ray.distance) * scale
		);
		ctx.closePath();
		ctx.stroke();
	});

	ctx.fillStyle = "#009900";
	ctx.fillRect(
		posX + player.x * scale - PLAYER_SIZE / 2,
		posY + player.y * scale - PLAYER_SIZE / 2,
		PLAYER_SIZE, PLAYER_SIZE
	);

	const rayLength = PLAYER_SIZE * 2;
	ctx.strokeStyle = "#009900";
	ctx.beginPath();
	ctx.moveTo(
		posX + player.x * scale,
		posY + player.y * scale
	);
	ctx.lineTo(
		posX + (player.x + Math.cos(player.angle) * rayLength) * scale,
		posY + (player.y + Math.sin(player.angle) * rayLength) * scale
	);
	ctx.closePath();
	ctx.stroke();
}

function gameLoop() {
	clearScreen();
	movePlayer();
	const rays = getRays();
	renderScene(rays);
	renderMinimap(0, 0, 0.1, rays);
}

setInterval(gameLoop, TICK);

function toRadians(deg) { return (deg * Math.PI) / 180; }

document.addEventListener("keydown", (e) => {
	/*
	if (e.key == "w") { player.speed =  1; }
	if (e.key == "s") { player.speed = -1; }
	if (e.key == "j") { player.turnspeed = -1; }
	if (e.key == "l") { player.turnspeed =  1; }
	if (e.key == "Shift") { player.sprinting = true }
	*/

	if      (e.code == "KeyW") { input.w = true; }
	else if (e.code == "KeyA") { input.a = true; }
	else if (e.code == "KeyS") { input.s = true; }
	else if (e.code == "KeyD") { input.d = true; }
	else if (e.code == "KeyJ") { input.j = true; }
	else if (e.code == "KeyL") { input.l = true; }
	else if (e.code == "ShiftLeft") { input.shift = true; }
});

document.addEventListener("keyup", (e) => {
	/*
	if (e.key == "w") { player.speed = 0; }
	if (e.key == "s") { player.speed = 0; }
	if (e.key == "j") { player.turnspeed = 0; }
	if (e.key == "l") { player.turnspeed = 0; }
	if (e.key == "Shift") { player.sprinting = false }
	*/

	if      (e.code == "KeyW") { input.w = false; }
	else if (e.code == "KeyA") { input.a = false; }
	else if (e.code == "KeyS") { input.s = false; }
	else if (e.code == "KeyD") { input.d = false; }
	else if (e.code == "KeyJ") { input.j = false; }
	else if (e.code == "KeyL") { input.l = false; }
	else if (e.code == "ShiftLeft") { input.shift = false; }
});

/*
document.addEventListener("mousemove", (e) => {
	player.angle += toRadians(e.movementX);
});
*/
