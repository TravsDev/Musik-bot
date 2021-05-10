const ytdl = require('ytdl-core-discord');
var scrapeYt = require("scrape-yt");
const discord = require('discord.js')

exports.run = async (client, message, args) => {

    if(!args[0]) return message.channel.send('Du har ikke leveret en sang til mig for at spille!')
    let channel = message.member.voice.channel;
    if(!channel) return message.channel.send('Du skal tilmelde dig en stemmekanal for at spille en musik!')

    if (!channel.permissionsFor(message.client.user).has("CONNECT")) return message.channel.send('Jeg skal have tidladelse til at spille musik i den kanal du er i!!')
    if (!channel.permissionsFor(message.client.user).has("SPEAK"))return message.channel.send('Jeg har ikke den tidladelse til at snak!')


    const server = message.client.queue.get(message.guild.id);
    let video = await scrapeYt.search(args.join(' '))
    let result = video[0]

    const song = {
        id: result.id,
        title: result.title,
        duration: result.duration,
        thumbnail: result.thumbnail,
        upload: result.uploadDate,
        views: result.viewCount,
        requester: message.author,
        channel: result.channel.name,
        channelurl: result.channel.url
      };

    var date = new Date(0);
    date.setSeconds(song.duration); // specify value for SECONDS here
    var timeString = date.toISOString().substr(11, 8);

      if (server) {
        server.songs.push(song);
        console.log(server.songs);
        let embed = new discord.MessageEmbed()
        .setTitle('Føjet til køen!')
        .setColor('#00fff1')
        .addField('Navn', song.title, true)
        .setThumbnail(song.thumbnail)
        .addField('Visninger', song.views, true)
        .addField('Efterspurgt af', song.requester, true)
        .addField('Varighed', timeString, true)
        .addFooter('Lavet af Danske Developers')
		message.react('⏰')
        return message.channel.send(embed)
    }

    const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: channel,
        connection: null,
        songs: [],
        volume: 2,
        playing: true
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);


    const play = async song => {
        const queue = message.client.queue.get(message.guild.id);
        if (!song) {
            queue.voiceChannel.leave();
            message.client.queue.delete(message.guild.id);
            message.channel.send('Der er ingen sange i kø, jeg forlader stemmekanalen!')
            return;
        }

        const dispatcher = queue.connection.play(await ytdl(`https://youtube.com/watch?v=${song.id}`, {
            filter: format => ['251'],
            highWaterMark: 1 << 25
        }), {
            type: 'opus'
        })
            .on('finish', () => {
                queue.songs.shift();
                play(queue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(queue.volume / 5);
        let noiceEmbed = new discord.MessageEmbed()
        .setTitle('Begyndte afspilning')
        .setThumbnail(song.thumbnail)
        .addField('Navn', song.title, true)
        .addField('Efterspurgt af', song.requester, true)
        .addField('Visninger', song.views, true)
        .addField('Varighed', timeString, true)

        queue.textChannel.send(noiceEmbed);
    };


    try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        play(queueConstruct.songs[0]);
    } catch (error) {
        console.error(`Jeg kunne ikke se eller joine kannalen.`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`Jeg kunne ikke deltage i stemmekanalen: ${error}`);
    }
}
