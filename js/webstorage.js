webStorage = function() {

	var initialized = false;
	var initListObject = {};	

  function getStorage(type) {
    var item = localStorage.getItem(type);
    var parsedItem = JSON.parse(item);
    return parsedItem;
  }	

	return {

		init: function(success, error) {
			if (window.localStorage) {
				initialized = true;
				success(null);
			} else {
				error('storage_api_not_supported', 'The web storage api is not supported');
			}
		},

		initList: function(type, success, error) {
			if (!initialized) {
				error('storage_api_not_supported', 'The web storage api is not supported');
			} else if (!localStorage.getItem(type)) {
				localStorage.setItem(type, JSON.stringify({}));
			}
			initListObject[type] = true;
			success(null);
		},

		add: function(type, obj, success, error) {
			if (!initialized) {
				error('storage_api_not_supported', 'The web storage api is not supported');
			} else if (!initListObject[type]) {
				error('store_not_initialized', 'The object store '+type+' has not been initialized');
			}

			if(!obj.id) {
				obj.id = $.now();
			}

			var storageList = getStorage(type);
			storageList[obj.id] = obj;

			localStorage.setItem(type, JSON.stringify(storageList));
			success(obj);
		},

		searchAll: function(type, success, error) {
			if (!initialized) {
				error('storage_api_not_supported', 'The web storage api is not supported');
			} else if (!initListObject[type]) {
				error('store_not_initialized', 'The object store '+type+' has not been initialized');
			}

			var result = [];
			var storageList = getStorage(type);
			$.each(storageList, function(i, v) {
				result.push(v);
			});
			success(result);
		},

		remove: function(type, id, success, error) {
			if (!initialized) {
				error('storage_api_not_supported', 'The web storage api is not supported');
			} else if (!initListObject[type]) {
				error('store_not_initialized', 'The object store '+type+' has not been initialized');
			}

			var storageList = getStorage(type);
			if(storageList[id]) {
				delete storageList[id];
				localStorage.setItem(type, JSON.stringify(storageList));
				success(id);
			} else {
				error('object_not_found', 'The object requested could not be found');
			}

		},

		searchProperty: function(type, propertyName, propertyValue, success, error) {
			if (!initialized) {
				error('storage_api_not_supported', 'The web storage api is not supported');
			} else if (!initListObject[type]) {
				error('store_not_initialized', 'The object store '+type+' has not been initialized');
			}

			var result = [];
			var storageList = getStorage(type);
			$.each(storageList, function(i, v) {
				if (v[propertyName] === propertyValue) {
					result.push(v);
				}
			});
			success(result);
		},

		searchID: function(type, id, success, error) {
			if (!initialized) {
				error('storage_api_not_supported', 'The web storage api is not supported');
			} else if (!initListObject[type]) {
				error('store_not_initialized', 'The object store '+type+' has not been initialized');
			}

			var storageList = getStorage(type);
			var result = storageList[id];
			success(result);
		}
	}
}();