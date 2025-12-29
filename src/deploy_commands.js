const { REST, Routes } = require('discord.js');
const { clientId, token } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const commandsPath = path.join(__dirname, 'command');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.warn(`The command at ${filePath} is missing a required "data" or "execute" property!`);
    }
}

const rest = new REST()
    .setToken(token);

(async () => {
    try {
        console.log(`Started reloading ${commands.length} commands.`);

        const data = await rest.put(Routes.applicationCommands(clientId), { body: commands, });

        console.log(`Successfully reloaded ${data.length} commands.`);
    } catch (error) {
        console.warn(error);
    }
})();
