import { NextRequest, NextResponse } from 'next/server';
import { spawn, ChildProcess } from 'child_process';
import fs from 'fs';
import { getRootDir, getPythonPath, getReportPath } from '@/lib/paths';

export const maxDuration = 300; // Allow sufficient time for exercises

// Global singleton to track active child process across requests
let activeChildProcess: ChildProcess | null = null;
let activeSessionStartTime: number = 0;

export async function POST(req: NextRequest) {
  const rootDir = getRootDir();
  const pythonPath = getPythonPath(rootDir);
  const reportPath = getReportPath();

  console.log(`🚀 Checking PhysioPulse Vision Session state:`);
  console.log(`   Working Dir: ${rootDir}`);
  console.log(`   Python Exec: ${pythonPath}`);

  // 1. Check if an existing vision engine service is already actively running
  let isEngineAlive = false;
  const appBaseUrl = (process.env.APP_URL || 'http://127.0.0.1:8000').replace(/\/?$/, '/');
  try {
    const probe = await fetch(new URL('status', appBaseUrl), {
      cache: 'no-store',
      signal: AbortSignal.timeout(600)
    });
    if (probe.ok) {
      isEngineAlive = true;
      console.log('📡 Vision engine service is already active and healthy. Reusing active engine.');
    }
  } catch {
    isEngineAlive = false;
  }

  // 2. If vision engine is NOT active and an old process handle is dead, reset file state
  const sessionStartTime = Date.now();
  activeSessionStartTime = sessionStartTime;

  if (!isEngineAlive) {
    try {
      if (fs.existsSync(reportPath)) {
        fs.writeFileSync(
          reportPath,
          JSON.stringify({ pending: true, start_time: sessionStartTime }),
          'utf-8'
        );
      }
    } catch (err) {
      console.warn('⚠️ Could not reset report file marker:', err);
    }

    // Spawn new Python engine locally only if not bound as a remote/service deployment
    if (!process.env.APP_URL) {
      console.log(`🎬 Spawning new local Python vision engine process...`);
      const child = spawn(pythonPath, ['physiopulse.py', '--embedded'], {
        cwd: rootDir,
        env: {
          ...process.env,
          PYTHONUNBUFFERED: '1'
        },
        windowsHide: false
      });

      activeChildProcess = child;

      child.stdout.on('data', (data) => {
        console.log(`[physiopulse]: ${data.toString().trim()}`);
      });

      child.stderr.on('data', (data) => {
        console.error(`[physiopulse err]: ${data.toString().trim()}`);
      });

      child.on('close', (code) => {
        console.log(`[physiopulse] Process closed with exit code ${code}`);
        activeChildProcess = null;
      });
    }
  }

  // 3. Wait for the session to legitimately complete (either by user clicking Save & Finish or completing all reps)
  return new Promise<NextResponse>((resolve) => {
    let settled = false;

    // Check periodically for fresh report generation
    const checkInterval = setInterval(() => {
      if (settled) return;

      if (fs.existsSync(reportPath)) {
        try {
          const stats = fs.statSync(reportPath);
          // Only accept reports written AFTER this session started
          if (stats.mtimeMs >= sessionStartTime - 200) {
            const raw = fs.readFileSync(reportPath, 'utf-8');
            const report = JSON.parse(raw);
            if (
              report &&
              !report.pending &&
              Array.isArray(report.exercises_performed) &&
              report.exercises_performed.length > 0
            ) {
              settled = true;
              clearInterval(checkInterval);
              console.log('✅ Legitimately completed session report verified!');
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
          // File may be locked mid-write, retry next tick
        }
      }
    }, 1500);

    // Timeout after max duration if nothing happened
    setTimeout(() => {
      if (settled) return;
      clearInterval(checkInterval);
      settled = true;
      return resolve(
        NextResponse.json({
          success: false,
          error: 'Vision session timed out without report output.'
        })
      );
    }, 290000);
  });
}
