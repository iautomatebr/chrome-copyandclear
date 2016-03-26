
function setMenus(){
	var rules;
	chrome.storage.local.get('rules', function (obj) {
		rules = JSON.parse(obj['rules']);
		console.log(rules);
		chrome.contextMenus.removeAll();
		var id_menu = chrome.contextMenus.create({
			"title": chrome.i18n.getMessage("share_selection"), 
			"type": "normal", 
			"contexts": ["selection"]
		});
		for (var index = 0; index < rules.length; index++) {
			var rule = rules[index];
			if(rule.enabled) {
				var id_select = chrome.contextMenus.create({
					"parentId": id_menu,
					"title": rule.match_label, 
					"type": "normal", 
					"contexts": ["selection"],
					"onclick" : onClickSelectedText(rule.match_param)
				});
			}
		}
	});
}

setMenus();

//var rules = JSON.parse(localStorage.rules);
chrome.storage.onChanged.addListener(function () {
	setMenus();
});

function onClickSelectedText(match_param) {
	return function(info, tab) {
		copyToClipboard(info.selectionText, match_param);
	};
};

function copyToClipboard(text, param){
	var copyDiv = document.createElement('div');
	copyDiv.contentEditable = true;
	document.body.appendChild(copyDiv);
	copyDiv.innerHTML = clearText(text, param);
	copyDiv.unselectable = "off";
	copyDiv.focus();
	document.execCommand('SelectAll');
	document.execCommand("Copy", false, null);
	document.body.removeChild(copyDiv);
	
	var notification = new Notification(chrome.i18n.getMessage("notification_title"), {
		icon: "images/socl_032.png",
		body: chrome.i18n.getMessage("notification_body"),
	});
}

function clearText(text, param) {
	var arrParam = param.split("");
	for(i=0; i<arrParam.length; i++) {
		text = text.split(arrParam[i]).join("");
	}
	return text;
}
