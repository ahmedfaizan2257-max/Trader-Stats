const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'src/components/landing/LandingPage.tsx',
  'src/components/landing/DashboardMock.tsx',
  'src/components/landing/BlogPage.tsx',
  'src/components/landing/LoginPage.tsx',
  'src/components/landing/LeaderboardPage.tsx',
  'src/components/landing/PlatformsPage.tsx'
];

for (const file of filesToProcess) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/bg-\[#5b32f6\]([^"]*)text-slate-900 dark:text-white/g, 'bg-[#5b32f6]$1text-white');
    content = content.replace(/text-\[#5b32f6\]([^"]*)text-slate-900 dark:text-white/g, 'text-[#5b32f6]$1text-[#5b32f6]');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Processed:', file);
  }
}

