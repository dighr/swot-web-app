var keystone = require("keystone");
var Types = keystone.Field.Types;

/**
 * Response Model
 * ==========
 */

var Response = new keystone.List("Response");

Response.add({
	name: { type: Types.Text, required: true, index: true },
	area: {
		type: Types.Relationship,
		required: true,
		index: true,
		ref: "Area",
		initial: true,
	},
	fieldsites: { type: Types.Relationship, ref: "Fieldsite", many: true },
});

// Response.relationship({ref: "User", path: "user", refPath: "managedCountries"});

Response.defaultColumns = "name";
Response.register();
