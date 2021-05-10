exports.run = async(client, message) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('Du skal deltage i en stemmekanal, før du bruger denne kommando!');
    let queue = message.client.queue.get(message.guild.id)
    if(!queue) return message.channel.send({
        embed: {
            description: 'Der er ikke noget, der spiller lige nu at genoptage!'
        }
    })
    if(queue.playing !== false)
    queue.connection.dispatcher.resume()
    message.react('▶')
    message.channel.send('Genoptaget Musikken!')
}