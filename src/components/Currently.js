import React, { useState, useEffect } from 'react';
import { BookOpen, Music, Tv, Clock, Gamepad2, Trophy } from 'lucide-react';
import './Currently.css';
import Reveal from './Reveal';

/* ==========================================================================
   EDIT ME
   Everything on this panel comes from the array below. Change a `value`,
   redeploy, done. Keep it to six rows — more starts reading like a diary,
   and a stale entry is worse than no panel at all.
   ========================================================================== */
const ITEMS = [
  {
    Icon: BookOpen,
    label: 'Currently reading',
    value: 'The Lord of the Rings',
    detail: 'J.R.R. Tolkien'
  },
  {
    Icon: Music,
    label: 'On repeat',
    // TODO: swap for the track you wanted
    value: 'Add your song here',
    detail: 'Artist name'
  },
  {
    Icon: Tv,
    label: 'Currently watching',
    value: 'Attack on Titan',
    detail: 'Rewatching, and still not over it'
  },
  {
    Icon: Gamepad2,
    label: 'Currently playing',
    value: 'Valorant',
    detail: 'Played competitively'
  },
  {
    Icon: Trophy,
    label: 'Always supporting',
    // TODO: swap for your teams
    value: 'Add your teams here',
    detail: 'Through everything'
  }
];

/** Where the clock is anchored. */
const TIME_ZONE = 'America/Los_Angeles';
const TIME_LABEL = 'San Jose, CA';

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
});

/** Hour there, used to pick the greeting line. */
const hourIn = (date) =>
  Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TIME_ZONE,
      hour: 'numeric',
      hour12: false
    }).format(date)
  );

const describeHour = (hour) => {
  if (hour < 5) return 'Almost certainly asleep';
  if (hour < 9) return 'Early start';
  if (hour < 12) return 'Deep in it';
  if (hour < 17) return 'Mid-afternoon';
  if (hour < 21) return 'Winding down';
  return 'Probably still shipping';
};

const Currently = () => {
  const [now, setNow] = useState(() => new Date());

  // Tick on the minute rather than every second: the display only shows
  // minutes, so a per-second interval would be 59 wasted renders.
  useEffect(() => {
    let timeoutId;

    const scheduleNextTick = () => {
      const msToNextMinute = 60000 - (Date.now() % 60000);
      timeoutId = setTimeout(() => {
        setNow(new Date());
        scheduleNextTick();
      }, msToNextMinute + 50);
    };

    scheduleNextTick();
    return () => clearTimeout(timeoutId);
  }, []);

  const rows = [
    ...ITEMS.slice(0, 3),
    {
      Icon: Clock,
      label: 'Local time',
      value: timeFormatter.format(now),
      detail: `${TIME_LABEL} · ${describeHour(hourIn(now))}`,
      live: true
    },
    ...ITEMS.slice(3)
  ];

  return (
    <section id="currently" className="currently-section section-shell">
      <div className="section-inner">
        <Reveal animation="up">
          <span className="section-eyebrow">Off the clock</span>
        </Reveal>

        <Reveal animation="up" delay={80}>
          <h2 className="currently-title">
            A little <span className="title-highlight">more about me</span>
          </h2>
        </Reveal>

        <Reveal animation="up" delay={140}>
          <p className="currently-intro">
            The parts a résumé leaves out.
          </p>
        </Reveal>

        <div className="currently-grid">
          {rows.map(({ Icon, label, value, detail, live }, index) => (
            <Reveal
              key={label}
              animation="up"
              delay={index * 70}
              className="currently-card"
            >
              <div className="currently-head">
                <span className="currently-icon">
                  <Icon size={16} strokeWidth={1.9} />
                </span>
                <span className="currently-label">{label}</span>
                {live && <span className="currently-live" aria-hidden="true" />}
              </div>

              <p className="currently-value">{value}</p>
              {detail && <p className="currently-detail">{detail}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Currently;
