# rsvp-backlog

```javascript
var backlog = RSVP.createBacklog();

backlog.add(somePromise);

// Access a promise in the backlog directly

backlog.toArray()[0].then(doSomething);

// The promise behind .whenClear() resets when the backlog size goes from zero 
// to one, so you need at least one promise before you can call it

backlog.whenClear().then(doSomethingElse);

// Resolving or removing the last promise in the backlog resolves the backlog
// as a whole

backlog.remove(backlog.toArray()[0]);
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

In you script:

```javascript
var createBacklog = require('rsvp-backlog'),
    backlog = createBacklog();
```
