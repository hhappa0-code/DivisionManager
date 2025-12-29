const noblox = require('noblox.js');

async function login(cookie) {
    try {
        const user = await noblox.setCookie(cookie);
        console.log(`[ROBLOX] Logged in as ${user.name}`);
    } catch (error) {
        console.warn(error);
    }
}

async function promoteUser(groupId, username, by = 1) {
    const userId = await noblox.getIdFromUsername(username);
    const result = await noblox.changeRank(groupId, userId, by);

    return {
        oldRole: result.oldRole,
        newRole: result.newRole,
    };
}

async function demoteUser(groupId, username, by = 1) {
    const userId = await noblox.getIdFromUsername(username);
    const result = await noblox.changeRank(groupId, userId, -by);

    return {
        oldRole: result.oldRole,
        newRole: result.newRole,
    };
}

module.exports = {
    login,
    promoteUser,
    demoteUser,
};
