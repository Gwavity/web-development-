var category = false;
var channelsSize = 0;
var originalIMG = null;
function openButtons(button) {
    category = !category;
    if(!originalIMG) {
        originalIMG = button.children[0].src
    }
    const buttons = document.getElementById("buttons");
    const channelChildren = buttons.childElementCount;
    let height = 50 * channelChildren;
    height += 5 * channelChildren;

    if(category) {
        button.children[0].src = "images/Close Arrow.png"
        channelsSize = buttons.style.height;
        buttons.style.display = "block";
        buttons.style.height = `${height}px`;
        buttons.style.backgroundColor = "#363636";
    } else {
        button.children[0].src = originalIMG
        buttons.style.display = "none";
        buttons.style.height = channelsSize;
    }
}
