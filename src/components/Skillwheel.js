import React, { useEffect, useRef, useState } from 'react';
import './Skills.css'

const SkillWheel = () => {
  const wheelRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const currentRotation = useRef(0);
  const [currentSkill, setCurrentSkill] = useState('');

  const skills = [
    { id: 'javascript', name: 'JavaScript', icon: '/css.png' },
    { id: 'python', name: 'Python', icon: '/css.png' },
    { id: 'python', name: 'Python', icon: '/css.png' },
    { id: 'python', name: 'Python', icon: '/css.png' },
    { id: 'react', name: 'React', icon: '/css.png' },
    { id: 'nodejs', name: 'Node.js', icon: '/css.png' },
    { id: 'python', name: 'Python', icon: '/css.png' },
    { id: 'html', name: 'HTML', icon: '/css.png' },
    { id: 'java', name: 'Java', icon: '/css.png' }
    
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
      console.log(`Index: ${index}, Element:`, item); // Logs the index and the element
      item.style.transform = `rotate(${index * 40}deg)`;
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

      // Update each skill item's rotation to face center
      // const items = document.querySelectorAll('.sw-skill-icon');
      // items.forEach((item) => {
      //   item.style.transform = `rotate(${-currentRotation.current}deg)`;
      // });

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
  }, []);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    document.body.style.cursor = 'grabbing';
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const updateSkillPositions = () => {
      const radius = 200;
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

  return (
    <div className="sw-container" ref={containerRef}>
      <div className="sw-center-dot" />
      <div
        ref={wheelRef}
        className="sw-wheel"
        onMouseDown={handleMouseDown}
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
      <div className="sw-skill-name">{currentSkill}</div>
      
    </div>
  );
};

export default SkillWheel;