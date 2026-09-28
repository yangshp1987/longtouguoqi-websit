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

    // 按页切换按钮文字与链接（未设置 data-cta 的页恢复默认）
    const cta = document.querySelector('.hero-cta');
    if (cta) {
      const txt = [...cta.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
      if (!cta.dataset.defHref) { cta.dataset.defHref = cta.getAttribute('href'); cta.dataset.defText = txt ? txt.textContent.trim() : ''; }
      if (txt) txt.textContent = '\n            ' + (slide.dataset.cta || cta.dataset.defText) + '\n            ';
      cta.setAttribute('href', slide.dataset.ctaHref || cta.dataset.defHref);
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
    ['Lacquer Materials', 'brand-products.html'],
    ['Lacquerware', 'brand-ware.html'],
    ['Master\'s Handmade', 'master.html'], ['master', 'master.html'], ['handmade', 'master.html'], ['One of a Kind', 'master.html'],
    ['vessels', 'ware-vessel.html'], ['tea ware', 'ware-vessel.html'], ['tableware', 'ware-vessel.html'], ['stationery', 'ware-vessel.html'],
    ['flower vessel', 'ware-flower.html'], ['vase', 'ware-flower.html'],
    ['ornaments', 'ware-ornament.html'], ['lacquer painting', 'ware-ornament.html'],
    ['collection', 'ware-collection.html'], ['gift box', 'ware-collection.html'],
    ['Raw Lacquer', 'brand-raw.html'], ['lacquer tapping', 'brand-raw.html'],
    ['Refined Lacquer', 'brand-refined.html'], ['polishing lacquer', 'brand-refined.html'], ['colored lacquer', 'brand-refined.html'], ['wipe polishing', 'brand-refined.html'],
    ['Tools', 'brand-tools.html'], ['lacquer brush', 'brand-tools.html'], ['maki-e', 'brand-tools.html'], ['incised gold', 'brand-tools.html'],
    ['Auxiliary Materials', 'brand-aux.html'], ['thinning', 'brand-aux.html'], ['foil', 'brand-aux.html'], ['wooden body', 'brand-aux.html'],
    ['material kit', 'brand-kit.html'], ['kintsugi', 'brand-kit.html'], ['xipi', 'brand-kit.html'], ['mother-of-pearl inlay', 'brand-kit.html'],
    ['Floating Lacquer', 'brand-drift.html'], ['lacquer fan', 'brand-drift.html'],
    ['ICH Cultural and Creative Products', 'solution-nonheritage.html'],
    ['industrial', 'solution-industry.html'], ['automotive', 'solution-industry.html'],
    ['historic buildings', 'solution-architecture.html'], ['architecture', 'solution-architecture.html'],
    ['guqin', 'solution-guqin.html'], ['qin', 'solution-guqin.html'],
    ['renovation', 'solution-restoration.html'], ['restoration', 'solution-restoration.html'], ['kintsugi repair', 'solution-restoration.html'],
    ['study tour', 'cooperation.html#co-research'],
    ['co-branding', 'cooperation.html#co-cobrand'],
    ['agent', 'cooperation.html#co-channel'], ['franchise', 'cooperation.html#co-channel'],
    ['Cooperation', 'cooperation.html'],
    ['news', 'news.html'], ['announcements', 'news.html'],
    ['store', 'stores.html'], ['counter', 'stores.html'],
    ['membership', 'vip.html'], ['VIP', 'vip.html'],
    ['anti-counterfeiting', 'service.html#svc-anti'], ['traceability', 'service.html#svc-trace'],
    ['join', 'join.html'], ['recruitment', 'join.html'], ['positions', 'join.html'],
    ['Zhengdaming', 'brand-zhengdaming.html'],
    ['Longtou Guoqi', 'brand-longtou.html'], ['Longtou', 'brand-longtou.html'],
    ['Niuwang', 'brand-niuwang.html'],
    ['Suishiji', 'brand-suishiji.html'],
    ['brand', 'enterprise.html'], ['group', 'enterprise.html']
  ];
  function searchGo() {
    var kw = (input.value || '').trim();
    if (!kw) { input.focus(); return; }
    for (var i = 0; i < ROUTES.length; i++) {
      if (kw.indexOf(ROUTES[i][0]) > -1) { window.location.href = ROUTES[i][1]; return; }
    }
    alert('No results found for "' + kw + '". You might try: lacquerware, raw lacquer, tools, ICH cultural creations, guqin…');
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
    btn.setAttribute('aria-label', 'Expand submenu');
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
