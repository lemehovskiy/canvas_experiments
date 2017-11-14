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

            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);


            self.shipFighter.draw();

            render_bullets();

            render_enemies();


            updateLives();

            updateScore();

            if (self.lives == 0) {
                restart();
            }

            requestAnimationFrame(draw);
        }

        function render_enemies() {

            self.enemies.forEach(function (enemy, i) {
                enemy.draw();

                if (enemy.y > canvas.height) {
                    self.enemies.splice(i, 1);
                    self.lives--;

                }
            })
        }

        function render_bullets() {
            self.shipFighter.bullets.forEach(function (bullet, bullet_index) {

                bullet.draw();

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


            });

        }


        function createEnemies() {

            let enemy = new EnemiesShip();
            self.enemies.push(enemy);

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
            ctx.fillStyle = "green";
            ctx.textAlign = "start";

            if (self.lives === 0) {
                restart();
            }

            ctx.fillText('Lives: ' + self.lives, 20, 30);
        }

        function updateScore() {

            ctx.font = "20px Comic Sans MS";
            ctx.fillStyle = "green";
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

        self.bullets = [];

        self.shipColor = '#ffff11';

        self.height = 25;
        self.width = 20;

        self.x = canvas.width / 2 + this.width / 2;
        self.y = canvas.height - this.height;

        self.acceleration = 0;

    }


    draw() {

        let self = this;


        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();

        ctx.fillStyle = self.shipColor;
        ctx.fill();

        console.log(self.x);

        if (self.x < -self.width / 2 - +self.acceleration) {
            self.x = -self.width / 2;
        }

        else if (self.x > canvas.width - self.width / 2 + self.acceleration) {
            self.x = canvas.width - self.width / 2 + self.acceleration;
        }


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

        let self = this;

        self.x = x;
        self.y = y;
        self.size = 2;

        self.color = "#ffffff";
    }

    draw() {

        let self = this;

        self.y -= 3;

        ctx.beginPath();
        ctx.arc(self.x, self.y, self.size, 0, 2 * Math.PI);
        ctx.closePath();

        ctx.fillStyle = self.color;
        ctx.fill();
    }
}

class EnemiesShip {
    constructor() {

        let self = this;

        self.width = 10;
        self.height = 20;

        self.color = "#FF0000";

        self.x = _.random(0, canvas.width - self.width);
        self.y = -self.height;
    }

    draw() {

        let self = this;

        ctx.beginPath();
        ctx.rect(self.x, self.y++, self.width, self.height);
        ctx.closePath();

        ctx.fillStyle = self.color;
        ctx.fill();
    }
}


let ShipFighterGame = new Game();

