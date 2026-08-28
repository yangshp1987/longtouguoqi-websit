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

  // 顶部小字栏：站内搜索（关键词路由）
  const searchForm = document.querySelector('.topbar-search');
  if (searchForm) {
    const searchIndex = [
      { kw: ['生漆', '大漆', '原漆', '割漆', '漆酚', '毛坝'], url: 'brand-products.html#bp-raw' },
      { kw: ['精制漆', '透明漆', '推光', '熟漆', '罩金'], url: 'brand-products.html#bp-refined' },
      { kw: ['工具', '漆刷', '发刷', '牛角', '刮刀', '滤漆'], url: 'brand-products.html#bp-tools' },
      { kw: ['辅料', '瓦灰', '桐油', '裱布', '地仗', '夏布'], url: 'brand-products.html#bp-aux' },
      { kw: ['漆器', '茶具', '茶盘', '茶席', '首饰', '手镯', '礼盒', '镇尺', '笔筒', '食盒'], url: 'brand-products.html#bp-ware' },
      { kw: ['正大明'], url: 'brand-zhengdaming.html' },
      { kw: ['龙头国漆', '漆树', '漆林', '种植'], url: 'brand-longtou.html' },
      { kw: ['牛王', '非遗', '技艺', '传承'], url: 'brand-niuwang.html' },
      { kw: ['岁时记', '节气', '文创', '国风'], url: 'brand-suishiji.html' },
      { kw: ['新闻', '公告', '动态', '报道', '活动'], url: 'news.html' },
      { kw: ['方案', '古建', '古琴', '工业', '修复', '文创园'], url: 'products.html' },
      { kw: ['合作', '代理', '渠道', '联名', '海外', '经销'], url: 'cooperation.html' },
      { kw: ['会员', 'vip', 'VIP'], url: 'vip.html' },
      { kw: ['门店', '线下', '体验', '专卖店'], url: 'stores.html' },
      { kw: ['防伪', '溯源', '真伪', '查询'], url: 'service.html' },
      { kw: ['企业', '集团', '介绍', '关于'], url: 'enterprise.html' },
    ];
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = this.querySelector('input');
      const q = (input.value || '').trim();
      if (!q) return;
      const hit = searchIndex.find(item => item.kw.some(k => q.includes(k)));
      window.location.href = hit ? hit.url : 'products.html';
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
