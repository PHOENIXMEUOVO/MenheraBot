const { MessageEmbed, Collection } = require("discord.js");
const Sentry = require("@sentry/node");
const config = require("../config.json");
const database = require("../models/user");
const cmdDb = require("../models/cmds.js")
const serverDb = require("../models/guild.js")

const cooldowns = new Collection();

module.exports = async (client, message) => {

  //ping system
  if(message.author.id === "757295289630720031" && message.content === "PINGING..."){
    setTimeout(() =>  message.channel.send("Pong! That's my response to your call, master"), 200) 
    return
  }
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  const server = await serverDb.findOne({id: message.guild.id})
  if (!server) {
    serverDb({
      id: message.guild.id
    }).save()
  }

  let prefix;
  if(!server){
    prefix = config.prefix;
  } else prefix = server.prefix;

  if (message.mentions.users.size >= 0) {
    message.mentions.users.forEach(async (member) => {
      if (!member) return
      const usuario = await database.findOne({ id: member.id })
      if (usuario) {
        if (usuario.afk === true) {
          message.channel.send(`<:notify:759607330597502976> | ${message.author}, \`${member.tag}\` está AFK: ${usuario.afkReason}`)
        }
      }
    })
  }
  let user = await database.findOne({ id: message.author.id })
  if (user) {
    if (user.afk == true) {
      user.afk = false
      user.afkReason = null
      user.save()
      message.channel.send(`Bem vindo de volta ${message.author} >.<`).then(msg => msg.delete({ timeout: 5000 })).catch()
    }
  }

  if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return message.channel.send(`Oizinho ${message.author}, meu prefixo neste servidor é '${prefix}'`);

  if (!message.content.startsWith(prefix)) return;

  if (!message.member) message.member = await message.guild.fetch(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (!command) return;

  if (command) {

    if (!user) {
      await new database({
        id: message.author.id,
        nome: message.author.username,
        shipValue: Math.floor(Math.random() * 55)
      }).save()
    }

    if (user) {
      if (user.ban) {

        let avatar
        if (!message.author.avatar.startsWith("a_")) {
          if (!message.author.avatar) {
            avatar = message.author.displayAvatarURL()
          } else {
            avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=2048`
          }
        } else {
          if (!message.author.avatar) {
            avatar = message.author.displayAvatarURL()
          } else {
            avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.gif?size=2048`
          }
        }
        let owner = await client.users.fetch("435228312214962204")

        const embed = new MessageEmbed()
          .setColor('#c1001d')
          .setAuthor("Você foi banido", avatar)
          .setDescription(`Olá ${message.author}, você foi banido de usar a Menhera`)
          .addField("Motivo", user.banReason)
          .addField("Banido injustamente?", `Se você acha que foi banido injustamente, então entre em contato com a ${owner.tag} ou entre no meu servidor de suporte.`)

        message.channel.send(embed).catch(() => {
          message.author.send(embed)
        })
        return
      }
    }

    if (command.devsOnly) {
      if (!config.owner.includes(message.author.id)) return message.channel.send(`Perdão ${message.author}, este comando só está disponível para minha dona :(`)
    }

    let c = await cmdDb.findById(command.name)
    if (c.maintenance) {
      if (!config.owner.includes(message.author.id)) {
        return message.channel.send(`<:negacao:759603958317711371> | **MANUTENÇÃO**\n Este comando está em manutenção por tempo indeterminado!\n\n**Motivo:** ${c.maintenanceReason}`)
      }
    }

  
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    if(!config.owner.includes(message.author.id)){
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

  	if (now < expirationTime) {
		const timeLeft = (expirationTime - now) / 1000;
    return message.channel.send(`<:atencao:759603958418767922> | Espere ${timeLeft.toFixed(1)} segundos antes de usar o comando \`${command.name}\` em específico`);
	}
}

timestamps.set(message.author.id, now);
setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    }

    command.run(client, message, args).catch(err => {
      console.log(err);
      Sentry.captureException(err);
      message.channel.send("<:atencao:759603958418767922> | Ocorreu um erro na execução desse comando... Bugs e mais bugs...")
    });
    console.log(`Comando: '${command.name}'. Autor: '${message.author.tag}' id: '${message.author.id}' | Servidor: '${message.guild.name}' ServerId: '${message.guild.id}'`);

  }


}