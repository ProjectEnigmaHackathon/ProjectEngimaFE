# Project Enigma - Product Requirements Document

## Product Overview

Project Enigma is an AI-powered internal tool that automates release documentation creation by integrating JIRA tickets, GitHub branches, and Confluence documentation. The solution reduces manual effort from 1 day per developer to minutes by automating the entire release workflow process using CopilotKit for seamless AI chat integration.

## Target Users

- Team leads responsible for release management
- Senior developers who create release deployment documentation
- DevOps engineers managing multi-repository releases

## Functional Requirements

| Requirement ID | Description                           | User Story                                                                                                                                                           | Expected Behavior/Outcome                                                                                                                                   |
| -------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR001          | CopilotKit Chat Interface             | As a user, I want to see a CopilotKit-powered chat interface as the main landing page so I can immediately start interacting with the AI system with professional UI components.                                        | The main dashboard displays CopilotKit's CopilotSidebar component with built-in streaming, message history, and input handling, eliminating need for custom chat development.   |
| FR002          | Repository Selection Dropdown         | As a user, I want to select target repositories from a dropdown for each chat session so I can specify which repos are part of my release.                           | A dropdown component displays all configured repositories with multi-select capability, allowing users to choose relevant repos for each release workflow.  |
| FR003          | Settings Panel Access                 | As a user, I want to access settings through a left panel button so I can manage repository configurations.                                                          | A left sidebar contains a settings button that opens a dedicated settings page for repository management without disrupting the main chat interface.        |
| FR004          | Repository Configuration              | As a user, I want to add and manage repository names in settings so I can configure which repos the system can work with.                                            | The settings page provides an interface to add, edit, and delete repository names with validation and persistence across sessions.                          |
| FR005          | Structured Chat Input                 | As a user, I want to provide release information in a structured format (repos, release type, sprint name, fix version) so the AI can process my request accurately. | The CopilotKit chat interface accepts structured input with clear labels for repos, release type (release/hotfix), sprint name, and JIRA fix version.                  |
| FR006          | CopilotKit Native Chat History        | As a user, I want my previous conversations to be remembered so I can refer back to previous releases and continue workflows.                                        | CopilotKit's built-in conversation management stores and displays chat history across sessions with persistent state management.      |
| FR007          | Real-time CopilotKit Streaming       | As a user, I want to see AI responses stream in real-time using CopilotKit's native streaming so I can monitor progress of long-running operations.                                                      | CopilotKit's streaming interface displays real-time text responses with built-in progress indicators and connection management.        |
| FR008          | JIRA Ticket Collection                | As a user, I want the system to automatically collect all JIRA tickets with specified fix versions so I can ensure all work items are included in the release.       | The system connects to JIRA API, retrieves tickets filtered by fix version, and displays ticket IDs and summaries in the CopilotKit chat response.                     |
| FR009          | Feature Branch Discovery              | As a user, I want the system to find all feature branches containing JIRA ticket IDs so I can verify all development work is tracked.                                | The system searches GitHub repositories for branches matching pattern "feature/{JIRA-ID}" and reports found/missing branches for each ticket through CopilotKit interface.               |
| FR010          | Merge Status Validation               | As a user, I want to verify that all feature branches are merged into sprint branches so I can ensure code integration is complete.                                  | The system checks merge status of each feature branch into specified sprint branch and reports any unmerged branches with repository and branch details via CopilotKit.    |
| FR011          | CopilotKit Human Approval             | As a user, I want to approve the merging of sprint branches to develop through CopilotKit's interface so I can maintain control over the release process.                                           | CopilotKit displays approval dialogs and prompts for user confirmation before proceeding with sprint-to-develop merges, with built-in interaction handling.              |
| FR012          | Automated Sprint Branch Merging       | As a user, I want sprint branches to be automatically merged to develop after my approval so I can ensure consistent integration across repositories.                | Upon user approval via CopilotKit, the system creates merge requests/pull requests from sprint branches to develop branches for all specified repositories.                |
| FR013          | Release Branch Creation               | As a user, I want release branches to be created from develop branches with semantic versioning so I can prepare code for production deployment.                     | The system creates release branches following semantic versioning (v1.0.0, v2.0.0) by analyzing existing tags and incrementing major version appropriately. |
| FR014          | Pull Request Generation               | As a user, I want PRs created from release branches to master so I can track and review the final deployment changes.                                                | The system automatically creates pull requests from release branches to master branches and captures PR URLs for inclusion in deployment documentation.     |
| FR015          | Release Tag Creation                  | As a user, I want release tags created with proper versioning so I can maintain version history and enable rollbacks.                                                | The system creates Git tags on release branches with semantic version numbers and includes metadata about the release.                                      |
| FR016          | Rollback Branch Preparation           | As a user, I want rollback branches created from master in standardized format so I can quickly revert if deployment issues occur.                                   | The system creates rollback branches from master using format "rollback/v-{Fix version}" and captures branch URLs for documentation.                        |
| FR017          | Confluence Documentation Generation   | As a user, I want a structured deployment document created in Confluence so I can share deployment plans with stakeholders.                                          | The system creates a Confluence page with deployment and rollback sections for each repository, including Jenkins URLs, PR links, and branch information.   |
| FR018          | Branch Not Found Error Handling       | As a user, I want to be notified when feature branches cannot be found for JIRA tickets so I can investigate missing development work.                               | The system reports through CopilotKit interface which JIRA tickets do not have corresponding feature branches, allowing manual investigation.                           |
| FR019          | Merge Conflict Error Handling         | As a user, I want to be alerted about merge conflicts during automated operations so I can resolve them manually.                                                    | The system detects merge conflicts during automated merging and reports affected repositories and branches through CopilotKit's error handling.                            |
| FR020          | Semantic Version Management           | As a user, I want the system to automatically determine the next version number so I can ensure proper version progression.                                          | The system analyzes existing Git tags, follows semantic versioning rules, and increments major version (v1.0.0 → v2.0.0) for new releases.                  |
| FR021          | Repository Status Visibility          | As a user, I want to see which repositories are up to date in their release process so I can track overall progress.                                                 | The system provides status indicators through CopilotKit showing which repos have completed each workflow step (branch merging, PR creation, etc.).                            |
| FR022          | Standardized Branch Naming Convention | As a user, I want the system to follow our established naming conventions so integration works seamlessly with existing workflows.                                   | The system enforces feature branch pattern "feature/{JIRA-ID}" and accepts user-defined sprint branch names through the CopilotKit UI.                                 |
| FR023          | Multiple Repository Support           | As a user, I want to process releases spanning 3-30 repositories simultaneously so I can handle varying release scopes efficiently.                                  | The system processes all selected repositories in parallel, provides per-repo status updates through CopilotKit, and handles partial failures gracefully.                      |
| FR024          | Authentication Management             | As a user, I want secure authentication to JIRA, GitHub, and Confluence so I can access private repositories and create documentation.                               | The system uses AWS Secrets Manager to store API credentials and maintains secure connections to all integrated services.                                   |
| FR025          | Deployment Documentation Format       | As a user, I want deployment documents to follow our standard format so stakeholders can easily find required information.                                           | The Confluence page follows specified template with deployment plan (job URL, PR link, branch) and rollback plan (rollback branch) for each repository.     |

## Non-Functional Requirements

| Requirement ID | Description                | Expected Behavior/Outcome                                                                                                  |
| -------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| NFR001         | AWS Cloud Hosting          | System deployed on AWS using S3+CloudFront for frontend, ECS/Lambda/EC2 for backend, ensuring scalability and reliability. |
| NFR002         | API Rate Limit Handling    | System gracefully handles API rate limits from JIRA, GitHub, and Confluence without breaking workflow execution.           |
| NFR003         | CopilotKit Real-time Updates | CopilotKit provides immediate feedback and streaming progress indicators during long-running operations to maintain user engagement.     |
| NFR004         | CopilotKit Session Persistence        | CopilotKit maintains user sessions and chat history across browser refreshes and multiple login sessions.                      |
| NFR005         | Error Recovery             | System provides clear error messages through CopilotKit interface and allows workflow continuation or restart after resolving issues.                   |

## Technical Architecture

- **Frontend:** React + CopilotKit (hosted on S3 + CloudFront)
- **Backend:** FastAPI + LangGraph (deployed on ECS/Lambda/EC2)
- **Chat Interface:** CopilotKit React components with native streaming
- **Database:** MySQL or in-memory storage
- **Authentication:** AWS Secrets Manager
- **Integrations:** JIRA API, GitHub API, Confluence API
- **Deployment:** AWS Cloud Infrastructure

## Success Metrics

- **Time Savings:** Reduce deployment documentation creation from 1 day per developer to under 1 hour
- **Error Reduction:** Eliminate manual errors in branch tracking and documentation formatting
- **Process Standardization:** Ensure consistent deployment documentation across all releases
- **User Adoption:** 100% adoption by team leads and senior developers within 3 months
- **UI Experience:** Professional chat interface with zero custom streaming development using CopilotKit

## Constraints and Assumptions

- Users are technical personnel comfortable with release management concepts
- Standardized branch naming conventions are followed across all repositories
- JIRA, GitHub, and Confluence instances are properly configured and accessible
- Release frequency varies between weekly and monthly cycles
- System will be used internally only with no monetization requirements
- CopilotKit provides all necessary chat interface components and streaming capabilities
