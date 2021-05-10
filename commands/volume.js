exports.run = async(client, message, args) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('Du skal deltage i en stemmekanal, før du bruger denne kommando!');

    let queue = message.client.queue.get(message.guild.id)

    if(!args[0]) return message.channel.send({
        embed: {
            description: 'Den aktuelle lydstyrke er indstillet til: ' + queue.volume
        }
    })

    if(args[0] > 10) return message.channel.send('Lad os håbe, vi mødes i himlen :grin:')

    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
    queue.volume = args[0]
    message.channel.send({
        embed: {
            description: 'Lydstyrken er indstillet til ' + args[0]
        }
    })
}