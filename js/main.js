document.addEventListener('DOMContentLoaded', function() {
  // Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile navigation
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function() {
      this.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
    
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // Hero carousel
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.querySelector('.hero-arrow.prev');
  const nextBtn = document.querySelector('.hero-arrow.next');
  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 5000;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      dots[i].classList.remove('active');
    });
    
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    // 同步切换轮播配文（描述随图轮换，kicker 固定为品牌名）
    const desc = document.querySelector('.hero-desc');
    const slide = slides[currentSlide];
    if (desc && slide.dataset.desc) {
      desc.textContent = slide.dataset.desc;
      desc.classList.remove('hero-fade');
      void desc.offsetWidth; // 强制重排，重放淡入动画
      desc.classList.add('hero-fade');
    }
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoPlay() {
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopAutoPlay() {
    clearInterval(slideInterval);
  }

  if (slides.length > 0) {
    startAutoPlay();
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
      });
    }
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopAutoPlay();
        showSlide(index);
        startAutoPlay();
      });
    });
  }

  // Active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  
  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', function() {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  }


  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      answer.style.display = 'none';
      question.addEventListener('click', () => {
        const isOpen = answer.style.display === 'block';
        faqItems.forEach(i => {
          const a = i.querySelector('.faq-answer');
          if (a) a.style.display = 'none';
        });
        answer.style.display = isOpen ? 'none' : 'block';
      });
    }
  });

  // Brand film player
  // 每个带 data-src 的 .video-player 卡片：点击后在灯箱内播放对应视频
  const filmLightbox = document.getElementById('videoLightbox');
  const filmPlayers = document.querySelectorAll('.video-player[data-src]');

  if (filmPlayers.length && filmLightbox) {
    filmPlayers.forEach(player => {
      player.addEventListener('click', () => {
        const src = player.dataset.src;
        if (!src) return;
        let video = filmLightbox.querySelector('video');
        if (!video) {
          video = document.createElement('video');
          video.controls = true;
          video.autoplay = true;
          video.setAttribute('playsinline', '');
          filmLightbox.querySelector('.inner').appendChild(video);
        }
        video.src = src;
        filmLightbox.classList.add('open');
        video.play().catch(function(){});
      });
    });

    const closeBtn = filmLightbox.querySelector('.lightbox-close');
    function closeLightbox() {
      filmLightbox.classList.remove('open');
      const video = filmLightbox.querySelector('video');
      if (video) video.pause();
    }
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    filmLightbox.addEventListener('click', function(e) {
      if (e.target === filmLightbox) closeLightbox();
    });
  }

  // Fade-in animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.brand-card, .product-card, .news-card, .coop-card, .service-item, .store-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

/* ===== 顶栏：站内搜索与购物车 ===== */
(function () {
  var form = document.getElementById('topbarSearch');
  var input = document.getElementById('topbarSearchInput');
  var ROUTES = [
    ['漆材料', 'brand-products.html'],
    ['漆器', 'brand-ware.html'],
    ['器皿', 'ware-vessel.html'], ['茶器', 'ware-vessel.html'], ['餐具', 'ware-vessel.html'], ['文房', 'ware-vessel.html'],
    ['花器', 'ware-flower.html'], ['花瓶', 'ware-flower.html'],
    ['摆件', 'ware-ornament.html'], ['漆画', 'ware-ornament.html'],
    ['收藏', 'ware-collection.html'], ['礼盒', 'ware-collection.html'],
    ['生漆', 'brand-raw.html'], ['割漆', 'brand-raw.html'],
    ['精制漆', 'brand-refined.html'], ['推光漆', 'brand-refined.html'], ['色漆', 'brand-refined.html'], ['揩清', 'brand-refined.html'],
    ['工具', 'brand-tools.html'], ['漆刷', 'brand-tools.html'], ['莳绘', 'brand-tools.html'], ['戗金', 'brand-tools.html'],
    ['辅料', 'brand-aux.html'], ['稀释', 'brand-aux.html'], ['箔', 'brand-aux.html'], ['木胎', 'brand-aux.html'],
    ['材料包', 'brand-kit.html'], ['金缮', 'brand-kit.html'], ['犀皮', 'brand-kit.html'], ['螺钿', 'brand-kit.html'],
    ['漂漆', 'brand-drift.html'], ['漆扇', 'brand-drift.html'],
    ['非遗文创', 'solution-nonheritage.html'],
    ['工业', 'solution-industry.html'], ['汽车', 'solution-industry.html'],
    ['古建筑', 'solution-architecture.html'], ['建筑', 'solution-architecture.html'],
    ['古琴', 'solution-guqin.html'], ['琴', 'solution-guqin.html'],
    ['修缮', 'solution-restoration.html'], ['修复', 'solution-restoration.html'], ['金缮修复', 'solution-restoration.html'],
    ['研学', 'cooperation.html#co-research'],
    ['联名', 'cooperation.html#co-cobrand'],
    ['代理', 'cooperation.html#co-channel'], ['加盟', 'cooperation.html#co-channel'],
    ['合作', 'cooperation.html'],
    ['新闻', 'news.html'], ['公告', 'news.html'],
    ['门店', 'stores.html'], ['专柜', 'stores.html'],
    ['会员', 'vip.html'], ['VIP', 'vip.html'],
    ['防伪', 'service.html#svc-anti'], ['溯源', 'service.html#svc-trace'],
    ['加入', 'join.html'], ['招聘', 'join.html'], ['岗位', 'join.html'],
    ['正大明', 'brand-zhengdaming.html'],
    ['龙头国漆', 'brand-longtou.html'], ['龙头', 'brand-longtou.html'],
    ['牛王', 'brand-niuwang.html'],
    ['岁时记', 'brand-suishiji.html'],
    ['品牌', 'enterprise.html'], ['集团', 'enterprise.html']
  ];
  function searchGo() {
    var kw = (input.value || '').trim();
    if (!kw) { input.focus(); return; }
    for (var i = 0; i < ROUTES.length; i++) {
      if (kw.indexOf(ROUTES[i][0]) > -1) { window.location.href = ROUTES[i][1]; return; }
    }
    alert('未找到与「' + kw + '」相关的内容，可试试：漆器、生漆、工具、非遗文创、古琴…');
  }
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); searchGo(); });

  var cart = document.getElementById('topbarCart');
  if (cart) {
    cart.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.cart-mini')) return;
      cart.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (cart !== e.target && !cart.contains(e.target)) cart.classList.remove('open');
    });
  }
})();
