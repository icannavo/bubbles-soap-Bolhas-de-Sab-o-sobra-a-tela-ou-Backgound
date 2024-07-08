import React, { useEffect, useRef } from 'react';
import './Bubbles.scss';

// Importa imagens de bolhas e explosão
import bubble1 from './bubbles1.png';
import bubble2 from './bubbles2.png';
import bubble3 from './bubbles3.png';
import burst from './burst.png';

const Bubbles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Ajusta o tamanho do canvas para a densidade de pixels do dispositivo
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    // Inicializa o canvas e ajusta o tamanho
    resizeCanvas();

    const bubbles = [];

    const createBubble = () => {
      const size = Math.random() * 100 + 65; // Tamanho das bolhas
      const position = Math.random() * (canvas.width + canvas.height) * 2; // Posição inicial fora da tela

      let x, y;
      if (position < canvas.width) {
        x = position;
        y = -size; // Aparecer acima da tela
      } else if (position < canvas.width + canvas.height) {
        x = canvas.width + size; // Aparecer à direita da tela
        y = position - canvas.width;
      } else if (position < 2 * canvas.width + canvas.height) {
        x = position - canvas.width - canvas.height;
        y = canvas.height + size; // Aparecer abaixo da tela
      } else {
        x = -size; // Aparecer à esquerda da tela
        y = position - 2 * canvas.width - canvas.height;
      }

      const angle = Math.random() * 2 * Math.PI; // Ângulo aleatório em radianos
      const speed = Math.random() * 1.5 + 0.5; // Velocidade aleatória
      const speedX = speed * Math.cos(angle);
      const speedY = speed * Math.sin(angle);

      // Escolher uma imagem de bolha aleatoriamente
      const imageSrc = [bubble1, bubble2, bubble3][Math.floor(Math.random() * 3)];
      const img = new Image();
      img.src = imageSrc;

      return {
        x,
        y,
        size,
        speedX,
        speedY,
        image: img,
        burst: false,
        burstImage: new Image(),
      };
    };

    const drawBubbles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach((bubble) => {
        if (bubble.burst) {
          ctx.drawImage(
            bubble.burstImage,
            bubble.x - bubble.size / 2,
            bubble.y - bubble.size / 2,
            bubble.size,
            bubble.size
          );
        } else {
          // Desenhar a imagem da bolha no canvas
          ctx.drawImage(
            bubble.image,
            bubble.x - bubble.size / 2,
            bubble.y - bubble.size / 2,
            bubble.size,
            bubble.size
          );

          bubble.x += bubble.speedX;
          bubble.y += bubble.speedY;

          // Verificar se a bolha saiu da tela e reposicioná-la
          if (
            bubble.x < -bubble.size ||
            bubble.x > canvas.width + bubble.size ||
            bubble.y < -bubble.size ||
            bubble.y > canvas.height + bubble.size
          ) {
            Object.assign(bubble, createBubble());
          }
        }
      });

      requestAnimationFrame(drawBubbles);
    };

    const initBubbles = () => {
      for (let i = 0; i < 15; i++) {
        bubbles.push(createBubble());
      }

      drawBubbles();
    };

    initBubbles();

    // Ajustar o tamanho do canvas ao redimensionar a janela
    window.addEventListener('resize', resizeCanvas);

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (event.clientX - rect.left) * devicePixelRatio;
      const mouseY = (event.clientY - rect.top) * devicePixelRatio;

      bubbles.forEach((bubble) => {
        if (
          mouseX > bubble.x - bubble.size / 2 &&
          mouseX < bubble.x + bubble.size / 2 &&
          mouseY > bubble.y - bubble.size / 2 &&
          mouseY < bubble.y + bubble.size / 2
        ) {
          bubble.burst = true;
          bubble.burstImage.src = burst;
        }
      });
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="bubbles-canvas" />;
};

export default Bubbles;
