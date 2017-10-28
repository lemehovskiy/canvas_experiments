
"use strict";



(function ($) {


    function initParticlesAnimation() {

        var context = document.getElementById("canvas");
        var ctx = context.getContext("2d");

        ctx.fillStyle = "#FFFFFF";


        var particleSize = 10;

        var gridSizeX = 120;
        var gridSizeY = 50;


        var particlesNum = gridSizeX * gridSizeY;

        var waveWidth = gridSizeX / 2;

        var waveIntensity = 5;

        var waveDiffusion = 0.5;

        var fillArray = generateFillArray(waveWidth, waveDiffusion);


        function generateFillArray(waveWidth, waveDiffusion) {

            var arr = [];


            for (var i = 0; i < waveWidth; i++) {
                arr.push(waveIntensity);

                waveIntensity = Math.round(waveIntensity * waveDiffusion);
            }


            return arr;
        }


        function Particle(x, y, col, index) {

            this.width = particleSize;
            this.height = particleSize;

            this.index = index;

            this.col = col;

            this.life = 0;

            this.x = x;
            this.y = y;

        }


        function generateParticles(rows, cols) {

            var particles = [];

            var index = 0;

            for (var _cols = 0; _cols < cols; _cols++) {


                for (var _rows = 0; _rows < rows; _rows++) {

                    var particle = new Particle(particleSize * _cols, particleSize * _rows, _cols, index++);


                    particles.push(particle);
                }


            }

            return particles;

        }


        function draw() {
            ctx.clearRect(0, 0, 1000, 500);

            particles.forEach(function (item, i) {

                if (item.life == 1) {
                    ctx.fillRect(item.x, item.y, particleSize, particleSize);
                }

            });

        }


        setInterval(function () {
            draw();
        }, 20)


        function generateFrames(particles, fillArray) {

            var framesArray = [];

            var shuffledParticles = _.shuffle(particles);

            var descShuffledParticles = _.orderBy(shuffledParticles, ['col'], ['desc']);


            while (0 < descShuffledParticles.length) {

                var currentperent = descShuffledParticles.length / (particles.length / 100);

                // var dropedFillArray = _.dropRight(fillArray, Math.round((fillArray.length / 100) * currentperent) - 1);

                var dropedFillArray = _.dropRight(fillArray, Math.round(((fillArray.length / 100) * currentperent) / 1.5));

                // console.log(Math.round(((fillArray.length / 100) * currentperent) / 2));


                framesArray.push(getFrameParts(descShuffledParticles, dropedFillArray));

            }


            return framesArray;

        }


        function getFrameParts(particles, fillArray) {

            var frameParts = [];


            var max = _.maxBy(particles, 'col').col;

            for (var fillCounter = 0; fillCounter < fillArray.length; fillCounter++) {

                var matches = _.take(_.filter(particles, _.matches({'col': max})), fillArray[fillCounter]);

                frameParts = frameParts.concat(matches)


                particles = removeFromArray(particles, matches)

                max--;


            }

            return frameParts;


        }


        function removeFromArray(array, itemsToRemove) {

            itemsToRemove.forEach(function (item) {
                _.remove(array, _.matches({'index': item.index}));

            })

            return array;

        }

        var particles = generateParticles(gridSizeY, gridSizeX);

        var framesList = generateFrames(particles, fillArray);



        var tl = new TimelineMax();

        tl.staggerTo(framesList, 0, {
            life: 1
        }, 0.008, '+=4');

        tl.to('.top-section .intro-slide', 0.5, {autoAlpha: 0}, '+=.3');
        tl.to('.landing-slide .title .line-2 li:nth-child(1)', 0.5, {y: -10, opacity: 0, rotationX: 30}, '+=2')
        tl.to('.landing-slide .title .line-2 li:nth-child(2)', 0.5, {opacity: 1})
        tl.to('.landing-slide .title .line-2 li:nth-child(2)', 0.5, {y: -10, opacity: 0, rotationX: 30}, '+=2')
        tl.to('.landing-slide .title .line-2 li:nth-child(3)', 0.5, {opacity: 1})
        tl.to('.landing-slide .overlay', 0.5, {autoAlpha: 0}, '+=2')

    }


    $(window).on('load', function(){
        initParticlesAnimation();
    });

}(jQuery));
