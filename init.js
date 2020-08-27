//update this with your $form selector

let form_id = "contact-form";
let username = "Yuriy Savin";
let avatar = "avata.jpg";
let email = "fstorm707@gmail.com";
let skypeid = "live:.cid.f07bf8935886b420";
var sendButton = $("#btnsend");
var $form = $("#" + form_id);

var data = {
    "access_token": "g1xcubp6uvwkyyrd2h4my342"
};

$(document).ready(function() {
	sendButton.on('click', send);
	$('#profile-name').text(username);
	$('#profile-image').attr("src", avatar);
	$('#re-name').text(username);
	$('#re-email').text(email);
	$('#pro-email').text(email);
	$('#in-email').text(email);
	$('.skype').text(skypeid);
	$('.name').text(username);
	$('#myskype').text("My Skype: " + skypeid);
	$('#myemail').text("My Email: " + email);

	

});

function onSuccess() {
    sendButton.text('Send It');
    sendButton.prop('disabled',false);
    $("#name").val('');
    $("#mail").val('');
    $("#message").val('');
}

function onError(error) {
    sendButton.text('Send It');
    sendButton.prop('disabled',false);
}

$form.on('submit', function(evt){
	evt.preventDefault();
});


function send() {
    var subject = $("#name").val();
    var mail = $("#mail").val();
    var message = $("#message").val();
	if(subject.trim() == "")
	{
		$("#name").focus();
		return false;
	} else if(mail == "")
	{
		$("#mail").focus();
		return false;
	} else if(message == "")
	{
		$("#message").focus();
		return false;
	}

	sendButton.text('Sending…');
    sendButton.prop('disabled',true);

    data['subject'] = subject + " [" + mail + "]";
    data['text'] = `${data['subject']}... ${message}`;

    $.post('https://postmail.invotes.com/send',
        data,
        onSuccess
    ).fail(onError);

    return false;
}


