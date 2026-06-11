import { sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";

type UserCreatedEvent = {
    email: string,
    name: string,
  country: string;
  investmentGoals: string;
  riskTolerance: string;
  preferredIndustry: string;
};

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email" ,
   triggers: [
      {
        event: "app/user.created",
      },
    ],
  },
  async ({ event, step }) => {

    
    const data = event.data as UserCreatedEvent;

    const userProfile = `
- Country: ${data.country}
- Investment goals: ${data.investmentGoals}
- Risk tolerance: ${data.riskTolerance}
- Preferred industry: ${data.preferredIndustry}
`;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile
    );

    const response = await step.ai.infer(
      "generate-welcome-intro",
      {
        model: step.ai.models.gemini({
          model: "gemini-2.5-flash-lite",
        }),
        body: {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        },
      }
    );

    const part = response.candidates?.[0]?.content?.parts?.[0];

    const introText =
      part && "text" in part
        ? part.text
        : "Thanks for joining Signalist!";

    await step.run("send-welcome-email", async () => {
      return await sendWelcomeEmail({
        email: data.email,
        name: data.name,
        intro: introText,
      });
    });


    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  }
);