/**
 * gets the viewport width and height
 * based on http://responsejs.com/labs/dimensions/
 */
function getViewport( axis ) {
	var client, inner;

	if( axis === 'x' ) 
	{
		client = docElem['clientWidth'];
		inner = window['innerWidth'];
	}
	else if( axis === 'y' ) 
	{
		client = docElem['clientHeight'];
		inner = window['innerHeight'];
	}
	
	return client < inner ? inner : client;
}