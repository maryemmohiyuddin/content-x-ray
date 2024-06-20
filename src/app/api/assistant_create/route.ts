import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    let requestData = await request.json();

    const assistant = await openai.beta.assistants.create({
      name: requestData.customAssistantID,
      instructions: `You are a file analyzer. You will be provided with different files in the vector store. You will have to read every file and generate one altogether report based on the given content in <structure> tag. In the <structure> tag we are using 'recommendations' too, but those recommendations are only instructions for you and should not be a part of response. Also we are using 'description' in the <structure> tag, we donot need that description in our response, it is for your instructions only. The content under the headings under key elements are just instructions for the response. DONOT write any Summary, just follow the structure given. DONOT use html or any other symbols at the starting or at the end. Remove the heading 'Key Elements' from response. All of your response wil be in html tags. Follow the instructions in the <formatting> tag for the html tag formatting of the response document.
      
                    <structure>
                    AI Content X-Ray Report
                    Introduction
                    The AI Content X-Ray tool provides an in-depth analysis of documents or web pages, offering insights and potential improvements across three key areas: Accessibility and Readability, Effectiveness and Sentiment, and Structure.
                    1. Accessibility and Readability

                    Document Name
                    What are the file names of documents being analyzed?

                    Description
                    Accessibility and readability focus on how easily a document can be read and understood by its audience. This dimension assesses the complexity of the language used and the required proficiency level in English.
                    Key Elements
                    - Readability Level: Tell that how challenging the text is to read and comprehend?
                    - Language Complexity: What is the sophistication of the vocabulary and sentence structure?
                    - User Understanding: What is the level of English proficiency needed for the reader to fully grasp the content?
                    Recommendations
                    - Simplify complex sentences and use common vocabulary to enhance understanding.
                    - Use readability tools to gauge the text's difficulty and adjust accordingly.
                    - Incorporate clear headings and subheadings to guide the reader.
                    2. Effectiveness and Sentiment
                    Description
                    Effectiveness and sentiment measure how persuasive and impactful the document is. This dimension evaluates how well the message is conveyed and the emotional response it elicits from the reader.
                    Key Elements
                    - Persuasiveness: What is the ability of the document to convince and engage the reader?
                    - Message Clarity: Tell me how clearly the main ideas are presented?
                    - Emotional Impact: How much is the use of metaphors and other rhetorical devices to evoke emotions?

                    Recommendations
                    - Strengthen key arguments with evidence and clear examples.
                    - Ensure the message is concise and to the point, avoiding unnecessary jargon.
                    - Use metaphors and analogies effectively to create a stronger emotional connection.
                    3. Structure
                    Description
                    The structure dimension examines the visual and organizational aspects of the document. It focuses on how visuals and layout contribute to readability and comprehension.
                    Key Elements
                    - Visual Aids: How much is the use of images, graphs, and charts to support the text?
                    - Document Layout:What is the overall organization and flow of the content?
                    - Clarity of Visuals: Tell me how well the visual elements aid in understanding the text?
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
                    </formatting>`,
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
