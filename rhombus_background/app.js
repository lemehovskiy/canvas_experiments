let canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");


canvas.width = 800;
canvas.height = 800;

document.body.appendChild(canvas);

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);


class Rhombus_Grid {

    constructor() {
        let self = this;

        self.grid_size = 20;
        self.rhombus_arr = [];
        self.rhombus_width = 600;
        self.rhombus_height = 300;

        self.container_width = 400;

        self.container_offset_left = (canvas.width - self.container_width) / 2;
        self.container_offset_right = (canvas.width - self.container_width) / 2 + self.container_width;

        self.container_padding = 50;

        // self.init_rhombus_position_x_points = 0;
        // self.init_rhombus_position_y_points = 0;

        self.init_rhombus_position_x = self.container_offset_left + self.container_padding;
        self.init_rhombus_position_y = self.rhombus_height / 2;


        self.draw_grid();

    }

    create_rhombus(options){

        console.log(options);

        let self = this;

        let rhombus = new Rhombus({
            x: options.x,
            y: options.y,
            width: self.rhombus_width,
            height: self.rhombus_height,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        });

        self.rhombus_arr.push({
            rhombus: rhombus,
        });
    }

    draw_grid() {

        let self = this;

        //draw_init_rhombus
        self.create_rhombus({
            x: self.init_rhombus_position_x,
            y: self.init_rhombus_position_y
        });

        self.draw_rows();


    }

    draw_rows(draw_direction){

        let self = this;

        let y = self.init_rhombus_position_y;

        let row = 1;

        let draw_to_left_x = self.init_rhombus_position_x - self.rhombus_width;
        let draw_to_right_x = self.init_rhombus_position_x + self.rhombus_width;


        //draw row
        while (y < canvas.height) {

            //draw row to left
            while (draw_to_left_x + self.rhombus_width > 0) {

                self.create_rhombus({
                    x: draw_to_left_x,
                    y: y
                });

                draw_to_left_x -= self.rhombus_width;
            }

            //draw row to right
            while (draw_to_right_x < canvas.width) {

                self.create_rhombus({
                    x: draw_to_right_x,
                    y: y
                });

                draw_to_right_x += self.rhombus_width;
            }



            y += self.rhombus_height / 2;

            row ++;

            //reset draw position

            if (row % 2 == 0) {
                draw_to_left_x = self.init_rhombus_position_x - self.rhombus_width / 2;
                draw_to_right_x = self.init_rhombus_position_x + self.rhombus_width / 2;
            }

            else {
                draw_to_left_x = self.init_rhombus_position_x - self.rhombus_width;
                draw_to_right_x = self.init_rhombus_position_x;
            }

        }

        console.log(self.rhombus_arr);
    }

}

class Rhombus {
    constructor(options) {
        let self = this;

        self.x = options.x;
        self.y = options.y;
        self.width = options.width;
        self.height = options.height;
        self.color = options.color;


        self.draw_rhombus();
    }

    draw_rhombus() {

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
