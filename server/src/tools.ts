import { ToolDescriptor } from "./types.js";

const workspaceTools: ToolDescriptor[] = [
  {
    name: "ws.create_workspace",
    access: "mut",
    useThisWhen: "You need to create a new workspace for a family, law firm, or elder support plan.",
    doNotUseFor: "Listing existing workspaces or inviting members.",
    inputSchema: {
      type: "object",
      required: ["name", "plan"],
      properties: {
        name: {
          type: "string",
          description: "Human readable workspace name such as 'Mieszkanie 2026'."
        },
        plan: {
          type: "string",
          enum: ["family", "business", "elder"],
          description: "Workspace plan that tunes policies and budgets."
        }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["workspace_id"],
      properties: {
        workspace_id: {
          type: "string",
          description: "Identifier for the newly created workspace."
        }
      }
    },
    securitySchemes: ["workspace-oauth"],
    examples: [
      {
        name: "create-family-plan",
        description: "Initialize the Family Plan workspace for housing comparison.",
        arguments: {
          name: "Mieszkanie 2026",
          plan: "family"
        }
      }
    ]
  },
  {
    name: "ws.invite_member",
    access: "mut",
    useThisWhen: "A collaborator needs access to an existing workspace with a specific role.",
    doNotUseFor: "Creating workspaces or changing guardrails.",
    inputSchema: {
      type: "object",
      required: ["workspace_id", "email", "role"],
      properties: {
        workspace_id: { type: "string" },
        email: { type: "string", format: "email" },
        role: {
          type: "string",
          enum: ["owner", "member", "viewer", "guardian"],
          description: "Role assignment controlling available actions."
        }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["workspace_id", "email"],
      properties: {
        workspace_id: { type: "string" },
        email: { type: "string", format: "email" }
      }
    },
    securitySchemes: ["workspace-oauth"],
    examples: [
      {
        name: "invite-guardian",
        description: "Add a guardian to monitor Elder Shield alerts.",
        arguments: {
          workspace_id: "ws_123",
          email: "opiekun@example.com",
          role: "guardian"
        }
      }
    ]
  },
  {
    name: "ws.list_members",
    access: "ro",
    useThisWhen: "You need to audit who has access to a workspace before inviting or revoking members.",
    doNotUseFor: "Creating or removing members.",
    inputSchema: {
      type: "object",
      required: ["workspace_id"],
      properties: {
        workspace_id: { type: "string" }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["members"],
      properties: {
        members: {
          type: "array",
          items: {
            type: "object",
            required: ["email", "role"],
            properties: {
              email: { type: "string", format: "email" },
              role: { type: "string" }
            }
          }
        }
      }
    },
    securitySchemes: ["workspace-oauth"],
    examples: [
      {
        name: "review-members",
        description: "Review existing participants before sharing Elder Shield alerts.",
        arguments: {
          workspace_id: "ws_123"
        }
      }
    ],
    metadata: {
      readOnlyHint: true
    }
  }
];

const guardrailTools: ToolDescriptor[] = [
  {
    name: "policy.set_guardrails",
    access: "mut",
    useThisWhen: "You must define or update legal, finance, or notification guardrails for a workspace or case.",
    doNotUseFor: "Checking if an offer stays within an existing budget.",
    inputSchema: {
      type: "object",
      required: ["workspace_id", "scope", "rules"],
      properties: {
        workspace_id: { type: "string" },
        scope: {
          type: "string",
          enum: ["workspace", "case"],
          description: "Scope of guardrails being applied."
        },
        case_id: { type: "string" },
        rules: {
          type: "object",
          required: ["finance", "legal", "notifications"],
          properties: {
            finance: {
              type: "array",
              items: { type: "string" },
              description: "Finance guardrail expressions or identifiers."
            },
            legal: {
              type: "array",
              items: { type: "string" }
            },
            notifications: {
              type: "array",
              items: { type: "string" }
            }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["policy_id", "applied"],
      properties: {
        policy_id: { type: "string" },
        applied: { type: "boolean" }
      }
    },
    securitySchemes: ["workspace-oauth"],
    examples: [
      {
        name: "family-guardrails",
        description: "Apply spending guardrails for the Family Plan workspace.",
        arguments: {
          workspace_id: "ws_family",
          scope: "workspace",
          rules: {
            finance: ["rrso <= 12", "fees.total <= 4000"],
            legal: ["require_data_consent"],
            notifications: ["consent_token_required"]
          }
        }
      }
    ]
  },
  {
    name: "budget.set_shared",
    access: "mut",
    useThisWhen: "A family or firm needs a shared budget definition with monthly and total limits.",
    doNotUseFor: "Evaluating individual offers against an existing budget.",
    inputSchema: {
      type: "object",
      required: ["workspace_id", "name", "currency", "limits"],
      properties: {
        workspace_id: { type: "string" },
        name: { type: "string" },
        currency: { type: "string", pattern: "^[A-Z]{3}$" },
        limits: {
          type: "object",
          required: ["monthly", "total"],
          properties: {
            monthly: { type: "number", minimum: 0 },
            total: { type: "number", minimum: 0 }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["budget_id"],
      properties: {
        budget_id: { type: "string" }
      }
    },
    securitySchemes: ["workspace-oauth"],
    examples: [
      {
        name: "mortgage-cap",
        description: "Create a shared mortgage budget for the housing comparison.",
        arguments: {
          workspace_id: "ws_family",
          name: "Rodzinny budżet kredytowy",
          currency: "PLN",
          limits: {
            monthly: 4500,
            total: 900000
          }
        }
      }
    ]
  },
  {
    name: "budget.check_offer",
    access: "ro",
    useThisWhen: "Validate if a banking offer complies with a shared budget before showing recommendations.",
    doNotUseFor: "Creating or editing budgets.",
    inputSchema: {
      type: "object",
      required: ["budget_id", "offer"],
      properties: {
        budget_id: { type: "string" },
        offer: {
          type: "object",
          required: ["principal", "term_months", "rrso", "fees"],
          properties: {
            principal: { type: "number", minimum: 0 },
            term_months: { type: "integer", minimum: 1 },
            rrso: { type: "number", minimum: 0 },
            fees: {
              type: "array",
              items: {
                type: "object",
                required: ["label", "amount"],
                properties: {
                  label: { type: "string" },
                  amount: { type: "number" }
                }
              }
            }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["within_limits", "breaches"],
      properties: {
        within_limits: { type: "boolean" },
        breaches: {
          type: "array",
          items: { type: "string" }
        }
      }
    },
    securitySchemes: ["workspace-oauth"],
    examples: [
      {
        name: "compare-offer",
        description: "Check if the leading mortgage offer respects the family budget.",
        arguments: {
          budget_id: "budget_01",
          offer: {
            principal: 750000,
            term_months: 300,
            rrso: 9.8,
            fees: [
              { label: "Prowizja", amount: 2500 },
              { label: "Ubezpieczenie", amount: 600 }
            ]
          }
        }
      }
    ],
    metadata: {
      readOnlyHint: true
    }
  }
];

const caseTools: ToolDescriptor[] = [
  {
    name: "case.create",
    access: "mut",
    useThisWhen: "You need to register a new case for a client matter or financial comparison.",
    doNotUseFor: "Attaching documents or summarising cases.",
    inputSchema: {
      type: "object",
      required: ["workspace_id", "title", "type"],
      properties: {
        workspace_id: { type: "string" },
        title: { type: "string" },
        type: {
          type: "string",
          enum: ["housing", "litigation", "compliance", "elder", "email"],
          description: "Case category used for routing workflows."
        }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["case_id"],
      properties: {
        case_id: { type: "string" }
      }
    },
    securitySchemes: ["workspace-oauth"],
    examples: [
      {
        name: "family-case",
        description: "Create a housing comparison case inside the family workspace.",
        arguments: {
          workspace_id: "ws_family",
          title: "Porównanie ofert bankowych",
          type: "housing"
        }
      }
    ]
  },
  {
    name: "case.attach_document",
    access: "mut",
    useThisWhen: "A new document, statement, or contract needs to be analysed as part of a case.",
    doNotUseFor: "Summarising a case without adding files.",
    inputSchema: {
      type: "object",
      required: ["case_id", "file"],
      properties: {
        case_id: { type: "string" },
        file: {
          type: "object",
          required: ["url", "mime", "label"],
          properties: {
            url: { type: "string", format: "uri" },
            mime: { type: "string" },
            label: { type: "string" }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["doc_id"],
      properties: {
        doc_id: { type: "string" }
      }
    },
    securitySchemes: ["workspace-oauth"],
    examples: [
      {
        name: "attach-term-sheet",
        description: "Add the latest bank term sheet to the housing case.",
        arguments: {
          case_id: "case_abc",
          file: {
            url: "https://storage.example.com/term-sheet.pdf",
            mime: "application/pdf",
            label: "Term sheet maj 2024"
          }
        }
      }
    ]
  },
  {
    name: "case.summary",
    access: "ro",
    useThisWhen: "You need an up-to-date compliance and action summary for a case dashboard.",
    doNotUseFor: "Editing case data or attachments.",
    inputSchema: {
      type: "object",
      required: ["case_id"],
      properties: {
        case_id: { type: "string" }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["status", "breaches", "next_actions", "timeline"],
      properties: {
        status: {
          type: "string",
          enum: ["green", "amber", "red"],
          description: "Compliance state of the case."
        },
        breaches: {
          type: "array",
          items: { type: "string" }
        },
        next_actions: {
          type: "array",
          items: { type: "string" }
        },
        timeline: {
          type: "array",
          items: {
            type: "object",
            required: ["at", "event"],
            properties: {
              at: { type: "string", format: "date-time" },
              event: { type: "string" }
            }
          }
        }
      }
    },
    securitySchemes: ["workspace-oauth"],
    examples: [
      {
        name: "case-health",
        description: "Surface the case summary inside the inline dashboard.",
        arguments: {
          case_id: "case_abc"
        }
      }
    ],
    metadata: {
      readOnlyHint: true
    }
  }
];

const mediaTools: ToolDescriptor[] = [
  {
    name: "media.transcribe",
    access: "ro",
    useThisWhen: "You need a high confidence transcript of an audio or video meeting for case review.",
    doNotUseFor: "Creating summaries without transcripts or non-media documents.",
    inputSchema: {
      type: "object",
      required: ["case_id", "file", "lang"],
      properties: {
        case_id: { type: "string" },
        file: {
          type: "object",
          required: ["url", "mime"],
          properties: {
            url: { type: "string", format: "uri" },
            mime: { type: "string" }
          },
          additionalProperties: false
        },
        lang: {
          type: "string",
          description: "BCP-47 language tag for the audio source."
        }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["transcript_id", "text", "confidence"],
      properties: {
        transcript_id: { type: "string" },
        text: { type: "string" },
        confidence: { type: "number", minimum: 0, maximum: 1 }
      }
    },
    securitySchemes: ["workspace-oauth"],
    examples: [
      {
        name: "transcribe-call",
        description: "Transcribe a bank negotiation call for breach detection.",
        arguments: {
          case_id: "case_abc",
          file: {
            url: "https://storage.example.com/call.wav",
            mime: "audio/wav"
          },
          lang: "pl-PL"
        }
      }
    ],
    metadata: {
      readOnlyHint: true
    }
  },
  {
    name: "conversation.extract_commitments",
    access: "ro",
    useThisWhen: "Identify obligations or promises from conversation transcripts for guardrail monitoring.",
    doNotUseFor: "Summarising unrelated documents or sending notifications.",
    inputSchema: {
      type: "object",
      required: ["text"],
      properties: {
        text: { type: "string" }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["claims"],
      properties: {
        claims: {
          type: "array",
          items: {
            type: "object",
            required: ["actor", "action", "due"],
            properties: {
              actor: { type: "string" },
              action: { type: "string" },
              due: { type: "string" }
            }
          }
        }
      }
    },
    securitySchemes: ["internal-noauth"],
    examples: [
      {
        name: "commitment-detection",
        description: "Extract commitments after transcribing a bank conversation.",
        arguments: {
          text: "Bank promises fixed rate for 24 months if documents submitted by 15 czerwca"
        }
      }
    ],
    metadata: {
      readOnlyHint: true
    }
  }
];

const elderTools: ToolDescriptor[] = [
  {
    name: "elder.set_policy",
    access: "mut",
    useThisWhen: "You must configure Elder Shield risk evaluation thresholds and guardians.",
    doNotUseFor: "Evaluating a message risk score.",
    inputSchema: {
      type: "object",
      required: ["workspace_id", "enabled", "risk_threshold", "notify_contacts", "data_minimization", "consent_token"],
      properties: {
        workspace_id: { type: "string" },
        enabled: { type: "boolean" },
        risk_threshold: { type: "number", minimum: 0, maximum: 1 },
        notify_contacts: {
          type: "array",
          items: {
            type: "object",
            required: ["email", "relationship"],
            properties: {
              email: { type: "string", format: "email" },
              relationship: { type: "string" }
            }
          }
        },
        data_minimization: { type: "string" },
        consent_token: { type: "string" }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["workspace_id", "enabled"],
      properties: {
        workspace_id: { type: "string" },
        enabled: { type: "boolean" }
      }
    },
    securitySchemes: ["workspace-oauth"],
    examples: [
      {
        name: "enable-elder-shield",
        description: "Enable Elder Shield with strict data minimisation and guardian notifications.",
        arguments: {
          workspace_id: "ws_elder",
          enabled: true,
          risk_threshold: 0.65,
          notify_contacts: [
            { email: "syn@example.com", relationship: "son" }
          ],
          data_minimization: "truncate_content",
          consent_token: "consent_elder_2024"
        }
      }
    ]
  },
  {
    name: "elder.evaluate_risk",
    access: "ro",
    useThisWhen: "Screen a message for elder fraud risk before alerting guardians.",
    doNotUseFor: "Sending alerts or configuring policies.",
    inputSchema: {
      type: "object",
      required: ["text_or_doc_id", "context"],
      properties: {
        text_or_doc_id: { type: "string" },
        context: {
          type: "object",
          required: ["workspace_id"],
          properties: {
            workspace_id: { type: "string" }
          }
        }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["risk_score", "signals", "explanation"],
      properties: {
        risk_score: { type: "number", minimum: 0, maximum: 1 },
        signals: {
          type: "array",
          items: { type: "string" }
        },
        explanation: { type: "string" }
      }
    },
    securitySchemes: ["workspace-oauth"],
    examples: [
      {
        name: "assess-scam",
        description: "Evaluate a suspicious SMS before sending alerts.",
        arguments: {
          text_or_doc_id: "Proszę pilnie przelać 5000 PLN, to Twój wnuk",
          context: {
            workspace_id: "ws_elder"
          }
        }
      }
    ],
    metadata: {
      readOnlyHint: true
    }
  },
  {
    name: "notify.send_alert",
    access: "mut",
    useThisWhen: "Guardian alerts must be drafted after a high-risk Elder Shield finding.",
    doNotUseFor: "General communications without verified consent tokens.",
    inputSchema: {
      type: "object",
      required: ["to", "channel", "subject", "summary", "consent_token"],
      properties: {
        to: {
          type: "array",
          items: { type: "string", format: "email" },
          minItems: 1
        },
        channel: {
          type: "string",
          enum: ["email", "sms"],
          description: "Alert delivery channel."
        },
        subject: { type: "string" },
        summary: { type: "string" },
        consent_token: { type: "string" }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["alert_id", "status"],
      properties: {
        alert_id: { type: "string" },
        status: { type: "string", enum: ["draft", "queued"] }
      }
    },
    securitySchemes: ["workspace-oauth"],
    examples: [
      {
        name: "notify-guardian",
        description: "Draft an email alert for a suspected scam call.",
        arguments: {
          to: ["syn@example.com"],
          channel: "email",
          subject: "Podejrzenie oszustwa",
          summary: "Wiadomość z prośbą o szybki przelew przekroczyła próg ryzyka.",
          consent_token: "consent_elder_2024"
        }
      }
    ]
  }
];

const emailTools: ToolDescriptor[] = [
  {
    name: "mail.connect_account",
    access: "mut",
    useThisWhen: "A user opts in to email scanning and provides OAuth consent.",
    doNotUseFor: "Scanning messages without explicit authorisation.",
    inputSchema: {
      type: "object",
      required: ["workspace_id", "provider", "scopes", "consent_token"],
      properties: {
        workspace_id: { type: "string" },
        provider: {
          type: "string",
          enum: ["gmail", "imap"],
          description: "Email provider supporting OAuth or token-based auth."
        },
        scopes: {
          type: "array",
          items: { type: "string" },
          minItems: 1
        },
        consent_token: { type: "string" }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["mailbox_id"],
      properties: {
        mailbox_id: { type: "string" }
      }
    },
    securitySchemes: ["gmail-oauth"],
    examples: [
      {
        name: "connect-gmail",
        description: "Connect a Gmail account using OAuth scopes required for phishing detection.",
        arguments: {
          workspace_id: "ws_email",
          provider: "gmail",
          scopes: ["https://mail.google.com/"],
          consent_token: "consent_email_2024"
        }
      }
    ]
  },
  {
    name: "mail.scan_inbox",
    access: "ro",
    useThisWhen: "You must retrieve a bounded set of messages for phishing classification.",
    doNotUseFor: "Modifying or deleting email messages.",
    inputSchema: {
      type: "object",
      required: ["mailbox_id", "since", "max"],
      properties: {
        mailbox_id: { type: "string" },
        since: { type: "string", format: "date-time" },
        max: { type: "integer", minimum: 1, maximum: 200 }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["messages"],
      properties: {
        messages: {
          type: "array",
          items: {
            type: "object",
            required: ["id", "subject", "from", "received_at"],
            properties: {
              id: { type: "string" },
              subject: { type: "string" },
              from: { type: "string" },
              received_at: { type: "string", format: "date-time" }
            }
          }
        }
      }
    },
    securitySchemes: ["gmail-oauth"],
    examples: [
      {
        name: "scan-recent",
        description: "Scan the last fifty messages to surface phishing attempts under 30 seconds.",
        arguments: {
          mailbox_id: "mailbox_001",
          since: "2024-05-01T00:00:00Z",
          max: 50
        }
      }
    ],
    metadata: {
      readOnlyHint: true
    }
  },
  {
    name: "mail.classify_message",
    access: "ro",
    useThisWhen: "Determine whether a specific email is phishing and gather supporting signals.",
    doNotUseFor: "Sending actions or modifying labels.",
    inputSchema: {
      type: "object",
      required: ["message_id"],
      properties: {
        message_id: { type: "string" }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["is_phishing", "signals", "confidence"],
      properties: {
        is_phishing: { type: "boolean" },
        signals: {
          type: "array",
          items: { type: "string" }
        },
        confidence: { type: "number", minimum: 0, maximum: 1 }
      }
    },
    securitySchemes: ["gmail-oauth"],
    examples: [
      {
        name: "classify-link",
        description: "Classify a suspicious unsubscribe link for Email Defense.",
        arguments: {
          message_id: "msg_987"
        }
      }
    ],
    metadata: {
      readOnlyHint: true
    }
  },
  {
    name: "mail.prepare_action",
    access: "mut",
    useThisWhen: "Prepare a draft remediation such as unsubscribe verification or alert reply.",
    doNotUseFor: "Sending final emails automatically without user approval.",
    inputSchema: {
      type: "object",
      required: ["message_id", "action", "consent_token"],
      properties: {
        message_id: { type: "string" },
        action: {
          type: "string",
          enum: ["unsubscribe", "forward_to_security", "draft_reply"],
          description: "Action blueprint to draft without sending automatically."
        },
        consent_token: { type: "string" }
      },
      additionalProperties: false
    },
    outputSchema: {
      type: "object",
      required: ["draft_id", "preview", "requires_user_send"],
      properties: {
        draft_id: { type: "string" },
        preview: { type: "string" },
        requires_user_send: { type: "boolean" }
      }
    },
    securitySchemes: ["gmail-oauth"],
    examples: [
      {
        name: "draft-unsubscribe",
        description: "Prepare a safe unsubscribe workflow for a newsletter.",
        arguments: {
          message_id: "msg_987",
          action: "unsubscribe",
          consent_token: "consent_email_2024"
        }
      }
    ]
  }
];

export const toolDescriptors: ToolDescriptor[] = [
  ...workspaceTools,
  ...guardrailTools,
  ...caseTools,
  ...mediaTools,
  ...elderTools,
  ...emailTools
];
