const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '0';

const hero = document.querySelector('.hero');
hero.style.position = 'relative';
hero.insertBefore(canvas, hero.firstChild);

// Ajustar tamanho do canvas
function resizeCanvas() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Classe para as partículas
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1 + 0.5;
        this.alpha = Math.random() * 0.3 + 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Rebater nas bordas
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
    }
}

// Criar partículas
const particles = Array.from({ length: 50 }, () => new Particle());

// Função para desenhar linhas entre partículas próximas
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - distance / 80)})`;
                ctx.stroke();
            }
        }
    }
}

// Função de animação
function animate() {
    // Limpar canvas com fade
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Atualizar e desenhar partículas
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Desenhar conexões
    drawConnections();

    requestAnimationFrame(animate);
}

// Iniciar animação
animate();

// Ajustar z-index do conteúdo
const heroContent = document.querySelector('.hero-content');
heroContent.style.position = 'relative';
heroContent.style.zIndex = '1';

// Animação de Scroll
const fadeElements = document.querySelectorAll('.fade-in');
let lastScrollY = window.scrollY;
let ticking = false;

function checkFade() {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const elementVisible = 150;
        
        // Verifica se o elemento está entrando na tela
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('is-visible');
            element.classList.remove('is-hidden');
        }
        
        // Verifica se o elemento está saindo da tela
        if (elementBottom < 0 || elementTop > window.innerHeight) {
            element.classList.remove('is-visible');
            element.classList.add('is-hidden');
        }
    });
    
    lastScrollY = window.scrollY;
    ticking = false;
}

// Otimização do scroll com requestAnimationFrame
function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(checkFade);
        ticking = true;
    }
}

// Verificar elementos visíveis no carregamento
window.addEventListener('load', checkFade);

// Verificar elementos visíveis no scroll
window.addEventListener('scroll', onScroll);

// Verificar elementos visíveis no resize
window.addEventListener('resize', checkFade);
