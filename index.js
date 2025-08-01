const canvas = document.querySelector("#tela");
const ctx = canvas.getContext("2d");

// const deltaTime
/*----------------------------------------- AJUSTANDO NA TELA  -------------------------------------*/

canvas.width = 1024;
canvas.height = 576;

function tela() {
  j1.position.x = 0;
  j1.position.y = 0;
  j1Gol.position.x = 0;
  j1Gol.position.y = canvas.height - j1Gol.height;
  j2.position.x = canvas.width - j2.width;
  j2.position.y = 0;
  j2Gol.position.x = canvas.width - j2Gol.width;
  j2Gol.position.y = canvas.height - j2Gol.height;
  bola.position.y = 0;
  // fundo.width = canvas.width;
  // fundo.height = canvas.height;
}

let lastTime = 0;
let tempoUltimaDecisao = 0;
//gravidade
const gravidade = 500;

const altChao = canvas.height / 17;

/*--------------------------------------------- iNFORMAÇÕES -------------------------------------------*/
const jogo = {
  gameOver: false,
  multiplayer: true,
};

//jogador 1

const j1 = new Player({
  height: 70,
  width: 70,
  position: {
    x: 0,
    y: canvas.height - altChao - 100,
  },
  direcao: {
    direita: false,
    esquerda: false,
  },
  velocidade: {
    x: 250,
    y: 0,
  },
  sprite: {
    imagemSrc: "dogArt/1 Dog/Idle.png",
    spriteMax: 4,
    spriteAtual: 0,
    delay: 0,
  },
  inverter: false,
  golPosition: "left",
});

//CPU

const j2 = new Player({
  height: 70,
  width: 70,
  position: {
    x: canvas.width - 93,
    y: canvas.height - altChao - 100,
  },
  direcao: {
    direita: false,
    esquerda: false,
  },
  velocidade: {
    x: 250,
    y: 0,
  },
  sprite: {
    imagemSrc: "dogArt/2 Dog 2/Idle.png",
    spriteMax: 4,
    spriteAtual: 0,
    delay: 0,
  },
  inverter: true,
  golPosition: "right",
});

//Bola

const bola = new Bola({
  raio: 12,
  vel: 3,
  color: "#f00",
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

const bgLayer1 = new Image();
bgLayer1.src = "fundo/padrao.png"; // fundo que se move

const bgLayer2 = new Image();
bgLayer2.src = "fundo/glacial_mountains.png"; // fundo parado

const bgLayer3 = new Image();
bgLayer3.src = "fundo/clouds_mg_1_lightened.png"; // fundo parado

const fundo1 = new LayerBackground({
  imagem: bgLayer1,
  velocidade: 50, // pixels/segundo
  mover: true,
});

const fundo2 = new LayerBackground({
  imagem: bgLayer2,
  velocidade: 0,
  mover: false,
});

const fundo3 = new LayerBackground({
  imagem: bgLayer3,
  velocidade: 50,
  mover: true,
});


const grama = new Image();
grama.src = "fundo/PNG/Hills Layer 05.png";

/*------------------------------------------ ANIMANDO o JOGO -------------------------------------------*/
let deltaTime
function draw(currentTime = 0) {
  if (jogo.gameOver) return;


  deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateGame(deltaTime)

  requestAnimationFrame(draw);
}
draw();

/*------------------------------------------------ UPDATE -----------------------------------------*/

function updateGame(deltaTime) {
  fundo1.update(deltaTime)
  fundo2.update(deltaTime)
  // fundo3.update(deltaTime)
  // Jogador 1
  j1.update(deltaTime);

  // Jogador 2
  if (!jogo.multiplayer) cpu(); // ativa a movimentação da cpu
  j2.update(deltaTime);

  // bola
  bola.update(deltaTime);
  // gol
  ctx.fillStyle = "#eee";
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

  /*--PONTUAÇÃO ---*/
  if (
    bola.position.x + bola.raio <= 0 &&
    bola.position.y - bola.raio >= j1Gol.position.y
  ) {
    placar.point2 += 1;
    j1.position.x = 0;
    j1.position.y = canvas.height - altChao - 100;
    j2.position.x = canvas.width - j2.width;
    j2.position.y = canvas.height - altChao - 100;
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
    j1.position.y = canvas.height - altChao - 100;
    j2.position.x = canvas.width - j2.width;
    j2.position.y = canvas.height - altChao - 100;
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

}

/*----------------------------------------------- TECLADO  -------------------------------------------*/
window.addEventListener("keydown", (key) => {
  console.log(key.code);

  if (
    (key.code == "KeyW" || (!jogo.multiplayer && key.code == "ArrowUp")) &&
    j1.position.y + j1.height >= canvas.height - altChao
  ) {
    j1.velocidade.y -= 250;
  }

  if (key.code == "KeyA" || (!jogo.multiplayer && key.code == "ArrowLeft")) {
    j1.direcao.esquerda = true;
    j1.inverter = true;
  }

  if (key.code == "KeyD" || (!jogo.multiplayer && key.code == "ArrowRight")) {
    j1.direcao.direita = true;
    j1.inverter = false;
  }

  if (jogo.multiplayer) {
    if (
      key.code == "ArrowUp" &&
      j2.position.y + j2.height >= canvas.height - altChao
    ) {
      j2.velocidade.y -= 250;
    }
    if (key.code == "ArrowLeft") {
      j2.direcao.esquerda = true;
      j2.inverter = true;
    }
    if (key.code == "ArrowRight") {
      j2.direcao.direita = true;
      j2.inverter = false;
    }
  }
});

window.addEventListener("keyup", (key) => {
  if (key.code == "KeyA" || (!jogo.multiplayer && key.code == "ArrowLeft")) {
    j1.direcao.esquerda = false;
  }

  if (key.code == "KeyD" || (!jogo.multiplayer && key.code == "ArrowRight")) {
    j1.direcao.direita = false;
  }

  if (jogo.multiplayer) {
    if (key.code == "ArrowLeft") j2.direcao.esquerda = false;
    if (key.code == "ArrowRight") j2.direcao.direita = false;
  }
});

const checkboxMultiplayer = document.querySelector("#multiplayerOption");

checkboxMultiplayer.addEventListener("change", () => {
  jogo.multiplayer = checkboxMultiplayer.checked;
  j2.direcao.direita = false;
  j2.direcao.esquerda = false;
});

/*---------------------------------------------  CPU  -------------------------------------------*/

function cpu() {
  const agora = Date.now();

  const dificuldade = Number(document.querySelector("#dificuldadeInput").value);

  const intervaloDecisao = 500 - (dificuldade * 4); // de 500 até 100ms de atrazo

  if (agora - tempoUltimaDecisao < intervaloDecisao) return;
  tempoUltimaDecisao = agora;

  // Simula erros
  if (Math.random() * 100 > dificuldade) return;


  // Movimento lateral
  if (bola.position.x < j2.position.x) {
    j2.direcao.direita = false;
    j2.direcao.esquerda = true;
    j2.inverter = true;
  } else {
    j2.direcao.esquerda = false;
    j2.direcao.direita = true;
    j2.inverter = false;
  }

  // Salto
  if (
    bola.position.y < j2.position.y &&
    bola.position.y > j2.position.y - 200 &&
    j2.position.y + j2.height >= canvas.height - altChao &&
    bola.velocidade.y > 0
  ) {
    j2.velocidade.y -= 250;
  }
}

class Sprite {
  constructor({ position, offset, width, height }) {
    this.position = position,
      this.offset = offset,
      this.width = width,
      this.height
  }
}