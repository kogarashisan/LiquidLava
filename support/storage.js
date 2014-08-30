
/** @enum {string} */
_eStorageItemTypes = {
	template_collection: 'template_collection',
	object_collection: 'object_collection',
	template_hash: 'template_hash',
	object_hash: 'object_hash',
	object: 'object'
};

/** @enum {string} */
_eStorageObjectTagType = {
	template: 'template',
	lava_type: 'lava_type'
};

_cStorageObjectPropertySchema = {

	/**
	 * @type {_eStorageObjectTagType}
	 */
	type: null,

	/**
	 * The name from Lava.types, when `type='lava_type'`
	 */
	type_name: null,

	/**
	 * when parsing sugar: the content of the properties may be either in tags or in attributes
	 */
	is_attribute: false

};

_cStorageItemSchema = {

	/** @type {_eStorageItemTypes} */
	type: null,

	/**
	 * In collections and hashes: tag name for item in collection.
	 */
	tag_name: '',

	/**
	 * Only for: object, object_collection and object_hash types.
	 * Key-value hash for object property descriptors.
	 * @type {Object.<string, _cStorageObjectPropertySchema>}
	 */
	properties: {}

};