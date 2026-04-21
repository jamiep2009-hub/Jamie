// AI Sensei — static content: kata library, conditioning drills, karate history.
// Used by the client to render the Kata, Conditioning, and History tabs.

const KATA_DATA = [
  {
    name: "Taikyoku Shodan",
    tag: "Foundation",
    purpose: "Teach basic stance, turning, and down-block/step-punch structure.",
    movements: ["Gedan barai", "Oi zuki chudan", "90° and 180° turns", "I-pattern (embusen)"],
    stance: "Zenkutsu dachi — front stance. Long and stable.",
    errors: [
      "Stance too short or too high.",
      "Punch and step finish out of time.",
      "Head drops on turns.",
      "Hikite (pulling hand) too low or too weak."
    ],
    drills: [
      "Zenkutsu dachi walk: 3 x 10 lengths. Slow, low.",
      "Gedan barai + oi zuki: 3 x 20. Finish on the same beat.",
      "Turns only: 3 x 10 each direction. Keep head level."
    ]
  },
  {
    name: "Heian Shodan",
    tag: "Heian 1",
    purpose: "Introduce basic blocks, strikes, and rhythm changes.",
    movements: ["Gedan barai", "Oi zuki", "Age uke", "Shuto uke in kokutsu dachi", "Tetsui uchi"],
    stance: "Zenkutsu dachi main. Kokutsu dachi for shuto uke.",
    errors: [
      "Shuto uke arm too wide.",
      "Kokutsu weight not 70/30 back.",
      "Age uke elbow too high.",
      "Rushing the tetsui uchi."
    ],
    drills: [
      "Age uke + gyaku zuki: 3 x 20.",
      "Kokutsu shuto uke walking: 3 x 10 lengths.",
      "Kata slow/full-speed alternating: 5 rounds."
    ]
  },
  {
    name: "Heian Nidan",
    tag: "Heian 2",
    purpose: "Combine blocks with kicks. Train back-stance mobility.",
    movements: ["Haiwan uke + uraken", "Yoko geri keage", "Shuto uke", "Nukite with osae uke"],
    stance: "Zenkutsu and kokutsu dachi. Transitions count.",
    errors: [
      "Side kick (yoko geri keage) too low or knee not raised.",
      "Shuto uke shoulders raise.",
      "Nukite over-reaches past the hip.",
      "Kokutsu stance collapses."
    ],
    drills: [
      "Yoko geri keage on spot: 3 x 15 each leg.",
      "Shuto uke + nukite combination: 3 x 15.",
      "Kokutsu to zenkutsu transitions: 3 x 10."
    ]
  },
  {
    name: "Heian Sandan",
    tag: "Heian 3",
    purpose: "Train close-range techniques and body shifting (tai sabaki).",
    movements: ["Uchi uke combinations", "Fumikomi (stomping kick)", "Tate zuki", "Yori ashi shift"],
    stance: "Kiba dachi and zenkutsu dachi. Tight, low hips.",
    errors: [
      "Kiba dachi too narrow or knees collapse inward.",
      "Fumikomi lifted, not stomped.",
      "Tate zuki elbow flares.",
      "Slow body shift."
    ],
    drills: [
      "Kiba dachi hold: 3 x 60 sec.",
      "Fumikomi on spot: 3 x 10 each leg.",
      "Uchi uke + gyaku zuki: 3 x 20."
    ]
  },
  {
    name: "Heian Yondan",
    tag: "Heian 4",
    purpose: "Develop power through combinations and kicks.",
    movements: ["Juji uke", "Mae geri + uraken", "Shuto uchi", "Hiza geri (knee strike)"],
    stance: "Zenkutsu, kokutsu, and kosa dachi.",
    errors: [
      "Mae geri retracted late.",
      "Shuto uchi uses arm only, not hip.",
      "Juji uke hands not crossed correctly.",
      "Knee strike loses balance."
    ],
    drills: [
      "Mae geri + gyaku zuki: 3 x 20 each leg.",
      "Hiza geri on pad or spot: 3 x 15 each.",
      "Shuto uchi with hip rotation: 3 x 20."
    ]
  },
  {
    name: "Heian Godan",
    tag: "Heian 5",
    purpose: "Introduce jumping, crescent-like stepping, and advanced transitions.",
    movements: ["Mikazuki geri", "Jump (tobi) into kosa dachi", "Gedan juji uke", "Manji uke"],
    stance: "Zenkutsu, kokutsu, kosa dachi. Control on landing.",
    errors: [
      "Jump lands off balance.",
      "Mikazuki geri foot path collapses.",
      "Manji uke arms not locked.",
      "Rushing the final moves."
    ],
    drills: [
      "Mikazuki geri slow: 3 x 10 each leg.",
      "Jump into kosa dachi: 3 x 10 soft landings.",
      "Manji uke hold: 3 x 20 sec each side."
    ]
  },
  {
    name: "Tekki Shodan",
    tag: "Tekki 1",
    purpose: "Build lower body strength and side-stance (kiba dachi) power.",
    movements: ["Nami ashi (returning wave)", "Kagi zuki (hook punch)", "Uchi uke", "Empi uchi"],
    stance: "Kiba dachi only. Low, wide, stable.",
    errors: [
      "Stance rises during moves.",
      "Hips rotate when they should stay square.",
      "Nami ashi lifts outside the body line.",
      "Kagi zuki elbow too far from ribs."
    ],
    drills: [
      "Kiba dachi hold: 3 x 90 sec.",
      "Kiba dachi walk (stepping crossover): 3 x 10 lengths.",
      "Kagi zuki on spot: 3 x 30."
    ]
  },
  {
    name: "Tekki Nidan",
    tag: "Tekki 2",
    purpose: "Add fast blocks and direction changes from kiba dachi.",
    movements: ["Haishu uke", "Uraken yokomawashi uchi", "Morote uke combinations"],
    stance: "Kiba dachi. Hips must stay level.",
    errors: [
      "Hips bob as arms move.",
      "Uraken too soft — snap from elbow.",
      "Shoulders tense."
    ],
    drills: [
      "Morote uke slow: 3 x 20.",
      "Uraken uchi from kiba: 3 x 30.",
      "Kiba dachi hold with arm work: 3 x 60 sec."
    ]
  },
  {
    name: "Tekki Sandan",
    tag: "Tekki 3",
    purpose: "Train rapid transitions and complex hand combinations in kiba dachi.",
    movements: ["Soto uke + uchi uke flow", "Osae uke", "Sokumen zuki"],
    stance: "Kiba dachi. Train for endurance.",
    errors: [
      "Flow breaks between blocks.",
      "Stance height varies.",
      "Punch arcs instead of going straight."
    ],
    drills: [
      "Block flow drill: 3 x 20 reps of soto/uchi uke.",
      "Kiba dachi hold with hikite work: 3 x 60 sec.",
      "Sokumen zuki: 3 x 20 each side."
    ]
  },
  {
    name: "Bassai Dai",
    tag: "Dan grade",
    purpose: "Break through the enemy's defence. Train powerful hip shifting and strong blocks.",
    movements: ["Soto uke", "Yama zuki", "Sukui uke", "Uchi uke combinations"],
    stance: "Zenkutsu and kiba dachi. Deep, rooted.",
    errors: [
      "Hip shift too small.",
      "Yama zuki arms not aligned.",
      "Soto uke uses shoulder instead of hip."
    ],
    drills: [
      "Yama zuki on spot: 3 x 20.",
      "Soto uke with full hip rotation: 3 x 20.",
      "Opening sequence drill: 5 rounds slow-to-fast."
    ]
  },
  {
    name: "Bassai Sho",
    tag: "Dan grade",
    purpose: "Close-range counters against bo and grappling attacks.",
    movements: ["Morote sukui uke", "Haito uchi", "Oi zuki + uraken flow"],
    stance: "Zenkutsu mostly. Light and fast.",
    errors: [
      "Moves too stiff.",
      "Sukui uke does not scoop low enough.",
      "Flow breaks."
    ],
    drills: [
      "Sukui uke slow: 3 x 15.",
      "Haito uchi: 3 x 20 each side.",
      "Kata half-speed: 5 rounds with breath control."
    ]
  },
  {
    name: "Kanku Dai",
    tag: "Dan grade",
    purpose: "Train long-range mobility, jumping, and view of the sky (kanku = look at sky).",
    movements: ["Opening sky-view", "Mae tobi geri (jump kick)", "Shuto uke", "Mikazuki geri"],
    stance: "All major stances. Long kata — pace matters.",
    errors: [
      "Pace too even — no tempo changes.",
      "Jump kick loses height with tension.",
      "Opening move rushed."
    ],
    drills: [
      "Mae tobi geri: 3 x 8 soft landings.",
      "Opening sequence: 10 reps, very slow.",
      "Full kata pace drill: slow / medium / full."
    ]
  },
  {
    name: "Kanku Sho",
    tag: "Dan grade",
    purpose: "Sharper, faster version of Kanku Dai. Train explosive starts.",
    movements: ["Morote uke opening", "Jump (tobi)", "Nukite", "Fast combinations"],
    stance: "Zenkutsu, kokutsu, kosa dachi.",
    errors: [
      "No explosive start.",
      "Jump off-balance.",
      "Shoulders lift in nukite."
    ],
    drills: [
      "Opening burst x 10 with reset between reps.",
      "Kosa dachi jump and lock: 3 x 8.",
      "Nukite from hikite: 3 x 20."
    ]
  },
  {
    name: "Empi",
    tag: "Dan grade",
    purpose: "Flying swallow — rapid level changes and elbow strikes.",
    movements: ["Tate empi (upward elbow)", "Tobi (jump)", "Shuto uke low"],
    stance: "Lots of height change. Legs work hard.",
    errors: [
      "Level change uses knees only, not hips.",
      "Jump short and slow.",
      "Elbow strike arm flaps."
    ],
    drills: [
      "Tate empi: 3 x 20 each arm.",
      "High-to-low drops: 3 x 10.",
      "Jump for height from shizentai: 3 x 10."
    ]
  },
  {
    name: "Jion",
    tag: "Dan grade",
    purpose: "Peace and temple-like calm. Train strong, classic basics.",
    movements: ["Morote uke", "Oi zuki chains", "Age uke + gyaku zuki"],
    stance: "Deep zenkutsu. Classical.",
    errors: [
      "Basics soft because kata is 'classical'.",
      "Hikite weak.",
      "Head moves on turns."
    ],
    drills: [
      "Oi zuki chains: 3 x 20.",
      "Morote uke slow: 3 x 20.",
      "Kata with full kime on every move: 3 rounds."
    ]
  },
  {
    name: "Jitte",
    tag: "Dan grade",
    purpose: "Ten hands — defence against bo. Strong root and wide stances.",
    movements: ["Haishu uke", "Bo-take away motions", "Wide kiba dachi shifts"],
    stance: "Wide, low, rooted.",
    errors: [
      "Hips too high.",
      "Arms do the block alone.",
      "Breath not used to drive power."
    ],
    drills: [
      "Low kiba dachi shift: 3 x 10 each way.",
      "Haishu uke + gyaku zuki: 3 x 20.",
      "Kata with loud breath kime: 3 rounds."
    ]
  },
  {
    name: "Hangetsu",
    tag: "Dan grade",
    purpose: "Half-moon. Train breath, tension, and the hangetsu dachi footwork.",
    movements: ["Hangetsu dachi steps", "Nami gaeshi", "Slow-tension breathing"],
    stance: "Hangetsu dachi (like zenkutsu but feet curve inward).",
    errors: [
      "Feet path straight, not curved.",
      "Breath inconsistent.",
      "Tension only in arms."
    ],
    drills: [
      "Hangetsu walk: 3 x 10 lengths.",
      "Sanchin-style breath + tension: 3 x 10 reps.",
      "Nami gaeshi on spot: 3 x 15 each leg."
    ]
  },
  {
    name: "Gankaku",
    tag: "Dan grade",
    purpose: "Crane on a rock. Train single-leg balance and yoko geri.",
    movements: ["Tsuru ashi dachi (crane stance)", "Yoko geri kekomi", "Uraken"],
    stance: "Crane stance + zenkutsu. Balance decides the kata.",
    errors: [
      "Crane leg wobbles.",
      "Kekomi not thrust — snapping instead.",
      "Upper body leans."
    ],
    drills: [
      "Crane stance hold: 3 x 45 sec each leg.",
      "Yoko geri kekomi slow: 3 x 10 each leg.",
      "Balance + kick combos: 3 x 10."
    ]
  },
  {
    name: "Nijushiho",
    tag: "Dan grade",
    purpose: "Twenty-four steps. Train fast/slow contrasts and wave-like rhythm.",
    movements: ["Haito uchi", "Empi uchi", "Mikazuki geri into block"],
    stance: "Mixed. Timing is everything.",
    errors: [
      "No rhythm change — all one speed.",
      "Haito uchi soft.",
      "Mikazuki geri too high for the context."
    ],
    drills: [
      "Slow-fast pairs practice: 3 x 10 combinations.",
      "Haito uchi: 3 x 20 each side.",
      "Kata with clear tempo changes: 3 rounds."
    ]
  },
  {
    name: "Chinte",
    tag: "Dan grade",
    purpose: "Unusual hand techniques. Train accuracy and close-range hand work.",
    movements: ["Nakadaka ippon ken", "Haito uchi", "Small circular blocks"],
    stance: "Mostly zenkutsu. Short, precise.",
    errors: [
      "Fingers and knuckles not aligned for strike.",
      "Techniques rushed — lose precision.",
      "Small movements become sloppy."
    ],
    drills: [
      "Nakadaka ippon ken on pad: 3 x 15 each.",
      "Haito uchi chains: 3 x 15.",
      "Slow kata for accuracy: 3 rounds."
    ]
  },
  {
    name: "Sochin",
    tag: "Dan grade",
    purpose: "Immovable strength. Train sochin dachi (fudo dachi) rooted power.",
    movements: ["Sochin dachi", "Triple block sequences", "Strong gyaku zuki"],
    stance: "Sochin / fudo dachi — both feet rooted, weight 50/50, deep.",
    errors: [
      "Stance too high.",
      "Weight shifts between feet during techniques.",
      "Blocks loose."
    ],
    drills: [
      "Sochin dachi hold: 3 x 60 sec.",
      "Triple block + counter: 3 x 15.",
      "Gyaku zuki from sochin dachi: 3 x 20."
    ]
  },
  {
    name: "Unsu",
    tag: "Dan grade",
    purpose: "Cloud hands. Train open-hand flow and jumping 360 turn.",
    movements: ["Open-hand blocks", "Circular flow", "Jumping spin kick"],
    stance: "All stances. Transitions are fast.",
    errors: [
      "Open-hand flow stops between moves.",
      "Jump spin under-rotated.",
      "Land on stiff legs."
    ],
    drills: [
      "Open-hand slow flow: 3 x 10 sequences.",
      "Jump spin practice (no kick): 3 x 10.",
      "Full jump-spin kick with soft landing: 3 x 5."
    ]
  },
  {
    name: "Meikyo",
    tag: "Dan grade",
    purpose: "Polished mirror. Train clarity, balance, and the three-circle opening.",
    movements: ["Three circular hand sweeps", "Tate empi", "Mae geri combinations"],
    stance: "Zenkutsu and kokutsu. Centered.",
    errors: [
      "Circular sweeps lose shape.",
      "Mae geri not pulled back.",
      "Upper body tense."
    ],
    drills: [
      "Three circle sweeps: 3 x 10.",
      "Mae geri + gyaku zuki: 3 x 20.",
      "Slow kata focus: 3 rounds on opening only."
    ]
  },
  {
    name: "Wankan",
    tag: "Dan grade",
    purpose: "King's crown. Shortest kata. Train precision and clean transitions.",
    movements: ["Kake uke", "Tate zuki", "Short combinations"],
    stance: "Zenkutsu, kokutsu. Every move counts.",
    errors: [
      "Kata treated as easy because short.",
      "Kake uke flat, not curved.",
      "No kime on final moves."
    ],
    drills: [
      "Kake uke slow: 3 x 15.",
      "Tate zuki on spot: 3 x 20.",
      "Full kata with full kime: 5 rounds."
    ]
  }
];

const CONDITIONING_DATA = [
  {
    focus: "Strength",
    drills: [
      { name: "Push-ups (full)", reps: "3 x 20", focus: "Straight line shoulders to heels." },
      { name: "Knuckle push-ups", reps: "3 x 15", focus: "Wrist straight, conditions seiken." },
      { name: "Bodyweight squats", reps: "3 x 25", focus: "Low, heels down, back straight." },
      { name: "Lunges", reps: "3 x 12 each leg", focus: "Long step, knee tracks over foot." },
      { name: "Pull-ups / rows", reps: "3 x 8 (or bodyweight rows 3 x 12)", focus: "Hikite-style pull. Squeeze shoulder blades." }
    ]
  },
  {
    focus: "Stance endurance",
    drills: [
      { name: "Zenkutsu dachi hold", reps: "3 x 60 sec each side", focus: "Hips low, back knee off the floor but locked." },
      { name: "Kiba dachi hold", reps: "3 x 90 sec", focus: "Thighs parallel to floor if possible. Feet turned slightly in." },
      { name: "Kokutsu dachi hold", reps: "3 x 45 sec each side", focus: "70% weight on back leg." },
      { name: "Low-stance walk (zenkutsu)", reps: "3 x 10 lengths", focus: "Stay low — head does not bob." },
      { name: "Kiba dachi crossover walk", reps: "3 x 8 lengths", focus: "Hips stay level while stepping." }
    ]
  },
  {
    focus: "Speed",
    drills: [
      { name: "Shadow kihon (oi zuki)", reps: "3 x 30 sec max speed", focus: "Full retraction. Hikite sharp." },
      { name: "Gyaku zuki on spot", reps: "3 x 20 fast", focus: "Drive from back hip." },
      { name: "Step-punch sprints (oi zuki)", reps: "3 x 10 lengths", focus: "Stance, punch, kime — same instant." },
      { name: "Reaction drills (partner clap)", reps: "3 x 20 sec", focus: "React on the sound, not the visual." },
      { name: "Mae geri snap", reps: "3 x 15 each leg", focus: "Knee up first, snap from the hip." }
    ]
  },
  {
    focus: "Core & hip drive",
    drills: [
      { name: "Plank", reps: "3 x 60 sec", focus: "Glutes and core tight. No sag." },
      { name: "Side plank", reps: "3 x 30 sec each side", focus: "Hips stacked." },
      { name: "Leg raises", reps: "3 x 15", focus: "Lower back stays on floor." },
      { name: "Russian twists", reps: "3 x 20 (10 each side)", focus: "Rotate from the core, not the shoulders." },
      { name: "Hip drive drill (on spot)", reps: "3 x 20 each side", focus: "Snap hip, then punch. Feel it in the obliques." },
      { name: "Hanging knee raises", reps: "3 x 10", focus: "Slow down phase." }
    ]
  }
];

const HISTORY_CONTENT = `
<h3>Okinawan roots</h3>
<p>Karate began in Okinawa — a blend of native fighting (te) and southern Chinese martial arts. For centuries it was trained in secret. Three towns shaped the main styles: Shuri-te, Naha-te, and Tomari-te.</p>

<h3>Gichin Funakoshi</h3>
<p>Gichin Funakoshi (1868–1957) is the founder of Shotokan. He studied under Anko Itosu and Anko Asato in Okinawa. In 1922 he introduced karate to mainland Japan with a public demonstration in Tokyo. "Shoto" was his pen name — Shotokan means "house of Shoto".</p>

<h3>From Okinawa to Japan</h3>
<p>Funakoshi adapted karate for the Japanese education system — uniforms (gi), belts (obi), and the kyu/dan grading system were added. He refined kata and grouped them into the set we still train today, including the Heian series (originally Pinan) and the Tekki series (originally Naihanchi).</p>

<h3>The JKA</h3>
<p>The Japan Karate Association (JKA) was founded in 1949, with Masatoshi Nakayama as chief instructor. The JKA codified the Shotokan syllabus, kumite rules, and instructor training program. It sent instructors worldwide, which is why Shotokan is now the most widely practised karate style.</p>

<h3>Shotokan in the UK and ESKA</h3>
<p>Shotokan reached the UK in the 1960s. Early pioneers included Keinosuke Enoeda and Hirokazu Kanazawa. Over the decades, UK Shotokan split into several federations and independent associations. The English Shotokan Karate Association (ESKA) carries that lineage, with Norfolk as one of its regional homes. Training focuses on strong basics (kihon), the Shotokan kata syllabus, and traditional kumite.</p>

<h3>Core principles</h3>
<p>Funakoshi's Niju Kun (twenty precepts) underpin Shotokan. Key ideas: karate begins and ends with respect; there is no first attack in karate; karate is a lifelong pursuit. The dojo kun — five guiding rules — is recited at the end of most classes: seek perfection of character, be faithful, endeavour, respect others, refrain from violent behaviour.</p>
`;
