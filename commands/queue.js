const { MessageEmbed } = require('discord.js')

exports.run = async (client, message) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('Du skal deltage i en stemmekanal, før du bruger denne kommando!');
    const queue = message.client.queue.get(message.guild.id)
    let status;
    if(!queue) status = 'Der er intet i kø!'
    else status = queue.songs.map(x => '• ' + x.title + ' -Efterspurgt af' + `<@${x.requester.id}>`).join('\n')
    if(!queue) np = status
    else np = queue.songs[0].title
    if(queue) thumbnail = queue.songs[0].thumbnail
    else thumbnail = message.guild.iconURL()
    let embed = new MessageEmbed()
    .setTitle('Kø')
    .setThumbnail(thumbnail)
    .setColor('GREEN')
    .addField('Spiller nu', np, true)
    .setDescription(status)
    message.channel.send(embed)
}