$(document).ready(function(){
	'use strict'
    var contactId=0

    //Funcion que valida si los campos contienen un texto correcto
    //First name y Last name no vacios
    //Email no vacio y con el correcto formato
    //Phone no vacio y numerico
    function validateData(){
    	if (!$("#firstName").val()) {
            validationError("#firstName")
    	}else{
            validationOK("#firstName")
        }
    	if (!$("#lastName").val()) {
            validationError("#lastName")
        }else{
            validationOK("#lastName")
        }
    	if (!validateEmail($("#email").val())){
            validationError("#email")
        }else{
            validationOK("#email")
    	}
    	if (isNaN($("#phone").val())||!$("#phone").val()) {
            validationError("#phone")
        }else{
            validationOK("#phone")
    	}
    }

    //Funcion que permite verificar el formato del email
    function validateEmail(email){
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  		return regex.test(email);
    }

    //Funcion que cambia el formato del campo #idElement cuando contiene un valor incorrecto
    function validationError(idElement){
        $(idElement).parent().removeClass("has-error")
        $(idElement).parent().removeClass("has-success")
        $(idElement).parent().addClass("has-error")
        $(idElement+"Validation").removeClass("glyphicon-ok")
        $(idElement+"Validation").removeClass("glyphicon-remove")
        $(idElement+"Validation").addClass("glyphicon-remove")
    }

    //Funcion que cambia el formato del campo #idElement cuando contiene un valor correcto
    function validationOK(idElement){
        $(idElement).parent().removeClass("has-error")
        $(idElement).parent().removeClass("has-success")
        $(idElement).parent().addClass("has-success")
        $(idElement+"Validation").removeClass("glyphicon-ok")
        $(idElement+"Validation").removeClass("glyphicon-remove")
        $(idElement+"Validation").addClass("glyphicon-ok")
    }

    //Function que permite guardar un contacto con los datos de  los campos
    function saveContact(){
        var contacto = {firstName:$("#firstName").val() , lastName:$("#lastName").val(), email:$("#email").val(), phone:$("#phone").val()}
        console.log(contacto)
        return $.ajax ("/contacts/", {method: "POST", data: { contact: contacto}})
        .then (console.log)
    }

    //Function que permite modificar un contacto con los datos de  los campos
    function updateContact(){
        var contacto = {id: contactId, firstName:$("#firstName").val() , lastName:$("#lastName").val(), email:$("#email").val(), phone:$("#phone").val(), contactId:contactId}
        console.log(contacto)
        return $.ajax ("/contacts/", {method: "PUT", data: {contact: contacto}})
            .then (console.log)
    }

    //Function que redirecciona en la pagine "index.html"
    function redirectIndex(){
        location.href = "index.html"
    }

    //Function que muestra el mensaje "Contact creation, please wait..."
    function loading(){
        $("#loading").removeClass('hide');
        return "loading"
    }

    //Function que saca el mensaje "Contact creation, please wait..."
    function stopLoading(){
        $("#loading").addClass('hide');
        return "loading"
    }

    //Funcion que cambia el DOM cuando hubo un problema para cargar la pagina
    //Esconde los campos, agrega un mensaje de error y dos botones: "Retry" y "Go to contact list"
    function creationError(error){
        stopLoading()
        $("#contactForm").addClass('hide')
        $("#mainContent").append("<div class='modal-body black-font'>"
                                +"<p>"+error+"</br>Retry to add a contact or go back to the contact list</p></div>"
                                +"<div class='modal-footer'>"
                                +"<button type='button' id='btnRetry' class='btn btn-primary' >Retry</button>"
                                +"<button type='button' id='btnContactList' class='btn btn-primary' >Go to Contact list</button></div>");
        return "error";
    }

    //Funcion que alerta cuando la creacion de un contacto fue exitosa
    function creationSuccess(data) {
        if(data!=="loading" && !data.length){
            alert("Contact correctly added")           
        }
    }

    //Al hacer click en el boton "Cancel", redirecciona en la pagina "index.html"
    $("#btnCancel").click(function(){
        redirectIndex()
    });

    //Al hacer click en el boton "Save Contact", verifica si los datos fueron correctamente llenados
    //Si los campos no estan correctamente llenados, alertar al ususario
    //Si los campos estan correctamente llenados, guardar el contacto
    $("#btnSaveContact").click(function(){
        validateData()
        if($(".has-error").length){
            alert("Please verify the information entered")
        }else{
            Promise.all([saveContact(),loading])
                .then(creationSuccess)
                .then(redirectIndex)
                .catch(creationError)
        }
    });

    $("#btnUpdateContact").click(function(){
        console.log("update")
        validateData()
        if($(".has-error").length){
            alert("Please verify the information entered")
        }else{
            Promise.all([updateContact(),loading])
                .then(creationSuccess)
                .then(redirectIndex)
                .catch(creationError)
        }
    });

    //Al hacer click en el boton "Retry" disponible cuando un error de carga de la pagina occurrio, resfrezcar la pagina    
    $("#mainContent").on('click', '#btnRetry', function() {
        location.reload();
    });

    //Al hacer click en el boton "Go to Contact Lit" disponible cuando un error de carga de la pagina occurio, redirrecciona en la pagina index.html
    $("#mainContent").on('click', '#btnContactList', function() {
        redirectIndex();
    });

//?firstName=asd&lastName=asd&email=asd.sdf%40sd.sd&phone=sd
    var queryString = new Array();
    if (queryString.length == 0) {
        if (location.search.split('?').length > 1) {
            $("#btnSaveContact").addClass('hide')
            $("#btnUpdateContact").removeClass('hide')
            $("#title").text("Update Contact")
            var params = window.location.search.split('?')[1].split('&');
            for (var i = 0; i < params.length; i++) {
                var key = params[i].split('=')[0];
                var value = decodeURIComponent(params[i].split('=')[1]);
                queryString[key] = value;
                contactId=parseInt(value);
                $.ajax ("/contacts/"+value, {method: "GET"})
                    .then(showContact)
            }
        }
    }

    function showContact(data){
        console.log(data)
        $("#firstName").val(data.firstName)
        $("#lastName").val(data.lastName)
        $("#email").val(data.email)
        $("#phone").val(data.phone)
    }


});



