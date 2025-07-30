const canvas = document.querySelector("#tela");
const ctx = canvas.getContext("2d");

/*----------------------------------------- AJUSTANDO NA TELA  -------------------------------------*/

function tela() {
  canvas.width = 1024;
  canvas.height = 576;

  j1.position.x = 0;
  j1.position.y = 0;
  j1Gol.position.x = 0;
  j1Gol.position.y = canvas.height - j1Gol.height;
  j2.position.x = canvas.width - j2.width;
  j2.position.y = 0;
  j2Gol.position.x = canvas.width - j2Gol.width;
  j2Gol.position.y = canvas.height - j2Gol.height;
  bola.position.y = 0;
  fundo.width = canvas.width;
  fundo.height = canvas.height;
}

canvas.width = 1024;
canvas.height = 576;

//gravidade
const gravidade = 0.7;

const altChao = canvas.height / 17;

/*--------------------------------------------- iNFORMAÇÕES -------------------------------------------*/
const jogo = {
  gameOver: false,
  darkMode: false,
};

//jogador 1

const j1 = new Player({
  height: 93/1.2,
  width: 93/1.2,
  position: {
    x: 0,
    y: 0,
  },
  direcao: {
    direita: false,
    esquerda: false,
  },
  velocidade: {
    x: 5,
    y: 0,
  },
  sprite: {
    imagemSrc: "dogArt/1 Dog/Idle.png",
    spriteMax: 4,
    spriteAtual: 0,
    delay: 0,
  },
  inverter: false,
});

//CPU

const j2 = new Player({
  height: 93/1.2,
  width: 93/1.2,
  position: {
    x: canvas.width - 93,
    y: 0,
  },
  direcao: {
    direita: false,
    esquerda: false,
  },
  velocidade: {
    x: 4.5,
    y: 0,
  },
  sprite: {
    imagemSrc: "dogArt/2 Dog 2/Idle.png",
    spriteMax: 4,
    spriteAtual: 0,
    delay: 0,
  },
  inverter: true,
});

//bola

const bola = new Bola({
  raio: 15,
  vel: 3,
  position: {
    x: canvas.width / 2,
    y: 50,
  },
  direcao: {
    direita: false,
    esquerda: false,
  },
  velocidade: {
    x: 0,
    y: 0,
  },
});

//Gol 1

const j1Gol = {
  height: 200,
  width: 10,
  position: {
    x: 0,
    y: canvas.height - 200,
  },
};

//Gol 2

const j2Gol = {
  height: 200,
  width: 10,
  position: {
    x: canvas.width - 10,
    y: canvas.height - 200,
  },
};

//Placar

const placar = new Placar({
  point1: 0,
  point2: 0,
});

const background = new Image();
background.src = "fundo/PREVIEWS/gelo.png";
const grama = new Image();
grama.src = "fundo/PNG/Hills Layer 05.png";

/*------------------------------------------ ANIMANDO o JOGO -------------------------------------------*/

function draw() {
  // fundo
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  if (jogo.darkMode) {
    ctx.fillStyle = "rgba(0,0,0,.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Jogador 1
  j1.update();

  // Jogador 2
  cpu();
  j2.update();

  // bola
  ctx.beginPath();
  ctx.fillStyle = "#2d6d2d";
  bola.update();
  // gol
  ctx.fillStyle = "#b5b5b5";
  ctx.fillRect(j1Gol.position.x, j1Gol.position.y, j1Gol.width, j1Gol.height);
  ctx.fillRect(j2Gol.position.x, j2Gol.position.y, j2Gol.width, j2Gol.height);

  // Gerenciando sprite
  if (
    j1.direcao.esquerda ||
    j1.direcao.direita ||
    j1.position.y + j1.height < canvas.height - altChao
  ) {
    j1.sprite.imagemSrc = "dogArt/1 Dog/Walk.png";
    j1.sprite.spriteMax = 6;
  } else {
    j1.sprite.imagemSrc = "dogArt/1 Dog/Idle.png";
    j1.sprite.spriteMax = 4;
  }

  if (
    j2.direcao.esquerda ||
    j2.direcao.direita ||
    j2.position.y + j2.height < canvas.height - altChao
  ) {
    j2.sprite.imagemSrc = "dogArt/2 Dog 2/Walk.png";
    j2.sprite.spriteMax = 6;
  } else {
    j2.sprite.imagemSrc = "dogArt/2 Dog 2/Idle.png";
    j2.sprite.spriteMax = 4;
  }

  // grama
  ctx.drawImage(grama, 0, 0, canvas.width, canvas.height);

  /*------------------------------------------- PONTUAÇÃO -----------------------------------------------*/
  if (
    bola.position.x + bola.raio <= 0 &&
    bola.position.y - bola.raio >= j1Gol.position.y
  ) {
    placar.point2 += 1;
    j1.position.x = 0;
    j1.position.y = 0;
    j2.position.x = canvas.width - j2.width;
    j2.position.y = 0;
    bola.position.y = 0;
    bola.position.x = canvas.width / 2;
    bola.velocidade.x = 0;
  }
  if (
    bola.position.x - bola.raio >= canvas.width &&
    bola.position.y - bola.raio >= j2Gol.position.y
  ) {
    placar.point1 += 1;
    j1.position.x = 0;
    j1.position.y = 0;
    j2.position.x = canvas.width - j2.width;
    j2.position.y = 0;
    bola.position.y = 0;
    bola.position.x = canvas.width / 2;
    bola.velocidade.x = 0;
  }
  placar.update();

  if (placar.point1 >= 5) {
    placar.win("Player 1");
  }
  if (placar.point2 >= 5) {
    placar.win("CPU");
  }

  requestAnimationFrame(draw);
}
draw();

/*--------------------------------------------- MODO ESCURO -------------------------------------------*/
function darkMode() {
  if (jogo.darkMode) {
    jogo.darkMode = false;
    document.querySelector("button span").style.marginLeft = "0";
    document.querySelector("button span").style.background = "#ffdc40";
    document.querySelector("button ").style.background = "#fff";
  } else {
    jogo.darkMode = true;
    document.querySelector("button span").style.marginLeft = "calc(100%/2)";
    document.querySelector("button span").style.background = "#f5f5f5";
    document.querySelector("button ").style.background = "#333";
  }
}

/*----------------------------------------------- TECLADO  -------------------------------------------*/

window.addEventListener("keydown", (event) => {
  if (
    (event.key == "w" || event.key == "ArrowUp") &&
    j1.position.y + j1.height >= canvas.height - altChao
  ) {
    j1.velocidade.y -= 15;
  }
  if (event.key == "a" || event.key == "ArrowLeft") {
    j1.direcao.esquerda = true;
    j1.inverter = true;
  }
  if (event.key == "d" || event.key == "ArrowRight") {
    j1.direcao.direita = true;
    j1.inverter = false;
  }

/*
  if(event.key == 'ArrowUp' && j2.position.y+j2.height >=canvas.height-altChao){j2.velocidade.y-= 15;}
    if(event.key == 'ArrowLeft'){j2.direcao.esquerda = true; j2.inverter = true}
    if(event.key == 'ArrowRight'){j2.direcao.direita = true; j2.inverter = false}
*/

if(event.key == 'Shift')darkMode()

});
window.addEventListener("keyup", (event) => {
  if (event.key == "a" || event.key == "ArrowLeft") {
    j1.direcao.esquerda = false;
  }
  if (event.key == "d" || event.key == "ArrowRight") {
    j1.direcao.direita = false;
  }

  /*
    if(event.key == 'ArrowLeft'){j2.direcao.esquerda = false}
    if(event.key == 'ArrowRight'){j2.direcao.direita = false}
  */
});

/*---------------------------------------------  CPU  -------------------------------------------*/

function cpu() {
  if (bola.position.x == j2.position.x) {
    j2.direcao.direita = false;
    j2.direcao.esquerda = false;
  } else if (bola.position.x <= j2.position.x) {
    j2.direcao.direita = false;
    j2.direcao.esquerda = true;
    j2.inverter = true;
  } else if (bola.position.x >= j2.position.x) {
    j2.direcao.esquerda = false;
    j2.direcao.direita = true;
    j2.inverter = false;
  }
  if (
    bola.position.y < j2.position.y &&
    bola.position.y > j2.position.y - 200 &&
    j2.position.y + j2.height >= canvas.height - altChao
  ) {
    j2.velocidade.y -= 15;
  }
}
