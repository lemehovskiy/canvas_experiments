let canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");


canvas.width = 800;
canvas.height = 800;

document.body.appendChild(canvas);

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);



class Rhombus_Grid{

    constructor(){


        let rhombus = new Rhombus({
            x: 100,
            y: 100,
            width: 300,
            height: 150,
            color: '#f00'
        });

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

        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(self.x, self.y + self.height / 2);

        ctx.lineTo(self.x + self.width / 2, self.y);
        ctx.lineTo(self.x + self.width, self.y + self.height / 2);
        ctx.lineTo(self.x + self.width / 2, self.y + self.height);


        ctx.closePath();
        ctx.fill();

    }

}


let rhombus_grid = new Rhombus_Grid();
