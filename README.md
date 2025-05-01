# MCP Notify Server

[![Install with NPX in VS Code](https://img.shields.io/badge/VS_Code-NPM-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=notify&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22mcp-notify%22%5D%7D) [![Install with NPX in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-NPM-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=notify&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22mcp-notify%22%5D%7D&quality=insiders) [![smithery badge](https://smithery.ai/badge/@burkeholland/mcp-notify)](https://smithery.ai/server/@burkeholland/mcp-notify)

A Model Context Protocol (MCP) server that provides system notification capabilities using node-notifier.

<a href="https://glama.ai/mcp/servers/@burkeholland/mcp-notify">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@burkeholland/mcp-notify/badge" alt="Node-Notifier Server MCP server" />
</a>

## Tools

### show-notification
Shows a system notification using the default notifier for the current platform.

Common parameters for all notification tools:
- `title`: Title of the notification
- `message`: Message content of the notification
- `sound` (optional): Play a sound with the notification (default: false)
- `wait` (optional): Wait for user action before removing notification (default: false)
- `icon` (optional): Path to icon file (.ico, .png, .jpg, or platform specific)
- `timeout` (optional): Time in seconds before notification expires (Linux/Windows)

### show-notification-macos
Shows a notification using macOS Notification Center. 
Additional parameters:
- `actions`: Array of action button labels
- `closeLabel`: Label for closing notification
- `dropdownLabel`: Label for dropdown
- `reply`: Enable reply functionality

### show-notification-linux
Shows a notification using Linux notify-send.
Additional parameters:
- `urgency`: Notification urgency level ("low", "normal", "critical")
- `category`: Category of notification
- `hint`: Hint for notification display
- `app-name`: Application name

### show-notification-windows-toast
Shows a notification using Windows Toast notifications (Windows 8+).
Additional parameters:
- `appID`: Application identifier
- `shortcutPath`: Path to shortcut file for notification
- `install`: Path to installer when notification is clicked

### show-notification-windows-balloon
Shows a notification using Windows Balloon notifications (Windows 7 and earlier).
Additional parameters:
- `type`: Notification type ("info", "warn", "error")

### show-notification-growl
Shows a notification using Growl.
Additional parameters:
- `name`: Application name for Growl
- `host`: Growl server host
- `port`: Growl server port
- `sticky`: Keep notification visible
- `label`: Label for notification
- `priority`: Notification priority (-2 to 2)
- `sender`: Sender of notification

## Development

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Start the server:
```bash
npm start
```

## Usage with VS Code

For quick installation, use one of the one-click install buttons at the top of this README.

For manual installation, add the following JSON block to your User Settings (JSON) file in VS Code. You can do this by pressing `Ctrl + Shift + P` and typing `Preferences: Open User Settings (JSON)`.

Optionally, you can add it to a file called `.vscode/mcp.json` in your workspace. This will allow you to share the configuration with others.

> Note that the `mcp` key is not needed in the `.vscode/mcp.json` file.

```json
{
  "mcp": {
    "servers": {
      "notify": {
        "command": "npx",
        "args": ["-y", "mcp-notify"]
      }
    }
  }
}
```

### Installing via Smithery

To install Notify Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@burkeholland/mcp-notify):

```bash
npx -y @smithery/cli install @burkeholland/mcp-notify --client claude
```

### Installing Manually
Add the MCP Notify server entry to your Claude settings to use it automatically.
