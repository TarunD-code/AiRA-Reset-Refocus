import { serializeStatement } from '../shared/openui/serialize.js';
import type { RequestData, Turn } from '../shared/contracts.js';
import { ScreenDocument } from '../shared/openui/document.js';

let lastEx = -1;
let meetingConflictActive = false;

const fence = (code: string) => '```openui\n' + code + '\n```';
const clearThen = (code: string) => fence('root = Screens([])') + '\n' + fence(code);

const exercises = [
  { g: 'NeckRollGuide()', t: 'Seated Neck Rolls', c: 'Lower your chin to your chest and roll your head slowly in a circle.' },
  { g: 'ShoulderShrugGuide()', t: 'Shoulder Shrugs', c: 'Lift your shoulders up high toward your ears, hold for 3 seconds, and release down.' },
  { g: 'StandingGuide()', t: 'Chest Stretch', c: 'Interlace your fingers behind your back and gently lift your hands to open your chest.' },
  { g: 'TorsoTwistGuide()', t: 'Seated Torso Twists', c: 'Sit tall on the edge of your chair, pull your navel in, and slowly twist your upper body to one side, then the other.' },
  { g: 'PelvicTiltGuide()', t: 'Seated Pelvic Tilt', c: 'Flatten your lower back firmly against the backrest of your chair, hold for 5 seconds, and release.' },
  { g: 'KneeChestGuide()', t: 'Knee-to-Chest Lifts', c: 'Pull one knee up toward your chest, hold briefly, and switch sides.' },
  { g: 'LegExtensionGuide()', t: 'Seated Leg Extensions', c: 'Extend one leg straight out, contract your quad muscle, hold, and switch.' },
  { g: 'FigureFourGuide()', t: 'Seated Figure-Four', c: 'Place your right ankle on your left knee and gently hinge forward.' },
  { g: 'HeelToeGuide()', t: 'Heel and Toe Lifts', c: 'Keep your toes on the floor while lifting your heels, then swap to lifting your toes.' },
  { g: 'HandWristGuide()', t: 'Piano Fingers & Clenches', c: 'Make a tight fist for 5 seconds, then open your palm and spread your fingers wide.' },
  { g: 'SeatedMarchGuide()', t: 'Seated Marching', c: 'Alternately lift your left and right knees up toward the ceiling as if marching in place.' },
  { g: 'TricepsLatGuide()', t: 'Triceps & Lat Reach', c: 'Raise your right arm, bend the elbow behind your head, and gently pull with your left hand.' },
  { g: 'RhomboidPressGuide()', t: 'Rhomboid Back Press', c: 'Interlace your fingers in front of you, turn palms away, and press forward rounding your upper back.' },
  { g: 'OverheadSideBendGuide()', t: 'Overhead Side Bends', c: 'Interlace your fingers, extend arms above your head, and gently lean your torso left and right.' },
  { g: 'AnklePumpGuide()', t: 'Ankle Pumps', c: 'Extend one leg out. Point your toes forcefully away, then pull them backward toward your shins.' },
  { g: 'AnkleCircleGuide()', t: 'Ankle Circles', c: 'Lift one foot slightly and rotate your ankle in a smooth circle.' },
  { g: 'ToeTapGuide()', t: 'Seated Toe Taps', c: 'Keep your heels planted and rapidly tap the front of your feet up and down.' },
  { g: 'DeskPushUpGuide()', t: 'Desk Push-Ups', c: 'Stand, place palms on desk, step back into a plank, and lower your chest toward the desk.' },
  { g: 'ChairSquatGuide()', t: 'Chair Squats', c: 'Stand in front of your chair, push hips back, hover just above the seat, and stand back up.' },
];

const WELCOME = [
  'root = Screens([welcome])',
  'welcome = Screen([banner, coach, theme, posture1, title1, subtitle1, meter, followups1, cue1])',
  'banner = CalendarBanner()',
  'coach = AudioCoachToggle()',
  'theme = ThemeToggle()',
  'posture1 = PostureFocus("seated", "#fffbeb")',
  'title1 = Text("Reset & Refocus", "title")',
  'subtitle1 = Text("10-Minute Desk Mobility", "subtitle")',
  'meter = EnergyMeter()',
  'followups1 = FollowUps(["Begin Mobility Routine", "Test Lung Capacity"])',
  'cue1 = Cue("Welcome to AiRA. Monitoring workplace ergonomics and ambient energy.")',
].join('\n');

const LUNG_GAME = [
  'root = Screens([game])',
  'game = Screen([lung_game, actions, cue])',
  'lung_game = LungCapacityGame()',
  'actions = FollowUps(["Done, ready for meeting"])',
  'cue = Cue("Let\'s test your lung capacity. Click start, hold your breath, and click again when you exhale.")',
].join('\n');

const INTERRUPTION = [
  'root = Screens([interrupt])',
  'interrupt = Screen([alert1, posture3, pacer1, followups3, cue3])',
  'alert1 = Alert("warning", "Calendar: Sprint Stand-up in 2 mins")',
  'posture3 = PostureFocus("seated", "#e0f2fe")',
  'pacer1 = BreathingPacer("Box Breathing", 30)',
  'followups3 = FollowUps(["Done, ready for meeting"])',
  'cue3 = Cue("Looks like you have a stand-up meeting shortly. Let\'s skip the standing stretches and finish with one deep breath.")',
].join('\n');

const SUMMARY = [
  'root = Screens([summary])',
  'summary = Screen([title, stat, message, actions, cue])',
  'title = Text("Reset Complete", "title")',
  'stat = Keyword("3", "Minutes Restored")',
  'message = Text("Your neck and eyes are refreshed. You are ready to crush your stand-up.", "description")',
  'actions = FollowUps(["Close Window"])',
  'cue = Cue("Great job, Priya. You are all set. Have a great meeting!")',
].join('\n');

export function mockTurn(request: RequestData, fixture: string): Turn {
  const last = request.messages.at(-1)?.content.trim().toLowerCase() ?? '';

  if (last === 'load wiring sample' || last === '/demo') {
    return {
      reply:
        'Wiring fixture loaded. This is deterministic, not a model interpreting your skill.\n' +
        fence('root = Screens([])') +
        '\n' +
        fence(fixture),
    };
  }

  if (last === 'done, ready for meeting' || last === 'finish' || last === 'finish routine') {
    return {
      reply: 'Session complete.\n' + clearThen(SUMMARY),
    };
  }

  if (last === 'i have a meeting!') {
    return {
      reply:
        'Calendar interruption — scaling down to box breathing.\n' + clearThen(INTERRUPTION),
    };
  }

  if (last === 'test lung capacity') {
    return {
      reply: 'Lung capacity test.\n' + clearThen(LUNG_GAME),
    };
  }

  if (last === 'start breathing exercise') {
    return {
      reply: 'Starting breathing exercise.\n' + clearThen(LUNG_GAME),
    };
  }

  if (last === 'skip to meeting') {
    return {
      reply:
        'Meeting prep bypassed. Good luck on your call!\n' +
        clearThen(
          [
            'root = Screens([s])',
            's = Screen([cue, actions])',
            'cue = Cue("Meeting prep bypassed. Good luck on your call!")',
            'actions = FollowUps(["Reset & Refocus"])',
          ].join('\n'),
        ),
    };
  }

  if (last === 'start' || last === 'reset & refocus') {
    meetingConflictActive = false;
    return {
      reply: 'Welcome to Reset & Refocus.\n' + clearThen(WELCOME),
    };
  }

  const trigger = last;
  if (
    trigger === 'begin mobility routine' ||
    trigger === 'next exercise' ||
    trigger === 'next stretch' ||
    trigger === 'stand up'
  ) {
    if (trigger === 'begin mobility routine' && meetingConflictActive) {
      meetingConflictActive = false;
      return {
        reply:
          'Meeting conflict detected. Routine auto-skipped.\n' +
          fence(
            `root = Screens([s])\ns = Screen([banner, cue, actions])\nbanner = CalendarBanner()\ncue = Cue("Your Sprint Planning meeting starts in 6 minutes. Would you like a 30-second pre-meeting breathing exercise to center your focus?")\nactions = FollowUps(["Start Breathing Exercise", "Skip to Meeting"])`,
          ),
      };
    }
    let nextEx = Math.floor(Math.random() * exercises.length);
    while (nextEx === lastEx) {
      nextEx = Math.floor(Math.random() * exercises.length);
    }
    lastEx = nextEx;
    const ex = exercises[nextEx]!;

    return {
      reply:
        'Loading next exercise.\n' +
        clearThen(
          [
            'root = Screens([s])',
            's = Screen([g, t, a, c])',
            `g = ${ex.g}`,
            `t = Timer("${ex.t}", 60)`,
            'a = FollowUps(["Next Exercise", "Test Lung Capacity", "I have a meeting!"])',
            `c = Cue("${ex.c}")`,
          ].join('\n'),
        ),
    };
  }

  const doc = new ScreenDocument();
  if (request.state.ui_state) doc.apply(fence(request.state.ui_state));
  const screens = doc.screens;
  const index = screens.findIndex((s) => s.key === doc.cursor);

  if (['next', 'back'].includes(last) && screens.length) {
    const target =
      screens[
        Math.max(0, Math.min(screens.length - 1, index + (last === 'back' ? -1 : 1)))
      ];
    return {
      reply:
        'Fixture cursor moved.\n' +
        fence(
          `root = Screens([${screens.map((s) => s.key).join(', ')}], ${target.key})`,
        ),
    };
  }

  if (/^change value to (\d{1,2})$/.test(last) && doc.program.includes('count1 =')) {
    const value = Number(last.match(/\d+/)![0]);
    return {
      reply:
        'Fixture values patched under their existing names.\n' +
        fence(
          serializeStatement('count1', 'Keyword', [String(value), 'Sample value']) +
            '\n' +
            serializeStatement('count2', 'Keyword', [String(value), 'Second sample value']),
        ),
    };
  }

  return {
    reply:
      'Try “start” or “Reset & Refocus”, “Begin Mobility Routine”, “Next Exercise”, “Test Lung Capacity”, “I have a meeting!”, or “Finish Routine”. /demo still loads the wiring fixture.',
  };
}
