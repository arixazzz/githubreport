import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Code,
  FileCode,
  GitBranch,
  Globe,
  Info,
  LayoutGrid,
  Library,
  MessageSquare,
  Rocket,
  Terminal,
  Wrench,
} from "lucide-react";

export default function GuideSection() {
  return (
    <div
      id="guide"
      className="container mx-auto py-12 md:py-24 lg:py-32 px-4 max-w-5xl"
    >
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
          <Rocket className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          Next.js 15.x Custom Template
        </h1>
        <p className="text-xl text-muted-foreground">Newus Boilerplate</p>
      </header>

      <div className="mb-10">
        <p className="text-lg">
          Welcome to the <strong>Next.js 15</strong> based project with internal
          customization from the Newus Technology team. This template uses the{" "}
          <code>pr-template-nextjs</code> boilerplate as the main foundation,
          developed to accelerate the development of modern, fast and scalable
          web applications.
        </p>
      </div>

      <Tabs defaultValue="structure" className="mb-10">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="structure">
            <LayoutGrid className="h-4 w-4 mr-2" /> Structure
          </TabsTrigger>
          <TabsTrigger value="tech">
            <Library className="h-4 w-4 mr-2" /> Technologies
          </TabsTrigger>
          <TabsTrigger value="conventions">
            <FileCode className="h-4 w-4 mr-2" /> Conventions
          </TabsTrigger>
          <TabsTrigger value="i18n">
            <Globe className="h-4 w-4 mr-2" /> i18n Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure">
          <Card>
            <CardHeader>
              <CardTitle>Project Structure</CardTitle>
              <CardDescription>
                Organization of files and directories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                {`
src/
├── __tests__/                    # Unit Testing
├── app/                          # Page and Layout
├── assets/                       # Static files (images, fonts)
├── components/                   # Reusable UI components
│   ├── parts/                    # Parts of Component
│   │   └──[folder-name]
│   │        │──api.ts
│   │        │──interface.d.ts
│   │        └──validation.ts
│   ├── sections/                 # Sections of Component
│   ├── shared/                   # Global component
│   └── ui/                       # Component form ShadCN/UI
├── constants/                    # Constants value or objects
├── hooks/                        # Custom React hooks
├── libs/                         # Helper functions and constants
├── services/                     # API calls and external services
│   └── api/
│       └── fetcher.ts
├── store/                        # State management
└── types/                        # Global TypeScript type definitions`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tech">
          <Card>
            <CardHeader>
              <CardTitle>Technologies and Libraries</CardTitle>
              <CardDescription>
                Core technologies used in this template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Rocket className="h-4 w-4 text-primary" />
                  </div>
                  <span>
                    <strong>Framework:</strong> Next.js (App Router / Pages
                    Router)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <span>
                    <strong>Styling:</strong> Tailwind CSS + Custom Theme
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  <span>
                    <strong>State Management:</strong> React Context / Zustand
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <span>
                    <strong>Form Handling:</strong> React Hook Form + Zod
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Terminal className="h-4 w-4 text-primary" />
                  </div>
                  <span>
                    <strong>HTTP Client:</strong> fetch with custom fetching
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Wrench className="h-4 w-4 text-primary" />
                  </div>
                  <span>
                    <strong>UI Component:</strong> shadcn/ui (Headless UI +
                    Radix UI)
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conventions">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="commit">
              <AccordionTrigger>Commit Message Guidelines</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Follow these conventions for clear and meaningful commit
                  messages:
                </p>
                <p className="mb-2">
                  <strong>Format:</strong> type(scope): description
                </p>
                <p className="mb-2">
                  <strong>Types:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>feat: new feature</li>
                  <li>fix: bug fix</li>
                  <li>docs: documentation changes</li>
                  <li>style: formatting, missing semicolons, etc.</li>
                  <li>refactor: code restructuring</li>
                  <li>test: adding tests</li>
                  <li>chore: maintenance tasks</li>
                </ul>
                <p className="mt-2">
                  Example:{" "}
                  <code>feat(auth): implement OAuth2 login system</code>
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="naming">
              <AccordionTrigger>Naming Conventions</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Components</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        Use PascalCase for component files and names:{" "}
                        <code>UserProfile.tsx</code>
                      </li>
                      <li>Use .tsx extension for TypeScript components</li>
                      <li>Keep one component per file</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Files and Folders</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        Use kebab-case for folders: <code>user-profile/</code>
                      </li>
                      <li>
                        Use camelCase for utility files:{" "}
                        <code>formatDate.ts</code>
                      </li>
                      <li>Use index.ts for barrel exports</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">
                      Variables & Functions
                    </h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        Use camelCase for variables and functions:{" "}
                        <code>userData</code>, <code>fetchUserData()</code>
                      </li>
                      <li>
                        Use UPPER_CASE for constants and environment variables:{" "}
                        <code>API_URL</code>, <code>MAX_LIMIT</code>
                      </li>
                      <li>
                        Boolean variables must be preceded by a verb:{" "}
                        <code>isLoading</code>, <code>hasError</code>,{" "}
                        <code>shouldFetch</code>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="version">
              <AccordionTrigger>Version Control</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create feature branches from the dev branch</li>
                  <li>
                    <p className="mb-1">
                      <strong>Branch naming conventions:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <code>feature/add-payment-gateway</code> - for new
                        features
                      </li>
                      <li>
                        <code>fix/login-validation</code> - for bug fixes
                      </li>
                      <li>
                        <code>hotfix/security-patch</code> - for urgent fixes
                      </li>
                      <li>
                        <code>refactor/auth-module</code> - for code refactoring
                      </li>
                      <li>
                        <code>docs/api-documentation</code> - for documentation
                        updates
                      </li>
                      <li>
                        <code>test/user-authentication</code> - for test-related
                        changes
                      </li>
                    </ul>
                  </li>
                  <li>
                    Always include ticket number if available:{" "}
                    <code>feature/ABC-123-user-profile</code>
                  </li>
                  <li>
                    Use hyphens to separate words:{" "}
                    <code>feature/add-google-analytics</code> not{" "}
                    <code>feature/addGoogleAnalytics</code>
                  </li>
                  <li>Regularly pull from the dev branch</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="i18n">
          <Card>
            <CardHeader>
              <CardTitle>Multi Language Support (i18n)</CardTitle>
              <CardDescription>Optional & Flexible</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p>
                  This project is ready to support multiple languages using{" "}
                  <a
                    href="https://next-intl-docs.vercel.app/"
                    className="text-primary underline"
                  >
                    next-intl
                  </a>
                  , but it is <strong>optional</strong>. You{" "}
                  <strong>
                    do not need to change any folder or file structure
                  </strong>{" "}
                  if you do not want to use this feature.
                </p>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Default Behavior (No Multi Language)
                  </h3>
                  <p>
                    By default, this project uses <strong>English</strong> and
                    will run normally without the <code>/id</code> prefix in the
                    URL.
                  </p>
                  <p className="mt-2">
                    <strong>Example:</strong>
                  </p>
                  <ul className="list-disc pl-6">
                    <li>
                      <code>/login</code> → Bahasa Indonesia
                    </li>
                    <li>No need for manual routing</li>
                    <li>No need for any setup</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Enable Multi Language (Indonesian + English)
                  </h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      <p>
                        Open <code>.env</code> file and change or ensure the
                        following environment variables:
                      </p>
                      <pre className="bg-muted p-2 rounded-md mt-1">
                        NEXT_PUBLIC_I18N_ENABLED=true
                      </pre>
                    </li>
                    <li>
                      <p>Restart the project:</p>
                      <pre className="bg-muted p-2 rounded-md mt-1">
                        pnpm dev
                      </pre>
                    </li>
                    <li>
                      <p>The URL will change to use the language prefix:</p>
                      <div className="overflow-x-auto mt-1">
                        <table className="min-w-full divide-y divide-border">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left">Language</th>
                              <th className="px-4 py-2 text-left">URL</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            <tr>
                              <td className="px-4 py-2">Indonesian</td>
                              <td className="px-4 py-2">
                                <code>/id/login</code>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2">English</td>
                              <td className="px-4 py-2">
                                <code>/en/login</code>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Terminal className="mr-2 h-6 w-6" /> How to Run a Project
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                1. Repository Clone
              </h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                git clone git@github.com:NewusTech/maincore-fe.git
              </pre>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm mt-4">
                # or git
                <br />
                clone https://github.com/NewusTech/maincore-fe.git cd nama-repo
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                2. Dependency Install
              </h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                pnpm install
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                3. Make File `.env`
              </h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                cp .env.example .env
              </pre>
              <p className="mt-2">
                Fill in the configuration according to your environment.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                4. Running in Local
              </h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                pnpm dev
              </pre>
              <p className="mt-2">
                Access your application on:{" "}
                <a
                  href="http://localhost:3000"
                  className="text-primary underline"
                >
                  http://localhost:3000
                </a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <GitBranch className="mr-2 h-6 w-6" /> Credits & Contact
          </h2>
          <Card>
            <CardContent className="pt-6">
              <p className="mb-4 flex flex-col">
                This template is setup by newus teams :{" "}
                <ul className="list-disc ml-4 mt-1 space-y-1">
                  <li>
                    <a
                      href="https://github.com/aldngrha/"
                      className="text-primary underline"
                    >
                      @aldngrha
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/sakatimuna7/"
                      className="text-primary underline"
                    >
                      @sakatimuna7
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/robinta19/"
                      className="text-primary underline"
                    >
                      @robinta19
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/Kaben011201/"
                      className="text-primary underline"
                    >
                      @Kaben011201
                    </a>
                  </li>
                </ul>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">📧 Email:</span>
                  <a
                    href="mailto:newustechnology@gmail.com"
                    className="text-primary"
                  >
                    newustechnology@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">🌐 Website:</span>
                  <a
                    href="https://newus.id/"
                    className="text-primary underline"
                  >
                    newus.id
                  </a>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground italic">
                  Created with ❤️ by Team Newus Teknologi
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
