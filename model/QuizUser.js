'use strict';

class QuizUser {

    constructor(real_name) {
        this.real_name = real_name;
        this.status = 'start';
        this.question = 0;
        this.score = 0;
        this.tries = 0;
    }

    haveQs(length) {
        return this.question < length;
    }

    getQ(Qs) {
        return Qs[this.question];
    }

    getStatus() {
        return this.status;
    }

    attempt() {
        this.tries++;
    }

    right() {
        this.question++;
        this.score++;
    }

    next() {
        this.question++;
    }

    finish() {
        this.status = 'finish';
    }

    stop() {
        this.status = 'stop';
    }
}

module.exports = QuizUser;