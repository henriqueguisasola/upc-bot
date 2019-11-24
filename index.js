require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const { HLTV } = require('hltv')
const dayjs = require('dayjs')

bot.login('NjQ4MjQyMjkzNzMxNzUzOTg0.XdrYyg.rZT942OLaBQNh1zfk8OgP-n5Yco');

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
        msg.channel.send('pong');

    } else if (msg.content.startsWith('upc!help')) {
        msg.channel.send(`\`\`\`Comandos:
upc!matches: Lista as próximas 10 partidas dos times do top 20 da HLTV
upc!matches Brasil <RANKING>: Lista as próximas 10 partidas dos times do top <RANKING> da HLTV (se não passar o ranking ele pega todos os times BR)
upc!matches <TIME>: Lista as próximas 10 partidas do time <TIME>
        \`\`\``)
    } else if (msg.content.startsWith('upc!matches')) {
        const arg = msg.content.split(' ')[1]
        const secondArg = msg.content.split(' ')[2]
        if (!arg) {
            HLTV.getTeamRanking().then((res) => {
                // console.log(res)
                const teams = res.slice(0, 20).map((team) => team.team.name)
                HLTV.getMatches().then((res2) => {
                    console.log(res2)
                    const importantMatches = res2.filter((match) => {
                        return (match.team1 && teams.includes(match.team1.name)) || (match.team2 && teams.includes(match.team2.name))
                    })
                    let matchSummary = ''
                    importantMatches.slice(0, 10).map((match) => {
                        matchSummary += `${match.live ? 'LIVE' : (dayjs(match.date).format('HH:mm DD/MM/YYYY'))} - ${match.team1.name} X ${match.team2.name} - ${match.title || (match.event && match.event.name)}\n`
                    })
                    console.log(matchSummary)
                    msg.reply(matchSummary)
                    // msg.reply(`Eu encontrei ${res.length} partidas!`)
                })
            })
        } else if (arg === 'Brasil' || arg === 'brasil') {
            HLTV.getTeamRanking({ country: 'Brazil' }).then((res) => {
                const teams = res.slice(0, secondArg).map((team) => team.team.name)
                HLTV.getMatches().then((res2) => {
                    const importantMatches = res2.filter((match) => {
                        return (match.team1 && teams.includes(match.team1.name)) || (match.team2 && teams.includes(match.team2.name))
                    })
                    let matchSummary = ''
                    importantMatches.slice(0, 10).map((match) => {
                        matchSummary += `${match.live ? 'LIVE' : (dayjs(match.date).format('HH:mm DD/MM/YYYY'))} - ${match.team1.name} X ${match.team2.name} - ${match.title || (match.event && match.event.name)}\n`
                    })
                    console.log(matchSummary)
                    msg.reply(matchSummary)
                })
            })
        } else {
            HLTV.getMatches().then((res2) => {
                const importantMatches = res2.filter((match) => {
                    return (match.team1 && match.team1.name === arg) || (match.team2 && match.team2.name === arg)
                })
                let matchSummary = ''
                importantMatches.slice(0, 10).map((match) => {
                    matchSummary += `${match.live ? 'LIVE' : (dayjs(match.date).format('HH:mm DD/MM/YYYY'))} - ${match.team1.name} X ${match.team2.name} - ${match.title || (match.event && match.event.name)}\n`
                })
                console.log(matchSummary)
                msg.reply(matchSummary)
            })
        }
    }
});
