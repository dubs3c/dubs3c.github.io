
function ChangeOnMouseOver() {
    document.onmouseover = function(link) {
        
        if(link.target.nodeName != "A") {
            return;
        }

        if (link.target.text === undefined) {
            return;
        }

        if (link.target.className != "page-item" && link.target.className != "noleet") {
            original = link.target.text;
            link.target.text = link.target.text
            .replace(/s/gi, "5")
            .replace(/e/gi, "3")
            .replace(/l/gi, "1")
            .replace(/i/gi, "1")
            .replace(/t/gi, "7")
            .replace(/a/gi, "4")
            .replace(/o/gi, "0")
            .replace(/w/gi, "W")
            .replace(/n/gi, "N")
            .replace(/u/gi, "U")
            .replace(/r/gi, "R")
            .replace(/m/gi, "M")
            .replace(/\+/gi, "-");

            document.onmouseout = function(f) {
                if (original != "" && f.target.className != "noleet") {
                    f.target.text = original;
                }
            }
        }
    }
}

// Check if the DOM is ready
var ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
}

function MountListing(item) {
   var s = item.nextElementSibling;
   var clsList = s.classList;

   if (clsList.length > 0) {
        if (clsList[0] == "inner-text") {
            if (clsList.contains("hidden")) {
                clsList.remove("hidden");
                clsList.add("show");
            } else {
                clsList.remove("show");
                clsList.add("hidden");
            }
        }
    }
}
  
ready(() => {
    ChangeOnMouseOver();
    // this only runs on the /mnt/ page
    // can probably optimize further
    var x = document.getElementsByClassName("outer-header");
    if (x.length > 0) {
        for (let item of x) {
            item.onclick = function(){MountListing(item)};
        }
    }
});