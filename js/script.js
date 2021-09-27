/*============================= HEX to HSL =============================*/
function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    
    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h, s, l];
}
/*============================= HSL to HEX =============================*/
function HSLToHex(h,s,l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0, 
        b = 0; 

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    // Prepend 0s, if necessary
    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b;
}
/*============================= Color variations =============================*/
function changeColor(color,n){
    let hsl = hexToHSL(color);
    switch (n){
        case 1:
            hsl[1] = hsl[1] + (100 - hsl[1]) * 0.05 // S +5%
            hsl[2] = hsl[2] + (100 - hsl[2]) * 0.15  // L +15%
            break;
        case 2:
            hsl[1] = hsl[1] + (100 - hsl[1]) * 0.10 // S +10%
            hsl[2] = hsl[2] + (100 - hsl[2]) * 0.25  // L +25%
            break;
        case 3:
            hsl[1] = hsl[1] + (100 - hsl[1]) * 0.15 // S +30%
            hsl[2] = hsl[2] + (100 - hsl[2]) * 0.35  // L +30%
            break;
        case -1:
            hsl[2] = hsl[2] + hsl[2] * (-0.2)  // L -20%
            break;
        case -2:
            hsl[2] = hsl[2] + hsl[2] * (-0.4)  // L -40%
            break;
        case -3:
            hsl[2] = hsl[2] + hsl[2] * (-0.6)  // L -60%
            break;
        default:
            console.log("No color change");
    }
    return HSLToHex(hsl[0],hsl[1],hsl[2])
}
/*============================= Color object =============================*/
class Color {
    constructor(mainValue){
        this.darker3 = changeColor(mainValue,-3);
        this.darker2 = changeColor(mainValue,-2);
        this.darker1 = changeColor(mainValue,-1);
        this.mainValue = mainValue;
        this.brighter1 = changeColor(mainValue,1);
        this.brighter2 = changeColor(mainValue,2);
        this.brighter3 = changeColor(mainValue,3);
    }
};
/*============================= Objects vector =============================*/
let colors = [];
/*============================= InnerDivCreator =============================*/
function addColorBox(parentDiv, colorValue){
    var innerDiv = document.createElement('div');
    innerDiv.style = "background:"+colorValue+";";
    innerDiv.className = 'colorbox';
    innerDiv.innerHTML = '<p onclick="copyColor(this)">'+colorValue+"</p>";
    parentDiv.appendChild(innerDiv);
}
/*============================= ColorDivCreator =============================*/
function addColorPallete(vectorColorsIndex){
    var div = document.createElement('div');
    div.className = 'color';
    document.getElementById('container').appendChild(div);

    var divdelete = document.createElement('div'); 
    divdelete.className = 'delete';
    divdelete.setAttribute('onclick','deleteColor(this,"'+colors[vectorColorsIndex].mainValue+'")')
    divdelete.innerHTML = "<p>&times;</p>";
    div.appendChild(divdelete);

    addColorBox(div,colors[vectorColorsIndex].darker3);
    addColorBox(div,colors[vectorColorsIndex].darker2);
    addColorBox(div,colors[vectorColorsIndex].darker1);
    addColorBox(div,colors[vectorColorsIndex].mainValue);
    addColorBox(div,colors[vectorColorsIndex].brighter1);
    addColorBox(div,colors[vectorColorsIndex].brighter2);
    addColorBox(div,colors[vectorColorsIndex].brighter3);
}
/*============================= LoadColorsVector =============================*/
function loadColors(){
    for (i = 0; i < colors.length; i++) {
        addColorPallete(i);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    loadColors()
}, false);
/*============================= CopyHexValueOnClick =============================*/
function copyColor(element){
    navigator.clipboard.writeText(element.innerHTML);
}
/*============================= AddNewColor =============================*/
function addColor(){
    let value = document.getElementById('coloradd').value;

    // If color is in vector dont add it
    if (colors.some(e => e.mainValue === value)) {
        return
    }

    // Add to the vector and display
    colors.push(new Color(value))
    localStorage.setItem('storedColors', JSON.stringify(colors));
    addColorPallete(colors.length - 1);
}
/*======================== DeleteColorAndDontShow ========================*/
function deleteColor(e,mainV){
    e.parentElement.remove();
    let objFound = colors.findIndex(element => element.mainValue === mainV);
    if (objFound != -1) {
        colors.splice(objFound, 1);
        localStorage.setItem('storedColors', JSON.stringify(colors));
    }
}
/*======================== DownloadYourColors ========================*/
function downloadJSON() {
    let filename = "ColorShadesList.json";
    let contentType = "application/json;charset=utf-8;";
    let objectData = colors;

    var a = document.createElement('a');
    a.download = filename;
    a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(objectData, null, 4));
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
/*======================== UploadColorsAndDisplay ========================*/
function clearContainer(){
    var myDiv = document.getElementById("container");
    myDiv.innerHTML = "";
}

document.getElementById('selectFile').oninput = function() {
    var file = document.getElementById('selectFile').files;
    if (file.length <= 0) {
        return false;
    }
    for (j = 0; j < file.length; j++) {
        if (file[j].type == "text/plain") {
            var reader = new FileReader();
            reader.onload = function(e) {
                var result = e.target.result.split(/\r?\n/);
                for (i = 0; i < result.length; i++) {
                    //If the line have a hex color
                    if (result[i].match(/^#([0-9a-f]{6})$/i)){
                        // Only add if is a new color
                        if (!colors.some(e => e.mainValue === result[i])) {
                            colors.push(new Color(result[i]));
                            localStorage.setItem('storedColors', JSON.stringify(colors));
                        }
                    }
                }
                clearContainer();
                loadColors();
                document.getElementById('selectFile').value = "";
            }
            reader.readAsText(file.item(j));
        } else {
            if (file[j].type == "application/json") {
                var fr = new FileReader();
                fr.onload = function(e) {
                    var result = JSON.parse(e.target.result);
                    for (i = 0; i < result.length; i++) {
                        // Only add if is a new color
                        if (!colors.some(e => e.mainValue === result[i].mainValue)) {
                            colors.push(result[i]);
                            localStorage.setItem('storedColors', JSON.stringify(colors));
                        }
                    }
                    clearContainer();
                    loadColors();
                    document.getElementById('selectFile').value = "";
                }
                fr.readAsText(file.item(j));
            } else {
                console.log("Can't upload " + file[j].type + " file, is not compatible.")
            }
        }
    }
};
/*============================= CloseInfo =============================*/
var infobox = document.getElementsByClassName("info")[0];
var infoclose = document.getElementsByClassName("info--close")[0];
var infoopen = document.getElementById("info--open");
infoclose.onclick = function() {
    infobox.style.display = "none";
    infoopen.style.visibility = "visible";
}
infoopen.onclick = function() {
    infobox.style.display = "block";
    infoopen.style.visibility = "hidden";
}
/*============================= DeleteAll =============================*/
function clearColors(){
    var x = document.getElementsByClassName('delete');
    for (i = x.length - 1; i >= 0; i--) {
        x[i].click();
    }
}
/*============================= LocalStorage =============================*/
if (localStorage.getItem('firstVisit') == undefined){
    localStorage.setItem('firstVisit', 1);
    // Colors examples
    colors.push(new Color("#c93131"));
    colors.push(new Color("#c93166"));
    colors.push(new Color("#94388c"));
    colors.push(new Color("#7f32A9"));
    colors.push(new Color("#4b53c7"));
    colors.push(new Color("#53b5c2"));
    colors.push(new Color("#51c282"));
    colors.push(new Color("#7ec251"));
    colors.push(new Color("#c0c251"));
    colors.push(new Color("#cf934f"));
    localStorage.setItem('storedColors', JSON.stringify(colors));
} else {
    colors = JSON.parse(localStorage.getItem('storedColors'));
    infobox.style.display = "none";
    infoopen.style.visibility = "visible";
}