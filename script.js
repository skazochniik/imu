const startScreen = document.getElementById("start-screen");
const music = document.getElementById("music");
const message = document.getElementById("message");

const canvas = document.getElementById("heart");
const ctx = canvas.getContext("2d");

let particles = [];
let animationStart = 0;
let started = false;

let width;
let height;
let dpr;


// -------------------------
// CANVAS SIZE
// -------------------------

function resizeCanvas() {

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (started) {
        createHeart();
    }
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// -------------------------
// HEART FORMULA
// -------------------------

function heartPoint(t) {

    const x =
        16 * Math.pow(Math.sin(t), 3);

    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);

    return {
        x: x,
        y: -y
    };
}


// -------------------------
// PARTICLE
// -------------------------

class Particle {

    constructor(targetX, targetY, type = "normal") {

        this.targetX = targetX;
        this.targetY = targetY;

        /*
        Все частицы начинают движение
        почти из центра сердца
        */

        this.startX =
            width / 2 +
            (Math.random() - 0.5) * 10;

        this.startY =
            height * 0.42 +
            (Math.random() - 0.5) * 10;


        this.delay =
            Math.random() * 1400;

        this.duration =
            1300 +
            Math.random() * 1800;


        this.length =
            type === "cross"
                ? 10 + Math.random() * 9
                : 3 + Math.random() * 8;


        this.width =
            type === "outline"
                ? 1.3 + Math.random() * 1.5
                : 0.6 + Math.random() * 1.2;


        this.alpha =
            type === "outline"
                ? 0.65 + Math.random() * 0.35
                : 0.25 + Math.random() * 0.55;


        this.type = type;


        const dx = this.targetX - width / 2;
        const dy = this.targetY - height * 0.42;

        this.angle =
            Math.atan2(dy, dx) +
            (Math.random() - 0.5) * 0.7;
    }


    draw(time) {

        let progress =
            (time - animationStart - this.delay)
            / this.duration;


        if (progress <= 0) return;

        progress = Math.min(progress, 1);


        /*
        Плавное торможение частицы
        */

        const ease =
            1 - Math.pow(1 - progress, 3);


        const x =
            this.startX +
            (this.targetX - this.startX) * ease;


        const y =
            this.startY +
            (this.targetY - this.startY) * ease;


        /*
        Штрих становится видимым постепенно
        */

        let opacity =
            Math.min(progress * 3, 1)
            * this.alpha;


        const pulse =
            1 +
            Math.sin(time * 0.002) * 0.025;


        const cx = width / 2;
        const cy = height * 0.42;


        const finalX =
            cx +
            (x - cx) * pulse;

        const finalY =
            cy +
            (y - cy) * pulse;


        const dx =
            Math.cos(this.angle)
            * this.length;

        const dy =
            Math.sin(this.angle)
            * this.length;


        ctx.beginPath();

        ctx.moveTo(
            finalX - dx / 2,
            finalY - dy / 2
        );

        ctx.lineTo(
            finalX + dx / 2,
            finalY + dy / 2
        );


        if (this.type === "cross") {

            ctx.strokeStyle =
                `rgba(255, 50, 135, ${opacity})`;

            ctx.shadowBlur = 12;

        } else {

            ctx.strokeStyle =
                `rgba(255, 65, 145, ${opacity})`;

            ctx.shadowBlur = 6;
        }


        ctx.shadowColor =
            "rgba(255, 40, 130, 0.8)";

        ctx.lineWidth = this.width;

        ctx.stroke();
    }
}


// -------------------------
// CREATE HEART
// -------------------------

function createHeart() {

    particles = [];


    const centerX = width / 2;
    const centerY = height * 0.42;


    /*
    Автоматический размер сердца
    под любой телефон
    */

    const scale = Math.min(
        width * 0.76 / 32,
        height * 0.46 / 30
    );


    // -------------------------
    // OUTLINE
    // -------------------------

    const outlineAmount = 900;


    for (let i = 0; i < outlineAmount; i++) {

        const t =
            Math.random()
            * Math.PI
            * 2;


        const point = heartPoint(t);


        /*
        Немного хаоса вокруг контура,
        чтобы он был "пушистым"
        */

        const fuzz =
            (Math.random() - 0.5)
            * 7;


        const x =
            centerX +
            point.x * scale +
            fuzz;


        const y =
            centerY +
            point.y * scale +
            fuzz;


        particles.push(
            new Particle(
                x,
                y,
                "outline"
            )
        );
    }


    // -------------------------
    // INSIDE PARTICLES
    // -------------------------

    const insideAmount = 1150;


    for (let i = 0; i < insideAmount; i++) {

        const t =
            Math.random()
            * Math.PI
            * 2;


        const point = heartPoint(t);


        /*
        Частица берёт точку на контуре,
        но располагается между центром
        и этой точкой
        */

        const radius =
            Math.pow(
                Math.random(),
                0.55
            );


        const x =
            centerX +
            point.x
            * scale
            * radius;


        const y =
            centerY +
            point.y
            * scale
            * radius;


        particles.push(
            new Particle(
                x +
                (Math.random() - 0.5) * 6,

                y +
                (Math.random() - 0.5) * 6,

                "normal"
            )
        );
    }


    // -------------------------
    // CENTRAL CROSS
    // -------------------------

    /*
    Вертикальная линия
    */

    for (let i = 0; i < 170; i++) {

        const y =
            centerY
            - scale * 12
            + Math.random()
            * scale
            * 27;


        const x =
            centerX +
            (Math.random() - 0.5) * 7;


        particles.push(
            new Particle(
                x,
                y,
                "cross"
            )
        );
    }


    /*
    Маленький X в центре
    */

    for (let i = 0; i < 110; i++) {

        const progress =
            Math.random() * 2 - 1;


        const size =
            scale * 5;


        let x;
        let y;


        if (Math.random() > 0.5) {

            x =
                centerX +
                progress * size;

            y =
                centerY +
                progress * size;

        } else {

            x =
                centerX +
                progress * size;

            y =
                centerY -
                progress * size;
        }


        particles.push(
            new Particle(
                x,
                y,
                "cross"
            )
        );
    }
}


// -------------------------
// ANIMATION
// -------------------------

function animate(time) {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    ctx.globalCompositeOperation =
        "lighter";


    for (const particle of particles) {

        particle.draw(time);
    }


    ctx.globalCompositeOperation =
        "source-over";


    requestAnimationFrame(animate);
}


// -------------------------
// START WEBSITE
// -------------------------

startScreen.addEventListener(
    "pointerdown",
    start,
    { once: true }
);


function start() {

    started = true;


    startScreen.classList.add(
        "hidden"
    );


    /*
    Музыка
    */

    music.volume = 0.8;

    music.play().catch(error => {

        console.log(
            "Music error:",
            error
        );
    });


    /*
    Создаём сердце
    */

    createHeart();


    animationStart =
        performance.now();


    requestAnimationFrame(
        animate
    );


    /*
    Текст появляется,
    когда сердце почти собрано
    */

    setTimeout(() => {

        message.classList.add(
            "visible"
        );

    }, 4200);
}
