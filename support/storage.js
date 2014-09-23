
/** @enum {string} */
_eStorageItemTypes = {
	/** Storage item is array of templates */
	template_collection: 'template_collection',
	/** Item is array of objects with known structure */
	object_collection: 'object_collection',
	/** Item is [name] => template hash */
	template_hash: 'template_hash',
	/** Item is [name] => Object hash */
	object_hash: 'object_hash',
	/** One object with known structure */
	object: 'object'
};

/** @enum {string} */
_eStorageObjectTagType = {
	/** Tag from object contains template inside */
	template: 'template',
	/** Tag from object should be parsed by Lava.types */
	lava_type: 'lava_type'
};

_cStorageObjectPropertySchema = {

	/**
	 * @type {_eStorageObjectTagType}
	 */
	type: null,

	/**
	 * The name from Lava.types, when `type` is "lava_type"
	 * @type{string}
	 */
	type_name: null,

	/**
	 * When parsing sugar: the content of the properties may be either in tags or in attributes
	 * @type {boolean}
	 */
	is_attribute: false

};

_cStorageItemSchema = {

	/** @type {_eStorageItemTypes} */
	type: null,

	/**
	 * In collections and hashes: tag name for item in collection
	 * @type {string}
	 */
	tag_name: '',

	/**
	 * Only for object, object_collection and object_hash types.
	 * Key-value hash for object property descriptors
	 * @type {Object.<string, _cStorageObjectPropertySchema>}
	 */
	properties: {}

};