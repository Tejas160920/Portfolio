import React, { useEffect, useRef, useState } from 'react';
import './Skills.css';

const SkillWheel = () => {
  const wheelRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const currentRotation = useRef(0);
  // eslint-disable-next-line no-unused-vars
  const [currentSkill, setCurrentSkill] = useState('');

  const skills = [
    { id: 'javascript', name: 'JavaScript', icon: '/java.png' },
    { id: 'python', name: 'Python', icon: '/python.png' },
    { id: 'spark', name: 'spark', icon: '/spark.png' },
    { id: 'css', name: 'css', icon: '/css.png' },
    { id: 'react', name: 'React', icon: '/react.png' },
    { id: 'tensor', name: 'tensor', icon: '/tensor.png' },
    { id: 'pytorch', name: 'Pytorch', icon: '/pytorch.png' },
    { id: 'sql', name: 'SQL', icon: '/sql.png' },
  ];

  const calculateAngle = (x, y, rect) => {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
  };

  const findTopSkill = () => {
    if (!wheelRef.current) return;
    const wheelRotation = currentRotation.current % 360;
    const itemAngle = 360 / skills.length;
    const normalizedRotation = (wheelRotation + 360) % 360;
    const topSkillIndex = Math.round(normalizedRotation / itemAngle) % skills.length;
    setCurrentSkill(skills[topSkillIndex].name);
  };


  useEffect(() => {
    const items = document.querySelectorAll(".sw-skill-icon");
    items.forEach((item, index) => {
      item.style.transform = `rotate(${index * 360 / items.length}deg)`;
    });

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;

      const rect = wheelRef.current.getBoundingClientRect();
      const currentAngle = calculateAngle(e.clientX, e.clientY, rect);
      const startAngle = calculateAngle(
        lastMousePosition.current.x,
        lastMousePosition.current.y,
        rect
      );

      let deltaAngle = currentAngle - startAngle;
      if (deltaAngle > 180) deltaAngle -= 360;
      if (deltaAngle < -180) deltaAngle += 360;

      currentRotation.current += deltaAngle;
      wheelRef.current.style.transform = `rotate(${currentRotation.current}deg)`;

      findTopSkill();
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    document.body.style.cursor = 'grabbing';
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const updateSkillPositions = () => {
      if (!containerRef.current) return;

      const containerSize = containerRef.current.clientWidth;
      const radius = containerSize * 0.35;
      const items = document.querySelectorAll('.sw-skill-item');
      const angleStep = (2 * Math.PI) / items.length;

      items.forEach((item, index) => {
        const angle = index * angleStep;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        item.style.transform = `translate(${x}px, ${y}px) rotate(45deg)`;
      });
    };

    updateSkillPositions();
    window.addEventListener('resize', updateSkillPositions);
    return () => window.removeEventListener('resize', updateSkillPositions);
  }, []);

  // Add touch event handlers
  const handleTouchStart = (e) => {
    e.preventDefault();
    isDragging.current = true;
    const touch = e.touches[0];
    lastMousePosition.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isDragging.current) return;

    const touch = e.touches[0];
    const rect = wheelRef.current.getBoundingClientRect();
    const currentAngle = calculateAngle(touch.clientX, touch.clientY, rect);
    const startAngle = calculateAngle(
      lastMousePosition.current.x,
      lastMousePosition.current.y,
      rect
    );

    let deltaAngle = currentAngle - startAngle;
    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;

    currentRotation.current += deltaAngle;
    wheelRef.current.style.transform = `rotate(${currentRotation.current}deg)`;
    findTopSkill();
    lastMousePosition.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="sw-container" ref={containerRef} id="skills">
      <div className="skillset-text">
        <h1>My</h1>
        <br />
        <h1 className="text" style={{color: '#4ade80'}}> Skillset</h1>
      </div>

      {/* Background with aurora effect */}
      <div className="hero-background">
        <div className="gradient-overlay"></div>
        <div className="aurora-effect"></div>
        <div className="particles">
          {[...Array(window.innerWidth <= 768 ? 15 : 50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Orbital Rings - Visual only, doesn't affect wheel */}
      <div className="orbital-rings">
        <div className="orbital-ring orbital-ring-1">
          <div className="orbital-dot"></div>
          <div className="orbital-dot"></div>
        </div>
        <div className="orbital-ring orbital-ring-2">
          <div className="orbital-dot"></div>
          <div className="orbital-dot"></div>
        </div>
        <div className="orbital-ring orbital-ring-3"></div>
      </div>

      <div className="sw-center-dot" />
      <div
        ref={wheelRef}
        className="sw-wheel"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="sw-skill-item"
            data-skill={skill.id}
          >
            <div className="sw-skill-inner">
              <img
                src={skill.icon}
                alt={skill.name}
                className="sw-skill-icon"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Drag Hint */}
      <div className="drag-hint">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        Drag to explore
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'scaleX(-1)' }}>
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>

      {/* Floating particles */}
      <div className="skill-particles">
        {[...Array(window.innerWidth <= 768 ? 3 : 8)].map((_, i) => (
          <div
            key={i}
            className="skill-particle"
            style={{
              top: `${30 + Math.random() * 40}%`,
              left: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillWheel;
