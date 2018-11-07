const GRID_WIDTH = 35;
const GRID_HEIGHT = 50;
const INTERVAL = 200;
const rootElement = document.getElementById("background");

function Square(x, y, element) {
    this.x = x;
    this.y = y;
    this.active = false;
    this.element = element;
	this.timeout = 1500;

    this.trigger = () => {
        this.element.classList.remove("inactive");
        this.element.classList.add("active");
        this.active = true;
    };

    this.kill = () => {
        this.element.classList.remove("active");
        this.element.classList.add("inactive");
        this.active = false;
    };

	this.element.addEventListener("click", this.trigger);
}

const squares = [];

function init() {
    for (let x = 0; x < GRID_WIDTH; x++) {
        squares.push([]);

        for (let y = 0; y < GRID_HEIGHT; y++) {
            const element = document.createElement("div");
            element.setAttribute("class", "box");
            element.setAttribute("style", `top: ${x * 20}px; left: ${y * 20}px`);

            rootElement.appendChild(element);
            squares[x].push(new Square(x, y, element));
        }
    }
}

function getNeighbours(square) {
	const neighbours = [];
	const x = square.x;
	const y = square.y;

	if (x > 0) {
		neighbours.push(squares[x - 1][y]);

		if (y > 0) {
			neighbours.push(squares[x - 1][y - 1]);
		}
	}
	if (y > 0) {
		neighbours.push(squares[x][y - 1]);
	}

	if (x < GRID_WIDTH - 1) {
		neighbours.push(squares[x + 1][y]);

		if (y > 0) {
			neighbours.push(squares[x + 1][y - 1]);
		}
	}

	if (y < GRID_HEIGHT - 1) {
		neighbours.push(squares[x][y + 1]);

		if (x > 0) {
			neighbours.push(squares[x - 1][y + 1]);
		}

		if (x < GRID_WIDTH - 1) {
			neighbours.push(squares[x + 1][y + 1]);
		}
	}

	return neighbours;
}

function updateState() {
	const activeSquares = [];
	const next = {
		activeSquares: [],
		inactiveSquares: []
	}

	squares.forEach((row) => row
		.filter((square) => square.active)
		.forEach((square) => activeSquares.push(square))
	);

	activeSquares.forEach((square) => {
		const neighbours = getNeighbours(square);
		const activeNeighboursCount = neighbours.filter(n => n.active).length;


		if (activeNeighboursCount < 2 || activeNeighboursCount > 3) {
			next.inactiveSquares.push(square);
		}

		neighbours.forEach((neighbour) => {
			if(getNeighbours(neighbour).filter((nn) => nn.active).length === 3) {
				next.activeSquares.push(neighbour)
			}
		})
	});

	next.activeSquares.forEach((square) => square.trigger());
	next.inactiveSquares.forEach((square) => square.kill());
}

let interval;

function toggleLife() {
	if (!interval) {
		interval = setInterval(updateState, INTERVAL);
		document.getElementById("toggle-button").innerHTML = "止まる";
	} else {
		clearInterval(interval);
		interval = null;
		document.getElementById("toggle-button").innerHTML = "始める";
	}

}

document.getElementById("toggle-button").addEventListener("click", toggleLife);

function resetLife() {
	squares.forEach(row => row
		.filter(square => square.active)
		.forEach(square => square.kill())
	);
}

document.getElementById("reset-button").addEventListener("click", resetLife);

init();
