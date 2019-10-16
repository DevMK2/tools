const getFileFromURL = function(filename, url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET",url);
    xmlHttp.responseType='blob';
    xmlHttp.onload=function(){
        callback(filename, xmlHttp.response);
    }
    xmlHttp.send(null);
}

const saveFile_Chrome = function (fileName, content, mimeType='application/x-tar') {
    var blob = new Blob([content], { type: mimeType });
    objURL = window.URL.createObjectURL(blob);

    if (window.__Xr_objURL_forCreatingFile__) {
        window.URL.revokeObjectURL(window.__prev_objURL__);
    }
    window.__prev_objURL__= objURL;

    var a = document.createElement('a');

    a.download = fileName;
    a.href = objURL;
    a.click();
}

list = document.querySelectorAll('.cell.timemodified');
list.forEach( async file=> {
    studentName = file.parentElement.querySelector('.fullname').textContent.replace(/ /g,'_');
    alink = file.querySelector('a');
    if( alink !== null ) {
        getFileFromURL(studentName, alink.getAttribute('href'), saveFile_Chrome);
    }
});
