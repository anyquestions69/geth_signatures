#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
""" import web3
from pathlib import Path """


def main():
    """Run administrative tasks."""
    """ dir = Path(__file__).resolve().parent.parent
    print(dir)
    w3 = web3.Web3.IPCProvider(dir / 'data/geth.ipc')
    web3.geth.admin.start_http(host='localhost', port=8545, cors='', apis='eth,net,web3') """
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
