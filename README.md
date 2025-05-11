# Piknik for Visual Studio Code

Share clipboard content across your network with ease!

This extension allows you to copy/paste text between different machines running Visual Studio Code with the Piknik extension installed. It leverages the [Piknik](https://github.com/jedisct1/piknik) tool to securely share clipboard content over the network.

![Piknik Demo](https://raw.githubusercontent.com/jedisct1/vscode-piknik/master/images/demo.gif)

## Features

- Copy selected text to a shared network clipboard
- Paste from the shared network clipboard
- Easy-to-use keybindings
- Secure transmission of clipboard data

## Requirements

[Piknik](https://github.com/jedisct1/piknik) must be installed and configured on your system.
The `piknik` executable should be in your `$PATH`.

### Installing Piknik

#### macOS
```sh
brew install piknik
```

#### Linux/BSD
```sh
go install github.com/jedisct1/piknik@latest
```

For more installation and configuration options, visit the [Piknik GitHub repository](https://github.com/jedisct1/piknik).

## Extension Installation

Install the `Piknik` extension directly from the Visual Studio Code Marketplace.

1. Open VS Code
2. Press `Ctrl+P` (or `Cmd+P` on macOS)
3. Type `ext install jedisct1.piknik`
4. Press Enter

Alternatively, search for "Piknik" in the Extensions view.

## Usage

### Keyboard Shortcuts

- Copy to Piknik clipboard: `Ctrl+Alt+Shift+C`
- Paste from Piknik clipboard: `Ctrl+Alt+Shift+V`

### Commands

You can also execute the commands via the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

- `Piknik: Copy to shared clipboard` - Copy selected text to Piknik
- `Piknik: Paste from shared clipboard` - Paste from Piknik

## Configuration

This extension provides the following settings:

- `piknik.piknikBinPath`: Path to the piknik executable (defaults to "piknik")
- `piknik.piknikConfigPath`: Path to the piknik.toml configuration file (empty defaults to ~/.piknik.toml)

You can modify these settings in your `settings.json` file:

```json
{
    "piknik.piknikBinPath": "/usr/local/bin/piknik",
    "piknik.piknikConfigPath": "/path/to/custom/piknik.toml"
}
```

## Troubleshooting

If you encounter issues with the extension:

1. Verify that Piknik is installed and available in your PATH
2. Check that your Piknik configuration is correct
3. Ensure your network allows the required connections

## License

This extension is released under the [MIT License](LICENSE.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
