import { el, button } from './dom.js';
import type { StatementNode } from '../shared/openui/openui-model.js';
import type { TimerLedger } from '../shared/openui/timer-store.js';
export type Context = { send: (text:string)=>void; timers: TimerLedger; timerAction: (id:string, action:'start'|'pause'|'reset'|'finish')=>void; updates: (()=>void)[]; paused: boolean };
function createStandardGuideContainer(className: string): HTMLElement {
  const n = el('div', '', `block ${className}`);
  n.style.display = 'flex';
  n.style.justifyContent = 'center';
  n.style.alignItems = 'center';
  n.style.position = 'relative';
  n.style.overflow = 'hidden';
  n.style.boxSizing = 'border-box';
  n.style.padding = '12px 16px 24px 16px';
  n.style.minHeight = '320px';
  n.style.width = '100%';
  return n;
}

// Trusted DOM ports of the source component signatures; no model-generated code.
export const renderers: Record<string,(node:StatementNode,context:Context)=>HTMLElement> = {
  Text: ({props:p}) => el(p.variant==='title'?'h3':p.variant==='subtitle'?'h4':'p',String(p.text),'block block-'+String(p.variant??'body')),
  Keyword: ({props:p}) => {const n=el('div','','keyword');n.append(el('strong',String(p.text)));if(p.caption)n.append(el('p',String(p.caption)));return n;},
  Alert: ({props:p}) => el('aside',String(p.text),'block alert'),
  PostureFocus: ({props: p}) => {
    const n = el('div', '', 'block posture-focus');
    n.style.padding = '24px';
    n.style.borderRadius = '12px';
    n.style.backgroundColor = 'var(--card-bg)';
    n.style.border = '1px solid var(--border)';
    n.style.textAlign = 'center';

    const icon = el('div', p.posture === 'seated' ? '🪑' : '🧍', 'posture-icon');
    icon.style.fontSize = '48px';
    icon.style.marginBottom = '12px';

    const label = el('h4', String(p.posture).toUpperCase(), 'posture-label');
    label.style.margin = '0';
    label.style.color = 'var(--text)';
    label.style.letterSpacing = '0.1em';

    n.append(icon, label);
    return n;
  },
  List: ({props:p},c) => {const n=el('ul','','block');for(const row of p.items as StatementNode[])n.append(renderComponent(row,c));return n;},
  ListItem: ({props:p}) => el('li',String(p.text)),
  FollowUps: ({props:p},c) => {const n=el('div','','row');for(const text of p.prompts as string[])n.append(button(text,()=>c.send(text)));return n;},
  NeckRollGuide: () => {
    const n = el('div', '', 'block neck-roll-guide');
    n.style.display = 'flex';
    n.style.justifyContent = 'center';
    n.style.padding = '40px 0';

    const torso = el('div', '', 'neck-roll-torso');
    torso.style.width = '80px';
    torso.style.height = '60px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderTopLeftRadius = '40px';
    torso.style.borderTopRightRadius = '40px';
    torso.style.position = 'relative';
    torso.style.marginTop = '40px';

    const pivot = el('div', '', 'neck-roll-pivot');
    pivot.style.position = 'absolute';
    pivot.style.top = '-40px';
    pivot.style.left = '50%';
    pivot.style.transform = 'translateX(-50%)';
    pivot.style.transformOrigin = 'bottom center';

    const head = el('div', '', 'neck-roll-head');
    head.style.width = '50px';
    head.style.height = '60px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '25px';

    pivot.append(head);
    torso.append(pivot);
    n.append(torso);

    pivot.animate(
      [
        { transform: 'translateX(-50%) rotate(0deg)' },
        { transform: 'translateX(-50%) rotate(30deg)' },
        { transform: 'translateX(-50%) rotate(0deg) scaleY(0.85)' },
        { transform: 'translateX(-50%) rotate(-30deg)' },
        { transform: 'translateX(-50%) rotate(0deg) scaleY(1.05)' },
        { transform: 'translateX(-50%) rotate(0deg)' },
      ],
      { duration: 8000, iterations: Infinity, easing: 'linear' },
    );

    return n;
  },
  StandingGuide: () => {
    const n = el('div', '', 'block standing-guide');
    n.style.display = 'flex';
    n.style.justifyContent = 'center';
    n.style.alignItems = 'center';
    n.style.position = 'relative';
    n.style.overflow = 'hidden';
    n.style.boxSizing = 'border-box';
    n.style.padding = '24px';

    const torso = el('div', '', 'standing-torso');
    torso.style.width = '60px';
    torso.style.height = '100px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'relative';
    torso.style.marginTop = '45px';

    const armStyle = (arm: HTMLElement) => {
      arm.style.position = 'absolute';
      arm.style.width = '20px';
      arm.style.height = '80px';
      arm.style.backgroundColor = '#94a3b8';
      arm.style.borderRadius = '10px';
      arm.style.top = '10px';
      arm.style.transformOrigin = 'top center';
    };

    const leftArm = el('div', '', 'standing-arm-left');
    armStyle(leftArm);
    leftArm.style.left = '-10px';
    leftArm.style.transform = 'rotateZ(20deg)';

    const rightArm = el('div', '', 'standing-arm-right');
    armStyle(rightArm);
    rightArm.style.right = '-10px';
    rightArm.style.transform = 'rotateZ(-20deg)';

    const head = el('div', '', 'standing-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const animOpts: KeyframeAnimationOptions = {
      duration: 6000,
      iterations: Infinity,
      easing: 'ease-in-out',
    };
    leftArm.animate(
      [{ transform: 'rotateZ(20deg)' }, { transform: 'rotateZ(90deg)' }, { transform: 'rotateZ(20deg)' }],
      animOpts,
    );
    rightArm.animate(
      [{ transform: 'rotateZ(-20deg)' }, { transform: 'rotateZ(-90deg)' }, { transform: 'rotateZ(-20deg)' }],
      animOpts,
    );

    torso.append(head, leftArm, rightArm);
    n.append(torso);
    return n;
  },
  ShoulderShrugGuide: () => {
    const n = el('div', '', 'block shoulder-shrug-guide');
    n.style.display = 'flex';
    n.style.justifyContent = 'center';
    n.style.padding = '40px';

    const torso = el('div', '', 'shrug-torso');
    torso.style.width = '60px';
    torso.style.height = '80px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'relative';
    torso.style.marginTop = '45px';

    const head = el('div', '', 'shrug-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const shoulders = el('div', '', 'shrug-shoulders');
    shoulders.style.width = '80px';
    shoulders.style.height = '30px';
    shoulders.style.backgroundColor = '#cbd5e1';
    shoulders.style.position = 'absolute';
    shoulders.style.top = '0';
    shoulders.style.left = '-10px';
    shoulders.style.borderRadius = '15px';

    shoulders.animate(
      [
        { transform: 'translateY(0)' },
        { transform: 'translateY(-15px)' },
        { transform: 'translateY(0)' },
      ],
      { duration: 3000, iterations: Infinity, easing: 'ease-in-out' },
    );

    torso.append(head, shoulders);
    n.append(torso);
    return n;
  },
  TorsoTwistGuide: () => {
    const n = el('div', '', 'block torso-twist-guide');
    n.style.display = 'flex';
    n.style.justifyContent = 'center';
    n.style.padding = '40px';

    const stage = el('div', '', 'twist-stage');
    stage.style.perspective = '400px';
    stage.style.position = 'relative';
    stage.style.marginTop = '45px';

    const torso = el('div', '', 'twist-torso');
    torso.style.width = '60px';
    torso.style.height = '100px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'relative';
    torso.style.transformStyle = 'preserve-3d';

    const head = el('div', '', 'twist-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const arms = el('div', '', 'twist-arms');
    arms.style.width = '90px';
    arms.style.height = '20px';
    arms.style.backgroundColor = '#cbd5e1';
    arms.style.borderRadius = '10px';
    arms.style.position = 'absolute';
    arms.style.top = '30px';
    arms.style.left = '-15px';
    arms.style.zIndex = '10';

    torso.append(arms, head);
    torso.animate(
      [
        { transform: 'rotateY(40deg)' },
        { transform: 'rotateY(-40deg)' },
        { transform: 'rotateY(40deg)' },
      ],
      { duration: 6000, iterations: Infinity, easing: 'ease-in-out' },
    );

    stage.append(torso);
    n.append(stage);
    return n;
  },
  PelvicTiltGuide: () => {
    const n = el('div', '', 'block pelvic-tilt-guide');
    n.style.display = 'flex';
    n.style.justifyContent = 'center';
    n.style.alignItems = 'flex-end';
    n.style.padding = '40px';
    n.style.gap = '4px';

    const body = el('div', '', 'pelvic-body');
    body.style.position = 'relative';
    body.style.width = '70px';
    body.style.height = '120px';

    const head = el('div', '', 'pelvic-head');
    head.style.width = '28px';
    head.style.height = '28px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '0';
    head.style.left = '8px';

    const torso = el('div', '', 'pelvic-torso');
    torso.style.width = '36px';
    torso.style.height = '70px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '18px 8px 12px 20px';
    torso.style.position = 'absolute';
    torso.style.top = '30px';
    torso.style.left = '4px';

    const pelvis = el('div', '', 'pelvic-pelvis');
    pelvis.style.width = '42px';
    pelvis.style.height = '28px';
    pelvis.style.backgroundColor = '#cbd5e1';
    pelvis.style.borderRadius = '10px';
    pelvis.style.position = 'absolute';
    pelvis.style.bottom = '18px';
    pelvis.style.left = '2px';
    pelvis.style.transformOrigin = 'left center';

    const thigh = el('div', '', 'pelvic-thigh');
    thigh.style.width = '50px';
    thigh.style.height = '16px';
    thigh.style.backgroundColor = '#94a3b8';
    thigh.style.borderRadius = '8px';
    thigh.style.position = 'absolute';
    thigh.style.bottom = '8px';
    thigh.style.left = '18px';

    pelvis.animate(
      [
        { transform: 'rotateZ(0deg)' },
        { transform: 'rotateZ(15deg)' },
        { transform: 'rotateZ(0deg)' },
      ],
      { duration: 4000, iterations: Infinity, easing: 'ease-in-out' },
    );

    body.append(head, torso, pelvis, thigh);
    n.append(body);
    return n;
  },
  KneeChestGuide: () => {
    const n = el('div', '', 'block knee-chest-guide');
    n.style.display = 'flex';
    n.style.justifyContent = 'center';
    n.style.alignItems = 'center';
    n.style.position = 'relative';
    n.style.overflow = 'hidden';
    n.style.boxSizing = 'border-box';
    n.style.padding = '24px';

    const torso = el('div', '', 'knee-torso');
    torso.style.width = '60px';
    torso.style.height = '90px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'relative';
    torso.style.marginTop = '45px';

    const head = el('div', '', 'knee-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const leftArm = el('div', '', 'knee-arm-l');
    leftArm.style.width = '14px';
    leftArm.style.height = '55px';
    leftArm.style.backgroundColor = '#cbd5e1';
    leftArm.style.borderRadius = '7px';
    leftArm.style.position = 'absolute';
    leftArm.style.top = '12px';
    leftArm.style.left = '-12px';
    leftArm.style.transformOrigin = 'top center';

    const rightArm = el('div', '', 'knee-arm-r');
    rightArm.style.width = '14px';
    rightArm.style.height = '55px';
    rightArm.style.backgroundColor = '#cbd5e1';
    rightArm.style.borderRadius = '7px';
    rightArm.style.position = 'absolute';
    rightArm.style.top = '12px';
    rightArm.style.right = '-12px';
    rightArm.style.transformOrigin = 'top center';

    const leftLeg = el('div', '', 'knee-left-leg');
    leftLeg.style.width = '18px';
    leftLeg.style.height = '70px';
    leftLeg.style.backgroundColor = '#94a3b8';
    leftLeg.style.borderRadius = '9px';
    leftLeg.style.position = 'absolute';
    leftLeg.style.bottom = '-50px';
    leftLeg.style.left = '8px';

    const rightLeg = el('div', '', 'knee-right-leg');
    rightLeg.style.width = '18px';
    rightLeg.style.height = '70px';
    rightLeg.style.backgroundColor = '#64748b';
    rightLeg.style.borderRadius = '9px';
    rightLeg.style.position = 'absolute';
    rightLeg.style.bottom = '-50px';
    rightLeg.style.right = '8px';
    rightLeg.style.transformOrigin = 'top center';

    const hugOpts: KeyframeAnimationOptions = { duration: 4000, iterations: Infinity, easing: 'ease-in-out' };
    leftArm.animate(
      [{ transform: 'rotate(10deg)' }, { transform: 'rotate(55deg)' }, { transform: 'rotate(10deg)' }],
      hugOpts,
    );
    rightArm.animate(
      [{ transform: 'rotate(-10deg)' }, { transform: 'rotate(-55deg)' }, { transform: 'rotate(-10deg)' }],
      hugOpts,
    );
    rightLeg.animate(
      [
        { transform: 'translateY(0) rotate(0deg)' },
        { transform: 'translateY(-30px) rotate(-20deg)' },
        { transform: 'translateY(0) rotate(0deg)' },
      ],
      hugOpts,
    );

    torso.append(head, leftArm, rightArm, leftLeg, rightLeg);
    n.append(torso);
    return n;
  },
  LegExtensionGuide: () => {
    const n = el('div', '', 'block leg-extension-guide');
    n.style.display = 'flex';
    n.style.justifyContent = 'center';
    n.style.padding = '40px';

    const torso = el('div', '', 'leg-ext-torso');
    torso.style.width = '60px';
    torso.style.height = '90px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'relative';
    torso.style.marginTop = '45px';

    const head = el('div', '', 'leg-ext-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const leftArm = el('div', '', 'leg-ext-arm-l');
    leftArm.style.width = '14px';
    leftArm.style.height = '50px';
    leftArm.style.backgroundColor = '#cbd5e1';
    leftArm.style.borderRadius = '7px';
    leftArm.style.position = 'absolute';
    leftArm.style.top = '14px';
    leftArm.style.left = '-10px';
    leftArm.style.transform = 'rotate(15deg)';

    const rightArm = el('div', '', 'leg-ext-arm-r');
    rightArm.style.width = '14px';
    rightArm.style.height = '50px';
    rightArm.style.backgroundColor = '#cbd5e1';
    rightArm.style.borderRadius = '7px';
    rightArm.style.position = 'absolute';
    rightArm.style.top = '14px';
    rightArm.style.right = '-10px';
    rightArm.style.transform = 'rotate(-15deg)';

    const leftLeg = el('div', '', 'leg-ext-left');
    leftLeg.style.width = '18px';
    leftLeg.style.height = '70px';
    leftLeg.style.backgroundColor = '#94a3b8';
    leftLeg.style.borderRadius = '9px';
    leftLeg.style.position = 'absolute';
    leftLeg.style.bottom = '-50px';
    leftLeg.style.left = '8px';

    const rightLeg = el('div', '', 'leg-ext-right');
    rightLeg.style.width = '18px';
    rightLeg.style.height = '70px';
    rightLeg.style.backgroundColor = '#64748b';
    rightLeg.style.borderRadius = '9px';
    rightLeg.style.position = 'absolute';
    rightLeg.style.bottom = '-50px';
    rightLeg.style.right = '8px';
    rightLeg.style.transformOrigin = 'top center';

    rightLeg.animate(
      [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(-90deg)' },
        { transform: 'rotate(0deg)' },
      ],
      { duration: 4000, iterations: Infinity, easing: 'ease-in-out' },
    );

    torso.append(head, leftArm, rightArm, leftLeg, rightLeg);
    n.append(torso);
    return n;
  },
  FigureFourGuide: () => {
    const n = el('div', '', 'block figure-four-guide');
    n.style.display = 'flex';
    n.style.justifyContent = 'center';
    n.style.alignItems = 'center';
    n.style.position = 'relative';
    n.style.overflow = 'hidden';
    n.style.boxSizing = 'border-box';
    n.style.padding = '24px';

    const torso = el('div', '', 'fig-torso');
    torso.style.width = '60px';
    torso.style.height = '90px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'relative';
    torso.style.marginTop = '45px';

    const head = el('div', '', 'fig-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const leftArm = el('div', '', 'fig-arm-l');
    leftArm.style.width = '14px';
    leftArm.style.height = '50px';
    leftArm.style.backgroundColor = '#cbd5e1';
    leftArm.style.borderRadius = '7px';
    leftArm.style.position = 'absolute';
    leftArm.style.top = '14px';
    leftArm.style.left = '-10px';
    leftArm.style.transform = 'rotate(12deg)';

    const rightArm = el('div', '', 'fig-arm-r');
    rightArm.style.width = '14px';
    rightArm.style.height = '50px';
    rightArm.style.backgroundColor = '#cbd5e1';
    rightArm.style.borderRadius = '7px';
    rightArm.style.position = 'absolute';
    rightArm.style.top = '14px';
    rightArm.style.right = '-10px';
    rightArm.style.transform = 'rotate(-12deg)';

    const leftLeg = el('div', '', 'fig-left-leg');
    leftLeg.style.width = '18px';
    leftLeg.style.height = '70px';
    leftLeg.style.backgroundColor = '#94a3b8';
    leftLeg.style.borderRadius = '9px';
    leftLeg.style.position = 'absolute';
    leftLeg.style.bottom = '-50px';
    leftLeg.style.left = '8px';

    const rightLeg = el('div', '', 'fig-right-leg');
    rightLeg.style.width = '18px';
    rightLeg.style.height = '70px';
    rightLeg.style.backgroundColor = '#64748b';
    rightLeg.style.borderRadius = '9px';
    rightLeg.style.position = 'absolute';
    rightLeg.style.bottom = '-50px';
    rightLeg.style.right = '8px';
    rightLeg.style.transformOrigin = 'top center';

    rightLeg.animate(
      [
        { transform: 'rotate(0deg) translateY(0)' },
        { transform: 'rotate(90deg) translateY(-20px)' },
        { transform: 'rotate(0deg) translateY(0)' },
      ],
      { duration: 5000, iterations: Infinity, easing: 'ease-in-out' },
    );

    torso.append(head, leftArm, rightArm, leftLeg, rightLeg);
    n.append(torso);
    return n;
  },
  HeelToeGuide: () => {
    const n = createStandardGuideContainer('heel-toe-guide');

    const torso = el('div', '', 'heel-toe-torso');
    torso.style.width = '60px';
    torso.style.height = '90px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'relative';
    torso.style.marginTop = '45px';

    const head = el('div', '', 'heel-toe-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const leftArm = el('div', '', 'heel-toe-arm-l');
    leftArm.style.width = '14px';
    leftArm.style.height = '50px';
    leftArm.style.backgroundColor = '#cbd5e1';
    leftArm.style.borderRadius = '7px';
    leftArm.style.position = 'absolute';
    leftArm.style.top = '14px';
    leftArm.style.left = '-10px';
    leftArm.style.transform = 'rotate(12deg)';

    const rightArm = el('div', '', 'heel-toe-arm-r');
    rightArm.style.width = '14px';
    rightArm.style.height = '50px';
    rightArm.style.backgroundColor = '#cbd5e1';
    rightArm.style.borderRadius = '7px';
    rightArm.style.position = 'absolute';
    rightArm.style.top = '14px';
    rightArm.style.right = '-10px';
    rightArm.style.transform = 'rotate(-12deg)';

    const leftLeg = el('div', '', 'heel-toe-leg-l');
    leftLeg.style.width = '18px';
    leftLeg.style.height = '70px';
    leftLeg.style.backgroundColor = '#94a3b8';
    leftLeg.style.borderRadius = '9px';
    leftLeg.style.position = 'absolute';
    leftLeg.style.bottom = '-50px';
    leftLeg.style.left = '8px';

    const rightLeg = el('div', '', 'heel-toe-leg-r');
    rightLeg.style.width = '18px';
    rightLeg.style.height = '70px';
    rightLeg.style.backgroundColor = '#64748b';
    rightLeg.style.borderRadius = '9px';
    rightLeg.style.position = 'absolute';
    rightLeg.style.bottom = '-50px';
    rightLeg.style.right = '8px';
    rightLeg.style.transformOrigin = 'top center';

    rightLeg.animate(
      [
        { transform: 'rotate(-20deg) translateY(0)' },
        { transform: 'rotate(20deg) translateY(-5px)' },
        { transform: 'rotate(-20deg) translateY(0)' },
      ],
      { duration: 3000, iterations: Infinity, easing: 'ease-in-out' },
    );

    torso.append(head, leftArm, rightArm, leftLeg, rightLeg);
    n.append(torso);
    return n;
  },
  HandWristGuide: () => {
    const n = createStandardGuideContainer('hand-wrist-guide');

    const torso = el('div', '', 'hand-torso');
    torso.style.width = '60px';
    torso.style.height = '90px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'relative';
    torso.style.marginTop = '45px';

    const head = el('div', '', 'hand-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const leftArm = el('div', '', 'hand-arm-l');
    leftArm.style.width = '14px';
    leftArm.style.height = '50px';
    leftArm.style.backgroundColor = '#cbd5e1';
    leftArm.style.borderRadius = '7px';
    leftArm.style.position = 'absolute';
    leftArm.style.top = '14px';
    leftArm.style.left = '-10px';
    leftArm.style.transformOrigin = 'top center';

    const rightArm = el('div', '', 'hand-arm-r');
    rightArm.style.width = '14px';
    rightArm.style.height = '50px';
    rightArm.style.backgroundColor = '#cbd5e1';
    rightArm.style.borderRadius = '7px';
    rightArm.style.position = 'absolute';
    rightArm.style.top = '14px';
    rightArm.style.right = '-10px';
    rightArm.style.transformOrigin = 'top center';

    const leftLeg = el('div', '', 'hand-leg-l');
    leftLeg.style.width = '18px';
    leftLeg.style.height = '70px';
    leftLeg.style.backgroundColor = '#94a3b8';
    leftLeg.style.borderRadius = '9px';
    leftLeg.style.position = 'absolute';
    leftLeg.style.bottom = '-50px';
    leftLeg.style.left = '8px';

    const rightLeg = el('div', '', 'hand-leg-r');
    rightLeg.style.width = '18px';
    rightLeg.style.height = '70px';
    rightLeg.style.backgroundColor = '#64748b';
    rightLeg.style.borderRadius = '9px';
    rightLeg.style.position = 'absolute';
    rightLeg.style.bottom = '-50px';
    rightLeg.style.right = '8px';

    const wristAnim: KeyframeAnimationOptions = { duration: 3000, iterations: Infinity, easing: 'ease-in-out' };
    leftArm.animate(
      [{ transform: 'rotate(20deg)' }, { transform: 'rotate(70deg)' }, { transform: 'rotate(20deg)' }],
      wristAnim,
    );
    rightArm.animate(
      [{ transform: 'rotate(-20deg)' }, { transform: 'rotate(-70deg)' }, { transform: 'rotate(-20deg)' }],
      wristAnim,
    );

    torso.append(head, leftArm, rightArm, leftLeg, rightLeg);
    n.append(torso);
    return n;
  },
  SeatedMarchGuide: () => {
    const n = createStandardGuideContainer('seated-march-guide');

    const torso = el('div', '', 'march-torso');
    torso.style.width = '60px';
    torso.style.height = '90px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'relative';
    torso.style.marginTop = '45px';

    const head = el('div', '', 'march-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const leftArm = el('div', '', 'march-arm-l');
    leftArm.style.width = '14px';
    leftArm.style.height = '48px';
    leftArm.style.backgroundColor = '#cbd5e1';
    leftArm.style.borderRadius = '7px';
    leftArm.style.position = 'absolute';
    leftArm.style.top = '14px';
    leftArm.style.left = '-10px';
    leftArm.style.transform = 'rotate(18deg)';

    const rightArm = el('div', '', 'march-arm-r');
    rightArm.style.width = '14px';
    rightArm.style.height = '48px';
    rightArm.style.backgroundColor = '#cbd5e1';
    rightArm.style.borderRadius = '7px';
    rightArm.style.position = 'absolute';
    rightArm.style.top = '14px';
    rightArm.style.right = '-10px';
    rightArm.style.transform = 'rotate(-18deg)';

    const leftLeg = el('div', '', 'march-leg-l');
    leftLeg.style.width = '18px';
    leftLeg.style.height = '60px';
    leftLeg.style.backgroundColor = '#94a3b8';
    leftLeg.style.borderRadius = '9px';
    leftLeg.style.position = 'absolute';
    leftLeg.style.bottom = '-45px';
    leftLeg.style.left = '8px';

    const rightLeg = el('div', '', 'march-leg-r');
    rightLeg.style.width = '18px';
    rightLeg.style.height = '60px';
    rightLeg.style.backgroundColor = '#64748b';
    rightLeg.style.borderRadius = '9px';
    rightLeg.style.position = 'absolute';
    rightLeg.style.bottom = '-45px';
    rightLeg.style.right = '8px';

    leftLeg.animate(
      [{ transform: 'translateY(0)' }, { transform: 'translateY(-20px)' }, { transform: 'translateY(0)' }],
      { duration: 1200, iterations: Infinity, easing: 'ease-in-out' },
    );
    rightLeg.animate(
      [{ transform: 'translateY(-20px)' }, { transform: 'translateY(0)' }, { transform: 'translateY(-20px)' }],
      { duration: 1200, iterations: Infinity, easing: 'ease-in-out' },
    );

    torso.append(head, leftArm, rightArm, leftLeg, rightLeg);
    n.append(torso);
    return n;
  },
  TricepsLatGuide: () => {
    const n = createStandardGuideContainer('triceps-lat-guide');

    const torso = el('div', '', 'tri-torso');
    torso.style.width = '60px';
    torso.style.height = '100px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'relative';
    torso.style.marginTop = '50px';
    torso.style.transformOrigin = 'bottom center';

    const head = el('div', '', 'tri-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const rightArm = el('div', '', 'tri-arm-r');
    rightArm.style.width = '14px';
    rightArm.style.height = '70px';
    rightArm.style.backgroundColor = '#94a3b8';
    rightArm.style.borderRadius = '7px';
    rightArm.style.position = 'absolute';
    rightArm.style.top = '-20px';
    rightArm.style.right = '6px';
    rightArm.style.transformOrigin = 'top center';
    rightArm.style.transform = 'rotate(20deg)';

    const leftArm = el('div', '', 'tri-arm-l');
    leftArm.style.width = '55px';
    leftArm.style.height = '14px';
    leftArm.style.backgroundColor = '#cbd5e1';
    leftArm.style.borderRadius = '7px';
    leftArm.style.position = 'absolute';
    leftArm.style.top = '8px';
    leftArm.style.left = '-8px';
    leftArm.style.transform = 'rotate(-25deg)';

    torso.animate(
      [
        { transform: 'rotateZ(0deg)' },
        { transform: 'rotateZ(8deg)' },
        { transform: 'rotateZ(0deg)' },
      ],
      { duration: 4000, iterations: Infinity, easing: 'ease-in-out' },
    );

    torso.append(head, rightArm, leftArm);
    n.append(torso);
    return n;
  },
  RhomboidPressGuide: () => {
    const n = createStandardGuideContainer('rhomboid-press-guide');

    const stage = el('div', '', 'rhomboid-stage');
    stage.style.position = 'relative';
    stage.style.marginTop = '50px';
    stage.style.width = '60px';
    stage.style.height = '100px';

    const torso = el('div', '', 'rhomboid-torso');
    torso.style.width = '60px';
    torso.style.height = '100px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'absolute';
    torso.style.transformOrigin = 'bottom center';

    const head = el('div', '', 'rhomboid-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const arms = el('div', '', 'rhomboid-arms');
    arms.style.width = '90px';
    arms.style.height = '16px';
    arms.style.backgroundColor = '#cbd5e1';
    arms.style.borderRadius = '8px';
    arms.style.position = 'absolute';
    arms.style.top = '28px';
    arms.style.left = '-15px';

    const hands = el('div', '', 'rhomboid-hands');
    hands.style.width = '22px';
    hands.style.height = '22px';
    hands.style.backgroundColor = '#94a3b8';
    hands.style.borderRadius = '50%';
    hands.style.position = 'absolute';
    hands.style.top = '24px';
    hands.style.left = '50%';
    hands.style.transform = 'translateX(-50%)';

    torso.animate(
      [
        { transform: 'scaleY(1) translateY(0)' },
        { transform: 'scaleY(0.92) translateY(6px)' },
        { transform: 'scaleY(1) translateY(0)' },
      ],
      { duration: 4000, iterations: Infinity, easing: 'ease-in-out' },
    );
    head.animate(
      [
        { transform: 'translateX(-50%) translateY(0)' },
        { transform: 'translateX(-50%) translateY(8px)' },
        { transform: 'translateX(-50%) translateY(0)' },
      ],
      { duration: 4000, iterations: Infinity, easing: 'ease-in-out' },
    );

    torso.append(head, arms, hands);
    stage.append(torso);
    n.append(stage);
    return n;
  },
  OverheadSideBendGuide: () => {
    const n = createStandardGuideContainer('overhead-side-bend-guide');

    const torso = el('div', '', 'osb-torso');
    torso.style.width = '60px';
    torso.style.height = '100px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'relative';
    torso.style.marginTop = '95px';
    torso.style.transformOrigin = 'bottom center';

    const head = el('div', '', 'osb-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const arms = el('div', '', 'osb-arms');
    arms.style.width = '18px';
    arms.style.height = '70px';
    arms.style.backgroundColor = '#cbd5e1';
    arms.style.borderRadius = '9px';
    arms.style.position = 'absolute';
    arms.style.top = '-70px';
    arms.style.left = '21px';

    const hands = el('div', '', 'osb-hands');
    hands.style.width = '24px';
    hands.style.height = '24px';
    hands.style.backgroundColor = '#94a3b8';
    hands.style.borderRadius = '50%';
    hands.style.position = 'absolute';
    hands.style.top = '-88px';
    hands.style.left = '18px';

    torso.animate(
      [
        { transform: 'rotateZ(0deg)' },
        { transform: 'rotateZ(15deg)' },
        { transform: 'rotateZ(0deg)' },
        { transform: 'rotateZ(-15deg)' },
        { transform: 'rotateZ(0deg)' },
      ],
      { duration: 6000, iterations: Infinity, easing: 'ease-in-out' },
    );

    torso.append(arms, hands, head);
    n.append(torso);
    return n;
  },
  AnklePumpGuide: () => {
    const n = createStandardGuideContainer('ankle-pump-guide');

    const torso = el('div', '', 'ankle-torso');
    torso.style.width = '60px';
    torso.style.height = '90px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'relative';
    torso.style.marginTop = '45px';

    const head = el('div', '', 'ankle-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const leftArm = el('div', '', 'ankle-arm-l');
    leftArm.style.width = '14px';
    leftArm.style.height = '50px';
    leftArm.style.backgroundColor = '#cbd5e1';
    leftArm.style.borderRadius = '7px';
    leftArm.style.position = 'absolute';
    leftArm.style.top = '14px';
    leftArm.style.left = '-10px';
    leftArm.style.transform = 'rotate(12deg)';

    const rightArm = el('div', '', 'ankle-arm-r');
    rightArm.style.width = '14px';
    rightArm.style.height = '50px';
    rightArm.style.backgroundColor = '#cbd5e1';
    rightArm.style.borderRadius = '7px';
    rightArm.style.position = 'absolute';
    rightArm.style.top = '14px';
    rightArm.style.right = '-10px';
    rightArm.style.transform = 'rotate(-12deg)';

    const leftLeg = el('div', '', 'ankle-leg-l');
    leftLeg.style.width = '18px';
    leftLeg.style.height = '70px';
    leftLeg.style.backgroundColor = '#94a3b8';
    leftLeg.style.borderRadius = '9px';
    leftLeg.style.position = 'absolute';
    leftLeg.style.bottom = '-50px';
    leftLeg.style.left = '8px';

    const rightLeg = el('div', '', 'ankle-leg-r');
    rightLeg.style.width = '18px';
    rightLeg.style.height = '70px';
    rightLeg.style.backgroundColor = '#64748b';
    rightLeg.style.borderRadius = '9px';
    rightLeg.style.position = 'absolute';
    rightLeg.style.bottom = '-50px';
    rightLeg.style.right = '8px';
    rightLeg.style.transformOrigin = 'top center';

    rightLeg.animate(
      [
        { transform: 'translateY(0) scaleY(1)' },
        { transform: 'translateY(-18px) scaleY(0.9)' },
        { transform: 'translateY(0) scaleY(1)' },
      ],
      { duration: 2500, iterations: Infinity, easing: 'ease-in-out' },
    );

    torso.append(head, leftArm, rightArm, leftLeg, rightLeg);
    n.append(torso);
    return n;
  },
  AnkleCircleGuide: () => {
    const n = createStandardGuideContainer('ankle-circle-guide');

    const torso = el('div', '', 'ankle-circ-torso');
    torso.style.width = '60px';
    torso.style.height = '90px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'relative';
    torso.style.marginTop = '45px';

    const head = el('div', '', 'ankle-circ-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const leftArm = el('div', '', 'ankle-circ-arm-l');
    leftArm.style.width = '14px';
    leftArm.style.height = '50px';
    leftArm.style.backgroundColor = '#cbd5e1';
    leftArm.style.borderRadius = '7px';
    leftArm.style.position = 'absolute';
    leftArm.style.top = '14px';
    leftArm.style.left = '-10px';
    leftArm.style.transform = 'rotate(12deg)';

    const rightArm = el('div', '', 'ankle-circ-arm-r');
    rightArm.style.width = '14px';
    rightArm.style.height = '50px';
    rightArm.style.backgroundColor = '#cbd5e1';
    rightArm.style.borderRadius = '7px';
    rightArm.style.position = 'absolute';
    rightArm.style.top = '14px';
    rightArm.style.right = '-10px';
    rightArm.style.transform = 'rotate(-12deg)';

    const leftLeg = el('div', '', 'ankle-circ-leg-l');
    leftLeg.style.width = '18px';
    leftLeg.style.height = '70px';
    leftLeg.style.backgroundColor = '#94a3b8';
    leftLeg.style.borderRadius = '9px';
    leftLeg.style.position = 'absolute';
    leftLeg.style.bottom = '-50px';
    leftLeg.style.left = '8px';

    const rightLeg = el('div', '', 'ankle-circ-leg-r');
    rightLeg.style.width = '18px';
    rightLeg.style.height = '70px';
    rightLeg.style.backgroundColor = '#64748b';
    rightLeg.style.borderRadius = '9px';
    rightLeg.style.position = 'absolute';
    rightLeg.style.bottom = '-50px';
    rightLeg.style.right = '8px';
    rightLeg.style.transformOrigin = 'top center';

    rightLeg.animate(
      [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(360deg)' },
      ],
      { duration: 3000, iterations: Infinity, easing: 'linear' },
    );

    torso.append(head, leftArm, rightArm, leftLeg, rightLeg);
    n.append(torso);
    return n;
  },
  ToeTapGuide: () => {
    const n = createStandardGuideContainer('toe-tap-guide');

    const torso = el('div', '', 'toe-torso');
    torso.style.width = '60px';
    torso.style.height = '90px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '30px';
    torso.style.position = 'relative';
    torso.style.marginTop = '45px';

    const head = el('div', '', 'toe-head');
    head.style.width = '40px';
    head.style.height = '40px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '-45px';
    head.style.left = '50%';
    head.style.transform = 'translateX(-50%)';

    const leftArm = el('div', '', 'toe-arm-l');
    leftArm.style.width = '14px';
    leftArm.style.height = '50px';
    leftArm.style.backgroundColor = '#cbd5e1';
    leftArm.style.borderRadius = '7px';
    leftArm.style.position = 'absolute';
    leftArm.style.top = '14px';
    leftArm.style.left = '-10px';
    leftArm.style.transform = 'rotate(12deg)';

    const rightArm = el('div', '', 'toe-arm-r');
    rightArm.style.width = '14px';
    rightArm.style.height = '50px';
    rightArm.style.backgroundColor = '#cbd5e1';
    rightArm.style.borderRadius = '7px';
    rightArm.style.position = 'absolute';
    rightArm.style.top = '14px';
    rightArm.style.right = '-10px';
    rightArm.style.transform = 'rotate(-12deg)';

    const leftLeg = el('div', '', 'toe-leg-l');
    leftLeg.style.width = '18px';
    leftLeg.style.height = '70px';
    leftLeg.style.backgroundColor = '#94a3b8';
    leftLeg.style.borderRadius = '9px';
    leftLeg.style.position = 'absolute';
    leftLeg.style.bottom = '-50px';
    leftLeg.style.left = '8px';

    const rightLeg = el('div', '', 'toe-leg-r');
    rightLeg.style.width = '18px';
    rightLeg.style.height = '70px';
    rightLeg.style.backgroundColor = '#64748b';
    rightLeg.style.borderRadius = '9px';
    rightLeg.style.position = 'absolute';
    rightLeg.style.bottom = '-50px';
    rightLeg.style.right = '8px';
    rightLeg.style.transformOrigin = 'top center';

    rightLeg.animate(
      [
        { transform: 'rotate(0deg) translateY(0)' },
        { transform: 'rotate(-25deg) translateY(-8px)' },
        { transform: 'rotate(0deg) translateY(0)' },
      ],
      { duration: 600, iterations: Infinity, easing: 'ease-in-out' },
    );

    torso.append(head, leftArm, rightArm, leftLeg, rightLeg);
    n.append(torso);
    return n;
  },
  DeskPushUpGuide: () => {
    const n = createStandardGuideContainer('desk-pushup-guide');

    const body = el('div', '', 'desk-push-body');
    body.style.position = 'relative';
    body.style.width = '140px';
    body.style.height = '80px';
    body.style.transformOrigin = 'right bottom';
    body.style.transform = 'rotate(-35deg)';

    const torso = el('div', '', 'desk-push-torso');
    torso.style.width = '90px';
    torso.style.height = '28px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '14px';
    torso.style.position = 'absolute';
    torso.style.left = '10px';
    torso.style.top = '20px';

    const head = el('div', '', 'desk-push-head');
    head.style.width = '24px';
    head.style.height = '24px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.left = '0';
    head.style.top = '18px';

    const arm = el('div', '', 'desk-push-arm');
    arm.style.width = '14px';
    arm.style.height = '40px';
    arm.style.backgroundColor = '#cbd5e1';
    arm.style.borderRadius = '7px';
    arm.style.position = 'absolute';
    arm.style.left = '35px';
    arm.style.top = '38px';

    const hand = el('div', '', 'desk-push-hand');
    hand.style.width = '12px';
    hand.style.height = '12px';
    hand.style.backgroundColor = '#94a3b8';
    hand.style.borderRadius = '50%';
    hand.style.position = 'absolute';
    hand.style.bottom = '-6px';
    hand.style.left = '1px';
    arm.append(hand);

    const leg = el('div', '', 'desk-push-leg');
    leg.style.width = '70px';
    leg.style.height = '16px';
    leg.style.backgroundColor = '#94a3b8';
    leg.style.borderRadius = '8px';
    leg.style.position = 'absolute';
    leg.style.right = '0';
    leg.style.top = '28px';

    body.animate(
      [
        { transform: 'rotate(-35deg) translateY(0)' },
        { transform: 'rotate(-45deg) translateY(12px)' },
        { transform: 'rotate(-35deg) translateY(0)' },
      ],
      { duration: 2800, iterations: Infinity, easing: 'ease-in-out' },
    );

    body.append(head, torso, arm, leg);
    n.append(body);
    return n;
  },
  ChairSquatGuide: () => {
    const n = createStandardGuideContainer('chair-squat-guide');

    const figure = el('div', '', 'squat-figure');
    figure.style.position = 'relative';
    figure.style.width = '100px';
    figure.style.height = '150px';
    figure.style.marginTop = '20px';

    const torso = el('div', '', 'squat-torso');
    torso.style.width = '50px';
    torso.style.height = '70px';
    torso.style.backgroundColor = '#e2e8f0';
    torso.style.borderRadius = '25px';
    torso.style.position = 'absolute';
    torso.style.top = '40px';
    torso.style.left = '25px';

    const head = el('div', '', 'squat-head');
    head.style.width = '36px';
    head.style.height = '36px';
    head.style.backgroundColor = '#94a3b8';
    head.style.borderRadius = '50%';
    head.style.position = 'absolute';
    head.style.top = '0';
    head.style.left = '32px';

    const leftArm = el('div', '', 'squat-arm-l');
    leftArm.style.width = '14px';
    leftArm.style.height = '48px';
    leftArm.style.backgroundColor = '#cbd5e1';
    leftArm.style.borderRadius = '7px';
    leftArm.style.position = 'absolute';
    leftArm.style.top = '48px';
    leftArm.style.left = '12px';
    leftArm.style.transformOrigin = 'top center';

    const leftHand = el('div', '', 'squat-hand-l');
    leftHand.style.width = '12px';
    leftHand.style.height = '12px';
    leftHand.style.backgroundColor = '#94a3b8';
    leftHand.style.borderRadius = '50%';
    leftHand.style.position = 'absolute';
    leftHand.style.bottom = '-6px';
    leftHand.style.left = '1px';
    leftArm.append(leftHand);

    const rightArm = el('div', '', 'squat-arm-r');
    rightArm.style.width = '14px';
    rightArm.style.height = '48px';
    rightArm.style.backgroundColor = '#cbd5e1';
    rightArm.style.borderRadius = '7px';
    rightArm.style.position = 'absolute';
    rightArm.style.top = '48px';
    rightArm.style.right = '12px';
    rightArm.style.transformOrigin = 'top center';

    const rightHand = el('div', '', 'squat-hand-r');
    rightHand.style.width = '12px';
    rightHand.style.height = '12px';
    rightHand.style.backgroundColor = '#94a3b8';
    rightHand.style.borderRadius = '50%';
    rightHand.style.position = 'absolute';
    rightHand.style.bottom = '-6px';
    rightHand.style.right = '1px';
    rightArm.append(rightHand);

    const leftLeg = el('div', '', 'squat-leg-l');
    leftLeg.style.width = '18px';
    leftLeg.style.height = '55px';
    leftLeg.style.backgroundColor = '#94a3b8';
    leftLeg.style.borderRadius = '9px';
    leftLeg.style.position = 'absolute';
    leftLeg.style.bottom = '0';
    leftLeg.style.left = '24px';
    leftLeg.style.transformOrigin = 'top center';

    const rightLeg = el('div', '', 'squat-leg-r');
    rightLeg.style.width = '18px';
    rightLeg.style.height = '55px';
    rightLeg.style.backgroundColor = '#64748b';
    rightLeg.style.borderRadius = '9px';
    rightLeg.style.position = 'absolute';
    rightLeg.style.bottom = '0';
    rightLeg.style.right = '24px';
    rightLeg.style.transformOrigin = 'top center';

    const squatOpts: KeyframeAnimationOptions = { duration: 3500, iterations: Infinity, easing: 'ease-in-out' };
    torso.animate(
      [
        { transform: 'translateY(0)' },
        { transform: 'translateY(28px)' },
        { transform: 'translateY(0)' },
      ],
      squatOpts,
    );
    head.animate(
      [
        { transform: 'translateY(0)' },
        { transform: 'translateY(28px)' },
        { transform: 'translateY(0)' },
      ],
      squatOpts,
    );
    leftLeg.animate(
      [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(28deg)' },
        { transform: 'rotate(0deg)' },
      ],
      squatOpts,
    );
    rightLeg.animate(
      [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(-28deg)' },
        { transform: 'rotate(0deg)' },
      ],
      squatOpts,
    );
    leftArm.animate(
      [
        { transform: 'rotate(15deg) translateY(0)' },
        { transform: 'rotate(-75deg) translateY(24px)' },
        { transform: 'rotate(15deg) translateY(0)' },
      ],
      squatOpts,
    );
    rightArm.animate(
      [
        { transform: 'rotate(-15deg) translateY(0)' },
        { transform: 'rotate(75deg) translateY(24px)' },
        { transform: 'rotate(-15deg) translateY(0)' },
      ],
      squatOpts,
    );

    figure.append(head, torso, leftArm, rightArm, leftLeg, rightLeg);
    n.append(figure);
    return n;
  },
  LungCapacityGame: () => {
    const n = el('div', '', 'block lung-capacity-game');
    n.style.display = 'flex';
    n.style.flexDirection = 'column';
    n.style.alignItems = 'center';
    n.style.gap = '24px';
    n.style.padding = '20px 0';

    const track = el('div', '', 'lung-track');
    track.style.width = '260px';
    track.style.height = '260px';
    track.style.borderRadius = '50%';
    track.style.border = '4px solid #27272a';
    track.style.backgroundColor = '#09090b';
    track.style.position = 'relative';
    track.style.boxSizing = 'border-box';

    const spinner = el('div', '', 'lung-spinner');
    spinner.style.width = '100%';
    spinner.style.height = '100%';
    spinner.style.position = 'absolute';
    spinner.style.top = '0';
    spinner.style.left = '0';
    spinner.style.borderRadius = '50%';

    const dot = el('div', '', 'lung-dot');
    dot.style.width = '20px';
    dot.style.height = '20px';
    dot.style.backgroundColor = '#ef4444';
    dot.style.borderRadius = '50%';
    dot.style.position = 'absolute';
    dot.style.top = '-12px';
    dot.style.left = 'calc(50% - 10px)';
    spinner.append(dot);

    const center = el('div', '', 'lung-center');
    center.style.position = 'absolute';
    center.style.top = '50%';
    center.style.left = '50%';
    center.style.transform = 'translate(-50%, -50%)';
    center.style.display = 'flex';
    center.style.flexDirection = 'column';
    center.style.alignItems = 'center';

    const timeText = el('div', '0.0s', 'lung-time');
    timeText.style.fontSize = '40px';
    timeText.style.fontWeight = '700';
    timeText.style.color = '#f4f4f5';
    timeText.style.fontVariantNumeric = 'tabular-nums';

    const phaseText = el('div', 'READY', 'lung-phase');
    phaseText.style.fontSize = '20px';
    phaseText.style.fontWeight = '700';
    phaseText.style.textTransform = 'uppercase';
    phaseText.style.color = '#10b981';

    const rankText = el('div', '', 'lung-rank');
    rankText.style.fontSize = '14px';
    rankText.style.fontWeight = '700';
    rankText.style.textTransform = 'uppercase';
    rankText.style.color = '#a1a1aa';

    center.append(timeText, phaseText, rankText);
    track.append(spinner, center);

    const action = el('button', 'Start Test', 'primary');
    action.type = 'button';
    action.style.minHeight = '44px';
    action.style.padding = '10px 15px';

    let currentState = 0;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let startedAt = 0;
    let holdTime = 0;

    const resetToIdle = () => {
      currentState = 0;
      holdTime = 0;
      if (intervalId !== undefined) clearInterval(intervalId);
      intervalId = undefined;
      timeText.textContent = '0.0s';
      phaseText.textContent = 'READY';
      rankText.innerText = '';
      rankText.style.color = '#a1a1aa';
      spinner.style.transform = 'rotate(0deg)';
      action.textContent = 'Start Test';
      action.disabled = false;
    };

    action.onclick = () => {
      if (currentState === 0) {
        currentState = 1;
        startedAt = Date.now();
        action.disabled = true;
        intervalId = setInterval(() => {
          const elapsed = Date.now() - startedAt;
          if (elapsed <= 8000) {
            currentState = 1;
            phaseText.textContent = 'INHALE';
            timeText.textContent = (elapsed / 1000).toFixed(1) + 's';
            action.disabled = true;
            spinner.style.transform = 'rotate(' + ((elapsed / 8000) * 120) + 'deg)';
            return;
          }
          currentState = 2;
          holdTime = elapsed - 8000;
          phaseText.textContent = 'HOLD!';
          timeText.textContent = (holdTime / 1000).toFixed(1) + 's';
          action.disabled = false;
          action.textContent = 'Click to Exhale';
          spinner.style.transform = 'rotate(' + (120 + ((holdTime / 60000) * 240)) + 'deg)';
        }, 50);
        return;
      }
      if (currentState === 2) {
        if (intervalId !== undefined) clearInterval(intervalId);
        intervalId = undefined;
        currentState = 3;
        phaseText.textContent = 'EXHALE';
        const healthPct = Math.min(Math.round((holdTime / 60000) * 100), 100);
        rankText.innerText = healthPct + '% HEALTHY';
        rankText.style.color = '#10b981';
        action.textContent = 'Try Again';
        action.disabled = false;
        return;
      }
      if (currentState === 3) {
        resetToIdle();
      }
    };

    n.append(track, action);
    return n;
  },
  BreathingPacer: ({props:p}) => {
    const n = el('div', '', 'block breathing-pacer');
    n.style.display = 'flex';
    n.style.flexDirection = 'column';
    n.style.alignItems = 'center';
    n.style.gap = '16px';
    n.style.padding = '20px 0';

    const circle = el('div', '', 'breathing-circle');
    circle.style.width = '110px';
    circle.style.height = '110px';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
    circle.style.border = '3px solid #3b82f6';
    circle.style.boxShadow = '0 0 24px rgba(59, 130, 246, 0.35)';

    circle.animate(
      [
        { transform: 'scale(0.85)', opacity: 0.7 },
        { transform: 'scale(1.25)', opacity: 1 },
        { transform: 'scale(0.85)', opacity: 0.7 },
      ],
      { duration: 8000, iterations: Infinity, easing: 'ease-in-out' },
    );

    const label = el('p', String(p.label), 'breathing-label');
    label.style.margin = '0';
    label.style.fontWeight = '600';
    label.style.color = '#f4f4f5';

    n.append(circle, label);
    return n;
  },
  CalendarBanner: () => {
    const banner = el('div', '', 'calendar-banner');
    banner.style.display = 'flex';
    banner.style.alignItems = 'center';
    banner.style.justifyContent = 'space-between';
    banner.style.padding = '12px 20px';
    banner.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    banner.style.border = '1px solid #3b82f6';
    banner.style.borderRadius = '12px';
    banner.style.marginBottom = '16px';
    banner.style.width = '100%';
    banner.style.boxSizing = 'border-box';

    const info = el('div', '', 'banner-info');
    info.style.display = 'flex';
    info.style.flexDirection = 'column';
    info.style.gap = '2px';

    const title = el('strong', '📅 Next: Sprint Planning in 6 mins', 'banner-title');
    title.style.fontSize = '13px';
    title.style.color = '#3b82f6';

    const sub = el('span', 'Calendar sync active. Pre-meeting hype flow ready.', 'banner-sub');
    sub.style.fontSize = '11px';
    sub.style.color = '#a1a1aa';

    info.append(title, sub);
    banner.append(info);
    return banner;
  },
  AudioCoachToggle: ({props: p}) => {
    let active = Boolean(p?.active);
    const buttonEl = el('button', active ? '🎙️ Audio Coach: ON' : '🎙️ Audio Coach: OFF', 'audio-coach-toggle');
    buttonEl.type = 'button';
    buttonEl.style.display = 'inline-flex';
    buttonEl.style.alignItems = 'center';
    buttonEl.style.justifyContent = 'center';
    buttonEl.style.padding = '8px 16px';
    buttonEl.style.borderRadius = '9999px';
    buttonEl.style.fontSize = '13px';
    buttonEl.style.fontWeight = '600';
    buttonEl.style.cursor = 'pointer';
    buttonEl.style.border = '1px solid';
    buttonEl.style.transition = 'all 0.2s ease';

    const updateStyle = () => {
      if (active) {
        buttonEl.textContent = '🎙️ Audio Coach: ON';
        buttonEl.style.backgroundColor = '#10b981';
        buttonEl.style.color = '#ffffff';
        buttonEl.style.borderColor = '#059669';
        buttonEl.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.4)';
      } else {
        buttonEl.textContent = '🎙️ Audio Coach: OFF';
        buttonEl.style.backgroundColor = '#18181b';
        buttonEl.style.color = '#a1a1aa';
        buttonEl.style.borderColor = '#27272a';
        buttonEl.style.boxShadow = 'none';
      }
    };

    updateStyle();

    buttonEl.onclick = () => {
      active = !active;
      updateStyle();
    };

    return buttonEl;
  },
  ThemeToggle: ({props: p}) => {
    let isDark = document.body.classList.contains('theme-dark');
    if (typeof p?.mode === 'string') {
      isDark = (p.mode === 'dark');
      if (isDark) document.body.classList.add('theme-dark');
      else document.body.classList.remove('theme-dark');
    }

    const buttonEl = el('button', isDark ? '🌙 Dark Mode' : '☀️ Light Mode', 'theme-toggle');
    buttonEl.type = 'button';
    buttonEl.style.display = 'inline-flex';
    buttonEl.style.alignItems = 'center';
    buttonEl.style.justifyContent = 'center';
    buttonEl.style.padding = '8px 16px';
    buttonEl.style.borderRadius = '9999px';
    buttonEl.style.fontSize = '13px';
    buttonEl.style.fontWeight = '600';
    buttonEl.style.cursor = 'pointer';
    buttonEl.style.border = '1px solid';
    buttonEl.style.transition = 'all 0.2s ease';
    buttonEl.style.marginLeft = '8px';

    const syncAll = (dark: boolean) => {
      if (dark) document.body.classList.add('theme-dark');
      else document.body.classList.remove('theme-dark');
      const toggles = document.querySelectorAll<HTMLButtonElement>('.theme-toggle');
      toggles.forEach(btn => {
        if (dark) {
          btn.textContent = '🌙 Dark Mode';
          btn.style.backgroundColor = '#18181b';
          btn.style.color = '#f4f4f5';
          btn.style.borderColor = '#27272a';
          btn.style.boxShadow = '0 0 12px rgba(0, 0, 0, 0.3)';
        } else {
          btn.textContent = '☀️ Light Mode';
          btn.style.backgroundColor = '#ffffff';
          btn.style.color = '#1c1917';
          btn.style.borderColor = '#d6d3d1';
          btn.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
      });
    };

    syncAll(isDark);

    buttonEl.onclick = () => {
      isDark = !document.body.classList.contains('theme-dark');
      syncAll(isDark);
    };

    return buttonEl;
  },
  EnergyMeter: () => {
    const container = el('div', '', 'energy-meter-container');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '12px';
    container.style.padding = '8px 16px';
    container.style.backgroundColor = '#18181b';
    container.style.borderRadius = '20px';
    container.style.border = '1px solid #27272a';
    container.style.width = 'fit-content';
    container.style.margin = '0 auto 16px auto';

    const label = el('span', 'Cognitive Load: Fresh', 'energy-label');
    label.style.fontSize = '12px';
    label.style.fontWeight = '600';
    label.style.color = '#10b981';

    const barBg = el('div', '', 'energy-bar-bg');
    barBg.style.width = '120px';
    barBg.style.height = '8px';
    barBg.style.backgroundColor = '#27272a';
    barBg.style.borderRadius = '4px';
    barBg.style.overflow = 'hidden';
    barBg.style.position = 'relative';

    const barFill = el('div', '', 'energy-bar-fill');
    barFill.style.width = '25%';
    barFill.style.height = '100%';
    barFill.style.backgroundColor = '#10b981';
    barFill.style.borderRadius = '4px';
    barFill.style.transition = 'width 0.5s ease, background-color 0.5s ease';

    barBg.append(barFill);
    container.append(barBg, label);

    let load = 25;
    setInterval(() => {
      load += 5;
      if (load > 100) load = 100;
      barFill.style.width = load + '%';

      if (load < 50) {
        barFill.style.backgroundColor = '#10b981';
        label.style.color = '#10b981';
        label.innerText = 'Cognitive Load: Fresh';
      } else if (load < 80) {
        barFill.style.backgroundColor = '#f59e0b';
        label.style.color = '#f59e0b';
        label.innerText = 'Cognitive Load: Focus Fatigue';
      } else {
        barFill.style.backgroundColor = '#ef4444';
        label.style.color = '#ef4444';
        label.innerText = 'Burnout Risk: Stretch Now!';
      }
    }, 10000);

    return container;
  },
  Timer: ({key,props:p},c) => {
    const n=el('section','','timer');n.setAttribute('aria-label',String(p.label));
    n.append(el('p','SIMULATED TIMER · LOCAL ONLY','eyebrow'),el('h3',String(p.label)));
    const value=el('strong'),status=el('span','','micro timer-status'),row=el('div','','row');
    const start=button('Start simulation',()=>c.timerAction(key,'start')),pause=button('Pause timer',()=>c.timerAction(key,'pause')),reset=button('Reset timer',()=>c.timerAction(key,'reset')),finish=button('Simulate finish',()=>c.timerAction(key,'finish'));
    row.append(start,pause,reset,finish);n.append(value,status,row,el('p','Finishing records a local timer event.','micro'));
    const update=()=>{const entry=c.timers.list().find(t=>t.id===key);if(!entry)return;const seconds=Math.ceil(entry.remaining);value.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;status.textContent=entry.status;start.hidden=entry.status==='running'||entry.status==='paused';start.textContent=entry.status==='done'?'Restart simulation':'Start simulation';pause.hidden=entry.status==='stopped'||entry.status==='done';pause.textContent=entry.status==='paused'?'Resume timer':'Pause timer';for(const b of [start,pause,reset,finish])b.disabled=c.paused;};
    c.updates.push(update);update();return n;
  },
};
export function renderComponent(node:StatementNode,context:Context):HTMLElement {
  if(!Object.hasOwn(renderers,node.name))throw new Error('No renderer for '+node.name);
  const n=renderers[node.name](node,context);n.dataset.statement=node.key;
  if(typeof node.props.color==='string' && /^#[0-9a-fA-F]{6}$/.test(node.props.color))n.style.color=node.props.color;
  if(node.name.endsWith('Guide') || node.name === 'LungCapacityGame' || node.name === 'BreathingPacer') {
    n.style.transform = 'translateY(-16px)';
  }
  return n;
}

