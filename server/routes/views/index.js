var path = require("path");
var keystone = require("keystone");

exports = module.exports = function (req, res) {
	const options = {
		root: path.join(__dirname, "../../../client/public"),
	};
	res.sendFile("index.html", options);
};
