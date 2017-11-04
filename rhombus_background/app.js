let canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");


canvas.width = 800;
canvas.height = 800;

document.body.appendChild(canvas);

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);



class Rhombus_Grid{

    constructor(){
        let self = this;

        self.grid_size = 20;
        self.rhombus_arr = [];
        self.rhombus_width = 100;
        self.rhombus_height = 50;

        self.draw_grid();

    }

    draw_grid(){

        let self = this;

        let offset_x = 0;
        let offset_y = -self.rhombus_height / 2;

        let grid_x = 0;
        let grid_y = -1;

        let row = 0;
        //switch between rows
        while (row < self.grid_size) {

            //draw row
            for (let i = 0; i < self.grid_size; i++) {
                let rhombus = new Rhombus({
                    x: offset_x,
                    y: offset_y,
                    width: self.rhombus_width,
                    height: self.rhombus_height,
                    color: '#'+Math.floor(Math.random()*16777215).toString(16)
                });

                offset_x += self.rhombus_width;
                // y += self.rhombus_height;

                self.rhombus_arr.push({
                    rhombus: rhombus,
                    grid_x: grid_x,
                    grid_y: grid_y
                });

                grid_x += 2;
            }


            //check for x shift
            if (row % 2 == 0) {
                offset_x =  -self.rhombus_width / 2;
                grid_x = -1;
            }
            else {
                offset_x = 0;
                grid_x = 0;
            }

            //shift by y
            offset_y += self.rhombus_height / 2;

            grid_y++;

            row++
        }

        console.log(self.rhombus_arr);
    }

}

class Rhombus {
    constructor(options){
        let self = this;

        self.x = options.x;
        self.y = options.y;
        self.width = options.width;
        self.height = options.height;
        self.color = options.color;


        self.draw_rhombus();
    }

    draw_rhombus(){

        let self = this;

        ctx.fillStyle = self.color;
        ctx.beginPath();
        ctx.moveTo(self.x, self.y + self.height / 2);

        ctx.lineTo(self.x + self.width / 2, self.y);
        ctx.lineTo(self.x + self.width, self.y + self.height / 2);
        ctx.lineTo(self.x + self.width / 2, self.y + self.height);


        ctx.closePath();
        ctx.fill();
        // ctx.strokeStyle = self.color;
        // ctx.stroke();

    }

}


let rhombus_grid = new Rhombus_Grid();
