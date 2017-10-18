(function rsvpBacklog (rsvp) {


	function PromiseBacklog () {

		var instance = this,
			backlog = [],
			changeCallbacks = [],
			clearedDeferral = rsvp.defer();

		clearedDeferral.resolve();

		instance.add = function addToBacklog (promiseToAdd) {

			var remove;

			if (typeof promiseToAdd !== 'object' || typeof promiseToAdd.then !== 'function') {

				throw new TypeError('rsvp-backlog: Expected a promise object');

			}

			remove = instance.remove.bind(instance, promiseToAdd);
			promiseToAdd.then(remove, remove);

			if (!backlog.length) {

				clearedDeferral = rsvp.defer();

			}

			backlog.push(promiseToAdd);

			fireChangeCallbacks();

			return instance;

		};

		instance.remove = function removeFromBacklog (promiseToRemove) {

			var indexToRemove = backlog.indexOf(promiseToRemove);

			if (indexToRemove > -1) {

				backlog.splice(indexToRemove, 1);

				if (!backlog.length) {

					clearedDeferral.resolve();

				}

				fireChangeCallbacks();

			}

			return instance;

		};

		instance.whenClear = function getClearedPromise () {

			return clearedDeferral.promise;

		};

		instance.whenChanged = function addChangeCallback (callback) {

			if (typeof callback !== 'function') {

				throw new TypeError('Expected callback to be a function, saw ' + typeof callback);

			}

			changeCallbacks.push(callback);

		};

		instance.toArray = function backlogToArray () {

			return backlog.slice(0);

		};

		function fireChangeCallbacks () {

			changeCallbacks.forEach(function(callback) {
				callback(instance);
			});

		}

	}


	// A factory gives us the benefit of a named instance whilst avoiding (some of) the pitfalls of JavaScript
	// constructors

	function createBacklog () {

		return new PromiseBacklog();

	}


	// Browser: export to namespaced global

	if (typeof window !== 'undefined') {

		window.RSVP.createBacklog = createBacklog;

	}


	// Node: use native modules

	else if (typeof module !== 'undefined' && typeof require !== 'undefined') {

		module.exports = createBacklog;

	}




}).call(
	this,
	typeof window === 'undefined' && require ? require('rsvp') : window.RSVP
);
