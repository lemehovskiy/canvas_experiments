let ww = $(window).outerWidth();
let wh = $(window).outerHeight();

var renderer = PIXI.autoDetectRenderer(ww, wh, {antialias: true});

document.getElementById("main-container").appendChild(renderer.view);

console.log(renderer);

$(window).on('resize load', function(){
    ww = $(window).outerWidth();
    wh = $(window).outerHeight();

    renderer.resize(ww, wh);
})

// create the root of the scene graph
var stage = new PIXI.Container();


class Rhombus_Grid {

    constructor() {
        let self = this;

        self.grid_size = 20;
        self.rhombus_arr = [];
        self.rhombus_width = 200;
        self.rhombus_height = 100;

        self.grid_step_size_x = self.rhombus_width / 2;
        self.grid_step_size_y = self.rhombus_height / 2;

        self.container_max_width = 1000;

        self.container_width = 1000;

        if (ww < self.container_max_width) {
            self.container_width = ww;
        }
        else {
            self.container_width = self.container_max_width;
        }

        self.container_offset_left = (renderer.width - self.container_width) / 2;
        self.container_offset_right = (renderer.width - self.container_width) / 2 + self.container_width;

        self.container_padding = 60;

        self.init_rhombus_position_x = self.container_offset_left + self.container_padding;
        self.init_rhombus_position_y = -self.rhombus_height / 2;



        self.background_config = {
            figures: [

                {
                    color: '0x4286f4',
                    background_image: '../imgs/panda.png',
                    draw_init_rhombus: false,


                    parts: [
                        {
                            direction: 'bottom',
                            offset: 7,
                            length: 5,

                            parts: [
                                {
                                    direction: 'bottom_left',
                                    offset: 0,
                                    length: -1,
                                    apply_for_all: true

                                },
                                {
                                    direction: 'top_right',
                                    offset: 0,
                                    length: -1,
                                    apply_for_all: true

                                }
                            ]
                        }
                    ]
                },

                {
                    color: '0x4286f4',
                    // background_image: '../imgs/panda.png',
                    draw_init_rhombus: true,


                    parts: [
                        {
                            direction: 'bottom_right',
                            offset: 0,
                            length: 1,

                            parts: [
                                {
                                    direction: 'bottom_left',
                                    offset: 0,
                                    length: 2,
                                    apply_for_all: true

                                },
                                {
                                    direction: 'top_right',
                                    offset: 0,
                                    length: 2,
                                    apply_for_all: true

                                }
                            ]
                        }
                    ]
                },
                {
                    color: '0x4286f4',
                    draw_init_rhombus: false,


                    parts: [
                        {
                            direction: 'bottom_right',
                            offset: 3,
                            length: 3,

                            parts: [
                                {
                                    direction: 'bottom_left',
                                    offset: 0,
                                    length: 3,
                                    apply_for_all: true

                                },
                                {
                                    direction: 'top_right',
                                    offset: 0,
                                    length: -1,
                                    apply_for_all: true

                                }
                            ]
                        }
                    ]
                },

                {
                    color: '0x4286f4',
                    draw_init_rhombus: true
                }

            ]
        }


        self.rhombus_background = self.get_rhombus_background(self.background_config);

        $(window).on('resize', function(){

            self.rhombus_background.forEach(function (figure) {

                figure.parts.forEach(function (rhombus) {
                    TweenMax.to(rhombus.figure, 0, {alpha: 0})
                    TweenMax.to(rhombus.container, 0, {alpha: 0})
                });
            })


            if (ww < self.container_max_width) {
                self.container_width = ww;
            }
            else {
                self.container_width = self.container_max_width;
            }


            self.container_offset_left = (renderer.width - self.container_width) / 2;
            self.container_offset_right = (renderer.width - self.container_width) / 2 + self.container_width;

            self.init_rhombus_position_x = self.container_offset_left + self.container_padding;
            self.init_rhombus_position_y = -self.rhombus_height / 2;

            self.rhombus_background = self.get_rhombus_background(self.background_config);

            console.log(self.rhombus_background);
        })



        self.all_rhombus = [];

        self.rhombus_background.forEach(function (figure) {

            figure.parts.forEach(function (rhombus) {

                TweenMax.to(rhombus, 0, {y: rhombus.init_y + 100})
                TweenMax.to(rhombus.figure, 0, {alpha: 0})
                TweenMax.to(rhombus.container, 0, {alpha: 0})
                self.all_rhombus.push(rhombus);
            });
        })

        console.log(self.all_rhombus);

        let wave = {
            y: 0
        }




        function animate() {

            self.rhombus_background.forEach(function (figure) {
                figure.parts.forEach(function (part) {
                    part.draw();
                })
            })

            self.all_rhombus.forEach(function (rhombus, index) {

                let init_y = rhombus.init_y;

                let tl = new TimelineMax();

                if (wave.y > rhombus.init_y) {
                    // tl.set(rhombus, {y: init_y + 100});
                    tl.to(rhombus.container, .5, {alpha: 1});
                    tl.to(rhombus.figure, .5, {alpha: 1}, '-=0.5');
                    tl.to(rhombus, .5, {y: init_y}, '-=0.5');

                    self.all_rhombus.splice(index, 1)
                }
            });

            renderer.render(stage);
            requestAnimationFrame(animate);
        }

        animate();

        TweenMax.to(wave, 3, {y: renderer.height})


    }

    get_rhombus_background(options) {

        let self = this;

        let generated_figures_arr = [];


        options.figures.forEach(function (figure) {

            let generated_figure = {
                parts: []
            };

            let offset_x = self.init_rhombus_position_x;
            let offset_y = self.init_rhombus_position_y;


            //init rhombus
            if (figure.draw_init_rhombus) {
                generated_figure.parts.push(
                    self.create_rhombus({
                        x: offset_x,
                        y: offset_y,
                        color: figure.color,
                        background_image: figure.background_image
                    })
                );
            }


            //draw init parts
            if (figure.parts) {
                figure.parts.forEach(function (part) {
                    draw_parts({
                        part: part,
                        color: figure.color,
                        offset_x: offset_x,
                        offset_y: offset_y,
                        generated_figure: generated_figure,
                        background_image: figure.background_image
                    });
                })
            }


            // add coordinates
            generated_figure.coordinates = self.get_figure_position(generated_figure.parts);

            // add size
            generated_figure.size = self.get_figure_size(generated_figure.parts);


            generated_figure.parts.forEach(function (part) {
                part.figure_coordinates = generated_figure.coordinates;
                part.figure_size = generated_figure.size;
            })


            generated_figures_arr.push(generated_figure);

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

                    case 'top':
                        offset_y = offset_y - (self.grid_step_size_y * 2) * settings.part.offset;
                        break;

                    case 'bottom':
                        offset_y = offset_y + (self.grid_step_size_y * 2) * settings.part.offset;
                        break;

                    case 'left':
                        offset_x = offset_x - (self.grid_step_size_x * 2) * settings.part.offset;
                        break;

                    case 'right':
                        offset_x = offset_x + (self.grid_step_size_x * 2) * settings.part.offset;
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

                    case 'top':
                        offset_y = offset_y - self.grid_step_size_y * 2;
                        break;

                    case 'bottom':
                        offset_y = offset_y + self.grid_step_size_y * 2;
                        break;

                    case 'left':
                        offset_x = offset_x - self.grid_step_size_x * 2;
                        break;

                    case 'right':
                        offset_x = offset_x + self.grid_step_size_x * 2;
                        break;
                }

                i++;

                if (settings.part.length == -1) {
                    draw_statement = offset_x > -self.grid_step_size_x && offset_x < renderer.width;
                }
                else {
                    draw_statement = (i <= settings.part.length);
                }


                settings.generated_figure.parts.push(
                    self.create_rhombus({
                        x: offset_x,
                        y: offset_y,
                        color: settings.color,
                        background_image: settings.background_image
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
                                color: settings.color,
                                generated_figure: settings.generated_figure,
                                background_image: settings.background_image
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
                            color: settings.color,
                            generated_figure: settings.generated_figure,
                            background_image: settings.background_image
                        })
                    }

                })
            }

        }


        return generated_figures_arr;

    }


    get_figure_position(rhombus_figure) {

        let x_arr = [];
        let y_arr = [];

        rhombus_figure.forEach(function (rhombus_item) {

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
            width: (Math.max.apply(null, x_arr) + self.rhombus_width)  - Math.min.apply(null, x_arr),
            height: (Math.max.apply(null, y_arr) + self.rhombus_height) - Math.min.apply(null, y_arr)
        }

    }


    create_rhombus(options) {

        let self = this;

        let args = {
            x: options.x,
            y: options.y,
            width: self.rhombus_width,
            height: self.rhombus_height,
            color: options.color,
            background_image: options.background_image
        };


        let rhombus = new Rhombus(args);

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
        self.background_image = options.background_image;

        self.init_x = self.x;
        self.init_y = self.y;


        // self.thing = new PIXI.Graphics();
        // stage.addChild(self.thing);

        self.container = new PIXI.Container();
        stage.addChild(self.container);


        //background

        if (self.background_image != undefined) {

            self.sprite = PIXI.Sprite.fromImage(options.background_image);
            self.sprite.texture.baseTexture.on('loaded', function () {

                // self.set_background_cover({
                //     object_x: self.x - (self.init_x - self.figure_coordinates.x),
                //     object_y: self.y - (self.init_y - self.figure_coordinates.y),
                //     object_width: self.figure_size.width,
                //     object_height: self.figure_size.height,
                //     sprite: self.sprite,
                //     sprite_width: self.sprite.width,
                //     sprite_height: self.sprite.height
                //
                // })

            });
            self.container.addChild(self.sprite);
        }

        self.figure = new PIXI.Graphics();
        // self.container.alpha = 0;
        stage.addChild(self.figure);

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

        if (self.background_image != undefined) {
            self.set_background_cover({
                object_x: self.x - (self.init_x - self.figure_coordinates.x),
                object_y: self.y - (self.init_y - self.figure_coordinates.y),
                object_width: self.figure_size.width,
                object_height: self.figure_size.height,
                sprite: self.sprite,
                sprite_width: self.sprite.width,
                sprite_height: self.sprite.height

            })
        }

        //
        self.figure.clear();

        self.figure.beginFill(self.color, 1);

        self.figure.moveTo(self.x, self.y + self.height / 2);

        self.figure.lineTo(self.x + self.width / 2, self.y);
        self.figure.lineTo(self.x + self.width, self.y + self.height / 2);
        self.figure.lineTo(self.x + self.width / 2, self.y + self.height);

        if (self.background_image != undefined) {
            self.container.mask = self.figure;
        }


    }

}


rhombus_grid = new Rhombus_Grid();
