/**
 * DR : Mayer Ashraf - Digital business card
 * Production app logic (no inline handlers, CSP-friendly).
 */
(function () {
    'use strict';

    // البيانات الثابتة للدكتور ماير أشرف
    var DOCTOR_DATA = {
        name: 'DR : Mayer Ashraf',
        title: 'Physiotherapist',
        phoneDisplay: '01201924162',
        phoneIntl: '+201201924162',
        whatsapp: '201201924162',
        instapayId: 'mayer11@instapay',
        instapayUrl: 'https://ipn.eg/S/mayer11/instapay/1RFFpz'
    };

    // الرابط الرسمي للموقع (يُستخدم إذا فُتحت الصفحة محلياً)
    var CANONICAL_URL = 'https://minasaad123.github.io/dr-mayer-ashraf/';

    function getPageUrl() {
        var loc = window.location;
        if (loc.protocol !== 'http:' && loc.protocol !== 'https:') return CANONICAL_URL;
        if (loc.hostname === 'localhost' || loc.hostname === '127.0.0.1') return CANONICAL_URL;
        // إزالة أي query/hash للحصول على رابط نظيف
        return loc.origin + loc.pathname.replace(/index\.html$/, '');
    }

    var pageUrl = getPageUrl();

    // ---------------------------------------------------------------
    // إشعار منبثق
    // ---------------------------------------------------------------
    var toastTimer = null;
    function showToast(msg) {
        var toast = document.getElementById('toast');
        var toastMsg = document.getElementById('toast-message');
        if (!toast || !toastMsg) return;

        toastMsg.textContent = msg;
        toast.classList.remove('hidden');
        toast.classList.add('flex');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.add('hidden');
            toast.classList.remove('flex');
        }, 3000);
    }

    // ---------------------------------------------------------------
    // النسخ إلى الحافظة (Clipboard API مع بديل للمتصفحات القديمة)
    // ---------------------------------------------------------------
    function legacyCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        return ok;
    }

    function copyText(text, successMsg) {
        var done = function () { showToast(successMsg); };
        var fail = function () {
            if (legacyCopy(text)) done();
            else showToast('تعذّر النسخ، يرجى النسخ يدوياً: ' + text);
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(done, fail);
        } else {
            fail();
        }
    }

    // ---------------------------------------------------------------
    // تنزيل ملف
    // ---------------------------------------------------------------
    function triggerDownload(href, filename) {
        var a = document.createElement('a');
        a.href = href;
        a.download = filename;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // ---------------------------------------------------------------
    // رمز QR
    // ---------------------------------------------------------------
    function generateQRCode(url) {
        var canvas = document.getElementById('qr-canvas');
        if (!canvas || typeof window.QRious === 'undefined') return;

        new window.QRious({
            element: canvas,
            value: url,
            size: 185,
            level: 'H',
            foreground: '#0f172a',
            background: '#ffffff'
        });
    }

    function downloadQR() {
        if (typeof window.QRious === 'undefined') {
            showToast('تعذّر تحميل مكتبة الـ QR، يرجى إعادة المحاولة');
            return;
        }

        // توليد QR بدقة عالية مخصص للطباعة
        var hiRes = document.createElement('canvas');
        new window.QRious({
            element: hiRes,
            value: pageUrl,
            size: 600,
            level: 'H',
            foreground: '#0f172a',
            background: '#ffffff'
        });

        var W = 840, H = 1000;
        var out = document.createElement('canvas');
        out.width = W;
        out.height = H;
        var ctx = out.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#0d9488';
        ctx.fillRect(0, 0, W, 32);

        ctx.drawImage(hiRes, 120, 90, 600, 600);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 48px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(DOCTOR_DATA.name, W / 2, 770);

        ctx.fillStyle = '#0d9488';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(DOCTOR_DATA.title, W / 2, 830);

        ctx.fillStyle = '#475569';
        ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Tel : ' + DOCTOR_DATA.phoneDisplay, W / 2, 900);

        triggerDownload(out.toDataURL('image/png'), 'DR-Mayer-Ashraf-QR.png');
        showToast('تم تحميل صورة الـ QR Code للطباعة!');
    }

    // ---------------------------------------------------------------
    // حفظ جهة الاتصال (vCard)
    // ---------------------------------------------------------------
    function downloadVCard() {
        var vcard = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            'N:Ashraf;Mayer;;DR;',
            'FN:' + DOCTOR_DATA.name,
            'TITLE:' + DOCTOR_DATA.title,
            'TEL;TYPE=CELL,VOICE:' + DOCTOR_DATA.phoneIntl,
            'URL:' + pageUrl,
            'NOTE:InstaPay: ' + DOCTOR_DATA.instapayId + ' (' + DOCTOR_DATA.instapayUrl + ')',
            'END:VCARD'
        ].join('\r\n');

        var blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        triggerDownload(url, 'DR_Mayer_Ashraf.vcf');
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        showToast('تم تحميل ملف جهة الاتصال!');
    }

    // ---------------------------------------------------------------
    // ربط الأحداث
    // ---------------------------------------------------------------
    var ACTIONS = {
        'copy-instapay': function () {
            copyText(DOCTOR_DATA.instapayId, 'تم نسخ عنوان InstaPay: ' + DOCTOR_DATA.instapayId);
        },
        'copy-link': function () {
            copyText(pageUrl, 'تم نسخ الرابط بنجاح!');
        },
        'download-qr': downloadQR,
        'save-contact': downloadVCard
    };

    document.addEventListener('click', function (event) {
        var target = event.target.closest('[data-action]');
        if (!target) return;
        var handler = ACTIONS[target.getAttribute('data-action')];
        if (handler) {
            event.preventDefault();
            handler();
        }
    });

    function init() {
        var yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = String(new Date().getFullYear());
        generateQRCode(pageUrl);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
