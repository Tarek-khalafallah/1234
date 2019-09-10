
import 'signalr/jquery.signalR';

import * as alarmView from './views/alarmView';


$(document).ready(function(){
    try{
        $.connection.hub.url = "http://192.168.2.93:5539/signalr";

        // Declare a proxy to reference the hub.
        var chat = $.connection.myHub;
    
        // Create a function that the hub can call to broadcast messages.
        chat.client.addMessage = function (name, message) {
            // Html encode display name and message.
            var encodedName = $('<div />').text(name + (++alarmnumber)).html();
            var encodedMsg = $('<div />').text(message).html();
            // Add the message to the page.
            console.log(`the name of the server is ${name} and the message is ${message}`);
    
            // check if not empty and  alarm or log 
            // if alarm controlalarm
            //if log controlLog
        };
    
        // Start the connection.
        $.connection.hub.start();
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

const controlLog = EventLogPayLoad => {

}


