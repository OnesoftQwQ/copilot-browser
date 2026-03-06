function toggleSwitch(id) {
    const el = document.getElementById(id);
    el.classList.toggle('active');
}

// Load saved settings
chrome.storage.local.get([
    'relayUrl', 'apiKey', 'autoConnect', 'autoReconnect',
    'maxReconnect', 'heartbeat', 'selfHeal', 'maxRetries'
], (data) => {
    if (data.relayUrl) document.getElementById('relay-url').value = data.relayUrl;
    if (data.apiKey) document.getElementById('api-key').value = data.apiKey;
    if (data.autoConnect) document.getElementById('auto-connect').classList.add('active');
    if (data.autoReconnect !== false) document.getElementById('auto-reconnect').classList.add('active');
    if (data.maxReconnect) document.getElementById('max-reconnect').value = data.maxReconnect;
    if (data.heartbeat) document.getElementById('heartbeat').value = data.heartbeat;
    if (data.selfHeal !== false) document.getElementById('self-heal').classList.add('active');
    if (data.maxRetries) document.getElementById('max-retries').value = data.maxRetries;
});

// Save
document.getElementById('save-btn').addEventListener('click', () => {
    const settings = {
        relayUrl: document.getElementById('relay-url').value || 'ws://localhost:8080',
        apiKey: document.getElementById('api-key').value,
        autoConnect: document.getElementById('auto-connect').classList.contains('active'),
        autoReconnect: document.getElementById('auto-reconnect').classList.contains('active'),
        maxReconnect: parseInt(document.getElementById('max-reconnect').value),
        heartbeat: parseInt(document.getElementById('heartbeat').value),
        selfHeal: document.getElementById('self-heal').classList.contains('active'),
        maxRetries: parseInt(document.getElementById('max-retries').value),
    };

    chrome.storage.local.set(settings, () => {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);

        // Notify background script of settings change
        chrome.runtime.sendMessage({ action: 'settingsUpdated', settings });
    });
});