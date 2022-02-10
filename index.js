require('dotenv').config()
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf').Markup
const CONTRUES_LIST = require('./constants')

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name}!
Узнай статистику по Коронавирусу.
Чтобы узнать список стран, пропиши команду /help
`, Markup.keyboard([
    ['US', 'Russia'],
    ['Ukraine', 'Kazakhstan'],
])
                             
    )
         );

bot.help((ctx) => ctx.reply(CONTRUES_LIST))
bot.on('text', async (ctx) => {
    
    let date = {};
    try{
    date = await api.getReportsByCountries(ctx.message.text);
    const newDate = `
        Страна: ${date[0][0].country} 
Случаи: ${date[0][0].cases} зар.
Смерти: ${date[0][0].deaths} чел.
Вылечились: ${date[0][0].recovered} чел.
`;
    ctx.reply(newDate)
    }  catch{
        console.log('ошибка');
        await ctx.reply('Ошибка, такой страны нет')
        ctx.reply('Чтобы узнать список стран, пропишите /help')
}
});

bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();

