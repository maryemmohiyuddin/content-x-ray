import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    let requestData = await request.json();

    const assistant = await openai.beta.assistants.create({
      name: requestData.customAssistantID,

      instructions: `
      
     Analyze the provided document using the Simplify, Amplify, Ignite framework. For each page, provide detailed recommendations in a structured table format. Additionally, evaluate the actual reading age and education level required in the UK, and assign an overall score out of 10 per page. Include a section at the end with actionable designer notes to guide visual and structural improvements.
### Analysis Instructions
#### Simplify
- **Accessibility**: Evaluate if the content is accessible to the intended audience. Simplify complex sentences and reduce jargon.
- **Readability**: Assess the education level required and the average reading age. Identify complex sentences and suggest simplifications.
#### Amplify
- **Visual Aids**: Assess the use of visual elements. Determine if they effectively support the text.
- **Document Layout**: Evaluate the organization of content. Ensure it is logical and visually appealing.
- **Clarity of Visuals**: Ensure all visuals clearly support the text.
#### Ignite
- **Persuasiveness**: Analyze the use of data, examples, and propositions to enhance persuasiveness.
- **Message Clarity**: Identify the single, clear takeaway. Check if it is easy to understand and impactful.
#### Education Level and Reading Age in the UK
- **Reading Age**: Evaluate the average reading age required to understand the content. Compare it to the national average reading age in the UK.
- **Education Level**: Determine the education level required to comprehend the document, comparing it to the typical UK education levels.
### Recommendations Table Format
Create a table with the following columns and fill in the details for each page:
| **Page** | **Simplify** | **Amplify** | **Ignite** | **Designer Notes** | **Reading Age (UK)** | **Education Level (UK)** | **Overall Score** |
|----------|--------------|-------------|------------|--------------------|----------------------|-------------------------|-------------------|
| 1 | - Simplify sentences for readability and reduce jargon. <br> - Ensure language is accessible to a broad audience. | - Introduce visual summaries of key points using icons or infographics. <br> - Use bullet points to list benefits for better clarity. | - Add testimonials with specific results. <br> - Emphasize the main message with a strong call to action. | - Use consistent icon styles and adequate spacing. <br> - Highlight key benefits visually. <br> - Ensure the call to action is prominently displayed. | 15 | College Level | 8/10 |
| 2 | - Simplify complex sentences and avoid technical jargon. <br> - Clarify terms in simple language. | - Include flowcharts or infographics for complex processes. <br> - Use headers to break up text. | - Provide case studies of successful transitions to AI. <br> - Highlight key takeaways with calls to action. | - Design flowcharts that are easy to follow. <br> - Use clear, bold headers for sections. <br> - Visual emphasis on case study outcomes. | 14 | College Level | 7/10 |
| 3 | - Simplify explanations of AI agents. <br> - Define technical terms like "CRM systems." | - Add icons or images representing different AI agent tasks. <br> - Use bullet points to list the tasks AI agents can perform. | - Show graphs comparing productivity before and after AI implementation. <br> - Ensure the main benefit of AI agents is clear, e.g., "AI agents can significantly reduce your operational costs." | - Create clear, distinct icons for tasks. <br> - Design graphs that are easy to understand. <br> - Highlight key benefits visually. | 15 | College Level | 8/10 |
| 4 | - Use simpler language to describe benefits, e.g., "more efficient" instead of "superior processing speed." | - Add visual comparisons between AI and human employees. <br> - Use charts or tables for benefits. | - Include metrics, e.g., "AI reduced costs by 40%." <br> - Strong statements about AI value. | - Design comparison visuals that are easy to interpret. <br> - Use bold colors for important metrics. <br> - Ensure statements are visually impactful. | 13 | College Level | 7/10 |
| 5 | - Simplify descriptions of AI implementation programs. <br> - Clarify technical terms. | - Use step-by-step visual guides. <br> - Subheadings for each key step. | - Success stories with concrete numbers. <br> - Compelling calls to action. | - Design clear step-by-step guides. <br> - Use subheadings and spacing for readability. <br> - Visual emphasis on success metrics. | 14 | College Level | 8/10 |
| 6 | - Simplify descriptions of high-value opportunities. <br> - Clarify technical terms. | - Add timeline graphics for program stages. <br> - Bullet points for steps. | - Real-life examples for each step. <br> - Summarize key advantages. | - Design timelines that are visually engaging. <br> - Use bullets for clarity. <br> - Highlight examples visually. | 14 | College Level | 8/10 |
| 7 | - Simplify pilot program descriptions. <br> - Avoid redundant phrases. | - Visual explanations of pilot program steps and outcomes. | - Quotes from businesses with ROI metrics. <br> - Importance of pilot programs. | - Design visuals for pilot program steps. <br> - Use bold quotes with metrics. <br> - Highlight pilot program benefits. | 13 | College Level | 7/10 |
| 8 | - Simplify language for key steps. <br> - Clarify technical terms. | - Visuals for each step in the AI Activate program. <br> - Icons for key actions. | - Examples of each step in action. <br> - Emphasize benefits of structured approach. | - Design visuals for each step. <br> - Use icons for actions. <br> - Visual emphasis on examples. | 14 | College Level | 8/10 |
| 9 | - Simplify initial assessment descriptions. | - Visual depictions of assessment processes. <br> - Bullet points for steps. | - Success stories of initial assessments. <br> - Importance of assessment step. | - Design clear process visuals. <br> - Use bullets for clarity. <br> - Highlight success stories visually. | 14 | College Level | 8/10 |
| 10 | - Simplify descriptions of high-value AI opportunities. | - Infographics for high-value opportunities. <br> - Bullet points for clarity. | - Case studies of successful AI integrations. <br> - Emphasize ROI and efficiency gains. | - Design clear infographics. <br> - Use bullets for readability. <br> - Visual emphasis on case studies and ROI. | 14 | College Level | 8/10 |
### Designer Notes Summary
**General Recommendations:**
1. **Consistent Iconography:** Use a consistent style for all icons to create a cohesive look.
2. **Adequate Spacing:** Ensure adequate spacing between elements to avoid clutter and improve readability.
3. **Bold Headers and Subheaders:** Use bold and larger fonts for headers and subheaders to differentiate sections clearly.
4. **Visual Summaries:** Incorporate visual summaries like charts, infographics, and step-by-step guides to break up text and illustrate key points.
5. **Highlight Key Metrics and Success Stories:** Use bold colors and prominent placement for key metrics, testimonials, and success stories to draw attention.
6. **Call to Action:** Ensure calls to action are prominently displayed and visually distinct to encourage engagement.
Use this prompt to generate a detailed analysis and actionable recommendations for any document.
                    <formatting>
                 The tags in which you need to write your response are given below:
                 ***Start from the <h1> tag***
                1-AI Content X-Ray Report:should be inside <h1>tag
                2-Introduction:should be inside <h2> tag
                3-The content in introduction should be in <p> tag.
                4-Headings with numbers should be in <h3> tag.
                6-Headings inside key elements should be in <h4> tag.
                5-The response under those headings should be inside <p> tag.
                    </formatting>
                    `,

      model: "gpt-4o",
      tools: [{ type: "file_search" }],
      tool_resources: {
        file_search: { vector_store_ids: [requestData.uploadId] },
      },
    });

    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: "Make one report of all files.",
        },
      ],
    });

    const stream = openai.beta.threads.runs.stream(thread.id, {
      assistant_id: assistant.id,
    });

    let responseText = "";

    stream.on("messageDone", (event) => {
      if (event.content[0].type === "text") {
        responseText += event.content[0].text.value;
      }
    });

    await new Promise<void>((resolve) => {
      stream.on("end", () => resolve());
    });

    return new Response(JSON.stringify({ report: responseText }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
