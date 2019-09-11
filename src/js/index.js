
//import 'signalr/jquery.signalR';
import * as alarmView from './views/alarmView';
import * as logView from './views/logView';
import { elements } from "./views/base";


$(document).ready(function(){
    try{
        $.connection.hub.url = "http://192.168.2.93:5539/signalr";

        // Declare a proxy to reference the hub.
        var chat = $.connection.myHub;
    
        // Create a function that the hub can call to broadcast messages.
        chat.client.addMessage = function (name, message) {
            // Add the message to the page.
            console.log(`the name of the server is ${name} and the message is ${message}`);
            var msg = JSON.parse(message);
    
            // check if not empty and  alarm or log 
            if(msg){
                if(msg.hasOwnProperty('LogId')){
                    controlLog(msg);
                }
                else{
                    controlAlarm(msg);
                }
            }
            // if alarm controlalarm
            //if log controlLog
        };
    
        // Start the connection.
        $.connection.hub.start().done(console.log("connection is done"));
    }
    catch(error){
        console.log(error);
    }
   
});

const state = {}

const controlAlarm = caleumAlarm => {
    if (!state.alarmList) state.alarmList = [];

    // add to state
    state.alarmList.push(caleumAlarm);
    //display alarm
    alarmView.addAlarm(caleumAlarm);
    //
}

const controlLog = LayerEventPayload => {
    if (!state.logList) state.logList = {};

    // add to state
    LayerEventPayload.id = LayerEventPayload.LogId + LayerEventPayload.LogText;
    state.logList[LayerEventPayload.id] = LayerEventPayload;
    //display alarm
    logView.addLog(LayerEventPayload);
    //
}

elements.logs.addEventListener('click', e => {
    const btn = e.target.closest('.camera-alarms-tab');
    if (btn) {
        logView.displayDetails(state.logList[btn.id])
    }
});



