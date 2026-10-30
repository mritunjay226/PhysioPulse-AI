import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import fs from 'fs';
import { getRootDir, getPythonPath, getReportPath } from '@/lib/paths';

export const maxDuration = 300; // Allow sufficient time for all exercises

export async function POST(req: NextRequest) {
  const rootDir = getRootDir();
  const pythonPath = getPythonPath(rootDir);
  const reportPath = getReportPath();
  const spawnTime = Date.now();

  console.log(`🚀 Starting fresh PhysioPulse Vision Session:`);
  console.log(`   Working Dir: ${rootDir}`);
  console.log(`   Python Exec: ${pythonPath}`);
  console.log(`   Spawn Timestamp: ${spawnTime}`);

  // 1. Gracefully tell any previous stream on port 8000 to quit and free the camera
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 300);
    await fetch('http://127.0.0.1:8000/quit', { signal: controller.signal });
    clearTimeout(timeout);
    await new Promise((r) => setTimeout(r, 400));
  } catch {
    // Port 8000 was idle, which is expected
  }

  // 2. Safe file reset: Overwrite with pending state instead of just unlink (avoids Windows EPERM/EBUSY race conditions)
  try {
    if (fs.existsSync(reportPath)) {
      fs.writeFileSync(
        reportPath,
        JSON.stringify({ pending: true, spawn_timestamp: spawnTime }),
        'utf-8'
      );
      console.log('🔄 Overwrote clinical_session_report.json with pending session marker.');
    }
  } catch (err) {
    console.warn('⚠️ Could not reset old report file:', err);
  }

  return new Promise<NextResponse>((resolve) => {
    let settled = false;

    const child = spawn(pythonPath, ['physiopulse.py', '--embedded'], {
      cwd: rootDir,
      env: {
        ...process.env,
        PYTHONUNBUFFERED: '1'
      },
      windowsHide: false
    });

    child.stdout.on('data', (data) => {
      console.log(`[physiopulse stdout]: ${data.toString()}`);
    });

    child.stderr.on('data', (data) => {
      console.error(`[physiopulse stderr]: ${data.toString()}`);
    });

    // Check periodically ONLY for freshly written reports (mtime must be AFTER spawnTime)
    const pollInterval = setInterval(() => {
      if (settled) return;

      if (fs.existsSync(reportPath)) {
        try {
          const stats = fs.statSync(reportPath);
          // Only accept files modified AFTER this process was spawned
          if (stats.mtimeMs >= spawnTime - 100) {
            const raw = fs.readFileSync(reportPath, 'utf-8');
            const report = JSON.parse(raw);
            if (report && !report.pending && Array.isArray(report.exercises_performed) && report.exercises_performed.length > 0) {
              settled = true;
              clearInterval(pollInterval);
              console.log('✅ Fresh completed session report detected!');
              return resolve(
                NextResponse.json({
                  success: true,
                  message: 'Session completed and report generated',
                  report
                })
              );
            }
          }
        } catch {
          // File may be locked mid-write, wait for next tick
        }
      }
    }, 1000);

    child.on('close', (code) => {
      if (settled) return;
      clearInterval(pollInterval);
      settled = true;

      setTimeout(() => {
        if (fs.existsSync(reportPath)) {
          try {
            const stats = fs.statSync(reportPath);
            const raw = fs.readFileSync(reportPath, 'utf-8');
            const report = JSON.parse(raw);
            if (!report.pending && Array.isArray(report.exercises_performed)) {
              return resolve(
                NextResponse.json({
                  success: true,
                  exitCode: code,
                  report
                })
              );
            }
          } catch (err: any) {
            console.error('Error reading final report:', err);
          }
        }

        return resolve(
          NextResponse.json(
            {
              success: false,
              exitCode: code,
              error: `Session closed with code ${code} before report was generated.`
            },
            { status: 500 }
          )
        );
      }, 500);
    });

    child.on('error', (err) => {
      if (settled) return;
      clearInterval(pollInterval);
      settled = true;
      console.error('Child process launch error:', err);
      return resolve(
        NextResponse.json(
          {
            success: false,
            error: `Failed to launch vision engine: ${err.message}. Verify Python and virtualenv.`
          },
          { status: 500 }
        )
      );
    });
  });
}
