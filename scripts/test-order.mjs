import assert from 'node:assert/strict';
import { comparePosts } from '../src/lib/post-order.ts';
const post = (id, order, day) => ({ id, data: { order, date: new Date(`2026-11-${day}T00:00:00Z`) } });
const entries = [post('recent', 0, '04'), post('second', 2, '01'), post('first', 1, '01'), post('older', 0, '02')];
assert.deepEqual(entries.sort(comparePosts).map((p) => p.id), ['first','second','recent','older']);
assert.equal(comparePosts(post('a', 0, '01'), post('b', 0, '01')) < 0, true);
console.log('Articles : positions prioritaires, date et égalités vérifiées.');
