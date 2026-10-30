// LPI DevOps Tools Engineer (701-200 v2.0) course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'lpidevops:': every saved answer, lesson and exam lives under it.
// LPI scores on a 200–800 scale with 500 to pass; the simulator maps percent correct linearly onto it.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'lpi-devops',
  name: 'DevOps Tools Engineer Prep',
  shortName: 'LPI DevOps',
  title: 'LPI DevOps Tools Engineer (701-200)',
  subtitle: 'LPI · 701-200 v2.0',
  vendor: 'Linux Professional Institute',
  description: 'Curriculum, question bank, timed exam simulator and flashcards for the LPI DevOps Tools Engineer exam 701-200, version 2.0: software engineering, Git and CI/CD, Docker and Podman, Kubernetes and Helm, security, Prometheus, logging and OpenTelemetry.',
  storePrefix: 'lpidevops:',
  backupName: 'lpi-devops-backup',

  domains: DOMAINS,
  exams: [{
    id: '701-200',
    code: EXAM.code,
    name: EXAM.name,
    questionCount: EXAM.questions,
    minutes: EXAM.minutes,
    labs: 0,
    scoreMin: 200,
    scoreMax: 800,
    passScore: 500,
    partialCredit: false,
    passLabel: '500 to pass',
    trendLabel: '500 pass mark',
    passNote: 'LPI reports a scaled score from 200 to 800 with 500 to pass. This site maps percent correct linearly onto that scale (500 ≈ 50%), which is gentler than the real exam, so aim for 75% or more here.',
    scoreNote: 'A question counts only when fully correct; multiple-select and fill-in-the-blank items get no partial credit.',
    dateHint: 'no prerequisite; LPI recommends an LPIC-1-level certification',
    about: {
      title: 'About the real exam',
      items: [
        `${EXAM.name}: ${EXAM.minutes} minutes, ${EXAM.questions} multiple-choice and fill-in-the-blank questions.`,
        'Four topics: Software Engineering (701), Application Container (702), Kubernetes (703), Security and Observability (704). Each objective\'s weight is about how many questions it gets.',
        'Scaled score 200–800; 500 to pass.',
        'Valid 5 years. Delivered at Pearson VUE test centers and online.',
      ],
    },
  }],

  videos: { list: 'content/videos.js', page: 'content/video-page.js' },
  reference: 'content/reference.js',
  guide: 'content/guide.js',

  plan: {
    reviewTasks: [
      ['Take two full timed practice exams (90 min each); aim for 75%+.', '#/exam'],
      ['Drill your three weakest topics from the dashboard until each is above 85%.', '#/'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['On a Linux VM, run a Compose stack, build an image, deploy it to kind or minikube with a Deployment, Service and Helm chart, and scrape it with Prometheus.', '#/learn'],
      ['Skim the Reference cheat sheets (git, docker, kubectl, helm, PromQL).', '#/reference'],
      ['Re-read the LPI objectives page and the term lists for each objective.', '#/guide'],
    ],
  },
};
