import _ from 'underscore';


    document.addEventListener("DOMContentLoaded", () => {
        const modal = document.getElementById("modalNombre");
        const inputNombre = document.getElementById("nombre");
        const btnGuardar = document.getElementById("btnGuardarNombre");
        const nombreJugadorElemento = document.getElementById("nombreJugador");

        const modalReglas = document.getElementById("modalReglas");
        const userNamePlaceholder = document.getElementById("userNamePlaceholder");
        const btnCerrarReglas = document.getElementById("btnCerrarReglas");

        // 🔹 Asegurar que el modal de reglas esté oculto desde el inicio
        modalReglas.style.display = "none";
        
    
        let nombreJugador = localStorage.getItem("nombreJugador");
    
        if (!nombreJugador) {
            modal.style.display = "flex";
            
        }else{

            nombreJugadorElemento.innerText = nombreJugador;
        }
        
        btnGuardar.addEventListener("click", () => {
            let nuevoNombre = inputNombre.value.trim();
            if (!nuevoNombre) nuevoNombre = "Jugador"; 
            
            localStorage.setItem("nombreJugador", nuevoNombre);
            nombreJugadorElemento.innerText = nuevoNombre;
            modal.style.display = "none";

        });

            // Evento para mostrar reglas cuando el usuario lo desee
        btnVerReglas.addEventListener("click", () => {
        userNamePlaceholder.innerText = localStorage.getItem("nombreJugador") || "Jugador";
        modalReglas.style.display = "flex";
        });


        btnCerrarReglas.addEventListener("click", () => {
            modalReglas.style.display = "none";
           
        });
        

        inputNombre.addEventListener("keypress", (e) => {
        if (e.key === "Enter") btnGuardar.click();
    });

    });

    
    let deck= [];
    const tipos= ['C', 'D', 'H', 'S'],
          especiales= ['A', 'J', 'Q', 'K'];
    
    let puntosJugadores= [];

    //Referencias HTML
    const btnPedir= document.querySelector('#btnPedir'),
          btnDetener= document.querySelector('#btnDetener'),
          btnNuevo= document.querySelector('#btnNuevo');

    const puntosHTML= document.querySelectorAll('small'),
          divCartasJugadores= document.querySelectorAll('.divCartas');

    //INICIALIZA EL JUEGO
    const inicioJuego= (numJugadores= 2) => {

        deck= crearDeck();
        puntosJugadores= [];
       
        
        for(let i=0; i<numJugadores; i++){
            puntosJugadores.push(0);
        }
        puntosHTML.forEach(element => element.innerText= 0);
        divCartasJugadores.forEach(element => element.innerHTML= '');
    
        btnPedir.disabled= false;
        btnDetener.disabled= false;
    
    }
    
    const crearDeck= () => {
        deck= [];

        for(let i=2; i<=10; i++){
            for(let tipo of tipos){
                deck.push(i + tipo);
            }
        }
    
        for(let tipo of tipos){
            for(let esp of especiales){
                deck.push(esp + tipo);
            }
            
        }

        return _.shuffle(deck);;
    
    }
    
    //Funcion para tomar una carta
    const pedirCarta= () => {
        if( deck.length === 0){
            throw 'No hay mas cartas en el deck';
        }
 
        return deck.pop();
    }

    const valorCarta= (carta) =>{
        const valor= carta.substring(0, carta.length-1);
    
        return (isNaN(valor)) ?
                (valor === 'A') ? 11: 10
                : valor*1;
    
    }

    //FUNCION PARA ACUMULAR PUNTOS
    const acumularPuntos= (carta, turno) =>{
        puntosJugadores[turno]= puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText= puntosJugadores[turno];
        return puntosJugadores[turno];
    }
    
    const crearCarta= (carta, turno) =>{
        const imgCarta= document.createElement('img');
        imgCarta.src= `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    //
    const modalResultado = document.getElementById("modalResultado");
    const resultadoTitulo = document.getElementById("resultadoTitulo");
    const resultadoMensaje = document.getElementById("resultadoMensaje");
    const btnCerrarResultado = document.getElementById("btnCerrarResultado");

    const determinarGanador= () =>{

        const [puntosJugador, puntosComputadora] = puntosJugadores; 

        let mensaje = "";
        let titulo = "";
    
        if (puntosJugador === puntosComputadora) {
            titulo = "¡Empate!";
            mensaje = "Ambos tienen el mismo puntaje. ¡Intenta de nuevo!";
        } else if (puntosJugador > 21) {
            titulo = "¡La IA gana!";
            mensaje = "Te pasaste de 21. ¡Sigue practicando!";
        } else if (puntosComputadora > 21) {
            titulo = "¡Ganaste!";
            mensaje = "La IA se pasó de 21. ¡Bien jugado!";
        } else if (puntosJugador > puntosComputadora) {
            titulo = "¡Ganaste!";
            mensaje = "¡Tu puntuación es mayor que la de la IA!";
        } else {
            titulo = "¡La IA gana!";
            mensaje = "La IA tiene una mejor puntuación. ¡Sigue intentando!";
        }
    
        // Mostrar el modal con el resultado
        resultadoTitulo.innerText = titulo;
        resultadoMensaje.innerText = mensaje;
        modalResultado.style.display = "flex";

    }

    // Cerrar modal de resultado
    btnCerrarResultado.addEventListener("click", () => {
    modalResultado.style.display = "none";
    });

    //TURNO COMPUTADORA
    const turnoComputadora= (puntosMinimos) =>{

        let puntosComputadora= 0;
    
        do{
            const carta= pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length-1);
            crearCarta(carta, puntosJugadores.length-1);
   
        }while( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();
    
    }
    
    //Eventos
    btnPedir.addEventListener('click', ()=>{
        const carta        = pedirCarta();
        const puntosJugador= acumularPuntos(carta, 0);
        crearCarta(carta, 0);

    
        if(puntosJugador > 21){
            btnPedir.disabled= true;
            btnDetener.disabled= true;
            turnoComputadora(puntosJugador);
    
        }else if(puntosJugador === 21){
            btnPedir.disabled= true;
            btnDetener.disabled= true;
            turnoComputadora(puntosJugador);
        }
    
    })
    
    btnDetener.addEventListener('click', () =>{
        btnPedir.disabled= true;
        btnDetener.disabled= true;
    
        turnoComputadora(puntosJugadores[0]);
    })
    
    btnNuevo.addEventListener('click', () => {
        inicioJuego();
        
    })






