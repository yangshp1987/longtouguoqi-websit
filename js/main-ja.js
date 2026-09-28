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
    ['漆材料', 'brand-products.html'],
    ['漆器', 'brand-ware.html'],
    ['大師手作', 'master.html'], ['大師', 'master.html'], ['手作り', 'master.html'], ['一点もの', 'master.html'],
    ['器皿', 'ware-vessel.html'], ['茶器', 'ware-vessel.html'], ['食器', 'ware-vessel.html'], ['文房具', 'ware-vessel.html'],
    ['花器', 'ware-flower.html'], ['花瓶', 'ware-flower.html'],
    ['置物', 'ware-ornament.html'], ['漆画', 'ware-ornament.html'],
    ['収蔵', 'ware-collection.html'], ['ギフトボックス', 'ware-collection.html'],
    ['生漆', 'brand-raw.html'], ['漆掻き', 'brand-raw.html'],
    ['精製漆', 'brand-refined.html'], ['研ぎ出し漆', 'brand-refined.html'], ['色漆', 'brand-refined.html'], ['揩清', 'brand-refined.html'],
    ['工具', 'brand-tools.html'], ['漆刷毛', 'brand-tools.html'], ['蒔絵', 'brand-tools.html'], ['戧金', 'brand-tools.html'],
    ['副資材', 'brand-aux.html'], ['希釈', 'brand-aux.html'], ['箔', 'brand-aux.html'], ['木胎', 'brand-aux.html'],
    ['材料セット', 'brand-kit.html'], ['金継ぎ', 'brand-kit.html'], ['犀皮', 'brand-kit.html'], ['螺鈿', 'brand-kit.html'],
    ['漂漆', 'brand-drift.html'], ['漆扇', 'brand-drift.html'],
    ['無形文化遺産カルチャー・クリエイティブ', 'solution-nonheritage.html'],
    ['工業', 'solution-industry.html'], ['自動車', 'solution-industry.html'],
    ['古建築', 'solution-architecture.html'], ['建築', 'solution-architecture.html'],
    ['古琴', 'solution-guqin.html'], ['琴', 'solution-guqin.html'],
    ['修繕', 'solution-restoration.html'], ['修復', 'solution-restoration.html'], ['金継ぎ修復', 'solution-restoration.html'],
    ['研修・体験学習', 'cooperation.html#co-research'],
    ['コラボレーション', 'cooperation.html#co-cobrand'],
    ['代理店', 'cooperation.html#co-channel'], ['フランチャイズ加盟', 'cooperation.html#co-channel'],
    ['協力', 'cooperation.html'],
    ['ニュース', 'news.html'], ['お知らせ', 'news.html'],
    ['店舗', 'stores.html'], ['専売コーナー', 'stores.html'],
    ['会員', 'vip.html'], ['VIP', 'vip.html'],
    ['偽造防止', 'service.html#svc-anti'], ['トレーサビリティ', 'service.html#svc-trace'],
    ['参加', 'join.html'], ['採用', 'join.html'], ['職種', 'join.html'],
    ['正大明', 'brand-zhengdaming.html'],
    ['龙头国漆', 'brand-longtou.html'], ['龙头', 'brand-longtou.html'],
    ['牛王', 'brand-niuwang.html'],
    ['岁时记', 'brand-suishiji.html'],
    ['ブランド', 'enterprise.html'], ['集団', 'enterprise.html']
  ];
  function searchGo() {
    var kw = (input.value || '').trim();
    if (!kw) { input.focus(); return; }
    for (var i = 0; i < ROUTES.length; i++) {
      if (kw.indexOf(ROUTES[i][0]) > -1) { window.location.href = ROUTES[i][1]; return; }
    }
    alert('「' + kw + '」に関連する内容は見つかりませんでした。お試しください：漆器、生漆、工具、無形文化遺産カルチャー・クリエイティブ、古琴…');
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
    btn.setAttribute('aria-label', 'サブメニューを展開');
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
