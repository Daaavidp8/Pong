let velocidad = 5;
var velocity_x = Math.round(Math.random()) === 0 ? -velocidad : velocidad ;
var velocity_y = Math.round(Math.random()) === 0 ? -velocidad : velocidad ;
let numPlayers;
let jugador1;
let jugador2;
let pelota;
let campo;
let marcador = [0,0];
let intervalos = {}
let teclasPulsadas = [];
let puntuacion = 0;
let playKeys = [];
let seleccionado = [false,false];
let paused = false;
let input1p1 = document.getElementsByName('upPlayer1')[0];
let input1p2 = document.getElementsByName('downPlayer1')[0];
let input2p1;
let input2p2;
let nombrej1;
let nombrej2;
let teclasanadidas = false;
let formularioEliminado = false;

let jugar = () => {
    // Asigno teclas si no estan ya
    if (!teclasanadidas){
        playKeys.push(document.getElementsByName('upPlayer1')[0].value);
        playKeys.push(document.getElementsByName('downPlayer1')[0].value);

        if (numPlayers === 2){
            playKeys.push(document.getElementsByName('upPlayer2')[0].value);
            playKeys.push(document.getElementsByName('downPlayer2')[0].value);
        }
        teclasanadidas = true;
    }


    // Elimino el formulario de los settings

    if(!formularioEliminado){
        let formulario = document.getElementsByClassName('containerForm')[0];
        document.body.removeChild(formulario);
        formularioEliminado = true;
    }


    crearCampo();

    jugador1 = document.getElementsByClassName("jugador1")[0];
    jugador2 = document.getElementsByClassName("jugador2")[0];
    campo = document.getElementsByClassName("campo")[0];
    pelota = document.getElementsByClassName("pelota")[0];


    // Posicion de inicio de la Pelota Random
    pelota.style.left = Math.floor(Math.random() * (50 / 100 * campo.offsetWidth) + 25 / 100 * campo.offsetWidth) + "px";
    pelota.style.top = Math.floor(Math.random() * (50 / 100 * campo.offsetHeight) + 25 / 100 * campo.offsetHeight) + "px";


    countdown();


    // Colisiones Jugadores
    intervalos["comprobarColisionJugadores"] = setInterval(comprobarColisionJugadores, 10);

}


let crearCampo = () => {

    let caja = document.createElement("div")
    caja.className = "campo";
    document.body.appendChild(caja);

    let stick1 = document.createElement("div");
    stick1.classList.add("jugador1","jugadores");
    caja.appendChild(stick1);


    if (numPlayers === 2){
        let stick2 = document.createElement("div");
        stick2.classList.add("jugador2","jugadores");
        caja.appendChild(stick2);
    }

    let linea = document.createElement("div");
    linea.className = "linea";
    caja.appendChild(linea);

    let circuloCentral = document.createElement("div");
    circuloCentral.className = "circulo";
    caja.appendChild(circuloCentral);



    pelota = document.createElement("div");
    pelota.className = "pelota";
    caja.appendChild(pelota);


}

// Con esta funcion lo que queria es tener solo un onkeydown y dependiendo la tecla que pulse que haga una funcion o otra
// Pero no me ha dado tiempo y tengo varios onkeydown
let leerTeclaPulsada = (pkey) => {

    // Pausa Del Juego
    if (pkey.key === "Escape"){
        pausar_juego();
    }

}


let puntos;
let i;
let mostrarPuntuacion = () => {
    puntos = document.createElement('div');
    puntos.className = "puntuaciones";
    puntos.innerText = puntuacion.toString();
    campo.appendChild(puntos);
    intervalos["mostrarPuntos"]  = setInterval(() => {
        puntos.innerText = puntuacion.toString();
    }, 100);

    i = 3;
    intervalos["mostrarPuntuacion"]  = setInterval(() => {
        i--;
        if (i < 0) {
            campo.removeChild(puntos);
            clearInterval(intervalos.mostrarPuntuacion);
            clearInterval(intervalos.mostrarPuntos);
        }
    }, 1500);
}

let countdown = () => {
    eliminarListeners()

    let fondoOscuro = document.createElement('div');
     fondoOscuro.className = "fondoOscuro";
    document.body.appendChild(fondoOscuro);

    let contador = document.createElement('div');
    contador.className = "contador";


    campo.appendChild(contador);

    let numeros = document.createElement('h1');
    contador.appendChild(numeros);

    let puntuaciones;
    if (numPlayers === 2){
        puntuaciones = document.createElement('div');
        puntuaciones.className = "puntuaciones";
        puntuaciones.innerText = marcador[0] + "   " + marcador[1];
        campo.appendChild(puntuaciones);
    }

    let i = 3;
    numeros.innerHTML = i.toString();
    intervalos["cuentaAtras"]  = setInterval(() => {
            i--;
            numeros.innerHTML = i.toString();
            if (i < 0) {
                campo.removeChild(contador);
                document.body.removeChild(fondoOscuro);

                // Colisiones Pelota
                intervalos["intervaloPelota"] = setInterval(mov_pelota, 10);

                if (numPlayers === 2) {
                    setTimeout(() => {
                        campo.removeChild(puntuaciones);
                    }, 3500);
                } else {
                    // Incremento de velocidad de la pelota en modo 1 jugador
                    intervalos["incrementoPelota"] = setInterval(() => {
                            velocidad++;
                            velocity_x = velocity_x > 0 ? velocidad : -velocidad;
                        }, 5000);
                    intervalos["incrementoPuntuacion"] = setInterval(() => {
                        if (puntuacion % 500 === 0){
                            mostrarPuntuacion();
                        }
                        puntuacion++;
                    }, 100);
                }


                // Activo las pulsaciones de tecla
                document.addEventListener('keydown',leerTeclaPulsada);


                // Control de los Jugadores
                document.addEventListener('keydown',mov_jugadores);
                if (seleccionado[0]){
                    document.addEventListener('wheel',(event) => scrollMove(event,0));
                }else if (seleccionado[1]){
                    document.addEventListener('wheel',(event) => scrollMove(event,1));
                }
                document.addEventListener('keyup',detener_jugadores);


                clearInterval(intervalos.cuentaAtras);
            }

        }, 1500)




}


let resetPunto = (ganador) => {
    velocidad++;
    if (ganador === 1){
        pelota.style.left = ((25 / 100) * campo.offsetWidth) + "px";
        velocity_x = -velocidad;
    }else {
        pelota.style.left = ((75 / 100) * campo.offsetWidth) + "px";
        velocity_x = velocidad;
    }
    velocity_y = 0;
    pelota.style.top = ((50 / 100) * campo.offsetHeight) - (pelota.offsetHeight / 2) + "px";
    jugador1.style.top = (campo.offsetHeight / 2) - (jugador1.offsetHeight / 2) + "px";
    jugador2.style.top = (campo.offsetHeight / 2) - (jugador2.offsetHeight / 2) + "px";
    clearInterval(intervalos.subirJugador1);
    clearInterval(intervalos.bajarJugador1);
    clearInterval(intervalos.subirJugador2);
    clearInterval(intervalos.bajarJugador2);
    countdown();
}



let scoreBoard = () => {
    console.log(nombrej1)
    let scoreBoard = document.createElement('div');
    scoreBoard.className = "scoreBoard";
    if (numPlayers === 2){
        scoreBoard.innerHTML += "<div><h1>" + nombrej1.value + "</h1> <h1>VS</h1> <h1>" + nombrej2.value + "</h1></div>";
        scoreBoard.innerHTML += "<h1>" + marcador[0] + "-" + marcador[1] + "</h1><br>";
    }else{
        scoreBoard.innerHTML = "<br><h1>" + nombrej1.value + "</h1><br>";
        scoreBoard.innerHTML += "<h1>" + puntuacion + "</h1><br>";

    }
    scoreBoard.innerHTML += "<button onclick='location.reload()'>Volver al Menu</button>";
    scoreBoard.innerHTML += "<button onclick='restartPartida()'>Volver a Jugar</button>";

    campo.appendChild(scoreBoard);
}
let mov_pelota = () => {

    // Win Condition
    if (pelota.offsetLeft <= 0){
        clearInterval(intervalos.intervaloPelota);
        if (numPlayers === 2){
            marcador[1]++;
            if (marcador[1] === 3){
                eliminarListeners()
                scoreBoard()
            }else {
                resetPunto(1);
            }
        }else {
            document.removeEventListener('keydown',pausar_juego);
            clearInterval(intervalos.incrementoPelota);
            clearInterval(intervalos.intervaloPelota);
            clearInterval(intervalos.incrementoPuntuacion);
            eliminarListeners()
            scoreBoard();
        }
    }
    if (pelota.offsetLeft + pelota.offsetWidth >= campo.offsetWidth - 15) {
        if (numPlayers === 2) {
            clearInterval(intervalos.intervaloPelota);
            marcador[0]++;
            if (marcador[0] === 3){
                scoreBoard()
            }else {
                resetPunto(0);
            }
        }else {
            velocity_x = -velocity_x;
        }
    }


    // Colision Top and Bottom
    if (pelota.offsetTop <= 0 || pelota.offsetTop + pelota.offsetHeight >= campo.offsetHeight) {
        velocity_y = - velocity_y;
    }



    // Colision Paddles

    if (pelota.offsetLeft - 20 <= (jugador1.style.left + jugador1.offsetWidth) && pelota.offsetTop + (pelota.offsetHeight/2) >= jugador1.offsetTop && (pelota.offsetTop + (pelota.offsetHeight/2) <= jugador1.offsetTop + jugador1.offsetHeight)) {
        velocity_x = -velocity_x;
    }

    if (numPlayers === 2) {
        if ((pelota.offsetLeft + pelota.offsetWidth) + 20 >= (jugador2.offsetLeft) && (pelota.offsetTop + (pelota.offsetHeight/2) >= jugador2.offsetTop) && (pelota.offsetTop + (pelota.offsetHeight/2) <= jugador2.offsetTop + jugador2.offsetHeight)) {
            velocity_x = -velocity_x;
        }
    }


    pelota.style.top = (pelota.offsetTop + velocity_y) + "px";
    pelota.style.left = (pelota.offsetLeft + velocity_x) + "px";
}



let scrollMove = (scroll,player) => {
    if (player === 0) {
        if (scroll.deltaY < 0) {
            jugador1.style.top = (jugador1.offsetTop - 30) + "px";
        } else {
            jugador1.style.top = (jugador1.offsetTop + 30) + "px";
        }
    } else {
        if (scroll.deltaY < 0) {
            jugador2.style.top = (jugador2.offsetTop - 30) + "px";
        } else {
            jugador2.style.top = (jugador2.offsetTop + 30) + "px";
        }
    }
}

let mov_jugadores = (pkey) => {
    // Movement Player one
     if (pkey.key === playKeys[0]&& !teclasPulsadas.includes(pkey.key)){
         intervalos.subirJugador1 = setInterval(() => {
             jugador1.style.top = (jugador1.offsetTop - 10) + "px";
         },10);
     }

    if (pkey.key === playKeys[1] && !teclasPulsadas.includes(pkey.key)){
        intervalos.bajarJugador1 = setInterval(() => {
            jugador1.style.top = (jugador1.offsetTop + 10) + "px";
        },10)
    }


    // Movement Player Two
    if (numPlayers === 2){
        if (pkey.key === playKeys[2] && !teclasPulsadas.includes(pkey.key)){
            intervalos.subirJugador2 = setInterval(() => {
                jugador2.style.top = (jugador2.offsetTop - 10) + "px";
            },10)
        }
        if (pkey.key === playKeys[3]  && !teclasPulsadas.includes(pkey.key)){
            intervalos.bajarJugador2 = setInterval(() => {
                jugador2.style.top = (jugador2.offsetTop + 10) + "px";
            },10)
        }
    }

    if (playKeys.includes(pkey.key)){
        teclasPulsadas.push(pkey.key);
    }

}





let comprobarColisionJugadores = () => {

    // Colisiones jugador 1 top and bottom
    if (jugador1.offsetTop <= 0){
        jugador1.style.top = 0 + "px";
        clearInterval(intervalos.subirJugador1);
    }

    if (jugador1.offsetTop + jugador1.offsetHeight >= campo.offsetHeight){
        jugador1.style.top = campo.offsetHeight - jugador1.offsetHeight  + "px";
        clearInterval(intervalos.bajarJugador1);
    }


    // Colisiones jugador 2 top and bottom
    if (numPlayers === 2) {
        if (jugador2.offsetTop <= 0){
            jugador2.style.top = 0 + "px";
            clearInterval(intervalos.subirJugador2);
        }

        if (jugador2.offsetTop + jugador2.offsetHeight >= campo.offsetHeight){
            jugador2.style.top = campo.offsetHeight - jugador2.offsetHeight  + "px";
            clearInterval(intervalos.bajarJugador2);
        }
    }


}

let detener_jugadores = (keyup) => {

    // Stop Player One
    if (keyup.key === playKeys[0]){
        clearInterval(intervalos.subirJugador1);
    }
    if (keyup.key === playKeys[1]){
        clearInterval(intervalos.bajarJugador1);
    }


    // Movement Player Two
    if (numPlayers === 2){
        if (keyup.key === playKeys[2]){
            clearInterval(intervalos.subirJugador2);
        }
        if (keyup.key === playKeys[3]){
            clearInterval(intervalos.bajarJugador2);
        }
    }

    if (playKeys.includes(keyup.key)){
        teclasPulsadas.splice(keyup.key);
    }


}

let crearMenuPausa = () => {
    let fondoOscuro = document.createElement('div');
    fondoOscuro.className = "fondoOscuro";
    document.body.appendChild(fondoOscuro);

    let menuOpciones = document.createElement('div');
    menuOpciones.className = "menuOpciones";
    fondoOscuro.appendChild(menuOpciones);

    let resume = document.createElement('h1');
    resume.onclick = () => pausar_juego("Escape");
    resume.innerText = "Resume";
    menuOpciones.appendChild(resume);

    let quit = document.createElement('h1');
    quit.onclick = () => location.reload();
    quit.innerText = "Quit";
    menuOpciones.appendChild(quit);

}

let pausar_juego = (salir = "") => {
    if (!paused){
        paused = !paused;
        clearInterval(intervalos.intervaloPelota);
        clearInterval(intervalos.incrementoPelota);
        clearInterval(intervalos.incrementoPuntuacion);
        crearMenuPausa();
    }else if (paused || salir === "Escape") {
        let fondoOscuro = document.getElementsByClassName('fondoOscuro')[0];
        document.body.removeChild(fondoOscuro);
        paused = !paused;
        countdown();
    }
}

let cambiarForm = () => {
    numPlayers = document.getElementsByClassName('custom-select')[0];
    numPlayers = parseInt(numPlayers.options[numPlayers.selectedIndex].value);

    let contenedor = document.getElementById('inputs');
    let contenedorplayer2;
    let labelUpPlayer2;
    let labelDownPlayer2;

    if (numPlayers === 2){
        contenedorplayer2 = document.createElement('div');
        contenedorplayer2.innerHTML += "<h3>Teclas Jugador 2</h3>"
        contenedorplayer2.className = "contenedorPlayer2";

        labelDownPlayer2 = document.createElement('label');
        labelDownPlayer2.innerHTML += 'Nombre: <input type="text" name="namejug2">';
        contenedorplayer2.appendChild(labelDownPlayer2);

        labelUpPlayer2 = document.createElement('label');
        labelUpPlayer2.className = "keyUpPlayer2";
        labelUpPlayer2.innerHTML += 'Arriba: <input type=\"text\" name=\"upPlayer2\" maxlength="1">';
        contenedorplayer2.appendChild(labelUpPlayer2);

        labelDownPlayer2 = document.createElement('label');
        labelDownPlayer2.className = "keyDownPlayer2";
        labelDownPlayer2.innerHTML += 'Abajo: <input type=\"text\" name=\"downPlayer2\" maxlength="1">';
        contenedorplayer2.appendChild(labelDownPlayer2);

        labelDownPlayer2 = document.createElement('label');
        labelDownPlayer2.innerHTML += 'Scroll: <input type="radio" name="scroll" id="jug2" onclick="desselectRadio(this)">';
        contenedorplayer2.appendChild(labelDownPlayer2);

        contenedor.appendChild(contenedorplayer2);


        input2p1 = document.getElementsByName('upPlayer2')[0];
        input2p2 = document.getElementsByName('downPlayer2')[0];
    }else {
        contenedorplayer2 = document.getElementsByClassName("contenedorPlayer2")[0];
        contenedor.removeChild(contenedorplayer2);
    }
}





let disableKeys = () => {
    // Cojo todos los inputs de los jugadores


    if (numPlayers === 2){
        if (seleccionado[1]){
            input2p1.value = "";
            input2p2.value = "";
            input2p1.disabled = true;
            input2p2.disabled = true;
        }else {
            input2p1.disabled = false;
            input2p2.disabled = false;
        }
    }


    if (seleccionado[0]){
        input1p1.value = "";
        input1p2.value = "";
        input1p1.disabled = true;
        input1p2.disabled = true;
    }else {
        input1p1.disabled = false;
        input1p2.disabled = false;
    }

}

let desselectRadio = (boton) => {
    // Esta funcion hace que puedas seleccionar y deseleccionar el juego con raton de cada jugador
    let p1 = document.getElementById('jug1');
    let p2 = document.getElementById('jug2');


    if (boton.id === "jug1"){
        if (seleccionado[0]){
            seleccionado[0] = !seleccionado[0];
        }else{
            seleccionado[0] = true;
            seleccionado[1] = false;
        }
    }else {
        if (seleccionado[1]){
            seleccionado[1] = !seleccionado[1];
        }else{
            seleccionado[1] = true;
            seleccionado[0] = false;
        }
    }

    p1.checked = seleccionado[0];
    if (numPlayers === 2) {
        p2.checked = seleccionado[1];
    }

    // Desactivo los inputs
    disableKeys();


}




let validar = () => {
    nombrej1 = document.getElementsByName('namejug1')[0];

    let esValido = true;
    let aviso;



    if (numPlayers === 2){
        nombrej2 = document.getElementsByName('namejug2')[0];
        let teclasAutilizar = [input1p1.value,input1p2.value,input2p1.value,input2p2.value];
        if (nombrej2.value.length === 0){
            esValido = false;
            aviso = "El nombre del jugador 2 no puede estar en blanco";
        }

        // Si no esta marcada la casilla de jugar con el raton se valida el jugador 2
        if (!seleccionado[1]){

            for (let i = 0; i < teclasAutilizar.length; i++){
                if (teclasAutilizar[i] === ""){
                    teclasAutilizar.splice(i,1)
                }
            }
            let sinDuplicados = new Set(teclasAutilizar);

            if (sinDuplicados.size !== teclasAutilizar.length){
                esValido = false;
                aviso = "1 tecla no puede tener varias funciones";
            }

            if (input2p1.value.length === 0 || input2p2.value.length === 0){
                esValido = false;
                aviso = "Jugador 2 tiene que añadir sus teclas de juego";
            }
        }

    }

    if (!seleccionado[0]){
        if (input1p1.value.length === 0 || input1p2.value.length === 0){
            esValido = false;
            aviso = "Jugador 1 tiene que añadir sus teclas de juego";
        }else if (input1p1.value === input1p2.value){
            esValido = false;
            aviso = "1 tecla no puede tener varias funciones";
        }
    }

    if (nombrej1.value.length === 0){
        esValido = false;
        aviso = "El nombre del jugador 1 no puede estar en blanco";
    }

    if (!esValido){
        document.getElementById('mensajeError').innerHTML = "<p>" + aviso + "</p>";
    }else{
         jugar();
    }
}

let eliminarListeners = () => {
    document.removeEventListener('wheel',scrollMove);
    document.removeEventListener('keydown',pausar_juego);
    document.removeEventListener('keydown',mov_jugadores);
    document.removeEventListener('keyup',detener_jugadores);
}

let restartPartida = () => {
    document.body.removeChild(campo);

    if (numPlayers === 2){
        marcador = [0,0];
    }else {
        puntuacion = 0;
    }
    velocidad = 5;
    jugar()

}



