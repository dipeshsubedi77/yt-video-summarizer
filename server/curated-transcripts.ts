import { TranscriptSegment } from '../src/types/index.ts';

export interface CuratedVideoData {
  videoId: string;
  url: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  durationSec: number;
  durationText: string;
  category: 'Lecture' | 'Tutorial' | 'Podcast' | 'Interview' | 'Documentary';
  segments: TranscriptSegment[];
}

export const CURATED_VIDEOS: Record<string, CuratedVideoData> = {
  // 1. Lecture: Andrej Karpathy - Intro to Large Language Models (11 chars: zjkBMFhNj_g)
  'zjkBMFhNj_g': {
    videoId: 'zjkBMFhNj_g',
    url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
    title: '[1hr Talk] Intro to Large Language Models',
    channelTitle: 'Andrej Karpathy',
    thumbnailUrl: 'https://i.ytimg.com/vi/zjkBMFhNj_g/hqdefault.jpg',
    durationSec: 3600,
    durationText: '1:00:00',
    category: 'Lecture',
    segments: [
      { start: 0, duration: 25, text: "Hi everyone, welcome to this intro talk on Large Language Models. My goal is to build a complete mental model of what an LLM actually is." },
      { start: 26, duration: 40, text: "We will start with pretraining, which takes a massive chunk of the internet—about 10 terabytes of text—and runs it through a massive GPU cluster to compress the world knowledge into neural network weights." },
      { start: 67, duration: 45, text: "During pretraining, the model is simply playing a next-token prediction game. It learns grammar, physics, reasoning, history, and code purely by predicting what word comes next." },
      { start: 115, duration: 50, text: "A pretrained base model is not an assistant; it's a document completer. If you ask it 'What is the capital of France?', it might output 'What is the capital of Germany?' because it mimics exam worksheets." },
      { start: 168, duration: 55, text: "To turn a base model into an assistant like ChatGPT, we use Supervised Fine-Tuning (SFT). Human labelers write thousands of high-quality conversational prompts and ideal responses." },
      { start: 225, duration: 60, text: "After SFT, we apply Reinforcement Learning from Human Feedback (RLHF). Human evaluators compare multiple model responses, scoring which is more helpful, truthful, and harmless." },
      { start: 288, duration: 65, text: "Next, let's explore LLM OS: the idea that an LLM is not just a chatbot, but the CPU of a new operating system that coordinates memory, tools, search engines, python interpreters, and disk access." },
      { start: 355, duration: 70, text: "We also examine security challenges such as prompt injection, jailbreaking, data poisoning, and hallucination mitigation techniques like Retrieval-Augmented Generation (RAG)." },
      { start: 428, duration: 75, text: "In conclusion, LLMs represent a fundamental paradigm shift in computing, where human intent expressed in natural language compiles directly into executable actions and structured reasoning." }
    ]
  },
  // 2. Tutorial: 3Blue1Brown - But what is a neural network? (sVx1MmxW074)
  'sVx1MmxW074': {
    videoId: 'sVx1MmxW074',
    url: 'https://www.youtube.com/watch?v=sVx1MmxW074',
    title: 'But what is a neural network? | Deep learning, chapter 1',
    channelTitle: '3Blue1Brown',
    thumbnailUrl: 'https://i.ytimg.com/vi/sVx1MmxW074/hqdefault.jpg',
    durationSec: 1150,
    durationText: '19:10',
    category: 'Tutorial',
    segments: [
      { start: 0, duration: 30, text: "What is a neural network? It is one of the most widely used metaphors in modern machine learning, inspired loosely by biological brains." },
      { start: 31, duration: 45, text: "Let's inspect a concrete task: recognizing handwritten digits from 0 to 9 in a 28 by 28 pixel grayscale image." },
      { start: 78, duration: 50, text: "The input layer consists of 784 neurons, each holding an activation number between 0 and 1 representing pixel brightness." },
      { start: 130, duration: 55, text: "These activations feed into hidden layers. Each neuron in the hidden layer computes a weighted sum of all incoming activations, adds a bias term, and passes it through an activation function like Sigmoid or ReLU." },
      { start: 188, duration: 60, text: "Conceptually, neurons in intermediate layers can detect subcomponents—like small edges, loops, or horizontal strokes—combining them into higher-level features." },
      { start: 250, duration: 55, text: "The final layer outputs 10 activations corresponding to probabilities for digits 0 through 9." },
      { start: 310, duration: 65, text: "Training this network means adjusting thousands of weights and biases to minimize a cost function through gradient descent and backpropagation." },
      { start: 380, duration: 50, text: "This mathematical architecture transforms unstructured visual arrays into reliable, calibrated classification." }
    ]
  },
  // 3. Podcast: Lex Fridman - Sam Altman on GPT-4, OpenAI, and AGI (L_Guz73e6fw)
  'L_Guz73e6fw': {
    videoId: 'L_Guz73e6fw',
    url: 'https://www.youtube.com/watch?v=L_Guz73e6fw',
    title: 'Sam Altman: OpenAI, GPT-4, and the Future of AI',
    channelTitle: 'Lex Fridman',
    thumbnailUrl: 'https://i.ytimg.com/vi/L_Guz73e6fw/hqdefault.jpg',
    durationSec: 8520,
    durationText: '2:22:00',
    category: 'Podcast',
    segments: [
      { start: 0, duration: 35, text: "Welcome to the podcast. Today I'm speaking with Sam Altman, CEO of OpenAI, following the landmark release of GPT-4." },
      { start: 36, duration: 45, text: "Sam discusses how scaling compute and data continues to produce unexpected emergent reasoning capabilities in deep neural networks." },
      { start: 83, duration: 55, text: "Alignment remains the central engineering challenge: how do we ensure systems smarter than humans reliably do what humans intend, without deceptive alignment?" },
      { start: 140, duration: 60, text: "On the societal impact: programming and writing are already transformed. Developers are 2x to 3x more productive, spending less time on syntax and more on high-level architecture." },
      { start: 202, duration: 65, text: "Looking ahead towards AGI, Sam emphasizes democratic governance, gradual deployment to allow society to adapt, and widespread distribution of benefits." }
    ]
  },
  // 4. Interview: Steve Jobs - Stanford Commencement Speech (UF8uR6Z6KLc)
  'UF8uR6Z6KLc': {
    videoId: 'UF8uR6Z6KLc',
    url: 'https://www.youtube.com/watch?v=UF8uR6Z6KLc',
    title: 'Steve Jobs\' 2005 Stanford Commencement Address',
    channelTitle: 'Stanford',
    thumbnailUrl: 'https://i.ytimg.com/vi/UF8uR6Z6KLc/hqdefault.jpg',
    durationSec: 904,
    durationText: '15:04',
    category: 'Interview',
    segments: [
      { start: 0, duration: 30, text: "I am honored to be with you today at your commencement from one of the finest universities in the world. Today I want to tell you three stories from my life." },
      { start: 31, duration: 60, text: "The first story is about connecting the dots. I dropped out of Reed College and dropped in on a calligraphy class. Ten years later, that calligraphy inspired the typography of the first Macintosh computer." },
      { start: 92, duration: 65, text: "You can't connect the dots looking forward; you can only connect them looking backwards. You have to trust that the dots will somehow connect in your future." },
      { start: 160, duration: 65, text: "My second story is about love and loss. I got fired from Apple at 30. It was devastating, but it freed me to enter one of the most creative periods of my life, founding NeXT and Pixar." },
      { start: 228, duration: 65, text: "My third story is about death. Remembering that you are going to die is the best way I know to avoid the trap of thinking you have something to lose. Your time is limited, so don't waste it living someone else's life." },
      { start: 295, duration: 40, text: "Stay Hungry. Stay Foolish. Thank you all very much." }
    ]
  },
  // 5. Documentary: Veritasium - The Simplest Math Problem No One Can Solve (094y1Z2wpJg)
  '094y1Z2wpJg': {
    videoId: '094y1Z2wpJg',
    url: 'https://www.youtube.com/watch?v=094y1Z2wpJg',
    title: 'The Simplest Math Problem No One Can Solve - Collatz Conjecture',
    channelTitle: 'Veritasium',
    thumbnailUrl: 'https://i.ytimg.com/vi/094y1Z2wpJg/hqdefault.jpg',
    durationSec: 1320,
    durationText: '22:00',
    category: 'Documentary',
    segments: [
      { start: 0, duration: 30, text: "Pick any positive integer. If it is even, divide it by two. If it is odd, multiply it by three and add one. Repeat this simple process indefinitely." },
      { start: 32, duration: 45, text: "No matter what number you start with, does the sequence always eventually reach the loop 4, 2, 1? This is known as the Collatz Conjecture, or the 3n + 1 problem." },
      { start: 80, duration: 55, text: "It is so deceptively simple that elementary school children can understand it, yet the greatest mathematicians in history have failed to prove it true." },
      { start: 138, duration: 60, text: "Computers have tested every integer up to 2 to the 68th power—billions of billions of numbers—and every single one terminates in 1. Yet mathematical proof requires certainty for all infinite integers." },
      { start: 200, duration: 60, text: "Paul Erdős famously said: 'Mathematics is not yet ripe enough for such questions.' It reveals the profound boundaries of human mathematical understanding." }
    ]
  },
  // 6. Rick Astley - Never Gonna Give You Up (dQw4w9WgXcQ)
  'dQw4w9WgXcQ': {
    videoId: 'dQw4w9WgXcQ',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
    channelTitle: 'Rick Astley',
    thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    durationSec: 212,
    durationText: '3:32',
    category: 'Lecture',
    segments: [
      { start: 0, duration: 18, text: "We're no strangers to love. You know the rules and so do I. A full commitment's what I'm thinking of; you wouldn't get this from any other guy." },
      { start: 19, duration: 24, text: "I just wanna tell you how I'm feeling, gotta make you understand. Never gonna give you up, never gonna let you down, never gonna run around and desert you." },
      { start: 44, duration: 25, text: "Never gonna make you cry, never gonna say goodbye, never gonna tell a lie and hurt you. We've known each other for so long, your heart's been aching but you're too shy to say it." },
      { start: 70, duration: 30, text: "Inside we both know what's been going on; we know the game and we're gonna play it. And if you ask me how I'm feeling, don't tell me you're too blind to see." },
      { start: 101, duration: 35, text: "Never gonna give you up, never gonna let you down. Never gonna run around and desert you. Never gonna make you cry, never gonna say goodbye, never gonna tell a lie and hurt you." }
    ]
  }
};
