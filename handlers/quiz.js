'use strict';

const randomParam = require('../utils/randomParam');
const qs = require('../questions.json');
const messages = require('../repository/db')('db/messages', {autoload: true});
const users = require('../repository/db')('db/users', {autoload: true});

module.exports = (controller) => {

    controller.hears(['старт', 'start'], ['direct_message'], (bot, message) => {
        bot.api.users.info({user: message.user}, (error, response) => {
            let {name, real_name} = response.user;
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
                    bot.reply(message, 'Воу, ты шаришь! Что ж, давай начнем.');
                    bot.startPrivateConversation(message, question);
                } else {
                    switch (user.status) {
                        case 'finish':
                            bot.reply(message, 'Все-все, ты уже закончил :). Жди результатов.');
                            break;
                        case 'wait':
                            bot.reply(message, 'Ты все-таки решился, отлично, тогда поехали.');
                            bot.startPrivateConversation(message, question);
                            break;
                        default:
                            bot.reply(message, 'Хакир чтоле?! Ну или что-то пошло не так :) ');
                            break;
                    }
                }
            }

            function question(message, dm) {
                users.findOne({name}, (e, user) => {
                    if (user.q < qs.length) {
                        dm.ask(qs[user.q].q, checkAnswer);
                    } else {
                        users.update({name}, {$set: {status: 'finish'}}, () => {
                            dm.say("А вот и все, вопросы у меня и кончились. Ты можешь посмотреть свои результаты здесь: http://test.ru");
                            dm.next();
                        });
                    }
                });
            }

            function checkAnswer(message, dm) {
                users.findOne({name}, (e, user) => {
                    const q = qs[user.q];
                    const inc = {q: 1};

                    // сохранить ответ для потомков
                    messages.insert({name, message: message.text, type: 'answer', q: q.q, right_a: q.a});

                    // TODO: сделать проверку на разные варианты ответов
                    if (q.a === message.text) {
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

            messages.insert({name, message: message.text});

            users.findOne({name}, (e, user) => {
                if (user) {
                    bot.reply(message, randomParam(
                        'Хочешь, споем?',
                        'Как дела?',
                        'Дяденька, я ведь не настоящий бот',
                        'Куку',
                        'Кто это тут у нас?',
                        'Как погодка?'
                    ));
                } else {
                    users.insert({name, real_name, status: 'wait', q: 0, a: 0}, () => {
                        bot.reply(message, 'Привет) Я хочу сыграть с тобой в одну игру! Если согласен, пиши *start*.');
                    })
                }
            });
        })
    });
};
