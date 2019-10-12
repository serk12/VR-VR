function amplitudeRadio2angle(x) {
	if (x == 1) return 0;
	else return 2 * Math.atan((-1 * Math.sqrt(2) * Math.sqrt(x * x + 1) + x + 1) / (x - 1));
}

function rad2unit(x) {
	return (x * 180 / Math.PI) / 45;
}

function calculate_angle(decoded) {
	let ratio = 1e9;
	let length = decoded.length
	if (decoded.channels.length > 1) {
		var sum = 0.0;
		var count = 0;
		for (var i = 0; i < length; i++) {
			if (decoded.channels[1][i] != 0)
				sum += (decoded.channels[0][i] / decoded.channels[1][i]);
			else count++;
		}
		ratio = sum / (length - count);
	}
	var c = 343;
	var angle = rad2unit(amplitudeRadio2angle(ratio));
	var dt = 0.18 * Math.cos(angle) / c;
	var coci = (2 * (dt * c) * (dt * c) * (ratio * ratio + 1));
	var div = (ratio - 1) * (ratio - 1);
	var r = 0.5 * Math.sqrt(coci / div);
	console.log(r);
	console.log(angle);
}

var request = new AudioFileRequest('./resources/rocket_LR.wav');
request.onSuccess = calculate_angle;
request.send();