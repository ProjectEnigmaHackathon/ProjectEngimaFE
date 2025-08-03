{
  "openapi": "3.1.0",
  "info": {
    "title": "Project Enigma API",
    "description": "AI-powered release documentation automation backend",
    "version": "0.1.0"
  },
  "paths": {
    "/api/health/health": {
      "get": {
        "tags": [
          "health"
        ],
        "summary": "Health Check",
        "description": "Comprehensive health check endpoint.\n\nReturns system status, API connectivity, and basic metrics.",
        "operationId": "health_check_api_health_health_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HealthResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/health/health/ready": {
      "get": {
        "tags": [
          "health"
        ],
        "summary": "Readiness Check",
        "description": "Kubernetes-style readiness probe.\n\nReturns simple status for load balancer health checks.",
        "operationId": "readiness_check_api_health_health_ready_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "additionalProperties": true,
                  "type": "object",
                  "title": "Response Readiness Check Api Health Health Ready Get"
                }
              }
            }
          }
        }
      }
    },
    "/api/health/health/live": {
      "get": {
        "tags": [
          "health"
        ],
        "summary": "Liveness Check",
        "description": "Kubernetes-style liveness probe.\n\nReturns basic application liveness status.",
        "operationId": "liveness_check_api_health_health_live_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "additionalProperties": true,
                  "type": "object",
                  "title": "Response Liveness Check Api Health Health Live Get"
                }
              }
            }
          }
        }
      }
    },
    "/api/health/metrics": {
      "get": {
        "tags": [
          "health"
        ],
        "summary": "Get Metrics",
        "description": "Get detailed application metrics and performance data.",
        "operationId": "get_metrics_api_health_metrics_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MetricsResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/chat/": {
      "post": {
        "tags": [
          "chat"
        ],
        "summary": "Send Message",
        "description": "Send a chat message and start/continue workflow execution.\n\nThis endpoint handles both new workflow starts and continuation of existing workflows.",
        "operationId": "send_message_api_chat__post",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ChatRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChatResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/chat/status/{workflow_id}": {
      "get": {
        "tags": [
          "chat"
        ],
        "summary": "Get Workflow Status",
        "description": "Get current status of a workflow.",
        "operationId": "get_workflow_status_api_chat_status__workflow_id__get",
        "parameters": [
          {
            "name": "workflow_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Workflow Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/chat/stream/{workflow_id}": {
      "get": {
        "tags": [
          "chat"
        ],
        "summary": "Stream Workflow Updates",
        "description": "Stream real-time workflow updates.\n\nReturns a Server-Sent Events stream of workflow state changes.",
        "operationId": "stream_workflow_updates_api_chat_stream__workflow_id__get",
        "parameters": [
          {
            "name": "workflow_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Workflow Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/chat/approval": {
      "post": {
        "tags": [
          "chat"
        ],
        "summary": "Handle Approval",
        "description": "Handle user approval for workflow steps requiring human intervention using LangGraph interrupts.",
        "operationId": "handle_approval_api_chat_approval_post",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/app__models__api__ApprovalRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/chat/interrupted": {
      "get": {
        "tags": [
          "chat"
        ],
        "summary": "Get Interrupted Workflows",
        "description": "Get list of workflows that are currently interrupted and waiting for approval.",
        "operationId": "get_interrupted_workflows_api_chat_interrupted_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    },
    "/api/chat/interrupt/{workflow_id}": {
      "get": {
        "tags": [
          "chat"
        ],
        "summary": "Get Workflow Interrupt Data",
        "description": "Get interrupt data for a specific workflow.",
        "operationId": "get_workflow_interrupt_data_api_chat_interrupt__workflow_id__get",
        "parameters": [
          {
            "name": "workflow_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Workflow Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/chat/pause/{workflow_id}": {
      "post": {
        "tags": [
          "chat"
        ],
        "summary": "Pause Workflow",
        "description": "Pause a running workflow.",
        "operationId": "pause_workflow_api_chat_pause__workflow_id__post",
        "parameters": [
          {
            "name": "workflow_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Workflow Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/chat/cancel/{workflow_id}": {
      "post": {
        "tags": [
          "chat"
        ],
        "summary": "Cancel Workflow",
        "description": "Cancel a workflow.",
        "operationId": "cancel_workflow_api_chat_cancel__workflow_id__post",
        "parameters": [
          {
            "name": "workflow_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Workflow Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/chat/list": {
      "get": {
        "tags": [
          "chat"
        ],
        "summary": "List Workflows",
        "description": "List all active workflows.",
        "operationId": "list_workflows_api_chat_list_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    },
    "/api/chat/{workflow_id}": {
      "delete": {
        "tags": [
          "chat"
        ],
        "summary": "Delete Workflow",
        "description": "Delete a workflow and its associated data.",
        "operationId": "delete_workflow_api_chat__workflow_id__delete",
        "parameters": [
          {
            "name": "workflow_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Workflow Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/repositories/": {
      "get": {
        "tags": [
          "repositories"
        ],
        "summary": "Get Repositories",
        "description": "Get list of configured repositories.",
        "operationId": "get_repositories_api_repositories__get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "items": {
                    "$ref": "#/components/schemas/RepositoryConfig"
                  },
                  "type": "array",
                  "title": "Response Get Repositories Api Repositories  Get"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "repositories"
        ],
        "summary": "Create Repository",
        "description": "Add a new repository configuration.",
        "operationId": "create_repository_api_repositories__post",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RepositoryRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RepositoryConfig"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/repositories/{repo_id}": {
      "get": {
        "tags": [
          "repositories"
        ],
        "summary": "Get Repository",
        "description": "Get a specific repository by ID.",
        "operationId": "get_repository_api_repositories__repo_id__get",
        "parameters": [
          {
            "name": "repo_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Repo Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RepositoryConfig"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "repositories"
        ],
        "summary": "Update Repository",
        "description": "Update an existing repository configuration.",
        "operationId": "update_repository_api_repositories__repo_id__put",
        "parameters": [
          {
            "name": "repo_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Repo Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RepositoryRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RepositoryConfig"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "repositories"
        ],
        "summary": "Delete Repository",
        "description": "Delete a repository configuration.",
        "operationId": "delete_repository_api_repositories__repo_id__delete",
        "parameters": [
          {
            "name": "repo_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Repo Id"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Successful Response"
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/repositories/stats/summary": {
      "get": {
        "tags": [
          "repositories"
        ],
        "summary": "Get Repository Statistics",
        "description": "Get repository management statistics.",
        "operationId": "get_repository_statistics_api_repositories_stats_summary_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    },
    "/api/repositories/backups/list": {
      "get": {
        "tags": [
          "repositories"
        ],
        "summary": "List Backups",
        "description": "List available backup files.",
        "operationId": "list_backups_api_repositories_backups_list_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    },
    "/api/repositories/backups/restore/{backup_filename}": {
      "post": {
        "tags": [
          "repositories"
        ],
        "summary": "Restore Backup",
        "description": "Restore configuration from a backup file.",
        "operationId": "restore_backup_api_repositories_backups_restore__backup_filename__post",
        "parameters": [
          {
            "name": "backup_filename",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Backup Filename"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/workflow/approval": {
      "get": {
        "tags": [
          "workflow"
        ],
        "summary": "List Pending Approvals Endpoint",
        "description": "List all pending approvals.",
        "operationId": "list_pending_approvals_endpoint_api_workflow_approval_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "workflow"
        ],
        "summary": "Handle Approval Decision",
        "description": "Handle human approval decisions for workflow checkpoints.",
        "operationId": "handle_approval_decision_api_workflow_approval_post",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/app__api__endpoints__workflow__ApprovalRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApprovalResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/workflow/approval/{workflow_id}": {
      "get": {
        "tags": [
          "workflow"
        ],
        "summary": "Get Pending Approval Endpoint",
        "description": "Get pending approval details for a workflow.",
        "operationId": "get_pending_approval_endpoint_api_workflow_approval__workflow_id__get",
        "parameters": [
          {
            "name": "workflow_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Workflow Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/workflow/workflow/action": {
      "post": {
        "tags": [
          "workflow"
        ],
        "summary": "Workflow Action",
        "description": "Perform actions on workflows (pause, resume, cancel).",
        "operationId": "workflow_action_api_workflow_workflow_action_post",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/WorkflowAction"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/workflow/workflow/{workflow_id}/status": {
      "get": {
        "tags": [
          "workflow"
        ],
        "summary": "Get Workflow Status",
        "description": "Get current workflow status and progress.",
        "operationId": "get_workflow_status_api_workflow_workflow__workflow_id__status_get",
        "parameters": [
          {
            "name": "workflow_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Workflow Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/workflow/workflows": {
      "get": {
        "tags": [
          "workflow"
        ],
        "summary": "List Workflows",
        "description": "List all workflows with their current status.",
        "operationId": "list_workflows_api_workflow_workflows_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    },
    "/health": {
      "get": {
        "summary": "Health Check",
        "description": "Simple health check endpoint.",
        "operationId": "health_check_health_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    },
    "/": {
      "get": {
        "summary": "Root",
        "description": "Root endpoint with API information.",
        "operationId": "root__get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    },
    "/api/docs": {
      "get": {
        "summary": "Redirect To Docs",
        "description": "Redirect to the main docs page.",
        "operationId": "redirect_to_docs_api_docs_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "ApprovalResponse": {
        "properties": {
          "approval_id": {
            "type": "string",
            "title": "Approval Id"
          },
          "workflow_id": {
            "type": "string",
            "title": "Workflow Id"
          },
          "status": {
            "type": "string",
            "title": "Status"
          },
          "message": {
            "type": "string",
            "title": "Message"
          },
          "timestamp": {
            "type": "string",
            "format": "date-time",
            "title": "Timestamp"
          }
        },
        "type": "object",
        "required": [
          "approval_id",
          "workflow_id",
          "status",
          "message",
          "timestamp"
        ],
        "title": "ApprovalResponse",
        "description": "Response model for approval decisions."
      },
      "ChatRequest": {
        "properties": {
          "message": {
            "type": "string",
            "title": "Message",
            "description": "User message content"
          },
          "repositories": {
            "items": {
              "type": "string"
            },
            "type": "array",
            "title": "Repositories",
            "description": "Selected repository IDs",
            "default": []
          },
          "release_type": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/ReleaseType"
              },
              {
                "type": "null"
              }
            ],
            "description": "Type of release"
          },
          "sprint_name": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Sprint Name",
            "description": "Sprint branch name"
          },
          "fix_version": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Fix Version",
            "description": "JIRA fix version"
          },
          "session_id": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Session Id",
            "description": "Chat session identifier"
          }
        },
        "type": "object",
        "required": [
          "message"
        ],
        "title": "ChatRequest",
        "description": "Chat message request model."
      },
      "ChatResponse": {
        "properties": {
          "message": {
            "type": "string",
            "title": "Message",
            "description": "AI response message"
          },
          "message_type": {
            "type": "string",
            "title": "Message Type",
            "description": "Type of message",
            "default": "text"
          },
          "workflow_status": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/WorkflowStatus"
              },
              {
                "type": "null"
              }
            ],
            "description": "Current workflow status"
          },
          "data": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Data",
            "description": "Additional response data"
          },
          "timestamp": {
            "type": "string",
            "format": "date-time",
            "title": "Timestamp"
          },
          "requires_approval": {
            "type": "boolean",
            "title": "Requires Approval",
            "description": "Whether user approval is required",
            "default": false
          }
        },
        "type": "object",
        "required": [
          "message"
        ],
        "title": "ChatResponse",
        "description": "Chat message response model."
      },
      "HTTPValidationError": {
        "properties": {
          "detail": {
            "items": {
              "$ref": "#/components/schemas/ValidationError"
            },
            "type": "array",
            "title": "Detail"
          }
        },
        "type": "object",
        "title": "HTTPValidationError"
      },
      "HealthResponse": {
        "properties": {
          "status": {
            "$ref": "#/components/schemas/SystemStatus",
            "description": "Overall system status"
          },
          "timestamp": {
            "type": "string",
            "format": "date-time",
            "title": "Timestamp",
            "description": "Response timestamp"
          },
          "response_time_ms": {
            "type": "number",
            "title": "Response Time Ms",
            "description": "Health check response time"
          },
          "version": {
            "type": "string",
            "title": "Version",
            "description": "Service version"
          },
          "environment": {
            "type": "string",
            "title": "Environment",
            "description": "Environment name"
          },
          "system_metrics": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "System Metrics",
            "description": "System resource metrics"
          },
          "api_connectivity": {
            "anyOf": [
              {
                "items": {
                  "additionalProperties": true,
                  "type": "object"
                },
                "type": "array"
              },
              {
                "type": "null"
              }
            ],
            "title": "Api Connectivity",
            "description": "API connectivity checks"
          },
          "uptime_seconds": {
            "type": "number",
            "title": "Uptime Seconds",
            "description": "System uptime in seconds"
          },
          "error": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Error",
            "description": "Error message if unhealthy"
          }
        },
        "type": "object",
        "required": [
          "status",
          "timestamp",
          "response_time_ms",
          "version",
          "environment",
          "uptime_seconds"
        ],
        "title": "HealthResponse",
        "description": "Comprehensive health check response model."
      },
      "MetricsResponse": {
        "properties": {
          "timestamp": {
            "type": "string",
            "format": "date-time",
            "title": "Timestamp",
            "description": "Metrics collection timestamp"
          },
          "request_count": {
            "type": "integer",
            "title": "Request Count",
            "description": "Total number of requests"
          },
          "error_count": {
            "type": "integer",
            "title": "Error Count",
            "description": "Total number of errors"
          },
          "workflow_executions": {
            "type": "integer",
            "title": "Workflow Executions",
            "description": "Total workflow executions"
          },
          "error_rate_percent": {
            "type": "number",
            "title": "Error Rate Percent",
            "description": "Error rate percentage"
          },
          "avg_api_response_time_ms": {
            "type": "number",
            "title": "Avg Api Response Time Ms",
            "description": "Average API response time"
          },
          "avg_workflow_time_ms": {
            "type": "number",
            "title": "Avg Workflow Time Ms",
            "description": "Average workflow execution time"
          },
          "system_metrics": {
            "additionalProperties": true,
            "type": "object",
            "title": "System Metrics",
            "description": "Current system metrics"
          },
          "uptime_seconds": {
            "type": "number",
            "title": "Uptime Seconds",
            "description": "System uptime in seconds"
          }
        },
        "type": "object",
        "required": [
          "timestamp",
          "request_count",
          "error_count",
          "workflow_executions",
          "error_rate_percent",
          "avg_api_response_time_ms",
          "avg_workflow_time_ms",
          "system_metrics",
          "uptime_seconds"
        ],
        "title": "MetricsResponse",
        "description": "Application metrics response model."
      },
      "ReleaseType": {
        "type": "string",
        "enum": [
          "release",
          "hotfix"
        ],
        "title": "ReleaseType",
        "description": "Release type enumeration."
      },
      "RepositoryConfig": {
        "properties": {
          "id": {
            "type": "string",
            "title": "Id",
            "description": "Unique repository identifier"
          },
          "name": {
            "type": "string",
            "title": "Name",
            "description": "Repository name"
          },
          "url": {
            "type": "string",
            "title": "Url",
            "description": "Repository URL"
          },
          "description": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Description",
            "description": "Repository description"
          },
          "is_active": {
            "type": "boolean",
            "title": "Is Active",
            "description": "Whether the repository is active",
            "default": true
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "title": "Created At"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time",
            "title": "Updated At"
          }
        },
        "type": "object",
        "required": [
          "id",
          "name",
          "url"
        ],
        "title": "RepositoryConfig",
        "description": "Repository configuration model."
      },
      "RepositoryRequest": {
        "properties": {
          "name": {
            "type": "string",
            "title": "Name",
            "description": "Repository name"
          },
          "url": {
            "type": "string",
            "title": "Url",
            "description": "Repository URL"
          },
          "description": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Description",
            "description": "Repository description"
          }
        },
        "type": "object",
        "required": [
          "name",
          "url"
        ],
        "title": "RepositoryRequest",
        "description": "Repository creation/update request model."
      },
      "SystemStatus": {
        "type": "string",
        "enum": [
          "healthy",
          "degraded",
          "unhealthy"
        ],
        "title": "SystemStatus",
        "description": "System status enumeration for comprehensive health checks."
      },
      "ValidationError": {
        "properties": {
          "loc": {
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "type": "array",
            "title": "Location"
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          }
        },
        "type": "object",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "title": "ValidationError"
      },
      "WorkflowAction": {
        "properties": {
          "workflow_id": {
            "type": "string",
            "title": "Workflow Id"
          },
          "action": {
            "type": "string",
            "title": "Action"
          }
        },
        "type": "object",
        "required": [
          "workflow_id",
          "action"
        ],
        "title": "WorkflowAction",
        "description": "Request model for workflow actions."
      },
      "WorkflowStatus": {
        "type": "string",
        "enum": [
          "pending",
          "in_progress",
          "awaiting_approval",
          "completed",
          "failed",
          "cancelled"
        ],
        "title": "WorkflowStatus",
        "description": "Workflow execution status."
      },
      "app__api__endpoints__workflow__ApprovalRequest": {
        "properties": {
          "workflow_id": {
            "type": "string",
            "title": "Workflow Id"
          },
          "approved": {
            "type": "boolean",
            "title": "Approved"
          },
          "notes": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Notes",
            "default": ""
          },
          "user_id": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "User Id",
            "default": "user"
          }
        },
        "type": "object",
        "required": [
          "workflow_id",
          "approved"
        ],
        "title": "ApprovalRequest",
        "description": "Request model for approval decisions."
      },
      "app__models__api__ApprovalRequest": {
        "properties": {
          "workflow_id": {
            "type": "string",
            "title": "Workflow Id",
            "description": "Workflow identifier"
          },
          "action": {
            "type": "string",
            "title": "Action",
            "description": "Approval action: approve, deny, cancel"
          },
          "comment": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Comment",
            "description": "Optional approval comment"
          }
        },
        "type": "object",
        "required": [
          "workflow_id",
          "action"
        ],
        "title": "ApprovalRequest",
        "description": "User approval request model."
      }
    }
  }
}