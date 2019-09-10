import { elements } from "./base";

export const addAlarm = alarm => {
 if(alarm)
 {
     if(alarm.AlarmDefinition) {
        var alarmTitle1 = alarm.AlarmDefinition.AlarmDefinitionTitle1;
        var alarmHtml = `<div class="camera-alarms-tab">
        <div class="camera-alarms-logo"><img src="svgs/crossline/crossline.svg" alt=""></div>
        <div class="camera-title">${alarmTitle1}</div>
        <div class="camera-alarms-button">
            <svg id="" viewBox="0 0 15 10">
                <path d="M7.51,0A8.14,8.14,0,0,1,14,3.24,7.67,7.67,0,0,1,15,4.9a.23.23,0,0,1,0,.2,8,8,0,0,1-5.5,4.64A7.82,7.82,0,0,1,4.7,9.49,8.08,8.08,0,0,1,0,5.08a.31.31,0,0,1,0-.19A8.09,8.09,0,0,1,5.52.25,7.81,7.81,0,0,1,7.51,0Zm-7,5c3.59,5.44,10.54,5.25,13.94,0C11.1-.23,4.15-.47.53,5Z"></path>
                <path d="M8.57,3.19c-.38.19-.5.39-.45.71a.6.6,0,0,0,.48.48c.31,0,.51-.08.71-.45a2.09,2.09,0,0,1-.43,2.66,2.11,2.11,0,1,1-.31-3.4Z"></path>
              </svg>
        </div>
      </div>`;

      elements.alarms.insertAdjacentHTML('beforeend', alarmHtml);

     }
 
 }
 
};
