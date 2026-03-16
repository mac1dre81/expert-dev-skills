#!/usr/bin/env node

// lighthouse-audit.js - Run Lighthouse audits programmatically

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

const url = process.argv[2] || 'http://localhost:3000';

async function runLighthouse() {
  console.log(`🔍 Auditing ${url}...`);

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port
  };

  const runnerResult = await lighthouse(url, options);
  
  // Save report
  const reportHtml = runnerResult.report;
  fs.writeFileSync('lighthouse-report.html', reportHtml);
  
  // Log scores
  const scores = {
    performance: runnerResult.lhr.categories.performance.score * 100,
    accessibility: runnerResult.lhr.categories.accessibility.score * 100,
    'best-practices': runnerResult.lhr.categories['best-practices'].score * 100,
    seo: runnerResult.lhr.categories.seo.score * 100
  };
  
  console.log('\n📊 Lighthouse Scores:');
  Object.entries(scores).forEach(([category, score]) => {
    const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
    console.log(`${emoji} ${category}: ${score}`);
  });
  
  await chrome.kill();
  
  // Alert if performance is below threshold
  if (scores.performance < 90) {
    console.log('\n⚠️  Performance score below 90 - needs optimization!');
  }
}

runLighthouse().catch(console.error);
