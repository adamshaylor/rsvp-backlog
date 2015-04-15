module.exports = function (grunt) {


	var config = {},
		banner;


	config.pkg = grunt.file.readJSON('package.json');


	config.mochaTest = {
		rsvpBacklog: {
			options: {
				reporter: 'spec',
				captureFile: 'test/results.txt',
				clearRequireCache: true
			},
			src: ['test/all.js']
		}
	};


	config.uglify = {
		rsvpBacklog: {
			options: {
				sourceMap: true
			},
			files: {
				'rsvp-backlog.min.js': ['rsvp-backlog.js']
			}
		}
	};


	config.watch = {
		rsvpBacklog: {
			files: ['rsvp-backlog.js'],
			tasks: ['default']
		},
		tests: {
			files: ['test/*.js'],
			tasks: ['mochaTest']
		},
		options: {
			atBegin: true
		}
	};


	grunt.initConfig(config);


	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-notify');


	grunt.registerTask('default', ['mochaTest', 'uglify']);
	grunt.registerTask('dev', ['watch']);
	grunt.registerTask('test', ['mochaTest']);
	grunt.registerTask('build', ['uglify']);

	grunt.task.run('notify_hooks');


};