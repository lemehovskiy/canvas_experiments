window.onblur = function () {
    window.blurred = true;
};
window.onfocus = function () {
    window.blurred = false;
};

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 500;


class Game {

    constructor() {

        let self = this;

        self.shipFighter = new ShipFighter();

        self.enemies = [];

        self.lives = 5;

        self.score = 0;

        init();

        function init() {

            draw();

            createEnemies();

        }

        self.controls();


        function draw() {

            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            self.shipFighter.draw();

            self.shipFighter.bullets.forEach(function (bullet, bullet_index) {


                self.enemies.forEach(function (enemy, enemy_index) {
                    if (
                        bullet.x > enemy.x &&
                        bullet.x < enemy.x + enemy.width &&
                        bullet.y <= enemy.y + enemy.height &&
                        bullet.y > enemy.y

                    ) {
                        self.enemies.splice(enemy_index, 1);
                        self.shipFighter.bullets.splice(bullet_index, 1);

                        self.score += 10;

                        updateScore();
                    }
                });


                if (bullet.y < 0) {
                    self.shipFighter.bullets.splice(bullet_index, 1);
                }

                else {
                    bullet.draw();
                }

            });

            self.enemies.forEach(function (enemy, i) {
                if (enemy.y > canvas.height) {
                    self.enemies.splice(i, 1);
                    self.lives--;

                }
                else {
                    enemy.draw();
                }
            })

            if (self.lives == 0) {
                restart();
            }

            updateLives();

            updateScore();


            requestAnimationFrame(draw);
        }


        function createEnemies() {

            let emenies_interval = setInterval(function () {

                if (window.blurred) {
                    return;
                }

                let enemy = new EnemiesShip();

                self.enemies.push(enemy);

            }, 2000)


        }

        function updateLives() {

            ctx.font = "20px Comic Sans MS";
            ctx.fillStyle = "red";
            ctx.textAlign = "start";

            if (self.lives === 0) {
                restart();
            }

            ctx.fillText('Lives: ' + self.lives, 20, 30);
        }

        function updateScore() {

            ctx.font = "20px Comic Sans MS";
            ctx.fillStyle = "red";
            ctx.textAlign = "end";

            ctx.fillText('Score: ' + self.score, canvas.width - 20, 30);
        }


        function restart() {
            self.lives = 5;
            self.score = 0;
            self.enemies = [];

        }

    }

    controls() {


        document.addEventListener("keydown", function (e) {

            switch (e.keyCode) {
                case 37:
                    ShipFighterGame.shipFighter.move('left');
                    break;
                case 39:
                    ShipFighterGame.shipFighter.move('right');
                    break;
                case 32:
                    ShipFighterGame.shipFighter.shoot();
                    break;
            }
        });

        document.addEventListener("keyup", function (e) {

            if (e.keyCode == 37 || e.keyCode == 39) {
                ShipFighterGame.shipFighter.stop();
            }

        });
    }


}


class ShipFighter {

    constructor() {

        let self = this;

        this.bullets = [];

        this.shipColor = 'ff0000';

        this.height = 25;
        this.width = 20;

        this.x = canvas.width / 2 + this.width / 2;
        this.y = canvas.height - this.height;


        self.stop_timeout = null;

        self.acceleration = 0;

        self.max_speed = 5;

        self.velocity = 0.6;

        self.stop_interval = null;
        // this.acceleration = 5;

    }


    draw() {

        let self = this;

        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.fill();


        self.x += self.acceleration;


    }

    stop() {

        let self = this;
        TweenMax.to(self, 0.5, {acceleration: 0});

    }


    move(direction) {

        let self = this;


        if (direction == 'left') {
            TweenMax.to(self, 1, {acceleration: -5});
        }

        else if (direction == 'right') {
            TweenMax.to(self, 1, {acceleration: 5});
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
        this.size = 20;
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

