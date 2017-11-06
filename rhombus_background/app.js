let canvas_width = 800;
let canvas_height = 800;

var renderer = PIXI.autoDetectRenderer(canvas_width, canvas_height, {antialias: true});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

// container.mask = thing;
// container.mask = thing1;


function animate() {

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

        let figure_3 = self.get_figure({
            grid_step_x: 4,
            grid_step_y: 5,
            color: '0xf44171',
            main_ray: [
                {
                    steps: -1,
                    direction: 'top_right'
                }
            ]
        });

        self.draw_figure(
            {
                figure_obj: figure_1,
                background_img: '../imgs/panda.png'
            }
        );

        self.draw_figure(
            {
                figure_obj: figure_2
            }
        );

        self.draw_figure(
            {
                figure_obj: figure_3,
                background_img: '../imgs/panda.png'
            }
        );


    }


    get_figure_position(rhombus_figure) {

        let self = this;

        let x_arr = [];
        let y_arr = [];

        rhombus_figure.forEach(function (rhombus_item) {

            rhombus_item.points.forEach(function (point) {

                x_arr.push(point.x);
                y_arr.push(point.y);

            });
        });

        return {
            x: Math.min.apply(null, x_arr),
            y: Math.min.apply(null, y_arr)
        }

    }

    get_figure_size(rhombus_figure) {

        let self = this;

        let x_arr = [];
        let y_arr = [];

        rhombus_figure.forEach(function (rhombus_item) {

            rhombus_item.points.forEach(function (point) {

                x_arr.push(point.x);
                y_arr.push(point.y);

            });
        });

        return {
            width: Math.max.apply(null, x_arr) - Math.min.apply(null, x_arr),
            height: Math.max.apply(null, y_arr) - Math.min.apply(null, y_arr)
        }

    }

    set_background_cover(options) {

        let width = options.object_width;
        let height = options.object_height;

        let ratio_x = options.sprite_width;
        let ratio_y = options.sprite_height;


        if (width / height > ratio_x / ratio_y) {
            options.sprite.width = width;
            options.sprite.height = width / ratio_y * ratio_x;

        } else {
            options.sprite.width = height / ratio_y * ratio_x;
            options.sprite.height = height;
        }

        options.sprite.position.x = options.object_x;
        options.sprite.position.y = options.object_y;
    }


    draw_figure(options) {

        let self = this;

        let container = new PIXI.Container();

        stage.addChild(container);

        if (options.background_img) {
            let sprite = PIXI.Sprite.fromImage(options.background_img);
            sprite.texture.baseTexture.on('loaded', function () {
                // console.log(sprite.width, sprite.height);

                self.set_background_cover({
                    object_x: options.figure_obj.coordinates.x,
                    object_y: options.figure_obj.coordinates.y,
                    object_width: options.figure_obj.size.width,
                    object_height: options.figure_obj.size.height,
                    sprite: sprite,
                    sprite_width: sprite.width,
                    sprite_height: sprite.height

                })
            });
            // sprite.position.x = 50;

            // sprite.width = 100;

            container.addChild(sprite);
        }

        // let's create a moving shape
        let figure = new PIXI.Graphics();
        stage.addChild(figure);

        // console.log(self.get_figure_position(rhombus_figure));


        figure.clear();

        options.figure_obj.parts.forEach(function (rhombus_item) {

            figure.beginFill(rhombus_item.color, 1);

            let counter = 0;

            rhombus_item.points.forEach(function (point) {

                if (counter++ == 0) {
                    figure.moveTo(point.x, point.y);
                }

                else {
                    figure.lineTo(point.x, point.y);
                }
            });
        });


        if (options.background_img) {
            container.mask = figure;
        }

        animate();

// let's create a moving shape


    }

    get_figure(options) {

        let self = this;

        let figure = {
            parts: []
        };

        //init rhombus
        let rhombus = self.create_rhombus({
            x: self.init_rhombus_position_x + (self.grid_step_size_x * options.grid_step_x),
            y: self.init_rhombus_position_y + (self.grid_step_size_y * options.grid_step_y),
            color: options.color
        });

        figure.parts.push(rhombus);


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


                figure.parts.push(rhombus);


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

        // add coordinates
        figure.coordinates = self.get_figure_position(figure.parts);

        // add size
        figure.size = self.get_figure_size(figure.parts);


        return figure;

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


        self.points.forEach(function (coordinate) {

            if (counter++ == 0) {
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