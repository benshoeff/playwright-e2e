const path = require('path');
const fs = require('fs');

const DATA_DIR = path.resolve(__dirname, '..', 'dashboard', 'dashboard-data');
const LATEST_FILE = path.join(DATA_DIR, 'latest.json');

class DashboardReporter {
  constructor() {
    this.enabled = process.env.DASHBOARD_DATA === '1';
    this.project = process.env.DASHBOARD_PROJECT || '';
    this.tests = [];
    this.startedAt = Date.now();
  }

  onBegin(config, suite) {
    this.startedAt = Date.now();
    const projects = [...new Set(suite.allTests().map((t) => t.parent.project()?.name))];
    this.project = this.project || projects[0] || config.projects.map((p) => p.name).join(',');
  }

  onTestEnd(test, result) {
    const flaky = result.status === 'passed' && result.retry > 0;
    this.tests.push({
      title: test.title,
      project: test.parent.project()?.name || '',
      status: result.status,
      flaky,
      durationMs: result.duration,
      errorMessage: result.error?.message,
    });
  }

  onEnd(result) {
    if (!this.enabled) return;

    const counts = this.tests.reduce(
      (acc, t) => {
        if (t.status === 'passed') acc.passed += 1;
        else if (t.status === 'failed') acc.failed += 1;
        else if (t.status === 'timedOut') acc.timedOut += 1;
        else acc.skipped += 1;
        if (t.flaky) acc.flaky += 1;
        return acc;
      },
      { passed: 0, failed: 0, flaky: 0, skipped: 0, timedOut: 0 },
    );

    const run = {
      id: process.env.GITHUB_RUN_ID ? `github-${process.env.GITHUB_RUN_ID}` : `run-${this.startedAt}`,
      source: process.env.GITHUB_ACTIONS === 'true' ? 'github' : 'cli',
      status: result.status,
      project: this.project,
      startedAt: new Date(this.startedAt).toISOString(),
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - this.startedAt,
      total: this.tests.length,
      ...counts,
      tests: this.tests,
    };

    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(LATEST_FILE, JSON.stringify(run, null, 2));
    } catch (err) {
      console.error(`[dashboard-reporter] failed to write results: ${err}`);
    }
  }
}

module.exports = DashboardReporter;
