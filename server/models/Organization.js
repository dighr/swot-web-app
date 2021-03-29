var keystone = require("keystone");
var Types = keystone.Field.Types;

/**
 * Organization Model
 * ==========
 */

var Organization = new keystone.List("Organization");

Organization.add({
	name: { type: Types.Text, required: true, index: true },
	users: { type: Types.Relationship, ref: "User", many: true },
	responses: { type: Types.Relationship, ref: "Response", many: true },
});

Organization.defaultColumns = "name";
Organization.register();
