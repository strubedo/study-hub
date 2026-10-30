// Microsoft Learn's official AZ-800 and AZ-801 course videos (YouTube), mapped to AZ-802 topics.
// AZ-802 replaced both exams on 2026-09-30 and no AZ-802 video series exists yet (checked 2026-10-29),
// so these are the closest free, first-party coverage. `legacy: true` marks episodes whose subject
// AZ-802 dropped (Azure Site Recovery / Azure Backup, workload migration).
export const PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLahhVEj9XNTfJnf25Je2fJb6lOW2Q8lNP';
export const PLAYLIST_URL_801 = 'https://www.youtube.com/playlist?list=PLahhVEj9XNTfnww2iaUgom1Na9KyhHUl0';

const CHANNEL = 'Microsoft Learn';
const P800 = 'PLahhVEj9XNTfJnf25Je2fJb6lOW2Q8lNP';
const P801 = 'PLahhVEj9XNTfnww2iaUgom1Na9KyhHUl0';

const RAW = [
  ['iXiFQrsfigA', 291, 'Course Preview | AZ-800 | Administer Windows Server Hybrid Core Infrastructure', 'extra', [], false, P800],
  ['YYdX5evcEqM', 252, 'Course introduction AZ-800 | Episode 1', 'extra', [], false, P800],
  ['t613dMAAwx4', 2879, 'Deploy and manage identity infrastructure in Windows Server AZ-800 | Episode 2', 'lecture', ['1.1', '1.2', '1.3', '1.4'], false, P800],
  ['UXH4WC-uuJk', 2305, 'Deploy and manage identity infrastructure in hybrid scenarios AZ-800 | Episode 3', 'lecture', ['1.1'], false, P800],
  ['jFssZjDzuuk', 2054, 'Windows Server administration AZ-800 | Episode 4', 'lecture', ['2.1', '6.2'], false, P800],
  ['C0tY_ZMxUTA', 1690, 'Facilitate hybrid management AZ-800 | Episode 5', 'lecture', ['2.2'], false, P800],
  ['lP4VfyVz12k', 2955, 'Manage Hyper-V virtualization in Windows Server AZ-800 | Episode 6', 'lecture', ['3.1'], false, P800],
  ['3LiKHuZV93o', 2771, 'Deploy and configure Azure VMs AZ-800 | Episode 7', 'lecture', ['3.2'], false, P800],
  ['okdwGaA0C7g', 3918, 'Implement network infrastructure services in Windows Server AZ-800 | Episode 8', 'lecture', ['4.1', '4.2'], false, P800],
  ['HOD2HrHHSYY', 3582, 'Implement hybrid networking infrastructure AZ-800 | Episode 9', 'lecture', ['4.1', '4.2'], false, P800],
  ['ZlieTZEwfOA', 3238, 'File servers and storage management in Windows Server AZ-800 | Episode 10', 'lecture', ['5.2', '5.3'], false, P800],
  ['bLShjFtgi3A', 2326, 'Implement a hybrid file server infrastructure AZ-800 | Episode 11', 'lecture', ['5.1'], false, P800],
  ['-UzYCv_0Igw', 101, 'Course conclusion AZ-800 | Episode 12', 'extra', [], false, P800],
  ['QtDASHlajh8', 297, 'Course Preview | AZ-801 | Configure Windows Server Hybrid Advanced Services', 'extra', [], false, P801],
  ['bVVXROfxxWA', 3238, 'Secure Windows Server on-premises and hybrid infrastructures Part 1 | AZ-801 | Episode 1', 'lecture', ['6.1'], false, P801],
  ['yJPO6cDaOmc', 2479, 'Secure Windows Server on-premises and hybrid infrastructures Part 2 | AZ-801 | Episode 2', 'lecture', ['6.2'], false, P801],
  ['jBF6pS9-MJo', 3872, 'Secure Windows Server on-premises and hybrid infrastructures Part 3 | AZ-801 | Episode 3', 'lecture', ['6.1', '5.3'], false, P801],
  ['yaCP0qtIG40', 4005, 'Implementing Windows Server high availability AZ-801 | Episode 4', 'lecture', ['3.1', '5.3'], false, P801],
  ['XgbiqvBBed8', 2750, 'Disaster recovery in Windows Server on-premises and hybrid environments Part 1 | AZ-801 | Episode 5', 'lecture', ['3.1'], false, P801],
  ['3K_fDND9h_Q', 2589, 'Disaster recovery in Windows Server on-premises and hybrid environments Part 2 | AZ-801 | Episode 6', 'lecture', [], true, P801],
  ['nQMLByaXT50', 1659, 'Migrate servers and workloads in on-premises and hybrid environments Part 1 | AZ-801 | Episode 7', 'lecture', [], true, P801],
  ['lcqYQF8CyhQ', 2117, 'Migrate servers and workloads in on-premises and hybrid environments Part 2 | AZ-801 | Episode 8', 'lecture', [], true, P801],
  ['yiHxofCslvE', 3698, 'Monitor and troubleshoot Windows Server environments Part 1 | AZ-801 | Episode 9', 'lecture', ['7.1'], false, P801],
  ['ZbC69ijclkg', 3582, 'Monitor and troubleshoot Windows Server environments Part 2 | AZ-801 | Episode 10', 'lecture', ['7.2', '7.3'], false, P801],
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, playlist], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel: CHANNEL, playlist,
}));
