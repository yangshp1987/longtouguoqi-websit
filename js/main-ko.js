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
    ['칠 재료', 'brand-products.html'],
    ['칠기', 'brand-ware.html'],
    ['대사 수작', 'master.html'], ['대사', 'master.html'], ['수작', 'master.html'], ['단 한 점', 'master.html'],
    ['그릇', 'ware-vessel.html'], ['다기', 'ware-vessel.html'], ['식기', 'ware-vessel.html'], ['문방', 'ware-vessel.html'],
    ['화기', 'ware-flower.html'], ['화병', 'ware-flower.html'],
    ['장식품', 'ware-ornament.html'], ['칠화', 'ware-ornament.html'],
    ['소장', 'ware-collection.html'], ['선물 세트', 'ware-collection.html'],
    ['생칠', 'brand-raw.html'], ['칠 채취', 'brand-raw.html'],
    ['정제칠', 'brand-refined.html'], ['퇴광칠', 'brand-refined.html'], ['색칠', 'brand-refined.html'], ['닦아내기', 'brand-refined.html'],
    ['도구', 'brand-tools.html'], ['옻칠 붓', 'brand-tools.html'], ['마키에', 'brand-tools.html'], ['창금', 'brand-tools.html'],
    ['부자재', 'brand-aux.html'], ['희석', 'brand-aux.html'], ['박', 'brand-aux.html'], ['목태', 'brand-aux.html'],
    ['재료 키트', 'brand-kit.html'], ['금缮', 'brand-kit.html'], ['서피', 'brand-kit.html'], ['나전', 'brand-kit.html'],
    ['표칠', 'brand-drift.html'], ['칠 부채', 'brand-drift.html'],
    ['무형문화유산 문화창작', 'solution-nonheritage.html'],
    ['산업', 'solution-industry.html'], ['자동차', 'solution-industry.html'],
    ['고건축', 'solution-architecture.html'], ['건축', 'solution-architecture.html'],
    ['古琴', 'solution-guqin.html'], ['거문고', 'solution-guqin.html'],
    ['보수', 'solution-restoration.html'], ['수복', 'solution-restoration.html'], ['금缮 수복', 'solution-restoration.html'],
    ['체험학습', 'cooperation.html#co-research'],
    ['공동 브랜드', 'cooperation.html#co-cobrand'],
    ['대리', 'cooperation.html#co-channel'], ['가맹', 'cooperation.html#co-channel'],
    ['협력', 'cooperation.html'],
    ['뉴스', 'news.html'], ['공지', 'news.html'],
    ['매장', 'stores.html'], ['전문 매장', 'stores.html'],
    ['회원', 'vip.html'], ['VIP', 'vip.html'],
    ['위조 방지', 'service.html#svc-anti'], ['이력 추적', 'service.html#svc-trace'],
    ['합류', 'join.html'], ['채용', 'join.html'], ['포지션', 'join.html'],
    ['正大明', 'brand-zhengdaming.html'],
    ['龙头国漆', 'brand-longtou.html'], ['龙头', 'brand-longtou.html'],
    ['牛王', 'brand-niuwang.html'],
    ['岁时记', 'brand-suishiji.html'],
    ['브랜드', 'enterprise.html'], ['그룹', 'enterprise.html']
  ];
  function searchGo() {
    var kw = (input.value || '').trim();
    if (!kw) { input.focus(); return; }
    for (var i = 0; i < ROUTES.length; i++) {
      if (kw.indexOf(ROUTES[i][0]) > -1) { window.location.href = ROUTES[i][1]; return; }
    }
    alert('관련 내용을 찾을 수 없습니다: 「' + kw + '」관련 내용을 찾지 못했습니다. 칠기, 생칠, 도구, 무형문화유산 문화창작품, 古琴 등으로 시도해 보십시오.');
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


/* ===== 移动端增强（2026-09-19） ===== */
(function () {
  var MQ = window.matchMedia('(max-width: 768px)');

  // 导航二级折叠：为含下拉的菜单项插入展开箭头
  document.querySelectorAll('.nav-item').forEach(function (item) {
    var dd = item.querySelector('.dropdown');
    if (!dd) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-caret';
    btn.setAttribute('aria-label', '하위 메뉴 펼치기');
    btn.innerHTML = '<span class="caret">▾</span>';
    item.appendChild(btn);
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      item.classList.toggle('open');
    });
  });

  // 页脚手风琴：把每列链接收进可折叠容器
  document.querySelectorAll('.footer-column').forEach(function (col) {
    var h4 = col.querySelector('h4');
    if (!h4) return;
    var wrap = document.createElement('div');
    wrap.className = 'footer-collapse';
    Array.prototype.slice.call(col.children).forEach(function (node) {
      if (node !== h4) wrap.appendChild(node);
    });
    col.appendChild(wrap);
    h4.addEventListener('click', function () {
      if (MQ.matches) col.classList.toggle('open');
    });
  });
})();

/* ===== 语言切换器（2026-09-20） ===== */
(function () {
  var sw = document.querySelector('.lang-switch');
  if (!sw) return;
  var cur = sw.querySelector('.lang-cur');
  cur.addEventListener('click', function (e) {
    e.stopPropagation();
    sw.classList.toggle('open');
  });
  document.addEventListener('click', function () { sw.classList.remove('open'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') sw.classList.remove('open');
  });
})();
