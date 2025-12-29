const { EmbedBuilder } = require('discord.js');

module.exports = {
    infoEmbed: (message, color) => {
        return [new EmbedBuilder().setDescription(message).setColor(color)];
    },
};
