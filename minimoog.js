document.addEventListener("DOMContentLoaded", function(event) {
    

    //map keyboard keys to frequencies
    const keyboardFrequencyMap = {
        '90': 261.625565300598634,  //Z - C
        '83': 277.182630976872096, //S - C#
        '88': 293.664767917407560, //X - D
        '68': 311.126983722080910, //D - D#
        '67': 329.627556912869929, //C - E
        '86': 349.228231433003884, //V - F
        '71': 369.994422711634398, //G - F#
        '66': 391.995435981749294, //B - G
        '72': 415.304697579945138, //H - G#
        '78': 440.000000000000000, //N - A
        '74': 466.163761518089916, //J - A#
        '77': 493.883301256124111, //M - B
        '81': 523.251130601197269, //Q - C
        '50': 554.365261953744192, //2 - C#
        '87': 587.329535834815120, //W - D
        '51': 622.253967444161821, //3 - D#
        '69': 659.255113825739859, //E - E
        '82': 698.456462866007768, //R - F
        '53': 739.988845423268797, //5 - F#
        '84': 783.990871963498588, //T - G
        '54': 830.609395159890277, //6 - G#
        '89': 880.000000000000000, //Y - A
        '55': 932.327523036179832, //7 - A#
        '85': 987.766602512248223, //U - B
        '73': 1046.50, //I - C
        '57': 1108.73, //9 - C#
        '79': 1174.66, //O - D
        '48': 1244.51, //0 - D#
        '80': 1318.51, //P - E
    }

    const timeMap = {
        "0" : 0.01,
        "1" : 0.1,
        "2" : 0.2,
        "3" : 0.4,
        "4" : 0.6,
        "5" : 0.8,
        "6" : 1,
        "7" : 2.5,
        "8" : 5,
        "9" : 7.5,
        "10" : 10.0,
    }
    
    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false);
    //attack in playNote, release in keyDown, sustain established by length of time key held for, decay is 0
    var activeOscillators = {}
    var activeGains = {}
    var partials = {}
    var lfos = {}
    var activeNotes = 0.0
    var currGain = 1.0
    var color = 1;
    var red = true;


    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const globalGain = audioCtx.createGain(); //this will control the volume of all notes
    globalGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    globalGain.connect(audioCtx.destination);

    
    function keyDown(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
            activeNotes = activeNotes + 1.0;
            currGain =(1.0/activeNotes);
            sparseKeys = Object.keys(activeGains); //access only filled array elements
            if (activeNotes > 1.0){ //decrease amplitude of all existing notes to make room for new one
                for (let i = 0; i < sparseKeys.length; i++){
                    activeGains[sparseKeys[i]].gain.setTargetAtTime(currGain/3, audioCtx.currentTime, 1);
                }
            }
            playNote(key, currGain);
        }
    }

    function keyUp(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && activeOscillators[key]) {
            var decay = timeMap[document.getElementById('decay').value];
            activeGains[key].gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + decay) //envelope release
            activeOscillators[key].stop(audioCtx.currentTime + 1); //actually stop oscillator
            lfos[key].stop(audioCtx.currentTime + 1);
            delete lfos[key];
            synthEnd(key);
            delete activeOscillators[key];
            delete activeGains[key];
            activeNotes = activeNotes - 1.0;
        }
    }


    function synthEnd(key){
        if (partials[key]){
            for (let i = 0; i < partials[key].length; i++){
                partials[key][i].stop(audioCtx.currentTime + 1);
            }
            delete partials[key];
        }
    }

    function additive(gainNode, currGain, key, osc, attack, decay, sustain){
        var part2 = audioCtx.createOscillator();
        var part3 = audioCtx.createOscillator();
    
        part2.frequency.value = osc.frequency.value * document.getElementById('frequency2').value;
        part3.frequency.value = osc.frequency.value * document.getElementById('frequency3').value;

        part2.type = document.getElementById('waveform2').value;
        part3.type = document.getElementById('waveform3').value;

        part2.connect(gainNode);
        part2.connect(gainNode);
        partials[key] = [part2, part3]
        
        part2.start()
        part3.start()

        osc.connect(gainNode).connect(globalGain); //new gain node for each note to control the adsr of that note
        osc.start();

        gainNode.gain.setTargetAtTime(currGain/3, audioCtx.currentTime, attack) //envelope attack

        gainNode.gain.setTargetAtTime((currGain/3)*sustain, audioCtx.currentTime + attack, decay) //sustain
    }

    function playNote(key, currGain) {
        const osc = audioCtx.createOscillator();
        const lfo = audioCtx.createOscillator();
        lfo.frequency.value = document.getElementById('lfoFreq').value;
        lfo.type = document.getElementById('lfowaveform').value;
        osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime);
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0
        osc.type = document.getElementById('waveform1').value; //choose your favorite waveform
        activeOscillators[key] = osc
        activeGains[key] = gainNode
        lfo.connect(gainNode);
        lfo.start();
        lfos[key] = lfo;
        var attack = timeMap[document.getElementById('attack').value];
        var decay = timeMap[document.getElementById('decay').value];
        var sustain = document.getElementById('sustain').value;
        
        additive(gainNode, currGain, key, osc, attack, decay, sustain)

    }




})




        