const { MessageEmbed } = require('discord.js')
exports.run = async(client, message) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('du skal deltage i en stemmekanal, før du bruger denne kommando!');
    let queue = message.client.queue.get(message.guild.id)
    if(!queue) return message.channel.send({
        embed:{
            title: 'Der spiller intet lige nu!'
        }
    })
    message.channel.send({
        embed:{
            title: 'Spiller nu',
            description: queue.songs[0].title + ' Efterspurgt af: ' + '<@' + queue.songs[0].requester + '>',
            color: 'YELLOW',
            thumbnail: queue.songs[0].thumbnail
        }
    })
}