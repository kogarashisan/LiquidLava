
(function(){
	Lava.ClassManager.registerRootNamespace('Lava', Lava);

	// separate everything for better gzip compression
	var c = $$$_CONSTRUCTORS_$$$;
	var owr = $$$_OWN_REFERENCES_$$$;
	var g = $$$_GENERATORS_$$$;
	var cds = $$$_CLASS_DATAS_$$$;

	for (var i = 0, count = cds.length; i < count; i++) {
		cds[i].prototype_generator = g[i];
		cds[i].own_references = owr[i];
		cds[i].constructor = c[i];
	}

	Lava.ClassManager.loadClasses(cds);

})();
