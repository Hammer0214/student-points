// ============================================================
// 云端数据服务模块 - 基于 Jsonbin.io
// ============================================================

const BIN_ID = '6a3ceb7eda38895dfefc3402';
const API_KEY = '$2a$10$rabB01zckLxq.gOOw51j4O6RVryRhGc6GTu9amWuIUJNc.ndgqNz2';
const API_BASE = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const DEFAULT_DATA = {
    version: '2.0',
    updatedAt: new Date().toISOString(),
    students: [],
    groups: [],
    individualPointsRules: [],
    groupPointsRules: [],
    settings: {}
};

async function readData() {
    try {
        const resp = await fetch(`${API_BASE}/latest`, {
            method: 'GET',
            headers: { 'X-Master-Key': API_KEY }
        });
        if (!resp.ok) {
            if (resp.status === 404) {
                await writeData(DEFAULT_DATA);
                return DEFAULT_DATA;
            }
            console.error('[api.js] readData HTTP', resp.status, resp.statusText);
            return null;
        }
        const json = await resp.json();
        if (!json.record) {
            await writeData(DEFAULT_DATA);
            return DEFAULT_DATA;
        }
        return json.record;
    } catch (e) {
        console.error('[api.js] readData 网络错误:', e.message);
        return null;
    }
}

async function writeData(data) {
    try {
        const resp = await fetch(API_BASE, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify(data)
        });
        if (!resp.ok) {
            const text = await resp.text().catch(() => '');
            console.error('[api.js] writeData HTTP', resp.status, resp.statusText, text);
            return false;
        }
        return true;
    } catch (e) {
        console.error('[api.js] writeData 网络错误:', e.message);
        return false;
    }
}
