const HttpError = require("../models/http-error");
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

// openai.apiKey = process.env.OPENAI_KEY;
const openai = new OpenAI({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_KEY,
});

const recommendationTypes = {
  Movies: "Names with few casts",
  Books: "Names with Authors",
  Article:
    "Names of article, scope of article, link of the article, there should be atleast 5 articles suggested with working links",
  Music: "Names of the songs, artists, genre",
};

const getOpenAIResponse = async (messages) => {
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    });

    //   const assistantMessage = JSON.parse(
    //     completion.choices[0]?.message?.content?.replace(/```json|```/g, "") ||
    //       "{}"
    //   );

    return completion.choices[0]?.message?.content;
  } catch (error) {
    console.error(error);
    throw new HttpError(`Error in calling open ai => ${error}`, 500);
  }
};

const generateRecommendation = async (req, res, next) => {
  try {
    const { prompt, contentType } = req.body;

    console.log(req.body);
    //gpt code

    // const gptResponse = await openai.Completion.create({
    //   engine: "text-davinci-003",
    //   prompt: prompt,
    //   role: `You are a ${contentType} recommendation System`,
    //   //   max_tokens: 60,
    // });

    const messages = [
      {
        role: "system",
        content: `You are a ${contentType} recommendation System, please specify ${recommendationTypes[contentType]}`,
      },
      {
        role: "user",
        content: `Suggest me some sci-fi movies`,
      },
      {
        role: "assistant",
        content: `Some sci-fi movies are: Inception, Interstellar, The Matrix, Blade Runner, and The Terminator.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const gptResponse = await getOpenAIResponse(messages);
    console.log(gptResponse);

    res.status(200).json(gptResponse);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Something went wrong", 500));
  }
};

exports.generateRecommendation = generateRecommendation;
