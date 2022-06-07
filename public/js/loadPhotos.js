/**
 * Change the function that is assigned to the onclick
 * attribute of the button element.
 * NOTE: for the 25 gif version, you will need to disable the
 * same origin policy for file:// objects. The request will be
 * blocked by the browser for security reasons.
 * For Firefox you can type about:config in the URL bar, then search for security.file and toggle the value to false.
 *
 *
 */
window.onload = multipleGifsAjax;

var imageCount = 0;

function getImageCount() {
    return imageCount;
}

function imageCounter(div) {
    let name = document.createElement("p");
    let counter = document.createElement("p");
    name.innerHTML = "Images Left";
    counter.innerHTML = getImageCount().toString();
    name.setAttribute("id", "title");
    counter.setAttribute("id", "counter")
    div.appendChild(name);
    div.appendChild(counter);
}

function imagesLeft(value) {
    if (value == 0) {
        let div = document.getElementById('counter');
        div.innerHTML = getImageCount().toString();
        console.log(getImageCount().toString());
    }
}

function imageDecrement(id) {
    imageCount--;
    fadeImage(id);
    imagesLeft(0);
    let elem = document.getElementById(id);
    elem.parentNode.removeChild(elem);
}

function imageIncrement() {
    imageCount++;
}

function fade(element) {
    let op = 1;  // initial opacity
    let timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function fadeImage(id) {
    let elem = document.getElementById(id);
    fade(elem);
}

function multipleGifsAjax(ev) {
    function buildImageDiv(titleSource, imgLink, imgId) {
        let div = document.createElement('div');
        let img = document.createElement('img');
        img.src = imgLink;
        img.width = "200";
        img.height = "200";
        div.setAttribute("id", imgId);
        div.appendChild(img);
        div.setAttribute("onClick", 'imageDecrement(' + imgId + ',' + "document.getElementById('counter')" + ');');
        return div;
    }

    /*function buildTitleDiv(titleSource){
        let div = document.createElement('div');
        let title = document.createElement('p');
        div.innerHTML = "class = 'title'"
        title.innerHTML = titleSource;
        div.appendChild(title)
        return div;
    }*/
    ev.preventDefault();
    var url = "https://jsonplaceholder.typicode.com/albums/2/photos";
    if (window.offset) {
        url = url.replace("{offset}", "&offset=" + window.offset);
    } else {
        url = url.replace("{offset}", "");
    }
    var ajaxcall = new XMLHttpRequest();
    ajaxcall.onload = function () {
        if (this.readyState === this.DONE) {
            console.log('success...');
            var resp = JSON.parse(this.responseText);
            let gifs = resp;
            var div = document.getElementById("gif-storage");
            [...gifs].forEach((gif) => {
                //console.log(gif.images['downsized_large'].url);
                //div.appendChild(buildTitleDiv(gif.title))
                div.appendChild(buildImageDiv(gif.title, gif.url, gif.id));
                imageIncrement();
            });
            imageCounter(div2);
        }
    }
    ajaxcall.onerror = function () {
        console.log('error...');
    }
    ajaxcall.open('GET', url, true);
    ajaxcall.send();
}
