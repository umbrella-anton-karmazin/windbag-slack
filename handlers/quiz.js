'use strict';

const randomParam = require('../utils/randomParam');
const qs = require('../questions.json');
const messages = require('../repository/db')('db/messages', {autoload: true});
const users = require('../repository/db')('db/users', {autoload: true});
const rules = `> Если ответ подразумевает число/цифру писать только это число/цифру без указания чего-то еще (кг, м, км, дней, детей).
> Если ответ подразумевает дробь, то выражать ее в строчку в виде десятичной дроби (0,1) с запятой.
> Если ответ подразумевает слово, писать слово с маленькой буквы, маленькими буквами.
> Если ответ подразумевает букву, пиши только букву (символом).
> Розыгрыш представляет собой 10 задач: 4 на теорию вероятности, 2 на логику, 1 на эрудицию и 3 на математический расчет.`;

module.exports = (controller) => {

    controller.hears(['старт', 'start'], ['direct_message'], (bot, message) => {
        bot.api.users.info({user: message.user}, (error, response) => {
            let {name, real_name} = response.user;
            let welcome = real_name.split(' ').shift();

            users.findOne({name}, (e, user) => {
                if (!user) {
                    users.insert({name, real_name, status: 'start', q: 0, a: 0}, (insertE, insertUser) => {
                        talkWithUser(insertUser, true);
                    })
                } else {
                    talkWithUser(user);
                }
            });


            function talkWithUser(user, isNew) {
                if (isNew) {
                    bot.reply(message, 'Воу, ты шаришь! Что ж, давай начнем. Смотри, наши правила:');
                    bot.reply(message, rules);
                    bot.startPrivateConversation(message, question);
                } else {
                    switch (user.status) {
                        case 'finish':
                            bot.reply(message, 'Все-все, ты уже закончил :). Жди результатов.');
                            break;
                        case 'wait':
                            bot.reply(message, 'Ты все-таки решился, отлично. Напомню правила и начинаем:');
                            bot.reply(message, rules);

                            users.update({name}, {$set: {status: 'start'}}, () => {
                                bot.startPrivateConversation(message, question);
                            });
                            break;
                        case 'start':
                            bot.reply(message, 'Возможно, были проблемы с сервером. Дай знать @anton.karmazin. А пока предлагаю продолжить, сначала правила:');
                            bot.reply(message, rules);
                            bot.startPrivateConversation(message, question);
                            break;
                        default:
                            bot.reply(message, 'Хакир чтоле?! Ну или что-то пошло не так :). Пиши @anton.karmazin, пусть разбирается');
                            break;
                    }
                }
            }

            function question(message, dm) {
                users.findOne({name}, (e, user) => {
                    if (user.q < qs.length) {
                        dm.say(`*Вопрос №${+user.q + 1}*:`);
                        dm.ask(qs[user.q].q, checkAnswer);
                    } else {
                        users.update({name}, {$set: {status: 'finish'}}, () => {
                            dm.say("А вот и все, вопросы у меня и кончились. Ты можешь посмотреть свои результаты здесь: http://umbr.ml/");
                            dm.next();
                        });
                    }
                });
            }

            function checkAnswer(message, dm) {
                dm.say(randomParam(
                    `Неплохо, ${welcome}!`,
                    'Принято.',
                    'Я тоже так считаю.',
                    `Точно? Ну ладно, ${welcome}`,
                    'Окееей.'
                ));

                users.findOne({name}, (e, user) => {
                    const q = qs[user.q];
                    const inc = {q: 1};
                    const answer = message.text.replace(/[`*\s\"\']/g, '').toLowerCase();
                    // сохранить ответ для потомков
                    messages.insert({name, message: message.text, answer, type: 'answer', q: q.q.substring(0, 30), right_a: q.a});

                    if (q.a.indexOf(answer) !==  -1) {
                        inc.a = 1;
                    }

                    users.update({name}, {$inc: inc}, () => {
                        question(message, dm);
                        dm.next();
                    });
                });
            }
        });
    });

    controller.hears('(.*)', ['direct_message'], (bot, message) => {
        bot.api.users.info({user: message.user}, (error, response) => {
            let {name, real_name} = response.user;
            let welcome = real_name.split(' ').shift();
            messages.insert({name, message: message.text});

            users.findOne({name}, (e, user) => {
                if (user) {
                    if (user.status === 'start') {
                        bot.reply(message, 'Чтобы продолжить пиши *start*.');
                    } else {
                        bot.reply(message, randomParam(
                            'Хочешь, споем?',
                            'Как дела?',
                            'Дяденька, я ведь не настоящий бот',
                            'Куку',
                            'Кто это тут у нас?',
                            'Как погодка?'
                        ));
                    }
                } else {
                    users.insert({name, real_name, status: 'wait', q: 0, a: 0}, () => {
                        bot.reply(message, `Привет, ${welcome}. \nЯ хочу сыграть с тобой в одну игру! Если согласен, пиши *start*.`);
                    })
                }
            });
        })
    });
};
