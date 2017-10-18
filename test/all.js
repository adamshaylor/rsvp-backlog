/* jshint expr: true */

var rsvp = require('rsvp'),
	rsvpBacklog = require('../rsvp-backlog.js'),
	should = require('should'),
	globalContext = this;


describe('rsvpBacklog()', function () {

	var backlog = rsvpBacklog(),
		deferreds = [];

	it('should return an object', function () {

		backlog.should.be.instanceOf(Object);

	});

	describe('#add()', function () {

		it('should throw an error when not passed a promise', function () {

			backlog.add.bind(globalContext, undefined).should.throw();

			backlog.add.bind(globalContext, {}).should.throw();

		});

		it('should return the backlog object', function () {

			var deferred = rsvp.defer(),
				returnedObject = backlog.add(deferred.promise);

			deferreds.push(deferred);

			returnedObject.should.equal(backlog);

		});

	});

	describe('#toArray()', function () {

		it('should return an array containing the promise from the #add() test', function () {

			var arrayified = backlog.toArray();

			arrayified.should.be.instanceOf(Array);

			arrayified[0].should.equal(deferreds[0].promise);

		});

	});

	describe('#remove()', function () {

		it('should remove a promise from the backlog if it exists and return the backlog object', function () {

			var returnedObject = backlog.remove(deferreds[0].promise);

			returnedObject.should.equal(backlog);

			backlog.toArray().should.be.empty;

		});

		it('should still return the backlog object even if the passed promise doesn\'t exist', function () {

			var returnedObject = backlog.remove(rsvp.defer().promise);

			returnedObject.should.equal(backlog);

		});

	});

	describe('#whenClear()', function () {

		// Start from scratch just in case there's anything weird going on with the previous tests

		backlog = rsvpBacklog();
		deferreds = [];

		it('should return a resolved promise when the backlog is empty', function (done) {

			var clearPromise = backlog.whenClear();

			clearPromise.should.be.instanceOf(rsvp.Promise);

			clearPromise.then(done);

		});

		it('should return a promise that resolves when the corresponding deferral does', function (done) {

			deferreds.push(rsvp.defer());

			deferreds[0].promise.then(done);

			setTimeout(deferreds[0].resolve, 1);

		});

		it('should return a promise that resolves when a backlog > 1 is cleared', function (done) {

			var iteration,
				clearInterval;

			backlog = rsvpBacklog();

			for (iteration = 0; iteration < 4; iteration += 1) {

				deferreds.push(rsvp.defer());
				backlog.add(deferreds[deferreds.length - 1].promise);

			}

			backlog.whenClear().then(done);

			clearInterval = setInterval(function () {

				var poppedDeferral = deferreds.pop();

				if (poppedDeferral) {

					poppedDeferral.resolve();

				}

				else {

					clearInterval();

				}

			}, 1);

		});

	});

	describe('#whenChanged()', function () {

		it('should accept a function', function () {

			(function () {
				backlog.whenChanged(function () {});
			}).should.not.throw();

		});

		it('should not accept anything else', function () {

			(function () {
				backlog.whenChanged();
			}).should.throw();

			(function () {
				backlog.whenChanged('test');
			}).should.throw();

			(function () {
				backlog.whenChanged({});
			}).should.throw();

		});

		it('should call a passed callback when a promise is added', function (done) {

			backlog.whenChanged(function () {
				done();
			});

			backlog.add(rsvp.defer().promise);

		});

		it('should call a passed callback when a promise is removed', function (done) {

			done();

		});

		it('should call a passed callback when a promise is resolved', function (done) {

			done();

		});

	});

});
