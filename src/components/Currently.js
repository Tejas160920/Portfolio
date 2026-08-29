import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, Music, Tv, Gamepad2, Trophy, Sun, Moon, Play, X } from 'lucide-react';
import './Currently.css';
import Reveal from './Reveal';

/* ==========================================================================
   EDIT ME
   Swap a title, detail or image and the card updates. Artwork lives in
   public/currently/. Keep this short — a stale entry reads worse than none.
   ========================================================================== */
const MEDIA = {
  anime: {
    Icon: Tv,
    label: 'Currently watching',
    title: 'Attack on Titan',
    detail: 'Rewatching, still not over it',
    image: '/currently/anime.jpg',
    // The subject sits high in this poster
    focus: '50% 30%',
    span: 'tall'
  },
  album: {
    Icon: Music,
    label: 'On repeat',
    title: 'My Dear Melancholy,',
    detail: 'The Weeknd',
    image: '/currently/album.jpg',
    focus: '50% 55%',
    span: 'normal'
  },
  book: {
    Icon: BookOpen,
    label: 'Currently reading',
    title: 'The Lord of the Rings',
    detail: 'J.R.R. Tolkien',
    image: '/currently/book.webp',
    focus: '50% 40%',
    span: 'normal'
  },
  game: {
    Icon: Gamepad2,
    label: 'Currently playing',
    title: 'Valorant',
    detail: 'Played competitively',
    image: '/currently/game.webp',
    focus: '50% 50%',
    span: 'wide',
    action: 'Play together',
    video: '/currently/valorant-hover.mp4'
  }
};

/* Left to right, with Paper Rex centred as the lead. */
const TEAMS = [
  { name: 'Buffalo Bills', image: '/currently/team-bills.png' },
  { name: 'Paper Rex', image: '/currently/team-prx.png', lead: true },
  { name: 'India', image: '/currently/team-india.png' }
];

const TIME_ZONE = 'America/Los_Angeles';

const timeParts = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
});

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

/** Split "10:42 AM" so the meridiem can be styled down. */
const splitTime = (date) => {
  const parts = timeParts.formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
  return {
    clock: `${get('hour')}:${get('minute')}`,
    meridiem: get('dayPeriod')
  };
};

const MediaCard = ({ item, delay, onAction }) => {
  const { Icon, label, title, detail, image, focus, span, action } = item;

  return (
    <Reveal animation="up" delay={delay} className={`cur-card cur-media span-${span}`}>
      <img
        className="cur-art"
        src={image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        style={{ objectPosition: focus }}
      />
      <div className="cur-scrim" aria-hidden="true" />

      <div className="cur-body">
        <span className="cur-label">
          <Icon size={13} strokeWidth={2.1} />
          {label}
        </span>
        <p className="cur-title">{title}</p>
        <p className="cur-detail">{detail}</p>
      </div>

      {action && (
        <button
          type="button"
          className="cur-action"
          onClick={onAction}
          aria-label={`${action} — play the clip`}
        >
          <Play size={13} strokeWidth={2.6} fill="currentColor" />
          {action}
        </button>
      )}
    </Reveal>
  );
};

/**
 * Lightbox for the Valorant clip.
 *
 * The source is 9:16, so it gets its own panel at that aspect rather than
 * being squeezed into a landscape card. Mounted only while open, which is
 * also what keeps the 4MB file from ever downloading unless asked for.
 */
const VideoLightbox = ({ src, onClose }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    // Hold the page still behind the overlay and restore focus on the way out
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    // preventScroll matters: focusing normally scrolls the element into view
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  // Portalled to <body>. `.page` carries a transform, and a transformed
  // ancestor becomes the containing block for position:fixed descendants —
  // so rendered in place this overlay anchored to the top of the whole page
  // rather than the viewport, and focusing it scrolled the reader up there.
  return createPortal(
    <div
      className="cur-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Valorant clip"
      onClick={onClose}
    >
      <div className="cur-lightbox-panel" onClick={(e) => e.stopPropagation()}>
        <video
          className="cur-lightbox-video"
          src={src}
          autoPlay
          loop
          muted
          playsInline
          controls
        />
        <button
          ref={closeRef}
          type="button"
          className="cur-lightbox-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} strokeWidth={2.4} />
        </button>
      </div>
    </div>,
    document.body
  );
};

const Currently = () => {
  const [now, setNow] = useState(() => new Date());
  const [openVideo, setOpenVideo] = useState(null);
  const closeVideo = useCallback(() => setOpenVideo(null), []);

  // Tick on the minute, not every second — the display only shows minutes,
  // so a per-second interval would be 59 wasted renders an hour.
  useEffect(() => {
    let timeoutId;
    const schedule = () => {
      timeoutId = setTimeout(() => {
        setNow(new Date());
        schedule();
      }, 60000 - (Date.now() % 60000) + 50);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  const hour = hourIn(now);
  const isDay = hour >= 6 && hour < 19;
  const { clock, meridiem } = splitTime(now);
  // Fraction of the day elapsed there, drawn as the ring below
  const dayProgress = (hour * 60 + now.getMinutes()) / 1440;

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
          <p className="currently-intro">The parts a résumé leaves out.</p>
        </Reveal>

        <div className="currently-bento">
          <MediaCard item={MEDIA.anime} delay={0} />

          {/* Clock ------------------------------------------------------- */}
          <Reveal animation="up" delay={70} className="cur-card cur-clock span-wide">
            <div className="cur-clock-top">
              <span className="cur-label">
                {isDay ? <Sun size={13} strokeWidth={2.1} /> : <Moon size={13} strokeWidth={2.1} />}
                Local time
              </span>
              <span className="cur-live" aria-hidden="true" />
            </div>

            <div className="cur-clock-face">
              <span className="cur-clock-time">{clock}</span>
              <span className="cur-clock-meridiem">{meridiem}</span>
            </div>

            {/* How far through the day it is where he is */}
            <div className="cur-clock-track" aria-hidden="true">
              <span
                className="cur-clock-fill"
                style={{ transform: `scaleX(${dayProgress.toFixed(4)})` }}
              />
            </div>

            <p className="cur-clock-place">
              San Jose, California
              <span className="cur-clock-mood">{describeHour(hour)}</span>
            </p>
          </Reveal>

          <MediaCard item={MEDIA.album} delay={140} />
          <MediaCard item={MEDIA.book} delay={210} />
          <MediaCard
            item={MEDIA.game}
            delay={280}
            onAction={() => setOpenVideo(MEDIA.game.video)}
          />

          {/* Supporting -------------------------------------------------- */}
          <Reveal animation="up" delay={350} className="cur-card cur-plain cur-teams span-normal">
            <span className="cur-label">
              <Trophy size={13} strokeWidth={2.1} />
              Always supporting
            </span>

            <div className="cur-crests">
              {TEAMS.map(({ name, image, lead }) => (
                <span
                  key={name}
                  className={`cur-crest ${lead ? 'is-lead' : ''}`}
                  title={name}
                >
                  <img src={image} alt={name} loading="lazy" />
                </span>
              ))}
            </div>

            <p className="cur-detail">Through every season</p>
          </Reveal>
        </div>
      </div>

      {openVideo && <VideoLightbox src={openVideo} onClose={closeVideo} />}
    </section>
  );
};

export default Currently;
