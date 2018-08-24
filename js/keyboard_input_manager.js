function KeyboardInputManager() {
  this.events = {};

  if (window.navigator.msPointerEnabled) {
    //Internet Explorer 10 style
    this.eventTouchstart    = "MSPointerDown";
    this.eventTouchmove     = "MSPointerMove";
    this.eventTouchend      = "MSPointerUp";
  } else {
    this.eventTouchstart    = "touchstart";
    this.eventTouchmove     = "touchmove";
    this.eventTouchend      = "touchend";
  }

  this.listen();
}

KeyboardInputManager.prototype.on = function(event, callback) {
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function(event, data) {
    var callbacks = this.events[event];
    if (callbacks) {
        callbacks.forEach(function(callback) {
            callback(data);
        });
    }
};

KeyboardInputManager.prototype.listen = function() {
    var self = this;
    var map = {};
    map[tvKey.KEY_UP] = 0;
    map[tvKey.KEY_RIGHT] = 1;
    map[tvKey.KEY_DOWN] = 2;
    map[tvKey.KEY_LEFT] = 3;

    // var map = {
    //     tvKey.KEY_UP: 0, // Up
    //     tvKey.KEY_RIGHT: 1, // Right
    //     tvKey.KEY_DOWN: 2, // Down
    //     tvKey.KEY_LEFT: 3, // Left
    // };

    // var samsungmap = {
    //     29460: 0, // Up
    //     5: 1, // Right
    //     29461: 2, // Down
    //     4: 3, // Left
    //     // tvKey.KEY_UP: 0, // Up
    //     // tvKey.KEY_RIGHT: 1, // Right
    //     // tvKey.KEY_DOWN: 2, // Down
    //     // tvKey.KEY_LEFT: 3, // Left
    // };

    document.addEventListener('keydown', function(event) {
       // Trace("CLC : event.which : " + event.which);
        //short-cut key to force win or lose just for test
        remoteKeydown(self, event);
    });

    // Respond to direction keys
    document.addEventListener("keydown", function(event) {
        //设置按键响应时间间隔
        if (!delay.Operation(500)) {
            return;
        }

       // Trace("CLC : event.which : " + event.which);
        console.log(event.keyCode);
        //if (event.which > 50000000) { //Touch mouse event
        if (event.keyCode > 50000000) {
           
           // var keyCode = event.which.toString();
            var keyCode = event.keyCode.toString();
            keyCode = keyCode.substring(0, 3);
            switch (keyCode) {
                case "503": //Left
                	Trace("CLC : Touch Left");
                    var mapped = map[tvKey.KEY_LEFT];
                    break;
                case "504": //Right
                	Trace("CLC : Touch Right");
                    var mapped = map[tvKey.KEY_RIGHT];
                    break;
                case "501": //Up
                	Trace("CLC : Touch Up");
                    var mapped = map[tvKey.KEY_UP];
                    break;
                case "502": //Down
                	Trace("CLC : Touch Down");
                    var mapped = map[tvKey.KEY_DOWN];
                    break;
            };
        } else {
            //var mapped = map[event.which];
            var mapped = map[event.keyCode];
        }

        // Ignore the event if it's happening in a text field
        if (self.targetIsInput(event)) return;

        if (mapped !== undefined) {
            event.preventDefault();
            self.emit("move", mapped);
        }
    });

    function remoteKeydown(self, event) {
    	//Trace("enter here?");
        //switch (event.which) {
        switch (event.keyCode) {
        
            // case tvKey.KEY_1:
            //     Trace("force win");
            //     self.emit("forceWin");
            //     //forceWin
            //     break;
            // case tvKey.KEY_0:
            //     Trace("force fail");
            //     self.emit("forceFail");
            //     break;
        
            case tvKey.KEY_RIGHT:
            	//Trace("enter there?");
                if (document.getElementsByClassName('game-won').length != 0) {
                    if ($('.restart-button').hasClass('active')) {
                        $('.restart-button').removeClass('active');
                        $('.keep-playing-button').addClass('active');
                    } else {
                        $('.keep-playing-button').removeClass('active');
                        $('.retry-button').addClass('active');
                    }

                } else if (document.getElementsByClassName('game-over').length != 0) {
                    $('.restart-button').removeClass('active');
                    $('.retry-button').addClass('active');
                }
                break;
            case tvKey.KEY_LEFT:
                if (document.getElementsByClassName('game-won').length != 0) {
                    if ($('.retry-button').hasClass('active')) {
                        $('.retry-button').removeClass('active');
                        $('.keep-playing-button').addClass('active');
                    } else {
                        $('.keep-playing-button').removeClass('active');
                        $('.restart-button').addClass('active');
                    }
                } else if (document.getElementsByClassName('game-over').length != 0) {
                    $('.retry-button').removeClass('active');
                    $('.restart-button').addClass('active');
                }
                break;
            case tvKey.KEY_ENTER:
                document.querySelector(".active").click();
                break;
        }
    }

    // Respond to button presses
    this.bindButtonPress(".retry-button", this.restart);
    this.bindButtonPress(".restart-button", this.restart);
    this.bindButtonPress(".keep-playing-button", this.keepPlaying);
	
	// Respond to swipe events
  var touchStartClientX, touchStartClientY;
  var gameContainer = document.getElementsByClassName("game-container")[0];

  gameContainer.addEventListener(this.eventTouchstart, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
        event.targetTouches.length > 1) {
      return; // Ignore if touching with more than 1 finger
    }

    if (window.navigator.msPointerEnabled) {
      touchStartClientX = event.pageX;
      touchStartClientY = event.pageY;
    } else {
      touchStartClientX = event.touches[0].clientX;
      touchStartClientY = event.touches[0].clientY;
    }

    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchmove, function (event) {
    console.log("eventTouchmove");
    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchend, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
        event.targetTouches.length > 0) {
      return; // Ignore if still touching with one or more fingers
    }

    var touchEndClientX, touchEndClientY;

    if (window.navigator.msPointerEnabled) {
      touchEndClientX = event.pageX;
      touchEndClientY = event.pageY;
    } else {
      touchEndClientX = event.changedTouches[0].clientX;
      touchEndClientY = event.changedTouches[0].clientY;
    }

    var dx = touchEndClientX - touchStartClientX;
    var absDx = Math.abs(dx);

    var dy = touchEndClientY - touchStartClientY;
    var absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
      // (right : left) : (down : up)
      self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
    }
  });
};

// KeyboardInputManager.prototype.move = function(direction) {
//     var i;
//     var activeIndex = getIndex.call(this);
//     Trace('activeIndex is ' + activeIndex);
//     if (direction === 'left') {
//         if (activeIndex != 0) {
//             $(this.buttonList[activeIndex]).removeClass('active');
//             activeIndex--;
//             $(this.buttonList[activeIndex]).addClass('active');
//         }
//     } else if (direction === 'right') {
//         if (activeIndex != 2) {
//             $(this.buttonList[activeIndex]).removeClass('active');
//             activeIndex++;
//             $(this.buttonList[activeIndex]).addClass('active');
//         }
//     }


//     function getIndex() {
//         for (i = 2; i >= 0; i--) {
//             Trace("this.buttonList[i] = " + this.buttonList[i].innerHTML);
//             Trace("document.getElementsByClassName('active')[0] = " + document.getElementsByClassName('active')[0].innerHTML);
//             if (this.buttonList[i] == document.getElementsByClassName('active')[0]) {
//                 return i;
//             } else {
//                 return 0;
//             }
//         };
//     }
// };

KeyboardInputManager.prototype.restart = function(event) {
    event.preventDefault();
    this.emit("restart");
};

KeyboardInputManager.prototype.keepPlaying = function(event) {
    event.preventDefault();
    this.emit("keepPlaying");
};

KeyboardInputManager.prototype.bindButtonPress = function(selector, fn) {
    var button = document.querySelector(selector);
    button.addEventListener("click", fn.bind(this));
    button.addEventListener(this.eventTouchend, fn.bind(this));
    button.addEventListener("click", function() {
        $('.active').removeClass('active');
        $('.restart-button').addClass('active');
    });
};

KeyboardInputManager.prototype.targetIsInput = function(event) {
    return event.target.tagName.toLowerCase() === "input";
};



var delay = {};
delay.InitTime = null;
delay.Operation = function(pTime) {
    if (delay.InitTime) {
        time_now = (new Date()).getTime();
        var flag = time_now - delay.InitTime > pTime ? true : false;
        if (flag) {
            //Trace("delay disable ^_^");
            //Trace("flag: " + flag);

            delay.InitTime = (new Date()).getTime();
        } else {
            //Trace("delay now!");
            //Trace("flag: " + flag);
        }
        return flag;
    } else {
        delay.InitTime = (new Date()).getTime();
        //Trace("delay.InitTime Init!");
        return true;
    }
};