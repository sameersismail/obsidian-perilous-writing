# Perilous Writing

An [Obsidian](https://obsidian.md) plugin which *demands* writing output, at the threat of bludgeoning your in-progress work. Emulates [Manu Ebert's](https://github.com/maebert) excellent [The Most Dangerous Writing App](https://github.com/maebert/themostdangerouswritingapp).


# Usage

> **Warning:** If a session is not completed successfully then your in-session work will be **irrevocably deleted**. Caveat emptor.

1. Install the plugin. See below.
2. Open the command palette and choose either a short session (default of five minutes), a long session (default of ten minutes), or a custom-length session. (The respective default durations can be changed in the settings tab.)

    <img width="656" alt="image" src="https://user-images.githubusercontent.com/38896593/225518688-f0fbd6be-8662-4522-a1d1-e106ff67483e.png">


3. A light gray bar will appear at the top of the editor. It represents the session's progress. The session will begin after the next keypress.

    <img width="656" alt="image" src="https://user-images.githubusercontent.com/38896593/225518790-aac26285-8583-4008-b003-535587f468df.png">

4. Begin writing. If you stop writing for five seconds your in-session additions will be **deleted**. You'll be warned after two seconds of inactivity.

    <img width="656" alt="image" src="https://user-images.githubusercontent.com/38896593/225519562-ac5493af-337f-4a50-b7d9-4e5cd71da019.png">

    <img width="656" alt="image" src="https://user-images.githubusercontent.com/38896593/225519715-6577f3ef-d437-4832-a8ee-e54cef18f9bb.png">

    <img width="656" alt="image" src="https://user-images.githubusercontent.com/38896593/225519763-a2881d95-0c95-4446-9ead-fc74e99ac9f3.png">

5. Only new characters reset the timer—backspace does *not*. Neither do normal-mode operations under Vim emulation. On completion of a successful session, progress is preserved.

    <img width="656" alt="image" src="https://user-images.githubusercontent.com/38896593/225519961-fc73c74b-23f3-4801-a4b8-a87092a18e34.png">

# Installation
## Community Plugins

Search for [“Perilous Writing”](https://obsidian.md/plugins?search=perilous%20writing) in the community plugins tab.

## Manual

Download the latest release, and copy the `main.js`, `styles.css`, and `manifest.json` files into a new plugin directory, like (4) and (5) below.

## From source

1. Clone the repository.
2. Install the dependencies. Through `yarn` or `npm install` in the directory root.
3. Build the plugin with `yarn build` or `npm run build`. This will produce a `main.js` file.
4. Create a directory for the plugin in your vault's directory.

    ```sh
    mkdir -p $VAULT_SOURCE/.obsidian/plugins/perilous-writing
    ```

5. Copy the `main.js`, `styles.css`, and `manifest.json` files into that directory.

    ```sh
    cp main.js styles.css manifest.json $VAULT_SOURCE/.obsidian/perilous-writing
    ```
6. Enable the plugin in Obsidian's settings tab.

# Acknowledgements

Inspired by [Manu Ebert's](https://github.com/maebert) [The Most Dangerous Writing App](https://github.com/maebert/themostdangerouswritingapp).


