var Application = new function () {

    this.initialize = initialize;
    this.CheckOpendStream = CheckOpendStream;
    this.GetAllMilstoneCams = GetAllMilstoneCams;
    this.ShowVideoStreamCamDefinition = ShowVideoStreamCamDefinition;
    this.buildNewCameraElement = buildNewCameraElement;
    var VideoStreams = ["0", "0", "0", "0"];
    var AllCams = [];
    var milestoneConfig;
     //Id='';

    function initialize() {
        //var url = prompt('Server') || XPMobileSDKSettings.MobileServerURL || window.location.origin;
        //if (!/^http/.test(url)) {
        //    url = 'http://' + url;
        //}
       //milestoneConfig= GetMilestonCofigValues();
       milestoneConfig= { milestoneServerUrl: "http://192.168.6.72:8081/", milestoneUserName: "administrator", milestonePassword: "P@ssw0rd" };
        var url = milestoneConfig.milestoneServerUrl;//'http://192.168.6.44:8081/';
        XPMobileSDKSettings.MobileServerURL = url;

        var observer = {
            connectionDidConnect: connectionDidConnect,
            connectionDidLogIn: connectionDidLogIn,
            connectionLostConnection: connectiondidLostConnection,
            connectionStateChanged: connectiondidStateChanged
        };
        XPMobileSDK.addObserver(observer);
        try{
            XPMobileSDK.connect(url);
        }
        catch(error){
            console.log(error);
        }
    }

    /**
     * Connection state observing. 
     */
    function connectionDidConnect(parameters) {
        var username = milestoneConfig.milestoneUserName;//'magdy' //prompt('Username');
        var password = milestoneConfig.milestonePassword;//'P@ssw0rd'; //prompt('Password');
        XPMobileSDK.login(username, password);
    }
    function connectiondidLostConnection(parameters) {
        //var username = milestoneConfig.milestoneUserName;//'magdy' //prompt('Username');
       // var password = milestoneConfig.milestonePassword;//'P@ssw0rd'; //prompt('Password');
       // XPMobileSDK.login(username, password);
    }
    function connectiondidStateChanged(parameters) {
        //var username = milestoneConfig.milestoneUserName;//'magdy' //prompt('Username');
        // var password = milestoneConfig.milestonePassword;//'P@ssw0rd'; //prompt('Password');
        // XPMobileSDK.login(username, password);
    }

    /**
     * Connection state observing. 
     */
    function connectionDidLogIn() {
        XPMobileSDK.getAllViews(function(items) {
            for (var i = 0; i < items[0].Items[0].Items[0].Items.length; i++) {
                AllCams.push(items[0].Items[0].Items[0].Items[i]);
                //try {
                //    buildNewCameraElement(items[0].Items[0].Items[0].Items[i]);
                //} catch (e) {
                //}
            }
            try {
                //Cam List view
                //var UserCams = GetAssignedCamsFromCamListModel();
                //debugger;
                for (var j = 0; j < AllCams.length; j++) {
                    //var name = AllCams[j].Name.
                    var item = { Id: AllCams[j].Id, Name: "name", Status: false };
                    buildNewCameraElement(item);
                }
            } catch (e) {
            }
            try {
                //addCamera view 
                //FillCamsListtt();
            } catch (e) {

            }

        });
    }
   
    function FillCamsListtt() {
        //debugger;
        //  milestoneSdk.js
        var allcams = Application.GetAllMilstoneCams();
        var drobdouwn = document.querySelector('#mediaplayercontrolvideo');
        var inerhtml = '';
        //addCamera view
        //var ids = GetCamsIdsFromModels();
        //var m = GetModelData();

        for (var i = 0; i < allcams.length; i++) {
            var freeCam = true;
            for (var j = 0; j < ids.length; j++) {
                //if id equal the assigned Id
                if (allcams[i].Id == m.MilestoneCamId) {
                    break;
                }
                //if id is assigned escape it
                if (allcams[i].Id == ids[j]) {
                    freeCam = false;
                    break;
                }
            }
            if (freeCam) {
                inerhtml += "<li onclick=\"setMilestonecomboboxx('" + allcams[i].Id + "','" + allcams[i].Name.split('(').pop().split(')')[0] + "')\"><div class='row active' id=milestoneslectedcomboboxx" + allcams[i].Id + " style = 'margin-left: 18px;margin-top: -10px;' >" +
                    "<a href=\"#\" style='margin-top: 6px; margin - left: 20px;' class='col-sm-6' >" + allcams[i].Name.substr(0, 6) + "</a>"+
                    //"<a href=\"#\" id='cameraIp"+ i +"' style='margin-top: 6px; margin - left: 20px;display:none' class='col-sm-6' >" + allcams[i].Name.split('(').pop().split(')')[0] + "</a>" +
                    "<div style='width:40px; height:40px;' class='CamItemBackgroundImg col-sm-6' id=SVG" + allcams[i].Id + "></div>" +
                    "</div> </li>";
            }
        }
       
        drobdouwn.innerHTML = inerhtml;
        // select the assigned camer addCamera view
        if (m.MilestoneCamId != null) {
            //addCamera view
            setMilestonecomboboxx(m.MilestoneCamId);
        }
    }
    function Camera(mainDiv,item) {
        //imgTemb exist in livemonitoring view
        //if (event.currentTarget.classList.contains("pauseButton")) {
        //    var Id = event.currentTarget.parentNode.parentNode.id.replace('Cam', '');
        //}
        //else {
        //    var Id = event.currentTarget.id.replace('Cam', '');
        //}
        //var videoStatus = false;
        var VideoDiv = mainDiv.querySelector('#mainFrame');
        var Id = item.Id;
      //  var mainContainer = document.getElementById('mainFrame');
        var container = document.createElement('div');
        container.setAttribute('id', 'container' + item.Id);
        container.setAttribute('class', 'camera imgTemb');
      
        var headerElement = document.createElement('h4');
        headerElement.innerHTML = item.Name || '';
        container.appendChild(headerElement);

        var canvasElement = document.createElement('canvas');
        canvasElement.setAttribute('class', 'camera imgTemb');
        container.appendChild(canvasElement);

        var videoElement = document.createElement('video');
        videoElement.setAttribute('class', 'camera imgTemb');
        container.appendChild(videoElement);

        var bottombar = document.createElement('div');
        bottombar.setAttribute('class', 'bottombar');

        var pauseButton = document.createElement('div');
        pauseButton.setAttribute('class', 'pauseButton btn');
        pauseButton.setAttribute('title', 'Pause');
        bottombar.appendChild(pauseButton);

        var playbackBarButtons = document.createElement('div');
        playbackBarButtons.setAttribute('class', 'playbackBarButtons');

        var playBackButton = document.createElement('div');
        playBackButton.setAttribute('class', 'playBackButton btn');
        playBackButton.setAttribute('title', 'Play backward');
        playbackBarButtons.appendChild(playBackButton);

        var playBackTime = document.createElement('div');
        playBackTime.setAttribute('class', 'playTimeIndex');
        playbackBarButtons.appendChild(playBackTime);

        var playForwardButton = document.createElement('div');
        playForwardButton.setAttribute('class', 'playForwardButton btn');
        playForwardButton.setAttribute('title', 'Play forward');
        playbackBarButtons.appendChild(playForwardButton);

        bottombar.appendChild(playbackBarButtons);
        container.appendChild(bottombar);
       // closebtn.addEventListener('click', CloseVideoStream, true);

       // var mainContainer = document.querySelector('#mainFrame');
        VideoDiv.appendChild(container);
        for (var i = 0; i < VideoStreams.length; i++) {
            if (VideoStreams[i] == "0") {
                VideoStreams[i] = mainDiv;
                break;
            }
        }
       // mainDiv.innerHTML = container.innerHTML;
        //
        var canvas = document.querySelector("#container" + item.Id + ' canvas');
        var canvasContext = canvas.getContext('2d');
      
        var video = document.querySelector("#container" + item.Id + ' video');
        var image = document.createElement('img');
        image.setAttribute('class', 'camera imgTemb ');
        image.addEventListener('load', onImageLoad);
        image.addEventListener('error', onImageError);
        var imageURL, videoController;
        var drawing = false;
        var width = 1280;
        var height = 720;
        //badr
        canvasContext.canvas.width = width;
        canvasContext.canvas.height = height;
        //var destination = { width: 800, height: 600 };
        //var destination = { width: 1024, height: 768  };
        var destination = { width: width, height: height };

        var videoConnectionObserver = {
            videoConnectionReceivedFrame: videoConnectionReceivedFrame
        }

        /**
         * Requesting a video stream. 
         */
        var streamRequest = XPMobileSDK.requestStream(item.Id, destination, null, requestStreamCallback,
            function (error) {
                if (error.code == '23') {
                   // XPMobileSDK.connect(milestoneConfig.milestoneServerUrl);
                }
            }
        );

      //  mainContainer.innerHTML = container.innerHTML;
        /**
         * Video stream request callback 
         */
        function requestStreamCallback(videoConnection) {
            videoController = videoConnection;
            videoConnection.addObserver(videoConnectionObserver);
            videoConnection.open();
        }

      //  Id = item.Id;
        document.getElementById('container' + item.Id).classList.add('playing');
       // document.getElementById('container' + item.Id).removeEventListener('click', Camera);
        document.getElementById('container' + item.Id).addEventListener('click',switchToPlayback);
        document.querySelector('#container' + item.Id + ' .bottombar').setAttribute("style", "display:none;");
        document.querySelector('#container' + item.Id + ' .bottombar').classList.remove("onPause");
        document.querySelector('#container' + item.Id + ' .playBackButton').addEventListener('click', playBackwardTrigger);
        document.querySelector('#container' + item.Id + ' .playForwardButton').addEventListener('click', playForwardTrigger);
        //'toggle' + item.id
        var toggle = document.querySelector('#toggleOptionPrimary' + item.Id);//'toggleOptionPrimary' + item.id
        if (toggle != null) {
            toggle.addEventListener('click', CloseVideoStream, true);
        } 
        //document.getElementById('container' + Id).removeEventListener('click', switchToPlayback);
        var closebtn = mainDiv.querySelector('#btnCloseStream');
        closebtn.addEventListener('click', CloseVideoStream, true);

        var pauseBtn = mainDiv.querySelector('#pauseBtn');
        pauseBtn.addEventListener('click', switchToPlayback, true);

        var playBtn = mainDiv.querySelector('#playBtn');
        playBtn.addEventListener('click', switchToLive, true);

        var btnSnape = mainDiv.querySelector('#btnSnape');
        btnSnape.addEventListener('click', SnapeImg, true);

        var btnFullScreen = mainDiv.querySelector('#btnFullScreen');
        btnFullScreen.addEventListener('click', FullScreenFun, true);

          //CloseVideoStream);
        var playbackTimestamp = new Date();
        var playbackSpeed = 0;

        var isLive = true;
        function SnapeImg() {
           // canvasContext.drawImage(image, 0, 0, 800, 600);
          
            var dataURL = canvas.toDataURL('image/png');
            //debugger;
            btnSnape.href = dataURL;
            //XPMobileSDK.getThumbnail(item.Id,
            //    function (result) {
            //        var img = result;
            //        var data = img.replace(/^data:image\/\w+;base64,\//, "");
            //        var buf = new Buffer(data, 'base64');
            //        fs.writeFile('image.png', buf);

            //    });

        };

        function FullScreenFun() {
            if (document.fullscreenEnabled) {
                //document.getElementById('container' + item.Id).webkitRequestFullscreen();
                mainDiv.webkitRequestFullscreen();
            }
            else if (document.webkitFullscreenEnabled) {
               // mainDiv.height = '800px';
                mainDiv.webkitRequestFullscreen();
            }
        };

        function CloseVideoStream()
        {
            //if (openStream) {
            //    stop();
            //    return;
            //}
            var checkBox = document.querySelector('#someSwitchOptionPrimary' + item.Id); //event.currentTarget.querySelector('input[name="someSwitchOption001"]');

            if (checkBox != null) checkBox.checked = false;
            var image = document.createElement('img');
            image.setAttribute('src', '../../Resources/Asset 23.png');
            image.setAttribute('class', 'imgTemb');
            VideoDiv.innerHTML = '';
            VideoDiv.appendChild(image);
            try {
                document.getElementById('toggleOptionPrimary' + item.Id).removeEventListener('click', CloseVideoStream, true);
            } catch (e) {}
            
            var closebtn = mainDiv.querySelector('#btnCloseStream');
            closebtn.removeEventListener('click', CloseVideoStream, true);
            var closebtn = mainDiv.querySelector('#pauseBtn');
            closebtn.removeEventListener('click', switchToPlayback, true);
            var closebtn = mainDiv.querySelector('#playBtn');
            closebtn.removeEventListener('click', switchToLive, true);
            var btnSnape = mainDiv.querySelector('#btnSnape');
            btnSnape.removeEventListener('click', SnapeImg, true);
            var btnFullScreen = mainDiv.querySelector('#btnFullScreen');
            btnFullScreen.removeEventListener('click', FullScreenFun, true);
                stop();
        };
        /**
         * Executed on received frame. 
         */
        function videoConnectionReceivedFrame(frame) {
            try {
                if (!drawing && frame.dataSize > 0) {
                    try {
                        item.Status = true;
                        var circleStatus1 = document.querySelector("#camStatusOptionPrimary" + item.Id);
                        circleStatus1.classList.add("text-success");
                        circleStatus1.classList.remove("text-danger"); //text-danger text-success
                    } catch (e) {
                    }

                    drawing = true;

                    if (frame.hasSizeInformation) {
                        var multiplier = frame.sizeInfo.destinationSize.resampling * XPMobileSDK.getResamplingFactor();
                        image.width = multiplier * frame.sizeInfo.destinationSize.width;
                        image.height = multiplier * frame.sizeInfo.destinationSize.height;
                    }

                   // if (imageURL) {
                       // window.URL.revokeObjectURL(imageURL);
                       // image.src = null; 
                   // }

                   // imageURL = window.URL.createObjectURL(frame.blob);

                    var reader = new FileReader();
                    reader.readAsDataURL(frame.blob);
                    reader.onloadend = function () {
                        var base64data = reader.result;
                       // console.log(base64data);
                        image.src = base64data 
                    }

                   
                   
                    

                    if (!isLive && frame.timestamp.getTime() != playbackTimestamp.getTime()) {
                        updateTime(frame.timestamp);
                    }
                } else if (!item.Status) {
                    var circleStatus = document.querySelector("#camStatusOptionPrimary" + item.Id);

                    circleStatus.classList.remove("text-success"); //text-danger text-success
                    circleStatus.classList.add("text-danger");
                }
            } catch (e) {
            }

        }

        /**
         * Executed on image load. 
         */
        function onImageLoad(event) {
            //canvas.width = image.width;
            //canvas.height = image.height;
            var w = canvas.width;
            var h = canvas.height;
            canvasContext.drawImage(image, 0, 0, w, h);
           // image = null;
           // canvasContext.setAttribute('background-image', image)
            
            drawing = false;
        }

        function onImageError(event) {
            drawing = false;
        }

        /**
         * Stop camera stream 
         */
        function stop() {
            videoController.removeObserver(videoConnectionObserver);
            videoController.close();
            videoController = null;

            if (streamRequest) {
                XPMobileSDK.cancelRequest(streamRequest);
                streamRequest = null;
            }
            document.getElementById('container' + Id).removeEventListener('click', stop);
        };

        function resetState() {
            playbackSpeed = 0;
            updatePlaybackButtons();

            if (streamRequest) {
                XPMobileSDK.cancelRequest(streamRequest);
                streamRequest = null;
            }
        }

        /**
         * Switch to camera playback mode. 
         */
        function switchToPlayback() {

            if (!isLive) return;

            isLive = false;

            stop();

            document.getElementById('container' + Id).removeEventListener('click', switchToPlayback);

            playbackTimestamp = new Date();

            showPlaybackControls();
            resetState();

            updateTime(playbackTimestamp);

            var parameters = { width: 400, height: 300 };

            var option = { signal: XPMobileSDK.interfaces.VideoConnectionSignal.playback };

            streamRequest = XPMobileSDK.requestStream(
                Id,
                parameters,
                option,
                requestStreamCallback,
                null
            );
        }

        /**
         * Switch camera to live video
         */
        function switchToLive(e) {
            e.stopPropagation();
            e.preventDefault();

            if (isLive) return;

            isLive = true;

            stop();

            document.getElementById('container' + Id).removeEventListener('click', switchToLive);
            document.getElementById('container' + Id).addEventListener('click', switchToPlayback);
            document.querySelector('#container' + Id + ' .bottombar').setAttribute("style", "display:none;");
            document.querySelector('#container' + Id + ' .bottombar').classList.remove("onPause");

            resetState();

            streamRequest = XPMobileSDK.requestStream(Id, destination, null,
                requestStreamCallback,
                function (error) { }
            );
        }

        /**
         * Trigger camera play backwards
         */
        function playBackwardTrigger() {
            if (playbackSpeed < 0) {
                playbackChangeSpeed(0);
            }
            else {
                playbackChangeSpeed(-1);
            }
        }

        /**
         * Trigger camera play forward
         */
        function playForwardTrigger() {
            if (playbackSpeed > 0) {
                playbackChangeSpeed(0);
            }
            else {
                playbackChangeSpeed(1);
            }
        }

        /**
         * Show camera playback controls
         */
        function showPlaybackControls() {
            document.getElementById('container' + Id).removeEventListener('click', switchToPlayback);
            document.getElementById('container' + Id).classList.remove('playing');

            document.querySelector('#container' + Id + ' .bottombar').setAttribute("style", "display:block;");
            document.querySelector('#container' + Id + ' .bottombar').classList.add("onPause");

            document.querySelector('#container' + Id + ' .pauseButton').setAttribute('title', 'Live');
            document.querySelector('#container' + Id + ' .pauseButton').addEventListener('click', switchToLive);
        }

        /**
         * Change video speed
         */
        function playbackChangeSpeed(speed) {
            if (!videoController || speed == playbackSpeed) return;

            speed = Math.round(speed);

            XPMobileSDK.playbackSpeed(videoController, speed);

            if (speed == 0) {
                playbackSpeed = 0;
            }
            else if (speed < 0) {
                playbackSpeed = -1;
            }
            else if (speed > 0) {
                playbackSpeed = 1;
            }

            updatePlaybackButtons();
        }

        /**
         * Update playback controls depending on the video speed
         */
        function updatePlaybackButtons() {
            var playForwardButton = document.querySelector('#container' + Id + ' .playForwardButton');
            var playBackButton = document.querySelector('#container' + Id + ' .playBackButton');

            if (playbackSpeed == 0) {
                playForwardButton.classList.remove('active');
                playForwardButton.title = "Play forward";
                playBackButton.classList.remove('active');
                playBackButton.title = "Play backwards";
            }
            else if (playbackSpeed < 0) {
                playForwardButton.classList.remove('active');
                playForwardButton.title = "Play forward";
                playBackButton.classList.add('active');
                playBackButton.title = "Pause";
            }
            else if (playbackSpeed > 0) {
                playForwardButton.classList.add('active');
                playForwardButton.title = "Pause";
                playBackButton.classList.remove('active');
                playBackButton.title = "Play backwards";
            }
        }

        /**
         * Updates time element
         */
        function updateTime(timestamp) {

            if (isLive) return;

            playbackTimestamp = timestamp;

            var date = new Date(timestamp);

            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

            document.querySelector('#container' + Id + ' .playTimeIndex').innerHTML = formattedTime;
        }

    };

    function onVideoPushConnection(videoPushConnection) {

        video.ontimeupdate = function (event) {

            //var width = video.videoWidth;
            //var height = video.videoHeight;

            //canvasContext.canvas.width = width;
            //canvasContext.canvas.height = height;
            canvasContext.drawImage(video, 0, 0, width, height);

            videoPushConnection.send(canvas.toDataURL("image/jpeg", 0.9));
        };
    }

    /**
     * Builds camera element
     */
    function buildCameraElement(item) {
        var container = document.createElement('div');
        container.setAttribute('id', 'container' + item.Id);
        container.setAttribute('class', 'camera');

        var headerElement = document.createElement('h4');
        headerElement.innerHTML = item.Name || '';
        container.appendChild(headerElement);

        var canvasElement = document.createElement('canvas');
        container.appendChild(canvasElement);

        var videoElement = document.createElement('video');
        container.appendChild(videoElement);

        var bottombar = document.createElement('div');
        bottombar.setAttribute('class', 'bottombar');

        var pauseButton = document.createElement('div');
        pauseButton.setAttribute('class', 'pauseButton btn');
        pauseButton.setAttribute('title', 'Pause');
        bottombar.appendChild(pauseButton);

        var playbackBarButtons = document.createElement('div');
        playbackBarButtons.setAttribute('class', 'playbackBarButtons');

        var playBackButton = document.createElement('div');
        playBackButton.setAttribute('class', 'playBackButton btn');
        playBackButton.setAttribute('title', 'Play backward');
        playbackBarButtons.appendChild(playBackButton);

        var playBackTime = document.createElement('div');
        playBackTime.setAttribute('class', 'playTimeIndex');
        playbackBarButtons.appendChild(playBackTime);

        var playForwardButton = document.createElement('div');
        playForwardButton.setAttribute('class', 'playForwardButton btn');
        playForwardButton.setAttribute('title', 'Play forward');
        playbackBarButtons.appendChild(playForwardButton);


        bottombar.appendChild(playbackBarButtons);
        container.appendChild(bottombar);

        //container.addEventListener('click', Camera);
        document.body.appendChild(container);
    };

    function buildNewCameraElement(item) {
        //debugger;
        var container = document.querySelector('#divCamList');
        var _Box = document.createElement('div');
        _Box.setAttribute('id', 'Cam' + item.Id);
        _Box.setAttribute('class', 'box CamItem');
       
        /*
          <div class="col-sm-3 CamItemName">@camera.CameraName</div>
                        <div class="col-sm-1"><i class="fa fa-circle text-danger CamItemCircle"></i></div>
                        <div class="col-sm-3">

                            <div class="material-switch pull-right CamItemCircle">
                                <input id="someSwitchOptionPrimary" @camera.CameraId name="someSwitchOption001" type="checkbox" />
                                <label for="someSwitchOptionPrimary" @camera.CameraId class="label-primary"></label>
                            </div>
                        </div>
                        
                        <svg class="CamItemBackgroundImg">
                            <path class="cls-2" d="M12.14,29.28H11.05V24.92h1.09Zm6.94-2.06a2.19,2.19,0,0,1-1.82,1h-4V27.1h4a1.07,1.07,0,0,0,.91-.49l.75-1.13.94.56Zm3.52-2.43a1.44,1.44,0,0,1-1.92.47l-1.38-.83a1.26,1.26,0,0,1-.62-1.09,1.25,1.25,0,0,1,.26-.76l.64-.86,3.61,2.08Zm6.21,1L16.05,18.43a1.29,1.29,0,0,1-.41-1.85l1.37-2L30.5,22.41Zm4.05-3.6a2.72,2.72,0,0,1-2.37,2.69l1.14-2.28L32.84,22A1.5,1.5,0,0,1,32.86,22.19Zm-1.62-.62-13.6-7.84.87-1.24a1.54,1.54,0,0,1,1.26-.66,1.57,1.57,0,0,1,.76.2l13.9,8Zm4.61-2L21.07,11.07a2.71,2.71,0,0,0-3.46.77l-2.86,4.1a2.36,2.36,0,0,0-.43,1.36,2.41,2.41,0,0,0,1.19,2.07l3.12,1.8-.57.75a2.39,2.39,0,0,0-.47,1.42,2.36,2.36,0,0,0,.5,1.42L17.26,26h-4V24.37a.53.53,0,0,0-.55-.54H10.5a.53.53,0,0,0-.54.54v5.45a.55.55,0,0,0,.54.55h2.18a.55.55,0,0,0,.55-.55v-.54h4A3.25,3.25,0,0,0,5,27.82l.9-1.34a2.25,2.25,0,0,0,.52.07,2.49,2.49,0,0,0,2.13-1.21l.6-1L28.77,27a.53.53,0,0,0,.27.08.41.41,0,0,0,.16,0,.54.54,0,0,0,.33-.28l.4-.8h.2A3.82,3.82,0,0,0,34,22.18a3.63,3.63,0,0,0-.09-.71l2-1a.55.55,0,0,0,.3-.47A.54.54,0,0,0,35.85,19.53Z"></path>
                        </svg>
         */
        var nameElemnt = document.createElement('div');
        nameElemnt.setAttribute('class', 'CamItemName');
        nameElemnt.innerText = item.Name;
        _Box.appendChild(nameElemnt);

        var MainCircleElemnt = document.createElement('div');
        //MainCircleElemnt.setAttribute('class', 'col-sm-1');
        var ChildCircleElemnt = document.createElement('i');
        ChildCircleElemnt.setAttribute('class', 'fa fa-circle text-success CamItemCircle');
        ChildCircleElemnt.setAttribute('id', 'camStatusOptionPrimary' + item.Id);
        MainCircleElemnt.appendChild(ChildCircleElemnt);
        _Box.appendChild(MainCircleElemnt);

        var CameControlElemnt = document.createElement('div');//
        //CameControlElemnt.setAttribute('class', 'col-sm-3');
        var ChildMainCircleElemnt = document.createElement('div');//
        ChildMainCircleElemnt.setAttribute('class', 'material-switch pull-right CamItemToggle');
        ChildMainCircleElemnt.setAttribute('id', 'toggleOptionPrimary' + item.Id);
        var checkBoxElemnt = document.createElement('input');//
        checkBoxElemnt.setAttribute('id', 'someSwitchOptionPrimary' + item.Id);
        checkBoxElemnt.setAttribute('name', 'someSwitchOption001');
        checkBoxElemnt.setAttribute('type', 'checkbox');
        
        var LabeleElemnt = document.createElement('label');//
        LabeleElemnt.setAttribute('id', 'someSwitchOptionPrimary' + item.Id);
        LabeleElemnt.setAttribute('class', 'label-primary');
        ChildMainCircleElemnt.appendChild(checkBoxElemnt);
        ChildMainCircleElemnt.appendChild(LabeleElemnt);
        ChildMainCircleElemnt.addEventListener('click', function () {
            ShowVideoStream(item);
        }, true);
        CameControlElemnt.appendChild(ChildMainCircleElemnt);
        _Box.appendChild(CameControlElemnt);


        var CameImgElemnt = document.createElement('div');//
        CameImgElemnt.setAttribute('class', 'CamItemBackgroundImg');
      // CameImgElemnt.innerHTML = "<path class=cls - 2' d='M12.14, 29.28H11.05V24.92h1.09Zm6.94 - 2.06a2.19, 2.19, 0, 0, 1 - 1.82, 1h - 4V27.1h4a1.07, 1.07, 0, 0, 0, .91 - .49l.75 - 1.13.94.56Zm3.52 - 2.43a1.44, 1.44, 0, 0, 1 - 1.92.47l - 1.38 - .83a1.26, 1.26, 0, 0, 1 - .62 - 1.09, 1.25, 1.25, 0, 0, 1, .26 - .76l.64 - .86, 3.61, 2.08Zm6.21, 1L16.05, 18.43a1.29, 1.29, 0, 0, 1 - .41 - 1.85l1.37 - 2L30.5, 22.41Zm4.05 - 3.6a2.72, 2.72, 0, 0, 1 - 2.37, 2.69l1.14 - 2.28L32.84, 22A1.5, 1.5, 0, 0, 1, 32.86, 22.19Zm - 1.62 - .62 - 13.6 - 7.84.87 - 1.24a1.54, 1.54, 0, 0, 1, 1.26 - .66, 1.57, 1.57, 0, 0, 1, .76.2l13.9, 8Zm4.61 - 2L21.07, 11.07a2.71, 2.71, 0, 0, 0 - 3.46.77l - 2.86, 4.1a2.36, 2.36, 0, 0, 0 - .43, 1.36, 2.41, 2.41, 0, 0, 0, 1.19, 2.07l3.12, 1.8 - .57.75a2.39, 2.39, 0, 0, 0 - .47, 1.42, 2.36, 2.36, 0, 0, 0, .5, 1.42L17.26, 26h - 4V24.37a.53.53, 0, 0, 0 - .55 - .54H10.5a.53.53, 0, 0, 0 - .54.54v5.45a.55.55, 0, 0, 0, .54.55h2.18a.55.55, 0, 0, 0, .55 - .55v - .54h4A3.25, 3.25, 0, 0, 0, 5, 27.82l.9 - 1.34a2.25, 2.25, 0, 0, 0, .52.07, 2.49, 2.49, 0, 0, 0, 2.13 - 1.21l.6 - 1L28.77, 27a.53.53, 0, 0, 0, .27.08.41.41, 0, 0, 0, .16, 0, .54.54, 0, 0, 0, .33 - .28l.4 - .8h.2A3.82, 3.82, 0, 0, 0, 34, 22.18a3.63, 3.63, 0, 0, 0 - .09 - .71l2 - 1a.55.55, 0, 0, 0, .3 - .47A.54.54, 0, 0, 0, 35.85, 19.53Z'></path>";
        //var CameImgPath = document.createElement('path');//
        //CameImgPath.setAttribute('class', 'cls-2 CamItemBackgroundImg');
        //CameImgPath.setAttribute('d', 'M12.14,29.28H11.05V24.92h1.09Zm6.94-2.06a2.19,2.19,0,0,1-1.82,1h-4V27.1h4a1.07,1.07,0,0,0,.91-.49l.75-1.13.94.56Zm3.52-2.43a1.44,1.44,0,0,1-1.92.47l-1.38-.83a1.26,1.26,0,0,1-.62-1.09,1.25,1.25,0,0,1,.26-.76l.64-.86,3.61,2.08Zm6.21,1L16.05,18.43a1.29,1.29,0,0,1-.41-1.85l1.37-2L30.5,22.41Zm4.05-3.6a2.72,2.72,0,0,1-2.37,2.69l1.14-2.28L32.84,22A1.5,1.5,0,0,1,32.86,22.19Zm-1.62-.62-13.6-7.84.87-1.24a1.54,1.54,0,0,1,1.26-.66,1.57,1.57,0,0,1,.76.2l13.9,8Zm4.61-2L21.07,11.07a2.71,2.71,0,0,0-3.46.77l-2.86,4.1a2.36,2.36,0,0,0-.43,1.36,2.41,2.41,0,0,0,1.19,2.07l3.12,1.8-.57.75a2.39,2.39,0,0,0-.47,1.42,2.36,2.36,0,0,0,.5,1.42L17.26,26h-4V24.37a.53.53,0,0,0-.55-.54H10.5a.53.53,0,0,0-.54.54v5.45a.55.55,0,0,0,.54.55h2.18a.55.55,0,0,0,.55-.55v-.54h4A3.25,3.25,0,0,0,5,27.82l.9-1.34a2.25,2.25,0,0,0,.52.07,2.49,2.49,0,0,0,2.13-1.21l.6-1L28.77,27a.53.53,0,0,0,.27.08.41.41,0,0,0,.16,0,.54.54,0,0,0,.33-.28l.4-.8h.2A3.82,3.82,0,0,0,34,22.18a3.63,3.63,0,0,0-.09-.71l2-1a.55.55,0,0,0,.3-.47A.54.54,0,0,0,35.85,19.53Z');
        //CameImgElemnt.appendChild(CameImgPath);
        _Box.appendChild(CameImgElemnt);
      
        container.appendChild(_Box);
        

        //var headerElement = document.createElement('h4');
        //headerElement.innerHTML = item.Name || '';
        //container.appendChild(headerElement);

        //var canvasElement = document.createElement('canvas');
        //container.appendChild(canvasElement);

        //var videoElement = document.createElement('video');
        //container.appendChild(videoElement);

        //var bottombar = document.createElement('div');
        //bottombar.setAttribute('class', 'bottombar');

        //var pauseButton = document.createElement('div');
        //pauseButton.setAttribute('class', 'pauseButton btn');
        //pauseButton.setAttribute('title', 'Pause');
        //bottombar.appendChild(pauseButton);

        //var playbackBarButtons = document.createElement('div');
        //playbackBarButtons.setAttribute('class', 'playbackBarButtons');

        //var playBackButton = document.createElement('div');
        //playBackButton.setAttribute('class', 'playBackButton btn');
        //playBackButton.setAttribute('title', 'Play backward');
        //playbackBarButtons.appendChild(playBackButton);

        //var playBackTime = document.createElement('div');
        //playBackTime.setAttribute('class', 'playTimeIndex');
        //playbackBarButtons.appendChild(playBackTime);

        //var playForwardButton = document.createElement('div');
        //playForwardButton.setAttribute('class', 'playForwardButton btn');
        //playForwardButton.setAttribute('title', 'Play forward');
        //playbackBarButtons.appendChild(playForwardButton);


        //bottombar.appendChild(playbackBarButtons);
        //container.appendChild(bottombar);

       // container.addEventListener('click', Camera);
       // document.body.appendChild(container);
    };

  
    function ShowVideoStream(item) {
       // debugger;
        var Id = event.currentTarget.parentNode.parentNode.id.replace('Cam', '')
        //$('div[id^="liveStreamMedia"] img').each(function () {
        var elements= document.getElementsByClassName('mediaPlayerControl');
        //var elements = document.getElementsByClassName("MFrame");
        //var names = '';
        for (var i = 1; i < elements.length; i++) {
          //  names += elements[i].name;
            var mainDiv = elements[i];
            var VideoDiv = mainDiv.querySelector('#mainFrame');
            var ctrl = VideoDiv.querySelector('img');
            var checkBox = event.currentTarget.querySelector('input[name="someSwitchOption001"]');
            //open video stream from toggle button
            if (!checkBox.checked) {
                if (ctrl != null && ctrl.src.indexOf("23.png")) {//ctrl.src.indexOf("23.png") > 0
                    VideoDiv.innerHTML = '';
                    // ctrl["0"].src = "http://192.168.2.85/axis-cgi/mjpg/video.cgi?resolution=320x240";
                    Camera(mainDiv, item);
                    // alert("on pic");
                    checkBox.checked = true;
                    break;
                //return false;
                }
                else {
                    continue;
                }
            }
        }
    };
    function ShowVideoStreamCamDefinition(id) {
        CheckOpendStream();
        var item;
        for (var i = 0; i < AllCams.length; i++) {
            if (AllCams[i].Id == id) {
                item = AllCams[i];
                break;
            }
        }
        // debugger;
       // var Id = event.currentTarget.parentNode.parentNode.id.replace('Cam', '')
        //$('div[id^="liveStreamMedia"] img').each(function () {
        var elements = document.getElementsByClassName('mediaPlayerControl');
        //var elements = document.getElementsByClassName("MFrame");
        //var names = '';
        for (var i = 0; i < elements.length; i++) {
            //  names += elements[i].name;
            var mainDiv = elements[i];
            var VideoDiv = mainDiv.querySelector('#mainFrame');
            var ctrl = VideoDiv.querySelector('img');
           // var checkBox = event.currentTarget.querySelector('input[name="someSwitchOption001"]');
            //open video stream from toggle button
           // if (!checkBox.checked) {

             //   if (ctrl != null && ctrl.src.indexOf("23.png")) {//ctrl.src.indexOf("23.png") > 0

                    VideoDiv.innerHTML = '';
                    // ctrl["0"].src = "http://192.168.2.85/axis-cgi/mjpg/video.cgi?resolution=320x240";
                    Camera(mainDiv, item);
                    // alert("on pic");
                  //  checkBox.checked = true;
                    break;
                    //return false;
            //    }
            //    else {
            //        continue;
            //    }
            //}
        }
    };

    function CheckOpendStream() {
        for (var i = 0; i < VideoStreams.length; i++) {
            if (VideoStreams[i] != "0") {

                var closebtn1 = VideoStreams[i].querySelector('#btnCloseStream');
                eventFire(closebtn1, 'click');
                VideoStreams[i] = "0";
            }
        }
    }
    function GetAllMilstoneCams() {
        return AllCams;
    }
    function eventFire(el, eType) {
        if (el.fireEvent) {
            el.fireEvent('on', eType);
        }
        else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(eType, true, false);
            el.dispatchEvent(evObj);
        }
    }
};

window.addEventListener('load', function () {
    console.log('Window loaded.');
    var startApp = function () {
        XPMobileSDK.onLoad = Application.initialize;
        XPMobileSDK.isLoaded() && Application.initialize();
    }

    if ('XPMobileSDK' in window) {
        startApp();
    }
    else {
        script = document.createElement('script');
        script.addEventListener('load', function () {
            startApp();
        });
        script.src = '../XPMobileSDK.js';
        document.querySelector('head').appendChild(script);
    }
});