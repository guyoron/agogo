class Agogo {
  constructor(settings) {
    this.low = settings.low
    this.high = settings.high
    this.playLow = settings.playLow
    this.playHigh = settings.playHigh
  }
}

var settings = {
  useHigh: true,
  showAnimation: true,
}

var selectedRhythm, agogo;

var highlightIndex = 0;

var controlPlay  = $('a#control-play');
var controlTempo = $('#control-tempo');
var controlRhythm = $('#control-rhythm');
var controlRhythmInputs = $('#control-rhythm button')

var displayTempo = $('#display-tempo');

var boxes = $('#boxes')

var rhythms = {
  'aguere1': {
    'time': '8n',
    'pattern': [1, 1, 0, 0, 1, 1, 1, 0],
    'defaultBPM' : 120,
  },
  'aguere2': {
    'time': '8n',
    'pattern': [1, 1, 0, 0, 1, 0, 1, 0],
    'defaultBPM' : 120,
  },
  'avamunha': {
    'time': '8n',
    'pattern': [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0],
    'defaultBPM' : 170,
  },
	'congo': {
    'time': '8n',
    'pattern': [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0],
    'defaultBPM' : 230,
  },
  'bata': {
    'time': '8t',
    'pattern': [1, 1, 0, 0, 0, 0],
    'defaultBPM': 90,
  },
  'cabula': {
    'time': '8n',
    'pattern': [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
    'defaultBPM' : 170,
  },
  'ijexa': {
    'time': '8n',
    'pattern': [1, 1, 0, 2, 0, 2, 2, 0, 1, 0, 1, 0, 2, 0, 2, 0],
    'defaultBPM' : 170,
  },
  'ijexa2': {
    'time': '8n',
    'pattern': [2, 2, 0, 1, 0, 1, 1, 0, 2, 0, 2, 0, 1, 0, 1, 0],
    'defaultBPM' : 170,
  },
  'ilu': {
    'time': '8n',
    'pattern': [1, 0, 1, 1, 0, 1, 1, 0],
    'defaultBPM' : 160,
  },
  'jica': {
    'time': '8t',
    'pattern': [1, 0, 1, 1, 0, 0],
    'defaultBPM' : 80,
  },
  'opanije': {
    'time': '8n',
    'pattern': [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 2, 0, 2, 2, 0],
    'defaultBPM' : 130,
  },
  'tonibobe': {
    'time': '8n',
    'pattern': [1, 0, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 1, 0],
    'defaultBPM' : 210,
  },
  'vassi': {
    'time': '8t',
    'pattern': [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    'defaultBPM' : 100,
  },
  'vassilong': {
    'time': '8t',
    'pattern': [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    'defaultBPM' : 100,
  },
  'savalu': {
    'time': '8t',
    'pattern': [1, 0, 1, 0, 1, 1],
    'defaultBPM' : 80,
  },
  'bravum': {
    'time': '8t',
    'pattern': [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0],
    'defaultBPM' : 100,
  },
  'sato': {
    'time': '8t',
    'pattern': [1, 0, 1, 1, 1, 0],
    'defaultBPM': 90,
  },
};

// Create Tone sequences for each rhythm based on its pattern
for (var rhythm in rhythms) {
  if (rhythms.hasOwnProperty(rhythm)) {
    rhythms[rhythm].sequence = new Tone.Sequence(playAgogo, rhythms[rhythm].pattern, rhythms[rhythm].time);
    // Also create a version of the pattern with no high bell and a sequence for that
    rhythms[rhythm].patternOneBell = rhythms[rhythm].pattern.map(x => x == 2 ? 1 : x)
    rhythms[rhythm].sequenceOneBell = new Tone.Sequence(playAgogo, rhythms[rhythm].patternOneBell, rhythms[rhythm].time);
  }
}

// Set up agogos
agogoNatural = new Agogo({
  'low' : new Tone.Player('./sounds/gblmute.mp3').toMaster(),
  'high' : new Tone.Player('./sounds/gbh_mute.mp3').toMaster(),
  'playLow' : function(time) {
    this.low.restart(time)
  },
  'playHigh' : function(time) {
    this.high.restart(time)
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
  'playLow' : function(time) {
    this.low.triggerAttack(time)
  },
  'playHigh' : function(time) {
    this.high.triggerAttack(time)
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
  'playLow' : function(time) {
    this.low.triggerAttack(time)
  },
  'playHigh' : function(time) {
    this.high.triggerAttack(time)
  },
})

// Initialization
agogo = agogoNatural;
selectRhythm('vassi', false);
StartAudioContext(Tone.context);

// Bind to rhythm control
controlRhythmInputs.click(function() {
  selectRhythm($(this).data('rhythm'), true);
})

// Bind to tempo control
controlTempo.on('input', function() {
  updateBPM($(this).val());
});
controlTempo.on('change', function() {
  changeBPM($(this).val());
});

// Bind to play button
controlPlay.click(function(e) {
  togglePlay($(this).attr('data-action'), e.timeStamp);
})

// Settings
$('#settingUseHigh').change(function() {
  settings.useHigh = $(this).is(':checked')
  selectRhythm(selectedRhythm)
  createGraph(selectedRhythm)
  gtag('event', 'settingChange', {
    'event_category': 'useHigh',
    'event_label': settings.useHigh,
  });
})

$('#settingShowAnimation').change(function() {
  settings.showAnimation = $(this).is(':checked')
  gtag('event', 'settingChange', {
    'event_category': 'showAnimation',
    'event_label': settings.showAnimation,
  });
})

// Toggle the main playing
function togglePlay(action, time) {
  Tone.Transport.toggle();

  highlightIndex = 0;
  $('.box').removeClass('highlight')

  if (action == 'play') {
    disableControls();
    controlPlay.attr('data-action', 'pause');
    playTime = time;
  }
  else if (action == 'pause') {
    enableControls();
    controlPlay.attr('data-action', 'play');
    var elapsedTime = (time-playTime)/1000;
    elapsedTime = elapsedTime.toFixed(1);

    gtag('event', 'endPlay', {
      'event_category': 'controlPlay',
      'event_label': selectedRhythm,
      'value': elapsedTime
    });
  }
}

// Callback for sequence play events and triggers the agogo
function playAgogo(time, bell) {
  if (bell == 1) {
	  agogo.playLow(time)
  }
  else if (bell == 2) {
    agogo.playHigh(time)
  }

  if (settings.showAnimation) {
    var rhythmLength = rhythms[selectedRhythm].pattern.length
    var currentBox = highlightIndex % rhythmLength
    $('.box').removeClass('highlight')
    $('.box-' + currentBox).addClass('highlight')
    highlightIndex = highlightIndex + 1
  }
}

// Create or refresh the box graph
function createGraph(id) {
  const r = rhythms[id]
  const pattern = settings.useHigh ? r.pattern : r.patternOneBell
  const num = pattern.length
  const dNum = $('#num .num-inner')
  const box = $('<div class="box"></div>')

  boxes.find('.box').remove()
  dNum.text(num)
  for (var i=0; i<num; i++){
    boxClass = '';
    if (pattern[i] == 1) {
      boxClass = 'low';
    }
    else if (pattern[i] == 2){
      boxClass = 'high';
    }
    boxes.append(box.clone().addClass(boxClass).addClass('box-'+i));
  }
}

// Switch the currently selected rhythm
function selectRhythm(id, track) {

  // Deselect the other buttons
  controlRhythmInputs.not('[data-rhythm='+id + ']').removeClass('active')

  // Stop all sequences on the transport
  for (var rhythm in rhythms) {
    if (rhythms.hasOwnProperty(rhythm)) {
      rhythms[rhythm].sequence.stop("+0");
      rhythms[rhythm].sequenceOneBell.stop("+0");
    }
  }

  // Queue the sequence for the selected rhythm
  if (settings.useHigh) {
    rhythms[id].sequence.start(0);
  }
  else {
    rhythms[id].sequenceOneBell.start(0);
  }

  setBPM(rhythms[id].defaultBPM);

  selectedRhythm = id;

  createGraph(id);

  if (track) {
    gtag('event', 'select', {
      'event_category': 'controlRhythm',
      'event_label': selectedRhythm
    });
  }
}

// Called on every movement while range input it dragged
function updateBPM(val) {
  displayTempo.text(val + ' BPM');
}

// Called when range input it set
function changeBPM(val) {
  setBPM(val);
  gtag('event', 'set', {
    'event_category': 'controlTempo',
    'event_label': selectedRhythm,
    'value': val
  });
}

// Sets the actual bpm for the sound transport
function setBPM(val) {
  Tone.Transport.bpm.value = val;
  // Make sure the input value matches, in case this was set automatically for rhythm
  controlTempo.val(val);
  updateBPM(val);
}

function disableControls() {
  controlRhythm.find('.btn').addClass('disabled');
  controlTempo.prop('disabled',true);
}

function enableControls() {
  controlRhythm.find('.btn').removeClass('disabled');
  controlTempo.prop('disabled',false);
}
