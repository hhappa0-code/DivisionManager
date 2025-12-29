const Database = require('better-sqlite3');
const config = new Database('config.db');

function initializeGuildConfigs() {
    config.prepare('CREATE TABLE IF NOT EXISTS guild_configs (guild_id TEXT PRIMARY KEY, config)').run();
}

function getGuildConfig(guildId) {
    const row = config.prepare('SELECT config FROM guild_configs WHERE guild_id = ?').get(guildId);

    return row ? JSON.parse(row.config) : {};
}

function setGuildConfig(guildId, configObject) {
    config.prepare('INSERT OR REPLACE INTO guild_configs (guild_id, config) VALUES (?, ?)').run(guildId, JSON.stringify(configObject));
}

function deleteGuildConfig(guildId) {
    config.prepare('DELETE FROM guild_configs WHERE guild_id = ?').run(guildId);
}

function getValue(guildId, key, defaultValue = null) {
    const guildConfig = getGuildConfig(guildId);
    
    return (key in guildConfig) ?  guildConfig[key] : defaultValue;
}

function setValue(guildId, key, value) {
    const guildConfig = getGuildConfig(guildId);

    guildConfig[key] = value;

    setGuildConfig(guildId, guildConfig);
}

module.exports = {
    initializeGuildConfigs,
    getGuildConfig,
    setGuildConfig,
    deleteGuildConfig,
    getValue,
    setValue,
};
