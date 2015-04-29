
(function(){
	Lava.ClassManager.registerRootNamespace('Lava', Lava);

	// separate everything for better gzip compression
	var c = [
	function() {
this.isObservable = true;
this._listeners = {};
},
	function() {
this.isProperties = true;
this._properties = {};
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isRefreshable = true;
this.level = 0;
this._refresh_ticket = null;
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this._value = null;
this.isObservable = true;
this._listeners = {};
},
	function() {
this.property_name = null;
this.from = 0;
this.delta = 0;
this.unit = null;
this.init.apply(this, arguments);
},
	function() {
this.property_name = null;
this.from = null;
this.to = null;
this.delta = null;
this.init.apply(this, arguments);
},
	function() {
this._started_time = 0;
this._end_time = 0;
this._duration = 0;
this._target = null;
this._is_running = false;
this._is_reversed = false;
this._config = null;
this._transition = null;
this.guid = null;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._percent = 0;
this._animators = [];
this._started_time = 0;
this._end_time = 0;
this._duration = 0;
this._target = null;
this._is_running = false;
this._is_reversed = false;
this._config = null;
this._transition = null;
this.guid = null;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._property = "height";
this.DURATION_BIAS = 200;
this._percent = 0;
this._animators = [];
this._started_time = 0;
this._end_time = 0;
this._duration = 0;
this._target = null;
this._is_running = false;
this._is_reversed = false;
this._config = null;
this._transition = null;
this.guid = null;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._percent = 0;
this._animators = [];
this._started_time = 0;
this._end_time = 0;
this._duration = 0;
this._target = null;
this._is_running = false;
this._is_reversed = false;
this._config = null;
this._transition = null;
this.guid = null;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isEmulated = true;
this._timeout = null;
this._started_time = 0;
this._end_time = 0;
this._duration = 0;
this._target = null;
this._is_running = false;
this._is_reversed = false;
this._config = null;
this._transition = null;
this.guid = null;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._duration = 350;
this._property = "height";
this._property_value = 0;
this.isEmulated = true;
this._timeout = null;
this._started_time = 0;
this._end_time = 0;
this._target = null;
this._is_running = false;
this._is_reversed = false;
this._config = null;
this._transition = null;
this.guid = null;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._check_property_names = true;
this._pad = "\t";
this.init.apply(this, arguments);
},
	function() {
this.isCollection = true;
this._data_uids = [];
this._data_values = [];
this._data_names = [];
this._count = 0;
this.guid = null;
this.isProperties = true;
this._properties = {};
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isEnumerable = true;
this._uid = 1;
this.isCollection = true;
this._data_uids = [];
this._data_values = [];
this._data_names = [];
this._count = 0;
this.guid = null;
this.isProperties = true;
this._properties = {};
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isDataView = true;
this._data_source = null;
this.isCollection = true;
this._data_uids = [];
this._data_values = [];
this._data_names = [];
this._count = 0;
this.guid = null;
this.isProperties = true;
this._properties = {};
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isTemplate = true;
this._widget = null;
this._parent_view = null;
this._config = null;
this._count = 0;
this._content = [];
this._is_inDOM = false;
this.guid = null;
this.init.apply(this, arguments);
},
	function() {
this._dirty_views = [];
this._is_refreshing = false;
this._views_by_id = {};
this._views_by_guid = {};
this._global_role_targets = {};
this._global_event_targets = {};
this._old_mouseover_target = null;
this._old_mouseover_view_stack = [];
this._new_mouseover_target = null;
this._new_mouseover_view_stack = [];
this._event_usage_counters = {};
this._events_listeners = {
	mouseover: null,
	mouseout: null
};
this._cancel_bubble = false;
this._nested_dispatch_count = 0;
this._refresh_id = 0;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._modules = {};
this.isObservable = true;
this._listeners = {};
},
	function() {
this._root_map = {
	include: "_parseInclude",
	storage: "_parseStorage",
	union: "_parseUnion",
	storage_object: "_parseStorageObject"
};
this._union_handlers = {
	include: "_parseInclude"
};
this._root_attributes_handlers = {
	expressions_option: "_parseRootExpressionsOptionAttribute",
	targets_option: "_parseRootTargetsOptionAttribute",
	property: "_parseRootPropertyAttribute",
	"switch": "_parseRootSwitchAttribute",
	option: "_parseRootOptionAttribute",
	id: "_parseRootIdAttribute"
};
},
	function() {
this._mouseover_stack_changed_listener = null;
this._tooltip_target = null;
this._attribute_name = "data-tooltip";
this._mousemove_listener = null;
this._tooltip = null;
this.DEFAULT_TOOLTIP_WIDGET = "Tooltip";
},
	function() {
this._focused_element = null;
this._focus_target = null;
this._focus_acquired_listener = null;
this._focus_lost_listener = null;
this._focus_listener = null;
this._blur_listener = null;
this.isObservable = true;
this._listeners = {};
},
	function() {
this._name = null;
this._module = null;
this._config = null;
this._properties_by_guid = null;
this._is_nullable = false;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._default = null;
this._name = null;
this._module = null;
this._config = null;
this._properties_by_guid = null;
this._is_nullable = false;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isCollectionField = true;
this._target_module = null;
this._target_record_field_name = null;
this._target_record_field = null;
this._record_removed_listener = null;
this._record_added_listener = null;
this._collections_by_record_guid = {};
this._collection_listeners_by_guid = {};
this._collection_guid_to_record = {};
this._name = null;
this._module = null;
this._config = null;
this._properties_by_guid = null;
this._is_nullable = false;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._default = null;
this._name = null;
this._module = null;
this._config = null;
this._properties_by_guid = null;
this._is_nullable = false;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._is_nullable = true;
this._name = null;
this._module = null;
this._config = null;
this._properties_by_guid = null;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isForeignKey = true;
this._collections_by_foreign_id = {};
this._default = 0;
this._name = null;
this._module = null;
this._config = null;
this._properties_by_guid = null;
this._is_nullable = false;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isRecordField = true;
this._referenced_module = null;
this._collections_by_foreign_guid = {};
this._foreign_key_field_name = null;
this._foreign_key_field = null;
this._foreign_key_changed_listener = null;
this._external_id_field = null;
this._external_id_changed_listener = null;
this._external_records_loaded_listener = null;
this.EMPTY_FOREIGN_ID = 0;
this._is_nullable = true;
this._name = null;
this._module = null;
this._config = null;
this._properties_by_guid = null;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._default = false;
this._name = null;
this._module = null;
this._config = null;
this._properties_by_guid = null;
this._is_nullable = false;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._name = null;
this._module = null;
this._config = null;
this._properties_by_guid = null;
this._is_nullable = false;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._config = null;
this._fields = {};
this._records = [];
this._records_by_guid = {};
this._properties_by_guid = {};
this._record_constructor = null;
this.isObservable = true;
this._listeners = {};
},
	function() {
this._app = null;
this._name = null;
this._records_by_id = {};
this._has_id = false;
this._config = null;
this._fields = {};
this._records = [];
this._records_by_guid = {};
this._properties_by_guid = {};
this._record_constructor = null;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isRecord = true;
this._properties = null;
this._module = null;
this._fields = null;
this.guid = null;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isMetaRecord = true;
this.ext_guid = 0;
this._original_record = null;
this.isRecord = true;
this._properties = null;
this._module = null;
this._fields = null;
this.guid = null;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._config = null;
this._fields = {};
this._records = [];
this._records_by_guid = {};
this._properties_by_guid = {};
this._record_constructor = null;
this.isObservable = true;
this._listeners = {};
this.isProperties = true;
this._properties = {};
this._property_listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isValueContainer = true;
this._data_bindings_by_property = {};
this._data_segments = {};
this.isRefreshable = true;
this.level = 0;
this._refresh_ticket = null;
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this._value = null;
this.isObservable = true;
this._listeners = {};
},
	function() {
this.isValueContainer = true;
this._view = null;
this._widget = null;
this._evaluator = null;
this.guid = null;
this._binds = [];
this._binds_count = 0;
this._bind_changed_listeners = [];
this._modifier_descriptors = [];
this.isRefreshable = true;
this.level = 0;
this._refresh_ticket = null;
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this._value = null;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._scope = null;
this._widget = null;
this._property_name = null;
this._scope_changed_listener = null;
this._widget_property_changed_listener = null;
this.init.apply(this, arguments);
},
	function() {
this.isSetValue = true;
this.guid = null;
this._property_name = null;
this._value_container = null;
this._container_changed_listener = null;
this._property_changed_listener = null;
this._enumerable_changed_listener = null;
this._property_container = null;
this._is_connected = false;
this.isValueContainer = true;
this._data_bindings_by_property = {};
this._data_segments = {};
this.isRefreshable = true;
this.level = 0;
this._refresh_ticket = null;
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this._value = null;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isValueContainer = true;
this._argument = null;
this._argument_changed_listener = null;
this._view = null;
this._widget = null;
this.guid = null;
this._observable_listener = null;
this._observable = null;
this._own_collection = false;
this._config = null;
this._binds = null;
this._bind_changed_listeners = null;
this.isRefreshable = true;
this.level = 0;
this._refresh_ticket = null;
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this._value = null;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isSetValue = true;
this.guid = null;
this._property_name = null;
this._view = null;
this._property_changed_listener = null;
this._assign_argument = null;
this.isValueContainer = true;
this._data_bindings_by_property = {};
this._data_segments = {};
this.isRefreshable = true;
this.level = 0;
this._refresh_ticket = null;
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this._value = null;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isSetValue = true;
this._container = null;
this._name_source_container = null;
this._name_source_changed_listener = null;
this._property_name = null;
this._data_binding = null;
this._data_binding_changed_listener = null;
this.isValueContainer = true;
this._data_bindings_by_property = {};
this._data_segments = {};
this.isRefreshable = true;
this.level = 0;
this._refresh_ticket = null;
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this._value = null;
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isElementContainer = true;
this._id = null;
this._view = null;
this._config = null;
this._widget = null;
this._tag_name = null;
this._static_classes = [];
this._class_bindings = null;
this._class_bindings_values = {};
this._static_styles = {};
this._style_bindings = null;
this._static_properties = {};
this._property_bindings = null;
this._events = {};
this._is_inDOM = false;
this._element = null;
this._is_void = false;
this._is_element_owner = true;
this._is_rendered = false;
this.init.apply(this, arguments);
},
	function() {
this._IE_click_callback = null;
this.isElementContainer = true;
this._id = null;
this._view = null;
this._config = null;
this._widget = null;
this._tag_name = null;
this._static_classes = [];
this._class_bindings = null;
this._class_bindings_values = {};
this._static_styles = {};
this._style_bindings = null;
this._static_properties = {};
this._property_bindings = null;
this._events = {};
this._is_inDOM = false;
this._element = null;
this._is_void = false;
this._is_element_owner = true;
this._is_rendered = false;
this.init.apply(this, arguments);
},
	function() {
this._OldIE_refresh_callback = null;
this._OldIE_property_change_callback = null;
this.isElementContainer = true;
this._id = null;
this._view = null;
this._config = null;
this._widget = null;
this._tag_name = null;
this._static_classes = [];
this._class_bindings = null;
this._class_bindings_values = {};
this._static_styles = {};
this._style_bindings = null;
this._static_properties = {};
this._property_bindings = null;
this._events = {};
this._is_inDOM = false;
this._element = null;
this._is_void = false;
this._is_element_owner = true;
this._is_rendered = false;
this.init.apply(this, arguments);
},
	function() {
this.isMorphContainer = true;
this._view = null;
this._widget = null;
this._is_inDOM = false;
this._start_script_id = null;
this._end_script_id = null;
this._start_element = null;
this._end_element = null;
this.init.apply(this, arguments);
},
	function() {
this.isEmulatedContainer = true;
this._view = null;
this._widget = null;
this._is_inDOM = false;
this.init.apply(this, arguments);
},
	function() {
this._config = null;
this._view = null;
this._container = null;
this._remove_queue = {};
this._current_templates = [];
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._is_animation_enabled = true;
this._animations_by_template_guid = {};
this._templates_by_animation_guid = {};
this._config = null;
this._view = null;
this._container = null;
this._remove_queue = {};
this._current_templates = [];
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.ANIMATION_NAME = "Lava.animation.Collapse";
this._is_animation_enabled = true;
this._animations_by_template_guid = {};
this._templates_by_animation_guid = {};
this._config = null;
this._view = null;
this._container = null;
this._remove_queue = {};
this._current_templates = [];
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._properties = {};
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._properties = {};
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._argument = null;
this._argument_changed_listener = null;
this._escape = true;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._properties = {};
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._argument = null;
this._foreach_scope = null;
this._foreach_scope_changed_listener = null;
this._current_count = 0;
this._current_uids = [];
this._current_hash = {};
this._current_templates = [];
this._as = null;
this._refresher = null;
this._properties = {
	count: 0
};
this._requires_refresh_children = true;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._arguments = [];
this._argument_changed_listeners = [];
this._count_arguments = 0;
this._active_argument_index = -1;
this._content = [];
this._else_content = null;
this._refresher = null;
this._active_template = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._properties = {};
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._argument = null;
this._argument_changed_listener = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._properties = {};
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.isWidget = true;
this.name = "widget";
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._properties = {};
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._properties = {
	name: null,
	value: null,
	is_disabled: false,
	is_required: false,
	is_readonly: false,
	is_valid: true
};
this._type = null;
this._input_container = null;
this.isWidget = true;
this.name = "widget";
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._properties = {
	value: "",
	name: null,
	is_disabled: false,
	is_required: false,
	is_readonly: false,
	is_valid: true
};
this._type = null;
this._input_container = null;
this.isWidget = true;
this.name = "widget";
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "textarea";
this._properties = {
	value: "",
	name: null,
	is_disabled: false,
	is_required: false,
	is_readonly: false,
	is_valid: true
};
this._type = null;
this._input_container = null;
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "text_input";
this._type = "text";
this._properties = {
	value: "",
	name: null,
	is_disabled: false,
	is_required: false,
	is_readonly: false,
	is_valid: true
};
this._input_container = null;
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._type = "password";
this.name = "text_input";
this._properties = {
	value: "",
	name: null,
	is_disabled: false,
	is_required: false,
	is_readonly: false,
	is_valid: true
};
this._input_container = null;
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._properties = {
	is_checked: false,
	name: null,
	value: null,
	is_disabled: false,
	is_required: false,
	is_readonly: false,
	is_valid: true
};
this._type = null;
this._input_container = null;
this.isWidget = true;
this.name = "widget";
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "checkbox";
this._type = "checkbox";
this._properties = {
	is_indeterminate: false,
	is_checked: false,
	name: null,
	value: null,
	is_disabled: false,
	is_required: false,
	is_readonly: false,
	is_valid: true
};
this._input_container = null;
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "radio";
this._type = "radio";
this._properties = {
	is_checked: false,
	name: null,
	value: null,
	is_disabled: false,
	is_required: false,
	is_readonly: false,
	is_valid: true
};
this._input_container = null;
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "submit";
this._type = "submit";
this._properties = {
	name: null,
	value: null,
	is_disabled: false,
	is_required: false,
	is_readonly: false,
	is_valid: true
};
this._input_container = null;
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "select";
this._properties = {
	optgroups: null,
	name: null,
	value: null,
	is_disabled: false,
	is_required: false,
	is_readonly: false,
	is_valid: true
};
this._type = null;
this._input_container = null;
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "select";
this._properties = {
	optgroups: null,
	name: null,
	value: null,
	is_disabled: false,
	is_required: false,
	is_readonly: false,
	is_valid: true
};
this._type = null;
this._input_container = null;
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "select";
this._properties = {
	value: [],
	optgroups: null,
	name: null,
	is_disabled: false,
	is_required: false,
	is_readonly: false,
	is_valid: true
};
this._type = null;
this._input_container = null;
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._properties = {
	value: 0,
	input_value: "",
	name: null,
	is_disabled: false,
	is_required: false,
	is_readonly: false,
	is_valid: true
};
this._type = "number";
this._data_type = "Number";
this.name = "text_input";
this._input_container = null;
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "field_group";
this._fields = [];
this._groups = [];
this._submit_fields = [];
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._properties = {};
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "accordion";
this._properties = {
	_panels: null,
	is_enabled: true
};
this._panels = null;
this._panel_widgets = [];
this._active_panels = [];
this._listeners_by_panel_guid = {};
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "tabs";
this._properties = {
	_tabs: null,
	active_tab: null
};
this._tab_objects = null;
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "collapsible";
this._properties = {
	is_expanded: true,
	is_animation_enabled: true,
	content: ""
};
this._panel_container = null;
this._animation = null;
this._default_display = null;
this.TOGGLE_ANIMATION_CLASS = "Toggle";
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "collapsible_panel";
this._properties = {
	is_locked: false,
	title: "",
	is_expanded: true,
	is_animation_enabled: true,
	content: ""
};
this._panel_container = null;
this._animation = null;
this._default_display = null;
this.TOGGLE_ANIMATION_CLASS = "Toggle";
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "collapsible_panel";
this._properties = {
	is_expanded: true,
	is_locked: false,
	is_animation_enabled: true,
	title: "",
	content: ""
};
this._content_refresher = null;
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "dropdown";
this._properties = {
	is_open: false
};
this._trigger = null;
this._target = null;
this._click_listener = null;
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "tree";
this._if_refresher_config = null;
this._properties = {
	records: null,
	meta_storage: null
};
this._meta_storage = null;
this._meta_storage_columns = {};
this._column_bind_configs = {};
this.CREATE_META_STORAGE = false;
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "table";
this._properties = {
	records: null,
	_columns: null,
	_sort_column_name: null,
	_sort_descending: false
};
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "calendar";
this._properties = {
	_current_year: 0,
	_current_month: 0,
	_current_day: 0
};
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this._properties = {
	value: null,
	_selected_view: "days",
	_weekdays: null,
	_months_data: null,
	_month_year_string: null,
	_today_string: null,
	_selection_start: 0,
	_selection_end: 0,
	_displayed_year: null,
	_displayed_month: null,
	_month_descriptors: null,
	_month_descriptor_rows: null,
	_current_year: 0,
	_current_month: 0,
	_current_day: 0
};
this._year_input = null;
this._months_cache = {};
this.name = "calendar";
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
},
	function() {
this.name = "tooltip";
this._properties = {
	y: 0,
	x: 0,
	y_offset: -25,
	x_offset: 5,
	html: "",
	is_visible: false
};
this.isWidget = true;
this._acquired_events = [];
this._bindings = {};
this._resources = {};
this._parent_widget = null;
this._content = null;
this.isView = true;
this.guid = null;
this.id = null;
this.label = null;
this.depth = 0;
this.template_index = 0;
this._widget = null;
this._parent_view = null;
this._parent_with_container = null;
this._container = null;
this._config = null;
this._template = null;
this._is_inDOM = false;
this._is_dirty = false;
this._is_queued_for_refresh = false;
this._property_bindings_by_property = {};
this._data_segments = {};
this._last_refresh_id = 0;
this._refresh_cycle_count = 0;
this.isProperties = true;
this._property_listeners = {};
this.isObservable = true;
this._listeners = {};
this.init.apply(this, arguments);
}
];
	var owr = [
	[
		function (event_name, fn, context, listener_args) {

		return this._addListener(event_name, fn, context, listener_args, this._listeners)

	},
		function (event_name, fn, context, listener_args, listeners_by_event) {

		// otherwise, listener would be called on window object
		if (Lava.schema.DEBUG && !context) Lava.t('Listener was created without a context');

		// note 1: member count for a plain object like this must not exceed 8
		// otherwise, chrome will slow down greatly (!)
		// note 2: there is no 'remove()' method inside the listener, cause depending on implementation,
		// it may either slow down script execution or lead to memory leaks
		var listener = {
			event_name: event_name,
			fn: fn,
			fn_original: fn,
			context: context,
			listener_args: listener_args
		};

		if (listeners_by_event[event_name] != null) {

			listeners_by_event[event_name].push(listener);

		} else {

			listeners_by_event[event_name] = [listener];

		}

		return listener;

	},
		function (listener) {

		this._removeListener(listener, this._listeners);

	},
		function (listener, listeners_by_event) {

		var list = listeners_by_event[listener.event_name],
			index;

		if (list) {
			index = list.indexOf(listener);
			if (index != -1) {
				list.splice(index, 1);
				if (list.length == 0) {
					listeners_by_event[listener.event_name] = null;
				}
			}
		}

	},
		function (event_name, event_args) {

		if (Lava.schema.DEBUG && typeof(event_name) == "undefined") Lava.t();

		if (this._listeners[event_name] != null) {

			this._callListeners(this._listeners[event_name], event_args);

		}

	},
		function (listeners, event_args) {

		var copy = listeners.slice(), // cause they may be removed during the fire cycle
			i = 0,
			count = listeners.length,
			listener;

		for (; i < count; i++) {

			listener = copy[i];
			listener.fn.call(listener.context, this, event_args, listener.listener_args);

		}

	},
		function (event_name) {

		return this._listeners[event_name] != null;

	}
	],
	[
		function (properties) {

		for (var name in properties) {

			this._properties[name] = properties[name];

		}

	},
		function (name) {

		return this._properties[name];

	},
		function (name) {

		return name in this._properties;

	},
		function (name, value) {

		if (this._properties[name] !== value) {
			this._set(name, value);
		}

	},
		function (name, value) {
		this._properties[name] = value;
		this.firePropertyChangedEvents(name);
	},
		function (properties_object) {

		if (Lava.schema.DEBUG && properties_object && properties_object.isProperties) Lava.t("setProperties expects a plain JS object as an argument, not a class");

		for (var name in properties_object) {

			this.set(name, properties_object[name]);

		}

	},
		function () {

		var result = {};
		Firestorm.extend(result, this._properties);
		return result;

	},
		function (property_name) {

		this._fire('property_changed', {name: property_name});
		this._firePropertyChanged(property_name);

	},
		function (property_name, fn, context, listener_args) {

		return this._addListener(property_name, fn, context, listener_args, this._property_listeners);

	},
		function (listener) {

		this._removeListener(listener, this._property_listeners);

	},
		function (property_name) {

		if (Lava.schema.DEBUG && property_name == null) Lava.t("firePropertyChanged: property_name is null");

		if (this._property_listeners[property_name] != null) {

			this._callListeners(this._property_listeners[property_name]);

		}

	}
	],
	[
		function (refresh_id, is_safe) {

		// first, refresh ticket must be cleared, cause otherwise scope may stay dirty forever
		this._refresh_ticket = null;

		if (this._last_refresh_id == refresh_id) {

			this._refresh_cycle_count++;
			if (this._refresh_cycle_count > Lava.schema.system.REFRESH_INFINITE_LOOP_THRESHOLD && !is_safe) {

				return true; // infinite loop exception

			}

		} else {

			this._last_refresh_id = refresh_id;
			this._refresh_cycle_count = 0;

		}

		this._doRefresh();
		return false;

	},
		function () {

		// may be overridden in inherited classes

	},
		function () {

		if (!this._refresh_ticket) {

			this._refresh_ticket = Lava.ScopeManager.scheduleScopeRefresh(this, this.level);

		}

	},
		function () {

		if (this._refresh_ticket) Lava.t("Refreshable::debugAssertClean() failed");

	},
		function () {

		return !!this._refresh_ticket;

	},
		function () {

		if (this._refresh_ticket) {
			Lava.ScopeManager.cancelScopeRefresh(this._refresh_ticket, this.level);
			this._refresh_ticket = null;
		}

	}
	],
	[
		function (config) {

		this.property_name = config.property;
		this.from = config.from || 0;
		this.delta = config.delta;
		this.unit = config.unit || 'px';

	},
		function (element, transition_value) {

		var raw_result = this.from + this.delta * transition_value;

		Firestorm.Element.setStyle(
			element,
			this.property_name,
			Math.floor(raw_result) + this.unit
		);

	}
	],
	[
		function (config) {

		this.property_name = config.property;
		this.from = config.from || [0,0,0];
		this.to = config.to || [0,0,0];
		this.delta = [this.to[0] - this.from[0], this.to[1] - this.from[1], this.to[2] - this.from[2]];

	},
		function (element, transition_value) {

		var current_value = [
			Math.floor(this.from[0] + this.delta[0] * transition_value),
			Math.floor(this.from[1] + this.delta[1] * transition_value),
			Math.floor(this.from[2] + this.delta[2] * transition_value)
		];

		Firestorm.Element.setStyle(
			element,
			this.property_name,
			'rgb(' + current_value.join(',') + ')'
		);

	}
	],
	[
		function (config, target) {

		this.guid = Lava.guid++;
		if (config.duration) {
			this._duration = config.duration;
		}
		this._target = target;
		this._transition = config.transition || Lava.transitions[config.transition_name || 'linear'];
		this._config = config;

	},
		function (now) {

		Lava.t("This method is assigned dynamically in constructor");

	},
		function () {

		this._is_running = false;
		this._fire('complete');

	},
		function (started_time) {

		if (!this._is_running) {

			this.start(started_time);

		}

	},
		function () {

		if (!this._is_reversed) {

			this._mirror();

		}

	},
		function () {

		if (this._is_reversed) {

			this._mirror();

		}

	},
		function () {

		this._is_reversed = !this._is_reversed;

		if (this._is_running) {

			var now = new Date().getTime(),
				new_end = 2 * now - this._started_time;

			// it's possible in case of script lags. Must not allow negative transition values.
			if (now > this._end_time) {

				this._started_time = this._end_time;
				this._end_time = this._started_time + this._duration;

			} else {

				this._end_time = new_end;
				this._started_time = new_end - this._duration;

			}

			this._afterMirror(now);

		}

	},
		function (now) {

	},
		function () {

		return this._is_running;

	},
		function () {

		return this._started_time;

	},
		function () {

		return this._end_time;

	},
		function () {

		return this._duration;

	},
		function () {

		return this._is_reversed;

	},
		function () {

		return this._target;

	},
		function (target) {

		this._target = target;

	}
	],
	[
		function (config, target) {

		this.Abstract$init(config, target);

		var i = 0,
			count = 0,
			animator_config;

		if ('animators' in config) {

			count = config.animators.length;

			for (; i < count; i++) {

				animator_config = config.animators[i];
				this._animators.push(new Lava.animator[animator_config.type](animator_config));

			}

		}

		if (this._shared.call_animators.length <= count) {

			this._callAnimators = this._shared.call_animators[count];

		}

		this.onTimer = this._animateDirect;

	},
		function (transition_value) {

		for (var i = 0, count = this._animators.length; i < count; i++) {

			this._animators[i].animate(this._target, transition_value);

		}

	},
		function (now) {

		if (now < this._end_time) {

			this._callAnimators(this._transition((now - this._started_time) / this._duration));

		} else {

			this._callAnimators(this._transition(1));
			this._finish();

		}

	},
		function (now) {

		if (now < this._end_time) {

			this._callAnimators(this._transition(1 - (now - this._started_time) / this._duration));

		} else {

			this._callAnimators(this._transition(0));
			this._finish();

		}

	},
		function (started_time) {

		var now = new Date().getTime();
		this._started_time = started_time || now;
		this._end_time = this._started_time + this._duration;

		if (now < this._end_time) {

			this._is_running = true;
			Lava.Cron.acceptTask(this);
			this.onTimer(now);

		} else {

			this.onTimer(this._end_time);

		}

	},
		function () {

		this._is_running = false;

	},
		function () {

		this.onTimer = this._is_reversed ? this._animateDirect : this._animateReverse;
		this.Abstract$_mirror();

	},
		function () {

		if (this._is_running) {

			this.onTimer(this._end_time);

		}

	},
		function (duration) {

		this._duration = duration;
		this._end_time = this._started_time + duration;

	}
	],
	[
		function (config, target) {

		var new_config = {};
		Firestorm.extend(new_config, this._shared.default_config);
		Firestorm.extend(new_config, config);

		// assuming that the first animator is Integer
		if (Lava.schema.DEBUG && !new_config.animators[0].property) Lava.t("Collapse: malformed animation config");
		this._property = new_config.animators[0].property;

		this.Standard$init(new_config, target);

	},
		function (started_time) {

		// in case we are starting from collapsed state
		Firestorm.Element.setStyle(this._target, this._property, 'auto');
		// assuming that target is element
		var property_value = Firestorm.Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
		this._animators[0].delta = property_value;
		this.setDuration(this.DURATION_BIAS + Math.floor(property_value)); // time depends on distance, to make it smoother

		this.Standard$start(started_time);

	},
		function () {

		if (!this._is_reversed) {

			// animation has expanded the container, height (or width) must be unlocked to allow element to adapt it's dimensions
			// (otherwise, if children nodes are added or removed - height will remain the same)
			Firestorm.Element.setStyle(this._target, this._property, 'auto');

		}

		this.Standard$_finish();

	}
	],
	[function () {

		Firestorm.Element.setStyle(this._target, 'display', this._is_reversed ? 'none' : 'block');
		this.Standard$_finish();

	}],
	[
		function (config, target) {

		this.Abstract$init(config, target);

		var self = this;
		this.onTimer = function() {
			self._onTimeout();
		}

	},
		function () {

		this._timeout = null;
		this._end();
		this._finish();

	},
		function () {

	},
		function () {
		if (this._timeout) {
			window.clearTimeout(this._timeout);
			this._timeout = null;
		}
	},
		function () {

		if (this._is_running) {
			this.stop();
		}

		this._is_running = true;
		this._start();
		this._timeout = window.setTimeout(this.onTimer, this._duration);

	},
		function () {

	},
		function () {

		if (this._is_running) {
			this._is_running = false;
			this._cancelTimeout();
		}

	},
		function () {

		if (this._is_running) {
			this.stop();
			this._reverse();
			this._is_running = true;
			// any CSS transition takes fixed amount of time
			this._timeout = window.setTimeout(this.onTimer, this._duration);
		}

		this._is_reversed = !this._is_reversed;

	},
		function () {

	},
		function () {

		if (this._is_running) {
			this._cancelTimeout();
			this._onTimeout();
		}

	}
	],
	[
		function (config, target) {

		this.Emulated$init(config, target);

		if (config.property) {
			this._property = config.property;
		}

	},
		function () {

		var Element = Firestorm.Element;

		if (this._is_reversed) { // collapse an element that is currently expanded

			// explicitly set the height/width on the element to make transition happen
			this._property_value = Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
			Element.setStyle(this._target, this._property, '' + this._property_value);
			this._target.offsetHeight; // force redraw to bypass browser optimizations
			Element.addClass(this._target, 'collapsing');
			Element.removeClasses(this._target, ['collapse', 'in']);
			Element.setStyle(this._target, this._property, '0');

		} else { // expand a collapsed element

			Element.removeClass(this._target, 'collapse');
			Element.setStyle(this._target, this._property, 'auto');
			this._property_value = Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
			Element.setStyle(this._target, this._property, '0');
			this._target.offsetHeight; // force redraw to bypass browser optimizations
			Element.addClass(this._target, 'collapsing');
			Element.setStyle(this._target, this._property, '' + this._property_value);

		}

	},
		function () {

		var Element = Firestorm.Element;

		if (this._is_reversed) {

			Element.removeClass(this._target, 'collapsing');
			Element.addClass(this._target, 'collapse');

		} else {

			Element.removeClass(this._target, 'collapsing');
			Element.addClasses(this._target, ['collapse', 'in']);
			Element.setStyle(this._target, this._property, 'auto');

		}

	},
		function () {

		if (this._is_reversed) {

			Firestorm.Element.setStyle(this._target, this._property, '' + this._property_value);

		} else {

			Firestorm.Element.setStyle(this._target, this._property, '0');

		}

	}
	],
	[
		function (config) {

		if (config) {
			if (config.check_property_names === false) this._check_property_names = false;
		}

		this._serializeFunction = (config && config.pretty_print_functions)
			? this._serializeFunction_PrettyPrint
			: this._serializeFunction_Normal

	},
		function (value) {

		return this._serializeValue(value, '');

	},
		function (value, padding) {

		var type = Firestorm.getType(value),
			result;

		if (Lava.schema.DEBUG && !(type in this._callback_map)) Lava.t("Unsupported type for serialization: " + type);

		result = this[this._callback_map[type]](value, padding);

		return result;

	},
		function (data, padding) {

		var tempResult = [],
			i = 0,
			count = data.length,
			child_padding = padding + "\t",
			result;

		if (count == 0) {

			result = '[]';

		} else if (count == 1) {

			result = '[' + this._serializeValue(data[i], padding) + ']';

		} else {

			for (; i < count; i++) {

				tempResult.push(this._serializeValue(data[i], child_padding));

			}

			result = '[' + "\n\t" + padding + tempResult.join(",\n\t" + padding) + "\n" + padding + ']';

		}

		return result;

	},
		function (data) {

		return Firestorm.String.quote(data);

	},
		function (data, padding) {

		var tempResult = [],
			child_padding = padding + "\t",
			name,
			type,
			result,
			is_complex = false,
			only_key = null,
			is_empty = true;

		// this may be faster than using Object.keys(data), but I haven't done speed comparison yet.
		// Purpose of the following code:
		// 1) if object has something in it then 'is_empty' will be set to false
		// 2) if there is only one property in it, then 'only_key' will contain it's name
		for (name in data) {
			if (only_key !== null) { // strict comparison - in case the key is valid, but evaluates to false
				only_key = null;
				break;
			}
			is_empty = false;
			only_key = name;
		}

		if (only_key) {

			type = Firestorm.getType(data[only_key]);

			if (type in this._complex_types) {
				is_complex = true;
			}

		}

		if (is_empty) {

			result = '{}';

		} else if (only_key && !is_complex) {

			// simple values can be written in one line
			result = '{' + this._serializeObjectProperty(only_key, data[only_key], child_padding) + '}';

		} else {

			for (name in data) {

				tempResult.push(
					this._serializeObjectProperty(name, data[name], child_padding)
				);

			}

			result = '{' + "\n\t" + padding + tempResult.join(",\n\t" + padding) + "\n" + padding + '}';

		}

		return result;

	},
		function (name, value, padding) {

		var type = Firestorm.getType(value);

		// if you serialize only Lava configs, then most likely you do not need this check,
		// cause the property names in configs are always valid.
		if (this._check_property_names && (!Lava.VALID_PROPERTY_NAME_REGEX.test(name) || Lava.JS_KEYWORDS.indexOf(name) != -1)) {

			name = Firestorm.String.quote(name);

		}

		return name + ': ' + this[this._callback_map[type]](value, padding);

	},
		function (data) {

		Lava.t();

	},
		function (data) {

		var result = data + '';

		// when using new Function() constructor, it's automatically named 'anonymous' in Chrome && Firefox
		if (result.substr(0, 18) == 'function anonymous') {
			result = 'function' + result.substr(18);
		}

		return result;

	},
		function (data, padding) {

		var result = this._serializeFunction_Normal(data),
			lines = result.split(/\r?\n/),
			last_line = lines[lines.length - 1],
			tabs,
			num_tabs,
			i = 1,
			count = lines.length;

		if (/^\t*\}$/.test(last_line)) {
			if (last_line.length > 1) { // if there are tabs
				tabs = last_line.substr(0, last_line.length - 1);
				num_tabs = tabs.length;
				for (; i < count; i++) {
					if (lines[i].indexOf(tabs) == 0) {
						lines[i] = lines[i].substr(num_tabs);
					}
				}
			}
			lines.pop();
			result = lines.join('\r\n\t' + padding) + '\r\n' + padding + last_line;
		}

		return result;

	},
		function (data) {

		return data.toString();

	},
		function (data) {

		return data.toString();

	},
		function (data) {

		return data.toString();

	},
		function () {

		return 'null';

	},
		function () {

		return 'undefined';

	}
	],
	[
		function (new_length) {

		this._count = new_length;
		this.firePropertyChangedEvents('length');

	},
		function () {

		return this._count == 0;

	},
		function () {

		return this._count;

	},
		function (name) {

		return (name == 'length') ? this._count : null;

	},
		function () {

		// we need to copy the local array, to protect it from being altered outside of the class
		return this._data_uids.slice();

	},
		function () {

		return this._data_values.slice();

	},
		function () {

		return this._data_names.slice();

	},
		function () {

		var result = {},
			i = 0;

		for (; i < this._count; i++) {

			result[this._data_uids[i]] = this._data_values[i];

		}

		return result;

	},
		function () {

		var result = {},
			i = 0;

		for (; i < this._count; i++) {

			result[this._data_uids[i]] = i;

		}

		return result;

	},
		function (uid) {

		var index = this._data_uids.indexOf(uid);

		return (index != -1) ? this._data_values[index] : null;

	},
		function (index) {

		return this._data_uids[index];

	},
		function (index) {

		return this._data_values[index];

	},
		function (index) {

		return this._data_names[index];

	},
		function (value) {

		return this._data_values.indexOf(value) != -1;

	},
		function (uid) {

		return this._data_uids.indexOf(uid) != -1;

	},
		function (value) {

		return this._data_values.indexOf(value);

	},
		function (uid) {

		return this._data_uids.indexOf(uid);

	},
		function () {

		Lava.t('set on Enumerable is not permitted');

	},
		function () {

		var old_uid = this._data_uids.pop(),
			old_value = this._data_values.pop(),
			old_name = this._data_names.pop(),
			count = this._count - 1;

		this._setLength(count);

		this._fire('items_removed', {
			uids: [old_uid],
			values: [old_value],
			names: [old_name]
		});

		this._fire('collection_changed');

		return old_value;
	},
		function (value) {

		var result = false,
			index = this._data_values.indexOf(value);

		if (index != -1) {
			this.removeAt(index);
			result = true;
		}

		return result;

	},
		function (index_a, index_b) {

		if (index_a > this._count || index_b > this._count) Lava.t("Index is out of range (2)");

		var swap = Firestorm.Array.swap;

		swap(this._data_uids, index_a, index_b);
		swap(this._data_values, index_a, index_b);
		swap(this._data_names, index_a, index_b);

		this._fire('collection_changed');

	},
		function (callback) {

		// everything is copied in case the collection is modified during the cycle
		var values = this._data_values.slice(),
			uids = this._data_uids.slice(),
			names = this._data_names.slice(),
			i = 0,
			count = this._count;

		for (; i < count; i++) {

			if (callback(values[i], names[i], uids[i], i) === false) {
				break;
			}

		}

	},
		function (callback) {

		var i = 0,
			count = this._count,
			result = this._createHelperStorage(),
			removed = this._createHelperStorage();

		for (; i < count; i++) {

			if (callback(this._data_values[i], this._data_names[i], this._data_uids[i], i)) {

				result.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			} else {

				removed.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			}

		}

		this._assignStorage(result);
		this._setLength(this._data_uids.length);

		removed.uids.length && this._fire('items_removed', removed.getObject());

		this._fire('collection_changed');

	},
		function (less, algorithm_name) {

		this._sort(less || Lava.DEFAULT_LESS, this._data_values, algorithm_name);

	},
		function (less, algorithm_name) {

		this._sort(less || Lava.DEFAULT_LESS, this._data_names, algorithm_name);

	},
		function (less, values, algorithm_name) {

		var indices = [],
			i = 0,
			_less;

		_less = function(a, b) {

			// a and b are indices, not actual values
			return less(values[a], values[b]);

		};

		for (; i < this._count; i++) {

			indices.push(i);

		}

		indices = Lava.algorithms.sorting[algorithm_name || Lava.schema.DEFAULT_STABLE_SORT_ALGORITHM](indices, _less);

		this.reorder(indices);

	},
		function (new_indices) {

		var i = 0,
			result = this._createHelperStorage(),
			index,
			verification = {};

		if (Lava.schema.DEBUG && new_indices.length != this._count) throw "reorder: new item count is less than current";

		for (; i < this._count; i++) {

			index = new_indices[i];
			result.push(this._data_uids[index], this._data_values[index], this._data_names[index]);

			if (Lava.schema.DEBUG) {
				// duplicate UIDs may break a lot of functionality, in this class and outside
				if (index in verification) Lava.t("Malformed index array");
				verification[index] = null;
			}

		}

		this._assignStorage(result);
		this._fire('collection_changed');

	},
		function (start_index, count) {

		if (count <= 0) Lava.t("Invalid item count supplied for removeRange");
		if (start_index + count >= this._count + 1) Lava.t("Index is out of range");

		var removed_uids = this._data_uids.splice(start_index, count),
			removed_values = this._data_values.splice(start_index, count),
			removed_names = this._data_names.splice(start_index, count);

		this._setLength(this._count - count);

		this._fire('items_removed', {
			uids: removed_uids,
			values: removed_values,
			names: removed_names
		});

		this._fire('collection_changed');

		return removed_values;

	},
		function () {

		return (this._count > 0) ? this.removeRange(0, this._count) : [];

	},
		function (index) {

		return this.removeRange(index, 1)[0];

	},
		function () {

		return this.removeRange(0, 1)[0];

	},
		function () {

		return {
			uids: [],
			values: [],
			names: [],
			push: function(uid, value, name) {
				this.uids.push(uid);
				this.values.push(value);
				this.names.push(name);
			},
			getObject: function() {
				return {
					uids: this.uids,
					values: this.values,
					names: this.names
				}
			}
		}

	},
		function (storage) {

		this._data_uids = storage.uids;
		this._data_values = storage.values;
		this._data_names = storage.names;

	},
		function () {

		this._fire('destroy');

	}
	],
	[
		function (data_source) {

		this.guid = Lava.guid++;

		if (data_source) {

			var count = 0,
				i = 0,
				name;

			if (Array.isArray(data_source)) {

				for (count = data_source.length; i < count; i++) {

					this._push(this._uid++, data_source[i], null);

				}

			} else if (data_source.isCollection) {

				this._data_names = data_source.getNames();
				this._data_values = data_source.getValues();
				for (count = this._data_values.length; i < count; i++) {

					this._data_uids.push(this._uid++);

				}

			} else {

				if (data_source.isProperties) {

					data_source = data_source.getProperties();

				}

				for (name in data_source) {

					this._push(this._uid++, data_source[name], name);

				}

			}

			this._count = this._data_uids.length;

		}

	},
		function (data_source) {

		if (Lava.schema.DEBUG && typeof(data_source) != 'object') Lava.t("Wrong argument passed to updateFromSourceObject");

		if (Array.isArray(data_source)) {

			this._updateFromArray(data_source, []);

		} else if (data_source.isCollection) {

			this._updateFromEnumerable(data_source);

		} else {

			this._updateFromObject(data_source.isProperties ? data_source.getProperties() : data_source);

		}

	},
		function (source_array, names) {

		var i = 0,
			count = source_array.length,
			items_removed_argument = {
				uids: this._data_uids,
				values: this._data_values,
				names: this._data_names
			};

		this._data_uids = [];
		this._data_values = [];
		this._data_names = [];

		for (; i < count; i++) {
			this._push(this._uid++, source_array[i], names[i] || null);
		}

		this._setLength(count);

		this._fire('items_removed', items_removed_argument);

		this._fire('items_added', {
			uids: this._data_uids.slice(),
			values: this._data_values.slice(),
			names: this._data_names.slice()
		});

		this._fire('collection_changed');

	},
		function (data_source) {

		this._updateFromArray(data_source.getValues(), data_source.getNames());

	},
		function (source_object) {

		var i = 0,
			name,
			uid,
			result = this._createHelperStorage(),
			removed = this._createHelperStorage(),
			added = this._createHelperStorage();

		for (; i < this._count; i++) {

			name = this._data_names[i];
			if (name != null && (name in source_object)) {

				if (source_object[name] === this._data_values[i]) {

					result.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

				} else {

					// Attention: the name has NOT changed, but it will be present in both added and removed names!
					removed.push(this._data_uids[i], this._data_values[i], name);
					uid = this._uid++;
					result.push(uid, source_object[name], name);
					added.push(uid, source_object[name], name);

				}

			} else {

				removed.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			}

		}

		for (name in source_object) {

			if (this._data_names.indexOf(name) == -1) {

				uid = this._uid++;
				result.push(uid, source_object[name], name);
				added.push(uid, source_object[name], name);

			}

		}

		this._assignStorage(result);
		this._setLength(this._data_uids.length);

		removed.uids.length && this._fire('items_removed', removed.getObject());
		added.uids.length && this._fire('items_added', added.getObject());
		this._fire('collection_changed');

	},
		function (uid, value, name) {

		this._data_uids.push(uid);
		this._data_values.push(value);
		this._data_names.push(name);

	},
		function (index, value, name) {

		if (index > this._count) Lava.t("Index is out of range");

		var old_uid = this._data_uids[index],
			old_value = this._data_values[index],
			old_name = this._data_names[index],
			new_uid = this._uid++;

		this._data_uids[index] = new_uid;
		this._data_values[index] = value;
		if (name) {
			this._data_names[index] = name;
		}

		this._fire('items_removed', {
			uids: [old_uid],
			values: [old_value],
			names: [old_name]
		});

		this._fire('items_added', {
			uids: [new_uid],
			values: [value],
			names: [this._data_names[index]]
		});

		this._fire('collection_changed');

	},
		function (value, name) {

		var count = this._count,
			new_uid = this._uid++;

		this._push(new_uid, value, name || null);

		this._setLength(count + 1);

		this._fire('items_added', {
			uids: [new_uid],
			values: [value],
			names: [name || null]
		});

		this._fire('collection_changed');

		return this._count; // after _setLength() this was incremented by one

	},
		function (value, name) {

		var result = false,
			index = this._data_values.indexOf(value);

		if (index == -1) {
			this.push(value, name);
			result = true;
		}

		return result;

	},
		function (start_index, values, names) {

		if (start_index >= this._count) Lava.t("Index is out of range");

		var i = 0,
			count = values.length,
			added_uids = [],
			added_names = [];

		if (names) {

			if (count != names.length) Lava.t("If names array is provided, it must be equal length with values array.");
			added_names = names;

		} else {

			for (; i < count; i++) {

				added_names.push(null);

			}

		}

		for (; i < count; i++) {

			added_uids.push(this._uid++);

		}

		if (start_index == 0) {

			// prepend to beginning
			this._data_uids = added_uids.concat(this._data_uids);
			this._data_values = values.concat(this._data_values);
			this._data_names = added_names.concat(this._data_names);

		} else if (start_index == this._count - 1) {

			// append to the end
			this._data_uids = this._data_uids.concat(added_uids);
			this._data_values = this._data_values.concat(values);
			this._data_names = this._data_names.concat(added_names);

		} else {

			this._data_uids = this._data_uids.slice(0, start_index).concat(added_uids).concat(this._data_uids.slice(start_index));
			this._data_values = this._data_values.slice(0, start_index).concat(values).concat(this._data_values.slice(start_index));
			this._data_names = this._data_names.slice(0, start_index).concat(added_names).concat(this._data_names.slice(start_index));

		}

		this._setLength(this._count + count);

		this._fire('items_added', {
			uids: added_uids,
			values: values,
			names: added_names
		});

		this._fire('collection_changed');

	},
		function (values, names) {

		this.insertRange(this._count, values, names);

	},
		function (index, value, name) {

		this.insertRange(index, [value], [name]);

	},
		function (value, name) {

		this.insertRange(0, [value], [name]);

	}
	],
	[
		function (data_source) {

		this.guid = Lava.guid++;
		data_source && this.refreshFromDataSource(data_source);

	},
		function () {

		this._data_names = this._data_source.getNames();
		this._data_values = this._data_source.getValues();
		this._data_uids = this._data_source.getUIDs();
		this._count = this._data_uids.length;
		this._fire('collection_changed');

	},
		function (data_source) {

		if (Lava.schema.DEBUG && !data_source.isCollection) Lava.t("Wrong argument supplied for DataView constructor");
		this._data_source = data_source;

	},
		function (data_source) {

		this.setDataSource(data_source);
		this.refresh();

	},
		function () {

		return this._data_source;

	}
	],
	[
		function (template_config, widget, parent_view, child_properties) {

		this.guid = Lava.guid++;
		this._parent_view = parent_view;
		this._widget = widget;
		this._config = template_config;

		this._createChildren(this._content, template_config, [], child_properties);
		this._count = this._content.length;

	},
		function (result, children_config, include_name_stack, properties) {

		var i = 0,
			count = children_config.length,
			childConfig,
			type;

		for (; i < count; i++) {

			childConfig = children_config[i];
			type = typeof(childConfig);
			if (type == 'object') type = childConfig.type;

			if (Lava.schema.DEBUG && !(type in this._block_handlers_map)) Lava.t("Unsupported template item type: " + type);
			this[this._block_handlers_map[type]](result, childConfig, include_name_stack, properties);

		}

	},
		function (result, childConfig) {

		result.push(childConfig);

	},
		function (result, childConfig, include_name_stack, properties) {

		var constructor = Lava.ClassManager.getConstructor(childConfig['class'], 'Lava.view'),
			view = new constructor(
				childConfig,
				this._widget,
				this._parent_view,
				this, // template
				properties
			);

		view.template_index = result.push(view) - 1;

	},
		function (result, child_config, include_name_stack, properties) {

		if (include_name_stack.indexOf(child_config.name) != -1) Lava.t("Infinite include recursion");
		var include = Lava.view_manager.getInclude(this._parent_view, child_config);
		if (Lava.schema.DEBUG && include == null) Lava.t("Include not found: " + child_config.name);

		include_name_stack.push(child_config.name);
		this._createChildren(result, include, include_name_stack, properties);
		include_name_stack.pop();

	},
		function (result, childConfig) {

		var resource_id = childConfig.resource_id,
			resource_owner = Lava.view_manager.locateTarget(this._widget, resource_id.locator_type, resource_id.locator),
			resource_value,
			type;

		if (!Lava.schema.RESOURCES_ENABLED) Lava.t("static_value: resources are disabled");
		if (Lava.schema.DEBUG && !resource_owner) Lava.t("Resource owner not found: " + resource_id.locator_type + '=' + resource_id.locator);

		resource_value = resource_owner.getResource(resource_id.name);
		if (Lava.schema.DEBUG && !resource_value) Lava.t("static_value: resource not found: " + resource_id.locator_type + '=' + resource_id.locator);
		if (Lava.schema.DEBUG && ['string', 'number', 'boolean'].indexOf(Firestorm.getType(resource_value.value)) == -1) Lava.t("static_value: resource has wrong type");

		result.push(resource_value.value);

	},
		function (result, childConfig) {

		var argument = new Lava.scope.Argument(childConfig.argument, this._view, this._widget);
		// if this happens - then you are probably doing something wrong
		if (argument.isWaitingRefresh()) {
			if (Lava.schema.DEBUG) Lava.t("static_eval wrong usage: created argument is dirty");
			Lava.logError("static_eval wrong usage: created argument is dirty");
		}
		result.push(argument.getValue + '');
		argument.destroy();

	},
		function (result, child_config, include_name_stack, properties) {

		var resource_id = child_config.resource_id,
			resource_owner,
			container_resources,
			serialized_tag = '<' + child_config.name,
			result_styles = [],
			name,
			is_void = Lava.isVoidTag(child_config.name),

			static_properties,
			static_classes,
			static_styles;

		if (Lava.schema.RESOURCES_ENABLED) {
			resource_owner = Lava.view_manager.locateTarget(this._widget, resource_id.locator_type, resource_id.locator);
			if (Lava.schema.DEBUG && !resource_owner) Lava.t("Resource owner not found: " + resource_id.locator_type + '=' + resource_id.locator);
			container_resources = resource_owner.getResource(resource_id.name);
		}

		if (Lava.schema.DEBUG && !Lava.schema.RESOURCES_ENABLED) Lava.t("Unable to render a static container: resources are disabled");
		if (Lava.schema.DEBUG && !container_resources) Lava.t("Static container, resources not found: " + resource_id.name);
		if (Lava.schema.DEBUG && container_resources.type != 'container') Lava.t("Malformed/invalid container resource: " + resource_id.locator_type + '=' + resource_id.locator);

		static_properties = container_resources.value['static_properties'];
		static_classes = container_resources.value['static_classes'];
		static_styles = container_resources.value['static_styles'];

		if (static_properties) {
			serialized_tag += Lava.parsers.Common.renderTagAttributes(static_properties);
		}

		if (static_classes) {
			serialized_tag += ' class="' + static_classes.join(' ') + '"';
		}

		if (static_styles) {

			for (name in static_styles) {

				result_styles.push(name + ':' + static_styles);

			}

			serialized_tag += ' style="' + result_styles.join(';') + '"';

		}

		if (child_config.template) {

			if (Lava.schema.DEBUG && is_void) Lava.t();

			result.push(serialized_tag + '>');
			this._createChildren(result, child_config.template, include_name_stack, properties);
			result.push('</' + child_config.name + '>');

		} else {

			serialized_tag += is_void ? '/>' : '></' + child_config.name + '>';
			result.push(serialized_tag);

		}

	},
		function (function_name) {

		for (var i = 0; i < this._count; i++) {

			if (this._content[i].isView) {

				this._content[i][function_name]();

			}

		}

	},
		function () {

		var buffer = '',
			i = 0,
			content = this._content;

		for (; i < this._count; i++) {

			if (typeof(content[i]) == 'string') {

				buffer += content[i];

			} else if (typeof(content[i]) == 'function') {

				Lava.t("Not implemented");

			} else {

				buffer += content[i].render();

			}

		}

		return buffer;

	},
		function () {

		if (this._is_inDOM) {

			this._is_inDOM = false;
			this._broadcast('broadcastRemove');

		}

	},
		function () {

		this._is_inDOM = true;
		this._broadcast('broadcastInDOM');

	},
		function (name, value) {

		for (var i = 0; i < this._count; i++) {

			if (this._content[i].isView) {

				this._content[i].set(name, value);

			}

		}

	},
		function (properties_object) {

		for (var i = 0; i < this._count; i++) {

			if (this._content[i].isView) {

				this._content[i].setProperties(properties_object);

			}

		}

	},
		function () {

		return this._seekForwards(0);

	},
		function () {

		return this._seekBackwards(this._count - 1);

	},
		function (view) {

		return this._seekBackwards(view.template_index - 1);

	},
		function (view) {

		return this._seekForwards(view.template_index + 1);

	},
		function (i) {

		var result = null;

		while (i < this._count) {
			if (this._content[i].isView) {
				result = this._content[i];
				break;
			}
			i++;
		}

		return result;

	},
		function (i) {

		var result = null;

		while (i >= 0) {
			if (this._content[i].isView) {
				result = this._content[i];
				break;
			}
			i--;
		}

		return result;

	},
		function (label) {

		var result = [],
			i = 0;

		for (; i < this._count; i++) {

			if (this._content[i].isView && this._content[i].label == label) {

				result.push(this._content[i]);

			}

		}

		return result;

	},
		function (name) {

		var result = [],
			i = 0;

		for (; i < this._count; i++) {

			if (this._content[i].isWidget && this._content[i].name == name) {

				result.push(this._content[i]);

			}

		}

		return result;

	},
		function () {

		return this._count;

	},
		function (index) {

		return this._content[index];

	},
		function () {

		return this._is_inDOM;

	},
		function () {

		this._broadcast('destroy');
		this._content = null;

	}
	],
	[
		function () {

		var default_events = Lava.schema.system.DEFAULT_EVENTS,
			i = 0,
			count = default_events.length;

		for (; i < count; i++) {

			this._event_usage_counters[default_events[i]] = 1;
			this._initEvent(default_events[i]);

		}

	},
		function (view) {

		if (view.depth in this._dirty_views) {

			this._dirty_views[view.depth].push(view);

		} else {

			this._dirty_views[view.depth] = [view];

		}

	},
		function () {

		if (Lava.Core.isProcessingEvent()) {
			Lava.logError("ViewManager::refresh() must not be called inside event listeners");
			return;
		}

		if (this._is_refreshing) {
			Lava.logError("ViewManager: recursive call to refresh()");
			return;
		}

		Lava.ScopeManager.refresh();

		if (this._dirty_views.length) {

			this._is_refreshing = true;
			Lava.ScopeManager.lock();
			this._refresh_id++;

			do {
				var dirty_views = this._dirty_views,
					has_exceptions;
				this._dirty_views = [];
				has_exceptions = this._refreshCycle(dirty_views);
			} while (this._dirty_views.length && !has_exceptions);

			Lava.ScopeManager.unlock();
			this._is_refreshing = false;

		}

	},
		function (dirty_views) {

		var level = 0,
			deepness,
			views_list,
			has_exceptions = false,
			i,
			count;

		deepness = dirty_views.length; // this line must be after ScopeManager#refresh()

		for (; level < deepness; level++) {

			if (level in dirty_views) {

				views_list = dirty_views[level];

				for (i = 0, count = views_list.length; i < count; i++) {

					if (views_list[i].refresh(this._refresh_id)) {
						Lava.logError("ViewManager: view was refreshed several times in one refresh loop. Aborting.");
						has_exceptions = true;
					}

				}

			}

		}

		return has_exceptions;

	},
		function () {

		return this._is_refreshing;

	},
		function (instance) {

		this._views_by_guid[instance.guid] = instance;

		if (instance.id) {

			if (Lava.schema.DEBUG && (instance.id in this._views_by_id)) Lava.t("Duplicate view id: " + instance.id);
			this._views_by_id[instance.id] = instance;

		}

	},
		function (instance) {

		delete this._views_by_guid[instance.guid];

		if (instance.id) {

			delete this._views_by_id[instance.id];

		}

	},
		function (id) {

		return this._views_by_id[id];

	},
		function (guid) {

		return this._views_by_guid[guid];

	},
		function (starting_widget, id) {

		if (Lava.schema.DEBUG && !id) Lava.t();

		return this._views_by_id[id];

	},
		function (starting_widget, guid) {

		if (Lava.schema.DEBUG && !guid) Lava.t();

		return this._views_by_guid[guid];

	},
		function (widget, name) {

		if (Lava.schema.DEBUG && !name) Lava.t();

		while (widget && widget.name != name) {

			widget = widget.getParentWidget();

		}

		return widget;

	},
		function (widget, label) {

		if (Lava.schema.DEBUG && !label) Lava.t();

		// Targets are different from view locators, there must be no hardcoded '@widget' label, like in views
		// ('@widget' label may be very harmful in this case. Use widget names instead!)

		if (label == 'root') {

			while (widget.getParentWidget()) {

				widget = widget.getParentWidget();

			}

		} else {

			while (widget && widget.label != label) {

				widget = widget.getParentWidget();

			}

		}

		return widget;

	},
		function (starting_widget, locator_type, locator) {

		return this['_locateWidgetBy' + locator_type](starting_widget, locator);

	},
		function (view, targets, callback, callback_arguments, global_targets_object) {

		var i = 0,
			count = targets.length,
			target,
			target_name,
			widget,
			template_arguments,
			bubble_index = 0,
			bubble_targets_copy,
			bubble_targets_count;

		this._nested_dispatch_count++;

		for (; i < count; i++) {

			target = targets[i];
			target_name = target.name;
			template_arguments = ('arguments' in target) ? this._evalTargetArguments(view, target) : null;
			widget = null;

			if ('locator_type' in target) {

				/*
				 Note: there is similar view location mechanism in view.Abstract, but the algorithms are different:
				 when ViewManager seeks by label - it searches only for widgets, while view checks all views in hierarchy.
				 Also, hardcoded labels differ.
				 */
				widget = this['_locateWidgetBy' + target.locator_type](view.getWidget(), target.locator);

				if (!widget) {

					Lava.logError('ViewManager: callback target (widget) not found. Type: ' + target.locator_type + ', locator: ' + target.locator);

				} else if (!widget.isWidget) {

					Lava.logError('ViewManager: callback target is not a widget');

				} else if (!callback(widget, target_name, view, template_arguments, callback_arguments)) {

					Lava.logError('ViewManager: targeted widget did not handle the role or event: ' + target_name);

				}

				// ignore possible call to cancelBubble()
				this._cancel_bubble = false;

			} else {

				// bubble
				widget = view.getWidget();

				do {

					callback(widget, target_name, view, template_arguments, callback_arguments);
					widget = widget.getParentWidget();

				} while (widget && !this._cancel_bubble);

				if (this._cancel_bubble) {
					this._cancel_bubble = false;
					continue;
				}

				if (target_name in global_targets_object) {

					// cause target can be removed inside event handler
					bubble_targets_copy = global_targets_object[target_name].slice();
					for (bubble_targets_count = bubble_targets_copy.length; bubble_index < bubble_targets_count; bubble_index++) {

						callback(
							bubble_targets_copy[bubble_index],
							target_name,
							view,
							template_arguments,
							callback_arguments
						);

						if (this._cancel_bubble) {
							this._cancel_bubble = false;
							break;
						}

					}

				}

			}

		}

		this._nested_dispatch_count--;

	},
		function (widget, target_name, view, template_arguments) {

		return widget.handleRole(target_name, view, template_arguments);

	},
		function (view, targets) {

		this._dispatchCallback(
			view,
			targets,
			this._callRegisterViewInRole,
			null,
			this._global_role_targets
		);

	},
		function (widget, target_name, view, template_arguments, callback_arguments) {

		return widget.handleEvent(
			callback_arguments.event_name,
			callback_arguments.event_object,
			target_name,
			view,
			template_arguments
		);

	},
		function (view, event_name, event_object) {

		var targets = view.getContainer().getEventTargets(event_name);

		if (targets) {

			this.dispatchEvent(view, event_name, event_object, targets);

		}

	},
		function (view, event_name, event_object, targets) {

		this._dispatchCallback(
			view,
			targets,
			this._callHandleEvent,
			{
				event_name: event_name,
				event_object: event_object
			},
			this._global_event_targets
		);

	},
		function (view, target) {

		var result = [];

		for (var i = 0, count = target.arguments.length; i < count; i++) {

			if (target.arguments[i].type == Lava.TARGET_ARGUMENT_TYPES.VALUE) {

				result.push(target.arguments[i].data);

			} else {

				if (target.arguments[i].type != Lava.TARGET_ARGUMENT_TYPES.BIND) Lava.t();

				result.push(view.evalPathConfig(target.arguments[i].data));

			}

		}

		return result;

	},
		function (starting_view, config) {

		var widget = starting_view.getWidget(),
			template_arguments = ('arguments' in config) ? this._evalTargetArguments(starting_view, config) : null;

		if ('locator_type' in config) {

			widget = this['_locateWidgetBy' + config.locator_type](widget, config.locator);

			if (!widget || !widget.isWidget) Lava.t();

		}

		return widget.getInclude(config.name, template_arguments);

	},
		function (callback_name, widget) {

		this._addTarget(this._global_event_targets, callback_name, widget);

	},
		function (callback_name, widget) {

		this._removeTarget(this._global_event_targets, callback_name, widget);

	},
		function (callback_name, widget) {

		this._addTarget(this._global_role_targets, callback_name, widget);

	},
		function (callback_name, widget) {

		this._removeTarget(this._global_role_targets, callback_name, widget);

	},
		function (storage, name, widget) {

		if (name in storage) {

			if (storage[name].indexOf(widget) == -1) {

				storage[name].push(widget);

			} else {

				Lava.logError('[ViewManager] Duplicate target: ' + name);

			}

		} else {

			storage[name] = [widget];

		}

	},
		function (storage, name, widget) {

		if (!(name in storage)) Lava.t("Trying to remove a global event target for nonexistent event");

		var index = storage[name].indexOf(widget);

		if (index !== -1) {

			storage[name].splice(index, 1);

		}

	},
		function (element) {

		var id = Firestorm.Element.getProperty(element, 'id'),
			result = null;

		if (id) {

			if (id.indexOf(Lava.ELEMENT_ID_PREFIX) == 0) {

				result = this.getViewByGuid(id.substr(Lava.ELEMENT_ID_PREFIX.length));

			}

		}

		return result;

	},
		function (label) {

		var result = [];

		for (var guid in this._views_by_guid) {

			if (this._views_by_guid[guid].label == label) {

				result.push(this._views_by_guid[guid]);

			}

		}

		return result;

	},
		function (event_name, event_object) {

		var new_mouseover_target = (event_name == 'mouseover') ? event_object.target : event_object.relatedTarget,
			new_mouseover_element_stack = new_mouseover_target ? this._buildElementStack(new_mouseover_target) : [],
			new_mouseover_view_stack = [],
			view,
			container,
			i,
			count;

		if (this._new_mouseover_target !== new_mouseover_target) {

			// Warning! You must not modify `new_mouseover_element_stack` array!
			this._fire('mouseover_stack_changed', new_mouseover_element_stack);

			if (new_mouseover_target) { // moved from one element to another or entered the window

				for (i = 0, count = new_mouseover_element_stack.length; i < count; i++) {
					view = this.getViewByElement(new_mouseover_element_stack[i]);
					if (view) {
						container = view.getContainer();
						if (container.isElementContainer) {
							new_mouseover_view_stack.push(view);
						}
					}
				}

			}

			this._old_mouseover_target = this._new_mouseover_target;
			this._new_mouseover_target = new_mouseover_target;
			this._old_mouseover_view_stack = this._new_mouseover_view_stack;
			this._new_mouseover_view_stack = new_mouseover_view_stack;

		}

		if (event_name == 'mouseout') {

			for (i = 0, count = this._old_mouseover_view_stack.length; i < count; i++) {

				if (this._new_mouseover_view_stack.indexOf(this._old_mouseover_view_stack[i]) == -1) {

					this._dispatchViewEvent(this._old_mouseover_view_stack[i], 'mouseleave', event_object);

				}

				this._dispatchViewEvent(this._old_mouseover_view_stack[i], 'mouseout', event_object);

			}

		} else {

			for (i = 0, count = this._new_mouseover_view_stack.length; i < count; i++) {

				this._dispatchViewEvent(this._new_mouseover_view_stack[i], 'mouseover', event_object);

				if (this._old_mouseover_view_stack.indexOf(this._new_mouseover_view_stack[i]) == -1) {

					this._dispatchViewEvent(this._new_mouseover_view_stack[i], 'mouseenter', event_object);

				}

			}

		}

	},
		function (element) {

		// note: target of some events can be the root html tag (for example, mousedown on a scroll bar)
		var document_ref = window.document, // document > html > body > ...
			result = [];

		while (element && element != document_ref) {

			result.push(element);
			element = element.parentNode;

		}

		// you must not modify the returned array, but you can slice() it
		if (Lava.schema.DEBUG && Object.freeze) {
			Object.freeze(result);
		}

		return result;

	},
		function (event_name, event_object) {

		var target = event_object.target,
			view,
			container,
			stack_changed_event_name = event_name + '_stack_changed',
			stack = target ? this._buildElementStack(target) : [],
			i = 0,
			count = stack.length;

		// Warning! You must not modify the `stack` array!
		this._fire(stack_changed_event_name, stack);

		for (; i < count; i++) {
			view = this.getViewByElement(stack[i]);
			if (view) {
				container = view.getContainer();
				if (container.isElementContainer) {
					if (container.getEventTargets(event_name)) {
						this.dispatchEvent(view, event_name, event_object, container.getEventTargets(event_name));
					}
				}
			}
		}

	},
		function (event_name) {

		if (Lava.schema.DEBUG && ['mouseenter', 'mouseleave', 'mouseover', 'mouseout'].indexOf(event_name) != -1)
			Lava.t("The following events: mouseenter, mouseleave, mouseover and mouseout are served by common alias - mouse_events");

		if (this._event_usage_counters[event_name]) {

			this._event_usage_counters[event_name]++;

		} else {

			this._event_usage_counters[event_name] = 1;
			this._initEvent(event_name);

		}

	},
		function (event_name) {

		if (event_name == 'mouse_events') {

			this._events_listeners['mouseover'] =
				Lava.Core.addGlobalHandler('mouseover', this.handleMouseMovement, this);
			this._events_listeners['mouseout'] =
				Lava.Core.addGlobalHandler('mouseout', this.handleMouseMovement, this);

		} else {

			this._events_listeners[event_name] =
				Lava.Core.addGlobalHandler(event_name, this.onDOMEvent, this);

		}

	},
		function (event_name) {

		if (this._event_usage_counters[event_name] == 0) {
			Lava.logError("ViewManager: trying to release an event with zero usage.");
			return;
		}

		this._event_usage_counters[event_name]--;

		if (this._event_usage_counters[event_name] == 0) {

			this._shutdownEvent(event_name);

		}

	},
		function (event_name) {

		return this._event_usage_counters[event_name] > 0;

	},
		function (event_name) {

		if (event_name == 'mouse_events') {

			Lava.Core.removeGlobalHandler(this._events_listeners['mouseover']);
			this._events_listeners['mouseover'] = null;
			Lava.Core.removeGlobalHandler(this._events_listeners['mouseout']);
			this._events_listeners['mouseout'] = null;

		} else {

			Lava.Core.removeGlobalHandler(this._events_listeners[event_name]);
			this._events_listeners[event_name] = null;

		}

	},
		function () {

		if (!this._nested_dispatch_count) {
			Lava.logError("Call to cancelBubble outside of dispatch cycle");
			return;
		}
		this._cancel_bubble = true;

	},
		function () {

		for (var name in this._events_listeners) {

			if (this._events_listeners[name]) {

				Lava.Core.removeGlobalHandler(this._events_listeners[name]);
				this._events_listeners[name] = null;
				this._event_usage_counters[name] = 0;

			}

		}

	}
	],
	[
		function (name) {

		if (!(name in this._modules)) {

			var config = Lava.schema.modules[name],
				className = config.type || Lava.schema.data.DEFAULT_MODULE_CLASS,
				constructor = Lava.ClassManager.getConstructor(className, 'Lava.data');

			// construction is split into two phases, cause initFields() may reference other modules
			// - this will result in recursive call to getModule().
			// In case of circular dependency, the first module must be already constructed.
			this._modules[name] = new constructor(this, config, name);
			this._modules[name].initFields();

		}

		return this._modules[name];

	},
		function (event_name, event_args) {

		this._fire(event_name, event_args);

	},
		function () {

		for (var name in this._modules) {
			this._modules[name].destroy();
		}

	}
	],
	[
		function (schema, raw_tag, parent_title) {

		var widget_config = Lava.parsers.Common.createDefaultWidgetConfig(),
			tags,
			name,
			x = raw_tag.x;

		widget_config['extends'] = parent_title;

		if (raw_tag.content) {

			// Lava.isVoidTag is a workaround for <x:attach_directives>
			// It's highly discouraged to make sugar from void tags
			if (Lava.isVoidTag(raw_tag.name) || !schema.content_schema) {

				tags = Lava.parsers.Common.asBlocks(raw_tag.content);
				tags = this._applyTopDirectives(tags, widget_config);
				if (Lava.schema.DEBUG && tags.length) Lava.t("Widget is not allowed to have any content: " + raw_tag.name);

			} else {

				if (Lava.schema.DEBUG && !(schema.content_schema.type in this._root_map)) Lava.t("Unknown type of content in sugar: " + schema.content_schema.type);
				this[this._root_map[schema.content_schema.type]](schema.content_schema, raw_tag, widget_config, schema.content_schema.name);

			}

		}

		if (raw_tag.attributes) {

			this._parseRootAttributes(schema, raw_tag, widget_config);

		}

		if (x) {

			if (Lava.schema.DEBUG && x) {
				for (name in x) {
					if (['label', 'roles', 'resource_id', 'controller'].indexOf(name) == -1) Lava.t("Control attribute is not allowed on sugar: " + name);
				}
			}

			if ('label' in x) this.setViewConfigLabel(widget_config, x.label);
			if ('roles' in x) widget_config.roles = Lava.parsers.Common.parseTargets(x.roles);
			if ('resource_id' in x) widget_config.resource_id = Lava.parsers.Common.parseResourceId(x.resource_id);
			if ('controller' in x) widget_config.real_class = x.controller;

		}

		return widget_config;

	},
		function (raw_blocks, widget_config) {

		var i = 0,
			count = raw_blocks.length,
			result = [];

		for (; i < count; i++) {

			if (raw_blocks[i].type == 'directive') {
				if (Lava.parsers.Directives.processDirective(raw_blocks[i], widget_config, true)) Lava.t("Directive inside sugar has returned a value: " + raw_blocks[i].name);
			} else {
				result = raw_blocks.slice(i);
				break;
			}

		}

		return result;

	},
		function (content_schema, raw_tag, widget_config, name) {

		if (Lava.schema.DEBUG && !name) Lava.t('Sugar: name for include is not provided');
		Lava.store(
			widget_config,
			'includes',
			name,
			raw_tag.content ? Lava.parsers.Common.compileTemplate(raw_tag.content, widget_config) : []
		);

	},
		function (content_schema, raw_tag, widget_config) {

		var tags = Lava.parsers.Common.asBlocks(raw_tag.content);
		tags = this._applyTopDirectives(tags, widget_config);
		if (tags.length) {
			Lava.parsers.Storage.parse(widget_config, tags);
		}

	},
		function (content_schema, raw_tag, widget_config) {

		var tags = Lava.parsers.Common.asBlocks(raw_tag.content),
			i = 0,
			count,
			tag_roles_map = content_schema.tag_roles,
			tag_schema,
			storage_tags = [];

		tags = this._applyTopDirectives(tags, widget_config);
		count = tags.length;

		for (; i < count; i++) {

			if (tags[i].name in tag_roles_map) {

				tag_schema = tag_roles_map[tags[i].name];
				this[this._union_handlers[tag_schema.type]](tag_schema, tags[i], widget_config, tag_schema.name || tags[i].name);

			} else {

				storage_tags.push(tags[i]);

			}

		}

		if (storage_tags.length) {

			Lava.parsers.Storage.parse(widget_config, storage_tags);

		}

	},
		function (content_schema, raw_tag, widget_config) {

		var tags = Lava.parsers.Common.asBlocks(raw_tag.content);
		tags = this._applyTopDirectives(tags, widget_config);
		if (tags.length) {
			Lava.parsers.Storage.parse(widget_config, [{
				type: 'tag',
				name: content_schema.name,
				content: tags
			}]);
		}

	},
		function (schema, raw_tag, widget_config) {

		var name,
			descriptor,
			unknown_attributes = {};

		for (name in raw_tag.attributes) {

			if (Lava.schema.DEBUG && name != 'id' && !schema.attribute_mappings) Lava.t('Sugar schema is missing attribute mappings for: ' + name);

			descriptor = (name == 'id') ? {type: 'id'} : schema.attribute_mappings[name];

			if (descriptor) {
				this[this._root_attributes_handlers[descriptor.type]](widget_config, raw_tag.attributes[name], descriptor, descriptor.name || name);
			} else {
				unknown_attributes[name] = raw_tag.attributes[name];
			}

		}

		if (!Firestorm.Object.isEmpty(unknown_attributes)) {

			if (Lava.schema.DEBUG && !schema.root_resource_name) Lava.t("Sugar: unknown attribute: " + name + ", for widget: " + raw_tag.name);
			this._storeAttributesAsResource(widget_config, unknown_attributes, schema.root_resource_name);

		}

	},
		function (widget_config, unknown_attributes, resource_name) {

		var value = {
				type: 'container_stack',
				value: []
			},
			operations_stack = value.value;

		if (!widget_config.resources) {

			widget_config.resources = {};

		}

		if (!widget_config.resources['default']) {

			widget_config.resources['default'] = {};

		}

		if ('class' in unknown_attributes) {

			operations_stack.push({
				name: 'add_classes',
				value: unknown_attributes['class'].trim().split(/\s+/)
			});
			delete unknown_attributes['class'];

		}

		if ('style' in unknown_attributes) {

			operations_stack.push({
				name: 'add_styles',
				value: Lava.parsers.Common.parseStyleAttribute(unknown_attributes.style)
			});
			delete  unknown_attributes.style;

		}

		if (!Firestorm.Object.isEmpty(unknown_attributes)) {

			operations_stack.push({
				name: 'add_properties',
				value: Firestorm.Object.copy(unknown_attributes) // copying to reduce possible slowdowns (object may contain deleted values)
			});

		}

		Lava.resources.putResourceValue(widget_config.resources['default'], resource_name, value);

	},
		function (widget_config, attribute_value) {

		if (Lava.schema.DEBUG && (!Lava.isValidId(attribute_value) || ('id' in widget_config))) Lava.t();
		widget_config.id = attribute_value;

	},
		function (widget_config, attribute_value, descriptor, name) {

		Lava.store(widget_config, 'options', name, Lava.valueToType(descriptor, attribute_value));

	},
		function (widget_config, attribute_value, descriptor, name) {

		Lava.store(widget_config, 'options',  name, (attribute_value == '') ? true : Lava.types.Boolean.fromString(attribute_value));

	},
		function (widget_config, attribute_value, descriptor, name) {

		Lava.store(widget_config, 'properties', name, Lava.valueToType(descriptor, attribute_value));

	},
		function (widget_config, attribute_value, descriptor, name) {

		Lava.store(widget_config, 'options', name, Lava.parsers.Common.parseTargets(attribute_value));

	},
		function (widget_config, attribute_value, descriptor, name) {

		Lava.store(
			widget_config,
			'options',
			name,
			Lava.ExpressionParser.parse(attribute_value, Lava.ExpressionParser.SEPARATORS.SEMICOLON)
		);

	}
	],
	[
		function () {

		if (!this._mouseover_stack_changed_listener) {
			Lava.view_manager.lendEvent('mouse_events');
			this._mouseover_stack_changed_listener = Lava.view_manager.on('mouseover_stack_changed', this._onMouseoverStackChanged, this);
			if (!this._tooltip) this._tooltip = Lava.createWidget(this.DEFAULT_TOOLTIP_WIDGET);
			this._tooltip.inject(document.body, 'Bottom');
		}

	},
		function () {

		if (this._mouseover_stack_changed_listener) {
			Lava.view_manager.releaseEvent('mouse_events');
			Lava.view_manager.removeListener(this._mouseover_stack_changed_listener);
			this._mouseover_stack_changed_listener = null;
			if (this._mousemove_listener) {
				Lava.Core.removeGlobalHandler(this._mousemove_listener);
				this._mousemove_listener = null;
			}
			this._tooltip.set('is_visible', false);
			this._tooltip.remove();
		}

	},
		function () {

		return this._mouseover_stack_changed_listener != null;

	},
		function (view_manager, stack) {

		var new_tooltip_target = null,
			html;

		for (var i = 0, count = stack.length; i < count; i++) {

			if (Firestorm.Element.hasAttribute(stack[i], this._attribute_name)) {

				new_tooltip_target = stack[i];
				break;

			}

		}

		if (new_tooltip_target != this._tooltip_target) {

			if (!this._tooltip_target) { // if there was no tooltip

				if (Lava.schema.DEBUG && this._mousemove_listener) Lava.t();
				this._mousemove_listener = Lava.Core.addGlobalHandler('mousemove', this._onMouseMove, this);
				this._tooltip.set('is_visible', true);

			} else if (!new_tooltip_target) { // if there was a tooltip, and now it should be hidden

				Lava.Core.removeGlobalHandler(this._mousemove_listener);
				this._mousemove_listener = null;
				this._tooltip.set('is_visible', false);

			}

			if (new_tooltip_target) {

				html = Firestorm.Element.getAttribute(new_tooltip_target, this._attribute_name).replace(/\r?\n/g, '<br/>');
				this._tooltip.set('html', html);
				this._tooltip.set('is_visible', !!(html || !Lava.schema.popover_manager.HIDE_EMPTY_TOOLTIPS));

			}

			this._tooltip_target = new_tooltip_target;

		}

	},
		function (event_name, event_object) {

		this._tooltip.set('x', event_object.page.x); // left
		this._tooltip.set('y', event_object.page.y); // top

	},
		function () {

		this.isEnabled() && this.disable();

	}
	],
	[
		function () {

		if (!this._focus_acquired_listener) {
			this._focus_acquired_listener = Lava.app.on('focus_acquired', this._onFocusTargetAcquired, this);
			this._focus_lost_listener = Lava.app.on('focus_lost', this.clearFocusedTarget, this);
			this._focus_listener = Lava.Core.addGlobalHandler('blur', this._onElementBlurred, this);
			this._blur_listener = Lava.Core.addGlobalHandler('focus', this._onElementFocused, this);
		}

	},
		function () {

		if (this._focus_acquired_listener) {
			Lava.app.removeListener(this._focus_acquired_listener);
			Lava.app.removeListener(this._focus_lost_listener);
			Lava.Core.removeGlobalHandler(this._focus_listener);
			Lava.Core.removeGlobalHandler(this._blur_listener);
			this._focus_acquired_listener
				= this._focused_element
				= this._focus_target
				= null;
		}

	},
		function () {

		return this._focus_acquired_listener != null;

	},
		function () {

		return this._focus_target;

	},
		function () {

		return this._focused_element;

	},
		function (new_target) {

		// will be implemented later
		//if (this._focus_target && this._focus_target != new_target) {
		//	this._focus_target.informFocusLost();
		//}

		if (this._focus_target != new_target) {
			this._focus_target = new_target;
			this._fire('focus_target_changed', new_target);
		}

	},
		function () {

		this._setTarget(null);
		this._focused_element = null;

	},
		function (event_name, event_object) {

		if (this._focused_element != event_object.target) {
			this._setTarget(null);
			this._focused_element = event_object.target;
		}

	},
		function (app, event_args) {

		this._setTarget(event_args.target);
		this._focused_element = event_args.element;

	},
		function () {

		this._setTarget(null);

	},
		function () {

		if (this._focused_element) {
			this._focused_element.blur();
			this._focused_element = document.activeElement || null;
		}
		this._setTarget(null);

	},
		function () {

		this.isEnabled() && this.disable();

	}
	],
	[
		function (module, name, config, module_storage) {

		this._module = module;
		this._name = name;
		this._config = config;
		this._properties_by_guid = module_storage;
		if ('is_nullable' in config) this._is_nullable = config.is_nullable;

	},
		function (default_properties) {},
		function (value) {

		return typeof(value) != 'undefined' && (value !== null || this._is_nullable);

	},
		function (value) {

		var reason = null;

		if (typeof(value) == 'undefined') {

			reason = "Undefined is not a valid value";

		} else if (value == null && !this._is_nullable) {

			reason = "Cannot assign null to non-nullable field";

		}

		return reason;

	},
		function () {

		return this._is_nullable;

	},
		function (record, properties) {},
		function (record, properties, raw_properties) {},
		function (record, destination_object) {
		Lava.t("Abstract function call: export");
	},
		function (record, properties) {
		Lava.t("Abstract function call: getValue");
	},
		function (record, properties, value) {
		Lava.t("Abstract function call: setValue");
	},
		function (record) {

		this._fire('changed', {record: record});
		record.firePropertyChangedEvents(this._name);

	},
		function (properties, raw_properties) {

		if (Lava.schema.data.VALIDATE_IMPORT_DATA && !this.isValidValue(raw_properties[this._name]))
			Lava.t('Invalid value in import data (' + this._name + '): ' + raw_properties[this._name]);

		return raw_properties[this._name];

	},
		function (record_a, record_b) {

		return this._properties_by_guid[record_a.guid][this._name] < this._properties_by_guid[record_b.guid][this._name];

	},
		function (record_a, record_b) {

		return this._properties_by_guid[record_a.guid][this._name] == this._properties_by_guid[record_b.guid][this._name];

	},
		function () {

		this._properties_by_guid = this._module = null;

	}
	],
	[
		function (module, name, config, module_storage) {

		this.Abstract$init(module, name, config, module_storage);

		if ('default' in config) {

			this._default = config['default'];

		}

		if (!this._is_nullable && this._default == null) {

			// the default value could be provided in derived classes
			Lava.t("Non-nullable Basic fields must have a default value");

		}

		if (Lava.schema.DEBUG && !this.isValidValue(this._default))
			Lava.t("Field was configured with invalid default value. Module: " + this._module.getName() + ", field name: " + this._name);

	},
		function (default_properties) {

		default_properties[this._name] = this._default;

	},
		function (record, properties, raw_properties) {

		if (this._name in raw_properties) {

			properties[this._name] = this._getImportValue(properties, raw_properties);

		}

	},
		function (record, destination_object) {

		destination_object[this._name] = this._properties_by_guid[record.guid][this._name];

	},
		function (record, properties) {

		return properties[this._name];

	},
		function (record, properties, value) {

		if (properties[this._name] !== value) {

			if (Lava.schema.data.VALIDATE_VALUES && !this.isValidValue(value)) Lava.t('[Field name=' + this._name + '] Invalid field value: '
				+ value + ". Reason: " + this.getInvalidReason(value));

			properties[this._name] = value;
			this._fireFieldChangedEvents(record);

		}

	}
	],
	[
		function (module, name, config, module_storage) {

		this.Abstract$init(module, name, config, module_storage);

		if (Lava.schema.DEBUG && !config.record_field)
			Lava.t("Missing corresponding Record field. Record fields are used by Collection fields.");

		this._target_record_field_name = config.record_field;

	},
		function (default_properties) {

		this._target_module = (this._config.module == 'this') ? this._module : this._module.getApp().getModule(this._config.module);
		this._target_record_field = this._target_module.getField(this._target_record_field_name);
		this._record_removed_listener = this._target_record_field.on('removed_child', this._onRecordRemoved, this);
		this._record_added_listener = this._target_record_field.on('added_child', this._onRecordAdded, this);

		if (!this._target_record_field.isRecordField) Lava.t('CollectionField: mirror field is not Record field');

		if (this._target_record_field.getReferencedModule() !== this._module)
			Lava.t("CollectionField: module mismatch with mirror Record field");

	},
		function (field, event_args) {

		var local_record = event_args.collection_owner;
		if (local_record.guid in this._collections_by_record_guid) {
			Lava.suspendListener(this._collection_listeners_by_guid[local_record.guid].removed);
			this._collections_by_record_guid[local_record.guid].removeValue(event_args.child);
			Lava.resumeListener(this._collection_listeners_by_guid[local_record.guid].removed);
		}

	},
		function (field, event_args) {

		var local_record = event_args.collection_owner;
		if (local_record.guid in this._collections_by_record_guid) {
			Lava.suspendListener(this._collection_listeners_by_guid[local_record.guid].added);
			this._collections_by_record_guid[local_record.guid].includeValue(event_args.child);
			Lava.suspendListener(this._collection_listeners_by_guid[local_record.guid].added);
		}

	},
		function () {

		// You can not assign anything to Collection fields.
		// They can only be imported and are updated automatically, when corresponding Record field changes
		return false;

	},
		function () {

		return  'Collection field does not support setValue';

	},
		function (record, properties, raw_properties) {

		if (raw_properties[this._name]) {

			if (Lava.schema.data.VALIDATE_IMPORT_DATA && !Array.isArray(raw_properties[this._name]))
				Lava.t('Invalid value in import data');

			var i = 0,
				records = this._target_module.loadRecords(raw_properties[this._name]),
				count = records.length;

			for (; i < count; i++) {

				records[i].set(this._target_record_field_name, record);

			}

		}

	},
		function (record, destination_object) {

	},
		function (record, properties) {

		var guid = record.guid,
			collection;

		if (!(guid in this._collections_by_record_guid)) {

			collection = new Lava.system.Enumerable(this._target_record_field.getCollection(record));
			this._collections_by_record_guid[guid] = collection;
			this._collection_listeners_by_guid[guid] = {
				added: collection.on('items_added', this._onCollectionRecordsAdded, this),
				removed: collection.on('items_removed', this._onCollectionRecordsRemoved, this)
			};
			this._collection_guid_to_record[collection.guid] = record;

		}

		return this._collections_by_record_guid[guid];

	},
		function (collection, event_args) {

		this._setCollectionOwner(event_args.values, this._collection_guid_to_record[collection.guid]);

	},
		function (collection, event_args) {

		this._setCollectionOwner(event_args.values, null);

	},
		function (records, new_value) {

		var i = 0,
			count = records.length,
			record;

		for (; i < count; i++) {

			record = records[i];
			// everything else will be done by the Record field
			// also, it will raise an event to remove the record from Enumerable
			record.set(this._target_record_field_name, new_value);

		}

	},
		function (record, properties) {

		return this._target_record_field.getCollectionCount(record);

	},
		function () {

		Lava.t('Trying to set Collection field value');

	},
		function (record_a, record_b) {

		return this._target_record_field.getCollectionCount(record_a) < this._target_record_field.getCollectionCount(record_b);

	},
		function (record_a, record_b) {

		return this._target_record_field.getCollectionCount(record_a) == this._target_record_field.getCollectionCount(record_b);

	},
		function () {

		var guid;

		for (guid in this._collections_by_record_guid) {

			this._collections_by_record_guid[guid].destroy();

		}

		this._target_record_field.removeListener(this._record_removed_listener);
		this._target_record_field.removeListener(this._record_added_listener);

		this._target_module
			= this._collections_by_record_guid
			= this._collection_listeners_by_guid
			= this._collection_guid_to_record
			= this._target_record_field = null;

		this.Abstract$destroy();

	}
	],
	[
		/^(\-|\+)?([1-9]\d*|0)$/,
		function (value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'number' && this.VALID_VALUE_REGEX.test(value));

	},
		function (value) {

		var reason = this.Basic$getInvalidReason(value);

		if (!reason) {

			if (typeof(value) != 'number') {

				reason = "Value is not a number";

			} else if (this.VALID_VALUE_REGEX.test(value)) {

				reason = "Value is not an integer";

			}

		}

		return reason;

	}
	],
	[
		/^[1-9]\d*$/,
		function (module, name, config, module_storage) {

		if (Lava.schema.DEBUG && (('is_nullable' in config) || ('default' in config)))
			Lava.t("Standard ID field can not be configured as nullable or have a default value");

		this.Abstract$init(module, name, config, module_storage);

	},
		function (default_properties) {

		default_properties[this._name] = null;

	},
		function (value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'number' && this.VALID_VALUE_REGEX.test(value));

	},
		function (value) {

		var reason = this.Abstract$getInvalidReason(value);

		if (!reason) {

			if (typeof(value) != 'number') {

				reason = "Value is not a number";

			} else if (this.VALID_VALUE_REGEX.test(value)) {

				reason = "Valid values for ID field are positive integers";

			}

		}

		return reason;

	},
		function (record, properties, raw_properties) {

		if (this._name in raw_properties) {

			properties[this._name] = this._getImportValue(properties, raw_properties);

		} else {

			Lava.t("Import record must have an ID");

		}

	},
		function (record, destination_object) {

		destination_object[this._name] = this._properties_by_guid[record.guid][this._name];

	},
		function (record, properties) {

		return properties[this._name];

	},
		function () {

		Lava.t("Standard id field must not be set");

	}
	],
	[
		function (record, properties) {

		this._registerByForeignKey(record, properties[this._name]);
		this.Basic$initNewRecord(record, properties);

	},
		function (record, properties, raw_properties) {

		this._registerByForeignKey(record, raw_properties[this._name] || properties[this._name]);// it may have a default
		this.Basic$import(record, properties, raw_properties);

	},
		function (record, foreign_key) {

		if (foreign_key in this._collections_by_foreign_id) {

			this._collections_by_foreign_id[foreign_key].push(record);

		} else {

			this._collections_by_foreign_id[foreign_key] = [record];

		}

	},
		function (record, properties, new_foreign_key) {

		Firestorm.Array.exclude(this._collections_by_foreign_id[properties[this._name]], record);
		this._registerByForeignKey(record, new_foreign_key);

		this.Basic$setValue(record, properties, new_foreign_key);

	},
		function (foreign_key) {

		return (foreign_key in this._collections_by_foreign_id) ? this._collections_by_foreign_id[foreign_key].slice() : [];

	},
		function () {

		this._collections_by_foreign_id = null;
		this.Basic$destroy();

	}
	],
	[
		function (module, name, config, module_storage) {

		this.Abstract$init(module, name, config, module_storage);
		this._referenced_module = (config.module == 'this') ? module : module.getApp().getModule(config.module);

	},
		function (default_properties) {

		if (this._config.foreign_key_field) {

			if (Lava.schema.DEBUG && !this._referenced_module.hasField('id')) Lava.t("field/Record: the referenced module must have an ID field");

			this._foreign_key_field_name = this._config.foreign_key_field;
			this._foreign_key_field = this._module.getField(this._foreign_key_field_name);
			if (Lava.schema.DEBUG && !this._foreign_key_field.isForeignKey) Lava.t();
			this._foreign_key_changed_listener = this._foreign_key_field.on('changed', this._onForeignKeyChanged, this);
			this._external_id_field = this._referenced_module.getField('id');
			this._external_id_changed_listener = this._external_id_field.on('changed', this._onExternalIdCreated, this);
			this._external_records_loaded_listener = this._referenced_module.on('records_loaded', this._onReferencedModuleRecordsLoaded, this);

		}

		// this field stores the referenced record
		default_properties[this._name] = null;

	},
		function (module, event_args) {

		var records = event_args.records,
			count = records.length,
			i = 0,
			local_records,
			local_count,
			local_index,
			local_record;

		for (; i < count; i++) {

			local_records = this._foreign_key_field.getCollection(records[i].get('id'));

			// these records belong to this module and have this field null.
			// Now, as the foreign record is loaded - the field can be updated.
			for (local_count = local_records.length, local_index = 0; local_index < local_count; local_index++) {
				local_record = local_records[local_index];
				this._properties_by_guid[local_record.guid][this._name] = records[i];
				this._fireFieldChangedEvents(local_record);
			}

		}

	},
		function (foreign_module_id_field, event_args) {

		var referenced_record = event_args.record, // record belongs to foreign module
			new_referenced_id = referenced_record.get('id'),
			collection,
			i = 0,
			count;

		if (referenced_record.guid in this._collections_by_foreign_guid) {

			collection = this._collections_by_foreign_guid[referenced_record.guid];

			// Set the value of foreign ID field in all local records that reference this foreign record.
			// Situation: there is a new record, which was created in the browser, and some records that reference it
			// (either new or loaded from database). It's new, so there are no records on server that reference it.
			if (this._foreign_key_field) {

				Lava.suspendListener(this._foreign_key_changed_listener);

				for (count = collection.length; i < count; i++) {

					collection[i].set(this._foreign_key_field_name, new_referenced_id);

				}

				Lava.resumeListener(this._foreign_key_changed_listener);

			}

		}

	},
		function (foreign_key_field, event_args) {

		var record = event_args.record, // record belongs to this module
			properties = this._properties_by_guid[record.guid];

		if (properties[this._name] != null) {

			// remove old record from collection
			this._unregisterRecord(record, properties[this._name]);

		}

		if (properties[this._foreign_key_field_name]) {

			this._registerByReferencedId(record, properties, properties[this._foreign_key_field_name]);

		} else {

			properties[this._name] = null;

		}

		this._fireFieldChangedEvents(record);

	},
		function (new_record) {

		return (
				(new_record === null && this._is_nullable)
				|| (typeof(new_record) != 'undefined'
					&& new_record.isRecord
					&& new_record.getModule() === this._referenced_module)
			);

	},
		function (value) {

		var reason = this.Abstract$getInvalidReason(value);

		if (!reason) {

			if (!value.isRecord) {

				reason = "Value is not record";

			} else if (value.getModule() === this._referenced_module) {

				reason = "Value is from different module than this field refers to";

			}

		}

		return reason;

	},
		function (record, properties) {

		if (this._foreign_key_field && properties[this._foreign_key_field_name]) {

			this._registerByReferencedId(record, properties, properties[this._foreign_key_field_name]);

		}

	},
		function (record, properties, raw_properties) {

		var foreign_id;

		if (this._foreign_key_field) {

			// if foreign id is in import - then it will replace the default value (if foreign kay has default)
			foreign_id = raw_properties[this._foreign_key_field_name] || properties[this._foreign_key_field_name];
			if (foreign_id) {
				this._registerByReferencedId(record, properties, foreign_id);
			}

		}

	},
		function (record, properties, referenced_record_id) {

		properties[this._name] = this._referenced_module.getRecordById(referenced_record_id) || null;

		if (properties[this._name]) {

			this._registerRecord(record, properties[this._name]);

		}

	},
		function (record, destination_object) {

	},
		function (record, properties) {

		return properties[this._name];

	},
		function (record, properties, new_ref_record) {

		if (Lava.schema.data.VALIDATE_VALUES && !this.isValidValue(new_ref_record))
			Lava.t("Field/Record: assigned value is not valid. Reason: " + this.getInvalidReason(new_ref_record));

		if (properties[this._name] != null) {

			// remove from the old record's collection
			this._unregisterRecord(record, properties[this._name]);

		}

		properties[this._name] = new_ref_record;
		if (new_ref_record != null) {

			this._registerRecord(record, new_ref_record)

		}

		if (this._foreign_key_field) {

			Lava.suspendListener(this._foreign_key_changed_listener);

			if (new_ref_record != null) {

				// if this module has foreign_key_field then foreign module must have an ID column
				record.set(this._foreign_key_field_name, new_ref_record.get('id'));

			} else {

				record.set(this._foreign_key_field_name, this.EMPTY_FOREIGN_ID);

			}

			Lava.resumeListener(this._foreign_key_changed_listener);

		}

		this._fireFieldChangedEvents(record);

	},
		function (local_record, referenced_record) {

		if (!Firestorm.Array.exclude(this._collections_by_foreign_guid[referenced_record.guid], local_record)) Lava.t();
		this._fire('removed_child', {
			collection_owner: referenced_record,
			child: local_record
		});

	},
		function (local_record, referenced_record) {

		var referenced_guid = referenced_record.guid;

		if (referenced_guid in this._collections_by_foreign_guid) {

			if (Lava.schema.DEBUG && this._collections_by_foreign_guid[referenced_guid].indexOf(local_record) != -1)
				Lava.t("Duplicate record");
			this._collections_by_foreign_guid[referenced_guid].push(local_record);

		} else {

			this._collections_by_foreign_guid[referenced_guid] = [local_record];

		}

		this._fire('added_child', {
			collection_owner: referenced_record,
			child: local_record
		});

	},
		function (referenced_record) {

		return (referenced_record.guid in this._collections_by_foreign_guid)
			? this._collections_by_foreign_guid[referenced_record.guid].slice()
			: []; // fast operation: array of objects

	},
		function (referenced_record) {

		var collection = this._collections_by_foreign_guid[referenced_record.guid];
		return collection ? collection.length : 0;

	},
		function () {

		return this._referenced_module;

	},
		function (record) {

		if (Lava.schema.DEBUG && !(record.guid in this._properties_by_guid)) Lava.t("isLess: record does not belong to this module");
		var ref_record_a = this._properties_by_guid[record.guid][this._name];
		// must return undefined, cause comparison against nulls behaves differently
		return ref_record_a ? ref_record_a.get('id') : void 0;

	},
		function (record_a, record_b) {

		return this._getComparisonValue(record_a) < this._getComparisonValue(record_b);

	},
		function (record_a, record_b) {

		return this._getComparisonValue(record_a) == this._getComparisonValue(record_b);

	},
		function () {

		if (this._config.foreign_key_field) {

			this._foreign_key_field.removeListener(this._foreign_key_changed_listener);
			this._external_id_field.removeListener(this._external_id_changed_listener);

		}

		this._referenced_module.removeListener(this._external_records_loaded_listener);

		this._referenced_module
			= this._collections_by_foreign_guid
			= this._foreign_key_field
			= this._external_id_field
			= null;

		this.Abstract$destroy();

	}
	],
	[
		function (value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'boolean');

	},
		function (value) {

		var reason = this.Basic$getInvalidReason(value);

		if (!reason && typeof(value) != 'boolean') {

			reason = "Value is not boolean type";

		}

		return reason;

	}
	],
	[
		function (record, destination_object) {

		destination_object['guid'] = record.guid;

	},
		function (record, properties) {

		return record.guid;

	},
		function (record, properties, value) {

		Lava.t('Guid field is read only');

	}
	],
	[
		function (config) {

		var field_name,
			type,
			constructor;

		for (field_name in config.fields) {

			type = config.fields[field_name].type || Lava.schema.data.DEFAULT_FIELD_TYPE;
			constructor = Lava.ClassManager.getConstructor(type, 'Lava.data.field');
			this._fields[field_name] = new constructor(
				this,
				field_name,
				config.fields[field_name],
				this._properties_by_guid
			);

		}

	},
		function () {

		var default_properties = {},
			field_name;

		for (field_name in this._fields) {

			this._fields[field_name].onModuleFieldsCreated(default_properties);

		}

		this._createRecordProperties = new Function(
			"return " + Lava.serializer.serialize(default_properties)
		);

	},
		function () {

		Lava.t('Module requires initialization');

	},
		function () {

		return this._records.slice();

	},
		function () {

		return this._records.length;

	},
		function () {

		var name;
			//i = 0,
			//count = this._records.length;

		/*for (; i < count; i++) {

			this._records[i].destroy();

		}*/

		for (name in this._fields) {

			this._fields[name].destroy();

		}

		this._records = this._records_by_guid = this._properties_by_guid = this._fields = null;

	}
	],
	[
		function (lava_app, config, name) {

		this._app = lava_app;
		this._config = config;
		this._name = name;

		this._createFields(config);

		this._record_constructor = Lava.ClassManager.getConstructor(
			config.record_class || Lava.schema.data.DEFAULT_RECORD_CLASS,
			'Lava.data'
		);

		if ('id' in this._fields) {

			this._has_id = true;
			this._fields['id'].on('changed', this._onRecordIdChanged, this);

		}

	},
		function (id_field, event_args) {

		var id = event_args.record.get('id');
		if (id in this._records_by_id) Lava.t("Duplicate record id in module " + this._name);
		this._records_by_id[id] = event_args.record;

	},
		function (name) {

		return name in this._fields;

	},
		function (name) {

		return this._fields[name];

	},
		function (id) {

		return this._records_by_id[id];

	},
		function (guid) {

		return this._records_by_guid[guid];

	},
		function () {

		return this._app;

	},
		function (raw_properties) {

		var result;

		if (Lava.schema.DEBUG && !raw_properties.id) Lava.t('safeLoadRecord: import data must have an id');

		if (raw_properties.id in this._records_by_id) {

			result = this._records_by_id[raw_properties.id];

		} else {

			result = this.loadRecord(raw_properties);

		}

		return result;

	},
		function (raw_properties) {

		var record = this._createRecordInstance(raw_properties);
		this._fire('records_loaded', {records: [record]});
		return record;

	},
		function () {

		var record = this._createRecordInstance();
		this._fire('records_created', {records: [record]});
		return record;

	},
		function (raw_properties) {

		var properties = this._createRecordProperties(),
			record = new this._record_constructor(this, this._fields, properties, raw_properties);

		if (properties.id) {

			if (properties.id in this._records_by_id) Lava.t("Duplicate record id in module " + this._name);
			this._records_by_id[properties.id] = record;

		}

		this._records.push(record);
		this._properties_by_guid[record.guid] = properties;
		this._records_by_guid[record.guid] = record;
		return record;

	},
		function (raw_records_array) {

		var i = 0,
			count = raw_records_array.length,
			records = [];

		for (; i < count; i++) {

			records.push(this._createRecordInstance(raw_records_array[i]));

		}

		this._fire('records_loaded', {records: records});

		return records;

	},
		function () {

		this._records_by_id = null;
		this.ModuleAbstract$destroy();

	}
	],
	[
		function (module, fields, properties_ref, raw_properties) {

		this.guid = Lava.guid++;
		this._module = module;
		this._fields = fields;
		this._properties = properties_ref;

		var field;

		if (typeof(raw_properties) != 'undefined') {

			for (field in fields) {

				fields[field]['import'](this, properties_ref, raw_properties);

			}

		} else {

			for (field in fields) {

				fields[field].initNewRecord(this, properties_ref);

			}

		}

	},
		function (name) {

		if (Lava.schema.DEBUG && !(name in this._fields)) Lava.t('[Record] No such field: ' + name);
		return this._fields[name].getValue(this, this._properties);

	},
		function (name, value) {

		if (Lava.schema.DEBUG && !(name in this._fields)) Lava.t('[Record] No such field: ' + name);
		this._fields[name].setValue(this, this._properties, value);

	},
		function () {

		return this._module;

	},
		function () {

		var export_record = {};

		for (var field in this._fields) {

			this._fields[field]['export'](this, export_record);

		}

		return export_record;

	}
	],
	[
		function (module, fields, properties_ref, raw_properties, original_record) {

		this.Record$init(module, fields, properties_ref, raw_properties);

		if (original_record) {

			this._original_record = original_record;

		}

	},
		function () {

		return this._original_record;

	}
	],
	[
		function (config) {

		if ('id' in config.fields) Lava.t("Id field in MetaStorage is not permitted");

		this._config = config;
		this._createFields(config);
		this.initFields(); // MetaStorage is constructed directly, not via App class

		var field;

		if (Lava.schema.DEBUG) {
			for (field in this._fields) {
				if (this._fields[field].isCollectionField || this._fields[field].isRecordField)
					Lava.t("Standard Collection and Record fields will not work inside the MetaStorage");
			}
		}

		this._record_constructor = Lava.ClassManager.getConstructor('MetaRecord', 'Lava.data');

	},
		function (ext_guid) {

		return this._properties[ext_guid];

	},
		function () {

		Lava.t("MetaStorage: set operation is not permitted");

	},
		function (ext_guid, raw_properties, original_record) {

		if (ext_guid in this._properties) Lava.t("MetaRecord already exists");

		var properties = this._createRecordProperties(),
			record = new this._record_constructor(this, this._fields, properties, raw_properties, original_record);

		record.ext_guid = ext_guid;
		this._records.push(record);
		this._properties_by_guid[record.guid] = properties;
		this._records_by_guid[record.guid] = record;

		this._properties[ext_guid] = record;
		this.firePropertyChangedEvents(ext_guid);

		return record;

	}
	],
	[
		function (property_name) {

		if (!(property_name in this._data_bindings_by_property)) {

			this._data_bindings_by_property[property_name] = new Lava.scope.DataBinding(this, property_name);

		}

		return this._data_bindings_by_property[property_name];

	},
		function (name_source_scope) {

		if (Lava.schema.DEBUG && !name_source_scope.guid) Lava.t("Only PropertyBinding and DataBinding may be used as name source for segments");

		if (!(name_source_scope.guid in this._data_segments)) {

			this._data_segments[name_source_scope.guid] = new Lava.scope.Segment(this, name_source_scope);

		}

		return this._data_segments[name_source_scope.guid];

	},
		function () {

		var name;

		for (name in this._data_bindings_by_property) {

			this._data_bindings_by_property[name].destroy();

		}

		for (name in this._data_segments) {

			this._data_segments[name].destroy();

		}

		this.suspendRefreshable();

	}
	],
	[
		function (config, view, widget) {

		this.guid = Lava.guid++;
		this._view = view;
		this._widget = widget;
		this._evaluator = config.evaluator;

		var i = 0,
			count,
			bind,
			binds = config.binds;

		if (binds) {

			for (count = binds.length; i < count; i++) {

				if (binds[i].isDynamic) {

					bind = view.locateViewByPathConfig(binds[i]).getDynamicScope(view, binds[i]);

				} else {

					bind = view.getScopeByPathConfig(binds[i]);

				}

				this._binds.push(bind);
				this._bind_changed_listeners.push(bind.on('changed', this.onBindingChanged, this));

				if (this.level < bind.level) {

					this.level = bind.level;

				}

			}

			this.level++;

		}

		if ('modifiers' in config) {

			for (i = 0, count = config.modifiers.length; i < count; i++) {

				this._modifier_descriptors.push({
					widget: this.getWidgetByModifierConfig(config.modifiers[i]),
					callback_name: config.modifiers[i].callback_name
				});

			}

		}

		/*if ('active_modifiers' in config) {

			for (i = 0, count = config.active_modifiers.length; i < count; i++) {

				this._active_modifiers.push({
					widget: this.getWidgetByModifierConfig(config.active_modifiers[i]),
					callback_name: config.active_modifiers[i].callback_name
				});

			}

		}*/

		this._binds_count = this._binds.length;
		this._value = this._evaluate();

	},
		function (path_config) {

		var widget = this._widget.locateViewByPathConfig(path_config);
		if (Lava.schema.DEBUG && !widget.isWidget) Lava.t("Tried to call a modifier from non-widget view");

		return /** @type {Lava.widget.Standard} */ widget;

	},
		function () {

		this._queueForRefresh();

	},
		function () {

		var result = null;

		// in production - wrap evaluation into try/catch block
		if (Lava.schema.DEBUG) {

			result = this._evaluator();

		} else {

			try {

				result = this._evaluator();

			} catch (e) {

				Lava.logException(e);

			}

		}

		return result;

	},
		function () {

		return this._value;

	},
		function () {

		var new_value = this._evaluate(),
			event_args;

		if (new_value !== this._value) {

			event_args = {old_value: this._value};
			this._value = new_value;
			this._fire('changed', event_args);

		}

	},
		function (index, arguments_array) {

		return this._modifier_descriptors[index].widget.callModifier(this._modifier_descriptors[index].callback_name, arguments_array);

	},
		function (index, arguments_array) {

	},
		function (name, arguments_array) {

		if (Lava.schema.DEBUG && !(name in Lava.modifiers)) Lava.t("Unknown global modifier: " + name);
		return Lava.modifiers[name].apply(Lava.modifiers, arguments_array);

	},
		function () {

		for (var i = 0, count = this._bind_changed_listeners.length; i < count; i++) {

			this._binds[i].removeListener(this._bind_changed_listeners[i]);

		}

		this._bind_changed_listeners = null;
		this.suspendRefreshable();

	}
	],
	[
		function (config, widget) {

		this._widget = widget;
		this._property_name = config.property_name;
		this._scope = widget.getScopeByPathConfig(config.path_config);

		if (config.from_widget) {

			this._scope.setValue(this._widget.get(this._property_name));

		} else {

			this._widget.set(this._property_name, this._scope.getValue());
			this._scope_changed_listener = this._scope.on('changed', this.onScopeChanged, this);

		}

		if (!this._scope.isSetValue) Lava.t("Binding: bound scope does not implement setValue");
		this._widget_property_changed_listener = widget.onPropertyChanged(this._property_name, this.onWidgetPropertyChanged, this);

	},
		function () {

		// avoid setting nulls to non-nullable fields.
		if (this._scope.isConnected()) {

			// turning off both of them to avoid infinite loop. From architect's point of view, better solution would be
			// to hang up developer's browser, but if it happens in production - it may have disastrous consequences.
			Lava.suspendListener(this._widget_property_changed_listener);
			this._scope_changed_listener && Lava.suspendListener(this._scope_changed_listener);
			this._widget.set(this._property_name, this._scope.getValue());
			Lava.resumeListener(this._widget_property_changed_listener);
			this._scope_changed_listener && Lava.resumeListener(this._scope_changed_listener);

		}

	},
		function () {

		Lava.suspendListener(this._widget_property_changed_listener);
		this._scope_changed_listener && Lava.suspendListener(this._scope_changed_listener);
		this._scope.setValue(this._widget.get(this._property_name));
		Lava.resumeListener(this._widget_property_changed_listener);
		this._scope_changed_listener && Lava.resumeListener(this._scope_changed_listener);

	},
		function () {

		this._scope_changed_listener && this._scope.removeListener(this._scope_changed_listener);
		this._widget.removePropertyListener(this._widget_property_changed_listener);

	}
	],
	[
		function (value_container, property_name) {

		this.guid = Lava.guid++;
		this._value_container = value_container;
		this._property_name = property_name;
		this.level = value_container.level + 1;
		this._container_changed_listener = value_container.on('changed', this.onParentDataSourceChanged, this);
		this._refreshValue();

		Lava.schema.DEBUG_SCOPES && Lava.ScopeManager.debugTrackScope(this);

	},
		function () {

		var property_container = this._value_container.getValue(),
			value = null,
			is_connected = false;

		if (property_container != null) {

			// Collection implements Properties, so if _property_name is not a number - then `get` will be called
			if (property_container.isCollection && /^\d+$/.test(this._property_name)) {

				if (this._enumerable_changed_listener == null) {

					this._enumerable_changed_listener = property_container.on('collection_changed', this.onValueChanged, this);
					this._property_container = property_container;

				}

				value = property_container.getValueAt(+this._property_name);

			} else if (property_container.isProperties) {

				if (this._property_changed_listener == null) {

					this._property_changed_listener = property_container.onPropertyChanged(this._property_name, this.onValueChanged, this);
					this._property_container = property_container;

				}

				value = property_container.get(this._property_name);

			} else {

				value = property_container[this._property_name];

			}

			is_connected = true;

		}

		if (value !== this._value || this._is_connected != is_connected) {

			this._value = value;
			this._is_connected = is_connected;

			this._fire('changed');

		}

	},
		function () {

		return this._is_connected;

	},
		function () {

		if (this._property_changed_listener && (this._value_container.getValue() != this._property_container)) {

			// currently listening to the parent's old data source
			this._property_changed_listener && this._property_container.removePropertyListener(this._property_changed_listener);
			this._enumerable_changed_listener && this._property_container.removeListener(this._enumerable_changed_listener);
			this._property_changed_listener = null;
			this._enumerable_changed_listener = null;
			this._property_container = null;

		}

		this._queueForRefresh();

	},
		function () {

		this._refreshValue();

	},
		function () {

		this._queueForRefresh();

	},
		function (value) {

		var property_container = this._value_container.getValue();

		if (property_container) {

			if (this._property_changed_listener) {

				Lava.suspendListener(this._property_changed_listener);
				property_container.set(this._property_name, value);
				Lava.resumeListener(this._property_changed_listener);

			} else if (this._enumerable_changed_listener) {

				Lava.suspendListener(this._enumerable_changed_listener);
				property_container.replaceAt(+this._property_name, value);
				Lava.resumeListener(this._enumerable_changed_listener);

			} else if (property_container.isProperties) {

				property_container.set(this._property_name, value);

			} else {

				property_container[this._property_name] = value;

			}

			this._queueForRefresh();

		}

	},
		function () {

		return this._value;

	},
		function () {

		this._value_container.removeListener(this._container_changed_listener);

		this._property_changed_listener && this._property_container.removePropertyListener(this._property_changed_listener);
		this._enumerable_changed_listener && this._property_container.removeListener(this._enumerable_changed_listener);
		this._property_container = null;

		Lava.schema.DEBUG_SCOPES && Lava.ScopeManager.debugStopTracking(this);
		this.Abstract$destroy();

	}
	],
	[
		function (argument, view, widget, config) {

		var i = 0,
			count,
			depends,
			bind;

		this.guid = Lava.guid++;
		this._argument = argument;
		this._view = view;
		this._widget = widget;
		this.level = argument.level + 1;

		if (config) {

			if (Lava.schema.DEBUG && ['Enumerable', 'DataView'].indexOf(config['own_enumerable_mode']) == -1) Lava.t('Unknown value in own_enumerable_mode option: ' + config['own_enumerable_mode']);

			if (config['own_enumerable_mode'] == "DataView") {
				this._refreshDataSource = this._refreshDataSource_DataView;
				this._value = new Lava.system.DataView();
			} else {
				this._refreshDataSource = this._refreshDataSource_Enumerable;
				this._value = new Lava.system.Enumerable();
			}

			this._own_collection = true;

			if (config['depends']) {

				depends = config['depends'];
				this._binds = [];
				this._bind_changed_listeners = [];

				for (count = depends.length; i < count; i++) {

					if (depends[i].isDynamic) {

						bind = view.locateViewByPathConfig(depends[i]).getDynamicScope(view, depends[i]);

					} else {

						bind = view.getScopeByPathConfig(depends[i]);

					}

					this._binds.push(bind);
					this._bind_changed_listeners.push(bind.on('changed', this._onDependencyChanged, this));

				}

			}

		}

		this._argument_changed_listener = this._argument.on('changed', this.onDataSourceChanged, this);
		this.refreshDataSource();

	},
		function () {

		this._queueForRefresh();

	},
		function (argument_value) {

		if (argument_value.isCollection) {

			if (this._own_collection) {

				this._value.destroy();
				this._own_collection = false;
				this._value = null;

			}

			if (this._value != argument_value) {
				this._value = argument_value;
				this._fire('new_enumerable');
			}

		} else if (this._own_collection) {

			this._value.refreshFromDataSource(argument_value);

		} else {

			this._createCollection(argument_value);

		}

	},
		function (argument_value) {

		if (Lava.schema.DEBUG && !argument_value.isCollection) Lava.t("Argument result must be Enumerable");
		// unlike DataView, Enumerable does not copy UIDs, so there is no need to fire "new_enumerable"
		this._value.refreshFromDataSource(argument_value);

	},
		function (argument_value) {

		if (Lava.schema.DEBUG && !argument_value.isCollection) Lava.t("Argument result must be Enumerable");

		if (this._value.getDataSource() != argument_value) {
			// DataView copies UIDs from original Enumerable instance
			this._fire('new_enumerable');
		}

		this._value.refreshFromDataSource(argument_value);

	},
		function () {

		var argument_value = this._argument.getValue();

		if (argument_value) {

			this._refreshDataSource(argument_value);

			if (this._observable_listener == null) {

				if (argument_value.isCollection) {

					this._observable_listener = argument_value.on('collection_changed', this._onObservableChanged, this);
					this._observable = argument_value;

				} else if (argument_value.isProperties) {

					this._observable_listener = argument_value.on('property_changed', this._onObservableChanged, this);
					this._observable = argument_value;

				}

			}

		} else if (this._own_collection) {

			this._value.removeAll();

		} else {

			// will be called only when "own_enumerable_mode" is off, cause otherwise this._own_collection is always true
			this._createCollection(null);

		}

		this._fire('after_refresh');
		this._fire('changed');

	},
		function () {

		return this._config['own_enumerable_mode'];

	},
		function (argument_value) {

		this._value = new Lava.system.Enumerable(argument_value);
		this._own_collection = true;
		this._fire('new_enumerable');

	},
		function () {

		this._observable.removeListener(this._observable_listener);
		this._observable_listener = null;
		this._observable = null;

	},
		function () {

		if (this._observable_listener) this._flushObservable();
		this._queueForRefresh();

	},
		function () {

		this._queueForRefresh();

	},
		function () {

		this.refreshDataSource();

	},
		function () {

		return this._value;

	},
		function () {

		if (this._binds) {

			for (var i = 0, count = this._binds.length; i < count; i++) {
				this._binds[i].removeListener(this._bind_changed_listeners[i]);
			}

			this._binds = this._bind_changed_listeners = null;

		}

		this._argument.removeListener(this._argument_changed_listener);
		this._observable_listener && this._flushObservable();

		if (this._own_collection) {

			this._value.destroy();

		}

		this.suspendRefreshable();

	}
	],
	[
		function (view, property_name, assign_config) {

		this.guid = Lava.guid++;
		this._view = view;
		this._property_name = property_name;

		if (assign_config) {

			this._assign_argument = new Lava.scope.Argument(assign_config, view, view.getWidget());
			this._assign_argument.on('changed', this.onAssignChanged, this);
			this._value = this._assign_argument.getValue();
			view.set(this._property_name, this._value);
			this.level = this._assign_argument.level + 1;

		} else {

			// this is needed to order implicit inheritance
			// (in custom widget property setters logic and in view.Foreach, while refreshing children).
			// Zero was added to simplify examples from site documentation - it's not needed by framework
			this.level = view.depth || 0;

			this._value = view.get(this._property_name);
			this._property_changed_listener = view.onPropertyChanged(property_name, this.onContainerPropertyChanged, this);

		}

		Lava.schema.DEBUG_SCOPES && Lava.ScopeManager.debugTrackScope(this);

	},
		function () {

		return true;

	},
		function () {

		this._view.set(this._property_name, this._assign_argument.getValue());
		this._queueForRefresh();

	},
		function () {

		this._queueForRefresh();

	},
		function () {

		return this._value;

	},
		function (value) {

		Lava.suspendListener(this._property_changed_listener);
		this._view.set(this._property_name, value);
		Lava.resumeListener(this._property_changed_listener);

		this._queueForRefresh();

	},
		function () {

		var new_value = this._view.get(this._property_name);

		if (new_value !== this._value) {

			this._value = new_value;

			this._fire('changed');

		}

	},
		function () {

		if (this._assign_argument) {

			this._assign_argument.destroy();

		} else {

			this._view.removePropertyListener(this._property_changed_listener);

		}

		Lava.schema.DEBUG_SCOPES && Lava.ScopeManager.debugStopTracking(this);
		this.Abstract$destroy();

	}
	],
	[
		function (container, name_source_container) {

		if (Lava.schema.DEBUG && !name_source_container.isValueContainer) Lava.t();
		if (Lava.schema.DEBUG && !name_source_container.guid) Lava.t("Name source for segments must be either PropertyBinding or DataBinding");

		this._container = container;
		this._property_name = name_source_container.getValue();

		this._refreshDataBinding();

		if (container.isRefreshable) {
			this.level = container.level;
		}
		this.level = this.level > name_source_container.level ? this.level : name_source_container.level;
		this.level++;

		this._name_source_container = name_source_container;
		this._name_source_changed_listener = name_source_container.on('changed', this.onPropertyNameChanged, this);
		this._value = this._data_binding.getValue();
		Lava.schema.DEBUG_SCOPES && Lava.ScopeManager.debugTrackScope(this);

	},
		function () {

		if (!this._data_binding) Lava.t();
		return this._data_binding.isConnected();

	},
		function () {

		this._data_binding = this._container.getDataBinding(this._property_name);
		this._data_binding_changed_listener = this._data_binding.on('changed', this.onDataBindingChanged, this);

	},
		function () {

		this._data_binding.removeListener(this._data_binding_changed_listener);
		this._data_binding = null;
		this._data_binding_changed_listener = null;

	},
		function () {

		this._queueForRefresh();

	},
		function () {

		if (this._data_binding == null) {

			this._refreshDataBinding();

		}

		var new_value = this._data_binding.getValue();

		if (new_value !== this._value) {

			this._value = new_value;

			this._fire('changed');

		}

	},
		function () {

		this._property_name = this._name_source_container.getValue();

		this._destroyDataBinding();
		this._queueForRefresh();

	},
		function () {

		return this._value;

	},
		function (value) {

		if (this._data_binding) {
			this._data_binding.setValue(value);
		}

	},
		function () {

		this._name_source_container.removeListener(this._name_source_changed_listener);
		this._data_binding_changed_listener && this._data_binding.removeListener(this._data_binding_changed_listener);

		Lava.schema.DEBUG_SCOPES && Lava.ScopeManager.debugStopTracking(this);
		this.Abstract$destroy();

	}
	],
	[
		function (view, config, widget) {

		// About IOS bugfixes:
		// http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
		// http://www.quirksmode.org/blog/archives/2010/10/click_event_del_1.html

		var needs_shim = Firestorm.Environment.platform == "ios";
		Lava.ClassManager.patch(this, "Element", "addEventTarget", needs_shim ? "addEventTarget_IOS" : "addEventTarget_Normal");
		Lava.ClassManager.patch(this, "Element", "informInDOM", needs_shim ? "informInDOM_IOS" : "informInDOM_Normal");

		this.init_Normal(view, config, widget);
		Lava.ClassManager.patch(this, "Element", "init", "init_Normal");

	},
		function (view, config, widget) {

		var name,
			resource_owner,
			container_resources,
			static_classes,
			static_properties,
			static_styles;

		this._id = Lava.ELEMENT_ID_PREFIX + view.guid;

		this._view = view;
		this._config = config;
		this._widget = widget;
		this._tag_name = config.tag_name;
		this._is_void = Lava.isVoidTag(this._tag_name);

		if (Lava.schema.RESOURCES_ENABLED && config.resource_id) {

			resource_owner = Lava.view_manager.locateTarget(widget, config.resource_id.locator_type, config.resource_id.locator);
			if (Lava.schema.DEBUG && !resource_owner) Lava.t("[Element container] resource owner not found: " + config.resource_id.locator_type + "=" + config.resource_id.locator);
			container_resources = resource_owner.getResource(config.resource_id.name);

		}

		if (Lava.schema.RESOURCES_ENABLED && container_resources) {

			if (Lava.schema.DEBUG && container_resources.type != 'container') Lava.t("Element container: received resource type is not container: " + container_resources.type);
			static_classes = container_resources.value['static_classes'];
			static_properties = container_resources.value['static_properties'];
			static_styles = container_resources.value['static_styles'];

		} else {

			static_classes = config['static_classes'];
			static_properties = config['static_properties'];
			static_styles = config['static_styles'];

		}

		if (Lava.schema.DEBUG && static_properties && ('id' in static_properties))
			Lava.t("Element container: id must not be set via resources or be in config.static_properties");

		// Must clone everything, cause additional statics can be added to the element at run time
		if (static_classes) this._static_classes = static_classes.slice();
		for (name in static_styles) {
			this._static_styles[name] = static_styles[name];
		}
		for (name in static_properties) {
			this._static_properties[name] = static_properties[name];
		}

		for (name in config.events) {
			this._events[name] = Firestorm.clone(config.events[name]); // Object.<string, Array.<_cTarget>>
		}

		this._property_bindings = this._createArguments(config.property_bindings, view, this._onPropertyBindingChanged);
		this._style_bindings = this._createArguments(config.style_bindings, view, this._onStyleBindingChanged);
		// note: class_bindings is also an object. TemplateParser names properties numerically, starting from zero.
		this._class_bindings = this._createArguments(config.class_bindings, view, this._onClassBindingChanged);

		for (name in this._class_bindings) {

			this._class_bindings_values[name] = this._toClassNames(this._class_bindings[name].getValue() || '');

		}

	},
		function (event_name) {

		return this._events[event_name];

	},
		function (event_name, target) {

		Lava.t();

	},
		function (event_name, target) {

		if (this._is_inDOM && event_name == 'click' && !(event_name in this._events)) {
			this.getDOMElement().onclick = Lava.noop;
		}
		this.addEventTarget_Normal(event_name, target)

	},
		function (event_name, target) {

		if (!(event_name in this._events)) {

			this._events[event_name] = [target];

		} else {

			this._events[event_name].push(target);

		}

	},
		function (name, value) {

		this.storeProperty(name, value);
		if (this._is_inDOM) this.syncProperty(name);

	},
		function (name, value) {

		if (Lava.schema.DEBUG) {
			if (this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");
			if (name == 'id') Lava.t(); // IDs belong to framework - you must not set them manually!
			if (name in this._property_bindings) Lava.t("Property is bound to an argument and cannot be set directly: " + name);
		}

		this._static_properties[name] = value;

	},
		function (name) {

		return this._static_properties[name];

	},
		function (name) {

		Firestorm.Element.setProperty(this.getDOMElement(), name, this._static_properties[name]);

	},
		function (class_name, cancel_sync) {

		if (Lava.schema.DEBUG && (!class_name || class_name.indexOf(' ') != -1)) Lava.t("addClass: expected one class name, got: " + class_name);
		if (Lava.schema.DEBUG && this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");

		if (Firestorm.Array.include(this._static_classes, class_name)) {

			if (this._is_inDOM && !cancel_sync) Firestorm.Element.addClass(this.getDOMElement(), class_name);

		}

	},
		function (class_name, cancel_sync) {

		if (Lava.schema.DEBUG && this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");
		if (Firestorm.Array.exclude(this._static_classes, class_name)) {

			if (this._is_inDOM && !cancel_sync) Firestorm.Element.removeClass(this.getDOMElement(), class_name);

		}

	},
		function (class_names, cancel_sync) {

		if (Lava.schema.DEBUG && typeof(class_names) == 'string') Lava.t();

		for (var i = 0, count = class_names.length; i < count; i++) {

			this.addClass(class_names[i], cancel_sync);

		}

	},
		function (class_name) {

		return this._static_classes.indexOf(class_name) != -1;

	},
		function () {

		Firestorm.Element.setClass(this.getDOMElement(), this._renderClasses());

	},
		function (name, value, cancel_sync) {

		if (Lava.schema.DEBUG && this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");
		if (value == null) {

			this.removeStyle(name, cancel_sync);

		} else {

			this._static_styles[name] = value;
			if (this._is_inDOM && !cancel_sync) Firestorm.Element.setStyle(this.getDOMElement(), name, value);

		}

	},
		function (name, cancel_sync) {

		if (Lava.schema.DEBUG && this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");
		if (name in this._static_styles) {
			delete this._static_styles[name];
			if (this._is_inDOM && !cancel_sync) Firestorm.Element.setStyle(this.getDOMElement(), name, null);
		}

	},
		function (name) {

		return this._static_styles[name];

	},
		function () {

		Firestorm.Element.setProperty(this.getDOMElement(), 'style', this._renderStyles());

	},
		function (configs, view, fn) {

		var result = {},
			argument;

		for (var name in configs) {

			argument = new Lava.scope.Argument(configs[name], view, this._widget);
			result[name] = argument;
			argument.on('changed', fn, this, {name: name})

		}

		return result;

	},
		function (argument, event_args, listener_args) {

		if (this._is_inDOM) {

			// note: escape will be handled by framework
			var value = argument.getValue();

			if (value != null && value !== false) {

				if (value === true) {
					value = listener_args.name;
				}

				Firestorm.Element.setProperty(this.getDOMElement(), listener_args.name, value);

			} else {

				Firestorm.Element.removeProperty(this.getDOMElement(), listener_args.name);

			}

		}

	},
		function (argument, event_args, listener_args) {

		var value = this._style_bindings[listener_args.name].getValue() || '';
		if (this._is_inDOM) Firestorm.Element.setStyle(this.getDOMElement(), listener_args.name, value.toString().trim());

	},
		function (classes_string) {

		var classes = [];

		if (Lava.schema.view.VALIDATE_CLASS_NAMES) {
			this.assertClassStringValid(classes_string);
		}

		if (classes_string != '') {

			classes = classes_string.split(/\s+/);

		}

		return classes;

	},
		function (argument, event_args, listener_args) {

		var new_classes = this._toClassNames(argument.getValue().toString().trim());

		if (this._is_inDOM) {

			Firestorm.Element.removeClasses(this.getDOMElement(), this._class_bindings_values[listener_args.name]);
			Firestorm.Element.addClasses(this.getDOMElement(), new_classes);

		}

		this._class_bindings_values[listener_args.name] = new_classes;

	},
		function (value) {
		if (/\"\<\>/.test(value))
			Lava.t("Invalid symbols in style value: " + value + ". Please, use single quotes for string values and manually escape special characters.");
	},
		function (value) {

		if (/\'\"\<\>\&\./.test(value)) Lava.t("Invalid class names: " + value);

	},
		function () {

		var resultClasses = this._static_classes.clone(),
			name,
			value;

		for (name in this._class_bindings) {

			// do not need to check or convert, cause join() will convert everything to string, and nulls to empty string
			resultClasses.push(
				this._class_bindings[name].getValue()
			);

		}

		value = resultClasses.join(' ');

		if (Lava.schema.view.VALIDATE_CLASS_NAMES) {
			this.assertClassStringValid(value);
		}

		return value;

	},
		function () {

		var result_styles = [],
			name,
			value;

		for (name in this._static_styles) {

			result_styles.push(name + ':' + this._static_styles[name]);

		}

		for (name in this._style_bindings) {

			value = this._style_bindings[name].getValue();
			if (value != null) {
				result_styles.push(name + ':' + value.toString().trim());
			}

		}

		value = result_styles.join(';');

		if (Lava.schema.view.VALIDATE_STYLES) {
			this.assertStyleValid(value);
		}

		return value;

	},
		function (name, value) {

		var result = '';

		if (value === true) {

			result = ' ' + name + '="' + name + '"';

		} else if (value != null && value !== false) {

			result = ' ' + name + '="' + this.escapeAttributeValue(value + '') + '"';

		}

		return result;

	},
		function () {

		var classes = this._renderClasses(),
			style = this._renderStyles(),
			properties_string = '',
			name;

		// see informInDOM_Normal
		// this._element = null;

		for (name in this._static_properties) {

			properties_string += this._renderAttribute(name, this._static_properties[name]);

		}

		for (name in this._property_bindings) {

			properties_string += this._renderAttribute(name, this._property_bindings[name].getValue());

		}

		if (classes) {

			properties_string += ' class="' + classes + '"';

		}

		if (style) {

			properties_string += ' style="' + style + '"';

		}

		return "<" + this._tag_name + " id=\"" + this._id + "\" "
			+ properties_string; //+ ">"

	},
		function (html) {

		if (Lava.schema.DEBUG && this._is_void) Lava.t('Trying to wrap content in void tag');
		if (Lava.schema.DEBUG) this._is_rendered = true;
		// _element is cleared in _renderOpeningTag
		return this._renderOpeningTag() + ">" + html + "</" + this._tag_name + ">";

	},
		function () {

		if (Lava.schema.DEBUG && !this._is_void) Lava.t('Trying to render non-void container as void');
		if (Lava.schema.DEBUG) this._is_rendered = true;
		// _element is cleared in _renderOpeningTag
		return this._renderOpeningTag() + "/>";

	},
		function (html) {

		if (!this._is_inDOM) Lava.t("setHTML: element is not in DOM");
		if (this._is_void) Lava.t('setHTML on void tag');

		Firestorm.Element.setProperty(this.getDOMElement(), 'html', html);

	},
		function (html) {

		Firestorm.DOM.insertHTMLBottom(this.getDOMElement(), html);

	},
		function (html) {

		Firestorm.DOM.insertHTMLTop(this.getDOMElement(), html);

	},
		function (html) {

		Firestorm.DOM.insertHTMLAfter(this.getDOMElement(), html);

	},
		function (html) {

		Firestorm.DOM.insertHTMLBefore(this.getDOMElement(), html);

	},
		function () {

		Lava.t();

	},
		function () {

		this.informInDOM_Normal();
		this.getDOMElement().onclick = Lava.noop;

	},
		function () {

		this._is_inDOM = true;
		if (Lava.schema.DEBUG) this._is_rendered = false;
		// if <input> which is already in DOM is re-rendered and inserted back
		// - then "changed" event will fire in Chrome.
		// During the event - the DOM element may be retrieved by widget,
		// so at the moment, when informInDOM is called - it's already set.
		// if (Lava.schema.DEBUG && this._element) Lava.t();
		this._element = null;

	},
		function () {

		this._is_inDOM = false;
		this._element = null;

	},
		function () {

		if (!this._element && this._is_inDOM) {

			this._element = Firestorm.getElementById(this._id);

		}

		return this._element;

	},
		function () {

		return this.getDOMElement();

	},
		function () {

		return this.getDOMElement();

	},
		function () { return this._id; },
		function () { return this._is_inDOM; },
		function () { return this._is_void; },
		function () {

		this._element = null;

	},
		function (callback_name, callback_argument) {

		var name;

		for (name in this._property_bindings) this._property_bindings[name][callback_name](callback_argument);

		for (name in this._style_bindings) this._style_bindings[name][callback_name](callback_argument);

		for (name in this._class_bindings) this._class_bindings[name][callback_name](callback_argument);

	},
		function (element) {

		var Element = Firestorm.Element,
			name;

		if (this._is_inDOM) Lava.t("Can not set duplicate id attribute on elements");
		// there must not be ID attribute
		if (Element.getProperty(element, 'id')) Lava.t("Target element already has an ID, and could be owned by another container");
		if (Element.getProperty(element, 'tag').toLowerCase() != this._tag_name) Lava.t("Captured tag name differs from the container's tag name");

		Element.setProperty(element, 'id', this._id);

		this._is_inDOM = true;
		this._element = element;

		for (name in this._static_properties) {

			// note: escaping must be handled by framework
			Element.setProperty(element, name, this._static_properties[name]);

		}

		for (name in this._property_bindings) {

			Element.setProperty(element, name, this._property_bindings[name].getValue());

		}

		this.syncClasses();
		this.syncStyles();
		this._is_element_owner = false;

	},
		function () {

		// keep original container in DOM
		this.setHTML('');
		Firestorm.Element.removeProperty(this.getDOMElement(), 'id');
		this.informRemove();
		this._is_element_owner = true;

	},
		function () {

		return this._is_element_owner;

	},
		function (string) {

		return Firestorm.String.escape(string, Firestorm.String.ATTRIBUTE_ESCAPE_REGEX);

	},
		function () {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");
		Firestorm.Element.destroy(this.getDOMElement());

	},
		function () {

		var name;

		for (name in this._property_bindings) {

			this._property_bindings[name].destroy();

		}

		for (name in this._style_bindings) {

			this._style_bindings[name].destroy();

		}

		for (name in this._class_bindings) {

			this._class_bindings[name].destroy();

		}

	}
	],
	[
		function (view, config, widget) {

		var needs_shim = (Firestorm.Environment.browser_name == 'ie'),
			new_init_name = needs_shim ? "init_IE" : "Element$init";

		Lava.ClassManager.patch(this, "CheckboxElement", "informInDOM", needs_shim ? "informInDOM_IE" : "Element$informInDOM");
		Lava.ClassManager.patch(this, "CheckboxElement", "informRemove", needs_shim ? "informRemove_IE" : "Element$informRemove");

		this[new_init_name](view, config, widget);
		Lava.ClassManager.patch(this, "CheckboxElement", "init", new_init_name);

	},
		function (view, config, widget) {

		this.Element$init(view, config, widget);

		var self = this;

		this._IE_click_callback = function() {
			if (self._events['compatible_changed']) {
				Lava.view_manager.dispatchEvent(self._view, 'compatible_changed', null, self._events['compatible_changed']);
			}
		};

	},
		function () {

		Lava.t();

	},
		function () {

		Lava.t();

	},
		function () {

		this.Element$informInDOM();

		var input_element = this.getDOMElement();
		Firestorm.Element.addListener(input_element, "click", this._IE_click_callback);

	},
		function () {

		var input_element = this.getDOMElement();
		Firestorm.Element.removeListener(input_element, "click", this._IE_click_callback);

		this.Element$informRemove();

	}
	],
	[
		function (view, config, widget) {

		var needs_shim = Firestorm.Environment.capabilities[Firestorm.CAPABILITY_NAMES.NEEDS_INPUT_EVENT_SHIM],
			new_init_name = needs_shim ? "init_IE" : "Element$init";

		Lava.ClassManager.patch(this, "TextInputElement", "informInDOM", needs_shim ? "informInDOM_OldIE" : "Element$informInDOM");
		Lava.ClassManager.patch(this, "TextInputElement", "informRemove", needs_shim ? "informRemove_OldIE" : "Element$informRemove");

		this[new_init_name](view, config, widget);
		Lava.ClassManager.patch(this, "TextInputElement", "init", new_init_name);

	},
		function (view, config, widget) {

		this.Element$init(view, config, widget);

		var self = this;

		this._OldIE_refresh_callback = function() {
			self._sendRefreshValue();
		};
		this._OldIE_property_change_callback = function(e) {
			if (e.propertyName == "value") {
				self._sendRefreshValue();
			}
		};

	},
		function () {

		Lava.t();

	},
		function () {

		Lava.t();

	},
		function () {

		this.Element$informInDOM();

		var input_element = this.getDOMElement();
		Firestorm.Element.addListener(input_element, "onpropertychange", this._OldIE_property_change_callback);
		Firestorm.Element.addListener(input_element, "selectionchange", this._OldIE_refresh_callback);
		Firestorm.Element.addListener(input_element, "keyup", this._OldIE_refresh_callback);
		Firestorm.Element.addListener(input_element, "keydown", this._OldIE_refresh_callback);

	},
		function () {

		var input_element = this.getDOMElement();
		Firestorm.Element.removeListener(input_element, "onpropertychange", this._OldIE_property_change_callback);
		Firestorm.Element.removeListener(input_element, "selectionchange", this._OldIE_refresh_callback);
		Firestorm.Element.removeListener(input_element, "keyup", this._OldIE_refresh_callback);
		Firestorm.Element.removeListener(input_element, "keydown", this._OldIE_refresh_callback);

		this.Element$informRemove();

	},
		function () {

		if (this._events['compatible_changed']) {
			Lava.view_manager.dispatchEvent(this._view, 'compatible_changed', null, this._events['compatible_changed']);
		}

	}
	],
	[
		function (view, config, widget) {

		this._view = view;
		//this._config = config;
		this._widget = widget;

		this._start_script_id = 'c' + view.guid + 's';
		this._end_script_id = 'c' + view.guid + 'e';

	},
		function () {

		var start_element = document.getElementById(this._start_script_id),
			end_element = document.getElementById(this._end_script_id);

		/**
		 * In some cases, Internet Explorer can create an anonymous node in
		 * the hierarchy with no tagName. You can create this scenario via:
		 *
		 *     div = document.createElement("div");
		 *     div.innerHTML = "<table>&shy<script></script><tr><td>hi</td></tr></table>";
		 *     div.firstChild.firstChild.tagName //=> ""
		 *
		 * If our script markers are inside such a node, we need to find that
		 * node and use *it* as the marker.
		 **/
		while (start_element.parentNode.tagName === "") {

			start_element = start_element.parentNode;

		}

		/**
		 * When automatically adding a tbody, Internet Explorer inserts the
		 * tbody immediately before the first <tr>. Other browsers create it
		 * before the first node, no matter what.
		 *
		 * This means the the following code:
		 *
		 *     div = document.createElement("div");
		 *     div.innerHTML = "<table><script id='first'></script><tr><td>hi</td></tr><script id='last'></script></table>
		 *
		 * Generates the following DOM in IE:
		 *
		 *     + div
		 *       + table
		 *         - script id='first'
		 *         + tbody
		 *           + tr
		 *             + td
		 *               - "hi"
		 *           - script id='last'
		 *
		 * Which means that the two script tags, even though they were
		 * inserted at the same point in the hierarchy in the original
		 * HTML, now have different parents.
		 *
		 * This code reparents the first script tag by making it the tbody's
		 * first child.
		 **/
		if (start_element.parentNode !== end_element.parentNode) {

			end_element.parentNode.insertBefore(start_element, end_element.parentNode.firstChild);

		}

		this._start_element = start_element;
		this._end_element = end_element;

	},
		function () {

		if (this._start_element == null) {
			this._getElements();
		}

		return this._start_element;

	},
		function () {

		if (this._end_element == null) {
			this._getElements();
		}

		return this._end_element;

	},
		function (html) {

		this._start_element = this._end_element = null;

		/*
		 * We replace chevron by its hex code in order to prevent escaping problems.
		 * Check this thread for more explaination:
		 * http://stackoverflow.com/questions/8231048/why-use-x3c-instead-of-when-generating-html-from-javascript
		 */
		return "<script id='" + this._start_script_id + "' type='x'>\x3C/script>"
			+ html
			+ "<script id='" + this._end_script_id + "' type='x'>\x3C/script>";

	},
		function (html) {

		if (!this._is_inDOM) Lava.t("setHTML: container is not in DOM");

		Firestorm.DOM.clearInnerRange(this.getStartElement(), this.getEndElement());
		Firestorm.DOM.insertHTMLBefore(this.getEndElement(), html);

	},
		function () {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");
		Firestorm.DOM.clearOuterRange(this.getStartElement(), this.getEndElement());

	},
		function (html) {

		Firestorm.DOM.insertHTMLBefore(this.getEndElement(), html);

	},
		function (html) {

		Firestorm.DOM.insertHTMLAfter(this.getStartElement(), html);

	},
		function (html) {

		Firestorm.DOM.insertHTMLAfter(this.getEndElement(), html);

	},
		function (html) {

		Firestorm.DOM.insertHTMLBefore(this.getStartElement(), html);

	},
		function () { this._is_inDOM = true; },
		function () {

		this._start_element = this._end_element = null;
		this._is_inDOM = false;

	},
		function () {

		this._start_element = this._end_element = null;

	},
		function () {},
		function () { return this._is_inDOM; },
		function () { return this._widget; },
		function () { return this._view; },
		function () {}
	],
	[
		function (view, config, widget) {

		this._view = view;
		//this._config = config;
		this._widget = widget;

		if (('options' in config)) {

			if ('appender' in config.options) {
				if (Lava.schema.DEBUG && !this['_append' + config.options.appender]) Lava.t('[Emulated container] wrong appender: ' + config.options.appender);
				this.appendHTML = this['_append' + config.options.appender]
			}

			if ('prepender' in config.options) {
				if (Lava.schema.DEBUG && !this['_append' + config.options.prepender]) Lava.t('[Emulated container] wrong prepender: ' + config.options.prepender);
				this.prependHTML = this['_append' + config.options.prepender]
			}

		}

	},
		function (html) { return html; },
		function (html) {

		if (!this._is_inDOM) Lava.t("setHTML: container is not in DOM");

		Lava.t('call to setHTML() in emulated container');

	},
		function () {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");

		Lava.t('call to remove() in emulated container');

	},
		function (html) {

		this._view.getParentView().getContainer().appendHTML(html);

	},
		function (html) {

		this._view.getParentView().getContainer().prependHTML(html);

	},
		function (html) {

		this._view.getTemplate().getPreviousView(this._view).getContainer().insertHTMLAfter(html);

	},
		function (html) {

		this._view.getTemplate().getNextView(this._view).getContainer().insertHTMLBefore(html);

	},
		function (html) {

		Lava.t("appendHTML is not supported or not configured");

	},
		function (html) {

		Lava.t("prependHTML is not supported or not configured");

	},
		function (html) {

		this.prependHTML(html);

	},
		function (html) {

		this.appendHTML(html);

	},
		function () { this._is_inDOM = true; },
		function () { this._is_inDOM = false; },
		function () {},
		function () { return this._is_inDOM; },
		function () { return this._widget; },
		function () { return this._view; },
		function () {},
		function () {}
	],
	[
		function (config, view, container) {

		this._config = config;
		this._view = view;
		this._container = container;

		if (config.get_start_element_callback) {

			this._getStartElement = config.get_start_element_callback;

		}

		if (config.get_end_element_callback) {

			this._getEndElement = config.get_end_element_callback;

		}

	},
		function (templates) {

		for (var i = 0, count = templates.length; i < count; i++) {

			this._remove_queue[templates[i].guid] = templates[i];

		}

	},
		function (current_templates) {

		var i = 1,
			count = current_templates.length,
			guid,
			previous_template = current_templates[0];

		if (previous_template) { // if list is not empty

			delete this._remove_queue[previous_template.guid];

			// handle first template separately from others
			if (!previous_template.isInDOM()) {

				this._insertFirstTemplate(previous_template);
				this._fire('insertion_complete', previous_template);

			}

			for (; i < count; i++) {

				delete this._remove_queue[current_templates[i].guid];

				if (current_templates[i].isInDOM()) {

					this._moveTemplate(current_templates[i], previous_template, current_templates);

				} else {

					this._insertTemplate(current_templates[i], previous_template, i);
					this._fire('insertion_complete', current_templates[i]);

				}

				previous_template = current_templates[i];

			}

		}

		for (guid in this._remove_queue) {

			if (this._remove_queue[guid].isInDOM()) {

				this._removeTemplate(this._remove_queue[guid]);
				this._fire('removal_complete', this._remove_queue[guid]);

			}

		}

		this._remove_queue = {};

	},
		function (template) {

		this._view.getContainer().prependHTML(template.render());
		template.broadcastInDOM();
		this._current_templates.unshift(template);

	},
		function (template, new_previous_template, current_templates) {

		var current_previous_index = this._current_templates.indexOf(template) - 1,
			current_previous_template = null;

		if (Lava.schema.DEBUG && current_previous_index == -2) Lava.t();

		// skip removed templates
		while (current_previous_index > -1 && current_templates.indexOf(this._current_templates[current_previous_index]) == -1) {
			current_previous_index--;
		}

		if (current_previous_index > -1) {
			current_previous_template = this._current_templates[current_previous_index];
		}

		if (new_previous_template != current_previous_template) {

			Firestorm.DOM.moveRegionAfter(
				this._getEndElement(new_previous_template),
				this._getStartElement(template),
				this._getEndElement(template)
			);

			// move it in local _current_templates array
			Firestorm.Array.exclude(this._current_templates, template);

			var previous_index = this._current_templates.indexOf(new_previous_template);
			if (Lava.schema.DEBUG && previous_index == -1) Lava.t();
			this._current_templates.splice(previous_index + 1, 0, template);

		}

	},
		function (template) {

		return template.getFirstView().getContainer().getDOMElement();

	},
		function (template) {

		return template.getLastView().getContainer().getDOMElement();

	},
		function (current_templates) {

		var i = 0,
			count = current_templates.length,
			guid;

		// from templates, which are prepared for removal, filter out those, which should be in DOM
		for (; i < count; i++) {

			delete this._remove_queue[current_templates[i].guid];

		}

		for (guid in this._remove_queue) {

			if (this._remove_queue[guid].isInDOM()) {

				this._remove_queue[guid].broadcastRemove();
				this._fire('removal_complete', this._remove_queue[guid]);

			}

		}

		this._current_templates = current_templates;
		this._remove_queue = {};

		return this._render();

	},
		function () {

		var buffer = '',
			i = 0,
			count = this._current_templates.length;

		for (; i < count; i++) {

			buffer += this._current_templates[i].render();

		}

		return buffer;

	},
		function (template, previous_template, index) {

		Firestorm.DOM.insertHTMLAfter(this._getEndElement(previous_template), template.render());
		template.broadcastInDOM();

		var previous_index = this._current_templates.indexOf(previous_template);
		if (Lava.schema.DEBUG && previous_index == -1) Lava.t();
		this._current_templates.splice(previous_index + 1, 0, template);

	},
		function (template) {

		// save, cause we can not retrieve container's DOM elements after broadcastRemove
		var start_element = this._getStartElement(template),
			end_element = this._getEndElement(template);

		// first, we must inform the template, that it's going to be removed: to allow it's child views to interact
		// with nodes while they are still in DOM
		template.broadcastRemove();

		if (start_element == end_element) {

			Firestorm.Element.destroy(start_element);

		} else {

			// remove everything between tags and tags themselves
			Firestorm.DOM.clearOuterRange(start_element, end_element);

		}

		Firestorm.Array.exclude(this._current_templates, template);

	},
		function () {

		return false;

	},
		function () {

		return false;

	},
		function () {

		this._broadcast('broadcastInDOM');

	},
		function () {

		this._broadcast('broadcastRemove');

	},
		function (function_name) {

		for (var i = 0, count = this._current_templates.length; i < count; i++) {

			this._current_templates[i][function_name]();

		}

	},
		function () {

		this._current_templates = this._remove_queue = null;

	}
	],
	[
		function (current_templates) {

		if (this.isAnimationEnabled()) {

			this._refreshAnimated(current_templates);

		} else {

			this.Standard$refresh(current_templates);

		}

	},
		function (current_templates) {

		var i = 0,
			count = current_templates.length,
			previous_template = null,
			guid;

		for (; i < count; i++) {

			delete this._remove_queue[current_templates[i].guid];
			this._animateInsertion(current_templates[i], previous_template, i, current_templates);
			previous_template = current_templates[i];

		}

		for (guid in this._remove_queue) {

			this._animateRemoval(this._remove_queue[guid]);

		}

		this._remove_queue = {};

	},
		function (current_templates) {

		this._finishAnimations();
		return this.Standard$render(current_templates);

	},
		function () {

		this._is_animation_enabled = true;

	},
		function () {

		this._is_animation_enabled = false;
		this._finishAnimations();

	},
		function () {

		return this._is_animation_enabled;

	},
		function () {

		for (var guid in this._animations_by_template_guid) {

			// you can not just stop() them, cause you need onComplete events to fire
			this._animations_by_template_guid[guid].finish();

		}

		this._animations_by_template_guid = {};
		this._templates_by_animation_guid = {};

	},
		function () {

		return !Firestorm.Object.isEmpty(this._animations_by_template_guid);

	},
		function (template, previous_template, index, current_templates) {

		var animation = this._animations_by_template_guid[template.guid];

		if (Lava.schema.DEBUG && animation && !template.isInDOM()) Lava.t();

		if (template.isInDOM()) {

			// first template does not require moving
			previous_template && this._moveTemplate(template, previous_template, current_templates);

		} else {

			if (previous_template) {

				this._insertTemplate(template, previous_template, index);

			} else {

				this._insertFirstTemplate(template);

			}

			animation = this._createAnimation(template, index);

		}

		if (animation) {

			animation.resetDirection();
			animation.safeStart();

		}

	},
		function (template) {

		var animation = this._animations_by_template_guid[template.guid];

		if (!animation && template.isInDOM()) {

			animation = this._createAnimation(template);

		}

		if (animation) {

			animation.reverseDirection();
			animation.safeStart();

		}

	},
		function (animation) {

		var template = this._templates_by_animation_guid[animation.guid];

		if (animation.isReversed()) {

			this._onRemovalComplete(animation, template);
			this._fire('removal_complete', template);

		} else {

			this._onInsertionComplete(animation, template);
			this._fire('insertion_complete', template);

		}

		delete this._templates_by_animation_guid[animation.guid];
		delete this._animations_by_template_guid[template.guid];

	},
		function (template) {

		// get the only element inside the template
		return template.getFirstView().getContainer().getDOMElement();

	},
		function (animation, template) {

		this._removeTemplate(template);

	},
		function (animation, template) {



	},
		function (template, index) {

		Lava.t("Abstract function call: _createAnimation");

	},
		function () {

		this._finishAnimations();
		this.Standard$broadcastRemove();

	},
		function () {

		this._finishAnimations();
		this.Standard$destroy();

	}
	],
	[function (template, index) {

		var element = this._getAnimationTarget(template),
			constructor,
			animation;

		constructor = Lava.ClassManager.getConstructor(this.ANIMATION_NAME, 'Lava.animation');
		animation = new constructor({}, element);
		animation.on('complete', this._onAnimationComplete, this);

		this._templates_by_animation_guid[animation.guid] = template;
		this._animations_by_template_guid[template.guid] = animation;

		return animation;

	}],
	[
		function (config, widget, parent_view, template, properties) {

		var name,
			argument,
			constructor;

		this.guid = Lava.guid++;
		if (Lava.schema.DEBUG && config.id && !Lava.isValidId(config.id)) Lava.t();
		if ('id' in config) {
			this.id = config.id;
		}
		if ('label' in config) {
			this.label = config.label;
		}

		Lava.view_manager.registerView(this);

		this._config = config;
		this._widget = widget;
		this._template = template;

		if (parent_view) {

			this._parent_view = parent_view;
			this._parent_with_container = parent_view.getContainer() ? parent_view : parent_view.getParentWithContainer();
			this.depth = parent_view.depth + 1;

		}

		this._initMembers(properties);

		for (name in config.assigns) {

			if (config.assigns[name].once) {

				argument = new Lava.scope.Argument(config.assigns[name], this, this._widget);
				this.set(name, argument.getValue());
				argument.destroy();

			} else {

				if (name in this._property_bindings_by_property) Lava.t("Error initializing assign: property binding already created");

				this._property_bindings_by_property[name] = new Lava.scope.PropertyBinding(this, name, config.assigns[name]);

			}

		}

		if ('container' in config) {

			constructor = Lava.ClassManager.getConstructor(config.container['type'], 'Lava.view.container');
			this._container = new constructor(this, config.container, widget);

		}

		this._postInit();

		if ('roles' in  config) Lava.view_manager.dispatchRoles(this, config.roles);

	},
		function () { return this._container; },
		function () { return this._parent_with_container; },
		function () { return this._parent_view; },
		function () { return this._widget; },
		function () { return this._is_inDOM; },
		function () { return this._template; },
		function (new_id) {

		if (Lava.schema.DEBUG && !Lava.isValidId(new_id)) Lava.t();
		Lava.view_manager.unregisterView(this);
		this.id = new_id;
		Lava.view_manager.registerView(this);

	},
		function (properties) {

		for (var name in properties) {

			this.set(name, properties[name]);

		}

	},
		function () {

	},
		function (depth) {

		var root = this;

		while (depth > 0) {

			root = root.getParentView();

			if (!root) Lava.t("Error evaluating depth: parent view does not exist");

			depth--;

		}

		return root;

	},
		function () {

		if (this._is_inDOM) {

			if (this._container) {

				this._is_dirty = true;

				if (!this._is_queued_for_refresh) {

					Lava.view_manager.scheduleViewRefresh(this);
					this._is_queued_for_refresh = true;

				}

			} else if (this._parent_with_container) {

				this._parent_with_container.trySetDirty();

			}

		}

	},
		function (function_name) {},
		function () {

		this._is_inDOM = true;
		this._is_dirty = false;
		this._container && this._container.informInDOM();

		this._broadcastToChildren('broadcastInDOM');

	},
		function () {

		if (this._is_inDOM) {

			this._is_inDOM = false;
			this._is_dirty = false;
			this._container && this._container.informRemove();

			this._broadcastToChildren('broadcastRemove');

		}

	},
		function () {

		var buffer = this._renderContent(),
			result;

		if (this._container) {

			result = this._container.wrap(buffer);

		} else {

			result = buffer;

		}

		return result;

	},
		function () {

		Lava.t("_renderContent must be overridden in inherited classes");

	},
		function (refresh_id) {

		if (Lava.schema.DEBUG && !this._container) Lava.t("Refresh on a view without container");

		this._is_queued_for_refresh = false;

		if (this._is_inDOM && this._is_dirty) {

			if (this._last_refresh_id == refresh_id) {

				this._refresh_cycle_count++;
				if (this._refresh_cycle_count > Lava.schema.system.REFRESH_INFINITE_LOOP_THRESHOLD) {

					// schedule this view for refresh in the next refresh loop
					Lava.view_manager.scheduleViewRefresh(this);
					this._is_queued_for_refresh = true;
					// when refresh returns true - it means an infinite loop exception,
					// it stops current refresh loop.
					return true;

				}

			} else {

				this._last_refresh_id = refresh_id;
				this._refresh_cycle_count = 0;

			}

			this._refresh();
			this._is_dirty = false;

		}

		return false;

	},
		function () {

		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},
		function (label) {

		if (Lava.schema.DEBUG && !label) Lava.t();

		var result = this;

		if (label == 'root') {

			result = this._widget;

			while (result.getParentWidget()) {

				result = result.getParentWidget();

			}

		} else if (label == 'parent') {

			result = this._parent_view;

		} else if (label == 'widget') {

			result = this._widget;

		} else if (label != 'this') {

			while (result && result.label != label) {

				result = result.getParentView();

			}

		}

		return result;

	},
		function (name) {

		if (Lava.schema.DEBUG && !name) Lava.t();

		var result = this._widget;

		while (result && result.name != name) {

			result = result.getParentWidget();

		}

		return result;

	},
		function (id) {

		if (Lava.schema.DEBUG && !id) Lava.t();

		return Lava.view_manager.getViewById(id);

	},
		function (guid) {

		if (Lava.schema.DEBUG && !guid) Lava.t();

		return Lava.view_manager.getViewByGuid(guid);

	},
		function (path_config) {

		var result = this['locateViewBy' + path_config.locator_type](path_config.locator);

		if (Lava.schema.DEBUG && !result) Lava.t("View not found. " + path_config.locator_type + ':' + path_config.locator);

		if ('depth' in path_config) {

			result = result.getViewByDepth(path_config.depth);

		}

		return result;

	},
		function (name) {

		var view = this;

		while (view && !view.isset(name)) {

			view = view.getParentView();

		}

		return view;

	},
		function (path_config) {

		var view,
			i = 0,
			count,
			result,
			tail = path_config.tail;

		if ('property_name' in path_config) {

			view = ('locator_type' in path_config) ? this.locateViewByPathConfig(path_config) : this;

			view = view.locateViewWithProperty(path_config.property_name);

			if (Lava.schema.DEBUG && !view) Lava.t("Property not found: " + path_config.property_name);

			result = view.getDataBinding(path_config.property_name);

		} else {

			if (Lava.schema.DEBUG && !('locator_type' in path_config)) Lava.t("Malformed scope path (1)");
			if (Lava.schema.DEBUG && !tail) Lava.t("Malformed scope path (2)");

			result = this.locateViewByPathConfig(path_config);

			if (Lava.schema.DEBUG && !result) Lava.t("View not found. "
				+ path_config.locator_type + ": " + path_config.locator + ", depth:" + path_config.depth);

		}

		if (tail) {

			for (count = tail.length; i < count; i++) {

				result = (typeof(tail[i]) == 'object')
					? result.getSegment(this.getScopeByPathConfig(tail[i]))
					: result.getDataBinding(tail[i]);

			}

		}

		return result;

	},
		function (path_config) {

		var view,
			i = 0,
			count,
			result,
			tail = path_config.tail,
			property_name;

		if ('property_name' in path_config) {

			view = ('locator_type' in path_config) ? this.locateViewByPathConfig(path_config) : this;

			view = view.locateViewWithProperty(path_config.property_name);

			result = view.get(path_config.property_name);

		} else {

			if (Lava.schema.DEBUG && !('locator_type' in path_config)) Lava.t("Malformed scope path (1)");
			if (Lava.schema.DEBUG && !tail) Lava.t("Malformed scope path (2)");

			result = this.locateViewByPathConfig(path_config);

			if (Lava.schema.DEBUG && !result) Lava.t("View not found. "
				+ path_config.locator_type + ": " + path_config.locator + ", depth:" + path_config.depth);

		}

		if (tail) {

			for (count = tail.length; i < count; i++) {

				property_name = (typeof(tail[i]) == 'object') ? this.evalPathConfig(tail[i]) : tail[i];

				if (result.isCollection && /^\d+$/.test(property_name)) {

					result = result.getValueAt(+property_name);

				} else if (result.isProperties) {

					result = result.get(property_name);

				} else {

					result = result[property_name];

				}

				if (!result) {

					break;

				}

			}

		}

		return result;

	},
		function (property_name) {

		if (!(property_name in this._property_bindings_by_property)) {

			this._property_bindings_by_property[property_name] = new Lava.scope.PropertyBinding(this, property_name);

		}

		return this._property_bindings_by_property[property_name];

	},
		function (name_source_scope) {

		if (Lava.schema.DEBUG && !name_source_scope.guid) Lava.t("Only PropertyBinding and DataBinding may be used as name source for segments");

		if (!(name_source_scope.guid in this._data_segments)) {

			this._data_segments[name_source_scope.guid] = new Lava.scope.Segment(this, name_source_scope);

		}

		return this._data_segments[name_source_scope.guid];

	},
		function () {

		var name;

		this._fire('destroy');

		Lava.view_manager.unregisterView(this);

		if (this._container) this._container.destroy();

		for (name in this._property_bindings_by_property) {

			this._property_bindings_by_property[name].destroy();

		}

		for (name in this._data_segments) {

			this._data_segments[name].destroy();

		}

		this._is_inDOM = false; // to prevent refresh

	}
	],
	[
		function () {

		if (
			Lava.schema.DEBUG
			&& (('argument' in this._config) || ('else_template' in this._config) || ('elseif_arguments' in this._config))
		) {
			Lava.t("Standard View does not support arguments and elseif/else blocks");
		}

	},
		function () {

		var result;

		if (this._container) {

			// This is the only view, that can have void element containers.
			// Check is done to speed up the rendering process.
			result = (this._container.isElementContainer && this._container.isVoid())
				? this._container.renderVoid()
				: this._container.wrap(this._renderContent());

		} else {

			result = this._renderContent();

		}

		return result;

	},
		function () {

		if (!this._container.isVoid()) {
			this._container.setHTML(this._renderContent());
			this._broadcastToChildren('broadcastInDOM');
		}

	},
		function () {

		return this._getContent().render();

	},
		function (function_name) {

		if (this._content != null) {

			this._content[function_name]();

		}

	},
		function () {

		if (this._content == null) {

			this._content = new Lava.system.Template(this._config.template || [], this._widget, this)

		}

		return this._content;

	},
		function () {

		if (this._content) {
			this._content.destroy();
			this._content = null;
		}

		this.Abstract$destroy();

	}
	],
	[
		function () {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Expression view requires an argument");
		this._escape = !this._config.escape_off;
		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._argument_changed_listener = this._argument.on('changed', this._onValueChanged, this);

	},
		function () {

		this.trySetDirty();

	},
		function () {

		if (Lava.schema.DEBUG && this._argument.isWaitingRefresh()) Lava.t("Rendering a view in dirty state");

		var result = '',
			new_value = this._argument.getValue();

		if (new_value != null && typeof(new_value) != 'undefined') {

			result = this._escape
				? this.escapeArgumentValue(new_value.toString())
				: new_value.toString();

		}

		return result;

	},
		function (string) {

		return Firestorm.String.escape(string, Firestorm.String.HTML_ESCAPE_REGEX);

	},
		function () {

		this._argument.destroy();
		this._argument = null;

		this.Abstract$destroy();

	}
	],
	[
		function (config, widget, parent_view, template, properties) {

		this.Abstract$init(config, widget, parent_view, template, properties);

		// setting count after roles registration, cause scope can be filtered
		this._setCount(this._foreach_scope.getValue().getCount());

	},
		function (properties) {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Foreach view requires an argument");
		if (Lava.schema.DEBUG && !this._config.as) Lava.t("Foreach view requires 'as' hash parameter");
		if (Lava.schema.DEBUG && !this._config.template) Lava.t("Foreach view must not be empty");

		this.Abstract$_initMembers(properties);

		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._foreach_scope = new Lava.scope.Foreach(this._argument, this, this._widget, this._config.scope);
		this._foreach_scope_changed_listener = this._foreach_scope.on('changed', this._onDataSourceChanged, this);
		this._foreach_scope.on('new_enumerable', this._onEnumerableChanged, this);
		this._as = this._config.as;

	},
		function () {

		if (this._config.refresher) {
			this.createRefresher(this._config.refresher);
		}

	},
		function (name, value) {

		if (Lava.schema.DEBUG && name == "count") Lava.t("Tried to assign 'count' to Foreach view");
		this.Abstract$set(name, value);

	},
		function (refresher_config) {

		if (Lava.schema.DEBUG && (this._refresher || this._current_count)) Lava.t("Foreach: refresher is already created or createRefresher() was called outside of init()");
		if (Lava.schema.DEBUG && !this._container) Lava.t('View/Foreach: refresher needs container to work');

		var constructor = Lava.ClassManager.getConstructor(refresher_config['type'], 'Lava.view.refresher');
		this._refresher = /** @type {Lava.view.refresher.Standard} */ new constructor(refresher_config, this, this._container);

		this._refresher.on('removal_complete', this._onRemovalComplete, this);
		this._refresh = this._refresh_Refresher;
		this._removeTemplates = this._removeTemplates_Refresher;
		this._renderContent = this._renderContent_Refresher;
		this._broadcastToChildren = this._broadcastToChildren_Refresher;

	},
		function () {

		return this._refresher;

	},
		function () {

		var i = 0,
			removed_templates = [];

		for (; i < this._current_count; i++) {

			removed_templates.push(this._current_hash[this._current_uids[i]]);

		}

		removed_templates.length && this._removeTemplates(removed_templates);

		this._current_count = 0;
		this._current_hash = {};
		this._current_uids = [];
		this._current_templates = [];
		this._setCount(0);

	},
		function (removed_templates) {

		for (var i = 0, removed_count = removed_templates.length; i < removed_count; i++) {

			removed_templates[i].destroy();

		}

	},
		function (removed_templates) {

		this._refresher.prepareRemoval(removed_templates);

	},
		function () {

		var data_source = this._foreach_scope.getValue(),
			new_uids = data_source.getUIDs(),
			new_uid_to_index_map = data_source.getUIDToIndexMap(),
			count = data_source.getCount(),
			i = 0,
			uid,
			template,
			removed_templates = [],
			child_properties,
			current_templates = [];

		for (; i < this._current_count; i++) {

			uid = this._current_uids[i];

			if (!(uid in new_uid_to_index_map)) {

				removed_templates.push(this._current_hash[uid]);
				delete this._current_hash[uid];

			}

		}

		for (i = 0; i < count; i++) {

			uid = new_uids[i];

			child_properties = {
				foreach_index: i,
				foreach_name: data_source.getNameAt(new_uid_to_index_map[uid])
			};
			child_properties[this._as] = data_source.getValueAt(new_uid_to_index_map[uid]);

			if (uid in this._current_hash) {

				template = this._current_hash[uid];
				template.batchSetProperties(child_properties);

			} else {

				template = new Lava.system.Template(this._config.template, this._widget, this, child_properties);
				this._current_hash[uid] = template;

			}

			current_templates.push(template);

		}

		removed_templates.length && this._removeTemplates(removed_templates);

		this._current_count = count;
		this._current_uids = new_uids;
		this._current_templates = current_templates;
		this._requires_refresh_children = false;

	},
		function () {

		this._setCount(this._foreach_scope.getValue().getCount());
		this._requires_refresh_children = true;
		this.trySetDirty();

	},
		function (refresher, template) {

		template.destroy();

	},
		function () {

		if (Lava.schema.DEBUG && (this._argument.isWaitingRefresh() || this._foreach_scope.isWaitingRefresh())) Lava.t("Rendering a view in dirty state");

		var buffer = '',
			i = 0;

		this._requires_refresh_children && this._refreshChildren();

		for (; i < this._current_count; i++) {

			buffer += this._current_templates[i].render();

		}

		return buffer;

	},
		function () {

		if (Lava.schema.DEBUG && (this._argument.isWaitingRefresh() || this._foreach_scope.isWaitingRefresh())) Lava.t("Rendering a view in dirty state");
		this._requires_refresh_children && this._refreshChildren();
		return this._refresher.render(this._current_templates);

	},
		function () {

		this._requires_refresh_children && this._refreshChildren();
		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},
		function () {

		this._requires_refresh_children && this._refreshChildren();
		this._refresher.refresh(this._current_templates);

	},
		function (function_name) {

		for (var name in this._current_hash) {

			this._current_hash[name][function_name]();

		}

	},
		function (function_name) {

		this._refresher[function_name]();

	},
		function () {

		return this._foreach_scope;

	},
		function (new_count) {
		if (this._properties.count != new_count) {
			this._set("count", new_count);
		}
	},
		function () {

		var name;

		this._refresher && this._refresher.destroy();

		for (name in this._current_hash) {

			this._current_hash[name].destroy();

		}

		this._foreach_scope.destroy();
		this._argument.destroy();

		this.Abstract$destroy();

		// to speed up garbage collection and break this object forever (destroyed objects must not be used!)
		this._refresher = this._current_templates = this._current_hash = this._foreach_scope = this._argument = null;

	}
	],
	[
		function () {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("If view requires an argument");

		var i = 0,
			count,
			argument = new Lava.scope.Argument(this._config.argument, this, this._widget);

		this._argument_changed_listeners.push(argument.on('changed', this._onArgumentChanged, this));
		this._arguments.push(argument);

		if ('elseif_arguments' in this._config) {

			for (count = this._config.elseif_arguments.length; i < count; i++) {

				argument = new Lava.scope.Argument(this._config.elseif_arguments[i], this, this._widget);
				this._argument_changed_listeners.push(argument.on('changed', this._onArgumentChanged, this));
				this._arguments.push(argument);

			}

		}

		this._count_arguments = this._arguments.length;
		this._refreshActiveArgumentIndex();

		if (this._config.refresher) {
			this.createRefresher(this._config.refresher);
		}

	},
		function (refresher_config) {

		if (Lava.schema.DEBUG && (this._refresher || this._current_count)) Lava.t("If: refresher is already created or createRefresher() was called outside of init()");
		if (Lava.schema.DEBUG && !this._container) Lava.t('View/If: refresher needs container to work');

		var constructor = Lava.ClassManager.getConstructor(refresher_config['type'], 'Lava.view.refresher');
		this._refresher = /** @type {Lava.view.refresher.Standard} */ new constructor(refresher_config, this, this._container);

		this._refresher.on('removal_complete', this._onRemovalComplete, this);
		this._refresh = this._refresh_Refresher;
		this._removeTemplate = this._removeTemplate_Refresher;
		this._renderContent = this._renderContent_Refresher;
		this._broadcastToChildren = this._broadcastToChildren_Refresher;

	},
		function (refresher, template) {

		this._destroyTemplate(template);

	},
		function () {

		return this._refresher;

	},
		function () {

		this._active_argument_index = -1;

		for (var i = 0; i < this._count_arguments; i++) {

			if (!!this._arguments[i].getValue()) {

				this._active_argument_index = i;
				break;

			}

		}

	},
		function () {

		var result = null,
			index = this._active_argument_index;

		if (index != -1) {

			if (!this._content[index]) {

				this._content[index] = (index == 0)
					? new Lava.system.Template(this._config.template || [], this._widget, this, {if_index: index})
					: new Lava.system.Template(this._config.elseif_templates[index - 1] || [], this._widget, this, {if_index: index});

			}

			result = this._content[index];

		} else if ('else_template' in this._config) {

			if (this._else_content == null) {

				this._else_content = new Lava.system.Template(this._config.else_template || [], this._widget, this);

			}

			result = this._else_content;

		}

		return result;

	},
		function () {

		var old_active_argument_index = this._active_argument_index;
		this._refreshActiveArgumentIndex();

		if (this._active_argument_index != old_active_argument_index) {

			if (this._active_template && this._is_inDOM) {

				this._removeTemplate(this._active_template);

			}

			this.trySetDirty();
			this._active_template = null;

		}

	},
		function (template) {

		var index = this._content.indexOf(template);

		if (index == -1) {
			if (Lava.schema.DEBUG && template != this._else_content) Lava.t();
			this._else_content = null;
		} else {
			this._content[index] = null;
		}

		template.destroy();

	},
		function (template) {

		this._destroyTemplate(template);

	},
		function (template) {

		this._refresher.prepareRemoval([template]);

	},
		function () {

		if (Lava.schema.DEBUG) {

			for (var i = 0; i < this._count_arguments; i++) {

				this._arguments[i].isWaitingRefresh() && Lava.t("Rendering a view in dirty state");

			}

		}

		this._active_template = this._getActiveTemplate();
		return this._active_template ? this._active_template.render() : '';

	},
		function () {

		if (Lava.schema.DEBUG && this._active_argument_index != -1 && this._arguments[this._active_argument_index].isWaitingRefresh()) Lava.t();
		this._active_template = this._getActiveTemplate();
		return this._refresher.render(this._active_template ? [this._active_template] : []);

	},
		function (function_name) {

		this._active_template && this._active_template[function_name]();

	},
		function (function_name) {

		this._refresher[function_name]();

	},
		function () {

		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},
		function () {

		if (!this._active_template) {
			this._active_template = this._getActiveTemplate();
		}
		this._refresher.refresh(this._active_template ? [this._active_template] : []);

	},
		function () {

		var i = 0;

		this._refresher && this._refresher.destroy();

		for (; i < this._count_arguments; i++) {

			this._arguments[i].destroy();
			this._content[i] && this._content[i].destroy();

		}

		this._else_content && this._else_content.destroy();

		// to speed up garbage collection and break this object forever (destroyed objects must not be used!)
		this._refresher = this._content = this._else_content = this._arguments = this._active_template
			= this._argument_changed_listeners = null;

		this.Abstract$destroy();

	}
	],
	[
		function () {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Include view requires an argument");
		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._argument_changed_listener = this._argument.on('changed', this._onValueChanged, this);

	},
		function () {

		this._content && this._content.destroy();
		this._content = null;
		this.trySetDirty();

	},
		function () {

		if (Lava.schema.DEBUG && this._argument.isWaitingRefresh()) Lava.t("Rendering a view in dirty state");

		var result;

		if (this._container) {

			result = this._container.wrap(this._renderContent());

		} else {

			result = this._renderContent();

		}

		return result;

	},
		function () {

		return this._getContent().render();

	},
		function () {

		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},
		function (function_name) {

		if (this._content != null) {

			this._content[function_name]();

		}

	},
		function () {

		if (this._content == null) {

			var argument_value = this._argument.getValue();
			if (Lava.schema.DEBUG && argument_value && !Array.isArray(argument_value)) Lava.t("Include view expects to receive a template from it's argument");

			this._content = new Lava.system.Template(
				this._argument.getValue() || this._config.template || [],
				this._widget,
				this
			)

		}

		return this._content;

	},
		function () {

		this._content && this._content.destroy();
		this._argument.destroy();
		this._argument_changed_listener
			= this._argument
			= this._content
			= null;

		this.Abstract$destroy();

	}
	],
	[
		function (config, widget, parent_view, template, properties) {

		var name,
			count,
			i;

		if (Lava.schema.DEBUG && !config.is_extended) Lava.t("Widget was created with partial (unextended) config");

		if (Lava.schema.DEBUG) {
			for (name in this._property_descriptors) {
				if (!(name in this._properties)) Lava.t("All widget properties must have a default value");
			}
			if (config.default_events) {
				for (i = 0, count = config.default_events.length; i < count; i++) {
					if (!Lava.view_manager.isEventRouted(config.default_events[i])) Lava.t('Event is not routed: ' + config.default_events[i]);
				}
			}
		}

		this._parent_widget = widget;

		this.View$init(config, this, parent_view, template, properties);

		for (name in config.bindings) {

			this._bindings[name] = new Lava.scope.Binding(config.bindings[name], this);

		}

	},
		function (properties) {

		this.View$_initMembers(properties);

		for (var name in this._config.properties) {

			this.set(name, this._config.properties[name]);

		}

		if (Lava.schema.RESOURCES_ENABLED) {

			this._initResources(this._config);

		}

	},
		function (config) {

		var locale = Lava.schema.LOCALE,
			resource_owner,
			component_resource,
			resources;

		if ('resources_cache' in config) {

			resources = config.resources_cache[locale];

		}

		if ('resource_id' in config) {

			resource_owner = this['locateViewBy' + config.resource_id.locator_type](config.resource_id.locator);
			if (Lava.schema.DEBUG && (!resource_owner || !resource_owner.isWidget))
				Lava.t("Resource root not found: " + config.resource_id.locator_type + '=' + config.resource_id.locator);
			component_resource = resource_owner.getResource(config.resource_id.name, Lava.schema.LOCALE);

			if (component_resource) {

				if (Lava.schema.DEBUG && component_resource.type != 'component') Lava.t("resource value is not a component");

				resources = resources
					? Lava.resources.mergeResources(component_resource.value, resources)
					: component_resource.value;

			}

		}

		if (resources) {
			this._resources[locale] = resources;
			Lava.resources.mergeRootContainerStacks(resources);
		}

	},
		function (name, template_arguments) {

		var result = null;

		if (name in this._include_handlers) {

			result = this[this._include_handlers[name]](template_arguments);

		} else {

			result = this._config.includes[name];

		}

		return result;

	},
		function (dom_event_name, dom_event, target_name, view, template_arguments) {

		var result = false;

		if (target_name in this._event_handlers) {

			this[this._event_handlers[target_name]](dom_event_name, dom_event, view, template_arguments);
			result = true;

		}

		return result;

	},
		function (element, position) {

		if (this._is_inDOM) Lava.t("inject: widget is already in DOM");
		if (Lava.schema.DEBUG && this._parent_view) Lava.t("Widget: only top-level widgets can be inserted into DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("Widget: root widgets must have a container");

		// Otherwise, if you assign data to a widget, that was removed from DOM,
		// and then render it - it will render with old data.
		Lava.ScopeManager.refresh();

		// lock, cause render operation can change data. Although it's not recommended to change data in render().
		Lava.ScopeManager.lock();
		Firestorm.DOM.insertHTML(element, this.render(), position || 'Top');
		Lava.ScopeManager.unlock();
		this.broadcastInDOM();

	},
		function (element) {

		if (this._is_inDOM) Lava.t("inject: widget is already in DOM");
		if (Lava.schema.DEBUG && this._parent_view) Lava.t("Widget: only top-level widgets can be inserted into DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("Widget: root widgets must have a container");
		if (Lava.schema.DEBUG && !this._container.isElementContainer) Lava.t("injectIntoExistingElement expects an element containers");

		Lava.ScopeManager.refresh();

		Lava.ScopeManager.lock();
		this._container.captureExistingElement(element);
		this._container.setHTML(this._renderContent());
		Lava.ScopeManager.unlock();

		// rewritten broadcastInDOM - without this._container.informInDOM()
		this._is_inDOM = true;
		this._is_dirty = false;
		this._broadcastToChildren('broadcastInDOM');

	},
		function () {

		if (!this._is_inDOM) Lava.t("remove: widget is not in DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("remove: widget doesn't have a container");

		this._is_inDOM = false;
		this._is_dirty = false;
		this._broadcastToChildren('broadcastRemove');

		if (this._container.isElementContainer && !this._container.isElementOwner()) {

			this._container.releaseElement();

		} else {

			this._container.remove()

		}

	},
		function (name, arguments_array) {

		if (Lava.schema.DEBUG && !(name in this._modifiers)) Lava.t("Unknown widget modifier: " + name);

		return this[this._modifiers[name]].apply(this, arguments_array);

	},
		function (name, arguments_array) {

		Lava.t("Alpha version. This functionality may be removed later.");

	},
		function () {

		return this._parent_widget;

	},
		function (role, view, template_arguments) {

		var result = false;

		if (role in this._role_handlers) {

			this[this._role_handlers[role]](view, template_arguments);
			result = true;

		}

		return result;

	},
		function (name, value) {

		var descriptor;

		if (name in this._property_descriptors) {

			descriptor = this._property_descriptors[name];

			if (Lava.schema.DEBUG && descriptor.is_readonly) Lava.t("Trying to set readonly property: " + name);

			if (Lava.schema.widget.VALIDATE_PROPERTY_TYPES) {

				if (value === null) {

					if (!descriptor.is_nullable) Lava.t("Trying to assign NULL to non-nullable property");

				} else if (descriptor.type && !Lava.types[descriptor.type].isValidValue(value, descriptor)) {

					Lava.t("Assigned value does not match the property type: " + descriptor.type);

				}

			}

		}

		if (this._properties[name] !== value) {

			if (descriptor && descriptor.setter) {

				// you are forced to make setters private, cause type-checking will not work if setter is called directly.
				if (Lava.schema.DEBUG && descriptor.setter[0] != '_') Lava.t("Widget property setters must not be public: " + descriptor.setter);
				this[descriptor.setter](value, name);

			} else {

				this._set(name, value);

			}

		}

	},
		function (name) {

		return ((name in this._property_descriptors) && this._property_descriptors[name].getter)
			? this[this._property_descriptors[name].getter](name)
			: this.View$get(name);

	},
		function (path) {

		return Lava.ClassManager.getPackageConstructor(this.Class.path, path);

	},
		function (resource_name, locale) {

		locale = locale || Lava.schema.LOCALE;

		return ((locale in this._resources) && (resource_name in this._resources[locale]))
			? this._resources[locale][resource_name]
			: null;

	},
		function (view, config) {

		Lava.t('Not implemented: getDynamicScope');

	},
		function (resource_name, arguments_list, locale) {

		var string_descriptor = /** @type {_cTranslatableString} */ this.getResource(resource_name, locale || Lava.schema.LOCALE),
			result;

		if (string_descriptor) {

			if (Lava.schema.DEBUG && string_descriptor.type != 'string') Lava.t("[translate] resource is not a string: " + resource_name);

			if (arguments_list) {

				result = string_descriptor.value.replace(/\{(\d+)\}/g, function(dummy, index) {
					return arguments_list[index] || '';
				});

			} else {

				result = string_descriptor.value;

			}

		} else {

			result = '';
			Lava.logError("Resource string not found: " + resource_name);

		}

		return result;

	},
		function (string_name, n, arguments_list, locale) {

		var string_descriptor = /** @type {_cTranslatablePlural} */ this.getResource(string_name, locale || Lava.schema.LOCALE),
			form_index = Lava.locales[Lava.schema.LOCALE].pluralize(n || 0),
			pluralform,
			result;

		if (string_descriptor) {

			if (Lava.schema.DEBUG && string_descriptor.type != 'plural_string') Lava.t("[ntranslate] resource is not a plural_string: " + string_name);
			pluralform = string_descriptor.value[form_index];
			if (Lava.schema.DEBUG && pluralform == null) Lava.t("[ntranslate] requested plural string is missing one of it's plural forms:" + string_name);

			if (arguments_list) {

				result = pluralform.replace(/\{(\d+)\}/g, function(dummy, index) {
					return arguments_list[index] || '';
				});

			} else {

				result = pluralform;

			}

		} else {

			result = '';
			Lava.logError("Resource string not found: " + string_name);

		}

		return result;

	},
		function (value) {

		if (Lava.schema.DEBUG && typeof(value) != 'boolean') Lava.t("translateBoolean: argument is not boolean type");
		return Lava.locales[Lava.schema.LOCALE].booleans[+value];

	},
		function () {

		var name;

		for (name in this._bindings) {

			this._bindings[name].destroy();

		}

		this._bindings = this._resources = null;

		this.View$destroy();

	}
	],
	[
		function (config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);
		Lava.view_manager.dispatchRoles(this, this.DEFAULT_ROLES);

	},
		function (view) {

		this._input_container = view.getContainer();

		// type may be null in textarea
		if (!this._input_container.getProperty('type') && this._type) {
			this._input_container.storeProperty('type', this._type);
		}

		Lava.view_manager.cancelBubble();

	},
		function () {

		return this._input_container;

	},
		function (dom_event_name, dom_event, view) {

		Lava.app.fireGlobalEvent('focus_acquired', {
			target: this,
			element: view.getContainer().getDOMElement()
		});

	},
		function () {

		Lava.app.fireGlobalEvent('focus_lost');

	},
		function () {

		if (this._input_container && this._input_container.isInDOM()) {
			this._input_container.getDOMElement().focus();
		}

	},
		function () {

		return (this._properties.name && !this._properties.is_disabled && this._properties.value != null)
			? encodeURIComponent(this._properties.name) + '=' + encodeURIComponent(this._properties.value)
			: '';

	},
		function (value) {

		if (this._properties.is_valid != value) {
			this._set('is_valid', value);
		}

	},
		function (view) {

		view.getContainer().setProperty('for', Lava.ELEMENT_ID_PREFIX + this.guid);

	},
		function () {
		this._input_container = null;
		this.Standard$destroy();
	}
	],
	[
		function (value) {

		this._set('value', value);
		if (this._input_container) {
			this._input_container.setProperty('value', this._valueToElementProperty(value));
		}

	},
		function (value) {

		return value;

	},
		function () {

		var value = this._input_container.getDOMElement().value;

		if (this._properties.value != value) {

			this._set('value', value);
			this._input_container.storeProperty('value', this._properties.value);

		}

	},
		function () {

		this._refreshValue();

	}
	],
	[function () {

		return Firestorm.String.escape(this._properties.value, Firestorm.String.TEXTAREA_ESCAPE_REGEX);

	}],
	[function (view, template_arguments) {

		this.TextAbstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('value', this._properties.value);

	}],
	[],
	[
		function (view, template_arguments) {

		this.InputAbstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('checked', this._properties.is_checked ? 'checked' : null);

	},
		function (value) {

		this._set('is_checked', value);
		if (this._input_container) {
			this._input_container.setProperty('checked', this._properties.is_checked ? 'checked' : null);
		}

	},
		function () {

		this.set('is_checked', this._input_container.getDOMElement().checked);
		this._fire('checked_changed');

	},
		function () {

		return (this._properties.name && this._properties.is_checked)
			? this._properties.name + "=" + (this._properties.value || 'on')
			: '';

	}
	],
	[
		function () {

		if (this._input_container && this._input_container.getDOMElement()) {
			this._input_container.getDOMElement().indeterminate = this._properties.is_indeterminate;
		}

	},
		function () {

		this.RadioAbstract$broadcastInDOM();
		this._refreshIndeterminate();

	},
		function () {

		this.RadioAbstract$_refresh();
		this._refreshIndeterminate();

	},
		function (value, name) {

		this.RadioAbstract$_setIsChecked(value, name);
		this._setIsIndeterminate(false);

	},
		function (value) {

		if (this._properties.is_indeterminate != value) {
			this._set('is_indeterminate', value);
		}
		this._refreshIndeterminate(); // outside of condition: do not trust the browser and set anyway

	},
		function () {

		this.RadioAbstract$_onCheckedChanged();
		this.set('is_indeterminate', false);

	}
	],
	[function () {

		this.RadioAbstract$broadcastInDOM();

		if (this._input_container) {
			// There may be situation, when several radios with same name are rendered as checked.
			// Only the last one of them will stay checked, others will be turned off by the browser.
			this.set('is_checked', this._input_container.getDOMElement().checked);
		}

	}],
	[function (dom_event_name, dom_event) {

		this._fire('clicked');
		dom_event.preventDefault();

	}],
	[
		function () {

		this.InputAbstract$broadcastInDOM();
		this._refreshValue();

	},
		function () {

		this._refreshValue();

	},
		function () {

		// to synchronize the selected value after setting options and optgroups property
		this.InputAbstract$_refresh();
		this._refreshValue();

	},
		function () {

		Lava.t('Abstract function call: _refreshValue');

	}
	],
	[
		function () {

		var element = this._input_container.getDOMElement();
		// https://mootools.lighthouseapp.com/projects/2706/tickets/578-elementgetselected-behaves-differently-between-ffie-safari
		//noinspection BadExpressionStatementJS
		element.selectedIndex;
		this.set('value', element.value);

	},
		function (value) {

		var element;

		if (this._input_container) {
			element = this._input_container.getDOMElement();
			element.value = value;
			if (value != element.value) { // workaround for nonexistent values
				Lava.logError("[Select] nonexistent value assigned: " + value);
				value = element.value;
			}
		}

		this._set('value', value);

	},
		function (value) {
		return value == this._properties.value;
	}
	],
	[
		function (view, template_arguments) {

		this.SelectAbstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('multiple', true);

	},
		function () {

		var element = this._input_container.getDOMElement(),
			options = element.selectedOptions || element.options,
			result = [],
			i = 0,
			count = options.length,
			option_value,
			differs = false;

		for (; i < count; i++) {
			if (options[i].selected) {
				option_value = options[i].value || options[i].text;
				result.push(option_value);
				if (this._properties.value.indexOf(option_value) == -1) {
					differs = true;
				}
			}
		}

		if (differs || this._properties.value.length != result.length) {

			this._set('value', result);

		}

	},
		function (value) {

		var element,
			options,
			count,
			i = 0,
			option_value;

		if (this._input_container) {

			element = this._input_container.getDOMElement();
			options = element.options;
			count = options.length;
			for (; i < count; i++) {
				option_value = options[i].value || options[i].text;
				options[i].selected = (value.indexOf(option_value) != -1);
			}

		}

		this._set('value', value);

	},
		function (value) {

		return this._properties.value.indexOf(value) != -1;

	},
		function () {

		var result = [],
			name = this._properties.name,
			values = this._properties.value,
			i = 0,
			count = values.length;

		if (this._properties.name && !this._properties.is_disabled) {
			for (; i < count; i++) {
				result.push(
					encodeURIComponent(name) + '=' + encodeURIComponent(values[i])
				);
			}
		}

		return result.join('&');

	}
	],
	[
		function (config, widget, parent_view, template, properties) {

		this.Text$init(config, widget, parent_view, template, properties);

		if (config.options) {

			if (config.options['type']) {

				if (config.options['type'] != 'text') Lava.t('Numeric input: the only recognized "type" option value in "text"');
				this._type = config.options['type'];

			}

			if (config.options['data_type']) {

				this._data_type = config.options['data_type'];

			}

		}

	},
		function (value) {

		return value + '';

	},
		function () {

		var value = this._input_container.getDOMElement().value,
			is_valid = Lava.types[this._data_type].isValidString(value);

		if (this._properties.input_value != value) { // to bypass readonly check

			this._set('input_value', value);

		}

		if (is_valid) {

			if (this._properties.value != value) {

				this._set('value', value);
				this._input_container.storeProperty('value', value);

			}

			this._setValidity(true);

		}

		this._setValidity(is_valid);

	},
		function (value, name) {

		this.Text$_setValue(value, name);
		this._setValidity(true);

	}
	],
	[
		function (field_group_widget) {

		this._groups.push(field_group_widget);

	},
		function (field_widget) {

		if (field_widget.name == 'submit') {

			this._submit_fields.push(field_widget);
			field_widget.on('clicked', this._onSubmit, this);
			field_widget.on('destroy', this._onFieldDestroyed, this, this._submit_fields);

		} else {

			this._fields.push(field_widget);
			field_widget.on('destroy', this._onFieldDestroyed, this, this._fields);

		}

		Lava.view_manager.cancelBubble();

	},
		function () {



	},
		function () {

		return this._fields.slice();

	},
		function () {

		return this._submit_fields.slice();

	},
		function () {

		var i = 0,
			count = this._fields.length,
			result = [],
			value;

		for (; i < count; i++) {

			value = this._fields[i].toQueryString();
			if (value) {
				result.push(value);
			}

		}

		return result.join('&');

	},
		function (field_widget, event_args, native_args) {

		Firestorm.Array.exclude(native_args, field_widget);

	}
	],
	[
		function (config, widget, parent_view, template, properties) {

		this._panels = new Lava.system.Enumerable();
		this._properties._panels = this._panels;
		this.Standard$init(config, widget, parent_view, template, properties);

	},
		function (properties) {

		var data,
			i,
			count;

		this.Standard$_initMembers(properties);

		if (this._config.storage && this._config.storage.panels) {

			data = this._config.storage.panels;
			for (i = 0, count = data.length; i < count; i++) {

				this.addPanel({
					is_expanded: data[i].is_expanded || false,
					title_template: data[i].title,
					content_template: data[i].content
				});

			}

		}

	},
		function (properties) {

		if (Lava.schema.DEBUG && properties.isProperties) Lava.t("Wrong argument to addPanel. Plain object expected.");

		var panel = new Lava.mixin.Properties({
			is_expanded: false,
			title_template: null,
			content_template: null
		});
		panel.setProperties(properties);
		this._panels.push(panel);
		return panel;

	},
		function () {

		return this._panels.getValues();

	},
		function () {

		return this._panel_widgets.slice();

	},
		function (view) {

		this.registerPanel(view);

	},
		function (panel_widget) {

		var collapse_on_add = !this._config.options || !this._config.options['keep_new_panels_expanded'];

		if (panel_widget.get('is_expanded')) {

			if (this._active_panels.length && collapse_on_add && this._properties.is_enabled) {

				panel_widget.set('is_expanded', false);

			} else {

				this._active_panels.push(panel_widget);

			}

		}

		this._panel_widgets.push(panel_widget);

		this._listeners_by_panel_guid[panel_widget.guid] = {
			// note: if panel is outside of the widget, this listener may never fire
			destroy: panel_widget.on('destroy', this._onPanelDestroy, this, null, true),
			expanding: panel_widget.on('expanding', this._onPanelExpanding, this),
			collapsing: panel_widget.on('collapsing', this._onPanelCollapsing, this)
		};

	},
		function (panel_widget) {

		Firestorm.Array.exclude(this._panel_widgets, panel_widget);
		Firestorm.Array.exclude(this._active_panels, panel_widget);
		delete this._listeners_by_panel_guid[panel_widget.guid];

	},
		function (panel_widget) {

		var listeners = this._listeners_by_panel_guid[panel_widget.guid];
		if (listeners) {
			panel_widget.removeListener(listeners.destroy);
			panel_widget.removeListener(listeners.expanding);
			panel_widget.removeListener(listeners.collapsing);
			this._removePanel(panel_widget);
		}

	},
		function (panel) {

		var turnoff_panels,
			i = 0,
			count;

		if (this._properties.is_enabled) {

			turnoff_panels = this._active_panels.slice();
			for (i = 0, count = turnoff_panels.length; i < count; i++) {

				turnoff_panels[i].set('is_expanded', false);

			}

			this._active_panels = [panel];

		} else {

			this._active_panels.push(panel);

		}

		this._fire('panel_expanding', {
			panel: panel
		});

	},
		function (panel) {

		Firestorm.Array.exclude(this._active_panels, panel);
		this._fire('panel_collapsing', {
			panel: panel
		});

	},
		function (value, name) {

		var turnoff_panels = [],
			i = 0,
			last_index;

		if (value) {

			if (this._active_panels.length > 1) {

				last_index = this._active_panels.length - 1;
				// slice is needed for the listeners
				turnoff_panels = this._active_panels.slice(0, last_index);
				for (; i < last_index; i++) {
					turnoff_panels[i].set('is_expanded', false);
				}
				// keep expanded only the last opened panel
				this._active_panels = [this._active_panels[last_index]];

			}

		}

		this._set(name, value);

	},
		function (panel) {

		this._removePanel(panel);

	},
		function () {

		this._panels.removeAll();

	},
		function () {

		var panel_widgets = this._panel_widgets.slice(); // cause array will be modified during unregisterPanel()

		for (var i = 0, count = panel_widgets.length; i < count; i++) {

			this.unregisterPanel(panel_widgets[i]);

		}

		this._panels.removeAll();

	},
		function (panel) {

		this._panels.removeValue(panel); // everything else will be done by destroy listener

	},
		function () {

		var panels = this._active_panels.slice();

		for (var i = 0, count = panels.length; i < count; i++) {

			panels[i].set('is_expanded', false);

		}

	},
		function () {

		this.removeAllPanels();

		this._panels.destroy();
		this._panels = this._properties._panels = null;

		this.Standard$destroy();

	}
	],
	[
		function (config, widget, parent_view, template, properties) {

		this._tab_objects = new Lava.system.Enumerable();
		this._properties._tabs = this._tab_objects;

		this.Standard$init(config, widget, parent_view, template, properties);

	},
		function (properties) {

		var sugar_tabs,
			i,
			count,
			tab;

		this.Standard$_initMembers(properties);

		if (this._config.storage && this._config.storage.tabs) {

			sugar_tabs = this._config.storage.tabs;
			i = 0;
			count = sugar_tabs.length;

			for (; i < count; i++) {

				tab = sugar_tabs[i];
				this.addTab({
					name: tab.name || '',
					is_enabled: ("is_enabled" in tab) ? tab.is_enabled : true,
					is_hidden: ("is_hidden" in tab) ? tab.is_hidden : false,
					is_active: ("is_active" in tab) ? tab.is_active : false,
					title_template: tab.title,
					content_template: tab.content
				});

			}

		}

	},
		function (dom_event_name, dom_event, view, template_arguments) {

		var tab = template_arguments[0]; // tab object
		if (tab.get('is_enabled')) {
			this._setActiveTab(tab);
		}
		// to remove dotted outline in FF. This can be done with CSS, but CSS will disable it completely
		view.getContainer().getDOMElement().blur();
		dom_event.preventDefault();

	},
		function (properties) {

		if (Lava.schema.DEBUG && properties.isProperties) Lava.t("Wrong argument to addTab. Plain object expected.");

		var tab = new Lava.mixin.Properties({
			guid: Lava.guid++,
			name: '',
			is_enabled: true,
			is_hidden: false,
			is_active: false,
			title_template: null,
			content_template: null
		});
		tab.setProperties(properties);

		if (Lava.schema.DEBUG && tab.get('is_active') && (!tab.get('is_enabled') || tab.get('is_hidden'))) Lava.t('Tabs: added tab cannot be active and disabled/hidden at the same time');

		if (this._properties.active_tab == null && tab.get('is_enabled') && !tab.get('is_hidden')) {

			this._setActiveTab(tab);

		}

		if (tab.get('is_active') && this._properties.active_tab != tab) {
			if (this._properties.active_tab) {
				this._properties.active_tab.set('is_active', false);
			}
			this._set('active_tab', tab);
		}

		this._tab_objects.push(tab);

		tab.onPropertyChanged('is_enabled', this._onTabStateChanged, this);
		tab.onPropertyChanged('is_hidden', this._onTabStateChanged, this);
		tab.onPropertyChanged('is_active', this._onTabIsActiveChanged, this);

		return tab;

	},
		function (tab) {

		if (tab.get('is_active')) {

			this._setActiveTab(tab);

		} else if (this._properties.active_tab == tab) {

			this._setActiveTab(null);

		}

	},
		function (new_tab) {

		var old_active_tab = this._properties.active_tab;

		if (old_active_tab != new_tab) {

			this._set('active_tab', new_tab);
			if (new_tab) new_tab.set('is_active', true);
			if (old_active_tab) old_active_tab.set('is_active', false);

		}

	},
		function (tab) {

		if (tab.get('is_active') && (!tab.get('is_enabled') || tab.get('is_hidden'))) {

			this._fixActiveTab();

		}

	},
		function () {

		return this._tab_objects.getValues();

	},
		function (tab_object) {

		this._tab_objects.removeValue(tab_object);

		if (this._properties.active_tab == tab_object) {

			this._fixActiveTab();

		}

	},
		function () {

		var active_tab = null;

		this._tab_objects.each(function(tab) {
			var result = null;
			if (tab.get('is_enabled') && !tab.get('is_hidden')) {
				active_tab = tab;
				result = false;
			}
			return result;
		});

		this._setActiveTab(active_tab);

	},
		function () {

		var tabs = this._tab_objects.getValues(),
			i = 0,
			count = tabs.length;

		for (; i < count; i++) {
			this.removeTab(tabs[i]);
		}

		this._setActiveTab(null);

	},
		function (indices) {

		this._tab_objects.reorder(indices);

	},
		function (callback) {

		this._tab_objects.sort(callback);

	},
		function () {

		this.removeAllTabs();
		this._tab_objects.destroy();
		this._tab_objects = this._properties._tab_objects = null;

		this.Standard$destroy();

	}
	],
	[
		function (is_forwards) {

		var element = this._panel_container.getDOMElement(),
			animation_options;

		if (!this._animation) {

			animation_options = this._properties.is_animation_enabled ? this._config.options.animation : {"class": this.TOGGLE_ANIMATION_CLASS};
			this._animation = new Lava.animation[animation_options['class']](animation_options, element);
			this._animation.on('complete', this._onAnimationComplete, this);

		}

		// content may be re-rendered and the old element reference may become obsolete
		this._animation.setTarget(element);

		if (is_forwards) {

			this._animation.resetDirection();

		} else {

			this._animation.reverseDirection();

		}

		this._animation.safeStart();

	},
		function () {

		if (this._animation.isReversed()) {

			this._fire('collapsed');
			this._panel_container.setStyle('display', 'none');

		} else {

			this._fire('expanded');

		}

	},
		function (value, name) {

		var new_display = 'none';

		this._set(name, value);

		if ((this._is_inDOM && this._properties.is_animation_enabled) || value) {

			new_display = this._default_display; // allow display:none only in case the panel must be collapsed and animation is disabled

		}

		// if this property is set in constructor - then container does not yet exist
		if (this._panel_container) {

			this._panel_container.setStyle('display', new_display);

		}

		if (this._is_inDOM) {

			this._fire(value ? 'expanding' : 'collapsing');

			if (this._properties.is_animation_enabled && this._panel_container) {

				this._refreshAnimation(value);

			} else {

				this._fire(value ? 'expanded' : 'collapsed');

			}

		}

	},
		function (view) {

		this._panel_container = view.getContainer();

		this._default_display = this._panel_container.getStyle('display') || null;

		if (!this._properties.is_expanded) {

			this._panel_container.setStyle('display', 'none');

		}

	},
		function () {

		return this._panel_container;

	}
	],
	[function () {

		if (!this._properties.is_locked) {

			this.set('is_expanded', !this._properties.is_expanded);

		}

	}],
	[
		function (view) {

		var refresher = view.getRefresher();

		refresher.on('insertion_complete', this._onInsertionComplete, this);
		refresher.on('removal_complete', this._onRemovalComplete, this);

		if (!this._properties.is_animation_enabled) {
			refresher.disableAnimation();
		}

		this._content_refresher = refresher;

	},
		function () {

		this._fire('expanded');

	},
		function () {

		this._fire('collapsed');

	},
		function () {

		if (!this._properties.is_locked) {

			this.set('is_expanded', !this._properties.is_expanded);

			// previous line has switched it's value, so events are also swapped
			this._fire(this._properties.is_expanded ? 'expanding' : 'collapsing');

		}

	},
		function (value, name) {

		this._set(name, value);

		// it may be set via assign or right after creation. At this time refresher does not exist yet.
		if (this._content_refresher) {

			if (value) {

				this._content_refresher.enableAnimation();

			} else {

				this._content_refresher.disableAnimation();

			}

		}

	}
	],
	[
		function (config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);
		Lava.app.on('close_popups', this._onClosePopups, this);

	},
		function () {

		this.set('is_open', false);

	},
		function (dom_event_name, dom_event) {

		if (this._properties.is_open) {

			this.set('is_open', false);

		} else {

			Lava.app.fireGlobalEvent('close_popups');
			if (!this._click_listener) {
				this._click_listener = Lava.Core.addGlobalHandler('click', this._onGlobalClick, this);
			}

			this.set('is_open', true);

		}

		dom_event.preventDefault();

	},
		function () {

		Lava.Core.removeGlobalHandler(this._click_listener);
		this._click_listener = null;
		this.set('is_open', false);

	},
		function () {

		return this._target && this._target.getContainer() || this._container;

	},
		function (view) {

		this._trigger = view;
		view.getContainer().addEventTarget('click', {locator_type: "Guid", locator: this.guid, name: "trigger_click"});

	},
		function (view) {

		this._target = view;

	},
		function (value, name) {

		var open_target_container = this._getTargetContainer();
		if (Lava.schema.DEBUG && !open_target_container) Lava.t("DropDown was created without container and target");

		this._set(name, value);

		if (value) {

			open_target_container.addClass(this._config.options.target_class);

		} else {

			open_target_container.removeClass(this._config.options.target_class);

		}

	},
		function () {

		if (this._click_listener) {
			Lava.Core.removeGlobalHandler(this._click_listener);
			this._click_listener = null;
		}

		this._trigger = this._target = null;

		this.Standard$destroy();

	}
	],
	[
		function (config, widget, parent_view, template, properties) {

		var i = 0,
			count,
			columns_list,
			name;

		if (config.options && config.options.meta_storage_columns) {
			columns_list = config.options.meta_storage_columns;
			count = columns_list.length;
			for (; i < count; i++) {
				this._meta_storage_columns[columns_list[i]] = true;
			}
		}

		for (name in this._direct_bind_configs) {

			this._column_bind_configs[name] = (name in this._meta_storage_columns)
				? this._meta_storage_bind_configs[name]
				: this._direct_bind_configs[name];

		}

		if (this.CREATE_META_STORAGE || !Firestorm.Object.isEmpty(this._meta_storage_columns)) {
			this._meta_storage = new Lava.data.MetaStorage(this._meta_storage_config);
			this._properties.meta_storage = this._meta_storage;
		}

		this.Standard$init(config, widget, parent_view, template, properties);

		this._if_refresher_config = (config.options && config.options.refresher)
			? config.options.refresher
			: this._default_if_refresher_config

	},
		function (value, name) {

		if (this._meta_storage) {
			this._meta_storage.destroy();
			this._meta_storage = new Lava.data.MetaStorage(this._meta_storage_config);
			this._set('meta_storage', this._meta_storage);
		}

		this._set(name, value);

	},
		function (record) {

		return this._meta_storage.get(record.get('guid')) || this._meta_storage.createMetaRecord(record.get('guid'));

	},
		function (view) {

		view.createRefresher(this._if_refresher_config);

	},
		function (view) {

		view.createRefresher(this._foreach_refresher_config);

	},
		function (view) {

		view.createRefresher(this._foreach_refresher_config);
		view.getParentView().set('_foreach_view', view);

	},
		function (dom_event_name, dom_event, view, template_arguments) {

		// template_arguments[0] - node record
		if (Lava.schema.DEBUG) {
			if (!template_arguments[0].isProperties) {
				Lava.t("Tree: record is not instance of Properties");
			}
			if ('is_expanded' in this._meta_storage_columns) {
				if (!template_arguments[0].get('guid')) Lava.t("Tree: record without GUID");
			}
		}
		var property_source = ('is_expanded' in this._meta_storage_columns) ? this._getMetaRecord(template_arguments[0]) : template_arguments[0];
		property_source.set('is_expanded', !property_source.get('is_expanded'));
		dom_event.preventDefault(); // to prevent text selection

	},
		function (node, expanded_state) {

		var children = node.get('children'),
			child,
			i = 0,
			count = children.getCount(),
			property_source;

		if (count) {

			for (; i < count; i++) {
				child = children.getValueAt(i);
				if (child.get('children').getCount()) {
					this._toggleTree(child, expanded_state);
				}
			}

			property_source = ('is_expanded' in this._meta_storage_columns) ? this._getMetaRecord(node) : node;
			property_source.set('is_expanded', expanded_state);

		}

	},
		function (expanded_state) {

		var records = this._properties.records,
			i = 0,
			count,
			record;

		if (records) {
			count = records.getCount(); // Enumerable
			for (; i < count; i++) {
				record = records.getValueAt(i);
				this._toggleTree(record, expanded_state);
			}
		}

	},
		function () {

		this._toggleRecords(true);

	},
		function () {

		this._toggleRecords(false);

	},
		function (view, config) {

		if (!(config.property_name in this._column_bind_configs)) Lava.t('unknown dynamic scope: ' + config.property_name);
		return view.getScopeByPathConfig(this._column_bind_configs[config.property_name]);

	},
		function () {

		if (this._meta_storage) {
			this._meta_storage.destroy();
			this._meta_storage = null;
		}

		this.Standard$destroy();

	}
	],
	[
		function (config, widget, parent_view, template, properties) {

		if (Lava.schema.DEBUG && (!config.options || !config.options.columns)) Lava.t("Table: config.options.columns is required");
		this._properties._columns = config.options.columns;
		this.Standard$init(config, widget, parent_view, template, properties);

	},
		function (dom_event_name, dom_event, view, template_arguments) {

		var column_name = template_arguments[0].name,
			less;

		if (this._properties._sort_column_name != column_name) {

			this.set('_sort_column_name', column_name);
			this.set('_sort_descending', false);

		} else {

			this.set('_sort_descending', !this._properties._sort_descending);

		}

		less = this._properties._sort_descending
			? function(record_a, record_b) { return record_a.get(column_name) > record_b.get(column_name); }
			: function(record_a, record_b) { return record_a.get(column_name) < record_b.get(column_name); };

		if (this._properties.records) {
			this._properties.records.sort(less);
		}

	},
		function (template_arguments) {

		// var column = template_arguments[0]; - column descriptor from options
		return this._config.storage.cells[template_arguments[0].type];

	}
	],
	[
		function (locale_name) {

		var i,
			result = [],
			month_names = Lava.locales[locale_name].short_month_names;

		for (i = 0; i < 12; i++) {

			result[i] = new Lava.mixin.Properties({
				index: i,
				title: month_names[i]
			});

		}

		return result;

	},
		function (descriptors) {

		var result = [];
		result.push(descriptors.slice(0, 4));
		result.push(descriptors.slice(4, 8));
		result.push(descriptors.slice(8, 12));
		return result;

	},
		function (locale) {

		var culture_offset = Lava.locales[locale].first_day_offset,
			result = [],
			daynames = Lava.locales[locale].short_day_names,
			i,
			descriptor;

		for (i = 0; i < 7; i++) {
			descriptor = new Lava.mixin.Properties({
				index: i,
				title: daynames[culture_offset]
			});
			result.push(descriptor);
			culture_offset = (culture_offset + 1) % 7;
		}

		return result;

	},
		function (year, month, locale_name) {

		var culture_offset = Lava.locales[locale_name].first_day_offset,
			first_day_in_sequence = new Date(Date.UTC(year, month)),
			first_day_of_week = (first_day_in_sequence.getDay() - culture_offset + 7) % 7;

		if (first_day_of_week) { // the first day of month does not start at beginning of the row

			// Date object will correct the wrong arguments
			first_day_in_sequence = new Date(Date.UTC(year, month, 1 - first_day_of_week));

		}

		return {
			year: year,
			index: month,
			weeks: this._renderMonthWeeksData(first_day_in_sequence)
		}

	},
		function (start_date) {

		var year = start_date.getUTCFullYear(),
			month = start_date.getUTCMonth(),
			day = start_date.getUTCDate(),
			milliseconds = start_date.getTime(),
			day_of_week = 0, // 0 - 6
			days_in_month = Firestorm.Date.getDaysInMonth(year, month),
			i = 0,
			result = [],
			week = [];

		week.push(this._renderDayData(year, month, day, day_of_week, milliseconds));

		do {

			if (day == days_in_month) {
				day = 1;
				month++;
				if (month == 12) {
					month = 0;
					year++;
				}
				days_in_month = Firestorm.Date.getDaysInMonth(year, month);
			} else {
				day++;
			}
			day_of_week = (day_of_week + 1) % 7;
			i++;
			milliseconds += 86400000; // 24 hours

			if (day_of_week == 0) {
				result.push(week);
				week = [];
			}

			week.push(this._renderDayData(year, month, day, day_of_week, milliseconds));

		} while (i < 42); // 7*6

		return result;

	},
		function (year, month, day, day_of_week, milliseconds) {
		return {
			year: year,
			month: month,
			day: day,
			day_of_week: day_of_week,
			milliseconds: milliseconds,
			is_today: this._properties._current_day == day
				&& this._properties._current_month == month
				&& this._properties._current_year == year
		};
	}
	],
	[
		function (config, widget, parent_view, template, properties) {

		var current_date = new Date(),
			storage = this._properties,
			locale_object = Lava.locales[Lava.schema.LOCALE];

		// not using UTC values here to allow user to see the day in his own timezone
		storage._current_year = current_date.getFullYear();
		storage._current_month = current_date.getMonth();
		storage._current_day = current_date.getDate();

		storage._displayed_year = storage._current_year;
		storage._displayed_month = storage._current_month;

		storage._weekdays = this._getWeekDays(Lava.schema.LOCALE);
		storage._month_descriptors = this._getMonthDescriptors(Lava.schema.LOCALE);
		storage._month_descriptor_rows = this._getMonthDescriptorRows(storage._month_descriptors);

		this.CalendarAbstract$init(config, widget, parent_view, template, properties);

		if (this._properties.value == null) {
			this._setValue(current_date, 'value');
		}

		this.set(
			'_today_string',
			storage._current_day + ' ' + locale_object.month_names[storage._current_month] + ' ' + storage._current_year
		);

		this._refreshData();

	},
		function () {

		var locale_object = Lava.locales[Lava.schema.LOCALE],
			month_data = this._getMonthData(this._properties._displayed_year, this._properties._displayed_month);

		this.set('_months_data', [month_data]);

		// Formatting by hands, cause in future there may be added a possibility to set locale in options
		this.set(
			'_month_year_string',
			locale_object.month_names[this._properties._displayed_month] + ' ' + this._properties._displayed_year
		);

	},
		function (year, month) {

		var month_key = year + '' + month;

		if (!(month_key in this._months_cache)) {
			this._months_cache[month_key] = this._renderMonthData(year, month, Lava.schema.LOCALE);
		}

		return this._months_cache[month_key];

	},
		function (dom_event_name, dom_event) {

		var month = this._properties._displayed_month;
		if (month == 0) {
			this.set('_displayed_year', this._properties._displayed_year - 1);
			this.set('_displayed_month', 11);
		} else {
			this.set('_displayed_month', month - 1);
		}
		this._refreshData();

		dom_event.preventDefault();

	},
		function (dom_event_name, dom_event) {

		var month = this._properties._displayed_month;
		if (month == 11) {
			this.set('_displayed_year', this._properties._displayed_year + 1);
			this.set('_displayed_month', 0);
		} else {
			this.set('_displayed_month', month + 1);
		}
		this._refreshData();

		dom_event.preventDefault();

	},
		function (dom_event_name, dom_event) {

		var time = Date.UTC(this._properties._current_year, this._properties._current_month, this._properties._current_day);
		this._select(this._properties._current_year, this._properties._current_month, time);
		dom_event.preventDefault();

	},
		function (dom_event_name, dom_event, view, template_arguments) {

		var day = template_arguments[0]; // the rendered "day" structure
		this._select(day.year, day.month, day.milliseconds);
		dom_event.preventDefault(); // cancel selection

	},
		function (year, month, milliseconds) {

		this.set('_selection_start', milliseconds);
		this.set('_selection_end', milliseconds);
		if (this._properties._displayed_month != month) {
			this.set('_displayed_year', year);
			this.set('_displayed_month', month);
			this._refreshData();
		}

		this.set('value', new Date(milliseconds));

	},
		function (dom_event_name, dom_event) {

		this.set('_selected_view', 'months');
		if (this._year_input) {
			this._year_input.set('value', this._properties._displayed_year + '');
		}
		dom_event.preventDefault();

	},
		function (dom_event_name, dom_event) {

		this.set('_displayed_year', this.get('_displayed_year') - 1);
		this._clearInvalidInputState();
		dom_event.preventDefault();

	},
		function (dom_event_name, dom_event) {

		this.set('_displayed_year', this.get('_displayed_year') + 1);
		this._clearInvalidInputState();
		dom_event.preventDefault();

	},
		function (dom_event_name, dom_event, view, template_arguments) {

		var month_descriptor = template_arguments[0];
		this.set('_displayed_month', month_descriptor.get('index'));
		this.set('_selected_view', 'days');
		this._refreshData();

	},
		function (view) {

		this._year_input = view;
		view.onPropertyChanged('value', this._onYearInputValueChanged, this);

	},
		function () {

		// do not add the class to the container itself, just to the element
		// cause we do not need it to stay after refresh or render
		var year_input_container = this._year_input.getMainContainer(),
			element;

		if (year_input_container) {
			element = year_input_container.getDOMElement();
			if (element) {
				Firestorm.Element.addClass(element, this._config.options['invalid_input_class']);
			}
		}

	},
		function () {

		var year_input_container = this._year_input.getMainContainer(),
			element;

		if (year_input_container) {
			element = year_input_container.getDOMElement();
			if (element) {
				Firestorm.Element.removeClass(element, this._config.options['invalid_input_class']);
			}
		}

	},
		function (widget) {

		var value = widget.get('value');

		// maxlength is also set on input in the template
		if (value.length > 2 && value.length < 6 && /^\d+$/.test(value)) {
			this.set('_displayed_year', +value);
			this._clearInvalidInputState();
		} else {
			this._markInputAsInvalid();
		}

	},
		function (value) {

		var year = value.getFullYear(),
			month = value.getMonth(),
			day = value.getDate(),
			new_time = Date.UTC(year, month, day); // normalize for selection

		this.set('_displayed_year', year);
		this.set('_displayed_month', month);

		this.set('_selection_start', new_time);
		this.set('_selection_end', new_time);

		this._set('value', value);

		this._refreshData();

	}
	],
	[]
];
	var g = [
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[7];
	p.get = r[8];
	p.isset = r[9];
	p.set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.refresh = r[7];
	p._doRefresh = r[8];
	p._queueForRefresh = r[9];
	p.debugAssertClean = r[10];
	p.isWaitingRefresh = r[11];
	p.suspendRefreshable = r[12];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[0];
	p.animate = r[1];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[0];
	p.animate = r[1];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[7];
	p.onTimer = r[8];
	p._finish = r[9];
	p.safeStart = r[10];
	p.reverseDirection = r[11];
	p.resetDirection = r[12];
	p._mirror = r[13];
	p._afterMirror = r[14];
	p.isRunning = r[15];
	p.getStartedTime = r[16];
	p.getEndTime = r[17];
	p.getDuration = r[18];
	p.isReversed = r[19];
	p.getTarget = r[20];
	p.setTarget = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[22];
	p._callAnimators = r[23];
	p._animateDirect = r[24];
	p._animateReverse = r[25];
	p.start = r[26];
	p.stop = r[27];
	p._mirror = r[28];
	p.finish = r[29];
	p.setDuration = r[30];
	p.Abstract$init = r[7];
	p.onTimer = r[8];
	p._finish = r[9];
	p.safeStart = r[10];
	p.reverseDirection = r[11];
	p.resetDirection = r[12];
	p.Abstract$_mirror = r[13];
	p._afterMirror = r[14];
	p.isRunning = r[15];
	p.getStartedTime = r[16];
	p.getEndTime = r[17];
	p.getDuration = r[18];
	p.isReversed = r[19];
	p.getTarget = r[20];
	p.setTarget = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._shared = s._shared;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[31];
	p.start = r[32];
	p._finish = r[33];
	p.Standard$init = r[22];
	p._callAnimators = r[23];
	p._animateDirect = r[24];
	p._animateReverse = r[25];
	p.Standard$start = r[26];
	p.stop = r[27];
	p._mirror = r[28];
	p.finish = r[29];
	p.setDuration = r[30];
	p.Abstract$init = r[7];
	p.onTimer = r[8];
	p.Standard$_finish = r[9];
	p.safeStart = r[10];
	p.reverseDirection = r[11];
	p.resetDirection = r[12];
	p.Abstract$_mirror = r[13];
	p._afterMirror = r[14];
	p.isRunning = r[15];
	p.getStartedTime = r[16];
	p.getEndTime = r[17];
	p.getDuration = r[18];
	p.isReversed = r[19];
	p.getTarget = r[20];
	p.setTarget = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._shared = s._shared;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._finish = r[31];
	p.init = r[22];
	p._callAnimators = r[23];
	p._animateDirect = r[24];
	p._animateReverse = r[25];
	p.start = r[26];
	p.stop = r[27];
	p._mirror = r[28];
	p.finish = r[29];
	p.setDuration = r[30];
	p.Abstract$init = r[7];
	p.onTimer = r[8];
	p.Standard$_finish = r[9];
	p.safeStart = r[10];
	p.reverseDirection = r[11];
	p.resetDirection = r[12];
	p.Abstract$_mirror = r[13];
	p._afterMirror = r[14];
	p.isRunning = r[15];
	p.getStartedTime = r[16];
	p.getEndTime = r[17];
	p.getDuration = r[18];
	p.isReversed = r[19];
	p.getTarget = r[20];
	p.setTarget = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._shared = s._shared;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[22];
	p._onTimeout = r[23];
	p._end = r[24];
	p._cancelTimeout = r[25];
	p.start = r[26];
	p._start = r[27];
	p.stop = r[28];
	p._mirror = r[29];
	p._reverse = r[30];
	p.finish = r[31];
	p.Abstract$init = r[7];
	p.onTimer = r[8];
	p._finish = r[9];
	p.safeStart = r[10];
	p.reverseDirection = r[11];
	p.resetDirection = r[12];
	p.Abstract$_mirror = r[13];
	p._afterMirror = r[14];
	p.isRunning = r[15];
	p.getStartedTime = r[16];
	p.getEndTime = r[17];
	p.getDuration = r[18];
	p.isReversed = r[19];
	p.getTarget = r[20];
	p.setTarget = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[32];
	p._start = r[33];
	p._end = r[34];
	p._reverse = r[35];
	p.Emulated$init = r[22];
	p._onTimeout = r[23];
	p.Emulated$_end = r[24];
	p._cancelTimeout = r[25];
	p.start = r[26];
	p.Emulated$_start = r[27];
	p.stop = r[28];
	p._mirror = r[29];
	p.Emulated$_reverse = r[30];
	p.finish = r[31];
	p.Abstract$init = r[7];
	p.onTimer = r[8];
	p._finish = r[9];
	p.safeStart = r[10];
	p.reverseDirection = r[11];
	p.resetDirection = r[12];
	p.Abstract$_mirror = r[13];
	p._afterMirror = r[14];
	p.isRunning = r[15];
	p.getStartedTime = r[16];
	p.getEndTime = r[17];
	p.getDuration = r[18];
	p.isReversed = r[19];
	p.getTarget = r[20];
	p.setTarget = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[0];
	p.serialize = r[1];
	p._serializeValue = r[2];
	p._serializeArray = r[3];
	p._serializeString = r[4];
	p._serializeObject = r[5];
	p._serializeObjectProperty = r[6];
	p._serializeFunction = r[7];
	p._serializeFunction_Normal = r[8];
	p._serializeFunction_PrettyPrint = r[9];
	p._serializeBoolean = r[10];
	p._serializeNumber = r[11];
	p._serializeRegexp = r[12];
	p._serializeNull = r[13];
	p._serializeUndefined = r[14];
	p._complex_types = s._complex_types;
	p._callback_map = s._callback_map;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._setLength = r[18];
	p.isEmpty = r[19];
	p.getCount = r[20];
	p.get = r[21];
	p.getUIDs = r[22];
	p.getValues = r[23];
	p.getNames = r[24];
	p.getValuesHash = r[25];
	p.getUIDToIndexMap = r[26];
	p.getValueByLocalUID = r[27];
	p.getUIDAt = r[28];
	p.getValueAt = r[29];
	p.getNameAt = r[30];
	p.containsValue = r[31];
	p.containsLocalUID = r[32];
	p.indexOfValue = r[33];
	p.indexOfUID = r[34];
	p.set = r[35];
	p.pop = r[36];
	p.removeValue = r[37];
	p.swap = r[38];
	p.each = r[39];
	p.filter = r[40];
	p.sort = r[41];
	p.sortByNames = r[42];
	p._sort = r[43];
	p.reorder = r[44];
	p.removeRange = r[45];
	p.removeAll = r[46];
	p.removeAt = r[47];
	p.shift = r[48];
	p._createHelperStorage = r[49];
	p._assignStorage = r[50];
	p.destroy = r[51];
	p.init = r[7];
	p.Properties$get = r[8];
	p.isset = r[9];
	p.Properties$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[52];
	p.refreshFromDataSource = r[53];
	p._updateFromArray = r[54];
	p._updateFromEnumerable = r[55];
	p._updateFromObject = r[56];
	p._push = r[57];
	p.replaceAt = r[58];
	p.push = r[59];
	p.includeValue = r[60];
	p.insertRange = r[61];
	p.append = r[62];
	p.insertAt = r[63];
	p.unshift = r[64];
	p._setLength = r[18];
	p.isEmpty = r[19];
	p.getCount = r[20];
	p.get = r[21];
	p.getUIDs = r[22];
	p.getValues = r[23];
	p.getNames = r[24];
	p.getValuesHash = r[25];
	p.getUIDToIndexMap = r[26];
	p.getValueByLocalUID = r[27];
	p.getUIDAt = r[28];
	p.getValueAt = r[29];
	p.getNameAt = r[30];
	p.containsValue = r[31];
	p.containsLocalUID = r[32];
	p.indexOfValue = r[33];
	p.indexOfUID = r[34];
	p.set = r[35];
	p.pop = r[36];
	p.removeValue = r[37];
	p.swap = r[38];
	p.each = r[39];
	p.filter = r[40];
	p.sort = r[41];
	p.sortByNames = r[42];
	p._sort = r[43];
	p.reorder = r[44];
	p.removeRange = r[45];
	p.removeAll = r[46];
	p.removeAt = r[47];
	p.shift = r[48];
	p._createHelperStorage = r[49];
	p._assignStorage = r[50];
	p.destroy = r[51];
	p.CollectionAbstract$init = r[7];
	p.Properties$get = r[8];
	p.isset = r[9];
	p.Properties$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[52];
	p.refresh = r[53];
	p.setDataSource = r[54];
	p.refreshFromDataSource = r[55];
	p.getDataSource = r[56];
	p._setLength = r[18];
	p.isEmpty = r[19];
	p.getCount = r[20];
	p.get = r[21];
	p.getUIDs = r[22];
	p.getValues = r[23];
	p.getNames = r[24];
	p.getValuesHash = r[25];
	p.getUIDToIndexMap = r[26];
	p.getValueByLocalUID = r[27];
	p.getUIDAt = r[28];
	p.getValueAt = r[29];
	p.getNameAt = r[30];
	p.containsValue = r[31];
	p.containsLocalUID = r[32];
	p.indexOfValue = r[33];
	p.indexOfUID = r[34];
	p.set = r[35];
	p.pop = r[36];
	p.removeValue = r[37];
	p.swap = r[38];
	p.each = r[39];
	p.filter = r[40];
	p.sort = r[41];
	p.sortByNames = r[42];
	p._sort = r[43];
	p.reorder = r[44];
	p.removeRange = r[45];
	p.removeAll = r[46];
	p.removeAt = r[47];
	p.shift = r[48];
	p._createHelperStorage = r[49];
	p._assignStorage = r[50];
	p.destroy = r[51];
	p.CollectionAbstract$init = r[7];
	p.Properties$get = r[8];
	p.isset = r[9];
	p.Properties$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[0];
	p._createChildren = r[1];
	p._createDirect = r[2];
	p._createView = r[3];
	p._createInclude = r[4];
	p._createStaticValue = r[5];
	p._createStaticEval = r[6];
	p._createStaticTag = r[7];
	p._broadcast = r[8];
	p.render = r[9];
	p.broadcastRemove = r[10];
	p.broadcastInDOM = r[11];
	p.batchSetProperty = r[12];
	p.batchSetProperties = r[13];
	p.getFirstView = r[14];
	p.getLastView = r[15];
	p.getPreviousView = r[16];
	p.getNextView = r[17];
	p._seekForwards = r[18];
	p._seekBackwards = r[19];
	p.getViewsByLabel = r[20];
	p.getWidgetsByName = r[21];
	p.getCount = r[22];
	p.getAt = r[23];
	p.isInDOM = r[24];
	p.destroy = r[25];
	p._block_handlers_map = s._block_handlers_map;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[7];
	p.scheduleViewRefresh = r[8];
	p.refresh = r[9];
	p._refreshCycle = r[10];
	p.isRefreshing = r[11];
	p.registerView = r[12];
	p.unregisterView = r[13];
	p.getViewById = r[14];
	p.getViewByGuid = r[15];
	p._locateWidgetById = r[16];
	p._locateWidgetByGuid = r[17];
	p._locateWidgetByName = r[18];
	p._locateWidgetByLabel = r[19];
	p.locateTarget = r[20];
	p._dispatchCallback = r[21];
	p._callRegisterViewInRole = r[22];
	p.dispatchRoles = r[23];
	p._callHandleEvent = r[24];
	p._dispatchViewEvent = r[25];
	p.dispatchEvent = r[26];
	p._evalTargetArguments = r[27];
	p.getInclude = r[28];
	p.addGlobalEventTarget = r[29];
	p.removeGlobalEventTarget = r[30];
	p.addGlobalRoleTarget = r[31];
	p.removeGlobalRoleTarget = r[32];
	p._addTarget = r[33];
	p._removeTarget = r[34];
	p.getViewByElement = r[35];
	p.getViewsByLabel = r[36];
	p.handleMouseMovement = r[37];
	p._buildElementStack = r[38];
	p.onDOMEvent = r[39];
	p.lendEvent = r[40];
	p._initEvent = r[41];
	p.releaseEvent = r[42];
	p.isEventRouted = r[43];
	p._shutdownEvent = r[44];
	p.cancelBubble = r[45];
	p.destroy = r[46];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.getModule = r[7];
	p.fireGlobalEvent = r[8];
	p.destroy = r[9];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.parse = r[0];
	p._applyTopDirectives = r[1];
	p._parseInclude = r[2];
	p._parseStorage = r[3];
	p._parseUnion = r[4];
	p._parseStorageObject = r[5];
	p._parseRootAttributes = r[6];
	p._storeAttributesAsResource = r[7];
	p._parseRootIdAttribute = r[8];
	p._parseRootOptionAttribute = r[9];
	p._parseRootSwitchAttribute = r[10];
	p._parseRootPropertyAttribute = r[11];
	p._parseRootTargetsOptionAttribute = r[12];
	p._parseRootExpressionsOptionAttribute = r[13];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.enable = r[0];
	p.disable = r[1];
	p.isEnabled = r[2];
	p._onMouseoverStackChanged = r[3];
	p._onMouseMove = r[4];
	p.destroy = r[5];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.enable = r[7];
	p.disable = r[8];
	p.isEnabled = r[9];
	p.getFocusedTarget = r[10];
	p.getFocusedElement = r[11];
	p._setTarget = r[12];
	p._onElementBlurred = r[13];
	p._onElementFocused = r[14];
	p._onFocusTargetAcquired = r[15];
	p.clearFocusedTarget = r[16];
	p.blur = r[17];
	p.destroy = r[18];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[7];
	p.onModuleFieldsCreated = r[8];
	p.isValidValue = r[9];
	p.getInvalidReason = r[10];
	p.isNullable = r[11];
	p.initNewRecord = r[12];
	p.import = r[13];
	p.export = r[14];
	p.getValue = r[15];
	p.setValue = r[16];
	p._fireFieldChangedEvents = r[17];
	p._getImportValue = r[18];
	p.isLess = r[19];
	p.isEqual = r[20];
	p.destroy = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[22];
	p.onModuleFieldsCreated = r[23];
	p.import = r[24];
	p.export = r[25];
	p.getValue = r[26];
	p.setValue = r[27];
	p.Abstract$init = r[7];
	p.Abstract$onModuleFieldsCreated = r[8];
	p.isValidValue = r[9];
	p.getInvalidReason = r[10];
	p.isNullable = r[11];
	p.initNewRecord = r[12];
	p.Abstract$import = r[13];
	p.Abstract$export = r[14];
	p.Abstract$getValue = r[15];
	p.Abstract$setValue = r[16];
	p._fireFieldChangedEvents = r[17];
	p._getImportValue = r[18];
	p.isLess = r[19];
	p.isEqual = r[20];
	p.destroy = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[22];
	p.onModuleFieldsCreated = r[23];
	p._onRecordRemoved = r[24];
	p._onRecordAdded = r[25];
	p.isValidValue = r[26];
	p.getInvalidReason = r[27];
	p.import = r[28];
	p.export = r[29];
	p.getValue = r[30];
	p._onCollectionRecordsAdded = r[31];
	p._onCollectionRecordsRemoved = r[32];
	p._setCollectionOwner = r[33];
	p.getCount = r[34];
	p.setValue = r[35];
	p.isLess = r[36];
	p.isEqual = r[37];
	p.destroy = r[38];
	p.Abstract$init = r[7];
	p.Abstract$onModuleFieldsCreated = r[8];
	p.Abstract$isValidValue = r[9];
	p.Abstract$getInvalidReason = r[10];
	p.isNullable = r[11];
	p.initNewRecord = r[12];
	p.Abstract$import = r[13];
	p.Abstract$export = r[14];
	p.Abstract$getValue = r[15];
	p.Abstract$setValue = r[16];
	p._fireFieldChangedEvents = r[17];
	p._getImportValue = r[18];
	p.Abstract$isLess = r[19];
	p.Abstract$isEqual = r[20];
	p.Abstract$destroy = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.VALID_VALUE_REGEX = r[28];
	p.isValidValue = r[29];
	p.getInvalidReason = r[30];
	p.init = r[22];
	p.onModuleFieldsCreated = r[23];
	p.import = r[24];
	p.export = r[25];
	p.getValue = r[26];
	p.setValue = r[27];
	p.Abstract$init = r[7];
	p.Abstract$onModuleFieldsCreated = r[8];
	p.Basic$isValidValue = r[9];
	p.Basic$getInvalidReason = r[10];
	p.isNullable = r[11];
	p.initNewRecord = r[12];
	p.Abstract$import = r[13];
	p.Abstract$export = r[14];
	p.Abstract$getValue = r[15];
	p.Abstract$setValue = r[16];
	p._fireFieldChangedEvents = r[17];
	p._getImportValue = r[18];
	p.isLess = r[19];
	p.isEqual = r[20];
	p.destroy = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.VALID_VALUE_REGEX = r[22];
	p.init = r[23];
	p.onModuleFieldsCreated = r[24];
	p.isValidValue = r[25];
	p.getInvalidReason = r[26];
	p.import = r[27];
	p.export = r[28];
	p.getValue = r[29];
	p.setValue = r[30];
	p.Abstract$init = r[7];
	p.Abstract$onModuleFieldsCreated = r[8];
	p.Abstract$isValidValue = r[9];
	p.Abstract$getInvalidReason = r[10];
	p.isNullable = r[11];
	p.initNewRecord = r[12];
	p.Abstract$import = r[13];
	p.Abstract$export = r[14];
	p.Abstract$getValue = r[15];
	p.Abstract$setValue = r[16];
	p._fireFieldChangedEvents = r[17];
	p._getImportValue = r[18];
	p.isLess = r[19];
	p.isEqual = r[20];
	p.destroy = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.initNewRecord = r[28];
	p.import = r[29];
	p._registerByForeignKey = r[30];
	p.setValue = r[31];
	p.getCollection = r[32];
	p.destroy = r[33];
	p.init = r[22];
	p.onModuleFieldsCreated = r[23];
	p.Basic$import = r[24];
	p.export = r[25];
	p.getValue = r[26];
	p.Basic$setValue = r[27];
	p.Abstract$init = r[7];
	p.Abstract$onModuleFieldsCreated = r[8];
	p.isValidValue = r[9];
	p.getInvalidReason = r[10];
	p.isNullable = r[11];
	p.Basic$initNewRecord = r[12];
	p.Abstract$import = r[13];
	p.Abstract$export = r[14];
	p.Abstract$getValue = r[15];
	p.Abstract$setValue = r[16];
	p._fireFieldChangedEvents = r[17];
	p._getImportValue = r[18];
	p.isLess = r[19];
	p.isEqual = r[20];
	p.Basic$destroy = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[22];
	p.onModuleFieldsCreated = r[23];
	p._onReferencedModuleRecordsLoaded = r[24];
	p._onExternalIdCreated = r[25];
	p._onForeignKeyChanged = r[26];
	p.isValidValue = r[27];
	p.getInvalidReason = r[28];
	p.initNewRecord = r[29];
	p.import = r[30];
	p._registerByReferencedId = r[31];
	p.export = r[32];
	p.getValue = r[33];
	p.setValue = r[34];
	p._unregisterRecord = r[35];
	p._registerRecord = r[36];
	p.getCollection = r[37];
	p.getCollectionCount = r[38];
	p.getReferencedModule = r[39];
	p._getComparisonValue = r[40];
	p.isLess = r[41];
	p.isEqual = r[42];
	p.destroy = r[43];
	p.Abstract$init = r[7];
	p.Abstract$onModuleFieldsCreated = r[8];
	p.Abstract$isValidValue = r[9];
	p.Abstract$getInvalidReason = r[10];
	p.isNullable = r[11];
	p.Abstract$initNewRecord = r[12];
	p.Abstract$import = r[13];
	p.Abstract$export = r[14];
	p.Abstract$getValue = r[15];
	p.Abstract$setValue = r[16];
	p._fireFieldChangedEvents = r[17];
	p._getImportValue = r[18];
	p.Abstract$isLess = r[19];
	p.Abstract$isEqual = r[20];
	p.Abstract$destroy = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.isValidValue = r[28];
	p.getInvalidReason = r[29];
	p.init = r[22];
	p.onModuleFieldsCreated = r[23];
	p.import = r[24];
	p.export = r[25];
	p.getValue = r[26];
	p.setValue = r[27];
	p.Abstract$init = r[7];
	p.Abstract$onModuleFieldsCreated = r[8];
	p.Basic$isValidValue = r[9];
	p.Basic$getInvalidReason = r[10];
	p.isNullable = r[11];
	p.initNewRecord = r[12];
	p.Abstract$import = r[13];
	p.Abstract$export = r[14];
	p.Abstract$getValue = r[15];
	p.Abstract$setValue = r[16];
	p._fireFieldChangedEvents = r[17];
	p._getImportValue = r[18];
	p.isLess = r[19];
	p.isEqual = r[20];
	p.destroy = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.export = r[22];
	p.getValue = r[23];
	p.setValue = r[24];
	p.init = r[7];
	p.onModuleFieldsCreated = r[8];
	p.isValidValue = r[9];
	p.getInvalidReason = r[10];
	p.isNullable = r[11];
	p.initNewRecord = r[12];
	p.import = r[13];
	p.Abstract$export = r[14];
	p.Abstract$getValue = r[15];
	p.Abstract$setValue = r[16];
	p._fireFieldChangedEvents = r[17];
	p._getImportValue = r[18];
	p.isLess = r[19];
	p.isEqual = r[20];
	p.destroy = r[21];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._createFields = r[7];
	p.initFields = r[8];
	p._createRecordProperties = r[9];
	p.getAllRecords = r[10];
	p.getCount = r[11];
	p.destroy = r[12];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[13];
	p._onRecordIdChanged = r[14];
	p.hasField = r[15];
	p.getField = r[16];
	p.getRecordById = r[17];
	p.getRecordByGuid = r[18];
	p.getApp = r[19];
	p.safeLoadRecord = r[20];
	p.loadRecord = r[21];
	p.createRecord = r[22];
	p._createRecordInstance = r[23];
	p.loadRecords = r[24];
	p.destroy = r[25];
	p._createFields = r[7];
	p.initFields = r[8];
	p._createRecordProperties = r[9];
	p.getAllRecords = r[10];
	p.getCount = r[11];
	p.ModuleAbstract$destroy = r[12];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[0];
	p.get = r[1];
	p.set = r[2];
	p.getModule = r[3];
	p.export = r[4];
	p.isset = r[14];
	p._set = r[16];
	p.setProperties = r[17];
	p.getProperties = r[18];
	p.firePropertyChangedEvents = r[19];
	p.onPropertyChanged = r[20];
	p.removePropertyListener = r[21];
	p._firePropertyChanged = r[22];
	p.on = r[5];
	p._addListener = r[6];
	p.removeListener = r[7];
	p._removeListener = r[8];
	p._fire = r[9];
	p._callListeners = r[10];
	p._hasListeners = r[11];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[23];
	p.getOriginalRecord = r[24];
	p.Record$init = r[0];
	p.get = r[1];
	p.set = r[2];
	p.getModule = r[3];
	p.export = r[4];
	p.isset = r[14];
	p._set = r[16];
	p.setProperties = r[17];
	p.getProperties = r[18];
	p.firePropertyChangedEvents = r[19];
	p.onPropertyChanged = r[20];
	p.removePropertyListener = r[21];
	p._firePropertyChanged = r[22];
	p.on = r[5];
	p._addListener = r[6];
	p.removeListener = r[7];
	p._removeListener = r[8];
	p._fire = r[9];
	p._callListeners = r[10];
	p._hasListeners = r[11];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[13];
	p.get = r[14];
	p.set = r[15];
	p.createMetaRecord = r[16];
	p._createFields = r[7];
	p.initFields = r[8];
	p._createRecordProperties = r[9];
	p.getAllRecords = r[10];
	p.getCount = r[11];
	p.destroy = r[12];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p.isset = r[26];
	p._set = r[28];
	p.setProperties = r[29];
	p.getProperties = r[30];
	p.firePropertyChangedEvents = r[31];
	p.onPropertyChanged = r[32];
	p.removePropertyListener = r[33];
	p._firePropertyChanged = r[34];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.getDataBinding = r[13];
	p.getSegment = r[14];
	p.destroy = r[15];
	p.refresh = r[7];
	p._doRefresh = r[8];
	p._queueForRefresh = r[9];
	p.debugAssertClean = r[10];
	p.isWaitingRefresh = r[11];
	p.suspendRefreshable = r[12];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[13];
	p.getWidgetByModifierConfig = r[14];
	p.onBindingChanged = r[15];
	p._evaluate = r[16];
	p.getValue = r[17];
	p._doRefresh = r[18];
	p._callModifier = r[19];
	p._callActiveModifier = r[20];
	p._callGlobalModifier = r[21];
	p.destroy = r[22];
	p.refresh = r[7];
	p.Refreshable$_doRefresh = r[8];
	p._queueForRefresh = r[9];
	p.debugAssertClean = r[10];
	p.isWaitingRefresh = r[11];
	p.suspendRefreshable = r[12];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[0];
	p.onScopeChanged = r[1];
	p.onWidgetPropertyChanged = r[2];
	p.destroy = r[3];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[16];
	p._refreshValue = r[17];
	p.isConnected = r[18];
	p.onParentDataSourceChanged = r[19];
	p._doRefresh = r[20];
	p.onValueChanged = r[21];
	p.setValue = r[22];
	p.getValue = r[23];
	p.destroy = r[24];
	p.getDataBinding = r[13];
	p.getSegment = r[14];
	p.Abstract$destroy = r[15];
	p.refresh = r[7];
	p.Abstract$_doRefresh = r[8];
	p._queueForRefresh = r[9];
	p.debugAssertClean = r[10];
	p.isWaitingRefresh = r[11];
	p.suspendRefreshable = r[12];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[13];
	p._onDependencyChanged = r[14];
	p._refreshDataSource = r[15];
	p._refreshDataSource_Enumerable = r[16];
	p._refreshDataSource_DataView = r[17];
	p.refreshDataSource = r[18];
	p.createsOwnEnumerable = r[19];
	p._createCollection = r[20];
	p._flushObservable = r[21];
	p.onDataSourceChanged = r[22];
	p._onObservableChanged = r[23];
	p._doRefresh = r[24];
	p.getValue = r[25];
	p.destroy = r[26];
	p.refresh = r[7];
	p.Refreshable$_doRefresh = r[8];
	p._queueForRefresh = r[9];
	p.debugAssertClean = r[10];
	p.isWaitingRefresh = r[11];
	p.suspendRefreshable = r[12];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[16];
	p.isConnected = r[17];
	p.onAssignChanged = r[18];
	p.onContainerPropertyChanged = r[19];
	p.getValue = r[20];
	p.setValue = r[21];
	p._doRefresh = r[22];
	p.destroy = r[23];
	p.getDataBinding = r[13];
	p.getSegment = r[14];
	p.Abstract$destroy = r[15];
	p.refresh = r[7];
	p.Abstract$_doRefresh = r[8];
	p._queueForRefresh = r[9];
	p.debugAssertClean = r[10];
	p.isWaitingRefresh = r[11];
	p.suspendRefreshable = r[12];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[16];
	p.isConnected = r[17];
	p._refreshDataBinding = r[18];
	p._destroyDataBinding = r[19];
	p.onDataBindingChanged = r[20];
	p._doRefresh = r[21];
	p.onPropertyNameChanged = r[22];
	p.getValue = r[23];
	p.setValue = r[24];
	p.destroy = r[25];
	p.getDataBinding = r[13];
	p.getSegment = r[14];
	p.Abstract$destroy = r[15];
	p.refresh = r[7];
	p.Abstract$_doRefresh = r[8];
	p._queueForRefresh = r[9];
	p.debugAssertClean = r[10];
	p.isWaitingRefresh = r[11];
	p.suspendRefreshable = r[12];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[0];
	p.init_Normal = r[1];
	p.getEventTargets = r[2];
	p.addEventTarget = r[3];
	p.addEventTarget_IOS = r[4];
	p.addEventTarget_Normal = r[5];
	p.setProperty = r[6];
	p.storeProperty = r[7];
	p.getProperty = r[8];
	p.syncProperty = r[9];
	p.addClass = r[10];
	p.removeClass = r[11];
	p.addClasses = r[12];
	p.hasStaticClass = r[13];
	p.syncClasses = r[14];
	p.setStyle = r[15];
	p.removeStyle = r[16];
	p.getStyle = r[17];
	p.syncStyles = r[18];
	p._createArguments = r[19];
	p._onPropertyBindingChanged = r[20];
	p._onStyleBindingChanged = r[21];
	p._toClassNames = r[22];
	p._onClassBindingChanged = r[23];
	p.assertStyleValid = r[24];
	p.assertClassStringValid = r[25];
	p._renderClasses = r[26];
	p._renderStyles = r[27];
	p._renderAttribute = r[28];
	p._renderOpeningTag = r[29];
	p.wrap = r[30];
	p.renderVoid = r[31];
	p.setHTML = r[32];
	p.appendHTML = r[33];
	p.prependHTML = r[34];
	p.insertHTMLAfter = r[35];
	p.insertHTMLBefore = r[36];
	p.informInDOM = r[37];
	p.informInDOM_IOS = r[38];
	p.informInDOM_Normal = r[39];
	p.informRemove = r[40];
	p.getDOMElement = r[41];
	p.getStartElement = r[42];
	p.getEndElement = r[43];
	p.getId = r[44];
	p.isInDOM = r[45];
	p.isVoid = r[46];
	p.release = r[47];
	p._withArguments = r[48];
	p.captureExistingElement = r[49];
	p.releaseElement = r[50];
	p.isElementOwner = r[51];
	p.escapeAttributeValue = r[52];
	p.remove = r[53];
	p.destroy = r[54];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[55];
	p.init_IE = r[56];
	p.informInDOM = r[57];
	p.informRemove = r[58];
	p.informInDOM_IE = r[59];
	p.informRemove_IE = r[60];
	p.Element$init = r[0];
	p.init_Normal = r[1];
	p.getEventTargets = r[2];
	p.addEventTarget = r[3];
	p.addEventTarget_IOS = r[4];
	p.addEventTarget_Normal = r[5];
	p.setProperty = r[6];
	p.storeProperty = r[7];
	p.getProperty = r[8];
	p.syncProperty = r[9];
	p.addClass = r[10];
	p.removeClass = r[11];
	p.addClasses = r[12];
	p.hasStaticClass = r[13];
	p.syncClasses = r[14];
	p.setStyle = r[15];
	p.removeStyle = r[16];
	p.getStyle = r[17];
	p.syncStyles = r[18];
	p._createArguments = r[19];
	p._onPropertyBindingChanged = r[20];
	p._onStyleBindingChanged = r[21];
	p._toClassNames = r[22];
	p._onClassBindingChanged = r[23];
	p.assertStyleValid = r[24];
	p.assertClassStringValid = r[25];
	p._renderClasses = r[26];
	p._renderStyles = r[27];
	p._renderAttribute = r[28];
	p._renderOpeningTag = r[29];
	p.wrap = r[30];
	p.renderVoid = r[31];
	p.setHTML = r[32];
	p.appendHTML = r[33];
	p.prependHTML = r[34];
	p.insertHTMLAfter = r[35];
	p.insertHTMLBefore = r[36];
	p.Element$informInDOM = r[37];
	p.informInDOM_IOS = r[38];
	p.informInDOM_Normal = r[39];
	p.Element$informRemove = r[40];
	p.getDOMElement = r[41];
	p.getStartElement = r[42];
	p.getEndElement = r[43];
	p.getId = r[44];
	p.isInDOM = r[45];
	p.isVoid = r[46];
	p.release = r[47];
	p._withArguments = r[48];
	p.captureExistingElement = r[49];
	p.releaseElement = r[50];
	p.isElementOwner = r[51];
	p.escapeAttributeValue = r[52];
	p.remove = r[53];
	p.destroy = r[54];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[55];
	p.init_IE = r[56];
	p.informInDOM = r[57];
	p.informRemove = r[58];
	p.informInDOM_OldIE = r[59];
	p.informRemove_OldIE = r[60];
	p._sendRefreshValue = r[61];
	p.Element$init = r[0];
	p.init_Normal = r[1];
	p.getEventTargets = r[2];
	p.addEventTarget = r[3];
	p.addEventTarget_IOS = r[4];
	p.addEventTarget_Normal = r[5];
	p.setProperty = r[6];
	p.storeProperty = r[7];
	p.getProperty = r[8];
	p.syncProperty = r[9];
	p.addClass = r[10];
	p.removeClass = r[11];
	p.addClasses = r[12];
	p.hasStaticClass = r[13];
	p.syncClasses = r[14];
	p.setStyle = r[15];
	p.removeStyle = r[16];
	p.getStyle = r[17];
	p.syncStyles = r[18];
	p._createArguments = r[19];
	p._onPropertyBindingChanged = r[20];
	p._onStyleBindingChanged = r[21];
	p._toClassNames = r[22];
	p._onClassBindingChanged = r[23];
	p.assertStyleValid = r[24];
	p.assertClassStringValid = r[25];
	p._renderClasses = r[26];
	p._renderStyles = r[27];
	p._renderAttribute = r[28];
	p._renderOpeningTag = r[29];
	p.wrap = r[30];
	p.renderVoid = r[31];
	p.setHTML = r[32];
	p.appendHTML = r[33];
	p.prependHTML = r[34];
	p.insertHTMLAfter = r[35];
	p.insertHTMLBefore = r[36];
	p.Element$informInDOM = r[37];
	p.informInDOM_IOS = r[38];
	p.informInDOM_Normal = r[39];
	p.Element$informRemove = r[40];
	p.getDOMElement = r[41];
	p.getStartElement = r[42];
	p.getEndElement = r[43];
	p.getId = r[44];
	p.isInDOM = r[45];
	p.isVoid = r[46];
	p.release = r[47];
	p._withArguments = r[48];
	p.captureExistingElement = r[49];
	p.releaseElement = r[50];
	p.isElementOwner = r[51];
	p.escapeAttributeValue = r[52];
	p.remove = r[53];
	p.destroy = r[54];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[0];
	p._getElements = r[1];
	p.getStartElement = r[2];
	p.getEndElement = r[3];
	p.wrap = r[4];
	p.setHTML = r[5];
	p.remove = r[6];
	p.appendHTML = r[7];
	p.prependHTML = r[8];
	p.insertHTMLAfter = r[9];
	p.insertHTMLBefore = r[10];
	p.informInDOM = r[11];
	p.informRemove = r[12];
	p.release = r[13];
	p.refresh = r[14];
	p.isInDOM = r[15];
	p.getWidget = r[16];
	p.getView = r[17];
	p.destroy = r[18];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[0];
	p.wrap = r[1];
	p.setHTML = r[2];
	p.remove = r[3];
	p._appendBottom = r[4];
	p._appendTop = r[5];
	p._appendAfterPrevious = r[6];
	p._appendBeforeNext = r[7];
	p.appendHTML = r[8];
	p.prependHTML = r[9];
	p.insertHTMLBefore = r[10];
	p.insertHTMLAfter = r[11];
	p.informInDOM = r[12];
	p.informRemove = r[13];
	p.refresh = r[14];
	p.isInDOM = r[15];
	p.getWidget = r[16];
	p.getView = r[17];
	p.release = r[18];
	p.destroy = r[19];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[7];
	p.prepareRemoval = r[8];
	p.refresh = r[9];
	p._insertFirstTemplate = r[10];
	p._moveTemplate = r[11];
	p._getStartElement = r[12];
	p._getEndElement = r[13];
	p.render = r[14];
	p._render = r[15];
	p._insertTemplate = r[16];
	p._removeTemplate = r[17];
	p.hasAnimations = r[18];
	p.isAnimationEnabled = r[19];
	p.broadcastInDOM = r[20];
	p.broadcastRemove = r[21];
	p._broadcast = r[22];
	p.destroy = r[23];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.refresh = r[24];
	p._refreshAnimated = r[25];
	p.render = r[26];
	p.enableAnimation = r[27];
	p.disableAnimation = r[28];
	p.isAnimationEnabled = r[29];
	p._finishAnimations = r[30];
	p.hasAnimations = r[31];
	p._animateInsertion = r[32];
	p._animateRemoval = r[33];
	p._onAnimationComplete = r[34];
	p._getAnimationTarget = r[35];
	p._onRemovalComplete = r[36];
	p._onInsertionComplete = r[37];
	p._createAnimation = r[38];
	p.broadcastRemove = r[39];
	p.destroy = r[40];
	p.init = r[7];
	p.prepareRemoval = r[8];
	p.Standard$refresh = r[9];
	p._insertFirstTemplate = r[10];
	p._moveTemplate = r[11];
	p._getStartElement = r[12];
	p._getEndElement = r[13];
	p.Standard$render = r[14];
	p._render = r[15];
	p._insertTemplate = r[16];
	p._removeTemplate = r[17];
	p.Standard$hasAnimations = r[18];
	p.Standard$isAnimationEnabled = r[19];
	p.broadcastInDOM = r[20];
	p.Standard$broadcastRemove = r[21];
	p._broadcast = r[22];
	p.Standard$destroy = r[23];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._createAnimation = r[41];
	p.refresh = r[24];
	p._refreshAnimated = r[25];
	p.render = r[26];
	p.enableAnimation = r[27];
	p.disableAnimation = r[28];
	p.isAnimationEnabled = r[29];
	p._finishAnimations = r[30];
	p.hasAnimations = r[31];
	p._animateInsertion = r[32];
	p._animateRemoval = r[33];
	p._onAnimationComplete = r[34];
	p._getAnimationTarget = r[35];
	p._onRemovalComplete = r[36];
	p._onInsertionComplete = r[37];
	p.Animated$_createAnimation = r[38];
	p.broadcastRemove = r[39];
	p.destroy = r[40];
	p.init = r[7];
	p.prepareRemoval = r[8];
	p.Standard$refresh = r[9];
	p._insertFirstTemplate = r[10];
	p._moveTemplate = r[11];
	p._getStartElement = r[12];
	p._getEndElement = r[13];
	p.Standard$render = r[14];
	p._render = r[15];
	p._insertTemplate = r[16];
	p._removeTemplate = r[17];
	p.Standard$hasAnimations = r[18];
	p.Standard$isAnimationEnabled = r[19];
	p.broadcastInDOM = r[20];
	p.Standard$broadcastRemove = r[21];
	p._broadcast = r[22];
	p.Standard$destroy = r[23];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p._initMembers = r[26];
	p._postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p._broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.render = r[33];
	p._renderContent = r[34];
	p.refresh = r[35];
	p._refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.destroy = r[47];
	p.Properties$init = r[7];
	p.get = r[8];
	p.isset = r[9];
	p.set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.destroy = r[54];
	p.init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p._initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.get = r[8];
	p.isset = r[9];
	p.set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._postInit = r[48];
	p._onValueChanged = r[49];
	p._renderContent = r[50];
	p.escapeArgumentValue = r[51];
	p.destroy = r[52];
	p.init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p._initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p._broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p._refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.get = r[8];
	p.isset = r[9];
	p.set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[48];
	p._initMembers = r[49];
	p._postInit = r[50];
	p.set = r[51];
	p.createRefresher = r[52];
	p.getRefresher = r[53];
	p._onEnumerableChanged = r[54];
	p._removeTemplates = r[55];
	p._removeTemplates_Refresher = r[56];
	p._refreshChildren = r[57];
	p._onDataSourceChanged = r[58];
	p._onRemovalComplete = r[59];
	p._renderContent = r[60];
	p._renderContent_Refresher = r[61];
	p._refresh = r[62];
	p._refresh_Refresher = r[63];
	p._broadcastToChildren = r[64];
	p._broadcastToChildren_Refresher = r[65];
	p.getScope = r[66];
	p._setCount = r[67];
	p.destroy = r[68];
	p.Abstract$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.Abstract$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.get = r[8];
	p.isset = r[9];
	p.Abstract$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._postInit = r[48];
	p.createRefresher = r[49];
	p._onRemovalComplete = r[50];
	p.getRefresher = r[51];
	p._refreshActiveArgumentIndex = r[52];
	p._getActiveTemplate = r[53];
	p._onArgumentChanged = r[54];
	p._destroyTemplate = r[55];
	p._removeTemplate = r[56];
	p._removeTemplate_Refresher = r[57];
	p._renderContent = r[58];
	p._renderContent_Refresher = r[59];
	p._broadcastToChildren = r[60];
	p._broadcastToChildren_Refresher = r[61];
	p._refresh = r[62];
	p._refresh_Refresher = r[63];
	p.destroy = r[64];
	p.init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p._initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.get = r[8];
	p.isset = r[9];
	p.set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._postInit = r[48];
	p._onValueChanged = r[49];
	p.render = r[50];
	p._renderContent = r[51];
	p._refresh = r[52];
	p._broadcastToChildren = r[53];
	p._getContent = r[54];
	p.destroy = r[55];
	p.init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p._initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.get = r[8];
	p.isset = r[9];
	p.set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[76];
	p._handleInputView = r[77];
	p.getMainContainer = r[78];
	p._onInputFocused = r[79];
	p._onInputBlurred = r[80];
	p.focus = r[81];
	p.toQueryString = r[82];
	p._setValidity = r[83];
	p._handleLabel = r[84];
	p.destroy = r[85];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;
	p.DEFAULT_ROLES = s.DEFAULT_ROLES;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._setValue = r[86];
	p._valueToElementProperty = r[87];
	p._refreshValue = r[88];
	p._onTextInput = r[89];
	p.init = r[76];
	p._handleInputView = r[77];
	p.getMainContainer = r[78];
	p._onInputFocused = r[79];
	p._onInputBlurred = r[80];
	p.focus = r[81];
	p.toQueryString = r[82];
	p._setValidity = r[83];
	p._handleLabel = r[84];
	p.destroy = r[85];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;
	p.DEFAULT_ROLES = s.DEFAULT_ROLES;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._renderContent = r[90];
	p._setValue = r[86];
	p._valueToElementProperty = r[87];
	p._refreshValue = r[88];
	p._onTextInput = r[89];
	p.init = r[76];
	p._handleInputView = r[77];
	p.getMainContainer = r[78];
	p._onInputFocused = r[79];
	p._onInputBlurred = r[80];
	p.focus = r[81];
	p.toQueryString = r[82];
	p._setValidity = r[83];
	p._handleLabel = r[84];
	p.destroy = r[85];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p.TextAbstract$_renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;
	p.DEFAULT_ROLES = s.DEFAULT_ROLES;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._handleInputView = r[90];
	p._setValue = r[86];
	p._valueToElementProperty = r[87];
	p._refreshValue = r[88];
	p._onTextInput = r[89];
	p.init = r[76];
	p.TextAbstract$_handleInputView = r[77];
	p.getMainContainer = r[78];
	p._onInputFocused = r[79];
	p._onInputBlurred = r[80];
	p.focus = r[81];
	p.toQueryString = r[82];
	p._setValidity = r[83];
	p._handleLabel = r[84];
	p.destroy = r[85];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;
	p.DEFAULT_ROLES = s.DEFAULT_ROLES;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._handleInputView = r[90];
	p._setValue = r[86];
	p._valueToElementProperty = r[87];
	p._refreshValue = r[88];
	p._onTextInput = r[89];
	p.init = r[76];
	p.TextAbstract$_handleInputView = r[77];
	p.getMainContainer = r[78];
	p._onInputFocused = r[79];
	p._onInputBlurred = r[80];
	p.focus = r[81];
	p.toQueryString = r[82];
	p._setValidity = r[83];
	p._handleLabel = r[84];
	p.destroy = r[85];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;
	p.DEFAULT_ROLES = s.DEFAULT_ROLES;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._handleInputView = r[86];
	p._setIsChecked = r[87];
	p._onCheckedChanged = r[88];
	p.toQueryString = r[89];
	p.init = r[76];
	p.InputAbstract$_handleInputView = r[77];
	p.getMainContainer = r[78];
	p._onInputFocused = r[79];
	p._onInputBlurred = r[80];
	p.focus = r[81];
	p.InputAbstract$toQueryString = r[82];
	p._setValidity = r[83];
	p._handleLabel = r[84];
	p.destroy = r[85];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;
	p.DEFAULT_ROLES = s.DEFAULT_ROLES;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._refreshIndeterminate = r[90];
	p.broadcastInDOM = r[91];
	p._refresh = r[92];
	p._setIsChecked = r[93];
	p._setIsIndeterminate = r[94];
	p._onCheckedChanged = r[95];
	p._handleInputView = r[86];
	p.RadioAbstract$_setIsChecked = r[87];
	p.RadioAbstract$_onCheckedChanged = r[88];
	p.toQueryString = r[89];
	p.init = r[76];
	p.InputAbstract$_handleInputView = r[77];
	p.getMainContainer = r[78];
	p._onInputFocused = r[79];
	p._onInputBlurred = r[80];
	p.focus = r[81];
	p.InputAbstract$toQueryString = r[82];
	p._setValidity = r[83];
	p._handleLabel = r[84];
	p.destroy = r[85];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p.RadioAbstract$_refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.RadioAbstract$broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;
	p.DEFAULT_ROLES = s.DEFAULT_ROLES;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.broadcastInDOM = r[90];
	p._handleInputView = r[86];
	p._setIsChecked = r[87];
	p._onCheckedChanged = r[88];
	p.toQueryString = r[89];
	p.init = r[76];
	p.InputAbstract$_handleInputView = r[77];
	p.getMainContainer = r[78];
	p._onInputFocused = r[79];
	p._onInputBlurred = r[80];
	p.focus = r[81];
	p.InputAbstract$toQueryString = r[82];
	p._setValidity = r[83];
	p._handleLabel = r[84];
	p.destroy = r[85];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.RadioAbstract$broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;
	p.DEFAULT_ROLES = s.DEFAULT_ROLES;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._onClicked = r[86];
	p.init = r[76];
	p._handleInputView = r[77];
	p.getMainContainer = r[78];
	p._onInputFocused = r[79];
	p._onInputBlurred = r[80];
	p.focus = r[81];
	p.toQueryString = r[82];
	p._setValidity = r[83];
	p._handleLabel = r[84];
	p.destroy = r[85];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;
	p.DEFAULT_ROLES = s.DEFAULT_ROLES;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.broadcastInDOM = r[86];
	p._onValueChanged = r[87];
	p._refresh = r[88];
	p._refreshValue = r[89];
	p.init = r[76];
	p._handleInputView = r[77];
	p.getMainContainer = r[78];
	p._onInputFocused = r[79];
	p._onInputBlurred = r[80];
	p.focus = r[81];
	p.toQueryString = r[82];
	p._setValidity = r[83];
	p._handleLabel = r[84];
	p.destroy = r[85];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p.InputAbstract$_refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.InputAbstract$broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;
	p.DEFAULT_ROLES = s.DEFAULT_ROLES;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._refreshValue = r[90];
	p._setValue = r[91];
	p.isValueSelected = r[92];
	p.broadcastInDOM = r[86];
	p._onValueChanged = r[87];
	p._refresh = r[88];
	p.SelectAbstract$_refreshValue = r[89];
	p.init = r[76];
	p._handleInputView = r[77];
	p.getMainContainer = r[78];
	p._onInputFocused = r[79];
	p._onInputBlurred = r[80];
	p.focus = r[81];
	p.toQueryString = r[82];
	p._setValidity = r[83];
	p._handleLabel = r[84];
	p.destroy = r[85];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p.InputAbstract$_refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.InputAbstract$broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;
	p.DEFAULT_ROLES = s.DEFAULT_ROLES;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._handleInputView = r[90];
	p._refreshValue = r[91];
	p._setValue = r[92];
	p.isValueSelected = r[93];
	p.toQueryString = r[94];
	p.broadcastInDOM = r[86];
	p._onValueChanged = r[87];
	p._refresh = r[88];
	p.SelectAbstract$_refreshValue = r[89];
	p.init = r[76];
	p.SelectAbstract$_handleInputView = r[77];
	p.getMainContainer = r[78];
	p._onInputFocused = r[79];
	p._onInputBlurred = r[80];
	p.focus = r[81];
	p.SelectAbstract$toQueryString = r[82];
	p._setValidity = r[83];
	p._handleLabel = r[84];
	p.destroy = r[85];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p.InputAbstract$_refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.InputAbstract$broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;
	p.DEFAULT_ROLES = s.DEFAULT_ROLES;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[91];
	p._valueToElementProperty = r[92];
	p._refreshValue = r[93];
	p._setValue = r[94];
	p._handleInputView = r[90];
	p.Text$_setValue = r[86];
	p.Text$_valueToElementProperty = r[87];
	p.Text$_refreshValue = r[88];
	p._onTextInput = r[89];
	p.Text$init = r[76];
	p.TextAbstract$_handleInputView = r[77];
	p.getMainContainer = r[78];
	p._onInputFocused = r[79];
	p._onInputBlurred = r[80];
	p.focus = r[81];
	p.toQueryString = r[82];
	p._setValidity = r[83];
	p._handleLabel = r[84];
	p.destroy = r[85];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;
	p.DEFAULT_ROLES = s.DEFAULT_ROLES;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._handleGroupRole = r[76];
	p._handleFieldRole = r[77];
	p._onSubmit = r[78];
	p.getFields = r[79];
	p.getSubmitFields = r[80];
	p.toQueryString = r[81];
	p._onFieldDestroyed = r[82];
	p.init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[76];
	p._initMembers = r[77];
	p.addPanel = r[78];
	p.getPanelObjects = r[79];
	p.getPanelWidgets = r[80];
	p._handlePanelRole = r[81];
	p.registerPanel = r[82];
	p._removePanel = r[83];
	p.unregisterPanel = r[84];
	p._onPanelExpanding = r[85];
	p._onPanelCollapsing = r[86];
	p._setIsEnabled = r[87];
	p._onPanelDestroy = r[88];
	p.removeNativePanels = r[89];
	p.removeAllPanels = r[90];
	p.removePanel = r[91];
	p.collapseAll = r[92];
	p.destroy = r[93];
	p.Standard$init = r[55];
	p.Standard$_initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[76];
	p._initMembers = r[77];
	p._onTabHeaderClicked = r[78];
	p.addTab = r[79];
	p._onTabIsActiveChanged = r[80];
	p._setActiveTab = r[81];
	p._onTabStateChanged = r[82];
	p.getTabObjects = r[83];
	p.removeTab = r[84];
	p._fixActiveTab = r[85];
	p.removeAllTabs = r[86];
	p.reorderTabs = r[87];
	p.sortTabs = r[88];
	p.destroy = r[89];
	p.Standard$init = r[55];
	p.Standard$_initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._refreshAnimation = r[76];
	p._onAnimationComplete = r[77];
	p._setExpanded = r[78];
	p._handleContainerView = r[79];
	p.getMainContainer = r[80];
	p.init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._onHeaderClick = r[81];
	p._refreshAnimation = r[76];
	p._onAnimationComplete = r[77];
	p._setExpanded = r[78];
	p._handleContainerView = r[79];
	p.getMainContainer = r[80];
	p.init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._handleContentIf = r[76];
	p._onInsertionComplete = r[77];
	p._onRemovalComplete = r[78];
	p._onHeaderClick = r[79];
	p._setAnimationEnabled = r[80];
	p.init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[76];
	p._onClosePopups = r[77];
	p._onTriggerClick = r[78];
	p._onGlobalClick = r[79];
	p._getTargetContainer = r[80];
	p._registerTrigger = r[81];
	p._registerTarget = r[82];
	p._setIsOpen = r[83];
	p.destroy = r[84];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[76];
	p._setRecords = r[77];
	p._getMetaRecord = r[78];
	p._handleNodeChildrenView = r[79];
	p._handleRootNodesForeach = r[80];
	p._handleNodesForeach = r[81];
	p._onNodeClick = r[82];
	p._toggleTree = r[83];
	p._toggleRecords = r[84];
	p.expandAll = r[85];
	p.collapseAll = r[86];
	p.getDynamicScope = r[87];
	p.destroy = r[88];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.Standard$getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.Standard$destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;
	p._meta_storage_config = s._meta_storage_config;
	p._default_if_refresher_config = s._default_if_refresher_config;
	p._foreach_refresher_config = s._foreach_refresher_config;
	p._direct_bind_configs = s._direct_bind_configs;
	p._meta_storage_bind_configs = s._meta_storage_bind_configs;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[76];
	p._onColumnHeaderClick = r[77];
	p._getCellInclude = r[78];
	p.Standard$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p._getMonthDescriptors = r[76];
	p._getMonthDescriptorRows = r[77];
	p._getWeekDays = r[78];
	p._renderMonthData = r[79];
	p._renderMonthWeeksData = r[80];
	p._renderDayData = r[81];
	p.init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[82];
	p._refreshData = r[83];
	p._getMonthData = r[84];
	p._onPreviousMonthClick = r[85];
	p._onNextMonthClick = r[86];
	p._onTodayClick = r[87];
	p._onDayClick = r[88];
	p._select = r[89];
	p._onSwitchToMonthViewClick = r[90];
	p._onPreviousYearClick = r[91];
	p._onNextYearClick = r[92];
	p._onMonthClick = r[93];
	p._handleYearInput = r[94];
	p._markInputAsInvalid = r[95];
	p._clearInvalidInputState = r[96];
	p._onYearInputValueChanged = r[97];
	p._setValue = r[98];
	p._getMonthDescriptors = r[76];
	p._getMonthDescriptorRows = r[77];
	p._getWeekDays = r[78];
	p._renderMonthData = r[79];
	p._renderMonthWeeksData = r[80];
	p._renderDayData = r[81];
	p.CalendarAbstract$init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;

},
	function(cd,p) {
	var r=cd.references,
		s=cd.shared;

	p.init = r[55];
	p._initMembers = r[56];
	p._initResources = r[57];
	p.getInclude = r[58];
	p.handleEvent = r[59];
	p.inject = r[60];
	p.injectIntoExistingElement = r[61];
	p.remove = r[62];
	p.callModifier = r[63];
	p.callActiveModifier = r[64];
	p.getParentWidget = r[65];
	p.handleRole = r[66];
	p.set = r[67];
	p.get = r[68];
	p.getPackageConstructor = r[69];
	p.getResource = r[70];
	p.getDynamicScope = r[71];
	p.translate = r[72];
	p.ntranslate = r[73];
	p.translateBoolean = r[74];
	p.destroy = r[75];
	p._postInit = r[48];
	p.render = r[49];
	p._refresh = r[50];
	p._renderContent = r[51];
	p._broadcastToChildren = r[52];
	p._getContent = r[53];
	p.View$destroy = r[54];
	p.View$init = r[18];
	p.getContainer = r[19];
	p.getParentWithContainer = r[20];
	p.getParentView = r[21];
	p.getWidget = r[22];
	p.isInDOM = r[23];
	p.getTemplate = r[24];
	p.setId = r[25];
	p.View$_initMembers = r[26];
	p.Abstract$_postInit = r[27];
	p.getViewByDepth = r[28];
	p.trySetDirty = r[29];
	p.Abstract$_broadcastToChildren = r[30];
	p.broadcastInDOM = r[31];
	p.broadcastRemove = r[32];
	p.Abstract$render = r[33];
	p.Abstract$_renderContent = r[34];
	p.refresh = r[35];
	p.Abstract$_refresh = r[36];
	p.locateViewByLabel = r[37];
	p.locateViewByName = r[38];
	p.locateViewById = r[39];
	p.locateViewByGuid = r[40];
	p.locateViewByPathConfig = r[41];
	p.locateViewWithProperty = r[42];
	p.getScopeByPathConfig = r[43];
	p.evalPathConfig = r[44];
	p.getDataBinding = r[45];
	p.getSegment = r[46];
	p.Abstract$destroy = r[47];
	p.Properties$init = r[7];
	p.View$get = r[8];
	p.isset = r[9];
	p.View$set = r[10];
	p._set = r[11];
	p.setProperties = r[12];
	p.getProperties = r[13];
	p.firePropertyChangedEvents = r[14];
	p.onPropertyChanged = r[15];
	p.removePropertyListener = r[16];
	p._firePropertyChanged = r[17];
	p.on = r[0];
	p._addListener = r[1];
	p.removeListener = r[2];
	p._removeListener = r[3];
	p._fire = r[4];
	p._callListeners = r[5];
	p._hasListeners = r[6];
	p._property_descriptors = s._property_descriptors;
	p._event_handlers = s._event_handlers;
	p._role_handlers = s._role_handlers;
	p._include_handlers = s._include_handlers;
	p._modifiers = s._modifiers;

}
];
	var cds = [
	{
		path: "Lava.mixin.Observable",
		"extends": null,
		"implements": null
	},
	{
		path: "Lava.mixin.Properties",
		"extends": "Lava.mixin.Observable",
		"implements": null
	},
	{
		path: "Lava.mixin.Refreshable",
		"extends": "Lava.mixin.Observable",
		"implements": null
	},
	{
		path: "Lava.animator.Integer",
		"extends": null,
		"implements": null
	},
	{
		path: "Lava.animator.Color",
		"extends": null,
		"implements": null
	},
	{
		path: "Lava.animation.Abstract",
		"extends": "Lava.mixin.Observable",
		"implements": null
	},
	{
		path: "Lava.animation.Standard",
		"extends": "Lava.animation.Abstract",
		"implements": null,
		shared: {
			_shared: {
				call_animators: [
					function (transition_value) {},
					function (transition_value) {
				this._animators[0].animate(this._target, transition_value);
			},
					function (transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
			},
					function (transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
				this._animators[2].animate(this._target, transition_value);
			},
					function (transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
				this._animators[2].animate(this._target, transition_value);
				this._animators[3].animate(this._target, transition_value);
			}
				]
			}
		}
	},
	{
		path: "Lava.animation.Collapse",
		"extends": "Lava.animation.Standard",
		"implements": null,
		shared: {
			_shared: {
				default_config: {
					transition_name: "outQuad",
					animators: [{
						type: "Integer",
						property: "height",
						delta: 0
					}]
				}
			}
		}
	},
	{
		path: "Lava.animation.Toggle",
		"extends": "Lava.animation.Standard",
		"implements": null
	},
	{
		path: "Lava.animation.Emulated",
		"extends": "Lava.animation.Abstract",
		"implements": null
	},
	{
		path: "Lava.animation.BootstrapCollapse",
		"extends": "Lava.animation.Emulated",
		"implements": null
	},
	{
		path: "Lava.system.Serializer",
		"extends": null,
		"implements": null,
		shared: {
			_complex_types: {
				array: true,
				object: true,
				"function": true,
				regexp: true
			},
			_callback_map: {
				string: "_serializeString",
				array: "_serializeArray",
				object: "_serializeObject",
				"function": "_serializeFunction",
				"boolean": "_serializeBoolean",
				number: "_serializeNumber",
				regexp: "_serializeRegexp",
				"null": "_serializeNull",
				undefined: "_serializeUndefined"
			}
		}
	},
	{
		path: "Lava.system.CollectionAbstract",
		"extends": "Lava.mixin.Properties",
		"implements": null
	},
	{
		path: "Lava.system.Enumerable",
		"extends": "Lava.system.CollectionAbstract",
		"implements": null
	},
	{
		path: "Lava.system.DataView",
		"extends": "Lava.system.CollectionAbstract",
		"implements": null
	},
	{
		path: "Lava.system.Template",
		"extends": null,
		"implements": null,
		shared: {
			_block_handlers_map: {
				string: "_createDirect",
				view: "_createView",
				widget: "_createView",
				include: "_createInclude",
				static_value: "_createStaticValue",
				static_eval: "_createStaticEval",
				static_tag: "_createStaticTag"
			}
		}
	},
	{
		path: "Lava.system.ViewManager",
		"extends": "Lava.mixin.Observable",
		"implements": null
	},
	{
		path: "Lava.system.App",
		"extends": "Lava.mixin.Observable",
		"implements": null
	},
	{
		path: "Lava.system.Sugar",
		"extends": null,
		"implements": null
	},
	{
		path: "Lava.system.PopoverManager",
		"extends": null,
		"implements": null
	},
	{
		path: "Lava.system.FocusManager",
		"extends": "Lava.mixin.Observable",
		"implements": null
	},
	{
		path: "Lava.data.field.Abstract",
		"extends": "Lava.mixin.Observable",
		"implements": null
	},
	{
		path: "Lava.data.field.Basic",
		"extends": "Lava.data.field.Abstract",
		"implements": null
	},
	{
		path: "Lava.data.field.Collection",
		"extends": "Lava.data.field.Abstract",
		"implements": null
	},
	{
		path: "Lava.data.field.Integer",
		"extends": "Lava.data.field.Basic",
		"implements": null
	},
	{
		path: "Lava.data.field.Id",
		"extends": "Lava.data.field.Abstract",
		"implements": null
	},
	{
		path: "Lava.data.field.ForeignKey",
		"extends": "Lava.data.field.Basic",
		"implements": null
	},
	{
		path: "Lava.data.field.Record",
		"extends": "Lava.data.field.Abstract",
		"implements": null
	},
	{
		path: "Lava.data.field.Boolean",
		"extends": "Lava.data.field.Basic",
		"implements": null
	},
	{
		path: "Lava.data.field.Guid",
		"extends": "Lava.data.field.Abstract",
		"implements": null
	},
	{
		path: "Lava.data.ModuleAbstract",
		"extends": "Lava.mixin.Observable",
		"implements": null
	},
	{
		path: "Lava.data.Module",
		"extends": "Lava.data.ModuleAbstract",
		"implements": null
	},
	{
		path: "Lava.data.Record",
		"extends": null,
		"implements": ["Lava.mixin.Properties"]
	},
	{
		path: "Lava.data.MetaRecord",
		"extends": "Lava.data.Record",
		"implements": null
	},
	{
		path: "Lava.data.MetaStorage",
		"extends": "Lava.data.ModuleAbstract",
		"implements": ["Lava.mixin.Properties"]
	},
	{
		path: "Lava.scope.Abstract",
		"extends": "Lava.mixin.Refreshable",
		"implements": null
	},
	{
		path: "Lava.scope.Argument",
		"extends": "Lava.mixin.Refreshable",
		"implements": null
	},
	{
		path: "Lava.scope.Binding",
		"extends": null,
		"implements": null
	},
	{
		path: "Lava.scope.DataBinding",
		"extends": "Lava.scope.Abstract",
		"implements": null
	},
	{
		path: "Lava.scope.Foreach",
		"extends": "Lava.mixin.Refreshable",
		"implements": null
	},
	{
		path: "Lava.scope.PropertyBinding",
		"extends": "Lava.scope.Abstract",
		"implements": null
	},
	{
		path: "Lava.scope.Segment",
		"extends": "Lava.scope.Abstract",
		"implements": null
	},
	{
		path: "Lava.view.container.Element",
		"extends": null,
		"implements": null
	},
	{
		path: "Lava.view.container.CheckboxElement",
		"extends": "Lava.view.container.Element",
		"implements": null
	},
	{
		path: "Lava.view.container.TextInputElement",
		"extends": "Lava.view.container.Element",
		"implements": null
	},
	{
		path: "Lava.view.container.Morph",
		"extends": null,
		"implements": null
	},
	{
		path: "Lava.view.container.Emulated",
		"extends": null,
		"implements": null
	},
	{
		path: "Lava.view.refresher.Standard",
		"extends": "Lava.mixin.Observable",
		"implements": null
	},
	{
		path: "Lava.view.refresher.Animated",
		"extends": "Lava.view.refresher.Standard",
		"implements": null
	},
	{
		path: "Lava.view.refresher.Collapse",
		"extends": "Lava.view.refresher.Animated",
		"implements": null
	},
	{
		path: "Lava.view.Abstract",
		"extends": "Lava.mixin.Properties",
		"implements": null
	},
	{
		path: "Lava.view.View",
		"extends": "Lava.view.Abstract",
		"implements": null
	},
	{
		path: "Lava.view.Expression",
		"extends": "Lava.view.Abstract",
		"implements": null
	},
	{
		path: "Lava.view.Foreach",
		"extends": "Lava.view.Abstract",
		"implements": null
	},
	{
		path: "Lava.view.If",
		"extends": "Lava.view.Abstract",
		"implements": null
	},
	{
		path: "Lava.view.Include",
		"extends": "Lava.view.Abstract",
		"implements": null
	},
	{
		path: "Lava.widget.Standard",
		"extends": "Lava.view.View",
		"implements": null,
		shared: {
			_property_descriptors: {},
			_event_handlers: {},
			_role_handlers: {},
			_include_handlers: {},
			_modifiers: {
				translate: "translate",
				ntranslate: "ntranslate",
				translateBoolean: "translateBoolean"
			}
		}
	},
	{
		path: "Lava.widget.input.InputAbstract",
		"extends": "Lava.widget.Standard",
		"implements": null,
		shared: {
			_property_descriptors: {
				name: {
					type: "String",
					is_nullable: true
				},
				value: {
					type: "String",
					is_nullable: true
				},
				is_disabled: {type: "Boolean"},
				is_required: {type: "Boolean"},
				is_readonly: {type: "Boolean"},
				is_valid: {
					type: "Boolean",
					is_readonly: true
				}
			},
			_event_handlers: {
				_focused: "_onInputFocused",
				_blurred: "_onInputBlurred"
			},
			_role_handlers: {
				_input_view: "_handleInputView",
				label: "_handleLabel"
			},
			DEFAULT_ROLES: [{name: "form_field"}]
		}
	},
	{
		path: "Lava.widget.input.TextAbstract",
		"extends": "Lava.widget.input.InputAbstract",
		"implements": null,
		shared: {
			_property_descriptors: {
				value: {
					type: "String",
					setter: "_setValue"
				}
			},
			_event_handlers: {
				value_changed: "_refreshValue",
				input: "_onTextInput"
			}
		}
	},
	{
		path: "Lava.widget.input.TextArea",
		"extends": "Lava.widget.input.TextAbstract",
		"implements": null
	},
	{
		path: "Lava.widget.input.Text",
		"extends": "Lava.widget.input.TextAbstract",
		"implements": null
	},
	{
		path: "Lava.widget.input.Password",
		"extends": "Lava.widget.input.Text",
		"implements": null
	},
	{
		path: "Lava.widget.input.RadioAbstract",
		"extends": "Lava.widget.input.InputAbstract",
		"implements": null,
		shared: {
			_property_descriptors: {
				is_checked: {
					type: "Boolean",
					setter: "_setIsChecked"
				}
			},
			_event_handlers: {checked_changed: "_onCheckedChanged"}
		}
	},
	{
		path: "Lava.widget.input.CheckBox",
		"extends": "Lava.widget.input.RadioAbstract",
		"implements": null,
		shared: {
			_property_descriptors: {
				is_indeterminate: {
					type: "Boolean",
					setter: "_setIsIndeterminate"
				}
			}
		}
	},
	{
		path: "Lava.widget.input.Radio",
		"extends": "Lava.widget.input.RadioAbstract",
		"implements": null
	},
	{
		path: "Lava.widget.input.Submit",
		"extends": "Lava.widget.input.InputAbstract",
		"implements": null,
		shared: {
			_event_handlers: {clicked: "_onClicked"}
		}
	},
	{
		path: "Lava.widget.input.SelectAbstract",
		"extends": "Lava.widget.input.InputAbstract",
		"implements": null,
		shared: {
			_event_handlers: {value_changed: "_onValueChanged"},
			_modifiers: {isValueSelected: "isValueSelected"}
		}
	},
	{
		path: "Lava.widget.input.Select",
		"extends": "Lava.widget.input.SelectAbstract",
		"implements": null,
		shared: {
			_property_descriptors: {
				value: {
					type: "String",
					setter: "_setValue"
				}
			}
		}
	},
	{
		path: "Lava.widget.input.MultipleSelect",
		"extends": "Lava.widget.input.SelectAbstract",
		"implements": null,
		shared: {
			_property_descriptors: {
				value: {
					type: "Array",
					setter: "_setValue"
				}
			}
		}
	},
	{
		path: "Lava.widget.input.Numeric",
		"extends": "Lava.widget.input.Text",
		"implements": null,
		shared: {
			_property_descriptors: {
				value: {
					type: "Number",
					setter: "_setValue"
				},
				input_value: {
					type: "String",
					is_readonly: true
				}
			}
		}
	},
	{
		path: "Lava.widget.FieldGroup",
		"extends": "Lava.widget.Standard",
		"implements": null,
		shared: {
			_event_handlers: {form_submit: "_onSubmit"},
			_role_handlers: {
				form_field: "_handleFieldRole",
				form_group: "_handleGroupRole"
			}
		}
	},
	{
		path: "Lava.widget.Accordion",
		"extends": "Lava.widget.Standard",
		"implements": null,
		shared: {
			_property_descriptors: {
				is_enabled: {
					type: "Boolean",
					setter: "_setIsEnabled"
				}
			},
			_role_handlers: {panel: "_handlePanelRole"}
		}
	},
	{
		path: "Lava.widget.Tabs",
		"extends": "Lava.widget.Standard",
		"implements": null,
		shared: {
			_property_descriptors: {
				active_tab: {setter: "_setActiveTab"}
			},
			_event_handlers: {header_click: "_onTabHeaderClicked"}
		}
	},
	{
		path: "Lava.widget.Collapsible",
		"extends": "Lava.widget.Standard",
		"implements": null,
		shared: {
			_property_descriptors: {
				is_expanded: {
					type: "Boolean",
					setter: "_setExpanded"
				},
				is_animation_enabled: {type: "Boolean"}
			},
			_role_handlers: {_container_view: "_handleContainerView"}
		}
	},
	{
		path: "Lava.widget.CollapsiblePanel",
		"extends": "Lava.widget.Collapsible",
		"implements": null,
		shared: {
			_property_descriptors: {
				is_locked: {type: "Boolean"}
			},
			_event_handlers: {header_click: "_onHeaderClick"}
		}
	},
	{
		path: "Lava.widget.CollapsiblePanelExt",
		"extends": "Lava.widget.Standard",
		"implements": null,
		shared: {
			_property_descriptors: {
				is_expanded: {type: "Boolean"},
				is_locked: {type: "Boolean"},
				is_animation_enabled: {
					type: "Boolean",
					setter: "_setAnimationEnabled"
				}
			},
			_event_handlers: {header_click: "_onHeaderClick"},
			_role_handlers: {_content_if: "_handleContentIf"}
		}
	},
	{
		path: "Lava.widget.DropDown",
		"extends": "Lava.widget.Standard",
		"implements": null,
		shared: {
			_property_descriptors: {
				is_open: {
					type: "Boolean",
					setter: "_setIsOpen"
				}
			},
			_event_handlers: {trigger_click: "_onTriggerClick"},
			_role_handlers: {
				trigger: "_registerTrigger",
				target: "_registerTarget"
			}
		}
	},
	{
		path: "Lava.widget.Tree",
		"extends": "Lava.widget.Standard",
		"implements": null,
		shared: {
			_property_descriptors: {
				records: {setter: "_setRecords"},
				meta_storage: {is_readonly: true}
			},
			_event_handlers: {node_click: "_onNodeClick"},
			_role_handlers: {
				node_children_view: "_handleNodeChildrenView",
				root_nodes_foreach: "_handleRootNodesForeach",
				nodes_foreach: "_handleNodesForeach"
			},
			_meta_storage_config: {
				fields: {
					is_expanded: {type: "Boolean"}
				}
			},
			_default_if_refresher_config: {type: "Standard"},
			_foreach_refresher_config: {
				type: "Standard",
				get_end_element_callback: function (template) {

			// Last view is the If with node children.
			// "_foreach_view" property was set in "node_children" role.
			var children_foreach = template.getLastView().get('_foreach_view'),
				node_children_element = children_foreach ? children_foreach.getContainer().getDOMElement() : null;

			return node_children_element || template.getFirstView().getContainer().getDOMElement();

		}
			},
			_direct_bind_configs: {
				is_expanded: {
					property_name: "node",
					tail: ["is_expanded"]
				},
				is_expandable: {
					property_name: "node",
					tail: [
						"children",
						"length"
					]
				}
			},
			_meta_storage_bind_configs: {
				is_expanded: {
					locator_type: "Name",
					locator: "tree",
					tail: [
						"meta_storage",
						{
							property_name: "node",
							tail: ["guid"]
						},
						"is_expanded"
					]
				},
				is_expandable: {
					locator_type: "Name",
					locator: "tree",
					tail: [
						"meta_storage",
						{
							property_name: "node",
							tail: ["guid"]
						},
						"is_expandable"
					]
				}
			}
		}
	},
	{
		path: "Lava.widget.Table",
		"extends": "Lava.widget.Standard",
		"implements": null,
		shared: {
			_event_handlers: {column_header_click: "_onColumnHeaderClick"},
			_include_handlers: {cell: "_getCellInclude"}
		}
	},
	{
		path: "Lava.widget.CalendarAbstract",
		"extends": "Lava.widget.Standard",
		"implements": null
	},
	{
		path: "Lava.widget.Calendar",
		"extends": "Lava.widget.CalendarAbstract",
		"implements": null,
		shared: {
			_property_descriptors: {
				value: {
					type: "Date",
					setter: "_setValue"
				}
			},
			_event_handlers: {
				today_click: "_onTodayClick",
				previous_month_click: "_onPreviousMonthClick",
				next_month_click: "_onNextMonthClick",
				days_view_month_name_click: "_onSwitchToMonthViewClick",
				month_click: "_onMonthClick",
				day_click: "_onDayClick",
				previous_year_click: "_onPreviousYearClick",
				next_year_click: "_onNextYearClick"
			},
			_role_handlers: {_year_input: "_handleYearInput"}
		}
	},
	{
		path: "Lava.widget.Tooltip",
		"extends": "Lava.widget.Standard",
		"implements": null,
		shared: {
			_property_descriptors: {
				y: {type: "Integer"},
				x: {type: "Integer"},
				y_offset: {type: "Integer"},
				x_offset: {type: "Integer"},
				html: {type: "String"},
				is_visible: {type: "Boolean"}
			}
		}
	}
];

	for (var i = 0, count = cds.length; i < count; i++) {
		cds[i].prototype_generator = g[i];
		cds[i].own_references = owr[i];
		cds[i].constructor = c[i];
	}

	Lava.ClassManager.loadClasses(cds);

})();
