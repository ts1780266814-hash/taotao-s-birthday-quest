import { Quiz } from './types';

export const quizzes: Record<string, Quiz> = {
  quiz1: {
    id: 'quiz1',
    question: '爽爽的生日是什么时候？',
    type: 'choice',
    choices: ['2002年5月18日', '2002年5月8日', '2002年8月18日'],
    correctAnswer: 0,
    correctFeedback: '哼，还算有点记性。',
    wrongFeedback: '再想想，这都能错？',
    preMessage: '先别得意，记性也得过关。',
  },
  quiz2: {
    id: 'quiz2',
    title: '特殊检查',
    question: '爽爽的手机号是什么？',
    type: 'input',
    correctAnswer: '19507301271',
    correctFeedback: '行，这个还算没白记。',
    wrongFeedback: '',
    preMessage: '先别急着往前，查你一下岗。',
  },
  quiz3: {
    id: 'quiz3',
    title: '最后确认',
    question: '涛涛第一次来爽爽家时，爽爽穿着什么衣服？',
    type: 'choice',
    choices: ['一套黄色的睡衣', '一件白色T恤和短裤', '一套粉色的家居服'],
    correctAnswer: 0,
    correctFeedback: '还好，这个你没忘。',
    wrongFeedback: '再想想，别真翻车了。',
    preMessage: '都走到这了，别在这题翻车。',
  },
};
