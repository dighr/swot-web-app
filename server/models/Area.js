var keystone = require("keystone");
var Types = keystone.Field.Types;

/**
 * Area Model
 * ==========
 */

var Area = new keystone.List("Area", { noedit: true });

Area.add({
	name: { type: Types.Text, required: true, index: true },
	code: { type: Types.Text, required: true, index: true, initial: true },
});

Area.relationship({ ref: "Response", path: "response", refPath: "area" });

Area.defaultColumns = "name";
Area.register();
