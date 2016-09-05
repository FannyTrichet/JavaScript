$(document).ready(function(){
	'use strict'

	var contact={};
	//When the document is ready, automatically get the contacts
	getContacts();

	//When clicking on the button "Reload page", available when an error occurs, refresh the page
	$("#mainContent").on('click', '#btnReload', function() {
    	location.reload();
	});

	//When clicking on the button "New Contact", redirect to the page "contact.html"
    $("#btnNewContact").click(function(){
		location.href = "contact.html";
    });

    //When clicking on the button "Delete Selected Contacts", delete the selected contacts
    $("#btnDeleteSelected").click(function(){
    	var count=0;
    	var deletedIds=[];
		$.each($("td:has(input:checked)"),function () {
			count++;
			return $.ajax('/contacts/' + $(this).closest("tr").find(".contactId").text(), { method: "DELETE" })
				.then(deletedIds.push($(this).closest("tr").find(".contactId").text()))
				.catch(function(e){
					alertError(e,"There was a problem deleting at least one of the selected contacts")
				})
		})
		if(deletedIds.length===count){
			deletionSuccess("All the selected contacts have been successfully deleted");
		}

    });

    //When clicking the button "Delete" of a specific row, show a popup message
    $("#dataContainer").on('click', '#contactTable tbody tr td .btnDelete', function() {
    	contact={
    		contactId:$(this).closest("tr").find(".contactId").text(),
    		firstName:$(this).closest("tr").find(".firstName").text(),
    		lastName:$(this).closest("tr").find(".lastName").text(),
    		email:$(this).closest("tr").find(".email").text(),
    		phone:$(this).closest("tr").find(".phone").text()
    	};
	    $("#deleteContactModal").modal({backdrop: "static"});
	});

    //When the popup message is loaded, update the content with contact information
	$('#deleteContactModal').on('show.bs.modal', function (event) { 
		var title = "Confirm Delete #" + contact.contactId;
		var content = "First name: "+contact.firstName
					+"<br>Last name: "+contact.lastName
					+"<br>Email: "+contact.email
					+"<br>Phone: "+contact.phone;

		// Update the modal's content.
		var modal = $(this);
		modal.find('#deleteModalTitle').text(title);
		modal.find('#deleteModalContent').html(content);
	});

	//When clicking on the button "Yes" of the popup message, delete the contact
	$("#modalYes").click(function(){
		return $.ajax('/contacts/' + contact.contactId, { method: "DELETE" })
			.then(deletionSuccess("The contact "+contact.contactId+" has been successfully deleted"))
			.then("#deleteContactModal")
			.catch(function(e){
				alertError(e,"There was a problem deleting the contact")
			})
		location.reload();
    });

	//When clicking on the button "Update" of a specific row, redirrect to the page "contact.html" keeping the contactId value
	$("#dataContainer").on('click', '#contactTable tbody tr td .btnUpdate', function() {
		var url = "contact.html?contactId=" + encodeURIComponent($(this).closest("tr").find(".contactId").text());
        window.location.href = url;
	});
});

//Update the contact list
function getContacts(message){
	'use strict'
	loading("Updating contact list ... please wait");
	return $.ajax ("/contacts/", {method: "GET"})
		.then(showResult)
		.catch(function(e){
			alertError(e,"There was a problem retriving the contacts")
		})
};

//Show the result in a table
function showResult(data){ 
	'use strict'
	if(data !== "loading"){
		if(data !== "error" ){
			var dataContainer = $("#dataContainer");
			//If there is no contact, inform the user
			if(!data.length){
				$("#alertMessages").text("There is no contact")
									.addClass("alert-warning");
			}
			//If there is at least one contact, show them in a table
			if(data.length){
				$("#alertMessages").addClass("hide");
				$("#btnDeleteSelected").removeClass("hide");
				//If the table does not exist, create the table header
				if(!$("#contactTable").length){
					dataContainer.append('<table id="contactTable" class="table table-striped"><thead><tr>'
											+'<th></th>'
											+'<th>ID</th>'
											+'<th>First Name</th>'
											+'<th>Last Name</th>'
											+'<th>Email</th><th>Phone Number</th>'
											+'<th></th><th></th></tr></thead><tbody></tbody>');
				}
				//Add a row per contact
				for (var i = 0; i< data.length;i++){
					$("#contactTable tbody").append("<tr><td class='checkDelete'><input class='checkbox'type='checkbox'></input></td>"+
													"<td class='contactId'>"+data[i].contactId+
													"</td><td class='firstName'>"+data[i].firstName+
													"</td><td class='lastName'>"+data[i].lastName+
													"</td><td class='email'>"+data[i].email+
													"</td><td class='phone'>"+data[i].phone+
													"</td><td><button type='button' class='btnDelete btn btn-primary'data-target='#deleteContactModal'>Delete</button>"+
													"</td><td><button type='button' class='btnUpdate btn btn-primary'>Update</button></td></tr>");
				}
			}				
		}	
	}
};

function deleteContactById(id) {
	'use strict'
	return $.ajax('/contacts/' + id, { method: "DELETE" })
		.catch(function(error){
			alertError(e,"There was a problem deleting the contact with id: " +id)
		})
};

//Called when there is an error while retriving the contacts
function alertError(error, message){
	'use strict'
	console.log("alertError: "+error);
	$("#alertMessages").html(error+".<br>"+message+"<br>Please reload the page")
						.addClass("alert-danger");
	$("#btnNewContact").addClass("hide");
	$("#btnReload").removeClass("hide");
};

//Called when the page is loading
function loading(message){
	'use strict'
	$("#alertMessages").html("<img src='img/loading.gif' style='width:50px;height:50px;'> "+message)
						.addClass("alert-info");
};

//Let the user know when the deletion of the contact/s has been successfull
function deletionSuccess(message) {
	'use strict'
    $("#alertMessages").html(message)
                        .removeClass("alert-danger")
                        .removeClass("alert-info")
                        .addClass("alert-success");
    $("#alertMessages").removeClass("hide");
    $("#btnNewContact").addClass("hide");
    $("#btnDeleteSelected").addClass("hide");
    $("#btnReload").removeClass("hide");
};


