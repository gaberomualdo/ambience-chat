// Set all text inputs to have no spellcheck
(function(){
	// gets all elements with tag name of input and with type of text and sets spellcheck to false
	$("input[type='text']").attr("spellcheck","false");
})();

var userChatKeys = [];

firebase.database().ref("chats").once("value", function(e){
	var chatsData = e.val();
	if(chatsData){
		Object.values(chatsData).forEach(function(chat, index){
			if(Object.values(chat.people).indexOf(firebase.auth().currentUser.email) > -1){
				userChatKeys.push(Object.keys(chatsData)[index]);
			}
		});
	}
});

userChatKeys.forEach(function(key){
	$("div.container section.chats ul.chat_list").append(`<li onclick='$("div.container section.chats div.chat.active").removeClass("active");$("div.container section.chats div.chat#${key}").addClass("active");'></li>`)
	$("div.container section.chats").append(`<div class='chat' id='${key}'><input type='text' placeholder='Type a message...' onkeydown="if(event.keyCode == '13'){ firebase.database().ref("chats/${key}/chat").push(this.value); }"></div>`);
	loadChat(key);
});

if(userChatKeys.length == 0){
	firebase.database().ref("users/").on("value", function(e){
		var users = e.val();
		if(users){
			Object.values().forEach(function(person){
				firebase.database().ref("chats/").push({ people: { 0: person, 1: firebase.auth().currentUser.email }, chat: {} })
			});
		}
	});
}

function loadChat(key){
	$("div.container section.chats div.chat#" + key).html(" ");
	firebase.database.ref("chats/" + key + "/chat").on("value", function(e){
		Object.values(e.val()).forEach(function(message){
			var side = "right";
			if(message.sender != firebase.auth().currentUser.email){
				side = "left";
			}
			$("div.container section.chats div.chat#" + key).append("<div class='message " + side + "'><p>" + message.text.replace(/>/g, '&gt;').replace(/</g, '&lt;') + "</p><strong>" + message.sender + " at " + message.time + "</strong></div>")
		});
	});
}