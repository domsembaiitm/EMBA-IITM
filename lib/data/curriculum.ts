export type Course = {
    quarter: number;
    code: string;
    name: string;
    category: 'Functional Foundation' | 'Integrated Perspective' | 'Global Leadership';
    credits: number;
    type: 'Core' | 'Elective' | 'Project';
}

export const embaCurriculum: Course[] = [
    // Quarter 1 (24 Cr)
    { quarter: 1, code: 'MS9111', name: 'Accounting for Decision Making (Fin)', category: 'Functional Foundation', credits: 3, type: 'Core' },
    { quarter: 1, code: 'MS9611', name: 'Quantitative Modeling for Business Decisions (Ops)', category: 'Functional Foundation', credits: 3, type: 'Core' },
    { quarter: 1, code: 'MS9511', name: 'Applied Marketing Management (Mkt)', category: 'Functional Foundation', credits: 3, type: 'Core' },
    { quarter: 1, code: 'MS9411', name: 'Information Systems and Business Transformation (IS)', category: 'Functional Foundation', credits: 3, type: 'Core' },

    // Quarter 2 (24 Cr)
    { quarter: 2, code: 'MS9112', name: 'Business Finance (Fin)', category: 'Functional Foundation', credits: 3, type: 'Core' },
    { quarter: 2, code: 'MS9211', name: 'Micro Organizational Behavior (HR)', category: 'Functional Foundation', credits: 3, type: 'Core' },
    { quarter: 2, code: 'MS9612', name: 'Manufacturing and Service Operations (Ops)', category: 'Functional Foundation', credits: 3, type: 'Core' },
    { quarter: 2, code: 'MS9613', name: 'Managerial Economics (Ops)', category: 'Functional Foundation', credits: 3, type: 'Core' },

    // Quarter 3 (24 Cr)
    { quarter: 3, code: 'MS9231', name: 'Managing Human Resource and Employee Relations In Organizations (HR)', category: 'Functional Foundation', credits: 3, type: 'Core' },
    { quarter: 3, code: 'MS9531', name: 'Understanding Consumers for Marketing Decisions (Mkt)', category: 'Integrated Perspective', credits: 3, type: 'Core' },
    { quarter: 3, code: 'MS9512', name: 'Data Analysis and Market Research (Mkt)', category: 'Functional Foundation', credits: 3, type: 'Core' },
    { quarter: 3, code: 'MS9432', name: 'Organizational and Inter-Organizational Systems (IS)', category: 'Integrated Perspective', credits: 3, type: 'Elective' },
    // Note: Image shows 4 courses but credits sum might imply different weighting or count. Assuming standard 4 courses per quarter roughly.

    // Quarter 4 (24 Cr)
    { quarter: 4, code: 'MS9331', name: 'Strategic Planning and Execution (IM)', category: 'Integrated Perspective', credits: 3, type: 'Core' },
    { quarter: 4, code: 'MS9131', name: 'Investment Management (Fin)', category: 'Integrated Perspective', credits: 3, type: 'Core' },
    { quarter: 4, code: 'MS9532', name: 'Managing Marketing Communications (Mkt)', category: 'Integrated Perspective', credits: 3, type: 'Elective' },
    { quarter: 4, code: 'MS9433', name: 'Information Technology for Digital Economy (IS)', category: 'Integrated Perspective', credits: 3, type: 'Elective' },
    { quarter: 4, code: 'MS9635', name: 'Decision Making Under Uncertainty (Ops)', category: 'Integrated Perspective', credits: 3, type: 'Elective' },
    { quarter: 4, code: 'MS9731', name: 'Issues Learning Project', category: 'Integrated Perspective', credits: 6, type: 'Project' },

    // Quarter 5 (24 Cr)
    { quarter: 5, code: 'MS9431', name: 'Data Mining and Business Intelligence (IS)', category: 'Integrated Perspective', credits: 3, type: 'Core' },
    { quarter: 5, code: 'MS9352', name: 'Global Business Management (IM)', category: 'Global Leadership', credits: 3, type: 'Core' },
    { quarter: 5, code: 'MS----', name: 'Organizational Leadership and Transformation (HR)', category: 'Integrated Perspective', credits: 3, type: 'Core' },
    { quarter: 5, code: 'MS9534', name: 'Strategic Brand Management (Mkt)', category: 'Integrated Perspective', credits: 3, type: 'Elective' },
    { quarter: 5, code: 'MS9132', name: 'Valuation and Investment Banking (Fin)', category: 'Integrated Perspective', credits: 3, type: 'Elective' },
    // Strategic Initiative Project starts?

    // Quarter 6 (24 Cr)
    { quarter: 6, code: 'MS9351', name: 'Business Law (IM)', category: 'Global Leadership', credits: 3, type: 'Core' },
    { quarter: 6, code: 'MS9332', name: 'Business Models and Innovation (IM)', category: 'Integrated Perspective', credits: 3, type: 'Elective' },
    { quarter: 6, code: 'MS9133', name: 'Hedging and Risk Management (Fin)', category: 'Integrated Perspective', credits: 3, type: 'Elective' },
    { quarter: 6, code: 'MS9533', name: 'Managing Salesforce and Distribution Channels (Mkt)', category: 'Integrated Perspective', credits: 3, type: 'Elective' },
    { quarter: 6, code: 'MS9434', name: 'Analytics for Business and Society (IS)', category: 'Integrated Perspective', credits: 3, type: 'Elective' },
    { quarter: 6, code: 'PROJECT', name: 'Strategic Initiative Project', category: 'Integrated Perspective', credits: 6, type: 'Project' },

    // Quarter 7 (18 Cr)
    { quarter: 7, code: 'MS9451', name: 'Cyber Security and Applications (IS)', category: 'Global Leadership', credits: 3, type: 'Elective' },
    { quarter: 7, code: 'MS9353', name: 'Technology Strategy and Foresight (IM)', category: 'Global Leadership', credits: 3, type: 'Elective' },
    { quarter: 7, code: 'MS9252', name: 'Cultural Intelligence for Global Business (HR)', category: 'Global Leadership', credits: 3, type: 'Elective' },
    { quarter: 7, code: 'MS9151', name: 'Project Finance (Fin)', category: 'Global Leadership', credits: 3, type: 'Elective' },

    // Quarter 8 (18 Cr)
    { quarter: 8, code: 'MS9152', name: 'Corporate Governance (Fin)', category: 'Global Leadership', credits: 3, type: 'Elective' },
    { quarter: 8, code: 'MS9651', name: 'Global Risk Management (Ops)', category: 'Global Leadership', credits: 3, type: 'Elective' },
    { quarter: 8, code: 'MS9551', name: 'Strategic Marketing for competitive advantage (Mkt)', category: 'Global Leadership', credits: 3, type: 'Elective' },
    { quarter: 8, code: 'MS9354', name: 'Competitive Intelligence and Strategies (IM)', category: 'Global Leadership', credits: 3, type: 'Elective' },
    { quarter: 8, code: 'PROJECT', name: 'Industry Implementation Project', category: 'Global Leadership', credits: 6, type: 'Project' },
]
