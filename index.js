var Animoto = (function(opts){
  opts = opts || {}
  if (!opts.start && !opts.stop) {
    throw new AnimotoMissingArg("Must provide both 'start' and 'stop' options to Animoto constructor.");
  }

  var start = opts.start;
  var stop = opts.stop;
  var fps = opts.fps || 60;
  var duration = opts.duration || 1000
  var onTick = null;
  var onDone = null;
  var onStop = null;
  // Public methods of this module
  //   we store it in a seperate variable so we can make functions
  //   chainable (E.g. on() function)
  var returnObj = {
    on: on,
    begin: begin
  }

  function AnimotoMissingArg(message) {
    var error = new Error(message)
    error.name = "AnimotoArgError";
    return error;
  }

  function on(event, callback) {
    switch (event) {
      case 'tick':
        onTick = callback;
      case 'done':
        onDone = callback;
      default:
        // TODO: Throw an error if event type is not recognized
    }
    return returnObj;
  }

  function stop(callback) {
    onStop = callback;

    return returnObj;
  }

  function begin() {
    var tickIncrement = (stop - start) / duration;
    var currentVal = start;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = timestamp - startTime;
      currentVal = currentVal + tickIncrement;
      // onTick(tickIncrement * progress)
      onTick(start + (tickIncrement * progress))
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        clearInterval(interval)
        onDone()
      }
    }

    var interval = setInterval(function(){
      window.requestAnimationFrame(step)
    }, 1000/fps)
  }

  return returnObj;
})

module.exports = Animoto
