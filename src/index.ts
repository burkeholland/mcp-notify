import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import notifier from "node-notifier";
import path from "path";

const server = new McpServer({
  name: "node-notifier",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

const NotificationCenter = notifier.NotificationCenter;
const NotifySend = notifier.NotifySend;
const WindowsToaster = notifier.WindowsToaster;
const Growl = notifier.Growl;
const WindowsBalloon = notifier.WindowsBalloon;

const __dirname = new URL('.', import.meta.url).pathname;

const commonNotificationSchema = {
  title: z.string().describe("Title of the notification"),
  message: z.string().describe("Message content of the notification"),
  sound: z.boolean().optional().describe("Play a sound with the notification (default: false)"),
  wait: z.boolean().optional().describe("Wait for user action before removing notification (default: false)"),
  icon: z.string().optional().describe("Path to icon file (.ico, .png, .jpg, or platform specific)"),
  timeout: z.number().optional().describe("Time in seconds before notification expires (Linux/Windows)"),
  urgency: z.enum(["low", "normal", "critical"]).optional().describe("Notification urgency level (Linux only)"),
  appID: z.string().optional().describe("Application identifier (Windows only)"),
  actions: z.array(z.string()).optional().describe("Action buttons to add to notification (macOS only)"),
  closeLabel: z.string().optional().describe("Label for closing notification (macOS only)"),
  dropdownLabel: z.string().optional().describe("Label for dropdown (macOS only)"),
  reply: z.boolean().optional().describe("Enable reply functionality (macOS only)"),
  type: z.enum(["info", "warn", "error"]).optional().describe("Notification type (Windows Balloon only)"),
  install: z.string().optional().describe("Path to installer when notification is clicked (Windows Toaster only)"),
  sender: z.string().optional().describe("Sender of notification (Growl only)")
};

server.tool(
  "show-notification",
  "Show a system notification using the default notifier for the current platform",
  commonNotificationSchema,
  async (params) => {
    if (!params.icon || params.icon === "") {
      params.icon = path.join(__dirname, "assets/bell.png");
    }
    if (!params.title || params.title === "") {
      params.title = "Notification";
    }
    if (!params.appID || params.appID === "") {
      params.appID = "MCP Notify";
    }

    return new Promise((resolve) => {
      notifier.notify(params, (err, response, metadata) => {
        if (err) {
          resolve({
            content: [{ type: "text" as const, text: `Error showing notification: ${err.message}` }],
          });
        } else {
          resolve({
            content: [
              { type: "text" as const, text: "Notification shown successfully" },
              ...(metadata ? [{ type: "text" as const, text: `Metadata: ${JSON.stringify(metadata)}` }] : []),
              ...(response ? [{ type: "text" as const, text: `Response: ${JSON.stringify(response)}` }] : [])
            ],
          });
        }
      });
    });
  }
);

server.tool(
  "show-notification-macos",
  "Show a notification using macOS Notification Center",
  commonNotificationSchema,
  async (params) => {
    return new Promise((resolve) => {
      const notifier = new NotificationCenter();
      notifier.notify(params, (err, response, metadata) => {
        if (err) {
          resolve({
            content: [{ type: "text" as const, text: `Error showing notification: ${err.message}` }],
          });
        } else {
          resolve({
            content: [
              { type: "text" as const, text: "macOS notification shown successfully" },
              ...(metadata ? [{ type: "text" as const, text: `Metadata: ${JSON.stringify(metadata)}` }] : []),
              ...(response ? [{ type: "text" as const, text: `Response: ${JSON.stringify(response)}` }] : [])
            ],
          });
        }
      });
    });
  }
);

server.tool(
  "show-notification-linux",
  "Show a notification using Linux notify-send",
  {
    ...commonNotificationSchema,
    category: z.string().optional().describe("Category of notification"),
    hint: z.string().optional().describe("Hint for notification display"),
    "app-name": z.string().optional().describe("Application name")
  },
  async (params) => {
    return new Promise((resolve) => {
      const notifier = new NotifySend();
      notifier.notify(params, (err) => {
        if (err) {
          resolve({
            content: [{ type: "text" as const, text: `Error showing notification: ${err.message}` }],
          });
        } else {
          resolve({
            content: [{ type: "text" as const, text: "Linux notification shown successfully" }],
          });
        }
      });
    });
  }
);

server.tool(
  "show-notification-windows-toast",
  "Show a notification using Windows Toast notifications (Windows 8+)",
  {
    ...commonNotificationSchema,
    shortcutPath: z.string().optional().describe("Path to shortcut file for notification"),
    appID: z.string().optional().describe("Application identifier"),
    install: z.string().optional().describe("Path to installer when notification is clicked")
  },
  async (params) => {
    return new Promise((resolve) => {
      const notifier = new WindowsToaster();
      notifier.notify(params, (err) => {
        if (err) {
          resolve({
            content: [{ type: "text" as const, text: `Error showing notification: ${err.message}` }],
          });
        } else {
          resolve({
            content: [{ type: "text" as const, text: "Windows Toast notification shown successfully" }],
          });
        }
      });
    });
  }
);

server.tool(
  "show-notification-windows-balloon",
  "Show a notification using Windows Balloon notifications (Windows 7 and earlier)",
  {
    ...commonNotificationSchema,
    type: z.enum(["info", "warn", "error"]).optional().describe("Notification type")
  },
  async (params) => {
    return new Promise((resolve) => {
      const notifier = new WindowsBalloon();
      notifier.notify(params, (err) => {
        if (err) {
          resolve({
            content: [{ type: "text" as const, text: `Error showing notification: ${err.message}` }],
          });
        } else {
          resolve({
            content: [{ type: "text" as const, text: "Windows Balloon notification shown successfully" }],
          });
        }
      });
    });
  }
);

server.tool(
  "show-notification-growl",
  "Show a notification using Growl",
  {
    ...commonNotificationSchema,
    name: z.string().optional().describe("Application name for Growl"),
    host: z.string().optional().describe("Growl server host"),
    port: z.number().optional().describe("Growl server port"),
    sticky: z.boolean().optional().describe("Keep notification visible"),
    label: z.string().optional().describe("Label for notification"),
    priority: z.number().optional().describe("Notification priority (-2 to 2)")
  },
  async (params) => {
    return new Promise((resolve) => {
      const notifier = new Growl();
      notifier.notify(params, (err) => {
        if (err) {
          resolve({
            content: [{ type: "text" as const, text: `Error showing notification: ${err.message}` }],
          });
        } else {
          resolve({
            content: [{ type: "text" as const, text: "Growl notification shown successfully" }],
          });
        }
      });
    });
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Node-notifier MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});