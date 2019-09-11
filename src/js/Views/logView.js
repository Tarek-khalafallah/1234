import { elements } from "./base";

export const addLog = log => {
    if(log)
    {
           var logText = log.LogText.substring(0, 55);
           if(log.LogText.length > 50) logText = logText + '...';
           var logHtml = `<div class="camera-alarms-tab" id="${log.id}">
           <div class="alarm-details-title">${logText}</div>
      </div>`;
   
         elements.logs.insertAdjacentHTML('afterbegin', logHtml);
    }
    
   };

   export const displayDetails = log => {
       if(log){
           
           // get the image 

           // clear the text div
           clearlogDetails();

           // add the text
           elements.logdetailsdiv.innerHTML = `<p>${log.LogText}</p>`
           //add the image


       }
   };

   export const clearlogDetails = () => {
    elements.logimagediv.innerHTML = '';
    elements.logdetailsdiv.innerHTML = '';
};