console.log('Flappy Bird');

let frames = 0
let best = 0
const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav'
const som_pulo = new Audio();
som_pulo.src = './efeitos/pulo.wav'


const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};
//FlappyBird
function criaFlappyBird(){
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.7,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo
            som_pulo.play();
        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza() {
            if(fazColisao(flappyBird, globais.chao)){
                som_HIT.play();
                mudaparatela(telas.gameOver)
                return
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            {spriteX: 0, spriteY: 0, },
            {spriteX: 0, spriteY: 26, },
            {spriteX: 0, spriteY: 52, },
            {spriteX: 0, spriteY: 26, },
        ],
        frameAtual: 0,
        atualizarFrameAtual(){
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if(passouOIntervalo){
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseDaRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseDaRepeticao
            }
        },
        desenha() {
            flappyBird.atualizarFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            contexto.drawImage(
            sprites,
            spriteX, spriteY, // Sprite X, Sprite Y
            flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
            flappyBird.x, flappyBird.y,
            flappyBird.largura, flappyBird.altura,
        );
    }
    }
    return flappyBird
}
// [Chao]
function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2
            const movimentacao = chao.x - movimentoDoChao
            chao.x = movimentacao % repeteEm;
        },
        desenha() {
            contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            chao.x, chao.y,
            chao.largura, chao.altura,
        );
            contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            (chao.x + chao.largura), chao.y,
            chao.largura, chao.altura,
        );
      },
    };
    return chao
}
//Canos
function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenha() {
            canos.pares.forEach(function(par){
                const Yrandom = par.y;
                const espacamentoCanos = 90;
    
    
                const canoCeuX = par.x;
                const canoCeuY = Yrandom;
                //CANO DO CEU
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                )
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoCanos + Yrandom;
                //CANO DO CHÃO
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            })
        },
        temColisaoComOFlappyBird(par) {
            const cabecaDoFlappy = globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
            
            if((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {
                
                if(cabecaDoFlappy <= par.canoCeu.y) {
                    return true;
                }
                if(peDoFlappy >= par.canoChao.y) {
                    return true;
                }
            }


            return false
        },
        pares: [],        
        atualiza() {
            const passou100Frames = frames % 100 === 0;
            if(passou100Frames){
                canos.pares.push({
                    x: canvas.width,
                    y: (-150 * (Math.random() + 1)),
            })
        }

        canos.pares.forEach(function(par){
            par.x = par.x -2;

            if(canos.temColisaoComOFlappyBird(par)) {
                som_HIT.play();

                mudaparatela(telas.gameOver)
                return
            }

            if(par.x + canos.largura <= 0){
                canos.pares.shift();
            }
        })


        },
    }
    return canos;
}
//PLACAR
function criaPlacar() {
    const placar = {



        pontuacao: 0,
        desenha(){
            contexto.font = '30px VT323';
            contexto.textAlign = 'right'
            contexto.fillStyle = 'Black'
            contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
        },
        atualiza(){
            const intervaloDeFrames = 110;
            const passouOIntervalo = frames % intervaloDeFrames === 0;
            if(passouOIntervalo){
            placar.pontuacao = placar.pontuacao + 1
            }
        },
    }
    return placar
}
//Mensagem de Início

const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
      contexto.drawImage(
        sprites,
        mensagemGetReady.sX, mensagemGetReady.sY,
        mensagemGetReady.w, mensagemGetReady.h,
        mensagemGetReady.x, mensagemGetReady.y,
        mensagemGetReady.w, mensagemGetReady.h,
      );
    },
  };

//
//Mensagem GameOver
//
const mensagemGameOver = {
    sX: 134,
    sY: 153,
    w: 226,
    h: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,
    desenha() {
      contexto.drawImage(
        sprites,
        mensagemGameOver.sX, mensagemGameOver.sY,
        mensagemGameOver.w, mensagemGameOver.h,
        mensagemGameOver.x, mensagemGameOver.y,
        mensagemGameOver.w, mensagemGameOver.h,
        );
        contexto.font = '25px VT323';
        contexto.fillStyle = 'Black'
        contexto.fillText(`${globais.placar.pontuacao}`, 240, 145
        );
        
        if(globais.placar.pontuacao >= best) {
            best = globais.placar.pontuacao;
            contexto.font = '25px VT323';
            contexto.fillStyle = 'Black'
            contexto.fillText(`${best}`, 240, 190);
        }else {
            contexto.font = '25px VT323';
            contexto.fillStyle = 'Black'
            contexto.fillText(`${best}`, 240, 190);
        }
    
    },
  };
//
//TELAS
//
const globais = {};
let telaAtiva = {};
function mudaparatela(novaTela){
    telaAtiva = novaTela;
    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const telas = {
    inicio:{
        inicializa(){
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            mensagemGetReady.desenha();
        },
        click() {
            mudaparatela(telas.jogo);
        },
        atualiza() {
            globais.chao.atualiza();
        }

    }
};

telas.jogo = {
    inicializa(){
        globais.placar = criaPlacar();    
    },
    desenha() {
        planoDeFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
        globais.placar.desenha();
    },
    click(){
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza();
        globais.placar.atualiza();
    }
}

telas.gameOver = {
    desenha() {
        mensagemGameOver.desenha();
    },
    atualiza(){

    },
    click() {
        mudaparatela(telas.inicio)
    }
}
//
// Colisão
//
function fazColisao(flappyBird, chao){
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;
    if (flappyBirdY >= chaoY){
        return true;
    }
    return false;
}
//
//LOOP do Jogo
//

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();
    frames ++
    requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
    if (telaAtiva.click){
        telaAtiva.click();
    }
})


mudaparatela(telas.inicio);
loop();

//
//Limpa Tela
//
