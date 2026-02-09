const caixa = document.getElementById("caixa");
const botao = document.getElementById("botao");
const capinha = document.getElementById("capinha");
const mensagem = document.getElementById("mensagem");
const buracoContainer = document.getElementById("buraco-container");
const buraco = document.getElementById("buraco");
const gatosDiv = document.getElementById("gatos");
const textoImg = document.getElementById("texto-img");

const somPresente = document.getElementById("somPresente");
const somBotao = document.getElementById("somBotao");
const somCapinha = document.getElementById("somCapinha");
const somAlerta = document.getElementById("somAlerta");
const miados = [
  "miado1.mp3",
  "miado2.mp3",
  "miado3.mp3",
  "miado4.mp3",
  "miado5.mp3",
  "miado6.mp3",
  "miado7.mp3"
];
const audioAniversario = new Audio("feliz-aniversario.mp3");
audioAniversario.volume = 0;
audioAniversario.loop = false;


function tocarMiadoAleatorio() {
  const audio = new Audio(
    miados[Math.floor(Math.random() * miados.length)]
  );
  audio.volume = 0.8;
  audio.play();
}
const musica = document.getElementById("musica");

let cliques = 0;
let liberadoFinal = false;

/* CAIXA */
caixa.onclick = () => {
  // 🔓 DESTRAVA o áudio do final
  audioAniversario.play().then(() => {
    audioAniversario.pause();
    audioAniversario.currentTime = 0;
  });

  // 🔊 som de abrir presente
  somPresente.currentTime = 0;
  somPresente.volume = 0.6;
  somPresente.play();

  // animação da caixa
  caixa.style.animation = "desaparecerCaixa 0.7s forwards";


  setTimeout(() => {
    // Esconde a caixa
    caixa.style.display = "none";

    // Mostra o botão com animação de crescer
    botao.style.display = "block";
    botao.style.animation = "none"; // reinicia
    void botao.offsetWidth;         // força reinício
    botao.style.animation = "crescerBotao 0.7s forwards";

    // Som do botão
    somBotao.currentTime = 0;
  }, 700);
};



/* BOTÃO */botao.onclick = () => {
  somBotao.currentTime = 0;
  somBotao.play();

  if (liberadoFinal) {
    botao.style.display = "none";
    iniciarFinal();
    return;
  }

  cliques++;

  // Mensagens dramáticas por clique
  switch (cliques) {
    case 2:
      mostrarMensagemDramatica("Acha que é tão fácil assim?", 1500);
      break;
    case 5:
      mostrarMensagemDramatica("Calma… não é hora ainda", 1500);
      break;
    case 7:
      mostrarMensagemDramatica("Quase lá…", 1500);
      break;
    case 9:
      mostrarMensagemDramatica("Você ainda não conseguiu?", 1500);
      break;
    case 10:
      botao.style.display = "none";
      mostrarMensagemDramatica("Calma, agora sim vai dar certo", 2000, () => {
        botao.style.display = "block";
        botao.style.top = "50%";
        botao.style.left = "50%";
        capinha.style.display = "block";
      });
      return;
  }

  // Movimento do botão só se não for uma mensagem dramática
  if (![2,5,7,9,10].includes(cliques)) {
    botao.style.top = Math.random() * 80 + "%";
    botao.style.left = Math.random() * 80 + "%";
  }
};

// Função para mensagens dramáticas
function mostrarMensagemDramatica(texto, duracao, callback) {
  // Esconde o botão durante a mensagem
  botao.style.display = "none";

  // Mostra a mensagem
  mensagem.innerText = texto;

  // Depois do tempo, remove a mensagem e volta o botão se houver callback
  setTimeout(() => {
    mensagem.innerText = "";
    if (callback) {
      callback(); // usado para o último botão
    } else {
      botao.style.display = "block"; // botão volta a aparecer normalmente
    }
  }, duracao);
}



/* CAPINHA */capinha.onclick = () => {
  somCapinha.currentTime = 0;
  somCapinha.play();

  // animação de abrir
  capinha.style.animation = "abrirCapinha 0.7s forwards";

  setTimeout(() => {
    capinha.style.display = "none";
    liberadoFinal = true;

    // Aqui o botão já está visível por baixo, e só quando o usuário clicar nele, inicia o alerta
    somBotao.currentTime = 0;
  somBotao.play();
    botao.onclick = iniciarAlerta;
  }, 700);
};

function fadeOutAudio(audio, duracao = 1000) {
  const passo = audio.volume / (duracao / 50);

  const fade = setInterval(() => {
    if (audio.volume > passo) {
      audio.volume -= passo;
    } else {
      audio.volume = 0;
      audio.pause();
      audio.currentTime = 0;
      clearInterval(fade);
    }
  }, 50);
}

/* ALERTA ANTES DO FINAL */
function iniciarAlerta() {
  // 🔊 som do aviso
  somAlerta.currentTime = 0;
  somAlerta.volume = 0.7;
  somAlerta.play();

  botao.style.display = "none"; // esconde o botão

  let overlay = document.createElement("div");
  overlay.id = "overlay-alerta";
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.zIndex = 1000;
  overlay.style.backgroundColor = "white";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.fontFamily = "'Quicksand', sans-serif";
  overlay.style.fontSize = "50px";
  overlay.style.fontWeight = "bold";
  overlay.style.color = "black";
  document.body.appendChild(overlay);

  let textos = [
    { texto: "", duracao: 1000 },              // 1s sem texto
    { texto: "ALERTA", duracao: 500 },         // 0.5s
    { texto: "ALERTA", duracao: 500 },         // 0.5s
    { texto: "TENHA CUIDADO", duracao: 800 }, // 0.8s
    { texto: "MUITO CUIDADO", duracao: 800 }  // 0.8s
  ];

  let i = 0;
  let piscar = setInterval(() => {
    if (overlay.style.backgroundColor === "white") {
      overlay.style.backgroundColor = "red";
    } else {
      overlay.style.backgroundColor = "white";
    }
  }, 150); // velocidade da piscada

  function mostrarProximoTexto() {
    if (i >= textos.length) {
  clearInterval(piscar);
  overlay.style.backgroundColor = "black";

  // 🔉 fade out do som do alerta
  fadeOutAudio(somAlerta, 1200);

  setTimeout(() => {
    overlay.remove();
    iniciarFinal();
  }, 2000);

  return;
}

    overlay.innerText = textos[i].texto;
    setTimeout(() => {
      i++;
      mostrarProximoTexto();
    }, textos[i].duracao);
  }

  mostrarProximoTexto();
}


/* FINAL */
function iniciarFinal() {
  document.body.style.backgroundImage = "url('parede.jpg')";
  document.body.style.backgroundSize = "cover";

  setTimeout(abrirPortal, 2000);
}
function abrirPortal() {
  const portalContainer = document.getElementById("portal-container");
  const portal = document.getElementById("portal");

  portalContainer.style.display = "block";

  // Garante que a animação de aparecer funcione
  portal.style.transform = "scale(0)";
  portal.style.opacity = "0";
  portal.style.animation = "aparecerPortal 1s forwards";

  // Após a animação do portal, solta os gatos
  setTimeout(() => {
    soltarGatos(() => {
      soltarConfete();
      substituirPortalPorGato();
    });
  }, 1000); // 1 segundo para a animação do portal
}

function substituirPortalPorGato() {
  const portalContainer = document.getElementById("portal-container");
  portalContainer.style.display = "none";

  const gatoFinal = document.createElement("img");
  gatoFinal.src = "gato1.png";
  gatoFinal.className = "gato";
  gatoFinal.style.position = "fixed";
  gatoFinal.style.left = "50%";
  gatoFinal.style.top = "50%";
  gatoFinal.style.transform = "translate(-50%, -50%)";

  document.body.appendChild(gatoFinal);

  iniciarSequenciaFinal();
}

/* AVISO */
function mostrarAvisoGatos() {
  const aviso = document.createElement("div");
  aviso.innerText = "Toque nos gatinhos 🐾";
  aviso.style.position = "fixed";
  aviso.style.top = "30px";
  aviso.style.left = "50%";
  aviso.style.transform = "translateX(-50%)";
  aviso.style.padding = "12px 24px";
  aviso.style.background = "rgba(0, 0, 0, 0.6)";
  aviso.style.color = "white";
  aviso.style.fontSize = "22px";
  aviso.style.borderRadius = "20px";
  aviso.style.fontFamily = "'Quicksand', sans-serif";
  aviso.style.zIndex = "9999";
  aviso.style.opacity = "0";
  aviso.style.transition = "opacity 0.5s";

  document.body.appendChild(aviso);

  setTimeout(() => aviso.style.opacity = "1", 100);

  setTimeout(() => {
    aviso.style.opacity = "0";
    setTimeout(() => aviso.remove(), 500);
  }, 5000);
}

/* GATOS *//* GATOS */
function soltarGatos(aoTerminar) {
  mostrarAvisoGatos(); // 👈 ADICIONA ESSA LINHA AQUI
  tocarMiadoAleatorio();

  let quantidade = 0;
  const total = 120;
  const tempoNaTela = 14000; // tempo que cada gato vai ficar na tela (em ms)


  const intervalo = setInterval(() => {
    const gato = document.createElement("img");
    gato.src = `gato${Math.floor(Math.random() * 18) + 1}.png`;
    gato.className = "gato";

    if (quantidade === 0) {
      gato.style.top = "50%";
      gato.style.left = "50%";
      gato.style.transform = "translate(-50%, -50%)"; // centraliza pelo meio
    } else {
      gato.style.top = Math.random() * 90 + "%";
      gato.style.left = Math.random() * 90 + "%";
    }
gato.onclick = () => {
  tocarMiadoAleatorio();
};
    

    gatosDiv.appendChild(gato);

    // Remove o gato depois de X segundos
    setTimeout(() => {
      gato.remove();
    }, tempoNaTela);

    quantidade++;

    if (quantidade >= total) {
      clearInterval(intervalo);
      if (aoTerminar) aoTerminar();
    }
  }, 120);
}

/* 🎉 CONFETE */
function soltarConfete() {
  const cores = ["#ff69b4", "#ffeb3b", "#00e5ff", "#9c27b0", "#4caf50"];

  // 🎵 toca o feliz aniversário quando o confete aparece
  audioAniversario.currentTime = 0;
audioAniversario.volume = 0.8;

  for (let i = 0; i < 500; i++) {
    const confete = document.createElement("div");
    confete.className = "confete";
    confete.style.left = Math.random() * 100 + "vw";
    confete.style.backgroundColor =
      cores[Math.floor(Math.random() * cores.length)];
    confete.style.animationDuration = 3 + Math.random() * 2 + "s";

    document.body.appendChild(confete);

    setTimeout(() => confete.remove(), 5000);
  }

  setTimeout(() => {
    musica.volume = 0.6;
    musica.play();
  }, 1000);
}


/* 🐱 TROCA BURACO POR GATO */function substituirPortalPorGato() {
  const portalContainer = document.getElementById("portal-container");
  portalContainer.style.display = "none";

  // Gato do portal
  const gatoFinal = document.createElement("img");
  gatoFinal.src = "gato1.png";
  gatoFinal.className = "gato-portal"; // classe só para ele
  gatoFinal.style.position = "fixed";
  gatoFinal.style.left = "50%";
  gatoFinal.style.top = "50%";
  gatoFinal.style.transform = "translate(-50%, -50%)";

  // define um tamanho adequado
  gatoFinal.style.width = "150px"; // ou o tamanho que você quiser
  gatoFinal.style.height = "auto";

  document.body.appendChild(gatoFinal);

  // Remove apenas o gato do portal depois de X segundos (ex: 2s)
  setTimeout(() => {
    gatoFinal.remove(); 
  }, 2000);

  // Continua a sequência final normalmente
  iniciarSequenciaFinal();
}



/* 🐱 SEQUÊNCIA FINAL CORRIGIDA */function mostrarImagemPersonalizada(src, largura, altura, zIndex) {
  const img = document.createElement("img");
  img.src = src;
  img.style.position = "fixed";
  img.style.top = "50%";
  img.style.left = "50%";
  img.style.transform = "translate(-50%, -50%)";
  img.style.width = largura;   // ex: "500px" ou "80%"
  img.style.height = altura;    // ex: "auto" ou "400px"
  img.style.zIndex = zIndex;   // garante que fique acima de tudo
  document.body.appendChild(img);
  return img;
}
/* 🎁 INÍCIO DO PRESENTE E SEQUÊNCIA FINAL */

/* FUNÇÃO PARA CENTRALIZAR ELEMENTOS */
function centralizarElemento(el, maxWidth = 400) {
  el.style.position = "fixed";
  el.style.top = "50%";
  el.style.left = "50%";
  el.style.transform = "translate(-50%, -50%)";
  el.style.maxWidth = maxWidth + "px";
  el.style.height = "auto";
}

/* FINAL: inicia a sequência com imagens sobre os gatos */
function iniciarSequenciaFinal() {
  // IMAGEM 1 — 3s sobre os gatos
  const img1 = document.createElement("img");
  img1.src = "imagem1.png";
  centralizarElemento(img1, 600); // largura máxima 500px
  document.body.appendChild(img1);

  setTimeout(() => {
    img1.remove();

    // IMAGEM 2 — 4s sobre os gatos
    const img2 = document.createElement("img");
    img2.src = "imagem2.png";
    centralizarElemento(img2, 600);
    document.body.appendChild(img2);

    setTimeout(() => {
      img2.remove();

      // Tela preta inicial — 2s antes dos pontinhos
      const overlayPreta = document.createElement("div");
      overlayPreta.style.position = "fixed";
      overlayPreta.style.top = 0;
      overlayPreta.style.left = 0;
      overlayPreta.style.width = "100vw";
      overlayPreta.style.height = "100vh";
      overlayPreta.style.background = "black";
      overlayPreta.style.display = "flex";
      overlayPreta.style.justifyContent = "center";
      overlayPreta.style.alignItems = "center";
      overlayPreta.style.zIndex = "10000";
      document.body.appendChild(overlayPreta);

      setTimeout(() => {
        // Três pontinhos — 1.5s
        const pontos = document.createElement("div");
        pontos.innerText = "...";
        pontos.style.color = "white";
        pontos.style.fontSize = "60px";
        overlayPreta.appendChild(pontos);

        setTimeout(() => {
          pontos.remove();

          // Tela preta extra — 2s antes do botão de play
          setTimeout(() => {
            // BOTÃO DE PLAY
            const botaoPlay = document.createElement("button");
            botaoPlay.innerText = "▶၊|၊|၊||၊|• 0:10";
            botaoPlay.style.fontSize = "40px";
            botaoPlay.style.padding = "20px 40px";
            botaoPlay.style.cursor = "pointer";
            botaoPlay.style.border = "3px solid white";
            botaoPlay.style.borderRadius = "10px";
            botaoPlay.style.background = "transparent";
            botaoPlay.style.color = "white";
            overlayPreta.appendChild(botaoPlay);

            botaoPlay.onclick = () => {
              // remove botão e overlay
              overlayPreta.remove();

              // adiciona vídeo
              const video = document.createElement("video");
              video.src = "video-final.mp4";
              video.autoplay = true;
              video.muted = false;
              video.volume = 0.6;
              video.controls = false;
              video.playsInline = true;
              video.style.width = "100vw";
              video.style.height = "100vh";
              video.style.objectFit = "cover";
              document.body.appendChild(video);

              // quando o vídeo acabar
              video.onended = () => {
                document.body.innerHTML = "";
                document.body.style.background = "black";

                const imgFinal = document.createElement("img");
                imgFinal.src = "imagem-final.png";
                centralizarElemento(imgFinal, 600); // largura máxima 600px
                document.body.appendChild(imgFinal);
              };
            };
          }, 2000); // 2s tela preta antes do botão
        }, 1500); // 1.5s dos três pontinhos
      }, 2000); // 2s de tela preta antes dos três pontinhos
    }, 4000); // duração imagem2
  }, 3000); // duração imagem1
}


function centralizarElemento(el, maxWidth = 400) {
  el.style.position = "fixed";
  el.style.top = "50%";
  el.style.left = "50%";
  el.style.transform = "translate(-50%, -50%)";
  el.style.maxWidth = maxWidth + "px";
  el.style.height = "auto";
}
