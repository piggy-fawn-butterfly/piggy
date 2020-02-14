# coding=utf8

######################################################
# independencies:
# - Python 3.8.0
# commands:
# - create : create a new piggy project
#
######################################################

import argparse
import os


def excuteCommand():
    _parser = argparse.ArgumentParser()
    _parser.add_argument(
        dest="create", help='''python Piggy.py create --dir=path/to/locate --pkg=package_name''')
    _parser.add_argument("--pkg", dest="pkg", action="store", required=True)
    _parser.add_argument("--dir", dest="dir", action='store', required=True)

    args = _parser.parse_args()

    ok = os.path.isdir(args.dir)
    if ok is False:
        print("[!] You must provide an valid directory path")
        return

    project_path = os.path.abspath(os.path.join(args.dir, args.pkg))
    print("[·] Ready to create piggy project at '%s'" %
          (project_path))


if __name__ == "__main__":
    excuteCommand()
