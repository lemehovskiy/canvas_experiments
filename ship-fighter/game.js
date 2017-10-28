let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;


class Game {

    constructor() {

        let self = this;

        self.shipFighter = new ShipFighter();

        self.enemies = [];

        self.lives = 5;


        init();

        function init (){

            draw();

            createEnemies();

        }


        function draw() {

            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            self.shipFighter.draw();

            self.shipFighter.bullets.forEach(function (item, i) {

                if (item.y < 0) {
                    self.shipFighter.bullets.splice(i, 1);
                }

                else {
                    item.draw();
                }

            });

            self.enemies.forEach(function (item, i) {


                if (item.y > canvas.height) {
                    self.enemies.splice(i, 1);
                    self.lives--;

                }
                else {
                    item.draw();
                }

            })

            if (self.lives == 0) {
                restart();
            }

            updateScore();


            requestAnimationFrame(draw);
        }

        function restart(){

        }

        function createEnemies() {

            setInterval(function () {
                var enemy = new EnemiesShip();

                self.enemies.push(enemy);

            }, 2000)

        }

        function updateScore(){

            ctx.font = "20px Comic Sans MS";
            ctx.fillStyle = "red";
            // ctx.textAlign = "center";

            if (self.lives === 0) {
                restart();
            }

            ctx.fillText('Lives: ' + self.lives, 20, 20 + 10);
        }


        function restart (){
            self.lives = 5;
            self.enemies = [];

        }

    }


}


class ShipFighter {

    constructor() {

        this.bullets = [];

        this.shipColor = 'ff0000';

        this.height = 25;
        this.width = 20;

        this.x = canvas.width / 2 + this.width / 2;
        this.y = canvas.height - this.height;

        this.acceleration = 5;

    }


    draw() {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.fill();
    }


    move(direction) {

        if (direction == 'left') {
            this.x -= this.acceleration++;
        }

        if (direction == 'right') {
            this.x += this.acceleration++;
        }

    }

    shoot() {

        let bullet = new Bullet(this.x + (this.width / 2), this.y);

        this.bullets.push(bullet);

    }
}


class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 2;
    }

    draw() {
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(this.x, this.y--, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class EnemiesShip {
    constructor() {
        this.width = 10;
        this.height = 20;

        this.x = _.random(0, canvas.width - this.width);
        this.y = -this.height;
    }

    draw() {
        ctx.fillStyle = "#ff0000";
        ctx.rect(this.x, this.y++, this.width, this.height);
        ctx.stroke();
        ctx.fill();
    }
}


let ShipFighterGame = new Game();


document.addEventListener("keydown", function (e) {


    if (e.keyCode == 37) {
        ShipFighterGame.shipFighter.move('left');
    }

    else if (e.keyCode == 39) {
        ShipFighterGame.shipFighter.move('right');
    }

    if (e.keyCode == 32) {
        ShipFighterGame.shipFighter.shoot();
    }

});

document.addEventListener("keyup", function (e) {

    ShipFighterGame.shipFighter.acceleration = 1;

});