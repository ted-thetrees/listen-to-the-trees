import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "bavUKtmnfN9o4yBhPipLvj",
      token: "XNmnjKq1ITWhfBpq6Z0QEUM1o6vhMpSqO1XnMU3rQJjfzN1D37K2lRSCT8DT6apodOzLohvdqpOvO3GA",
    },
  ],

  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: true,
});
