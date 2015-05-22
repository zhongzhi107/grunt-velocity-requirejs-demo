'use strict';
function getData() {
	$.get('/api/demo', function(data) {
	  $('.asyc-data').html(JSON.stringify(data));
	});
}
if(false){ getData();}