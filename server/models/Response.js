var keystone = require("keystone");
var Types = keystone.Field.Types;

/**
 * Country Model
 * ==========
 */

var Response = new keystone.List("Response");

Response.add({
	name: { type: String, required: true, index: true },
	// TODO add autokey field for AREA
	projects: { type: Types.Relationship, ref: "Project", many: true },
	fieldsites: { type: Types.Relationship, ref: "Fieldsite", many: true },
});

Response.defaultColumns = "name";
Response.register();
