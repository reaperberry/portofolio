const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

let helloCounter = 0;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    if (content.includes('hello')) {
        helloCounter++;
        message.channel.send(`Hello to you too! You've said it ${helloCounter} times.`);
    } else if (content === '!resethello') {
        helloCounter = 0;
        message.channel.send(`Hello counter reset.`);
    } else if (content === '!hellocount') {
        message.channel.send(`You've said "hello" ${helloCounter} times.`);
    } else if (content === '!sound') {
        const voiceChannel = message.guild.channels.cache.find(
            ch => ch.type === 2 && ch.members.filter(m => !m.user.bot).size > 0
        );

        if (!voiceChannel) return message.channel.send('No active voice channels found.');

        const files = fs.readdirSync('./sounds').filter(file => file.endsWith('.opus'));
        if (files.length === 0) return message.channel.send('No .opus files found in /sounds.');

        const randomSound = files[Math.floor(Math.random() * files.length)];
        const resource = createAudioResource(path.join('./sounds', randomSound));
        const player = createAudioPlayer();

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });

        connection.subscribe(player);
        player.play(resource);

        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });

        connection.on(VoiceConnectionStatus.Disconnected, () => {
            connection.destroy();
        });
    }
});

client.login('MTM2NzA1NTU0MDQ3NTQwMDI2Mw.Gihasd.Ll7Dolod1JhAj2nVnywx97ofHBAHyzOaFOLznY');