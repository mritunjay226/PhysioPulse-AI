import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import fs from 'fs';
import { getRootDir, getPythonPath, getReportPath } from '@/lib/paths';

export const maxDuration = 300; // Allow sufficient time for all exercises

export async function POST(req: NextRequest) {
  const rootDir = getRootDir();
  const pythonPath = getPythonPath(rootDir);
  const reportPath = getReportPath();

  console.log(`🚀 Starting fresh PhysioPulse Vision Session:`);
  console.log(`   Working Dir: ${rootDir}`);
  console.log(`   Python Exec: ${pythonPath}`);

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

  // 2. Clear out any previous report so we NEVER read stale session data
  if (fs.existsSync(reportPath)) {
    try {
      fs.unlinkSync(reportPath);
      console.log('🗑️ Removed old clinical_session_report.json to ensure fresh session telemetry.');
    } catch (err) {
      console.warn('⚠️ Could not remove old report:', err);
    }
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

    // Check periodically for fresh report generation
    const pollInterval = setInterval(() => {
      if (settled) return;

      if (fs.existsSync(reportPath)) {
        try {
          const raw = fs.readFileSync(reportPath, 'utf-8');
          const report = JSON.parse(raw);
          if (report && report.exercises_performed) {
            settled = true;
            clearInterval(pollInterval);
            console.log('✅ Fresh session report detected on completion!');
            return resolve(
              NextResponse.json({
                success: true,
                message: 'Session completed and report generated',
                report
              })
            );
          }
        } catch {
          // File may be locked mid-write, wait for next tick
        }
      }
    }, 500);

    child.on('close', (code) => {
      if (settled) return;
      clearInterval(pollInterval);
      settled = true;

      // Small delay in case file was written right as process terminated
      setTimeout(() => {
        if (fs.existsSync(reportPath)) {
          try {
            const raw = fs.readFileSync(reportPath, 'utf-8');
            const report = JSON.parse(raw);
            return resolve(
              NextResponse.json({
                success: true,
                exitCode: code,
                report
              })
            );
          } catch (err: any) {
            return resolve(
              NextResponse.json(
                {
                  success: false,
                  error: `Session closed (${code}) but report could not be parsed: ${err.message}`
                },
                { status: 500 }
              )
            );
          }
        }

        return resolve(
          NextResponse.json(
            {
              success: false,
              error: `Session closed with code ${code} before report was generated.`
            },
            { status: 500 }
          )
        );
      }, 400);
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
