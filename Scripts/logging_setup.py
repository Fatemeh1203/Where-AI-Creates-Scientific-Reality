"""Shared logging configuration.

The pipeline is designed to *never crash the whole run* on a single failure:
individual stages catch, log, and continue. This module wires a rotating-ish
daily log file plus console output.
"""
from __future__ import annotations

import logging
from datetime import date

from config import LOGS_DIR


def get_logger(name: str = "fiber-monitor") -> logging.Logger:
    logger = logging.getLogger(name)
    if logger.handlers:  # already configured
        return logger

    logger.setLevel(logging.INFO)
    fmt = logging.Formatter(
        "%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    file_handler = logging.FileHandler(
        LOGS_DIR / f"run-{date.today().isoformat()}.log", encoding="utf-8"
    )
    file_handler.setFormatter(fmt)

    console = logging.StreamHandler()
    console.setFormatter(fmt)

    logger.addHandler(file_handler)
    logger.addHandler(console)
    return logger
