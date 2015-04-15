(function rsvpBacklog (rsvp) {


	function PromiseBacklog () {

		var backlog = [],
			changeCallbacks = [],
			clearedDeferral = rsvp.defer();

		clearedDeferral.resolve();

		this.add = function addToBacklog (promiseToAdd) {

			var remove;

			if (typeof promiseToAdd !== 'object' || typeof promiseToAdd.then !== 'function') {

				throw new TypeError('rsvp-backlog: Expected a promise object');

			}

			remove = this.remove.bind(this, promiseToAdd);
			promiseToAdd.then(remove, remove);

			if (!backlog.length) {

				clearedDeferral = rsvp.defer();

			}

			backlog.push(promiseToAdd);

			fireChangeCallbacks();

			return this;

		};

		this.remove = function removeFromBacklog (promiseToRemove) {

			var indexToRemove = backlog.indexOf(promiseToRemove);

			if (indexToRemove > -1) {

				backlog.splice(indexToRemove, 1);

				if (!backlog.length) {

					clearedDeferral.resolve();

				}

				fireChangeCallbacks();

			}

			return this;

		};

		this.whenClear = function getClearedPromise () {

			return clearedDeferral.promise;

		};

		this.whenChanged = function addChangeCallback (callback) {

			if (typeof callback !== 'function') {

				throw new TypeError('Expected callback to be a function, saw ' + typeof callback);

			}

			changeCallbacks.push(callback);

		};

		this.toArray = function backlogToArray () {

			return backlog.slice(0);

		};

		function fireChangeCallbacks () {

			var index;

			for (index in changeCallbacks) {

				changeCallbacks[index].call(this);

			}

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
