(function () {
    "use strict";
    
    var canvas, context, offset, result, repeat;
    
    
    // Basic function to add additional className to the body.
    function addBodyClass(className) {
        var body = document.body,
            str = body.className;
        
        body.className = str + (className || "");
    }
    
    
    // Checking mobile device capabilities.
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(window.navigator.userAgent) ) {
        addBodyClass("mobile");
    
    } else {
        addBodyClass("non-mobile");
    }
    
    
    // Generating random number within predefined range.
    function getRandom(min, max) {
        min = min || 1;
        max = max || 10;
        
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    
    // Generating lottery result based on random integers selection.
    function getResult() {
        var random = getRandom();
            
        if (random === 5 || random === 8) {
            return "Congrats, you won!";
        }
        
        return "Not lucky this time...";
    }
    
    
    // Getting offset of the element related to the document.
    function getOffset(el) {
        var box = { top: 0, left: 0 },
            doc = document.documentElement;
        
        if ( typeof el.getBoundingClientRect !== "undefined" ) {
            box = el.getBoundingClientRect();
        }
        
        return {
            top: box.top + window.pageYOffset - doc.clientTop,
            left: box.left + window.pageXOffset - doc.clientLeft
        };
    }
    
    
    // Simulating brush drawing with transparent color.
    function drawPoint(x, y) {
        var grid = context.createRadialGradient(x, y, 0, x, y, 50);
        
        grid.addColorStop(0, "rgba(255, 255, 255, .6)");
        grid.addColorStop(1, "transparent");
        context.fillStyle = grid;
        context.beginPath();
        context.arc(x, y, 50, 0, Math.PI * 2, true);
        context.fill();
        context.closePath();
    }
    
    
    // Building lottery ticket.
    function init() {
        var img = document.createElement("img");
        
        result = document.getElementById("r");
            
        canvas = document.getElementById("c");
        context = canvas.getContext("2d");
    
        img.onload = function() {
            context.beginPath();
            context.drawImage(img, 0, 0);
            context.closePath();
            context.globalCompositeOperation = "destination-out";
            
            offset = getOffset(canvas);
            
            // When image is covering result wrapper, printing result value underneath.
            result.innerText = getResult();
        };
        
        // Pushing image source inside to simulate 'onload' trigger.
        // Rending 5 images randomly to display different color schema hologram (just for fun).
        img.src = "img/hologram-0" + getRandom(1, 5) + ".jpg";
        
        // Tying 'touchstart' mobile device event to canvas container.
        canvas.addEventListener("touchstart", function (e) {
            drawPoint(e.touches[0].screenX - offset.left, e.touches[0].screenY - offset.top);
        }, false);
        
        
        // Tying 'touchmove' mobile device event to canvas container.
        canvas.addEventListener("touchmove", function (e) {
            
            // NOTE: We need to preventing default browser action for 'touchmove' event here.
            // If we don't do that, page is going to shake when simulating pencil move.
            e.preventDefault();
            
            drawPoint(e.touches[0].screenX - offset.left, e.touches[0].screenY - offset.top);
        }, false);
    }
    
    
    // Listening to mobile device 'orientationchange' event.
    document.addEventListener("orientationchange", function () {
        
        // Updating globally stored canvas offset position.
        offset = getOffset(canvas);
    }, false);
    
    
    // Removing iOS address bar right after page is loaded.
    window.addEventListener("load",function() {
        this.setTimeout(function () {
            window.scrollTo(0, 1);
        }, 0);
    });
    
    
    // Tying click event to repeat link.
    repeat = document.getElementById("a");
    repeat.href = window.location.href;
    repeat.addEventListener("click", function () {
        
        // Clear result to avoid any additional user thinking.
        result.innerText = "";
        
        // Refresh the page.
        window.location.reload();
    }, false);
    
    
    // Starting lottery ticket building process.
    init();

}());
