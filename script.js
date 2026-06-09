// ===================== IMAGE GENERATION CONFIG =====================
// Pollinations AI — free, no API key, works from browser directly
let lastPromptUsed = '';
let lastGeneratedBlob = null;

function selectStyle(card) {
  document.querySelectorAll('.model-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  selectedStyle = card.getAttribute('data-style');
}

function selectSize(btn) {
  document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedWidth  = parseInt(btn.getAttribute('data-w'));
  selectedHeight = parseInt(btn.getAttribute('data-h'));
}

function confirmModelAndGenerate() {
  if (!isPromptMode || !promptComplete) return;
  document.getElementById('promptCompleteOverlay').style.display = 'none';
  promptComplete = false;
  showImageGenOverlay(currentText);
}

// ===================== PARAGRAPHS =====================
const paragraphs = {
  medium: [
    "The quick brown fox jumps over the lazy dog near the riverbank where tall trees provide cool shade during summer afternoons. Birds chirp happily as squirrels gather nuts for the winter season ahead.",
    "Technology has transformed the way we communicate, work, and learn in modern society. Smartphones and computers have become essential tools for billions of people around the world today.",
    "Reading books regularly improves vocabulary, enhances concentration, and stimulates imagination. Libraries are wonderful places where knowledge is freely available to everyone who seeks it.",
    "Exercise is important for maintaining good health and strong muscles. Walking, running, swimming, and cycling are excellent activities that keep the body fit and the mind sharp.",
    "Cooking at home is both economical and healthy. Fresh vegetables, whole grains, and lean proteins form the foundation of a nutritious diet that supports long-term wellness.",
  ],
  hard: [
    "Quantum mechanics describes the behavior of subatomic particles through wave functions and probability amplitudes, fundamentally challenging our classical intuitions about determinism and locality in physical systems.",
    "The Byzantine Empire's administrative sophistication, characterized by elaborate bureaucratic hierarchies and intricate diplomatic protocols, sustained its political dominance throughout the Mediterranean for nearly a millennium.",
    "Photosynthesis converts electromagnetic radiation from sunlight into chemical energy stored in glucose molecules, utilizing chlorophyll pigments within specialized organelles called chloroplasts found in plant cells.",
    "Cryptographic algorithms like RSA rely on the computational difficulty of factoring large prime numbers, creating asymmetric key pairs that secure digital communications across vulnerable network infrastructures worldwide.",
    "Neuroplasticity demonstrates the brain's remarkable capacity to reorganize synaptic connections in response to new experiences, injuries, or deliberate cognitive training throughout an individual's entire lifespan.",
    "The industrial revolution fundamentally restructured socioeconomic relationships by mechanizing production processes, concentrating populations in urban manufacturing centers, and precipitating unprecedented demographic transformations across European societies.",
    "Thermodynamic equilibrium requires that entropy, measuring the degree of disorder within a closed system, perpetually increases over time according to the second law of thermodynamics proposed by Clausius.",
  ],
  super: [
    "Epistemological frameworks in contemporary analytical philosophy grapple with the intrinsic relationship between justified true belief, Gettier counterexamples, and the fundamental limitations of propositional knowledge acquisition methodologies.",
    "Mitochondrial DNA inheritance patterns reveal that maternal lineages can be traced through cytoplasmic genetic material, circumventing Mendelian recombination and providing archaeogenomicists with unprecedented phylogenetic reconstruction capabilities.",
    "Metamorphic crystallographic transformations involving isomorphic substitution of cationic species within aluminosilicate lattice structures fundamentally alter rheological properties of geological formations under sustained tectonic pressure differentials.",
    "Poststructuralist deconstruction of logocentrism, as articulated by Derrida's grammatological critique, exposes inherent hierarchical binaries embedded within Western metaphysical tradition's privileging of spoken over written linguistic signifiers.",
    "Stochastic gradient descent algorithms, augmented by adaptive learning rate mechanisms such as Adam optimization, navigate high-dimensional non-convex loss manifolds encountered during deep neural network parameter optimization procedures.",
    "The phenomenological reduction, or epoche, bracketing natural attitude assumptions about objective reality, enables transcendental consciousness to examine intentional structures underlying perceptual experience without presupposing external world existence.",
    "Superconducting qubits exhibiting quantum coherence through Josephson junction tunneling phenomena represent the foundational computational primitive enabling fault-tolerant quantum error correction in scalable topological quantum computing architectures.",
    "Lexicographic morphosyntactic transformations in agglutinative Turkic language families demonstrate productive derivational affixation patterns fundamentally distinguishing their grammatical typology from fusional Indo-European inflectional paradigms.",
  ],
  prompt: [
    "Chubby golden lion with a bright red mane wearing a tiny chef hat, flipping giant pancakes in a sunny kitchen, batter flying everywhere, a small fox watching hungrily from the doorway, vibrant funny cartoon.",
    "Tiny old tortoise with round glasses and a purple scarf, riding a giant friendly snail through a colorful mushroom forest, glowing lanterns hanging from trees, magical soft lighting, cute 3D animation.",
    "Big fluffy white polar bear in a yellow raincoat, splashing happily through rainbow puddles in a cartoon city street, small birds sitting on his head, cheerful bright colors, joyful children cartoon.",
    "Clever brown monkey with big curious eyes in a red inventor coat, surrounded by wild spinning gears and bubbling potions in a chaotic magical workshop, sparks flying, colorful fun cartoon scene.",
    "Round blue robotic cat with no ears and big white belly, pulling a glowing futuristic gadget from his belly pocket, sparkling light beams shooting out, a small boy watching in amazement, cheerful anime.",
    "Short muscular Indian boy in red dhoti eating glowing golden sweets, transforming with golden aura around his arms, then shattering a massive boulder with one punch, vibrant Indian cartoon style.",
    "Cheerful orange cartoon tiger cub with black stripes bouncing excitedly through a jungle, colorful exotic birds and butterflies all around, bright sunlight streaming through giant tropical leaves.",
    "Small chubby blue robot with a big round head, bright blue eyes and soft round body, waving cheerfully in a futuristic colorful city street, flying cars zooming overhead, vibrant cute cartoon scene.",
    "Grey cartoon cat frantically chasing a tiny grinning brown mouse through a fancy restaurant kitchen, huge cakes toppling, pots of soup flying everywhere, classic slapstick 2D animation style.",
    "Brave young boy in green tunic and pointed hat, holding a glowing magical sword and shield, standing at the entrance of a dark enchanted forest, fireflies lighting his path, colorful adventure art.",
    "Three tiny grinning cockroaches, one red and fat, one tall and grey, one small and green, all surfing on a giant pizza slice through a living room, a big blue cat chasing them with a broom, chaotic cartoon.",
    "Teenage boy with blond spiky hair and whisker cheek marks in an orange ninja suit, running at superhuman speed through a dark forest, swirling golden energy flames surrounding him, dramatic anime.",
    "Wise old elephant with kind eyes and golden crown, sitting peacefully under a giant banyan tree surrounded by young animals listening to him, warm golden afternoon light, vibrant Indian cartoon art.",
    "Very fat jolly man in yellow shirt and a tall thin man in a flat cap, both speeding on a tiny scooter through cartoon Indian streets, samosas flying around them, bold funny colorful Indian cartoon.",
    "Small round yellow electric mouse with black-tipped rabbit ears and red cheeks, sitting on a boy's shoulder on a sunlit hilltop, colorful fantasy creatures gathered around, beautiful anime sunrise.",
    "Tiny brave mouse in a red cape and silver thimble helmet, sword-fighting a large menacing cockroach on a kitchen countertop, dramatic lighting, colorful storybook cartoon illustration style.",
    "Young girl with long silver hair in a flowing blue dress, standing on a misty bridge over a crystal river, colorful spirit creatures floating around her, magical glowing atmosphere, anime illustration.",
    "Large brown Great Dane dog with black spots and a tall lanky teenager in an orange turtleneck, both holding flashlights inside a dark spooky haunted mansion with glowing portraits, colorful cartoon.",
    "Short muscular Indian boy on a decorated elephant leading friends through colorful festive Indian kingdom streets, flowers and banners everywhere, joyful crowd, bright detailed Indian cartoon art.",
    "Tiny fairy girl with rainbow wings and sparkling pink dress, riding a giant friendly bumblebee through a magical flower garden, dewdrops shimmering like diamonds, enchanting colorful cartoon style.",
  ]
};

// ===================== CONFIG =====================
const TOTAL_QUESTIONS = 5;
const TIME_PER_QUESTION = 120;
const PROMPT_TIME = 100; // 1 min 40 sec for prompt mode
const MAX_VIOLATIONS = 3;

// ===================== STATE =====================
let currentLevel    = 'hard';
let currentText     = '';
let charIndex       = 0;
let errors          = 0;
let totalTyped      = 0;
let isRunning       = false;
let startTime       = null;
let timerInterval   = null;
let timeLeft        = TIME_PER_QUESTION;
let testStarted     = false;
let isPromptMode    = false;
let promptComplete  = false;
let promptHasError  = false;

let currentQuestion  = 0;
let questionResults  = [];
let usedIndices      = [];
let violationCount   = 0;
let sessionActive    = false;
let transitionTimer  = null;
let weakTypingShown  = false;

// ===================== HELPERS =====================
function showWarning(msg) {
  const t = document.getElementById('warningToast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function setLevel(level) {
  currentLevel = level;
  isPromptMode = (level === 'prompt');
  document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.level-btn.${level}`).classList.add('active');
  const ind = document.getElementById('levelIndicator');
  ind.className = `level-indicator ${level}`;
  const labels = {
    medium: '🌊 MEDIUM MODE',
    hard: '🔥 HARD MODE',
    super: '⚡ SUPER PRO',
    prompt: '🎨 PROMPT TESTING'
  };
  ind.textContent = labels[level];
  startNewSession();
}

// ===================== PILLS =====================
function buildPills() {
  const c = document.getElementById('qPills');
  c.innerHTML = '';
  if (isPromptMode) return; // No pills for unlimited prompt mode
  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const d = document.createElement('div');
    d.className = 'q-pill';
    d.id = `pill-${i}`;
    c.appendChild(d);
  }
}

function updatePills() {
  if (isPromptMode) {
    document.getElementById('qNumDisplay').textContent = '∞';
    document.getElementById('qTotalDisplay').textContent = '∞';
    return;
  }
  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const pill = document.getElementById(`pill-${i}`);
    if (!pill) continue;
    pill.className = 'q-pill';
    if (i < currentQuestion) {
      const res = questionResults[i];
      pill.classList.add(res && res.completed ? 'done' : 'failed');
    } else if (i === currentQuestion) {
      pill.classList.add('active');
    }
  }
  document.getElementById('qNumDisplay').textContent = currentQuestion + 1;
  document.getElementById('qTotalDisplay').textContent = TOTAL_QUESTIONS;
}

// ===================== SESSION =====================
function startNewSession() {
  currentQuestion  = 0;
  questionResults  = [];
  usedIndices      = [];
  violationCount   = 0;
  sessionActive    = true;
  buildPills();
  loadQuestion();
}

function loadQuestion() {
  clearInterval(timerInterval);
  clearTimeout(transitionTimer);
  hideTransition();

  const arr = paragraphs[currentLevel];
  let idx;
  do { idx = Math.floor(Math.random() * arr.length); }
  while (usedIndices.includes(idx) && usedIndices.length < arr.length);
  usedIndices.push(idx);
  currentText = arr[idx];

  charIndex   = 0;
  errors      = 0;
  totalTyped  = 0;
  isRunning   = false;
  testStarted = false;
  startTime   = null;
  timeLeft    = isPromptMode ? PROMPT_TIME : TIME_PER_QUESTION;
  weakTypingShown = false;
  promptComplete = false;
  promptHasError = false;

  renderText();
  updateStats();
  updateTimerBar();
  updatePills();

  document.getElementById('hiddenInput').value = '';
  document.getElementById('clickPrompt').classList.remove('hidden');
  document.getElementById('resultModal').classList.remove('show');
  document.getElementById('promptErrorOverlay').style.display = 'none';
  document.getElementById('promptCompleteOverlay').style.display = 'none';
  const pb = document.getElementById('wordPreviewBox');
  if (pb) pb.style.display = 'none';
}

// ===================== RENDER =====================
let charToWord = [];

function renderText() {
  const display = document.getElementById('textDisplay');
  display.innerHTML = '';
  charToWord = [];
  let globalCharIdx = 0;
  let wordIdx = 0;
  const tokens = currentText.split(/(\s+)/);

  tokens.forEach(token => {
    if (!token.length) return;
    const isSpace = /^\s+$/.test(token);
    if (isSpace) {
      for (const ch of token) {
        const span = document.createElement('span');
        span.className = 'char' + (globalCharIdx === 0 ? ' current' : '');
        span.textContent = ch;
        span.id = 'c' + globalCharIdx;
        charToWord[globalCharIdx] = -1;
        display.appendChild(span);
        globalCharIdx++;
      }
    } else {
      const wrapDiv = document.createElement('span');
      wrapDiv.className = 'word-span';
      wrapDiv.id = 'w' + wordIdx;
      const thisWordIdx = wordIdx;
      for (const ch of token) {
        const span = document.createElement('span');
        span.className = 'char' + (globalCharIdx === 0 ? ' current' : '');
        span.textContent = ch;
        span.id = 'c' + globalCharIdx;
        charToWord[globalCharIdx] = thisWordIdx;
        wrapDiv.appendChild(span);
        globalCharIdx++;
      }
      display.appendChild(wrapDiv);
      wordIdx++;
    }
  });
  highlightActiveWord(0);
}

function highlightActiveWord(idx) {
  document.querySelectorAll('.word-span.active-word').forEach(w => w.classList.remove('active-word'));
  const box = document.getElementById('wordPreviewBox');
  const wIdx = charToWord[idx];
  if (wIdx === undefined || wIdx < 0) { box.style.display = 'none'; return; }
  const wEl = document.getElementById('w' + wIdx);
  if (!wEl) { box.style.display = 'none'; return; }

  box.innerHTML = '';
  wEl.querySelectorAll('.char').forEach(cs => {
    const s = document.createElement('span');
    s.textContent = cs.textContent;
    if (cs.classList.contains('correct')) s.style.color = 'var(--correct)';
    else if (cs.classList.contains('wrong')) { s.style.color = 'var(--wrong)'; s.style.textDecoration = 'underline'; }
    else if (cs.classList.contains('current')) { s.style.color = 'var(--purple)'; s.style.borderBottom = '3px solid var(--purple)'; }
    else s.style.color = 'var(--muted)';
    box.appendChild(s);
  });

  const testArea = document.getElementById('testArea');
  const areaRect = testArea.getBoundingClientRect();
  const wRect    = wEl.getBoundingClientRect();
  const left = wRect.left - areaRect.left + wRect.width / 2;
  const top  = wRect.top  - areaRect.top  - 10;
  box.style.left = left + 'px';
  box.style.top  = top  + 'px';
  box.style.display = 'block';
  requestAnimationFrame(() => {
    box.style.top = (wRect.top - areaRect.top - box.offsetHeight - 10) + 'px';
  });
}

function startTest() {
  if (!currentText) loadQuestion();
  focusInput();
  document.getElementById('clickPrompt').classList.add('hidden');
}

function restartTest() {
  clearInterval(timerInterval);
  clearTimeout(transitionTimer);
  hideTransition();
  document.getElementById('promptCompleteOverlay').style.display = 'none';
  document.getElementById('promptErrorOverlay').style.display = 'none';
  loadQuestion();
}

function focusInput() {
  document.getElementById('clickPrompt').classList.add('hidden');
  document.getElementById('hiddenInput').focus();
}

function skipQuestion() {
  if (!sessionActive) return;
  recordQuestionResult(false, true);
  moveToNextQuestion('skipped');
}

// ===================== TYPING =====================
document.addEventListener('keydown', function(enterCheck) {
  if (isPromptMode && promptComplete && enterCheck.key === 'Enter') {
    enterCheck.preventDefault();
    enterCheck.stopPropagation();
    confirmModelAndGenerate();
  }
}, true);

document.getElementById('hiddenInput').addEventListener('keydown', function(e) {
  if (isPromptMode && promptComplete && e.key === 'Enter') {
    e.preventDefault();
    return;
  }

  if (!testStarted && e.key !== 'Tab' && e.key !== 'Escape' && e.key !== 'Enter') {
    testStarted = true;
    isRunning   = true;
    startTime   = Date.now();
    startTimer();
  }
  if (!isRunning) return;

  if (e.key === 'Backspace') {
    if (charIndex > 0) {
      charIndex--;
      const span = document.getElementById('c' + charIndex);
      if (span.classList.contains('wrong')) errors = Math.max(0, errors - 1);
      span.className = 'char current';
      const next = document.getElementById('c' + (charIndex + 1));
      if (next) next.className = 'char';
      highlightActiveWord(charIndex);
      updateStats();
      if (isPromptMode) {
        promptComplete = false;
        promptHasError = false;
        document.getElementById('promptCompleteOverlay').style.display = 'none';
        document.getElementById('promptErrorOverlay').style.display = 'none';
      }
    }
    return;
  }

  if (e.key.length !== 1) return;
  if (charIndex >= currentText.length) return;

  const expected = currentText[charIndex];
  const typed    = e.key;
  const span     = document.getElementById('c' + charIndex);
  totalTyped++;

  if (typed === expected) {
    span.className = 'char correct';
  } else {
    span.className = 'char wrong';
    errors++;
    if (!isPromptMode && errors >= 10 && !weakTypingShown) {
      weakTypingShown = true;
      showWeakTypingWarning();
      return;
    }
  }

  charIndex++;
  const next = document.getElementById('c' + charIndex);
  if (next) {
    next.classList.add('current');
  }
  highlightActiveWord(charIndex);
  updateStats();

  if (charIndex >= currentText.length) {
    if (isPromptMode) {
      const hasErrors = document.querySelectorAll('.char.wrong').length > 0;
      if (hasErrors) {
        showPromptError();
      } else {
        isRunning = false;
        clearInterval(timerInterval);
        promptComplete = true;
        document.getElementById('promptCompleteOverlay').style.display = 'flex';
        document.getElementById('hiddenInput').focus();
      }
    } else {
      recordQuestionResult(true, false);
      moveToNextQuestion('completed');
    }
  }
});

document.getElementById('hiddenInput').addEventListener('paste', e => {
  e.preventDefault();
  showWarning('⛔ Paste not allowed!');
});

// ===================== PROMPT MODE =====================
function showPromptError() {
  isRunning = false;
  clearInterval(timerInterval);
  const overlay = document.getElementById('promptErrorOverlay');
  overlay.style.display = 'flex';
  setTimeout(() => {
    overlay.style.display = 'none';
    retestCurrentQuestion();
  }, 2500);
}

// ===================== IMAGE GENERATION =====================
function showImageGenOverlay(prompt) {
  lastPromptUsed = prompt;
  const overlay = document.getElementById('imageGenOverlay');
  overlay.style.display = 'flex';

  // Build twinkling stars
  const starsEl = document.getElementById('genStars');
  starsEl.innerHTML = '';
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'gen-star';
    const size = Math.random() * 3 + 1;
    star.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${Math.random()*3+1}s;--delay:${Math.random()*4}s;`;
    starsEl.appendChild(star);
  }

  // Update UI
  _genSetBadge('🤗 HuggingFace FLUX');
  document.getElementById('genTitle').textContent = '🎨 Creating Your Image...';
  document.getElementById('genPromptDisplay').innerHTML = `<span>Your Prompt:</span><br><br>"${prompt}"`;
  document.getElementById('genLoader').style.display = 'flex';
  _genSetStatus('⏳ Starting generation...');
  document.getElementById('genImageContainer').style.display = 'none';
  document.getElementById('genActionRow').style.display = 'none';

  _genActive = false;
  generateImage(prompt, 0);
}

// ══════════════════════════════════════════════════════════════
// IMAGE GENERATION SYSTEM — Multi-provider with auto-fallback
// Provider 1: HuggingFace Inference API (FLUX.1-schnell) — free, no key, best quality
// Provider 2: Prodia API — free, no key, SD models
// Provider 3: Stable Horde — community-run, free, always available
// Pollinations removed — returns 402 for Indian IPs (their new policy)
// ══════════════════════════════════════════════════════════════

var _genActive = false;
var _currentBlobUrl = null;

// UI helpers
function _genSetStatus(txt) {
  var el = document.getElementById('genStatus');
  if (el) el.textContent = txt;
}
function _genSetTitle(txt) {
  var el = document.getElementById('genTitle');
  if (el) el.textContent = txt;
}
function _genSetBadge(txt) {
  var el = document.getElementById('genModelBadge');
  if (el) el.textContent = txt;
}

// Show final success with blob URL
function _genShowSuccess(blobUrl, providerName) {
  _genActive = false;
  if (_currentBlobUrl) URL.revokeObjectURL(_currentBlobUrl);
  _currentBlobUrl = blobUrl;
  var imgEl = document.getElementById('genImage');
  imgEl.src = blobUrl;
  document.getElementById('genLoader').style.display = 'none';
  _genSetStatus('✨ IMAGE READY!');
  _genSetTitle('🎉 Your Image is Here!');
  _genSetBadge('✅ ' + providerName);
  document.getElementById('genImageContainer').style.display = 'block';
  document.getElementById('genActionRow').style.display = 'flex';
  document.querySelectorAll('.gen-new-btn').forEach(function(b) { b.style.display = ''; });
  recordQuestionResult(true, false);
}

// Show final failure after all providers exhausted
function _genShowFailed() {
  _genActive = false;
  document.getElementById('genLoader').style.display = 'none';
  _genSetStatus('❌ Sabhi servers busy hain — Regenerate try karo');
  _genSetTitle('😔 Generation Failed');
  document.getElementById('genActionRow').style.display = 'flex';
  document.querySelectorAll('.gen-new-btn').forEach(function(b) { b.style.display = ''; });
}

// ── PROVIDER 1: HuggingFace Inference API (FLUX.1-schnell) ──
// Free, no API key needed, returns binary image blob
// Best quality, fastest of the free options
function _tryHuggingFace(prompt, onSuccess, onFail) {
  _genSetBadge('🤗 HuggingFace FLUX');
  _genSetStatus('🚀 Connecting to HuggingFace...');

  var HF_MODEL = 'black-forest-labs/FLUX.1-schnell';
  var url = 'https://api-inference.huggingface.co/models/' + HF_MODEL;
  var enhancedPrompt = prompt + ', vibrant colors, highly detailed, sharp focus, professional digital art, masterpiece';

  var controller = window.AbortController ? new AbortController() : null;
  var timeoutId = setTimeout(function() {
    if (controller) controller.abort();
    onFail('timeout');
  }, 60000);

  var dotCount = 0;
  var dotTimer = setInterval(function() {
    dotCount = (dotCount % 3) + 1;
    _genSetStatus('🤗 HuggingFace FLUX' + '.'.repeat(dotCount));
  }, 800);

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: enhancedPrompt }),
    signal: controller ? controller.signal : undefined
  })
  .then(function(resp) {
    clearTimeout(timeoutId);
    clearInterval(dotTimer);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return resp.blob();
  })
  .then(function(blob) {
    if (!blob || blob.size < 1000 || blob.type.indexOf('image') === -1) {
      throw new Error('Invalid image blob: size=' + blob.size + ' type=' + blob.type);
    }
    var blobUrl = URL.createObjectURL(blob);
    onSuccess(blobUrl, 'FLUX AI');
  })
  .catch(function(err) {
    clearTimeout(timeoutId);
    clearInterval(dotTimer);
    onFail(err.message || 'unknown');
  });
}

// ── PROVIDER 2: Prodia API ──
// Completely free, no API key, stable diffusion models
// Uses polling: create job → poll until done → get image URL
function _tryProdia(prompt, onSuccess, onFail) {
  _genSetBadge('⚡ Prodia AI');
  _genSetStatus('⚡ Connecting to Prodia...');

  var enhancedPrompt = prompt + ', vibrant colors, highly detailed, sharp focus, digital art';
  var createUrl = 'https://api.prodia.com/v1/job';

  var dotCount = 0;
  var dotTimer = setInterval(function() {
    dotCount = (dotCount % 3) + 1;
    _genSetStatus('⚡ Prodia generating' + '.'.repeat(dotCount));
  }, 800);

  var overallTimeout = setTimeout(function() {
    clearInterval(dotTimer);
    onFail('prodia timeout');
  }, 90000);

  // Step 1: Create job
  fetch(createUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      model: 'dreamshaperXL10_alpha2.safetensors [c8afe2ef]',
      prompt: enhancedPrompt,
      negative_prompt: 'blurry, low quality, ugly, watermark',
      steps: 25,
      cfg_scale: 7,
      width: 1024,
      height: 1024,
      sampler: 'DPM++ 2M Karras'
    })
  })
  .then(function(r) {
    if (!r.ok) throw new Error('Prodia create failed: ' + r.status);
    return r.json();
  })
  .then(function(data) {
    if (!data.job) throw new Error('No job ID returned');
    // Step 2: Poll for completion
    var jobId = data.job;
    var pollCount = 0;
    function poll() {
      pollCount++;
      if (pollCount > 40) { clearInterval(dotTimer); clearTimeout(overallTimeout); onFail('poll limit'); return; }
      fetch('https://api.prodia.com/v1/job/' + jobId, { headers: { 'Accept': 'application/json' } })
        .then(function(r) { return r.json(); })
        .then(function(job) {
          if (job.status === 'succeeded' && job.imageUrl) {
            clearInterval(dotTimer);
            clearTimeout(overallTimeout);
            // Fetch the image as blob
            fetch(job.imageUrl)
              .then(function(r) { return r.blob(); })
              .then(function(blob) {
                var blobUrl = URL.createObjectURL(blob);
                onSuccess(blobUrl, 'Prodia AI');
              })
              .catch(function() { onFail('prodia image fetch failed'); });
          } else if (job.status === 'failed') {
            clearInterval(dotTimer); clearTimeout(overallTimeout); onFail('prodia job failed');
          } else {
            setTimeout(poll, 3000);
          }
        })
        .catch(function() { setTimeout(poll, 4000); });
    }
    setTimeout(poll, 4000);
  })
  .catch(function(err) {
    clearInterval(dotTimer);
    clearTimeout(overallTimeout);
    onFail(err.message);
  });
}

// ── PROVIDER 3: Stable Horde ──
// Community-run, 100% free, no signup, always works
// Uses anonymous key "0000000000" for free tier (slow but reliable)
function _tryStableHorde(prompt, onSuccess, onFail) {
  _genSetBadge('🌐 Stable Horde');
  _genSetStatus('🌐 Connecting to Stable Horde...');

  var enhancedPrompt = prompt + ', vibrant colors, highly detailed, sharp focus, digital art';
  var ANON_KEY = '0000000000';

  var dotCount = 0;
  var dotTimer = setInterval(function() {
    dotCount = (dotCount % 3) + 1;
    _genSetStatus('🌐 Stable Horde processing' + '.'.repeat(dotCount));
  }, 800);

  var overallTimeout = setTimeout(function() {
    clearInterval(dotTimer);
    onFail('horde timeout');
  }, 180000);

  // Step 1: Submit job
  fetch('https://stablehorde.net/api/v2/generate/async', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY,
      'Client-Agent': 'TypeBlastPro:1.0:typeblastpro.app'
    },
    body: JSON.stringify({
      prompt: enhancedPrompt,
      params: {
        width: 512,
        height: 512,
        steps: 20,
        cfg_scale: 7,
        karras: true,
        n: 1
      },
      models: ['stable_diffusion'],
      r2: true,
      nsfw: false,
      censor_nsfw: true
    })
  })
  .then(function(r) {
    if (!r.ok) throw new Error('Horde submit failed: ' + r.status);
    return r.json();
  })
  .then(function(data) {
    if (!data.id) throw new Error('No job ID');
    var jobId = data.id;
    var pollCount = 0;
    function pollHorde() {
      pollCount++;
      if (pollCount > 60) { clearInterval(dotTimer); clearTimeout(overallTimeout); onFail('horde poll limit'); return; }
      fetch('https://stablehorde.net/api/v2/generate/check/' + jobId, {
        headers: { 'apikey': ANON_KEY, 'Client-Agent': 'TypeBlastPro:1.0:typeblastpro.app' }
      })
      .then(function(r) { return r.json(); })
      .then(function(status) {
        if (status.done) {
          // Get result
          fetch('https://stablehorde.net/api/v2/generate/status/' + jobId, {
            headers: { 'apikey': ANON_KEY, 'Client-Agent': 'TypeBlastPro:1.0:typeblastpro.app' }
          })
          .then(function(r) { return r.json(); })
          .then(function(result) {
            clearInterval(dotTimer);
            clearTimeout(overallTimeout);
            var gen = result.generations && result.generations[0];
            if (!gen || !gen.img) { onFail('no image in result'); return; }
            // gen.img is a URL (r2=true) or base64
            if (gen.img.startsWith('http')) {
              fetch(gen.img)
                .then(function(r) { return r.blob(); })
                .then(function(blob) { onSuccess(URL.createObjectURL(blob), 'Stable Horde'); })
                .catch(function() { onFail('horde img fetch failed'); });
            } else {
              // base64
              var byteStr = atob(gen.img.replace('data:image/webp;base64,','').replace('data:image/png;base64,',''));
              var arr = new Uint8Array(byteStr.length);
              for (var i = 0; i < byteStr.length; i++) arr[i] = byteStr.charCodeAt(i);
              var blob = new Blob([arr], {type: 'image/webp'});
              onSuccess(URL.createObjectURL(blob), 'Stable Horde');
            }
          })
          .catch(function() { onFail('horde status fetch failed'); });
        } else {
          var waitMsg = status.wait_time ? ' (~' + status.wait_time + 's)' : '';
          _genSetStatus('🌐 Queue position: ' + (status.queue_position || '?') + waitMsg);
          setTimeout(pollHorde, 5000);
        }
      })
      .catch(function() { setTimeout(pollHorde, 6000); });
    }
    setTimeout(pollHorde, 3000);
  })
  .catch(function(err) {
    clearInterval(dotTimer);
    clearTimeout(overallTimeout);
    onFail(err.message);
  });
}

// ── MAIN ENTRY POINT ──
// Tries providers in order: HuggingFace → Prodia → Stable Horde
// Each failure automatically triggers next provider
function generateImage(prompt, providerIndex) {
  providerIndex = providerIndex || 0;
  _genActive = true;

  var providers = [
    { name: 'HuggingFace FLUX', fn: _tryHuggingFace },
    { name: 'Prodia', fn: _tryProdia },
    { name: 'Stable Horde', fn: _tryStableHorde }
  ];

  if (providerIndex >= providers.length) {
    _genShowFailed();
    return;
  }

  var provider = providers[providerIndex];

  function onSuccess(blobUrl, displayName) {
    if (!_genActive) return;
    _genShowSuccess(blobUrl, displayName);
  }

  function onFail(reason) {
    if (!_genActive) return;
    console.warn('[ImageGen] ' + provider.name + ' failed: ' + reason);
    var next = providerIndex + 1;
    if (next < providers.length) {
      _genSetStatus('⏭ ' + provider.name + ' failed, trying ' + providers[next].name + '...');
      setTimeout(function() {
        if (_genActive) generateImage(prompt, next);
      }, 1500);
    } else {
      _genShowFailed();
    }
  }

  provider.fn(prompt, onSuccess, onFail);
}

function regenerateImage() {
  _genActive = false;
  document.getElementById('genImageContainer').style.display = 'none';
  document.getElementById('genActionRow').style.display = 'none';
  document.getElementById('genLoader').style.display = 'flex';
  _genSetTitle('🎨 Creating Your Image...');
  _genSetStatus('⏳ Starting generation...');
  _genSetBadge('🤗 HuggingFace FLUX');
  generateImage(lastPromptUsed, 0);
}

function downloadImage() {
  var blobUrl = _currentBlobUrl;
  if (!blobUrl) { var img = document.getElementById('genImage'); blobUrl = img && img.src; }
  if (!blobUrl) return;
  var a = document.createElement('a');
  a.href = blobUrl;
  a.download = 'typeblast-ai-image.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function shareImage() {
  const img = document.getElementById('genImage');
  if (!img.src) return;
  if (navigator.share) {
    navigator.share({
      title: 'TypeBlast AI Image',
      text: `🎨 Check out this AI image I generated: "${lastPromptUsed}"`,
      url: img.src
    }).catch(() => {});
  } else {
    // Fallback: copy image URL to clipboard
    navigator.clipboard.writeText(img.src).then(() => {
      showWarning('✅ Image URL copied to clipboard!');
    }).catch(() => {
      window.open(img.src, '_blank');
    });
  }
}

function openFullscreen() {
  const img = document.getElementById('genImage');
  if (!img.src) return;
  window.open(img.src, '_blank');
}

function closeImageGen() {
  document.getElementById('imageGenOverlay').style.display = 'none';
  if (isPromptMode) {
    // Unlimited prompt mode — just load a new prompt
    loadQuestion();
    focusInput();
    return;
  }
  if (sessionActive && currentQuestion + 1 < TOTAL_QUESTIONS) {
    currentQuestion++;
    loadQuestion();
    focusInput();
  } else if (sessionActive) {
    showFinalResult();
  }
}

function goBackToPromptScreen() {
  document.getElementById('imageGenOverlay').style.display = 'none';
  // Reset state so user can retype the same prompt
  charIndex = 0; errors = 0; totalTyped = 0;
  isRunning = false; testStarted = false; startTime = null;
  timeLeft = PROMPT_TIME; weakTypingShown = false;
  promptComplete = false; promptHasError = false;
  renderText(); updateStats(); updateTimerBar();
  document.getElementById('hiddenInput').value = '';
  document.getElementById('clickPrompt').classList.remove('hidden');
  document.getElementById('promptCompleteOverlay').style.display = 'none';
  document.getElementById('promptErrorOverlay').style.display = 'none';
  focusInput();
}

// ===================== WEAK TYPING =====================
function showWeakTypingWarning() {
  isRunning = false;
  clearInterval(timerInterval);
  const overlay = document.getElementById('weakTypingOverlay');
  const countEl = document.getElementById('weakCountdown');
  overlay.style.display = 'flex';
  let sec = 5;
  countEl.textContent = sec;
  const wt = setInterval(() => {
    sec--;
    countEl.textContent = sec;
    if (sec <= 0) {
      clearInterval(wt);
      overlay.style.display = 'none';
      retestCurrentQuestion();
    }
  }, 1000);
}

function retestCurrentQuestion() {
  clearInterval(timerInterval);
  clearTimeout(transitionTimer);
  hideTransition();
  charIndex = 0; errors = 0; totalTyped = 0;
  isRunning = false; testStarted = false; startTime = null;
  timeLeft = isPromptMode ? PROMPT_TIME : TIME_PER_QUESTION; weakTypingShown = false;
  promptComplete = false; promptHasError = false;
  renderText(); updateStats(); updateTimerBar();
  document.getElementById('hiddenInput').value = '';
  document.getElementById('clickPrompt').classList.remove('hidden');
  document.getElementById('promptCompleteOverlay').style.display = 'none';
  document.getElementById('promptErrorOverlay').style.display = 'none';
  showWarning('⟳ Same question — type carefully!');
}

// ===================== TIMER =====================
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!isRunning) return;
    timeLeft--;
    updateTimerDisplay();
    updateTimerBar();
    if (timeLeft <= 0) {
      recordQuestionResult(false, false);
      moveToNextQuestion('timeout');
    }
  }, 1000);
}

// ===================== RESULT RECORDING =====================
function recordQuestionResult(completed, skipped) {
  isRunning = false;
  clearInterval(timerInterval);
  const elapsed = startTime ? (Date.now() - startTime) / 60000 : (TIME_PER_QUESTION / 60);
  const words   = totalTyped / 5;
  const wpm     = elapsed > 0 ? Math.round(words / elapsed) : 0;
  const acc     = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 0;
  const marks   = Math.max(0, 100 - errors * 2);
  questionResults.push({ q: currentQuestion + 1, wpm, acc, chars: totalTyped, wrongLetters: errors, marks, completed, skipped });
}

// ===================== NEXT QUESTION =====================
function moveToNextQuestion(reason) {
  if (!isPromptMode && currentQuestion + 1 >= TOTAL_QUESTIONS) { showFinalResult(); return; }
  let countdown = 3;
  const overlay  = document.getElementById('transitionOverlay');
  const titleEl  = document.getElementById('transitionTitle');
  const msgEl    = document.getElementById('transitionMsg');
  const countEl  = document.getElementById('nextCountdown');
  if (reason === 'timeout') titleEl.textContent = '⏱ TIME\'S UP!';
  else if (reason === 'completed') titleEl.textContent = '✅ PARAGRAPH DONE! 🎉';
  else titleEl.textContent = '⟶ SKIPPED';
  msgEl.textContent = `Question ${currentQuestion + 2} of ${TOTAL_QUESTIONS} loading…`;
  countEl.textContent = countdown;
  overlay.style.display = 'flex';
  transitionTimer = setInterval(() => {
    countdown--;
    countEl.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(transitionTimer);
      currentQuestion++;
      loadQuestion();
      focusInput();
    }
  }, 1000);
}

function hideTransition() { document.getElementById('transitionOverlay').style.display = 'none'; }

// ===================== FINAL RESULT =====================
function showFinalResult() {
  sessionActive = false;
  hideTransition();
  if (questionResults.length === 0) return;
  const totalChars = questionResults.reduce((s, r) => s + r.chars, 0);
  const avgWpm     = Math.round(questionResults.reduce((s, r) => s + r.wpm, 0) / questionResults.length);
  const avgAcc     = Math.round(questionResults.reduce((s, r) => s + r.acc, 0) / questionResults.length);
  const avgMarks   = Math.round(questionResults.reduce((s, r) => s + r.marks, 0) / questionResults.length);
  let grade, subtitle;
  if (avgWpm >= 80 && avgAcc >= 95) { grade = 'A+'; subtitle = '🏆 Outstanding! Expert Typist!'; }
  else if (avgWpm >= 60 && avgAcc >= 90) { grade = 'A'; subtitle = '⭐ Excellent! Advanced Typist!'; }
  else if (avgWpm >= 45 && avgAcc >= 85) { grade = 'B+'; subtitle = '👍 Very Good! Above Average!'; }
  else if (avgWpm >= 35 && avgAcc >= 80) { grade = 'B'; subtitle = '✅ Good Performance!'; }
  else if (avgWpm >= 25 && avgAcc >= 70) { grade = 'C'; subtitle = '📈 Keep Practicing!'; }
  else { grade = 'D'; subtitle = '💪 Needs More Practice!'; }
  document.getElementById('resultGrade').textContent    = grade;
  document.getElementById('resultSubtitle').textContent = subtitle;
  document.getElementById('res-wpm').textContent        = avgWpm;
  document.getElementById('res-acc').textContent        = avgAcc + '%';
  document.getElementById('res-chars').textContent      = totalChars;
  document.getElementById('res-marks').textContent      = avgMarks + '/100';
  const tbody = document.getElementById('qResultsBody');
  tbody.innerHTML = '';
  questionResults.forEach(r => {
    const tr = document.createElement('tr');
    tr.className = r.skipped ? 'q-skip' : (r.completed ? 'q-pass' : 'q-fail');
    tr.innerHTML = `<td>Q${r.q}</td><td>${r.wpm}</td><td>${r.acc}%</td><td>${r.chars}</td><td style="color:var(--red);font-weight:700;">${r.wrongLetters}</td><td style="color:var(--yellow);font-weight:700;">${r.marks}/100</td><td>${r.skipped?'⟶ Skip':(r.completed?'✅ Done':'⏱ Time')}</td>`;
    tbody.appendChild(tr);
  });
  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const pill = document.getElementById(`pill-${i}`);
    if (!pill) continue;
    const res = questionResults[i];
    pill.className = 'q-pill ' + (res && res.completed ? 'done' : 'failed');
  }
  document.getElementById('resultModal').classList.add('show');
  setTimeout(() => { document.getElementById('resultBar').style.width = Math.min(avgAcc, 100) + '%'; }, 300);
}

function closeResult() { document.getElementById('resultModal').classList.remove('show'); }

// ===================== STATS =====================
function updateStats() {
  const elapsed = startTime ? (Date.now() - startTime) / 60000 : 0;
  const words   = totalTyped / 5;
  const wpm     = elapsed > 0 ? Math.round(words / elapsed) : 0;
  const acc     = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
  document.getElementById('wpmDisplay').textContent = wpm;
  document.getElementById('accDisplay').textContent = acc + '%';
  document.getElementById('errDisplay').textContent = errors;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  document.getElementById('timerDisplay').textContent = `${m}:${s.toString().padStart(2,'0')}`;
}

function updateTimerBar() {
  const maxTime = isPromptMode ? PROMPT_TIME : TIME_PER_QUESTION;
  const pct = (timeLeft / maxTime) * 100;
  const bar = document.getElementById('timerBar');
  bar.style.width = pct + '%';
  if (pct < 25) bar.classList.add('warning');
  else bar.classList.remove('warning');
}

// ===================== SECURITY =====================
document.addEventListener('copy',  e => { e.preventDefault(); showWarning('⛔ Copying not allowed!'); });
document.addEventListener('cut',   e => { e.preventDefault(); showWarning('⛔ Cutting not allowed!'); });
document.addEventListener('paste', e => { e.preventDefault(); showWarning('⛔ Paste not allowed!'); });
document.addEventListener('selectstart', e => { e.preventDefault(); });
document.addEventListener('dragstart', e => e.preventDefault());
window.addEventListener('beforeprint', e => { e.preventDefault(); showWarning('⛔ Printing not allowed!'); });

let unlockStep = 0;
const UNLOCK_STEPS = [
  e => e.altKey && e.key.toUpperCase() === 'L',
  e => e.altKey && e.key.toUpperCase() === 'O',
  e => e.altKey && e.key.toUpperCase() === 'A',
  e => e.altKey && e.key === 'Control'
];

document.addEventListener('keydown', e => {
  if (e.key === 'F5' || (e.ctrlKey && (e.key === 'r' || e.key === 'R'))) {
    e.preventDefault();
    showWarning('⛔ Refresh not allowed during test!');
    return;
  }
  const overlay = document.getElementById('securityOverlay');
  const isLocked = overlay.style.display === 'flex' && violationCount >= MAX_VIOLATIONS;
  if (isLocked) {
    if (UNLOCK_STEPS[unlockStep](e)) {
      e.preventDefault(); unlockStep++;
      showUnlockProgress(unlockStep);
      if (unlockStep >= UNLOCK_STEPS.length) { unlockStep = 0; unlockSession(); }
    } else if (e.altKey || e.ctrlKey) { e.preventDefault(); unlockStep = 0; }
    return;
  }
  if (e.key === 'Tab')    { e.preventDefault(); restartTest(); }
  if (e.key === 'Escape') { e.preventDefault(); startNewSession(); }
}, true);

document.addEventListener('mousedown', e => {
  // Prevent scroll jump on any click anywhere on the page
  const scrollX = window.scrollX, scrollY = window.scrollY;
  Promise.resolve().then(() => window.scrollTo(scrollX, scrollY));
  requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));

  if (!testStarted || !sessionActive) return;
  const testArea = document.getElementById('testArea');
  if (testArea && testArea.contains(e.target)) return;
  const allowedSelectors = ['.btn','.level-btn','#resultModal','.result-card','#imageGenOverlay','.gen-new-btn','.gen-back-btn','#promptCompleteOverlay','#promptErrorOverlay'];
  for (const sel of allowedSelectors) { if (e.target.closest(sel)) return; }
  handleFocusLost();
});

function handleFocusLost() {
  if (!testStarted || !sessionActive) return;
  if (document.getElementById('imageGenOverlay').style.display === 'flex') return;
  violationCount++;
  isRunning = false;
  clearInterval(timerInterval);
  clearTimeout(transitionTimer);
  hideTransition();
  const overlay = document.getElementById('securityOverlay');
  document.getElementById('violationCount').textContent = `Violations: ${violationCount} / ${MAX_VIOLATIONS}`;
  overlay.style.display = 'flex';
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden && document.getElementById('imageGenOverlay').style.display !== 'flex') handleFocusLost();
});
window.addEventListener('blur', () => {
  if (document.getElementById('imageGenOverlay').style.display !== 'flex') handleFocusLost();
});

function restartAfterViolation() {
  document.getElementById('securityOverlay').style.display = 'none';
  if (violationCount >= MAX_VIOLATIONS) {
    const overlay = document.getElementById('securityOverlay');
    overlay.style.display = 'flex';
    overlay.querySelector('h2').textContent = '🔒 SESSION LOCKED';
    overlay.querySelector('p').textContent = '';
    overlay.querySelector('button').style.display = 'none';
    document.getElementById('unlockHintMsg').style.display = 'block';
    document.getElementById('unlockProgressDisplay').style.display = 'block';
    return;
  }
  startNewSession();
}

function unlockSession() {
  unlockStep = 0; violationCount = 0;
  const overlay = document.getElementById('securityOverlay');
  overlay.style.display = 'none';
  overlay.querySelector('h2').textContent = 'FOCUS LOST — TEST ENDED!';
  overlay.querySelector('p').textContent = 'Aapne test ke dauran window switch ya focus band kiya.';
  overlay.querySelector('button').style.display = '';
  document.getElementById('unlockHintMsg').style.display = 'none';
  document.getElementById('unlockProgressDisplay').style.display = 'none';
  document.getElementById('unlockProgressDisplay').textContent = '● ● ● ●';
  showWarning('✅ Session unlocked!');
  setTimeout(() => startNewSession(), 800);
}

function showUnlockProgress(step) {
  const dots = ['●','●','●','●'].map((d,i)=>i<step?`<span style="color:var(--green)">${d}</span>`:`<span style="color:var(--muted)">${d}</span>`).join(' ');
  const el = document.getElementById('unlockProgressDisplay');
  el.innerHTML = dots; el.style.display = 'block';
}

window.addEventListener('beforeunload', e => {
  if (testStarted && isRunning) { e.preventDefault(); e.returnValue = ''; return ''; }
  const overlay = document.getElementById('securityOverlay');
  if (overlay && overlay.style.display === 'flex' && violationCount >= MAX_VIOLATIONS) { e.preventDefault(); e.returnValue = ''; return ''; }
});

// ===================== PARTICLES =====================
function createParticles() {
  const colors = ['#ff4d8d','#a855f7','#22d3ee','#fbbf24','#4ade80'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      left:${Math.random()*100}%;
      animation-duration:${Math.random()*22+15}s;
      animation-delay:${Math.random()*12}s;
    `;
    document.body.appendChild(p);
  }
}

// ===================== INIT =====================
createParticles();
startNewSession();
document.getElementById('testArea').addEventListener('click', focusInput);
// ===================== AUTO-SCROLL FIX =====================
// Prevent the hidden input focus from jumping the page scroll position
(function() {
  const hiddenInput = document.getElementById('hiddenInput');
  if (!hiddenInput) return;

  // Override focus to preserve scroll position
  const origFocus = hiddenInput.focus.bind(hiddenInput);
  hiddenInput.focus = function() {
    const sx = window.scrollX, sy = window.scrollY;
    origFocus();
    window.scrollTo(sx, sy);
  };

  // Also block any scroll caused by the hidden input receiving focus via click
  hiddenInput.addEventListener('focus', function() {
    // Double-lock: restore after microtask and after next frame
    const sx = window.scrollX, sy = window.scrollY;
    Promise.resolve().then(() => window.scrollTo(sx, sy));
    requestAnimationFrame(() => window.scrollTo(sx, sy));
  });
})();
