export type TestCategory =
  | 'UNIT_TESTS'
  | 'API_TESTS'
  | 'INTEGRATION_TESTS'
  | 'END_TO_END_TESTS'
  | 'PLAYWRIGHT_TESTS'
  | 'MANUAL_TESTS'
  | 'EDGE_CASES'
  | 'PERMISSION_CASES'
  | 'FAILURE_STATES'
  | 'REGRESSION_AREAS';

export type TestPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type TestCaseStatus =
  | 'PROPOSED'
  | 'APPROVED'
  | 'REJECTED'
  | 'INCOMPLETE'
  | 'POSSIBLE_DUPLICATE';

export interface TestCase {
  id?: number;
  testId: string;
  title: string;
  category: TestCategory;
  preconditions?: string;
  steps?: string;
  expectedResult?: string;
  priority: TestPriority;
  reason?: string;
  status: TestCaseStatus;
  approved: boolean;
  mappedCriteriaIndices?: number[];
}

export interface AcceptanceCriteria {
  id?: number;
  criteriaIndex: number;
  description: string;
  covered?: boolean;
}

export interface UncoveredCriteria {
  criteriaIndex: number;
  description: string;
}

export interface DuplicatePair {
  testId1: string;
  testId2: string;
  title1: string;
  title2: string;
  similarityScore: number;
}

export interface QaPlan {
  id?: number;
  developerName?: string;
  title?: string;
  description?: string;
  requirement: string;
  implementationSummary: string;
  userFlows?: string[];
  retrievedGuidance?: string;
  assumptions?: string[];
  acceptanceCriteria: AcceptanceCriteria[];
  testCases: TestCase[];
  coveragePercentage?: number;
  uncoveredCriteria?: UncoveredCriteria[];
  duplicateTestCases?: DuplicatePair[];
  incompleteTestCases?: TestCase[];
  currentVersion?: number;
  createdDate?: string;
  updatedDate?: string;
  disclaimer?: string;
}

export interface VersionHistory {
  id: number;
  versionNumber: number;
  createdDate: string;
  updatedDate?: string;
}

export interface GenerateRequest {
  title: string;
  description?: string;
  requirement: string;
  acceptanceCriteria: string[];
  implementationSummary: string;
}

export const CATEGORY_LABELS: Record<TestCategory, string> = {
  UNIT_TESTS: 'Unit Tests',
  API_TESTS: 'API Tests',
  INTEGRATION_TESTS: 'Integration Tests',
  END_TO_END_TESTS: 'End-to-End Tests',
  PLAYWRIGHT_TESTS: 'Playwright Tests',
  MANUAL_TESTS: 'Manual Tests',
  EDGE_CASES: 'Edge Cases',
  PERMISSION_CASES: 'Permission Cases',
  FAILURE_STATES: 'Failure States',
  REGRESSION_AREAS: 'Regression Areas',
};

export const PRIORITY_COLORS: Record<TestPriority, 'error' | 'warning' | 'info'> = {
  HIGH: 'error',
  MEDIUM: 'warning',
  LOW: 'info',
};

export const STATUS_COLORS: Record<TestCaseStatus, 'default' | 'success' | 'error' | 'warning' | 'info'> = {
  PROPOSED: 'default',
  APPROVED: 'success',
  REJECTED: 'error',
  INCOMPLETE: 'warning',
  POSSIBLE_DUPLICATE: 'info',
};
