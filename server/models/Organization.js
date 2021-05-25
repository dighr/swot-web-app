var keystone = require("keystone");
var Types = keystone.Field.Types;

/**
 * Organization Model
 * ==========
 */

var Organization = new keystone.List("Organization");

Organization.add({
	name: { type: String, required: true, index: true },
	responses: { type: Types.Relationship, ref: "Response", many: true },
	fieldsites: { type: Types.Relationship, ref: "Fieldsite", many: true },
	users: { type: Types.Relationship, ref: "User", many: true },
});

// Organization.relationship({
// 	ref: "User",
// 	path: "user",
// 	refPath: "managedOrganizations",
// });

Organization.defaultColumns = "name";
Organization.register();
