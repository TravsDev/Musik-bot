exports.run = async(client, message) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('Du skal deltage i en stemmekanal, før du bruger denne kommando!');
    let queue = message.client.queue.get(message.guild.id)
    if(!queue){ return message.channel.send({
        embed: {
            description: 'Der er intet i køen lige nu! tilføj ved hjælp af `!play <sang>`',
            color: 'BLACK'
        }
    })
}
    if(queue.songs.length !== 0) {
        message.react('✅')
        queue.connection.dispatcher.end('Okie sprunget over!')
    }
}