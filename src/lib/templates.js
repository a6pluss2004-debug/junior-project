// Project Templates Library

export const projectTemplates = {
  blank: {
    id: 'blank',
    name: 'Blank Project',
    icon: '📋',
    description: 'Start from scratch with empty columns',
    columns: [
      { key: 'todo', title: 'To Do', order: 0 },
      { key: 'inprogress', title: 'In Progress', order: 1 },
      { key: 'done', title: 'Done', order: 2 },
    ],
    tasks: [],
  },

  software: {
    id: 'software',
    name: 'Software Development Sprint',
    icon: '🚀',
    description: 'Agile sprint with backlog, development, testing, and deployment stages',
    columns: [
      { key: 'backlog', title: 'Backlog', order: 0 },
      { key: 'todo', title: 'To Do', order: 1 },
      { key: 'inprogress', title: 'In Progress', order: 2 },
      { key: 'review', title: 'Code Review', order: 3 },
      { key: 'testing', title: 'Testing', order: 4 },
      { key: 'done', title: 'Done', order: 5 },
    ],
    tasks: [
      {
        column: 'backlog',
        title: 'Setup development environment',
        description: 'Install dependencies, configure IDE, setup database',
        order: 0,
      },
      {
        column: 'backlog',
        title: 'Design database schema',
        description: 'Create ERD and define collections/tables',
        order: 1,
      },
      {
        column: 'todo',
        title: 'Implement authentication',
        description: 'User login, registration, and session management',
        order: 0,
      },
      {
        column: 'todo',
        title: 'Create API endpoints',
        description: 'Build RESTful API for core features',
        order: 1,
      },
      {
        column: 'inprogress',
        title: 'Build UI components',
        description: 'Design and develop reusable React components',
        order: 0,
      },
    ],
  },

  research: {
    id: 'research',
    name: 'Research Project',
    icon: '📚',
    description: 'Academic research workflow from planning to publication',
    columns: [
      { key: 'planning', title: 'Planning', order: 0 },
      { key: 'literature', title: 'Literature Review', order: 1 },
      { key: 'datacollection', title: 'Data Collection', order: 2 },
      { key: 'analysis', title: 'Analysis', order: 3 },
      { key: 'writing', title: 'Writing', order: 4 },
      { key: 'completed', title: 'Completed', order: 5 },
    ],
    tasks: [
      {
        column: 'planning',
        title: 'Define research question',
        description: 'Formulate clear research objectives and hypotheses',
        order: 0,
      },
      {
        column: 'planning',
        title: 'Create project timeline',
        description: 'Set milestones and deadlines for each phase',
        order: 1,
      },
      {
        column: 'literature',
        title: 'Search academic databases',
        description: 'Find relevant papers in Google Scholar, IEEE, ACM',
        order: 0,
      },
      {
        column: 'literature',
        title: 'Organize references',
        description: 'Use Zotero/Mendeley to manage citations',
        order: 1,
      },
      {
        column: 'datacollection',
        title: 'Design survey/experiment',
        description: 'Create data collection instruments',
        order: 0,
      },
      {
        column: 'datacollection',
        title: 'Collect participant data',
        description: 'Gather responses and observations',
        order: 1,
      },
    ],
  },

  marketing: {
    id: 'marketing',
    name: 'Marketing Campaign',
    icon: '📊',
    description: 'Launch and track marketing campaigns from planning to analysis',
    columns: [
      { key: 'ideas', title: 'Ideas', order: 0 },
      { key: 'planning', title: 'Planning', order: 1 },
      { key: 'creation', title: 'Content Creation', order: 2 },
      { key: 'review', title: 'Review', order: 3 },
      { key: 'launched', title: 'Launched', order: 4 },
      { key: 'analysis', title: 'Analysis', order: 5 },
    ],
    tasks: [
      {
        column: 'ideas',
        title: 'Brainstorm campaign themes',
        description: 'Generate creative concepts aligned with brand',
        order: 0,
      },
      {
        column: 'planning',
        title: 'Define target audience',
        description: 'Create buyer personas and segment demographics',
        order: 0,
      },
      {
        column: 'planning',
        title: 'Set campaign budget',
        description: 'Allocate resources across channels',
        order: 1,
      },
      {
        column: 'creation',
        title: 'Design social media graphics',
        description: 'Create visuals for Instagram, Facebook, Twitter',
        order: 0,
      },
      {
        column: 'creation',
        title: 'Write ad copy',
        description: 'Craft compelling headlines and CTAs',
        order: 1,
      },
      {
        column: 'review',
        title: 'A/B test landing pages',
        description: 'Test different versions for conversion optimization',
        order: 0,
      },
    ],
  },
};

// Helper: Get all templates as array
export function getAllTemplates() {
  return Object.values(projectTemplates);
}

// Helper: Get template by ID
export function getTemplate(templateId) {
  return projectTemplates[templateId] || projectTemplates.blank;
}
