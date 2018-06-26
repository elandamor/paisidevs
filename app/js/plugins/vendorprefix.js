// Thanks to LEA VEROU
// http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/
function getVendorPrefix() {
	if('result' in arguments.callee) return arguments.callee.result;

	var regex = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;

	var someScript = document.getElementsByTagName('script')[0];

	for(var prop in someScript.style){
		if(regex.test(prop)){
			return arguments.callee.result = prop.match(regex)[0];
		}
	}

	if('WebkitOpacity' in someScript.style) return arguments.callee.result = 'Webkit';
	if('KhtmlOpacity' in someScript.style) return arguments.callee.result = 'Khtml';

	return arguments.callee.result = '';
}