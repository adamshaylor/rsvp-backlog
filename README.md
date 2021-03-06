# rsvp-backlog

![Build status](https://travis-ci.org/adamshaylor/rsvp-backlog.svg?branch=master)

```javascript
var backlog = RSVP.createBacklog();

backlog.add(somePromise);

// Access a promise in the backlog directly

backlog.toArray()[0].then(doSomething);

// The promise behind .whenClear() resets when the backlog size goes from zero 
// to one, so you need at least one promise before you can call it

backlog.whenClear().then(doSomethingElse);

// Callback functions can be passed to handle additions, removals and 
// resolutions

backlog.whenChanged(function () {

    // The callback is bound to the backlog

    renderBacklogProgress(this.toArray().length);

});

// Resolving or removing the last promise in the backlog resolves the backlog
// as a whole

backlog.remove(somePromise);
```

## Bower installation

From a terminal:

```shell
bower install rsvp-backlog
```

In your HTML:

```html
<script src="bower_components/rsvp-backlog/rsvp-backlog.min.js">
```

## Node installation

From a terminal:

```shell
npm install rsvp-backlog
```

In your script:

```javascript
var createBacklog = require('rsvp-backlog'),
    backlog = createBacklog();
```
