import path from 'path';
import fs from 'fs';
import os from 'os';

export function getRootDir(): string {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'physiopulse.py'))) {
    return cwd;
  }
  const parent = path.resolve(cwd, '..');
  if (fs.existsSync(path.join(parent, 'physiopulse.py'))) {
    return parent;
  }
  return cwd;
}

export function getPythonPath(rootDir: string): string {
  const venvPythonWin = path.join(rootDir, 'venv', 'Scripts', 'python.exe');
  if (fs.existsSync(venvPythonWin)) {
    return venvPythonWin;
  }
  const venvPythonUnix = path.join(rootDir, 'venv', 'bin', 'python');
  if (fs.existsSync(venvPythonUnix)) {
    return venvPythonUnix;
  }
  return 'python';
}

export function getPrescriptionPath(): string {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), 'prescribed_session.json');
  }
  return path.join(getRootDir(), 'prescribed_session.json');
}

export function getReportPath(): string {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), 'clinical_session_report.json');
  }
  return path.join(getRootDir(), 'clinical_session_report.json');
}
