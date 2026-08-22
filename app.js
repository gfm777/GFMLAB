/* ============================================
   GFMLAB 混音知识库 - 交互逻辑
   ============================================ */

(function () {
    'use strict';

    /* ========== 粒子背景 ========== */
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');
        let width, height, particles;
        const PARTICLE_COUNT = 90;
        const MAX_DIST = 140;

        function resize() {
            width = canvas.width = window.innerWidth * devicePixelRatio;
            height = canvas.height = window.innerHeight * devicePixelRatio;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.6 * devicePixelRatio,
                    vy: (Math.random() - 0.5) * 0.6 * devicePixelRatio,
                    r: (Math.random() * 1.8 + 0.8) * devicePixelRatio,
                    hue: Math.random() < 0.5 ? 180 : 305
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
                grad.addColorStop(0, `hsla(${p.hue}, 100%, 60%, 0.9)`);
                grad.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, 1)`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < MAX_DIST * devicePixelRatio) {
                        const alpha = (1 - d / (MAX_DIST * devicePixelRatio)) * 0.25;
                        const avgHue = (p.hue + q.hue) / 2;
                        ctx.strokeStyle = `hsla(${avgHue}, 100%, 60%, ${alpha})`;
                        ctx.lineWidth = 1 * devicePixelRatio;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });
        resize();
        createParticles();
        draw();
    }

    /* ========== 导航栏 ========== */
    function initNavbar() {
        const navbar = document.querySelector('.navbar');
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.querySelector('.nav-links');
        const anchors = document.querySelectorAll('.nav-link');
        const sections = ['hero', 'terminology', 'mechanics', 'history', 'daw', 'engineers'];

        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 30);

            const scrollPos = window.scrollY + 120;
            let currentId = sections[0];
            for (const id of sections) {
                const el = document.getElementById(id);
                if (el && el.offsetTop <= scrollPos) currentId = id;
            }
            anchors.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
            });
        });

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        anchors.forEach(a => {
            a.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    /* ========== 字母导航 ========== */
    function renderAlphabetNav() {
        const container = document.getElementById('alphabetNav');
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const used = new Set(TERMINOLOGY_DATA.map(t => (t.letter || t.nameEn[0] || 'A').toUpperCase()));

        container.innerHTML = letters.map(L => {
            const disabled = !used.has(L);
            return `<button class="alpha-btn ${disabled ? '' : ''}" data-letter="${L}" ${disabled ? 'disabled' : ''}>${L}</button>`;
        }).join('');

        container.addEventListener('click', e => {
            const btn = e.target.closest('.alpha-btn');
            if (!btn || btn.disabled) return;
            document.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTerminologyCards();
        });
    }

    /* ========== 术语卡渲染 ========== */
    let activeCategory = 'all';
    let activeLetter = null;

    function filterTerminology() {
        return TERMINOLOGY_DATA.filter(t => {
            const catOk = activeCategory === 'all' || t.category === activeCategory;
            const letter = (t.letter || t.nameEn[0] || 'A').toUpperCase();
            const letterOk = !activeLetter || letter === activeLetter;
            return catOk && letterOk;
        });
    }

    function renderTerminologyCards() {
        const grid = document.getElementById('terminologyGrid');
        const list = filterTerminology();
        const catLabel = cat => CATEGORY_MAP[cat]?.label || cat;
        const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;

        if (list.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🎵</div>
                    <div class="no-results-text">当前筛选下暂无词条</div>
                    <div>换个分类或字母试试吧</div>
                </div>
            `;
            return;
        }

        grid.innerHTML = list.map(t => `
            <div class="card" data-id="${t.id}">
                <div class="card-icon ${t.category}">${t.icon}</div>
                <h3 class="card-title">${t.name}</h3>
                <span class="card-title-en">${t.nameEn}</span>
                <p class="card-desc">${t.shortDesc}</p>
                <div class="card-footer">
                    <span class="card-cat ${t.category}">${catLabel(t.category)}</span>
                    <span class="card-read">查看详情 ${arrow}</span>
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => openModal(card.dataset.id));
        });
    }

    /* ========== 分类筛选 ========== */
    function initCategoryFilters() {
        document.getElementById('categoryFilters').addEventListener('click', e => {
            const chip = e.target.closest('.chip');
            if (!chip) return;
            document.querySelectorAll('#categoryFilters .chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeCategory = chip.dataset.category;
            renderTerminologyCards();
        });
    }

    /* ========== 搜索 ========== */
    function initSearch() {
        const input = document.getElementById('searchInput');
        const btn = document.getElementById('searchBtn');
        const suggestions = document.getElementById('searchSuggestions');
        const tagBtns = document.querySelectorAll('.tag-btn');

        function buildResults(q) {
            q = q.trim().toLowerCase();
            if (!q) return [];
            return TERMINOLOGY_DATA
                .map(t => {
                    const score = [
                        t.name.toLowerCase().includes(q) ? 100 : 0,
                        t.nameEn.toLowerCase().includes(q) ? 80 : 0,
                        (t.shortDesc || '').toLowerCase().includes(q) ? 30 : 0,
                        (t.description || '').toLowerCase().includes(q) ? 15 : 0,
                        (t.principles || []).some(p => p.toLowerCase().includes(q)) ? 20 : 0,
                        (t.types || []).some(p => p.toLowerCase().includes(q)) ? 20 : 0
                    ].reduce((a, b) => a + b, 0);
                    return score > 0 ? { ...t, _score: score } : null;
                })
                .filter(Boolean)
                .sort((a, b) => b._score - a._score)
                .slice(0, 8);
        }

        function renderSuggestions(list, q) {
            if (list.length === 0) {
                suggestions.innerHTML = `<div class="suggestion-empty">没有找到「${q}」相关词条</div>`;
            } else {
                const catLabel = cat => CATEGORY_MAP[cat]?.label || cat;
                suggestions.innerHTML = list.map(t => `
                    <div class="suggestion-item" data-id="${t.id}">
                        <span class="suggestion-cat ${t.category}">${catLabel(t.category)}</span>
                        <div>
                            <div class="suggestion-text">${t.name} · <span style="color:var(--text-muted);font-family:var(--font-mono);font-size:12px;">${t.nameEn}</span></div>
                            <div class="suggestion-desc">${t.shortDesc}</div>
                        </div>
                    </div>
                `).join('');
            }
            suggestions.classList.add('active');
        }

        let timer;
        input.addEventListener('input', () => {
            clearTimeout(timer);
            const q = input.value;
            timer = setTimeout(() => {
                const res = buildResults(q);
                if (q) renderSuggestions(res, q);
                else suggestions.classList.remove('active');
            }, 150);
        });

        input.addEventListener('focus', () => {
            if (input.value.trim()) {
                renderSuggestions(buildResults(input.value), input.value);
            }
        });

        suggestions.addEventListener('click', e => {
            const item = e.target.closest('.suggestion-item');
            if (item) openModal(item.dataset.id);
            suggestions.classList.remove('active');
            input.value = '';
        });

        document.addEventListener('click', e => {
            if (!e.target.closest('.search-container')) {
                suggestions.classList.remove('active');
            }
        });

        btn.addEventListener('click', () => {
            const q = input.value.trim();
            if (!q) return;
            const res = buildResults(q);
            if (res.length) openModal(res[0].id);
            input.value = '';
            suggestions.classList.remove('active');
        });

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') btn.click();
        });

        tagBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const q = btn.dataset.search;
                input.value = q;
                btn.click();
                const res = buildResults(q);
                if (res.length) {
                    openModal(res[0].id);
                    input.value = '';
                }
            });
        });
    }

    /* ========== Modal 详情弹层 ========== */
    function openModal(id) {
        const t = TERMINOLOGY_DATA.find(x => x.id === id);
        if (!t) return;
        const catLabel = cat => CATEGORY_MAP[cat]?.label || cat;

        let html = `
            <h2>${t.name}</h2>
            <span class="modal-title-en">${t.nameEn}</span>
            <div class="modal-meta">
                <span class="card-cat ${t.category}">${catLabel(t.category)}</span>
                <span class="card-cat processing" style="background:rgba(139,92,246,0.15);color:var(--purple);">首字母 ${(t.letter || t.nameEn[0] || 'A').toUpperCase()}</span>
            </div>
            <div class="modal-image">
                <span class="modal-image-icon">${t.icon}</span>
            </div>
        `;

        if (t.description) {
            html += `<div class="modal-section"><h4>基础概念</h4><p>${t.description}</p></div>`;
        }
        if (t.principles && t.principles.length) {
            html += `<div class="modal-section"><h4>核心原理</h4><ul>${t.principles.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
        }
        if (t.params && t.params.length) {
            html += `<div class="modal-section"><h4>关键参数</h4><div class="tab-params">${t.params.map(p => `
                <div class="param-item">
                    <div class="param-name">${p.name} <span class="param-range">${p.range}</span></div>
                    <div class="param-desc">${p.desc}</div>
                </div>
            `).join('')}</div></div>`;
        }
        if (t.types && t.types.length) {
            html += `<div class="modal-section"><h4>常见类型</h4><ul>${t.types.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
        }
        if (t.techniques && t.techniques.length) {
            html += `<div class="modal-section"><h4>常用技法</h4><ul>${t.techniques.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
        }
        if (t.useCases && t.useCases.length) {
            html += `<div class="modal-section"><h4>典型应用场景</h4><ul>${t.useCases.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
        }
        if (t.lists && t.lists.length) {
            html += `<div class="modal-section"><h4>要点</h4><ul>${t.lists.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
        }
        if (t.steps && t.steps.length) {
            html += `<div class="modal-section"><h4>操作步骤</h4><ul>${t.steps.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
        }
        if (t.chain && t.chain.length) {
            html += `<div class="modal-section"><h4>母带链条示例</h4><ul>${t.chain.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
        }
        if (t.modes && t.modes.length) {
            html += `<div class="modal-section"><h4>自动化模式</h4><ul>${t.modes.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
        }
        if (t.tips && t.tips.length) {
            html += `<div class="modal-section"><h4>实战技巧</h4><ul class="tips-list">${t.tips.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
        }

        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    function initModal() {
        document.getElementById('modalClose').addEventListener('click', closeModal);
        document.getElementById('modalOverlay').addEventListener('click', e => {
            if (e.target.id === 'modalOverlay') closeModal();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeModal();
        });
    }

    /* ========== 信号流向图 ========== */
    function renderSignalFlow() {
        const container = document.getElementById('signalFlow');
        const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;

        container.innerHTML = SIGNAL_FLOW_NODES.map((n, i) => {
            const nodeEl = `
                <div class="signal-node">
                    <div class="signal-node-box">
                        <div class="signal-node-icon">${n.icon}</div>
                        <div class="signal-node-name">${n.name}</div>
                        <div class="signal-node-en">${n.nameEn}</div>
                    </div>
                </div>
            `;
            if (i === SIGNAL_FLOW_NODES.length - 1) return nodeEl;
            return nodeEl + `<div class="signal-arrow">${arrow}</div>`;
        }).join('');
    }

    /* ========== 运作逻辑 Tabs ========== */
    let activeTabId = MECHANICS_TABS[0].id;

    function renderTabs() {
        const nav = document.getElementById('mechanicsTabs');
        nav.innerHTML = MECHANICS_TABS.map(tab => `
            <button class="tab-btn ${tab.id === activeTabId ? 'active' : ''}" data-id="${tab.id}">
                <span class="tab-btn-icon">${tab.icon}</span>
                <span>
                    <div style="font-weight:600;">${tab.name}</div>
                    <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);letter-spacing:1px;margin-top:2px;">${tab.nameEn}</div>
                </span>
            </button>
        `).join('');

        nav.addEventListener('click', e => {
            const btn = e.target.closest('.tab-btn');
            if (!btn) return;
            activeTabId = btn.dataset.id;
            nav.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.id === activeTabId));
            renderTabContent();
        });
    }

    function renderTabContent() {
        const tab = MECHANICS_TABS.find(t => t.id === activeTabId);
        const container = document.getElementById('mechanicsContent');

        let html = `
            <h3>${tab.name} <span class="title-gradient">${tab.nameEn}</span></h3>
            <div class="tab-subtitle">MODULE · ${tab.id.toUpperCase()}</div>
        `;

        tab.sections.forEach(sec => {
            html += `<div class="tab-section">`;
            html += `<div class="tab-section-title">${sec.title}</div>`;

            if (sec.paragraphs) sec.paragraphs.forEach(p => { html += `<p>${p}</p>`; });
            if (sec.lists) html += `<ul>${sec.lists.map(x => `<li>${x}</li>`).join('')}</ul>`;
            if (sec.steps) {
                html += `<div class="process-steps">${sec.steps.map(s => `
                    <div class="process-step">
                        <div class="step-num">${s.num}</div>
                        <div class="step-title">${s.title}</div>
                        <div class="step-desc">${s.desc}</div>
                    </div>
                `).join('')}</div>`;
            }
            if (sec.params) {
                html += `<div class="tab-params">${sec.params.map(p => `
                    <div class="param-item">
                        <div class="param-name">${p.name} <span class="param-range">${p.range}</span></div>
                        <div class="param-desc">${p.desc}</div>
                    </div>
                `).join('')}</div>`;
            }

            html += `</div>`;
        });

        container.innerHTML = html;
        container.style.animation = 'none';
        container.offsetHeight; // reflow
        container.style.animation = '';
    }

    /* ========== 历史时间线 ========== */
    function renderTimeline() {
        const container = document.getElementById('historyTimeline');
        container.innerHTML = HISTORY_TIMELINE.map(item => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-card">
                        <div class="timeline-year">${item.year}</div>
                        <div class="timeline-title">${item.title}</div>
                        <div class="timeline-era">▌ ${item.era}</div>
                        <p class="timeline-desc">${item.description}</p>
                        <div class="timeline-tags">
                            ${item.tags.map(t => `<span class="timeline-tag">#${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /* ========== DAW 卡片渲染 ========== */
    function renderDawCards() {
        const grid = document.getElementById('dawGrid');
        if (!grid) return;

        grid.innerHTML = DAW_DATA.map(daw => {
            const imgUrl = `images/daw/${daw.id}.jpg`;
            return `
                <div class="daw-card glass" style="--daw-color: ${daw.color};">
                    <div class="daw-image" style="background: linear-gradient(135deg, ${daw.color}22, transparent);">
                        <img src="${imgUrl}" alt="${daw.name} interface" loading="lazy" onerror="this.style.display='none'">
                        <div class="daw-icon" style="color: ${daw.color};">${daw.icon}</div>
                    </div>
                    <div class="daw-body">
                        <h3 class="daw-name" style="color: ${daw.color};">${daw.name}</h3>
                        <p class="daw-desc">${daw.desc}</p>
                        <div class="daw-meta">
                            <span class="daw-meta-item"><strong>开发商</strong> ${daw.developer}</span>
                            <span class="daw-meta-item"><strong>平台</strong> ${daw.platform}</span>
                            <span class="daw-meta-item"><strong>价格</strong> ${daw.price}</span>
                        </div>
                        <div class="daw-features">
                            ${daw.features.map(f => `<div class="daw-feature"><span class="daw-bullet" style="background: ${daw.color};">▸</span> ${f}</div>`).join('')}
                        </div>
                        <div class="daw-footer">
                            <span class="daw-best" style="border-color: ${daw.color}; color: ${daw.color};">${daw.bestFor}</span>
                            <a href="${daw.website}" target="_blank" rel="noopener" class="daw-link" style="border-color: ${daw.color}; color: ${daw.color};">官网 ↗</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ========== 混音师卡片渲染 ========== */
    function renderEngineerCards() {
        const grid = document.getElementById('engineerGrid');
        if (!grid) return;

        grid.innerHTML = ENGINEERS_DATA.map(eng => {
            const imgUrl = `images/engineers/${eng.id}.jpg`;
            return `
                <div class="engineer-card glass">
                    <div class="engineer-image">
                        <img src="${imgUrl}" alt="${eng.name}" loading="lazy" onerror="this.style.display='none'">
                        <div class="engineer-overlay"></div>
                    </div>
                    <div class="engineer-body">
                        <h3 class="engineer-name">${eng.name}</h3>
                        <span class="engineer-name-cn">${eng.nameCn}</span>
                        <div class="engineer-tags">
                            <span class="engineer-tag">${eng.specialty}</span>
                            <span class="engineer-tag">${eng.era}</span>
                            <span class="engineer-tag">${eng.location}</span>
                        </div>
                        <p class="engineer-desc">${eng.desc}</p>
                        <div class="engineer-section">
                            <strong>代表性作品</strong>
                            <ul class="engineer-works">
                                ${eng.works.map(w => `<li>${w}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="engineer-sig">
                            <strong>标志性手法</strong>
                            <span>${eng.signature}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ========== 启动 ========== */
    document.addEventListener('DOMContentLoaded', () => {
        initParticles();
        initNavbar();
        renderAlphabetNav();
        renderTerminologyCards();
        initCategoryFilters();
        initSearch();
        initModal();
        renderSignalFlow();
        renderTabs();
        renderTabContent();
        renderTimeline();
        renderDawCards();
        renderEngineerCards();
    });
})();
