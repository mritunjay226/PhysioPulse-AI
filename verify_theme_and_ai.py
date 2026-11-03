#!/usr/bin/env python3
"""Convenience forwarder for scripts/tests/verify_theme_and_ai.py"""
import os
import runpy

if __name__ == "__main__":
    script_path = os.path.join(os.path.dirname(__file__), "scripts", "tests", "verify_theme_and_ai.py")
    runpy.run_path(script_path, run_name="__main__")
