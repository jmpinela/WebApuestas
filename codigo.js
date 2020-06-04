
var idFila = 0;
var listaDeportes = ["Futbol", "Baloncesto", "Tenis", "Ciclismo", "Golf", "F1", "Otros"];
var listaNombres = ["Merino", "Tury", "Alvaro", "Miguel", "Ona", "Aitor", "Alberto", "Quique"];

$(document).ready(function () {
  var laTabla = JSON.parse(tablita);
  montaTabla(laTabla);
  incluyeDeportesYNombres();
});

function phpadd() {
  $.ajax({
        url: 'test.php',
        type: 'post',
        data: { "param": 35}
      });
}
function test(){
  window.alert("Filas "+idFila);
}
function incluyeDeportesYNombres(){
    var select = document.getElementById("sport");
    var tablaCells = document.getElementById("tablaStatsDeporte").rows[0].innerHTML;
    for (var i = 0; i<listaDeportes.length; i++){
          var opt = document.createElement('option');
          opt.value = listaDeportes[i];
          opt.innerHTML = listaDeportes[i];
          select.appendChild(opt);
          tablaCells = tablaCells + "<th>" + listaDeportes[i] + "</th>";
      }
      document.getElementById("tablaStatsDeporte").rows[0].innerHTML = tablaCells;

      select = document.getElementById("person");
      tablaCells = document.getElementById("tablaStatsPersonas").rows[0].innerHTML;
      for (var i = 0; i<listaNombres.length; i++){
            var opt = document.createElement('option');
            opt.value = listaNombres[i];
            opt.innerHTML = listaNombres[i];
            select.appendChild(opt);
            tablaCells = tablaCells + "<th>" + listaNombres[i] + "</th>";
        }
        document.getElementById("tablaStatsPersonas").rows[0].innerHTML = tablaCells;
}


function rellenaFila(){
    var listaFormulario = document.getElementById("formulario").elements;
    var miTabla = document.getElementById("tabla");
    var pasta = Number(listaFormulario["pasta"].value.replace(/,/g, '.'));
    if (isNaN(pasta) || pasta<=0) {
      window.alert("Cuanto cojones has apostado?");
      return;
    }
    var cuota = Number(listaFormulario["cuota"].value.replace(/,/g, '.'));
    if (isNaN(cuota) || cuota<=0){
      window.alert("Que puta cuota te dan?");
      return;
    }
    miTabla.innerHTML = miTabla.innerHTML +"<tr class='filanueva' id='fila"+idFila+"'><td>"+listaFormulario["apostante"].value
                                          +"</td><td>"+pasta
                                          +"</td><td>"+listaFormulario["deporte"].value
                                          +"</td><td>"+listaFormulario["descripcion"].value
                                          +"</td><td>"+listaFormulario["fechaEvento"].value
                                          +"</td><td>"+cuota
                                          +"</td><td>"+listaFormulario["resultado"].value
                                          +"</td><td>"+meteBotones("fila"+idFila)
                                          +"</td>"+introduceBalance(listaFormulario["resultado"].value, pasta, cuota)+"</tr>";
    idFila++;
    creaEstadisticasGlobales();
}

function meteBotones(n){
   return "<button onclick='editaFila("+n+")'>Editar</button><button onclick='borraFila("+n+")'>Borrar</button>";
}

function editaFila(cual){
  document.getElementById("formulario").elements["apostante"].value = cual.cells[0].innerHTML;
  document.getElementById("formulario").elements["pasta"].value = cual.cells[1].innerHTML;
  document.getElementById("formulario").elements["deporte"].value = cual.cells[2].innerHTML;
  document.getElementById("formulario").elements["descripcion"].value = cual.cells[3].innerHTML;
  document.getElementById("formulario").elements["fechaEvento"].value = cual.cells[4].innerHTML;
  document.getElementById("formulario").elements["cuota"].value = cual.cells[5].innerHTML;
  document.getElementById("formulario").elements["resultado"].value = cual.cells[6].innerHTML;
  borraFila(cual);
  //window.alert(document.getElementById("tabla").rows[1].cells[1].innerHTML);
}
function borraFila(cual) {
  $(cual).remove();
  creaEstadisticasGlobales();
}

function montaTabla(tabla) {
      var totalFilas = tabla.nFilas;
      var tablaContenido = document.getElementById("tabla").innerHTML;
      for (var i=0; i<totalFilas; i++) {
          tablaContenido = tablaContenido + "<tr class='filavieja' id='fila"+i+"'>";
          tablaContenido = tablaContenido + "<td>"+tabla.filas[i].apostante+"</td>";
          tablaContenido = tablaContenido + "<td>"+tabla.filas[i].pasta+"</td>";
          tablaContenido = tablaContenido + "<td>"+tabla.filas[i].deporte+"</td>";
          tablaContenido = tablaContenido + "<td>"+tabla.filas[i].descripcion+"</td>";
          tablaContenido = tablaContenido + "<td>"+tabla.filas[i].fecha+"</td>";
          tablaContenido = tablaContenido + "<td>"+tabla.filas[i].cuota+"</td>";
          tablaContenido = tablaContenido + "<td>"+tabla.filas[i].resultado+"</td>";
          tablaContenido = tablaContenido + "<td>"+meteBotones("fila"+i)+"</td>";
          if (tabla.filas[i].resultado!="waiting") tablaContenido = tablaContenido +introduceBalance(tabla.filas[i].resultado, tabla.filas[i].pasta, tabla.filas[i].cuota);
          else  tablaContenido += "<td>0</td>";
          tablaContenido = tablaContenido + "</tr>";
      }
      document.getElementById("tabla").innerHTML = tablaContenido;
      idFila = totalFilas;
      creaEstadisticasGlobales();
}

  function introduceBalance(quePaso, cuanto, aQue) {
      if (quePaso!="ganada" && quePaso!="perdida" && quePaso!="waiting") return "<td>ResultadoRARO</td>";
      if (quePaso=="waiting") return "<td>0</td>";
      if (quePaso=="perdida") return "<td style='background-color: red'>-"+cuanto+"</td>";
      if (quePaso=="ganada") return "<td style='background-color: green'>+"+(Number(cuanto)*Number(aQue))+"</td>";
  }

  function creaEstadisticasGlobales() {
      var filas = document.getElementById("tabla").rows;
      var betTotal = filas.length-1;
      var balanceT= 0, dinero= 0, betWin= 0, betWait= 0;
      var x = 0;
      for (var i =1; i<filas.length; i++) {
          x = Number(filas[i].cells[8].innerHTML);
          if (!isNaN(x)) balanceT += x;
          x = Number(filas[i].cells[1].innerHTML);
          if (!isNaN(x)) dinero += x;
          if (filas[i].cells[6].innerHTML=="ganada") betWin++;
          if (filas[i].cells[6].innerHTML=="waiting") betWait++;
      }
      document.getElementById("balanceTotal").innerHTML = balanceT.toFixed(2);
      document.getElementById("dineroJugado").innerHTML = dinero;
      document.getElementById("apTotales").innerHTML = betTotal;
      document.getElementById("apGanadas").innerHTML = betWin;
      document.getElementById("apJuego").innerHTML = betWait;
  }

  function creaEstadisticas(cual){
    var filas = document.getElementById("tabla").rows;
    var arrayObjs = [];
    if (cual==0) {
        for (var i = 0; i<listaNombres.length; i++){
            var newObj = {nombre:listaNombres[i], balance:0, dinero:0, apJugadas:0, apGanadas:0, deporteFavorito:[]};
            for (var j = 0; j<listaDeportes.length; j++) {
                var newDeporte = {nombre:listaDeportes[j], ap:0};
                newObj.deporteFavorito.push(newDeporte);
            }
            arrayObjs.push(newObj);
        }
        for (var i =1; i<filas.length; i++) {
            for (var j=0; j<arrayObjs.length; j++) {
                if (filas[i].cells[0].innerHTML==arrayObjs[j].nombre) {
                    arrayObjs[j].balance += Number(filas[i].cells[8].innerHTML);
                    arrayObjs[j].dinero += Number(filas[i].cells[1].innerHTML);
                    if (filas[i].cells[6].innerHTML!="waiting") arrayObjs[j].apJugadas++;
                    if (filas[i].cells[6].innerHTML=="ganada") arrayObjs[j].apGanadas++;
                    for (var k=0; k < arrayObjs[j].deporteFavorito.length; k++) {
                          if (filas[i].cells[2].innerHTML==arrayObjs[j].deporteFavorito[k].nombre)       arrayObjs[j].deporteFavorito[k].ap++;
                    }
                }
            }
        }
        var htmlFila = ["<th>Balance</th>", "<th>Dinero jugado</th>", "<th>ap balance</th>", "<th>Deporte favorito</th>"];
        var filaNombres = document.getElementById("tablaStatsPersonas").rows[0].cells;
        for (var i=1; i<filaNombres.length; i++) {
          for (var j=0; j<arrayObjs.length; j++) {
            if (filaNombres[i].innerHTML==arrayObjs[j].nombre) {
                htmlFila[0] = htmlFila[0] + "<td>"+arrayObjs[j].balance+"</td>";
                htmlFila[1] = htmlFila[1] + "<td>"+arrayObjs[j].dinero+"</td>";
                htmlFila[2] = htmlFila[2] + "<td>"+ creaStringap(arrayObjs[j].apJugadas,arrayObjs[j].apGanadas)+"</td>";
                htmlFila[3] = htmlFila[3] + "<td>"+calculaFavorito(arrayObjs[j].deporteFavorito)+"</td>";
            }
          }
        }
        for (var i =0; i<4; i++) document.getElementById("tablaStatsPersonas").rows[i+1].innerHTML = htmlFila[i];
    }
    arrayObjs = [];
    if (cual==1) {
      for (var i = 0; i<listaDeportes.length; i++){
          var newObj = {nombre:listaDeportes[i], balance:0, dinero:0, apJugadas:0, apGanadas:0, personas:[]};
          for (var j = 0; j<listaNombres.length; j++) {
              var newPersona = {nombre:listaNombres[j], jugadas:0, ganadas:0, balance:0};
              newObj.personas.push(newPersona);
          }
          arrayObjs.push(newObj);
      }
      for (var i =1; i<filas.length; i++) {
          for (var j=0; j<arrayObjs.length; j++) {
              if (filas[i].cells[2].innerHTML==arrayObjs[j].nombre) {
                  arrayObjs[j].balance += Number(filas[i].cells[8].innerHTML);
                  arrayObjs[j].dinero += Number(filas[i].cells[1].innerHTML);
                  if (filas[i].cells[6].innerHTML!="waiting") arrayObjs[j].apJugadas++;
                  if (filas[i].cells[6].innerHTML=="ganada") arrayObjs[j].apGanadas++;
                  for (var k=0; k < arrayObjs[j].personas.length; k++) {
                        if (filas[i].cells[0].innerHTML==arrayObjs[j].personas[k].nombre) {
                              if (filas[i].cells[6].innerHTML!="waiting") arrayObjs[j].personas[k].jugadas++;
                              if (filas[i].cells[6].innerHTML=="ganada") arrayObjs[j].personas[k].ganadas++;
                              arrayObjs[j].personas[k].balance += Number(filas[i].cells[8].innerHTML);
                        }
                  }
              }
          }
      }
      var htmlFila = ["<th>Balance</th>", "<th>Dinero jugado</th>", "<th>ap balance</th>", "<th>Jugador Mejor Balance</th>", "<th>Jugador Peor Balance</th>", "<th>Jugador Mejor ap</th>", "<th>Jugador Peor ap</th>"];
      var filaNombres = document.getElementById("tablaStatsDeporte").rows[0].cells;
      for (var i=1; i<filaNombres.length; i++) {
        for (var j=0; j<arrayObjs.length; j++) {
          if (filaNombres[i].innerHTML==arrayObjs[j].nombre) {
              htmlFila[0] = htmlFila[0] + "<td>"+arrayObjs[j].balance+"</td>";
              htmlFila[1] = htmlFila[1] + "<td>"+arrayObjs[j].dinero+"</td>";
              htmlFila[2] = htmlFila[2] + "<td>"+ creaStringap(arrayObjs[j].apJugadas,arrayObjs[j].apGanadas)+"</td>";
              htmlFila[3] = htmlFila[3] + "<td>"+daMejorBalance(arrayObjs[j].personas)+"</td>";
              htmlFila[4] = htmlFila[4] + "<td>"+daPeorBalance(arrayObjs[j].personas)+"</td>";
              htmlFila[5] = htmlFila[5] + "<td>"+daMejorApuesta(arrayObjs[j].personas)+"</td>";
              htmlFila[6] = htmlFila[6] + "<td>"+daPeorApuesta(arrayObjs[j].personas)+"</td>";
          }
        }
      }
      for (var i =0; i<7; i++) document.getElementById("tablaStatsDeporte").rows[i+1].innerHTML = htmlFila[i];
    }
  }

  function creaStringap(jugadas, ganadas) {
    var porcentaje = 0;
    if (jugadas>0) porcentaje = ((ganadas/jugadas).toFixed(4)) *100;
    return ""+ganadas+"/"+jugadas+"  "+porcentaje+"%";
  }

  function calculaFavorito(datos){
      var toReturn = datos[0].nombre;
      var max = datos[0].ap;
      for (var i=1; i<datos.length; i++) {
          if (datos[i].ap==max) toReturn = toReturn + "/" + datos[i].nombre;
          if (datos[i].ap>max) {
            toReturn = datos[i].nombre;
            max = datos[i].ap;
          }
      }
      if (max==0) toReturn = "None";
      return toReturn;
  }

  function daMejorBalance(datos){
     var toReturn = datos[0].nombre;
     var max = datos[0].balance;
     for (var i=1; i<datos.length; i++) {
         if (datos[i].balance==max) toReturn = toReturn + "/" + datos[i].nombre;
         if (datos[i].balance>max) {
           toReturn = datos[i].nombre;
           max = datos[i].balance;
         }
     }
     if (max==0) return "None";
     return toReturn+" "+max;
  }

  function daPeorBalance(datos){
     var toReturn = datos[0].nombre;
     var min = datos[0].balance;
     for (var i=1; i<datos.length; i++) {
         if (datos[i].balance==min) toReturn = toReturn + "/" + datos[i].nombre;
         if (datos[i].balance<min) {
           toReturn = datos[i].nombre;
           min = datos[i].balance;
         }
     }
     if (min==0) return "None";
     return toReturn+" "+min;
  }

  function daMejorApuesta(datos){
     var toReturn = datos[0].nombre;
     var max = 0;
     if (datos[0].jugadas!=0) max = (datos[0].ganadas/datos[0].jugadas).toFixed(4);
     for (var i=1; i<datos.length; i++) {
         if (datos[i].jugadas==0) continue;
         if ((datos[i].ganadas/datos[i].jugadas).toFixed(4)==max) toReturn = toReturn + "/" + datos[i].nombre;
         if ((datos[i].ganadas/datos[i].jugadas).toFixed(4)>max) {
           toReturn = datos[i].nombre;
           max = (datos[i].ganadas/datos[i].jugadas).toFixed(4);
         }
     }
     if (max==0) return "None";
     return toReturn+" "+(max*100)+"%";
  }

  function daPeorApuesta(datos){
     var toReturn = "";
     var min = 0;
     var none = true;

     for (var i=0; i<datos.length; i++) {
         if (datos[i].jugadas==0) continue;
         none = false;
         if ((datos[i].ganadas/datos[i].jugadas).toFixed(4)==min) toReturn = toReturn + "  " + datos[i].nombre;
         if ((datos[i].ganadas/datos[i].jugadas).toFixed(4)<min) {
           toReturn = datos[i].nombre;
           min = (datos[i].ganadas/datos[i].jugadas).toFixed(4);
         }
     }
     if (none) return "None";
     return toReturn+" "+(min*100)+"%";
  }
