$(document).ready(function(){
	'use strict'
    var contactId=0

    getContact();

    //When clicking on the button "Save Contact", verify if the fields have been correctly filled
    $("#btnSaveContact").click(function(){
        validateData()
        if($(".has-error").length){
            validationErrorMessage("Please verify the information entered")
        }else{
            loading("Creating contact... please wait")
            saveContact()
                .then(function(){
                    creationSuccess("Contact correctly created")
                })
                .catch(creationError)
        }
    });

    //When clicking on the button "Update Contact", verify if the fields have been correctly filled
    $("#btnUpdateContact").click(function(){
        console.log("update")
        validateData()
        if($(".has-error").length){
            validationErrorMessage("Please verify the information entered")
        }else{
            loading("Updating contact... please wait")
            updateContact()
                .then(function(){
                    creationSuccess("Contact correctly updated")
                })
                .catch(creationError)
        }
    });

    //When clicking on the button "Cancel", redirect to the page index.html
    $("#btnCancel").click(function(){
        redirectIndex()
    });

    //When clicking on the button "Retry", reload the page
    $("#btnRetry").click(function() {
        location.reload();
    });
});

//Get the contact corresponding to the id available in the url
function getContact(){
    var queryString = new Array();
    if (queryString.length === 0) {
        if (location.search.split('?').length > 1) {
            $("#btnSaveContact").addClass('hide')
            $("#btnUpdateContact").removeClass('hide')
            $("#title").text("Update Contact")
            var params = location.search.split('?')[1].split('&');
            for (var i = 0; i < params.length; i++) {
                var key = params[i].split('=')[0];
                if (key==="contactId"){
                    var value = decodeURIComponent(params[i].split('=')[1]);
                    queryString[key] = value;
                    contactId=parseInt(value);
                    loading("Retriving contact data")
                    $.ajax ("/contacts/"+value, {method: "GET"})
                        .then(showContact)
                        .catch(function(e){
                            alertError(e,"There was a problem retriving the contact")
                        }) 
                }
               
            }
        }
    }
}

//Add the contact information in the fields
function showContact(data){
    $("#alertMessages").addClass("hide");
    $("#dataContainer").removeClass("hide");
    $("#buttonContainer").removeClass("hide");
    $("#firstName").val(data.firstName)
    $("#lastName").val(data.lastName)
    $("#email").val(data.email)
    $("#phone").val(data.phone)
}

//Save a new contact with the information enterred in the fields
function saveContact(){
    var contacto = {firstName:$("#firstName").val() , lastName:$("#lastName").val(), email:$("#email").val(), phone:$("#phone").val()}
    console.log(contacto)
    return $.ajax ("/contacts/", {method: "POST", data: { contact: contacto}})
}

//Update the contact with the information enterred in the fields
function updateContact(){
    var contacto = {id: contactId, firstName:$("#firstName").val() , lastName:$("#lastName").val(), email:$("#email").val(), phone:$("#phone").val(), contactId:contactId}
    console.log(contacto)
    return $.ajax ("/contacts/", {method: "PUT", data: {contact: contacto}})
}


//Validate if the fields contain the correct values
function validateData(){
    if (_.isEmpty($('#firstName').val())) {
        validationError("#firstName")
    }else{
        validationOK("#firstName")
    }
    if (_.isEmpty($('#lastName').val())) {
        validationError("#lastName")
    }else{
        validationOK("#lastName")
    }
    if (!validateEmail($("#email").val())){
        validationError("#email")
    }else{
        validationOK("#email")
    }
    if (isNaN($("#phone").val())||!_.isEmpty($('#phone').val())) {
        validationError("#phone")
    }else{
        validationOK("#phone")
    }
}

//Verify the email format
function validateEmail(email){
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

//Change the format of the field #idElement when it contains an incorrect value
function validationError(idElement){
    $(idElement).parent().removeClass("has-error")
                        .removeClass("has-success")
                        .addClass("has-error")
    $(idElement+"Validation").removeClass("glyphicon-ok")
                            .removeClass("glyphicon-remove")
                            .addClass("glyphicon-remove")
}

//Change the format of the field #idElement when it contains an incorrect value
function validationOK(idElement){
    $(idElement).parent().removeClass("has-error")
                        .removeClass("has-success")
                        .addClass("has-success")
    $(idElement+"Validation").removeClass("glyphicon-ok")
                            .removeClass("glyphicon-remove")
                            .addClass("glyphicon-ok")
}

//Called when there is an error on the fields data
function validationErrorMessage(message){
    $("#alertMessages").html(message)
        .addClass("alert-danger");
}

//Called when the page is loading
function loading(message){
    $("#alertMessages").html("<img src='img/loading.gif' style='width:50px;height:50px;'> "+message)
                        .addClass("alert-info");
    $("#alertMessages").removeClass("hide");
    $("#dataContainer").addClass("hide");
    $("#buttonContainer").addClass("hide");
}

//Called when there is an error while retriving the contacts
function alertError(error, message){
    $("#alertMessages").html(error+".<br>"+message+"<br>Please reload the page")
                        .addClass("alert-danger")
    $("#alertMessages").removeClass("hide");
    $("#buttonContainer").removeClass("hide");
    $("#btnSaveContact").addClass("hide");
    $("#btnUpdateContact").addClass("hide");
    $("#btnReload").removeClass("hide");
}

//Called when there is an error during the creation or update of the contact
function creationError(error){
    $("#alertMessages").html(error+".<br>"+message+"<br>Retry or go back to the contact list")
                        .addClass("alert-danger")
    $("#alertMessages").removeClass("hide");
    $("#buttonContainer").removeClass("hide");
    $("#btnSaveContact").addClass("hide");
    $("#btnUpdateContact").addClass("hide");
    $("#btnCancel").text("Go to Contact list")
}

//Let the user know when the creation or update of the contact has been successfull
function creationSuccess(message) {
    $("#alertMessages").html(message)
                        .removeClass("alert-danger")
                        .removeClass("alert-info")
                        .addClass("alert-success")
    $("#alertMessages").removeClass("hide");
    $("#buttonContainer").removeClass("hide");
    $("#btnSaveContact").addClass("hide");
    $("#btnUpdateContact").addClass("hide");
    $("#btnCancel").text("Go to Contact list")
}


//Redirect to the page"index.html"
function redirectIndex(){
    location.href = "index.html"
}

