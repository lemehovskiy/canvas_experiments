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
        self.rhombus_width = 200;
        self.rhombus_height = 100;

        self.grid_step_size_x = self.rhombus_width / 2;
        self.grid_step_size_y = self.rhombus_height / 2;

        self.container_width = 400;

        self.container_offset_left = (canvas.width - self.container_width) / 2;
        self.container_offset_right = (canvas.width - self.container_width) / 2 + self.container_width;

        self.container_padding = 60;

        // self.init_rhombus_position_x_points = 0;
        // self.init_rhombus_position_y_points = 0;

        self.init_rhombus_position_x = self.container_offset_left + self.container_padding;
        self.init_rhombus_position_y = self.rhombus_height / 2 + 200;


        // self.draw_grid();

        let figure = self.draw_figure({
            position_x: self.init_rhombus_position_x,
            position_y: self.init_rhombus_position_y,
            main_ray: [
                {
                    direction: 'bottom_right',
                    steps: 2,
                    rays: [
                        {
                            direction: 'top_right',
                            steps: 2,
                            rays: [
                                {
                                    direction: 'top_left',
                                    steps: 1
                                }
                            ]
                        }
                    ]
                }
            ]
        });


        console.log(figure);

    }

    draw_figure(options) {

        let self = this;

        let figure_rhombus_arr = [];

        //init rhombus
        let rhombus = self.create_rhombus({
            x: options.position_x,
            y: options.position_y
        });

        figure_rhombus_arr.push(rhombus);


        //init ray

        draw_rays({
            position_x: options.position_x,
            position_y: options.position_y,
            rays: options.main_ray
        });


        function draw_rays(settings) {

            // let rhombus_rays = [];

            settings.rays.forEach(function (ray) {

                draw_ray({
                    position_x: settings.position_x,
                    position_y: settings.position_y,
                    direction: ray.direction,
                    steps: ray.steps,
                    rays: ray.rays
                })

            });

        }

        function draw_ray(settings) {

            let i = 1;

            let x = 0;
            let y = 0;

            let draw_statement = true;

            while (draw_statement) {

                switch (settings.direction) {

                    case 'top_left':
                        x = settings.position_x - (self.grid_step_size_x * i);
                        y = settings.position_y - (self.grid_step_size_y * i);
                        break;

                    case 'top_right':
                        x = settings.position_x + (self.grid_step_size_x * i);
                        y = settings.position_y - (self.grid_step_size_y * i);
                        break;

                    case 'bottom_left':
                        x = settings.position_x - (self.grid_step_size_x * i);
                        y = settings.position_y + (self.grid_step_size_y * i);
                        break;

                    case 'bottom_right':
                        x = settings.position_x + (self.grid_step_size_x * i);
                        y = settings.position_y + (self.grid_step_size_y * i);
                        break;
                }

                i++;

                if (settings.steps == -1) {
                    draw_statement = x > 0 && x < canvas.width;
                }
                else {
                    draw_statement = (i <= settings.steps);
                }


                let rhombus = self.create_rhombus({
                    x: x,
                    y: y
                });


                figure_rhombus_arr.push(rhombus);


                //draw sub rays
                if (settings.rays) {

                    // console.log(figure_rhombus_arr);
                    draw_rays({
                        position_x: x,
                        position_y: y,
                        rays: settings.rays
                    });

                    // console.log(figure_rhombus_arr);
                }

            }

        }

        return figure_rhombus_arr;

    }


    create_rhombus(options) {

        // console.log(options);

        let self = this;

        let rhombus = new Rhombus({
            x: options.x,
            y: options.y,
            width: self.rhombus_width,
            height: self.rhombus_height,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
            coordinate_left: options.coordinate_left,
            coordinate_right: options.coordinate_right,
        });

        return rhombus;
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

        self.coordinate_left = options.coordinate_left;
        self.coordinate_right = options.coordinate_right;


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
