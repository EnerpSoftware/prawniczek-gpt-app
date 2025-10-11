import { SecurityScheme } from "./types.js";

export const securitySchemes: SecurityScheme[] = [
  {
    id: "internal-noauth",
    type: "noauth",
    description: "Use for read-only internal lookups that do not leave the tenant boundary."
  },
  {
    id: "workspace-oauth",
    type: "oauth2",
    description: "Workspace authenticated access for protected resources via OAuth 2.1 with PKCE.",
    scopes: [
      "workspace.read",
      "workspace.write",
      "cases.manage",
      "email.scan",
      "email.modify",
      "elder.notify"
    ]
  },
  {
    id: "gmail-oauth",
    type: "oauth2",
    description: "Delegated Gmail/IMAP OAuth 2.1 client with dynamic registration and consent tokens.",
    scopes: [
      "https://mail.google.com/",
      "email.readonly",
      "email.modify"
    ]
  }
];
