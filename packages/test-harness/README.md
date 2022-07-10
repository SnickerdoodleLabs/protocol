# Snickerdoodle Core Test Harness

This package provides a CLI interface for running and testing Snickerdoodle Core. After running it with `yarn start`, it will start a persistent copy of SDC and give you a menu of options for interacting with the core. The core operates asyncronously, so you may recieve notification of events recieved.

This harness amounts to a bare-bones form factor, and thus has to follow the processes of any form factor when interacting with the core. Thus, it is an excellent proving ground for patterns in SDC.

## Usage
As currently configured, this package is meant to run locally, and not INSIDE a docker environment. That will be the next upgrade. It is an interactive CLI app, and can be exited via the in-app menu or via ctrl-c. Use `yarn start` to start the app, which will compile the code and run it with ts-node.