const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/command');

module.exports = class PatCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pat',
      aliases: ['carinho', 'cuddle'],
      clientPermissions: ['EMBED_LINKS'],
      category: 'ações',
    });
  }

  async run({ message }, t) {
    const list = [
      'https://i.imgur.com/UWbKpx8.gif',
      'https://i.imgur.com/4ssddEQ.gif',
      'https://i.imgur.com/LUypjw3.gif',
      'https://i.imgur.com/2lacG7l.gif',
      'https://i.imgur.com/2k0MFIr.gif',
      'https://i.imgur.com/XjsEMiK.gif',
      'https://i.imgur.com/sLwoifL.gif',
      'https://i.imgur.com/TPqMPka.gif',
      'https://i.imgur.com/9CvzZTE.gif',
      'https://i.imgur.com/RsPHpae.gif',
      'https://i.imgur.com/sGSjbDB.gif',
      'https://i.imgur.com/aA3RU90.gif',
      'https://i.imgur.com/MXLXuKy.gif',
      'https://i.imgur.com/wBJi5vY.gif',
      'https://i.imgur.com/V7CPWrl.gif',
      'https://i.imgur.com/YoxZ37p.gif',
      'https://i.imgur.com/vblvrbJ.gif',
      'https://i.imgur.com/9NfIAim.gif',
      'https://i.imgur.com/YyfHhi2.gif',
      'https://i.imgur.com/9Sa8J6A.gif',
      'https://i.imgur.com/obkMD3N.gif',
      'https://i.imgur.com/pcBse3K.gif',
      'https://i.imgur.com/MVCLgx6.gif',
      'https://i.imgur.com/nXREyNu.gif',
    ];

    const rand = list[Math.floor(Math.random() * list.length)];
    const user = message.mentions.users.first();

    if (!user) return message.menheraReply('error', t('commands:pat.no-mention'));

    if (user === message.author) return message.menheraReply('error', t('commands:pat.self-mention'));

    const avatar = message.author.displayAvatarURL({ format: 'png', dynamic: true });

    const embed = new MessageEmbed()
      .setTitle(t('commands:pat.embed_title'))
      .setColor('#000000')
      .setDescription(`${message.author} ${t('commands:pat.embed_description')} ${user}`)
      .setImage(rand)
      .setThumbnail(avatar)
      .setAuthor(message.author.tag, avatar);

    message.channel.send(embed);
  }
};
