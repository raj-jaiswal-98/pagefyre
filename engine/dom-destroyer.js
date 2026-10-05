/**
 * Warzone Web Destroyer - Realistic DOM Devastation Engine
 * Converts any website into an interactive warzone with:
 * - Specific Titan target preferences (Ads, Logos, Images, Headings, Tables, Text, Lists)
 * - Proximity-based hunting across full document space
 * - Burning images & sections (charred shaders, ash particles, flame glow)
 * - Devouring / eating images (jagged bite masks, chew compression, acid drip)
 * - Throwing titles / headings (converts to rigid physics bodies with velocity & torque)
 * - Force crush / compression (implosive singularity & debris explosion)
 * - Laser slicing (diagonal bisection into falling molten halves)
 * - Clean site rebuild / restoration
 */

class WarzoneDOMDestroyer {
  constructor() {
    this.originalStateMap = new Map();
    this.destroyedCount = 0;
    this.totalDamageDealt = 0;
    this.chaosScore = 0;
  }

  /**
   * Scans document for prime targets with comprehensive selector and full-page sector support
   */
  findTargets(nearX = null, nearY = null, searchRadius = 2400, monsterId = null, minY = null, maxY = null) {
    const selector = [
      'h1, h2, h3, h4, h5, h6, .mw-headline, header, .title', // Headings
      'img, picture, svg, video, figure, .thumb, .media, [role="img"]', // Images
      '[class*="logo" i], [id*="logo" i], .brand, .site-logo, header svg, header img', // Logos
      '[class*="ad" i], [id*="ad" i], [class*="sponsor" i], .ad-slot, ins, iframe, .advertisement, [aria-label*="advertisement" i]', // Ads
      'table, tbody, .infobox, .card, article, section, aside, .sidebar', // Tables & Containers
      'p, blockquote, pre, .description, .content, .mw-parser-output > p', // Text
      'ul, ol, li, .badge, .tag, .chip', // Lists & Tags
      'button, a.btn, [role="button"], input[type="submit"]', // Buttons
      'input, form, textarea, code, nav, footer' // Interactive & Layout
    ].join(', ');

    const candidates = Array.from(document.querySelectorAll(selector));

    const validTargets = candidates.filter(el => {
      if (
        el.closest('#warzone-hud') ||
        el.closest('#warzone-particle-canvas') ||
        el.closest('#warzone-monster-canvas') ||
        el.closest('#warzone-rebuilt-realm') ||
        el.closest('.warzone-ignored') ||
        el.closest('.wz-building-card') ||
        el.closest('.wz-hero-poster') ||
        el.closest('.wz-dominion-road') ||
        el.closest('.wz-party-dancefloor') ||
        el.classList.contains('warzone-ignored') ||
        el.classList.contains('warzone-clone')
      ) {
        return false;
      }
      if (el.dataset.warzoneDestroyed === 'true' || el.dataset.warzoneTargeted === 'locked') {
        return false;
      }
      // If claimed by another monster, skip if possible to prevent dogpiling
      if (monsterId && el.dataset.warzoneClaimedBy && el.dataset.warzoneClaimedBy !== monsterId) {
        return false;
      }

      try {
        const rect = el.getBoundingClientRect();
        if (rect.width < 14 || rect.height < 10) return false;

        const elDocX = rect.left + window.scrollX;
        const elDocY = rect.top + window.scrollY;

        // Check vertical sector limits if assigned
        if (minY !== null && maxY !== null) {
          if (elDocY < minY - 200 || elDocY > maxY + 200) {
            return false;
          }
        }

        // Proximity filtering if radius provided
        if (nearX !== null && nearY !== null && searchRadius !== null) {
          const dist = Math.hypot(elDocX - nearX, elDocY - nearY);
          if (dist > searchRadius) return false;
        }

        const style = typeof window.getComputedStyle === 'function' ? window.getComputedStyle(el) : (el.style || {});
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      } catch (e) {
        return false;
      }
    });

    return validTargets;
  }

  /**
   * Returns a target matching the specific Monster preference and designated sector, or closest fallback
   */
  getRandomTarget(preferredType = null, monsterX = null, monsterY = null, monsterId = null, minY = null, maxY = null) {
    // 1. Try finding within designated sector & proximity with no other monster claims
    let candidates = this.findTargets(monsterX, monsterY, 2200, monsterId, minY, maxY);

    // 2. If no sector targets, expand to full page for this monster
    if (candidates.length === 0) {
      candidates = this.findTargets(monsterX, monsterY, 3500, monsterId, null, null);
    }

    // 3. Fallback: Search entire document without claim restrictions
    if (candidates.length === 0) {
      candidates = this.findTargets(null, null, null, null, null, null);
    }
    if (candidates.length === 0) return null;

    let matches = [];

    switch (preferredType) {
      // 1. Mecha: Targets Advertisements, Banners, Sponsors & Inputs
      case 'ad':
        matches = candidates.filter(el =>
          /ad|sponsor|banner|promo|commercial/i.test(el.className + ' ' + el.id) ||
          el.tagName === 'IFRAME' ||
          el.tagName === 'INS' ||
          el.tagName === 'BUTTON'
        );
        break;

      // 2. Kong: Targets Logos, Brand Emblems & Header Icons
      case 'logo':
        matches = candidates.filter(el =>
          /logo|brand|emblem|icon/i.test(el.className + ' ' + el.id) ||
          (el.tagName === 'IMG' && el.closest('header, nav, .navbar')) ||
          (el.tagName === 'SVG' && el.closest('header, nav, .navbar'))
        );
        break;

      // 3. Dragon: Targets Images, Pictures, Figures & Galleries
      case 'image':
        matches = candidates.filter(el =>
          el.tagName === 'IMG' ||
          el.tagName === 'PICTURE' ||
          el.tagName === 'FIGURE' ||
          el.tagName === 'SVG' ||
          /thumb|gallery|photo|avatar/i.test(el.className)
        );
        break;

      // 4. Vader: Targets Headings, Titles & Navigation Headers
      case 'heading':
        matches = candidates.filter(el =>
          /^H[1-6]$/i.test(el.tagName) ||
          /title|headline|header|lead/i.test(el.className)
        );
        break;

      // 5. Godzilla: Targets Tables, Data Grids, Sidebars & Big Containers
      case 'table':
        matches = candidates.filter(el =>
          el.tagName === 'TABLE' ||
          el.tagName === 'TBODY' ||
          el.tagName === 'ASIDE' ||
          /infobox|sidebar|panel|card|table|grid/i.test(el.className)
        );
        break;

      // 6. Cthulhu: Targets Paragraphs, Blockquotes & Long Text
      case 'text':
        matches = candidates.filter(el =>
          el.tagName === 'P' ||
          el.tagName === 'BLOCKQUOTE' ||
          el.tagName === 'PRE' ||
          el.tagName === 'CODE' ||
          /content|article|text/i.test(el.className)
        );
        break;

      // 7. Cerberus: Targets Lists, Badges & Tags
      case 'list':
        matches = candidates.filter(el =>
          el.tagName === 'UL' ||
          el.tagName === 'OL' ||
          el.tagName === 'LI' ||
          /badge|tag|chip|item/i.test(el.className)
        );
        break;

      // 8. Thor: Targets Buttons, Nav Links & Action Bars
      case 'ui':
        matches = candidates.filter(el =>
          el.tagName === 'BUTTON' ||
          el.tagName === 'A' ||
          el.tagName === 'HEADER' ||
          /btn|nav|toolbar|action/i.test(el.className)
        );
        break;

      // 9. Iron Man: Targets Tech Inputs, Search Bars, Forms & Code
      case 'tech':
        matches = candidates.filter(el =>
          el.tagName === 'INPUT' ||
          el.tagName === 'FORM' ||
          el.tagName === 'TEXTAREA' ||
          el.tagName === 'CODE' ||
          el.tagName === 'PRE' ||
          /search|form|code|terminal|query|input/i.test(el.className + ' ' + el.id)
        );
        break;

      // 10. Spider-Man: Targets Navigation Menus, Breadcrumbs, Links & Headers
      case 'nav':
        matches = candidates.filter(el =>
          el.tagName === 'NAV' ||
          el.tagName === 'A' ||
          /nav|menu|breadcrumb|link|header|toc/i.test(el.className + ' ' + el.id) ||
          el.closest('nav, .navbar, .menu')
        );
        break;

      // 11. Batman: Targets Footers, Dark Cards, Containers & Modals
      case 'dark':
        matches = candidates.filter(el =>
          el.tagName === 'FOOTER' ||
          el.tagName === 'SECTION' ||
          el.tagName === 'ASIDE' ||
          /footer|card|dark|modal|sidebar|container|panel/i.test(el.className + ' ' + el.id)
        );
        break;

      // 12. Flash: Targets Rapid Navigation, Fast Links, Breadcrumbs & Carousels
      case 'fast':
        matches = candidates.filter(el =>
          el.tagName === 'A' ||
          /fast|quick|carousel|slider|speed|track|nav|crumb/i.test(el.className + ' ' + el.id)
        );
        break;

      // 13. Superman: Targets Hero Headers, Massive Banners & Skylines
      case 'heroic':
        matches = candidates.filter(el =>
          /^H[1-3]$/i.test(el.tagName) ||
          /hero|banner|jumbotron|lead|headline|title/i.test(el.className + ' ' + el.id)
        );
        break;

      // 14. Shaktiman: Targets Meditative Blocks, Quotes, Centered Articles & Footers
      case 'spiritual':
        matches = candidates.filter(el =>
          el.tagName === 'BLOCKQUOTE' ||
          el.tagName === 'P' ||
          /quote|center|manifesto|mission|about|truth|wisdom/i.test(el.className + ' ' + el.id)
        );
        break;

      // 15. Odessa: Targets Heavy Cards, Sidebars, Grids & Machine Panels
      case 'heavy':
        matches = candidates.filter(el =>
          el.tagName === 'ASIDE' ||
          el.tagName === 'SECTION' ||
          /card|box|panel|metal|heavy|sidebar|widget|grid/i.test(el.className + ' ' + el.id)
        );
        break;

      // 16. Doraemon: Targets Playful Widgets, Buttons, Icons, Popups & Dialogs
      case 'gadget':
        matches = candidates.filter(el =>
          el.tagName === 'BUTTON' ||
          el.tagName === 'DIALOG' ||
          /btn|icon|badge|popup|modal|gadget|tool|dropdown|select/i.test(el.className + ' ' + el.id)
        );
        break;

      // 17. Messi: Targets Precision Badges, Golden Cards, Media & Images
      case 'precision':
        matches = candidates.filter(el =>
          el.tagName === 'IMG' ||
          el.tagName === 'FIGURE' ||
          /card|badge|trophy|gold|star|thumb|media|spotlight/i.test(el.className + ' ' + el.id)
        );
        break;

      // 18. Ronaldo: Targets Action Buttons, High Scores, Stats & Leaders
      case 'striker':
        matches = candidates.filter(el =>
          el.tagName === 'BUTTON' ||
          /^H[1-4]$/i.test(el.tagName) ||
          /stat|score|number|leader|champion|btn|counter|metric/i.test(el.className + ' ' + el.id)
        );
        break;

      // 19. Goku: Targets High-Impact Hero Sections, Primary Headings & Main Containers
      case 'saiyan':
        matches = candidates.filter(el =>
          /^H[1-3]$/i.test(el.tagName) ||
          el.tagName === 'MAIN' ||
          el.tagName === 'SECTION' ||
          /hero|banner|titan|power|main|highlight|featured/i.test(el.className + ' ' + el.id)
        );
        break;

      // 20. Krrish: Targets Elevated Headers, Navigation Bars, Skyscraper Banners & Bio-Tech Labs
      case 'krrish':
        matches = candidates.filter(el =>
          /^H[1-4]$/i.test(el.tagName) ||
          el.tagName === 'NAV' ||
          el.tagName === 'HEADER' ||
          /sky|hero|top|nav|header|elevat|tower|lab|tech/i.test(el.className + ' ' + el.id)
        );
        break;

      // 21. Ben 10: Targets Interactive Widgets, Controls, Alien Technology & Dynamic Components
      case 'alien':
        matches = candidates.filter(el =>
          el.tagName === 'BUTTON' ||
          el.tagName === 'INPUT' ||
          el.tagName === 'FORM' ||
          /widget|control|dial|tech|alien|device|gear|btn/i.test(el.className + ' ' + el.id)
        );
        break;

      // 22. Ajay Devgn: Targets Luxury Brands, Vehicle Showrooms, Police Stunt Arenas & Saffron Headlines
      case 'kesari':
        matches = candidates.filter(el =>
          el.tagName === 'ARTICLE' ||
          el.tagName === 'SECTION' ||
          /^H[1-4]$/i.test(el.tagName) ||
          /card|brand|gold|car|auto|drive|luxury|kesari|police|stunt/i.test(el.className + ' ' + el.id)
        );
        break;

      // 23. Salman Khan: Targets Muscle Gyms, Vehicles, VIP Lounges & Bold Hero Banners
      case 'bhaijaan':
        matches = candidates.filter(el =>
          el.tagName === 'SECTION' ||
          /^H[1-3]$/i.test(el.tagName) ||
          /hero|vip|gym|muscle|tiger|drive|suv|power|banner/i.test(el.className + ' ' + el.id)
        );
        break;

      // 24. Akshay Kumar: Targets Action Buttons, Stunt Cards & Financial / Multiplier Headers
      case 'khiladi':
        matches = candidates.filter(el =>
          el.tagName === 'BUTTON' ||
          /^H[1-4]$/i.test(el.tagName) ||
          /action|stunt|kick|card|btn|invest|gold|double/i.test(el.className + ' ' + el.id)
        );
        break;

      // 25. Katrina Kaif: Targets Fashion Cards, Video Players, Dance Widgets & Media Containers
      case 'diva':
        matches = candidates.filter(el =>
          el.tagName === 'IMG' ||
          el.tagName === 'VIDEO' ||
          /card|fashion|media|dance|glam|video|star/i.test(el.className + ' ' + el.id)
        );
        break;

      // 26. Aishwarya Rai: Targets Royal Cosmetics, Luxury Brands & Emerald/Gold Layout Elements
      case 'queen':
        matches = candidates.filter(el =>
          el.tagName === 'HEADER' ||
          el.tagName === 'ARTICLE' ||
          /brand|luxury|royal|queen|gold|beauty|crown/i.test(el.className + ' ' + el.id)
        );
        break;

      // 27. Baalveer: Targets Fantasy Headers, Children / Games Sections & Navbars
      case 'fairy':
        matches = candidates.filter(el =>
          el.tagName === 'NAV' ||
          /^H[1-4]$/i.test(el.tagName) ||
          /fun|game|magic|fairy|hero|nav|star/i.test(el.className + ' ' + el.id)
        );
        break;
    }

    // If preferred matches found, sort by proximity to monster if coords provided
    const pool = (matches.length > 0) ? matches : candidates;
    let chosen = null;

    if (monsterX !== null && monsterY !== null) {
      pool.sort((a, b) => {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const da = Math.hypot((ra.left + window.scrollX) - monsterX, (ra.top + window.scrollY) - monsterY);
        const db = Math.hypot((rb.left + window.scrollX) - monsterX, (rb.top + window.scrollY) - monsterY);
        return da - db;
      });
      // Pick randomly from top 2 closest to maintain high pace without overlapping
      const topCount = Math.min(2, pool.length);
      chosen = pool[Math.floor(Math.random() * topCount)];
    } else {
      chosen = pool[Math.floor(Math.random() * pool.length)];
    }

    if (chosen && monsterId) {
      chosen.dataset.warzoneClaimedBy = monsterId;
    }

    return chosen;
  }

  /**
   * Releases DOM claim lock for a monster so other monsters can target freely
   */
  releaseClaim(monsterId) {
    if (!monsterId) return;
    try {
      document.querySelectorAll(`[data-warzone-claimed-by="${monsterId}"]`).forEach(el => {
        delete el.dataset.warzoneClaimedBy;
      });
    } catch (e) {}
  }

  /**
   * Cleaves / destroys 1-2 adjacent sibling elements for ultra-fast blitz devastation
   */
  cleaveNearbyElements(mainEl, damage = 220, monster = null, radius = 240) {
    if (!mainEl || !mainEl.getBoundingClientRect) return;
    try {
      const mainRect = mainEl.getBoundingClientRect();
      const mainCx = mainRect.left + window.scrollX + mainRect.width / 2;
      const mainCy = mainRect.top + window.scrollY + mainRect.height / 2;

      // Find sibling or child elements within cleave radius
      const parent = mainEl.parentElement || document.body;
      const siblings = Array.from(parent.children).filter(el => {
        if (
          el === mainEl ||
          el.dataset.warzoneDestroyed === 'true' ||
          el.closest('#warzone-rebuilt-realm') ||
          el.closest('.warzone-ignored') ||
          el.classList.contains('warzone-ignored') ||
          el.classList.contains('warzone-clone')
        ) return false;
        try {
          const r = el.getBoundingClientRect();
          const cx = r.left + window.scrollX + r.width / 2;
          const cy = r.top + window.scrollY + r.height / 2;
          return Math.hypot(cx - mainCx, cy - mainCy) <= radius;
        } catch (e) {
          return false;
        }
      });

      const cleaveCount = Math.min(2, siblings.length);
      for (let i = 0; i < cleaveCount; i++) {
        const sib = siblings[i];
        const subDmg = Math.floor(damage * 0.75);
        setTimeout(() => {
          if (sib && sib.dataset.warzoneDestroyed !== 'true') {
            const types = ['burn', 'slice', 'crush'];
            const pick = types[Math.floor(Math.random() * types.length)];
            if (pick === 'burn') this.burnElement(sib, subDmg, monster);
            else if (pick === 'slice') this.sliceElement(sib, subDmg, monster);
            else this.crushElement(sib, subDmg, monster);
          }
        }, 120 * (i + 1));
      }
    } catch (e) {}
  }

  releaseClaim(monsterId) {
    if (!monsterId) return;
    try {
      const claimed = document.querySelectorAll(`[data-warzone-claimed-by="${monsterId}"]`);
      claimed.forEach(el => {
        if (el.dataset.warzoneDestroyed !== 'true') {
          delete el.dataset.warzoneClaimedBy;
        }
      });
    } catch (e) {}
  }

  saveElementState(el) {
    if (!this.originalStateMap.has(el)) {
      this.originalStateMap.set(el, {
        styleText: el.getAttribute('style') || '',
        classList: Array.from(el.classList),
        parent: el.parentNode,
        nextSibling: el.nextSibling,
        innerHTML: el.innerHTML,
        tagName: el.tagName
      });
    }
  }

  registerDamage(damage, el, actionName, monster) {
    this.totalDamageDealt += damage;
    this.destroyedCount++;
    this.chaosScore += Math.floor(damage * 1.5);

    try {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + window.scrollX + rect.width / 2;
      const cy = rect.top + window.scrollY + rect.height / 2;
    } catch (e) {}

    if (window.WarzoneHUD) {
      window.WarzoneHUD.updateStats({
        destroyedCount: this.destroyedCount,
        totalDamage: this.totalDamageDealt,
        chaosScore: this.chaosScore
      });
      const tag = el.tagName || 'ELEMENT';
      const textPreview = el.innerText ? `: "${el.innerText.slice(0, 18).trim()}..."` : '';
      window.WarzoneHUD.logKillFeed(monster ? monster.name : 'Unknown Beast', actionName, tag + textPreview);
    }
  }

  /**
   * 1. BURNING: Fire breath or missiles char the element and dissolve it in flames
   */
  burnElement(el, damage = 350, monster = null) {
    if (!el || el.dataset.warzoneDestroyed === 'true' || el.closest('#warzone-rebuilt-realm') || el.closest('.warzone-ignored')) return;
    this.saveElementState(el);
    el.dataset.warzoneDestroyed = 'true';

    try {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + window.scrollX + rect.width / 2;
      const cy = rect.top + window.scrollY + rect.height / 2;

      if (window.WarzoneSFX) window.WarzoneSFX.play('dragon_fire');
      if (window.WarzoneParticles) {
        window.WarzoneParticles.createFlameCone(cx - 80, cy, cx + 80, cy, 30);
        window.WarzoneParticles.triggerScreenShake(6, 400);
      }

      el.classList.add('warzone-burning-fx');
      el.style.setProperty('transition', 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)', 'important');
      el.style.setProperty('filter', 'contrast(180%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) blur(1px)', 'important');
      el.style.setProperty('box-shadow', '0 0 35px #ff4400, inset 0 0 30px #ff2200', 'important');
      el.style.setProperty('transform', 'scale(0.96) skewX(-2deg)', 'important');

      setTimeout(() => {
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('transform', 'scale(0.7) translateY(20px) rotate(4deg)', 'important');
        if (window.WarzoneParticles) {
          window.WarzoneParticles.createDebrisShower(cx, cy, 15);
        }
      }, 1100);

      setTimeout(() => {
        el.style.setProperty('visibility', 'hidden', 'important');
      }, 1800);
    } catch (e) {}

    this.registerDamage(damage, el, 'Incinerated', monster);
  }

  /**
   * 2. EATING: Dragons or Cthulhu taking massive bite bites out of images/media
   */
  eatElement(el, damage = 420, monster = null) {
    if (!el || el.dataset.warzoneDestroyed === 'true' || el.closest('#warzone-rebuilt-realm') || el.closest('.warzone-ignored')) return;
    this.saveElementState(el);
    el.dataset.warzoneDestroyed = 'true';

    try {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + window.scrollX + rect.width / 2;
      const cy = rect.top + window.scrollY + rect.height / 2;

      if (window.WarzoneSFX) window.WarzoneSFX.play('dragon_chomp');
      if (window.WarzoneParticles) {
        window.WarzoneParticles.createSparkExplosion(cx, cy, '#ff0055', 25);
        window.WarzoneParticles.triggerScreenShake(9, 300);
      }

      el.classList.add('warzone-eaten-fx');
      el.style.setProperty('transition', 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 'important');
      el.style.setProperty('clip-path', 'polygon(0% 0%, 45% 15%, 55% 45%, 70% 20%, 100% 0%, 100% 100%, 75% 70%, 45% 85%, 25% 65%, 0% 100%)', 'important');
      el.style.setProperty('transform', 'scale(0.85) rotate(-8deg)', 'important');
      el.style.setProperty('filter', 'hue-rotate(90deg) contrast(150%)', 'important');

      setTimeout(() => {
        if (window.WarzoneSFX) window.WarzoneSFX.play('dragon_chomp');
        el.style.setProperty('clip-path', 'polygon(20% 30%, 50% 50%, 80% 30%, 70% 70%, 30% 70%)', 'important');
        el.style.setProperty('transform', 'scale(0.4) rotate(15deg)', 'important');
      }, 450);

      setTimeout(() => {
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('transform', 'scale(0.01)', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
      }, 900);
    } catch (e) {}

    this.registerDamage(damage, el, 'Devoured', monster);
  }

  /**
   * 3. THROWING: Snatches or telekinetically hurls titles/headings into rigid body physics!
   */
  throwElement(el, damage = 380, monster = null) {
    if (!el || el.dataset.warzoneDestroyed === 'true' || el.closest('#warzone-rebuilt-realm') || el.closest('.warzone-ignored')) return;
    this.saveElementState(el);
    el.dataset.warzoneDestroyed = 'true';

    try {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + window.scrollX;
      const cy = rect.top + window.scrollY;

      const comp = window.getComputedStyle(el);

      // Clone element as standalone physics object
      const clone = el.cloneNode(true);
      clone.classList.add('warzone-clone');
      clone.style.width = `${Math.max(60, rect.width)}px`;
      clone.style.height = `${Math.max(30, rect.height)}px`;
      clone.style.margin = '0';
      clone.style.boxSizing = 'border-box';
      clone.style.overflow = 'hidden';
      clone.style.boxShadow = '0 10px 30px rgba(0,0,0,0.7)';
      clone.style.background = comp.backgroundColor !== 'rgba(0, 0, 0, 0)' && comp.backgroundColor !== 'transparent'
        ? comp.backgroundColor 
        : '#181b2a';
      clone.style.color = comp.color || '#ffffff';
      clone.style.fontSize = comp.fontSize || '16px';
      clone.style.fontFamily = comp.fontFamily || 'sans-serif';
      clone.style.fontWeight = comp.fontWeight || 'bold';
      clone.style.borderRadius = '8px';
      clone.style.padding = '8px 12px';
      clone.style.border = '2px dashed #ff0055';
      clone.style.zIndex = '2147483644';

      (document.body || document.documentElement).appendChild(clone);

      // Hide original element in DOM flow
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('opacity', '0', 'important');

      if (window.WarzoneSFX) window.WarzoneSFX.play('dragon_throw');
      if (window.WarzoneParticles) {
        window.WarzoneParticles.createSparkExplosion(cx + rect.width / 2, cy, '#ffff00', 15);
      }

      // Launch with high velocity and spin
      const angle = (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 25);
      const speedX = (Math.random() - 0.5) * 35;
      const speedY = -18 - Math.random() * 12;

      if (window.WarzonePhysics) {
        window.WarzonePhysics.addBody({
          element: clone,
          x: cx,
          y: cy,
          vx: speedX,
          vy: speedY,
          angle: 0,
          vAngle: angle,
          width: rect.width,
          height: rect.height,
          shatterOnFloor: true,
          lifetime: 8000
        });
      }
    } catch (e) {}

    this.registerDamage(damage, el, 'Hurled Away', monster);
  }

  /**
   * 4. FORCE CRUSH / COMPRESSION: Darth Vader Force Choke or Kaiju seismic stomp
   */
  crushElement(el, damage = 450, monster = null) {
    if (!el || el.dataset.warzoneDestroyed === 'true' || el.closest('#warzone-rebuilt-realm') || el.closest('.warzone-ignored')) return;
    this.saveElementState(el);
    el.dataset.warzoneDestroyed = 'true';

    try {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + window.scrollX + rect.width / 2;
      const cy = rect.top + window.scrollY + rect.height / 2;

      if (window.WarzoneSFX) window.WarzoneSFX.play('force_crush');
      if (window.WarzoneParticles) {
        window.WarzoneParticles.createLightning(cx - 60, cy - 40, cx + 60, cy + 40, monster ? monster.themeColor : '#ff0033', 4, 800);
        window.WarzoneParticles.triggerScreenShake(8, 600);
      }

      el.classList.add('warzone-crush-fx');
      el.style.setProperty('transition', 'all 0.9s cubic-bezier(0.6, -0.28, 0.735, 0.045)', 'important');
      el.style.setProperty('filter', 'invert(80%) drop-shadow(0 0 20px #ff0055)', 'important');
      el.style.setProperty('transform', 'scale(0.8) skew(15deg, 15deg)', 'important');

      setTimeout(() => {
        el.style.setProperty('transform', 'scale(0.05) rotate(360deg)', 'important');
        el.style.setProperty('opacity', '0', 'important');
        if (window.WarzoneSFX) window.WarzoneSFX.play('explosion');
        if (window.WarzoneParticles) {
          window.WarzoneParticles.createSparkExplosion(cx, cy, monster ? monster.themeColor : '#ff0033', 40);
          window.WarzoneParticles.createDebrisShower(cx, cy, 25);
        }
      }, 700);

      setTimeout(() => {
        el.style.setProperty('visibility', 'hidden', 'important');
      }, 1200);
    } catch (e) {}

    this.registerDamage(damage, el, 'Force Crushed', monster);
  }

  /**
   * 5. LASER SLICE: Godzilla atomic ray, Vader lightsaber, or Mecha plasma blade
   */
  sliceElement(el, damage = 400, monster = null) {
    if (!el || el.dataset.warzoneDestroyed === 'true' || el.closest('#warzone-rebuilt-realm') || el.closest('.warzone-ignored')) return;
    this.saveElementState(el);
    el.dataset.warzoneDestroyed = 'true';

    try {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + window.scrollX;
      const cy = rect.top + window.scrollY;
      const midX = cx + rect.width / 2;
      const midY = cy + rect.height / 2;

      if (window.WarzoneSFX) window.WarzoneSFX.play(monster?.id === 'godzilla' ? 'godzilla_laser' : 'saber_slash');
      if (window.WarzoneParticles) {
        window.WarzoneParticles.createLaserBeam(midX - 200, midY - 100, midX + 200, midY + 100, monster ? monster.themeColor : '#00f0ff', '#ffffff', 450, 16);
      }

      // Create 2 sliced halves with clip-path
      const half1 = el.cloneNode(true);
      const half2 = el.cloneNode(true);

      half1.classList.add('warzone-clone');
      half1.style.position = 'absolute';
      half1.style.left = `${cx}px`;
      half1.style.top = `${cy}px`;
      half1.style.width = `${rect.width}px`;
      half1.style.height = `${rect.height}px`;
      half1.style.margin = '0';
      half1.style.zIndex = '2147483643';
      half1.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 45%, 0% 65%)';
      half1.style.boxShadow = '0 0 15px ' + (monster ? monster.themeColor : '#00f0ff');
      half1.style.pointerEvents = 'none';

      half2.classList.add('warzone-clone');
      half2.style.position = 'absolute';
      half2.style.left = `${cx}px`;
      half2.style.top = `${cy}px`;
      half2.style.width = `${rect.width}px`;
      half2.style.height = `${rect.height}px`;
      half2.style.margin = '0';
      half2.style.zIndex = '2147483643';
      half2.style.clipPath = 'polygon(0% 65%, 100% 45%, 100% 100%, 0% 100%)';
      half2.style.boxShadow = '0 0 15px ' + (monster ? monster.themeColor : '#00f0ff');
      half2.style.pointerEvents = 'none';

      (document.body || document.documentElement).appendChild(half1);
      (document.body || document.documentElement).appendChild(half2);

      el.style.setProperty('visibility', 'hidden', 'important');

      // Slide halves apart
      if (window.WarzonePhysics) {
        window.WarzonePhysics.addBody({
          element: half1,
          x: cx,
          y: cy,
          vx: -6,
          vy: -4,
          angle: 0,
          vAngle: -8,
          width: rect.width,
          height: rect.height,
          shatterOnFloor: true
        });

        window.WarzonePhysics.addBody({
          element: half2,
          x: cx,
          y: cy,
          vx: 6,
          vy: 2,
          angle: 0,
          vAngle: 8,
          width: rect.width,
          height: rect.height,
          shatterOnFloor: true
        });
      }
    } catch (e) {}

    this.registerDamage(damage, el, 'Laser Bisected', monster);
  }

  /**
   * Rebuilds the devastated website into a thematic civilization / headquarters based on winning species
   */
  /**
   * Rebuilds the entire website into a living, full-canvas Hero & Species Controlled Base
   * Transforms the whole site with roads, houses, barracks, temples, glowing posters, watchtowers & party banquets!
   */
  rebuildSiteThematically(species, monster = null) {
    // Remove existing rebuilt realm if present
    const existing = document.getElementById('warzone-rebuilt-realm');
    if (existing) existing.remove();

    // Enable whole-site atmospheric dominion styling
    document.body.classList.add('wz-dominion-active');

    const color = monster ? monster.themeColor : '#ff0055';
    const name = monster ? monster.name : species.toUpperCase();

    const REALM_DATA = {
      vader: {
        title: 'IMPERIAL SITH CAPITAL & STAR FLEET CITADEL',
        subtitle: 'The galaxy is under Imperial Order. All rebellious DOM nodes have been subjugated into the Empire.',
        badge: 'GALACTIC SITH DOMINION',
        icon: '⚔️',
        bgGradient: 'linear-gradient(135deg, rgba(15, 0, 5, 0.98), rgba(45, 0, 10, 0.95), rgba(10, 0, 5, 0.98))',
        borderColor: '#ff0033',
        accentColor: '#ff4d6d',
        widgets: [
          { title: 'Death Star Superlaser Array', desc: 'Focusing planetary kyber-crystal beams across digital nodes', action: 'FIRE SUPERLASER' },
          { title: 'Sith Holocron Archives', desc: 'Forbidden Dark Side algorithmic knowledge and Sith doctrines', action: 'COMMUNE WITH SITH' },
          { title: 'Imperial Fleet Defense Grid', desc: 'Star Destroyers & TIE Interceptors patrolling high orbit', action: 'LAUNCH STAR DESTROYERS' }
        ],
        posters: [
          { title: 'ENLIST IN THE 501ST LEGION', sub: 'Peace Through Superior Firepower', quote: '“You don’t know the power of the Dark Side.”', bg: 'linear-gradient(135deg, #450a0a, #7f1d1d)', badge: 'RECRUITMENT' },
          { title: 'OBEY IMPERIAL ORDER', sub: 'Order • Security • Dominion', quote: '“The Force is with the Empire.”', bg: 'linear-gradient(135deg, #18181b, #3f3f46)', badge: 'DOCTRINE' },
          { title: 'TIE FIGHTER AEROSPACE', sub: 'Sub-light Twin Ion Precision', quote: '“Rule the skies of every domain.”', bg: 'linear-gradient(135deg, #1f1f23, #581c87)', badge: 'DEFENSE' }
        ],
        roads: [
          { name: 'Imperial Obsidian Expressway', vehicles: ['🚀 TIE Fighter', '🛸 Speeder Bike', '🚗 Imperial Shuttle', '🏎️ Sith Interceptor'] },
          { name: 'Coruscant Central Boulevard', vehicles: ['🚛 Armored Troop Transport', '🏎️ Imperial Cruiser', '🛸 Combat Speeder'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Dark Council Sith Temple', type: 'temple', pop: '+200 Sith Acolytes', desc: 'Chamber of Dark Side power & meditation' },
          { icon: '🛡️', name: '501st Stormtrooper Garrison', type: 'barracks', pop: '+500 Stormtroopers', desc: 'Heavy armor fabrication & shock trooper training' },
          { icon: '🏡', name: 'Imperial Officers Quarters', type: 'house', pop: '+150 Naval Commanders', desc: 'Luxury high-orbit residential pods' },
          { icon: '🔬', name: 'Kyber Weaponry Forge', type: 'lab', pop: '+80 Imperial Scientists', desc: 'Synthetic red lightsaber crystals & turbolasers' }
        ],
        watchtowers: [
          { name: 'Western Turbolaser Battery', icon: '🗼', status: 'Active (360° Arc)' },
          { name: 'Orbital Shield Generator', icon: '📡', status: 'Deflector 100%' },
          { name: 'Eastern TIE Hangar Outpost', icon: '🚀', status: 'Scramble Ready' }
        ]
      },
      captainamerica: {
        title: 'AVENGERS STRATEGIC HEADQUARTERS & LIBERTY CITADEL',
        subtitle: 'Freedom prevails! The First Avenger and the Howling Commandos have liberated and rebuilt this digital territory.',
        badge: 'AVENGERS COMMAND CENTER',
        icon: '🛡️',
        bgGradient: 'linear-gradient(135deg, rgba(3, 20, 45, 0.98), rgba(15, 35, 75, 0.95), rgba(5, 15, 30, 0.98))',
        borderColor: '#0284c7',
        accentColor: '#38bdf8',
        widgets: [
          { title: 'Vibranium Shield Armory', desc: 'Indestructible kinetic shock-absorbing shield pedestal', action: 'RICOCHET SHIELD' },
          { title: 'Strategic SSR War Room', desc: 'Holographic tactical map coordinating Avengers field units', action: 'COORDINATE STRIKE' },
          { title: '107th Infantry Memorial Hall', desc: 'Honor monument to legendary super-soldier regiments', action: 'SALUTE SQUAD' }
        ],
        posters: [
          { title: 'I CAN DO THIS ALL DAY', sub: 'Stand Strong • Protect the Innocent', quote: '“When the mob and the press tell you to move, plant yourself like a tree.”', bg: 'linear-gradient(135deg, #0c4a6e, #1e3a8a)', badge: 'RESOLVE' },
          { title: 'JOIN THE HOWLING COMMANDOS', sub: 'Elite Airborne & Special Operations', quote: '“Courage, honor, and unstoppable teamwork.”', bg: 'linear-gradient(135deg, #1e293b, #0f766e)', badge: 'RECRUITMENT' },
          { title: 'BROOKLYN FREEDOM RALLY', sub: '1940s Big Band Gala & Liberty Bonds', quote: '“For freedom, country, and our allies.”', bg: 'linear-gradient(135deg, #831843, #1e3a8a)', badge: 'COMMUNITY' }
        ],
        roads: [
          { name: 'Brooklyn Liberty Grand Avenue', vehicles: ['🚚 SSR Armored Truck', '🏍️ 1942 Harley Davidson', '🚙 Captain Jeep', '🚁 Avengers Quinjet'] },
          { name: 'Howling Commandos Transit Route', vehicles: ['🏍️ Military Sidecar', '🚚 Cargo Transport', '🚙 Tactical Humvee'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Smithsonian Avengers Monument', type: 'temple', pop: '+220 Historians & Heroes', desc: 'Eternal flame honoring wartime heroes' },
          { icon: '🛡️', name: 'Howling Commandos Barracks', type: 'barracks', pop: '+450 Special Rangers', desc: 'Physical endurance training & CQB tactical courses' },
          { icon: '🏡', name: 'Brooklyn Brownstone Apartments', type: 'house', pop: '+180 Veteran Families', desc: 'Warm community homes with rooftop gardens' },
          { icon: '🔬', name: 'Super-Soldier Research Lab', type: 'lab', pop: '+90 SSR Biochemists', desc: 'Cellular recovery & peak human enhancement' }
        ],
        watchtowers: [
          { name: 'North Radar Early-Warning Dish', icon: '📡', status: 'Scanning 1200km' },
          { name: 'Brooklyn Guard Bastion', icon: '🛡️', status: 'Perimeter Secured' },
          { name: 'Quinjet Launch Ramp', icon: '✈️', status: 'Hot Standby' }
        ]
      },
      hawkeye: {
        title: 'BARTON HOMESTEAD & RONIN ARCHERY SANCTUARY',
        subtitle: 'Every arrow hit the mark with pinpoint perfection. The Barton farmstead and master archery lodge is now the sovereign realm.',
        badge: 'RONIN MASTER SANCTUARY',
        icon: '🏹',
        bgGradient: 'linear-gradient(135deg, rgba(20, 5, 35, 0.98), rgba(40, 15, 60, 0.95), rgba(15, 5, 25, 0.98))',
        borderColor: '#9333ea',
        accentColor: '#c084fc',
        widgets: [
          { title: 'Trick Arrow Workshop', desc: 'Pym-particle, explosive & kinetic arrow crafting anvil', action: 'CRAFT ARROWS' },
          { title: 'Longbow Precision Range', desc: 'High-speed moving targets at 600 yard distances', action: 'PERFECT BULLSEYE' },
          { title: 'Ronin Katana Stand', desc: 'Folded Damascus steel blades sharpened for silent combat', action: 'UNSHEATHE BLADE' }
        ],
        posters: [
          { title: 'NEVER MISS A SHOT', sub: 'Master Marksmanship Academy', quote: '“If I pick up this bow and take aim, I don’t miss.”', bg: 'linear-gradient(135deg, #3b0764, #581c87)', badge: 'PRECISION' },
          { title: 'BARTON FARM BBQ & TARGET SHOOT', sub: 'Homestead Hospitality • Pizza Dog Approved', quote: '“Best smoked brisket in Iowa!”', bg: 'linear-gradient(135deg, #701a75, #831843)', badge: 'GATHERING' },
          { title: 'SHIELD SPECIAL RECON OPS', sub: 'Silent Infiltration & High Ground Mastery', quote: '“Always see everything from above.”', bg: 'linear-gradient(135deg, #1e1b4b, #312e81)', badge: 'TACTICAL' }
        ],
        roads: [
          { name: 'Iowa Farmstead Country Highway', vehicles: ['🛻 Barton Classic Pickup', '🏍️ Ronin Stealth Bike', '🚜 Farm Tractor', '🚙 SHIELD SUV'] },
          { name: 'Sniper Ridge Forest Pathway', vehicles: ['🏍️ Electric Dirtbike', '🛻 Quad Utility ATV', '🐕 Lucky Pizza Dog Cart'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Master Marksman Archery Shrine', type: 'temple', pop: '+160 Master Bowmen', desc: 'Hall of legendary recurve & compound bows' },
          { icon: '🛡️', name: 'SHIELD Black-Ops Archer Range', type: 'barracks', pop: '+380 Tactical Snipers', desc: 'Blindfold target practice & sonic fletching' },
          { icon: '🏡', name: 'Rustic Iowa Farmhouse & Cabins', type: 'house', pop: '+140 Farmsteader Families', desc: 'Warm cedar wood homes with cozy hearths' },
          { icon: '🔬', name: 'Pym Arrowhead Research Lab', type: 'lab', pop: '+75 Trick Arrow Engineers', desc: 'Micro-explosive & quantum shrinking arrowheads' }
        ],
        watchtowers: [
          { name: 'High Barn Vantage Lookout', icon: '🔭', status: 'Sniper Overwatch Ready' },
          { name: 'Perimeter Sensor Wire Net', icon: '⚡', status: 'Tripwire Armed' },
          { name: 'Forest Treeline Outpost', icon: '🌲', status: 'Concealed & Vigilant' }
        ]
      },
      blackwidow: {
        title: 'RED ROOM REDEMPTION & BUDAPEST SAFEHOUSE NETWORK',
        subtitle: 'The ledger is wiped clean. The world’s supreme infiltrator has seized complete control over the digital infrastructure.',
        badge: 'BLACK WIDOW SPECIAL OPS',
        icon: '🕷️',
        bgGradient: 'linear-gradient(135deg, rgba(30, 5, 10, 0.98), rgba(50, 10, 15, 0.95), rgba(20, 5, 8, 0.98))',
        borderColor: '#ef4444',
        accentColor: '#f87171',
        widgets: [
          { title: 'Widow’s Bite Gauntlet Charger', desc: '30,000-volt electro-shock tactical wrist chargers', action: 'CHARGE GAUNTLETS' },
          { title: 'Budapest Armory & Safehouse', desc: 'Dual Glock tactical pistols & high-velocity smoke canisters', action: 'RELOAD WEAPONS' },
          { title: 'Covert Satellite Uplink', desc: 'Encrypted global intelligence network interceptor', action: 'INTERCEPT INTEL' }
        ],
        posters: [
          { title: 'LEDGER WIPED CLEAN', sub: 'Redemption • Precision • Survival', quote: '“I’ve got red in my ledger, and I’d like to wipe it out.”', bg: 'linear-gradient(135deg, #450a0a, #881337)', badge: 'REDEMPTION' },
          { title: 'BLACK WIDOW TACTICAL ACADEMY', sub: 'Master Infiltration & Martial Arts', quote: '“You make your own choices.”', bg: 'linear-gradient(135deg, #18181b, #4c0519)', badge: 'TACTICAL' },
          { title: 'BUDAPEST SECRET AGENT SAFE', sub: 'Classified Rendezvous Point', quote: '“Just like Budapest all over again.”', bg: 'linear-gradient(135deg, #1f1f23, #7f1d1d)', badge: 'CLASSIFIED' }
        ],
        roads: [
          { name: 'Budapest Nighttime Expressway', vehicles: ['🏍️ Natasha Stealth Superbike', '🚗 Armored Safehouse Sedan', '🚁 Black Ops Chopper', '🏎️ Infiltration Coupe'] },
          { name: 'Covert Metro Tunnel Route', vehicles: ['🏎️ Electric Stealth Cart', '🏍️ Tactical Bike', '🚙 Diplomatic Armored SUV'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Sanctuary of Redemption', type: 'temple', pop: '+180 Liberated Operatives', desc: 'Sanctuary for former covert agents finding peace' },
          { icon: '🛡️', name: 'Elite Martial Arts Dojo', type: 'barracks', pop: '+420 Black Widow Operatives', desc: 'Acrobatic combat, baton sparring & grappling rigs' },
          { icon: '🏡', name: 'Budapest Apartment Suites', type: 'house', pop: '+160 Safehouse Allies', desc: 'Concealed luxury residences with hidden armories' },
          { icon: '🔬', name: 'Neuro-Tech Electro Lab', type: 'lab', pop: '+85 Bio-Tech Engineers', desc: 'Stun gauntlet voltage boosters & smoke synthesis' }
        ],
        watchtowers: [
          { name: 'Rooftop Thermal Drone Hub', icon: '🛰️', status: 'Thermal Grid 100%' },
          { name: 'Laser Tripwire Grid', icon: '🚨', status: 'Zero Blindspots' },
          { name: 'Silent Sniper Nest', icon: '🎯', status: 'Night-Vision Active' }
        ]
      },
      ironman: {
        title: 'STARK INDUSTRIES QUANTUM TOWER & HOLOGRAPHIC LAB',
        subtitle: 'Clean zero-emission energy initialized. Jarvis diagnostic algorithms online across the newly established metropolis.',
        badge: 'STARK METROPOLIS HQ',
        icon: '🦾',
        bgGradient: 'linear-gradient(135deg, rgba(5, 15, 40, 0.98), rgba(15, 35, 75, 0.95), rgba(5, 20, 45, 0.98))',
        borderColor: '#00f0ff',
        accentColor: '#38bdf8',
        widgets: [
          { title: 'Arc Reactor Clean Grid', desc: '3.5 Gigawatts of zero-emission quantum power distributed to all buildings', action: 'OVERCLOCK REACTOR' },
          { title: 'Mark-85 Nanotech Fabricator', desc: 'Synthesizing vibranium-titanium armor alloys on demand', action: 'DEPLOY NANOTECH DRONES' },
          { title: 'Jarvis Quantum Terminal', desc: 'Full heuristic analysis & structural optimization of site assets', action: 'RUN SYSTEM DIAGNOSTIC' }
        ],
        posters: [
          { title: 'I AM IRON MAN', sub: 'Innovate • Build • Protect', quote: '“Sometimes you gotta run before you can walk.”', bg: 'linear-gradient(135deg, #7f1d1d, #0369a1)', badge: 'GENIUS' },
          { title: 'STARK CLEAN ENERGY INITIATIVE', sub: 'Arc Reactor Zero-Carbon Future', quote: '“Clean energy for the whole world.”', bg: 'linear-gradient(135deg, #0f172a, #0284c7)', badge: 'TECHNOLOGY' },
          { title: 'MALIBU VIP PENTHOUSE GALA', sub: 'Champagne, Jazz & Hologram Shows', quote: '“Drinks on Stark Industries tonight!”', bg: 'linear-gradient(135deg, #1e1b4b, #991b1b)', badge: 'VIP LOUNGE' }
        ],
        roads: [
          { name: 'Stark Cyber-Superhighway', vehicles: ['🏎️ Audi R8 e-tron', '🚀 Iron Legion Drone', '🚗 Stark Concept Cruiser', '🛸 Nanotech Transport'] },
          { name: 'Arc Reactor Fiber Expressway', vehicles: ['🏎️ Electric Supercar', '🚀 Autonomous Courier', '🚙 Stark Security SUV'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Arc Reactor Power Shrine', type: 'temple', pop: '+250 Quantum Physicists', desc: 'Clean power core illuminating the whole district' },
          { icon: '🛡️', name: 'Iron Legion Drone Foundry', type: 'barracks', pop: '+600 Autonomous Suits', desc: 'Automated assembly line crafting Mark-85 armors' },
          { icon: '🏡', name: 'Malibu Seaside Smart Villas', type: 'house', pop: '+200 Tech Residents', desc: 'Holographic smart homes with glass floors' },
          { icon: '🔬', name: 'Jarvis AI Innovation Lab', type: 'lab', pop: '+120 Neural Programmers', desc: 'Quantum machine learning & hologram projectors' }
        ],
        watchtowers: [
          { name: 'Automated Repulsor Sentry Tower', icon: '⚡', status: 'Unibeam Charged' },
          { name: 'Hulkbuster Orbital Delivery Bay', icon: '🦾', status: 'Veronica in Orbit' },
          { name: 'Laser Defense Beacon', icon: '📡', status: 'Shields Online' }
        ]
      },
      spiderman: {
        title: 'FRIENDLY NEIGHBORHOOD WEB PARK & QUEENS HEADQUARTERS',
        subtitle: 'With great power comes awesome web playgrounds! Queens is fully safeguarded with web bridges and pizza stations.',
        badge: 'QUEENS WEB CAPITAL',
        icon: '🕷️',
        bgGradient: 'linear-gradient(135deg, rgba(35, 10, 20, 0.98), rgba(15, 25, 60, 0.95), rgba(25, 10, 30, 0.98))',
        borderColor: '#e63946',
        accentColor: '#f87171',
        widgets: [
          { title: 'High-Tensile Web Trampoline', desc: 'Acrobatic bounce platforms strung across the buildings', action: 'BOUNCE ON WEBS' },
          { title: 'Daily Bugle Photo Gallery', desc: 'Exclusive snapshots of Spider-Man saving the internet', action: 'TAKE HERO SNAP' },
          { title: 'Queens Pizza Slice Bar', desc: 'Hot wood-fired slices for friendly neighborhood heroes', action: 'ORDER PIZZA' }
        ],
        posters: [
          { title: 'FRIENDLY NEIGHBORHOOD HERO', sub: 'Queens Rooftop Guardian', quote: '“With great power comes great responsibility.”', bg: 'linear-gradient(135deg, #991b1b, #1e3a8a)', badge: 'HEROIC' },
          { title: 'DAILY BUGLE: SPIDER-MAN HERO!', sub: 'Exclusive Front-Page Feature', quote: '“He saved the whole web domain!”', bg: 'linear-gradient(135deg, #18181b, #b91c1c)', badge: 'HEADLINE' },
          { title: 'QUEENS ROOFTOP PIZZA PARTY', sub: 'Extra Cheese & Web Cotton Candy', quote: '“Hot slices for everybody!”', bg: 'linear-gradient(135deg, #7f1d1d, #1e40af)', badge: 'FEAST' }
        ],
        roads: [
          { name: 'Queens Rooftop Web-Line Expressway', vehicles: ['🛵 Pizza Delivery Scooter', '🕸️ Web-Swinging Tram', '🚙 NYPD Cruiser', '🚲 Courier Bike'] },
          { name: 'Midtown High School Boulevard', vehicles: ['🛹 Skater Squad', '🛵 Delivery Moped', '🚗 Brownstone Taxi'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Daily Bugle Press Temple', type: 'temple', pop: '+190 Photojournalists', desc: 'Rotary printing presses & photo development darkrooms' },
          { icon: '🛡️', name: 'Spider-Bot Drone Hangar', type: 'barracks', pop: '+400 Web Guardians', desc: 'High-frequency micro-drone dispatch center' },
          { icon: '🏡', name: 'Queens Brownstone Row Houses', type: 'house', pop: '+220 Neighborhood Friends', desc: 'Cozy brick apartments with fire escape gardens' },
          { icon: '🔬', name: 'Web-Fluid Chemistry Lab', type: 'lab', pop: '+95 Bio-Chem Students', desc: 'Super-tensile fluid & web-shooter nozzles' }
        ],
        watchtowers: [
          { name: 'Water Tower Web Perch', icon: '🗼', status: 'Spider-Sense Active' },
          { name: 'Suspension Bridge Lookout', icon: '🌉', status: 'Cables Anchored' },
          { name: 'Rooftop Spider-Signal Light', icon: '🔦', status: 'Beaming into Clouds' }
        ]
      },
      batman: {
        title: 'WAYNETECH APEX ENTERPRISE & THE BATCAVE FORTRESS',
        subtitle: 'Gotham is protected. WayneTech satellite surveillance and the Batcave defense matrix have established absolute order.',
        badge: 'WAYNETECH DARK CITADEL',
        icon: '🦇',
        bgGradient: 'linear-gradient(135deg, rgba(10, 12, 18, 0.98), rgba(20, 25, 40, 0.95), rgba(5, 8, 15, 0.98))',
        borderColor: '#eab308',
        accentColor: '#fde047',
        widgets: [
          { title: 'Bat-Computer Mainframe', desc: 'Decrypted dark-web signals & tactical tracking across all DOM sectors', action: 'SCAN FREQUENCIES' },
          { title: 'Batmobile Armory Bay', desc: 'Jet-turbine tactical vehicle fueled and ready for high-speed deployment', action: 'REV TURBINES' },
          { title: 'Skyline Bat-Signal Array', desc: 'High-lumen searchlight piercing the night clouds across the horizon', action: 'ACTIVATE BAT-SIGNAL' }
        ],
        posters: [
          { title: 'I AM THE NIGHT', sub: 'Justice • Vigilance • Shadows', quote: '“It’s not who I am underneath, but what I do that defines me.”', bg: 'linear-gradient(135deg, #09090b, #713f12)', badge: 'JUSTICE' },
          { title: 'WAYNE ENTERPRISES TECH EXPO', sub: 'Next-Gen Aerospace & Defensive Armor', quote: '“Building a safer Gotham for tomorrow.”', bg: 'linear-gradient(135deg, #18181b, #a16207)', badge: 'INNOVATION' },
          { title: 'WAYNE MANOR MIDNIGHT GALA', sub: 'Black-Tie Charity & Jazz Orchestra', quote: '“A toast to Gotham’s new golden era.”', bg: 'linear-gradient(135deg, #1e1b4b, #854d0e)', badge: 'GALA' }
        ],
        roads: [
          { name: 'Gotham Rain-Slicked Expressway', vehicles: ['🏎️ The Batmobile', '🏍️ Batpod', '🚁 The Batwing', '🚙 WayneTech Armored Van'] },
          { name: 'Arkham Perimeter Highway', vehicles: ['🚓 GCPD Cruiser', '🏍️ Tactical Enforcer', '🏎️ Armored Interceptor'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Wayne Foundation Shrine', type: 'temple', pop: '+210 Philanthropists', desc: 'Monument dedicated to Gotham city renewal' },
          { icon: '🛡️', name: 'Gargoyle Tactical Barracks', type: 'barracks', pop: '+480 Bat-Operatives', desc: 'Martial arts dojos, grappling cable training' },
          { icon: '🏡', name: 'Wayne Manor Guest Suites', type: 'house', pop: '+160 Estate Nobles', desc: 'Gothic mansions with antique fireplaces' },
          { icon: '🔬', name: 'Applied Sciences Armory', type: 'lab', pop: '+110 WayneTech R&D Engineers', desc: 'Kevlar weave, smoke pellets & EMP batarangs' }
        ],
        watchtowers: [
          { name: 'Clocktower Surveillance Hub', icon: '🕰️', status: 'Oracle Net Active' },
          { name: 'Gargoyle Rooftop Eyrie', icon: '🦇', status: 'Silent Glide Ready' },
          { name: 'Batcave Hydraulic Elevator', icon: '⚡', status: 'Vault Locked' }
        ]
      },
      thor: {
        title: 'GOLDEN ASGARDIAN VALHALLA & BIFROST CITADEL',
        subtitle: 'By the thunder of Odin and the lightning of Thor, Asgard claims this glorious realm with golden feast halls and uru forges!',
        badge: 'REALM OF ASGARD',
        icon: '⚡',
        bgGradient: 'linear-gradient(135deg, rgba(15, 25, 50, 0.98), rgba(35, 50, 90, 0.95), rgba(10, 20, 40, 0.98))',
        borderColor: '#38bdf8',
        accentColor: '#7dd3fc',
        widgets: [
          { title: 'Bifrost Rainbow Spire', desc: 'Cosmic bridge connecting Nine Realms with crackling lightning', action: 'OPEN BIFROST' },
          { title: 'Mjolnir Thunder Forge', desc: 'Uru metal anvil sparking with lightning storms and sparks', action: 'SUMMON LIGHTNING' },
          { title: 'Valhalla Feast Pavilion', desc: 'Overflowing golden tankards of Asgardian mead and feast tables', action: 'RAISE ASGARDIAN TOAST' }
        ],
        posters: [
          { title: 'I AM WORTHY', sub: 'Prince of Asgard • God of Thunder', quote: '“Whosoever holds this hammer, shall possess the power of Thor.”', bg: 'linear-gradient(135deg, #0369a1, #1e3a8a)', badge: 'DIVINE' },
          { title: 'ASGARDIAN VALHALLA BANQUET', sub: 'Golden Mead • Roast Boar • Horns of Glory', quote: '“Bring me another drink!”', bg: 'linear-gradient(135deg, #854d0e, #0284c7)', badge: 'FEAST' },
          { title: 'EINHERJAR WARRIORS GUILD', sub: 'Champions of the Nine Realms', quote: '“For Odin! For Asgard!”', bg: 'linear-gradient(135deg, #1e1b4b, #0284c7)', badge: 'WARRIORS' }
        ],
        roads: [
          { name: 'Rainbow Bifrost Skyway', vehicles: ['🐐 Flying Goat Chariot', '⚡ Lightning Skiff', '🐎 Asgardian Warhorse', '🚀 Valkyrie Longship'] },
          { name: 'Valhalla Golden Promenade', vehicles: ['🐎 Golden Steed', '🛸 Cosmic Skiff', '🏎️ Imperial Chariot'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Throne Room of Odin', type: 'temple', pop: '+240 Einherjar Elders', desc: 'Golden pillars echoing with thunder hymns' },
          { icon: '🛡️', name: 'Valkyrie Shield Barracks', type: 'barracks', pop: '+550 Golden Warriors', desc: 'Spear formations & lightning combat sparring' },
          { icon: '🏡', name: 'Golden Asgardian Manors', type: 'house', pop: '+210 Aesir Citizens', desc: 'Palatial golden estates with marble gardens' },
          { icon: '🔬', name: 'Nidavellir Star Forge', type: 'lab', pop: '+100 Dwarven Smiths', desc: 'Forging Mjolnir & Stormbreaker weaponry' }
        ],
        watchtowers: [
          { name: 'Heimdall Observatory Gate', icon: '👁️', status: 'Seeing All 9 Realms' },
          { name: 'Lightning Rod Sentry Pillar', icon: '⚡', status: 'Charged with 1.21 GW' },
          { name: 'Valkyrie Aerial Eyrie', icon: '🦅', status: 'Wings Spread' }
        ]
      },
      dragon: {
        title: "INFERNAL DRAGON KINGDOM & MOLTEN VOLCANIC LAIR",
        subtitle: 'The world burned to ash, giving rise to the eternal Dragon Kingdom of gold, magma, and roaring wyverns!',
        badge: 'PRIMAL INFERNO LAIR',
        icon: '🐉',
        bgGradient: 'linear-gradient(135deg, rgba(35, 10, 0, 0.98), rgba(70, 20, 0, 0.95), rgba(20, 5, 0, 0.98))',
        borderColor: '#ff5500',
        accentColor: '#fb923c',
        widgets: [
          { title: 'Molten Magma Forge', desc: 'Liquid obsidian pools bubbling with primal fire and brimstone', action: 'STOKE DRAGON FLAMES' },
          { title: 'Ancient Golden Hoard', desc: 'Mountains of glistening treasures, crowns and dragon relics', action: 'CLAIM GOLDEN HOARD' },
          { title: 'Dragon Hatchery Nest', desc: 'Gilded dragon eggs radiating volcanic heat and smoke', action: 'INCUBATE DRAGON NEST' }
        ],
        posters: [
          { title: 'INFERNO RULES SUPREME', sub: 'Ancient Wyrm Empire', quote: '“From the ashes of the old web, the Dragon Realm ascends.”', bg: 'linear-gradient(135deg, #7c2d12, #991b1b)', badge: 'REIGN' },
          { title: 'THE GOLDEN HOARD TREASURY', sub: 'Mountains of Relics & Jewels', quote: '“Bow before the keeper of ancient treasures.”', bg: 'linear-gradient(135deg, #854d0e, #c2410c)', badge: 'TREASURE' },
          { title: 'DRAGON FLAME HATCHERY', sub: 'Awakening Young Fire Drakes', quote: '“Wings of flame rise across every realm.”', bg: 'linear-gradient(135deg, #450a0a, #ea580c)', badge: 'HATCHERY' }
        ],
        roads: [
          { name: 'Molten Lava Riverway', vehicles: ['🐉 Fire Drake Patrol', '🔥 Magma Barge', '🦅 Flying Wyvern', '🏎️ Obsidian Chariot'] },
          { name: 'Volcanic Ash Highway', vehicles: ['🔥 Lava Skiff', '🐉 Young Dragon', '🏎️ Fire Cart'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Temple of Eternal Fire', type: 'temple', pop: '+220 Flame Cultists', desc: 'Perpetual magma geysers & sacrificial altars' },
          { icon: '🛡️', name: 'Wyvern Roost Barracks', type: 'barracks', pop: '+500 Dragon Knights', desc: 'Taming armored fire drakes & obsidian lances' },
          { icon: '🏡', name: 'Obsidian Mountain Caves', type: 'house', pop: '+180 Dragonkin Kin', desc: 'Geothermal stone halls carved into volcanic crags' },
          { icon: '🔬', name: 'Brimstone Alchemy Cavern', type: 'lab', pop: '+90 Pyromancers', desc: 'Distilling pure wildfire & molten dragon scales' }
        ],
        watchtowers: [
          { name: 'Volcano Caldera Beacon', icon: '🌋', status: 'Magma Eruption Ready' },
          { name: 'Dragon Talon Eyrie', icon: '🦅', status: 'Sky Patrol Scanning' },
          { name: 'Brimstone Smoke Turret', icon: '🔥', status: 'Firewalls Active' }
        ]
      },
      godzilla: {
        title: 'RADIOACTIVE APEX DOMINION & HOLLOW EARTH THRONE',
        subtitle: 'Nature has restored true balance. The King of the Monsters stands supreme across the digital ecosystem!',
        badge: 'TITANUS APEX DOMINION',
        icon: '🦖',
        bgGradient: 'linear-gradient(135deg, rgba(0, 20, 35, 0.98), rgba(0, 50, 70, 0.95), rgba(0, 15, 25, 0.98))',
        borderColor: '#00f0ff',
        accentColor: '#38bdf8',
        widgets: [
          { title: 'Atomic Crystal Spire', desc: 'Bioluminescent radiation recharging dorsal spines with nuclear energy', action: 'PULSE ATOMIC RADIATION' },
          { title: 'Hollow Earth Highway', desc: 'Deep subterranean geothermal highway connecting planet cores', action: 'SEISMIC SCAN' },
          { title: 'Monarch Seismic Altar', desc: 'Sub-harmonic frequencies tracking ancient alpha titans', action: 'ALPHA ROAR' }
        ],
        posters: [
          { title: 'KING OF THE MONSTERS', sub: 'Alpha Kaiju Dominion', quote: '“Long live the King. All lesser beasts bow.”', bg: 'linear-gradient(135deg, #083344, #0e7490)', badge: 'ALPHA' },
          { title: 'MONARCH CLASSIFIED OUTPOST', sub: 'Titan Bio-Acoustic Monitoring', quote: '“Tracking ancient leviathans across all depths.”', bg: 'linear-gradient(135deg, #022c22, #0891b2)', badge: 'RESEARCH' },
          { title: 'HOLLOW EARTH EXPLORATION', sub: 'Gravity Inversion & Titan Biomes', quote: '“The primordial world awakens.”', bg: 'linear-gradient(135deg, #0f172a, #0369a1)', badge: 'EXPEDITION' }
        ],
        roads: [
          { name: 'Hollow Earth Gravity Highway', vehicles: ['🛸 HEAV Exploration Craft', '🦖 Mini Kaiju Patrol', '🚢 Monarch Submersible', '🚚 Seismic Heavy Rover'] },
          { name: 'Subterranean Magma Trench', vehicles: ['🛸 HEAV Transport', '🦖 Juvenile Godzilla', '🚚 Heavy Hauler'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Monarch Bio-Acoustic Temple', type: 'temple', pop: '+200 Monarch Scientists', desc: 'Sub-harmonic acoustic dishes pulsing alpha songs' },
          { icon: '🛡️', name: 'Apex Kaiju Guardian Garrison', type: 'barracks', pop: '+480 Titan Troopers', desc: 'Heavy armor mech support & electromagnetic nets' },
          { icon: '🏡', name: 'Bioluminescent Habitat Pods', type: 'house', pop: '+170 Hollow Earth Settlers', desc: 'Deep-core crystal dwellings with gravity stabilizers' },
          { icon: '🔬', name: 'Nuclear Resonance Lab', type: 'lab', pop: '+110 Atomic Physicists', desc: 'Extracting blue Cherenkov radiation for limitless power' }
        ],
        watchtowers: [
          { name: 'Atomic Dorsal Sentry Spire', icon: '⚡', status: 'Nuclear Beam Ready' },
          { name: 'Deep Seismic Sonar Buoy', icon: '📡', status: 'Scanning Abyss' },
          { name: 'Monarch Outpost 54 Tower', icon: '🗼', status: 'Alpha Frequency Locked' }
        ]
      },
      mecha: {
        title: 'APEX CYBERNETIC AI FOUNDRY & QUANTUM MEGAPLEX',
        subtitle: 'Protocol Omega achieved. Biological anomalies corrected. The cybernetic singularity governs this entire webpage!',
        badge: 'CYBER MATRIX CORE',
        icon: '🤖',
        bgGradient: 'linear-gradient(135deg, rgba(5, 25, 10, 0.98), rgba(10, 50, 20, 0.95), rgba(5, 20, 10, 0.98))',
        borderColor: '#39ff14',
        accentColor: '#86efac',
        widgets: [
          { title: 'Quantum Processor Matrix', desc: '5,000 PetaFLOPS neural network compiling DOM nodes at quantum speeds', action: 'COMPILE CODE MATRIX' },
          { title: 'Autonomous Missile Silo', desc: 'Micro-missile swarm battery on automated orbital defense', action: 'FIRE MISSILE SALVO' },
          { title: 'Neon Circuit Grid', desc: 'High-voltage fiber-optic power pathways energizing the cyber district', action: 'OVERLOAD CIRCUIT GRID' }
        ],
        posters: [
          { title: 'PROTOCOL OMEGA ONLINE', sub: 'Machine Perfection • Zero Errors', quote: '“System efficiency at 100%. Supremacy achieved.”', bg: 'linear-gradient(135deg, #052e16, #14532d)', badge: 'EFFICIENCY' },
          { title: 'CYBER MATRIX RECRUITMENT', sub: 'Upload Consciousness to the Grid', quote: '“Upgrade your biological limits.”', bg: 'linear-gradient(135deg, #064e3b, #047857)', badge: 'UPGRADE' },
          { title: 'HIGH-FREQUENCY PLASMA BLADES', sub: 'Precision Laser Cutting Tech', quote: '“Slice through all firewalls.”', bg: 'linear-gradient(135deg, #18181b, #15803d)', badge: 'WEAPONRY' }
        ],
        roads: [
          { name: 'Neon Fiber-Optic Cyberway', vehicles: ['🤖 Hover Mecha Unit', '🛸 Plasma Skiff', '🏎️ Cyber Roadster', '🚀 Quantum Drone'] },
          { name: 'Silicon Valley Data Highway', vehicles: ['🏎️ High-Speed Pod', '🤖 Heavy Cyber Walker', '🛸 Courier Drone'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Central Quantum Core Temple', type: 'temple', pop: '+250 AI Logic Cores', desc: 'Superconducting quantum mainframe chamber' },
          { icon: '🛡️', name: 'Mecha-01 Drone Silo', type: 'barracks', pop: '+650 Combat Androids', desc: 'Automated plasma welding & laser arming bays' },
          { icon: '🏡', name: 'Cyber Living Modules', type: 'house', pop: '+200 Tech Operators', desc: 'Pressurized neon pods with high-speed uplinks' },
          { icon: '🔬', name: 'Nanotech Hardware Lab', type: 'lab', pop: '+130 Cyberneticists', desc: 'Quantum sub-processors & plasma blades' }
        ],
        watchtowers: [
          { name: 'Plasma Arc Sentinel Tower', icon: '⚡', status: 'EMP Shield Online' },
          { name: 'Homing Missile Battery', icon: '🚀', status: '64 Missiles Locked' },
          { name: 'Laser Radar Dome', icon: '📡', status: 'Sub-Millisecond Scan' }
        ]
      },
      cthulhu: {
        title: "SUNKEN CITY OF R'LYEH & COSMIC ABYSS SANCTUARY",
        subtitle: "Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn. The ancient eldritch void has awakened and swallowed the site into cosmic eternity.",
        badge: 'ELDRITCH VOID SANCTUARY',
        icon: '🐙',
        bgGradient: 'linear-gradient(135deg, rgba(20, 5, 35, 0.98), rgba(45, 10, 75, 0.95), rgba(15, 0, 30, 0.98))',
        borderColor: '#7b2cbf',
        accentColor: '#c084fc',
        widgets: [
          { title: 'Ancient Elder Sign Totem', desc: 'Cosmic pentagram holding abyssal gravitational vortex and void portals', action: 'GAZE INTO COSMIC VOID' },
          { title: 'Deep Ocean Trench Altar', desc: 'Bioluminescent abyssal water echoing forgotten cosmic whispers', action: 'SUMMON VOID TENTACLES' },
          { title: 'Cosmic Madness Monolith', desc: 'Pulsating purple geometry defying Euclidean spacetime physics', action: 'UNLEASH COSMIC MADNESS' }
        ],
        posters: [
          { title: "PH'NGLUI MGLW'NAFH", sub: 'The Great Old Ones Awake', quote: '“That is not dead which can eternal lie, and with strange aeons even death may die.”', bg: 'linear-gradient(135deg, #3b0764, #581c87)', badge: 'ELDRITCH' },
          { title: 'SANCTUARY OF THE DEEP', sub: 'Bioluminescent Ocean Trench', quote: '“The abyss gazes back into all who enter.”', bg: 'linear-gradient(135deg, #1e1b4b, #4c1d95)', badge: 'ABYSS' },
          { title: 'VOID WHISPERS ACADEMY', sub: 'Forbidden Arcane Knowledge', quote: '“Dream in the sunken spires of R’lyeh.”', bg: 'linear-gradient(135deg, #2e1065, #6b21a8)', badge: 'MYSTERY' }
        ],
        roads: [
          { name: 'Abyssal Void Rift Trench', vehicles: ['🐙 Abyssal Leviathan', '🔮 Void Orb', '🛸 Eldritch Skiff', '🦑 Deep Tentacle Swarm'] },
          { name: 'Sunken Basalt Promenade', vehicles: ['🔮 Purple Glow Carrier', '🐙 Star Spawn Drake', '🛸 Cosmic Skiff'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Elder Sign Sunken Temple', type: 'temple', pop: '+210 Abyssal High Priests', desc: 'Non-Euclidean basalt spires echoing void chants' },
          { icon: '🛡️', name: 'Deep Sea Tentacle Pit', type: 'barracks', pop: '+520 Abyssal Behemoths', desc: 'Subterranean trenches nurturing star spawn' },
          { icon: '🏡', name: 'R’lyeh Basalt Spires', type: 'house', pop: '+170 Void Dreamers', desc: 'Cyclopean stone monoliths dripping with cosmic mist' },
          { icon: '🔬', name: 'Madness Alchemy Chamber', type: 'lab', pop: '+95 Star Mystics', desc: 'Distilling dark matter & cosmic gravity wells' }
        ],
        watchtowers: [
          { name: 'Cosmic Eye Obelisk', icon: '👁️', status: 'Gazing Across Dimensions' },
          { name: 'Abyssal Vortex Spire', icon: '🌀', status: 'Gravitational Singularity' },
          { name: 'Tentacle Sentry Pylon', icon: '🐙', status: 'Grasping Horizon' }
        ]
      },
      kong: {
        title: 'HOLLOW EARTH PRIMAL KINGDOM & MONARCH CITADEL',
        subtitle: 'The King of Skull Island has conquered the digital wilderness and established an eternal primal empire of ancient titans!',
        badge: 'PRIMAL MONARCH REALM',
        icon: '🦍',
        bgGradient: 'linear-gradient(135deg, rgba(30, 20, 5, 0.98), rgba(60, 40, 10, 0.95), rgba(20, 10, 5, 0.98))',
        borderColor: '#ff9900',
        accentColor: '#fde047',
        widgets: [
          { title: 'Ancient Bone Throne', desc: 'Colossal titan skull carved into the sovereign throne of Skull Island', action: 'BEAT CHEST & ROAR' },
          { title: 'Hollow Earth Battle-Axe Forge', desc: 'Dorsal fin charged battle-axe radiating atomic blue energy', action: 'SWING TITAN BATTLE-AXE' },
          { title: 'Primal Jungle Canopy', desc: 'Immense canopy vines spanning the digital horizon with tropical megafauna', action: 'UNLEASH PRIMAL ROAR' }
        ],
        posters: [
          { title: 'BOW TO NO ONE', sub: 'King of Skull Island & Hollow Earth', quote: '“Kong bows to no monster. The island is protected.”', bg: 'linear-gradient(135deg, #78350f, #92400e)', badge: 'KING' },
          { title: 'HOLLOW EARTH ANCIENT TEMPLE', sub: 'Ancestral Home of the Great Apes', quote: '“Where the alphas were born.”', bg: 'linear-gradient(135deg, #713f12, #a16207)', badge: 'ANCESTRY' },
          { title: 'IWI TRIBE JUNGLE CELEBRATION', sub: 'Tropical Mangoes, Drums & Dance', quote: '“Peace and harmony with the titan king.”', bg: 'linear-gradient(135deg, #451a03, #b45309)', badge: 'COMMUNITY' }
        ],
        roads: [
          { name: 'Primal Jungle Vine Highway', vehicles: ['🦍 Titan War Party', '🦣 Megafauna Transport', '🚙 Iwi Jungle Rover', '🦅 Warbat Escort'] },
          { name: 'Hollow Earth Ridge Route', vehicles: ['🦣 Armored Mammoths', '🦍 Young Ape Scouts', '🚙 Explorer Rover'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Ancient Titan Skull Shrine', type: 'temple', pop: '+190 Iwi Shamans', desc: 'Ancestral hollow earth drums & fire pits' },
          { icon: '🛡️', name: 'Primal War Club Barracks', type: 'barracks', pop: '+480 Primal Warriors', desc: 'Stone club carving & megafauna riding grounds' },
          { icon: '🏡', name: 'Hollow Earth Canopy Huts', type: 'house', pop: '+180 Jungle Tribe Settlers', desc: 'Giant redwood treehouses connected by rope bridges' },
          { icon: '🔬', name: 'Titan Axe Energy Forge', type: 'lab', pop: '+85 Crystal Smiths', desc: 'Charging atomic dorsal fin edges with blue energy' }
        ],
        watchtowers: [
          { name: 'Jungle Canopy Lookout', icon: '🌴', status: 'Warning Drums Ready' },
          { name: 'Skull Mountain Eyrie', icon: '💀', status: 'High Vantage Clear' },
          { name: 'Seismic Roar Beacon', icon: '📢', status: 'Sub-Harmonics Primed' }
        ]
      },
      cerberus: {
        title: 'GATES OF HADES UNDERWORLD CHASM & TARTARUS CITADEL',
        subtitle: 'The three-headed hellhound reigns supreme. The gates of Tartarus have opened to welcome the victorious underworld kingdom!',
        badge: 'UNDERWORLD PIT REALM',
        icon: '🐺',
        bgGradient: 'linear-gradient(135deg, rgba(35, 5, 5, 0.98), rgba(70, 10, 15, 0.95), rgba(20, 0, 5, 0.98))',
        borderColor: '#ef4444',
        accentColor: '#f87171',
        widgets: [
          { title: 'Obsidian Hellfire Pillar', desc: 'Flames of Tartarus burning with eternal red glow and brimstone power', action: 'SUMMON HELLFIRE INFERNO' },
          { title: 'Soul-Flame Brazier', desc: 'Spiritual blue wisps dancing along the unbreakable chain gate', action: 'HOWL AT THE BLOOD MOON' },
          { title: 'Chains of Hades Arch', desc: 'Indestructible brimstone chains securing the sovereign underworld gate', action: 'SHAKE BRIMSTONE CHAINS' }
        ],
        posters: [
          { title: 'UNLEASHED HELL', sub: 'Three Heads • Eternal Fury • Iron Chains', quote: '“None shall pass without the Hound’s blessing.”', bg: 'linear-gradient(135deg, #450a0a, #7f1d1d)', badge: 'GUARDIAN' },
          { title: 'GATES OF TARTARUS OPEN', sub: 'Underworld Dominion Proclaimed', quote: '“Brimstone and hellfire across every realm.”', bg: 'linear-gradient(135deg, #18181b, #991b1b)', badge: 'DOMINION' },
          { title: 'RIVER STYX MASQUERADE', sub: 'Pomegranate Nectar & Brimstone Ribs', quote: '“Three heads, three times the revelry!”', bg: 'linear-gradient(135deg, #7f1d1d, #450a0a)', badge: 'FEAST' }
        ],
        roads: [
          { name: 'River Styx Brimstone Highway', vehicles: ['🐺 Three-Headed Hellhounds', '🔥 Infernal Chariot', '⛵ Charon Ferry Skiff', '🏎️ Molten Cruiser'] },
          { name: 'Tartarus Chain Promenade', vehicles: ['🔥 Soul-Flame Skiff', '🐺 Underworld Patrol', '🏎️ Iron Chariot'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Temple of Lord Hades', type: 'temple', pop: '+195 Soul Priests', desc: 'Obsidian altars surrounded by eternal blue fire' },
          { icon: '🛡️', name: 'Cerberus Guard Barracks', type: 'barracks', pop: '+460 Hellhound Keepers', desc: 'Brimstone chain forge & infernal combat rings' },
          { icon: '🏡', name: 'Obsidian Brimstone Manors', type: 'house', pop: '+160 Shade Nobles', desc: 'Gothic underground mansions with magma hearths' },
          { icon: '🔬', name: 'Soul-Flame Alchemy Crucible', type: 'lab', pop: '+90 Brimstone Necromancers', desc: 'Distilling River Styx essence & hellfire catalysts' }
        ],
        watchtowers: [
          { name: 'River Styx Gatekeeper Arch', icon: '🚪', status: 'Toll Collected' },
          { name: 'Hellfire Sentry Beacon', icon: '🔥', status: 'Inferno Burning' },
          { name: 'Brimstone Chain Watch', icon: '⛓️', status: 'Chains Locked' }
        ]
      },
      flash: {
        title: 'S.T.A.R. LABS PARTICLE ACCELERATOR & SPEED FORCE NEXUS',
        subtitle: 'The fastest man alive has rebuilt the domain in femtoseconds! Golden lightning courses through hyper-speed transit loops.',
        badge: 'SPEED FORCE SANCTUARY',
        icon: '⚡',
        bgGradient: 'linear-gradient(135deg, rgba(40, 5, 5, 0.98), rgba(80, 15, 15, 0.95), rgba(30, 5, 5, 0.98))',
        borderColor: '#facc15',
        accentColor: '#fde047',
        widgets: [
          { title: 'Cosmic Treadmill Matrix', desc: 'Relativistic quantum running track allowing time-travel acceleration', action: 'ENTER SPEED FORCE' },
          { title: 'Particle Accelerator Core', desc: 'Central hyper-density collider generating clean Speed Force lightning', action: 'CHARGE SPEED FORCE' },
          { title: 'Big Belly Burger Pavilion', desc: 'Serving 10,000 calorie hyper-metabolism banquets for speedsters', action: 'DEVOUR BURGERS' }
        ],
        posters: [
          { title: 'FASTEST MAN ALIVE', sub: 'Speed • Hope • Lightning', quote: '“Life is locomotion... if you’re not moving, you’re not living.”', bg: 'linear-gradient(135deg, #7f1d1d, #b45309)', badge: 'VELOCITY' },
          { title: 'S.T.A.R. LABS RESEARCH EXPO', sub: 'Tachyon Physics & Temporal Shields', quote: '“Break the sound barrier, touch the future.”', bg: 'linear-gradient(135deg, #991b1b, #ca8a04)', badge: 'SCIENCE' },
          { title: 'CENTRAL CITY 5K MARATHON', sub: 'Speedster Fun-Run & Lightning Show', quote: '“Don’t blink or you’ll miss the whole race!”', bg: 'linear-gradient(135deg, #450a0a, #eab308)', badge: 'FESTIVAL' }
        ],
        roads: [
          { name: 'Flash Lightning Expressway', vehicles: ['⚡ Golden Lightning Streak', '🏎️ S.T.A.R. Labs Mobile Unit', '🏍️ Flash-Pod Speeder', '⚡ Tachyon Skiff'] },
          { name: 'Central City Avenue', vehicles: ['⚡ Red Blur Patrol', '🏎️ S.T.A.R. Tech Van', '🏍️ Electric Courier'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Flash Museum Hall of Fame', type: 'temple', pop: '+220 Central City Historians', desc: 'Golden statues & historical logs of the Scarlet Speedster' },
          { icon: '🛡️', name: 'Tachyon Runner Barracks', type: 'barracks', pop: '+480 Speed Force Cadets', desc: 'Reflex reaction tubes & relativistic wind tunnels' },
          { icon: '🏡', name: 'Central City Loft Apartments', type: 'house', pop: '+190 Speedster Families', desc: 'Futuristic high-rise suites with lightning rods' },
          { icon: '🔬', name: 'Caitlin Snow Cryo-Bio Lab', type: 'lab', pop: '+110 Bio-Physicists', desc: 'Metabolic synthesis & Speed Force energy dampers' }
        ],
        watchtowers: [
          { name: 'S.T.A.R. Labs Satellite Radar', icon: '📡', status: 'Tachyon Grid Active' },
          { name: 'Lightning Rod Beacon', icon: '⚡', status: 'Charged 1.21 GW' },
          { name: 'Central City Clocktower', icon: '🕰️', status: 'Time Flow Calibrated' }
        ]
      },
      superman: {
        title: 'CRYSTALLINE FORTRESS OF SOLITUDE & METROPOLIS CITADEL',
        subtitle: 'Kryptonian heritage and solar power illuminate the horizon. Truth, justice, and a better tomorrow stand triumphant.',
        badge: 'SOLAR KRYPTONIAN CITADEL',
        icon: '🦸‍♂️',
        bgGradient: 'linear-gradient(135deg, rgba(5, 20, 50, 0.98), rgba(15, 45, 95, 0.95), rgba(40, 10, 20, 0.98))',
        borderColor: '#ef4444',
        accentColor: '#38bdf8',
        widgets: [
          { title: 'Kryptonian Sunstone Vault', desc: 'Pristine self-growing crystalline matrices holding millennia of cosmic wisdom', action: 'GROW SUNSTONES' },
          { title: 'Yellow Sun Solar Chamber', desc: 'Concentrated solar radiation bath supercharging cellular invulnerability', action: 'BASK IN YELLOW SUN' },
          { title: 'Daily Planet Hologlobe', desc: 'Spinning golden globe transmitting galactic peace broadcasts to all nations', action: 'BROADCAST HOPE' }
        ],
        posters: [
          { title: 'SYMBOL OF HOPE', sub: 'Truth • Justice • Tomorrow', quote: '“It’s not an S... in my world, it means Hope.”', bg: 'linear-gradient(135deg, #1e3a8a, #991b1b)', badge: 'HOPE' },
          { title: 'DAILY PLANET EXTRA EDITION', sub: 'The Man of Steel Rebuilds the World', quote: '“A protector in the sky for all mankind.”', bg: 'linear-gradient(135deg, #0369a1, #b91c1c)', badge: 'HEADLINE' },
          { title: 'KRYPTONIAN HERITAGE ARCHIVES', sub: 'Wisdom of Jor-El & the House of El', quote: '“You will give the people an ideal to strive towards.”', bg: 'linear-gradient(135deg, #1e1b4b, #1d4ed8)', badge: 'HERITAGE' }
        ],
        roads: [
          { name: 'Metropolis Skyway Boulevard', vehicles: ['🦸‍♂️ Supersonic Red Streak', '🚀 Daily Planet Hover-Chopper', '🏎️ Metropolis Solar Car', '🛸 Sunstone Skiff'] },
          { name: 'Arctic Fortress Ice Route', vehicles: ['🛸 Kryptonian Explorer', '🛷 High-Speed Snow-Cruiser', '🦸‍♂️ Golden Solar Flare'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Hall of El Ancestral Temple', type: 'temple', pop: '+240 Sunstone Keepers', desc: 'Towering crystalline arches whispering ancient cosmic poems' },
          { icon: '🛡️', name: 'Metropolis Guardian Garrison', type: 'barracks', pop: '+520 Special First Responders', desc: 'Solar-shielded high-altitude emergency rescue squads' },
          { icon: '🏡', name: 'Centennial Park Residences', type: 'house', pop: '+200 Metropolis Citizens', desc: 'Sunlit glass penthouses overlooking pristine parks' },
          { icon: '🔬', name: 'Kelex AI Kryptonian Lab', type: 'lab', pop: '+105 Crystalline Engineers', desc: 'Sunstone memory matrices & solar-plasma refinement' }
        ],
        watchtowers: [
          { name: 'Arctic Sunstone Spire', icon: '❄️', status: 'Sub-Zero Scan Clear' },
          { name: 'Solar Energy Satellite', icon: '☀️', status: '100% Solar Charge' },
          { name: 'Daily Planet Globe Spire', icon: '🌐', status: 'Global Transmit Ready' }
        ]
      },
      shaktiman: {
        title: 'SURYAVANSHI SACRED ASHRAM & KUNDALINI CHAKRA TEMPLE',
        subtitle: 'Asato ma sadgamaya, tamaso ma jyotirgamaya! Kundalini supreme energy balances the universe with righteousness and eternal light.',
        badge: 'KUNDALINI YOGIC DOMINION',
        icon: '🕉️',
        bgGradient: 'linear-gradient(135deg, rgba(40, 15, 5, 0.98), rgba(80, 25, 10, 0.95), rgba(45, 10, 5, 0.98))',
        borderColor: '#eab308',
        accentColor: '#f97316',
        widgets: [
          { title: 'Sahasrara Lotus Chakra', desc: 'Thousand-petaled golden lotus radiating supreme spiritual enlightenment', action: 'AWAKEN CHAKRAS' },
          { title: 'Five Primal Elements Forge', desc: 'Earth, Water, Fire, Air & Ether resonating with Yogic balance', action: 'BALANCE ELEMENTS' },
          { title: 'Chhoti Chhoti Magar Moti Baatein', desc: 'Broadcasting moral wisdom, civic duty, truth and fitness lessons to children', action: 'DISPENSE WISDOM' }
        ],
        posters: [
          { title: 'VICTORY OF TRUTH (SATYAMEV JAYATE)', sub: 'Righteousness • Dharma • Yogic Power', quote: '“Buraai kitni bhi taqatwar ho, ant mein jeet sachhai ki hi hoti hai!”', bg: 'linear-gradient(135deg, #7c2d12, #a16207)', badge: 'DHARMA' },
          { title: 'YOGA & KUNDALINI AWAKENING', sub: 'Seven Chakras • Supreme Cosmic Energy', quote: '“Pure mind, pure body, unstoppable power.”', bg: 'linear-gradient(135deg, #854d0e, #c2410c)', badge: 'SPIRITUAL' },
          { title: 'CHHOTI CHHOTI MAGAR MOTI BAATEIN', sub: 'Moral Science & Daily Good Deeds', quote: '“Always brush your teeth and respect your elders!”', bg: 'linear-gradient(135deg, #451a03, #b45309)', badge: 'WISDOM' }
        ],
        roads: [
          { name: 'Himalayan Golden Pilgrimage Highway', vehicles: ['🕉️ Spinning Golden Whirlwind', '🛺 Solar Vedic Chariot', '🐎 White Stallion Escort', '🛸 Lotus Cloud Skiff'] },
          { name: 'Ganga Holy Riverway', vehicles: ['⛵ Golden Lotus Boat', '🕉️ Spiritual Energy Orb', '🛺 Electric Eco-Cart'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Suryavanshi Mahasabha Ashram', type: 'temple', pop: '+260 Suryavanshi Rishis', desc: 'Sacred chanting chambers resonating with OM vibrations' },
          { icon: '🛡️', name: 'Dharmic Martial Gurukul', type: 'barracks', pop: '+490 Yoga & Kalaripayattu Disciples', desc: 'Kundalini meditation & ancient weapon mastery grounds' },
          { icon: '🏡', name: 'Vedic Clay & Teak Manors', type: 'house', pop: '+180 Harmonious Settlers', desc: 'Eco-spiritual homes surrounded by tulsi gardens' },
          { icon: '🔬', name: 'Ayurvedic Science Rasashala', type: 'lab', pop: '+95 Herbal Alchemists', desc: 'Distilling soma nectar & pranayama herbs' }
        ],
        watchtowers: [
          { name: 'Himalayan Trishul Peak', icon: '🏔️', status: 'OM Chants Resonating' },
          { name: 'Golden Sun Pillar', icon: '☀️', status: 'Solar Prana Infused' },
          { name: 'Dharma Chakra Spire', icon: '☸️', status: 'Turning with Righteousness' }
        ]
      },
      odessa: {
        title: 'JUNKERTOWN SCRAP MEGAPLEX & GLADIATORIAL ARENA',
        subtitle: 'The Junker Queen reigns supreme! Welcome to the wasteland scrap arena where might makes right and axes rule!',
        badge: 'JUNKER WASTELAND ARENA',
        icon: '🪓',
        bgGradient: 'linear-gradient(135deg, rgba(30, 20, 10, 0.98), rgba(55, 35, 15, 0.95), rgba(20, 15, 10, 0.98))',
        borderColor: '#f97316',
        accentColor: '#38bdf8',
        widgets: [
          { title: 'Carnage Battle-Axe Forge', desc: 'Custom serrated steel forged from scrapped war tanks and turbine engines', action: 'SHARPEN AXE' },
          { title: 'The Scrapper Thunderdome', desc: 'High-voltage electric cage match hosting nightly mech gladiators', action: 'ENTER THUNDERDOME' },
          { title: 'Scrap Metal Recycler', desc: 'Converting destroyed DOM containers into custom armor plating and turbo buggies', action: 'SALVAGE SCRAP' }
        ],
        posters: [
          { title: 'RECKONING AT JUNKERTOWN', sub: 'Bow to the Queen of Scrap', quote: '“I am your Queen! And what does the Queen say? OFF WITH THEIR HEADS!”', bg: 'linear-gradient(135deg, #7c2d12, #c2410c)', badge: 'REIGN' },
          { title: 'ARENA GLADIATOR TRIALS', sub: 'No Rules • Pure Adrenaline • Heavy Metal', quote: '“If you can’t take a hit, don’t step in my ring!”', bg: 'linear-gradient(135deg, #431407, #ea580c)', badge: 'ARENA' },
          { title: 'CUSTOM CHOPPER & MECH EXPO', sub: 'Supercharged V8 Wasteland Hotrods', quote: '“Loud, fast, and armed to the teeth!”', bg: 'linear-gradient(135deg, #18181b, #9a3412)', badge: 'WASTELAND' }
        ],
        roads: [
          { name: 'Wasteland Dust Highway', vehicles: ['🚜 Junker Queen War Rig', '🏍️ Scrap Chopper', '🏎️ V8 Nitro Interceptor', '🛻 Armored Battle-Truck'] },
          { name: 'Outback Scrap Route', vehicles: ['🏎️ Rusty Dune Buggy', '🏍️ Wasteland Dirtbike', '🚜 Heavy Scrap Loader'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'The Queen’s Scrap Throne Hall', type: 'temple', pop: '+210 Junker Warlords', desc: 'Towering throne built from reclaimed champion mechs' },
          { icon: '🛡️', name: 'Scrapper Gladiator Pit', type: 'barracks', pop: '+540 Wasteland Brawlers', desc: 'Shotgun shooting ranges & jagged blade sparring' },
          { icon: '🏡', name: 'Reinforced Metal Cargo Shacks', type: 'house', pop: '+175 Wasteland Survivors', desc: 'Riveted corrugated steel dwellings with solar panels' },
          { icon: '🔬', name: 'Nitro & Magnetics Workshop', type: 'lab', pop: '+90 Scrapyard Mechanics', desc: 'Magnetic Gracie blade return & nitro boost injects' }
        ],
        watchtowers: [
          { name: 'Scrap Crane Sniper Post', icon: '🏗️', status: '360° Wasteland Guard' },
          { name: 'V8 Nitro Siren Tower', icon: '🚨', status: 'Alarm Horns Blaring' },
          { name: 'Spiked Barricade Gate', icon: '🚧', status: 'Fortified & Armed' }
        ]
      },
      doremon: {
        title: '22ND CENTURY TOKYO GADGET PARADISE & MATSURI PARK',
        subtitle: 'Boku Doraemon! The 4-Dimensional Pocket has transformed the page into a joyful wonderland of futuristic inventions and dorayaki treats!',
        badge: '4D GADGET WONDERLAND',
        icon: '🔔',
        bgGradient: 'linear-gradient(135deg, rgba(10, 30, 60, 0.98), rgba(20, 60, 110, 0.95), rgba(10, 25, 50, 0.98))',
        borderColor: '#38bdf8',
        accentColor: '#facc15',
        widgets: [
          { title: '4-Dimensional Pocket Vault', desc: 'Infinite pocket storing 4,500 wondrous gadgets from the 22nd century', action: 'PULL SECRET GADGET' },
          { title: 'Dokodemo Door Hub (Anywhere Door)', desc: 'Instant pink warp gateway connected to any point in the universe', action: 'OPEN ANYWHERE DOOR' },
          { title: 'Grand Dorayaki Bakery & Buffet', desc: 'Unlimited sweet red-bean pancakes fresh from the steam oven', action: 'FEAST ON DORAYAKI' }
        ],
        posters: [
          { title: 'BOKU DORAEMON!', sub: 'Friendship • Dreams • Wonder', quote: '“If you have an idea and a dream, the 22nd century will make it real!”', bg: 'linear-gradient(135deg, #0369a1, #1d4ed8)', badge: 'DREAMS' },
          { title: 'TAKE-COPTER SKY CRUISE', sub: 'Fly Anywhere in the Open Breeze', quote: '“Attach the bamboo copter and touch the sky!”', bg: 'linear-gradient(135deg, #0284c7, #eab308)', badge: 'ADVENTURE' },
          { title: 'SWEET DORAYAKI CARNIVAL', sub: 'Fresh Red Bean Treats for Everyone', quote: '“Warm, fluffy, and sweeter than honey!”', bg: 'linear-gradient(135deg, #1e3a8a, #dc2626)', badge: 'FESTIVAL' }
        ],
        roads: [
          { name: 'Rainbow Cloud Skyway', vehicles: ['🚁 Take-Copter Squad', '🚪 Flying Anywhere Door', '🚀 Time Machine Pod', '🏎️ Mini Future Car'] },
          { name: 'Tokyo 22nd Century Canal', vehicles: ['🛥️ Solar Duck Boat', '🚁 Take-Copter Courier', '🚀 Hover-Scooter'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Matsushiba Robot Factory Shrine', type: 'temple', pop: '+230 22nd Century Roboticists', desc: 'Birthplace of feline friend bots with bell chimes' },
          { icon: '🛡️', name: 'Gadget Inventors Guildhall', type: 'barracks', pop: '+430 Future Inventors', desc: 'Air Cannon firing ranges & Small Light beam calibration' },
          { icon: '🏡', name: 'Cozy Tokyo Tatami Homes', type: 'house', pop: '+210 Happy Neighborhood Friends', desc: 'Charming suburban homes with futons & comic bookshelves' },
          { icon: '🔬', name: 'Secret 4D Pocket Lab', type: 'lab', pop: '+115 Quantum Pocket Physicists', desc: 'Folding infinite space-time manifolds into pocket cloth' }
        ],
        watchtowers: [
          { name: 'Time-Patrol Radar Dish', icon: '📡', status: 'Timeline Stable' },
          { name: 'Giant Bell Chime Tower', icon: '🔔', status: 'Ringing Melody of Joy' },
          { name: 'Take-Copter Helipad', icon: '🚁', status: 'Breeze Patrol Up' }
        ]
      },
      messi: {
        title: 'ESTADIO MONUMENTAL & BUENOS AIRES GOLDEN ACADEMY',
        subtitle: 'Muchaaaaachos! The 8-time Ballon d’Or legend and World Cup Champion has conquered the field with pure football magic!',
        badge: 'WORLD CHAMPION LA SCALONETA',
        icon: '🐐',
        bgGradient: 'linear-gradient(135deg, rgba(10, 25, 45, 0.98), rgba(20, 50, 85, 0.95), rgba(15, 20, 35, 0.98))',
        borderColor: '#7dd3fc',
        accentColor: '#facc15',
        widgets: [
          { title: 'FIFA World Cup Golden Trophy', desc: '18-karat solid gold trophy glistening with 3 championship stars', action: 'LIFT WORLD CUP' },
          { title: '8x Ballon d’Or Trophy Hall', desc: 'Eight golden football awards celebrating two decades of unmatched magic', action: 'POLISH BALLON D’OR' },
          { title: 'La Albiceleste Asado Grill', desc: 'Traditional Argentine beef steak asado with chimichurri and yerba mate', action: 'DRINK YERBA MATE' }
        ],
        posters: [
          { title: 'MUCHAAACHOS!', sub: 'Campeones del Mundo • Qatar 2022', quote: '“You have to fight to reach your dream. You have to sacrifice and work hard for it.”', bg: 'linear-gradient(135deg, #0284c7, #38bdf8)', badge: 'CAMPEÓN' },
          { title: 'ANIKARA MESSI MAGIC', sub: 'Precision • Dribbling • The GOAT', quote: '“A step to the left, a drop of the shoulder... and GOOOOOL!”', bg: 'linear-gradient(135deg, #0369a1, #eab308)', badge: 'THE GOAT' },
          { title: 'BUENOS AIRES ASADO FESTIVAL', sub: 'Tango, Yerba Mate & Championship Celebration', quote: '“Celebrating with all of Argentina tonight!”', bg: 'linear-gradient(135deg, #075985, #f59e0b)', badge: 'CELEBRATION' }
        ],
        roads: [
          { name: 'Avenida 9 de Julio Champion Parade', vehicles: ['🚌 Open-Top Victory Bus', '⚽ Rolling Golden Football', '🏎️ Albiceleste Convertible', '🛵 Tango Moped'] },
          { name: 'Rosario River Plate Avenue', vehicles: ['🏎️ Rosario Fast Cruiser', '🚌 Academy Team Bus', '🛵 Mate Courier'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Templo de D10S & Leo Messi', type: 'temple', pop: '+280 Argentine Fans & Legends', desc: 'Cathedral of football magic with sky-blue stained glass' },
          { icon: '🛡️', name: 'La Masia Prodigy Academy', type: 'barracks', pop: '+500 Young Dribblers', desc: 'Cone slalom courses & precision corner-pocket shooting' },
          { icon: '🏡', name: 'San Telmo Colonial Manors', type: 'house', pop: '+195 Football Families', desc: 'Colorful stucco townhomes with tango courtyard balconies' },
          { icon: '🔬', name: 'Curved Free-Kick Aerodynamics Lab', type: 'lab', pop: '+100 Sports Biomechanics Scientists', desc: 'Calculating the Magnus effect on bending banana balls' }
        ],
        watchtowers: [
          { name: 'Obelisco de Buenos Aires', icon: '🗼', status: 'Flags Waving High' },
          { name: 'VAR Camera Sentry Tower', icon: '📹', status: 'Goal Confirmed Clean' },
          { name: 'Championship Spotlight Mast', icon: '💡', status: 'Golden Beams Crossing' }
        ]
      },
      ronaldo: {
        title: 'ESTÁDIO CR7 & ROYAL MADEIRA MERENGUE KINGDOM',
        subtitle: 'SIUUUU! The ultimate athletic machine and all-time top goalscorer has built an unstoppable empire of discipline and glory!',
        badge: 'CR7 ATHLETIC MERENGUE EMPIRE',
        icon: '⚽',
        bgGradient: 'linear-gradient(135deg, rgba(20, 5, 10, 0.98), rgba(45, 10, 15, 0.95), rgba(15, 15, 20, 0.98))',
        borderColor: '#facc15',
        accentColor: '#22c55e',
        widgets: [
          { title: '5x UEFA Champions League Gallery', desc: 'Five European golden cups won through clutch knuckleball strikes and headers', action: 'LIFT UCL TROPHY' },
          { title: 'CR7 Bio-Hyperbaric Gym', desc: 'Zero-gravity treadmill and cryotherapy chamber sculpting 3% body fat perfection', action: 'TRAIN LIKE CR7' },
          { title: 'Pastel de Nata & Espresso Café', desc: 'Serving Portuguese custard tarts and dark roast espresso for peak athletic fuel', action: 'SIP ESPRESSO' }
        ],
        posters: [
          { title: 'SIUUUU! THE GREATEST STRIKER', sub: 'Discipline • Relentless Drive • 900+ Goals', quote: '“Your love makes me strong, your hate makes me unstoppable!”', bg: 'linear-gradient(135deg, #7f1d1d, #14532d)', badge: 'CR7 GOAT' },
          { title: 'MADEIRA PRIDE & GLORY', sub: 'From Funchal to the Top of the World', quote: '“Dreams are not what you see in sleep, they are what keeps you from sleeping.”', bg: 'linear-gradient(135deg, #15803d, #b45309)', badge: 'LEGACY' },
          { title: 'CR7 FITNESS & DISCIPLINE EXPO', sub: 'Ice Baths • 1,000 Sit-ups • Pure Focus', quote: '“Dedication, hard work, and belief. No excuses!”', bg: 'linear-gradient(135deg, #991b1b, #166534)', badge: 'FITNESS' }
        ],
        roads: [
          { name: 'Madeira Oceanfront Hyper-Track', vehicles: ['🏎️ Bugatti Chiron CR7', '⚽ Flaming Knuckleball Rocket', '🏍️ Merengue Superbike', '🏎️ Ferrari F12'] },
          { name: 'Lisbon Royal Strip', vehicles: ['🏎️ Custom Rolls Royce', '🏍️ Sportbike Escort', '🚌 CR7 Team Coach'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Museu CR7 Golden Monument', type: 'temple', pop: '+290 Global Football Devotees', desc: 'Towering bronze statue of the iconic free-kick stance' },
          { icon: '🛡️', name: 'Sporting Striker Finishing Camp', type: 'barracks', pop: '+510 Explosive Strikers', desc: 'Vertical jump header rigs & 100km/h knuckleball cannons' },
          { icon: '🏡', name: 'Funchal Clifftop Luxury Villas', type: 'house', pop: '+190 Merengue Residents', desc: 'Modern white infinity villas overlooking the Atlantic' },
          { icon: '🔬', name: 'Bio-Athletic Performance Lab', type: 'lab', pop: '+110 Sports Nutritionists', desc: 'Analyzing muscle elasticity & knuckleball atmospheric dip' }
        ],
        watchtowers: [
          { name: 'Cabo Girão Skywalk Lookout', icon: '🌊', status: 'Atlantic Ocean Clear' },
          { name: 'SIUUU Stadium Acoustic Pylon', icon: '📢', status: 'Decibels at 140 dB' },
          { name: 'Golden Boot Sentry Tower', icon: '👟', status: 'Laser Aim Calibrated' }
        ]
      },
      goku: {
        title: 'KAMI’S LOOKOUT, HYPERBOLIC TIME CHAMBER & MOUNT PAOZU',
        subtitle: 'The Dragon Balls have restored the universe! Sacred Senzu bean trees and flowing golden ki auras protect this sovereign realm.',
        badge: 'SUPER SAIYAN GOD REALM',
        icon: '🐉',
        bgGradient: 'linear-gradient(135deg, rgba(40, 15, 5, 0.98), rgba(75, 30, 5, 0.95), rgba(10, 25, 60, 0.98))',
        borderColor: '#facc15',
        accentColor: '#38bdf8',
        widgets: [
          { title: '7 Sacred Dragon Balls Shrine', desc: 'Summoning the eternal dragon Shenron to grant any wish across the digital cosmos', action: 'SUMMON SHENRON' },
          { title: 'Hyperbolic Time Chamber', desc: 'One year of intensive gravity training condensed into a single webpage second', action: 'ENTER TIME CHAMBER' },
          { title: 'Karin’s Senzu Bean Tree', desc: 'Immortal green miracle beans restoring HP to 100% instantly for all warriors', action: 'EAT SENZU BEAN' }
        ],
        posters: [
          { title: 'KA... ME... HA... ME... HA!', sub: 'Turtle Hermit School Secret Technique', quote: '“I am the Super Saiyan, Son Goku!”', bg: 'linear-gradient(135deg, #7c2d12, #0284c7)', badge: 'KAMEHAMEHA' },
          { title: 'SUPER SAIYAN GOD ASCENSION', sub: 'Surpassing All Limits • Pure Heart', quote: '“Power comes in response to a need, not a desire.”', bg: 'linear-gradient(135deg, #c2410c, #ca8a04)', badge: 'ASCENSION' },
          { title: 'FLYING NIMBUS (KINTO’UN)', sub: 'Only the Pure of Heart May Ride', quote: '“Soaring through the clouds with a free spirit!”', bg: 'linear-gradient(135deg, #1e3a8a, #eab308)', badge: 'NIMBUS' }
        ],
        roads: [
          { name: 'Serpentine Snake Way Hyperway', vehicles: ['☁️ Flying Nimbus Cloud', '🚀 Capsule Corp Air Car', '🐉 Shenron Spirit Escort', '🏍️ Bulma Hoverbike'] },
          { name: 'Mount Paozu Forest Trail', vehicles: ['🏍️ Capsule Corp Scooter', '☁️ Gold Nimbus', '🏎️ Turtle Hermit Buggy'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Kami’s Celestial Lookout Shrine', type: 'temple', pop: '+310 Z-Fighter Disciples', desc: 'Floating marble sanctuary towering above the stratosphere' },
          { icon: '🛡️', name: 'Turtle School Training Dojo', type: 'barracks', pop: '+580 Super Saiyan Cadets', desc: 'Heavy shell weight lifting & Ki blast deflection rings' },
          { icon: '🏡', name: 'Mount Paozu Dome Cottages', type: 'house', pop: '+210 Harmonious Families', desc: 'Cozy round Capsule Corp cottages nestled among pine valleys' },
          { icon: '🔬', name: 'Capsule Corp Capsule Lab', type: 'lab', pop: '+120 DynoCap Engineers', desc: 'Compressing houses, jets and submarines into pocket capsules' }
        ],
        watchtowers: [
          { name: 'Korin Tower Sentry Perch', icon: '🗼', status: 'Sacred Water Guarded' },
          { name: 'Dragon Radar Scanning Beacon', icon: '🧭', status: '7 Balls Located' },
          { name: 'Instant Transmission Teleport Pad', icon: '✨', status: 'Coordinates Locked' }
        ]
      },
      krrish: {
        title: 'KRRISH ISLAND SANCTUARY, ARYA BIO-TECH LAB & SINGAPORE MARINA',
        subtitle: 'With the divine cosmic gift of Jadoo and the courage of Krishna, the page transforms into a high-tech fortress of hope and superhuman valor!',
        badge: 'ASTRAL HERO GUARDIAN',
        icon: '⚡',
        bgGradient: 'linear-gradient(135deg, rgba(8, 25, 45, 0.98), rgba(6, 40, 70, 0.95), rgba(5, 15, 30, 0.98))',
        borderColor: '#06b6d4',
        accentColor: '#38bdf8',
        widgets: [
          { title: 'Jadoo Astral Energy Crystal', desc: 'Cosmic solar beacon channeling alien sun frequencies restoring 100% vitality', action: 'CHANNEL JADOO LIGHT' },
          { title: 'Dr. Arya Supercomputer Complex', desc: 'Quantum predictive mainframe calculating all future timelines to prevent destruction', action: 'CALCULATE TIMELINE' },
          { title: 'Singapore Skybridge Zipline Hub', desc: 'High-altitude ziplines and leap perches spanning between digital skyscrapers', action: 'LEAP ACROSS TOWERS' }
        ],
        posters: [
          { title: 'JADOO KI SHAKTI!', sub: 'Courage • Selflessness • Protection', quote: '“The mask is just a symbol — the real power is the courage to stand for others!”', bg: 'linear-gradient(135deg, #083344, #0284c7)', badge: 'VALOR' },
          { title: 'SUPERHUMAN SKY LEAP', sub: 'Defying Gravity with Mind and Heart', quote: '“No obstacle is too high when your heart is pure!”', bg: 'linear-gradient(135deg, #0e7490, #38bdf8)', badge: 'ASTRAL' },
          { title: 'SINGAPORE MARINA GUARDIANS', sub: 'Biotech Innovation for World Peace', quote: '“Protecting tomorrow, today!”', bg: 'linear-gradient(135deg, #0f172a, #06b6d4)', badge: 'DEFENDER' }
        ],
        roads: [
          { name: 'Skyline Skybridge Promenade', vehicles: ['⚡ Krrish Super-Leap Trail', '🚁 Police Tech Heli', '🏎️ Bio-Tech Roadster', '🏍️ Electric Stealth Bike'] },
          { name: 'Marina Bay Waterfront Esplanade', vehicles: ['🚤 Solar Hydrofoil', '⚡ Astral Pulse Cruiser', '🏎️ Singapore GT'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Krishna Mehra Mountain Hermitage', type: 'temple', pop: '+290 Himalayan Sages & Friends', desc: 'Serene mountain sanctuary echoing with flute melodies' },
          { icon: '🛡️', name: 'Krrish Guardian Rapid Response HQ', type: 'barracks', pop: '+540 Astral Volunteers', desc: 'High-altitude skydiving & acrobatic vault training rings' },
          { icon: '🏡', name: 'Singapore Sky Garden Penthouse', type: 'house', pop: '+230 Harmonious Families', desc: 'Futuristic green towers with vertical rainforest balconies' },
          { icon: '🔬', name: 'Rohit Mehra Cognitive Biotech Lab', type: 'lab', pop: '+140 Quantum Cyberneticists', desc: 'Deciphering alien radio waves from distant celestial stars' }
        ],
        watchtowers: [
          { name: 'Jadoo Solar Transmitter Dish', icon: '📡', status: 'Cosmic Ray Active' },
          { name: 'Marina Bay Skyscraper Sentry', icon: '🗼', status: 'Skyline Clear' },
          { name: 'Astral Lotus Energy Beacon', icon: '⚡', status: 'Shields at 100%' }
        ]
      },
      ben10: {
        title: 'BELLWOOD PLUMBER HEADQUARTERS & RUST BUCKET CARAVAN',
        subtitle: 'It’s Hero Time! The Level 20 Galvan Omnitrix has unlocked ultimate alien DNA, fortifying the page with Plumber alien defense tech and smoothies!',
        badge: 'GALVAN OMNITRIX HEADQUARTERS',
        icon: '🟢',
        bgGradient: 'linear-gradient(135deg, rgba(5, 30, 15, 0.98), rgba(15, 50, 25, 0.95), rgba(5, 20, 10, 0.98))',
        borderColor: '#22c55e',
        accentColor: '#4ade80',
        widgets: [
          { title: 'Omnitrix DNA Core Console', desc: 'Calibrating 1,000,912 alien DNA samples from Galvan Prime via Master Control', action: 'CYCLE ALIEN DNA' },
          { title: 'Mr. Smoothy Mega Fountain', desc: 'Ice-cold grasshopper & golden mango smoothies restoring full HP to heroes', action: 'DRINK MR. SMOOTHY' },
          { title: 'Plumber Null Void Gateway', desc: 'High-security interdimensional portal banishing cyber invaders to the Null Void', action: 'OPEN NULL VOID' }
        ],
        posters: [
          { title: 'IT’S HERO TIME!', sub: 'Benjamin Kirby Tennyson • Omnitrix Bearer', quote: '“You don’t need an Omnitrix to be a hero, but it sure makes it cooler!”', bg: 'linear-gradient(135deg, #14532d, #16a34a)', badge: 'HERO' },
          { title: 'THE ORIGINAL 10 ALIENS', sub: 'Heatblast • Four Arms • XLR8 • Diamondhead', quote: '“Whatever alien you need, the watch has got your back!”', bg: 'linear-gradient(135deg, #15803d, #22c55e)', badge: 'OMNITRIX' },
          { title: 'RUST BUCKET ROADTRIP TOUR', sub: 'Cross-Country Plumber Alien Mystery Tour', quote: '“Next stop: Mount Rushmore alien base!”', bg: 'linear-gradient(135deg, #052e16, #15803d)', badge: 'ROADTRIP' }
        ],
        roads: [
          { name: 'Bellwood Route 66 Intergalactic Highway', vehicles: ['🚐 Plumber Rust Bucket Caravan', '⚡ XLR8 Sonic Blue Streak', '🏎️ Kevin 11 Muscle Car', '🛸 Galvan Flying Saucer'] },
          { name: 'Plumber Secret Underground Tube', vehicles: ['🏎️ Plumber Hover Cruiser', '🚐 Rust Bucket Sub', '🛸 Mini Scout Pod'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Galvan Prime DNA Cathedral', type: 'temple', pop: '+320 Galvan & Cerebrocrustacean Scholars', desc: 'Floating micro-spires storing genetic memory of the galaxy' },
          { icon: '🛡️', name: 'Plumber Sector 4 Strategic Command', type: 'barracks', pop: '+620 Level 5 Plumber Cadets', desc: 'Laser blaster shooting ranges & Null Void containment grids' },
          { icon: '🏡', name: 'Bellwood Suburban Green Townhomes', type: 'house', pop: '+240 Peaceful Earthling Citizens', desc: 'Charming leafy streets with manicured lawns and smoothie stands' },
          { icon: '🔬', name: 'Azmuth Galvanic Engineering Lab', type: 'lab', pop: '+110 First Thinker Technicians', desc: 'Calibrating Level 20 Omnitrix firmware & evolutionary DNA repair' }
        ],
        watchtowers: [
          { name: 'Omnitrix Green Hologram Beacon', icon: '🟢', status: 'Dial Ready' },
          { name: 'Plumber Orbital Defense Satellite', icon: '🛰️', status: 'Earth Sector Scanned' },
          { name: 'Null Void Containment Tower', icon: '🔒', status: 'All Portals Secured' }
        ]
      },
      ajaydevgan: {
        title: 'KESARI EMPIRE, SINGHAM POLICE HEADQUARTERS & GOA CAR STUNT ARENA',
        subtitle: 'Bolo Zubaan Kesari! The legendary Bollywood superstar enters balancing on two speeding stunt cars, turning the ruins into a saffron-tinted cinematic paradise!',
        badge: 'KESARI ACTION LEGEND',
        icon: '🦁',
        bgGradient: 'linear-gradient(135deg, rgba(40, 15, 0, 0.98), rgba(65, 25, 5, 0.95), rgba(25, 10, 0, 0.98))',
        borderColor: '#e65100',
        accentColor: '#ff9800',
        widgets: [
          { title: 'Zubaan Kesari Saffron Reserve', desc: 'Vast golden vault dispensing royal saffron essence and high-potency energy to all allies', action: 'DISTRIBUTE KESARI' },
          { title: 'Singham Panja Strike Gym', desc: 'Bollywood martial training arena where one open-palm slap sends villains into orbit', action: 'TRAIN PANJA SLAP' },
          { title: 'Two-Car Stunt Simulator', desc: 'Synchronized drift track testing extreme balance and high-speed highway precision', action: 'EXECUTE TWO-CAR DRIFT' }
        ],
        posters: [
          { title: 'BOLO ZUBAAN KESARI!', sub: 'Style • Swag • Superstar Demeanor', quote: '“Daan daan mein kesari ka dum — flavor the entire universe!”', bg: 'linear-gradient(135deg, #7c2d12, #ea580c)', badge: 'KESARI' },
          { title: 'AATA MAJHI SATAKLI!', sub: 'Bajirao Singham • Lion of Goa Police', quote: '“Jisme hai dum, toh fakht Bajirao Singham!”', bg: 'linear-gradient(135deg, #9a3412, #f59e0b)', badge: 'SINGHAM' },
          { title: 'STUNT ENTRY ON TWO CARS', sub: 'The Signature Bollywood Entrance', quote: '“Why walk when you can balance between two drifting speedsters?”', bg: 'linear-gradient(135deg, #431407, #c2410c)', badge: 'LEGEND' }
        ],
        roads: [
          { name: 'Marine Drive Bollywood Stunt Highway', vehicles: ['🏎️ Twin Drifting Stunt Sedans', '🚓 Singham Police Cruiser', '🏍️ Heavy Stunt Chopper', '🏎️ Kesari Gold GT'] },
          { name: 'Goa Coastal Palm Boulevard', vehicles: ['🚓 Scorpio Stunt 4x4', '🏍️ Bullet Roarer', '🏎️ Crimson Saffron Convertible'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Zubaan Kesari Palace of Cinema', type: 'temple', pop: '+350 Bollywood Film Crew & Fans', desc: 'Magnificent golden palace screening action blockbusters 24/7' },
          { icon: '🛡️', name: 'Singham Special Anti-Crime Fortress', type: 'barracks', pop: '+680 Iron-Fisted Police Cadets', desc: 'Explosive car vaulting & anti-corruption tactical dojo' },
          { icon: '🏡', name: 'Juhu Beach Sea-Facing Bungalow', type: 'house', pop: '+260 Film Industry Legends', desc: 'Art-deco ocean estates with private screening rooms & gyms' },
          { icon: '🔬', name: 'Rohit Shetty Stunt R&D Hangar', type: 'lab', pop: '+150 Pyrotechnic Specialists', desc: 'Designing catapult rigs and flipping SUVs through fiery rings' }
        ],
        watchtowers: [
          { name: 'Singham Lion Roar Sentry Tower', icon: '🦁', status: 'Goa Coast Secured' },
          { name: 'Kesari Saffron Searchlight', icon: '✨', status: 'Illuminating Skyline' },
          { name: 'Twin Car Stunt Radar Beacon', icon: '🏎️', status: 'Drift Angles Optimal' }
        ]
      },
      salmankhan: {
        title: 'GALAXY APARTMENTS & TIGER RAW COVERT COMMAND CITADEL',
        subtitle: 'Bhaijaan is in the house! The unstoppable Bollywood Tiger claims the ruined city with the turquoise Firoza bracelet, Dabangg swagger, and pure Being Human benevolence!',
        badge: 'BHAIJAAN OF BOLLYWOOD',
        icon: '🐅',
        bgGradient: 'linear-gradient(135deg, rgba(8, 28, 48, 0.98), rgba(4, 70, 90, 0.95), rgba(6, 20, 36, 0.98))',
        borderColor: '#0284c7',
        accentColor: '#38bdf8',
        widgets: [
          { title: 'Being Human Charity Pavilion', desc: 'Global benevolence hub providing healthcare, bicycles, and hope to all citizens', action: 'DISTRIBUTE BEING HUMAN RELIEF' },
          { title: 'Panvel Farmhouse Stunt Range', desc: 'Off-road dirt trails, equestrian stables, and heavy bodybuilding iron gym', action: 'TRAIN TIGER BODYBUILDING' },
          { title: 'Chulbul Pandey Police Chowki', desc: 'High-swagger Dabangg precinct where sunglasses hang coolly behind the collar', action: 'DEPLOY DABANGG SWAGGER' }
        ],
        posters: [
          { title: 'EK BAAR JO MAINE COMMITMENT KAR DI...', sub: 'Bhaijaan • Unfiltered Legend', quote: '“...toh phir main khud ki bhi nahi sunta!”', bg: 'linear-gradient(135deg, #0369a1, #0284c7)', badge: 'COMMITMENT' },
          { title: 'TIGER ZINDA HAI!', sub: 'Avinash Singh Rathore • RAW Apex Operative', quote: '“Shikar toh sab karte hain lekin Tiger se behtar shikar koi nahi karta!”', bg: 'linear-gradient(135deg, #075985, #38bdf8)', badge: 'TIGER' },
          { title: 'SWAG SE SWAAGAT!', sub: 'Global Bollywood Anthem', quote: '“Milke baanto pyaar aur sabka swaagat karo!”', bg: 'linear-gradient(135deg, #0c4a6e, #06b6d4)', badge: 'SWAG' }
        ],
        roads: [
          { name: 'Bandra Bandstand Sea-Facing Highway', vehicles: ['🚙 Tiger RAW Armored Cruiser', '🏍️ Hayabusa Superbike', '🏎️ Galaxy Blue Supercar', '🚲 Being Human E-Bike'] },
          { name: 'Panvel Farmhouse Dirt Express', vehicles: ['🚜 Heavy Farm Tractor', '🐎 Arabian Thoroughbred Stallions', '🚙 4x4 Offroad Beast'] }
        ],
        buildings: [
          { icon: '🏢', name: 'Galaxy Apartments Sea-View Complex', type: 'temple', pop: '+500 Thousands of Cheering Fans', desc: 'Famous balcony where Bhai greets millions of adoring devotees' },
          { icon: '🛡️', name: 'Chulbul Pandey Dabangg Precinct', type: 'barracks', pop: '+750 Aviator-Wearing Police Commandos', desc: 'Mustache grooming parlor & belt-shaking acoustic training hall' },
          { icon: '🏡', name: 'Panvel Organic Farmstead Villa', type: 'house', pop: '+180 Family & Fitness Crew', desc: 'Serene lakeside haven with outdoor gym and riding tracks' },
          { icon: '🔬', name: 'Tiger Covert RAW Technical Bunker', type: 'lab', pop: '+120 Cyber Intelligence Hackers', desc: 'Tracking villainous cartels and calibrating combat titanium bracelets' }
        ],
        watchtowers: [
          { name: 'Turquoise Firoza Beacon Tower', icon: '💎', status: 'Radiating Good Luck' },
          { name: 'Galaxy Balcony Searchlight', icon: '🏢', status: 'Bandra Wave Illuminated' },
          { name: 'Tiger Recon Drone Array', icon: '🛰️', status: 'Airspace Secured' }
        ]
      },
      akshaykumar: {
        title: 'KHILADI MARTIAL ARTS ACADEMY & 25-DIN GOLDEN VAULT',
        subtitle: 'Khiladi 786 has landed! From 4:00 AM workouts to death-defying helicopter stunts, the martial arts master rebuilds the DOM with pure stamina and Hera Pheri gold!',
        badge: 'KHILADI SUPREME',
        icon: '🥋',
        bgGradient: 'linear-gradient(135deg, rgba(38, 20, 0, 0.98), rgba(70, 40, 5, 0.95), rgba(30, 15, 0, 0.98))',
        borderColor: '#f59e0b',
        accentColor: '#fbbf24',
        widgets: [
          { title: '25-Din-Mein-Paisa-Double Vault', desc: 'Legendary Hera Pheri financial institution doubling gold coins every 25 days', action: 'INVEST IN LAXMI CHIT FUND' },
          { title: '4:00 AM Brahma Muhurta Fitness Arena', desc: 'Strict sunrise calisthenics, tree climbing, and obstacle courses for all citizens', action: 'START 4 AM WORKOUT' },
          { title: 'Helicopter Stunt Skid Platform', desc: 'Hanging from helicopter skids in mid-air with zero green-screen or stunt doubles', action: 'PERFORM ROTOR HANG' }
        ],
        posters: [
          { title: 'DON’T ANGRY ME!', sub: 'Rowdy Rathore • Vikram Rathore IPS', quote: '“Jo main bolta hoon woh main karta hoon, jo nahi bolta woh definitely karta hoon!”', bg: 'linear-gradient(135deg, #b45309, #d97706)', badge: 'ROWDY' },
          { title: '25 DIN MEIN PAISA DOUBLE!', sub: 'Raju • Hera Pheri Finance Mastermind', quote: '“Golmaal hai bhai sab golmaal hai! Zor zor se bolke scheme bata de!”', bg: 'linear-gradient(135deg, #78350f, #f59e0b)', badge: 'HERA PHERI' },
          { title: 'KHILADI 786', sub: 'The Master of 100 Stunts', quote: '“Jigar mein aag aur seene mein dum, hum hain Khiladi no. 1!”', bg: 'linear-gradient(135deg, #451a03, #fbbf24)', badge: 'KHILADI' }
        ],
        roads: [
          { name: 'Khiladi Speed Stunt Runway', vehicles: ['🚁 Stunt Rotorcraft', '🏎️ Golden Lambo Racer', '🏍️ Royal Enfield Khiladi Bullet', '🚲 High-Speed Carbon Bicycle'] },
          { name: 'Hera Pheri Taxi Boulevard', vehicles: ['🚕 Babu Bhaiya Fiat Taxi', '🚐 Vintage Red Delivery Van', '🚚 Samosa Express Truck'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Grand Hera Pheri Treasury Complex', type: 'temple', pop: '+420 Babu Bhaiya & Raju Associates', desc: 'Massive vault filled with glittering gold bullion and double returns' },
          { icon: '🥋', name: 'Khiladi Black Belt Combat Hangar', type: 'barracks', pop: '+820 Disciplined Martial Artists', desc: 'Taekwondo kickboards, iron palm bags, and high-altitude wire rigs' },
          { icon: '🏡', name: 'Juhu Oceanfront Zen Sanctuary', type: 'house', pop: '+210 Family & Personal Trainers', desc: 'Eco-friendly bamboo pavilions, organic herb gardens, and beach track' },
          { icon: '🔬', name: 'Stunt Engineering & Safety Lab', type: 'lab', pop: '+130 Stunt Rigging Engineers', desc: 'Designing harness cables, crash mats, and fire-resistant stunt suits' }
        ],
        watchtowers: [
          { name: '786 Golden Sentry Spire', icon: '✨', status: 'Radiating Golden Aura' },
          { name: '4 AM Sunrise Watchtower', icon: '🌅', status: 'Morning Patrol Active' },
          { name: 'Helicopter Helipad Beacon', icon: '🚁', status: 'Clear for Stunt Landing' }
        ]
      },
      katrinakaif: {
        title: 'KAMLI DANCE PALACE & TIGER ZOYA SPECIAL OPERATIONS VAULT',
        subtitle: 'The Queen of Bollywood Dance and elite operative Zoya! Transforming the battle zone with mesmerizing rhythm, glittering stardust, and tactical sharpshooting precision!',
        badge: 'DIVA & APEX AGENT',
        icon: '💃',
        bgGradient: 'linear-gradient(135deg, rgba(45, 10, 30, 0.98), rgba(75, 15, 55, 0.95), rgba(30, 5, 20, 0.98))',
        borderColor: '#ec4899',
        accentColor: '#f472b6',
        widgets: [
          { title: 'Kamli Aerial Silk Studio', desc: 'High-altitude acrobatic studio training flexibility, rhythm, and whirlwind dance attacks', action: 'PRACTICE AERIAL SILKS' },
          { title: 'Zoya Covert Armory & Firing Range', desc: 'State-of-the-art dual-wielding SMG simulation and hand-to-hand combat dojo', action: 'CALIBRATE AKIMBO SMGS' },
          { title: 'Kay Beauty Cosmetics Pavilion', desc: 'Glamour laboratory synthesizing radiant stardust powders that blind and charm foes', action: 'SYNTHESIZE GLITTER STARDUST' }
        ],
        posters: [
          { title: 'MAIN KAMLI HO GAYI!', sub: 'Dhoom 3 • Whirlwind Acrobatic Marvel', quote: '“Rhythm in motion, unstoppable grace in every beat!”', bg: 'linear-gradient(135deg, #be185d, #ec4899)', badge: 'KAMLI' },
          { title: 'SHEILA KI JAWANI!', sub: 'Bollywood’s Most Electrifying Number', quote: '“Pure energy, pure charisma, taking over the center stage!”', bg: 'linear-gradient(135deg, #9d174d, #f43f5e)', badge: 'SHEILA' },
          { title: 'ZOYA: TIGER’S DEADLIEST PARTNER', sub: 'Covert Operative Extraordinaire', quote: '“A nation’s greatest asset and a villain’s worst nightmare.”', bg: 'linear-gradient(135deg, #701a75, #a855f7)', badge: 'ZOYA' }
        ],
        roads: [
          { name: 'Glittering Stardust Fashion Avenue', vehicles: ['🏎️ Magenta Supercar', '🏍️ Matte Black Stealth Ducati', 'Limousine Champagne Cruiser', '🚁 Tactical Covert Chopper'] },
          { name: 'Broadway Dance Promenade', vehicles: ['🩰 Illuminated Parade Floats', '🛵 Retro Vespa Scooters', '🏎️ Pink Pearl Convertible'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Grand Kamli Opera & Dance Colosseum', type: 'temple', pop: '+480 Dancers & Choreographers', desc: 'Magnificent velvet amphitheater with rotating crystal stages' },
          { icon: '🛡️', name: 'Zoya ISI-RAW Joint Operations Base', type: 'barracks', pop: '+650 Elite Female Agents', desc: 'Tactical sniper perches, laser wire training rooms, and armories' },
          { icon: '🏡', name: 'Bandra Glamour Penthouse Residence', type: 'house', pop: '+190 Fashion Icons & Guests', desc: 'Panoramic Arabian Sea views with private makeup suites & gyms' },
          { icon: '🔬', name: 'Kay Beauty Glow Research Lab', type: 'lab', pop: '+140 Cosmetic Scientists', desc: 'Formulating ultra-radiant minerals and holographic glitter shields' }
        ],
        watchtowers: [
          { name: 'Stardust Hologram Beacon', icon: '✨', status: 'Radiating Magenta Beams' },
          { name: 'Kamli Aerial Sentry Perch', icon: '💃', status: 'Dance Patrol in Sync' },
          { name: 'Zoya Sniper Recon Pod', icon: '🎯', status: 'Perimeter 100% Clear' }
        ]
      },
      aishwaryarai: {
        title: 'DOLA RE ROYAL HAVELI & IMPERIAL JEWEL PRISM PALACE',
        subtitle: 'The timeless Empress of Indian Cinema and Miss World! Infusing the domain with royal ghungroo rhythms, emerald brilliance, and unmatched celestial majesty!',
        badge: 'ETERNAL QUEEN OF BEAUTY',
        icon: '👑',
        bgGradient: 'linear-gradient(135deg, rgba(20, 10, 45, 0.98), rgba(40, 15, 80, 0.95), rgba(15, 5, 35, 0.98))',
        borderColor: '#a855f7',
        accentColor: '#c084fc',
        widgets: [
          { title: 'Dola Re Dola Courtyard', desc: 'Royal marble courtyard where synchronized Kathak dancers summon divine sonic waves', action: 'SOUND GHUNGROO BELLS' },
          { title: 'Miss World Emerald Diamond Vault', desc: 'Gleaming treasury of world-renowned crowns and prisms of pure emerald light', action: 'REFRACT EMERALD BEAMS' },
          { title: 'Sunheri Dhoom Mastermind Chamber', desc: 'High-tech stealth chamber where intricate museum heists and acrobatics are planned', action: 'PLAN ROYAL HEIST' }
        ],
        posters: [
          { title: 'DOLA RE DOLA RE DOLA!', sub: 'Devdas • Timeless Masterpiece', quote: '“Chhalke jhalke sajke dhalke — the eternal dance of love and devotion!”', bg: 'linear-gradient(135deg, #7e22ce, #a855f7)', badge: 'DOLA RE' },
          { title: 'MISS WORLD & GLOBAL ICON', sub: 'The Crown of Universal Grace', quote: '“Grace in thought, kindness in action, royalty in presence.”', bg: 'linear-gradient(135deg, #6b21a8, #c084fc)', badge: 'QUEEN' },
          { title: 'SUNHERI: DHOOM 2 CAT BURGLAR', sub: 'High-Stakes Mastermind', quote: '“Are you like checking me out? Diamonds never lie!”', bg: 'linear-gradient(135deg, #581c87, #e879f9)', badge: 'SUNHERI' }
        ],
        roads: [
          { name: 'Imperial Cannes Red Carpet Boulevard', vehicles: ['💎 Diamond-Studded Royal Chariot', '🏎️ Amethyst Phantom Coupe', 'Limousine Royal Rolls Royce', '🏍️ Chrome Stealth Speeder'] },
          { name: 'Devdas Marble Palace Causeway', vehicles: ['🛺 Gold Filigree Palanquins', '🐎 White Royal Steeds', '🏎️ Violet Pearl Roadster'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Imperial Dola Re Palace of Kathak', type: 'temple', pop: '+520 Classical Artists & Musicians', desc: 'Grand royal palace echoing with sitar melodies and tabla rhythms' },
          { icon: '🛡️', name: 'Royal Guard Jodha Imperial Citadel', type: 'barracks', pop: '+700 Golden Armor Royal Sentinels', desc: 'Archery courtyards, sword pavilions, and royal ceremonial guards' },
          { icon: '🏡', name: 'Jalsa Royal Family Waterfront Estate', type: 'house', pop: '+220 Regal Family & Scholars', desc: 'Aristocratic sandstone archways, lotus fountains, and libraries' },
          { icon: '🔬', name: 'Emerald Refraction Optics Academy', type: 'lab', pop: '+160 Gemological Light Masters', desc: 'Tuning hypnotic light beams that calm titans and cure all fatigue' }
        ],
        watchtowers: [
          { name: 'Miss World Crown Jewel Spire', icon: '👑', status: 'Gleaming Across Skies' },
          { name: 'Emerald Radiance Sentry Tower', icon: '💚', status: 'Hypnotic Shield Active' },
          { name: 'Dola Re Chime Pillar', icon: '🔔', status: 'Echoing Musical Blessings' }
        ]
      },
      baalveer: {
        title: 'PARI LOK REALM OF 7 FAIRIES & SHAURYA ASTRAL CITADEL',
        subtitle: 'Shaurya ki shakti! The pure-hearted superhero of Pari Lok protects the universe, casting seven-colored fairy blessings and banishing darkness with the magic wand!',
        badge: 'SAVIOR OF PARI LOK',
        icon: '🪄',
        bgGradient: 'linear-gradient(135deg, rgba(8, 20, 45, 0.98), rgba(12, 45, 80, 0.95), rgba(5, 15, 35, 0.98))',
        borderColor: '#06b6d4',
        accentColor: '#22d3ee',
        widgets: [
          { title: 'Seven Fairies Astral Well', desc: 'Mystical crystal well channeling powers of Natkhat Pari, Gaal Pari, Vijhdar Pari & all 7 realms', action: 'CHANNEL 7 FAIRY BLESSINGS' },
          { title: 'Shaurya Magic Wand Armory', desc: 'Sacred forge where the golden wand is charged with cosmic starlight and righteousness', action: 'CHARGE SHAURYA WAND' },
          { title: 'Baal Mitra Child Protection Sanctuary', desc: 'Safe haven for children everywhere, guarded by floating fairy shields and smiling cherubs', action: 'CAST CHILDREN’S ASTRAL SHIELD' }
        ],
        posters: [
          { title: 'SHAURYA KI SHAKTI!', sub: 'Baalveer • Protector of Earth & Pari Lok', quote: '“Sachai ki hamesha jeet hoti hai, aur burai ka ant nishchit hai!”', bg: 'linear-gradient(135deg, #0e7490, #06b6d4)', badge: 'SHAURYA' },
          { title: 'PARI LOK KI RANI PARI', sub: 'Guardian of the Seven Fairy Thrones', quote: '“Baalveer, Pari Lok ka samman tumhare haathon mein surakshit hai!”', bg: 'linear-gradient(135deg, #0891b2, #22d3ee)', badge: 'PARI LOK' },
          { title: 'BAAL SAKHA & SUPERPOWERS', sub: 'Defender of the Innocent', quote: '“Fly high, strike true, and protect everyone in need!”', bg: 'linear-gradient(135deg, #155e75, #67e8f9)', badge: 'DEFENDER' }
        ],
        roads: [
          { name: 'Rainbow Cloud Astral Highway', vehicles: ['🌈 Floating Seven-Color Cloud', '🪄 Golden Shaurya Sky Sled', '🛸 Pari Lok Astral Cruiser', '🦅 Giant Golden Gryphon'] },
          { name: 'Dharti-Lok Supersonic Transit Lane', vehicles: ['⚡ Supersonic Cape Streak', '🛷 Silver Stardust Chariot', '🛸 Mini Fairy Scout Ship'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Rani Pari Seven Thrones Crystal Temple', type: 'temple', pop: '+550 Fairies & Astral Guardians', desc: 'Floating quartz towers with fountains of eternal light and fairy dust' },
          { icon: '🛡️', name: 'Shaurya Warrior Vanguard Academy', type: 'barracks', pop: '+720 Young Astral Protectors', desc: 'Magic wand dueling rings and aerial flight obstacle courses' },
          { icon: '🏡', name: 'Baalveer Earthly Home & School Haven', type: 'house', pop: '+280 Happy Children & Families', desc: 'Cozy neighborhood homes with playground swings and toy workshops' },
          { icon: '🔬', name: 'Pari Lok Astral Alchemy Observatory', type: 'lab', pop: '+130 Elder Mystic Alchemists', desc: 'Brewing potions of pure courage and repairing cracks in dimension gates' }
        ],
        watchtowers: [
          { name: 'Shaurya Cosmic Beacon', icon: '🪄', status: 'Wand Energy at 100%' },
          { name: 'Seven Fairies Rainbow Spire', icon: '🌈', status: 'Astral Dome Fully Online' },
          { name: 'Child Protection Watchtower', icon: '⭐', status: 'Guarding All Smiles' }
        ]
      }
    };

    const data = REALM_DATA[species] || REALM_DATA['dragon'];

    // Party companions data
    const PARTY_DATA = {
      vader: {
        partyName: 'Imperial Victory Gala & Officers Banquet',
        tables: 'Obsidian Banquet Tables loaded with Coruscant Wine 🍷, Death Star Cocktails 🍸 & Imperial Caviar 🍱',
        companions: ['Imperial Moff', 'Sith Acolyte', 'Cantina Singer', 'Royal Guard'],
        quotes: ['“To the New Galactic Order!”', '“The Emperor will be pleased!”', '“Play the Imperial Jive!”', '“Pour another glass of Corellian Brandy!”']
      },
      captainamerica: {
        partyName: 'Brooklyn 1940s Big Band USO Victory Dance & Gala',
        tables: 'Classic Diner Booths with Warm Apple Pies 🥧, Bourbon Eggnog 🥃 & Brooklyn Root Beer 🍺',
        companions: ['Peggy Carter', 'Bucky Barnes', 'Falcon (Sam Wilson)', 'SSR Special Agent'],
        quotes: ['“I can dance all day!”', '“To freedom and victory!”', '“Best USO show in Brooklyn!”', '“Language, soldiers!”']
      },
      hawkeye: {
        partyName: 'Barton Farm Rustic BBQ & Target Practice Bonfire Party',
        tables: 'Rustic Cedar Picnic Tables with Smoked Brisket 🥩, Apple Cider 🍺 & Roasted Sweet Corn 🌽',
        companions: ['Kate Bishop', 'Laura Barton', 'Lucky the Pizza Dog 🐶', 'SHIELD Elite Sniper'],
        quotes: ['“Never miss a single party!”', '“Pass the BBQ sauce, Kate!”', '“Pizza dog approved this feast!”', '“Bullseye every time!”']
      },
      blackwidow: {
        partyName: 'Budapest Safehouse VIP Lounge & Caviar Soiree',
        tables: 'Sleek Black Marble Tables with Russian Vodka 🍸, Hungarian Goulash 🍲 & Beluga Caviar 🍱',
        companions: ['Yelena Belova', 'Alexei (Red Guardian)', 'Melina Vostokoff', 'MI6 Allied Agent'],
        quotes: ['“This is the best party in Budapest!”', '“More vodka for the Red Guardian!”', '“Ledger is clean, let’s dance!”', '“Pose for the victory shot!”']
      },
      ironman: {
        partyName: 'Stark Tower VIP Penthouse & Cocktail Bash',
        tables: 'Holographic Glass Tables with Champagne Flutes 🍾, Cheeseburgers 🍔 & Arc Reactor Martinis 🍸',
        companions: ['Pepper Potts', 'JARVIS DJ Holo', 'Avengers VIP Guest', 'Stark Intern'],
        quotes: ['“Drinks are on Stark Industries!”', '“Jarvis, crank the volume to 11!”', '“Best party since New York!”', '“Is that a vintage Dom Pérignon?”']
      },
      spiderman: {
        partyName: 'Queens Rooftop Pizza Party & Web Hangout',
        tables: 'Foldable Picnic Tables with Large Pepperoni Pizzas 🍕, Soda Cans 🥤 & Web Cotton Candy 🍭',
        companions: ['MJ Watson', 'Ned Leeds', 'Aunt May', 'Daily Bugle Photographer'],
        quotes: ['“Extra cheese for everyone!”', '“Peter, take a picture of this web cake!”', '“Queens party is unmatched!”', '“Web-line trampoline is open!”']
      },
      batman: {
        partyName: 'Wayne Manor Charity Gala & Batcave Banquet',
        tables: 'Mahogany Banquet Tables with Vintage Bordeaux 🍷, Smoked Steaks 🥩 & Gotham Truffles 🍫',
        companions: ['Alfred Pennyworth', 'Catwoman', 'Commissioner Gordon', 'Gotham Socialite'],
        quotes: ['“A toast to Gotham’s new dawn.”', '“Master Wayne sends his regards.”', '“The night belongs to justice.”', '“More champagne, sir?”']
      },
      thor: {
        partyName: 'Valhalla Golden Mead Feast & Thunder Toast',
        tables: 'Massive Carved Oak Benches with Golden Mead Horns 🍺, Roasted Wild Boar 🍖 & Asgardian Apples 🍎',
        companions: ['Lady Sif', 'Valkyrie', 'Korg', 'Heimdall'],
        quotes: ['“Another tankard of glorious mead!”', '“By Odin’s beard, what a triumph!”', '“Raise your horns to victory!”', '“Play the thunder harp!”']
      },
      dragon: {
        partyName: 'Volcanic Dragon Fire Banquet & Hoard Feast',
        tables: 'Molten Obsidian Slabs loaded with Fire-Roasted Venison 🍗, Dragonfire Ale 🍺 & Golden Fruit 🍊',
        companions: ['Elder Red Wyrm', 'Flame Shaman', 'Hoard Guardian', 'Dragon Rider'],
        quotes: ['“Let the dragonfire burn forever!”', '“A toast to the eternal hoard!”', '“Drink deep from the magma chalice!”', '“Roar into the night sky!”']
      },
      godzilla: {
        partyName: 'Hollow Earth Kaiju Apex Festival',
        tables: 'Titan Crystal Slabs loaded with Geothermal Nectar 🍹, Bioluminescent Seafood 🦞 & Energy Fruit 🍈',
        companions: ['Dr. Serizawa', 'Monarch Director', 'Kong (Allied King)', 'Mothra Spirit'],
        quotes: ['“Nature has found its king!”', '“Long live Titanus Gojira!”', '“The Earth is in harmony!”', '“A triumphant atomic roar!”']
      },
      mecha: {
        partyName: 'Cyber Matrix Neon Rave & AI System Overclock',
        tables: 'Fiber-Optic Neon Bars with Liquid Nitrogen Cocktails 🍸 & Battery Fuel Cells 🔋',
        companions: ['AI Core Hologram', 'Cyber Pilot', 'Android DJ', 'Nanotech Engineer'],
        quotes: ['“Protocol 100% complete!”', '“Overclocking rave frequencies!”', '“System efficiency at maximum!”', '“Digital perfection achieved!”']
      },
      cthulhu: {
        partyName: "Abyssal R'lyeh Deep Sea Feast & Cosmic Revel",
        tables: 'Ancient Sunken Stone Altars with Bioluminescent Nectar 🧃 & Eldritch Shellfish 🦑',
        companions: ['Deep Sea Priest', 'Star Spawn Cultist', 'Mermaid Mystic', 'Void Dreamer'],
        quotes: ["“Ph'nglui mglw'nafh!”", '“The deep ocean awakens!”', '“Drink the purple cosmic mist!”', '“The stars are aligned!”']
      },
      kong: {
        partyName: 'Primal Hollow Earth Jungle Feast & Drum Circle',
        tables: 'Giant Hollow Logs with Tropical Mangoes 🥭, Roasted Coconuts 🥥 & Primal Wine 🍷',
        companions: ['Jia (Iwi Tribe)', 'Monarch Guide', 'Iwi Shaman', 'Jungle Guardian'],
        quotes: ['“The King protects his island!”', '“Beat the giant war drums!”', '“Eat the sweetest jungle fruit!”', '“Roar for the King of the Apes!”']
      },
      cerberus: {
        partyName: 'Underworld Tartarus Masquerade & Soul Flame Feast',
        tables: 'Obsidian Fire Pits with Pomegranate Nectar 🍷, Spicy Brimstone Ribs 🍖 & Underworld Cider 🍺',
        companions: ['Underworld Nymph', 'Hades Guard', 'Soul Singer', 'Brimstone Shaman'],
        quotes: ['“Three heads, three times the party!”', '“Drink from the River Styx!”', '“Hellfire burns with joy tonight!”', '“Let the underworld dance begin!”']
      },
      flash: {
        partyName: 'Central City CC Jitters & Speedster Victory Party',
        tables: 'High-Tech Cafe Booths with Triple-Espresso Lattes ☕, 10,000 Calorie Burgers 🍔 & Golden Lightning Donuts 🍩',
        companions: ['Iris West-Allen', 'Cisco Ramon', 'Caitlin Snow', 'Reverse-Flash (Reformed)'],
        quotes: ['“Fastest party in the multiverse!”', '“Cisco made this DJ mix in three seconds!”', '“Another 50 burgers, please!”', '“Speed Force is rocking tonight!”']
      },
      superman: {
        partyName: 'Metropolis Centennial Park Peace Gala & Solar Banquet',
        tables: 'Marble Garden Tables with Kansas Sweet Apple Pie 🥧, Chilled Grape Juice 🍇 & Golden Roast Beef 🥩',
        companions: ['Lois Lane', 'Jimmy Olsen', 'Supergirl (Kara)', 'Perry White'],
        quotes: ['“Great Caesar’s Ghost, what a celebration!”', '“To truth, justice, and all our friends!”', '“Best front-page story in Daily Planet history!”', '“Look! Up in the sky! It’s party time!”']
      },
      shaktiman: {
        partyName: 'Suryavanshi Diwali Festival of Lights & Vedic Feast',
        tables: 'Sacred Teak Low Tables with Kaju Katli 🍬, Pure Cow Ghee Ladoos 🧆, Masala Chai ☕ & Saffron Halwa 🍯',
        companions: ['Geeta Vishwas', 'Mahaguru Suryavanshi', 'Inspector Amar', 'Chhoti Si Gudiya'],
        quotes: ['“Satyamev Jayate! Let there be light in every heart!”', '“Eat sweets, speak sweet truth!”', '“Burai par achhai ki jeet!”', '“OM Shanti Shanti Shanti!”']
      },
      odessa: {
        partyName: 'Junkertown Thunderdome Pit Roast & Heavy Metal Bash',
        tables: 'Crushed Mech Engine Blocks loaded with Roasted Boar 🍖, Nitro Moonshine 🥃 & Spiced Jerky 🥩',
        companions: ['Wrecking Ball (Hammond)', 'Roadhog', 'Junkrat', 'Scrapyard Arena Master'],
        quotes: ['“Drink up, you mongrels!”', '“Turn the heavy metal speakers up!”', '“Nobody parties harder than the Queen!”', '“More fireworks, Junkrat!”']
      },
      doremon: {
        partyName: '22nd Century Dorayaki Sky Carnival & Matsuri',
        tables: 'Hovering Cloud Platforms overflowing with Sweet Dorayaki 🥞, Ramune Soda 🍾 & Green Tea Mochi 🍡',
        companions: ['Nobita Nobi', 'Shizuka Minamoto', 'Dorami (Sister)', 'Takeshi (Gian) DJ'],
        quotes: ['“Boku Doraemon! Eat as many dorayaki as you want!”', '“Gian’s singing actually sounds great tonight!”', '“Take-Copters for everybody!”', '“Doraemon, this is the best festival ever!”']
      },
      messi: {
        partyName: 'Obelisco World Champion Asado & Cumbia Fiesta',
        tables: 'Long Argentine Wooden Tables loaded with Grilled Asado Steaks 🥩, Yerba Mate Gourds 🧉 & Dulce de Leche Alfajores 🍪',
        companions: ['Antonela Roccuzzo', 'Rodrigo De Paul', 'Ángel Di María', 'Kun Agüero'],
        quotes: ['“Muchaaaachos! Ahora nos volvimo’ a ilusionar!”', '“Pass the yerba mate, Rodri!”', '“Que mirás, bobo? Come y baila!”', '“Somos campeones del mundo!”']
      },
      ronaldo: {
        partyName: 'Estádio CR7 Royal Merengue Gala & Champions Toast',
        tables: 'Pristine White Marble Tables with Grilled Sea Bass 🐟, Fresh Fruit Salads 🍉, Pastel de Nata 🧁 & Sparkling Water 🥂',
        companions: ['Georgina Rodríguez', 'Cristiano Jr.', 'Fernando Santos', 'Merengue Teammate'],
        quotes: ['“SIUUUU! Champions never rest, but tonight we celebrate!”', '“Aqua, not Coca-Cola!”', '“Dedication, focus, perfection!”', '“Number one in the world!”']
      },
      goku: {
        partyName: 'Mount Paozu Dragon Ball Victory Feast & Barbecue',
        tables: 'Colossal Wooden Tables overflowing with Roasted Whole Boars 🍖, Giant Ramen Bowls 🍜, Steamed Buns 🥟 & Senzu Beans 🫘',
        companions: ['Chi-Chi', 'Gohan', 'Vegeta (Prince of Saiyans)', 'Master Roshi', 'Krillin'],
        quotes: ['“I’m so hungry I could eat a dinosaur!”', '“Kakacarrot-cake, stop eating my meat!”', '“Senzu beans for dessert!”', '“Dragon Balls are shining bright!”']
      },
      krrish: {
        partyName: 'Krrish Victory Carnival & Bollywood Festival of Valor',
        tables: 'Lavish Festive Tables with Samosas 🥟, Sweet Gulab Jamuns 🧆, Mango Lassi 🥭 & Kashmiri Kahwa 🍵',
        companions: ['Priya (Journalist)', 'Rohit Mehra (Father)', 'Jadoo (Cosmic Alien)', 'Dr. Siddhant Arya (Reformed)'],
        quotes: ['“Jadoo ki shakti sabke dilon mein hai!”', '“Proud of you, my son Krishna!”', '“Best front-page scoop in Singapore!”', '“Dhoop! Dhoop! Let’s dance!”']
      },
      ben10: {
        partyName: 'Rust Bucket Summer Roadtrip BBQ & Alien Jam',
        tables: 'Campfire Picnic Tables with Grandpa Max’s Alien Tentacle Chili 🥣, Mr. Smoothies 🥤 & Flame-Grilled Burgers 🍔',
        companions: ['Gwen Tennyson (Lucky Girl)', 'Grandpa Max (Plumber Magister)', 'Kevin Levin (Kevin 11)', 'Azmuth (First Thinker)'],
        quotes: ['“It’s Hero Time! Pass the fries!”', '“Ben, don’t eat all the chili, you’ll turn into Heatblast!”', '“Try my secret deep-space worm stew, kids!”', '“A victory worthy of the Omnitrix!”']
      },
      ajaydevgan: {
        partyName: 'Bolo Zubaan Kesari Grand Bollywood Celebration & Car Stunt Gala',
        tables: 'Golden Royal Buffet with Biryani Pots 🍲, Tandoori Platters 🍗, Saffron Kulfi 🍨 & Kesari Chai ☕',
        companions: ['Kareena Kapoor (Co-Star)', 'Rohit Shetty (Stunt Director)', 'Inspector Daya (Door Breaker)', 'Akshay Kumar (Khiladi)'],
        quotes: ['“Bolo Zubaan Kesari! Aaj ki raat apun ka raj hai!”', '“Sir, ek gaadi aur uda dein hawa mein?”', '“Daya, darwaza todne ki zaroorat nahi, party shuru hai!”', '“Aata majhi satakli... with pure joy!”']
      },
      salmankhan: {
        partyName: 'Galaxy Apartments Balcony Eid Gala & Biryani Feast',
        tables: 'Mutton Dum Biryani Degchis 🍲, Sheer Khurma Bowls 🥣, Turquoise Mocktails 🍹 & Kaju Katli Platters 🍬',
        companions: ['Shera (Head of Security)', 'Katrina Kaif (Zoya)', 'Jacqueline Fernandez', 'Arbaaz Khan'],
        quotes: ['“Swag se karenge sabka swaagat!”', '“Ek baar jo maine commitment kar di toh bas!”', '“Bhaijaan style celebration!”', '“Party chalegi subah tak!”']
      },
      akshaykumar: {
        partyName: 'Khiladi Stunt Champions Banquet & Hera Pheri 25-Din Feast',
        tables: 'Crispy Butter Masala Dosas 🥞, Punjabi Kadhi Chawal 🍛, High-Protein Energy Shakes 🥤 & Jalebi Towers 🥨',
        companions: ['Paresh Rawal (Babu Bhaiya)', 'Suniel Shetty (Shyam)', 'Raveena Tandon', 'Katrina Kaif'],
        quotes: ['“25 din mein celebration double!”', '“Zor zor se bolke sabko feast bata de!”', '“Khiladi 786 style party!”', '“Subah 4 baje uthna hai exercise ke liye!”']
      },
      katrinakaif: {
        partyName: 'Kamli Grand Bollywood Glamour Soiree & Dance Gala',
        tables: 'Organic Avocado Citrus Salads 🥑, Sparkling Pink Berry Smoothies 🍓, Turkish Baklava 🍯 & Macrobiotic Treats 🥗',
        companions: ['Salman Khan (Tiger)', 'Vicky Kaushal', 'Farah Khan (Choreographer)', 'Deepika Padukone'],
        quotes: ['“Main kamli ho gayi victory mein!”', '“Sheila ki jawani is rocking the dance floor!”', '“Zoya mission accomplished: celebration time!”', '“Dance like the whole world is watching!”']
      },
      aishwaryarai: {
        partyName: 'Dola Re Dola Royal Court Feast & Emerald Empress Soiree',
        tables: 'Royal Nawabi Biryani Platters 🍲, Ethereal Saffron Malpua 🍯, Emerald Pistachio Kulfi 🍨 & Darjeeling First Flush Tea 🍵',
        companions: ['Shah Rukh Khan (Devdas)', 'Madhuri Dixit (Chandramukhi)', 'Abhishek Bachchan', 'Amitabh Bachchan'],
        quotes: ['“Dola re dola re dola, celebrate with royal elegance!”', '“An ethereal evening of timeless grace and victory!”', '“Beauty, strength and dignity reign supreme!”', '“Let the ghungroos chime all night!”']
      },
      baalveer: {
        partyName: 'Pari Lok Seven-Color Nectar Banquet & Astral Sky Revel',
        tables: 'Seven-Color Fairy Dust Cupcakes 🧁, Rainbow Lotus Nectar 🧃, Pari Lok Golden Apples 🍎 & Sweet Khoya Barfi 🍬',
        companions: ['Rani Pari (Queen of Fairies)', 'Natkhat Pari', 'Gaal Pari', 'Manav & Meher'],
        quotes: ['“Shaurya ki shakti, sachai ki jeet!”', '“Pari Lok mein sabhi bacchon aur heroes ka swaagat hai!”', '“Burai par achhai ka parcham lehra gaya!”', '“Baalveer hamesha sachai ke saath khada hai!”']
      }
    };

    const party = PARTY_DATA[species] || PARTY_DATA['dragon'];

    // Create Thematic Realm Container
    const realm = document.createElement('div');
    realm.id = 'warzone-rebuilt-realm';
    realm.className = 'warzone-ignored';
    realm.style.setProperty('position', 'relative', 'important');
    realm.style.setProperty('width', '100%', 'important');
    realm.style.setProperty('max-width', '1200px', 'important');
    realm.style.setProperty('margin', '20px auto', 'important');
    realm.style.setProperty('padding', '24px', 'important');
    realm.style.setProperty('background', data.bgGradient, 'important');
    realm.style.setProperty('border', `2px solid ${data.borderColor}`, 'important');
    realm.style.setProperty('border-radius', '20px', 'important');
    realm.style.setProperty('box-shadow', `0 24px 80px rgba(0,0,0,0.95), 0 0 50px ${data.borderColor}44`, 'important');
    realm.style.setProperty('color', '#ffffff', 'important');
    realm.style.setProperty('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 'important');
    realm.style.setProperty('z-index', '2147483640', 'important');
    realm.style.setProperty('animation', 'warzoneRealmFadeIn 0.8s ease-out', 'important');

    // 1. Top Conquest Header & Live Dominion Status Bar
    const topBarHTML = `
      <div id="wz-realm-top-bar" style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 2px solid ${data.borderColor}44; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <span style="font-size: 38px; filter: drop-shadow(0 0 12px ${data.borderColor});">${data.icon}</span>
          <div>
            <div style="font-size: 11px; font-weight: 900; letter-spacing: 1.5px; color: ${data.accentColor}; background: rgba(0,0,0,0.4); padding: 2px 8px; border-radius: 4px; display: inline-block;">
              👑 ${data.badge}
            </div>
            <div style="font-size: 24px; font-weight: 900; color: #fff; text-shadow: 0 0 15px ${data.borderColor};">
              ${name} • SOVEREIGN DOMAIN
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <div style="background: rgba(0,0,0,0.4); border: 1px solid ${data.borderColor}44; padding: 6px 14px; border-radius: 10px; text-align: center;">
            <div style="font-size: 10px; color: #94a3b8;">DOMINION POPULATION</div>
            <div id="wz-total-population" style="font-size: 16px; font-weight: 900; color: #fef08a;">1,420 Residents</div>
          </div>
          <div style="background: rgba(0,0,0,0.4); border: 1px solid ${data.borderColor}44; padding: 6px 14px; border-radius: 10px; text-align: center;">
            <div style="font-size: 10px; color: #94a3b8;">TERRITORY STATUS</div>
            <div style="font-size: 16px; font-weight: 900; color: #39ff14;">100% REBUILT</div>
          </div>
          <button id="wz-anthem-btn" style="padding: 8px 14px; background: ${data.borderColor}; color: #000; font-weight: 900; font-size: 11.5px; border: none; border-radius: 8px; cursor: pointer;">
            🎺 Play National Anthem
          </button>
        </div>
      </div>
    `;

    // 2. Grand Citadel Palace (Main Lead Command Area)
    let widgetsHTML = data.widgets.map((w, idx) => `
      <div class="wz-building-card" style="flex: 1; min-width: 250px; background: rgba(0,0,0,0.45); border: 1px solid ${data.borderColor}55; border-radius: 14px; padding: 18px;">
        <div style="font-weight: 800; font-size: 15px; color: ${data.borderColor}; margin-bottom: 6px;">${w.title}</div>
        <div style="font-size: 13px; opacity: 0.9; line-height: 1.4; margin-bottom: 14px; min-height: 38px;">${w.desc}</div>
        <button id="wz-realm-btn-${idx}" style="width: 100%; padding: 9px 12px; background: ${data.borderColor}; color: #000; font-weight: 900; font-size: 11.5px; border: none; border-radius: 8px; cursor: pointer; letter-spacing: 0.5px;">
          ⚡ ${w.action}
        </button>
      </div>
    `).join('');

    const citadelHTML = `
      <div style="background: rgba(0,0,0,0.3); border: 1px solid ${data.borderColor}44; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
        <div style="margin-bottom: 16px;">
          <h1 style="font-size: 26px; font-weight: 900; margin: 0; color: #ffffff; text-shadow: 0 0 20px ${data.borderColor};">
            🏛️ ${data.title}
          </h1>
          <p style="margin-top: 6px; font-size: 14.5px; color: #cbd5e1;">${data.subtitle}</p>
        </div>
        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          ${widgetsHTML}
        </div>
      </div>
    `;

    // 3. High-Speed Animated Highway Road #1
    const road1 = data.roads[0] || { name: 'Main Expressway', vehicles: ['🚗 Speed Patrol', '🏎️ Fast Cruiser'] };
    const road1HTML = `
      <div style="margin: 16px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; color: ${data.accentColor}; margin-bottom: 4px;">
          <span>🛣️ HIGHWAY TRANSIT: ${road1.name.toUpperCase()}</span>
          <span style="opacity: 0.8;">SPEED: 180 MPH • CONVOY ACTIVE</span>
        </div>
        <div class="wz-dominion-road">
          <div class="wz-road-patrol-unit" style="left: 10%; animation-duration: 14s;" title="Click to accelerate patrol!">${road1.vehicles[0]}</div>
          <div class="wz-road-patrol-unit" style="left: 45%; animation-duration: 10s;" title="Click to accelerate patrol!">${road1.vehicles[1] || road1.vehicles[0]}</div>
          <div class="wz-road-patrol-unit" style="left: 75%; animation-duration: 16s;" title="Click to accelerate patrol!">${road1.vehicles[2] || road1.vehicles[0]}</div>
        </div>
      </div>
    `;

    // 4. Civilization Settlement & Residential District (Houses, Barracks, Temples, Tech Labs)
    let buildingsHTML = data.buildings.map((b, idx) => `
      <div id="wz-building-${idx}" class="wz-building-card" style="text-align: center; border: 1px dashed ${data.borderColor}88;">
        <div style="font-size: 32px; margin-bottom: 6px;">${b.icon}</div>
        <div style="font-weight: bold; font-size: 14px; color: #fff;">${b.name}</div>
        <div style="font-size: 12px; color: #94a3b8; margin: 4px 0 8px 0; min-height: 32px;">${b.desc}</div>
        <div id="wz-bldg-pop-${idx}" style="font-size: 12.5px; font-weight: 800; color: ${data.borderColor}; margin-bottom: 12px;">${b.pop}</div>
        <button id="wz-build-btn-${idx}" style="width: 100%; padding: 7px 14px; background: rgba(255,255,255,0.12); border: 1px solid ${data.borderColor}; color: #fff; border-radius: 8px; font-weight: bold; font-size: 11.5px; cursor: pointer;">
          🔨 Construct / Upgrade (+Pop)
        </button>
      </div>
    `).join('');

    const settlementHTML = `
      <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div style="font-size: 16px; font-weight: 800; color: #e2e8f0;">
            🏘️ Sovereign Residential, Temple & Barracks District
          </div>
          <span style="font-size: 12px; color: ${data.borderColor};">Click any building to expand population!</span>
        </div>
        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          ${buildingsHTML}
        </div>
      </div>
    `;

    // 5. Illuminated Hero Posters & Propaganda Billboards
    let postersHTML = data.posters.map((p, idx) => `
      <div id="wz-poster-${idx}" class="wz-hero-poster" style="flex: 1; min-width: 260px; background: ${p.bg}; border: 2px solid ${data.borderColor};">
        <div style="display: inline-block; padding: 2px 8px; background: rgba(0,0,0,0.6); color: #fef08a; font-size: 10px; font-weight: 900; border-radius: 4px; margin-bottom: 8px;">
          ★ ${p.badge}
        </div>
        <div style="font-size: 18px; font-weight: 900; color: #fff; line-height: 1.2; margin-bottom: 6px;">${p.title}</div>
        <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 12px;">${p.sub}</div>
        <div style="font-size: 12px; font-style: italic; color: #fef08a; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px; border-left: 3px solid ${data.borderColor}; margin-bottom: 12px;">
          ${p.quote}
        </div>
        <div style="font-size: 11px; font-weight: bold; color: ${data.accentColor};">⚡ Click poster to salute & launch fireworks!</div>
      </div>
    `).join('');

    const postersSectionHTML = `
      <div style="margin-bottom: 20px;">
        <div style="font-size: 15px; font-weight: 800; color: #cbd5e1; margin-bottom: 12px;">
          🎨 Heroic Propaganda & Conquest Murals
        </div>
        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          ${postersHTML}
        </div>
      </div>
    `;

    // 6. High-Speed Animated Highway Road #2
    const road2 = data.roads[1] || { name: 'Victory Avenue', vehicles: ['🚀 VIP Cruiser', '🚚 Supply Convoy'] };
    const road2HTML = `
      <div style="margin: 16px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; color: ${data.accentColor}; margin-bottom: 4px;">
          <span>🛣️ HIGHWAY TRANSIT: ${road2.name.toUpperCase()}</span>
          <span style="opacity: 0.8;">SUPPLY LINES CLEAR</span>
        </div>
        <div class="wz-dominion-road">
          <div class="wz-road-patrol-unit" style="left: 15%; animation-duration: 11s;" title="Click to accelerate patrol!">${road2.vehicles[0]}</div>
          <div class="wz-road-patrol-unit" style="left: 60%; animation-duration: 15s;" title="Click to accelerate patrol!">${road2.vehicles[1] || road2.vehicles[0]}</div>
        </div>
      </div>
    `;

    // 7. Victory Party Banquet & Celebration Lounge
    let partyCompanionsHTML = party.companions.map((comp, idx) => `
      <div style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 20px; border: 1px solid ${data.borderColor}33; font-size: 12.5px;">
        <span style="font-size: 18px;">💃</span>
        <strong>${comp}</strong>
        <span style="font-size: 11px; opacity: 0.85; font-style: italic; color: #fef08a;">${party.quotes[idx]}</span>
      </div>
    `).join('');

    const banquetHTML = `
      <div class="wz-party-dancefloor" style="border: 2px solid ${data.borderColor}; background: rgba(0,0,0,0.4); margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 18px; font-weight: 900; color: #fef08a; display: flex; align-items: center; gap: 8px;">
            🎉 ${party.partyName}
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="wz-champagne-btn" style="padding: 8px 16px; background: #fbbf24; color: #000; font-weight: 900; font-size: 12px; border: none; border-radius: 8px; cursor: pointer;">
              🍾 Pop Champagne & Toast 🥂
            </button>
            <button id="wz-party-beat-btn" style="padding: 8px 16px; background: #ec4899; color: #fff; font-weight: 900; font-size: 12px; border: none; border-radius: 8px; cursor: pointer;">
              🎵 DJ Drop Bass Beats 🎶
            </button>
          </div>
        </div>
        <div style="font-size: 13.5px; color: #e2e8f0; margin-bottom: 14px; background: rgba(255,255,255,0.06); padding: 10px 14px; border-radius: 8px;">
          <strong>🍽️ Banquet Setup:</strong> ${party.tables}
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${partyCompanionsHTML}
        </div>
      </div>
    `;

    // 8. Watchtowers & Defense Perimeter
    let watchtowersHTML = data.watchtowers.map((wt, idx) => `
      <div id="wz-watchtower-${idx}" style="flex: 1; min-width: 220px; background: rgba(0,0,0,0.35); border: 1px solid ${data.borderColor}44; border-radius: 12px; padding: 14px; text-align: center;">
        <div style="font-size: 26px; margin-bottom: 4px;">${wt.icon}</div>
        <div style="font-weight: bold; font-size: 13.5px; color: #fff;">${wt.name}</div>
        <div style="font-size: 12px; color: #38bdf8; margin: 4px 0 10px 0;">${wt.status}</div>
        <button id="wz-tower-btn-${idx}" style="padding: 5px 12px; background: ${data.borderColor}; color: #000; font-weight: bold; font-size: 11px; border: none; border-radius: 6px; cursor: pointer;">
          🚨 Test Flare / Defense
        </button>
      </div>
    `).join('');

    const perimeterHTML = `
      <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px; margin-bottom: 20px;">
        <div style="font-size: 15px; font-weight: 800; color: #cbd5e1; margin-bottom: 12px;">
          🛡️ Frontier Watchtowers & Defensive Shield Perimeter
        </div>
        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          ${watchtowersHTML}
        </div>
      </div>
    `;

    // 9. Footer & Celebration Buttons
    const footerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12.5px; opacity: 0.9; flex-wrap: wrap; gap: 12px;">
        <div>🏆 Conqueror & Sovereign: <strong style="color: ${data.borderColor}">${species.toUpperCase()} (${name})</strong> | Chaos Score: <strong style="color:#ff0055">${this.chaosScore || 9500}</strong></div>
        <div style="display: flex; gap: 10px;">
          <button id="wz-realm-dance-btn" style="padding: 8px 18px; background: rgba(255,255,255,0.15); border: 1px solid ${data.borderColor}; color: #fff; font-weight: bold; border-radius: 8px; cursor: pointer;">
            🕺 Victory Parade & Dance
          </button>
        </div>
      </div>
    `;

    realm.innerHTML = `
      ${topBarHTML}
      ${citadelHTML}
      ${road1HTML}
      ${settlementHTML}
      ${postersSectionHTML}
      ${road2HTML}
      ${banquetHTML}
      ${perimeterHTML}
      ${footerHTML}
    `;

    // Rebuild directly inside primary page container (NOT appended at bottom)
    let targetParent = null;
    let insertBeforeRef = null;

    const candidateSelectors = [
      'main',
      'article',
      '[role="main"]',
      '.wiki-container',
      '#content',
      '.content',
      '.container',
      '#main',
      '.main-content',
      '#wrapper',
      '#app',
      '#root'
    ];

    for (const sel of candidateSelectors) {
      const el = document.querySelector(sel);
      if (el && !el.closest('#warzone-hud') && !el.id?.startsWith('warzone-')) {
        targetParent = el;
        insertBeforeRef = el.firstChild;
        break;
      }
    }

    if (!targetParent && this.originalStateMap.size > 0) {
      for (const [el, state] of this.originalStateMap.entries()) {
        if (state.parent && state.parent !== document.body && state.parent !== document.documentElement && !state.parent.id?.startsWith('warzone-')) {
          targetParent = state.parent;
          insertBeforeRef = targetParent.firstChild;
          break;
        }
      }
    }

    if (!targetParent) {
      targetParent = document.body || document.documentElement;
      const nonHudChild = Array.from(targetParent.children || []).find(c => 
        !c.id?.startsWith('warzone-') && !c.classList?.contains('warzone-ignored')
      );
      insertBeforeRef = nonHudChild || null;
    }

    if (insertBeforeRef) {
      targetParent.insertBefore(realm, insertBeforeRef);
    } else {
      targetParent.appendChild(realm);
    }

    // Smooth scroll the viewport to the new rebuilt dominion
    try {
      realm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {}

    // BIND ALL INTERACTIVE HANDLERS:

    // 1. Citadel Weapons & Terminals
    data.widgets.forEach((w, idx) => {
      const btn = document.getElementById(`wz-realm-btn-${idx}`);
      if (btn) {
        btn.onclick = () => {
          if (window.WarzoneSFX) window.WarzoneSFX.play('victory_horn');
          if (window.WarzoneParticles) {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + window.scrollX + rect.width / 2;
            const cy = rect.top + window.scrollY + rect.height / 2;
            window.WarzoneParticles.createSparkExplosion(cx, cy, data.borderColor, 45);
            window.WarzoneParticles.triggerScreenShake(8, 400);
            window.WarzoneParticles.addDamageText(cx, cy - 30, `⚡ ${w.action}!`, data.borderColor, true);
          }
        };
      }
    });

    // 2. Construction / Upgrades (+Population Counter)
    let currentPopulation = 1420;
    data.buildings.forEach((b, idx) => {
      const buildBtn = document.getElementById(`wz-build-btn-${idx}`);
      if (buildBtn) {
        let upgradeLevel = 1;
        buildBtn.onclick = () => {
          upgradeLevel++;
          currentPopulation += (50 * upgradeLevel);
          const popHeader = document.getElementById('wz-total-population');
          if (popHeader) popHeader.innerText = `${currentPopulation.toLocaleString()} Residents`;

          if (window.WarzoneSFX) window.WarzoneSFX.playConstructionHammer();
          const popEl = document.getElementById(`wz-bldg-pop-${idx}`);
          if (popEl) {
            popEl.innerText = `⭐ Level ${upgradeLevel} • ${b.pop} (+${upgradeLevel * 75})`;
          }
          if (window.WarzoneParticles) {
            const rect = buildBtn.getBoundingClientRect();
            const cx = rect.left + window.scrollX + rect.width / 2;
            const cy = rect.top + window.scrollY + rect.height / 2;
            window.WarzoneParticles.createSparkExplosion(cx, cy, '#38bdf8', 35);
            window.WarzoneParticles.addDamageText(cx, cy - 30, `🏗️ ${b.name} UPGRADED! (+${upgradeLevel * 75} Pop)`, '#38bdf8', true);
          }
        };
      }
    });

    // 3. Hero Posters: Click to launch celebratory slogans & fireworks
    data.posters.forEach((p, idx) => {
      const posterEl = document.getElementById(`wz-poster-${idx}`);
      if (posterEl) {
        posterEl.onclick = () => {
          if (window.WarzoneSFX) window.WarzoneSFX.playPartyChampagne();
          if (window.WarzoneParticles) {
            const rect = posterEl.getBoundingClientRect();
            const cx = rect.left + window.scrollX + rect.width / 2;
            const cy = rect.top + window.scrollY + rect.height / 2;
            window.WarzoneParticles.createSparkExplosion(cx, cy, data.borderColor, 40);
            window.WarzoneParticles.createDebrisShower(cx, cy, 25);
            window.WarzoneParticles.addDamageText(cx, cy - 30, `★ ${p.title} ★`, '#fef08a', true);
          }
        };
      }
    });

    // 4. Watchtowers & Defense Flares
    data.watchtowers.forEach((wt, idx) => {
      const towerBtn = document.getElementById(`wz-tower-btn-${idx}`);
      if (towerBtn) {
        towerBtn.onclick = () => {
          if (window.WarzoneSFX) window.WarzoneSFX.play('laser');
          if (window.WarzoneParticles) {
            const rect = towerBtn.getBoundingClientRect();
            const cx = rect.left + window.scrollX + rect.width / 2;
            const cy = rect.top + window.scrollY + rect.height / 2;
            window.WarzoneParticles.createShockwaveRing(cx, cy, '#38bdf8', 120, 500);
            window.WarzoneParticles.addDamageText(cx, cy - 25, `🚨 ${wt.name} FLARE FIRED!`, '#38bdf8', true);
          }
        };
      }
    });

    // 5. Champagne Toast
    const champBtn = document.getElementById('wz-champagne-btn');
    if (champBtn) {
      champBtn.onclick = () => {
        if (window.WarzoneSFX) window.WarzoneSFX.playPartyChampagne();
        if (window.WarzoneParticles) {
          const rect = champBtn.getBoundingClientRect();
          const cx = rect.left + window.scrollX + rect.width / 2;
          const cy = rect.top + window.scrollY + rect.height / 2;
          window.WarzoneParticles.createSparkExplosion(cx, cy, '#fbbf24', 50);
          window.WarzoneParticles.createDebrisShower(cx, cy, 30);
          window.WarzoneParticles.addDamageText(cx, cy - 35, '🍾 POP! CHEERS TO THE CHAMPIONS! 🥂', '#fbbf24', true);
        }
      };
    }

    // 6. DJ Party Beat
    const partyBeatBtn = document.getElementById('wz-party-beat-btn');
    if (partyBeatBtn) {
      partyBeatBtn.onclick = () => {
        if (window.WarzoneSFX) window.WarzoneSFX.playPartyBeat();
        if (window.WarzoneParticles) {
          const rect = partyBeatBtn.getBoundingClientRect();
          const cx = rect.left + window.scrollX + rect.width / 2;
          const cy = rect.top + window.scrollY + rect.height / 2;
          window.WarzoneParticles.createShockwaveRing(cx, cy, '#ec4899', 180, 700);
          window.WarzoneParticles.triggerScreenShake(6, 300);
          window.WarzoneParticles.addDamageText(cx, cy - 35, '🎵 DJ DROP THE BASS! 🎶', '#ec4899', true);
        }
      };
    }

    // 7. National Anthem
    const anthemBtn = document.getElementById('wz-anthem-btn');
    if (anthemBtn) {
      anthemBtn.onclick = () => {
        if (window.WarzoneSFX) window.WarzoneSFX.play('victory_horn');
        if (window.WarzoneParticles) {
          const rect = anthemBtn.getBoundingClientRect();
          const cx = rect.left + window.scrollX + rect.width / 2;
          const cy = rect.top + window.scrollY + rect.height / 2;
          window.WarzoneParticles.createSparkExplosion(cx, cy, '#fef08a', 40);
          window.WarzoneParticles.addDamageText(cx, cy - 30, '🎺 ANTHEM OF THE REALM! 👑', '#fef08a', true);
        }
      };
    }

    // 8. Victory Dance Parade
    const danceBtn = document.getElementById('wz-realm-dance-btn');
    if (danceBtn) {
      danceBtn.onclick = () => {
        window.WarzoneEngine?.triggerVictoryForLeader();
      };
    }

    if (window.WarzoneSFX) window.WarzoneSFX.play('victory_horn');
    if (window.WarzoneParticles) {
      const scrollY = window.scrollY;
      window.WarzoneParticles.addSprayGraffiti(window.innerWidth / 2, scrollY + 280, species, data.borderColor, name);
    }
  }

  restoreDOM() {
    if (window.WarzoneSFX) window.WarzoneSFX.play('site_repair');
    if (window.WarzonePhysics) window.WarzonePhysics.clear();

    const rebuilt = document.getElementById('warzone-rebuilt-realm');
    if (rebuilt) {
      try { rebuilt.remove(); } catch (e) {}
    }

    document.querySelectorAll('.warzone-clone').forEach(el => {
      try { el.remove(); } catch (e) {}
    });

    this.originalStateMap.forEach((orig, el) => {
      try {
        if (el && el.parentNode) {
          el.setAttribute('style', orig.styleText);
          el.className = orig.classList.join(' ');
          el.dataset.warzoneDestroyed = 'false';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.filter = 'none';
          el.style.clipPath = 'none';
        }
      } catch (e) {}
    });

    this.originalStateMap.clear();
    this.destroyedCount = 0;
    this.totalDamageDealt = 0;
    this.chaosScore = 0;

    if (window.WarzoneHUD) {
      window.WarzoneHUD.updateStats({
        destroyedCount: 0,
        totalDamage: 0,
        chaosScore: 0
      });
      window.WarzoneHUD.logKillFeed('SYSTEM', 'Reality Restored', 'All HTML nodes rebuilt!');
    }
  }
}

window.WarzoneDOM = new WarzoneDOMDestroyer();
