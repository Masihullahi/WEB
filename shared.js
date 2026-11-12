const CFG = window.CONFIG || {};
const live = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && window.supabase);
const sb = live ? supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;
const $ = (s, r = document) => r.querySelector(s);
const money = n => '$' + Number(n).toFixed(0);
const art = (k, c) => 'data:image/svg+xml;utf8,' + encodeURIComponent(
 `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">` + ({
  hoodie: `<path d="M60 40L90 25Q100 42 110 25L140 40L184 84L164 104L146 88V190H54V88L36 104L16 84Z" fill="${c}"/><path d="M90 25Q100 60 110 25" stroke="#0002" fill="none"/>`,
  bag: `<path d="M68 84Q100-14 132 84" stroke="${c}" fill="none" stroke-width="7"/><path d="M28 92Q100 66 172 92Q196 150 152 176Q100 188 48 176Q4 150 28 92Z" fill="${c}"/>`,
  shoe: `<path d="M12 132V98Q62 94 80 66L102 78Q124 102 162 106Q194 112 192 132Z" fill="${c}"/><rect x="12" y="132" width="180" height="13" rx="6" fill="#fff" stroke="#ddd"/>`
 })[k] + `</svg>`);
const DEMO = [
 ['Heavy Hoodie','Hoodies',120,'hoodie','#9aa0a6'],['Forest Hoodie','Hoodies',120,'hoodie','#2f5d3a'],
 ['Crescent Bag','Bags',210,'bag','#e8281b'],['Moss Bag','Bags',190,'bag','#2e8b3d'],['Cocoa Bag','Bags',190,'bag','#6b3f2a'],
 ['Runner One','Shoes',150,'shoe','#222'],['Court Low','Shoes',140,'shoe','#8aa4c8'],['Cloud Sneaker','Shoes',165,'shoe','#c9c9c9']
].map((a, i) => ({ id: i + 1, name: a[0], category: a[1], price: a[2], image_url: art(a[3], a[4]), stock: 20, active: true }));
const demoGet = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const demoSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const db = {
 async products(all) {
  if (!live) return demoGet('products') || DEMO;
  let q = sb.from('products').select('*').order('id'); if (!all) q = q.eq('active', true);
  return (await q).data || [];
 },
 async saveProduct(p) {
  if (!live) { const l = demoGet('products') || DEMO; if (p.id) Object.assign(l.find(x => x.id == p.id), p); else l.push({ ...p, id: Date.now() }); return demoSet('products', l); }
  return p.id ? sb.from('products').update(p).eq('id', p.id) : sb.from('products').insert(p);
 },
 async delProduct(id) {
  if (!live) return demoSet('products', (demoGet('products') || DEMO).filter(x => x.id != id));
  return sb.from('products').delete().eq('id', id);
 },
 async orders() { return live ? (await sb.from('orders').select('*').order('id', { ascending: false })).data || [] : demoGet('orders') || []; },
 async addOrder(o) {
  if (!live) { const l = demoGet('orders') || []; l.unshift({ ...o, id: Date.now(), status: 'new', created_at: new Date().toISOString() }); return demoSet('orders', l); }
  return sb.from('orders').insert(o);
 },
 async setStatus(id, status) {
  if (!live) { const l = demoGet('orders'); l.find(x => x.id == id).status = status; return demoSet('orders', l); }
  return sb.from('orders').update({ status }).eq('id', id);
 }
};
