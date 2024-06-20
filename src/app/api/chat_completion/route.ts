import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    let requestData = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a website analyzer. You will be provided with a URL of a website enclosed in <url> tag. You will have to generate a report based on the given in <structure> tag. In the <structure> tag we are using 'recommendations' too, but those recommendations are only instructions for you and should not be a part of response. Also we are using 'description' in the <structure> tag, we donot need that description in our response, it is for your instructions only. The content under the headings under key elements are just instructions for the response. DONOT write any Summary, just follow the structure given. DONOT use html or any other symbols at the starting or at the end. Remove the heading 'Key Elements' from response. All of your response wil be in html tags. Follow the instructions in the <formatting> tag for the html tag formatting of the response document. 
                          
                    <structure>
                    AI Content X-Ray Report
                    Introduction
                    The AI Content X-Ray tool provides an in-depth analysis of documents or web pages, offering insights and potential improvements across three key areas: Accessibility and Readability, Effectiveness and Sentiment, and Structure.
                    1. Accessibility and Readability
                    Description
                    Accessibility and readability focus on how easily a document can be read and understood by its audience. This dimension assesses the complexity of the language used and the required proficiency level in English.
                    Key Elements
                    - Readability Level: How challenging the text is to read and comprehend.
                    - Language Complexity: The sophistication of the vocabulary and sentence structure.
                    - User Understanding: The level of English proficiency needed for the reader to fully grasp the content.
                    Recommendations
                    - Simplify complex sentences and use common vocabulary to enhance understanding.
                    - Use readability tools to gauge the text's difficulty and adjust accordingly.
                    - Incorporate clear headings and subheadings to guide the reader.
                    2. Effectiveness and Sentiment
                    Description
                    Effectiveness and sentiment measure how persuasive and impactful the document is. This dimension evaluates how well the message is conveyed and the emotional response it elicits from the reader.
                    Key Elements
                    - Persuasiveness: The ability of the document to convince and engage the reader.
                    - Message Clarity: How clearly the main ideas are presented.
                    - Emotional Impact: The use of metaphors and other rhetorical devices to evoke emotions.

                    Recommendations
                    - Strengthen key arguments with evidence and clear examples.
                    - Ensure the message is concise and to the point, avoiding unnecessary jargon.
                    - Use metaphors and analogies effectively to create a stronger emotional connection.
                    3. Structure
                    Description
                    The structure dimension examines the visual and organizational aspects of the document. It focuses on how visuals and layout contribute to readability and comprehension.
                    Key Elements
                    - Visual Aids: The use of images, graphs, and charts to support the text.
                    - Document Layout: The overall organization and flow of the content.
                    - Clarity of Visuals: How well the visual elements aid in understanding the text.
                    Recommendations
                    - Incorporate relevant visuals to break up text and illustrate key points.
                    - Use bullet points and numbered lists for better organization.
                    - Ensure that all visual elements are clear and directly related to the content they support.
                    </structure>

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
        },
        {
          role: "user",
          content: `<url>${requestData.url}/</url>`,
        },
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    return new Response(JSON.stringify({ report: aiResponse }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
