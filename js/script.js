var Clock = Clock || {},
doc = document,
watch,
resume,
stopTime = 0,
isPaused = false,
timerRunning = false,
timerPaused = '', //string is empty if not paused
flagWatch = false,
startTimer,
secondInterval,
timerClock;

Clock = {
	/****
		STOP WATCH
	****/
	stopwatch : function(){
		var startDate = new Date(),
		startTime = startDate.getTime();

	if (flagWatch) { //Pause the watch, change button and flags
			startpause.innerHTML = 'Resume';
			flagWatch = false;
			isPaused = true;
		}
		else { //start the stopwatch and change button
		startpause.innerHTML = 'Pause';
		flagWatch = true;
		Clock.startStopwatch(startTime);

		}

	},
	startStopwatch : function(startTime) {
		var ts, sec, min;
		watch = doc.getElementById("stopwatch");
		var curTime = new Date(),
		timeDiff = curTime.getTime() - startTime;

		//if paused keep record of moment it got paused
		if(isPaused) {
			timeDiff = timeDiff + stopTime;
		}

		if(flagWatch) {
			tsec = Math.floor(timeDiff/100) + '';
			sec = Math.floor(timeDiff/1000);
			min = Math.floor(timeDiff/60000);

			tsec = tsec.charAt(tsec.length - 1); //grab only the first digit of tenthseconds

			if(min >= 60) {
				Clock.stopwatch(); //stop Stop Watch at 60 minutes
			}

			sec = sec - 60 * min; //keep seconds to 60 in one minute

			time = Clock.pad(min) + ":" + Clock.pad(sec) + ":" + tsec;
			watch.innerHTML = time;

			resume = setTimeout('Clock.startStopwatch(' + startTime + ');', 10);
		}

		//stop the Watch 
		else {
			clearTimeout(resume);
			stopTime = timeDiff; //keep record of stopped time
		}
	},

	resetWatch : function() {
		stopTime = 0;
		isPaused = false;
		clearTimeout(resume);

		//if Stop Watch is still running..
		if(flagWatch){
			var resetdate = new Date();
			var resettime = resetdate.getTime();
			Clock.startStopwatch(resettime);
		}
		//if it is paused then reset everything
		else {
			watch.innerHTML = "00:00:0";
			startpause.innerHTML = 'Start';
		}

	},

	/******
		Timer 
	*******/

	timer : function(hms){
		timerClock = doc.getElementById('timer');
		startTimer = doc.getElementById("start-timer");
		startTimer.parentNode.className = startTimer.parentNode.className + " active";
		startTimer.innerHTML = "Stop";
		timerRunning = true;

		for (var i=0, len = hms.length; i < len; i++) {
			hms[i] = Clock.pad(parseInt(hms[i], 10));
		}

		timerClock.innerHTML = hms.join(":");

		secondInterval = setInterval(function(){
			var th = parseInt(hms[0], 10),
			tm = parseInt(hms[1], 10),
			ts = parseInt(hms[2], 10);

				if (ts === 0) { //seconds reach 0
					if (tm > 0 || th > 0) { //if minutes or hours over 0

						if (th > 0) {  //if hours over 0
								hms[0]--;
								hms[1] = 60;
						}

						else { // if hours is at Zero

							if (tm === 0) {
								hms[1] = 59;
							}
							hms[0] = 0;
						}

						hms[2] = 59;
						hms[1]--;


					}

					else { //stop timer if reaches 00:00:00
						clearInterval(secondInterval);
						startTimer.parentNode.className = "";
						timerRunning = false;
						timerPaused = '';
						doc.body.className = doc.body.className + " alarm";
					}
				}

				else {
					hms[2]--;
				}

			for (var i=0, len = hms.length; i < len; i++) {
				hms[i] = Clock.pad(parseInt(hms[i], 10));
			}

			timerClock.innerHTML = hms.join(":");
		}, 1000);
	},

	//Restart and Stop button
	timerRestart : function() {
		startTimer.innerHTML = "Restart";
		clearInterval(secondInterval);
		timerRunning = false;
		timerPaused = timerClock.innerHTML; //keep record of when it paused
	},

	//resets timer and everything back to default
	timerReset : function() {
		timerRunning = false;
		timerPaused = '';
		startTimer.innerHTML = "Start";
		startTimer.parentNode.className = " ";
		timerClock.innerHTML = "00:00:00";
		clearInterval(secondInterval);
	},

	validate : function() {
		var	h = doc.getElementById('hour'),
			m = doc.getElementById('minute'),
			s = doc.getElementById('second'),

			timerHours = h.value,
			timerMinutes = m.value,
			timerSeconds = s.value;

		/* clear error boxes */
		h.className = "";
		m.className = "";
		s.className = "";

		//simple check if not a number or empty string
		if(isNaN(timerHours) || timerHours === "") {
			return Clock.setError(h);
		}

		if(isNaN(timerMinutes) || timerMinutes === "") {
			return Clock.setError(m);
		}

		if(isNaN(timerSeconds) || timerSeconds === "") {
			return Clock.setError(s);
		}

		//everything passed, set up array and ready to be used
		var timerTime = [timerHours, timerMinutes, timerSeconds];
		h.value = 'hr';
		m.value = 'min';
		s.value = 'sec';

		return timerTime;

	},

	//do not allows numbers over 59
	setMax : function(el){
		if(el.value > 59){
			el.value = 59;
		}
	},

	//if single digit number add leading 0. (9 becomes 09)
	pad : function(x){
		return x < 10 ? '0' + x : x;
	},

	//set styles and change html when errors occur
	setError : function(o){
		o.className = "error";
		o.value = "Enter Number";
		o.onfocus = function(){o.className ="";};
		return false;
	},

	/********
	Current Time
	**********/

	ticktock : function(){
		var clock = doc.getElementById("clock");

		//set clock's current time
		currentTime = Clock.getCurrentTime();
		clock.innerHTML = currentTime;

		//run clock every second
		setInterval(function(){
		currentTime = Clock.getCurrentTime();
		clock.innerHTML = currentTime;
		}, 1000);
	},

	//returns joined array of hr:min:sec of current Time
	getCurrentTime : function() {
		var d = new Date(),
		h = Clock.pad(d.getHours()),
		m = Clock.pad(d.getMinutes()),
		s = Clock.pad(d.getSeconds()),
		now = [h, m, s];
		return now.join(":");
	},

	init : function(){

		Clock.ticktock();

		var minuteTimer = doc.getElementById('minute'),
		secondTimer = doc.getElementById('second');


		EventUtil.addEventHandler(doc, 'click', function(){
			var e = EventUtil.getEvent(),
			targ = e.target.id;

			switch(targ) {
				case 'startpause':
					Clock.stopwatch();
				break;
				case 'reset':
					Clock.resetWatch();
				break;
				case 'timerReset':
					Clock.timerReset();
				break;
				case 'start-timer':
					if(timerRunning) { //pause if Timer is running
						Clock.timerRestart();
					}
					else {

						//if it was paused, Restart timer passing the stored time
						if (timerPaused !== '') {
							Clock.timer([timerPaused.substring(0, 2), timerPaused.substring(3,5), timerPaused.substring(6, timerPaused.length)]);
						}

						//it wasn't paused so start Timer with new values
						else {
							doc.body.className = '';
							var timerSet = Clock.validate();

							if(timerSet) { //run timer if it passes validation
								Clock.timer(timerSet);
							}
						}
					}
				break;

			}
		});

		minuteTimer.onblur = function() {
			Clock.setMax(minuteTimer);
		};

		secondTimer.onblur = function() {
			Clock.setMax(secondTimer);
		};
	}
};


r(Clock.init);


function r(f){/in/.test(doc.readyState)?setTimeout('r('+f+')',9):f();}