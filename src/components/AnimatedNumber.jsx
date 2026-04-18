import React, { useEffect, useState } from 'react';

const AnimatedNumber = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const finalValue = parseInt(value, 10) || 0;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Calcule la valeur actuelle avec un effet de facilité (ease-out)
      setCount(Math.floor(progress * finalValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
    
    // Nettoyage si le composant est démonté
    return () => { startTime = null; };
  }, [value, duration]);

  return <>{count.toLocaleString('fr-FR')}</>;
};

export default AnimatedNumber;