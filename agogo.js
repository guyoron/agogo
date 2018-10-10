class Agogo {
  constructor(settings) {
    this.low = settings.low
    this.high = settings.high
    this.playLow = settings.playLow
    this.playHigh = settings.playHigh
  }
}

var selectedRhythm, bpm, agogo;

var controlPlay  = $('a#control-play');
var controlTempo = $('#control-tempo');
var controlRhythm = $('#control-rhythm');
var controlRhythmInputs = $('#control-rhythm input')

var displayTempo = $('#display-tempo');

var boxes = $('#boxes')

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
    'defaultBPM' : 170,
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
  'opanije': {
    'time': '8n',
    'pattern': [1, 1, 1, null, 1, 1, 1, null, 1, 1, null, 2, null, 2, 2, null],
    'defaultBPM' : 150,
  },
  'tonibobe': {
    'time': '8n',
    'pattern': [1, null, 2, 2, 2, null, 2, null, 2, null, 2, null, 1, null, 1, null],
    'defaultBPM' : 210,
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

// Create Tone sequences for each rhythm based on its pattern
for (var rhythm in rhythms) {
  if (rhythms.hasOwnProperty(rhythm)) {
    rhythms[rhythm].sequence = new Tone.Sequence(playAgogo, rhythms[rhythm].pattern, rhythms[rhythm].time);
  }
}

// Set up agogos
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

// Initialization
agogo = agogoNatural;
selectRhythm(controlRhythmInputs.filter(':checked').attr('id'));
formatControls();
StartAudioContext(Tone.context);

// Bind to rhythm control
controlRhythmInputs.change(function() {
  selectRhythm($(this).attr('id'));
})

// Bind to tempo control
controlTempo.on('input', function() {
  setBPM($(this).val());
})

// Bind to play button
controlPlay.click(function(e) {
  togglePlay($(this).attr('data-action'));
})

// Bind to window resize
$(window).resize(formatControls)

// Toggle the main playing
function togglePlay(action) {
  Tone.Transport.toggle();
  if (action == 'play') {
    disableControls();
    controlPlay.attr('data-action', 'pause');
  }
  else if (action == 'pause') {
    enableControls();
    controlPlay.attr('data-action', 'play');
  }
}

// Callback for sequence play events and triggers the agogo
function playAgogo(time, bell) {
  if (bell == 1) {
		agogo.playLow()
  }
  else if (bell == 2) {
    agogo.playHigh()
  }
}

// Create or refresh the box graph
function createGraph(id) {
  var r = rhythms[id]
  var num = r.pattern.length
  var dNum = $('#num .num-inner')
  var box = $('<div class="box"></div>')

  boxes.find('.box').remove()
  dNum.text(num)
  for (var i=0; i<num; i++){
    boxClass = '';
    if (r.pattern[i] == 1) {
      boxClass = 'low';
    }
    else if (r.pattern[i] == 2){
      boxClass = 'high';
    }
    boxes.append(box.clone().addClass(boxClass));
  }
}

// Switch the currently selected rhythm
function selectRhythm(id) {

  // Stop all sequences on the transport
  for (var rhythm in rhythms) {
    if (rhythms.hasOwnProperty(rhythm)) {
      rhythms[rhythm].sequence.stop("+0");
    }
  }

  // Queue the sequence for the selected rhythm
  rhythms[id].sequence.start(0);

  setBPM(rhythms[id].defaultBPM);

  selectedRhythm = id;

  createGraph(id);
}

// Set the current BPM
function setBPM(val) {
  Tone.Transport.bpm.value = val;
  controlTempo.val(val)
  displayTempo.text(val + ' BPM');
}

function disableControls() {
  controlRhythm.find('.btn').addClass('disabled');
  controlTempo.prop('disabled',true);
}

function enableControls() {
  controlRhythm.find('.btn').removeClass('disabled');
  controlTempo.prop('disabled',false);
}

function formatControls() {
  if ($(window).width() > 768) {
    controlRhythm.find('.rhythm-row').addClass('btn-group')
  }
  else {
    controlRhythm.find('.rhythm-row').removeClass('btn-group')
  }
}
