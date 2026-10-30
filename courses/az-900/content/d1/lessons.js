// Domain 1 — Describe cloud concepts. Original content, checked against Microsoft Learn (shared responsibility in the cloud, savings plan and reservation docs, Spot VMs, AZ-900 study guide of July 20, 2026).
export default [
  { id: '1.1-cloud-computing', topic: '1.1', title: 'Cloud Computing, Shared Responsibility, Cloud Models, Pricing and Serverless', minutes: 9, file: '1.1-cloud-computing.md',
    objectives: ['Define cloud computing and the consumption-based model', 'Split responsibility between customer and Microsoft for on-premises, IaaS, PaaS and SaaS', 'Compare public, private and hybrid cloud and their use cases', 'Contrast CapEx and OpEx and compare pay-as-you-go, reservations, savings plans and spot', 'Describe serverless computing'] },
  { id: '1.2-cloud-benefits', topic: '1.2', title: 'Benefits of Cloud Services', minutes: 7, file: '1.2-cloud-benefits.md',
    objectives: ['Distinguish high availability, scalability, elasticity and reliability', 'Explain performance and cost predictability', 'Describe security and governance benefits and their limits', 'Match scenarios to the correct benefit'] },
  { id: '1.3-service-types', topic: '1.3', title: 'IaaS, PaaS and SaaS', minutes: 7, file: '1.3-service-types.md',
    objectives: ['Define IaaS, PaaS and SaaS and give Azure examples', 'State what the customer manages in each type', 'Choose a service type for a use case'] },
];
