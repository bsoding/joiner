'use strict';
(() => {
  const PLACE = '15532962292';
  function targetFor(locationUrl) {
    const input = new URL(locationUrl);
    const route = input.pathname.split('/').filter(Boolean).pop();
    const one = name => input.searchParams.getAll(name).length === 1 ? input.searchParams.get(name) : '';
    if (route === 'joinid') {
      const place = one('placeId'), job = one('gameInstanceId');
      if (place !== PLACE || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(job)) throw Error('Invalid server link.');
      return `roblox://placeID=${PLACE}&gameInstanceId=${encodeURIComponent(job)}`;
    }
    if (route !== 'joinfromps') throw Error('Unknown join route.');
    let link;
    try { link = new URL(one('link')); } catch { throw Error('Missing or invalid private server link.'); }
    if (link.protocol !== 'https:' || !['roblox.com', 'www.roblox.com'].includes(link.hostname) || link.username || link.password || link.port) throw Error('Invalid Roblox private server link.');
    const value = name => link.searchParams.getAll(name).length === 1 ? link.searchParams.get(name) : '';
    if (/^\/share(?:-links)?\/?$/.test(link.pathname) && /^server$/i.test(value('type')) && /^[0-9a-f]{32}$/i.test(value('code')))
      return `roblox://navigation/share_links?code=${encodeURIComponent(value('code'))}&type=Server`;
    if (/^\/games\/15532962292(?:\/|$)/.test(link.pathname) && /^[A-Za-z0-9_-]{1,200}$/.test(value('privateServerLinkCode')))
      return `roblox://placeID=${PLACE}&linkCode=${encodeURIComponent(value('privateServerLinkCode'))}`;
    throw Error('Invalid Roblox private server link.');
  }
  globalThis.Joiner = Object.freeze({targetFor});
  if (typeof document === 'undefined') return;
  try {
    const target = targetFor(location.href);
    document.getElementById('open').href = target;
    document.getElementById('open').hidden = false;
    location.href = target;
  } catch (error) {
    document.getElementById('status').textContent = error.message;
  }
})();
