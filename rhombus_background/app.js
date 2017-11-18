let canvas_width = 800;
let canvas_height = 800;

let rhombus_grid = {};

var renderer = PIXI.autoDetectRenderer(canvas_width, canvas_height, {antialias: true});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

// container.mask = thing;
// container.mask = thing1;


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


        // console.log(self.init_rhombus_position_x);
        // self.draw_grid();

        self.figure = self.get_figure({
            figures: [
                {
                    init_position_x: self.init_rhombus_position_x,
                    init_position_y: self.init_rhombus_position_y,
                    color: '0x4286f4',

                    parts: [
                        {
                            direction: 'bottom_right',
                            offset: 0,
                            length: 1,

                            parts: [
                                {
                                    direction: 'bottom_right',
                                    offset: 2,
                                    length: 5,

                                    parts: [
                                        {
                                            direction: 'bottom_left',
                                            offset: 1,
                                            length: 3,
                                            apply_for_all: true
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        // console.log(self.figure_parts);


        animate();


        function animate() {

            self.figure.parts.forEach(function (part) {
                part.draw();
            })

            renderer.render(stage);
            requestAnimationFrame(animate);
        }

        // self.figure.parts.forEach(function(part){
        // TweenMax.staggerTo(self.figure.parts, 1, {y: '+=200'}, 0.1)
        // })


        // self.draw_figure();


    }

    get_figure(options) {

        let self = this;

        let figures_arr = {
            parts: []
        };


        options.figures.forEach(function (figure) {

            let offset_x = figure.init_position_x;
            let offset_y = figure.init_position_y;

            // console.log(figure.init_position_x);
            //init rhombus

            figures_arr.parts.push(
                self.create_rhombus({
                    x: figure.init_position_x,
                    y: figure.init_position_y,
                    color: figure.color
                })
            );


            //draw init parts
            figure.parts.forEach(function (part) {
                draw_parts({
                    part: part,
                    color: figure.color,
                    offset_x: offset_x,
                    offset_y: offset_y
                });
            })




        })


        function draw_parts(settings) {

            let i = 1;

            let offset_x = settings.offset_x;
            let offset_y = settings.offset_y;

            let draw_statement = true;


            if (settings.part.offset > 0) {
                switch (settings.part.direction) {
                    case 'top_left':
                        offset_x = offset_x - self.grid_step_size_x * settings.part.offset;
                        offset_y = offset_y - self.grid_step_size_y * settings.part.offset;
                        break;

                    case 'top_right':
                        offset_x = offset_x + self.grid_step_size_x * settings.part.offset;
                        offset_y = offset_y - self.grid_step_size_y * settings.part.offset;
                        break;

                    case 'bottom_left':
                        offset_x = offset_x - self.grid_step_size_x * settings.part.offset;
                        offset_y = offset_y + self.grid_step_size_y * settings.part.offset;
                        break;

                    case 'bottom_right':
                        offset_x = offset_x + self.grid_step_size_x * settings.part.offset;
                        offset_y = offset_y + self.grid_step_size_y * settings.part.offset;
                        break;
                }
            }


            while (draw_statement) {


                switch (settings.part.direction) {

                    case 'top_left':
                        offset_x = offset_x - self.grid_step_size_x;
                        offset_y = offset_y - self.grid_step_size_y;
                        break;

                    case 'top_right':
                        offset_x = offset_x + self.grid_step_size_x;
                        offset_y = offset_y - self.grid_step_size_y;
                        break;

                    case 'bottom_left':
                        offset_x = offset_x - self.grid_step_size_x;
                        offset_y = offset_y + self.grid_step_size_y;
                        break;

                    case 'bottom_right':
                        offset_x = offset_x + self.grid_step_size_x;
                        offset_y = offset_y + self.grid_step_size_y;
                        break;
                }

                i++;

                if (settings.part.length == -1) {
                    draw_statement = offset_x > 0 && offset_x < canvas_width;
                }
                else {
                    draw_statement = (i <= settings.part.length);
                }

                // console.log(generated_figure);

                figures_arr.parts.push(
                    self.create_rhombus({
                        x: offset_x,
                        y: offset_y,
                        color: settings.color
                    })
                );


                //draw sub part apply for all
                if (settings.part.parts) {
                    settings.part.parts.forEach(function (part) {

                        if (part.apply_for_all) {
                            draw_parts({
                                part: part,
                                offset_x: offset_x,
                                offset_y: offset_y,
                                color: settings.color
                            })
                        }

                    })
                }


            }

            //draw sub part apply to last

            if (settings.part.parts) {

                settings.part.parts.forEach(function (part) {

                    if (!(part.hasOwnProperty('apply_for_all'))) {
                        draw_parts({
                            part: part,
                            offset_x: offset_x,
                            offset_y: offset_y,
                            color: settings.color
                        })
                    }

                })
            }

        }

        // add coordinates
        figures_arr.coordinates = self.get_figure_position(figures_arr.parts);

        // add size
        figures_arr.size = self.get_figure_size(figures_arr.parts);


        return figures_arr;

    }


    get_figure_position(rhombus_figure) {

        let self = this;

        let x_arr = [];
        let y_arr = [];

        rhombus_figure.forEach(function (rhombus_item) {

            // rhombus_item.points.forEach(function (point) {

            x_arr.push(rhombus_item.x);
            y_arr.push(rhombus_item.y);

            // });
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

            x_arr.push(rhombus_item.x);
            y_arr.push(rhombus_item.y);

        });

        return {
            width: Math.max.apply(null, x_arr) - Math.min.apply(null, x_arr),
            height: Math.max.apply(null, y_arr) - Math.min.apply(null, y_arr)
        }

    }


    draw_figure(options) {

        console.log(options);

        let self = this;

        let container = new PIXI.Container();

        stage.addChild(container);

        let sprite = PIXI.Sprite.fromImage('../imgs/panda.png');
        sprite.texture.baseTexture.on('loaded', function () {
            // console.log(sprite.width, sprite.height);

            // self.set_background_cover({
            //     object_x: options.figure_obj.coordinates.x,
            //     object_y: options.figure_obj.coordinates.y,
            //     object_width: options.figure_obj.size.width,
            //     object_height: options.figure_obj.size.height,
            //     sprite: sprite,
            //     sprite_width: sprite.width,
            //     sprite_height: sprite.height
            //
            // })
        });
        // sprite.position.x = 50;

        // sprite.width = 100;

        container.addChild(sprite);

        // let's create a moving shape
        let figure = new PIXI.Graphics();
        stage.addChild(figure);

        // console.log(self.get_figure_position(rhombus_figure));


        figure.clear();

        // console.log(options);

        // options.figure_obj.parts.forEach(function (rhombus_item) {
        //
        //     figure.beginFill(rhombus_item.color, 1);
        //
        //     let counter = 0;
        //
        //     rhombus_item.points.forEach(function (point) {
        //
        //         if (counter++ == 0) {
        //             figure.moveTo(point.x, point.y);
        //         }
        //
        //         else {
        //             figure.lineTo(point.x, point.y);
        //         }
        //     });
        // });


        // if (options.background_img) {
        //     container.mask = figure;
        // }

        // animate();

// let's create a moving shape


    }


    create_rhombus(options) {

        // console.log('create_thumbus');


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


        self.thing = new PIXI.Graphics();
        stage.addChild(self.thing);



        //background
        self.container = new PIXI.Container();

        stage.addChild(self.container);

        let sprite = PIXI.Sprite.fromImage('../imgs/panda.png');
        sprite.texture.baseTexture.on('loaded', function () {

            self.set_background_cover({
                object_x: self.x,
                object_y: self.y,
                object_width: 1000,
                object_height: 1000,
                sprite: sprite,
                sprite_width: sprite.width,
                sprite_height: sprite.height

            })

            // console.log(sprite.height);
        });
        self.container.addChild(sprite);
        self.figure = new PIXI.Graphics();
        stage.addChild(self.figure);

        // rhombus_grid.animate();

        // console.log(self.container);
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

    draw() {

        let self = this;

        // self.thing.clear();
        //
        // self.thing.beginFill(self.color, 1);
        //
        //
        // self.thing.moveTo(self.x, self.y + self.height / 2);
        //
        // self.thing.lineTo(self.x + self.width / 2, self.y);
        // self.thing.lineTo(self.x + self.width, self.y + self.height / 2);
        // self.thing.lineTo(self.x + self.width / 2, self.y + self.height);

        //
        self.figure.clear();

        self.figure.beginFill(self.color, 1);

        self.figure.moveTo(self.x, self.y + self.height / 2);

        self.figure.lineTo(self.x + self.width / 2, self.y);
        self.figure.lineTo(self.x + self.width, self.y + self.height / 2);
        self.figure.lineTo(self.x + self.width / 2, self.y + self.height);

        self.figure.closePath();

        self.container.mask = self.figure;


        // self.figure.clear();
        //
        // self.figure.moveTo(0, 0);
        //
        // self.figure.lineTo(0, 800);
        // self.figure.lineTo(800, 800);
        // self.figure.lineTo(0, 800);
        //
        // self.figure.closePath();
        //
        // // self.container.mask = self.figure;


    }

}


rhombus_grid = new Rhombus_Grid();
