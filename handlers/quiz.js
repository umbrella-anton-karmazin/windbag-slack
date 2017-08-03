'use strict';

const randomParam = require('../utils/randomParam');
const QuizUser = require('../model/QuizUser');
const qs = require('../questions.json');
const users = {};

module.exports = (controller) => {

    controller.hears(['викторина', 'start', 'поехали'], ['direct_message'], (bot, message) => {
        bot.api.users.info({user: message.user}, (error, response) => {
            let {name, real_name} = response.user;

            //TODO хранить юзера в бд, а не в объекте
            // get user by name

            // проверить, если юзер уже закончил, то попращаться
            if (users[name]) {
                switch (users[name].getStatus()) {
                    case 'stop':
                        bot.reply(message, 'Хочешь продолжить? Ну поехали');
                        bot.startPrivateConversation(message, question);
                        break;
                    case 'finish':
                        bot.reply(message, 'Все-все, ты уже закончил :). Жди результатов.');
                        break;
                    default:
                        bot.reply(message, 'Хакир чтоле?');
                        break;
                }
            } else {
                users[name] = new QuizUser(real_name);
                bot.reply(message, 'Я буду задавать вопросы, а ты отвечай :) \n ' +
                    'если не знаешь ответа, переходи к следующему вопросу, отправив сообщение *next*');

                bot.startPrivateConversation(message, question);
            }

            function question(message, dm, retry) {

                // если еще есть вопросы из списка - задать, иначе попрощаться
                if (users[name].haveQs(qs.length)) {
                    // задать вопрос и проверить ответ
                    if (retry) {
                        dm.ask("Неправильно, попробуй еще.", checkAnswer);
                    } else {
                        dm.ask(users[name].getQ(qs).q, checkAnswer);
                    }
                } else {
                    users[name].finish();
                    dm.say("А вот и все, вопросы у меня и кончились. Ты можешь посмотреть свои результаты здесь: http://azaza.ru");
                    dm.next();
                }
            }

            function checkAnswer(message, dm) {
                // счетчик попыток
                users[name].attempt();

                console.log(message, 2);

                switch (message.text) {
                    case 'stop':
                        users[name].stop();
                        dm.say("Когда будешь готов - возвращайся. Пиши *start* и мы продолжим.");
                        break;
                    case 'score':
                        dm.say(JSON.stringify(users[name]));
                        question(message, dm, true);
                        break;
                    case 'next':
                        users[name].next();
                        dm.say("Что ж ты так. Ну ладно, следующий вопрос...");
                        question(message, dm);
                        break;
                    default:
                        const q = users[name].getQ(qs);
                        if (q.a === message.text) {
                            users[name].right();
                            dm.say("Бинго! Это правильный ответ");
                            question(message, dm);
                        } else {
                            question(message, dm, true);
                        }
                        break;
                }

                dm.next();
            }
        });
    });

    controller.hears('(.*)', ['direct_message'], (bot, message) => {
        bot.api.users.info({user: message.user}, (error, response) => {
            let {name, real_name} = response.user;

            if (users[name]) {
                bot.reply(message, randomParam(
                    'Хочешь, споем?',
                    'Как дела?',
                    'Дяденька, я ведь не настоящий бот',
                    'Куку',
                    'Кто это тут у нас?',
                    'Как погодка?'
                ));
            } else {
                bot.reply(message, 'Привет) Я хочу сыграть с тобой в одну игру! Если согласен. пиши *start*');
            }
        })
    });
};
