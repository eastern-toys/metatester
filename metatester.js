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
	'<div id="metatester-answersdiv"></div>' +
	'<div id="metatester-controls">' +
	'<button id="metatester-nextanswer">Reveal Another Answer</button>' +
	'</div>' +
	'</div>');
    updateAnswers();
    $('#metatester-nextanswer').click(onNextAnswer);
  }

  function onNextAnswer() {
    var numAnswers = options.answers.length * options.answers[0].length;
    if (numRevealed < numAnswers) {
      numRevealed++;
      updateAnswers();
    }
    if (numRevealed == numAnswers) {
      $('#metatester-nextanswer').prop('disabled', true);
    }
  }

  function updateAnswers() {
    $('#metatester-answersdiv *').remove();

    Math.seedrandom(seedWord);
    var answers = options.answers;
    var answerIndices = [];
    for (var i = 0; i < answers.length; i++) {
      for (var j = 0; j < answers[i].length; j++) {
	answerIndices.push([i, j]);
      }
    }
    var revealedAnswerIndices = [];
    for (var i = 0; i < numRevealed; i++) {
      var index = _.sample(answerIndices);
      revealedAnswerIndices.push(index);
      answerIndices = _.reject(answerIndices, function(answerIndex) {
	return _.isEqual(index, answerIndex);
      });
    }

    $('#metatester-answersdiv').append(
      '<table id="metatester-answertable"></table>');
    for (var j = 0; j < answers[0].length; j++) {
      $('#metatester-answertable').append('<tr></tr>');
      for (var i = 0; i < answers.length; i++) {
	var answer = '??????????';
	if (_.find(revealedAnswerIndices, function(answerIndex) {
	  return _.isEqual([i, j], answerIndex);
	})) {
	  answer = answers[i][j];
	}
	$('#metatester-answertable tr:nth-child(' + (j + 1) + ')').append(
	  '<td>' + answer + '</td>');
      }
    }
  }

  window.metatester = function(optionsArg) {
    options = optionsArg;
    numRevealed = options.numStartAnswers;
    createSeedPrompt();
  };
})();
