class Agogo {
  constructor(settings) {
    this.low = settings.low
    this.high = settings.high
    this.playLow = settings.playLow
    this.playHigh = settings.playHigh
  }
}

var rhythms = {
  'aguere1': {
    'time': '8n',
    'pattern': [1, 1, null, null, 1, null, 1, null],
    'defaultBPM' : 120,
  },
  'aguere2': {
    'time': '8n',
    'pattern': [1, 1, null, null, 1, 1, 1, null],
    'defaultBPM' : 120,
  },
  'avamunha': {
    'time': '8n',
    'pattern': [1, null, null, 1, null, null, 1, null, null, null, 1, null, 1, null, null, null],
    'defaultBPM' : 160,
  },
  'cabula': {
    'time': '8n',
    'pattern': [1, null, 1, 1, null, 1, null, 1, null, 1, null, 1, null, 1, 1, null],
    'defaultBPM' : 140,
  },
  'ilu': {
    'time': '8n',
    'pattern': [1, null, 1, 1, null, 1, 1, null],
    'defaultBPM' : 160,
  },
  'jica': {
    'time': '8t',
    'pattern': [1, null, 1, 1, null, null],
    'defaultBPM' : 160,
  },
  'vassi': {
    'time': '8t',
    'pattern': [1, null, 1, null, 1, 1, null, 1, null, 1, null, 1],
    'defaultBPM' : 120,
  },
  'vassilong': {
    'time': '8t',
    'pattern': [1, null, 1, null, 1, null, 1, 1, null, 1, null, 1],
    'defaultBPM' : 120,
  },
};

var selectedRhythm, bpm, agogo;

agogoNatural = new Agogo({
  'low' : new Tone.Player('./sounds/low.wav').toMaster(),
  'high' : new Tone.Player('./sounds/high.wav').toMaster(),
  'playLow' : function() {
    this.low.restart()
  },
  'playHigh' : function() {
    this.high.restart()
  },
});

var synthOpts1 = {
  "frequency" : 200,
	"harmonicity" : 12,
	"resonance" : 200,
	"modulationIndex" : 10,
	"envelope" : {
		"decay" : 0.3,
	},
	"volume" : -15
};

agogoSynth1 = new Agogo({
  'low' : new Tone.MetalSynth(synthOpts1).toMaster(),
  'high' : new Tone.MetalSynth(synthOpts1).toMaster(),
  'playLow' : function() {
    this.low.triggerAttack()
  },
  'playHigh' : function() {
    this.high.triggerAttack()
  },
})

var synthOpts2 = {
  "frequency" : 200,
	"harmonicity" : 12,
	"resonance" : 800,
	"modulationIndex" : 20,
	"envelope" : {
		"decay" : 0.4,
	},
	"volume" : -15
};

agogoSynth2 = new Agogo({
  'low' : new Tone.MetalSynth(synthOpts2).toMaster(),
  'high' : new Tone.MetalSynth(synthOpts2).toMaster(),
  'playLow' : function() {
    this.low.triggerAttack()
  },
  'playHigh' : function() {
    this.high.triggerAttack()
  },
})

agogo = agogoNatural

var playAgogo = function(time, bell) {
  if (bell == 1) {
		agogo.playLow()
  }
  else {
    agogo.playHigh()
  }
}

for (var rhythm in rhythms) {
  if (rhythms.hasOwnProperty(rhythm)) {
    rhythms[rhythm].sequence = new Tone.Sequence(playAgogo, rhythms[rhythm].pattern, rhythms[rhythm].time);
  }
}

var rhythmButtons = $('.rhythm-buttons input');

selectRhythm(rhythmButtons.filter(':checked').attr('id'));

StartAudioContext(Tone.context)

rhythmButtons.change(function() {
  selectRhythm($(this).attr('id'));
})

$('#tempo').change(function() {
  setBPM($(this).val());
})

$('a.main-button').click(function(e) {
  Tone.Transport.toggle();

  if ($(this).hasClass('paused')) {
    // We're pressing play
    disableControls();
  }
  else {
    enableControls();
  }

  $(this).toggleClass('paused');
})

formatControls()
$(window).resize(formatControls)

function createGraph(id) {
  var r = rhythms[id]
  var num = r.pattern.length
  var dNum = $('#num .num-inner')
  var dBoxes = $('#boxes')
  var box = $('<div class="box"></div>')

  dBoxes.find('.box').remove()
  dNum.text(num)
  for (var i=0; i<num; i++){
    boxClass = r.pattern[i] == null ? 'empty' : 'full';
    dBoxes.append(box.clone().addClass(boxClass));
  }
}

function selectRhythm(id) {
  stopAllSequences();
  rhythms[id].sequence.start(0);
  setBPM(rhythms[id].defaultBPM);
  selectedRhythm = id;
  createGraph(id)
  console.log('changed to ' + id);
}

function setBPM(val) {
  Tone.Transport.bpm.value = val;
  $('#tempo').val(val)
  $('.tempo-display').text(val + ' BPM');
}

function stopAllSequences() {
  for (var rhythm in rhythms) {
    if (rhythms.hasOwnProperty(rhythm)) {
      rhythms[rhythm].sequence.stop("+0");
    }
  }
}

function disableControls() {
  $('.rhythm-buttons .btn').addClass('disabled');
  $('#tempo').prop('disabled',true);
}

function enableControls() {
  $('.rhythm-buttons .btn').removeClass('disabled');
  $('#tempo').prop('disabled',false);
}

function formatControls() {
  if ($(window).width() > 768) {
    $('.rhythm-buttons').addClass('btn-group')
  }
  else {
    $('.rhythm-buttons').removeClass('btn-group')
  }
}
