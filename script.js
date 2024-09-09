//variáveis globais
// Seleciona a div onde os botões serão inseridos
const teclado = document.querySelector('.teclado');

// Cria um array com as letras do alfabeto
const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

let erros = 0;
let fimJogo = false;
let modoJogoSelecionado = 'DoisJogadores';
const vogais = ['A', 'E', 'I', 'O', 'U'];
const consoantesComuns = ['S', 'R', 'N', 'T', 'L','B','D'];
let letrasUtilizadas = [];
let jogadorAtual = 'Jogador1';
let palavraSecreta = '';
let nomejogadorUm = '';
let nomejogadorDois = '';
const modoDeJogo = document.getElementsByName('modoDeJogo');

// Funções de inicialização

modoDeJogo.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'contraComputador') {
      // Lógica para o modo solo
      esconderInputJogadorDois();
    } else {
      // Lógica para dois jogadores
      mostrarInputJogadorDois()
    }
  });
});

function escolherPalavraAleatoria(palavras) {
  // Obtém o índice aleatório dentro do tamanho do array
  const indiceAleatorio = Math.floor(Math.random() * palavras.length);

  // Retorna a palavra correspondente ao índice aleatório
  return palavras[indiceAleatorio];
}

// Itera sobre o array de letras e cria um botão para cada uma
alfabeto.forEach(letra => {
    const botao = document.createElement('button');
    botao.classList.add('letra');
    botao.textContent = letra;
    botao.dataset.letra = letra.toLowerCase(); // Adiciona um atributo data-letra para armazenar a letra em minúsculo

    botao.addEventListener('click', () => {
      const letraClicada = botao.dataset.letra;
      verificarLetra(letraClicada, botao,false);
    });

    teclado.appendChild(botao);
});

// Funções de gerenciamento do jogo

function novoJovo(){
  resetarJogo();
  let modoJogo = document.querySelector('input[name="modoDeJogo"]:checked').value;
  const boxJogo = document.getElementById('box-jogo');
  nomejogadorUm = document.getElementById('jogadorUm').value;

  if(nomejogadorUm.length == 0){
    alert("Informe nome do Jogador 1");
    return;
  }
  document.getElementById('indicadorJogadorUm').innerText = nomejogadorUm;

  nomejogadorDois = document.getElementById('jogadorDois').value;
  const indicadorJogadorComputador = document.getElementById('indicadorJogadorComputador');

  if(modoJogo == "doisJogadores"){
    if(nomejogadorDois.length == 0){
      alert("Informe nome do Jogador 2");
      return;
    }
    modoJogoSelecionado = "doisJogadores";
    escolherPrimeiroJogador();
    indicadorJogadorComputador.classList.add('oculto');
    indicadorJogadorDois.classList.remove('oculto');
  }
  else{
    modoJogoSelecionado = "Computador";
    escolherPrimeiroJogador(true);
    indicadorJogadorComputador.classList.remove('oculto');
    indicadorJogadorDois.classList.add('oculto');
  }

  document.getElementById('indicadorJogadorDois').innerText = nomejogadorDois;
  boxJogo.classList.remove('oculto');

  palavraSecreta = atob(escolherPalavraAleatoria(palavras));

  const palavraSecretaDiv = document.querySelector('.palavra-secreta');

  for (let i = 0; i < palavraSecreta.length; i++) {
    const letraSpan = document.createElement('span');
    letraSpan.classList.add('letra-palavra-secreta');
    letraSpan.textContent = "_";
    palavraSecretaDiv.appendChild(letraSpan);
  }    
  
}

function atualizarMensagem(mensagem) {
  document.getElementById('mensagem').innerHTML = mensagem;
}

function verificarLetra(letra,botao, ehTurnoComputador = false) {
  if(fimJogo)
    return;

  if(!ehTurnoComputador){
    if(jogadorAtual != "indicadorJogadorUm" && jogadorAtual != "indicadorJogadorDois" ){
      //clique no turno do computador, ignorar
      return;
    }
  }
  const forcaImg = document.getElementById('imagem-forca');

  const letrasPalavraSecreta = document.querySelectorAll('.letra-palavra-secreta');
  let acertou = false;

  // Desabilitar o botão da letra clicada
  botao.disabled = true;

  for (let i = 0; i < palavraSecreta.length; i++) {
    if (palavraSecreta[i] === letra.toLowerCase()) {
      letrasPalavraSecreta[i].textContent = letra;
      acertou = true;
    }
  }

  letrasUtilizadas.push(letra.toLocaleUpperCase());

  if (!acertou) {
    erros++;
    forcaImg.src = `imagens/Jogoforca${erros}.png`;
    if(modoJogoSelecionado == "doisJogadores"){
      if(jogadorAtual == "indicadorJogadorUm"){
        atualizarMensagem('Jogador ' + nomejogadorUm + ' errou, vez do jogador '+ nomejogadorDois);
        mudarJogadorAtivo("indicadorJogadorDois");
      }
      else{
        atualizarMensagem('Jogador ' + nomejogadorDois + ' errou, vez do jogador '+ nomejogadorUm);
        mudarJogadorAtivo("indicadorJogadorUm");
      }
    }
    else{
      if(jogadorAtual == "indicadorJogadorUm"){
        atualizarMensagem('Jogador ' + nomejogadorUm + ' errou, vez do Computador');
        mudarJogadorAtivo("indicadorJogadorComputador");
        jogadaDoComputador();
      }
      else{
        atualizarMensagem('Computador errou, vez do Jogador ' + nomejogadorUm);
        mudarJogadorAtivo("indicadorJogadorUm");

      }
    }
    
    if (erros === 8) {
      // Fim de jogo, jogador perdeu
      fimJogo = true;
      atualizarMensagem('Ninguém ganhou! A Palava Secreta Era:' + palavraSecreta);
      alert('Ninguém ganhou! A Palava Secreta Era:' + palavraSecreta);
      revelarPalavraSecreta();
    }
  } else {
    // Verificar se o jogador ganhou
    
    if(modoJogoSelecionado == "doisJogadores"){
      if(jogadorAtual == "indicadorJogadorUm"){
        atualizarMensagem('Jogador ' + nomejogadorUm + ' Acertou! ');
        if (verificarVitoria()) {
          // Mostrar mensagem de vitória
          fimJogo = true;
          atualizarMensagem('O Jogador ' + nomejogadorUm + ' venceu! E acertou a palavra: '+ palavraSecreta);
          alert('O Jogador ' + nomejogadorUm + ' venceu! E acertou a palavra: '+ palavraSecreta);
        }
      }
      else{
        atualizarMensagem('Jogador ' + nomejogadorDois + ' Acertou! ');
        if (verificarVitoria()) {
          // Mostrar mensagem de vitória
          fimJogo = true;
          atualizarMensagem('O Jogador ' + nomejogadorDois + ' venceu! E acertou a palavra: '+ palavraSecreta);
          alert('O Jogador ' + nomejogadorDois + ' venceu! E acertou a palavra: '+ palavraSecreta);
        }
      }
    }
    else{
      if(jogadorAtual == "indicadorJogadorUm"){
        atualizarMensagem('Jogador ' + nomejogadorUm + ' Acertou! ');
        if (verificarVitoria()) {
          // Mostrar mensagem de vitória
          fimJogo = true;
          atualizarMensagem('O Jogador ' + nomejogadorUm + ' venceu! E acertou a palavra: '+ palavraSecreta);
          alert('O Jogador ' + nomejogadorUm + ' venceu! E acertou a palavra: '+ palavraSecreta);
        }
      }
      else{
        atualizarMensagem('Computador Acertou!');
        
        if (verificarVitoria()) {
          // Mostrar mensagem de vitória
          fimJogo = true;
          atualizarMensagem('O Computador venceu! E acertou a palavra: '+ palavraSecreta);
          alert('O Computador venceu! E acertou a palavra: '+ palavraSecreta);
        }
        else{
          jogadaDoComputador();
        }
      }
    }
  }
}

function jogadaDoComputador() {
  // Verificar se há vogais não utilizadas
  atualizarMensagem('O computador está pensando...');
  const vogaisDisponiveis = vogais.filter(vogal => !letrasUtilizadas.includes(vogal));
  if (vogaisDisponiveis.length > 0) {
      const indiceAleatorio = Math.floor(Math.random() * vogaisDisponiveis.length);
      letraEscolhida = vogaisDisponiveis[indiceAleatorio];

  } else {
      // Se não houver vogais disponíveis, escolher uma consoante comum
      const consoantesDisponiveis = consoantesComuns.filter(consoante => !letrasUtilizadas.includes(consoante));
      if(consoantesDisponiveis.length != 0){
        const indiceAleatorio = Math.floor(Math.random() * consoantesDisponiveis.length);
        letraEscolhida = consoantesDisponiveis[indiceAleatorio];
      }
      else{
        // já escolhido todas as consoantes comuns
        const botoes = document.querySelectorAll('.letra');
        // Filtra os botões, retornando apenas aqueles que não estão desabilitados
        const botoesHabilitados = Array.from(botoes).filter(botao => !botao.disabled);
        const indiceAleatorio = Math.floor(Math.random() * botoesHabilitados.length);
        letraEscolhida = botoesHabilitados[indiceAleatorio].innerHTML;
      }

  }

  if(letraEscolhida == undefined){
    alert("Opa, ocorreu um erro!");
    return;
  }
  // Adicionar a letra escolhida ao array de letras utilizadas
  let botaoDaLetra = document.querySelector('.letra[data-letra='+letraEscolhida.toLowerCase() +']');
  // Verificar se a letra escolhida está na palavra secreta e atualizar a tela

  setTimeout(() => {
    verificarLetra(letraEscolhida,botaoDaLetra,true);
  }, 1000); // Aguarda 1 segundo antes de verificar a letra
}

function verificarVitoria() {
  const letrasPalavraSecreta = document.querySelectorAll('.letra-palavra-secreta');
  return [...letrasPalavraSecreta].every(letra => letra.textContent !== '_');
}

function resetarJogo() {
  erros = 0;
  fimJogo = false;
  nomejogadorUm = '';
  nomejogadorDois = '';
  modoJogoSelecionado = 'doisJogadores';
  jogadorAtual = 'Jogador1';
  letrasUtilizadas = [];
  atualizarMensagem('');

  // Remover todos os filhos do elemento que contém a palavra secreta
  const palavraSecretaDiv = document.querySelector('.palavra-secreta');
  palavraSecretaDiv.innerHTML = '';

  // Remover a classe 'oculto' do inputJogadorDois (se necessário)
  const boxJogo = document.getElementById('box-jogo');
  boxJogo.classList.add('oculto');

  const imagemForca = document.getElementById('imagem-forca');
  imagemForca.src = "imagens/Jogoforca0.png";

  // Remover outras classes ou elementos adicionados dinamicamente
  const botoes = document.querySelectorAll('.letra');
  botoes.forEach(botao => {
    botao.disabled = false;
  });

  const jogadores = document.querySelectorAll('.jogador');
  // Remove a classe "ativo" de todos os jogadores
  jogadores.forEach(jogador => jogador.classList.remove('ativo'));
  palavraSecreta = '';

}

// Funções de interface

function revelarPalavraSecreta() {
  const letrasPalavraSecreta = document.querySelectorAll('.letra-palavra-secreta');
  letrasPalavraSecreta.forEach((letra, index) => {
    letra.textContent = palavraSecreta[index];
  });
}

function mudarJogadorAtivo(idJogador) {
  // Seleciona todos os elementos com a classe "jogador"
  const jogadores = document.querySelectorAll('.jogador');

  // Remove a classe "ativo" de todos os jogadores
  jogadores.forEach(jogador => jogador.classList.remove('ativo'));
  
  // Adiciona a classe "ativo" ao jogador especificado
  const jogadorSelecionado = document.getElementById(idJogador);
  jogadorSelecionado.classList.add('ativo');
  jogadorAtual = idJogador;
}

function escolherPrimeiroJogador(contraComputador) {
  if (contraComputador) {
    // Jogo contra o computador, o jogador 1 sempre começa
    jogadorAtual = 'Jogador1';
    mudarJogadorAtivo("indicadorJogadorUm");
    atualizarMensagem('O Jogador ' + nomejogadorUm + ' começa');
    return 'Jogador 1';
  } else {
    // Jogo entre dois jogadores, escolhe aleatoriamente
    const jogadores = ['Jogador1', 'Jogador2'];
    const indiceAleatorio = Math.floor(Math.random() * jogadores.length);
    const primeiroJogador = jogadores[indiceAleatorio];
    jogadorAtual = primeiroJogador;
    if (primeiroJogador == "Jogador1"){
      mudarJogadorAtivo("indicadorJogadorUm");
      atualizarMensagem('O Jogador ' + nomejogadorUm + ' começa');
    }
    else{
      atualizarMensagem('O Jogador ' + nomejogadorDois + ' começa');
      mudarJogadorAtivo("indicadorJogadorDois");
    }
    return primeiroJogador;
  }
}

function mostrarInputJogadorDois() {
    // Obtém o elemento do input pelo ID
    const inputJogadorDois = document.getElementById('label-jogadorDois');
    const spanJogadorUm = document.getElementById('span-jogador1');
    const inputJogadorUm = document.getElementById('jogadorUm');

    // Remove a classe 'oculto' (se houver) para exibir o input
    inputJogadorDois.classList.remove('oculto');
    spanJogadorUm.innerText = "Jogador 1";
    inputJogadorUm.placeholder = "Digite o nome do jogador 1";
  }
  
  function esconderInputJogadorDois() {
    // Obtém o elemento do input pelo ID
    const inputJogadorDois = document.getElementById('label-jogadorDois');
    const spanJogadorUm = document.getElementById('span-jogador1');
    const inputJogadorUm = document.getElementById('jogadorUm');
    
    // Adiciona a classe 'oculto' para esconder o input
    inputJogadorDois.classList.add('oculto');
    spanJogadorUm.innerText = "Jogador";
    inputJogadorUm.placeholder = "Jogador";
  }

  function mostrarExplicacao() {
    const secaoExplicacao = document.getElementById('explicacao-jogar');
    secaoExplicacao.classList.remove('oculto'); // Remove a classe para mostrar
    document.querySelector('.overlay').style.display = 'block';
  }
  
  function fecharExplicacao() {
    const secaoExplicacao = document.getElementById('explicacao-jogar');
    document.querySelector('.overlay').style.display = 'none';

    secaoExplicacao.classList.add('oculto'); // Adiciona a classe para ocultar
  }
