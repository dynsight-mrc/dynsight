// Start admin site

/// load libraries
var fs = require("fs");

if (!fs.existsSync("node_modules")) {
	console.log("Error: node_modules directory not found: run npm install first");
	process.exit(1);
}

if (Number(process.version.match(/^v(\d+\.\d+)/)[1]) < 10) {
	console.log("Error: Nodejs version must be at least 10.0");
	process.exit(1);
}

var exec = function(cmd) {
	return require('child_process').execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore']}).toString();
};

var express = require("express");
var cookieParser = require('cookie-parser');
var compression = null;
var I18n = require("i18n-2");
var expressWS = null;
var expressWs = null;
try {
	expressWS = require('express-ws');
} catch (e) {
	console.log("Warning: Dependency 'express-ws' not found.");
}
try {
	compression = require("compression");
} catch (e) {
	console.log("Warning: Dependency 'compression' not found.");
}
/// initialize modules from install
if (!fs.existsSync('./modules')) {
	exec("cp -Rf ./install/* ./");
	var utility = require("./modules/utility/module.js");
	utility.set("local", "autoUpdate", 1);
}

/// initialize
var base = null;
var sessions = {};
var wsSessions = {};

// WS options for compression
var wsOptions = {
	perMessageDeflate: {
		zlibDeflateOptions: {
			// See zlib defaults.
			chunkSize: 1024,
			memLevel: 7,
			level: 3
		},
		zlibInflateOptions: {
			chunkSize: 10 * 1024
		},
		// Other options settable:
		clientNoContextTakeover: true, // Defaults to negotiated value.
		serverNoContextTakeover: true, // Defaults to negotiated value.
		serverMaxWindowBits: 10, // Defaults to negotiated value.
		// Below options specified as default values.
		concurrencyLimit: 10, // Limits zlib concurrency for perf.
		threshold: 1024 // Size (in bytes) below which messages should not be compressed.
	}
};

var app = express();
if (expressWS)
	expressWs = expressWS(app, null, {wsOptions: wsOptions});

/// reload
exports.reloadLibs = function () {
	base = require("./modules/base/module.js");
	I18n.localeCache = {};
};

/// Get Sessions object
exports.getSessions = function () {
	return sessions;
};

/// Fetch session
exports.getSession = function (sid, ip) {
	var utility = require("./modules/utility/module.js");
	if (typeof sessions[sid] != "undefined" && (sessions[sid].ip == ip || (sessions[sid].hash && (new Date).getTime() / 1000 - parseInt(utility.unxor(sessions[sid].hash, utility.sk)) < 60))) {
		sessions[sid].lastAccess = parseInt((new Date()).getTime() / 1000);
		return sessions[sid];
	}
	return null;
};

/// Get Sessions object
exports.deleteSession = function (sid) {
	if (typeof wsSessions[sid] != "undefined") {
		delete wsSessions[sid];
	}
	if (typeof sessions[sid] != "undefined") {
		delete sessions[sid];
		return true;
	}

	return false;
};

/// Get Sessions object
exports.getWSSessions = function () {
	return wsSessions;
};

// get ws session
exports.getWSSession = function(sid) {
	//console.log("WS", sid, wsSessions[sid], wsSessions[sid].ws.sid, sessions[sid], sessions);
	if (sid && wsSessions[sid] && wsSessions[sid].ws[0].sid == sid && sessions[sid]) {
		sessions[sid].lastAccess = parseInt((new Date()).getTime() / 1000);
		return sessions[sid];
	}
	return false;
};

/// Local admin site server
module.exports.reloadLibs();

var host = "localhost";
var port = 8080;

if (process.argv.length > 3) {
	host = process.argv[process.argv.length - 2];
	port = process.argv[process.argv.length - 1];
}

I18n.expressBind(app, {
	extension: ".json",
	locales: ['en', 'ru', 'es'],
	cookieName: 'locale',
	devMode: false
});
app.use(cookieParser());
app.use(express.json());
app.set("view options", {layout: false});
if (compression)
	app.use(compression());
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use(function(req, res, next) {
	req.i18n.setLocaleFromCookie();
	return next();
});

app.post("*", function (req, res) {
	base.processPostRequest(req, res);
});

app.get(/^(?!\/ws)/, function (req, res) {
	base.processGetRequest(req, res);
});

// WS connection
if (expressWs)
	app.ws('/ws', function(ws, req) {
		ws.on('error', function(e) {console.log("ws error", e.name);});
		ws.on('message', function(msg) {
			base.processWSRequest(ws, msg);
		});
	});

process.on('uncaughtException', function(err) {
	if (err.errno === 'EADDRINUSE')
		console.log("Error: Wialon Local Nodejs is already started: host " + host + " and port " + port + " are already in use.");
	else
		console.log(err);
	process.exit(1);
});


var stop = function() {
	try {
		backupSessions();
	} catch (e) {
		console.log("There were problems during sessions backup", e);
	}
	process.exit(2);
};

exports.stop = stop;

function backupSessions() {
	var utility = require("./modules/utility/module.js");
	var sess = utility.xor(JSON.stringify(module.exports.getSessions()), "wl");
	var tm = utility.xor((new Date()).getTime() + "", "wl");
	fs.writeFileSync("./tmp/wlss", tm + "\n" + sess /*+ "\n" + wsSess*/);
}
function restoreSessions() {
	if (!fs.existsSync("./tmp") || !fs.existsSync("./tmp/wlss"))
		return;
	var utility = require("./modules/utility/module.js");
	var data = fs.readFileSync("./tmp/wlss", "utf8").split("\n");
	fs.unlinkSync("./tmp/wlss");
	if (!data || !data.length || data.length < 2)
		return;
	var tm = parseInt(utility.unxor(data[0] || "", "wl"));
	var sess = utility.unxor(data[1] || "", "wl");
	if (isNaN(tm) || !tm || tm + 300000 < (new Date()).getTime())
		return;
	try {
		sess = JSON.parse(sess);
		sessions = sess;
	} catch (e) {
		console.log("There were problems during sessions restoring");
	}
}

process.once('SIGTERM', function (code) {
	module.exports.stop();
});

restoreSessions();

/// spin up server
app.listen(port, host);
