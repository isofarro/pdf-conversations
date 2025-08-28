# PDF Conversations

Upload a PDF (max size 10Mb) and then ask questions of the LLM (currently gpt-4o-mini) about it gpt-4o-mini.

Just a proof of concept, and an excuse to play with the OpenAI API.

![PDF Conversation](/public/pdf-conversation.png)

---

## Install and run

1. Run `yarn` to install the dependencies
2. Copy `.env` to `.env.development`
3. Edit `.env.development` setting the `VITE_OPENAI_API_KEY` with your OpenAI API Key (sign up at https://auth.openai.com/log-in to get an API key)
4. `yarn dev` and open browser at `http://localhost:5173/`
