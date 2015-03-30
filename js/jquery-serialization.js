(function($) {
	$.fn.extend({
		//function to get the form results and serialize it for local storage
		toObject: function() {
		  var result = {}
			$.each(this.serializeArray(), function(i, v) { 
				result[v.name] = v.value;
			});
		return result;
		},

		//function to get the object that is already created and edit 
		fromObject: function(obj) {
			$.each(this.find(':input'), function(i,v) {
				var name = $(v).attr('name');
				if (obj[name]) {
				     $(v).val(obj[name]);
				 } else {
					$(v).val('');
				 }
			});
		}
	});
})(jQuery);