$(document).ready(function(){
	'use strict'

	//localStorage.clear();

	//Funcion que cambia el DOM cuando hubo un problema para cargar la pagina
	function alertError(error){
		$("#mainContent").append("<p>"+error+"</br>Please reload the page</p>"
			+"<button type='button' id='btnReload' class='btn btn-primary' >Reload Page</button>");
		return "error";
	}

	//Funcion que muestra el resultado
	function showResult(data){ 
		if(data !== "loading"){
			if(data !== "error" ){
				var dataContainer = $("#dataContainer")
				//Si no hay contacto, mostrar un texto informando al usuario
				if(!data.length){
					//Si existe, eliminar la tabla
					$("#ncontactTable").remove()
					$("#message").text("There is no contact")
				}
				//Si existe un contacto o mas, mostrar el resultado en una tabla
				if(data.length){
					//Mostrar el boton "Delete Selected Contacts"
					$("#btnDeleteSelected").show()
					//Si la tabla no existe, crearla
					if(!$("#contactTable").length){
						//Eliminar el mensaje 'There is no contact'
						$("#message").text("")
						dataContainer.append('<table id="contactTable" class="table table-striped"><thead><tr>'
												+'<th></th>'
												+'<th>ID</th>'
												+'<th>First Name</th>'
												+'<th>Last Name</th>'
												+'<th>Email</th><th>Phone Number</th>'
												+'<th></th><th></th></tr></thead><tbody></tbody>')
					}
					//Agregar una linea por contact
					for (var i = 0; i< data.length;i++){
						$("#contactTable tbody").append("<tr><td class='checkDelete'><input class='checkbox'type='checkbox'></input></td>"+
														"<td class='contactId'>"+data[i].contactId+
														"</td><td class='firstName'>"+data[i].firstName+
														"</td><td class='lastName'>"+data[i].lastName+
														"</td><td class='email'>"+data[i].email+
														"</td><td class='phone'>"+data[i].phone+
														"</td><td><button type='button' class='btnDelete btn btn-primary'>Delete</button>"+
														"</td><td><button type='button' class='btnUpdate btn btn-primary'>Update</button></td></tr>")
					}
				}
				//Mostrar el contenedo de botones
				$("#buttonContainer").show();					
			}	
		}
		
	}

	//Cuando lo pagine esta ready, consulta el listado de contactos al servidor y mostrarlo
	$.ajax ("/contacts/", {method: "GET"})
		.catch(alertError)
		.then(showResult)
		.catch(console.log)

	//Al hacer click en el boton "Reload page" disponible cuando un error de carga de la pagina occurio, resfrezcar la pagina
	$("#mainContent").on('click', '#btnReload', function() {
    	location.reload();
	});

	//Al hacer click en el boton "New Contact", redirecciona en la pagina "contact.html"
    $("#btnNewContact").click(function(){
		location.href = "contact.html"
		return 'new'
    });

    //Al hacer click en el boton "Delete Selected Contacts", elemina los contactos seleccionados
    $("#btnDeleteSelected").click(function(){
    	$.each($("td:has(input:checked)"),function () {
		    $.ajax('/contacts/' + $(this).closest("tr").find(".contactId").text(), { method: "DELETE" })
			.catch(alert)
		});
		location.reload()
    });

    //Al hacer click en el boton "Delete" de una fila de la tabla de resultado, elemina la fila y el contacto correspondiente
	$("#dataContainer").on('click', '#contactTable tbody tr td .btnDelete', function() {
    	var firstName = $(this).closest("tr").find(".firstName").text()
    	var lastName = $(this).closest("tr").find(".lastName").text()
    	var email = $(this).closest("tr").find(".email").text()
    	var phone = $(this).closest("tr").find(".phone").text()
    	var message = "Deleting the contact:\nname: "+firstName+" "+lastName+"\nEmail: "+email+"\nPhone: "+phone
    	var result = confirm(message);
    	if (result == true) {
    		$.ajax('/contacts/' + $(this).closest("tr").find(".contactId").text(), { method: "DELETE" })
			.catch(alert)
			location.reload()
		} 
	});

	//Al hacer click en el boton "Update" de una fila de la tabla de resultado, redirecciona en la pagina "contact.html" guardando el valor del "ContactId"
	$("#dataContainer").on('click', '#contactTable tbody tr td .btnUpdate', function() {
		var url = "contact.html?contactId=" + encodeURIComponent($(this).closest("tr").find(".contactId").text());
        window.location.href = url;

       /*var firstName = "firstName="+$(this).closest("tr").find(".firstName").text()
    	var lastName = "lastName="+$(this).closest("tr").find(".lastName").text()
    	var email = "email="+$(this).closest("tr").find(".email").text()
    	var phone = "phone="+$(this).closest("tr").find(".phone").text()
		var url = "contact.html?"+firstName+"&"+lastName+"&"+email+"&"+phone
        window.location.href = url;
        */
	});

});
