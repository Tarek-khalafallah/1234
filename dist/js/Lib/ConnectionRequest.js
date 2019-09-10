/**
 * The connection request class handles the sending of a single command to the server, generating the request XML and
 * handling the response (via ConnectionResponse class), providing it back to the Connection class.
 * Instances of the class should NEVER be created directly. The intended use is only to create them via the methods of 
 * the Connection class. It is its responsibility to create a connection request object and manage it.
 * 
 * The only real external use of this class is to cancel a request via the cancel method. 
 * 
 * @class ConnectionRequest
 */
XPMobileSDK.library.ConnectionRequest = function(command, sequenceID, params, options, callback) {
	
	var self = this;
	
	self.options = options || {};
	self.response = null;
	if(params.VideoConnection) {
		self.VideoConnection = params.VideoConnection;
		delete params.VideoConnection;
	}
	self.params = params || {};
		
	var finished = false;
	var responseOffset = 0;
	var requestXML = generateData();
	var connectionURL = parseURL(XPMobileSDK.library.Connection.server) + XPMobileSDKSettings.communicationChanel;
	
	var ajaxRequest, ajaxRequestTimeout;
		
	initializeAjaxRequest();
	
	/**
	 * Cancels the ajax request.
	 * 
	 * @method cancel
	 */
	this.cancel = function() {
		if (ajaxRequestTimeout) {
			clearTimeout(ajaxRequestTimeout);
			ajaxRequestTimeout = null;
		}
		if (ajaxRequest) {
			ajaxRequest.onreadystatechange = function () {};
			ajaxRequest.abort();
			ajaxRequest = null;	
			XPMobileSDK.library.Ajax.activeRequestCount--;
		}
		
		if (command == 'RequestStream' && self.options.reuseConnection) {
		    XPMobileSDK.library.VideoConnectionPool.removeCamera(self.params.CameraId);
		}
	};
	
	function parseURL(url) {

		if (/^http(s)?:/i.test(url)) {
			return url;
		}
		var protocol = window.location.protocol + '//';
		var hostname = document.location.hostname;
		var port = document.location.port && !/^:\d+/.test(url) ? ':' + document.location.port : '';

		return protocol + hostname + port + url;

	};
	
	function initializeAjaxRequest() {

		console.log(requestXML);
		
		ajaxRequest = XPMobileSDK.library.Ajax.Request(connectionURL, {
			contentType: 'text/xml',
			postBody: requestXML,
			onSuccess: onSuccess,
			onComplete: onComplete,
			onFailure: self.options.failCallback || function () { }
		});

	};
	
	function onComplete(response) {
		try {
			if (response.readyState == 4 && response.status != 200) {
				restartHighPriorityCommand();
			}
		} catch (e) {
			// for some reason IE9 throws exception when trying to access request.transport.status
			restartHighPriorityCommand();
		}
	};
	
	function onSuccess() {
		
		CommunicationStability.removeBreakDown(self);
		
		if (ajaxRequestTimeout) {
			clearTimeout(ajaxRequestTimeout);
			ajaxRequestTimeout = null;
		}
		if (!finished) {
			parseResponse();
			finished = true;
		}
		ajaxRequest = null;
	};
	
	function parseResponse() {
		var i = 0;
		try {
			var responseText = ajaxRequest.responseText;
		} catch (error) {
			return;
		}
		
		if (responseText.trim().substr(0, 5) != "<?xml") {
			
			self.response = {
				isError: true,
				errorCode: "The response from the server is not well-formatted",
				outputParameters: []
			};
			
			callback && callback(self);
		}
		
		while ((i = responseText.indexOf("\r\n\r\n", responseOffset)) > 0) {
			var xml = responseText.substring(responseOffset, i);
			if (xml) {
				var response = new XPMobileSDK.library.ConnectionResponse(xml);
				if (!response.isProcessing) {
					self.response = response;
					finished = true;
					callback && callback(self);
				}
			} 
			responseOffset = i + 4; // 4 is the length of the XMLs separator
		}
	};
	
	function restartHighPriorityCommand() {
		console.log('Command ' + command + ' failed');
		if (command == 'LiveMessage' || command == 'CloseStream' || command == 'RequestStream' || command == 'Disconnect'){
			console.log('Restarting ' + command);
			CommunicationStability.addBreakDown(self);
			setTimeout(function() {
				finished = false;
				initializeAjaxRequest()
			}.bind(this), 1000);
		}
	}
	
	function generateData() {
		var paramsXML = '';
		for (key in params) {
			var createProperty = function(key, value) {
				value = (value !== undefined && value.toString) ? value.toString() : '';
				value = value.replace('"', '\"');
				return '<Param Name="' + key + '" Value="' + value + '" />';
			};
			if(params[key] !== undefined && params[key] instanceof Array ) {
				params[key].forEach(function(value){
					paramsXML += createProperty(key, value);
				});
			}
			else {
				paramsXML += createProperty(key, params[key]);
			}
		}
		return '<?xml version=\"1.0\" encoding=\"utf-8\"?>' +
	    	'<Communication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
	    	(XPMobileSDK.library.Connection.connectionId ? '<ConnectionId>' + XPMobileSDK.library.Connection.connectionId + '</ConnectionId >': '') + 
	    	'<Command SequenceId="' + sequenceID + '">' +
	    	'<Type>Request</Type>' +
	    	'<Name>' + command + '</Name>' +
	    	'<InputParams>' + paramsXML + '</InputParams>' +
	    	//'<OutputParams />' +
	    	'</Command>' +
	    	'</Communication>\r\n\r\n';
	};
};