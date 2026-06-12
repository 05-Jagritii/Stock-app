import { getNews } from "../actions/finnhub.actions";
import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";



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

export const sendDailyNewsSummary = inngest.createFunction(
  {
    id: "daily-news-summary",
    triggers: [
      {
        event: "app/send.daily.news",
      },
      {
        cron: "30 3 * * *",
      },
    ],
  },

  async ({ step }) => {
    // #1 Get all users
    const users = await step.run(
      "get-all-users",
      getAllUsersForNewsEmail
    );

    if (!users || users.length === 0) {
      return {
        success: false,
        message: "No users found for news email",
      };
    }

    // #2 Fetch personalized news

    type UserForNewsEmail = {
  id: string;
  email: string;
  name: string;
};

    const results = await step.run(
      "fetch-user-news",
      async () => {
        const perUser: Array<{
          user: UserForNewsEmail;
          articles: MarketNewsArticle[];
        }> = [];

        for (const user of users as UserForNewsEmail[]) {
          try {
            const symbols = await getWatchlistSymbolsByEmail(
              user.email
            );

            let articles = await getNews(symbols);

            articles = (articles || []).slice(0, 6);

            if (!articles.length) {
              articles = await getNews();
              articles = (articles || []).slice(0, 6);
            }

            perUser.push({
              user,
              articles,
            });
          } catch (error) {
            console.error(
              "daily-news: error preparing user news",
              user.email,
              error
            );

            perUser.push({
              user,
              articles: [],
            });
          }
        }

        return perUser;
      }
    );

    // #3 Generate AI summaries
    // const userNewsSummaries: {
    //   user: UserForNewsEmail;
    //   newsContent: string | null;
    // }[] = [];

    // for (const { user, articles } of results) {
    //   try {
    //     const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
    //       "{{newsData}}",
    //       JSON.stringify(articles, null, 2)
    //     );

    //     const response = await step.ai.infer(
    //       `summarize-news-${user.email}`,
    //       {
    //         model: step.ai.models.gemini({
    //           model: "gemini-2.5-flash",
    //         }),
    //         body: {
    //           contents: [
    //             {
    //               role: "user",
    //               parts: [{ text: prompt }],
    //             },
    //           ],
    //         },
    //       }
    //     );

    //     const part =
    //       response.candidates?.[0]?.content?.parts?.[0];

    //     const newsContent =
    //       part && "text" in part
    //         ? part.text
    //         : null;

    //     userNewsSummaries.push({
    //       user,
    //       newsContent,
    //     });
    //   } catch (error) {
    //     console.error(
    //       "Failed to summarize news for:",
    //       user.email,
    //       error
    //     );

    //     userNewsSummaries.push({
    //       user,
    //       newsContent: null,
    //     });
    //   }
    // }

    // #3 : Create news content without AI
const userNewsSummaries: {
  user: UserForNewsEmail;
  newsContent: string | null;
}[] = [];

for (const { user, articles } of results) {
  try {
    const newsContent = articles.length
      ? articles
          .map(
            (article) => `
              <div style="margin-bottom:20px;">
                <h3>${article.headline}</h3>
                <p>${article.summary || ""}</p>
                <a href="${article.url}" target="_blank">
                  Read Full Article
                </a>
              </div>
            `
          )
          .join("")
      : "<p>No market news available today.</p>";

    userNewsSummaries.push({
      user,
      newsContent,
    });
  } catch (error) {
    console.error(
      "Failed to prepare news for:",
      user.email,
      error
    );

    userNewsSummaries.push({
      user,
      newsContent: null,
    });
  }
}

    // #4 Send emails
    await step.run("send-news-emails", async () => {
      await Promise.all(
        userNewsSummaries.map(
          async ({ user, newsContent }) => {
            if (!newsContent) return;

            return await sendNewsSummaryEmail({
              email: user.email,
              date: new Date().toLocaleDateString(),
              newsContent,
            });
          }
        )
      );
    });

    return {
      success: true,
      message:
        "Daily news summary emails sent successfully",
    };
  }
);