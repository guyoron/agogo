
var rhythms = {
  'aguere': {
    'time': '8n',
    'pattern': [1, 1, null, null, 1, null, 1, null],
    'defaultBPM' : 120,
  },
  'cabula': {
    'time': '8n',
    'pattern': [1, null, 1, 1, null, 1, null, 1, null, 1, null, 1, null, 1, 1, null],
    'defaultBPM' : 140,
  },
  'vassi': {
    'time': '8t',
    'pattern': [1, null, 1, null, 1, 1, null, 1, null, 1, null, 1],
    'defaultBPM' : 120,
  },
  'ilu': {
    'time': '8n',
    'pattern': [1, null, 1, 1, null, 1, 1, null],
    'defaultBPM' : 160,
  },
};

var selectedRhythm, bpm;

var bellOpts = {
  "frequency" : 200,
	"harmonicity" : 12,
	"resonance" : 200,
	"modulationIndex" : 10,
	"envelope" : {
		"decay" : 0.3,
	},
	"volume" : -15
};

var low  = new Tone.MetalSynth(bellOpts).toMaster();
var high = new Tone.MetalSynth(bellOpts).toMaster();

var bellCallback = function(time, bell) {
  if (bell == 1) {
		low.triggerAttack(time);
  }
  else {
    high.triggerAttack(time);
  }
}

for (var rhythm in rhythms) {
  if (rhythms.hasOwnProperty(rhythm)) {
    rhythms[rhythm].sequence = new Tone.Sequence(bellCallback, rhythms[rhythm].pattern, rhythms[rhythm].time);
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

function selectRhythm(id) {
  stopAllSequences();
  rhythms[id].sequence.start(0);
  setBPM(rhythms[id].defaultBPM);
  selectedRhythm = id;
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
