// ============================================================
//  Резервные курсы (крайний случай — нет ни интернета, ни кэша)
// ============================================================
const FALLBACK_RATES = {
    USD: 1, EUR: 0.92, GBP: 0.79, JPY: 157, CNY: 7.25, CHF: 0.88,
    CAD: 1.36, AUD: 1.52, NZD: 1.64, RUB: 92.5, UAH: 41.2, KZT: 475,
    BYN: 3.27, UZS: 12600, KGS: 89.5, TJS: 10.9, AMD: 390, AZN: 1.70,
    GEL: 2.70, MDL: 17.8, KRW: 1360, INR: 83.5, IDR: 15800, MYR: 4.70,
    THB: 36.5, VND: 24500, PHP: 57.5, SGD: 1.34, HKD: 7.82, TWD: 32.3,
    PKR: 278, BDT: 110, LKR: 300, NPR: 133, TRY: 34.2, AED: 3.67,
    SAR: 3.75, QAR: 3.64, KWD: 0.31, BHD: 0.38, OMR: 0.38, JOD: 0.71,
    ILS: 3.70, EGP: 48.5, ZAR: 18.2, NGN: 1600, KES: 129, GHS: 15.5,
    MAD: 9.90, TND: 3.10, DZD: 134, XOF: 604, XAF: 604, ETB: 57.0,
    UGX: 3700, TZS: 2700, BRL: 5.50, MXN: 17.5, ARS: 950, CLP: 950,
    COP: 4100, PEN: 3.75, UYU: 40.0, BOB: 6.90, PYG: 7500, DOP: 58.5,
    GTQ: 7.75, CRC: 520, PAB: 1.00, JMD: 156, TTD: 6.80, BBD: 2.00,
    BSD: 1.00, BZD: 2.00, HNL: 24.8, NIO: 36.5, CUP: 24.0, ISK: 138,
    NOK: 10.6, SEK: 10.5, DKK: 6.85, PLN: 4.00, CZK: 23.0, HUF: 360,
    RON: 4.58, BGN: 1.80, HRK: 6.93, RSD: 108, MKD: 56.5, ALL: 93.0,
    BAM: 1.80
};

// ============================================================
//  Русские названия валют (ISO 4217)
// ============================================================
const CURRENCY_NAMES = {
    USD: 'Доллар США', EUR: 'Евро', GBP: 'Фунт стерлингов',
    JPY: 'Японская йена', CNY: 'Китайский юань', CHF: 'Швейцарский франк',
    CAD: 'Канадский доллар', AUD: 'Австралийский доллар', NZD: 'Новозеландский доллар',
    RUB: 'Российский рубль', UAH: 'Украинская гривна', KZT: 'Казахстанский тенге',
    BYN: 'Белорусский рубль', UZS: 'Узбекский сум', KGS: 'Киргизский сом',
    TJS: 'Таджикский сомони', AMD: 'Армянский драм', AZN: 'Азербайджанский манат',
    GEL: 'Грузинский лари', MDL: 'Молдавский лей', KRW: 'Южнокорейская вона',
    INR: 'Индийская рупия', IDR: 'Индонезийская рупия', MYR: 'Малайзийский ринггит',
    THB: 'Тайский бат', VND: 'Вьетнамский донг', PHP: 'Филиппинское песо',
    SGD: 'Сингапурский доллар', HKD: 'Гонконгский доллар', TWD: 'Тайваньский доллар',
    PKR: 'Пакистанская рупия', BDT: 'Бангладешская така', LKR: 'Шри-ланкийская рупия',
    NPR: 'Непальская рупия', TRY: 'Турецкая лира', AED: 'Дирхам ОАЭ',
    SAR: 'Саудовский риял', QAR: 'Катарский риял', KWD: 'Кувейтский динар',
    BHD: 'Бахрейнский динар', OMR: 'Оманский риял', JOD: 'Иорданский динар',
    ILS: 'Израильский шекель', EGP: 'Египетский фунт', ZAR: 'Южноафриканский рэнд',
    NGN: 'Нигерийская найра', KES: 'Кенийский шиллинг', GHS: 'Ганский седи',
    MAD: 'Марокканский дирхам', TND: 'Тунисский динар', DZD: 'Алжирский динар',
    XOF: 'Франк КФА BCEAO', XAF: 'Франк КФА BEAC', ETB: 'Эфиопский быр',
    UGX: 'Угандийский шиллинг', TZS: 'Танзанийский шиллинг', BRL: 'Бразильский реал',
    MXN: 'Мексиканское песо', ARS: 'Аргентинское песо', CLP: 'Чилийское песо',
    COP: 'Колумбийское песо', PEN: 'Перуанский соль', UYU: 'Уругвайское песо',
    BOB: 'Боливийский боливиано', PYG: 'Парагвайский гуарани', DOP: 'Доминиканское песо',
    GTQ: 'Гватемальский кетсаль', CRC: 'Костариканский колон', PAB: 'Панамский бальбоа',
    JMD: 'Ямайский доллар', TTD: 'Доллар Тринидада и Тобаго', BBD: 'Барбадосский доллар',
    BSD: 'Багамский доллар', BZD: 'Белизский доллар', HNL: 'Гондурасская лемпира',
    NIO: 'Никарагуанская кордоба', CUP: 'Кубинское песо', ISK: 'Исландская крона',
    NOK: 'Норвежская крона', SEK: 'Шведская крона', DKK: 'Датская крона',
    PLN: 'Польский злотый', CZK: 'Чешская крона', HUF: 'Венгерский форинт',
    RON: 'Румынский лей', BGN: 'Болгарский лев', HRK: 'Хорватская куна',
    RSD: 'Сербский динар', MKD: 'Македонский денар', ALL: 'Албанский лек',
    BAM: 'Конвертируемая марка'
};

const STORAGE_KEY = 'currency_converter_records';
const RATES_CACHE_KEY = 'currency_converter_rates';
const RATES_TIMESTAMP_KEY = 'currency_converter_rates_ts';
const MAX_RECORDS = 10;
const API_URL = 'https://open.er-api.com/v6/latest/USD';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 часа

// ============================================================
//  Состояние
// ============================================================
let RATES = { ...FALLBACK_RATES };
let isOnline = false;

// DOM
const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const swapBtn = document.getElementById('swapBtn');
const convertBtn = document.getElementById('convertBtn');
const resultDiv = document.getElementById('result');
const rateInfo = document.getElementById('rateInfo');
const recordsList = document.getElementById('recordsList');
const clearBtn = document.getElementById('clearBtn');
const aiStatus = document.getElementById('aiStatus');

// ============================================================
//  Безопасный доступ к localStorage
// ============================================================
function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}
function safeSet(key, value) {
    try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
}

// ============================================================
//  Кэш курсов в localStorage (мгновенный старт при перезагрузке)
// ============================================================
function loadRatesFromCache() {
    const cached = safeGet(RATES_CACHE_KEY);
    const ts = safeGet(RATES_TIMESTAMP_KEY);
    if (!cached || !ts) return null;

    try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object' && parsed.USD) {
            return { rates: parsed, timestamp: parseInt(ts, 10) };
        }
    } catch (e) { /* ignore */ }
    return null;
}

function saveRatesToCache(rates) {
    safeSet(RATES_CACHE_KEY, JSON.stringify(rates));
    safeSet(RATES_TIMESTAMP_KEY, String(Date.now()));
}

// ============================================================
//  ИИ-модуль: сеть → Service Worker → localStorage → fallback
// ============================================================
async function loadLiveRates() {
    // 1. Мгновенно показываем кэш (если есть), чтобы не ждать сеть
    const cached = loadRatesFromCache();
    if (cached && cached.rates) {
        RATES = cached.rates;
        isOnline = false;
        const age = Date.now() - cached.timestamp;
        const ageText = age < 60000 ? 'только что'
            : age < 3600000 ? Math.round(age / 60000) + ' мин назад'
            : Math.round(age / 3600000) + ' ч назад';
        updateStatus('offline', 'Из кэша • ' + ageText);
        refreshSelects();
    }

    // 2. Пытаемся получить свежие данные из сети
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(API_URL, { signal: controller.signal });
        clearTimeout(timeout);

        if (!response.ok) throw new Error('HTTP ' + response.status);

        const data = await response.json();

        if (data && data.result === 'success' && data.rates && typeof data.rates === 'object') {
            RATES = { USD: 1, ...data.rates };
            isOnline = true;
            saveRatesToCache(RATES);
            updateStatus('online', 'Курсы обновлены • ' + Object.keys(RATES).length + ' валют');
            refreshSelects();
            return;
        }
        throw new Error('Неверный ответ API');
    } catch (error) {
        console.warn('Офлайн-режим:', error.message);

        // 3. Если сети нет — используем кэш из localStorage
        if (cached && cached.rates) {
            RATES = cached.rates;
            isOnline = false;
            updateStatus('offline', 'Офлайн • из кэша');
        } else {
            // 4. Крайний случай — статичный список
            RATES = { ...FALLBACK_RATES };
            isOnline = false;
            updateStatus('offline', 'Офлайн • ' + Object.keys(RATES).length + ' валют');
        }
        refreshSelects();
    }
}

function updateStatus(state, text) {
    const dot = aiStatus.querySelector('.status-dot');
    const label = aiStatus.querySelector('.status-text');
    if (!dot || !label) return;
    dot.className = 'status-dot ' + state;
    label.textContent = text;
}

function refreshSelects() {
    const fromValue = fromSelect.value || 'USD';
    const toValue = toSelect.value || 'EUR';

    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    populateSelects();

    if (RATES[fromValue]) fromSelect.value = fromValue;
    if (RATES[toValue]) toSelect.value = toValue;

    updateRateInfo();
}

// ============================================================
//  Инициализация
// ============================================================
function init() {
    populateSelects();
    fromSelect.value = 'USD';
    toSelect.value = 'EUR';
    loadRecords();
    attachEvents();
    updateRateInfo();

    // Регистрируем Service Worker для офлайн-режима
    registerServiceWorker();

    // Запускаем загрузку курсов
    loadLiveRates();
}

// ============================================================
//  Service Worker — офлайн-режим
// ============================================================
function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker не поддерживается');
        return;
    }

    navigator.serviceWorker.register('service-worker.js')
        .then(reg => {
            console.log('Service Worker зарегистрирован:', reg.scope);
        })
        .catch(err => {
            console.warn('Service Worker не зарегистрирован:', err);
        });
}

// ============================================================
//  Селекты (алфавитная сортировка)
// ============================================================
function populateSelects() {
    const sortedCodes = Object.keys(RATES).sort((a, b) => {
        const nameA = CURRENCY_NAMES[a] || a;
        const nameB = CURRENCY_NAMES[b] || b;
        return nameA.localeCompare(nameB, 'ru');
    });

    sortedCodes.forEach(code => {
        const optionFrom = document.createElement('option');
        optionFrom.value = code;
        optionFrom.textContent = code + ' — ' + (CURRENCY_NAMES[code] || code);
        fromSelect.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = code;
        optionTo.textContent = code + ' — ' + (CURRENCY_NAMES[code] || code);
        toSelect.appendChild(optionTo);
    });
}

// ============================================================
//  События
// ============================================================
function attachEvents() {
    convertBtn.addEventListener('click', convert);
    swapBtn.addEventListener('click', swapCurrencies);
    clearBtn.addEventListener('click', clearRecords);
    amountInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') convert();
    });
    fromSelect.addEventListener('change', updateRateInfo);
    toSelect.addEventListener('change', updateRateInfo);
    amountInput.addEventListener('input', updateRateInfo);
}

// ============================================================
//  Конвертация
// ============================================================
function convert() {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        showError('Введите корректную сумму');
        return;
    }

    const from = fromSelect.value;
    const to = toSelect.value;

    if (from === to) {
        displayResult(amount, amount, from, to);
        return;
    }

    const amountInUSD = amount / RATES[from];
    const result = amountInUSD * RATES[to];

    displayResult(result, amount, from, to);
    saveRecord(amount, from, to, result);
}

function displayResult(result, amount, from, to) {
    const formatted = formatNumber(result);
    resultDiv.classList.add('active');
    resultDiv.innerHTML = '<span class="result-value">' + formatted + ' ' + to + '</span>';
    updateRateInfo();
}

function formatNumber(num) {
    if (num >= 1000) {
        return num.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
    }
    if (num < 0.01) {
        return num.toFixed(6);
    }
    return num.toLocaleString('ru-RU', { maximumFractionDigits: 4 });
}

function showError(message) {
    resultDiv.classList.remove('active');
    resultDiv.innerHTML = '<span style="color: var(--danger); font-size: 15px;">' + message + '</span>';
}

function updateRateInfo() {
    const from = fromSelect.value;
    const to = toSelect.value;

    if (from === to) {
        rateInfo.textContent = 'Выберите разные валюты';
        return;
    }

    const rate = RATES[to] / RATES[from];
    rateInfo.textContent = '1 ' + from + ' = ' + formatNumber(rate) + ' ' + to;
}

function swapCurrencies() {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    updateRateInfo();
    if (resultDiv.classList.contains('active')) {
        convert();
    }
}

// ============================================================
//  Рекорды
// ============================================================
function saveRecord(amount, from, to, result) {
    const records = getRecords();

    const record = {
        id: Date.now(),
        amount: amount,
        from: from,
        to: to,
        result: result,
        time: new Date().toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    records.unshift(record);
    if (records.length > MAX_RECORDS) records.length = MAX_RECORDS;

    safeSet(STORAGE_KEY, JSON.stringify(records));
    renderRecords(records);
}

function getRecords() {
    try {
        const data = safeGet(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function loadRecords() {
    renderRecords(getRecords());
}

function renderRecords(records) {
    recordsList.innerHTML = '';

    if (!records.length) {
        recordsList.innerHTML = '<li class="empty">Пока нет записей</li>';
        return;
    }

    records.forEach(record => {
        const li = document.createElement('li');

        const conversion = document.createElement('span');
        conversion.className = 'record-conversion';
        conversion.textContent = formatNumber(record.amount) + ' ' + record.from + ' →';

        const result = document.createElement('span');
        result.className = 'record-result';
        result.textContent = formatNumber(record.result) + ' ' + record.to;

        const time = document.createElement('span');
        time.className = 'record-time';
        time.textContent = record.time;

        li.appendChild(conversion);
        li.appendChild(result);
        li.appendChild(time);
        recordsList.appendChild(li);
    });
}

function clearRecords() {
    if (!getRecords().length) return;
    if (confirm('Удалить всю историю рекордов?')) {
        safeRemove(STORAGE_KEY);
        renderRecords([]);
    }
}

function safeRemove(key) {
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
}

// ============================================================
//  Запуск
// ============================================================
init();