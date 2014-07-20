
Lava.schema.modules['DemoTree'] = {
	fields: {
		//id: {type: 'Id'},
		guid: {type: 'Guid'}, // for MetaStorage
		title: {type: 'Basic', 'default': ''},
		type: {type: 'Basic', 'default': 'file'},
		parent: {type: 'Record', module: 'this'/*, foreign_key_field: 'parent_id'*/},
		//parent_id: {type: 'ForeignKey'},
		children: {type: 'Collection', module: 'this', record_field: 'parent'},

		is_expanded: {type: 'Basic', 'default': false},
		// for tree with checkboxes:
		is_checked: {type: 'Basic', 'default': false},
		is_indeterminate: {type: 'Basic', 'default': false}
	}
};

var ExampleData = {

	example_tree: [
		{title: "Node1"},
		{title: "Node2", type: 'folder'},
		{title: "Node3", type: 'folder', children: [
			{title: "Node5", type: 'folder'},
			{title: "Node6"},
			{title: "Node7", type: 'folder', children: [
				{title: "Node8"},
				{title: "Node9", type: 'folder', children: [
					{title: "Node11"}
				]},
				{title: "Node10"}
			]}
		]},
		{title: "Node4", type: 'file'}
	],

	circles: [
		{x:107, y:91, text:'1 year wearranty'},
		{x:164, y:326, text:'Blu-ray drive, FM radio'},
		{x:305, y:277, text:'170 watts active subwoofer'}
	],

	periodic_elements: [
		{title: 'Hydrogen', symbol: 'H', atomic_mass: 1.00797, is_gas: true},
		{title: 'Helium', symbol: 'He', atomic_mass: 4.0026, is_gas: true},
		{title: 'Lithium', symbol: 'Li', atomic_mass: 6.9412, is_gas: false},
		{title: 'Beryllium', symbol: 'Be', atomic_mass: 9.01218, is_gas: false},
		{title: 'Boron', symbol: 'B', atomic_mass: 10.812, is_gas: false},
		{title: 'Carbon', symbol: 'C', atomic_mass: 12.0108, is_gas: false},
		{title: 'Nitrogen', symbol: 'N', atomic_mass: 14.0067, is_gas: true},
		{title: 'Oxygen', symbol: 'O', atomic_mass: 15.9994, is_gas: true},
		{title: 'Fluorine', symbol: 'F', atomic_mass: 18.99840, is_gas: true},
		{title: 'Neon', symbol: 'Ne', atomic_mass: 20.179, is_gas: true}
	]

};