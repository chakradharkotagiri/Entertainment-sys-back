const HttpError = require("../models/http-error");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const recommendationTypes = {
  Movies: "Names with few casts",
  Books: "Names with Authors",
  Article:
    "Names of article, scope of article, link of the article, there should be at least 5 articles suggested with working links",
  Music: "Names of the songs, artists, genre",
};

const getGeminiResponse = async (messages) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Use your model version

    // Convert messages into plain text conversation format
    const formattedPrompt = messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n");

    const result = await model.generateContent(formattedPrompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error(error);
    throw new HttpError(`Error in calling Gemini API => ${error}`, 500);
  }
};

const generateRecommendation = async (req, res, next) => {
  try {
    const { prompt, contentType } = req.body;
    console.log(req.body);

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

    const geminiResponse = await getGeminiResponse(messages);
    console.log(geminiResponse);

    res.status(200).json(geminiResponse);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Something went wrong", 500));
  }
};

exports.generateRecommendation = generateRecommendation;
