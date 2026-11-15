
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());

const TOPICS = [
  'B-Tree 인덱스 구조와 LIKE %kw% 검색 튜닝 실무',
  '커서 기반(Keyset) 페이지네이션 O(log N) 탐색 원리',
  'ORDER BY SQL Injection과 화이트리스트 매핑 방어',
  'InnoDB 버퍼 풀과 LIMIT OFFSET Cache Thrashing',
  'AbortController를 이용한 비동기 Race Condition 방어',
  '300ms 디바운스(Debounce)와 프론트엔드 입력 최적화',
  'URLSearchParams와 history.pushState 뒤로가기 동기화',
  'InnoDB MVCC 메커니즘과 COUNT(*) 전수 스캔 병목',
  '복합 인덱스(Compound Index) 컬럼 순서의 황금률',
  'Redis 분산 캐시를 활용한 카운트 캐싱 아키텍처',
  'RESTful JSON 페이징 Envelope 규격 표준화',
  'ElasticSearch 역색인(Inverted Index)과 N-gram 전문 검색'
];
const AUTHORS = ['이경수', '김철수', '이영희', '박민수', '정다은', '최준호', '강서연', '윤성호'];

const POSTS = Array.from({ length: 1000 }, (_, i) => {
  const id = 1000 - i;
  return {
    id,
    title: `[#${id}] ${TOPICS[i % TOPICS.length]}`,
    content: `게시글 ${id}번의 상세 본문 데이터입니다. DB 인덱스와 페이징 최적화를 실습합니다.`,
    author: AUTHORS[i % AUTHORS.length],
    views: Math.floor(Math.random() * 5000) + 10,
    createdAt: `2026-${(10 - Math.floor(i / 150)).toString().padStart(2, '0')}-${((i % 28) + 1).toString().padStart(2, '0')}`
  };
});

const DEFAULT_SORT = 'latest';
const SORT_WHITELIST = Object.freeze({
  latest: (a, b) => b.id - a.id,
  oldest: (a, b) => a.id - b.id,
  views: (a, b) => (b.views !== a.views ? b.views - a.views : b.id - a.id)
});

function resolveSortKey(raw) {
  if (typeof raw !== 'string') return DEFAULT_SORT;
  return Object.prototype.hasOwnProperty.call(SORT_WHITELIST, raw) ? raw : DEFAULT_SORT;
}

function parsePositiveInt(raw, fallback) {
  const n = Number.parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

function parseSearch(raw) {
  if (typeof raw !== 'string') return '';
  return raw.trim().toLowerCase().slice(0, 100);
}

function matchesSearch(post, search) {
  if (!search) return true;
  return post.title.toLowerCase().includes(search) || post.content.toLowerCase().includes(search);
}

function parseDelay(raw) {
  const n = Number.parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? Math.min(n, 2000) : 0;
}

function elapsedMs(startTime) {
  const diff = process.hrtime(startTime);
  return Number((diff[0] * 1000 + diff[1] / 1e6).toFixed(2));
}

function send(res, payload, delay) {
  if (delay > 0) setTimeout(() => res.json(payload), delay);
  else res.json(payload);
}

app.get('/api/posts', (req, res) => {
  const startTime = process.hrtime();

  const page = parsePositiveInt(req.query.page, 1);
  const limit = Math.min(parsePositiveInt(req.query.limit, 10), 100);
  const search = parseSearch(req.query.search);
  const sortKey = resolveSortKey(req.query.sort);

  const filtered = POSTS.filter(p => matchesSearch(p, search));

  filtered.sort(SORT_WHITELIST[sortKey]);

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * limit;
  const items = filtered.slice(offset, offset + limit);

  const executionTimeMs = elapsedMs(startTime);
  res.setHeader('X-Response-Time', `${executionTimeMs}ms`);
  send(res, {
    items,
    meta: {
      page: safePage,
      limit,
      totalCount,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1,
      sort: sortKey,
      search,
      executionTimeMs
    }
  }, parseDelay(req.query.delay));
});

app.get('/api/posts/cursor', (req, res) => {
  const startTime = process.hrtime();

  const limit = Math.min(parsePositiveInt(req.query.limit, 10), 50);
  const rawCursor = Number.parseInt(req.query.cursor, 10);
  const cursor = Number.isInteger(rawCursor) && rawCursor > 0 ? rawCursor : null;
  const search = parseSearch(req.query.search);

  const candidates = POSTS.filter(p => (cursor === null || p.id < cursor) && matchesSearch(p, search));
  const sliced = candidates.slice(0, limit + 1);

  const hasNext = sliced.length > limit;
  const items = hasNext ? sliced.slice(0, limit) : sliced;
  const nextCursor = hasNext && items.length > 0 ? items[items.length - 1].id : null;

  const executionTimeMs = elapsedMs(startTime);
  res.setHeader('X-Response-Time', `${executionTimeMs}ms`);
  send(res, {
    items,
    meta: {
      cursor,
      nextCursor,
      limit,
      hasNext,
      sort: 'latest',
      search,
      executionTimeMs
    }
  }, parseDelay(req.query.delay));
});

app.listen(PORT, () => {
  console.log('====================================================');
  console.log('🚀 웹서비스설계 9주차 실습 서버 구동 완료 (개선판)');
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📦 데이터: ${POSTS.length}건의 인메모리 게시글`);
  console.log('====================================================');
});
