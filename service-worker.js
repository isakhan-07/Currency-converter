// ============================================================
//  Service Worker — офлайн-режим для конвертера валют
//  Стратегия NetworkFirst: сеть → кэш → ошибка
// ============================================================

const CACHE_NAME = 'currency-converter-v1';
const API_CACHE = 'currency-api-v1';

// Ресурсы приложения, которые кэшируем сразу при установке
const PRECACHE_URLS = [
    './',
    './index.html',
    './style.css',
    './script.js'
];

// ============================================================
//  Install — предварительное кэширование
// ============================================================
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
            .catch(err => console.warn('SW install error:', err))
    );
});

// ============================================================
//  Activate — удаление старых кэшей
// ============================================================
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(names => Promise.all(
                names
                    .filter(name => name !== CACHE_NAME && name !== API_CACHE)
                    .map(name => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );
});

// ============================================================
//  Fetch — перехват запросов
// ============================================================
self.addEventListener('fetch', event => {
    const { request } = event;

    // Кэшируем только GET-запросы
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    // 1. Запросы к API курсов — NetworkFirst с таймаутом
    if (url.hostname === 'open.er-api.com') {
        event.respondWith(networkFirstApi(request));
        return;
    }

    // 2. Запросы к локальным файлам — CacheFirst
    if (url.origin === self.location.origin) {
        event.respondWith(cacheFirst(request));
        return;
    }
});

// ============================================================
//  Стратегия 1: NetworkFirst для API
//  Сначала сеть, при неудаче — кэш
// ============================================================
async function networkFirstApi(request) {
    try {
        const networkResponse = await fetchWithTimeout(request, 5000);

        if (networkResponse && networkResponse.ok) {
            // Клонируем ответ и сохраняем в кэш
            const cache = await caches.open(API_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        throw new Error('Network response not ok');
    } catch (error) {
        // Сеть недоступна — отдаём кэш
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        // Кэша нет — возвращаем ошибку
        return new Response(
            JSON.stringify({ result: 'error', message: 'Offline and no cache' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// ============================================================
//  Стратегия 2: CacheFirst для статики
// ============================================================
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // Офлайн и нет кэша — возвращаем заглушку для HTML
        if (request.destination === 'document') {
            const fallback = await caches.match('./index.html');
            if (fallback) return fallback;
        }
        return new Response('Offline', { status: 503 });
    }
}

// ============================================================
//  Fetch с таймаутом (чтобы не ждать вечно)
// ============================================================
function fetchWithTimeout(request, ms) {
    return Promise.race([
        fetch(request),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), ms)
        )
    ]);
}