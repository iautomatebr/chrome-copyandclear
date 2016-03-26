
function Rule(data) {
	var rules = document.getElementById('rules');
	this.node = document.getElementById('rule-template').cloneNode(true);
	this.node.id = 'rule' + (Rule.next_id++);
	this.node.rule = this;
	rules.appendChild(this.node);
	this.node.hidden = false;

	if (data) {
		this.getElement('match-label').value = data.match_label;
		this.getElement('match-param').value = data.match_param;
		this.getElement('enabled').checked = data.enabled;
	}

	this.getElement('enabled-label').htmlFor = this.getElement('enabled').id =
	this.node.id + '-enabled';

	this.render();

	//this.getElement('match-label').onkeyup = storeRules;
	//this.getElement('match-param').onkeyup = storeRules;
	//this.getElement('enabled').onchange = storeRules;

	var rule = this;
	this.getElement('move-up').onclick = function() {
	var sib = rule.node.previousSibling;
		rule.node.parentNode.removeChild(rule.node);
		sib.parentNode.insertBefore(rule.node, sib);
		storeRules();
	};
	this.getElement('move-down').onclick = function() {
	var parentNode = rule.node.parentNode;
	var sib = rule.node.nextSibling.nextSibling;
	parentNode.removeChild(rule.node);
	if (sib) {
		parentNode.insertBefore(rule.node, sib);
	} else {
		parentNode.appendChild(rule.node);
	}
	//storeRules();
	};
	this.getElement('remove').onclick = function() {
		rule.node.parentNode.removeChild(rule.node);
		storeRules();
	};
	//storeRules();	
}

Rule.prototype.getElement = function(name) {
	return document.querySelector('#' + this.node.id + ' .' + name);
}

Rule.prototype.render = function() {
	this.getElement('move-up').disabled = !this.node.previousSibling;
	this.getElement('move-down').disabled = !this.node.nextSibling;
}

Rule.next_id = 0;

function loadRules() {
	//var rules = localStorage.rules;
	var rules;
	chrome.storage.local.get('rules', function (obj) {
		rules = obj['rules'];
		try {
			JSON.parse(rules).forEach(function(rule) {new Rule(rule);});
		} catch (e) {
			chrome.storage.local.set('rules', JSON.stringify([]));
		}
	});
}

function storeRules() {
	var dbRules = JSON.stringify(Array.prototype.slice.apply(document.getElementById('rules').childNodes).map(
		function(node) {
			node.rule.render();
			
			return {
				match_label: node.rule.getElement('match-label').value,
				match_param: node.rule.getElement('match-param').value,
				enabled: node.rule.getElement('enabled').checked
			};
		})
	);
	chrome.storage.local.set({'rules': dbRules}, function() {
			setTimeout(function () {
				document.getElementById("message").innerHTML = '';
			}, 3000);
			document.getElementById("message").innerHTML = 'Settings saved';
        });
	/* localStorage.rules = JSON.stringify(Array.prototype.slice.apply(document.getElementById('rules').childNodes).map(
		function(node) {
			node.rule.render();
			
			return {
				match_label: node.rule.getElement('match-label').value,
				match_param: node.rule.getElement('match-param').value,
				enabled: node.rule.getElement('enabled').checked
			};
		})
	); */
}

function getMessages(){
	document.title = chrome.i18n.getMessage("options_title");
	document.getElementById("header").innerHTML = chrome.i18n.getMessage("options_header");
	document.getElementById("new").innerHTML = chrome.i18n.getMessage("options_button_new");
	document.getElementById("save").innerHTML = chrome.i18n.getMessage("options_button_save");
	document.getElementById("remove").innerHTML = chrome.i18n.getMessage("options_button_remove");
	document.getElementById("text_label").placeholder = chrome.i18n.getMessage("options_text_label");
	document.getElementById("text_value").placeholder = chrome.i18n.getMessage("options_text_value");
	document.getElementById("text_enabled").innerHTML = chrome.i18n.getMessage("options_text_enabled");
}

window.onload = function() {
	getMessages();
	loadRules();
	document.getElementById('new').onclick = function() {
		new Rule();
	};
	document.getElementById('save').onclick = function() {
		storeRules();
	};
}
