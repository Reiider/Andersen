/**
 * Created by Admin on 07.10.2016.
 */

var ingredients;
var dishes;

(function(){
    var http_request_ingr = new XMLHttpRequest();
    http_request_ingr.open( "GET", "ingredients.json");
    http_request_ingr.send();
    http_request_ingr.onreadystatechange = function () {
        if(http_request_ingr.readyState !== 4)
            return;
        if(http_request_ingr.status !== 200 )
            throw new Error('request was defeated');
        var json=eval( '('+http_request_ingr.responseText+')' );
        ingredients = json.ingredient;
        //ingredients.LENGTH = json.ingredient.length;
    };
    var http_request_dishes = new XMLHttpRequest();
    http_request_dishes.open( "GET", "dishes.json");
    http_request_dishes.send();
    http_request_dishes.onreadystatechange = function () {
        if(http_request_dishes.readyState !== 4)
            return;
        if(http_request_dishes.status !== 200 )
            throw new Error('request was defeated');
        var json=eval( '('+http_request_dishes.responseText+')' );
        dishes = json.dishes;

    };
})();


function loading() {


    var ingr, im, tooltip, strMassImageForTooltip;
    for(var i = 0; i < ingredients.length; i++) {
        ingr = document.createElement('span');
        im = document.createElement('span');
        tooltip = document.createElement('span');
        ingr.setAttribute("class","ingredient");
        ingr.setAttribute("id","ingredient" + i);
        tooltip.setAttribute("class","tooltip");
        tooltip.setAttribute("id","tooltip" + ingredients[i].myName);
        im.innerHTML = "<img src='img/" + ingredients[i].fileName +
            "' draggable='true' ondragstart='drag(event)' class='ingredient' id='" + ingredients[i].myName + "' width='80px' height='80px'>";
        strMassImageForTooltip = "";
        for(var k = 0; k < dishes.length; k++){
            for(var j = 0; j < dishes[k].part.length; j++){
                if(dishes[k].part[j] == ingredients[i].myName){
                    strMassImageForTooltip += "<img class='custom' src='img/" + dishes[k].fileName + "' width='50px' height='50px'>";
                }
            }
        }
        tooltip.innerHTML = strMassImageForTooltip;
        tooltip.style.visibility = "hidden";
        ingr.appendChild(im);
        ingr.appendChild(tooltip);
        ingr.setAttribute("onmousemove","movePic('tooltip"+ingredients[i].myName + "')");
        ingr.setAttribute("onmouseout","hidePic('tooltip" + ingredients[i].myName+"')");

        document.getElementById("market").appendChild(ingr);
        document.getElementById(ingredients[i].myName).style.padding="10px";
    }

    var dish;
    for( i = 0; i < dishes.length; i++) {
        dish = document.createElement('span');
        im = document.createElement('span');
        tooltip = document.createElement('span');
        dish.setAttribute("class","dishes");
        dish.setAttribute("id","dishes" + i);
        tooltip.setAttribute("class","tooltip");
        tooltip.setAttribute("id","tooltip" + dishes[i].myName);
        im.innerHTML = "<img src='img/" + dishes[i].fileName +  "' class='dishes' id='" +
            dishes[i].myName + "' draggable='true' ondragstart='drag(event)' width='80px' height='80px'>";
        strMassImageForTooltip = "";
        for(var k = 0; k < dishes[i].part.length; k++){
            for(var j = 0; j < ingredients.length; j++) {
                if (ingredients[j].myName == dishes[i].part[k]) {
                    strMassImageForTooltip += "<img class='custom' src='img/" + ingredients[j].fileName + "' width='50px' height='50px'>";
                }
            }
        }
        tooltip.innerHTML = strMassImageForTooltip;
        tooltip.style.visibility = "hidden";
        dish.appendChild(im);
        dish.appendChild(tooltip);
        dish.setAttribute("onmousemove","movePic('tooltip"+dishes[i].myName + "')");
        dish.setAttribute("onmouseout","hidePic('tooltip" + dishes[i].myName+"')");
        document.getElementById("listOfDish").appendChild(dish);
        document.getElementById(dishes[i].myName).style.padding="10px";
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    var target;
    if(ev.target.tagName.toLowerCase() == "img") {
        target = ev.target.parentNode.parentNode;
    }
    ev.dataTransfer.setData("text", target.id);
}

function dropMarket(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var elem = document.getElementById(data);
    if(elem.className != "dishes"){
        if (ev.target.toString().substr(12, 5) != "Image") {
            ev.target.appendChild(elem);
        }
        else {
            ev.target.parentNode.parentNode.parentNode.appendChild(elem);
        }
    }
}

function createDish(elem) {
    var strMassImageForTooltip = "";
    var i = elem.id.charAt(elem.id.length-1);//номер блюда в общем массиве начиная с 0
    var fridge = document.getElementById("fridge"); //список элементов в холодильнике
    var flag;  //флаг - есть ли нужный для блюда ингридиент в холодильнике
    var fridgeCN = fridge.childNodes;
    for(var j = 0; j < dishes[i].part.length; j++) {
        flag = true;
        for(var k = 0; k < fridgeCN.length; k++) {
            if (fridgeCN[k].firstChild.firstChild.id == dishes[i].part[j]) { //да есть такое
                flag = false;
            }
        }
        if(flag) strMassImageForTooltip += "<img class='custom' src='" + document.getElementById(dishes[i].part[j]).src + "' width='50px' height='50px'>"; //если такого нет, то добавить в подсказку
    }
    elem.lastElementChild.innerHTML = strMassImageForTooltip;
    if(strMassImageForTooltip == "") {
        var market = document.getElementById("market");
        for( k = 0; k < fridgeCN.length; ){
            if(fridgeCN[k].className != "dishes") {
                flag = true; //ингредиент который не нужен для блюда имеется (просматривается)
                for (var j = 0; j < dishes[i].part.length; j++) {
                    try {
                        if (fridgeCN[k].firstChild.firstChild.id == dishes[i].part[j]) { //да есть такое
                            market.appendChild(fridgeCN[k]);
                            flag = false;
                        }
                    }
                    catch(e){}
                }
                if(flag) k++;
            }
            else k++;
        }
        fridge.appendChild(elem);
    }
}

function dropFridge(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var elem = document.getElementById(data);
    if (elem.className != "dishes") {
        if(ev.target.toString().substr(12,5) != "Image") {
            ev.target.appendChild(elem);
        }
        else{
            ev.target.parentNode.parentNode.parentNode.appendChild(elem);
        }
    }
    if(document.getElementById("dish").childElementCount != 0){
        createDish(document.getElementById("dish").firstChild);
    }
}

function dropDish(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var elem = document.getElementById(data);
    var a;
    if(elem.className == "dishes" && (ev.target.className != "ingredient" || ev.target.id != "market")) {
        if (ev.target.toString().substr(12, 5) == "Image") {
            a = ev.target.parentNode.parentNode;
            ev.target.parentNode.parentNode.parentNode.appendChild(elem);
            document.getElementById("listOfDish").appendChild(a);
        }
        else if(ev.target.hasChildNodes()){
            a = ev.target.firstChild;
            document.getElementById("listOfDish").appendChild(a);
            ev.target.appendChild(elem);
        }
        else ev.target.appendChild(elem);

//вынести бы это в функию отдельную
        //проверяем наличие ингридиентов в холодильнике, и те что есть не отображаем
        createDish(elem);
    }
}
function dropListOfDish(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var elem = document.getElementById(data);
    if(document.getElementById(data).className == "dishes" && ev.target.className != "dishes" && ev.target.className != "ingredient") {
        if (ev.target.toString().substr(12, 5) == "Image") {
            //поменять местами из диша и листофдиша
            var a = ev.target.firstChild;
            document.getElementById("listOfDish").appendChild(a);
            ev.target.appendChild(elem);
        }
        else ev.target.appendChild(elem);
        //восстанавливаем полный список необходимых ингредиентов
        var strMassImageForTooltip = "";
        var i = elem.id.charAt(elem.id.length-1);
        for(var k = 0; k < dishes[i].part.length; k++){
            for(var j = 0; j < ingredients.length; j++){
                if(dishes[i].part[k] == ingredients[j].myName){
                    strMassImageForTooltip += "<img class='custom' src='img/" + ingredients[j].fileName + "' width='50px' height='50px'>";
                }
            }
        }
        elem.lastElementChild.innerHTML = strMassImageForTooltip;
    }
}

var hide = true;//глобальная переменная, отвечающая будет ли строка передана в подсказку
function movePic(id){
    var element = document.getElementById(id);

    var x = window.event.clientX;
    var y = window.event.clientY;
    var dx = 5;
    var left = false;
    var right = false;

    if(dx + x + element.clientWidth > document.body.clientWidth){
        x = document.body.clientWidth - element.clientWidth - dx;
        left = true;
    }

    if(dx + y + element.clientHeight > document.body.clientHeight){
        y = document.body.clientHeight - element.clientHeight - dx;
        right=true;
    }
    if(left && right) {
        y = document.body.clientHeight - element.clientHeight - dx * 4;
    }

    element.style.left = x;
    element.style.top = y + document.body.scrollTop;

    if(hide){
        element.style.visibility = "visible";
        hide = false;
    }
}
function hidePic(id){
    var element = document.getElementById(id);
    element.style.visibility="hidden";
    //element.style.top=0;
    //element.style.left=0;
    hide=true;
}