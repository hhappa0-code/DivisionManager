const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');
const config = require('./util/config.js')

config.initializeGuildConfigs();

const client = new Client({ intents: [ GatewayIntentBits.Guilds ] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'command');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`The command at ${filePath} is missing a required 'data' or 'execute' property!`);
    }
}

client.once(Events.ClientReady, () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.warn(`No command matching ${interaction.commandName} was found!`);

            await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral});

            return;
        }

        try {
            await command.execute(interaction);
        } catch(error) {
            console.warn(error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral});
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral});
            }
        }
    }
});

client.login(token);
