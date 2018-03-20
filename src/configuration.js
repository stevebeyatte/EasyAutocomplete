/*
 * EasyAutocomplete - Configuration
 */
var EasyAutocomplete = (function(scope){
	// Small words to exclude from fuzzy matching.
	var DEFAULT_STOP_WORDS = {
		a: true,
		all: true,
		also: true,
		am: true,
		an: true,
		and: true,
		any: true,
		are: true,
		as: true,
		at: true,
		be: true,
		been: true,
		but: true,
		by: true,
		can: true,
		cannot: true,
		cant: true,
		co: true,
		con: true,
		could: true,
		couldnt: true,
		de: true,
		do: true,
		done: true,
		each: true,
		eg: true,
		else: true,
		etc: true,
		even: true,
		ever: true,
		every: true,
		few: true,
		for: true,
		from: true,
		get: true,
		go: true,
		had: true,
		has: true,
		hasnt: true,
		have: true,
		he: true,
		her: true,
		here: true,
		hers: true,
		him: true,
		his: true,
		how: true,
		i: true,
		ie: true,
		if: true,
		in: true,
		inc: true,
		is: true,
		it: true,
		its: true,
		may: true,
		me: true,
		might: true,
		mine: true,
		most: true,
		much: true,
		must: true,
		my: true,
		no: true,
		none: true,
		nor: true,
		not: true,
		of: true,
		off: true,
		on: true,
		onto: true,
		or: true,
		our: true,
		ours: true,
		several: true,
		she: true,
		so: true,
		some: true,
		such: true,
		than: true,
		that: true,
		the: true,
		their: true,
		them: true,
		themselves: true,
		then: true,
		thence: true,
		there: true,
		thereafter: true,
		thereby: true,
		therefore: true,
		therein: true,
		thereupon: true,
		these: true,
		they: true,
		this: true,
		those: true,
		though: true,
		thus: true,
		to: true,
		too: true,
		us: true,
		was: true,
		we: true,
		were: true,
		what: true,
		when: true,
		whence: true,
		whenever: true,
		where: true,
		whereafter: true,
		whereas: true,
		whereby: true,
		wherein: true,
		whereupon: true,
		wherever: true,
		whether: true,
		which: true,
		who: true,
		whoever: true,
		whom: true,
		whose: true,
		why: true,
		will: true,
		with: true,
		within: true,
		without: true,
		would: true,
		yet: true,
		you: true,
		your: true,
		yours: true
	};

	scope.Configuration = function Configuration(options) {
		var defaults = {
			data: "list-required",
			url: "list-required",
			dataType: "json",

			listLocation: function(data) {
				return data;
			},

			xmlElementName: "",

			getValue: function(element) {
				return element;
			},

			autocompleteOff: true,

			placeholder: false,

			ajaxCallback: function() {},

			matchResponseProperty: false,

			list: {
				sort: {
					enabled: false,
					method: function(a, b) {
						a = defaults.getValue(a);
						b = defaults.getValue(b);

						//Alphabeticall sort
						if (a < b) {
							return -1;
						}
						if (a > b) {
							return 1;
						}
						return 0;
					}
				},

				maxNumberOfElements: 6,

				hideOnEmptyPhrase: true,

				match: {
					enabled: false,
					caseSensitive: false,
					stopWords: DEFAULT_STOP_WORDS,
					method: function(element, phrase) {
						var phraseSplitted = phrase.split(' ');
						var anyMatched = false;
						var stopWords = defaults.list.match.stopWords;
						for( var i = 0; i < phraseSplitted.length; ++i ) {
						    var word = phraseSplitted[i];
						    if (stopWords[word.toLowerCase()]) {
						    	  continue;
								}
						    if (element.indexOf(word) < 0) {
										// Explicit non-match.
						        return false
								}
								anyMatched = true;
						}
						// We'll only return true if there were any non-stop-word matches.
						return anyMatched;
					}
				},

				showAnimation: {
					type: "normal", //normal|slide|fade
					time: 400,
					callback: function() {}
				},

				hideAnimation: {
					type: "normal",
					time: 400,
					callback: function() {}
				},

				/* Events */
				onClickEvent: function() {},
				onSelectItemEvent: function() {},
				onLoadEvent: function() {},
				onChooseEvent: function() {},
				onKeyEnterEvent: function() {},
				onMouseOverEvent: function() {},
				onMouseOutEvent: function() {},
				onShowListEvent: function() {},
				onHideListEvent: function() {}
			},

			highlightPhrase: true,

			theme: "",

			cssClasses: "",

			minCharNumber: 0,

			requestDelay: 0,

			adjustWidth: true,

			ajaxSettings: {},

			preparePostData: function(data, inputPhrase) {return data;},

			loggerEnabled: true,

			template: "",

			categoriesAssigned: false,

			categories: [{
				//listLocation: "",
				maxNumberOfElements: 4
			}]

		};

		var externalObjects = ["ajaxSettings", "template"];

		this.get = function(propertyName) {
			return defaults[propertyName];
		};

		this.equals = function(name, value) {
			if (isAssigned(name)) {
				if (defaults[name] === value) {
					return true;
				}
			}

			return false;
		};

		this.checkDataUrlProperties = function() {
			if (defaults.url === "list-required" && defaults.data === "list-required") {
				return false;
			}
			return true;
		};

		//TODO think about better mechanism
		this.checkRequiredProperties = function() {
			for (var propertyName in defaults) {
				if (defaults[propertyName] === "required") {
					logger.error("Option " + propertyName + " must be defined");
					return false;
				}
			}
			return true;
		};

		this.printPropertiesThatDoesntExist = function(consol, optionsToCheck) {
			printPropertiesThatDoesntExist(consol, optionsToCheck);
		};


		prepareDefaults();

		mergeOptions();

		if (defaults.loggerEnabled === true) {
			printPropertiesThatDoesntExist(console, options);
		}

		addAjaxSettings();

		processAfterMerge();


		//------------------------ Prepare defaults --------------------------

		//TODO
		//different defaults are required for xml than json
		function prepareDefaults() {

			if (options.dataType === "xml") {

				if (!options.getValue) {

					options.getValue = function(element) {
						return $(element).text();
					};
				}


				if (!options.list) {

					options.list = {};
				}

				if (!options.list.sort) {
					options.list.sort = {};
				}


				options.list.sort.method = function(a, b) {
					a = options.getValue(a);
					b = options.getValue(b);

					//Alphabeticall sort
					if (a < b) {
						return -1;
					}
					if (a > b) {
						return 1;
					}
					return 0;
				};

				if (!options.list.match) {
					options.list.match = {};
				}

				options.list.match.method = function(element, phrase) {

					if (element.search(phrase) > -1) {
						return true;
					} else {
						return false;
					}
				};

			}

			//Prepare categories defaults
			if (options.categories !== undefined && options.categories instanceof Array) {

				var categories = [];

				for (var i = 0, length = options.categories.length; i < length; i += 1) {

					var category = options.categories[i];

					for (var property in defaults.categories[0]) {

						if (category[property] === undefined) {
							category[property] = defaults.categories[0][property];
						}
					}

					categories.push(category);
				}

				options.categories = categories;
			}
		}


		//------------------------ LOAD config --------------------------

		function mergeOptions() {

			defaults = mergeObjects(defaults, options);

			function mergeObjects(source, target) {
				var mergedObject = source || {};

				for (var propertyName in source) {
					if (target[propertyName] !== undefined && target[propertyName] !== null) {

						if (typeof target[propertyName] !== "object" ||
								target[propertyName] instanceof Array) {
							mergedObject[propertyName] = target[propertyName];
						} else {
							mergeObjects(source[propertyName], target[propertyName]);
						}
					}
				}

				/* If data is an object */
				if (target.data !== undefined && target.data !== null && typeof target.data === "object") {
					mergedObject.data = target.data;
				}

				return mergedObject;
			}
		}


		function processAfterMerge() {

			if (defaults.url !== "list-required" && typeof defaults.url !== "function") {
				var defaultUrl = defaults.url;
				defaults.url = function() {
					return defaultUrl;
				};
			}

			if (defaults.ajaxSettings.url !== undefined && typeof defaults.ajaxSettings.url !== "function") {
				var defaultUrl = defaults.ajaxSettings.url;
				defaults.ajaxSettings.url = function() {
					return defaultUrl;
				};
			}

			if (typeof defaults.listLocation === "string") {
				var defaultlistLocation = defaults.listLocation;

				if (defaults.dataType.toUpperCase() === "XML") {
					defaults.listLocation = function(data) {
						return $(data).find(defaultlistLocation);
					};
				} else {
					defaults.listLocation = function(data) {
						return data[defaultlistLocation];
					};
				}
			}

			if (typeof defaults.getValue === "string") {
				var defaultsGetValue = defaults.getValue;
				defaults.getValue = function(element) {
					return element[defaultsGetValue];
				};
			}

			if (options.categories !== undefined) {
				defaults.categoriesAssigned = true;
			}

		}

		function addAjaxSettings() {

			if (options.ajaxSettings !== undefined && typeof options.ajaxSettings === "object") {
				defaults.ajaxSettings = options.ajaxSettings;
			} else {
				defaults.ajaxSettings = {};
			}

		}

		function isAssigned(name) {
			if (defaults[name] !== undefined && defaults[name] !== null) {
				return true;
			} else {
				return false;
			}
		}

		//Consol is object that should have method log that prints string
		//Normally invoke this function with console as consol
		function printPropertiesThatDoesntExist(consol, optionsToCheck) {

			checkPropertiesIfExist(defaults, optionsToCheck);

			function checkPropertiesIfExist(source, target) {
				for(var property in target) {
					if (source[property] === undefined) {
						consol.log("Property '" + property + "' does not exist in EasyAutocomplete options API.");
					}

					if (typeof source[property] === "object" && $.inArray(property, externalObjects) === -1) {
						checkPropertiesIfExist(source[property], target[property]);
					}
				}
			}
		}
	};

	return scope;

})(EasyAutocomplete || {});

