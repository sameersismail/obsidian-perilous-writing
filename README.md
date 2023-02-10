# Perilous Writing

An [Obsidian](https://obsidian.md) plugin which *demands* writing output, at the threat of bludgeoning your in-progress work. Emulates [Manu Ebert's](https://github.com/maebert) excellent [The Most Dangerous Writing App](https://github.com/maebert/themostdangerouswritingapp).


# Usage

> **Warning:** If a session is not completed successfully then your in-session work will be **irrevocably deleted**. Caveat emptor.

1. Install the plugin. See below.
2. Open the command palette and choose either a short session (default of five minutes) or a long session (default of ten minutes). (The respective durations can be changed in the settings tab.)

    <img width="766" alt="image" src="https://user-images.githubusercontent.com/38896593/217981517-36095944-53b3-4159-b3bb-fd98d1e35fd4.png">

3. A light gray bar will appear at the top of the editor. It represents the session's progress. The session will begin after the next keypress.

    <img width="774" alt="image" src="https://user-images.githubusercontent.com/38896593/217981773-92d3b6ae-a31a-4f2d-89f1-e975b2abe570.png">

4. Begin writing. If you stop writing for five seconds your in-session additions will be **deleted**. You'll be warned after two seconds of inactivity.

    <img width="774" alt="Screenshot 2023-02-10 at 12 17 04 pm" src="https://user-images.githubusercontent.com/38896593/217983533-238ea697-2b8d-4ade-8ff6-1fab3b66080d.png">

    <img width="774" alt="image" src="https://user-images.githubusercontent.com/38896593/217984424-80af97e6-7266-4905-a956-3db5caac2883.png">

    <img width="774" alt="image" src="https://user-images.githubusercontent.com/38896593/217983938-b4cddfed-2c5a-4a00-b142-bb4800e959ae.png">

5. Only new characters reset the timer—backspace does *not*. Neither do normal-mode operations under Vim emulation.

# Installation
## Community Plugins

It's currently pending availability in the Community Plugins directory.

## Manual

Download the latest release, and copy the `main.js` and `manifest.json` files into a new plugin directory, like (4) and (5) below.

## From source

1. Clone the repository.
2. Install the dependencies. Through `yarn` or `npm install` in the directory root.
3. Build the plugin with `yarn build` or `npm run build`. This will produce a `main.js` file.
4. Create a directory for the plugin in your vault's directory.

    ```sh
    mkdir -p $VAULT_SOURCE/.obsidian/plugins/obsidian-perilous-writing
    ```

5. Copy the `main.js` and `manifest.json` files into that directory.

    ```sh
    cp main.js manifest.json $VAULT_SOURCE/.obsidian/obsidian-perilous-writing
    ```
6. Enable the plugin in Obsidian's settings tab.

# Acknowledgements

Inspired by [Manu Ebert's](https://github.com/maebert) [The Most Dangerous Writing App](https://github.com/maebert/themostdangerouswritingapp).


