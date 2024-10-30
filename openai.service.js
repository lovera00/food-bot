const { Configuration,ChatCompletionRequestMessageRoleEnum,ChatCompletionResponseMessageRoleEnum,CreateImageRequestResponseFormatEnum,CreateImageRequestSizeEnum,OpenAIApi,OpenAIApiAxiosParamCreator,OpenAIApiFactory,OpenAIApiFp } = require('openai');
const axios = require('axios');

const handlerOpenAI = async (text) => {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const resp = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: text,
        },
        {
          role: ChatCompletionRequestMessageRoleEnum.Assistant,
          content: "Resume este texto: "+text+"  Responde solo el mensaje",
        },
      ],
    });
    return resp.data.choices[0].message.content;
  };

module.exports = { handlerOpenAI};