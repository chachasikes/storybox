export function vrlog(message) {
  var logVR = document.getElementById('debugger-log-vr');

  if (logVR !== undefined && logVR !== null) {
    try {
      let text = logVR.getAttribute('text');
      let textParsed = AFRAME.utils.styleParser.parse(text);
      if (textParsed !== undefined) {
        if (typeof message === 'object') {
          message = JSON.stringify(message);
        }
        message =  `${message} \n`;
        textParsed.value = `${textParsed.value}${message}`;
        if (typeof textParsed === 'object') {
          let logs =  textParsed.value.split('\n');
          let tailLogs = logs;
          if (logs.length > 3) {
            tailLogs = logs.slice(Math.max(logs.length - 6), logs.length);
          }
          let logString = tailLogs.join('\n');
          textParsed.value = logString;
          logVR.setAttribute('text', textParsed);
        }
      }
    } catch(err) {
      vrlog(err);
    }
  } else {
    window.VRLog.logQueue.push(message);
  }
}
