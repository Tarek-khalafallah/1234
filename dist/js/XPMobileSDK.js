var XPMobileSDKSettings = {
	
	fileName:								'XPMobileSDK.js',
	clientType:								'WebClient',
	communicationChanel: 					'/XProtectMobile/Communication',
	videoChanel:                            '/XProtectMobile/Video',
	audioChannel:                           '/XProtectMobile/Audio',
	MobileServerURL:                        '',
	defaultEncryptionPadding:				'Iso10126',
	primeLength:							1024,
	videoConnectionTimeout:					20000,
	resamplingFactor:						1 / 1000000,
	
	supportsMultiThreaded:					false,
	supportsCarousels: 						false,
	supportsFootages:						false,
	supportsCHAP: true,

	SupportsAudioIn:                        true,
	SupportsAudioOut:                       false,
	AudioCompressionLevel:                  99,
	
	includes: [
		'Lib/XPMobileSDK.library.js'
	]
};

var XPMobileSDK = new function () {
	
	this.onLoad = function () {};
	
	this.library = {};
	this.interfaces = {};
	this.features = {};
	
	this.initialize = initializeConnection;
	this.isLoaded = isLoaded;
	this.addObserver = addObserver;
	this.removeObserver = removeObserver;
	this.cancelRequest = cancelRequest;
	this.connect = connect;
	this.Connect = Connect;
	this.connectWithId = connectWithId;
	this.login = login;
	this.Login = Login;
	this.requestCode = requestCode;
	this.verifyCode = verifyCode;
	this.disconnect = disconnect;
	this.Disconnect = Disconnect;
	this.LiveMessage = LiveMessage;
	this.getAllViews = getAllViews;
	this.getViews = getViews;
	this.requestStream = requestStream;
	this.RequestStream = RequestStream;
	this.RequestAudioStream = RequestAudioStream;
	this.requestAudioStream = requestAudioStream;
	this.requestPushStream = requestPushStream;
	this.requestFootageStream = requestFootageStream;
	this.changeStream = changeStream;
	this.ChangeStream = ChangeStream;
	this.closeStream = closeStream;
	this.CloseStream = CloseStream;
	this.createVideoPushConnection = createVideoPushConnection;
	this.getOsmServerAddresses = getOsmServerAddresses;
	this.getGisMapCameras = getGisMapCameras;
	this.getGisMapLocations = getGisMapLocations;
	this.motionDetection = motionDetection;
	this.getPtzPresets = getPtzPresets;
	this.ptzPreset = ptzPreset;
	this.ptzMove = ptzMove;
	this.ptzTapAndHold = ptzTapAndHold;
	this.ptzSwipe = ptzSwipe;
	this.playbackSpeed = playbackSpeed;
	this.playbackSeek = playbackSeek;
	this.playbackGoTo = playbackGoTo;
	this.getThumbnail = getThumbnail;
	this.getThumbnailByTime = getThumbnailByTime;
	this.getDBStartTime = getDBStartTime;
	this.getNextSequence = getNextSequence;
	this.getPrevSequence = getPrevSequence;
	this.getSequencesInInterval = getSequencesInInterval;
	this.startVideoExport = startVideoExport;
	this.startImageExport = startImageExport;
	this.restartErroneousExport = restartErroneousExport;
	this.getUserExports = getUserExports;
	this.getAllExports = getAllExports;
	this.getExport = getExport;
	this.deleteExport = deleteExport;
	this.getOutputsAndEvents = getOutputsAndEvents;
	this.getServerStatus = getServerStatus;
	this.triggerOutputOrEvent = triggerOutputOrEvent;
	this.getCameraCapabilities = getCameraCapabilities;
	this.prepareUpload = prepareUpload;
	this.getUploadStatus = getUploadStatus;
	this.requestChallenges = requestChallenges;
	this.createPlaybackController = createPlaybackController;
	this.changeMultipleStreams = changeMultipleStreams;
	this.getAllInvestigations = getAllInvestigations;
	this.getUserInvestigations = getUserInvestigations;
	this.getInvestigation = getInvestigation;
	this.createInvestigation = createInvestigation;
	this.updateInvestigation = updateInvestigation;
	this.updateInvestigationData = updateInvestigationData;
	this.deleteInvestigation = deleteInvestigation;
	this.cancelInvestigation = cancelInvestigation;
	this.startInvestigationExport = startInvestigationExport;
	this.deleteInvestigationExport = deleteInvestigationExport;
	this.getAlarmList = getAlarmList;
	this.getAlarm = getAlarm;
	this.updateAlarm = updateAlarm;
	this.getAlarmDataSettings = getAlarmDataSettings;
	this.getAlarmUsers = getAlarmUsers;
	this.acknowledgeAlarm = acknowledgeAlarm;
	this.prevCarouselCamera = prevCarouselCamera;
	this.nextCarouselCamera = nextCarouselCamera;
	this.pauseCarousel = pauseCarousel;
	this.resumeCarousel = resumeCarousel;
	this.registerForNotifications = registerForNotifications;
	this.RegisterForNotifications = RegisterForNotifications;
	this.getResamplingFactor = getResamplingFactor;
	this.toggleWebSocket = toggleWebSocket;
	this.sendCommand = sendCommand;
	this.destroy = destroy;
	
	var onLoad = function () { this.onLoad(); }.bind(this);

	var loaded = false;
	var head, path;	
	
	initialize();
	

	function initialize() {
		
		var script = document.querySelector('script[src$="' + XPMobileSDKSettings.fileName + '"]');

		path = script.src.replace(RegExp(XPMobileSDKSettings.fileName + '.*$'), '');
		head = document.querySelector('head');

		load(XPMobileSDKSettings.includes.slice());
	}
	
    /**
	 * Loads all scripts from a queue
	 * 
	 * @method load
     * @param {Array} queue - Array containing all script for loading
	 */
	function load(queue) {
		//debugger;
		var url = path + queue.shift();
		var script = document.createElement('script');
		
		script.addEventListener('load', function () {

			if (queue.length) {
				load(queue);
			}
			else {
				loadComplete();
			}
		});
		script.addEventListener('error', function () {
			console.error('Script load error!');
		});
		script.src = url;

		head.appendChild(script);	
	}
	
    /**
	 * Called when all scripts are loaded
	 * 
	 * @method loadComplete
	 */
	function loadComplete() {
	    XPMobileSDK.library.Connection = new Connection();
		XPMobileSDK.library.CHAP.initialize();
		XPMobileSDK.library.Connection.initialize(XPMobileSDK.localStorage);
		
		loaded = true;
		onLoad();		
	}
	
    /**
	 * Initializes the Connection singleton. Must be called before using any of the other methods.
	 * 
	 * @method initializeConnection
	 * @param {Object} [storage] - (optional) the storage used to store server features in, 
     *                  and to initialize them from 
     *                  (for example XPMobileSDK.localStorage, XPMobileSDK.sessionStorage, 
     *                  or any object implementing their methods). 
	 * 				    The server features are retrieved on login. 
     *                  The idea is to keep the connection state if you want to connectWithId, 
     *                  but it may be cleared on some cases (browser refresh for example).
	 */
	function initializeConnection(storage) {
	    XPMobileSDK.library.Connection.initialize(storage);
	}

	function isLoaded() {
		return loaded;
	}
	
    /**
	 * Adds an observer to the Connection singleton. 
	 * 
	 * @method addObserver
	 * @param {Object} observer - an arbitrary object implementing the ConnectionObserverInterface interface
	 * @see ConnectionObserverInterface
	 */
	function addObserver(observer) {
		XPMobileSDK.library.Connection.addObserver(observer);
	}

    /**
	 * Removes an existing observer from the Connection singleton.
	 * 
	 * @method removeObserver
	 * @param {Object} observer - an arbitrary object implementing the ConnectionObserverInterface interface
	 * @see ConnectionObserverInterface
	 */
	function removeObserver(observer) {
		XPMobileSDK.library.Connection.removeObserver(observer);
	}

    /**
	 * Cancels a request.
	 * 
	 * @method cancelRequest
	 * @param {ConnectionRequest} request - the ConnectionRequest object, returned by the method used to create it
	 */
	function cancelRequest(request) {
	    XPMobileSDK.library.Connection.cancelRequest(request);
	}
	
	/**
	 * Sends a Connect connection command to establish a new connection with a server.
	 * The changes of the connect status are propagated to all listeners through the ConnectionObserver interface methods.
	 * Listeners implementing the ConnectionObserver interface methods are added with the addObserver method.
	 * 
	 * @method connect
	 * @param {String} server - server name or IP address
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function connect(server) {
	    if(server) {
	        XPMobileSDK.library.Connection.server = server;
	    }
	    
	    return new Connect(null);
	}

	/**
	 * Initiates connection to the Mobile Server. Two limitations are introduced: 
     * MaximumConnectionAllowed and ConnectionTimeout between Connect and Login. 
     * They are set from the GeneralSetting section in config file
	 * 
     * @method Connect
     * @param {Object} params - Parameters to sent to the server. May contain:
     * <pre>
     * - {String} EncryptionPadding - (optional) Padding scheme that will be used 
     *                                when encrypting/decrypting shared key. 
     *                                Default is PKCS7. Currently supported values are PKCS7 and ISO10126.
     * - {Number} PrimeLength - (optional) The length of the prime module in bits. 
     *                          Default is 1024. Currently supported values are 1024 and 2048
     * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing messages 
     *                                should be sent from server while processing the request. Default is Yes.
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
     * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function Connect(params, successCallback, failCallback ) {
        params = params || {};
        params.PublicKey = XPMobileSDK.library.Connection.dh.createPublicKey();
	    if (XPMobileSDKSettings.primeLength) {
	        params.PrimeLength = XPMobileSDKSettings.primeLength;
	    }
	    if (XPMobileSDKSettings.defaultEncryptionPadding) {
	        params.EncryptionPadding = XPMobileSDKSettings.defaultEncryptionPadding.toUpperCase();
	    }

	    var connectionRequest = XPMobileSDK.library.Connection.Connect(params, successCallback, failCallback);
	    return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest;
	}
	
	/**
	 * Tries to reestablish an existing connection with a server by using an existing connection id.
	 * The changes of the connect status are propagated to all listeners through the ConnectionObserver interface methods.
	 * Listeners implementing the ConnectionObserver interface methods are added with the addObserver method.
	 * 
	 * @method connectWithId
	 * @param {String} server - server name or IP address
	 * @param {String} connectionId - connection id
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function connectWithId(server, connectionId) {
	    XPMobileSDK.library.Connection.connectWithId(server, connectionId);
	}
	
	/**
	 * Sends a LogIn connection command to log a user with valid usernam and password.
	 * The changes of the login status are propagated to all listeners through the ConnectionObserver interface methods.
	 * Listeners implementing the ConnectionObserver interface methods are added with the addObserver method.
	 * 
	 * @method login
	 * @param {String} username - username
	 * @param {String} password - password
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function login(username, password, parameters) {

	    parameters = parameters || {};
        parameters.Username = username;
	    parameters.Password = password;
		
		return new Login(parameters);
	}

	/**
     * Sends a low level Login command to the server.
     * 
     * @method Login
     * @param {Object} params - Parameters to sent to the server.  May contain:
     * <pre>
     * - {String} Username - Name of the connection user.
     * - {String} Password - Password for the certain user.
     * - {Number} NumChallenges - Number of challenges the MoS should return.  
     *                           Up to 100 can be requested at once.
     * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing messages 
     *                                should be sent from server while processing the request. Default is Yes.
     * - {String} SupportsResampling - (optional) [Yes/No] When present and equal to 
     *                                 "Yes", indicates that the client can handle 
     *                                 downsized images. This instructs Quality of 
     *                                 Service to reduce the size of the sent images 
     *                                 as additional measure in cases of low bandwidth.
     * - {String} SupportsExtendedResamplingFactor - (optional) [Yes/No] When present and equal to 
     *                                               "Yes", indicates that client supports working 
     *                                               with decimal resampling factor. Influence on 
     *                                               the type of ResamplingTag received in Header 
     *                                               Extension Flags of Video frame
     * - {String} Footages - (optional) [Yes/No] When present and equal to 
     *                       "Yes", indicates that client supports Footages.  
     *                       Influence is that GetExport and 
     *                       GetInvestigation commands will not return 
     *                       footages if the client doesn't support it.
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
     * 
     * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function Login(params, successCallback, failCallback) {
        
        params = params || {};
        
        if(XPMobileSDK.library.Connection.PublicKey) {
	        params.Username = XPMobileSDK.library.Connection.dh.encodeString(params.Username);
	        params.Password = XPMobileSDK.library.Connection.dh.encodeString(params.Password);
	    }

        if (XPMobileSDK.library.Connection.CHAPSupported == 'Yes') {
	        // Take 100 challenges to start with
	        params.NumChallenges = params.NumChallenges || 100;
	    }

	    params.SupportsResampling = params.SupportsResampling || 'Yes';
	    params.SupportsExtendedResamplingFactor = params.SupportsExtendedResamplingFactor || 'Yes';
		
	    if (XPMobileSDKSettings.supportsCarousels) {
	        params.SupportsCarousel = params.SupportsCarousel || 'Yes';
	    }
	    if (XPMobileSDKSettings.supportsFootages) {
	        params.Footages = params.Footages || 'Yes';
	    }
	    if (XPMobileSDKSettings.clientType) {
	        params.ClientType = params.ClientType || XPMobileSDKSettings.clientType;
	    }
        
	    var connectionRequest = XPMobileSDK.library.Connection.Login(params, successCallback, failCallback);
	    return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest;
	}
	
	/**
	 * Sends a RequestSecondStepAuthenticationPin connection command after successful login with a valid username and password.
	 * This method is used only if the server has called the connectionRequiresCode method of the ConnectionObserver interface.
	 * 
	 * @method requestCode
	 * @param {Function} successCallback - function that is called when the command execution was successful.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function requestCode(successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.requestCode(successCallback, errorCallback);
	}
	
	/**
	 * Sends a RequestSecondStepAuthenticationPin connection command after successful login with a valid username and password.
	 * This method is used only if the server has called the connectionRequiresCode method of the ConnectionObserver interface.
	 * 
	 * @method verifyCode
	 * @param {String} code - second step authentication pin code
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function verifyCode(code) {
	    return XPMobileSDK.library.Connection.verifyCode(code);
	}
	
	/**
	 * Sends a Disconnect connection command and logs out the current user.
	 * 
	 * @method disconnect
	 */
	function disconnect() {
	    XPMobileSDK.library.Connection.Disconnect();
	}

    /**
     * Sends a Disconnect connection command and logs out the current user.
     * (Stops all the open video communication channels, removes ConnectionId from the internal resolving mechanism)
     * 
     * @method Disconnect
     * @param {Object} params - Parameters to sent to the server. May contain:
     * <pre>
     * - {String} ConnectionId - Connection ID retrieved from Connect command
     * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing 
     *                                messages should be sent from server while 
     *                                processing the request. Default depends on the 
     *                                value in connect command.
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
     */
	function Disconnect(params, successCallback, failCallback) {
	    XPMobileSDK.library.Connection.Disconnect(params, successCallback, failCallback);
	}

	/**
     * Sends a LiveMessage command to the server indicating that the client is up and running. Client needs to send that command at least once in the watch dog interval which is 30 seconds by default.
     * Recomented interval is 80% of whach dog  = 80*30/100 = 24
     * 
     * @example setInterval(function(){XPMobileSDK.LiveMessage()}, 24000);
     * 
     * @method Disconnect
     * @param {Object} params - Parameters to sent to the server.  May contain:
     * <pre>
     * - {String} ConnectionId - Connection ID retrieved from Connect command
     * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing 
     *                                messages should be sent from server while 
     *                                processing the request. Default depends on the 
     *                                value in connect command.
     * </pre>
     * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
     * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
     */
	function LiveMessage(params, successCallback, failCallback) {
	    XPMobileSDK.library.Connection.LiveMessage(params, successCallback, failCallback);
	}
	
	/**
	 * Sends a GetAllViewsAndCameras connection command to get the full tree of views starting from the root.
	 * 
	 * @method getAllViews
	 * @param {Function} successCallback - function that is called when the command execution was successful and a views object is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getAllViews(successCallback, errorCallback) {
		var connectionRequest = XPMobileSDK.library.Connection.getAllViews(successCallback, errorCallback);
		return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest;
	}

	/**
	 * Sends a GetViews connection command to get the sub-views of any view using its id.
	 * 
	 * @method getViews
	 * @param {String} viewId - view id
	 * @param {Function} successCallback - function that is called when the command execution was successful and a view object is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getViews(viewId, successCallback, errorCallback) {
	    var connectionRequest = XPMobileSDK.library.Connection.getViews(viewId, successCallback, errorCallback);
		return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest;
	}

	/**
	 * Sends a RequestStream connection command to get the live/playback video stream of a camera as a VideoConnection object from the server.
	 * 
	 * @method requestStream
	 * @param {String} cameraId - unique GUID of the camera that should be started
	 * @param {VideoConnectionSize} size - output stream size
	 * @param {VideoConnectionOptions} options - optional, optional configuration. May contain:
     * <pre>
     * - {String} signal - Type of the requested signal - Live, Playback or Upload.
     * - {String} streamType - Shows if this is a transcoded or a direct stream. 
     *                         Possible values - Native and Transcoded.
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and a VideoConnection object is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function requestStream(cameraId, size, options, successCallback, errorCallback) {
		var connectionRequest = XPMobileSDK.library.Connection.requestStream(cameraId, size, options, successCallback, errorCallback);
		return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest;
	}

	/**
     * Starts live, payback or push video session for a particular device.
     * 
     * @method RequestStream
     * @param {Object} params - Parameters to sent to the server. May contain:
     * <pre>
     * - {String} ConnectionId - Connection ID retrieved from Connect command
     * - {String} StreamType - Shows if this is a transcoded or a direct stream. 
     *                         Possible values - Native and Transcoded. Missing 
     *                         of this will be interpreted as Transcoded. (backward compatibility)
     * - {String} ByteOrder - LittleEndian/Network. Missing of this will be 
     *                        interpreted as LittleEndian for Transcoded, 
     *                        StreamType and Network for Native StreamType.
     * - {String} CameraId - ID of the camera, which stream is requested (GUID)
     * - {Number} DestWidth - Width of the requested video (in pixels)
     * - {Number} DestHeight - Height of the requested video (in pixels)
     * - {Number} Fps - Frame-rate of the requested video (frames per second)
     * - {Number} ComprLevel - Compression level of the received JPEG images (1 - 100)
     * - {String} SignalType - Type of the requested signal - Live, Playback or Upload.
     * - {String} MethodType - Type of the method for retrieving video data - Push or Pull
     * - {String} KeyFramesOnly - Yes/No (everything different than Yes is interpreted as No)
     *                            - reduces stream quality by transcoding only Key (I) frames,
     *                            if option is enabled in the Management Plug-in.
     * - {String} TImeRestrictionStart - (optional) Start time stamp of restriction period given as milliseconds since Unix EPOCH
     * - {String} TimeRestrictionEnd - (optional) End time stamp of restriction period given as milliseconds since Unix EPOCH
     * - {String} MotionOverlay - (reserved) No/Yes
     * - {String} RequestSize - (optional) [Yes/No] - If value of the field is Yes, Size header extension 
     *                          is sent with every frame. Otherwise it is sent only on size change. 
     *                           Missing of paramter is interpreted as No.
     * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing 
     *                                messages should be sent from server while 
     *                                processing the request. Default is Yes.
     * - {String} SeekType - (optional) Makes seek of specific type: DbStart, 
     *                       DbEnd, PrevSeq, NextSeq, PrevFrame, NextFrame, Time, TimeOrBefore, 
     *                       TimeOrAfter, TimeAfter, TimeBefore.
     * - {String} Time - (optional) Time of playback speed (in milliseconds 
     *                   since Unix epoch). Valid if SeekType == Time.
     * - {String} UserInitiatedDownsampling - (optional) [Yes/No] When present and equal to 
     *                                        "Yes", indicates that the client requires all sent images to 
     *                                        be downsized at least by two (half the 
     *                                        requested width and height). SupportsResampling 
     *                                        must be set explicitly to "Yes". 
     * - {String} PlaybackControllerId - (optional) Id of the playback controller used for common playback control.
     *                                   Received from "CreatePlaybackController" command.
     *                                   When present and not equal to empty string, indicates 
     *                                   that the client requires playback controller to be used, 
     *                                   shared between few playback streams. Valid only if "SignalType" is set to Playback. 
     *                                   If does not present - single playback stream is created. If set to 
     *                                   id of the existing in the server controller - this playback stream is attached to it.
     *                                   If set to invalid id - error is returned (unknown item id - 21).
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
     */
	function RequestStream(params, successCallback, failCallback) {
	    XPMobileSDK.library.Connection.RequestStream(params, successCallback, failCallback);
	}

    /**
     * Starts live, playback audio session for a particular device.
     * 
     * @method RequestAudioStream
     * @param {Object} params - Parameters to sent to the server. May contain:
     * <pre>
     * - {String} ConnectionId - Connection ID retrieved from Connect command
     * - {String} StreamType - Shows if this is a transcoded or a direct stream. 
     *                         Possible values - Native and Transcoded. Missing 
     *                         of this will be interpreted as Transcoded. (backward compatibility)
     * - {String} ItemId - ID of the microphone, which stream is requested (GUID)
     * - {Number} ComprLevel - Compression level of the received Audio (1 - 100)
     * - {String} SignalType - Type of the requested signal - Live, Playback or Upload.
     * - {String} MethodType - Type of the method for retrieving video data - Push or Pull
     * - {String} StreamDataType - "Audio"
     * - {String} AudioEncoding - The type pf audio encoding - "Mp3"
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
     */
	function RequestAudioStream(params, successCallback, failCallback) {
	    XPMobileSDK.library.Connection.RequestAudioStream(params, successCallback, failCallback);
	}

    /**
	 * Sends a RequestAudioStream connection command to get the live/playback video stream of a camera as a VideoConnection object from the server.
	 * 
	 * @method requestAudioStream
	 * @param {String} cameraId - unique GUID of the microphone that should be started
	 * @param {AudioConnectionOptions} options - optional, optional configuration. May contain:
     * <pre>
     * - {String} signal - Type of the requested signal - Live, Playback.
     * - {String} streamType - Shows if this is a transcoded or a direct stream. 
     *                         Possible values - Transcoded.
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and a VideoConnection object is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function requestAudioStream(microphoneId, options, successCallback, errorCallback) {
	    var connectionRequest = XPMobileSDK.library.Connection.requestAudioStream(microphoneId, options, successCallback, errorCallback);
	    return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest;
	}
	
	/**
	 * Sends a RequestStream connection command to get an upstream for video push to the server.
	 * 
	 * @method requestPushStream
	 * @param {Function} successCallback - function that is called when the command execution was successful and a stream parameters object is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function requestPushStream(successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.requestPushStream(successCallback, errorCallback);
	} 

	/**
	 * Sends a RequestFootageStream connection command to get an upstream for uploading video files and images as existing recordings to the server.
	 * 
	 * @method requestFootageStream
	 * @param {String} fileName - name of file
	 * @param {Number} fileSize - size of file
	 * @param {Function} successCallback - function that is called when the command execution was successful and a stream parameters object is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function requestFootageStream(fileName, fileSize, successCallback, errorCallback) {
	    var connectionRequest = XPMobileSDK.library.Connection.requestFootageStream(fileName, fileSize, successCallback, errorCallback);
		return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest;
	}

	/**
	 * Sends a ChangeStream connection command to change the parameters of an existing VideoConnection.
	 * 
	 * @method changeStream
	 * @param {VideoConnection} videoConnection - existing VideoConnection object representing a camera stream
	 * @param {VideoConnectionCropping} cropping - rectangle to crop from the native camera video stream
	 * @param {VideoConnectionSize} size - output stream size for the resulting cropped native camera video stream
	 * @param {Function} successCallback - function that is called when the command execution was successful.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function changeStream(videoConnection, cropping, size, successCallback, errorCallback) {
	    var connectionRequest = XPMobileSDK.library.Connection.changeStream(videoConnection, cropping, size, successCallback, errorCallback);
		return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest;
	}

    /**
     * Sends a ChangeStream connection command and logs out the current user.
     * 
     * @method ChangeStream
     * @param {Object} params - Parameters to sent to the server.  May contain:
     * <pre>
     * - {String} ConnectionId - Connection ID retrieved from Connect command
     * - {String} VideoId - ID of the video connection (GUID)
     * - {Number} DestWidth - (optional) Width of the requested video (in pixels)
     * - {Number} DestHeight - (optional) Height of the requested video (in pixels)
     * - {Number} Fps - (optional) Frame-rate of the requested video (frames per second)
     * - {Number} ComprLevel - (optional) Compression level of the received JPEG images (1 - 100)
     * - {String} MethodType - Type of the method for retrieving video data - Push or Pull
     * - {String} SeekType - (optional) Makes seek of specific type: DbStart, 
     *                       DbEnd, PrevSeq, NextSeq, PrevFrame, NextFrame, Time, TimeOrBefore, 
     *                       TimeOrAfter, TimeAfter, TimeBefore.
     * - {String} Time - (optional) Time of playback speed (in milliseconds 
     *                   since Unix epoch). Valid if SeekType == Time.
     *
     * - {String} SignalType - Type of the requested signal - Live, Playback or Upload.
     * - {Number} SrcLeft - (optional) Left coordinate (X) of the cropping rectangle.
     * - {Number} SrcTop - (optional) Top coordinate (Y) of the cropping rectangle.
     * - {Number} SrcRight - (optional) Right coordinate (X) of the cropping rectangle.
     * - {Number} SrcBottom - (optional) Bottom coordinate (Y) of the cropping rectangle.
     * - {Number} Speed - (optional) Speed of the playback (floating point). Sign determines the direction.
     * - {Number} PtzPreset - (optional) Makes move of the PTZ to a user defined preset.
     * - {String} RegionGrid - (reserved)
     * - {String} MotionOverlayEnabled - (reserved) No/Yes
     * - {Number} MotionAmount - (reserved ) 1-100
     * - {Number} SensitivityAmount - (reserved) 1-100
     * - {Number} CPUImpactAmont - (reserved) 1-4
     * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing messages should 
     *                                be sent from server while processing the request. 
     *                                Default depends on the value in connect command
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
     */
	function ChangeStream(params, successCallback, failCallback) {
	    XPMobileSDK.library.Connection.ChangeStream(params, successCallback, failCallback);
	}
	
	
	/**
	 * Sends a CloseStream connection command to close an existing VideoConnection by id.
	 * 
	 * @method closeStream
	 * @param {String} videoId - id of an existing VideoConnection
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function closeStream(videoId) {
	    return XPMobileSDK.library.Connection.closeStream(videoId);
	}

	/**
     * Sends a CloseStream connection command and logs out the current user.
     * 
     * @method CloseStream
     * @param {Object} params - Parameters to sent to the server. Should contain:
     * <pre>
     * - {String} ConnectionId - Connection ID retrieved from Connect command
     * - {String} VideoId - ID of the video connection (GUID)
     * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing messages should 
     *                                be sent from server while processing the request. 
     *                                Default depends on the value in connect command
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
     */
	function CloseStream(params, successCallback, failCallback) {
	    XPMobileSDK.library.Connection.CloseStream(params, successCallback, failCallback);
	}

	/**
	 * Establishes a connection to an available web camera and requests a video push stream for that camera with requestPushStream.
	 * 
	 * @method createVideoPushConnection
	 * @param {Function} successCallback - function that is called when the command execution was successful and a VideoPushConnection object is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function createVideoPushConnection(successCallback, errorCallback) {
		var videoPushConnection = new XPMobileSDK.library.VideoPushConnection(successCallback, errorCallback);
		return videoPushConnection || XPMobileSDK.interfaces.VideoPushConnection;
	}

    /**
	 * Returns the Open Street Map servers defined into Mobile Server's config file
	 * 
	 * @method getOsmServerAddresses
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getOsmServerAddresses(successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getOsmServerAddresses(successCallback, errorCallback);
	} 

    /**
	 * Returns the all Smart Maps cameras
	 * 
	 * @method getGisMapCameras
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getGisMapCameras(successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getGisMapCameras(successCallback, errorCallback);
	}

    /**
	 * Returns the all Smart Maps locations
	 * 
	 * @method getGisMapLocations
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getGisMapLocations(successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getGisMapLocations(successCallback, errorCallback);
	}

    /**
	 * Sends a ChangeStream command to the server. 
     * Changes the motion detection settings of the stream that the given videoConnection represents.
	 * 
	 * @method motionDetection
	 * @param {VideoConnection} videoConnection - existing VideoConnection object representing a camera stream
	 * @param {Object} options - contains any or all of the motion, sensitivity, grid and cpu parameters.
     *
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function motionDetection(videoConnection, options) {
	    return XPMobileSDK.library.Connection.motionDetection(videoConnection, options);
	}

    /**
	 * Sends a GetPtzPresets command to the server. 
	 * 
	 * @method getPtzPresets
	 * @param {GUID} cameraId - the current camera related to the presets this request will return
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getPtzPresets(cameraId, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getPtzPresets(cameraId, successCallback, errorCallback);
	}

    /**
	 * Sends a ControlPTZ command to the server. Controls PTZ Preset. 
     * The parameter needs to be a valid preset name, otherwise nothing will happen.
	 * 
	 * @method ptzPreset
	 * @param {VideoConnection} videoConnection - existing VideoConnection object representing a camera stream
	 * @param {String} presetName - the name of the preset to be activated
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function ptzPreset(videoConnection, presetName) {
	    return XPMobileSDK.library.Connection.ptzPreset(videoConnection, presetName);
	}

    /**
	 * It is used to change the camera orientation by moving it in the direction of the tap.
	 * The reference point of the movement is the center of the screen.
	 * The tap and the reference points are used to calculate the direction and the speed of the camera movement.
	 *
	 * @method ptzTapAndHold
	 * @param {Object} parameters - Object containing the following properties:
     * <pre>
	 * - {String} CameraId - unique GUID of the camera
	 * - {Number} GestureXPercent - the percentage of distance between start and finish [-100:100]
	 * - {Number} GestureYPercent - the percentage of distance between start and finish [-100:100]
     * </pre>
     * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function ptzTapAndHold(parameters, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.ptzTapAndHold(parameters, successCallback, errorCallback);
	} 

    /**
	 * Sends a ControlPTZ command to the server. Controls PTZMove. 
     * Directions are: 'Up', 'Down', 'Left', 'Right', 'UpLeft', 'UpRight', 'DownLeft', 
     * 'DownRight', 'ZoomIn', 'ZoomOut', 'Home'.
	 * The camera needs to support PTZ, otherwise nothing will happen.
	 * 
	 * @method ptzMove
	 * @param {VideoConnection} videoConnection - existing VideoConnection object representing a PTZ camera stream
	 * @param {String} direction - 'Up', 'Down', 'Left', 'Right', 'UpLeft', 'UpRight', 'DownLeft', 
     *                              'DownRight', 'ZoomIn', 'ZoomOut', 'Home'
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function ptzMove(videoConnection, direction) {
	    return XPMobileSDK.library.Connection.ptzMove(videoConnection, direction);
	}

    /**
	 * It is used to change the camera orientation by moving it in the direction of the swipe.
	 * The swipe direction and length are calculated based on the start and end points of the gesture.
	 * The swipe speed is calculated based on the time it took to perform the gesture 
     * from the start point to the end point.
	 * The calculated direction defines the direction of the PTZ movement, 
     * whereas the length and the speed are used to determine the amount of the PTZ movement.
	 *
	 * @method ptzSwipe
	 * @param {Object} parameters - Object containing the following properties:
     * <pre>
	 * - {String} CameraId - unique GUID of the camera
	 * - {Number} GestureXPercent - the percentage of distance between start and finish [-100:100]
	 * - {Number} GestureYPercent - the percentage of distance between start and finish [-100:100]
     * </pre>
     * @param {Number} gestureDuration - number of milliseconds
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function ptzSwipe(parameters, gestureDuration) {
	    return XPMobileSDK.library.Connection.ptzSwipe(parameters, gestureDuration);
	}

    /**
	 * Sends a ChangeStream command to the server. 
     * Controls playback speed as a float. Negative number means backwards. 1.0 means normal speed.
	 * 
	 * @method playbackSpeed
	 * @param {VideoConnection} videoConnection - existing VideoConnection object representing a camera stream
	 * @param {Number} speed - Speed of the playback (floating point). Sign determines the direction
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function playbackSpeed(videoConnection, speed) {
	    return XPMobileSDK.library.Connection.playbackSpeed(videoConnection, speed);
	}

    /**
	 * Sends a ChangeStream command to the server. 
     * Seeks to either of: 'DbStart', 'DbEnd', 'PrevSeq', 'NextSeq', 'PrevFrame' or 'NextFrame'.
	 * 
	 * @method playbackSeek
	 * @param {VideoConnection} videoConnection - existing VideoConnection object representing a camera stream
	 * @param {String} seekType - 'DbStart', 'DbEnd', 'PrevSeq', 'NextSeq', 'PrevFrame' or 'NextFrame'
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function playbackSeek(videoConnection, seekType) {
	    return XPMobileSDK.library.Connection.playbackSeek(videoConnection, seekType);
	}

    /**
	 * Sends a ChangeStream command to the server. Goes to the closest possible match of specific time.
	 * 
	 * @method playbackGoTo
	 * @param {VideoConnection} videoConnection - existing VideoConnection object representing a camera stream
	 * @param {Number} millisecondsSinceUnixEpoch - Time of playback speed (in milliseconds since Unix epoch). Valid if SeekType == Time
	 * @param {String} seekType - optional, 'Time' (default), 'TimeOrBefore', 'TimeOrAfter'
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function playbackGoTo(videoConnection, millisecondsSinceUnixEpoch, seekType, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.playbackGoTo(videoConnection, millisecondsSinceUnixEpoch, seekType, successCallback, errorCallback);
	}

    /**
	 * Sends a GetThumbnail command to the server in order to obtain an image representation for a given camera.
	 * 
	 * @method getThumbnail
	 * @param {String} cameraId - the unique GUID of the camera
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getThumbnail(cameraId, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getThumbnail(cameraId, successCallback, errorCallback);
	}

    /**
	 * Gets thumbnail by the given camera id and time. 
	 * 
     * @method getThumbnailByTime
	 * @param {String} cameraId - Id of the requested camera thumbnail
	 * @param {Number} time - Miliseconds since start of UNIX epoch, in UTC.
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getThumbnailByTime(cameraId, time, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getThumbnailByTime(cameraId, time, successCallback, errorCallback);
	}

    /**
	 * Gets the start time of the recordings for a particular camera.
	 * 
	 * @method getDBStartTime
	 * @param {String} cameraId - ID of the camera, which recordings database time is requested
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getDBStartTime(cameraId, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getDBStartTime(cameraId, successCallback, errorCallback);
	}

    /**
	 * Gets the next sequence by given time for the given cameraId. 
	 * 
	 * @method getNextSequence
	 * @param {String} cameraId - ID of the camera (GUID) for which Sequences are retrieved.
	 * @param {Number} timestamp - milliseconds in UTC, a sequence after this moment will be returned
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getNextSequence(cameraId, timestamp, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getNextSequence(cameraId, timestamp, successCallback, errorCallback);
	}

    /**
	 * Gets the previous sequence by given time. 
	 * 
	 * @method getPrevSequence
	 * @param {String} cameraId - ID of the camera (GUID) for which Sequences are retrieved.
	 * @param {Number} timestamp - milliseconds in UTC, a sequence before this moment will be returned
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getPrevSequence(cameraId, timestamp, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getPrevSequence(cameraId, timestamp, successCallback, errorCallback);
	}

    /**
	 * Gets all the sequences in a given interval of time.
	 * 
	 * @method getSequencesInInterval
	 * @param {String} cameraId - ID of the camera (GUID) for which Sequences are retrieved.
	 * @param {Number} startTime - milliseconds in UTC, the start time of the interval
	 * @param {Number} endTime - milliseconds in UTC, the end time of the interval
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getSequencesInInterval(cameraId, startTime, endTime, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getSequencesInInterval(cameraId, startTime, endTime, successCallback, errorCallback);
	}

    /**
	 * Starts a new video export.
	 * 
	 * @method startVideoExport
	 * @param {String} cameraId - GUID of the camera
	 * @param {Number} startTime - timestamp in UTC, the initial time of the export
	 * @param {Number} endTime - timestamp in UTC, the end time of the export
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function startVideoExport(cameraId, startTime, endTime, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.startVideoExport(cameraId, startTime, endTime, successCallback, errorCallback);
	}

    /**
	 * Starts a new still image export.
	 * 
	 * @method startImageExport
	 * @param {String} cameraId - GUID of the camera
	 * @param {Number} startTime - timestamp in UTC, the time of the still image
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function startImageExport(cameraId, startTime, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.startImageExport(cameraId, startTime, successCallback, errorCallback);
	}

    /**
	 * Restarts an exports that has previously failed. Requires a valid exportId.
	 * 
	 * @method restartErroneousExport
	 * @param {String} exportId - a valid exportId of a previously failed export
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function restartErroneousExport(exportId, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.restartErroneousExport(exportId, successCallback, errorCallback);
	}

    /**
	 * Gets the exports for the currently logged user.
	 *
	 * @method getUserExports
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getUserExports(successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getUserExports(successCallback, errorCallback);
	}

    /**
	 * Gets all exports.
	 *
	 * @method getAllExports
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getAllExports(successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getAllExports(successCallback, errorCallback);
	}

    /**
	 * Gets an export by id.
	 * 
	 * @method getExport
	 * @param {String} id - ID of the export to retrieve (GUID).
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getExport(id, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getExport(id, successCallback, errorCallback);
	}

    /**
	 * Deletes an export by id. 
	 * 
	 * @method deleteExport
	 * @param {String} id - ID of the export to delete (GUID).
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function deleteExport(id, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.deleteExport(id, successCallback, errorCallback);
	}

    /**
	 * Sends a GetOutputsAndEvents command to the server, gets configuration entry from the server.
	 * 
	 * @method getOutputsAndEvents
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getOutputsAndEvents(successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getOutputsAndEvents(successCallback, errorCallback);
	}

    /**
	 * Gets server statistic (CPU load, network trafic etc.)
	 * 
	 * @method getServerStatus
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getServerStatus(successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getServerStatus(successCallback, errorCallback);
	}

    /**
	 * Triggers an output or event.
	 * 
	 * @method triggerOutputOrEvent
	 * @param {String} objectId - the Id of the item
	 * @param {String} triggerType - 'TriggerOutput' or 'TriggerEvent'
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function triggerOutputOrEvent(objectId, triggerType, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.triggerOutputOrEvent(objectId, triggerType, successCallback, errorCallback);
	}

    /**
	 * Gets the camera capabilities - export, live, playback, ptz, presets.
     * 
	 * @method getCameraCapabilities
	 * @param {String} cameraId - GUID of the camera
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getCameraCapabilities(cameraId, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getCameraCapabilities(cameraId, successCallback, errorCallback);
	}

    /**
	 * Prepare server for uploading a file. Asks server to prepare URL for uploading. 
	 * 
     * @method prepareUpload
	 * @param {Object} parameters - Object containing the following properties:
     * <pre>
	 * - {String} UploadType - Type of the upload - File, Stream etc.
	 * - {String} FileType - The type of the file that needs to be uploaded - License, Image etc.
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function prepareUpload(parameters, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.prepareUpload(parameters, successCallback, errorCallback);
	}

    /**
	 * Get the status of the upload by given UploadID
	 * 
     * @method getUploadStatus
	 * @param {Object} parameters - Object containing the following properties:
     * <pre>
	 * - {String} UploadID - Upload ID retrieved from PrepareUpload command.
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getUploadStatus(parameters, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getUploadStatus(parameters, successCallback, errorCallback);
	}

    /**
	 * Get new challenges from server
	 * 
     * @method requestChallenges
	 * @param {Object} parameters - Object containing the following properties:
     * <pre>
	 * - {Number} NumChallenges - Number of challenges that will be returned as a response. 
     *                            Up to 100 can be requested at once. 
     *                            There is limitation of the total challenges in the queue. 
     *                            If exceeded error code is returned.
     * - {String} Reset - Whether to reset the list of challenges with a fresh one.('Yes', 'No')
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function requestChallenges(parameters, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.requestChallenges(parameters, successCallback, errorCallback);
	}

    /**
	 * Create playback controller
	 * 
     * @method createPlaybackController
	 * @param {Object} parameters - Object containing the following properties:
     * <pre>
	 * - {String} SeekType - (optional) Makes seek of specific type: DbStart, DbEnd, PrevSeq, NextSeq, 
     *                       PrevFrame, NextFrame, Time, TimeOrBefore, TimeOrAfter, TimeAfter, TimeBefore.
     * - {Number} Time - (optional) Time in miliseconds
     * - {Number} InvestigationId - (optional) The id of the investigation
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function createPlaybackController(parameters, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.createPlaybackController(parameters, successCallback, errorCallback);
	}

    /**
	 * Change several streams at a time
	 * 
     * @method changeMultipleStreams
	 * @param {Object} parameters - Object containing the following properties:
     * <pre>
	 * - {String} PlaybackControllerId - Id of the video connection
     * - {Number} Speed - (optional) Speed of the playback (floating point). Sign determines the direction.
     * - {String} SeekType - (optional) Makes seek of specific type: Time.
     * - {Number} Time - (optional) Time of playback speed (in milliseconds since Unix epoch). Valid if "SeekType == Time"
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function changeMultipleStreams(parameters, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.changeMultipleStreams(parameters, successCallback, errorCallback);
	}

    /**
	 * Get all investigations from server
	 * 
     * @method getAllInvestigations
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getAllInvestigations(successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getAllInvestigations(successCallback, errorCallback);
	}

    /**
	 * Get user investigations from server
	 * 
     * @method getUserInvestigations
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getUserInvestigations(successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getUserInvestigations(successCallback, errorCallback);
	}

    /**
	 * Gets a specific investigation by its id
	 * 
     * @method getInvestigation
	 * @param {String} id - the investigation id
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
	 */
	function getInvestigation(id, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getInvestigation(id, successCallback, errorCallback);
	}

    /**
	 * Creates new investigation entry in the server.
	 * 
     * @method createInvestigation
	 * @param {Object} parameters - Object containing the following properties:
     * <pre>
	 * - {Number} StartTime - Start time of the investigation (milliseconds since Unix epoch)
     * - {Number} EndTime - End Time of the investigation (milliseconds since Unix epoch)
     * - {String} Name - Name of the investigation.
     * - {String} State - (optional) State of the investigation.
     * - {String} CameraId - (Multiple items possible) Id of the camera part of this investigation (Guid)
     * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing messages should 
     *                                be sent from server while processing the request. 
     *                                Default depends on the value in connect command.
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function createInvestigation(parameters, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.createInvestigation(parameters, successCallback, errorCallback);
	}

    /**
	 * Updates/saves new parameters of already created investigation
	 * 
     * @method updateInvestigation
	 * @param {Object} parameters - Object containing the following properties:
     * <pre>
     * - {Number} ItemId - Id of the already saved investigation.
	 * - {Number} StartTime - Start time of the investigation (milliseconds since Unix epoch)
     * - {Number} EndTime - End Time of the investigation (milliseconds since Unix epoch)
     * - {String} Name - Name of the investigation.
     * - {String} State - (optional) State of the investigation.
     * - {String} CameraId - (Multiple items possible) Id of the camera part of this investigation (Guid)
     * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing messages should 
     *                                be sent from server while processing the request. 
     *                                Default depends on the value in connect command.
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function updateInvestigation(parameters, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.updateInvestigation(parameters, successCallback, errorCallback);
	}

    /**
	 * Updates mata-data of the alredy created investigation
	 * 
     * @method updateInvestigationData
	 * @param {Object} parameters - Object containing the following properties:
     * <pre>
     * - {Number} ItemId - Id of the already saved investigation.
     * - {String} Name - (optional) Name of the investigation.
     * - {String} State - (optional) State of the investigation.
     * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing messages should 
     *                                be sent from server while processing the request. 
     *                                Default depends on the value in connect command.
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function updateInvestigationData(parameters, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.updateInvestigationData(parameters, successCallback, errorCallback);
	}

    /**
	 * Deletes investigation.
	 * 
     * @method deleteInvestigation
	 * @param {Number} investigationId - Id of the investigation. Tricky values: 
     * <pre>
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXX - Single (concrete) investigation. 
     * 00000000-0000-0000-0000-0000000000 - All investigation (My) 
     * C6B4940C-A1E9-4BBF-9CFC-6E9CBF53FFE1 - All investigations (All users)
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function deleteInvestigation(investigationId, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.deleteInvestigation(investigationId, successCallback, errorCallback);
	}

    /**
	 * Cancels investigation creation when in progress.
	 * 
     * @method cancelInvestigation
	 * @param {Number} investigationId - Id of the investigation to delete. 
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function cancelInvestigation(investigationId) {
	    return XPMobileSDK.library.Connection.cancelInvestigation(investigationId);
	}

    /**
	 * Triggers new investigation export in the server.
	 * 
	 * @method startInvestigationExport
	 * @param {String} investigationId - Guid. Id of the investigation for which an export will be created.
	 * @param {String} exportType - Type of the export to be triggered. Possible values: DB, AVI, MKV (the same as for triggering normal exports)
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function startInvestigationExport(investigationId, exportType, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.startInvestigationExport(investigationId, exportType, successCallback, errorCallback);
	}

    /**
	 * Deletes an investigation export on the server.
	 * 
	 * @method deleteInvestigationExport
	 * @param {String} investigationId - Guid. Id of the investigation for which an export will be created.
	 * @param {String} exportType - Type of the export to be triggered. Possible values: DB, AVI, MKV (the same as for triggering normal exports)
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function deleteInvestigationExport(investigationId, exportType, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.deleteInvestigationExport(investigationId, exportType, successCallback, errorCallback);
	}

    /**
	 * Gets a list of alarms
	 * 
     * @method getAlarmList
	 * @param {Object} parameters - Object containing the following properties:
     * <pre>
     * - {String} MyAlarms - YES/NO - flag whether to send only my Alarms
     * - {Number} Timestamp - Target time
     * - {Number} Count - Max alarms count to return
     * - {String} Priority - Priority of the alarm (id of the priority type)
     * - {String} State - State of the alarm (id of the state type)
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */ 
	function getAlarmList(parameters, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getAlarmList(parameters, successCallback, errorCallback);
	}

    /**
	 * Gets a single alarm. 
	 * 
     * @method getAlarm
	 * @param {String} alarmId - GUID of the alarm to be retrieved
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function getAlarm(alarmId, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getAlarm(alarmId, successCallback, errorCallback);
	}

    /**
	 * Update alarm details 
	 * 
     * @method updateAlarm
	 * @param {Object} parameters - Object containing the following properties:
     * <pre>
     * - {String} Id - Id of the Alarm to update
     * - {String} Comment - Updated comment
     * - {String} AssignedTo - Updated alarm assignee
     * - {String} Priority - Updated priority of the alarm (id of the priority type)
     * - {String} State - Updated state of the alarm (id of the state type)
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function updateAlarm(parameters, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.updateAlarm(parameters, successCallback, errorCallback);
	}

    /**
	 * Gets settings for alarms (Priority, State).
	 * 
     * @method getAlarmDataSettings
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function getAlarmDataSettings(successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getAlarmDataSettings(successCallback, errorCallback);
	}

    /**
	 * Gets list of users for a specified alarm. The alarm can be assigned to any one of these users.
	 * 
     * @method getAlarmUsers
     * @param {String} alarmId - GUID of the alarm for which users will be retrieved
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function getAlarmUsers(alarmId, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.getAlarmUsers(alarmId, successCallback, errorCallback);
	}

    /**
	 * Acknowledges a given alarm.
	 * 
     * @method acknowledgeAlarm
     * @param {String} alarmId - Id of the Alarm to acknowlegde
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function acknowledgeAlarm(alarmId, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.acknowledgeAlarm(alarmId, successCallback, errorCallback);
	}

    /**
	 * Request the prev camera for the given carousel.
	 * 
     * @method prevCarouselCamera
     * @param {String} videoId - ID of the carousel stream
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function prevCarouselCamera(videoId) {
	    return XPMobileSDK.library.Connection.prevCarouselCamera(videoId);
	}

    /**
	 * Request the next camera for the given carousel.
	 * 
     * @method nextCarouselCamera
     * @param {String} videoId - ID of the carousel stream
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function nextCarouselCamera(videoId) {
	    return XPMobileSDK.library.Connection.nextCarouselCamera(videoId);
	}

    /**
	 * Pauses a carousel.
	 * 
     * @method pauseCarousel
     * @param {String} videoId - ID of the carousel stream
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function pauseCarousel(videoId) {
	    return XPMobileSDK.library.Connection.pauseCarousel(videoId);
	}

    /**
	 * Resumes a carousel.
	 * 
     * @method resumeCarousel
     * @param {String} videoId - ID of the carousel stream
	 * 
	 * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function resumeCarousel(videoId) {
	    return XPMobileSDK.library.Connection.resumeCarousel(videoId);
	}
	
    /**
	 * Gets the resampling factor
	 * 
     * @method getResamplingFactor
	 * 
	 * @return {Number} - the resampling factor
     */
	function getResamplingFactor() {
		return XPMobileSDK.features.SupportsExtendedResamplingFactor && XPMobileSDKSettings.resamplingFactor || 1;
	}

    /**
	 * Toggles the WebSocket setting
	 * 
     * @method toggleWebSocket
     */
	function toggleWebSocket(enabled) {
	    XPMobileSDK.library.Connection.toggleWebSocket(enabled);
	}

    /**
     * Register or update client notifications subscription with specified settings
     * 
     * @method RegisterForNotifications
     * @param {Number} settings - Settings mask indicating whether the subscriber should recieve notification and what type of notifications will be send.
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
     *
     * @return {ConnectionRequest} - the ConnectionRequest object
     */
	function registerForNotifications(setting, successCallback, errorCallback) {
	    return XPMobileSDK.library.Connection.registerForNotifications(setting, successCallback, errorCallback);
	}

    /**
     * Register or update client notifications subscription with specified settings
     * 
     * @method RegisterForNotifications
     * @param {Object} params - Parameters for the server. Can contain:
     * <pre>
	 * - {String} DeviceId - The ID of the notifications subscriber.
     * - {String} DeviceName - Humanly readable device identifier. Expected to be encrypted
     * - {Number} Settings - Settings mask indicating whether the subscriber should recieve notification and what type of notifications will be send.
     * - {String} OptionalParamX - Humanly readable device identifier
	 * - {String} OptionalParamY - Humanly readable device identifier
     * - {String} OptionalParamZ - Humanly readable device identifier
     * </pre>
	 * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	function RegisterForNotifications(params, successCallback, errorCallback) {
	    XPMobileSDK.library.Connection.RegisterForNotifications(params, successCallback, errorCallback);
	}

    /**
	 * Sends requests to the server. Creates ConnectionRequest instances. 
	 * 
     * @method sendCommand
	 * @param {String} commandName - the name of the command
	 * @param {Object} requestParams - the parameters of the command
	 * @param {Object} [options] - (optional) May contain:
     * <pre>
     * 	- {Number} timeout - time interval in milliseconds after which the request will be aborted
     * 	- {Boolean} reuseConnection - flag to reuse connection or not
     * 	- {String} viewId - the unique GUID of the view that we will work on
     * 	- {String} cameraId - the unique GUID of the camera that should be started
     * 	- {Function} successCallback - callback that is provided by the client code of the Network API which will be called during the execution of the callback parameter.
	 * </pre>
     * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	function sendCommand(commandName, requestParams, options, successCallback, failCallback) {
	    XPMobileSDK.library.Connection.sendCommand(commandName, requestParams, options, successCallback, failCallback);
	}

    /**
	 * Destroys the connection
	 * 
     * @method destroy
     */
	function destroy() {
	    XPMobileSDK.library.Connection.destroy();
	}
};

/**
 * @class ConnectionObserver
 * @type {Object}
 * @property {Function} connectionStateChanged - Sent to observers when the connection state changes in any way
 * @property {Function} connectionDidConnect - Sent to observers when connection has connected to the server and is about to send credentials
 * @property {Function} connectionFailedToConnect - Sent to observers when connection attempted to connect to the server but failed.
 * @property {Function} connectionFailedToConnectWithId - Sent to observers when connecting with external connection ID has failed.  
 * @property {Function} connectionRequiresCode - Sent to observers when connection is in the process of logging in, but requires additional verification code.
 * @property {Function} connectionCodeError - Sent to observers when connection is in the process of logging in, a code has been sent to the server for verification, but this code is wrong.
 * @property {Function} connectionDidLogIn - Sent to observers when connection has logged in.
 * @property {Function} connectionFailedToLogIn - Sent to observers when connection has failed to log in.
 * @property {Function} connectionLostConnection - Sent to observers when connection to the server was lost.
 * @property {Function} connectionProcessingDisconnect - Sent to observers when the disconnect command is sent.
 * @property {Function} connectionDidDisconnect - Sent to observers when connection to the server was closed on request via disconnect method.
 * @property {Function} connectionSwitchedToPull - Sent to observers when all video connections have been switched to pull mode.
 * @property {Function} connectionRequestSucceeded - Sent to observers every time a request to the server has been received properly and without timeout or other terminal errors.
 */
XPMobileSDK.interfaces.ConnectionObserver = {
	
    /**
	 * Sent to observers when the connection state changes in any way
	 * 
	 * @method connectionStateChanged
	 */
    connectionStateChanged: function () { },

    /**
	 * Sent to observers when connection has connected to the server and is about to send credentials
	 * 
	 * @method connectionDidConnect
	 * @param {Object} parameters - the object containing the response parameters.
	 */
    connectionDidConnect: function (parameters) { },

    /**
	 * Sent to observers when connection attempted to connect to the server but failed.
	 * Note that error may be a null object if we have failed to even parse the response from the server.
	 * 
	 * @method connectionFailedToConnect
	 */
    connectionFailedToConnect: function (error) { },

    /**
	 * Sent to observers when connecting with external connection ID has failed.  
	 * 
	 * @method connectionFailedToConnectWithId
	 */
    connectionFailedToConnectWithId: function (error) { },

    /**
	 * Sent to observers when connection is in the process of logging in, but requires additional verification code.
	 * 
	 * @method connectionRequiresCode
	 * @param {String} provider - the provider used to send a verification code.
	 */
    connectionRequiresCode: function (provider) { },

    /**
	 * Sent to observers when connection is in the process of logging in, a code has been sent to the server for verification, but this code is wrong.
	 * 
	 * @method connectionCodeError
	 */
    connectionCodeError: function () { },

    /**
	 * Sent to observers when connection has logged in.
	 * 
	 * @method connectionDidLogIn
	 */
    connectionDidLogIn: function () { },

    /**
	 * Sent to observers when connection has failed to log in. Check the error to determine if it was due to incorrect credentials!
	 * Note that error may be a null object if we have failed to even parse the response from the server.
	 * 
	 * @method connectionFailedToLogIn
	 */
    connectionFailedToLogIn: function (error) { },

    /**
	 * Sent to observers when connection to the server was lost.
	 * 
	 * @method connectionLostConnection
	 */
    connectionLostConnection: function () { },

    /**
	 * Sent to observers when the disconnect command is sent.
	 * 
	 * @method connectionProcessingDisconnect
	 */
    connectionProcessingDisconnect: function () { },

    /**
	 * Sent to observers when connection to the server was closed on request via disconnect method.
	 * 
	 * @method connectionDidDisconnect
	 */
    connectionDidDisconnect: function () { },

    /**
	 * Sent to observers when all video connections have been switched to pull mode.
	 * 
	 * @method connectionSwitchedToPull
	 */
    connectionSwitchedToPull: function () { },

    /**
	 * Sent to observers every time a request to the server has been received properly and without timeout or other terminal errors.
	 * You can use that to keep track of the connection and monitor it is properly working.
	 * 
	 * @method connectionRequestSucceeded
	 */
	connectionRequestSucceeded: function (request, response) {}
};

/**
 * @class VideoConnectionObserver
 * @type {Object}
 * @property {Function} videoConnectionReceivedSegment - Called when new stream segment has arrived over the video connection
 * @property {Function} videoConnectionReceivedFrame - Called when new frame has arrived over the video connection
 * @property {Function} videoConnectionFailed - Called when an error has occurred during video streaming or in one of the internal control commands which has 
 *                                               resulted in closing the connection completely.
 * @property {Function} videoConnectionTemporaryDown - Called when a HTTP error occurred
 * @property {Function} videoConnectionRecovered - Called after the connection is no longer down due to an HTTP error. 
 * @property {Function} videoConnectionChangedState - Called if the state property of the connection has changed value.
 * @property {Function} videoConnectionStreamingError - Called when the streaming technology is no longer available. 
 */
XPMobileSDK.interfaces.VideoConnectionObserver = {
	
    /**
	 * Called when new stream segment has arrived over the video connection
	 * 
	 * @method videoConnectionReceivedSegment
	 * @param {Object} segment - VideoItem object representing the segment
	 */
    videoConnectionReceivedSegment: function (segment) { },

    
    /**
	 * Called when new frame has arrived over the video connection
	 * 
	 * @method videoConnectionReceivedFrame
	 * @param {VideoItem} frame - VideoItem object representing the frame
	 */
    videoConnectionReceivedFrame: function (frame) { },

    /**
	 * Called when an error has occurred during video streaming or in one of the internal control commands which has 
	 * resulted in closing the connection completely.
	 * 
	 * @method videoConnectionFailed
	 */
    videoConnectionFailed: function () { },

    /**
	 * Called when a HTTP error occurred
	 * 
	 * @method videoConnectionTemporaryDown
	 * @param {Number} errorCode - the HTTP error code returned from the server, or -1 if exception was thrown, or -2 if the request was aborted due to a missing response (happens more often on wireless networks)
	 */
    videoConnectionTemporaryDown: function (errorCode) { },

    /**
	 * Called after the connection is no longer down due to an HTTP error. 
     *
     * @method videoConnectionRecovered
	 */
    videoConnectionRecovered: function () { },

    /**
	 * Called if the state property of the connection has changed value.
	 * 
	 * @method videoConnectionChangedState
	 */
    videoConnectionChangedState: function () { },

    /**
	 * Called when the streaming technology is no longer available. 
	 * 
	 * @method videoConnectionStreamingError
	 */
	videoConnectionStreamingError: function () {}
};

/**
 * @class ConnectionRequest
 * @type {Object}
 * @property {Object} params - All the params that need to be sent to the server
 * @property {Object} options - Options needed for custom logic before sending the connection request
 * @property {Object} response - Response of the connection request
 * @property {Object} cancel - Cancel the connection request
 */
XPMobileSDK.interfaces.ConnectionRequest = {
	
	params: Object(),
	options: Object(),
	response: Object(),

	cancel: function () {},
};

/**
 * @enum VideoConnectionSignal
 * @var {Number} live
 * @var {Number} playback
 */
XPMobileSDK.interfaces.VideoConnectionSignal = {
	
	live: 1,
	playback: 2
};

/**
 * @class VideoConnectionSize
 * @type {Object}
 * @property {Number} width - width of the video stream in pixels
 * @property {Number} height - height of the video stream in pixels
 */
XPMobileSDK.interfaces.VideoConnectionSize = {	
	
	width: Number(),
	height: Number()
};

/**
 * @class VideoConnectionOptions
 * @type {Object}
 * @property {VideoConnectionSignal} signal - optional, live or playback stream
 * @property {Number} time - optional, timestamp for the playback stream
 * @property {Number} jpegCompressionLevel - optional, from 1 (best compression, worst quality) to 100 (worst compression, best quality)
 * @property {String} playbackControllerId - optional, for playback in multi-camera playback mode
 * @property {Boolean} keyFramesOnly - optional, receive only the key frames of the video stream
 * @property {Boolean} reuseConnection - optional, reuse existing connections for the same cameras
 */
XPMobileSDK.interfaces.VideoConnectionOptions = {
		
	signal: XPMobileSDK.interfaces.VideoConnectionSignal.live,
	time: Number(),
	jpegCompressionLevel: Number(),
	playbackControllerId: String(),
	keyFramesOnly: Boolean(),
	reuseConnection: Boolean()
};

/**
 * @class VideoConnectionCropping
 * @type {Object}
 * @property {Number} left - left offset of the cropping frame in pixels
 * @property {Number} top - top offset of the cropping frame in pixels
 * @property {Number} right - right offset of the cropping frame in pixels, overrides width
 * @property {Number} bottom - bottom offset of the cropping frame in pixels, overrides height
 * @property {Number} width - width of the cropping frame in pixels
 * @property {Number} height - height of the cropping frame in pixels
 */
XPMobileSDK.interfaces.VideoConnectionCropping = {
	
	left: Number(),
	top: Number(),
	right: Number(),
	bottom: Number(),
	width: Number(),
	height: Number()
};

/**
 * @class VideoConnection
 * @type {Object}
 * @property {String} videoId - GUID of the VideoConnection
 * @property {String} cameraId - GUID of the camera
 * @property {String} signalType - Type of the signal - Live, Playback or Upload.
 * @property {Boolean} isReusable - Flag indicating whether the connection reusable or not
 * @property {Boolean} isPush - Flag indicating whether it is a push connection
 * @property {Boolean} isSegmented -  Flag indicating whether it is segmented
 * @property {Boolean} supportsPTZ -  Flag indicating whether PTZ is supported
 * @property {Boolean} supportsPTZPresets - Flag indicating whether it PTZ Presets are supported
 * @property {Boolean} supportsPlayback - Flag indicating whether Playback is supported
 * @property {Boolean} supportsExport - Flag indicating whether Exports are supported
 * @property {Object} request - VideoConnection request data
 * @property {Object} response - VideoConnection response data
 * @property {Function} open - Opens the connection to start receiving frames.
 * @property {Function} restart -Restarts the connection.
 * @property {Function} close - Closes the connection.
 * @property {Function} addObserver - Adds an observer for the video connection.
 * @property {Function} removeObserver - Removes an observer for the video connection. 
 * @property {Function} resetCommunication - Resets communication
 * @property {Function} destroy - Class destructor.
 */
XPMobileSDK.interfaces.VideoConnection = {

    /**
	 * @property {String} videoId - GUID of the VideoConnection
	 */
    videoId: String(),

    /**
	 * @property {String} cameraId - GUID of the camera
	 */
    cameraId: String(),

    /**
	 * @property {String} signalType - Type of the signal - Live, Playback or Upload.
	 */
    signalType: String(),

    /**
	 * @property {Boolean} isReusable - Flag indicating whether the connection reusable or not
	 */
    isReusable: Boolean(),

    /**
	 * @property {Boolean} isPush - Flag indicating whether it is a push connection
	 */
    isPush: Boolean(),

    /**
	 * @property {Boolean} isSegmented -  Flag indicating whether it is segmented
	 */
    isSegmented: Boolean(),

    /**
	 * @property {Boolean} supportsPTZ -  Flag indicating whether PTZ is supported
	 */
    supportsPTZ: Boolean(),

    /**
	 * @property {Boolean} supportsPTZPresets - Flag indicating whether it PTZ Presets are supported
	 */
    supportsPTZPresets: Boolean(),

    /**
	 * @property {Boolean} supportsPlayback - Flag indicating whether Playback is supported
	 */
    supportsPlayback: Boolean(),

    /**
	 * @property {Boolean} supportsExport - Flag indicating whether Exports are supported
	 */
	supportsExport: Boolean(),
	

    /**
	 * @property {Object} request - VideoConnection request data
	 */
	request: { parameters: Object(), options: Object() },

    /**
	 * @property {Object} response - VideoConnection response data
	 */
	response: { parameters: Object() },

    /**
	 * Opens the connection to start receiving frames. 
	 * 
	 * @method open
	 */
	open: function () { },

    /**
	 * Restarts the connection.
	 * 
	 * @method restart
	 */
	restart: function () { },

    /**
	 * Closes the connection.
	 * 
	 * @method close
	 */
	close: function () { },

    /**
	 * Adds an observer for the video connection.
	 * 
	 * @method addObserver
	 * @param {Object} observer - Any object. Should implement methods from the VideoConnectionObserverInterface.
	 */
	addObserver: function (observer) { },

    /**
	 * Removes an observer for the video connection. 
	 * 
	 * @method removeObserver
	 * @param {Object} observer - Any object implementing VideoConnectionObserverInterface that should not receive further notifications
	 */
	removeObserver: function (observer) { },

    /**
	 * Resets communication
	 * 
	 * @method resetCommunication
	 */
	resetCommunication: function () { },

    /**
	 * Class destructor.
	 * 
	 * @method destroy
	 */
	destroy: function () {}
};


/**
 * @class VideoPushConnection
 * @type {Object}
 * @property {Function} open - Opens the video push connection
 * @property {Function} close - Closes the video push connection
 * @property {Function} send - Sends video frame to server
 * @property {Function} destroy - Class destructor
 * @property {Function} isOpen - Checks if the connection is open
 * @property {Function} getMediaStream - Retrieves a media stream
 */
XPMobileSDK.interfaces.VideoPushConnection = {
	
    /**
	 * Opens the video push connection
	 * 
	 * @method open
	 */
    open: function (successCallback, errorCallback) { },

    /**
	 * Closes the video push connection
	 * 
	 * @method close
	 */
    close: function () { },

    /**
	 * Sends video frame to server
	 * 
	 * @method send
	 */
    send: function (base64EncodedImage) { },

    /**
	 * Class destructor
	 * 
	 * @method destroy
	 */
    destroy: function () { },

    /**
	 * Checks if the connection is open
	 * 
	 * @method isOpen
     *
     * @return Boolean - Returns the stream object if the connection is opened
	 */
    isOpen: function () { return Boolean(); },

    /**
	 *   Retrieves a media stream
	 * 
	 * @method getMediaStream
	 */
	getMediaStream: function () { return new MediaStream(); }
};