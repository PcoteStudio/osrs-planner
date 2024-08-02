import { NightwatchCustomAssertions, NightwatchCustomCommands } from 'OSRS Planner/Frontend/nightwatch/nightwatch';

declare module 'OSRS Planner/Frontend/nightwatch/nightwatch' {
  interface NightwatchCustomAssertions {
    // Add your custom assertions' types here
    // elementHasCount: (selector: string, count: number) => NightwatchBrowser
  }

  interface NightwatchCustomCommands {
    // Add your custom commands' types here
    // strictClick: (selector: string) => NightwatchBrowser
  }
}
