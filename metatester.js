(function() {
  var options = {};
  var seedWord = '';
  var numRevealed = 0;

  function createSeedPrompt() {
    $(options.answerSectionSelector).append(
      '<div id="metatester-seedprompt">' +
	'<span>' +
	'Enter a word, any word. Use the same word each time you want to ' +
	'test this puzzle, and the same set of answers will be revealed.' +
	'</span>' +
	'<input type="text" id="metatester-seedinput" width="10">' +
	'<button id="metatester-seedstart">Start</button>' +
	'</div>');
    $('#metatester-seedinput').keyup(onSeedInputKeyUp);
    $('#metatester-seedstart').click(onSeedStart);
  }

  function onSeedInputKeyUp(event) {
    if (event.keyCode == 13) {
      onSeedStart();
    }
  }

  function onSeedStart() {
    seedWord = $('#metatester-seedinput').val();
    if (seedWord.length == 0) {
      return;
    }
    $('#metatester-seedprompt').remove();
    createAnswerSection();
  }

  function createAnswerSection() {
    $(options.answerSectionSelector).append(
      '<div id="metatester-answersection">' +
	'<div id="metatester-answercolumn"></div>' +
	'<div id="metatester-controls">' +
	'<button id="metatester-nextanswer">Reveal Another Answer</button>' +
	'</div>' +
	'</div>');
    updateAnswers();
    $('#metatester-nextanswer').click(onNextAnswer);
  }

  function onNextAnswer() {
    if (numRevealed < options.answers.length) {
      numRevealed++;
      updateAnswers();
    }
    if (numRevealed == options.answers.length) {
      $('#metatester-nextanswer').prop('disabled', true);
    }
  }

  function updateAnswers() {
    $('#metatester-answercolumn *').remove();

    Math.seedrandom(seedWord);
    var answerIndices = _.range(options.answers.length);
    var revealedAnswerIndices = [];
    for (var i = 0; i < numRevealed; i++) {
      var index = _.sample(answerIndices);
      revealedAnswerIndices.push(index);
      answerIndices = _.without(answerIndices, index);
    }

    _.each(options.answers, function(answer, i) {
      if (_.contains(revealedAnswerIndices, i)) {
	$('#metatester-answercolumn').append(
	  '<span>' + answer + '</span>');
      } else {
	$('#metatester-answercolumn').append(
	  '<span>??????????</span>');
      }
    });
  }

  window.metatester = function(optionsArg) {
    options = optionsArg;
    numRevealed = options.numStartAnswers;
    createSeedPrompt();
  };
})();
