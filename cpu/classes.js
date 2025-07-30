/*--------------------------------------------- COMPORTAMENTO DOS JOGADORES  -------------------------------------------*/
class Player{
    constructor({position,direcao,height,width,velocidade,sprite,inverter}){
        this.position = position;
        this.direcao = direcao;
        this.height = height;
        this.width = width;
        this.velocidade = velocidade;
        this.sprite = sprite
        this.inverter = inverter
        this.scale = 1
    }
    /*--------------------------------------------- MOVIMENTAÇÃO -------------------------------------------*/

    update(){
        if(this.position.x <= canvas.width-this.width){
            if(this.direcao.direita == true){
                this.position.x+=this.velocidade.x
            }
        }
        if(this.position.x >= 0){
            if(this.direcao.esquerda == true){
                this.position.x-=this.velocidade.x
            }
        }

        this.position.y += this.velocidade.y

        if (this.position.y + this.height + this.velocidade.y >= canvas.height-altChao) {
            this.velocidade.y = 0
          } else{ 
            this.velocidade.y += gravidade
        }

        // desenhnado o personagem
        this.animacao()
    }


    animacao(){
        const imagem = new Image()
        imagem.src = this.sprite.imagemSrc

       if(this.sprite.delay == 0){
            if( this.sprite.spriteAtual < this.sprite.spriteMax - 1){
                this.sprite.spriteAtual++
            }else{
                this.sprite.spriteAtual = 0
            }
            this.sprite.delay = 5
       }else{
            this.sprite.delay--
       }

       if(this.inverter === false){
        ctx.drawImage(imagem,(imagem.width / this.sprite.spriteMax)*this.sprite.spriteAtual,0,imagem.width / this.sprite.spriteMax,imagem.height,this.position.x,this.position.y,this.width*this.scale,this.height*this.scale)
       }else{
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        ctx.drawImage(imagem,(imagem.width / this.sprite.spriteMax)*this.sprite.spriteAtual,0,imagem.width / this.sprite.spriteMax,imagem.height,canvas.width-(this.position.x+this.width),this.position.y,this.width*this.scale,this.height*this.scale)
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        
       }
       
    }
}
/*--------------------------------------------- COMPORTAMENTO DS BOLA -------------------------------------------*/
class Bola{
    constructor({position,direcao,raio,velocidade}){
        this.position = position;
        this.direcao = direcao;
        this.raio = raio;
        this.velocidade = velocidade;
    }

    update(){
        this.position.y += this.velocidade.y

        if (this.position.y + this.raio + this.velocidade.y >= canvas.height-altChao){
            this.velocidade.y = 0
          } else{ 
            this.velocidade.y += gravidade
        }

        this.position.x += this.velocidade.x

        if(this.velocidade.x > 0){
            this.velocidade.x -= .25
        }else if(this.velocidade.x < 0){
            this.velocidade.x += .2
        }

        // colisao

        if(((this.position.x - this.raio <= j1.position.x+j1.width)&&(this.position.x + this.raio >= j1.position.x +j1.width/2))&&((this.position.y + this.raio > j1.position.y)&&(this.position.y < j1.position.y + j1.height))
        ){
            this.velocidade.x = 15
            this.velocidade.y -= 5
        }
      
        if((this.position.x + this.raio >= j1.position.x && this.position.x + this.raio <= j1.position.x + j1.width/2)&&((this.position.y + this.raio > j1.position.y)&&(this.position.y < j1.position.y + j1.height))){
            this.position.x = j1.position.x+j1.width
        }
        if(((this.position.x - this.raio <= j2.position.x+ j2.width/2)&&(this.position.x + this.raio >= j2.position.x))&&((this.position.y + this.raio > j2.position.y)&&(this.position.y < j2.position.y + j2.height))){
            this.velocidade.x = -15
            this.velocidade.y -= 5
        }
        if((this.position.x - this.raio >= j2.position.x + j2.width/2 && this.position.x - this.raio <= j2.position.x + j2.width)&&((this.position.y + this.raio > j2.position.y)&&(this.position.y < j2.position.y + j2.height))){
            this.position.x = j2.position.x
        }
        // colisao com a parede
        if(this.position.x + this.raio >= canvas.width && this.position.y-this.raio < j2Gol.position.y){
            this.position.x = (canvas.width-1) - this.raio
            this.velocidade.x *= -1
        }
        if(this.position.x - this.raio <= 0  && this.position.y < j1Gol.position.y){
            this.position.x = 1 + this.raio
            this.velocidade.x *= -1
        }
        

        // desenhando
        ctx.arc(this.position.x,this.position.y,this.raio,0,2*(Math.PI),true)
        ctx.fill()
    }
}
/*--------------------------------------------- COMPORTAMENTO DO PLACAR -------------------------------------------*/
class Placar{
    constructor({point1,point2}){
        this.point1 = point1;
        this.point2 = point2;


    }
    update(){
        ctx.font = '50px impact,sans-sarif'
        ctx.fillStyle = '#fff'
        ctx.textAlign = "center";
        
        ctx.textBaseline = "top";
        
        ctx.fillText(this.point1 + ":" + this.point2,canvas.width/2,50)
        ctx.strokeText(this.point1 + ":" + this.point2,canvas.width/2,50)
    }
    win(jogador){
        ctx.fillStyle = "#000"
        ctx.strokeStyle = "#f00"

        ctx.fillRect(0,0,canvas.width,canvas.height)

        ctx.font = '55px impact,sans-sarif'
        ctx.fillStyle = '#fff'
        ctx.textAlign = "center";
        ctx.textBaseline = "center";
        
        ctx.fillText(jogador + " Wins",canvas.width/2,canvas.height/2)
        ctx.strokeText(jogador + " Wins",canvas.width/2,canvas.height/2)

        ctx.font = '21px arial,sans-sarif'
        ctx.fillStyle = "rgba(255,255,255,0.5)"
        ctx.fillText("precione 'F5' para jogar novamente",canvas.width/2,canvas.height-55)
    }
}