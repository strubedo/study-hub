// Domain 1 — How Large Language Models Work. Original content; product facts checked against the vendors' own model pages in October 2026.
export default [
  { id: '1.1-tokens-prediction-training', topic: '1.1', title: 'Tokens, Next-Token Prediction and Training', minutes: 8, file: '1.1-tokens-prediction-training.md',
    objectives: ['Explain what a token is and why it is not a word', 'Describe next-token prediction and autoregressive generation', 'Distinguish pretraining from post-training and user fine-tuning', 'Explain why conversations do not change the model weights'] },
  { id: '1.1-context-window-sampling', topic: '1.1', title: 'Context Windows, Temperature and Top-p', minutes: 9, file: '1.1-context-window-sampling.md',
    objectives: ['List what counts against the context window', 'Describe what happens when limits are exceeded', 'Explain temperature and top-p sampling', 'State why temperature 0 is not guaranteed deterministic'] },
  { id: '1.1-hallucination-cutoff', topic: '1.1', title: 'Hallucinations and Knowledge Cutoffs', minutes: 8, file: '1.1-hallucination-cutoff.md',
    objectives: ['Define a hallucination with IT examples', 'Explain the main causes of hallucination', 'Define training data cutoff versus reliable knowledge cutoff', 'Choose mitigations for stale or invented facts'] },
  { id: '1.2-model-families-reasoning', topic: '1.2', title: 'Model Families, Tiers and Reasoning Models', minutes: 9, file: '1.2-model-families-reasoning.md',
    objectives: ['Map ChatGPT, Gemini and Claude to their vendors and model families', 'Recognize the flagship, balanced and fast tier pattern', 'Explain reasoning tokens and effort or thinking-level controls', 'Decide when a reasoning model is worth its extra cost'] },
  { id: '1.2-multimodal-surfaces-choosing', topic: '1.2', title: 'Multimodal Input, Apps vs APIs and Choosing a Model', minutes: 9, file: '1.2-multimodal-surfaces-choosing.md',
    objectives: ['Describe image, file and audio input and its pitfalls', 'Contrast consumer apps, APIs and workspace integrations', 'Recognize vendor-specific custom assistant features', 'Apply a decision process to pick a model for a task'] },
];
