let canvas_width = 800;
let canvas_height = 800;

var renderer = PIXI.autoDetectRenderer(canvas_width, canvas_height, { antialias: true });
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();


var container = new PIXI.Container();
container.position.x = renderer.width / 2;
// container.position.y = renderer.height / 2;

// add a bunch of sprites

var panda =  PIXI.Sprite.fromImage('../imgs/panda.png');
panda.anchor.x = 0;
// panda.anchor.y = 0.5;

container.addChild(panda);

stage.addChild(container);

// let's create a moving shape
var thing = new PIXI.Graphics();
stage.addChild(thing);
thing.position.x = renderer.width / 2 + 200;
thing.position.y = renderer.height / 2 + 100;



// container.mask = thing;
// container.mask = thing1;



animate();

function animate()
{


    thing.clear();

    thing.beginFill(0x8bc5ff, 1);
    thing.moveTo(0, 50);
    thing.lineTo(50, 0);
    thing.lineTo(100, 50);
    thing.lineTo(50, 100);

    thing.moveTo(-70, -20);
    thing.lineTo(-20, -70);
    thing.lineTo(30, -20);
    thing.lineTo(-20, 30);




    renderer.render(stage);
    requestAnimationFrame(animate);
}

//////////////////////////////////////////////////






// let canvas = document.createElement("canvas"),
//     ctx = canvas.getContext("2d");
//
//
// canvas.width = 800;
// canvas.height = 600;
//
// document.body.appendChild(canvas);
//
// ctx.fillStyle = "black";
// ctx.fillRect(0, 0, canvas.width, canvas.height);


class Rhombus_Grid {

    constructor() {
        let self = this;

        self.grid_size = 20;
        self.rhombus_arr = [];
        self.rhombus_width = 200;
        self.rhombus_height = 100;

        self.grid_step_size_x = self.rhombus_width / 2;
        self.grid_step_size_y = self.rhombus_height / 2;

        self.container_width = 600;

        self.container_offset_left = (canvas_width - self.container_width) / 2;
        self.container_offset_right = (canvas_width - self.container_width) / 2 + self.container_width;

        self.container_padding = 60;

        // self.init_rhombus_position_x_points = 0;
        // self.init_rhombus_position_y_points = 0;

        self.init_rhombus_position_x = self.container_offset_left + self.container_padding;
        self.init_rhombus_position_y = -self.rhombus_height / 2;


        // self.draw_grid();

        let figure_1 = self.get_figure({
            grid_step_x: 0,
            grid_step_y: 0,
            color: '0x4286f4'
        });


        let figure_2 = self.get_figure({
            grid_step_x: 3,
            grid_step_y: 4,
            color: '0x8e41f4',
            main_ray: [
                {
                    steps: -1,
                    direction: 'top_right'
                }
            ]
        });
        //
        // self.get_figure({
        //     grid_step_x: 4,
        //     grid_step_y: 5,
        //     color: '0xf44171',
        //     main_ray: [
        //         {
        //             steps: -1,
        //             direction: 'top_right'
        //         }
        //     ]
        // });

        self.draw_figure(figure_2);


    }


    draw_figure(rhombus){

        let self = this;

        // let's create a moving shape
        var thing = new PIXI.Graphics();
        stage.addChild(thing);


        thing.clear();

        rhombus.forEach(function(rhombus_item){

            thing.beginFill(rhombus_item.color, 1);

            let counter = 0;

            rhombus_item.points.forEach(function(point){

                if (counter ++ == 0) {
                    console.log(point)
                    thing.moveTo(point.x, point.y);
                }

                else {
                    thing.lineTo(point.x, point.y);
                    console.log('22')
                }
            });
        })

        container.mask = thing;

    }

    get_figure(options) {

        let self = this;

        let figure_rhombus_arr = [];

        //init rhombus
        let rhombus = self.create_rhombus({
            x: self.init_rhombus_position_x + (self.grid_step_size_x * options.grid_step_x),
            y: self.init_rhombus_position_y + (self.grid_step_size_y * options.grid_step_y),
            color: options.color
        });

        figure_rhombus_arr.push(rhombus);


        //init ray
        draw_rays({
            position_x: self.init_rhombus_position_x + (self.grid_step_size_x * options.grid_step_x),
            position_y: self.init_rhombus_position_y + (self.grid_step_size_y * options.grid_step_y),
            rays: options.main_ray
        });


        function draw_rays(settings) {

            // let rhombus_rays = [];

            if (settings.rays) {
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
                    draw_statement = x > 0 && x < canvas_width;
                }
                else {
                    draw_statement = (i <= settings.steps);
                }


                let rhombus = self.create_rhombus({
                    x: x,
                    y: y,
                    color: options.color
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

        console.log(figure_rhombus_arr);

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
            color: options.color,
            // color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        });

        // console.log(rhombus);

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


        self.points = [
            {
                x: self.x,
                y: self.y + self.height / 2
            },
            {
                x: self.x + self.width / 2,
                y: self.y
            },
            {
                x: self.x + self.width,
                y: self.y + self.height / 2
            },
            {
                x: self.x + self.width / 2,
                y: self.y + self.height
            }
        ];
        // self.draw_rhombus();
    }

    draw_rhombus() {

        let self = this;

        // ctx.fillStyle = self.color;
        // ctx.beginPath();
        // ctx.moveTo(self.init_coordinate[0].x, self.init_coordinate[0].y);
        //
        // self.coordinate_arr.forEach(function(coordinate){
        //     ctx.lineTo(coordinate.x, coordinate.y);
        // });
        //
        //
        // ctx.closePath();
        // ctx.fill();
        // ctx.strokeStyle = self.color;
        // ctx.stroke();



        // let's create a moving shape
        var thing = new PIXI.Graphics();
        stage.addChild(thing);

        // console.log(thing);


        thing.clear();

        thing.beginFill(self.color, 1);


        let counter = 0;


        self.points.forEach(function(coordinate){

            if (counter ++ == 0) {
                thing.moveTo(self.points[0].x, self.points[0].y);
            }

            else {
                thing.lineTo(coordinate.x, coordinate.y);
            }
        });

        // container.mask = thing;




        // renderer.render(stage);


    }

}


let rhombus_grid = new Rhombus_Grid();